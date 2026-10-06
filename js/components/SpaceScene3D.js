/**
 * ASTRA-LINK — 3D Space Scene & Visualization Component
 * Implements Earth, Mars, ASTRA Throat, Gateway Rings,
 * Starfield, and Signal Packet using Three.js and OrbitControls.
 */

import { SIMULATION_STATES, TRANSMISSION_DIRECTIONS } from '../simulation/simulationConstants.js';

export class SpaceScene3D {
  constructor(containerElement, onSelectEndpoint = null) {
    this.container = containerElement;
    this.onSelectEndpoint = onSelectEndpoint;
    this.isDisposed = false;
    this.rotationPaused = false;
    this.currentPreset = 'overview';

    // Simulation state cache
    this.state = SIMULATION_STATES.OFFLINE;
    this.direction = TRANSMISSION_DIRECTIONS.EARTH_TO_MARS;
    this.transitProgress = 0;
    this.splCoherence = 0;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Scene Objects
    this.earthGroup = null;
    this.marsGroup = null;
    this.earthMesh = null;
    this.earthClouds = null;
    this.marsMesh = null;
    this.earthRings = [];
    this.marsRings = [];
    this.throatCurve = null;
    this.throatTube = null;
    this.throatMaterial = null;
    this.throatParticles = null;
    this.signalPacket = null;
    this.signalTail = null;
    this.lensingRings = [];
    this.starfield = null;

    // Pinned 2D Labels
    this.earthLabel = null;
    this.marsLabel = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 450;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.0035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 16, 48);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.minDistance = 8;
      this.controls.maxDistance = 110;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.15;
      this.controls.target.set(0, 3, 0);
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Starfield & Deep Space
    this.setupStarfield();

    // 7. Earth & Gateway
    this.setupEarth();

    // 8. Mars & Gateway
    this.setupMars();

    // 9. ASTRA Throat Curve & Geometry
    this.setupAstraThroat();

    // 10. Signal Transmission Packet
    this.setupSignalPacket();

    // 11. HTML HUD Labels
    this.setupPinnedLabels();

    // 12. Event Listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // 13. Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x1a264a, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    sunLight.position.set(50, 35, 40);
    this.scene.add(sunLight);

