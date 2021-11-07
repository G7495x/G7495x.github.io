import {forwardRef,useRef} from 'react'
import resizeObserver,{ResizeHandler} from '../dom/globalAutoOnresize'
import usePreEffect from '../hooks/usePreEffect'
import useInstanceId from '../hooks/useInstanceId'
import useLifecycle from '../hooks/useLifecycle'

// TODO-FUTURE: JSX dot notation .div

export interface SizeDivProps{
	type?:keyof JSX.IntrinsicElements // TODO-FUTURE: Component stackoverflow.com/questions/31815633/what-does-the-error-jsx-element-type-does-not-have-any-construct-or-call
	onResize:ResizeHandler
}

export default forwardRef<any,SizeDivProps>(function SizeDiv(
	{type:Type='div',onResize,...props},
	ref,
){
	const resizeHandlerName=useInstanceId()
	usePreEffect([onResize],addResizeHandler)
	useLifecycle({componentWillUnmount})

	const localRef=useRef(null)
	ref=ref??localRef

	// @ts-expect-error TS2590
	return <Type {...props} data-onresize={resizeHandlerName} {...{ref}}/>

	function addResizeHandler(){ resizeObserver.addHandler(resizeHandlerName,onResize,true) }
	function componentWillUnmount(){ resizeObserver.removeHandler(resizeHandlerName) }
})
