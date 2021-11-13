// import {createContext} from 'react'

import './App.scss'
import Scroll from '../../utils/components/Scroll/Scroll'
import useForceUpdate from '../../utils/hooks/useForceUpdate'
import React from 'react'

// export const AppContext=createContext({})

let forceUpdate:Function|undefined
window.setInterval(()=>forceUpdate?.(),2000)

export default function App(){
	// forceUpdate=useForceUpdate()
	// console.log('App Render')

	return (
		// <AppContext.Provider value={{}}>
			<Scroll id="App" className="scroll-x smooth-scroll" addContentWrapper={false}>
				<div className="scroll-content-wrapper row f-nowrap" data-onresize="scrollContentWrapperResize">
					<div className="flex-bl p-48" style={{width: 'calc(var(--scrollClientWidth) * 1px)'}}>
						<h1 className="small-caps">Ghanashyam<br/>Sateesh</h1>
					</div>
					<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>
					<img src="https://picsum.photos/160/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)',transform: 'translateZ(-.5px) scale(1.5)'}} alt=""/>
					<img src="https://picsum.photos/1600/900" style={{height: 'calc(var(--scrollClientHeight) * 1px)'}} alt=""/>
					<div className="flex-bl p-48" style={{width: 'calc(var(--scrollClientWidth) * 1px)'}}>
						<h1 className="small-caps">Ghanashyam<br/>Sateesh</h1>
					</div>
				</div>
			</Scroll>
		// </AppContext.Provider>
	)
}
