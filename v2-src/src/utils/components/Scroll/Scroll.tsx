import React,{forwardRef,MutableRefObject,PropsWithoutRef,useRef} from 'react'
import {clamp} from 'lodash'
import {Handler,useDrag} from '@use-gesture/react'
import {easing} from 'ts-easing'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import useLifecycle from '../../hooks/useLifecycle'
import globalAutoResizeObserver,{ResizeHandler} from '../../dom/globalAutoResizeObserver'

// TODO: CSS easing?, step size
// TODO: scroll animation acceleration
// TODO: scroll step acceleration
// TODO: Smooth drag
// TODO-FUTURE: memo() stackoverflow.com/questions/60669528/how-to-use-react-memo-with-a-component-contains-children

export type ScrollElement=HTMLElement&{
	scrollTopStart:number
	deltaX:number
	scrollTopTarget:number

	scrollLeftStart:number
	deltaY:number
	scrollLeftTarget:number

	wheelXDuration:number
	wheelXEndTimestamp:number

	wheelYDuration:number
	wheelYEndTimestamp:number

	animatingX?:boolean
	animatingY?:boolean
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
	const scrollViewport=target.parentElement.parentElement.children[0]
	delete scrollViewport.animatingX // Stop smooth scroll
	scrollXOptions.left=delta[0]*scrollViewport.scrollWidth/scrollViewport.clientWidth
	scrollViewport.scrollBy(scrollXOptions)
}

// High-frequency function
function scrollbarYDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0]
	delete scrollViewport.animatingY // Stop smooth scroll
	scrollYOptions.top=delta[1]*scrollViewport.scrollHeight/scrollViewport.clientHeight
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
	scrollViewport.scrollTopStart=scrollViewport.scrollTopTarget=scrollViewport.scrollTop
	scrollViewport.scrollLeftStart=scrollViewport.scrollLeftTarget=scrollViewport.scrollLeft

	scrollViewport.deltaX=0
	scrollViewport.deltaY=0

	scrollViewport.wheelXDuration=scrollViewport.wheelYDuration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')*1000
	scrollViewport.wheelXEndTimestamp=scrollViewport.wheelYEndTimestamp=Date.now()
}

function wheel(e:React.WheelEvent<HTMLElement>){
	let {deltaX,deltaY}=e
	const scrollViewport=e.currentTarget as ScrollElement
	
	const {classList}=scrollViewport.parentElement! // scrollContainer.classList
	const scrollX=classList.contains('scroll-x')
	const scrollY=classList.contains('scroll-y')
	const smooth=classList.contains('smooth-scroll')
	
	const {clientWidth,clientHeight,scrollWidth,scrollHeight}=scrollViewport
	
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
		if(scrollX && deltaX){
			scrollViewport.scrollLeftStart=scrollViewport.scrollLeft
			scrollViewport.scrollLeftTarget=clamp(scrollViewport.scrollLeftTarget+deltaX,0,scrollWidth-clientWidth)
			scrollViewport.deltaX=scrollViewport.scrollLeftTarget-scrollViewport.scrollLeftStart

			if(scrollViewport.deltaX){ // Prevents no scroll situations & multiple animation calls
				scrollViewport.wheelXDuration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')*1000
				scrollViewport.wheelXEndTimestamp=scrollViewport.wheelXDuration+Date.now()
				if(!scrollViewport.animatingX){
					scrollViewport.animatingX=true // Start animation loop
					smoothScrollXStep(scrollViewport)
				}
			}
		}
		if(scrollY && deltaY){
			scrollViewport.scrollTopStart=scrollViewport.scrollTop
			scrollViewport.scrollTopTarget=clamp(scrollViewport.scrollTopTarget+deltaY,0,scrollHeight-clientHeight)
			scrollViewport.deltaY=scrollViewport.scrollTopTarget-scrollViewport.scrollTopStart

			if(scrollViewport.deltaY){ // Prevents no scroll situations & multiple animation calls
				scrollViewport.wheelYDuration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')*1000
				scrollViewport.wheelYEndTimestamp=scrollViewport.wheelYDuration+Date.now()
				if(!scrollViewport.animatingY){
					scrollViewport.animatingY=true // Start animation loop
					smoothScrollYStep(scrollViewport)
				}
			}
		}
	}
}

// High-frequency function
function smoothScrollXStep(e:ScrollElement){
	if(!e.animatingX) return
	let phase=1-clamp((e.wheelXEndTimestamp-Date.now())/e.wheelXDuration,0,1)
	phase=easing.outQuart(phase)
	e.scrollTo({
		// @ts-expect-error TS2322
		behavior: 'instant',
		left: e.scrollLeftStart+phase*e.deltaX,
	})
	if(phase<1) window.requestAnimationFrame(()=>smoothScrollXStep(e))
	else delete e.animatingX
}

// High-frequency function
function smoothScrollYStep(e:ScrollElement){
	if(!e.animatingY) return
	let phase=1-clamp((e.wheelYEndTimestamp-Date.now())/e.wheelYDuration,0,1)
	phase=easing.outQuart(phase)
	e.scrollTo({
		// @ts-expect-error TS2322
		behavior: 'instant',
		top: e.scrollTopStart+phase*e.deltaY,
	})
	if(phase<1) window.requestAnimationFrame(()=>smoothScrollYStep(e))
	else delete e.animatingY
}