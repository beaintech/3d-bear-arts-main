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
        const pumpkinTexture = textureLoader.load('/3d-bear-arts/assets/pumpkin.jpg');
        pumpkinTexture.wrapS = pumpkinTexture.wrapT = THREE.RepeatWrapping;
        pumpkinTexture.repeat.set(0.8, .85);

        const pumpkinTexture2 = textureLoader.load('/3d-bear-arts/assets/pumpkin.jpg');
        pumpkinTexture2.wrapS = pumpkinTexture2.wrapT = THREE.RepeatWrapping;
        pumpkinTexture2.repeat.set(1, 1);

        const pumpkinTexture3 = textureLoader.load('/3d-bear-arts/assets/pumpkin.jpg');
        pumpkinTexture3.wrapS = pumpkinTexture2.wrapT = THREE.RepeatWrapping;
        pumpkinTexture3.repeat.set(2, .8);

        const heartMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff8c00,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const pumpkinGroup = new THREE.Group();
        const pumpkinBodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff8c00,
            map: pumpkinTexture,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const pumpkinMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff8c00,
            map: pumpkinTexture2,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const transparentPumpkinMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff8c00,
            map: pumpkinTexture3,
            metalness: 0.3,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.6,
            transmission: 0.8,
            ior: 1.45,
            reflectivity: 0.9,
            envMapIntensity: 1.0,
            side: THREE.DoubleSide
        });

        const smallPumpkinMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff8c00,
            map: pumpkinTexture3,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const pumpkinGoldMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFD700,
            map: pumpkinTexture,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const pumpkinRedMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8B0000,
            map: pumpkinTexture,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const pumpkinPurpleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4B0082,
            map: pumpkinTexture,
            metalness: 0.2,
            roughness: 0.7,
            clearcoat: 0.05,
            clearcoatRoughness: 0.9
        });

        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI);
        const rightBody = new THREE.Mesh(bodyGeometry, transparentPumpkinMaterial);
        const leftBody = new THREE.Mesh(bodyGeometry, pumpkinBodyMaterial);
    
        rightBody.scale.set(0.85, 0.85, 0.8);
        leftBody.scale.set(0.85, 0.85, 0.8);
    
        rightBody.position.y = -0.2;
        leftBody.position.y = -0.2;
    
        rightBody.rotation.y = Math.PI / 2;
        leftBody.rotation.y = Math.PI * 1.5;
  
        const circleGeometry = new THREE.CircleGeometry(1, 32);
        const circle = new THREE.Mesh(circleGeometry, pumpkinMaterial);
        circle.scale.set(0.85, 0.85, 0.8);
  
        circle.position.set(0, -0.2, 0);
        circle.rotation.y = Math.PI / 2;
  
        const halfSphereGroup = new THREE.Group();
        halfSphereGroup.add(rightBody);
        halfSphereGroup.add(leftBody);
        halfSphereGroup.add(circle);
  
        bearGroup.add(halfSphereGroup);
  
        const headGeometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI);
  
        const leftHead = new THREE.Mesh(headGeometry, pumpkinBodyMaterial);
        leftHead.scale.set(1, 0.95, 0.95);
        leftHead.position.set(0, 1, 0);
        leftHead.rotation.y = Math.PI * 1.5;
  
        const rightHead = new THREE.Mesh(headGeometry, transparentPumpkinMaterial);
        rightHead.scale.set(1, 0.95, 0.95);
        rightHead.position.set(0, 1, 0);
        rightHead.rotation.y = Math.PI / 2;
  
        const headCircleGeometry = new THREE.CircleGeometry(0.6, 32);
        const headCircle = new THREE.Mesh(headCircleGeometry, pumpkinMaterial);
  
        headCircle.position.set(0, 1, 0);
        headCircle.rotation.y = Math.PI / 2;
        headCircle.scale.set(1, 0.95, 0.95);
  
        const halfHeadSphereGroup = new THREE.Group();
        halfHeadSphereGroup.add(leftHead);
        halfHeadSphereGroup.add(rightHead);
        halfHeadSphereGroup.add(headCircle);
  
        bearGroup.add(halfHeadSphereGroup);
    
        const earGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const leftEar = new THREE.Mesh(earGeometry, smallPumpkinMaterial);
        leftEar.position.set(-0.45, 1.35, -0.1);
        bearGroup.add(leftEar);
    
        const rightEar = new THREE.Mesh(earGeometry, transparentPumpkinMaterial);
        rightEar.position.set(0.45, 1.35, -0.1);
        bearGroup.add(rightEar);
    
        const leftSnoutGeometry = new THREE.SphereGeometry(0.25, 32, 32, Math.PI / 2, Math.PI);
        const leftSnout = new THREE.Mesh(leftSnoutGeometry, pumpkinBodyMaterial);
        leftSnout.scale.set(1.1, 0.6, 0.8);
        leftSnout.position.set(0, 0.84, 0.5);
        leftSnout.rotation.y = Math.PI;
  
        const rightSnoutGeometry = new THREE.SphereGeometry(0.25, 32, 32, Math.PI / 2, Math.PI);
        const rightSnout = new THREE.Mesh(rightSnoutGeometry, transparentPumpkinMaterial);
        rightSnout.scale.set(1.1, 0.6, 0.8);
        rightSnout.position.set(0, 0.84, 0.5);
        rightSnout.rotation.y = 0;
  
        const snoutCircleGeometry = new THREE.CircleGeometry(0.25, 32);
        const snoutCircle = new THREE.Mesh(snoutCircleGeometry, pumpkinBodyMaterial);
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
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.scale.set(0.3, 0.3, 0.3);
        heart.position.set(0.25, 1.1, 0); 
        heart.rotation.y = Math.PI;
        heart.rotation.x = Math.PI;
        bearGroup.add(heart);
        
        const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const leftArm = new THREE.Mesh(armGeometry, pumpkinMaterial);
        leftArm.scale.set(0.75, 1.25, 0.65);
        leftArm.position.set(-0.7, -0.15, 0.2);
        bearGroup.add(leftArm);
    
        const rightArm = new THREE.Mesh(armGeometry, transparentPumpkinMaterial);
        rightArm.scale.set(0.75, 1.25, 0.65);
        rightArm.position.set(0.7, -0.15, 0.2);
        bearGroup.add(rightArm);
    
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
        const leftLeg = new THREE.Mesh(legGeometry, pumpkinMaterial);
        leftLeg.position.set(-0.4, -1.05, 0);
        bearGroup.add(leftLeg);
    
        const rightLeg = new THREE.Mesh(legGeometry, transparentPumpkinMaterial);
        rightLeg.position.set(0.4, -1.05, 0);
        bearGroup.add(rightLeg);
    
        const bootFrontGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      
        const leftBootFront = new THREE.Mesh(bootFrontGeometry, smallPumpkinMaterial);
        leftBootFront.scale.set(1, 0.72, 1.5);
        leftBootFront.position.set(-0.4, -1.45, 0.17);
        bearGroup.add(leftBootFront);
      
        const rightBootFront = new THREE.Mesh(bootFrontGeometry, transparentPumpkinMaterial);
        rightBootFront.scale.set(1, 0.72, 1.5);
        rightBootFront.position.set(0.4, -1.45, 0.17);
        bearGroup.add(rightBootFront);
    
        const buttockGeometry = new THREE.SphereGeometry(0.44, 32, 32);
        const leftButtock = new THREE.Mesh(buttockGeometry, pumpkinBodyMaterial);
        leftButtock.position.set(-0.15, -0.45, -0.4);
        bearGroup.add(leftButtock);
    
        const rightButtock = new THREE.Mesh(buttockGeometry, transparentPumpkinMaterial);
        rightButtock.position.set(0.15, -0.45, -0.4);
        bearGroup.add(rightButtock);
    
        const tailGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const tail = new THREE.Mesh(tailGeometry, smallPumpkinMaterial);
        tail.position.set(0, -0.35, -0.8);
        bearGroup.add(tail);

        tail.renderOrder = 1;
    
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const xEyeGeometry = new TextGeometry('X', { font: font, size: 0.2, depth: 0.05 });
            const xEye = new THREE.Mesh(xEyeGeometry, pumpkinMaterial);
            xEye.position.set(-0.3, 0.99, 0.53);
            xEye.rotation.x = THREE.MathUtils.degToRad(-5);
            xEye.rotation.y = THREE.MathUtils.degToRad(-15);
            bearGroup.add(xEye);
  
            const oEyeGeometry = new TextGeometry('O', { font: font, size: 0.2, depth: 0.05 });
            const oEye = new THREE.Mesh(oEyeGeometry, pumpkinMaterial);
            oEye.position.set(0.14, 0.99, 0.53);
            oEye.rotation.y = THREE.MathUtils.degToRad(12);
            oEye.rotation.x = THREE.MathUtils.degToRad(-5);
            bearGroup.add(oEye);
        });
        
        function createPumpkin(material: any, position: any) {
            const pumpkinGroup = new THREE.Group();
            const pumpkinGeometry = new THREE.SphereGeometry(1, 32, 32);
            const pumpkin = new THREE.Mesh(pumpkinGeometry, smallPumpkinMaterial);
            pumpkin.scale.set(1, 0.8, 1);
            pumpkinGroup.add(pumpkin);

            const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
            const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.set(0, 0.9, 0);
            pumpkinGroup.add(stem);

            return pumpkinGroup;
        }

        bearGroup.add(pumpkinGroup);

        const pumpkin1 = createPumpkin(smallPumpkinMaterial, { x: -2, y: 0, z: 0 });
        const pumpkin2 = createPumpkin(smallPumpkinMaterial, { x: 0, y: 0, z: 0 });
        const pumpkin3 = createPumpkin(smallPumpkinMaterial, { x: 2, y: 0, z: 0 });
        const pumpkin4 = createPumpkin(smallPumpkinMaterial, { x: 2, y: 0, z: 0 });

        pumpkin1.position.set(0.35, -0.35, -0.3);
        pumpkin2.position.set(0.25, -0.45, 0.3);
        pumpkin3.position.set(0.3, 0.1, -0.2);
        pumpkin4.position.set(0.25, 0.18, 0.4);

        pumpkin1.scale.set(0.3, 0.3, 0.3);
        pumpkin2.scale.set(0.28, 0.28, 0.28);
        pumpkin3.scale.set(0.25, 0.25, 0.25);
        pumpkin4.scale.set(0.23, 0.23, 0.23);

        pumpkin2.rotation.z = Math.PI / 4;
        pumpkin3.rotation.z = -Math.PI / 4;
        pumpkin4.rotation.y = -Math.PI / 2;

        bearGroup.add(pumpkin1);
        bearGroup.add(pumpkin2);
        bearGroup.add(pumpkin3);
        bearGroup.add(pumpkin4);

        const batShape = new THREE.Shape();

        batShape.moveTo(-0.5, 0);
        batShape.bezierCurveTo(-0.75, 0.25, -1.0, 0.6, -0.5, 0.8);
        batShape.bezierCurveTo(-0.25, 0.85, -0.25, 0.5, -0.15, 0.4);

        batShape.bezierCurveTo(-0.05, 0.6, 0.05, 0.6, 0.15, 0.4);
        batShape.bezierCurveTo(0.25, 0.5, 0.25, 0.85, 0.5, 0.8);
        batShape.bezierCurveTo(1.0, 0.6, 0.75, 0.25, 0.5, 0);

        batShape.bezierCurveTo(0.3, -0.25, -0.3, -0.25, -0.5, 0);

        const extrudeBatSettings = { depth: 0.3, bevelEnabled: false }; 
        const batGeometry = new THREE.ExtrudeGeometry(batShape, extrudeBatSettings);

        const batMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const batMesh = new THREE.Mesh(batGeometry, batMaterial);

        batMesh.scale.set(0.3, 0.3, 0.6);
        batMesh.rotation.x = 0; 
        batMesh.rotation.z = 0; 
        batMesh.position.set(0.26, 0.35, 0.25); 
        bearGroup.add(batMesh);

        const bat1 = new THREE.Mesh(batGeometry, batMaterial);
        bat1.scale.set(0.5, 0.5, 0.5);
        bat1.position.set(0.4, -0.1, 0.54);
        bearGroup.add(bat1);

        const bat2 = new THREE.Mesh(batGeometry, batMaterial);
        bat2.scale.set(0.5, 0.5, 0.5);
        bat2.position.set(0.32, -0.35, 0.65);
        bearGroup.add(bat2);

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

        const bats = [batMesh, bat1, bat2];
        const clock = new THREE.Clock(); 
        const phaseOffsets = [0, Math.PI / 2, Math.PI, 0, Math.PI / 3];

        let floatSpeed = 0.05; 
        let floatAmplitude = 0.25; 
        let time = 0;
        let rotationSpeed = 0.02;

        function animate() {
            requestAnimationFrame(animate);

            if (isRotatingRight.value) bearGroup.rotation.y += 0.03;
            if (isRotatingLeft.value) bearGroup.rotation.y -= 0.03;
            if (isRotatingUp.value) bearGroup.rotation.x -= 0.03;
            if (isRotatingDown.value) bearGroup.rotation.x += 0.03;

            pumpkin1.rotation.z -= 0.04;
            pumpkin2.rotation.z += 0.04;
            pumpkin3.rotation.z += 0.03;
            pumpkin4.rotation.z += 0.03;
            heart.rotation.y += 0.04;

            time += floatSpeed;
            bearGroup.position.y = props.bodyPosition.y + Math.sin(time) * floatAmplitude;            
            // bearGroup.rotation.y -= rotationSpeed; 

            const elapsedTime = clock.getElapsedTime();

            bats.forEach((h, index) => {
                const scale = 0.1 + Math.sin(elapsedTime * 3 + phaseOffsets[index]) * 0.1; 
                h.scale.set(scale, scale, scale);
            });  
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
    background: radial-gradient(circle, #2A0038 50%, #3D003D 30%, #FF4500 10%);
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
    background-color: #9E2A2B;
    color: #FFD700;
    padding: 15px;
    border: 4px solid #4B0082;
    box-shadow: 3px 3px 0 #4B0082, 6px 6px 0 #1C1C1C;
    text-transform: uppercase;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    border-radius: 10px;
}

.pixel-btn:hover {
    background-color: #FF4500;
    color: #2A0038;
    transform: translate(-3px, -3px);
}

.pixel-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #4B0082, 2px 2px 0 #1C1C1C;
}
</style>
