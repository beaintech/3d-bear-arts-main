<template>
    <div ref="threeCanvas" class="three-container"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as THREE from 'three';
  
  // Reference to the DOM container for Three.js
  const threeCanvas = ref<HTMLDivElement | null>(null);
  
  // Vertex shader
  const vertexShader = `
  varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
  `;
  
  // Fragment shader
  const fragmentShader = `
     uniform float time;
        uniform float opacity; // Add opacity uniform
        varying vec2 vUv;
    
        void main() {
            // Dynamic water-like gradient effect
            vec2 p = vUv * 2.0 - vec2(1.0); // Normalize UV coordinates to [-1, 1]
            float len = length(p); // Get the length of the vector (distance from center)
            float angle = atan(p.y, p.x); // Calculate the angle in polar coordinates
    
            // Create a time-based oscillating value for smooth gradient transitions
            float wave = sin(len * 10.0 - time * 3.0) * 1.0 + 0.5;
    
            // Color gradient based on the angle and distance from the center
            vec3 color1 = vec3(1.0, 0.3, 0.5); // Pinkish
            vec3 color2 = vec3(0.3, 0.6, 1.0); // Blueish
            vec3 color3 = vec3(1.0, 0.0, 0.8); // Magenta
    
            // Mix the colors based on wave and angle for a dynamic effect
            vec3 color = mix(color1, color2, wave);
            color = mix(color, color3, sin(angle + time) * 0.5 + 0.5);
    
            // Set the fragment color with opacity
            gl_FragColor = vec4(color, opacity); // Use the opacity uniform for transparency
        }
  `;
  
  onMounted(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Append the renderer to the DOM
    if (threeCanvas.value) {
      threeCanvas.value.appendChild(renderer.domElement);
    }
  
    // Add ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
        
    // Custom shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        opacity: { value: 0.8 }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const bodyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }, // Time uniform to animate the shader
            opacity: { value: 0.6 } // Opacity uniform (set to 0.6 for 60% transparency)
        },
        vertexShader,
        fragmentShader,
        transparent: true, // Enable transparency in the material
        depthWrite: false  // Disable depth writing to ensure proper rendering
    });
  
    // Create a group to hold all bear parts
    const bearGroup = new THREE.Group();

// Bear body with shader material
const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.scale.set(0.85, 0.85, 0.8); // Shorter body
body.position.y = -0.2;
bearGroup.add(body);

// Bear head
const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const head = new THREE.Mesh(headGeometry, bodyMaterial);
head.scale.set(1, 0.95, 0.95); // Flatter head
head.position.set(0, 1, 0);
bearGroup.add(head);

// Bear ears
const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const leftEar = new THREE.Mesh(earGeometry, shaderMaterial);
leftEar.position.set(-0.45, 1.35, -0.1);
bearGroup.add(leftEar);

const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
rightEar.position.set(0.45, 1.35, -0.1);
bearGroup.add(rightEar);

// Bear snout
const snoutGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const snout = new THREE.Mesh(snoutGeometry, shaderMaterial);
snout.scale.set(1, 0.6, 0.8); // Flatter and wider snout
snout.position.set(0, 0.85, 0.5);
bearGroup.add(snout);

// Bear arms
const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
const leftArm = new THREE.Mesh(armGeometry, shaderMaterial);
leftArm.scale.set(0.75, 1.25, 0.65);
leftArm.position.set(-0.7, -0.15, 0.2);
bearGroup.add(leftArm);

const rightArm = new THREE.Mesh(armGeometry, shaderMaterial);
rightArm.scale.set(0.75, 1.25, 0.65);
rightArm.position.set(0.7, -0.15, 0.2);
bearGroup.add(rightArm);

// Bear legs
const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Reduced size for the front half-round of the boot

const leftBootFront = new THREE.Mesh(bootFrontGeometry, shaderMaterial);
leftBootFront.scale.set(1, .72, 1.5); // Reduced size, flattened and extended front
leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
bearGroup.add(leftBootFront);

const rightBootFront = new THREE.Mesh(bootFrontGeometry, shaderMaterial);
rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
bearGroup.add(rightBootFront);

const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
const leftLeg = new THREE.Mesh(legGeometry, shaderMaterial);
leftLeg.position.set(-0.4, -1.05, 0);
bearGroup.add(leftLeg);

const rightLeg = new THREE.Mesh(legGeometry, shaderMaterial);
rightLeg.position.set(0.4, -1.05, 0);
bearGroup.add(rightLeg);

// Buttocks and tail
const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32);
const leftButtock = new THREE.Mesh(buttockGeometry, shaderMaterial);
leftButtock.position.set(-0.15, -0.45, -0.4);
// bearGroup.add(leftButtock);

const rightButtock = new THREE.Mesh(buttockGeometry, shaderMaterial);
rightButtock.position.set(0.15, -0.45, -0.4);
// bearGroup.add(rightButtock);

const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
const tail = new THREE.Mesh(tailGeometry, shaderMaterial);
tail.position.set(0, -0.35, -0.75);
bearGroup.add(tail);

// Create a 2D heart shape
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0);
heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

// Custom material for eyes
const rightEyeMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 1, roughness: 0.44 });
const leftEyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, metalness: 1, roughness: 0.44 });

// Create diamond shape for the eyes
const diamondShape = new THREE.Shape();
diamondShape.moveTo(0, 0.15);   // Top point
diamondShape.lineTo(0.1, 0);   // Right point
diamondShape.lineTo(0, -0.15);  // Bottom point
diamondShape.lineTo(-0.1, 0);  // Left point
diamondShape.lineTo(0, 0.15);   // Back to top

