<template>
    <div ref="threeCanvas" :class="background? 'no-bg':'three-canvas'"></div>
    <div class="pixel-controls">
    <button class="pixel-btn up border-gold" @mousedown="onUpButtonDown" @mouseup="stopRotation">▲</button>
    <div class="side-buttons">
      <button class="pixel-btn left border-silver" @mousedown="onLeftButtonDown" @mouseup="stopRotation">◀</button>
      <button class="pixel-btn right border-silver" @mousedown="onRightButtonDown" @mouseup="stopRotation">▶</button>
    </div>
    <button class="pixel-btn down border-gold" @mousedown="onDownButtonDown" @mouseup="stopRotation">▼</button>
  </div>
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
  
        // renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // renderer.toneMappingExposure = 1.25;
        
        threeCanvas.value.appendChild(renderer.domElement);
            // Create the bear group and all parts
        const bearGroup = new THREE.Group();
        
        // Ambient Light (provides soft overall illumination)
        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Stronger ambient light
        scene.add(ambientLight);

        // Directional Light (for strong highlights)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Increase intensity
        directionalLight.position.set(5, 5, 5); // Position it above and to the side of the object
        scene.add(directionalLight);

        // Point Light (for localized bright spots)
        const pointLight = new THREE.PointLight(0xffffff, 5, 50); // Strong point light
        pointLight.position.set(0, 2, 4); // Close to the object
        scene.add(pointLight);

        // Load gradient-like texture
        const textureLoader = new THREE.TextureLoader();
        const circleMap = textureLoader.load('/3d-bear-arts/assets/cashwings.jpg');

        // Configure cube render target for reflections
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
          format: THREE.RGBAFormat,
          generateMipmaps: true,
          minFilter: THREE.LinearMipmapLinearFilter,
        });

        // Create CubeCamera with the correct WebGLCubeRenderTarget
        const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

        // Transparent reflective material using gradient texture as envMap
        const transparentBlurrMaterial = new THREE.MeshPhysicalMaterial({
          color: 'sliver',   // Silver color for transparency
          metalness: 1.0,    // Full metalness for reflectivity
          roughness: 0.05,   // Lower roughness for sharper reflections
          clearcoat: 1.0,    // High clearcoat for added shine
          clearcoatRoughness: 0.1, // Low clearcoat roughness for shininess
          transparent: true,  // Enable transparency
          opacity: 0.4,      // Semi-transparent
          envMap: cubeRenderTarget.texture,  // Use cube render target texture for reflections
          envMapIntensity: 1.5, // Increase reflection intensity
        });

        // Add the cubeCamera and bear group to the scene
        scene.add(cubeCamera);
        scene.environment = cubeRenderTarget.texture;  // Set environment map for reflections

        // Update reflections regularly
        function updateReflection() {
          bearGroup.visible = false;  // Hide bear during cube camera reflection capture
          cubeCamera.update(renderer, scene);  // Update cube camera to reflect environment
          bearGroup.visible = true;   // Show the bear again
          requestAnimationFrame(updateReflection);
        }
        updateReflection();  // Start reflection updates

        const mirrorLoader = new THREE.CubeTextureLoader();

        const environmentMap = mirrorLoader.load([
          '/3d-bear-arts/assets/christmas_garden.jpg',
          '/3d-bear-arts/assets/christmas_ground.jpg',
          '/3d-bear-arts/assets/christmas_front.jpg',
          '/3d-bear-arts/assets/christmas_house.jpg',
          '/3d-bear-arts/assets/christmas_tree.jpg',
          '/3d-bear-arts/assets/christmas_sky.jpg'
        ]);
        
        const environmentMap2 = mirrorLoader.load([
          '/3d-bear-arts/assets/cash2.jpg',
          '/3d-bear-arts/assets/cash8.jpg',
          '/3d-bear-arts/assets/cash1.jpg',
          '/3d-bear-arts/assets/cash11.jpg',
          '/3d-bear-arts/assets/cash4.jpg',
          '/3d-bear-arts/assets/cash3.jpg'
        ]);
        
        scene.environment = environmentMap;

        const environmentMap1 = mirrorLoader.load([
          '/3d-bear-arts/assets/cashwings.jpg',
          '/3d-bear-arts/assets/cashwings.jpg',
          '/3d-bear-arts/assets/cashwings.jpg',
          '/3d-bear-arts/assets/cashwings.jpg',
          '/3d-bear-arts/assets/cashwings.jpg',
          '/3d-bear-arts/assets/cashwings.jpg'
        ]);
        
        scene.environment = environmentMap1;
          
        const sliverMaterial = new THREE.MeshPhysicalMaterial({
          color: 'white', // Silver color
          metalness: 1.0,  // Full metalness for maximum reflectivity
          roughness: 0.05, // Low roughness for sharper reflections
          clearcoat: 1.0,  // High clearcoat for added shine
          clearcoatRoughness: 0.05, // Low clearcoat roughness for more shine
          envMap: environmentMap, // Link the environment map
          reflectivity: 1, // Maximum reflectivity
        });

        const circleMaterial = new THREE.MeshPhysicalMaterial({
          color: 'sliver', // Silver color
          metalness: 1.0,  // Full metalness for maximum reflectivity
          roughness: 0.05, // Low roughness for sharper reflections
          clearcoat: 1.0,  // High clearcoat for added shine
          clearcoatRoughness: 0.05, // Low clearcoat roughness for more shine
          envMap: environmentMap1, // Link the environment map
          reflectivity: 1, // Maximum reflectivity
        });

        const transparentCircleMaterial = new THREE.MeshPhysicalMaterial({
            color: 'sliver',  // Bright yellow color for the head
            map: circleMap,  // Apply a halftone or abstract texture
            metalness: 0.3,  // Slight metalness for a subtle shine
            roughness: 0.5,  // Some roughness to reduce reflections
            transparent: true,
            opacity: 1
        });

        //Import to keep this sliver material
        const transparentSliverMaterial = new THREE.MeshPhysicalMaterial({
          color: 'white', // Silver color
          metalness: .75, // High metalness
          roughness: 0.05, // Low roughness for reflective effect
          clearcoat: 1.0, // High clearcoat for added shine
          clearcoatRoughness: 0.05, // Low roughness for clear reflections
          transparent: true, // Enable transparency
          opacity: 0.3, // Semi-transparent
          envMap: environmentMap, // Link the environment map
          reflectivity: 0, // Maximum reflectivity
        });

        const transparentMaterial = new THREE.MeshPhysicalMaterial({
          color: 'white', // Silver color
          metalness: .75, // High metalness
          roughness: 0.05, // Low roughness for reflective effect
          clearcoat: 1.0, // High clearcoat for added shine
          clearcoatRoughness: 0.05, // Low roughness for clear reflections
          transparent: true, // Enable transparency
          opacity: 0.7, // Semi-transparent
          envMap: environmentMap, // Link the environment map
          reflectivity: 0, // Maximum reflectivity
        });

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

      const vertexShader1 = `
      varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
      `;
  
        const fragmentShader1 = `
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
                vec3 color1 = vec3(1.0, 0.078, 0.576); 
                vec3 color2 = vec3(0.3, 0.6, 1.0); // Blueish
                vec3 color3 = vec3(1.0, 0.0, 0.8); 
        
                // Mix the colors based on wave and angle for a dynamic effect
                vec3 color = mix(color1, color2, wave);
                color = mix(color, color3, sin(angle + time) * 0.5 + 0.5);
        
                // Set the fragment color with opacity
                gl_FragColor = vec4(color, opacity); // Use the opacity uniform for transparency
            }
      `;
  
      const pinkSliverHeartMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }, // Time uniform to animate the shader
            opacity: { value: 1 } // Opacity uniform (set to 0.6 for 60% transparency)
        },
        vertexShader:vertexShader1,
        fragmentShader:fragmentShader1,
        transparent: false, // Enable transparency in the material
        depthWrite: true // Disable depth writing to ensure proper rendering
    });

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
  
      const bluePinkHeartMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }, // Time uniform to animate the shader
            opacity: { value: 1 } // Opacity uniform (set to 0.6 for 60% transparency)
        },
        vertexShader,
        fragmentShader:fragmentShader,
        transparent: false, // Enable transparency in the material
        depthWrite: true // Disable depth writing to ensure proper rendering
    });

      // Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(
            1,            // Radius
            32,           // Width segments
            32,           // Height segments
            0,            // phiStart
            Math.PI       // phiLength (half of the sphere)
        );

      const rightBody = new THREE.Mesh(bodyGeometry, transparentSliverMaterial);
      const leftBody = new THREE.Mesh(bodyGeometry, sliverMaterial);
  
      rightBody.scale.set(0.85, 0.85, 0.8);
      leftBody.scale.set(0.85, 0.85, 0.8);
  
      rightBody.position.y = -0.2;
      leftBody.position.y = -0.2;
  
      rightBody.rotation.y = Math.PI / 2;
      leftBody.rotation.y = Math.PI * 1.5;
  
      // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, sliverMaterial);
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
        const leftHead = new THREE.Mesh(headGeometry, sliverMaterial);
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
        const headCircle = new THREE.Mesh(headCircleGeometry, sliverMaterial);
  
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
        const leftEar = new THREE.Mesh(earGeometry, sliverMaterial);
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
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, sliverMaterial);
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
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, transparentCircleMaterial);
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
    
        const extrudeHeartSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);
        
        const heart = new THREE.Mesh(heartGeometry, sliverMaterial);
        heart.scale.set(0.23, 0.23, 0.23);
        heart.position.set(0.25, 1.2, 0);
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        // bearGroup.add(heart);
        
        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, sliverMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
    
        const rightArm = new THREE.Mesh(armGeometry, transparentMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
    
        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, sliverMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
    
        const rightLeg = new THREE.Mesh(legGeometry, transparentMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
    
        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
      
        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, sliverMaterial);
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
        const leftButtock = new THREE.Mesh(buttockGeometry, sliverMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);
    
        const rightButtock = new THREE.Mesh(buttockGeometry, transparentMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);
    
        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, sliverMaterial);
        tail.position.set(0, -0.35, -0.8);
        bearGroup.add(tail);
        tail.renderOrder = 1;
    
        // Load font and create 3D text
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        const xEyeGeometry = new TextGeometry('X', {
            font: font,
            size: 0.18, // Size of the X
            depth: 0.05,
         });
        
        const xEye = new THREE.Mesh(xEyeGeometry, sliverMaterial);
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
  
        const oEye = new THREE.Mesh(oEyeGeometry, sliverMaterial);
        oEye.position.set(0.13, .99, 0.53); // Position on the head
        oEye.rotation.y = THREE.MathUtils.degToRad(12);
        oEye.rotation.x = THREE.MathUtils.degToRad(-5);
        bearGroup.add(oEye);
      });

      function createVerticalStripedTexture() {
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');

    canvas.width = 512; // Width of the texture
    canvas.height = 512; // Height of the texture

    const stripeWidth = canvas.width / 10; // Width of each stripe

    // Draw alternating red and white vertical stripes
    for (let i = 0; i < 10; i++) {
        context.fillStyle = i % 2 === 0 ? '#FF0000' : '#FFFFFF'; // Red and white
        context.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
    texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
    texture.repeat.set(1, 0); // Adjust to scale the stripes vertically

    return texture;
}

// Create striped material for the scarf
// Create striped material for the scarf
const verticalStripedTexture = createVerticalStripedTexture();
const scarfMaterial = new THREE.MeshStandardMaterial({
    map: verticalStripedTexture,
    metalness: 0.1,
    roughness: 0.8,
});

// Create a half-circle geometry for the scarf
const rightHalfScarfGeometry = new THREE.TorusGeometry(0.5, 0.1, 24, 100, Math.PI); // Half-circle arc
const rightHalfScarf = new THREE.Mesh(rightHalfScarfGeometry, scarfMaterial);

// Position and rotate the scarf correctly
rightHalfScarf.position.set(0, 0.54, 0); // Align around the neck
rightHalfScarf.rotation.x = Math.PI / 2; // Rotate for a horizontal orientation
rightHalfScarf.rotation.y = Math.PI / 1; // Rotate to the right side
rightHalfScarf.rotation.z = Math.PI / -2;
// Add to the bear group
bearGroup.add(rightHalfScarf);



function createSnowman() {
    const snowmanGroup = new THREE.Group();
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const coalMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const carrotMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const scarfMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Snowman Body Parts
    const bottomSphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), snowMaterial);
    bottomSphere.position.set(0, 0.6, 0);
    snowmanGroup.add(bottomSphere);

    const middleSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), snowMaterial);
    middleSphere.position.set(0, 1.2, 0);
    snowmanGroup.add(middleSphere);

    const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), snowMaterial);
    headSphere.position.set(0, 1.7, 0);
    snowmanGroup.add(headSphere);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
    leftEye.position.set(-0.1, 1.75, 0.25);
    snowmanGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
    rightEye.position.set(0.1, 1.75, 0.25);
    snowmanGroup.add(rightEye);

    // Carrot Nose
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.2, 32);
    const nose = new THREE.Mesh(noseGeometry, carrotMaterial);
    nose.position.set(0, 1.7, 0.35);
    nose.rotation.x = Math.PI / 2;
    snowmanGroup.add(nose);

    // Buttons
    for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
        button.position.set(0, 1.0 - i * 0.3, 0.4);
        snowmanGroup.add(button);
    }

    // Scarf
    const scarfGeometry = new THREE.TorusGeometry(0.3, 0.08, 16, 100);
    const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
    scarf.position.set(0, 1.45, 0);
    scarf.rotation.x = Math.PI / 2;
    snowmanGroup.add(scarf);

    const scarfTailGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
    const scarfTail = new THREE.Mesh(scarfTailGeometry, scarfMaterial);
    scarfTail.position.set(0.25, 1.3, 0);
    snowmanGroup.add(scarfTail);

    // Top Hat
    const hatBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
    hatBase.position.set(0, 1.9, 0);
    snowmanGroup.add(hatBase);

    const hatTopGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32);
    const hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
    hatTop.position.set(0, 2.05, 0);
    snowmanGroup.add(hatTop);

    return snowmanGroup;
}

  const snowman = createSnowman();
  snowman.scale.set(0.38, 0.38, 0.38);
  snowman.position.set(0.3, -0.45, 0);
  bearGroup.add(snowman);

  function createSnowman2() {
    const snowmanGroup = new THREE.Group();

    // Materials
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const coalMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const carrotMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const scarfMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Snowman Body Parts
    const bottomSphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), sliverMaterial);
    bottomSphere.position.set(0, 0.6, 0);
    snowmanGroup.add(bottomSphere);

    const middleSphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), sliverMaterial);
    middleSphere.position.set(0, 1.2, 0);
    snowmanGroup.add(middleSphere);

    const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), sliverMaterial);
    headSphere.position.set(0, 1.7, 0);
    snowmanGroup.add(headSphere);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
    leftEye.position.set(-0.1, 1.75, 0.25);
    snowmanGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
    rightEye.position.set(0.1, 1.75, 0.25);
    snowmanGroup.add(rightEye);

    // Carrot Nose
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.2, 32);
    const nose = new THREE.Mesh(noseGeometry, carrotMaterial);
    nose.position.set(0, 1.7, 0.35);
    nose.rotation.x = Math.PI / 2;
    snowmanGroup.add(nose);

    // Buttons
    for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), coalMaterial);
        button.position.set(0, 1.0 - i * 0.3, 0.4);
        snowmanGroup.add(button);
    }

    // Scarf
    const scarfGeometry = new THREE.TorusGeometry(0.3, 0.08, 16, 100);
    const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
    scarf.position.set(0, 1.45, 0);
    scarf.rotation.x = Math.PI / 2;
    snowmanGroup.add(scarf);

    const scarfTailGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
    const scarfTail = new THREE.Mesh(scarfTailGeometry, scarfMaterial);
    scarfTail.position.set(0.25, 1.3, 0);
    snowmanGroup.add(scarfTail);

    // Top Hat
    const hatBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
    hatBase.position.set(0, 1.9, 0);
    snowmanGroup.add(hatBase);

    const hatTopGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32);
    const hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
    hatTop.position.set(0, 2.05, 0);
    snowmanGroup.add(hatTop);

    return snowmanGroup;
}
  const snowman2 = createSnowman2();
  snowman2.scale.set(0.2, 0.2, 0.2);
  snowman2.position.set(0.5, -0.3, 0.3);
  bearGroup.add(snowman2);

  const snowman3 = createSnowman2();
  snowman3.scale.set(0.12, 0.12, 0.12);
  snowman3.position.set(0.2, -0.3, 0.5);
  bearGroup.add(snowman3);

