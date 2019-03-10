// Set page zoom for deviceWidth<1200px
let prevWindowInnerWidth=0
const init=()=>{
	if(prevWindowInnerWidth!=window.innerWidth && window.innerWidth<1200)
		document.querySelector('meta[name="viewport"]').setAttribute('content','width=device-width,initial-scale='+(window.innerWidth/1200))
	else
		document.querySelector('meta[name="viewport"]').setAttribute('content','width=device-width,initial-scale=1.0')
	prevWindowInnerWidth=window.innerWidth
}
init()

// Page Controller
const gotoPage=(ele=document.body,n=0)=>{ ele.style.setProperty('--slide',n) }
const nextPage=(ele=document.body)=>{
	let currentPage=window.getComputedStyle(ele).getPropertyValue('--slide')
	gotoPage(ele,++currentPage)
}
const prevPage=(ele=document.body)=>{
	let currentPage=window.getComputedStyle(ele).getPropertyValue('--slide')
	gotoPage(ele,--currentPage)
}

// Load Pages
const pageData=[
	{
		title: '<b>WebGL</b> Supernova',
		subTitle: 'A procedurally generated GPGPU particle Supernova, right in your browser.',
		images: [
			'imgs/1/1.png',
			'imgs/1/2.png',
			'imgs/1/3.png',
			'imgs/1/4.png',
		],
		description: `
			This project is an interactive real-time demo that was a result of one of my experiments in procedural rendering, done in WebGL. This experiment was achieved by rendering 100,000+ particles in a 4D vector field with curl noise over stacked value noise. This project was done completely programmatically without the use of any tools/engines. The particle effects achieved here are fully GPU accelerated and computations such as positions of the particles, etc. are carried out entirely on the GPU. For this project, I have used Three.js - A Javascript-based wrapper library for WebGL - and this project was done in Javascript and GLSL - The OpenGL compatible shading language.
			<br><br>
			WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D graphics within any compatible modern web browser without the use of plug-ins. WebGL does so by introducing an API that closely conforms to the OpenGL ES 2.0 standard that can be used in HTML5 &lt;canvas&gt; elements.
			<br><br>
			This demo is completely procedurally generated, with the Supernova being unique on every reload. As stated before, it is fully GPU optimized while being cross-platform as well as mobile-compatible. All the effects in this demo have been achieved completely through particle effects, without the use of any post-processing.
			<br><br>
			Demo:	<a href="https://g7495x.github.io/WebGL-Supernova---Three.js/src" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			The code for this project is open-sourced at <a href="https://github.com/G7495x/WebGL-Supernova---Three.js" target="_blank"><i class="fa fa-external-link"></i> Github</a>
		`
	},
	{
		title: '<b>WebGL</b> Proto Star',
		subTitle: 'A procedural Star from particle effects, in your browser.',
		images: [
			'imgs/2/1.png',
			'imgs/2/2.png',
			'imgs/2/3.png',
		],
		description: `
			This is a real-time interactive WebGL demo that procedurally renders a star using particle effects and point simulations. Over 400,000 particles are rendered to create this star. This is a fully animated object that is completely non-repetitive and to achieve the curly fields and the turbulent spirals, I have used 4D curl noise over layered value noise. This is a totally programmatic project, done without any aid from tools/engines. The particle effects achieved here are fully GPU accelerated and computations such as positions of the particles, etc. are carried out entirely on the GPU. For this project, I have used Three.js - A Javascript-based wrapper library for WebGL - and this project was done in Javascript and GLSL - The OpenGL compatible shading language.
			<br><br>
			WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D graphics within any compatible modern web browser without the use of plug-ins. WebGL does so by introducing an API that closely conforms to the OpenGL ES 2.0 standard that can be used in HTML5 &lt;canvas&gt; elements.
			<br><br>
			This demo is fully procedural and is cross-platform as well as mobile compatible. All the effects in this demo have been achieved completely through particle effects, without any post-processing effects.
			<br><br>
			Demo:	<a href="https://g7495x.github.io/WebGL-Proto-Star---Three.js/src" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			The code for this project is open-sourced at <a href="https://github.com/G7495x/WebGL-Proto-Star---Three.js" target="_blank"><i class="fa fa-external-link"></i> Github</a>

		`
	},
	{
		title: '<b>WebGL</b> Particle Flame',
		subTitle: 'A particle flame, done in WebGL.',
		images: [
			'imgs/3/1.png',
			'imgs/3/2.png',
		],
		description: `
			This project was my first attempt at GPGPU in WebGL. In this demo, I am rendering a flame using particle effects. In video games, rendering elements such as fire or smoke or explosions etc. has always been a challenge. Every game maker has resorted to their own technique for achieving said elements. This was my attempt at flames. I achieved this effect by using 4D curl noise over octaves of value noise. The poly-count for the above screenshot stood at around 25k. This project was achieved entirely through code without using any tools/engines. The particle effects achieved here are fully GPU accelerated and computations such as positions of the particles, etc. are carried out entirely on the GPU. For this project, I have used Three.js - A Javascript-based wrapper library for WebGL - and this project was done in Javascript and GLSL - The OpenGL compatible shading language.
			<br><br>
			WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D graphics within any compatible modern web browser without the use of plug-ins. WebGL does so by introducing an API that closely conforms to the OpenGL ES 2.0 standard that can be used in HTML5 &lt;canvas&gt; elements.
			<br><br>
			This demo is cross-platform and completely mobile-compatible. All the effects in this demo have been achieved entirely through particle effects, without the use of any post- processing.
			<br><br>
			Demo: <a href="https://g7495x.github.io/WebGL-Particle-Flame---Three.js/src/?spherePointCount=5120&particleOpacity=.75" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			Demo [Mobile Friendly]: <a href="https://g7495x.github.io/WebGL-Particle-Flame---Three.js/src" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			Demo [Blue Variant]: <a href="https://g7495x.github.io/WebGL-Particle-Flame---Three.js/src/?spherePointCount=5120&color=blue&particleOpacity=.75" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			The code for this project is open-sourced at <a href="https://github.com/G7495x/WebGL-Particle-Flame---Three.js" target="_blank"><i class="fa fa-external-link"></i> Github</a>

		`
	},
	{
		title: '<b>Unity</b> Procedural Terrain',
		subTitle: 'A completely procedurally generated landscape with lush vegetation and wildlife.',
		images: [
			'imgs/4/1.jpg',
			'imgs/4/2.jpg',
			'imgs/4/3.jpg',
			'imgs/4/4.jpg',
		],
		description: `
			This is a procedural landscaping attempt, done with the use of the Unity 3D game engine. With the theme of a swampy marshland, the underlying algorithm is capable of generating a virtually endless non-repeating landscape. With adaptive river patterns, terrain that adjusts based on context, lush vegetation without artifacts and a touch of wildlife patterns, this project aims to produce a realistic looking alive scenery. This project was done using C#.
		<br><br>
		Slow swaying trees, circling butterflies and birds, volumetric fog covering areas near to far, rivers and ponds reflecting the scene [using screen space reflections] and the highlight of the non-repeating landscape full of vegetation. To finish it off, post-processing effects such as horizon fog, HDR bloom, and a touch of color grading, the above scene was the outcome.
		`
	},
	{
		title: '<b>Unity</b> Sea - Game',
		subTitle: 'An ocean-themed first-person mobile game.',
		images: [
			'imgs/6/1.png',
			'imgs/6/2.png',
			'imgs/6/3.png',
		],
		description: `
			This is a game I had developed during my Bachelor’s studies in 2015. It is a first-person game where you fly by obstacles to achieve a high-score based on the distance covered. This game was developed for mobile devices, specifically for the Android platform, using the then-recently released Unity 5. In this game, an endless ocean with a stormy-theme is depicted and the goal of the player is to avoid obstacles and go as further as possible. The game poses challenges such as obstacles that might fall over, obstacles that shift suddenly, misty weather and fog, hail & thunder-storms, dense and narrow rock formations, earthquakes, etc.
			<br><br>
			This game used many effects such as water-reflections [sky-box only], motion blur, color grading, lightning effect using camera exposure, rain splatter effect during rains, particle systems to depict rain & snowflakes, etc. Since this was a high-graphic game, a lot of optimization was needed to achieve 60 FPS. This game was truly fast-paced and offered both touch and gyroscopic controls.
		`
	},
	{
		title: '<b>OpenGL</b> Audio Visualizer',
		subTitle: 'An audio visualizer application built completely in C++.',
		images: [
			'imgs/7/1.png',
			'imgs/7/2.png',
			'imgs/7/3.png',
		],
		description: `
			This is one of my projects from my undergrad, done in OpenGL and C++. It is an audio visualizer application that inputs an audio file and the visualizer dances to the tones in the music as it plays. This application was done as part of the semester project for the subject ‘Computer Graphics’. This project was implemented using the OpenGL Utility Toolkit [GLUT] library and the FMOD Audio API. This design was the final outcome of multiple prototypes and try-outs.
			<br><br>
			A warped solenoid that dances to the music with a multi-point color gradient for the coloring, achieves a minimal and a pleasant look & feel. The audio algorithm was highly optimized to be a balance between smooth and reactive, so as to match the aesthetic of the visualizer. 3 parallel threads had to be used - one for playing the audio, another for extracting the audio samples and passing it through an FFT filter to obtain the bars and waveforms, and finally a last one for the visualizing the graphics. The end result, a smooth yet reactive visualizer that is floating and swaying in space with a starry background which proved to be quite enticing and captivating.
		`
	},
	{
		title: '<b>WebGL</b> Image Transition',
		subTitle: 'An awesome 3D image transition effect achieved in WebGL by the use of shaders.',
		images: [
			'imgs/5/1.png',
		],
		description: `
			This project was my first attempt at using shaders, done in WebGL. In this project, I have tried to create a high-fidelity transition effect for transitioning 2 images/textures. With the use of shaders, I was able to achieve the above depicted geometric transformation with a smooth animation. This particular demo is completely interactive and the user can easily control the phase of the animation by dragging the pointer. While this in itself is quite simplistic, this effect can be easily carried over to any 3D shape or model to achieve some truly stunning examples. This project was achieved entirely through code without using any tools/engines. The effect achieved here is fully GPU accelerated and all the computations are carried out entirely on the GPU. For this project, I have used Three.js - A Javascript- based wrapper library for WebGL - and this project was done in Javascript and GLSL - The OpenGL compatible shading language.
			<br><br>
			WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D graphics within any compatible modern web browser without the use of plug-ins. WebGL does so by introducing an API that closely conforms to the OpenGL ES 2.0 standard that can be used in HTML5 &lt;canvas&rt; elements.
			<br><br>
			This demo is cross-platform and completely mobile-compatible.
			<br><br>
			Demo:	<a href="https://g7495x.github.io/WebGL-Awesome-Image-Transition---Three.js/src/" target="_blank"><i class="fa fa-external-link"></i> Link</a>
			<br><br>
			The code for this project is open-sourced at <a href="https://github.com/G7495x/WebGL-Awesome-Image-Transition---Three.js" target="_blank"><i class="fa fa-external-link"></i> Github</a>
		`
	},
]

