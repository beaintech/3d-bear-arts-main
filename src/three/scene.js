import * as THREE from 'three';
let scene, camera, renderer;
export function initScene(container, options) {
    // Set default values for the options parameter if not provided
    options = options || {
        backgroundColor: 0x000000, // Default to black if not provided
        material: new THREE.MeshBasicMaterial({ color: 0xffffff }), // Default material if not provided
        bearConfig: {}, // Empty config if not provided
    };
    // Create the scene
    scene = new THREE.Scene();
    // Set the background color if provided
    if (options.backgroundColor) {
        scene.background = new THREE.Color(options.backgroundColor);
    }
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 0, 0);
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    // Create the bear group
    const bearGroup = new THREE.Group();
    // Default bear configuration (with optional overrides from `options.bearConfig`)
    const bearConfig = {
        bodyScale: options.bearConfig?.bodyScale || new THREE.Vector3(0.85, 0.85, 0.8),
        headScale: options.bearConfig?.headScale || new THREE.Vector3(1, 0.95, 0.95),
        armScale: options.bearConfig?.armScale || new THREE.Vector3(0.75, 1.25, 0.65),
        legScale: options.bearConfig?.legScale || new THREE.Vector3(0.2, 0.22, 0.6),
    };
    // Bear body
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, options.material);
    body.scale.copy(bearConfig.bodyScale);
    body.position.y = -0.2;
    bearGroup.add(body);
    // Bear head
    const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const head = new THREE.Mesh(headGeometry, options.material);
    head.scale.copy(bearConfig.headScale);
    head.position.set(0, 1, 0);
    bearGroup.add(head);
    // Arms and Legs (same logic as before)
    const armGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const leftArm = new THREE.Mesh(armGeometry, options.material);
    leftArm.scale.copy(bearConfig.armScale);
    leftArm.position.set(-0.7, -0.15, 0.2);
    bearGroup.add(leftArm);
    const rightArm = new THREE.Mesh(armGeometry, options.material);
    rightArm.scale.copy(bearConfig.armScale);
    rightArm.position.set(0.7, -0.15, 0.2);
    bearGroup.add(rightArm);
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 32);
    const leftLeg = new THREE.Mesh(legGeometry, options.material);
    leftLeg.position.set(-0.4, -1, 0);
    bearGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeometry, options.material);
    rightLeg.position.set(0.4, -1, 0);
    bearGroup.add(rightLeg);
    // Add the bear to the scene
    scene.add(bearGroup);
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        bearGroup.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
    animate();
    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
