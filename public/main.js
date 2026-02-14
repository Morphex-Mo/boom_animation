import * as THREE from "/vendor/three.module.js";

const canvas = document.getElementById("scene");
const boomText = document.getElementById("boom-text");
const hint = document.getElementById("hint");
const boomAudio = new Audio("/sfx/boom.mp3");
boomAudio.preload = "auto";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 6, 18);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2.1, 8);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const dragOffset = new THREE.Vector3();
const intersection = new THREE.Vector3();
const tempVector = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const upVector = new THREE.Vector3(0, 1, 0);
let isDragging = false;

const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffd1a6, 1.1);
keyLight.position.set(3, 5, 2);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x6ecbff, 0.4);
rimLight.position.set(-4, 1, -3);
scene.add(rimLight);

const stage = new THREE.Mesh(
  new THREE.CylinderGeometry(3.6, 3.9, 0.5, 48),
  new THREE.MeshStandardMaterial({
    color: 0x20263a,
    roughness: 0.8,
    metalness: 0.1
  })
);
stage.position.y = -1.4;
scene.add(stage);

const bombGroup = new THREE.Group();
scene.add(bombGroup);

const bombBody = new THREE.Mesh(
  new THREE.SphereGeometry(1.4, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x1b1e2b,
    roughness: 0.35,
    metalness: 0.2
  })
);
bombBody.position.y = 0.1;
bombGroup.add(bombBody);

const collar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 0.55, 0.4, 32),
  new THREE.MeshStandardMaterial({
    color: 0x444a60,
    roughness: 0.4,
    metalness: 0.6
  })
);
collar.position.set(0, 1.4, 0);
bombGroup.add(collar);

const fuseCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.1, 1.6, 0.05),
  new THREE.Vector3(0.7, 2.0, -0.2),
  new THREE.Vector3(1.2, 2.2, 0.2),
  new THREE.Vector3(1.6, 2.1, 0.4)
]);

const fuseGeometry = new THREE.TubeGeometry(fuseCurve, 64, 0.08, 12, false);
const fuseMaterial = new THREE.MeshStandardMaterial({
  color: 0x8f6b3b,
  roughness: 0.8,
  metalness: 0.1
});
const fuseMesh = new THREE.Mesh(fuseGeometry, fuseMaterial);
bombGroup.add(fuseMesh);
const fuseIndexCount = fuseGeometry.index
  ? fuseGeometry.index.count
  : fuseGeometry.attributes.position.count;

const sparkMaterial = new THREE.MeshStandardMaterial({
  color: 0xffb347,
  emissive: 0xff6b1a,
  emissiveIntensity: 1.6,
  roughness: 0.4
});
const sparkGroup = new THREE.Group();
const sparkCore = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 24, 24),
  sparkMaterial
);
const sparkCone = new THREE.Mesh(
  new THREE.ConeGeometry(0.12, 0.22, 16, 1, true),
  sparkMaterial
);
sparkCone.position.y = 0.23;
sparkGroup.add(sparkCore);
sparkGroup.add(sparkCone);
bombGroup.add(sparkGroup);

const sparkGlow = new THREE.PointLight(0xff6b1a, 1.2, 5);
sparkGlow.position.copy(sparkGroup.position);
scene.add(sparkGlow);

const flameGroup = new THREE.Group();
scene.add(flameGroup);
const flameMaterial = new THREE.MeshStandardMaterial({
  color: 0xff8a2a,
  emissive: 0xff4d00,
  emissiveIntensity: 2.6,
  transparent: true,
  opacity: 0.9,
  roughness: 0.6
});
const flameParticles = [];
const flameGeometry = new THREE.ConeGeometry(0.08, 0.24, 12, 1, true);
for (let i = 0; i < 48; i += 1) {
  const mesh = new THREE.Mesh(flameGeometry, flameMaterial.clone());
  mesh.visible = false;
  mesh.userData.velocity = new THREE.Vector3();
  mesh.userData.life = 0;
  flameParticles.push(mesh);
  flameGroup.add(mesh);
}

const explosionGroup = new THREE.Group();
explosionGroup.visible = false;
scene.add(explosionGroup);

