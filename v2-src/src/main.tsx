import React from 'react'
import ReactDOM from 'react-dom'
import {StaticRouter} from 'react-router-dom'

import './index.scss'
import App from './components/App/App'

window.onload=function(){
	document.body.classList.add('loaded')
}

ReactDOM.render(
	/*<React.StrictMode>*/
	<StaticRouter>
		<App/>
	</StaticRouter>
	/*</React.StrictMode>*/,
	document.getElementById('root'),
)
