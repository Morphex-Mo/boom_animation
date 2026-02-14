import * as THREE from "/vendor/three.module.js";

const canvas = document.getElementById("scene");
const boomText = document.getElementById("boom-text");
const hint = document.getElementById("hint");
const boomAudio = new Audio("/sound/boom.mp3");
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
const spark = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 24, 24),
  sparkMaterial
);
bombGroup.add(spark);

const sparkGlow = new THREE.PointLight(0xff6b1a, 1.2, 5);
sparkGlow.position.copy(spark.position);
scene.add(sparkGlow);

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

const particleMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5f1f,
  emissive: 0xff2d00,
  emissiveIntensity: 1.1,
  roughness: 0.4
});
const particles = [];
for (let i = 0; i < 40; i += 1) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 20, 20),
    particleMaterial
  );
  mesh.userData.velocity = new THREE.Vector3();
  particles.push(mesh);
  explosionGroup.add(mesh);
}

let startTime = null;
const fuseDuration = 5.2;
let exploded = false;
let lastTimestamp = null;

function placeSpark(progress) {
  const point = fuseCurve.getPointAt(1 - progress);
  spark.position.copy(point);
  sparkGlow.position.copy(spark.getWorldPosition(tempVector));
}

function updateFuse(progress) {
  const remaining = Math.max(0, 1 - progress);
  const drawCount = Math.max(0, Math.floor(fuseIndexCount * remaining));
  fuseGeometry.setDrawRange(0, drawCount);
  fuseMesh.visible = drawCount > 0;
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
  particles.forEach((particle) => {
    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.2) * 2.7,
      (Math.random() - 0.5) * 1.8
    );
    particle.position.set(0, 0.8, 0);
    particle.userData.velocity.copy(dir);
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
  particles.forEach((particle) => {
    particle.position.addScaledVector(particle.userData.velocity, delta);
    particle.userData.velocity.multiplyScalar(0.96);
  });
}

function animate(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  if (!startTime) {
    startTime = timestamp;
  }
  const elapsed = (timestamp - startTime) / 1000;
  const progress = Math.min(elapsed / fuseDuration, 1);

  bombGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.2;
  bombGroup.rotation.x = Math.cos(elapsed * 0.4) * 0.1;

  if (!exploded) {
    placeSpark(progress);
    updateFuse(progress);
    sparkMaterial.emissiveIntensity = 1.2 + Math.sin(elapsed * 12) * 0.4;
    if (progress >= 1) {
      triggerExplosion();
    }
  } else {
    const delta = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
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
