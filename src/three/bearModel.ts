import * as THREE from 'three';

export function createBearModel(): THREE.Mesh {
  // Create bear geometry and material
  const geometry = new THREE.BoxGeometry(1, 1, 1);  // Example geometry
  const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });

  // Create and return a mesh
  return new THREE.Mesh(geometry, material);
}