function createAngel() {
    const angelGroup = new THREE.Group();

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White for the body
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE4C4 }); // Light skin tone for the head
    const haloMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 }); // Golden halo
    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xF8F8FF, // Light ghost white for wings
    });

    // Head
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.5, 0);
    angelGroup.add(head);

    // Body (Slender Cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.35, 0.6, 32);
    const body = new THREE.Mesh(bodyGeometry, headMaterial);
    body.position.set(0, 1, 0);
    angelGroup.add(body);

    // Wings (Curved and Open)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.bezierCurveTo(0.5, 0.2, 0.8, 0.7, 0.5, 1.5); // Outer curve
    wingShape.bezierCurveTo(0.3, 1.3, 0, 0.8, 0, 0); // Inner curve

    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.05,
        bevelEnabled: false,
    });

    // Left Wing
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.2, 1.2, -0.05); // Mirrored position
    leftWing.rotation.y = Math.PI / 12; // Mirrored backward tilt
    leftWing.rotation.z = Math.PI / 4; // Mirrored vertical tilt
    leftWing.scale.set(-0.5, 0.5, 0.5); // Flip on the X-axis
    angelGroup.add(leftWing);

    const leftWing1 = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing1.position.set(-0.1, 1.1, -0.05); // Mirrored position
    leftWing1.rotation.y = Math.PI / 10; // Mirrored backward tilt
    leftWing1.rotation.z = Math.PI / 3; // Mirrored vertical tilt
    leftWing1.scale.set(-0.5, 0.5, 0.5); // Flip on the X-axis
    angelGroup.add(leftWing1);

    const leftWing2 = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing2.position.set(0, 1, -0.05); // Mirrored position
    leftWing2.rotation.y = Math.PI / 8; // Mirrored backward tilt
    leftWing2.rotation.z = Math.PI / 2.5; // Mirrored vertical tilt
    leftWing2.scale.set(-0.5, 0.5, 0.5); // Flip on the X-axis
    angelGroup.add(leftWing2);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.2, 1.2, -0.05); // Positioned closer to the body
    rightWing.rotation.y = -Math.PI / 12; // Slight backward tilt
    rightWing.rotation.z = -Math.PI / 4; // More vertical
    rightWing.scale.set(0.5, 0.5, 0.5);; // Flip for symmetry
    angelGroup.add(rightWing);

    const rightWing1 = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing1.position.set(0.1, 1.1, -0.05); // Positioned closer to the body
    rightWing1.rotation.y = -Math.PI / 10; // Slight backward tilt
    rightWing1.rotation.z = -Math.PI / 3; // More vertical
    rightWing1.scale.set(0.5, 0.5, 0.5);; // Flip for symmetry
    angelGroup.add(rightWing1);

    const rightWing2 = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing2.position.set(0, 1, -0.05); // Positioned closer to the body
    rightWing2.rotation.y = -Math.PI / 8; // Slight backward tilt
    rightWing2.rotation.z = -Math.PI / 2.5; // More vertical
    rightWing2.scale.set(0.5, 0.5, 0.5);; // Flip for symmetry
    angelGroup.add(rightWing2);

    // Halo
    const haloGeometry = new THREE.TorusGeometry(0.15, 0.05, 16, 100);
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.set(0, 1.8, 0);
    halo.rotation.x = Math.PI / 2;
    angelGroup.add(halo);


    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 32); // Cylinder shape for the legs

    // Left leg
    const leftLeg = new THREE.Mesh(legGeometry, headMaterial);
    leftLeg.position.set(-0.15, 0.55, 0); // Adjust position (left of the body)
    leftLeg.rotation.z = Math.PI / 1;    // Slight angle

    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, headMaterial);
    rightLeg.position.set(0.15, 0.55, 0); // Adjust position (right of the body)
    rightLeg.rotation.z = -Math.PI / 1;  // Slight angle

    // Add legs to the bear group
    angelGroup.add(leftLeg);
    angelGroup.add(rightLeg);

