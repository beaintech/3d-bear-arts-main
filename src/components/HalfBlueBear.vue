<template>
  <div ref="threeCanvas" :class="background? 'no-bg':'three-canvas'"></div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import * as THREE from 'three';
  import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; 
  import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; 

  const props = defineProps({
  background: {
    type: Boolean,
    default: false
  },
  cameraPosition: {
    type: Number,
    default: 5
  },
  bodyPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  }
});
  const threeCanvas = ref<HTMLDivElement | null>(null);
  
  onMounted(() => {
    if (threeCanvas.value) {
      // Initialize the Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      
      threeCanvas.value.appendChild(renderer.domElement);
  
      // Add lighting (increase intensities and add a point light)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased intensity
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
  
      // Point light to focus more light on the bear
      const pointLight = new THREE.PointLight(0xffffff, 2, 50); // Strong point light
      pointLight.position.set(0, 2, 4); // Position near the front of the bear
      scene.add(pointLight);
  
      // Shader material with gradient animation for the bear's body
      const bigHeartMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xFFD700) }, // Gold color
          color2: { value: new THREE.Color(0xF44336) }, // Hotpink color
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          void main() {
            vec3 color = mix(color1, color2, sin(vUv.y * 10.0 + time) * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      });
            
    const cyanMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00CED1, // Cyan
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      transparent: true,
      opacity: 0.99,
    });

    const transparentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00CED1, // Cyan
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      transparent: true,
      opacity: 0.35,
    });

    const sliverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD3D3D3, // Lighter silver color (light grey)
      metalness: 0.7,  // Reduce metalness for a more visible material (not too dark)
      roughness: 0.25,  // Lower roughness for smooth reflections
      clearcoat: 0.4,  // Slight clearcoat for shine
      clearcoatRoughness: 0.1, // Keep clearcoat reflections smooth
      transparent: false,  // Not transparent
      opacity: 1.0,  // Fully opaque
    });

    const transparenSliverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xC0C0C0, // Silver color (light gray)
      metalness: 1.0,  // Full metalness for a shiny metal look
      roughness: 0.3,  // Lower roughness for a smooth surface
      clearcoat: 0.5,  // Clearcoat for extra shine
      clearcoatRoughness: 0.1, // Low roughness for smoother reflections
      transparent: true,  // Enable transparency
      opacity: 0.35,  // Partially transparent for glass-like metal
    });

    const pinkMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFF69B4, // Pink
      metalness: 0.2,
      roughness: 0.5,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      transparent: true,
      opacity: 0.79,
    });

      const redHeartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xCC0000,          // Red color
        metalness: 0.2,           // Lower metalness for a more plastic feel
        roughness: 0.6,           // Increase roughness for a more matte appearance
        clearcoat: 0.1,           // Low clearcoat for minimal shine
        clearcoatRoughness: 0.8,  // Higher clearcoat roughness for a matte finish
        transparent: false,        // Enable transparency
        opacity: 0.99,            // Slight transparency
        depthWrite: true,        // Disable depth writing
        depthTest: true,          // Ensure depth testing
});

const hotPinkHeartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF69B4,          // Red color
        metalness: 0.2,           // Lower metalness for a more plastic feel
        roughness: 0.6,           // Increase roughness for a more matte appearance
        clearcoat: 0.1,           // Low clearcoat for minimal shine
        clearcoatRoughness: 0.8,  // Higher clearcoat roughness for a matte finish
        transparent: false,        // Enable transparency
        opacity: 0.99,            // Slight transparency
        depthWrite: true,        // Disable depth writing
        depthTest: true,          // Ensure depth testing
});

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

    const bodyMaterial = new THREE.ShaderMaterial({
      uniforms: {
          time: { value: 0.0 }, // Time uniform to animate the shader
          opacity: { value: 1 } // Opacity uniform (set to 0.6 for 60% transparency)
      },
      vertexShader,
      fragmentShader:fragmentShader,
      transparent: false, // Enable transparency in the material
      depthWrite: true // Disable depth writing to ensure proper rendering
  });

  
  // Create the bear group and all parts
  const bearGroup = new THREE.Group();
  
    // Create a half-sphere geometry
      const bodyGeometry = new THREE.SphereGeometry(
          1,            // Radius
          32,           // Width segments
          32,           // Height segments
          0,            // phiStart
          Math.PI       // phiLength (half of the sphere)
      );
    const rightBody = new THREE.Mesh(bodyGeometry, transparentMaterial);
    const leftBody = new THREE.Mesh(bodyGeometry, cyanMaterial);

    rightBody.scale.set(0.85, 0.85, 0.8);
    leftBody.scale.set(0.85, 0.85, 0.8);

    rightBody.position.y = -0.2;
    leftBody.position.y = -0.2;

    rightBody.rotation.y = Math.PI / 2;
    leftBody.rotation.y = Math.PI * 1.5;

    // Create a circular geometry to fill the flat side
      const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
      const circle = new THREE.Mesh(circleGeometry, cyanMaterial);
      circle.scale.set(0.85, 0.85, 0.8);

      // Position the circle to cover the flat side
      circle.position.set(0, -0.2, 0); // Position should match the flat side of the half-sphere
      circle.rotation.y = Math.PI / 2; // Rotate the circle to match the half-sphere's orientation

      // Create a group to combine the half-sphere and the plane
      const halfSphereGroup = new THREE.Group();
      halfSphereGroup.add(rightBody);
      halfSphereGroup.add(leftBody);
      halfSphereGroup.add(circle);

      // Add the combined geometry to the scene or parent group
      bearGroup.add(halfSphereGroup);

      // Bear head
      // Create half-sphere geometry for the head
      const headGeometry = new THREE.SphereGeometry(
          0.6,        // Radius
          32,         // Width segments
          32,         // Height segments
          0,          // phiStart
          Math.PI     // phiLength (half of the sphere)
      );

      // Create the left half of the head
      const leftHead = new THREE.Mesh(headGeometry, cyanMaterial);
      leftHead.scale.set(1, 0.95, 0.95);
      leftHead.position.set(0, 1, 0);
      leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation

      // Create the right half of the head
      const rightHead = new THREE.Mesh(headGeometry, transparentMaterial);
      rightHead.scale.set(1, 0.95, 0.95);
      rightHead.position.set(0, 1, 0);
      rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation

      // Create a circular geometry to fill the flat side
      const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
      const headCircle = new THREE.Mesh(headCircleGeometry, cyanMaterial);

      // Position the circle to cover the flat side
      headCircle.position.set(0, 1, 0); // Set to the same height as the heads
      headCircle.rotation.y = Math.PI / 2; // Rotate the circle to match the half-sphere's orientation
      headCircle.scale.set(1, 0.95, 0.95); // Make it wider at the front

      // Create a group to combine the two half-spheres and the circle
      const halfHeadSphereGroup = new THREE.Group();
      halfHeadSphereGroup.add(leftHead);
      halfHeadSphereGroup.add(rightHead);
      halfHeadSphereGroup.add(headCircle);

      // Add the combined head group to the bear group
      bearGroup.add(halfHeadSphereGroup);
  
      // Bear ears
      const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
      const leftEar = new THREE.Mesh(earGeometry, cyanMaterial);
      leftEar.position.set(-0.45, 1.35, -0.1);
      bearGroup.add(leftEar);
  
      const rightEar = new THREE.Mesh(earGeometry, transparentMaterial);
      rightEar.position.set(0.45, 1.35, -0.1);
      bearGroup.add(rightEar);
  
      // Geometry for the left half of the snout
      const leftSnoutGeometry = new THREE.SphereGeometry(
          0.25, // Radius
          32,   // Width segments
          32,   // Height segments
          Math.PI / 2, // phiStart: Start at 90 degrees to create a half-sphere
          Math.PI // phiLength: Cover 180 degrees to create the half shape
      );
      const leftSnout = new THREE.Mesh(leftSnoutGeometry, cyanMaterial);
      leftSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
      leftSnout.position.set(0, 0.84, 0.5); // Position the left half
      leftSnout.rotation.y = Math.PI; // Rotate to align correctly

      // Geometry for the right half of the snout
      const rightSnoutGeometry = new THREE.SphereGeometry(
          0.25, // Radius
          32,   // Width segments
          32,   // Height segments
          Math.PI / 2, // phiStart: Start at -90 degrees to create a half-sphere
          Math.PI // phiLength: Cover 180 degrees to create the half shape
      );
      const rightSnout = new THREE.Mesh(rightSnoutGeometry, transparentMaterial);
      rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
      rightSnout.position.set(0, 0.84, 0.5); // Position the right half
      rightSnout.rotation.y = 0; // Align correctly without additional rotation

      // Circle to cover the flat sides
      const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
      const snoutCircle = new THREE.Mesh(snoutCircleGeometry, cyanMaterial);
      snoutCircle.scale.set(0.8, 0.6, 0.8);
      // Position and rotate the circle to align with the vertical side of the snout
      snoutCircle.position.set(0, 0.84, 0.5); // Adjust position to align with the snout's vertical flat side
      snoutCircle.rotation.y = Math.PI / 2; // Rotate the circle to match the vertical flat side

      // Group the left, right snout halves, and the circle together
      const halfSnoutGroup = new THREE.Group();
      halfSnoutGroup.add(leftSnout);
      halfSnoutGroup.add(rightSnout);
      halfSnoutGroup.add(snoutCircle);

      // Add the snout group to the bear group
      bearGroup.add(halfSnoutGroup);
  
      // Heart shape
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0, 0);
      heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
      heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
      heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
      heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
  
      // Extrude the heart shape into 3D
      const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
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

      // Create the black material for the heart
     const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // Create the small black heart tattoo mesh
      const smallHeart = new THREE.Mesh(heartGeometry, pinkMaterial);
      smallHeart.scale.set(0.1, 0.1, 0.1); // Scale the heart down to be small

      // Rotate the heart by 30 degrees (in radians) and position it on the left side of the bear's face
      smallHeart.rotation.z = THREE.MathUtils.degToRad(210); // Rotate 30 degrees
      smallHeart.rotation.x = THREE.MathUtils.degToRad(5);
      smallHeart.rotation.y = THREE.MathUtils.degToRad(-45);
      smallHeart.position.set(-0.4, 0.9, 0.45); // Position it on the pink side of the face

      // Add the heart to the bear group
      // bearGroup.add(smallHeart);
      const heart = new THREE.Mesh(heartGeometry, bodyMaterial);
      heart.scale.set(0.5, 0.5, 0.5);
      heart.position.set(0.35, 0, 0); // Position it in front of the body
      heart.rotation.y = Math.PI;
      heart.rotation.x = Math.PI;
      bearGroup.add(heart);
  
      const heart1 = new THREE.Mesh(heartGeometry, bigHeartMaterial);
      heart1.scale.set(0.35, 0.35, 0.35);
      heart1.position.set(0.3, 0, 0); // Position it in front of the body
      heart1.rotation.y = Math.PI;
      heart1.rotation.x = Math.PI;
      // bearGroup.add(heart1);
      
      const heart2 = new THREE.Mesh(heartGeometry, hotPinkHeartMaterial);
      heart2.scale.set(0.25, 0.25, 0.25);
      heart2.position.set(0.27, 0.2, 0); // Position it in front of the body
      heart2.rotation.y = Math.PI;
      heart2.rotation.x = Math.PI;
      // bearGroup.add(heart2);

      const heart3 = new THREE.Mesh(heartGeometry, redHeartMaterial);
      heart3.scale.set(0.3, 0.3, 0.3);
      heart3.position.set(0.23, -0.5, 0.3); // Position it in front of the body
      heart3.rotation.y = Math.PI;
      heart3.rotation.x = Math.PI;
      // bearGroup.add(heart3);
      
      const heart4 = new THREE.Mesh(heartGeometry, bodyMaterial);
      heart4.scale.set(0.4, 0.4, 0.4);
      heart4.position.set(0.27, 0, 0.35); // Position it in front of the body
      heart4.rotation.y = Math.PI;
      heart4.rotation.x = Math.PI;
      // bearGroup.add(heart4);
      
      // Bear arms
      const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
      const leftArm = new THREE.Mesh(armGeometry, cyanMaterial);
      leftArm.scale.set(0.75, 1.25, 0.65);
      leftArm.position.set(-0.7, -0.15, 0.2);
      bearGroup.add(leftArm);
  
      const rightArm = new THREE.Mesh(armGeometry, transparentMaterial);
      rightArm.scale.set(0.75, 1.25, 0.65);
      rightArm.position.set(0.7, -0.15, 0.2);
      bearGroup.add(rightArm);
  
      // Bear legs
      const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
      const leftLeg = new THREE.Mesh(legGeometry, cyanMaterial);
      leftLeg.position.set(-0.4, -1.05, 0);
      bearGroup.add(leftLeg);
  
      const rightLeg = new THREE.Mesh(legGeometry, transparentMaterial);
      rightLeg.position.set(0.4, -1.05, 0);
      bearGroup.add(rightLeg);
  
      // Define the boot front geometry
      const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
    
      // Left boot front
      const leftBootFront = new THREE.Mesh(bootFrontGeometry, cyanMaterial);
      leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
      leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
      bearGroup.add(leftBootFront);
    
      // Right boot front
      const rightBootFront = new THREE.Mesh(bootFrontGeometry, transparentMaterial);
      rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
      rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
      bearGroup.add(rightBootFront);
  
      // Create rounded buttocks
      const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
      const leftButtock = new THREE.Mesh(buttockGeometry, cyanMaterial);
      leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
      bearGroup.add(leftButtock);
  
      const rightButtock = new THREE.Mesh(buttockGeometry, transparentMaterial);
      rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
      bearGroup.add(rightButtock);
  
      // Bear tail
      const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
      const tail = new THREE.Mesh(tailGeometry, pinkMaterial);
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

    // Update heart renderOrder to ensure it's always drawn last

    tail.renderOrder = 1;

    // Add bear group to the scene
    bearGroup.scale.set(1.2, 1.2, 1.2); 
    scene.add(bearGroup);

 // Set initial positions for bearGroup and camera
    bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
    camera.position.set(props.bodyPosition.x, 1, props.cameraPosition);
    camera.lookAt(props.bodyPosition.x, 0, 0);

    camera.position.z = 4;

    // New mouse tracking functionality
    const mouse = { x: 0, y: 0 };
    let isAnimating = true;  // To track if the bear should be rotating
    let timeoutId: any = null;  // To track the timeout when resuming the animation

    // Update bearGroup rotation based on mouse movement
    const onMouseMove = (event: MouseEvent) => {
      isAnimating = false;
      // Normalize mouse coordinates from -1 to 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate rotation based on mouse position
      const targetRotationY = mouse.x * Math.PI * 0.2; // Y-axis rotation (left-right)
      const targetRotationX = mouse.y * Math.PI * 0.2; // X-axis rotation (up-down)

      // Apply the calculated rotation to the bear group
      bearGroup.rotation.y = targetRotationY;
      bearGroup.rotation.x = targetRotationX;

      // Clear the existing timeout and set a new one for 3 seconds to resume the animation
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isAnimating = true; // Resume animation after 3 seconds
      }, 500);
    };

    // Add event listener for mouse movement
    window.addEventListener('mousemove', onMouseMove);
      
      // Animation function
      function animate() {
        requestAnimationFrame(animate);

        if (isAnimating) {
        bearGroup.rotation.y += 0.03; // Rotate the bear slightly on the Y-axis
      }
        renderer.render(scene, camera);
      }
  
      bigHeartMaterial.uniforms.time.value += 0.04; // Same animation speed

      // Start animation
      animate();

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
  .three-canvas {
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.8), rgba(135, 206, 250, 0.8), rgba(254, 0, 127, 0.993));
    background-size: 200% 200%;
    background-repeat: no-repeat;
    animation: heartTunnel 1s infinite linear;
  }
  
  /* Keyframes for heart tunnel-like animation */
  @keyframes heartTunnel {
    0% {
      background-size: 150% 150%;
      background-position: center;
    }
    50% {
      background-size: 100% 100%;
      background-position: center;
    }
    100% {
      background-size: 150% 150%;
      background-position: center;
    }
  }

  .three-container {
    background-color: transparent;
  }

  .no-bg {
          margin: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: none;  
        }
        
  </style>
  