import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import gsap from 'gsap'
import './style.css'

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true

// Create a star field with randomly positioned white points
const starCount = 1000
const starField = new THREE.Group()

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03, //points Size
})

for (let i = 0; i < starCount; i++) {
  const star = new THREE.Vector3()
  star.x = (Math.random() - 0.5) * 100
  star.y = (Math.random() - 0.5) * 100
  star.z = (Math.random() - 0.5) * 100
  starField.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints([star]), starMaterial))
}

scene.add(starField)

// FBXLoader
const fbxLoader = new FBXLoader()
fbxLoader.load('./earth.fbx', (fbx) => {
  fbx.scale.set(0.04, 0.04, 0.04)
  scene.add(fbx)

  // Timeline magic
  const tl = gsap.timeline({ defaults: { duration: 1 } })
  tl.fromTo(fbx.scale, { z: 0, x: 0, y: 0 }, { z: 0.04, x: 0.04, y: 0.04 })
  tl.fromTo('nav', { y: '-100%' }, { y: '0%' })
  tl.fromTo('.title', { opacity: 0 }, { opacity: 1 })
})

// hesmisphere light around the model
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 3)
scene.add(hemisphereLight)

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// Render Loop
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()
