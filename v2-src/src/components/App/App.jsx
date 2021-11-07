import {createContext} from 'react'

import './App.scss'
import Scroll from '../../utils/components/Scroll/Scroll'
import useForceUpdate from '../../utils/hooks/useForceUpdate'

export const AppContext=createContext({})

let forceUpdate
window.setInterval(()=>forceUpdate?.(),2000)

export default function App(){
	// forceUpdate=useForceUpdate()
	// console.log('App Render')

	return <AppContext.Provider value={null}>
		<Scroll id="App" scrollX>
			<div className="p-24" style={{top: 0}}>Hello world</div>
			{/*<div style={{width: 3000,height: 2000}}/>*/}
			<img src="https://picsum.photos/3840/2160" alt=""/>
		</Scroll>
	</AppContext.Provider>
}