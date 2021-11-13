import React,{forwardRef,memo,MutableRefObject,PropsWithoutRef,useRef} from 'react'
import {clamp} from 'lodash'
import {useGesture} from '@use-gesture/react'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import useLifecycle from '../../hooks/useLifecycle'
import globalAutoResizeObserver from '../../dom/globalAutoResizeObserver'

// TODO: CSS wheel step multiplier
// TODO: scroll step acceleration?
// TODO-FUTURE: Scroll snapping support

export type ScrollElement=HTMLElement&{
	scrollTopTarget:number
	scrollLeftTarget:number

	smooth:boolean // Used in smoothScroll. Updated onWheel and onScrollbarDrag
	duration:number // Used in smoothScroll (default parameter). Updated onWheel and onScrollbarDrag

	deltaX:number // Used only in smoothScroll
	deltaY:number // Used only in smoothScroll

	wheelXTimestamp:number // Used in smoothScroll
	wheelYTimestamp:number // Used in smoothScroll

	smoothScrollXDecayFactor:number // Used in smoothScroll (Exponential ease DecayFactor value)
	smoothScrollYDecayFactor:number // Used in smoothScroll (Exponential ease DecayFactor value)

	animatingX:boolean // Indicates if smoothScroll animation loop is active
	animatingY:boolean // Indicates if smoothScroll animation loop is active
}

export default memo(forwardRef<any,PropsWithoutRef<any>>(function Scroll({
	className,
	children,
	onScroll,
	onWheel,
	addContentWrapper=true,
	viewportProps={},
	...props},
	ref,
){
	const localRef=useRef<HTMLElement>(null)
	ref??=localRef

	const local=useLocal()
	useLifecycle({componentDidMount})

	viewportProps.className='scroll-viewport '+(viewportProps.className??'')
	viewportProps['data-onresize']='scrollViewportResize '+(viewportProps['data-onresize']??'')
	return (
		<div {...props} className={'scroll-container '+(className??'')} {...{ref}}>
			<div {...viewportProps} {...{onScroll,onWheel}}>
				{addContentWrapper?<div className="scroll-content-wrapper" data-onresize="scrollContentWrapperResize">{children}</div>:children}
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
}))

const scrollXOptions={left: 0,behavior: 'instant'}
const scrollYOptions={top: 0,behavior: 'instant'}

// High-frequency function
globalAutoResizeObserver.addHandler('scrollViewportResize',function(entry:ResizeObserverEntry){
	const scrollViewport=entry.target
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty('--scrollWidth',String(scrollViewport.scrollWidth))
	style.setProperty('--scrollHeight',String(scrollViewport.scrollHeight))
	style.setProperty('--scrollClientWidth',String(scrollViewport.clientWidth))
	style.setProperty('--scrollClientHeight',String(scrollViewport.clientHeight))
})

// High-frequency function
globalAutoResizeObserver.addHandler('scrollContentWrapperResize',function(entry:ResizeObserverEntry){
	const scrollViewport=entry.target.parentElement!
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty('--scrollWidth',String(scrollViewport.scrollWidth))
	style.setProperty('--scrollHeight',String(scrollViewport.scrollHeight))
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
	const scrollViewport=e.target as ScrollElement
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	const {scrollTop,scrollLeft}=scrollViewport

	const yVelocity=scrollTop-+style.getPropertyValue('--scrollTop')
	style.setProperty('--scrollYVelocity',String(yVelocity))
	style.setProperty('--scrollYSpeed',String(Math.abs(yVelocity)))

	const xVelocity=scrollLeft-+style.getPropertyValue('--scrollLeft')
	style.setProperty('--scrollXVelocity',String(xVelocity))
	style.setProperty('--scrollXSpeed',String(Math.abs(xVelocity)))

	style.setProperty('--scrollTop',String(scrollTop))
	style.setProperty('--scrollLeft',String(scrollLeft))

	setTimeout(()=>scrollEnd(scrollViewport,style,scrollTop,scrollLeft),300 /* Experimentally determined. Boundary scenario: 60hz, devicePixelRatio=1 */)
}

function scrollEnd(e:HTMLElement,style:CSSStyleDeclaration,scrollTop:number,scrollLeft:number){
	if(e.scrollTop===scrollTop){
		style.setProperty('--scrollYVelocity','0')
		style.setProperty('--scrollYSpeed','0')
	}
	if(e.scrollLeft===scrollLeft){
		style.setProperty('--scrollXVelocity','0')
		style.setProperty('--scrollXSpeed','0')
	}
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

const deltaTarget=.49 // Exponential decay final value

export function smoothScrollXTo(e:ScrollElement,deltaX:number,duration:number=e.duration){
	if(!deltaX) return // Prevents no scroll situations
	e.scrollLeftTarget=clamp(e.scrollLeftTarget+deltaX,0,e.scrollWidth-e.clientWidth)
	e.deltaX=e.scrollLeftTarget-e.scrollLeft
	e.smoothScrollXDecayFactor=getDecayFactor(e.deltaX,duration)
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
	e.smoothScrollYDecayFactor=getDecayFactor(e.deltaY,duration)
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

// Returns decay factor from delta and duration.
// The decay factor is for 60fps.
// For fps variation correction, Math.pow(decayFactor,frameDelayInSeconds/(1/60))
// TODO: .49 is the delta cutoff in our animation
function getDecayFactor(delta:number,duration:number,deltaTarget:number=.49){ return Math.exp(Math.log(deltaTarget/Math.abs(delta))/(60*duration)) }

// Do not call directly. Called within smoothScrollXTo only.
// High-frequency function
function smoothScrollXStep(e:ScrollElement){
	if(!e.animatingX) return
	e.deltaX*=Math.pow(e.smoothScrollXDecayFactor,(Date.now()-e.wheelXTimestamp)/(1000/60)) // deltaX*=smoothScrollXDecayFactor with fps correction
	e.wheelXTimestamp=Date.now()
	scrollXOptions.left=Math.round(e.scrollLeftTarget-e.deltaX) // TODO-FUTURE: Browser fix for fractional scroll values
	// @ts-expect-error TS2322
	e.scrollTo(scrollXOptions)
	if(Math.abs(e.deltaX)>deltaTarget) requestAnimationFrame(()=>smoothScrollXStep(e))
	else e.animatingX=false
}

// Do not call directly. Called within smoothScrollYTo only.
// High-frequency function
function smoothScrollYStep(e:ScrollElement){
	if(!e.animatingY) return
	e.deltaY*=Math.pow(e.smoothScrollYDecayFactor,(Date.now()-e.wheelYTimestamp)/(1000/60)) // deltaY*=smoothScrollYDecayFactor with fps correction
	e.wheelYTimestamp=Date.now()
	scrollYOptions.top=Math.round(e.scrollTopTarget-e.deltaY) // TODO-FUTURE: Browser fix for fractional scroll values
	// @ts-expect-error TS2322
	e.scrollTo(scrollYOptions)
	if(Math.abs(e.deltaY)>deltaTarget) requestAnimationFrame(()=>smoothScrollYStep(e))
	else e.animatingY=false
}