    const backRimLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    backRimLight.position.set(-40, -10, -30);
    this.scene.add(backRimLight);
  }

  // --- Procedural Canvas Planet Textures ---
  createProceduralEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep blue ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0a2540');
    oceanGrad.addColorStop(0.5, '#071e3d');
    oceanGrad.addColorStop(1, '#0a2540');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents
    ctx.fillStyle = '#22543d';
    // Simplified continents (Africa, Europe, Americas, Asia)
    const continents = [
      { x: 480, y: 180, w: 90, h: 140 },
      { x: 500, y: 90, w: 120, h: 80 },
      { x: 650, y: 120, w: 160, h: 120 },
      { x: 260, y: 100, w: 110, h: 110 },
      { x: 310, y: 220, w: 70, h: 130 },
      { x: 780, y: 280, w: 80, h: 70 }
    ];

    continents.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Polar ice caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 25);
    ctx.fillRect(0, 487, 1024, 25);

    return new THREE.CanvasTexture(canvas);
  }

  createProceduralCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';

    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = 80 + Math.random() * 350;
      const rx = 30 + Math.random() * 80;
      const ry = 8 + Math.random() * 20;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  createProceduralMarsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Mars Rust & Orange Terrain
    const marsGrad = ctx.createLinearGradient(0, 0, 0, 512);
    marsGrad.addColorStop(0, '#7c2d12');
    marsGrad.addColorStop(0.3, '#c2410c');
    marsGrad.addColorStop(0.7, '#9a3412');
    marsGrad.addColorStop(1, '#431407');
    ctx.fillStyle = marsGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Craters and canyons
    ctx.fillStyle = '#3f1508';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 1024;
      const y = 50 + Math.random() * 410;
      const r = 4 + Math.random() * 25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polar white cap
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(512, 15, 120, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  setupStarfield() {
    const starCount = 2800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 120 + Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Star colors: cold blue, pure white, warm amber
      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0;
      } else if (tint > 0.6) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 0.6;
      } else {
        starColors[i * 3] = 0.9; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.starfield = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.starfield);
  }

  setupEarth() {
    this.earthGroup = new THREE.Group();
    this.earthGroup.position.set(-22, 0, 0);

    // Planet Body
    const earthGeo = new THREE.SphereGeometry(3.6, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: this.createProceduralEarthTexture(),
      roughness: 0.65,
      metalness: 0.15
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // Atmosphere Clouds
    const cloudGeo = new THREE.SphereGeometry(3.72, 36, 36);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: this.createProceduralCloudTexture(),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
    this.earthGroup.add(this.earthClouds);

    // Atmospheric Rim Glow
    const rimGeo = new THREE.SphereGeometry(4.0, 32, 32);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    this.earthGroup.add(rimMesh);

    // Earth Gateway Quantum Rings
    this.earthRings = this.createGatewayRings(0x00f0ff);
    this.earthGroup.add(this.earthRings.container);

    this.scene.add(this.earthGroup);
  }

  setupMars() {
    this.marsGroup = new THREE.Group();
    this.marsGroup.position.set(22, 0, 0);

    // Planet Body
    const marsGeo = new THREE.SphereGeometry(2.8, 48, 48);
    const marsMat = new THREE.MeshStandardMaterial({
      map: this.createProceduralMarsTexture(),
      roughness: 0.75,
      metalness: 0.2
    });
    this.marsMesh = new THREE.Mesh(marsGeo, marsMat);
    this.marsGroup.add(this.marsMesh);

    // Mars Atmosphere Rim
    const rimGeo = new THREE.SphereGeometry(3.1, 32, 32);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    this.marsGroup.add(rimMesh);

    // Mars Gateway Quantum Rings
    this.marsRings = this.createGatewayRings(0xf97316);
    this.marsGroup.add(this.marsRings.container);

    this.scene.add(this.marsGroup);
  }

  createGatewayRings(baseColorHex) {
    const container = new THREE.Group();
    container.position.set(0, 0, 0);

    // Ring 1: Primary Equatorial Ring
    const ring1Geo = new THREE.TorusGeometry(4.8, 0.08, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: baseColorHex,
      transparent: true,
      opacity: 0.45,
      wireframe: false
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    container.add(ring1);

    // Ring 2: Polar Orthogonal Ring
    const ring2Geo = new THREE.TorusGeometry(5.2, 0.06, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    container.add(ring2);

    return { container, ring1, ring2, mat1: ring1Mat, mat2: ring2Mat };
  }

  setupAstraThroat() {
    // Curved CatmullRom Path connecting Earth and Mars
    const p0 = new THREE.Vector3(-22, 0, 0);
    const p1 = new THREE.Vector3(-11, 6, -3);
    const p2 = new THREE.Vector3(0, 9, -5);
    const p3 = new THREE.Vector3(11, 6, -3);
    const p4 = new THREE.Vector3(22, 0, 0);

    this.throatCurve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);

    // Outer Tube Geometry
    const tubeGeo = new THREE.TubeGeometry(this.throatCurve, 80, 0.65, 16, false);
    this.throatMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    this.throatTube = new THREE.Mesh(tubeGeo, this.throatMaterial);
    this.scene.add(this.throatTube);

    // Gravitational Lensing Rings along the curve
    const ringFractions = [0.25, 0.5, 0.75];
    this.lensingRings = [];

    ringFractions.forEach(f => {
      const pt = this.throatCurve.getPointAt(f);
      const tangent = this.throatCurve.getTangentAt(f);
      const lRingGeo = new THREE.TorusGeometry(1.6, 0.05, 12, 48);
      const lRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const lRing = new THREE.Mesh(lRingGeo, lRingMat);
      lRing.position.copy(pt);
      lRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.scene.add(lRing);
      this.lensingRings.push({ mesh: lRing, mat: lRingMat, baseFraction: f });
    });

    // Internal Wormhole Conduit Particles
    const particleCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    this.particleCurveOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      this.particleCurveOffsets[i] = u;
      const pt = this.throatCurve.getPointAt(u);
      pPositions[i * 3] = pt.x + (Math.random() - 0.5) * 0.8;
      pPositions[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.8;
      pPositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.8;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.65,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    this.throatParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.throatParticles);
  }

  setupSignalPacket() {
    // Traveling High-Intensity Luminous Photon Packet
    const packetGeo = new THREE.SphereGeometry(0.75, 24, 24);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.signalPacket = new THREE.Mesh(packetGeo, packetMat);

    // Trailing Packet Glow
    const haloGeo = new THREE.SphereGeometry(1.4, 20, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.signalPacket.add(halo);

    this.signalPacket.visible = false;
    this.scene.add(this.signalPacket);
  }

  setupPinnedLabels() {
    this.earthLabel = document.getElementById('hud-earth-label');
    this.marsLabel = document.getElementById('hud-mars-label');
  }

  updatePinnedLabels() {
    if (!this.earthLabel || !this.marsLabel || !this.camera) return;

    // Earth projection
    const earthPos = new THREE.Vector3(-22, 5.0, 0);
    earthPos.project(this.camera);

    const isEarthVisible = earthPos.z < 1;
    if (isEarthVisible) {
      const x = (earthPos.x * 0.5 + 0.5) * this.container.clientWidth;
      const y = (-(earthPos.y * 0.5) + 0.5) * this.container.clientHeight;
      this.earthLabel.style.left = `${x}px`;
      this.earthLabel.style.top = `${y}px`;
      this.earthLabel.style.opacity = '1';
    } else {
      this.earthLabel.style.opacity = '0';
    }

    // Mars projection
    const marsPos = new THREE.Vector3(22, 4.2, 0);
    marsPos.project(this.camera);

    const isMarsVisible = marsPos.z < 1;
    if (isMarsVisible) {
      const x = (marsPos.x * 0.5 + 0.5) * this.container.clientWidth;
      const y = (-(marsPos.y * 0.5) + 0.5) * this.container.clientHeight;
      this.marsLabel.style.left = `${x}px`;
      this.marsLabel.style.top = `${y}px`;
      this.marsLabel.style.opacity = '1';
    } else {
      this.marsLabel.style.opacity = '0';
    }
  }

  // --- Camera Presets ---
  setCameraPreset(preset) {
    this.currentPreset = preset;
    if (!this.controls) return;

    const duration = 1.0;
    let targetPos = new THREE.Vector3(0, 16, 48);
    let targetLook = new THREE.Vector3(0, 3, 0);

    if (preset === 'earth') {
      targetPos.set(-22, 6, 14);
      targetLook.set(-22, 0, 0);
    } else if (preset === 'mars') {
      targetPos.set(22, 5, 13);
      targetLook.set(22, 0, 0);
    } else if (preset === 'overview' || preset === 'reset') {
      targetPos.set(0, 16, 48);
      targetLook.set(0, 3, 0);
    }

    // Smooth transition
    const startPos = this.camera.position.clone();
    const startLook = this.controls.target.clone();
    let startTime = performance.now();

    const tween = () => {
      const now = performance.now();
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startLook, targetLook, ease);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(tween);
      }
    };
    tween();
  }

  toggleRotationPause() {
    this.rotationPaused = !this.rotationPaused;
    return this.rotationPaused;
  }

  // --- State-Driven Visual Updates ---
  updateSimulationState(snapshot) {
    this.state = snapshot.state;
    this.direction = snapshot.direction;
    this.transitProgress = snapshot.currentTransitProgress || 0;
    this.splCoherence = snapshot.splCoherence || 0;

    // 1. ASTRA Throat Visual State
    if (!this.throatMaterial) return;

    switch (this.state) {
      case SIMULATION_STATES.OFFLINE:
        this.throatMaterial.opacity = 0.08;
        this.throatMaterial.color.setHex(0x475569);
        this.throatTube.scale.set(1, 0.4, 0.4);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.INITIALIZING:
        this.throatMaterial.opacity = 0.15;
        this.throatMaterial.color.setHex(0x0284c7);
        this.throatTube.scale.set(1, 0.6, 0.6);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.READY:
        this.throatMaterial.opacity = 0.2;
        this.throatMaterial.color.setHex(0x06b6d4);
        this.throatTube.scale.set(1, 0.8, 0.8);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.ESTABLISHING_SHORTCUT:
        this.throatMaterial.opacity = 0.45;
        this.throatMaterial.color.setHex(0x22d3ee);
        this.throatTube.scale.set(1, 1.0, 1.0);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.SHORTCUT_ESTABLISHED:
        this.throatMaterial.opacity = 0.35;
        this.throatMaterial.color.setHex(0x06b6d4);
        this.throatTube.scale.set(1, 1.0, 1.0);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.SPL_LOCKING:
        this.throatMaterial.opacity = 0.55;
        this.throatMaterial.color.setHex(0x38bdf8);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.SYNCHRONIZED:
        this.throatMaterial.opacity = 0.4;
        this.throatMaterial.color.setHex(0x00f0ff);
        this.throatTube.scale.set(1, 1.0, 1.0);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.TRANSMITTING:
        this.throatMaterial.opacity = 0.65;
        this.throatMaterial.color.setHex(0x00f0ff);
        this.signalPacket.visible = true;
        break;

      case SIMULATION_STATES.RECONSTRUCTING:
        this.throatMaterial.opacity = 0.5;
        this.throatMaterial.color.setHex(0x34d399);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.DELIVERED:
        this.throatMaterial.opacity = 0.4;
        this.throatMaterial.color.setHex(0x10b981);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.DEGRADED:
        this.throatMaterial.opacity = 0.35;
        this.throatMaterial.color.setHex(0xa855f7); // violet jitter
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.FAILED:
        this.throatMaterial.opacity = 0.12;
        this.throatMaterial.color.setHex(0xef4444); // red collapse
        this.throatTube.scale.set(1, 0.3, 0.3);
        this.signalPacket.visible = false;
        break;

      case SIMULATION_STATES.RECOVERING:
        this.throatMaterial.opacity = 0.45;
        this.throatMaterial.color.setHex(0xf59e0b); // recovery amber
        this.signalPacket.visible = false;
        break;
    }
  }

  // --- Animation Loop ---
  animate() {
    if (this.isDisposed) return;
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Controls Update
    if (this.controls) {
      this.controls.update();
    }

    // 2. Planetary Rotations (can be paused)
    if (!this.rotationPaused) {
      if (this.earthMesh) this.earthMesh.rotation.y += delta * 0.05;
      if (this.earthClouds) this.earthClouds.rotation.y += delta * 0.07;
      if (this.marsMesh) this.marsMesh.rotation.y += delta * 0.04;
    }

    // 3. Gateway Quantum Rings Rotation
    const ringSpeed = (this.state === SIMULATION_STATES.SYNCHRONIZED || this.state === SIMULATION_STATES.TRANSMITTING) ? 1.5 : 0.6;
    if (this.earthRings.ring1) {
      this.earthRings.ring1.rotation.z += delta * ringSpeed;
      this.earthRings.ring2.rotation.y += delta * (ringSpeed * 0.8);
    }
    if (this.marsRings.ring1) {
      this.marsRings.ring1.rotation.z -= delta * ringSpeed;
      this.marsRings.ring2.rotation.y -= delta * (ringSpeed * 0.8);
    }

    // 4. Lensing Rings Subtle Oscillation
    if (this.lensingRings.length > 0) {
      this.lensingRings.forEach((ring, idx) => {
        const osc = Math.sin(elapsedTime * 2.0 + idx) * 0.15;
        ring.mesh.scale.set(1 + osc, 1 + osc, 1 + osc);
      });
    }

    // 5. Throat Particles Flow
    if (this.throatParticles && this.throatCurve) {
      const positions = this.throatParticles.geometry.attributes.position.array;
      const count = this.particleCurveOffsets.length;
      const flowRate = (this.state === SIMULATION_STATES.TRANSMITTING) ? 0.35 : 0.08;

      for (let i = 0; i < count; i++) {
        let u = this.particleCurveOffsets[i];
        if (this.direction === TRANSMISSION_DIRECTIONS.EARTH_TO_MARS) {
          u = (u + delta * flowRate) % 1.0;
        } else {
          u = (u - delta * flowRate);
          if (u < 0) u += 1.0;
        }
        this.particleCurveOffsets[i] = u;

        const pt = this.throatCurve.getPointAt(u);
        positions[i * 3] = pt.x + (Math.sin(elapsedTime * 3 + i) * 0.3);
        positions[i * 3 + 1] = pt.y + (Math.cos(elapsedTime * 3 + i) * 0.3);
        positions[i * 3 + 2] = pt.z;
      }
      this.throatParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Signal Packet Travel Animation
    if (this.signalPacket && this.signalPacket.visible && this.throatCurve) {
      let progress = this.transitProgress;
      if (this.direction === TRANSMISSION_DIRECTIONS.MARS_TO_EARTH) {
        progress = 1.0 - progress;
      }
      progress = Math.max(0.001, Math.min(0.999, progress));
      const pt = this.throatCurve.getPointAt(progress);
      this.signalPacket.position.copy(pt);

      // Pulse packet scale
      const pulse = 1.0 + Math.sin(elapsedTime * 15.0) * 0.25;
      this.signalPacket.scale.set(pulse, pulse, pulse);
    }

    // 7. Update 2D Screen-Space Labels
    this.updatePinnedLabels();

    // 8. Render
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 450;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.isDisposed = true;
    window.removeEventListener('resize', this.onWindowResize);
    if (this.controls) this.controls.dispose();
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
