import React,{cloneElement,createContext,forwardRef,Fragment,isValidElement,memo,MutableRefObject,PropsWithoutRef,useRef} from 'react'
import {clamp} from 'lodash'
import {useGesture} from '@use-gesture/react'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import useLifecycle from '../../hooks/useLifecycle'
import globalAutoResizeObserver from '../../dom/globalAutoResizeObserver'
import useUuid from '../../hooks/useUuid'
import usePreEffect from '../../hooks/usePreEffect'

// TODO: Fix smooth-wheel autoscroll jump issue
// TODO: Fix smooth-wheel page-zoom issue
// TODO: Fix smooth-wheel nested scroll issue
// TODO: ScrollItem intersection observer (needed for parallax ScrollItem)
// TODO-FUTURE: wheel css step multiplier
// TODO-FUTURE: wheel css step acceleration
// TODO-FUTURE: wheel css time dilation factor
// TODO-FUTURE: Scroll snapping support
// TODO-FUTURE: Lazy loading support

export interface ScrollElement extends HTMLElement{
	scrollTopTarget:number
	scrollLeftTarget:number

	smooth:boolean // Used in smoothScroll. Updated onWheel and onScrollbarDrag
	duration:number // Used in smoothScroll (default parameter). Updated onWheel and onScrollbarDrag

	deltaX:number // Used only in smoothScroll
	deltaY:number // Used only in smoothScroll

	wheelXTimestamp:number // Used only in smoothScroll
	wheelYTimestamp:number // Used only in smoothScroll

	smoothScrollXDecayFactor:number // Used only in smoothScroll (Exponential ease function)
	smoothScrollYDecayFactor:number // Used only in smoothScroll (Exponential ease function)

	animatingX:boolean // Indicates if smoothScroll animation loop is active
	animatingY:boolean // Indicates if smoothScroll animation loop is active
}

export interface ScrollProps extends PropsWithoutRef<any>{
	onScroll?:React.UIEventHandler<HTMLElement>
	onWheel?:React.WheelEventHandler<HTMLElement>
	viewportProps?:PropsWithoutRef<any>
}

export const ScrollContext=createContext<string>('')

export default memo(forwardRef<any,ScrollProps>(function Scroll({
	className,
	children,
	onScroll,
	onWheel,
	viewportProps={},
	...props},
	ref,
){
	const localRef=useRef<HTMLElement>(null)
	ref??=localRef

	const local=useLocal()
	useLifecycle({componentDidMount})
	usePreEffect(getContentWrapper,[children])

	viewportProps.className='scroll-viewport '+(viewportProps.className??'')
	viewportProps['data-onresize']='scrollViewportResize '+(viewportProps['data-onresize']??'')
	const id=useUuid()
	return (
		<ScrollContext.Provider value={id}>
			<div {...props} className={'scroll-container '+(className??'')} {...{ref}} data-scroll-id={id}>
				<div {...viewportProps} {...{onScroll,onWheel}}>
					{local.children}
				</div>
				<div className="scroll-bar scroll-bar-x">
					<div className="scroll-bar-thumb scroll-bar-thumb-x" {...useGesture(useLocal({onDragStart: scrollbarDragStart,onDrag: scrollbarXDrag}))()}/>
				</div>
				<div className="scroll-bar scroll-bar-y">
					<div className="scroll-bar-thumb scroll-bar-thumb-y" {...useGesture(useLocal({onDragStart: scrollbarDragStart,onDrag: scrollbarYDrag}))()}/>
				</div>
			</div>
		</ScrollContext.Provider>
	)

	function componentDidMount(){
		local.scrollContainer=(ref as MutableRefObject<HTMLElement>).current!
		local.scrollViewport=local.scrollContainer.children[0]
		local.scrollContentWrapper=local.scrollViewport.children[0]

		local.scrollViewport.addEventListener('wheel',wheel,{passive: false})
		local.scrollViewport.addEventListener('scroll',scroll)

		initWheel(local.scrollViewport)
		local.scrollViewport.dispatchEvent(new CustomEvent('scroll')) // init
	}

	function getContentWrapper(){
		local.children=(isValidElement(children) && children.type!==Fragment && children.props.className.startsWith('scroll-content-wrapper'))?
			cloneElement(children,{'data-onresize':'scrollContentResize '+(children.props['data-onresize']??'')})
			:<div className="scroll-content-wrapper" data-onresize="scrollContentResize">{children}</div>
	}
}))

export function initScrollItemOffsets(scrollContainer:HTMLElement){
	const scrollViewport=scrollContainer.children[0]
	const id=scrollContainer.dataset['scrollId']
	const scrollItems=scrollContainer.querySelectorAll(`.scroll-item[data-scroll-container-id="${id}"]`) as unknown as HTMLElement[]
	for(let scrollItem of scrollItems){
		const boundingClientRect=scrollItem.getBoundingClientRect()
		scrollItem.style.setProperty('--scrollItemOffsetTop',String(boundingClientRect.top+scrollViewport.scrollTop))
		scrollItem.style.setProperty('--scrollItemOffsetLeft',String(boundingClientRect.left+scrollViewport.scrollLeft))
	}
}

