<template>
    <div ref="threeCanvas" :class="background? 'no-bg':'three-canvas'"></div>
      <div class="pixel-controls">
        <button class="pixel-btn up" @mousedown="onUpButtonDown" @mouseup="stopRotation">UP</button>
        <div class="side-buttons">
          <button class="pixel-btn left" @mousedown="onLeftButtonDown" @mouseup="stopRotation">LEFT</button>
          <button class="pixel-btn right" @mousedown="onRightButtonDown" @mouseup="stopRotation">RIGHT</button>
        </div>
       <button class="pixel-btn down" @mousedown="onDownButtonDown" @mouseup="stopRotation">DOWN</button>
    </div>
    <div class="directional-buttons">
      <button id="move-north" class="directional-btn north-btn" @mousedown="startWalkingNorth" @mouseup="stopWalking">UP</button>
      <div class="horizontal-buttons">
        <button id="move-west" class="directional-btn west-btn" @mousedown="startWalkingWest" @mouseup="stopWalking">LEFT</button>
        <button id="move-east" class="directional-btn east-btn" @mousedown="startWalkingEast" @mouseup="stopWalking">RIGHT</button>
      </div>
      <button id="move-south" class="directional-btn south-btn" @mousedown="startWalkingSouth" @mouseup="stopWalking">DOWN</button>
  </div>
  <div class="directional-buttons-woman">
    <button class="directional-btn-woman north-btn" @mousedown="startMovingWomanNorth" @mouseup="stopMovingWoman">UP</button>
    <div class="horizontal-buttons-woman">
        <button class="directional-btn-woman west-btn" @mousedown="startMovingWomanWest" @mouseup="stopMovingWoman">LEFT</button>
        <button class="directional-btn-woman east-btn" @mousedown="startMovingWomanEast" @mouseup="stopMovingWoman">RIGHT</button>
    </div>
    <button class="directional-btn-woman south-btn" @mousedown="startMovingWomanSouth" @mouseup="stopMovingWoman">DOWN</button>
</div>
<div class="directional-buttons-kid">
    <button class="directional-btn-kid north-btn" @mousedown="startMovingKidNorth" @mouseup="stopMovingKid">UP</button>
    <div class="horizontal-buttons-kid">
        <button class="directional-btn-kid west-btn" @mousedown="startMovingKidWest" @mouseup="stopMovingKid">LEFT</button>
        <button class="directional-btn-kid east-btn" @mousedown="startMovingKidEast" @mouseup="stopMovingKid">RIGHT</button>
    </div>
    <button class="directional-btn-kid south-btn" @mousedown="startMovingKidSouth" @mouseup="stopMovingKid">DOWN</button>
