import React,{ComponentClass,createElement,FunctionComponent,memo,PropsWithChildren,useContext} from 'react'

import './ScrollItem.scss'
import {ScrollContext} from '../Scroll/Scroll'

export interface ScrollItemProps extends PropsWithChildren<any>{
	type?:keyof JSX.IntrinsicElements|FunctionComponent|ComponentClass<{},any>
	'data-onresize'?:string

}

// TODO: .div JSX Dot notation
export default memo(function ScrollItem({
	type='div', // TODO: Change to itemType
	className,
	'data-onresize':dataOnResize='',
	...props
}:ScrollItemProps){
	const id=useContext(ScrollContext)
	return createElement(type,{
		...props,
		// @ts-expect-error TS2769
		className: 'scroll-item '+(className??''),
		'data-onresize': dataOnResize+' default',
		'data-scroll-container-id': id,
	})
})
