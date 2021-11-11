import React,{forwardRef,MutableRefObject,PropsWithoutRef,useRef} from 'react'
import {clamp} from 'lodash'
import {Handler,useDrag} from '@use-gesture/react'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import useLifecycle from '../../hooks/useLifecycle'
import globalAutoResizeObserver from '../../dom/globalAutoResizeObserver'

// TODO: CSS step multiplier
// TODO: scroll step acceleration
// TODO: Smooth drag
// TODO-FUTURE: memo() stackoverflow.com/questions/60669528/how-to-use-react-memo-with-a-component-contains-children

export type ScrollElement=HTMLElement&{
	scrollTopTarget:number
	scrollLeftTarget:number

	deltaX:number
	deltaY:number

	wheelXTimestamp:number
	wheelYTimestamp:number

	smoothScrollXBase:number
	smoothScrollYBase:number

	animatingX:boolean
	animatingY:boolean
}

export default forwardRef<any,PropsWithoutRef<any>>(function Scroll({
	className,
	children,
	onScroll,
	onWheel,
	...props},
	ref,
){
	const localRef=useRef<HTMLElement>(null)
	ref??=localRef

	const local=useLocal()
	useLifecycle({componentDidMount})
	return (
		<div {...props} className={'scroll-container '+(className??'')} {...{ref}}>
			<div className="scroll-viewport" {...{onScroll,onWheel}} data-onresize="scrollViewportResize">
				<div className="scroll-content-wrapper" data-onresize="scrollContentWrapperResize">{children}</div>
			</div>
			<div className="scroll-bar scroll-bar-x">
				<div className="scroll-bar-thumb scroll-bar-thumb-x" {...useDrag(scrollbarXDrag as Handler<'drag'>)()}/>
			</div>
			<div className="scroll-bar scroll-bar-y">
				<div className="scroll-bar-thumb scroll-bar-thumb-y" {...useDrag(scrollbarYDrag as Handler<'drag'>)()}/>
			</div>
		</div>
	)

	function componentDidMount(){
		local.scrollContainer=(ref as MutableRefObject<null>).current
		local.scrollViewport=local.scrollContainer.children[0]
		local.scrollContentWrapper=local.scrollViewport.children[0]

		local.scrollViewport.addEventListener('wheel',wheel,{passive: false})
		local.scrollViewport.addEventListener('scroll',scroll)

		wheelInit(local.scrollViewport)
		local.scrollViewport.dispatchEvent(new CustomEvent('scroll')) // init
	}
})

const scrollXOptions={left: 0,behavior: 'instant'}
const scrollYOptions={top: 0,behavior: 'instant'}

// High-frequency function
globalAutoResizeObserver.addHandler('scrollViewportResize',function(entry:ResizeObserverEntry){
	const scrollViewport=entry.target as HTMLElement
	const scrollContentWrapper=scrollViewport.children[0] as HTMLElement
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty("--clientWidth",String(scrollViewport.clientWidth))
	style.setProperty("--clientHeight",String(scrollViewport.clientHeight))
	style.setProperty("--scrollWidth",String(scrollContentWrapper.offsetWidth))
	style.setProperty("--scrollHeight",String(scrollContentWrapper.offsetHeight))
})

// High-frequency function
globalAutoResizeObserver.addHandler('scrollContentWrapperResize',function(entry:ResizeObserverEntry){
	const scrollContentWrapper=entry.target as HTMLElement
	const {style}=scrollContentWrapper.parentElement!.parentElement! // scrollContainer.style
	style.setProperty("--scrollWidth",String(scrollContentWrapper.offsetWidth))
	style.setProperty("--scrollHeight",String(scrollContentWrapper.offsetHeight))
})

// High-frequency function
function scrollbarXDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollViewport.animatingX=false // Stop smooth scroll
	scrollViewport.deltaX=0         // Stop smooth scroll
	scrollViewport.scrollLeftTarget=scrollXOptions.left=delta[0]*scrollViewport.scrollWidth/scrollViewport.clientWidth
	// @ts-expect-error TS2322
	scrollViewport.scrollBy(scrollXOptions)
}

// High-frequency function
function scrollbarYDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollViewport.animatingY=false // Stop smooth scroll
	scrollViewport.deltaY=0         // Stop smooth scroll
	scrollViewport.scrollTopTarget=scrollYOptions.top=delta[1]*scrollViewport.scrollHeight/scrollViewport.clientHeight
	// @ts-expect-error TS2322
	scrollViewport.scrollBy(scrollYOptions)
}

