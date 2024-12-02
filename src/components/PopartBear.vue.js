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
let timeoutId = null; // Timeout for detecting mouse stop
let currentRotationY = 0; // Current rotation for Y-axis
let currentRotationX = 0; // Current rotation for X-axis
let isRotatingRight = ref(false); // Is rotating to right
let isRotatingLeft = ref(false); // Is rotating to left
let shouldFaceMouse = ref(false); // Should bear face the mouse?
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
        const popTexture1 = textureLoader.load('/3d-bear-arts/assets/pop6.jpg');
        const popTexture2 = textureLoader.load('/3d-bear-arts/assets/pop7.jpg');
        // https://www.google.com/imgres?q=pop%20art&imgurl=https%3A%2F%2Fi00.eu%2Fimg%2F605%2F1024x1024%2F9ahr1mu8%2F366098.jpg&imgrefurl=https%3A%2F%2Fwww.dovido.de%2FPop-Art-Bilder%2FWandbild-Pop-Art-Lutscher&docid=tZrAljc23vedzM&tbnid=aWwpNILeFq7VKM&vet=12ahUKEwiKs57Y-5OJAxXUnf0HHfLwHKYQM3oECHwQAA..i&w=1024&h=682&hcb=2&ved=2ahUKEwiKs57Y-5OJAxXUnf0HHfLwHKYQM3oECHwQAA
        popTexture1.wrapS = popTexture1.wrapT = THREE.RepeatWrapping;
        // popTexture1.repeat.set(2, 2); // Adjust this to scale the texture on the model
        popTexture2.wrapS = popTexture2.wrapT = THREE.RepeatWrapping;
        // popTexture2.repeat.set(2, 2); // Adjust this to scale the texture on the model
        // Left arm: Neon orange (#FFA500) with hints of red.
        // Right arm: Vibrant purple (#8A2BE2).
        // Legs: One in bright cyan (#00FFFF), the other in vivid pink (#FF69B4).
        // Tail: Gradient from blue to green (#00FA9A to #1E90FF).
        const popArtMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFF69B4, // Hot pink as the base
            map: popTexture2, // Apply the abstract or halftone texture
            metalness: 0.2, // Lower metalness for less reflective look
            roughness: 0.7, // Increase roughness for a more matte finish
            clearcoat: 0.05, // Lower clearcoat to reduce gloss
            clearcoatRoughness: 0.9, // Increase clearcoat roughness for less shine
        });
        const transparentPopArtMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFD700, // White base color
            // map: popTexture1,  // Halftone or abstract texture
            metalness: 0.3, // Lower metalness for a plastic-like effect
            roughness: 0.1, // Make it smoother for a glossy look
            clearcoat: 1.0, // High clearcoat for strong glossiness
            clearcoatRoughness: 0.05, // Make the clearcoat glossy
            transparent: true, // Enable transparency
            opacity: 0.4, // Set transparency level
            transmission: 0.8, // Enable transmission for glass-like effect
            ior: 1.45, // Index of refraction for glassy feel
            reflectivity: 0.9, // High reflectivity for a shiny surface
            envMapIntensity: 1.0, // Strong environment reflections
            side: THREE.DoubleSide, // Render both sides of the material
        });
        const headPopArtMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFD700, // Bright yellow color for the head
            map: popTexture1, // Apply a halftone or abstract texture
            metalness: 0.3, // Slight metalness for a subtle shine
            roughness: 0.5, // Some roughness to reduce reflections
        });
        const transparentHeadMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFF69B4, // White base color
            // map: popTexture2,  // Halftone or abstract texture
            metalness: 0.3, // Lower metalness for a plastic-like effect
            roughness: 0.1, // Make it smoother for a glossy look
            clearcoat: 1.0, // High clearcoat for strong glossiness
            clearcoatRoughness: 0.05, // Make the clearcoat glossy
            transparent: true, // Enable transparency
            opacity: 0.5, // Set transparency level
            transmission: 0.8, // Enable transmission for glass-like effect
            ior: 1.45, // Index of refraction for glassy feel
            reflectivity: 0.9, // High reflectivity for a shiny surface
            envMapIntensity: 1.0, // Strong environment reflections
            side: THREE.DoubleSide, // Render both sides of the material
        });
        const leftArmtMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8A2BE2, // Hot pink as the base
            map: popTexture1, // Apply the abstract or halftone texture
            metalness: 0.2, // Lower metalness for less reflective look
            roughness: 0.7, // Increase roughness for a more matte finish
            clearcoat: 0.05, // Lower clearcoat to reduce gloss
            clearcoatRoughness: 0.9, // Increase clearcoat roughness for less shine
        });
        const transparentArmMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8A2BE2, // White base color
            // map: popTexture2,  // Halftone or abstract texture
            metalness: 0.3, // Lower metalness for a plastic-like effect
            roughness: 0.1, // Make it smoother for a glossy look
            clearcoat: 1.0, // High clearcoat for strong glossiness
            clearcoatRoughness: 0.05, // Make the clearcoat glossy
            transparent: true, // Enable transparency
            opacity: 0.4, // Set transparency level
            transmission: 0.8, // Enable transmission for glass-like effect
            ior: 1.45, // Index of refraction for glassy feel
            reflectivity: 0.9, // High reflectivity for a shiny surface
            envMapIntensity: 1.0, // Strong environment reflections
            side: THREE.DoubleSide, // Render both sides of the material
        });
        const leftLegtMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00FFFF, // Hot pink as the base
            map: popTexture1, // Apply the abstract or halftone texture
            metalness: 0.2, // Lower metalness for less reflective look
            roughness: 0.7, // Increase roughness for a more matte finish
            clearcoat: 0.05, // Lower clearcoat to reduce gloss
            clearcoatRoughness: 0.9, // Increase clearcoat roughness for less shine
        });
        const transparentLegMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00FFFF, // White base color
            // map: popTexture1,  // Halftone or abstract texture
            metalness: 0.3, // Lower metalness for a plastic-like effect
            roughness: 0.1, // Make it smoother for a glossy look
            clearcoat: 1.0, // High clearcoat for strong glossiness
            clearcoatRoughness: 0.05, // Make the clearcoat glossy
            transparent: true, // Enable transparency
            opacity: 0.4, // Set transparency level
            transmission: 0.8, // Enable transmission for glass-like effect
            ior: 1.45, // Index of refraction for glassy feel
            reflectivity: 0.9, // High reflectivity for a shiny surface
            envMapIntensity: 1.0, // Strong environment reflections
            side: THREE.DoubleSide, // Render both sides of the material
        });
        // Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(1, // Radius
        32, // Width segments
        32, // Height segments
        0, // phiStart
        Math.PI // phiLength (half of the sphere)
        );
        const rightBody = new THREE.Mesh(bodyGeometry, transparentPopArtMaterial);
        const leftBody = new THREE.Mesh(bodyGeometry, popArtMaterial);
        rightBody.scale.set(0.85, 0.85, 0.8);
        leftBody.scale.set(0.85, 0.85, 0.8);
        rightBody.position.y = -0.2;
        leftBody.position.y = -0.2;
        rightBody.rotation.y = Math.PI / 2;
        leftBody.rotation.y = Math.PI * 1.5;
        // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, popArtMaterial);
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
        const leftHead = new THREE.Mesh(headGeometry, headPopArtMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation
        // Create the right half of the head
        const rightHead = new THREE.Mesh(headGeometry, transparentHeadMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation
        // Create a circular geometry to fill the flat side
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
        const headCircle = new THREE.Mesh(headCircleGeometry, headPopArtMaterial);
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
        const leftEar = new THREE.Mesh(earGeometry, popArtMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
        const rightEar = new THREE.Mesh(earGeometry, transparentPopArtMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
        // Geometry for the left half of the snout
        const leftSnoutGeometry = new THREE.SphereGeometry(0.25, // Radius
        32, // Width segments
        32, // Height segments
        Math.PI / 2, // phiStart: Start at 90 degrees to create a half-sphere
        Math.PI // phiLength: Cover 180 degrees to create the half shape
        );
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, headPopArtMaterial);
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
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, transparentHeadMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        rightSnout.position.set(0, 0.84, 0.5); // Position the right half
        rightSnout.rotation.y = 0; // Align correctly without additional rotation
        // Circle to cover the flat sides
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, headPopArtMaterial);
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
        // Add the heart to the bear group
        // bearGroup.add(smallHeart);
        const heart = new THREE.Mesh(heartGeometry, headPopArtMaterial);
        heart.scale.set(0.5, 0.5, 0.5);
        heart.position.set(0.35, 0, 0); // Position it in front of the body
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);
        const heart1 = new THREE.Mesh(heartGeometry, leftLegtMaterial);
        heart1.scale.set(0.2, 0.2, 0.25);
        heart1.position.set(0.5, -0.3, 0.4); // Position it in front of the body
        heart1.rotation.y = Math.PI;
        heart1.rotation.x = Math.PI;
        bearGroup.add(heart1);
        const heart3 = new THREE.Mesh(heartGeometry, popArtMaterial);
        heart3.scale.set(0.25, 0.25, 0.27);
        heart3.position.set(0.4, 0.3, -0.2); // Position it in front of the body
        heart3.rotation.y = Math.PI;
        heart3.rotation.x = Math.PI;
        bearGroup.add(heart3);
        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, leftLegtMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, transparentLegMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, headPopArtMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeometry, transparentHeadMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, headPopArtMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);
        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, transparentHeadMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);
        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, popArtMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);
        const rightButtock = new THREE.Mesh(buttockGeometry, transparentPopArtMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);
        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, popArtMaterial);
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
            const xEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
            const xEye = new THREE.Mesh(xEyeGeometry, popArtMaterial);
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
            const oEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
            const oEye = new THREE.Mesh(oEyeGeometry, leftLegtMaterial);
            oEye.position.set(0.14, .99, 0.53); // Position on the head
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);
            bearGroup.add(oEye);
            // Create 3D text for "POP" using TextGeometry
            const textGeometry = new TextGeometry('POP', {
                font: font,
                size: 1, // Size of the letters
                height: 0.5, // Depth of the letters
                curveSegments: 12, // Smooth curves
                bevelEnabled: true, // Enable bevel
                bevelThickness: 0.1, // Thickness of the bevel
                bevelSize: 0.1, // Bevel size
                bevelSegments: 5, // Number of bevel segments
            });
            // Create a vibrant material for the text (pop-art style)
            const popArtTextMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xFF1493, // Use a bright pink color
                metalness: 0.3, // Some metalness for shine
                roughness: 0.6, // Slight roughness for a less reflective look
                clearcoat: 0.2, // A slight clearcoat for glossiness
            });
            const popArtTextMaterial2 = new THREE.MeshPhysicalMaterial({
                color: 0xFFD700, // Use a bright pink color
                metalness: 0.3, // Some metalness for shine
                roughness: 0.6, // Slight roughness for a less reflective look
                clearcoat: 0.2, // A slight clearcoat for glossiness
            });
            const popArtTextMaterial3 = new THREE.MeshPhysicalMaterial({
                color: 0xFFD700, // Use a bright pink color
                metalness: 0.3, // Some metalness for shine
                roughness: 0.6, // Slight roughness for a less reflective look
                clearcoat: 0.2, // A slight clearcoat for glossiness
            });
            const popArtTextMaterial4 = new THREE.MeshPhysicalMaterial({
                color: 0xFFA500, // Use a bright pink color
                metalness: 0.3, // Some metalness for shine
                roughness: 0.6, // Slight roughness for a less reflective look
                clearcoat: 0.2, // A slight clearcoat for glossiness
            });
            // Left arm: Neon orange (#FFA500) with hints of red.
            // Right arm: Vibrant purple (#8A2BE2).
            // Legs: One in bright cyan (#00FFFF), the other in vivid pink (#FF69B4).
            // Tail: Gradient from blue to green (#00FA9A to #1E90FF).
            // Create a mesh for the "POP" text
            const popTextMesh = new THREE.Mesh(textGeometry, popArtTextMaterial);
            popTextMesh.scale.set(0.15, .15, .15); // Scale it up a bit
            popTextMesh.position.set(0.03, 1.16, 0.1); // Adjust position as need 1
            popTextMesh.rotateZ(-25); // Scale it up a bit
            // Add the text to the bear group or scene
            bearGroup.add(popTextMesh);
            const popTextMesh2 = new THREE.Mesh(textGeometry, leftArmtMaterial);
            popTextMesh2.scale.set(0.14, .14, .14); // Scale it up a bit
            popTextMesh2.rotateZ(45); // Scale it up a bit
            popTextMesh2.position.set(0.2, -0.7, 0.3); // Adjust position as need 1
            bearGroup.add(popTextMesh2);
            const popTextMesh3 = new THREE.Mesh(textGeometry, popArtTextMaterial3);
            popTextMesh3.scale.set(0.14, .14, .14); // Scale it up a bit
            popTextMesh3.rotateZ(45); // Scale it up a bit
            popTextMesh3.rotateY(45); // Scale it up a bit
            popTextMesh3.position.set(0.3, 0.7, 0.3); // Adjust position as need 1
            bearGroup.add(popTextMesh3);
            const popTextMesh4 = new THREE.Mesh(textGeometry, popArtTextMaterial3);
            popTextMesh4.scale.set(0.15, .15, .15); // Scale it up a bit
            popTextMesh4.rotateZ(45); // Scale it up a bit
            popTextMesh4.rotateY(45); // Scale it up a bit
            popTextMesh4.position.set(0.35, -1.5, 0.3); // Adjust position as need 1
            bearGroup.add(popTextMesh4);
            const popTextMesh5 = new THREE.Mesh(textGeometry, popArtTextMaterial4);
            popTextMesh5.scale.set(0.17, .17, .17); // Scale it up a bit
            popTextMesh5.rotateZ(45); // Scale it up a bit
            popTextMesh5.rotateY(15); // Scale it up a bit
            popTextMesh5.position.set(0.35, 1, 0.3); // Adjust position as need 1
            bearGroup.add(popTextMesh5);
        });
        // Update heart renderOrder to ensure it's always drawn last
        tail.renderOrder = 1;
        // Add bear group to the scene
        bearGroup.scale.set(1.35, 1.35, 1.35);
        scene.add(bearGroup);
        // Set initial positions for bearGroup and camera
        bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
        camera.position.set(props.bodyPosition.x, 1, props.cameraPosition);
        camera.lookAt(props.bodyPosition.x, 0, 0);
        camera.position.z = 4;
        // Store the current rotation of the bear when the mouse stops
        const storeCurrentRotation = () => {
            currentRotationY = bearGroup.rotation.y;
            currentRotationX = bearGroup.rotation.x;
        };
        // Start rotating to right or left when mouse stops
        const startRotateRight = () => {
            isRotatingRight.value = true;
            isRotatingLeft.value = false;
            shouldFaceMouse.value = false;
        };
        const startRotateLeft = () => {
            isRotatingRight.value = false;
            isRotatingLeft.value = true;
            shouldFaceMouse.value = false;
        };
        // Stop all rotations
        const stopRotation = () => {
            isRotatingRight.value = false;
            isRotatingLeft.value = false;
            storeCurrentRotation();
        };
        // Update the logic to store the current rotation when the mouse stops
        const handleMouseStop = (mouseX) => {
            const centerX = window.innerWidth / 2;
            // If mouse stops on the right side, rotate to right, otherwise to the left
            if (mouseX > centerX) {
                startRotateRight();
            }
            else {
                startRotateLeft();
            }
            // Capture the current rotation of the bear when the mouse stops
            storeCurrentRotation();
        };
        // Logic to update bear rotation based on the mouse movement
        const onMouseMove = (event) => {
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
        window.addEventListener('mousemove', onMouseMove);
        // Logic to trigger the bear facing the mouse (after 2 seconds of no movement)
        const onMouseStopForFacing = (event) => {
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
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            // Rotate bear to right or left if necessary
            if (isRotatingRight.value) {
                bearGroup.rotation.y += 0.03; // Rotate to the right
            }
            else if (isRotatingLeft.value) {
                bearGroup.rotation.y -= 0.03; // Rotate to the left
            }
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
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ref: ("threeCanvas"), ...{ class: ((__VLS_ctx.background ? 'no-bg' : 'three-canvas')) }, });
    // @ts-ignore navigation for `const threeCanvas = ref()`
    __VLS_ctx.threeCanvas;
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
