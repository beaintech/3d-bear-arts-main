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

        const santa = shallowRef<THREE.Group | null>(null);

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
        const houseTexture = textureLoader.load('/3d-bear-arts/assets/house.jpg');
        houseTexture.wrapS = houseTexture.wrapT = THREE.RepeatWrapping;
        houseTexture.repeat.set(1,1);

        const houseChurch = textureLoader.load('/3d-bear-arts/assets/houseenv_texture_5.jpg');

const rightSnowMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,
    metalness: 0.3,
    roughness: 0.05,
    transparent: true,
    opacity: 0.5,
    transmission: 1,
    ior: 1.33,
    thickness: 0.01,
    depthWrite: true,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
});

const leftTransparentSnowMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,
    metalness: 0.3,
    map: houseTexture,
    roughness: 0.05,
    transparent: true,
    opacity: 0.5,
    transmission: 0.7,
    ior: 1.33,
    thickness: 0.4,
    depthWrite: true,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
});

const leftTransparentPureMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,
    metalness: 0.3,
    roughness: 0.05,
    transparent: true,
    opacity: 0.6,
    transmission: 0.8,
    ior: 1.33,
    thickness: 0.7,
    depthWrite: true,
    envMapIntensity: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
});

const envTexture = new THREE.CubeTextureLoader().load([
  '/3d-bear-arts/assets/house_env_texture_1.jpg',
  '/3d-bear-arts/assets/house_env_texture_4.jpg',
  '/3d-bear-arts/assets/house_env_texture_6.jpg',
  '/3d-bear-arts/assets/house_env_texture_2.jpg',
  '/3d-bear-arts/assets/house_env_texture_5.jpg',
  '/3d-bear-arts/assets/house_env_texture_3.jpg'
]);
scene.environment = envTexture;

const circlehMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,         // Clear white tint for glass effect
    metalness: 0.05,         // Low metalness for glassy reflection
    // map: houseTexture,
    roughness: 0.2,          // Smooth surface for glass
    transparent: true,
    opacity: 0.5,            // Moderate transparency for glass effect
    transmission: 0.2,       // High transmission for glass clarity
    ior: 1.5,                // Glass-like refraction index
    depthWrite: true,
    envMapIntensity: 1.0,    // Higher reflection for glass realism
    side: THREE.DoubleSide,
});

const snowWhiteMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,  // Hot pink as the base
  metalness: 0.2,  // Lower metalness for less reflective look
  roughness: 0.7,  // Increase roughness for a more matte finish
  clearcoat: 0.05,  // Lower clearcoat to reduce gloss
  clearcoatRoughness: 0.9,  // Increase clearcoat roughness for less shine
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
    uniform float opacity;
    varying vec2 vUv;

    void main() {
        vec2 p = vUv * 2.0 - vec2(1.0);
        float len = length(p);
        float angle = atan(p.y, p.x);

        // Soft pulsating wave for frosty effect
        float wave = sin(len * 15.0 - time * 2.0) * 0.2 + 0.8;

        // White and silver tones for icy crystal effect
        vec3 color1 = vec3(0.95, 0.95, 0.95); // Light silvery white
        vec3 color2 = vec3(0.8, 0.8, 0.85);   // Soft silver
        vec3 color3 = vec3(1.0, 1.0, 1.0);    // Pure white for highlights

        // Blend colors to achieve a frosty, metallic look
        vec3 color = mix(color1, color2, wave);
        color = mix(color, color3, sin(angle + time * 0.5) * 0.3 + 0.7);

        // Apply opacity for crystal transparency
        gl_FragColor = vec4(color, opacity); 
    }