let pageHtml=''
for(let i of pageData){
	let imagesHtml=''
	for(let j of i.images)
		imagesHtml+=`<img src="${j}" onclick="setImg(this)">\n`
	pageHtml+=`
	<page>
		<div class="flex">
			<div class="img-section">
				<img src="${i.images[0]}" onclick="this.parentNode.classList.add('zoom')">
				<div class="fa fa-mouse-pointer"> Fullscreen</div>
				<div class="slides" style="--slide: 1" data-slides="${i.images.length}">
					<div class="h7 fa fa-chevron-left" onclick="prevPage(this.parentNode)"></div>
					${imagesHtml}
					<div class="h7 fa fa-chevron-right" onclick="nextPage(this.parentNode)"></div>
				</div>
				<div class="fa fa-times" onclick="this.parentNode.classList.remove('zoom')"></div>
			</div>
			<div class="content">
				<h1>${i.title}</h1>
				<div class="t-light">${i.subTitle}</div>
				<div style="height: 40px"></div>
				<div class="h7 t-light project-strength">Individual Project</div>
			</div>
		</div>
		<div class="slide-controls">
			<div class="h3 fa fa-chevron-left" onclick="prevPage()"></div>
			<div class="h3 fa fa-chevron-right" onclick="nextPage()"></div>
			<div class="fa fa-caret-left" onclick="gotoPage()">Back to Home</div>
		</div>
		<div class="description">
			<h5><b>Description</b></h5>
			<div class="t-light">${i.description}</div>
		</div>
	</page>`
}
document.body.innerHTML=document.body.innerHTML.replace('<page id="placeholder"></page>',pageHtml)

const setImg=(ele)=>{
	const src=ele.getAttribute('src')
	ele.parentNode.previousElementSibling.previousElementSibling.setAttribute('src',src)
}

// Exceptional Cases
document.querySelector('page:nth-of-type(4) .slides').style.setProperty('--slide','0')
document.querySelector('page:nth-of-type(8) .slides').style.setProperty('--slide','0')

// Page 1 Revolving Signature
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