const extrudeSettings = { depth: 0.07, bevelEnabled: false }; // Thinner depth
const diamondGeometry = new THREE.ExtrudeGeometry(diamondShape, extrudeSettings);

 // Position diamond eyes
 const leftEye = new THREE.Mesh(diamondGeometry, rightEyeMaterial);
leftEye.position.set(-0.25, 1, 0.5); // Adjust position on bear's head
leftEye.rotation.y = Math.PI / 30;     // Slight rotation to fit face shape
bearGroup.add(leftEye);

const rightEye = new THREE.Mesh(diamondGeometry, leftEyeMaterial);
rightEye.position.set(0.25, 1, 0.5); // Adjust position on bear's head
rightEye.rotation.y = Math.PI / 30;   // Slight rotation to fit face shape
bearGroup.add(rightEye);

// Extrude the heart shape to give it 3D depth
const heartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xCC0000, // Pink color (Hot Pink)
            metalness: 0.2, // Lower metalness for a more plastic feel
            roughness: 0.6, // Increase roughness for a more matte appearance
            clearcoat: 0.1, // Low clearcoat for minimal shine
            clearcoatRoughness: 0.8, // Higher clearcoat roughness for a matte finish
            transparent: true,
            opacity: 0.99, // Less transparent, more solid plastic look
        });
const extrudeHeartSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
const largeHeartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,       // Use white color to simulate a diamond
    metalness: 0.0,        // High metalness for a reflective surface
    roughness: 0.1,        // Low roughness for a glossy appearance
    clearcoat: 1.0,        // High clearcoat for added shine
    clearcoatRoughness: 0.1, // Smooth clearcoat
    transparent: true,     // Enable transparency
    opacity: 0.85,          // High opacity for translucence
    reflectivity: 1,       // Increase reflectivity for better light interaction
    envMapIntensity: 1,    // Make environment reflections more prominent
  });
  
const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);

// Create heart mesh using the gradient material
const heart = new THREE.Mesh(heartGeometry, largeHeartMaterial);
heart.scale.set(0.5, 0.5, 0.5); // Scale down the heart
heart.position.set(0, 0, 0); // Position it in front of the body
heart.rotation.y = Math.PI; // Rotate the heart to face forward
heart.rotation.x = Math.PI; // Flip the heart upside down

// Add the heart to the bearGroup, in front of the body
bearGroup.add(heart);

// Create a classic 6-corner diamond shape
const largeDiamondShape = new THREE.Shape();
  largeDiamondShape.moveTo(0, 0.6);
  largeDiamondShape.lineTo(0.3, 0.3);
  largeDiamondShape.lineTo(0.6, 0);
  largeDiamondShape.lineTo(0.3, -0.3);
  largeDiamondShape.lineTo(0, -0.6);
  largeDiamondShape.lineTo(-0.3, -0.3);
  largeDiamondShape.lineTo(-0.6, 0);
  largeDiamondShape.lineTo(-0.3, 0.3);
  largeDiamondShape.lineTo(0, 0.6);

// Extrusion settings for the diamond
const extrudeLargeDiamondSettings = { 
    depth: 0.4,           // Thicker depth for more volume
    bevelEnabled: true,    // Add bevel for a more 3D appearance
    bevelSegments: 2, 
    steps: 2, 
    bevelSize: 0.1, 
    bevelThickness: 0.1 
};

// Create geometry for the extruded diamond
const largeDiamondGeometry = new THREE.ExtrudeGeometry(largeDiamondShape, extrudeLargeDiamondSettings);

// Create material for the diamond with a shiny and transparent look
const largeDiamondMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,       // Use white color to simulate a diamond
    metalness: 0.0,        // High metalness for a reflective surface
    roughness: 0.1,        // Low roughness for a glossy appearance
    clearcoat: 1.0,        // High clearcoat for added shine
    clearcoatRoughness: 0.1, // Smooth clearcoat
    transparent: true,     // Enable transparency
    opacity: 0.85,          // High opacity for translucence
    reflectivity: 1,       // Increase reflectivity for better light interaction
    envMapIntensity: 1,    // Make environment reflections more prominent
  });

// Create the large diamond mesh
const largeDiamond = new THREE.Mesh(largeDiamondGeometry, largeDiamondMaterial);
largeDiamond.scale.set(0.5, 0.5, 0.5); // Scale the diamond to match the size of the heart
largeDiamond.position.set(0, 0, 0); // Position the diamond in the center of the bear's body

// Add the large diamond to the bear group
// bearGroup.add(largeDiamond);

// Add bear group to the scene
scene.add(bearGroup);

  
    // Camera setup
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);
  
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      shaderMaterial.uniforms.time.value += 0.03;
      bearGroup.rotation.y += 0.03;
      renderer.render(scene, camera);
    };
    animate();
  
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });
  </script>
  
  <style scoped>
  .three-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: radial-gradient(circle at 50% 50%, #ffffff, #70ebeb, #f097de, #efef9f);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: waterEffect 5s infinite ease-in-out;
  }
  
  @keyframes waterEffect {
    0% {
      background-size: 100% 100%;
      background-position: 0% 50%;
    }
    25% {
      background-size: 150% 150%;
      background-position: 50% 100%;
    }
    50% {
      background-size: 200% 200%;
      background-position: 100% 50%;
    }
    75% {
      background-size: 150% 150%;
      background-position: 50% 0%;
    }
    100% {
      background-size: 100% 100%;
      background-position: 0% 50%;
    }
  }
  </style>
  