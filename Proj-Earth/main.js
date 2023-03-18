import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DoubleSide, FloatType, Mesh, MeshPhysicalMaterial, PlaneGeometry, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import  anime from 'animejs';

const sunBackground = document.querySelector('.sun-background')
const moonBackground = document.querySelector('.moon-background')


//Create a new Scene
const scene = new THREE.Scene();


const ringsScene = new THREE.Scene();



//Set a Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0,15,50);
scene.add(camera);

const ringsCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
ringsCamera.position.set(0,0,50);


//Render the image
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);



//Orbit Controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//directional lighting with shadows
const sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.right = 10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.bottom = -10;
scene.add(sunLight);

const MoonLight = new THREE.DirectionalLight(new THREE.Color("#77ccff").convertSRGBToLinear(), 0);
MoonLight.position.set(10, 20, 10);
MoonLight.castShadow = true;
MoonLight.shadow.mapSize.width = 512;
MoonLight.shadow.mapSize.height = 512;
MoonLight.shadow.camera.near = 0.5;
MoonLight.shadow.camera.far = 100;
MoonLight.shadow.camera.left = -10;
MoonLight.shadow.camera.right = 10;
MoonLight.shadow.camera.top = 10;
MoonLight.shadow.camera.bottom = -10;
scene.add(MoonLight);



//event listener for mouse movements to have rings move with mouse hover

let mousePosition = new THREE.Vector2(0,0)

window.addEventListener("mousemove", (e) => {
  let x = e.clientX - innerWidth * 0.5
  let y = e.clientY - innerHeight * 0.5

  mousePosition.x = x * 0.0003
  mousePosition.y = y * 0.0003
})
//load textures onto the sphere
let textures = {
    bump: await new THREE.TextureLoader().loadAsync("assets/earthbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/earthmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/earthspec.jpg"),
    planeTrailMask: await new THREE.TextureLoader().loadAsync("assets/mask.png")
  }

//enable textures to actually generate onto our shape
const pmrem = new THREE.PMREMGenerator(renderer)
const envMapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("assets/old_room_2k.hdr")
const envMap = pmrem.fromEquirectangular(envMapTexture).texture

//create new ring geometry

const ring1 = new THREE.Mesh(
  new THREE.RingGeometry(15,13.5,80,1,0),
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
    roughness: 0.25,
    envMap,
    envMapIntensity: 1.8,
    side: DoubleSide,
    transparent: true,
    opacity: 0.35,
  })
)
ring1.sunOpacity = 0.35
ring1.moonOpacity = 0.03
ringsScene.add(ring1)

const ring2 = new THREE.Mesh(
  new THREE.RingGeometry(16.5,15.75,80,1,0),
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#FFCB8E").convertSRGBToLinear(),
    side: DoubleSide,
    transparent: true,
    opacity: 0.5,
  })
)
ring2.sunOpacity = 0.35
ring2.moonOpacity = 0.03
ringsScene.add(ring2)


const ring3 = new THREE.Mesh(
  new THREE.RingGeometry(18,17.75,80,),
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(50),
    side: DoubleSide,
    transparent: true,
    opacity: 0.5,
  })
)
ring3.sunOpacity = 0.35
ring3.moonOpacity = 0.03
ringsScene.add(ring3)

//create the sphere object textures and layerings
const geometry = new THREE.SphereGeometry(10, 70, 70);
const material = new THREE.MeshPhysicalMaterial({
  map: textures.map,
  roughnessMap: textures.spec,
  bumpMap: textures.bump,
  bumpScale: 0.05,
  envMap,
  envMapIntensity: 0.5,

  sheen: 1,
  sheenRoughness: 0.75,
  sheenColor: ('#ff8a00'),
  clearcoat: 0.5,
});

//Cartoon Plane initialization, made into an island glb 

const plane = (await new GLTFLoader().loadAsync("assets/low-poly_floating_island.glb")).scene.children[0]

//Create a plane array to store planes data and information needed to chose locations 
const planeArray = [
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),
  makePlane(plane, textures.planeTrailMask, envMap, scene),


]

