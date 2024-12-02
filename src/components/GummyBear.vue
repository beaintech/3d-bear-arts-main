// Function to create a simple gummy bear
function createGummyBear(material: THREE.Material) {
  const gummyBearGroup = new THREE.Group();

  // Gummy bear body (Sphere)
  const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.position.set(0, 0, 0); // Adjust body position
  gummyBearGroup.add(body);

  // Gummy bear head (Sphere)
  const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set(0, 0.7, 0); // Adjust head position
  gummyBearGroup.add(head);

  // Gummy bear ears (Spheres)
  const earGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const leftEar = new THREE.Mesh(earGeometry, material);
  const rightEar = new THREE.Mesh(earGeometry, material);
  leftEar.position.set(-0.3, 1, 0);
  rightEar.position.set(0.3, 1, 0);
  gummyBearGroup.add(leftEar);
  gummyBearGroup.add(rightEar);

  // Gummy bear legs (Cylinders)
  const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32);
  const leftLeg = new THREE.Mesh(legGeometry, material);
  const rightLeg = new THREE.Mesh(legGeometry, material);
  leftLeg.position.set(-0.2, -0.7, 0);
  rightLeg.position.set(0.2, -0.7, 0);
  gummyBearGroup.add(leftLeg);
  gummyBearGroup.add(rightLeg);

  // Gummy bear arms (Spheres)
  const armGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const leftArm = new THREE.Mesh(armGeometry, material);
  const rightArm = new THREE.Mesh(armGeometry, material);
  leftArm.position.set(-0.6, 0.2, 0);
  rightArm.position.set(0.6, 0.2, 0);
  gummyBearGroup.add(leftArm);
  gummyBearGroup.add(rightArm);

  return gummyBearGroup;
}

// Inside your scene setup (replacing the heart with a gummy bear)
const gummyBearMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF69B4,  // Hot pink as the base
  metalness: 0.2,
  roughness: 0.7,
  clearcoat: 0.05,
  clearcoatRoughness: 0.9,
  transparent: true,
  opacity: 0.8,  // Slight transparency for gummy effect
});

const gummyBear = createGummyBear(gummyBearMaterial);
gummyBear.scale.set(0.5, 0.5, 0.5);  // Adjust size
gummyBear.position.set(0.35, 0, 0);  // Same position as the heart
gummyBear.rotation.y = Math.PI;
gummyBear.rotation.x = Math.PI;

// Add the gummy bear to the bearGroup
bearGroup.add(gummyBear);
