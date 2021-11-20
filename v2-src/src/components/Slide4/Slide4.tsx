import React from 'react'

import './Slide4.scss'
import data from '../../data/data'
import ScrollItem from '../../utils/components/ScrollItem/ScrollItem'

export default function Slide4(){
	return (
		<div id="Slide4" className="row">
			<div className="vertical-divider f-vert f-center">
				<div className="vc f-flex-1 mt-20"/>
				<div className="dot" style={{opacity: .1}}/>
				<div className="mt-20 mb-10 b900 h5 vertical-text">04</div>
			</div>
			<div className="col slide-left">
				<div className="row f-vert gap-y-30 pr-30" style={{height: '100%'}}>
					<ScrollItem className="slide-left pos-sty fit-l-0 ml-m30 pl-30 mr-auto">
						<div className="h7 text-muted">Some of,</div>
						<h2 className="b900" style={{lineHeight: 1.125}}>My Works</h2>
					</ScrollItem>
					<div className="samples-content f-grow f-vert f-justify-center of-hidden" data-onresize="default">
						<div className="row gap-x-15 f-center" data-onresize="default">
							{data.map((e,i)=><ScrollItem type={'a'} href={e.url} target="_blank" className="slide-left-xtra item-wrapper" key={e.url}>
								<h1 className="b900 pos-abs">{String(i+1).padStart(2,'0')}</h1>
								<img src={e.thumbnail}/>
								<div className="pos-abs fit-x-30 title h7 py-5 b700 one-line">{e.title}</div>
								<ScrollItem className="fa fa-behance pos-abs super-center"/>
							</ScrollItem>)}
							<hr className="pos-abs fit-x-m15" style={{transform: 'translateY(calc(var(--clientHeight) * -1px + 1px))'}}/>
							<hr className="pos-abs fit-x-m15"/>
							<hr className="pos-abs fit-x-m15" style={{transform: 'translateY(calc(var(--clientHeight) * 1px - 1px))'}}/>
						</div>
					</div>
				</div>
				{/*<div className="h7 text-muted">(Still uploading the rest...)</div>*/}
			</div>
		</div>
	)
}