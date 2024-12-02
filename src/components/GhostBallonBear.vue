<template>
    <div ref="threeCanvas" :class="background ? 'no-bg' : 'three-canvas'"></div>
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
import { ref, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; 
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; 

const props = defineProps({
    background: { type: Boolean, default: false },
    cameraPosition: { type: Number, default: 5 },
    bodyPosition: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) }
});
const threeCanvas = ref<HTMLDivElement | null>(null);
let isRotatingRight = ref(false);
let isRotatingLeft = ref(false);
let isRotatingUp = ref(false);
let isRotatingDown = ref(false);

onMounted(() => {
    if (threeCanvas.value) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeCanvas.value.appendChild(renderer.domElement);

        const bearGroup = new THREE.Group();
        const textGroup = new THREE.Group();
        scene.add(textGroup);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 5, 50);
        pointLight.position.set(0, 2, 4);
        scene.add(pointLight);

        const textureLoader = new THREE.TextureLoader();
        const ghostTexture = textureLoader.load('/3d-bear-arts/assets/ghost.jpg');
        ghostTexture.wrapS = ghostTexture.wrapT = THREE.RepeatWrapping;
        ghostTexture.repeat.set(2, 2);

        const ghostTexture2 = textureLoader.load('/3d-bear-arts/assets/ghost.jpg');
        ghostTexture2.wrapS = ghostTexture2.wrapT = THREE.RepeatWrapping;
        ghostTexture2.repeat.set(1, 1);

        const rightBodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.0,
            roughness: 0.8,
            clearcoat: 0.3,
            clearcoatRoughness: 0.9,
            transparent: true,
            opacity: 0.15,
            transmission: 0.95,
            ior: 1.1,
            reflectivity: 0.2,
            envMapIntensity: 0.3,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const rightOtherPartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.0,
            roughness: 0.8,
            clearcoat: 0.3,
            clearcoatRoughness: 0.9,
            transparent: true,
            opacity: 0.1,
            envMapIntensity: 0.3,
        });

        const heartTransparentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8B0000,  // Silver color
            map: ghostTexture,
            metalness: 0.9,    // Fully metallic for reflective surface
            roughness: 0.25,    // Slightly rough to blur reflections
            clearcoat: 0.7,    // Adds a layer of reflectiveness on top
            clearcoatRoughness: 0.3,  // Roughness of the clear coat layer
        });

        const ghostlyBalloonMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.1,
            roughness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.1,
            transmission: 0.95,
            ior: 1.0,
            reflectivity: 0.2,
            envMapIntensity: 0.4,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const leftBodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.3,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.45,
            transmission: 0.8,
            reflectivity: 0.9,
            envMapIntensity: 1.0,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const leftOtherPartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            metalness: 0.3,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.45,
            transmission: 0.8,
            reflectivity: 0.9,
            envMapIntensity: 1.0,
            side: THREE.DoubleSide
        });

        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI);
        const rightBody = new THREE.Mesh(bodyGeometry, rightBodyMaterial);
        const leftBody = new THREE.Mesh(bodyGeometry, leftBodyMaterial);
    
        rightBody.scale.set(0.85, 0.85, 0.8);
        leftBody.scale.set(0.85, 0.85, 0.8);
    
        rightBody.position.y = -0.2;
        leftBody.position.y = -0.2;
    
        rightBody.rotation.y = Math.PI / 2;
        leftBody.rotation.y = Math.PI * 1.5;
  
        const circleGeometry = new THREE.CircleGeometry(1, 32);
        const circle = new THREE.Mesh(circleGeometry, leftBodyMaterial);
        circle.scale.set(0.85, 0.85, 0.8);
  
        circle.position.set(0, -0.2, 0);
        circle.rotation.y = Math.PI / 2;
  
        const halfSphereGroup = new THREE.Group();
        halfSphereGroup.add(rightBody);
        halfSphereGroup.add(leftBody);
        halfSphereGroup.add(circle);
  
        bearGroup.add(halfSphereGroup);
  
        const headGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI);
  
        const leftHead = new THREE.Mesh(headGeometry, leftOtherPartMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5;
  
        const rightHead = new THREE.Mesh(headGeometry, rightOtherPartMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2;
  
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32);
        const headCircle = new THREE.Mesh(headCircleGeometry, leftBodyMaterial);
  
        headCircle.position.set(0, 1, 0);
        headCircle.rotation.y = Math.PI / 2;
        headCircle.scale.set(1, 0.95, 0.95);
  
        const halfHeadSphereGroup = new THREE.Group();
        halfHeadSphereGroup.add(leftHead);
        halfHeadSphereGroup.add(rightHead);
        halfHeadSphereGroup.add(headCircle);
  
        bearGroup.add(halfHeadSphereGroup);
    
        const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const leftEar = new THREE.Mesh(earGeometry, leftOtherPartMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
    
        const rightEar = new THREE.Mesh(earGeometry, rightOtherPartMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
    
        const leftSnoutGeometry = new THREE.SphereGeometry(0.25, 32, 32, Math.PI / 2, Math.PI);
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, leftOtherPartMaterial);
        leftSnout.scale.set(1.1, 0.6, 0.8);
        leftSnout.position.set(0, 0.84, 0.5);
        leftSnout.rotation.y = Math.PI;
  
        const rightSnoutGeometry = new THREE.SphereGeometry(0.25, 32, 32, Math.PI / 2, Math.PI);
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, rightOtherPartMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8);
        rightSnout.position.set(0, 0.84, 0.5);
        rightSnout.rotation.y = 0;
  
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, ghostlyBalloonMaterial);
        snoutCircle.scale.set(0.8, 0.6, 0.8);
        snoutCircle.position.set(0, 0.84, 0.5);
        snoutCircle.rotation.y = Math.PI / 2;
  
        const halfSnoutGroup = new THREE.Group();
        halfSnoutGroup.add(leftSnout);
        halfSnoutGroup.add(rightSnout);
        halfSnoutGroup.add(snoutCircle);
  
        bearGroup.add(halfSnoutGroup);
    
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
        heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
        heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
    
        const extrudeHeartSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeHeartSettings);
        const heart = new THREE.Mesh(heartGeometry, heartTransparentMaterial);
        heart.scale.set(0.35, 0.35, 0.35);
        heart.position.set(0, -0.05, 0); 
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);
        
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, leftBodyMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
    
        const rightArm = new THREE.Mesh(armGeometry, ghostlyBalloonMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
    
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, leftBodyMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
    
        const rightLeg = new THREE.Mesh(legGeometry, ghostlyBalloonMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
    
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, leftBodyMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5);
        leftBootFront.position.set(-0.4, -1.45, 0.17);
        bearGroup.add(leftBootFront);
      
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, ghostlyBalloonMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5);
        rightBootFront.position.set(0.4, -1.45, 0.17);
        bearGroup.add(rightBootFront);
    
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32);
        const leftButtock = new THREE.Mesh(buttockGeometry, ghostlyBalloonMaterial);
        leftButtock.position.set(-0.15, -0.45, -0.4);
        bearGroup.add(leftButtock);
    
        const rightButtock = new THREE.Mesh(buttockGeometry, ghostlyBalloonMaterial);
        rightButtock.position.set(0.15, -0.45, -0.4);
        bearGroup.add(rightButtock);
    
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, leftBodyMaterial);
        tail.position.set(0, -0.35, -0.8);
        bearGroup.add(tail);

        const bloodHalfSphereGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const bloodMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8B0000,
            metalness: 0.3,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.8,
            transmission: 0.85,
            ior: 1.4,
            reflectivity: 0.9,
            envMapIntensity: 1.2
        });

        const bloodMesh = new THREE.Mesh(bloodHalfSphereGeometry, bloodMaterial);
        bloodMesh.position.set(0, -0.2, 0);
        bloodMesh.rotation.x = Math.PI;
        bloodMesh.scale.set(1.25, 1.25, 1.25);

        halfSphereGroup.add(bloodMesh);

        const bloodSurfaceMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: true,
            uniforms: {
                u_time: { value: 0.0 },
                u_waveFrequency: { value: 4.0 }, 
                u_waveAmplitude: { value: 0.5 }, 
                u_waveSpeed: { value: 0.3 },
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

                    vec3 baseColor = vec3(0.3, 0.0, 0.0);
                    vec3 waveColor = vec3(1.0, 0.1, 0.1);

                    vec3 color = mix(baseColor, waveColor, 0.5 + (waveX + waveY) * 0.5); 
                    gl_FragColor = vec4(color, 0.75); // Adjust opacity for visibility
                }
            `,
        });

        const bloodSurface = new THREE.Mesh(circleGeometry, bloodSurfaceMaterial);
        bloodSurface.position.set(0, -0.26, 0);
        bloodSurface.scale.set(0.7, 0.7, 0.7);
        bloodSurface.rotation.x = -Math.PI / 2;
        bloodSurface.renderOrder = 1;

        halfSphereGroup.add(bloodSurface);

        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const xEyeGeometry = new TextGeometry('X', { font: font, size: 0.2, depth: 0.05 });
            const xEye = new THREE.Mesh(xEyeGeometry, leftBodyMaterial);
            xEye.position.set(-0.3, 0.99, 0.53);
            xEye.rotation.x = THREE.MathUtils.degToRad(-5);
            xEye.rotation.y = THREE.MathUtils.degToRad(-15);
            bearGroup.add(xEye);
  
            const oEyeGeometry = new TextGeometry('O', { font: font, size: 0.2, depth: 0.05 });
            const oEye = new THREE.Mesh(oEyeGeometry, leftBodyMaterial);
            oEye.position.set(0.14, 0.99, 0.53);
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);
            bearGroup.add(oEye);
        });

        tail.renderOrder = 1;

        bearGroup.rotation.x = 0.1;

        bearGroup.scale.set(1.4, 1.4, 1.4); 
        scene.add(bearGroup);

        bearGroup.position.set(props.bodyPosition.x, props.bodyPosition.y, props.bodyPosition.z);
        camera.position.set(props.bodyPosition.x, 1, props.cameraPosition);
        camera.lookAt(props.bodyPosition.x, 0, 0);
  
        camera.position.z = 4;

        const mouse = { x: 0, y: 0 };

        const onMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const targetRotationY = mouse.x * Math.PI * 0.2;
            const targetRotationX = mouse.y * Math.PI * 0.2;

            bearGroup.rotation.y = targetRotationY;
            bearGroup.rotation.x = targetRotationX;
        };

        let floatSpeed = 0.05; 
        let floatHeartSpeed = 0.06; 

        let floatHeartAmplitude = 0.2; 
        let floatAmplitude = 0.25; 
        let time = 0;
        let heartTime = 0;

        function animate() {
            requestAnimationFrame(animate);

            if (isRotatingRight.value) bearGroup.rotation.y += 0.03;
            if (isRotatingLeft.value) bearGroup.rotation.y -= 0.03;
            if (isRotatingUp.value) bearGroup.rotation.x -= 0.03;
            if (isRotatingDown.value) bearGroup.rotation.x += 0.03;

            heart.rotation.y += 0.03;
            
            time += floatSpeed;
            heartTime += floatHeartSpeed;
            bearGroup.position.y = props.bodyPosition.y + Math.sin(time) * floatAmplitude;     
            heart.position.y = props.bodyPosition.y + Math.sin(heartTime) * floatHeartAmplitude;        
            bloodSurfaceMaterial.uniforms.u_time.value += 0.25;

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

function onLeftButtonDown() { isRotatingLeft.value = true; }
function onRightButtonDown() { isRotatingRight.value = true; }
function onUpButtonDown() { isRotatingUp.value = true; }
function onDownButtonDown() { isRotatingDown.value = true; }
function stopRotation() {
    isRotatingLeft.value = false;
    isRotatingRight.value = false;
    isRotatingUp.value = false;
    isRotatingDown.value = false;
}
</script>

<style scoped>
.three-canvas {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: radial-gradient(circle, #0A0000 50%, #3D0000 30%, #8B0000 10%);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.no-bg {
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: none;
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
    background-color: #660000;
    color: #FFD700;
    padding: 15px;
    border: 4px solid #8B0000;
    box-shadow: 3px 3px 0 #3D0000, 6px 6px 0 #1C1C1C;
    text-transform: uppercase;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    border-radius: 10px;
}

.pixel-btn:hover {
    background-color: #FF0000;
    color: #0A0000;
    transform: translate(-3px, -3px);
}

.pixel-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #3D0000, 2px 2px 0 #1C1C1C;
}


/* transform: translateX(120%) translateY(-100%); */

</style>