const shockwave = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffc14d,
    emissive: 0xff8c1a,
    emissiveIntensity: 1.4,
    transparent: true,
    opacity: 0.9
  })
);
explosionGroup.add(shockwave);

const debrisMaterial = new THREE.MeshStandardMaterial({
  color: 0x1b1b1b,
  roughness: 0.9,
  metalness: 0.1
});
const debrisPieces = [];
for (let i = 0; i < 24; i += 1) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.05),
    debrisMaterial
  );
  mesh.userData.velocity = new THREE.Vector3();
  mesh.userData.spin = new THREE.Vector3();
  debrisPieces.push(mesh);
  explosionGroup.add(mesh);
}

const smokeMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444,
  transparent: true,
  opacity: 0.7,
  roughness: 2
});
const smokePuffs = [];
for (let i = 0; i < 18; i += 1) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    smokeMaterial.clone()
  );
  mesh.userData.velocity = new THREE.Vector3();
  smokePuffs.push(mesh);
  explosionGroup.add(mesh);
}

let startTime = null;
const fuseDuration = 5.2;
let exploded = false;
let lastTimestamp = null;

function placeSpark(progress) {
  const point = fuseCurve.getPointAt(1 - progress);
  sparkGroup.position.copy(point);
  tempVector2.copy(fuseCurve.getTangentAt(1 - progress)).normalize();
  sparkGroup.quaternion.setFromUnitVectors(upVector, tempVector2);
  sparkGlow.position.copy(sparkGroup.getWorldPosition(tempVector));
}

function updateFuse(progress) {
  const remaining = Math.max(0, 1 - progress);
  const drawCount = Math.max(0, Math.floor(fuseIndexCount * remaining));
  fuseGeometry.setDrawRange(0, drawCount);
  fuseMesh.visible = drawCount > 0;
}

function spawnFlameParticles(progress) {
  const baseRate = 14;
  const spawnCount = Math.max(3, Math.floor(baseRate + progress * 7));
  for (let i = 0; i < spawnCount; i += 1) {
    const particle = flameParticles.find((item) => item.userData.life <= 0);
    if (!particle) {
      return;
    }
    particle.visible = true;
    particle.userData.life = 0.45 + Math.random() * 0.35;
    particle.scale.set(
      0.7 + Math.random() * 0.4,
      1.4 + Math.random() * 0.9,
      0.7 + Math.random() * 0.4
    );
    particle.material.opacity = 1;
    particle.position.copy(sparkGroup.getWorldPosition(tempVector));
    particle.userData.velocity.set(
      (Math.random() - 0.5) * 0.4,
      0.7 + Math.random() * 0.55,
      (Math.random() - 0.5) * 0.4
    );
    particle.rotation.set(0, Math.random() * Math.PI * 2, 0);
  }
}

function updateFlameParticles(delta) {
  flameParticles.forEach((particle) => {
    if (particle.userData.life <= 0) {
      particle.visible = false;
      return;
    }
    particle.userData.life -= delta;
    particle.position.addScaledVector(particle.userData.velocity, delta);
    particle.userData.velocity.multiplyScalar(0.88);
    particle.material.opacity = Math.max(0, particle.material.opacity - delta * 2);
    particle.scale.multiplyScalar(0.985);
    if (particle.userData.velocity.lengthSq() > 0.0001) {
      tempVector.copy(particle.userData.velocity).normalize().multiplyScalar(0.2);
      tempVector2.copy(particle.position).add(tempVector);
      particle.lookAt(tempVector2);
    }
  });
}