function makePlane(planeMesh, trailTexture, envMap, scene) {
  let plane = planeMesh.clone()
  plane.scale.set(0.03,0.03,0.03)
  plane.position.set(0,0,0)
  plane.rotation.set(10,0,10)
  plane.updateMatrixWorld()

  plane.traverse((object) => {
    if ( object instanceof THREE.Mesh) {
      object.material.envMap = envMap
      object.sunEnvIntensity = 0.4
      object.moonEnvIntensity = 0.1
      object.castShadow = true
      object.receiveShadow = true
    }


  })

  //create a group, group allows multiple objects to be 'grouped'
    const group = new THREE.Group()
    group.add(plane)

    scene.add(group)

    return {
      group,
      rot: Math.random() * Math.PI * 2.0,
      rad: Math.random() * Math.PI * 0.45 + 0.2,
      yOff: 10.5 + Math.random() * 1.0,
      randomAxis: new Vector3(nr(), nr(), nr()).normalize(),
      randomAxisRot: Math.random() * Math.PI * 2,
    }
}

function nr() {
  return Math.random() * 2 -1;
}

//add sphere to scene and declare what properties the sphere has 
const sphere = new THREE.Mesh(geometry, material);
sphere.sunEnvIntensity = 0.4
sphere.moonEnvIntensity = 0.1
sphere.rotation.y += Math.PI * 1.25;
sphere.receiveShadow = true;
scene.add(sphere);


//sphere rotations 
sphere.rotation.y += Math.PI * 2;

const clock = new THREE.Clock()


//change linear gradients 
let dayTime = true
let animating = false;
window.addEventListener("keypress", (e) => {
  if (e.key !== "l") return;

  if(animating) return;

  let anim;
  if(!dayTime) {
    anim = [1,0]
  } else if(dayTime) {
    anim = [0,1]
  } else {
    return
  }

  animating = true;

  let obj = {t : 0}
  anime({
    targets: obj,
    t: anim,
    complete: () => {
      animating = false;
      dayTime = !dayTime;
    },
    update: () => {

      sunLight.intensity = 3.5 * (1-obj.t)
      MoonLight.intensity = 3.5 * obj.t

      sunLight.position.setY(20 * (1-obj.t))
      MoonLight.position.setY(20* obj.t)

      sphere.material.sheen = (1-obj.t)

      scene.children.forEach((child) => {
        child.traverse((object) => {
          if(object instanceof THREE.Mesh && object.material.envMap) {
            object.material.envMapIntensity = 
              object.sunEnvIntensity * (1-obj.t) + object.moonEnvIntensity * obj.t;
                
          }
        })
      })


      sunBackground.style.opacity = 1-obj.t
      moonBackground.style.opacity = obj.t


      
    },
    easing: 'easeInOutSine',
    duration: 500,
  })
})
//add the scene to the renderer
renderer.setAnimationLoop(() => {

  let delta = clock.getDelta()



  planeArray.forEach(planeArray => {


    let plane =  planeArray.group

    plane.position.set(0,0,0)
    plane.rotation.set(0,0,0)
    plane.updateMatrixWorld()

    planeArray.rot += delta * 0.25
    plane.rotateOnAxis(planeArray.randomAxis, planeArray.randomAxisRot)
    plane.rotateOnAxis(new Vector3(0,1,0), planeArray.rot)
    plane.rotateOnAxis(new Vector3(0,0,1), planeArray.rad)
    plane.translateY(planeArray.yOff)
    plane.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5)


  })

  controls.update()
  renderer.render(scene, camera)


  ring1.rotation.x = ring1.rotation.x * 0.95 + mousePosition.y * 0.05 * 1.2
  ring1.rotation.x = ring1.rotation.x * 0.95 + mousePosition.y * 0.05 * 1.2

  ring2.rotation.x = ring2.rotation.x * 0.95 + mousePosition.y * 0.05 * 0.375
  ring2.rotation.x = ring2.rotation.x * 0.95 + mousePosition.y * 0.05 * 0.375

  ring3.rotation.x = ring3.rotation.x * 0.95 + mousePosition.y * 0.05 * 0.375
  ring3.rotation.x = ring3.rotation.x * 0.95 + mousePosition.y * 0.05 * 0.375

  renderer.autoClear = false
  renderer.render(ringsScene, ringsCamera)
  renderer.autoClear = true


})

