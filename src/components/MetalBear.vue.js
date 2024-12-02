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
        // Load a bump map or texture that resembles leather grain
        const leatherBumpMap = textureLoader.load('/3d-bear-arts/assets/lv2.jpg');
        const lvLogoTexture = textureLoader.load('/3d-bear-arts/assets/lv2.jpg');
        // Ensure the textures repeat across the object surface
        leatherBumpMap.wrapS = leatherBumpMap.wrapT = THREE.RepeatWrapping;
        lvLogoTexture.wrapS = lvLogoTexture.wrapT = THREE.RepeatWrapping;
        // Simulate the leather material using MeshPhysicalMaterial
        const leatherMaterialWithLV = new THREE.MeshPhysicalMaterial({
            color: 0x7F4F28, // Brown leather color similar to LV
            metalness: 0.0, // Non-metallic
            roughness: 0.8, // High roughness for matte finish
            bumpMap: leatherBumpMap, // Bump map for leather texture
            bumpScale: 0.1, // Intensity of the leather grain texture
            clearcoat: 0.2, // Slight clearcoat for a subtle sheen
            clearcoatRoughness: 0.9, // Rough clearcoat to keep the matte look
            map: lvLogoTexture, // Apply the LV logo texture as the main texture
            envMapIntensity: 0.7, // Adjust the intensity of reflections if needed
        });
        const blackLeatherMaterialWithLV = new THREE.MeshPhysicalMaterial({
            color: 0x5b3a1e, // Brown leather color similar to LV
            metalness: 0.0, // Non-metallic
            roughness: 0.8, // High roughness for matte finish
            bumpMap: leatherBumpMap, // Bump map for leather texture
            bumpScale: 0.1, // Intensity of the leather grain texture
            clearcoat: 0.2, // Slight clearcoat for a subtle sheen
            clearcoatRoughness: 0.9, // Rough clearcoat to keep the matte look
            map: lvLogoTexture, // Apply the LV logo texture as the main texture
            envMapIntensity: 0.7, // Adjust the intensity of reflections if needed
        });
        const transparentLeatherMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xC8B19C, // Brown leather color (LV-style)
            metalness: 0.2, // Increase metalness for more reflectivity
            roughness: 0.05, // Lower roughness for a smooth, glass-like finish
            bumpMap: leatherBumpMap, // Bump map for leather grain texture
            bumpScale: 0.05, // Reduce bump scale for a more subtle texture
            clearcoat: 1.0, // Full clearcoat for high gloss and shine
            clearcoatRoughness: 0.05, // Lower clearcoat roughness to enhance the glassy effect
            map: lvLogoTexture, // Overlay the LV logo texture
            transparent: true, // Enable transparency
            opacity: 0.4, // Make it more see-through like glass
            transmission: 0.9, // Add transmission to give it a glass-like appearance
            envMapIntensity: 1.0, // Increase reflection intensity
            reflectivity: 0.9, // Enhance reflectivity to simulate glass
            ior: 1.45, // Index of refraction to give it more of a glass feel
            side: THREE.DoubleSide, // Ensure the material renders on both sides
        });
        const metallicMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xCCCCCC, // Light gray/silver color to resemble metal
            metalness: 1.0, // Set metalness to 1.0 for full metallic appearance
            roughness: 0.5, // Adjust roughness (higher values make it more matte, lower values make it more polished)
            clearcoat: 0.3, // Add some clearcoat for subtle shine
            clearcoatRoughness: 0.3, // Rough clearcoat for a more brushed metal look
        });
        // Create a half-sphere geometry
        const bodyGeometry = new THREE.SphereGeometry(1, // Radius
        32, // Width segments
        32, // Height segments
        0, // phiStart
        Math.PI // phiLength (half of the sphere)
        );
        const rightBody = new THREE.Mesh(bodyGeometry, transparentLeatherMaterial);
        const leftBody = new THREE.Mesh(bodyGeometry, leatherMaterialWithLV);
        rightBody.scale.set(0.85, 0.85, 0.8);
        leftBody.scale.set(0.85, 0.85, 0.8);
        rightBody.position.y = -0.2;
        leftBody.position.y = -0.2;
        rightBody.rotation.y = Math.PI / 2;
        leftBody.rotation.y = Math.PI * 1.5;
        // Create a circular geometry to fill the flat side
        const circleGeometry = new THREE.CircleGeometry(1, 32); // Radius should match the half-sphere
        const circle = new THREE.Mesh(circleGeometry, leatherMaterialWithLV);
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
        const leftHead = new THREE.Mesh(headGeometry, leatherMaterialWithLV);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5; // Rotate the left head to match orientation
        // Create the right half of the head
        const rightHead = new THREE.Mesh(headGeometry, transparentLeatherMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2; // Rotate the right head to match orientation
        // Create a circular geometry to fill the flat side
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32); // Radius matches the half-sphere
        const headCircle = new THREE.Mesh(headCircleGeometry, leatherMaterialWithLV);
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
        const leftEar = new THREE.Mesh(earGeometry, leatherMaterialWithLV);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
        const rightEar = new THREE.Mesh(earGeometry, transparentLeatherMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
        // Geometry for the left half of the snout
        const leftSnoutGeometry = new THREE.SphereGeometry(0.25, // Radius
        32, // Width segments
        32, // Height segments
        Math.PI / 2, // phiStart: Start at 90 degrees to create a half-sphere
        Math.PI // phiLength: Cover 180 degrees to create the half shape
        );
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, blackLeatherMaterialWithLV);
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
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, transparentLeatherMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8); // Make it wider at the front
        rightSnout.position.set(0, 0.84, 0.5); // Position the right half
        rightSnout.rotation.y = 0; // Align correctly without additional rotation
        // Circle to cover the flat sides
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, leatherMaterialWithLV);
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
            color: 0xffffff, // Use white color to simulate a diamond
            metalness: 0.0, // High metalness for a reflective surface
            roughness: 0.1, // Low roughness for a glossy appearance
            clearcoat: 1.0, // High clearcoat for added shine
            clearcoatRoughness: 0.1, // Smooth clearcoat
            transparent: true, // Enable transparency
            opacity: 0.85, // High opacity for translucence
            reflectivity: 1, // Increase reflectivity for better light interaction
            envMapIntensity: 1, // Make environment reflections more prominent
        });
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);
        // Create the small black heart tattoo mesh
        const smallHeart = new THREE.Mesh(heartGeometry, leatherMaterialWithLV);
        smallHeart.scale.set(0.1, 0.1, 0.1); // Scale the heart down to be small
        // Rotate the heart by 30 degrees (in radians) and position it on the left side of the bear's face
        smallHeart.rotation.z = THREE.MathUtils.degToRad(210); // Rotate 30 degrees
        smallHeart.rotation.x = THREE.MathUtils.degToRad(5);
        smallHeart.rotation.y = THREE.MathUtils.degToRad(-45);
        smallHeart.position.set(-0.4, 0.9, 0.45); // Position it on the pink side of the face
        // Add the heart to the bear group
        // bearGroup.add(smallHeart);
        const heart = new THREE.Mesh(heartGeometry, blackLeatherMaterialWithLV);
        heart.scale.set(0.6, 0.5, 0.5);
        heart.position.set(0.35, 0, 0); // Position it in front of the body
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        // bearGroup.add(heart);
        const heart3 = new THREE.Mesh(heartGeometry, blackLeatherMaterialWithLV);
        heart3.scale.set(0.2, 0.2, 0.2);
        heart3.position.set(0.5, -0.1, 0.2); // Position it in front of the body
        heart3.rotation.y = Math.PI;
        heart3.rotation.x = Math.PI;
        bearGroup.add(heart3);
        const bagGeometry = new THREE.BoxGeometry(1.3, 1.2, 0.6); // Increased thickness for the bag
        const bag = new THREE.Mesh(bagGeometry, leatherMaterialWithLV);
        bag.scale.set(0.45, 0.45, 0.45); // Scale of the bag
        bag.position.set(0.35, -0.2, 0.1); // Position the bag in front of the bear
        bag.rotation.y = Math.PI; // Rotate the bag
        // Create handles for the bag
        const handleGeometry = new THREE.TorusGeometry(0.15, 0.025, 10, 100);
        // Darker material for the handles
        const handleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7F4F28, // Darker leather color for the handles
            metalness: 0.3,
            roughness: 0.4,
            clearcoat: 0.5,
        });
        // Left handle
        const handle1 = new THREE.Mesh(handleGeometry, leatherMaterialWithLV);
        handle1.position.set(0.35, 0.1, 0.1); // Adjusted position to match the top of the bag
        handle1.rotation.z = Math.PI / 2; // Vertical rotation to align the handle properly
        handle1.rotation.x = Math.PI / 8; // Slight angle for natural look
        handle1.rotation.y = Math.PI / 14; // Slight angle for natural look
        // Right handle
        const handle2 = new THREE.Mesh(handleGeometry, leatherMaterialWithLV);
        handle2.position.set(0.35, 0.1, 0.13); // Adjusted position for the right handle
        handle2.rotation.z = Math.PI / 2; // Same vertical rotation for symmetry
        handle2.rotation.x = Math.PI / -8; // Same slight angle for a natural look
        handle2.rotation.y = Math.PI / 12; // Slight angle for natural look
        // Group bag and handles together
        const bagGroup = new THREE.Group();
        bagGroup.add(bag);
        bagGroup.add(handle1);
        bagGroup.add(handle2);
        // Add the bag group to the bear group
        bearGroup.add(bagGroup);
        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, leatherMaterialWithLV);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, transparentLeatherMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, leatherMaterialWithLV);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeometry, transparentLeatherMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, leatherMaterialWithLV);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);
        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, transparentLeatherMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);
        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, leatherMaterialWithLV);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);
        const rightButtock = new THREE.Mesh(buttockGeometry, transparentLeatherMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);
        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, leatherMaterialWithLV);
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
            const xEye = new THREE.Mesh(xEyeGeometry, blackLeatherMaterialWithLV);
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
            const oEye = new THREE.Mesh(oEyeGeometry, blackLeatherMaterialWithLV);
            oEye.position.set(0.14, .99, 0.53); // Position on the head
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);
            bearGroup.add(oEye);
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