function triggerExplosion() {
  exploded = true;
  bombGroup.visible = false;
  explosionGroup.position.copy(bombGroup.position);
  explosionGroup.visible = true;
  boomAudio.currentTime = 0;
  boomAudio.play().catch(() => {});
  shockwave.scale.setScalar(0.1);
  shockwave.material.opacity = 0.9;
  flameParticles.forEach((particle) => {
    particle.userData.life = 0;
    particle.visible = false;
  });
  debrisPieces.forEach((piece) => {
    piece.position.set(0, 0.7, 0);
    piece.userData.velocity.set(
      (Math.random() - 0.5) * 3,
      1.2 + Math.random() * 2.2,
      (Math.random() - 0.5) * 3
    );
    piece.userData.spin.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6
    );
  });
  smokePuffs.forEach((puff, index) => {
    puff.position.set(
      (Math.random() - 0.5) * 0.8,
      0.6 + Math.random() * 0.4,
      (Math.random() - 0.5) * 0.8
    );
    puff.scale.setScalar(0.9 + index * 0.05);
    puff.material.opacity = 0.7;
    puff.userData.velocity.set(
      (Math.random() - 0.5) * 0.4,
      0.4 + Math.random() * 0.6,
      (Math.random() - 0.5) * 0.4
    );
  });
  boomText.classList.remove("hidden");
  requestAnimationFrame(() => boomText.classList.add("show"));
  hint.textContent = "Boom!";
}

function resetAnimation() {
  startTime = null;
  lastTimestamp = null;
  exploded = false;
  boomAudio.pause();
  boomAudio.currentTime = 0;
  bombGroup.position.set(0, 0, 0);
  explosionGroup.position.set(0, 0, 0);
  bombGroup.visible = true;
  explosionGroup.visible = false;
  flameParticles.forEach((particle) => {
    particle.userData.life = 0;
    particle.visible = false;
  });
  smokePuffs.forEach((puff) => {
    puff.material.opacity = 0;
  });
  boomText.classList.remove("show");
  boomText.classList.add("hidden");
  hint.textContent = "Bomb fuse is burning...";
  updateFuse(0);
  placeSpark(0);
}

function updateExplosion(delta) {
  const growth = 1 + delta * 4;
  shockwave.scale.multiplyScalar(growth);
  shockwave.material.opacity = Math.max(0, shockwave.material.opacity - delta * 1.2);
  debrisPieces.forEach((piece) => {
    piece.position.addScaledVector(piece.userData.velocity, delta);
    piece.userData.velocity.y -= 2.6 * delta;
    piece.rotation.x += piece.userData.spin.x * delta;
    piece.rotation.y += piece.userData.spin.y * delta;
    piece.rotation.z += piece.userData.spin.z * delta;
  });
  smokePuffs.forEach((puff) => {
    puff.position.addScaledVector(puff.userData.velocity, delta);
    puff.scale.multiplyScalar(1 + delta * 0.7);
    puff.material.opacity = Math.max(0, puff.material.opacity - delta * 0.35);
  });
}

function animate(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  if (!startTime) {
    startTime = timestamp;
  }
  const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
  const elapsed = (timestamp - startTime) / 1000;
  const progress = Math.min(elapsed / fuseDuration, 1);

  bombGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.2;
  bombGroup.rotation.x = Math.cos(elapsed * 0.4) * 0.1;

  if (!exploded) {
    placeSpark(progress);
    updateFuse(progress);
    spawnFlameParticles(progress);
    updateFlameParticles(delta);
    sparkMaterial.emissiveIntensity = 1.6 + Math.sin(elapsed * 12) * 0.5;
    if (progress >= 1) {
      triggerExplosion();
    }
  } else {
    updateExplosion(delta);
  }

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
  requestAnimationFrame(animate);
}

placeSpark(0);
requestAnimationFrame(animate);

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (exploded) {
    return;
  }
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(bombBody, false);
  if (hits.length === 0) {
    return;
  }
  isDragging = true;
  dragPlane.setFromNormalAndCoplanarPoint(
    camera.getWorldDirection(tempVector),
    bombGroup.position
  );
  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    dragOffset.copy(bombGroup.position).sub(intersection);
  }
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
    bombGroup.position.copy(intersection.add(dragOffset));
  }
});

function stopDragging(event) {
  if (!isDragging) {
    return;
  }
  isDragging = false;
  renderer.domElement.releasePointerCapture(event.pointerId);
}

renderer.domElement.addEventListener("pointerup", stopDragging);
renderer.domElement.addEventListener("pointercancel", stopDragging);

window.addEventListener("keydown", (event) => {
  if (event.key && event.key.toLowerCase() === "z") {
    resetAnimation();
  }
});

window.addEventListener("resize", () => {
  const { innerWidth, innerHeight } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