export function scrollViewportResize(entry:ResizeObserverEntry){
	const scrollViewport=entry.target
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	style.setProperty('--scrollWidth',String(scrollViewport.scrollWidth))
	style.setProperty('--scrollHeight',String(scrollViewport.scrollHeight))
	style.setProperty('--scrollClientWidth',String(scrollViewport.clientWidth))
	style.setProperty('--scrollClientHeight',String(scrollViewport.clientHeight))
}

// Mainly used for scrollbar size
export function scrollContentResize(entry:ResizeObserverEntry){
	const scrollViewport=entry.target.closest('.scroll-viewport')!
	const scrollContainer=scrollViewport.parentElement!
	const {style}=scrollContainer
	style.setProperty('--scrollWidth',String(scrollViewport.scrollWidth))
	style.setProperty('--scrollHeight',String(scrollViewport.scrollHeight))
	initScrollItemOffsets(scrollContainer) // TODO: Check performance, fix calculation
}

// High-frequency function
globalAutoResizeObserver.addHandler('scrollViewportResize',scrollViewportResize)

// High-frequency function
globalAutoResizeObserver.addHandler('scrollContentResize',scrollContentResize)

function scrollbarDragStart({target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollViewport.smooth=scrollViewport.parentElement!.classList.contains('smooth-wheel')
	scrollViewport.duration=+getComputedStyle(scrollViewport).getPropertyValue('--smoothScrollDuration')
}

const scrollXOptions={left: 0,behavior: 'instant'}
const scrollYOptions={top: 0,behavior: 'instant'}

// High-frequency function
function scrollbarXDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollXOptions.left=delta[0]*scrollViewport.scrollWidth/scrollViewport.clientWidth
	scrollViewport.smooth?
		smoothScrollXTo(scrollViewport,scrollXOptions.left):
		// @ts-expect-error TS2345
		scrollViewport.scrollBy(scrollXOptions)
}

// High-frequency function
function scrollbarYDrag({delta,target}:any){
	const scrollViewport=target.parentElement.parentElement.children[0] as ScrollElement
	scrollYOptions.top=delta[1]*scrollViewport.scrollHeight/scrollViewport.clientHeight
	scrollViewport.smooth?
		smoothScrollYTo(scrollViewport,scrollYOptions.top):
		// @ts-expect-error TS2345
		scrollViewport.scrollBy(scrollYOptions)
}

// High-frequency function
function scroll(e:React.UIEvent<HTMLElement>){
	const scrollViewport=e.target as ScrollElement
	const {style}=scrollViewport.parentElement! // scrollContainer.style
	const {scrollTop,scrollLeft}=scrollViewport

	const yVelocity=scrollTop-+style.getPropertyValue('--scrollTop')
	const ySpeed=Math.abs(yVelocity)
	style.setProperty('--scrollYVelocity',String(yVelocity))
	style.setProperty('--scrollYSpeed',String(ySpeed))
	// style.setProperty('--scrollYDirection',String(yVelocity/ySpeed || 1)) // Moved to CSS

	const xVelocity=scrollLeft-+style.getPropertyValue('--scrollLeft')
	const xSpeed=Math.abs(xVelocity)
	style.setProperty('--scrollXVelocity',String(xVelocity))
	style.setProperty('--scrollXSpeed',String(xSpeed))
	// style.setProperty('--scrollXDirection',String(xVelocity/xSpeed || 1)) // Moved to CSS

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

function initWheel(scrollViewport:ScrollElement){
	scrollViewport.scrollTopTarget=scrollViewport.scrollTop
	scrollViewport.scrollLeftTarget=scrollViewport.scrollLeft
	scrollViewport.smooth=scrollViewport.parentElement!.classList.contains('smooth-wheel')
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
	const smooth=classList.contains('smooth-wheel')

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
	e.smoothScrollXDecayFactor=calcDecayFactor(e.deltaX,duration)
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
	e.smoothScrollYDecayFactor=calcDecayFactor(e.deltaY,duration)
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

const deltaTarget=.49 // Exponential decay cutoff value (render loop halt condition).

// Returns decay factor from delta and duration.
// The decay factor is for 60fps.
// For fps correction, use Math.pow(decayFactor,frameDelayInSeconds/(1/60)).
// deltaTarget (=.49) is the delta cutoff in our animation (render loop halt condition).
function calcDecayFactor(delta:number,duration:number,fps:number=60,deltaTarget:number=.49){
	return Math.exp(Math.log(deltaTarget/Math.abs(delta))/(fps*duration))
}

// Do not call directly. Called within smoothScrollXTo only.
// High-frequency function
function smoothScrollXStep(e:ScrollElement){
	if(!e.animatingX) return
	// TODO-FUTURE: Remove FPS correction and get display refresh-rate
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
	// TODO-FUTURE: Remove FPS correction and get display refresh-rate
	e.deltaY*=Math.pow(e.smoothScrollYDecayFactor,(Date.now()-e.wheelYTimestamp)/(1000/60)) // deltaY*=smoothScrollYDecayFactor with fps correction
	e.wheelYTimestamp=Date.now()
	scrollYOptions.top=Math.round(e.scrollTopTarget-e.deltaY) // TODO-FUTURE: Browser fix for fractional scroll values
	// @ts-expect-error TS2322
	e.scrollTo(scrollYOptions)
	if(Math.abs(e.deltaY)>deltaTarget) requestAnimationFrame(()=>smoothScrollYStep(e))
	else e.animatingY=false
}
