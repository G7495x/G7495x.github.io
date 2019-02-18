const piBy180=Math.PI/180
const twoPi=Math.PI*2
const piByTwo=Math.PI/2

const rendererEle=document.getElementById('signature')
const renderer=new THREE.WebGLRenderer({
	canvas:                rendererEle,
	alpha:                 true,
	antialias:             true,
	preserveDrawingBuffer: true,
})
renderer.setSize(600,600)
renderer.setPixelRatio(window.devicePixelRatio)

window.addEventListener('resize',()=>{
	renderer.setPixelRatio(window.devicePixelRatio)
},true)

const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera(45,600/600,.01,1000)
camera.position.set(0,0,10)
camera.lookAt(0,0,0)

const pointLight=new THREE.PointLight(0xffffff)
pointLight.position.set(10,10,10)
scene.add(pointLight)

const ambientLight=new THREE.AmbientLight(0xffffff,.75)
scene.add(ambientLight)

const material=new THREE.MeshStandardMaterial({color: 0xffffff})

let obj
const objLoader=new THREE.OBJLoader()
objLoader.load(
	'../objs/g7495x.obj',
	(o)=>{
		obj=o
		obj.children[0].scale.set(.001,.001,.001)
		obj.children[0].position.set(-1.500,-1.500,0)
		obj.children[0].material=material
		scene.add(obj)

		then=start=new Date().getTime()/1000
		animate()
	},
	(xhr)=>  { console.log('G7495x - '+(xhr.loaded/xhr.total*100)+'% loaded') },
	(error)=>{ console.error('G7495x - Error!\n',error) },
)

let start
let then
const animate=()=>{
	const now=new Date().getTime()/1000
	const time=now-start

	if(time<5){
		const z=1-Math.pow(time/5,.25)
		const s=1-z*z
		obj.rotation.z=z
		obj.scale.set(s,s,s)
	}else{
		obj.rotation.z=0
		obj.scale.set(1,1,1)

		const r=time%10
		if(r<=5){
			const s=Math.sin(piByTwo*(r/5))
			obj.rotation.y=-twoPi*s*s
		}else{ obj.rotation.y=0 }
	}

	renderer.render(scene,camera)
	requestAnimationFrame(animate)
}
