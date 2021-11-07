import useLocal from './useLocal'

export type PreEffectCallback=(deps?: any[],prevDeps?: any[],changed?: any[])=>any

/**
 * Similar to `useEffect`, but executes before render.
 * `usePreEffect` helps you avoid `setState` in some non-async cases, hence reducing renders.
 * Avoid `setState` inside non-async `usePreEffect` as the component is already about to render, set `local.state=value` via `useLocal` instead.
 * `usePreEffectDebug` prints changes.
 */
function usePreEffect(deps:any[],effect:PreEffectCallback){
	const oldDeps=useLocal([])
	const prevDeps=[...oldDeps]
	const changed:any[]=[]

	let didChange=false
	for(let i in deps)
		(changed[i]=oldDeps[i]!==deps[i]) && (didChange=true) && (oldDeps[i]=deps[i])
	didChange && effect(deps,prevDeps,changed)
}

/**
 * Similar to `useEffect`, but executes before render.
 * `usePreEffect` helps you avoid `setState` in some non-async cases, hence reducing renders.
 * Avoid `setState` inside non-async `usePreEffect` as the component is already about to render, set `local.state=value` via `useLocal` instead.
 * `usePreEffectDebug` prints changes.
 */
export function usePreEffectDebug(deps:any[],effect?:PreEffectCallback){
	const oldDeps=useLocal([])
	const prevDeps=[...oldDeps]
	const changed:any[]=[]

	const changedIndexes=[]
	const oldVals=[]
	const newVals=[]
	for(let i in deps)
		if(changed[i]=(oldDeps[i]!==deps[i])){ // eslint-disable-line no-cond-assign
			changedIndexes.push(i)
			oldVals.push(oldDeps[i])
			newVals.push(deps[i])
			oldDeps[i]=deps[i]
		}
	if(changedIndexes.length){
		effect?.(deps,prevDeps,changed)
		console.log(`usePreEffectDebug: Changed`,changedIndexes,oldVals,newVals)
	}
}

export default usePreEffect