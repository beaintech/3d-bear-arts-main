<template>
  <div ref="threeContainer" :class="background? 'no-bg':'three-container'"></div>
</template>

  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import * as THREE from 'three';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; // Correct FontLoader import
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; // Correct TextGeometry import
  
  const threeContainer = ref<HTMLDivElement | null>(null);
  const props = defineProps({
  background: {
    type: Boolean,
    default: false
  },
  cameraPosition: {
    type: Number,
    default: 4
  },
  bodyPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  }
});

  onMounted(() => {
    if (threeContainer.value) {
      // Initialize the Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
        if (threeContainer.value) {
            threeContainer.value.appendChild(renderer.domElement);
        }

      // Enable gamma correction
      // renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;  
      
      threeContainer.value.appendChild(renderer.domElement);
  
      // Add lighting (increase intensities and add a point light)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Increased intensity
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
  
      // Point light to focus more light on the bear
      const pointLight = new THREE.PointLight(0xffffff, 2, 50); // Strong point light
      pointLight.position.set(0, 2, 4); // Position near the front of the bear
      scene.add(pointLight);

      const vertexShader = `
            varying vec3 vPosition;
            varying vec3 vNormal;
            void main() {
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec3 vPosition;
            varying vec3 vNormal;
            void main() {
                vec3 leftColor = vec3(1.0, 0.41, 0.71);
                vec3 rightColor = vec3(0.0, 0.75, .85);
                vec3 color = (vPosition.x < 0.0) ? leftColor : rightColor;
                vec3 lightDir = normalize(vec3(1.5, 1, 3));
                float diff = max(dot(vNormal, lightDir), 0.15);
                vec3 ambientLight = vec3(0.12);
                vec3 finalColor = ambientLight + (color * diff);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const splitColorMatteMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader
        });

        const hotPinkMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF69B4,
            metalness: -0.8,
            roughness: 0.7
        });

        const blueMaterial = new THREE.MeshStandardMaterial({
            color: 0x00FFFF,
            metalness: 0.4,
            roughness: 0.7
        });
  
      // Create the bear group and all parts
      const bearGroup = new THREE.Group();
  
      // Bear body
      const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
        const body = new THREE.Mesh(bodyGeometry, splitColorMatteMaterial);
        body.scale.set(0.85, 0.85, 0.8);
        body.position.y = -0.2;
        bearGroup.add(body);
  
      // Bear head
      const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const head = new THREE.Mesh(headGeometry, splitColorMatteMaterial);
      head.position.set(0, 1, 0);
      bearGroup.add(head);
  
      // Bear ears
      const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
      const leftEar = new THREE.Mesh(earGeometry, hotPinkMaterial);
      leftEar.position.set(-0.45, 1.35, -0.1);
      bearGroup.add(leftEar);
  
      const rightEar = new THREE.Mesh(earGeometry, blueMaterial);
      rightEar.position.set(0.45, 1.35, -0.1);
      bearGroup.add(rightEar);
  
      // Bear snout
      const snoutGeometry = new THREE.SphereGeometry(0.25, 32, 32);
      const snout = new THREE.Mesh(snoutGeometry, splitColorMatteMaterial);
      snout.scale.set(1, 0.6, 0.8);
      snout.position.set(0, 0.85, 0.5);
      bearGroup.add(snout);
  
      // Bear arms
      const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
      const leftArm = new THREE.Mesh(armGeometry, hotPinkMaterial);
      leftArm.scale.set(0.75, 1.25, 0.65);
      leftArm.position.set(-0.7, -0.15, 0.2);
      bearGroup.add(leftArm);
  
      const rightArm = new THREE.Mesh(armGeometry, blueMaterial);
      rightArm.scale.set(0.75, 1.25, 0.65);
      rightArm.position.set(0.7, -0.15, 0.2);
      bearGroup.add(rightArm);
  
      // Bear legs
      const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
      const leftLeg = new THREE.Mesh(legGeometry, hotPinkMaterial);
      leftLeg.position.set(-0.4, -1.05, 0);
      bearGroup.add(leftLeg);
  
      const rightLeg = new THREE.Mesh(legGeometry, blueMaterial);
      rightLeg.position.set(0.4, -1.05, 0);
      bearGroup.add(rightLeg);
  
    // Define the boot front geometry
    const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
  
    // Left boot front
    const leftBootFront = new THREE.Mesh(bootFrontGeometry, hotPinkMaterial);
    leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
    leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
    bearGroup.add(leftBootFront);
  
    // Right boot front
    const rightBootFront = new THREE.Mesh(bootFrontGeometry, blueMaterial);
    rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
    rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
    bearGroup.add(rightBootFront);
  
           // Create rounded buttocks
           const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
          const leftButtock = new THREE.Mesh(buttockGeometry, hotPinkMaterial);
          leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
          bearGroup.add(leftButtock);
  
          const rightButtock = new THREE.Mesh(buttockGeometry, blueMaterial);
          rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
          bearGroup.add(rightButtock);
  
      // Bear tail
      const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
      const tail = new THREE.Mesh(tailGeometry, splitColorMatteMaterial);
      tail.position.set(0, -0.35, -0.8);
      bearGroup.add(tail);
  
       // Load font and create 3D text
       const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
          const xEyeGeometry = new TextGeometry('X', {
            font: font,
            size: 0.18, // Size of the X
            depth: 0.05,
          });
  
          const xEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
            const xEye = new THREE.Mesh(xEyeGeometry, xEyeMaterial);
            xEye.position.set(-0.3, .99, 0.53); // Position on the head
            xEye.rotation.x = THREE.MathUtils.degToRad(-5);
            xEye.rotation.y = THREE.MathUtils.degToRad(-15);
            bearGroup.add(xEye);

        // Create the O eye
          const oEyeGeometry = new TextGeometry('+', {
            font: font,
            size: 0.25, // Size of the O
            depth: 0.1, // Thickness of the O
        });

            const oEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
            const oEye = new THREE.Mesh(oEyeGeometry, oEyeMaterial);
            oEye.position.set(0.14, .99, 0.53); // Position on the head
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);


            bearGroup.add(oEye);
        });
  
          // Create a 2D heart shape
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
        heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
        heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

        // Extrude the heart shape to give it 3D depth
        const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

        // Create the black material for the heart
        const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        // Create the heart mesh
        const smallHeart = new THREE.Mesh(heartGeometry, blackMaterial);
        smallHeart.scale.set(0.1, 0.1, 0.1); // Scale the heart down to be small

        // Rotate the heart by 30 degrees (in radians) and position it on the left side of the bear's face
        smallHeart.rotation.z = THREE.MathUtils.degToRad(210); // Rotate 30 degrees
        smallHeart.rotation.x = THREE.MathUtils.degToRad(5);
        smallHeart.rotation.y = THREE.MathUtils.degToRad(-45);

        smallHeart.position.set(-0.4, 0.9, 0.45); // Position it on the pink side of the face

        // Add the heart to the bear group
        bearGroup.add(smallHeart);


      // Add bear group to the scene
      scene.add(bearGroup);
  
      // Animation function
      function animate() {
        requestAnimationFrame(animate);
        bearGroup.rotation.y += 0.03; // Rotation speed fixed to match original
        renderer.render(scene, camera);
      }
  
      // Start animation
      animate();
  
      // Set camera position and look at the bear
      camera.position.set(0, 1, 4);
      camera.lookAt(0, 0, 0);

       // Set initial positions for bearGroup and camera
    bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
    camera.position.set(props.bodyPosition.x, 1, props.cameraPosition);
    camera.lookAt(props.bodyPosition.x, 0, 0);

    // Watch for changes in bodyPosition
    watch(() => props.bodyPosition, (newPos) => {
      bearGroup.position.set(newPos.x, newPos.y, newPos.z);
    });

    // Watch for changes in cameraPosition
    watch(() => props.cameraPosition, (newPos) => {
      camera.position.set(props.bodyPosition.x, 1, newPos);
      camera.lookAt(props.bodyPosition.x, 0, 0);
    });
  
      // Handle window resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  });
  </script>
  
  <style scoped>
  .three-container {
    margin: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: radial-gradient(circle at 50% 50%, rgb(255, 255, 255), rgba(252, 248, 1, 0.99), rgb(141, 2, 255), rgb(255, 120, 2),rgb(255, 2, 133));
            background-size: 200% 200%;
            background-repeat: no-repeat;
            animation: heartTunnel 3s infinite linear;
        }

       
        @keyframes heartTunnel {
            0% {
                background-size: 100% 100%;
                background-position: center;
            }
            50% {
                background-size: 150% 150%;
                background-position: center;
            }
            100% {
                background-size: 200% 200%;
                background-position: center;
            }
        } 

        .no-bg {
          margin: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: none;  
        }
  </style>
  