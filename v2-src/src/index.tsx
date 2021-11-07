import ReactDOM from 'react-dom'
import {StaticRouter} from 'react-router-dom'

// import 'supergrids.css/src/css/build/SuperGrids.css'
import './index.scss'

import App from './components/App/App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
	/*<React.StrictMode>*/
	<StaticRouter>
		<App/>
	</StaticRouter>
	/*</React.StrictMode>*/,
	document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
