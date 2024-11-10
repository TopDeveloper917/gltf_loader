import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep the 3D object on a global variable 
let object;
// OrbitControls allowing camera to move around in the scene
let controls;

// Function to load the model
function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    `models/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      // Scale the model to make it larger
      object.scale.set(1, 1, 1); // Adjust the scale factor as needed
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );
}
loadModel();

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Set camera position and initial zoom
camera.position.z = 200; // Set initial zoom level
camera.zoom = 50; // Reset zoom to default
camera.updateProjectionMatrix(); // Update projection matrix

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Controls for the camera
controls = new OrbitControls(camera, renderer.domElement);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Add a listener to the window for resizing
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Zoom in and zoom out buttons
const zoomInButton = document.getElementById('zoom-in-button');
const zoomOutButton = document.getElementById('zoom-out-button');

const zoomSpeed = 0.1; // Zoom speed

// Zoom calculations and updating the page
zoomInButton.addEventListener('click', () => {
  camera.zoom *= 1 + zoomSpeed;
  camera.updateProjectionMatrix();
});

zoomOutButton.addEventListener('click', () => {
  camera.zoom /= 1 + zoomSpeed;
  camera.updateProjectionMatrix();
});

// Move the model with WASD keys
document.addEventListener('keydown', (event) => {
  if (object) {
    const moveDistance = 1 / camera.zoom; // Adjust movement based on zoom level
    switch (event.key) {
      case 'w': // Move forward
        object.position.y += moveDistance;
        break;
      case 's': // Move backward
        object.position.y -= moveDistance;
        break;
      case 'a': // Move left
        object.position.z += moveDistance;
        break;
      case 'd': // Move right
        object.position.z -= moveDistance;
        break;
    }
  }
});

// Begin 3D rendering
animate();
