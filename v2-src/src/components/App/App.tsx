import React,{useMemo,useRef} from 'react'

import './App.scss'
import Scroll from '../../utils/components/Scroll/Scroll'
import Slide1 from '../Slide1/Slide1'
import Slide2 from '../Slide2/Slide2'
import Slide3 from '../Slide3/Slide3'
import useForceUpdate from '../../utils/hooks/useForceUpdate'
import Slide4 from '../Slide4/Slide4'
import useLifecycle from '../../utils/hooks/useLifecycle'
import properOnLoadPromise from '../../utils/dom/properOnLoadPromise'

// export const AppContext=createContext(undefined)

let forceUpdate:Function|undefined
window.setInterval(()=>forceUpdate?.(),2000)

export default function App(){
	// forceUpdate=useForceUpdate()
	// console.log('App Render')

	useLifecycle({componentDidMount})
	const ref=useRef<any>()
	const scrollContentRef=useRef<any>()
	return (
		// <AppContext.Provider value={{}}>
		<div id="App" className={ref.current?.className} {...{ref}}>
			<Scroll className="pos-abs fit-0 scroll-x smooth-wheel" ref={scrollContentRef}>{useMemo(()=>
				<div className="scroll-content-wrapper f-horz">
					<Slide1/>
					<Slide2/>
					<Slide3/>
					<Slide4/>
					{/*<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>*/}
					{/*<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)',transform: 'translateZ(-.5px) scale(1.5)'}} alt=""/>*/}
					{/*<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>*/}
				</div>
			,[])}</Scroll>
		</div>
		// </AppContext.Provider>
	)

	async function componentDidMount(){
		await properOnLoadPromise
		setTimeout(()=>ref.current.classList.add('loaded'),1000)
		// ref.current.addEventListener('animationend',()=>window.globalAutoResizeObserver.trigger(scrollContentRef.current))
	}
}