`;

// Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(
            1,            // Radius
            32,           // Width segments
            32,           // Height segments
            0,            // phiStart
            Math.PI       // phiLength (half of the sphere)
        );

      const rightBody = new THREE.Mesh(bodyGeometry, rightSnowMaterial);
      const leftBody = new THREE.Mesh(bodyGeometry, leftTransparentPureMaterial);
  
      rightBody.scale.set(0.85, 0.85, 0.8);
      leftBody.scale.set(0.85, 0.85, 0.8);

      rightBody.position.y = -0.2;
      leftBody.position.y = -0.2;

      rightBody.rotation.y = Math.PI / 2;
      leftBody.rotation.y = Math.PI * 1.5;

      // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, circlehMaterial);
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
        const leftHead = new THREE.Mesh(headGeometry, leftTransparentPureMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation

        // Create the right half of the head
        const rightHead = new THREE.Mesh(headGeometry, rightSnowMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation

        // Create a circular geometry to fill the flat side
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
        const headCircle = new THREE.Mesh(headCircleGeometry, circlehMaterial);

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

        // Bear ears
        const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const leftEar = new THREE.Mesh(earGeometry, leftTransparentPureMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, rightSnowMaterial);
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
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, leftTransparentPureMaterial);
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
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, rightSnowMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        rightSnout.position.set(0, 0.84, 0.5); // Position the right half
        rightSnout.rotation.y = 0; // Align correctly without additional rotation

        // Circle to cover the flat sides
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, circlehMaterial);
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

        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, leftTransparentPureMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, rightSnowMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);

        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, leftTransparentPureMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, rightSnowMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);

        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot

        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, leftTransparentPureMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);

        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, rightSnowMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);

        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, leftTransparentPureMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);

        const rightButtock = new THREE.Mesh(buttockGeometry, leftTransparentPureMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);

        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, leftTransparentPureMaterial);
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

        const xEye = new THREE.Mesh(xEyeGeometry, snowWhiteMaterial);
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

        const oEye = new THREE.Mesh(oEyeGeometry, snowWhiteMaterial);
        oEye.position.set(0.14, .99, 0.53); // Position on the head
        oEye.rotation.y = THREE.MathUtils.degToRad(12);
        oEye.rotation.x = THREE.MathUtils.degToRad(-5);
        bearGroup.add(oEye);
      });

      function createHat() {
        const hatGroup = new THREE.Group();
          const hairGeometry = new THREE.TorusGeometry(0.12, 0.05, 16, 100);
          const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const hairMesh = new THREE.Mesh(hairGeometry, hairMaterial);
          hairMesh.position.set(0, 1.65, 0);
          hairMesh.rotation.x = Math.PI / 2;
          hatGroup.add(hairMesh);

          // Hat
          const hatBaseGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
          const hatMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
          hatBase.position.set(0, 1.8, 0);
          hatGroup.add(hatBase);

          const hatPomGeometry = new THREE.SphereGeometry(0.05, 32, 32);
          const hatPomMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const hatPom = new THREE.Mesh(hatPomGeometry, hatPomMaterial);
          hatPom.position.set(0, 1.93, 0);
          hatGroup.add(hatPom);

          // Scale and position the cat within the bear
          hatGroup.position.set(0, -0.1, 0);

          return hatGroup;
      }
      const hatGroup = createHat();
      bearGroup.add(hatGroup)

      // the end of the bear body

      function createCat() {
      const catGroup = new THREE.Group();

      // Head and Ears
      const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
      const headMesh = new THREE.Mesh(headGeometry, headMaterial);
      headMesh.position.set(0, 0.4, 0);
      catGroup.add(headMesh);

      const earGeometry = new THREE.ConeGeometry(0.08, 0.15, 32);
      const earMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });

      const leftEar = new THREE.Mesh(earGeometry, leftTransparentPureMaterial);
      leftEar.position.set(-0.1, 0.55, 0);
      leftEar.rotation.z = Math.PI / 6;
      catGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeometry, leftTransparentPureMaterial);
      rightEar.position.set(0.1, 0.55, 0);
      rightEar.rotation.z = -Math.PI / 6;
      catGroup.add(rightEar);

      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
      const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
      bodyMesh.position.set(0, 0.2, 0);
      catGroup.add(bodyMesh);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.07, -0.05, 0.05);
      catGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.07, -0.05, 0.05);
      catGroup.add(rightLeg);

        // Arms
      const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 32);
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
      const leftArm = new THREE.Mesh(armGeometry, leftTransparentPureMaterial);
      leftArm.position.set(-0.15, 0.25, 0);
      leftArm.rotation.z = Math.PI / 4;
      catGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.15, 0.25, 0);
      rightArm.rotation.z = -Math.PI / 4;
      catGroup.add(rightArm);

      // Tail
      const tailGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 32);
      const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
      const tailMesh = new THREE.Mesh(tailGeometry, tailMaterial);
      tailMesh.position.set(0, 0.1, -0.2);
      tailMesh.rotation.x = Math.PI / 4;
      catGroup.add(tailMesh);

      // Scale and position the cat within the bear
      catGroup.scale.set(0.75, 0.75, 0.75);
      catGroup.position.set(0.2, 0, 0.2);

      return catGroup;
    }

      const catGroup = createCat();
      // bearGroup.add(catGroup);

      function createSanta() {
        const santaGroup = new THREE.Group();

        // Head and Face
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
        const headMesh = new THREE.Mesh(headGeometry, headMaterial);
        headMesh.position.set(0, 1, 0);
        santaGroup.add(headMesh);

      const beardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const beardParts = [
          { x: 0, y: 0.85, z: 0.15, size: 0.12 },
          { x: -0.1, y: 0.88, z: 0.1, size: 0.1 },
          { x: 0.1, y: 0.88, z: 0.1, size: 0.1 },
          { x: -0.15, y: 0.95, z: 0.1, size: 0.08 },
          { x: 0.15, y: 0.95, z: 0.1, size: 0.08 },
        ];

        for (const part of beardParts) {
          const beardSphere = new THREE.SphereGeometry(part.size, 16, 16);
          const beardMesh = new THREE.Mesh(beardSphere, beardMaterial);
          beardMesh.position.set(part.x, part.y - 0.06, part.z - 0.01);
          santaGroup.add(beardMesh);
        }

        // Moustache (two small cylinders)
        const moustacheMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const leftMoustacheGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 32);
        const leftMoustache = new THREE.Mesh(leftMoustacheGeometry, moustacheMaterial);
        leftMoustache.position.set(-0.06, 0.93, 0.18);
        leftMoustache.rotation.z = Math.PI / 4;
        // santaGroup.add(leftMoustache);

        const rightMoustacheGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 32);
        const rightMoustache = new THREE.Mesh(rightMoustacheGeometry, moustacheMaterial);
        rightMoustache.position.set(0.06, 0.93, 0.18);
        rightMoustache.rotation.z = -Math.PI / 4;
        // santaGroup.add(rightMoustache);

        // Hair (White Cap)
        const hairGeometry = new THREE.TorusGeometry(0.12, 0.05, 16, 100);
        const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const hairMesh = new THREE.Mesh(hairGeometry, hairMaterial);
        hairMesh.position.set(0, 1.15, 0);
        hairMesh.rotation.x = Math.PI / 2;
        santaGroup.add(hairMesh);

        // Hat
        const hatBaseGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
        const hatMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
        hatBase.position.set(0, 1.3, 0);
        santaGroup.add(hatBase);

        const hatPomGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const hatPomMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const hatPom = new THREE.Mesh(hatPomGeometry, hatPomMaterial);
        hatPom.position.set(0, 1.43, 0);
        santaGroup.add(hatPom);

        // Body (Red Coat)
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.set(0, 0.5, 0);
        santaGroup.add(bodyMesh);

        // Belt
        const beltGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32);
        const beltMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const beltMesh = new THREE.Mesh(beltGeometry, beltMaterial);
        beltMesh.position.set(0, 0.4, 0.005);
        santaGroup.add(beltMesh);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 32);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.25, 0.75, 0);
        leftArm.rotation.z = Math.PI / 4;
        santaGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.25, 0.75, 0);
        rightArm.rotation.z = -Math.PI / 4;
        santaGroup.add(rightArm);

        // Hands (white gloves)
        const handGeometry = new THREE.SphereGeometry(0.07, 32, 32);
        const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-0.35, 0.85, 0);
        santaGroup.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(0.35, 0.85, 0);
        santaGroup.add(rightHand);

        const bootGeometry = new THREE.CylinderGeometry(.1, 0.1, 0.15, 32);
        const bootMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 32);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black boots

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.1, 0.1, 0);
        santaGroup.add(leftLeg);

        const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
        leftBoot.position.set(-0.1, -0.05, 0);
        santaGroup.add(leftBoot);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.1, 0.1, 0);
        santaGroup.add(rightLeg);

        const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
        rightBoot.position.set(0.1, -0.05, 0);
        santaGroup.add(rightBoot);

        const bootFrontGeometry = new THREE.SphereGeometry(0.12, 32, 32);
        const bootFrontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, bootFrontMaterial);
        leftBootFront.scale.set(1, 0.7, 1.5); // Flattened and extended front
        leftBootFront.position.set(-0.1, -0.12, 0.12); // Position in front of left boot
        santaGroup.add(leftBootFront);

        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, bootFrontMaterial);
        rightBootFront.scale.set(1, 0.7, 1.5); // Flattened and extended front
        rightBootFront.position.set(0.1, -0.1, 0.12); // Position in front of right boot
        santaGroup.add(rightBootFront);

        // Position the Santa
        santaGroup.scale.set(0.25, 0.25, 0.25);
        santaGroup.position.set(0.2, 0.5, -0.0);

        return santaGroup;
      }

      function santaAnimate() {
        let floatOffset = 0; // Offset for controlling the floating effect

        function animateSanta() {
            requestAnimationFrame(animateSanta);

            floatOffset += 0.4; // Adjust this value for speed of floating
            santaModel.position.y = 0.45 + Math.sin(floatOffset) * 0.5; // Oscillates between y = 0 and y = 0.5

            renderer.render(scene, camera);
        }

        animateSanta();
    }

      const santaModel = createSanta();
      bearGroup.add(santaModel);

      const santa2 = createSanta();
      santa2.position.set(-0.2, -0.1, 0.5);
      bearGroup.add(santa2);

      santaAnimate();

    function animateSanta(santa: any) {
        let direction = 1; // 1 for moving right, -1 for moving left
        let floatOffset = 0; // Offset for floating effect

        function animate() {
            requestAnimationFrame(animate);

            santa.position.x += 0.01 * direction;
            if (santa.position.x >= 0.5) {
                direction = -1; 
                santa.rotation.y = Math.PI; // Face left
            } else if (santa.position.x <= 0) {
                direction = 1; 
                santa.rotation.y = 0; // Face right
            }

            floatOffset += 1; // Controls speed of floating
            santa.position.y = -0.2 + Math.sin(floatOffset) * 0.01; 
            santa.position.z = 0.5;
            renderer.render(scene, camera);
        }

        animate();
    }

santa.value = createSanta();
bearGroup.add(santa.value);

// Start the animation for floating movement
animateSanta(santa.value);

      function createCuteChristmasHouse() {
          const houseGroup = new THREE.Group();

          // Main house structure (small and cozy)
          const houseGeometry = new THREE.BoxGeometry(0.7, 0.8, 0.7);
          const houseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Warm brown wood color
          const houseMesh = new THREE.Mesh(houseGeometry, houseMaterial);
          houseMesh.position.set(0, 0.4, 0);
          houseGroup.add(houseMesh);

          // Roof (slightly narrower for a cute, proportional look)
          const roofGeometry = new THREE.ConeGeometry(0.55, 0.25, 4);
          const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // Dark red for a festive feel
          const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
          roofMesh.position.set(0, 0.9, 0); // Positioned atop the house
          roofMesh.rotation.y = Math.PI / 4; // Align to be diamond-shaped on house
          houseGroup.add(roofMesh);

          // Door (centered and cute size)
          const doorGeometry = new THREE.BoxGeometry(0.25, 0.35, 0.05);
          const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 }); // Dark wood
          const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
          doorMesh.position.set(0, 0.2, 0.36); // Positioned at the front
          houseGroup.add(doorMesh);

          // Windows (small and placed symmetrically)
          const windowGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.05);
          const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB });

          // Left window
          const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
          leftWindow.position.set(-0.2, 0.5, 0.38);
          houseGroup.add(leftWindow);

          // Right window
          const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
          rightWindow.position.set(0.2, 0.5, 0.38);
          houseGroup.add(rightWindow);

          // Chimney (small and positioned on the roof)
          const chimneyGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
          const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray color for chimney
          const chimneyMesh = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
          chimneyMesh.position.set(0, 0.95, 0); // Centered towards the back on the roof
          houseGroup.add(chimneyMesh);

          // Wreath on the door for a festive touch
          const wreathGeometry = new THREE.TorusGeometry(0.07, 0.04, 32, 100);
          const wreathMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green for the wreath
          const wreathMesh = new THREE.Mesh(wreathGeometry, wreathMaterial);
          wreathMesh.position.set(0, 0.45, 0.38); // Centered above the door
          houseGroup.add(wreathMesh);

          houseGroup.position.set(0.22, -0.2, 0);
          houseGroup.scale.set(0.5, 0.5, 0.5);

          return houseGroup;
      }

      // Usage: add the cute house to the scene
      const cuteChristmasHouse = createCuteChristmasHouse();
      bearGroup.add(cuteChristmasHouse);

      const smallChristmasHouse = createCuteChristmasHouse();
      smallChristmasHouse.position.set(-0.2, -0.2, 0);
      smallChristmasHouse.scale.set(0.35, 0.35, 0.35);

      bearGroup.add(smallChristmasHouse);

      function createCoffeeCup(scale = 1, position = { x: 0, y: 0, z: 0 }) {
        const coffeeCupGroup = new THREE.Group();

        const cupGeometry = new THREE.CylinderGeometry(1.2, 0.9, 3, 32); // Larger bottom, smaller top
        const cupMaterial = new THREE.MeshStandardMaterial({ color: 0x006241 }); // White cup
        const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
        coffeeCupGroup.add(cupMesh);

        const lidGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32); // Flat lid
        const lidMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark lid
        const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
        lidMesh.position.y = 1.6;
        coffeeCupGroup.add(lidMesh);

        const coffeeloader = new THREE.TextureLoader();
        coffeeloader.load('/3d-bear-arts/assets/starbucks-logo.png', function (texture) {
              texture.repeat.set(4, 1); // 0.5 for slimmer horizontal scaling, 1 for normal vertical scaling
              texture.offset.set(0.25, 0); // Center the logo after changing repeat.x
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;

              const sleeveMaterial = new THREE.MeshStandardMaterial({
                  color: 0x8B4513, // Brown sleeve base
                  map: texture,    // Map the logo texture onto the sleeve
                  transparent: true,
              });

              const sleeveHeight = 2;
              const sleeveGeometry = new THREE.CylinderGeometry(1.1, 1.05, 1.5, 32);
              const sleeveMesh = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
              sleeveMesh.position.y = -0.5;
              coffeeCupGroup.add(sleeveMesh);
          });
          coffeeCupGroup.scale.set(scale, scale, scale);
          coffeeCupGroup.position.set(position.x, position.y, position.z);

          return coffeeCupGroup; 
      }

      const smallCoffeeCup = createCoffeeCup(0.1, { x: 0, y: 0, z: 1 });
      // bearGroup.add(smallCoffeeCup);

      const fullSizeCoffeeCup = createCoffeeCup(0.6, { x: 0, y: -1.5 , z: 0 });
      // scene.add(fullSizeCoffeeCup);

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

      const innerSnowflakeCount = 2000; // Adjust for density
      const innerSnowflakePositions = [];
      const radius = 0.6; // Adjust slightly smaller than the body radius for containment

      // Generate random positions within the spherical boundary
      for (let i = 0; i < innerSnowflakeCount; i++) {
          const x = (Math.random() - 0.5) * radius * 2;
          const y = (Math.random() - 0.5) * radius * 2;
          const z = (Math.random() - 0.5) * radius * 2;

          if (Math.sqrt(x * x + y * y + z * z) < radius) {
              innerSnowflakePositions.push(x, y, z);
          }
      }

      // Create buffer geometry and set the positions attribute
      const innerSnowflakeGeometry = new THREE.BufferGeometry();
      innerSnowflakeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(innerSnowflakePositions, 3));

      // Material for the inner snowflakes
      const innerSnowflakeMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.05, // Adjust size for visibility
          transparent: true,
          opacity: 0.9
      });

      // Create inner snowflake particles
      const innerSnowflakes = new THREE.Points(innerSnowflakeGeometry, snowMaterial);
      innerSnowflakes.position.set(0, -0.2, 0); // Position to match the bear body
      // bearGroup.add(innerSnowflakes);
      const innerSnowflakes2 = new THREE.Points(innerSnowflakeGeometry, snowCircleMaterial);
      innerSnowflakes2.position.set(0, 0.8, 0); // Position to match the bear body
      // bearGroup.add(innerSnowflakes2);

      // Animate inner snowflakes
      function animateInnerSnowflakes() {
          requestAnimationFrame(animateInnerSnowflakes);

          const positions = innerSnowflakeGeometry.attributes.position.array;
          for (let i = 1; i < positions.length; i += 3) {
              positions[i] -= 0.02; // Move downward

              if (positions[i] < -radius) {
                  positions[i] = radius;
              }
          }

          innerSnowflakeGeometry.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
      }

      animateInnerSnowflakes();

      bearGroup.scale.set( 0.85, 0.85, 0.85);
      bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y + 0.9, props.bodyPosition.z);

      // bearGroup.scale.set( 2, 2, 2);
      // bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
      
      // bearGroup.scale.set( 1.4, 1.4, 1.4);
     //  bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
      scene.add(bearGroup);

      scene.add(fullSizeCoffeeCup);

      // Set initial positions for bearGroup and camera
    
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

           if(santa.value) santa.value.rotation.y += 0.7;
           shimmerMaterial.uniforms.u_time.value += 0.5;

          santa2.rotation.y += 0.45;
          smallCoffeeCup.rotation.y += 0.05;
          fullSizeCoffeeCup.rotation.y += 0.05;
          bearGroup.rotation.y -= 0.05;

          renderer.render(scene, camera);
        }
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
        background: linear-gradient(45deg, #006241 30%, #c92a28 60%, #013220 90%); /* Starbucks green and holiday red */
        background-image: 
            radial-gradient(circle at top left, rgba(201, 42, 40, 1), rgba(0, 128, 0, 0.5) 50%, rgba(0, 64, 0, 0) 70%),
            radial-gradient(circle at bottom right, rgba(0, 128, 0, 1), rgba(0, 255, 0, 0.5) 50%, rgba(0, 64, 0, 0) 70%),
            radial-gradient(circle at center, rgba(255, 0, 0, 1), rgba(0, 100, 0, 0.5) 40%, rgba(0, 50, 0, 0) 60%);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    /* Red sparkles */
    @keyframes sparkle {
        0%, 100% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }

    .sparkle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #FF0000; /* Bright red */
        border-radius: 50%;
        box-shadow: 0px 0px 8px rgba(255, 0, 0, 1); /* Red glow */
        opacity: 0.8;
        animation: sparkle 3s infinite alternate ease-in-out;
    }

    .sparkle:nth-child(1) { top: 20%; left: 30%; animation-delay: 0s; }
    .sparkle:nth-child(2) { top: 40%; left: 70%; animation-delay: 1.5s; }
    .sparkle:nth-child(3) { top: 60%; left: 50%; animation-delay: 1s; }
    .sparkle:nth-child(4) { top: 80%; left: 20%; animation-delay: 2s; }
    .sparkle:nth-child(5) { top: 15%; left: 80%; animation-delay: 1.2s; }

    /* Festive-themed buttons */
    .pixel-btn {
        font-family: 'Press Start 2P', sans-serif;
        font-size: 14px;
        background-color: #8B0000; /* Deep red, Starbucks style */
        color: #DC143C; /* Crimson text */
        padding: 15px;
        border: 4px solid #32CD32; /* Green border */
        box-shadow: 4px 4px 0 #DC143C, 8px 8px 0 #8B0000;
        text-transform: uppercase;
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
        border-radius: 10px;
    }

    .pixel-btn:hover {
        background-color: #B22222;
        color: #FF0000; /* Bright red text on hover */
        transform: translate(-4px, -4px);
    }

    .pixel-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 #DC143C, 3px 3px 0 #8B0000;
    }

    .pixel-btn {
        font-family: 'Press Start 2P', sans-serif;
        font-size: 14px;
        background-color: #8B0000; /* Dark Red for Christmas theme */
        color: #FFD700; /* Gold text color */
        padding: 15px;
        border: 4px solid #32CD32; /* Lime Green border */
        box-shadow: 4px 4px 0 #FFD700, 8px 8px 0 #8B0000; /* Festive shadow */
        text-transform: uppercase;
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
        border-radius: 10px;
    }

    .pixel-btn:hover {
        background-color: #B22222; /* Firebrick Red on hover */
        color: #FFFFFF; /* White text */
        transform: translate(-4px, -4px);
    }

    .pixel-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 #FFD700, 3px 3px 0 #8B0000;
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

</style>
