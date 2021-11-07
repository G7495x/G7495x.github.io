import useLocal from './useLocal'

// TODO-FUTURE: Comparator function

/**
 * Returns a memoized object if passed object has same values from previous render (shallow compare).
 * Especially useful while sending props object to pure / memoized components.
 * `useMemoObjectDebug` prints changes.
 */
function useMemoObject<Type extends Object>(obj:Type){
	const oldObj=useLocal() as Type
	const newObj=useLocal() as Type

	let changed=false
	for(let i in obj){
		newObj[i]=obj[i]
		oldObj[i]!==obj[i] && (changed=true) && (oldObj[i]=obj[i])
	}
	return changed?{...newObj}:newObj
}

/**
 * Returns a memoized object if passed object has same values from previous render (shallow compare).
 * Especially useful while sending props object to pure / memoized components.
 * `useMemoObjectDebug` prints changes.
 */
export function useMemoObjectDebug<Type extends Object>(obj:Type){
	const oldObj=useLocal() as Type
	const newObj=useLocal() as Type

	const changed=[]
	const oldVals=[]
	const newVals=[]
	for(let i in obj){
		newObj[i]=obj[i]
		if(oldObj[i]!==obj[i]){
			changed.push(i)
			oldVals.push(oldObj[i])
			newVals.push(obj[i])
			oldObj[i]=obj[i]
		}
	}
	if(changed.length){
		console.log('useMemoObjectDebug: Changed',changed,oldVals,newVals)
		return {...newObj}
	}
	return newObj
}

export default useMemoObject
