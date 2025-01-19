import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 50, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lorenz parameters
const sigma = 10;
const rho = 28;
const beta = 8 / 3;
const dt = 0.01;

const points = [];
const maxPoints = 3000; // Maximum number of points
let x = 1, y = 1, z = 1;

// Line material
const material = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 5 });
const geometry = new THREE.BufferGeometry();

// Add points to geometry
function updateLorenz() {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    points.push(new THREE.Vector3(x, y, z));

    if (points.length > maxPoints) {
        points.shift();
    }

    geometry.setFromPoints(points);
}

// Add the line to the scene
const line = new THREE.Line(geometry, material);
scene.add(line);

// Animation loop
function animate() {
    updateLorenz();

    // Rotate the line slightly for visual effect
    line.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start animation
animate();