</div>
</template>

    <script setup lang="ts">
    import { ref, onMounted, watch, shallowRef } from 'vue';
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
        let isRotatingRight = ref(false); // Flag for right rotation
        let isRotatingLeft = ref(false);  // Flag for left rotation
        let isRotatingUp = ref(false);    // Flag for up rotation
        let isRotatingDown = ref(false);  // Flag for down rotation

        const humanWithPantsAndSwimCap = shallowRef<THREE.Group | null>(null);
        const walkingNorth = ref(false);
        const walkingSouth = ref(false);
        const walkingWest = ref(false);
        const walkingEast = ref(false);
        const walkSpeed = 0.1;

        const womenSittingOnBeach = shallowRef<THREE.Group | null>(null);
        const swimmingChildWithAdjustedPose = shallowRef<THREE.Group | null>(null);

        const movingNorth = ref(false);
        const movingSouth = ref(false);
        const movingWest = ref(false);
        const movingEast = ref(false);
        const moveSpeed = 0.05;

        const movingNorthKid = ref(false);
        const movingSouthKid = ref(false);
        const movingWestKid = ref(false);
        const movingEastKid = ref(false);
        const moveSpeedKid = 0.08;

        // Initialize renderer and scene
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    onMounted(() => {
      if (threeCanvas.value) {
        // Initialize the Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeCanvas.value.appendChild(renderer.domElement);

        // Create the bear group and all parts
        const bearGroup = new THREE.Group();
        const textGroup = new THREE.Group();
        scene.add(textGroup);

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

        const textureLoader = new THREE.TextureLoader();
        const beachTexture = textureLoader.load('/3d-bear-arts/assets/beach.jpg');
        // beachTexture.wrapS = beachTexture.wrapT = THREE.RepeatWrapping;
        beachTexture.repeat.set(0.8,1);

        const sunTexture = textureLoader.load('/3d-bear-arts/assets/sun.jpg');

        beachTexture.wrapS = beachTexture.wrapT = THREE.RepeatWrapping;
        beachTexture.repeat.set(0.8,1);

        // beachTexture.repeat.set(2, 2); // Adjust this to scale the texture on the model

        sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
       // sunTexture.repeat.set(2, 2); // Adjust this to scale the texture on the mode

        const bodyMainMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xB0E2FF,  // Hot pink as the base
          map: beachTexture,  // Apply the abstract or halftone texture
          metalness: 0.2,  // Lower metalness for less reflective look
          roughness: 0.7,  // Increase roughness for a more matte finish
          clearcoat: 0.05,  // Lower clearcoat to reduce gloss
          clearcoatRoughness: 0.9,  // Increase clearcoat roughness for less shine
        });

        const bodyTransparentBeachMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xB0E2FF,
            map: beachTexture,
            metalness: 0.3,  // Slight metalness for a subtle shine
            roughness: 0.5,  // Some roughness to reduce reflection
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            ior: 1.33, // Close to water for refractive effect
             depthWrite: false, // Prevents overwriting depth information
             depthTest: true, // Allows depth testing for consistent layering
        });

        const rightBeachMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xB0E2FF, // Soft blue tint
          map: beachTexture, // Beach texture for subtle depth
          metalness: 0.1,  // Low metalness to avoid a metallic shine
          roughness: 0.6,  // Higher roughness for softer reflections
          transparent: true,
          opacity: 0.6, // Slight opacity for a glassy effect
          clearcoat: 0.9, // Higher clearcoat for a glossy surface layer
          clearcoatRoughness: 0.4, // Rougher clearcoat for a softer shine
          transmission: 0.7, // Moderate transmission for subtle transparency
          ior: 1.2, // Slightly lower than water to reduce refraction intensity
          depthTest: true, // Enables depth testing for consistent layering
          envMapIntensity: 0.8, // Reduced environment map intensity for softer look
        });

        const rightBodyTransparentBeachMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xB0E2FF, // Soft blue tint
          map: beachTexture, // Beach texture for subtle depth
          metalness: 0.1,  // Low metalness to avoid a metallic shine
          roughness: 0.6,  // Higher roughness for softer reflections
          transparent: true,
          opacity: 0.3, // Slight opacity for a glassy effect
          clearcoat: 0.9, // Higher clearcoat for a glossy surface layer
          clearcoatRoughness: 0.4, // Rougher clearcoat for a softer shine
          ior: 1.2, // Slightly lower than water to reduce refraction intensity
          depthWrite: false,
          depthTest: true, // Enables depth testing for consistent layering
          envMapIntensity: 0.6, // Reduced environment map intensity for softer look
          side: THREE.DoubleSide,
        });


        const leftBeachMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xB0E2FF,
            map: beachTexture,
            metalness: 0.3,  // Slight metalness for a subtle shine
            roughness: 0.5,  // Some roughness to reduce reflection
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            ior: 1.33, // Close to water for refractive effect
        });

        const leftLegtMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xB0E2FF,  // Hot pink as the base
          map: beachTexture,  // Apply the abstract or halftone texture
          metalness: 0.2,  // Lower metalness for less reflective look
          roughness: 0.7,  // Increase roughness for a more matte finish
          clearcoat: 0.05,  // Lower clearcoat to reduce gloss
          clearcoatRoughness: 0.9,  // Increase clearcoat roughness for less shine
        });

        // Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(
            1,            // Radius
            32,           // Width segments
            32,           // Height segments
            0,            // phiStart
            Math.PI       // phiLength (half of the sphere)
        );

      const rightBody = new THREE.Mesh(bodyGeometry, rightBodyTransparentBeachMaterial);
      const leftBody = new THREE.Mesh(bodyGeometry, bodyTransparentBeachMaterial);
  
      rightBody.scale.set(0.85, 0.85, 0.8);
      leftBody.scale.set(0.85, 0.85, 0.8);

      rightBody.position.y = -0.2;
      leftBody.position.y = -0.2;

      rightBody.rotation.y = Math.PI / 2;
      leftBody.rotation.y = Math.PI * 1.5;

      // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, bodyMainMaterial);
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
        const leftHead = new THREE.Mesh(headGeometry, bodyMainMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation

        // Create the right half of the head
        const rightHead = new THREE.Mesh(headGeometry, rightBeachMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation

        // Create a circular geometry to fill the flat side
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
        const headCircle = new THREE.Mesh(headCircleGeometry, bodyMainMaterial);

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

        // Create water-like geometry inside the bear
        const waterHalfSphereGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const waterMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xB0E2FF, // Light blue color for water
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.9,
            transmission: 0.9, // High transmission for a glassy effect
            ior: 1.33, // Index of refraction for water-like appearance
            reflectivity: 0.8,
            envMapIntensity: 1.0,
        });

        // Create the water mesh using the bottom-half sphere geometry
        const waterMesh = new THREE.Mesh(waterHalfSphereGeometry, waterMaterial);
        waterMesh.position.set(0, -0.2, 0); // Align with body position
        waterMesh.rotation.x = Math.PI; // Face upwards
        waterMesh.scale.set(1.25, 1.25, 1.25);

        // Add water mesh to halfSphereGroup
        halfSphereGroup.add(waterMesh);

        const waterCircleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00BFFF, // Slightly light color to match water
            metalness: 0.1,
            roughness: 0.5,
            clearcoat: 0.7,
            clearcoatRoughness: 0.25,
            side: THREE.DoubleSide, // Render both sides
            transparent: true,
            opacity: 0.7,
            depthWrite: false, // Prevents it from being overwritten
        });

        const waterCircle = new THREE.Mesh(circleGeometry, waterCircleMaterial);
        waterCircle.scale.set(.7, .7, .7);
        waterCircle.position.set(0, -0.3, 0); 
        waterCircle.rotation.x = Math.PI / 2;
        waterCircle.renderOrder = 1; // Ensures it renders on top

        // Add to the bear group
        halfSphereGroup.add(waterCircle);

        // Combine and add to bearGroup
        bearGroup.add(halfSphereGroup);

        const waterSurfaceMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: true,
            uniforms: {
                u_time: { value: 0.0 },
                u_waveFrequency: { value: 8.0 }, 
                u_waveAmplitude: { value: 0.05 }, 
                u_waveSpeed: { value: 0.2 },
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
                uniform float u_waveFrequency;
                uniform float u_waveAmplitude;
                uniform float u_waveSpeed;
                varying vec2 vUv;

                void main() {
                    float waveX = sin(vUv.x * u_waveFrequency + u_time * u_waveSpeed) * u_waveAmplitude;
                    float waveY = cos(vUv.y * u_waveFrequency + u_time * u_waveSpeed) * u_waveAmplitude;

                    // Adjusted colors for higher contrast
                    vec3 baseColor = vec3(0.3, 0.4, 0.5); // Dark base
                    vec3 waveColor = vec3(0.7, 0.9, 1.0);  // Brighter aqua

                    vec3 color = mix(baseColor, waveColor, 0.5 + (waveX + waveY) * 1.5); 
                    gl_FragColor = vec4(color, 0.85); // Adjust opacity for visibility
                }
            `,
        });

        // Water Surface Mesh
        const waterSurface = new THREE.Mesh(circleGeometry, waterSurfaceMaterial);
        waterSurface.position.set(0, -0.3, 0); // Center position
        waterSurface.scale.set(.7, .7, .7);
        waterSurface.rotation.x = -Math.PI / 2; // Face the camera
        waterSurface.renderOrder = 1; // Ensure it renders on top

        // Add water surface to half sphere group
        halfSphereGroup.add(waterSurface);

        // Bear ears
        const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const leftEar = new THREE.Mesh(earGeometry, leftBeachMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, rightBeachMaterial);
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
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, leftBeachMaterial);
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
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, rightBeachMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        rightSnout.position.set(0, 0.84, 0.5); // Position the right half
        rightSnout.rotation.y = 0; // Align correctly without additional rotation

        // Circle to cover the flat sides
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, bodyTransparentBeachMaterial);
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

        const heartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7FC8A9,  // Silver color
            metalness: 1.0,    // Fully metallic for reflective surface
            roughness: 0.25,    // Slightly rough to blur reflections
            envMap: sunTexture, // Apply environment map for reflections
            clearcoat: 0.7,    // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3,  // Roughness of the clear coat layer
        });

        // Heart shape
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
        heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
        heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

        // Extrude the heart shape into 3D
        const extrudeHeartSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);

        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.scale.set(0.2, 0.2, 0.2);
        heart.position.set(0.25, 1.2, 0);
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);

        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, bodyTransparentBeachMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, rightBodyTransparentBeachMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);

        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, leftBeachMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, rightBeachMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);

        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot

        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, leftBeachMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);

        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, rightBeachMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);

        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, leftBeachMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);

        const rightButtock = new THREE.Mesh(buttockGeometry, leftBeachMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);

        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, leftBeachMaterial);
        tail.position.set(0, -0.35, -0.8);
        bearGroup.add(tail);

        // Load font and create 3D text
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        const xEyeGeometry = new TextGeometry('X', {
            font: font,
            size: 0.2, // Size of the X
            depth: 0.05,
         });

        const xEye = new THREE.Mesh(xEyeGeometry, leftLegtMaterial);
        xEye.position.set(-0.3, .99, 0.53); // Position on the head
        xEye.rotation.x = THREE.MathUtils.degToRad(-5);
        xEye.rotation.y = THREE.MathUtils.degToRad(-15);
        bearGroup.add(xEye);

       // Create the O eye
        const oEyeGeometry = new TextGeometry('O', {
        font: font,
        size: 0.2, // Size of the O
        depth: 0.05, // Thickness of the O
        });

        const oEye = new THREE.Mesh(oEyeGeometry, leftLegtMaterial);
        oEye.position.set(0.14, .99, 0.53); // Position on the head
        oEye.rotation.y = THREE.MathUtils.degToRad(12);
        oEye.rotation.x = THREE.MathUtils.degToRad(-5);
        bearGroup.add(oEye);
      });

      // the end of the bear body

      function createHumanWithSwimmingPantsAndSwimCap() {
          const humanGroup = new THREE.Group();

          const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
          const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); 
          const headMesh = new THREE.Mesh(headGeometry, headMaterial);
          headMesh.position.set(0, 1.5, 0);
          humanGroup.add(headMesh);

          const capGeometry = new THREE.SphereGeometry(0.21, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2); 
          const capMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); 
          const capMesh = new THREE.Mesh(capGeometry, capMaterial);
          capMesh.position.set(0, 1.58, 0); 
          humanGroup.add(capMesh);

          const torsoGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32);
          const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
          const torsoMesh = new THREE.Mesh(torsoGeometry, torsoMaterial);
          torsoMesh.position.set(0, 1.0, 0);
          humanGroup.add(torsoMesh);

          const pantsGeometry = new THREE.CylinderGeometry(0.26, 0.26, 0.3, 32);
          const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); 
          const pantsMesh = new THREE.Mesh(pantsGeometry, pantsMaterial);
          pantsMesh.position.set(0, 0.65, 0);
          humanGroup.add(pantsMesh);

          const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
          const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });

          const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
          leftLeg.position.set(-0.15, 0.25, 0);
          humanGroup.add(leftLeg);

          const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
          rightLeg.position.set(0.15, 0.25, 0);
          humanGroup.add(rightLeg);

          const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 32);

          const leftArm = new THREE.Mesh(armGeometry, legMaterial);
          leftArm.position.set(-0.35, 1.3, 0);
          leftArm.rotation.z = Math.PI / 4;
          humanGroup.add(leftArm);

          const rightArm = new THREE.Mesh(armGeometry, legMaterial);
          rightArm.position.set(0.35, 1.3, 0);
          rightArm.rotation.z = -Math.PI / 4;
          humanGroup.add(rightArm);

          humanGroup.scale.set(0.27, 0.27, 0.27);
          humanGroup.position.set(-0.2, -0.1, -0.15);
          // humanGroup.position.set(0.2, -0.05, -0.47);

          return humanGroup;
      }

      // const humanWithPantsAndSwimCap = createHumanWithSwimmingPantsAndSwimCap();
      // bearGroup.add(humanWithPantsAndSwimCap);

      humanWithPantsAndSwimCap.value = createHumanWithSwimmingPantsAndSwimCap();
      bearGroup.add(humanWithPantsAndSwimCap.value);
      scene.add(bearGroup);


  function createSeatedWomanOnBeachWithFullerBodyAndAdjustedBikini() {
    const humanGroup = new THREE.Group();

    const headGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); 
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.set(0, 1.2, 0.04);
    humanGroup.add(headMesh);

    const hairTopGeometry = new THREE.SphereGeometry(0.19, 32, 32, 0.4, Math.PI * 2, 0, Math.PI / 2);
    const hairBackGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.4, 32);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); 

    const hairTopMesh = new THREE.Mesh(hairTopGeometry, hairMaterial);
    hairTopMesh.position.set(0, 1.28, 0); 
    humanGroup.add(hairTopMesh);

    const hairBackMesh = new THREE.Mesh(hairBackGeometry, hairMaterial);
    hairBackMesh.position.set(0, 1.1, -0.01); 
    humanGroup.add(hairBackMesh);

    const torsoGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.5, 32);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const torsoMesh = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torsoMesh.position.set(0, 0.85, 0);
    humanGroup.add(torsoMesh);

    const bikiniTopGeometry = new THREE.SphereGeometry(0.08, 32, 32, 0, Math.PI);
    const bikiniTopMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 }); 
    const leftBikiniTop = new THREE.Mesh(bikiniTopGeometry, bikiniTopMaterial);
    leftBikiniTop.position.set(-0.09, 0.98, 0.15); 
    humanGroup.add(leftBikiniTop);

    const rightBikiniTop = new THREE.Mesh(bikiniTopGeometry, bikiniTopMaterial);
    rightBikiniTop.position.set(0.09, 0.98, 0.15); 
    humanGroup.add(rightBikiniTop);

    const bottomsGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.25, 32);
    const bottomsMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
    const bottomsMesh = new THREE.Mesh(bottomsGeometry, bottomsMaterial);
    bottomsMesh.position.set(0, 0.6, 0);
    humanGroup.add(bottomsMesh);

    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.09, 0.5, 0.2); 
    leftLeg.rotation.x = Math.PI / 2; 
    humanGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.09, 0.5, 0.2); 
    rightLeg.rotation.x = Math.PI / 2; 
    humanGroup.add(rightLeg);
    // const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    // leftLeg.position.set(-0.09, 0.5, -0.2); 
    // leftLeg.rotation.x = Math.PI / 2; 
    // humanGroup.add(leftLeg);

    // const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    // rightLeg.position.set(0.09, 0.5, -0.2); 
    // rightLeg.rotation.x = Math.PI / 2; 
    // humanGroup.add(rightLeg);

    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 32);

    const leftArm = new THREE.Mesh(armGeometry, legMaterial);
    leftArm.position.set(-0.24, 0.95, 0.18);
    leftArm.rotation.x = Math.PI / 2; 
    humanGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, legMaterial);
    rightArm.position.set(0.2, 0.85, 0); 
    rightArm.rotation.z = Math.PI / 20; 
    humanGroup.add(rightArm);

    humanGroup.scale.set(0.27, 0.27, 0.27);
    humanGroup.position.set(0.2, -0.15, -0.32);
    // humanGroup.rotation.y = Math.PI;

    return humanGroup;
}

// const seatedWomanWithFullerBodyAndAdjustedBikini = createSeatedWomanOnBeachWithFullerBodyAndAdjustedBikini();
// bearGroup.add(seatedWomanWithFullerBodyAndAdjustedBikini);

womenSittingOnBeach.value = createSeatedWomanOnBeachWithFullerBodyAndAdjustedBikini();
bearGroup.add(womenSittingOnBeach.value);


function createSwimmingChildWithAdjustedPose() {
    const humanGroup = new THREE.Group();

    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac }); 
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.set(0, 1.5, 0);
    humanGroup.add(headMesh);

    const capGeometry = new THREE.SphereGeometry(0.21, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2); 
    const capMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 }); 
    const capMesh = new THREE.Mesh(capGeometry, capMaterial);
    capMesh.position.set(0, 1.58, 0); 
    humanGroup.add(capMesh);

    const torsoGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.5, 32);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const torsoMesh = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torsoMesh.position.set(0, 1.0, 0);
    humanGroup.add(torsoMesh);

    const pantsGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.3, 32);
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 }); 
    const pantsMesh = new THREE.Mesh(pantsGeometry, pantsMaterial);
    pantsMesh.position.set(0, 0.65, 0);
    humanGroup.add(pantsMesh);

    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.3, -0.25); // Move left leg further back
    leftLeg.rotation.x = Math.PI / 6; // Angle for swimming motion
    humanGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.3, 0.25); // Move right leg further forward
    rightLeg.rotation.x = -Math.PI / 6; // Opposite angle
    humanGroup.add(rightLeg);

    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 32);

    const leftArm = new THREE.Mesh(armGeometry, legMaterial);
    leftArm.position.set(-0.28, 1, -0.2); // Adjusted position for raised arm
    leftArm.rotation.x = Math.PI / 6; // Rotate slightly forward
    humanGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, legMaterial);
    rightArm.position.set(0.28, 1.3, 0.1); // Position for downward arm
    rightArm.rotation.z = -Math.PI / 8; // Slightly downward angle
    humanGroup.add(rightArm);

    humanGroup.scale.set(.15, .15, .15); 
    humanGroup.position.set(0.3, -0.25, 0.25); 
    humanGroup.rotation.x =  Math.PI / 12; // Rotate to face downward
    humanGroup.rotation.y =  Math.PI / 2; // Rotate to show side to the camere
    humanGroup.rotation.z = - Math.PI / 3; // Rotate to show side to the camere

    return humanGroup;
}

function animateSwimmingChild(swimmingChildWithAdjustedPose: any) {
    let direction = 1; // 1 for moving right, -1 for moving left
    let floatOffset = 0; // Offset for floating effect

    function animate() {
        requestAnimationFrame(animate);

        // Move horizontally between x: -0.3 and x: 0.3
        swimmingChildWithAdjustedPose.position.x += 0.01 * direction;
        if (swimmingChildWithAdjustedPose.position.x >= 0.35) {
            direction = -1; // Reverse direction when reaching x: 0.3
            swimmingChildWithAdjustedPose.rotation.y = Math.PI; // Face left
        } else if (swimmingChildWithAdjustedPose.position.x <= -0.35) {
            direction = 1; // Reverse direction when reaching x: -0.3
            swimmingChildWithAdjustedPose.rotation.y = 0; // Face right
        }

        // Floating effect (up and down motion)
        floatOffset += 0.003; // Controls speed of floating
        swimmingChildWithAdjustedPose.position.y = -0.4 + Math.sin(floatOffset) * 0.1; 

        renderer.render(scene, camera);
    }

    animate();
}

// const swimmingChildWithAdjustedPose = createSwimmingChildWithAdjustedPose();
// bearGroup.add(swimmingChildWithAdjustedPose);
// animateSwimmingChild(swimmingChildWithAdjustedPose);

swimmingChildWithAdjustedPose.value = createSwimmingChildWithAdjustedPose();
bearGroup.add(swimmingChildWithAdjustedPose.value);

// Start the animation for floating movement
animateSwimmingChild(swimmingChildWithAdjustedPose.value);

      // Add bear group to the scene
      bearGroup.scale.set(1.4, 1.4, 1.4);
      scene.add(bearGroup);

      // Set initial positions for bearGroup and camera
      bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
      camera.position.set(props.bodyPosition.x, 1, props.cameraPosition);
      camera.lookAt(props.bodyPosition.x, 0, 0);

      camera.position.z = 4;

    // New mouse tracking functionality
    const mouse = { x: 0, y: 0 };

    // Update bearGroup rotation based on mouse movement
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate rotation based on mouse position
      const targetRotationY = mouse.x * Math.PI * 0.2; // Y-axis rotation (left-right)
      const targetRotationX = mouse.y * Math.PI * 0.2; // X-axis rotation (up-down)

      // Apply the calculated rotation to the bear group
      bearGroup.rotation.y = targetRotationY;
      bearGroup.rotation.x = targetRotationX;
    };

    // Add event listener for mouse movement
    // window.addEventListener('mousemove', onMouseMove);

    bearGroup.rotation.x = 0.1; // Reset any upward tilt

      function animate() {
          requestAnimationFrame(animate);
          if (isRotatingRight.value) bearGroup.rotation.y += 0.03;
          if (isRotatingLeft.value) bearGroup.rotation.y -= 0.03;
          if (isRotatingUp.value) bearGroup.rotation.x -= 0.03;
          if (isRotatingDown.value) bearGroup.rotation.x += 0.03;

          waterSurfaceMaterial.uniforms.u_time.value += 0.25;

          heart.rotation.y += 0.04;
          // humanWithPantsAndSwimCap.rotation.y += 0.07

          renderer.render(scene, camera);
    }
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
            // Movement control methods
    const startWalkingNorth = () => {
      walkingNorth.value = true;
      console.log(walkingNorth.value)
      if (humanWithPantsAndSwimCap.value) humanWithPantsAndSwimCap.value.rotation.y = 0;
      console.log(humanWithPantsAndSwimCap.value)

    };

    const startWalkingSouth = () => {
      walkingSouth.value = true;
      if (humanWithPantsAndSwimCap.value) humanWithPantsAndSwimCap.value.rotation.y = Math.PI;
      console.log(humanWithPantsAndSwimCap.value)

    };

    const startWalkingWest = () => {
      walkingWest.value = true;
      if (humanWithPantsAndSwimCap.value) humanWithPantsAndSwimCap.value.rotation.y = Math.PI / 2;
    };

    const startWalkingEast = () => {
      walkingEast.value = true;
      if (humanWithPantsAndSwimCap.value) humanWithPantsAndSwimCap.value.rotation.y = -Math.PI / 2;
    };

    const stopWalking = () => {
      walkingNorth.value = false;
      walkingSouth.value = false;
      walkingWest.value = false;
      walkingEast.value = false;
    };

    const startMovingWomanNorth = () => {
      movingNorth.value = true;
      if (womenSittingOnBeach.value) womenSittingOnBeach.value.rotation.y = Math.PI;
    };

    const startMovingWomanSouth = () => {
      movingSouth.value = true;
      if (womenSittingOnBeach.value) womenSittingOnBeach.value.rotation.y = 0;
    };

    const startMovingWomanWest = () => {
      movingWest.value = true;
      if (womenSittingOnBeach.value) womenSittingOnBeach.value.rotation.y = - Math.PI / 2;
    };

    const startMovingWomanEast = () => {
      movingEast.value = true;
      if (womenSittingOnBeach.value) womenSittingOnBeach.value.rotation.y = Math.PI / 2;
    };

    const stopMovingWoman = () => {
      movingNorth.value = false;
      movingSouth.value = false;
      movingWest.value = false;
      movingEast.value = false;
    };

    // Animation loop for continuous movement
    const animateCharacter = () => {
      requestAnimationFrame(animateCharacter);

      if (humanWithPantsAndSwimCap.value) {
        if (walkingNorth.value) humanWithPantsAndSwimCap.value.position.z -= walkSpeed;
        if (walkingSouth.value) humanWithPantsAndSwimCap.value.position.z += walkSpeed;
        if (walkingWest.value) humanWithPantsAndSwimCap.value.position.x -= walkSpeed;
        if (walkingEast.value) humanWithPantsAndSwimCap.value.position.x += walkSpeed;
      }

      renderer.render(scene, camera);
    };

    const animateWoman = () => {
      requestAnimationFrame(animateWoman);

      if (womenSittingOnBeach.value) {
        if (movingNorth.value) womenSittingOnBeach.value.position.z -= moveSpeed;
        if (movingSouth.value) womenSittingOnBeach.value.position.z += moveSpeed;
        if (movingWest.value) womenSittingOnBeach.value.position.x -= moveSpeed;
        if (movingEast.value) womenSittingOnBeach.value.position.x += moveSpeed;
      }
    };

    animateWoman(); 

    animateCharacter();

    const startMovingKidNorth = () => {
      movingNorthKid.value = true;
      if (swimmingChildWithAdjustedPose.value) swimmingChildWithAdjustedPose.value.rotation.y = 0;
    };

    const startMovingKidSouth = () => {
      movingSouthKid.value = true;
      if (swimmingChildWithAdjustedPose.value) swimmingChildWithAdjustedPose.value.rotation.y = Math.PI;
    };

    const startMovingKidWest = () => {
      movingWestKid.value = true;
      if (swimmingChildWithAdjustedPose.value) swimmingChildWithAdjustedPose.value.rotation.y = Math.PI / 2;
    };

    const startMovingKidEast = () => {
      movingEastKid.value = true;
      if (swimmingChildWithAdjustedPose.value) swimmingChildWithAdjustedPose.value.rotation.y = -Math.PI / 2;
    };

    const stopMovingKid = () => {
      movingNorthKid.value = false;
      movingSouthKid.value = false;
      movingWestKid.value = false;
      movingEastKid.value = false;
    };

    // Animation loop for continuous movement
    const animateSwimmingKid = () => {
      requestAnimationFrame(animateSwimmingKid);
  

      if (swimmingChildWithAdjustedPose.value) {
        if (movingNorthKid.value) swimmingChildWithAdjustedPose.value.position.z -= moveSpeedKid;
        if (movingSouthKid.value) swimmingChildWithAdjustedPose.value.position.z += moveSpeedKid;
        if (movingWestKid.value) swimmingChildWithAdjustedPose.value.position.x -= moveSpeedKid;
        if (movingEastKid.value) swimmingChildWithAdjustedPose.value.position.x += moveSpeedKid;
      }
    };

    animateSwimmingKid();
    </script>

<style scoped>
.three-canvas {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: radial-gradient(circle, #FFD700 50%, #87CEFA 30%, #87CEFA 10%);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.pixel-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(120%) translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.side-buttons {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.pixel-btn {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 14px;
    background-color: #4682B4; /* Steel Blue */
    color: white;
    padding: 15px;
    border: 4px solid #20B2AA; /* Light Sea Green for border */
    box-shadow: 3px 3px 0 #20B2AA, 6px 6px 0 #4682B4; /* Light Sea Green shadow */
    text-transform: uppercase;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    border-radius: 10px; /* Rounded corners */
}

.pixel-btn:hover {
    background-color: #20B2AA; /* Light Sea Green on hover */
    color: #FFFFFF; /* White text color */
    transform: translate(-3px, -3px);
}

.pixel-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #20B2AA, 2px 2px 0 #4682B4;
}

/* panel to control the man */
.directional-buttons {
  position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-220%) translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.directional-buttons .horizontal-buttons {
  display: flex;
  justify-content: center;
}

.directional-btn {
  font-family: 'Roboto', sans-serif; /* Clean and modern font */
    font-size: 15px;
    font-weight: bold;
    background-color: #4682B4; /* Steel Blue */
    color: white;
    padding: 12px 18px;
    border: 3px solid #20B2AA; /* Light Sea Green for border */
    box-shadow: 2px 2px 0 #20B2AA, 4px 4px 0 #4682B4; /* Subtle shadow for depth */
    text-transform: uppercase;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    border-radius: 8px; /* Softer rounded corners */
}

.north-btn {
  background-color: #ffa07a; /* Light Salmon */
}

.south-btn {
  background-color: #20b2aa; /* Light Sea Green */
}

.west-btn {
  background-color: #9370db; /* Medium Purple */
}

.east-btn {
  background-color: #ff6347; /* Tomato */
}

.directional-buttons-woman {
    position: absolute;
    bottom: 100px;
    right: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    transform: translateX(-620%) translateY(-180%);
}

.horizontal-buttons-woman {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.directional-btn-woman {
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: bold;
    background-color: #FFB6C1; /* Light Pink */
    color: #4B0082; /* Indigo text for contrast */
    padding: 12px 18px;
    border: 3px solid #FF69B4; /* Hot Pink border */
    box-shadow: 2px 2px 0 #FF69B4, 4px 4px 0 #FFB6C1; /* Soft shadow */
    text-transform: uppercase;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    border-radius: 8px;
}

.directional-btn-woman:hover {
    background-color: #FF69B4; /* Hot Pink on hover */
    color: #FFFFFF;
    transform: translate(-2px, -2px);
    box-shadow: 1px 1px 0 #FF69B4, 3px 3px 0 #FFB6C1;
}

.directional-btn-woman:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #FF69B4, 2px 2px 0 #FFB6C1;
}

.directional-buttons-kid {
    position: absolute;
    top: 100px;
    right: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.horizontal-buttons-kid {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.directional-btn-kid {
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: bold;
    background-color: #87CEFA; /* Light Sky Blue */
    color: #2F4F4F; /* Dark Slate Gray text for contrast */
    padding: 12px 18px;
    border: 3px solid #4682B4; /* Steel Blue border */
    box-shadow: 2px 2px 0 #4682B4, 4px 4px 0 #87CEFA; /* Light shadow for water effect */
    text-transform: uppercase;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    border-radius: 8px;
}

.directional-btn-kid:hover {
    background-color: #4682B4; /* Steel Blue on hover */
    color: #FFFFFF;
    transform: translate(-2px, -2px);
    box-shadow: 1px 1px 0 #4682B4, 3px 3px 0 #87CEFA;
}

.directional-btn-kid:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #4682B4, 2px 2px 0 #87CEFA;
}


</style>
