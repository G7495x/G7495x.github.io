import useLocal from './useLocal'

// TODO-FUTURE: Comparator function

/**
 * Returns a memoized array if passed array has same values from previous render (shallow compare).
 * `useMemoArrayDebug` prints changes.
 */
function useMemoArray<Type extends any[]>(array:Type){
	const oldArray=useLocal([]) as Type
	const newArray=useLocal([]) as Type
	
	let changed=false
	for(let i in array){
		newArray[i]=array[i]
		oldArray[i]!==array[i] && (changed=true) && (oldArray[i]=array[i])
	}
	return changed?(newArray.slice() as Type):newArray
}

/**
 * Returns a memoized array if passed array has same values from previous render (shallow compare).
 * `useMemoArrayDebug` prints changes.
 */
export function useMemoArrayDebug<Type extends any[]>(array:Type){
	const oldArray=useLocal([]) as Type
	const newArray=useLocal([]) as Type

	const changed=[]
	const oldVals=[]
	const newVals=[]
	for(let i in array){
		newArray[i]=array[i]
		if(oldArray[i]!==array[i]){
			changed.push(i)
			oldVals.push(oldArray[i])
			newVals.push(array[i])
			oldArray[i]=array[i]
		}
	}
	if(changed.length){
		console.log('useMemoArrayDebug: Changed',changed,oldVals,newVals)
		return newArray.slice() as Type
	}
	return newArray
}

export default useMemoArray