// High-frequency function
function scroll(e:React.UIEvent<HTMLElement>){
	const scrollViewport=e.target as HTMLElement
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	const {scrollTop,scrollLeft}=scrollViewport
	style.setProperty("--scrollTop",String(scrollTop))
	style.setProperty("--scrollLeft",String(scrollLeft))
}

function wheelInit(scrollViewport:ScrollElement){
	scrollViewport.scrollTopTarget=scrollViewport.scrollTop
	scrollViewport.scrollLeftTarget=scrollViewport.scrollLeft
	scrollViewport.wheelXTimestamp=scrollViewport.wheelYTimestamp=Date.now()
	scrollViewport.deltaX=scrollViewport.deltaY=0
	scrollViewport.animatingX=scrollViewport.animatingY=false
}

function wheel(e:React.WheelEvent<HTMLElement>){
	let {deltaX,deltaY}=e
	const scrollViewport=e.currentTarget as ScrollElement
	
	const {classList}=scrollViewport.parentElement! // scrollContainer.classList
	const scrollX=classList.contains('scroll-x')
	const scrollY=classList.contains('scroll-y')
	const smooth=classList.contains('smooth-scroll')
	
	const {clientWidth,scrollWidth}=scrollViewport
	
	// Horizontal scrolling support for mouse wheel
	if(scrollX && !scrollY && deltaX===0){
		deltaX=deltaY
		deltaY=0

		if(!smooth){ // Smooth scrolling handled below
			// scrollViewport.scrollLeft+=e.deltaX
			// Browser smooth scroll support
			scrollViewport.scrollLeftTarget=clamp(scrollViewport.scrollLeftTarget+deltaX,0,scrollWidth-clientWidth)
			scrollViewport.scrollLeft=scrollViewport.scrollLeftTarget
		}
	}

	// Smooth scrolling
	if(smooth){
		e.preventDefault()
		scrollX && smoothScrollXStart(scrollViewport,deltaX)
		scrollY && smoothScrollYStart(scrollViewport,deltaY)
	}
}

function smoothScrollXStart(e:ScrollElement,deltaX:number){
	if(!deltaX) return // Prevents no scroll situations
	e.scrollLeftTarget=clamp(e.scrollLeftTarget+deltaX,0,e.scrollWidth-e.clientWidth)
	e.deltaX=e.scrollLeftTarget-e.scrollLeft
	e.smoothScrollXBase=getBase(e.deltaX,+getComputedStyle(e).getPropertyValue('--smoothScrollDuration'))
	if(!e.animatingX){ // Prevents multiple animation calls
		e.animatingX=true
		e.wheelXTimestamp=Date.now()
		smoothScrollXStep(e)
	}
}

function smoothScrollYStart(e:ScrollElement,deltaY:number){
	if(!deltaY) return // Prevents no scroll situations
	e.scrollTopTarget=clamp(e.scrollTopTarget+deltaY,0,e.scrollHeight-e.clientHeight)
	e.deltaY=e.scrollTopTarget-e.scrollTop
	e.smoothScrollYBase=getBase(e.deltaY,+getComputedStyle(e).getPropertyValue('--smoothScrollDuration'))
	if(!e.animatingY){ // Prevents multiple animation calls
		e.animatingY=true
		e.wheelYTimestamp=Date.now()
		smoothScrollYStep(e)
	}
}

function getBase(delta:number,duration:number){ return Math.exp(Math.log(0.1/Math.abs(delta))/(60*duration)) }

// High-frequency function
function smoothScrollXStep(e:ScrollElement){
	if(!e.animatingX) return
	e.deltaX*=Math.pow(e.smoothScrollXBase,(Date.now()-e.wheelXTimestamp)/(1000/60))
	e.wheelXTimestamp=Date.now()
	scrollXOptions.left=e.scrollLeftTarget-e.deltaX
	// @ts-expect-error TS2322
	e.scrollTo(scrollXOptions)
	if(Math.abs(e.deltaX)>.1) requestAnimationFrame(()=>smoothScrollXStep(e))
	else e.animatingX=false
}

// High-frequency function
function smoothScrollYStep(e:ScrollElement){
	if(!e.animatingY) return
	e.deltaY*=Math.pow(e.smoothScrollYBase,(Date.now()-e.wheelYTimestamp)/(1000/60))
	e.wheelYTimestamp=Date.now()
	scrollYOptions.top=e.scrollTopTarget-e.deltaY
	// @ts-expect-error TS2322
	e.scrollTo(scrollYOptions)
	if(Math.abs(e.deltaY)>.1) requestAnimationFrame(()=>smoothScrollYStep(e))
	else e.animatingY=false
}