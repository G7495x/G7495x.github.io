import React,{forwardRef,MutableRefObject,PropsWithoutRef,useRef} from 'react'
import {clamp} from 'lodash'
import {useGesture} from '@use-gesture/react'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import useLifecycle from '../../hooks/useLifecycle'
import globalAutoResizeObserver from '../../dom/globalAutoResizeObserver'

// TODO: speed & accl css variables
// TODO: CSS step multiplier
// TODO: scroll step acceleration?
// TODO-FUTURE: Scroll snapping support
// TODO-FUTURE: memo() stackoverflow.com/questions/60669528/how-to-use-react-memo-with-a-component-contains-children

export type ScrollElement=HTMLElement&{
	scrollTopTarget:number
	scrollLeftTarget:number

	smooth:boolean // used in smoothScroll (default parameter). Updated onWheel and onScrollbarDrag
	duration:number // used in smoothScroll (default parameter). Updated onWheel and onScrollbarDrag

	deltaX:number // Used only in smoothScroll
	deltaY:number // Used only in smoothScroll

	wheelXTimestamp:number // Used in smoothScroll
	wheelYTimestamp:number // Used in smoothScroll

	smoothScrollXBase:number // Used in smoothScroll (Exponential ease base value)
	smoothScrollYBase:number // Used in smoothScroll (Exponential ease base value)

	animatingX:boolean // Indicates if smoothScroll animation loop is active
	animatingY:boolean // Indicates if smoothScroll animation loop is active
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
				<div className="scroll-bar-thumb scroll-bar-thumb-x" {...useGesture(useLocal({onDragStart: scrollbarDragStart,onDrag: scrollbarXDrag}))()}/>
			</div>
			<div className="scroll-bar scroll-bar-y">
				<div className="scroll-bar-thumb scroll-bar-thumb-y" {...useGesture(useLocal({onDragStart: scrollbarDragStart,onDrag: scrollbarYDrag}))()}/>
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
	const scrollViewport=entry.target
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty("--clientWidth",String(scrollViewport.clientWidth))
	style.setProperty("--clientHeight",String(scrollViewport.clientHeight))
	style.setProperty("--scrollWidth",String(scrollViewport.scrollWidth))
	style.setProperty("--scrollHeight",String(scrollViewport.scrollHeight))
})

// High-frequency function
globalAutoResizeObserver.addHandler('scrollContentWrapperResize',function(entry:ResizeObserverEntry){
	const scrollViewport=entry.target.parentElement!
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty("--scrollWidth",String(scrollViewport.scrollWidth))
	style.setProperty("--scrollHeight",String(scrollViewport.scrollHeight))
})

function scrollbarDragStart({target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollViewport.smooth=scrollViewport.parentElement!.classList.contains('smooth-scroll')
	scrollViewport.duration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')
}

// High-frequency function
function scrollbarXDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollXOptions.left=delta[0]*scrollViewport.scrollWidth/scrollViewport.clientWidth
	scrollViewport.smooth?
		smoothScrollXTo(scrollViewport,scrollXOptions.left):
		// @ts-expect-error TS2322
		scrollViewport.scrollBy(scrollXOptions)
}

// High-frequency function
function scrollbarYDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollYOptions.top=delta[1]*scrollViewport.scrollHeight/scrollViewport.clientHeight
	scrollViewport.smooth?
		smoothScrollYTo(scrollViewport,scrollYOptions.top):
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
	scrollViewport.smooth=scrollViewport.parentElement!.classList.contains('smooth-scroll')
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
	scrollViewport.smooth=smooth
	if(smooth){
		e.preventDefault()
		scrollViewport.duration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')
		scrollX && smoothScrollXTo(scrollViewport,deltaX)
		scrollY && smoothScrollYTo(scrollViewport,deltaY)
	}
}

export function smoothScrollXTo(e:ScrollElement,deltaX:number,duration:number=e.duration){
	if(!deltaX) return // Prevents no scroll situations
	e.scrollLeftTarget=clamp(e.scrollLeftTarget+deltaX,0,e.scrollWidth-e.clientWidth)
	e.deltaX=e.scrollLeftTarget-e.scrollLeft
	e.smoothScrollXBase=getBase(e.deltaX,duration)
	if(!e.animatingX){ // Prevents multiple animation calls
		e.animatingX=true
		e.wheelXTimestamp=Date.now()
		smoothScrollXStep(e)
	}
}

export function smoothScrollYTo(e:ScrollElement,deltaY:number,duration:number=e.duration){
	if(!deltaY) return // Prevents no scroll situations
	e.scrollTopTarget=clamp(e.scrollTopTarget+deltaY,0,e.scrollHeight-e.clientHeight)
	e.deltaY=e.scrollTopTarget-e.scrollTop
	e.smoothScrollYBase=getBase(e.deltaY,duration)
	if(!e.animatingY){ // Prevents multiple animation calls
		e.animatingY=true
		e.wheelYTimestamp=Date.now()
		smoothScrollYStep(e)
	}
}

export function smoothScrollXHalt(e:ScrollElement){
	e.scrollLeftTarget=scrollXOptions.left
	e.deltaX=0
	e.animatingX=false
}

export function smoothScrollYHalt(e:ScrollElement){
	e.scrollTopTarget=scrollYOptions.top
	e.deltaY=0
	e.animatingY=false
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