return angelGroup;

}

  let angle1 = 0; // For the first angel
  let angle2 = Math.PI; // Offset by 180 degrees for the second angel (to keep distance)
  let verticalOffset1 = 0;
  let verticalOffset2 = 0;
  let verticalDirection1 = 1;
  let verticalDirection2 = -1;

  function animateTwoAngels() {
      requestAnimationFrame(animateTwoAngels);

      const radius = 1.5; // Circular motion radius
      const verticalRange = 0.5; // Vertical motion range

      // Update the first angel
      angle1 += 0.03; // Circular speed for the first angel
      verticalOffset1 += 0.005 * verticalDirection1;
      if (verticalOffset1 > verticalRange) verticalDirection1 = -1;
      if (verticalOffset1 < -verticalRange) verticalDirection1 = 1;

      angel.position.x = Math.cos(angle1) * radius;
      angel.position.z = Math.sin(angle1) * radius;
      angel.position.y = verticalOffset1 + 1; // Vertical movement

      // Update the second angel
      angle2 += 0.03; // Same circular speed as the first angel
      verticalOffset2 += 0.005 * verticalDirection2;
      if (verticalOffset2 > verticalRange) verticalDirection2 = -1;
      if (verticalOffset2 < -verticalRange) verticalDirection2 = 1;

      angel2.position.x = Math.cos(angle2) * radius;
      angel2.position.z = Math.sin(angle2) * radius;
      angel2.position.y = verticalOffset2 + 1; // Vertical movement

      // Ensure the angels always face the bear
      angel.lookAt(bearGroup.position);
      angel2.lookAt(bearGroup.position);

      renderer.render(scene, camera);
  }

  // Add the first angel
  const angel = createAngel();
  angel.scale.set(0.4, 0.4, 0.4);
  scene.add(angel);

  // Add the second angel
  const angel2 = createAngel();
  angel2.scale.set(0.4, 0.4, 0.4);
  scene.add(angel2);

  // Start the animation
  animateTwoAngels();


const snowHalfSphereGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);

const snowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,       // Pure white for snow color
    metalness: 0.1,        // Low metalness for a slight shimmer
    roughness: 0.9,        // High roughness for a frosty appearance
    clearcoat: 0.5,        // Clearcoat for a subtle reflective layer
    clearcoatRoughness: 0.7, // Rougher clearcoat for a diffuse reflection
    transparent: false,         // Enable transparency
    opacity: 0.85,  
});

const snowMesh = new THREE.Mesh(snowHalfSphereGeometry, snowMaterial);
snowMesh.position.set(0, -0.2, 0); // Align with body position
snowMesh.rotation.x = Math.PI;     // Face upwards
snowMesh.scale.set(1.25, 1.25, 1.25);

// Add snow mesh to halfSphereGroup
halfSphereGroup.add(snowMesh);

// Snow Circle (top layer to cover the flat surface)
const snowCircleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,       // Pure white color
    metalness: 0.1,        // Slight shimmer
    roughness: 0.9,        // High roughness for a powdery snow look
    clearcoat: 0.6,        // Adds slight glossiness on the surface
    clearcoatRoughness: 0.8, // Slightly rough gloss for snow
    side: THREE.DoubleSide,
    transparent: false,
    opacity: 0.8,
});

const snowCircle = new THREE.Mesh(circleGeometry, snowCircleMaterial);
snowCircle.scale.set(0.7, 0.7, 0.7);
snowCircle.position.set(0, -0.3, 0);
snowCircle.rotation.x = Math.PI / 2;
snowCircle.renderOrder = 1; // Ensures it renders on top

