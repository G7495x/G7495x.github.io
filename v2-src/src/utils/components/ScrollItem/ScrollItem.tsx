import React,{ComponentClass,createElement,FunctionComponent,memo,PropsWithChildren,useContext} from 'react'

import './ScrollItem.scss'
import useMemoObject from '../../hooks/useMemoObject'
import {ScrollContext} from '../Scroll/Scroll'

export interface ScrollItemProps extends PropsWithChildren<any>{
	type?:keyof JSX.IntrinsicElements|FunctionComponent|ComponentClass<{},any>
	'data-onresize'?:string
}

export default memo(function ScrollItem({
	type='div',
	className,
	...props
}:ScrollItemProps){
	const id=useContext(ScrollContext)
	// @ts-ignore
	return createElement(type,useMemoObject({
		...props,
		'data-onresize':'default '+(props['data-onresize']??''),
		className: 'scroll-item '+(className??''),
		'data-scroll-id': id,
	}))
})