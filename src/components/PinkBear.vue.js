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
        default: 4
    },
    bodyPosition: {
        type: Object,
        default: () => ({ x: 0, y: 0, z: 0 })
    },
    noAnimation: {
        type: Boolean,
        default: false, // Set default to `false`, meaning animation runs by default
    },
});
const threeCanvas = ref(null);
onMounted(() => {
    if (threeCanvas.value) {
        // Initialize the Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // if (!props.background) {
        // renderer.setClearColor(0x87CEFA); // Light blue background if background is true
        // } else {
        //   renderer.setClearColor(0x000000, 0); // Transparent background
        // }
        // Enable gamma correction
        // renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        threeCanvas.value.appendChild(renderer.domElement);
        // Add lighting (increase intensities and add a point light)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased intensity
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
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
        // Gummy pink material for the bear (reduce roughness to make it shinier)
        const gummyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFF69B4, // Hot pink
            metalness: 0.2, // Increased metalness for more light reflection
            roughness: 0.5, // Reduced roughness for a shinier appearance
            clearcoat: 0.1, // Higher clearcoat for more shine
            clearcoatRoughness: 0.8, // Reduced clearcoat roughness for shinier coat
            transparent: true,
            opacity: 0.99,
        });
        const heartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xCC0000, // Pink color for the heart
            metalness: 0.4,
            roughness: 0.3, // Reduced roughness for shinier heart
            clearcoat: 0.3,
            clearcoatRoughness: 0.2,
            transparent: true,
            opacity: 0.99,
        });
        // Create the bear group and all parts
        const bearGroup = new THREE.Group();
        // Bear body
        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
        const body = new THREE.Mesh(bodyGeometry, gummyMaterial);
        body.scale.set(0.85, 0.85, 0.8);
        body.position.y = -0.2;
        bearGroup.add(body);
        // Bear head
        const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
        const head = new THREE.Mesh(headGeometry, gummyMaterial);
        head.scale.set(1, 0.95, 0.95);
        head.position.set(0, 1, 0);
        bearGroup.add(head);
        // Bear ears
        const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const leftEar = new THREE.Mesh(earGeometry, gummyMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
        const rightEar = new THREE.Mesh(earGeometry, gummyMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
        // Bear snout
        const snoutGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const snout = new THREE.Mesh(snoutGeometry, gummyMaterial);
        snout.scale.set(1, 0.6, 0.8);
        snout.position.set(0, 0.85, 0.5);
        bearGroup.add(snout);
        // Heart shape
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
        heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
        heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
        // Extrude the heart shape into 3D
        const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.scale.set(0.5, 0.5, 0.5);
        heart.position.set(0, 0.34, 0.8);
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);
        // Bear arms
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, gummyMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
        const rightArm = new THREE.Mesh(armGeometry, gummyMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
        // Bear legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, gummyMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeometry, gummyMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
        // Define the boot front geometry
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Front half-round for the boot
        // Left boot front
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, gummyMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        leftBootFront.position.set(-0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(leftBootFront);
        // Right boot front
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, gummyMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5); // Reduced size, flattened and extended front
        rightBootFront.position.set(0.4, -1.45, 0.17); // Position in front of the base
        bearGroup.add(rightBootFront);
        // Create rounded buttocks
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32); // Geometry for the buttocks
        const leftButtock = new THREE.Mesh(buttockGeometry, gummyMaterial);
        leftButtock.position.set(-0.15, -.45, -0.4); // Position the left buttock behind the body
        bearGroup.add(leftButtock);
        const rightButtock = new THREE.Mesh(buttockGeometry, gummyMaterial);
        rightButtock.position.set(0.15, -.45, -0.4); // Position the right buttock behind the body
        bearGroup.add(rightButtock);
        // Bear tail
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, heartMaterial);
        tail.position.set(0, -0.35, -0.8);
        bearGroup.add(tail);
        // Load font and create 3D text
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const xEyeGeometry = new TextGeometry('X', {
                font: font,
                size: 0.2,
                depth: 0.05,
            });
            const xEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
            const xEye = new THREE.Mesh(xEyeGeometry, xEyeMaterial);
            xEye.position.set(-0.34, 1, 0.5); // Position on the head
            bearGroup.add(xEye);
        });
        // Create the O eye
        const oEyeGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Smaller sphere for O eye
        const oEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black color
        const oEye = new THREE.Mesh(oEyeGeometry, oEyeMaterial);
        oEye.position.set(0.2, 1.1, 0.54); // Position on the head
        bearGroup.add(oEye);
        // Add bear group to the scene
        scene.add(bearGroup);
        // Animation function
        function animate() {
            if (!props.noAnimation) {
                requestAnimationFrame(animate);
                bearGroup.rotation.y += 0.03;
                bigHeartMaterial.uniforms.time.value += 0.03;
            }
            renderer.render(scene, camera);
        }
        // Start animation
        animate();
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
const __VLS_fnComponent = (await import('vue')).defineComponent({
    props: {
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
        },
        noAnimation: {
            type: Boolean,
            default: false, // Set default to `false`, meaning animation runs by default
        },
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
            default: 4
        },
        bodyPosition: {
            type: Object,
            default: () => ({ x: 0, y: 0, z: 0 })
        },
        noAnimation: {
            type: Boolean,
            default: false, // Set default to `false`, meaning animation runs by default
        },
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
            default: 4
        },
        bodyPosition: {
            type: Object,
            default: () => ({ x: 0, y: 0, z: 0 })
        },
        noAnimation: {
            type: Boolean,
            default: false, // Set default to `false`, meaning animation runs by default
        },
    },
});
;