// Add to the bear group
halfSphereGroup.add(snowCircle);

// Combine and add to bearGroup
bearGroup.add(halfSphereGroup);

// Optional: Slight shimmer on the surface to simulate sparkling snowflakes
const shimmerMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        u_time: { value: 0.0 },
    },
    vertexShader: `
        precision mediump float;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;
        uniform float u_time;
        varying vec2 vUv;

        void main() {
            float shimmer = sin(u_time * 5.0 + vUv.x * 10.0) * 0.1;
            vec3 color = vec3(1.0) * (0.9 + shimmer); // Bright white with subtle shimmer
            gl_FragColor = vec4(color, 0.8); // Slight transparency for a soft overlay
        }
    `,
});

// Shimmering surface to add a soft snow sparkle effect
const shimmerSurface = new THREE.Mesh(circleGeometry, shimmerMaterial);
shimmerSurface.position.set(0, -0.2, 0); // Center position
shimmerSurface.scale.set(0.7, 0.7, 0.7);
shimmerSurface.rotation.x = -Math.PI / 2; // Face the camera
shimmerSurface.renderOrder = 2; // Render on top of snow circle

// Add shimmer surface to half sphere group
halfSphereGroup.add(shimmerSurface);

const snowflakeCount = 1000;
      const snowflakeGeometry = new THREE.BufferGeometry();
      const snowflakePositions = [];

      // Generate random positions for each snowflake
      for (let i = 0; i < snowflakeCount; i++) {
          const x = (Math.random() - 0.5) * 20;
          const y = Math.random() * 20;
          const z = (Math.random() - 0.5) * 20;
          snowflakePositions.push(x, y, z);
      }

      // Assign positions to geometry
      snowflakeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowflakePositions, 3));

      // Snowflake Material
      const snowflakeMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.1,
          transparent: true,
          opacity: 0.8,
      });

      // Create Points (particles) for snowflakes and add to bearGroup
      const snowflakes = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
      bearGroup.add(snowflakes);

      function animateSnowFlake() {
          requestAnimationFrame(animateSnowFlake); // Recursive call to keep the animation loop running

          // Access the positions attribute directly for performance
          const positions = snowflakeGeometry.attributes.position.array;

          // Loop through each snowflake and update its Y position
          for (let i = 1; i < positions.length; i += 3) {
              positions[i] -= 0.02; // Move snowflake downward

              // Reset snowflake to the top once it reaches the ground
              if (positions[i] < -10) {
                  positions[i] = 10;
              }
          }

          // Mark position attribute as needing an update
          snowflakeGeometry.attributes.position.needsUpdate = true;

          // Render the scene
          renderer.render(scene, camera);
      }

      // Start the snowflake animation
      animateSnowFlake();
      // Add bear group to the scene
      bearGroup.scale.set(1.2, 1.2, 1.2);
      scene.add(bearGroup);


  
      // Add bear group to the scene
      bearGroup.scale.set(1.4, 1.4, 1.4);
      scene.add(bearGroup);

      // Set initial positions for bearGroup and camera
      bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
      camera.position.set(props.bodyPosition.x, 1.4, props.cameraPosition);
      camera.lookAt(props.bodyPosition.x, 0, 0);

      camera.position.z = 4;
  
      const mouse = { x: 0, y: 0 };
      let isAnimating = true;  // To track if the bear should be rotating
      let timeoutId: any = null;  // To track the timeout when resuming the animation
      let currentRotationY = 0;   // Current rotation for Y-axis
      let currentRotationX = 0;   // Current rotation for X-axis
      // let isRotatingRight = ref(false); // Is rotating to right
      // let isRotatingLeft = ref(false);  // Is rotating to left
      let shouldFaceMouse = ref(false); // Should bear face the mouse?

      const storeCurrentRotation = () => {
        currentRotationY = bearGroup.rotation.y;
        currentRotationX = bearGroup.rotation.x;
      };
    
      // const startRotateRight = () => {
      //   isRotatingRight.value = true;
      //   isRotatingLeft.value = false;
      //   shouldFaceMouse.value = false;
      // };

      // const startRotateLeft = () => {
      //   isRotatingRight.value = false;
      //   isRotatingLeft.value = true;
      //   shouldFaceMouse.value = false;
      // };

      // // Stop all rotations
      // const stopRotation = () => {
      //   isRotatingRight.value = false;
      //   isRotatingLeft.value = false;
      //   storeCurrentRotation();
      // };

      // Update the logic to store the current rotation when the mouse stops
      const handleMouseStop = (mouseX: number) => {
      const centerX = window.innerWidth / 2;

      // If mouse stops on the right side, rotate to right, otherwise to the left
      // if (mouseX > centerX) {
      //   startRotateRight();
      // } else {
      //   startRotateLeft();
      // }

      // Capture the current rotation of the bear when the mouse stops
      storeCurrentRotation();
    };

    // Logic to update bear rotation based on the mouse movement
    const onMouseMove = (event: MouseEvent) => {
      clearTimeout(timeoutId);
      stopRotation(); // Stop any ongoing rotation when mouse moves

      shouldFaceMouse.value = true; // Allow the bear to face the mouse

      // Capture the mouse position
      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };

      // Rotate the bear to face the mouse
      if (shouldFaceMouse.value) {
        const targetRotationY = mouse.x * Math.PI * 0.2;
        const targetRotationX = mouse.y * Math.PI * 0.2;
        bearGroup.rotation.y = targetRotationY;
        bearGroup.rotation.x = targetRotationX;

        // Store the current rotation
        currentRotationY = targetRotationY;
        currentRotationX = targetRotationX;
      }

      // Set a delay to trigger the stop logic again after no movement
      timeoutId = setTimeout(() => {
        shouldFaceMouse.value = false; // Stop facing the mouse after 2 seconds of no movement
        handleMouseStop(event.clientX);
      }, 500); // 2 seconds delay before rotating
    };
  
      // Add event listener for mouse movement
      // window.addEventListener('mousemove', onMouseMove);

      // Logic to trigger the bear facing the mouse (after 2 seconds of no movement)
    const onMouseStopForFacing = (event: MouseEvent) => {
      if (shouldFaceMouse.value) {
        const mouse = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1
        };

        const targetRotationY = mouse.x * Math.PI * 0.2;
        const targetRotationX = mouse.y * Math.PI * 0.2;

        bearGroup.rotation.y = targetRotationY;
        bearGroup.rotation.x = targetRotationX;
      }
    };

    window.addEventListener('mousemove', onMouseStopForFacing);
        
       function animate() {
          requestAnimationFrame(animate);
          bluePinkHeartMaterial.uniforms.time.value += 0.05;
          pinkSliverHeartMaterial.uniforms.time.value += 0.05;

          if (isRotatingRight.value) bearGroup.rotation.y += 0.05;
          if (isRotatingLeft.value) bearGroup.rotation.y -= 0.07;
          if (isRotatingUp.value) bearGroup.rotation.x -= 0.05;
          if (isRotatingDown.value) bearGroup.rotation.x += 0.05;


        // if (isRotatingRight.value) {
        //   bearGroup.rotation.y += 0.03; 
        // } else if (isRotatingLeft.value) {
        //   bearGroup.rotation.y -= 0.03;
        // }
          renderer.render(scene, camera);
        }
    
        bigHeartMaterial.uniforms.time.value += 0.04; 
  
        animate();
  
      watch(() => props.bodyPosition, (newPos) => {
        bearGroup.position.set(newPos.x, newPos.y, newPos.z);
      });
  
      watch(() => props.cameraPosition, (newPos) => {
        camera.position.set(props.bodyPosition.x, 1, newPos);
        camera.lookAt(props.bodyPosition.x, 0, 0);
      });
    
        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      }
    });

        let isRotatingRight = ref(false); // Flag for right rotation
        let isRotatingLeft = ref(false);  // Flag for left rotation
        let isRotatingUp = ref(false);    // Flag for up rotation
        let isRotatingDown = ref(false);  // Flag for down rotation

        function onLeftButtonDown() {          
          isRotatingLeft.value = true;
        }

        function onRightButtonDown() {
          isRotatingRight.value = true;
        }

        function onUpButtonDown() {
          isRotatingUp.value = true;
        }

        function onDownButtonDown() {
          isRotatingDown.value = true;
        }

        function stopRotation() {
          isRotatingLeft.value = false;
          isRotatingRight.value = false;
          isRotatingUp.value = false;
          isRotatingDown.value = false;
        }

        const numConfetti = 15;
      for (let i = 0; i < numConfetti; i++) {
          const confetti = document.createElement('div');
          confetti.classList.add('confetti');
          confetti.style.left = `${Math.random() * 100}vw`;
          confetti.style.animationDuration = `${Math.random() * 3 + 4}s`;
          confetti.style.animationDelay = `${Math.random() * 5}s`;
          document.body.appendChild(confetti);
      }

      // Add twinkling lights
      const numLights = 5;
      for (let i = 0; i < numLights; i++) {
          const light = document.createElement('div');
          light.classList.add('light');
          document.body.appendChild(light);
      }
      
    </script>
    
    <style scoped>
      .three-canvas {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: radial-gradient(circle at 50% 50%, #edc0d6, #b8d1f1, #f2bfe8, #FFFFFF);
        /* background-color: rgba(0, 0, 0, 0.85); */
        background-size: 100% 100%;
        background-repeat: no-repeat;
        animation: waterEffect 5s infinite ease-in-out;
      }
      /* background: radial-gradient(circle at 50% 50%, #FF69B4, #4C99FF, #FF00CC, #000000); */

      /* background: radial-gradient(circle at 50% 50%, #ffffff, #70ebeb, #f097de, #efef9f); */
      
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
  
    .no-bg {
            margin: 0;
              height: 100vh;
              width: 100vw;
              overflow: hidden;
              background: none;  
          }

          .bear-background {
            position: absolute;
            background: rgba(0, 0, 0);
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
          }
          
    .pixel-controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(200%) translateY(-100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .side-buttons {
      display: flex;
      justify-content: space-between;
      width: 120px;
    }

    .pixel-btn {
      width: 50px;
      height: 50px;
      font-size: 24px;
      font-family: "Comic Sans MS", "Arial", sans-serif; /* Pop-art font */
      font-weight: bold;
      color: #FFFFFF; /* Black text for contrast */
      background: #edc0d6; /* Hot pink background */
      border: 3px solid #ffffff; /* White border (default) */
      border-radius: 5px; /* Slightly rounded corners */
      box-shadow: 4px 4px 0px #000000; /* Strong shadow for a comic effect */
      cursor: pointer;
      text-align: center;
      line-height: 50px; /* Center the arrow vertically */
      transition: transform 0.2s ease, border-color 0.3s ease;
    }

    /* Change border colors based on preference */
    .pixel-btn.border-silver {
      border-color: #c0c0c0; /* Silver */
    }

    .pixel-btn.border-gold {
      border-color: #ffd700; /* Gold */
    }

    .pixel-btn:hover {
      transform: translateY(-2px); /* Hover effect */
    }

    .pixel-btn:active {
      transform: translateY(2px); /* Pressed effect */
      box-shadow: 2px 2px 0px #000000; /* Reduced shadow */
    }

    .bear-background {
      position: absolute;
      background: rgba(0, 0, 0);
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      }

</style>