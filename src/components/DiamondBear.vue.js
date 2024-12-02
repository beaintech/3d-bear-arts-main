import { ref, onMounted } from 'vue';
import * as THREE from 'three';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// Reference to the DOM container for Three.js
const threeCanvas = ref(null);
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform float time;
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

    gl_FragColor = vec4(color, 1.0);
  }
`;
onMounted(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Append renderer to DOM
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (threeCanvas.value) {
        threeCanvas.value.appendChild(renderer.domElement);
    }
    // Add ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    // Shader material
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        opacity: 0.1
    });
    // Create the bear parts
    const bearGroup = new THREE.Group();
    // Body
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, shaderMaterial);
    body.scale.set(0.85, 0.85, 0.8);
    body.position.y = -0.2;
    bearGroup.add(body);
    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const head = new THREE.Mesh(headGeometry, shaderMaterial);
    head.scale.set(1, 0.95, 0.95);
    head.position.set(0, 1, 0);
    bearGroup.add(head);
    // Ears
    const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const leftEar = new THREE.Mesh(earGeometry, shaderMaterial);
    leftEar.position.set(-0.45, 1.35, -0.1);
    bearGroup.add(leftEar);
    const rightEar = new THREE.Mesh(earGeometry, shaderMaterial);
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
    bearGroup.add(leftButtock);
    const rightButtock = new THREE.Mesh(buttockGeometry, shaderMaterial);
    rightButtock.position.set(0.15, -0.45, -0.4);
    bearGroup.add(rightButtock);
    const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const tail = new THREE.Mesh(tailGeometry, shaderMaterial);
    tail.position.set(0, -0.35, -0.75);
    bearGroup.add(tail);
    // Custom material for eyes
    const rightEyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4, metalness: 1, roughness: 0.44 });
    const leftEyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, metalness: 1, roughness: 0.44 });
    // Create diamond shape for the eyes
    const diamondShape = new THREE.Shape();
    diamondShape.moveTo(0, 0.15); // Top point
    diamondShape.lineTo(0.1, 0); // Right point
    diamondShape.lineTo(0, -0.15); // Bottom point
    diamondShape.lineTo(-0.1, 0); // Left point
    diamondShape.lineTo(0, 0.15); // Back to top
    const extrudeSettings = { depth: 0.07, bevelEnabled: false }; // Thinner depth
    const diamondGeometry = new THREE.ExtrudeGeometry(diamondShape, extrudeSettings);
    // Position diamond eyes
    const leftEye = new THREE.Mesh(diamondGeometry, rightEyeMaterial);
    leftEye.position.set(-0.25, 1, 0.5); // Adjust position on bear's head
    leftEye.rotation.y = Math.PI / 30; // Slight rotation to fit face shape
    bearGroup.add(leftEye);
    const rightEye = new THREE.Mesh(diamondGeometry, leftEyeMaterial);
    rightEye.position.set(0.25, 1, 0.5); // Adjust position on bear's head
    rightEye.rotation.y = Math.PI / 30; // Slight rotation to fit face shape
    bearGroup.add(rightEye);
    // Add the bear group to the scene
    scene.add(bearGroup);
    // Camera settings
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        shaderMaterial.uniforms.time.value += 0.1;
        bearGroup.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
    animate();
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
const __VLS_fnComponent = (await import('vue')).defineComponent({});
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ref: ("threeCanvas"), ...{ class: ("three-container") }, });
    // @ts-ignore navigation for `const threeCanvas = ref()`
    __VLS_ctx.threeCanvas;
    __VLS_styleScopedClasses['three-container'];
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
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
