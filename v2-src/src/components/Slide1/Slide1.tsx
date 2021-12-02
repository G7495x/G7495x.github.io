import React,{FunctionComponent} from 'react'

import './Slide1.scss'
import icon from '../../assets/imgs/favicon-196x196.png'
import stamp from '../../assets/imgs/stamp.png'
import rightArrow from '../../assets/imgs/right-arrow.svg'

export default (function Slide1(){
	return (
		<div id="Slide1" className="row">
			<div className="vertical-divider f-vert f-center">
				<img src={icon} alt="" className="mt-10 mb-20" style={{width: 25}}/>
				<div className="vc f-flex-1"/>
				<div className="dot" style={{opacity: .1}}/>
				<div className="mt-20 mb-10 b900 h5 vertical-text">01</div>
			</div>
			<div className="col row gap-20">
				<div className="text-section f-vert">
					<div className="top-name my-10 text-muted small-caps"><b>G</b>hanashyam <b>S</b>ateesh</div>
					<div className="f-grow"/>
					<div className="vertical-text mb-10 h6.5">
						<span className="text-muted">
							Hi,<br/>
							I go by Ghanashyam...
						</span>
						<div className="vertical-title b900 pos-rel mr-10">
							G7495x
							<div className="stamp pos-abs super-center"><img src={stamp} alt=""/></div>
						</div>
						<div className="text-muted">
							{/*<i className="fa fa-exclamation-triangle mb-4"/>*/}
							<div>Umm, website still under construction...</div>
						</div>
					</div>
				</div>
				<div className="f-grow f-vert">
					<div className="f-grow flex-tr">
						{/*<div className="h7 text-muted mr-m20 f-vert f-center">*/}
						{/*	<i className="fa fa-exclamation-triangle mb-4"/>*/}
						{/*	<div className="vertical-text">Website still under construction</div>*/}
						{/*	/!*<div className="dot my-8"/>*!/*/}
						{/*	/!*<a href="https://G7495x.github.io/v1" target="blank" className="vertical-text">Old Website</a>*!/*/}
						{/*</div>*/}
					</div>
					<div className="f-center" style={{height: 25}}>
						<hr className="col"/>
						<img src={rightArrow} alt="" className="right-arrow ml-30" style={{height: 15}}/>
					</div>
				</div>
			</div>
		</div>
	)
} as FunctionComponent)
