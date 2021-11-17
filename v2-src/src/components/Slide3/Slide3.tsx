import React from 'react'

import './Slide3.scss'
import Scroll from '../../utils/components/Scroll/Scroll'
import ScrollItem from '../../utils/components/ScrollItem/ScrollItem'

export default function Slide3(){
	return (
		<ScrollItem id="Slide3" className="row gap-y-20">
			<div className="vertical-divider f-vert f-center">
				<div className="vc f-flex-1 mt-20"/>
				<div className="dot" style={{opacity: .1}}/>
				<div className="mt-20 mb-10 b900 h5 vertical-text">03</div>
			</div>
			<div className="col f-vert">
				<div className="f-grow text-muted mb-20 pos-rel" style={{fontSize: 15}}>
					<Scroll className="pos-abs fit-0 scroll-y">
						I am a master's degree graduate, from the Centre for Digital Media, Vancouver, Canada. I completed my bachelor's in Computer Science and Engineering, in 2017. As a professional, I have experience designing + developing user-interfaces for apps of different form factors. Apart from that, I have been involved with UI/UX design - specifically interaction & visual design, branding & visual identity design, illustration, 3D graphics, etc. I have had the opportunity to work across a diverse set of fields & domains and I remain hopeful this trend continues...
						<br/><br/>
						I enjoy being challenged & solving problems. I try my very best to be a resourceful individual, and an amiable figure. I have always been fascinated with technology, and it is this passion that led me to pursue a career in this field. I love experimenting and building proof-of-concepts, and as someone with both creative & technical expertise, I ensure that my works exhibit high precision and maximum attention to detail.
					</Scroll>
				</div>
				<div className="text-right">
					<div className="h7 text-muted">A little,</div>
					<h2 className="b900" style={{lineHeight: 1.125}}>About Me</h2>
				</div>
			</div>
		</ScrollItem>
	)
}