import React,{useMemo} from 'react'

import './App.scss'
import Scroll from '../../utils/components/Scroll/Scroll'
import Slide1 from '../Slide1/Slide1'
import Slide2 from '../Slide2/Slide2'
import Slide3 from '../Slide3/Slide3'
import useForceUpdate from '../../utils/hooks/useForceUpdate'

// export const AppContext=createContext(undefined)

let forceUpdate:Function|undefined
window.setInterval(()=>forceUpdate?.(),2000)

export default function App(){
	// forceUpdate=useForceUpdate()
	// console.log('App Render')

	// useLifecycle({})
	return (
		// <AppContext.Provider value={{}}>
		<div id="App">
			<Scroll className="pos-abs fit-0 scroll-x smooth-wheel">{useMemo(()=>
					<div className="scroll-viewport f-horz">
						<Slide1/>
						<Slide2/>
						<Slide3/>
						<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>
						<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)',transform: 'translateZ(-.5px) scale(1.5)'}} alt=""/>
						<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>
					</div>
				,[])}
			</Scroll>
		</div>
		// </AppContext.Provider>
	)
}
