import {forwardRef,useRef} from 'react'
import _ from 'lodash'

import './Scroll.scss'
import useLocal from '../../hooks/useLocal'
import SizeDiv from '../SizeDiv'
import useLifecycle from '../../hooks/useLifecycle'

// TODO: tsx
// TODO: scrollbar drag gesture
// TODO-FUTURE: memo() stackoverflow.com/questions/60669528/how-to-use-react-memo-with-a-component-contains-children

export default forwardRef(function Scroll({
	className,
	children,
	scrollX,
	scrollY,
	smooth=true,
	onScroll: propsOnScroll,
	onWheel: propsOnWheel,
	...props},
	ref,
){
	const localRef=useRef(null)
	ref=ref??localRef // TODO-FUTURE: use nullish assignment operator (??=) when supported

	const local=useLocal()
	useLifecycle({componentDidMount})

	// const style=useLocal()
	const style={}
	style.overflowX=(scrollX?'scroll':'hidden')
	style.overflowY=(scrollY?'scroll':'hidden')
	return (
		<div {...props} className={'scroll-container '+(smooth?'scroll-container-smooth ':'')+(className??'')} {...{ref}}>
			<SizeDiv onResize={scrollViewportResize} className="scroll-viewport" {...{onScroll,onWheel,style}}>
				{
					smooth?
					<div className="scroll-smooth-window-wrapper"><div className="scroll-smooth-window">
						<SizeDiv onResize={scrollContentWrapperResize} className="scroll-content-wrapper">
							{children}
						</SizeDiv>
					</div></div>:
					<SizeDiv onResize={scrollContentWrapperResize} className="scroll-content-wrapper">
						{children}
					</SizeDiv>
				}
			</SizeDiv>
			{scrollX?<div className="scroll-bar scroll-bar-x"><div className="scroll-bar-thumb scroll-bar-thumb-x"/></div>:undefined}
			{scrollY?<div className="scroll-bar scroll-bar-y"><div className="scroll-bar-thumb scroll-bar-thumb-y"/></div>:undefined}
		</div>
	)

	function componentDidMount(){
		local.scrollContainer=ref.current
		local.scrollViewport=local.scrollContainer.children[0]
		local.scrollContentWrapper=local.scrollViewport.children[0]

		local.scrollViewport.dispatchEvent(new CustomEvent('scroll'))
	}

	function onScroll(e){
		const {style}=local.scrollContainer // scrollContainer.style
		const {scrollTop,scrollLeft}=local.scrollViewport
		style.setProperty("--scrollTop",scrollTop)
		style.setProperty("--scrollLeft",scrollLeft)
		propsOnScroll?.(e) // onScroll event forwarding
	}

	function onWheel(e){
		if(scrollX && !scrollY && e.deltaX===0){
			const {scrollViewport}=local
			// scrollViewport.scrollLeft+=e.deltaY

			// smooth scroll support
			if(!scrollViewport.scrollLeftTarget) scrollViewport.scrollLeftTarget=scrollViewport.scrollLeft
			scrollViewport.scrollLeftTarget+=e.deltaY
			scrollViewport.scrollLeftTarget=_.clamp(scrollViewport.scrollLeftTarget,0,scrollViewport.scrollWidth-scrollViewport.clientWidth)
			scrollViewport.scrollLeft=scrollViewport.scrollLeftTarget
		}
		propsOnWheel?.(e) // onWheel event forwarding
	}

	function scrollViewportResize({target: scrollViewport}){
		const {style}=scrollViewport.parentElement // scrollContainer
		const scrollContentWrapper=scrollViewport.querySelector('.scroll-content-wrapper')
		style.setProperty("--clientWidth",scrollViewport.clientWidth)
		style.setProperty("--clientHeight",scrollViewport.clientHeight)
		style.setProperty("--scrollWidth",scrollContentWrapper.offsetWidth)
		style.setProperty("--scrollHeight",scrollContentWrapper.offsetHeight)
	}

	function scrollContentWrapperResize({target: scrollContentWrapper}){
		const {style}=scrollContentWrapper.closest('.scroll-container')
		style.setProperty("--scrollWidth",scrollContentWrapper.offsetWidth)
		style.setProperty("--scrollHeight",scrollContentWrapper.offsetHeight)
	}
})
