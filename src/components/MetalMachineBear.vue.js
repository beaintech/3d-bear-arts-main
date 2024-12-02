import { ref, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
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
const threeCanvas = ref(null);
let isRotatingRight = ref(false); // Flag for right rotation
let isRotatingLeft = ref(false); // Flag for left rotation
let isRotatingUp = ref(false); // Flag for up rotation
let isRotatingDown = ref(false); // Flag for down rotation
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
        const popTexture1 = textureLoader.load('/3d-bear-arts/assets/metal.jpg');
        const popTexture2 = textureLoader.load('/3d-bear-arts/assets/pop7.jpg');
        const gearTexture = textureLoader.load('/3d-bear-arts/assets/gear.jpg');
        // https://www.google.com/imgres?q=pop%20art&imgurl=https%3A%2F%2Fi00.eu%2Fimg%2F605%2F1024x1024%2F9ahr1mu8%2F366098.jpg&imgrefurl=https%3A%2F%2Fwww.dovido.de%2FPop-Art-Bilder%2FWandbild-Pop-Art-Lutscher&docid=tZrAljc23vedzM&tbnid=aWwpNILeFq7VKM&vet=12ahUKEwiKs57Y-5OJAxXUnf0HHfLwHKYQM3oECHwQAA..i&w=1024&h=682&hcb=2&ved=2ahUKEwiKs57Y-5OJAxXUnf0HHfLwHKYQM3oECHwQAA
        popTexture1.wrapS = popTexture1.wrapT = THREE.RepeatWrapping;
        // popTexture1.repeat.set(2, 2); // Adjust this to scale the texture on the model
        popTexture2.wrapS = popTexture2.wrapT = THREE.RepeatWrapping;
        popTexture2.repeat.set(2, 2); // Adjust this to scale the texture on the model
        // Left arm: Neon orange (#FFA500) with hints of red.
        // Right arm: Vibrant purple (#8A2BE2).
        // Legs: One in bright cyan (#00FFFF), the other in vivid pink (#FF69B4).
        // Tail: Gradient from blue to green (#00FA9A to #1E90FF).
        // color: 0xd3d3d3,   // Light grey color for the metal
        const silverMetalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd3d3d3, // Light grey color for the metal
            metalness: .9, // High metalness to keep the metallic look
            roughness: 0.2, // Adjust roughness to make it shinier
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            map: popTexture1, // Add the texture as a pattern on the material
        });
        gearTexture.mapping = THREE.EquirectangularReflectionMapping;
        // Create a mirror-like silver material
        const mirrorSilverMaterial = new THREE.MeshPhysicalMaterial({
            color: '#d3d3d3', // Silver color
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.25, // Slightly rough to blur reflections
            map: popTexture1,
            envMap: gearTexture, // Apply environment map for reflections
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear coat layer
        });
        const mirrorRedMaterial = new THREE.MeshPhysicalMaterial({
            color: '#C0C0C0', // Silver color #D32F2F
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.25, // Slightly rough to blur reflections
            envMap: gearTexture, // Apply environment map for reflections
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear coat layer
        });
        const transparentMirrorSilverMaterial = new THREE.MeshPhysicalMaterial({
            color: '#C0C0C0', // Silver color
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.25, // Slightly rough to blur reflections
            map: popTexture1,
            envMap: gearTexture, // Apply environment map for reflections
            transparent: true, // Enable transparency
            opacity: 0.8, // Adjust transparency level (0.0 to 1.0)
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear coat layer
            transmission: 0.8, // Enable transmission for a glass-like effect
            ior: 1.45, // Index of refraction for a more glassy appearance
        });
        const transparentMirrorSilverBodyMaterial = new THREE.MeshPhysicalMaterial({
            color: '#C0C0C0', // Silver color
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.5, // Slightly rough to blur reflections
            map: popTexture1,
            envMap: gearTexture, // Apply environment map for reflections
            transparent: true, // Enable transparency
            opacity: 0.23, // Adjust transparency level (0.0 to 1.0)
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear coat layer
            transmission: 0.8, // Enable transmission for a glass-like effect
            ior: 1.45, // Index of refraction for a more glassy appearance
        });
        const mirrorPureMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd3d3d3, // Silver color
            metalness: 1, // Full metallic look
            roughness: 0.25, // Low roughness for a reflective appearance
            clearcoat: 1, // High clearcoat to enhance glossiness
            clearcoatRoughness: 0.05, // Slight clearcoat roughness
            reflectivity: 0.9, // High reflectivity for a mirror effect
            envMapIntensity: 1.0, // Environment reflection intensity
            side: THREE.DoubleSide, // Render both sides of the material
        });
        const transparentMirrorPureMaterial = new THREE.MeshPhysicalMaterial({
            color: '#C0C0C0', // Silver color
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.2, // Slightly rough to blur reflections
            transparent: true, // Enable transparency
            opacity: 0.4, // Adjust transparency level (0.0 to 1.0)
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear coat layer
            transmission: 0.8, // Enable transmission for a glass-like effect
            ior: 1.45, // Index of refraction for a more glassy appearance
        });
        const gearMaterialSliver = new THREE.MeshPhysicalMaterial({
            color: '#d3d3d3', // Silver color
            metalness: 1.0, // Fully metallic for reflective surface
            roughness: 0.2, // Slightly rough to blur reflections
            map: gearTexture,
            envMap: gearTexture, // Apply environment map for reflections
            clearcoat: 0.7, // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3, // Roughness of the clear co
        });
        const silverMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xC0C0C0,
            metalness: .9,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            map: gearTexture, // Add the texture as a pattern on the material
        });
        // color: 0xC0C0C0, // Silver
        const transparentSilverMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xC0C0C0, // Silver
            metalness: 1.0,
            roughness: 0.3,
            clearcoat: 0.5,
            clearcoatRoughness: 0.1,
            map: popTexture1,
            transparent: true,
            opacity: .3,
        });
        // Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(1, // Radius
        32, // Width segments
        32, // Height segments
        0, // phiStart
        Math.PI // phiLength (half of the sphere)
        );
        const rightBody = new THREE.Mesh(bodyGeometry, transparentMirrorSilverBodyMaterial);
        const leftBody = new THREE.Mesh(bodyGeometry, mirrorSilverMaterial);
        rightBody.scale.set(0.85, 0.85, 0.8);
        leftBody.scale.set(0.85, 0.85, 0.8);
        rightBody.position.y = -0.2;
        leftBody.position.y = -0.2;
        rightBody.rotation.y = Math.PI / 2;
        leftBody.rotation.y = Math.PI * 1.5;
        // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, transparentMirrorSilverMaterial);
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
        const headGeometry = new THREE.SphereGeometry(0.6, // Radius
        32, // Width segments
        32, // Height segments
        0, // phiStart
        Math.PI // phiLength (half of the sphere)
        );
        // Create the left half of the head
        const leftHead = new THREE.Mesh(headGeometry, mirrorSilverMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation
        // Create the right half of the head
        const rightHead = new THREE.Mesh(headGeometry, transparentMirrorSilverBodyMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation
        // Create a circular geometry to fill the flat side
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
        const headCircle = new THREE.Mesh(headCircleGeometry, transparentMirrorSilverMaterial);
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
        const leftEar = new THREE.Mesh(earGeometry, mirrorSilverMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
        const rightEar = new THREE.Mesh(earGeometry, transparentMirrorSilverMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
        // Geometry for the left half of the snout
        const leftSnoutGeometry = new THREE.SphereGeometry(0.25, // Radius
        32, // Width segments
        32, // Height segments
        Math.PI / 2, // phiStart: Start at 90 degrees to create a half-sphere
        Math.PI // phiLength: Cover 180 degrees to create the half shape
        );
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, mirrorSilverMaterial);
        leftSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        leftSnout.position.set(0, 0.84, 0.5); // Position the left half
        leftSnout.rotation.y = Math.PI; // Rotate to align correctly
        // Geometry for the right half of the snout
        const rightSnoutGeometry = new THREE.SphereGeometry(0.25, // Radius
        32, // Width segments
        32, // Height segments
        Math.PI / 2, // phiStart: Start at -90 degrees to create a half-sphere
        Math.PI // phiLength: Cover 180 degrees to create the half shape
        );
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, transparentMirrorSilverMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        rightSnout.position.set(0, 0.84, 0.5); // Position the right half
        rightSnout.rotation.y = 0; // Align correctly without additional rotation
        // Circle to cover the flat sides
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, mirrorPureMaterial);
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
        const extrudeHeartSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);
        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, mirrorSilverMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, transparentMirrorSilverMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, mirrorSilverMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeometry, transparentMirrorSilverMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, mirrorSilverMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);
        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, transparentMirrorSilverMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);
        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, mirrorSilverMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);
        const rightButtock = new THREE.Mesh(buttockGeometry, transparentMirrorSilverBodyMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);
        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, mirrorSilverMaterial);
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
            const xEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const xEye = new THREE.Mesh(xEyeGeometry, silverMetalMaterial);
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
            const oEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const oEye = new THREE.Mesh(oEyeGeometry, silverMetalMaterial);
            oEye.position.set(0.14, .99, 0.53); // Position on the head
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);
            bearGroup.add(oEye);
        });
        tail.renderOrder = 1;
        // Gear Parameters
        const gearRadius = 1.2;
        const gearDepth = 0.5;
        const teethCount = 8;
        const toothWidth = 0.7;
        const toothHeight = 0.3;
        const toothDepth = 0.5;
        // Function to create a gear
        function createGear(material, position) {
            // Create gear body
            const gearBodyGeometry = new THREE.CylinderGeometry(gearRadius, gearRadius, gearDepth, 32);
            gearBodyGeometry.rotateX(Math.PI / 2); // Rotate to face forward
            const gearBody = new THREE.Mesh(gearBodyGeometry, material);
            // Create teeth
            const teethGroup = new THREE.Group();
            for (let i = 0; i < teethCount; i++) {
                const angle = (i / teethCount) * Math.PI * 2;
                const toothGeometry = new THREE.BoxGeometry(toothWidth, toothHeight, toothDepth);
                const tooth = new THREE.Mesh(toothGeometry, material);
                tooth.position.set((gearRadius + toothDepth / 26) * Math.cos(angle), (gearRadius + toothDepth / 26) * Math.sin(angle), 0);
                tooth.rotation.z = angle;
                teethGroup.add(tooth);
            }
            // Combine gear body and teeth
            const gearGroup = new THREE.Group();
            gearGroup.add(gearBody);
            gearGroup.add(teethGroup);
            // Set the position of the gear
            gearGroup.position.set(position.x, position.y, position.z);
            return gearGroup;
        }
        const gear1 = createGear(gearMaterialSliver, { x: -2, y: 0, z: 0 });
        const gear2 = createGear(gearMaterialSliver, { x: 0, y: 0, z: 0 });
        const gear3 = createGear(gearMaterialSliver, { x: 2, y: 0, z: 0 });
        const gear4 = createGear(gearMaterialSliver, { x: 2, y: 0, z: 0 });
        const gear5 = createGear(gearMaterialSliver, { x: 2, y: -2, z: 0 });
        const heart = new THREE.Mesh(heartGeometry, mirrorRedMaterial);
        heart.scale.set(0.3, 0.3, 0.3);
        heart.position.set(0.25, 1.1, 0);
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);
        // Position the gears
        gear1.position.set(0.35, 0, 0);
        gear2.position.set(0.25, -0.3, 0.4);
        gear3.position.set(0.3, 0.3, -0.2);
        gear4.position.set(0.25, 0.17, 0.4);
        gear5.position.set(0.5, -0.3, 0.45);
        gear1.scale.set(0.2, 0.2, 0.2);
        gear2.scale.set(0.18, 0.18, 0.18);
        gear3.scale.set(0.15, 0.15, 0.15);
        gear4.scale.set(0.17, 0.17, 0.17);
        gear5.scale.set(0.15, 0.15, 0.15);
        gear2.rotation.z = Math.PI / 4;
        gear3.rotation.z = -Math.PI / 4;
        gear4.rotation.y = -Math.PI / 2;
        gear5.rotation.y = -Math.PI / 2;
        bearGroup.add(gear1);
        bearGroup.add(gear2);
        bearGroup.add(gear3);
        bearGroup.add(gear4);
        bearGroup.add(gear5);
        bearGroup.rotation.x = 0.1; // Reset any upward tilt
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
        const onMouseMove = (event) => {
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
        function animate() {
            requestAnimationFrame(animate);
            if (isRotatingRight.value)
                bearGroup.rotation.y += 0.03;
            if (isRotatingLeft.value)
                bearGroup.rotation.y -= 0.03;
            if (isRotatingUp.value)
                bearGroup.rotation.x -= 0.03;
            if (isRotatingDown.value)
                bearGroup.rotation.x += 0.03;
            gear1.rotation.z -= 0.02;
            gear2.rotation.z += 0.03;
            gear3.rotation.z += 0.02;
            gear4.rotation.z += 0.02;
            gear5.rotation.z -= 0.03;
            heart.rotation.y += 0.04;
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
const __VLS_fnComponent = (await import('vue')).defineComponent({
    props: {
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
    },
});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    __VLS_styleScopedClasses['pixel-btn'];
    __VLS_styleScopedClasses['pixel-btn'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ref: ("threeCanvas"), ...{ class: ((__VLS_ctx.background ? 'no-bg' : 'three-canvas')) }, });
    // @ts-ignore navigation for `const threeCanvas = ref()`
    __VLS_ctx.threeCanvas;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pixel-controls") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onMousedown: (__VLS_ctx.onUpButtonDown) }, ...{ onMouseup: (__VLS_ctx.stopRotation) }, ...{ class: ("pixel-btn up") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("side-buttons") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onMousedown: (__VLS_ctx.onLeftButtonDown) }, ...{ onMouseup: (__VLS_ctx.stopRotation) }, ...{ class: ("pixel-btn left") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onMousedown: (__VLS_ctx.onRightButtonDown) }, ...{ onMouseup: (__VLS_ctx.stopRotation) }, ...{ class: ("pixel-btn right") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onMousedown: (__VLS_ctx.onDownButtonDown) }, ...{ onMouseup: (__VLS_ctx.stopRotation) }, ...{ class: ("pixel-btn down") }, });
    __VLS_styleScopedClasses['pixel-controls'];
    __VLS_styleScopedClasses['pixel-btn'];
    __VLS_styleScopedClasses['up'];
    __VLS_styleScopedClasses['side-buttons'];
    __VLS_styleScopedClasses['pixel-btn'];
    __VLS_styleScopedClasses['left'];
    __VLS_styleScopedClasses['pixel-btn'];
    __VLS_styleScopedClasses['right'];
    __VLS_styleScopedClasses['pixel-btn'];
    __VLS_styleScopedClasses['down'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {
        "threeCanvas": __VLS_nativeElements['div'],
    };
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            threeCanvas: threeCanvas,
            onLeftButtonDown: onLeftButtonDown,
            onRightButtonDown: onRightButtonDown,
            onUpButtonDown: onUpButtonDown,
            onDownButtonDown: onDownButtonDown,
            stopRotation: stopRotation,
        };
    },
    props: {
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
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {
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
    },
});
;
