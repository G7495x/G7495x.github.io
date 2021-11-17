import React from 'react'

import './Slide2.scss'
import neArrow from '../../assets/imgs/ne-arrow.svg'
import neArrowO from '../../assets/imgs/ne-arrow-o.svg'
import ScrollItem from '../../utils/components/ScrollItem/ScrollItem'

export default function Slide2(){
	return (
		<ScrollItem id="Slide2" className="row gap-y-20">
			<img src={neArrow} alt="" className="pos-abs fit-t-10 fit-r-10" style={{width: 80,opacity: .1}}/>
			<img src={neArrowO} alt="" className="ne-arrow-o pos-abs fit-t-20 fit-r-20" style={{width: 140,opacity: .1}}/>
			<div className="vertical-divider f-vert f-center">
				<div className="vc f-flex-1 mt-20"/>
				<div className="dot" style={{opacity: .1}}/>
				<div className="mt-20 mb-10 b900 h5 vertical-text">02</div>
			</div>
			<div className="col f-vert">
				<h2 className="b900" style={{lineHeight: 1.125}}>Links</h2>
				<div className="h7 text-muted">+ Resources</div>
				<div className="f-grow"/>
				<div className="links mb-m10 row gap-y-16 f-vert">
					<span className="link outline">
						<a href="mailto://G7495x@gmail.com" target="_blank" className="fa fa-envelope"/>
						<span><span className="h7 text-muted hide" style={{userSelect: 'none'}}>Email: </span>G7495x<span className="h7 text-muted">@gmail.com</span></span>
					</span>
					<a className="link outline" href="https://linkedin.com/in/G7495x" target="_blank">
						<i className="fa fa-linkedin"/>
						<span>LinkedIn<span className="h7 text-muted">.com/in/G7495x</span></span>
					</a>
					<a className="link outline" href="https://behance.net/G7495x" target="_blank">
						<i className="fa fa-behance"/>
						<span>Behance<span className="h7 text-muted">.net/G7495x</span></span>
					</a>
					<a className="link outline" href="https://Github.com/G7495x" target="_blank">
						<i className="fa fa-github"/>
						<span>Github<span className="h7 text-muted">.com/G7495x</span></span>
					</a>
					<a className="link outline" href="https://drive.google.com/file/d/1pWrv8tEhCGWyxy6kV5PFbPl1AM_iVEaB/view" target="_blank">
						<i className="bi bi-file-pdf-fill"/>
						<span>Resume <span className="h7 text-muted">(Google Drive)</span></span>
					</a>
					{/* Twitter */}
					{/* Instagram */}
					{/* Pinterest? */}
					{/* DeviantArt */}
					{/* ArtStation */}
					{/* Vimeo */}
					{/* SketchFab? */}

					{/* CodePen */}
					{/* CodeSandbox */}
					{/* NPM */}
				</div>
			</div>
		</ScrollItem>
	)
}
