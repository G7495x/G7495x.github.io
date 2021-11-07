// TODO-FUTURE: use nullish assignment operator (??=) when supported

// 1. <div data-onresize="handlerName">
// 2. resizeObserver.addHandler('handlerName',e=>console.log('onresize event'))

// Typescript Types -----------------------------------------------------------

export type ResizeHandler=(entry?:ResizeObserverEntry)=>any

export type GlobalAutoOnresize=ResizeObserver&{
	handlers: { [resizeHandlerName:string]: ResizeHandler } // Mutable object
	addHandler: (resizeHandlerName:string,resizeHandler:ResizeHandler,overwrite?:boolean)=>any
	removeHandler: (resizeHandlerName:string)=>any
	mutationObserver: MutationObserver // Watches DOM for elements with `data-onresize` attribute to auto observe / unobserve
	trigger: (target:HTMLElement)=>void
}

declare global{
	interface Window{
		resizeObserver: GlobalAutoOnresize
	}
}


// Main -----------------------------------------------------------------------

if(!window.resizeObserver){ // To prevent multiple initializations
	// Global ResizeObserver. Runs the ResizeHandlers from 'data-onresize' attribute (space separated).
	window.resizeObserver=new ResizeObserver(entries=>{
		for(let entry of entries){
			const target=(entry.target as HTMLElement)
			const {style}=target
			style.setProperty('--contentWidth',String(entry.contentRect.width))
			style.setProperty('--contentHeight',String(entry.contentRect.height))
			style.setProperty('--clientWidth',String(target.clientWidth))
			style.setProperty('--clientHeight',String(target.clientHeight))
			style.setProperty('--offsetWidth',String(target.offsetWidth))
			style.setProperty('--offsetHeight',String(target.offsetHeight))
			target.dataset['onresize']?.split(' ').forEach(resizeHandlerName=>window.resizeObserver.handlers[resizeHandlerName]?.(entry))
		}
	}) as GlobalAutoOnresize

	// Maintains a map of tags:string -> ResizeHandlers. So a ResizeHandler can be accessed via tag.
	window.resizeObserver.handlers={}

	// Add a ResizeHandler.
	// Equivalent to adding keys manually. `window.resizeObserver.handlers[resizeHandlerName]=resizeHandler`
	window.resizeObserver.addHandler=
		((resizeHandlerName,resizeHandler,overwrite=false)=>{
			if(!overwrite && window.resizeObserver.handlers[resizeHandlerName])
				throw new Error(`ResizeHandler with name: '${resizeHandlerName}' already exists. To overwrite, set overwrite flag.`)
			window.resizeObserver.handlers[resizeHandlerName]=resizeHandler
		})

	// Remove a ResizeHandler.
	// Equivalent to removing keys manually. `delete window.resizeObserver.handlers[resizeHandlerName]`
	window.resizeObserver.removeHandler=
		(resizeHandlerName=>delete window.resizeObserver.handlers[resizeHandlerName])

	// Manually trigger onresize on an HTMLElement
	window.resizeObserver.trigger=
		(target=>{ window.resizeObserver.unobserve(target);window.resizeObserver.observe(target) })

	// Watches DOM for elements with `data-onresize` attribute to auto observe / unobserve
	window.resizeObserver.mutationObserver=new MutationObserver(mutationRecords=>{
		for(let mutationRecord of mutationRecords){
			for(let addedNode of mutationRecord.addedNodes){
				if(!(addedNode as Element).querySelectorAll) continue
				const newNodes=(addedNode as Element).querySelectorAll('[data-onresize]')
				for(let newNode of newNodes) window.resizeObserver.observe(newNode)
			}

			for(let removedNode of mutationRecord.removedNodes){
				if(!(removedNode as Element).querySelectorAll) continue
				const deletedNodes=(removedNode as Element).querySelectorAll('[data-onresize]')
				for(let deletedNode of deletedNodes) window.resizeObserver.unobserve(deletedNode)
			}

			// Mutated Nodes
			if(mutationRecord.type==='attributes'){
				const target=mutationRecord.target as HTMLElement
				window.resizeObserver.unobserve(target)
				target.dataset.onresize!==undefined && window.resizeObserver.observe(target)
			}
		}
	})
	window.resizeObserver.mutationObserver.observe(document.body,{
		attributes: true,
		attributeFilter: ['data-onresize'],
		attributeOldValue: true,
		subtree: true,
		childList: true,
	})
}


// Exports --------------------------------------------------------------------

export default window.resizeObserver
