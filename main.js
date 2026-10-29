/**
 * CYBER DRONE FLIGHT PORTFOLIO - ULTRA-REALISTIC GOLDEN CANYON TOUR ENGINE
 * 
 * - High-Detail Procedural Sandstone Strata, Rock Bump Maps & Slope-Based Cliff Shading
 * - Majestic Towering Desert Buttes, Canyon Monoliths & Distant Mountain Ranges (2400m Depth)
 * - Low-Angle Sunset Lighting with Golden Sky Dome, Volumetric Sunset Clouds & Anamorphic Sun Flare
 * - Winding Canyon River with Animated Water Wave Ripples & Golden Sky Specular Glint
 * - PBR Aeronautical Quadcopter Drone with Carbon Fiber Weave, Dual Searchlights, FAA Strobe Lights
 * - 3 Cinematic Tour Camera Modes: Smooth Chase Cam / Cockpit FPV / Panoramic VIP Tour Cam (Key V)
 * - 100% Reliable Checkpoint Helipad Stations with Floating Crystals & Instant Modal Viewers
 */

import * as THREE from 'three';

/* ==========================================================================
   1. CHECKPOINTS DATA SPECIFICATION (All 10 Portfolio Subpages)
   ========================================================================== */

const CHECKPOINTS = [
  {
    id: 1,
    title: 'Alpine Base Landing',
    subtitle: 'Home & Welcome',
    icon: '🏠',
    page: 'pages/home.html',
    desc: 'Snow-capped alpine base camp. Overview of the flight simulator portfolio.',
    splineT: 0.0
  },
  {
    id: 2,
    title: 'Pilot Profile',
    subtitle: 'About Me',
    icon: '👨‍💻',
    page: 'pages/about.html',
    desc: 'Background, engineering philosophy, and creative direction.',
    splineT: 0.1
  },
  {
    id: 3,
    title: 'Flight Hangar',
    subtitle: 'Featured Projects',
    icon: '🚀',
    page: 'pages/projects.html',
    desc: 'Showcase of 3D WebGL apps, spatial platforms, and physics engines.',
    splineT: 0.2
  },
  {
    id: 4,
    title: 'Comms Relay',
    subtitle: 'Contact Us',
    icon: '📡',
    page: 'pages/contact.html',
    desc: 'Direct uplink channels, social coordinates, and availability.',
    splineT: 0.3
  },
  {
    id: 5,
    title: 'Tech Core',
    subtitle: 'Skills & Stack',
    icon: '⚡',
    page: 'pages/skills.html',
    desc: 'Comprehensive arsenal of 3D math, WebGL, shaders, and architectures.',
    splineT: 0.4
  },
  {
    id: 6,
    title: 'Flight Log',
    subtitle: 'Experience',
    icon: '📜',
    page: 'pages/experience.html',
    desc: 'Career milestones, lead roles, and graphics engineering achievements.',
    splineT: 0.5
  },
  {
    id: 7,
    title: 'Payload Bay',
    subtitle: 'Services',
    icon: '🛠️',
    page: 'pages/services.html',
    desc: 'Custom spatial web solutions, configurators, and performance tuning.',
    splineT: 0.6
  },
  {
    id: 8,
    title: 'Pilot Commendations',
    subtitle: 'Testimonials',
    icon: '⭐',
    page: 'pages/testimonials.html',
    desc: 'Feedback from aerospace founders, creative leads, and clients.',
    splineT: 0.7
  },
  {
    id: 9,
    title: 'Sensor Array',
    subtitle: 'Media Gallery',
    icon: '📸',
    page: 'pages/gallery.html',
    desc: 'Visual snapshots, wireframes, shader experiments, and 3D renders.',
    splineT: 0.8
  },
  {
    id: 10,
    title: 'Summit Trophy Hall',
    subtitle: 'Achievements',
    icon: '🏆',
    page: 'pages/achievements.html',
    desc: 'Industry awards, hackathon podiums, certifications, and patents.',
    splineT: 0.9
  }
];

/* ==========================================================================
   2. PROCEDURAL CANYON & MESA FRACTAL NOISE
   ========================================================================== */

class FastNoise {
  constructor(seed = 9876) {
    this.seed = seed;
  }
  
  hash(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7 + this.seed) * 43758.5453123;
    return n - Math.floor(n);
  }

  noise2D(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const u = fx * fx * (3.0 - 2.0 * fx);
    const v = fy * fy * (3.0 - 2.0 * fy);

    const a00 = this.hash(i, j);
    const a10 = this.hash(i + 1, j);
    const a01 = this.hash(i, j + 1);
    const a11 = this.hash(i + 1, j + 1);

    const x0 = a00 * (1 - u) + a10 * u;
    const x1 = a01 * (1 - u) + a11 * u;
    return x0 * (1 - v) + x1 * v;
  }

  fbmCanyon(x, y) {
    let value = 0;
    let amplitude = 1.0;
    let frequency = 1.0;
    let totalAmp = 0;

    for (let o = 0; o < 6; o++) {
      const n = this.noise2D(x * frequency, y * frequency);
      const stepped = Math.floor(n * 4.0) / 4.0 * 0.45 + n * 0.55;
      value += stepped * amplitude;
      totalAmp += amplitude;
      amplitude *= 0.5;
      frequency *= 2.02;
    }
    return value / totalAmp;
  }

  // Ridged Multi-Fractal Noise for Sharp Alpine Crests & Knife-Edge Snow Peaks
  ridgedNoise(x, y) {
    let value = 0;
    let amplitude = 1.0;
    let frequency = 1.0;
    let weight = 1.0;
    let totalAmp = 0;

    for (let o = 0; o < 6; o++) {
      const n = this.noise2D(x * frequency, y * frequency);
      let signal = 1.0 - Math.abs(n - 0.5) * 2.0;
      signal = signal * signal; // Sharp mountain knife-edge ridges
      signal *= weight;
      weight = Math.min(1.0, Math.max(0.0, signal * 2.0));

      value += signal * amplitude;
      totalAmp += amplitude;
      amplitude *= 0.52;
      frequency *= 2.06;
    }
    return value / totalAmp;
  }

  // Smooth Multi-Octave FBM for Continental Massifs and Undulating Alpine Valleys
  fbmMountain(x, y) {
    let value = 0;
    let amplitude = 1.0;
    let frequency = 1.0;
    let totalAmp = 0;

    for (let o = 0; o < 5; o++) {
      const n = this.noise2D(x * frequency, y * frequency);
      value += n * amplitude;
      totalAmp += amplitude;
      amplitude *= 0.5;
      frequency *= 2.02;
    }
    return value / totalAmp;
  }
}

const noiseGen = new FastNoise(7712);

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZER
   ========================================================================== */

class FlightAudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.motorOsc1 = null;
    this.motorOsc2 = null;
    this.motorGain = null;
    this.windGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Drone Turbine Hum
      this.motorOsc1 = this.ctx.createOscillator();
      this.motorOsc2 = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();

      this.motorOsc1.type = 'sawtooth';
      this.motorOsc1.frequency.setValueAtTime(80, this.ctx.currentTime);

      this.motorOsc2.type = 'triangle';
      this.motorOsc2.frequency.setValueAtTime(160, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      this.motorOsc1.connect(filter);
      this.motorOsc2.connect(filter);
      filter.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);
      this.motorGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.motorOsc1.start();
      this.motorOsc2.start();

      // Desert Canyon Wind Noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      whiteNoise.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      whiteNoise.start();

    } catch (e) {
      console.warn('Audio Init:', e);
    }
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.enabled = !this.enabled;
    if (!this.enabled && this.motorGain) {
      this.motorGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
      this.windGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
    }
    return this.enabled;
  }

  update(throttle, airspeedKmh) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const baseFreq = 85 + throttle * 130 + (airspeedKmh / 200) * 90;
    this.motorOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.motorOsc2.frequency.setTargetAtTime(baseFreq * 2.05, now, 0.05);

    const mGain = 0.02 + throttle * 0.08 + (airspeedKmh / 250) * 0.05;
    this.motorGain.gain.setTargetAtTime(mGain, now, 0.05);

    const wGain = 0.01 + (airspeedKmh / 160) * 0.12;
    this.windGain.gain.setTargetAtTime(wGain, now, 0.05);
  }

  playGateChime() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.18); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.45);
  }
}

const flightAudio = new FlightAudioSynth();

/* ==========================================================================
   4. PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATORS
   ========================================================================== */

function createProceduralTextures() {
  // 1. Photorealistic Alpine Slate Granite & Crystalline Snow Micro-Texture (1024x1024)
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = 1024;
  diffCanvas.height = 1024;
  const dCtx = diffCanvas.getContext('2d');

  // Neutral high-luminance stone & snow crystalline foundation
  dCtx.fillStyle = '#f1f5f9';
  dCtx.fillRect(0, 0, 1024, 1024);

  // Soft organic multi-octave geological rock mottling & granite mineral tones
  const stonePatches = [
    { color: '#e2e8f0', alpha: 0.70 },
    { color: '#cbd5e1', alpha: 0.55 },
    { color: '#94a3b8', alpha: 0.35 },
    { color: '#64748b', alpha: 0.22 },
    { color: '#475569', alpha: 0.14 },
    { color: '#dbeafe', alpha: 0.40 }, // Soft azure firn snow glint
    { color: '#ffffff', alpha: 0.65 }  // Pure quartz snow crystal flecks
  ];

  for (let layer = 0; layer < stonePatches.length; layer++) {
    const p = stonePatches[layer];
    dCtx.fillStyle = p.color;
    dCtx.globalAlpha = p.alpha;

    const count = 300 + layer * 150;
    for (let i = 0; i < count; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1024;
      const rw = 14 + Math.random() * 68;
      const rh = 10 + Math.random() * 46;
      const rot = (Math.random() - 0.5) * 1.4;

      dCtx.save();
      dCtx.translate(rx, ry);
      dCtx.rotate(rot);
      dCtx.beginPath();
      dCtx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
      dCtx.fill();
      dCtx.restore();
    }
  }

  // Organic diagonal granite fracture lines & natural rock strata
  dCtx.lineWidth = 1.0;
  for (let i = 0; i < 40; i++) {
    dCtx.strokeStyle = Math.random() > 0.4 ? 'rgba(71, 85, 105, 0.25)' : 'rgba(255, 255, 255, 0.45)';
    dCtx.beginPath();
    let fx = Math.random() * 1024;
    let fy = Math.random() * 1024;
    dCtx.moveTo(fx, fy);
    const steps = 6 + Math.floor(Math.random() * 8);
    for (let s = 0; s < steps; s++) {
      fx += (Math.random() - 0.3) * 35;
      fy += (Math.random() - 0.5) * 25;
      dCtx.lineTo(fx, fy);
    }
    dCtx.stroke();
  }

  // Fine crystalline snow & quartz mineral micro-grain
  dCtx.globalAlpha = 0.05;
  const imgData = dCtx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 32;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  dCtx.putImageData(imgData, 0, 0);

  const sandstoneDiffTex = new THREE.CanvasTexture(diffCanvas);
  sandstoneDiffTex.wrapS = THREE.RepeatWrapping;
  sandstoneDiffTex.wrapT = THREE.RepeatWrapping;
  sandstoneDiffTex.repeat.set(16, 16);

  // 2. Photorealistic Alpine Rock Surface Roughness & Relief Bump Map (1024x1024)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bCtx = bumpCanvas.getContext('2d');
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 1024);

  // Soft natural geological crag elevations
  for (let i = 0; i < 200; i++) {
    const bx = Math.random() * 1024;
    const by = Math.random() * 1024;
    const brad = 18 + Math.random() * 55;
    const isLedge = Math.random() > 0.5;

    const bGrad = bCtx.createRadialGradient(bx, by, 0, bx, by, brad);
    bGrad.addColorStop(0, isLedge ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.16)');
    bGrad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(bx - brad, by - brad, brad * 2, brad * 2);
  }

  // Subtle rock fissure relief
  bCtx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  bCtx.lineWidth = 1.4;
  for (let i = 0; i < 25; i++) {
    bCtx.beginPath();
    let cx = Math.random() * 1024;
    let cy = Math.random() * 1024;
    bCtx.moveTo(cx, cy);
    for (let s = 0; s < 5; s++) {
      cx += (Math.random() - 0.5) * 30;
      cy += (Math.random() - 0.5) * 30;
      bCtx.lineTo(cx, cy);
    }
    bCtx.stroke();
  }

  const sandstoneBumpTex = new THREE.CanvasTexture(bumpCanvas);
  sandstoneBumpTex.wrapS = THREE.RepeatWrapping;
  sandstoneBumpTex.wrapT = THREE.RepeatWrapping;
  sandstoneBumpTex.repeat.set(16, 16);

  // 3. Glacial Alpine River Normal / Ripple Map (512x512)
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = 512;
  waterCanvas.height = 512;
  const wCtx = waterCanvas.getContext('2d');
  wCtx.fillStyle = '#062038';
  wCtx.fillRect(0, 0, 512, 512);

  // Crystalline meltwater wave ripple strokes
  wCtx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
  wCtx.lineWidth = 2.0;
  for (let i = 0; i < 55; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const rad = 15 + Math.random() * 55;
    wCtx.beginPath();
    wCtx.arc(cx, cy, rad, 0, Math.PI * 2);
    wCtx.stroke();
  }

  const riverWaterTex = new THREE.CanvasTexture(waterCanvas);
  riverWaterTex.wrapS = THREE.RepeatWrapping;
  riverWaterTex.wrapT = THREE.RepeatWrapping;
  riverWaterTex.repeat.set(8, 24);

  return { sandstoneDiffTex, sandstoneBumpTex, riverWaterTex };
}

/* ==========================================================================
   5. MASTER 3D DRONE SIMULATION APP
   ========================================================================== */

class DroneSimulationApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    // Flight Corridor Configuration
    this.CORRIDOR_MAX_RADIUS = 16.0;
    this.CORRIDOR_WARN_RADIUS = 9.5;
    this.corridorDistance = 0;
    this.isNearCorridorEdge = false;

    // Checkpoint interaction state & Auto-Cruise
    this.activeCheckpoint = null;
    this.isPageViewerOpen = false;
    this.isAutoCruise = false;
    this.currentZoneIndex = 0;
    this.radarZoom = 1.0;

    // Checkpoint Helipad Platform Landing State
    this.isLanded = true;
    this.isLanding = false;
    this.isTakingOff = false;
    this.landingTargetGate = null;
    this.landedCheckpoint = null;
    this.approachingGate = null;
    this.pilotSteerAngle = 0;
    this.pilotAltOffset = 0;
    this.currentForwardSpeed = 0;

    // Camera Modes: 'chase' (default), 'cockpit' (FPV), 'tour' (VIP panoramic orbit)
    this.cameraMode = 'chase';
    this.tourAngle = 0;

    // Flight input keys
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      ascend: false,
      descend: false
    };

    // 6-DoF Quadcopter Physics State (Smooth Momentum & Auto-Altitude Stabilization)
    this.dronePhysics = {
      position: new THREE.Vector3(0, 52, 0),
      velocity: new THREE.Vector3(),
      yaw: 0,
      pitch: 0,
      roll: 0,
      yawRate: 0,
      targetPitch: 0,
      targetRoll: 0,
      airspeedKmh: 0,
      throttle: 0
    };

    // Camera smoothing vectors
    this.cameraPos = new THREE.Vector3(0, 56, 45);
    this.cameraLookAt = new THREE.Vector3(0, 52, 0);

    this.rotors = [];
    this.headlights = [];
    this.thrusterParticles = [];
    this.navLights = [];

    // Initialize systems
    this.initThree();
    this.textures = createProceduralTextures();
    this.buildSunsetSkyAndAtmosphere();
    this.buildFlightPathSpline();
    this.generateRealisticCanyonTerrain();
    this.buildDistantMountainRing();
    this.buildCanyonRiver();
    this.populateDesertFlora();
    this.buildQuadcopterDrone();
    this.buildCheckpointGates();
    this.buildAtmosphericDust();
    this.setupEventListeners();
    this.setupUI();
    this.setupRadarCanvas();

    // Spawn drone safely landed on Zone 01 platform helipad
    if (this.gates && this.gates.length > 0) {
      this.landImmediately(this.gates[0]);
    }

    // Start 60 FPS animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /* ------------------------------------------------------------------------
     Three.js Scene, Camera, High-Exposure Sunset Lighting
     ------------------------------------------------------------------------ */
  initThree() {
    this.scene = new THREE.Scene();

    // Crisp Alpine Atmosphere Fog (Deep Mountain Valley Perspective)
    this.fogColor = new THREE.Color(0xc2d8ec);
    this.scene.background = this.fogColor;
    this.scene.fog = new THREE.FogExp2(this.fogColor, 0.00085);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.2,
      3500
    );
    this.camera.position.set(0, 56, 45);

    // WebGL Renderer with High-Exposure Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.container.appendChild(this.renderer.domElement);

    // Hemisphere Lighting (Crisp Alpine Blue Sky / Cool Slate & Snow Ground Bounce)
    const hemiLight = new THREE.HemisphereLight(0xebf8ff, 0x243242, 1.35);
    this.scene.add(hemiLight);

    // Mountain Ambient Fill Light
    const ambientLight = new THREE.AmbientLight(0x93c5fd, 0.52);
    this.scene.add(ambientLight);

    // Radiant Alpine Sunlight (Casts crisp mountain ridge shadows)
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    this.sunLight.position.set(520, 290, -420);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 50;
    this.sunLight.shadow.camera.far = 1800;
    const shadowD = 550;
    this.sunLight.shadow.camera.left = -shadowD;
    this.sunLight.shadow.camera.right = shadowD;
    this.sunLight.shadow.camera.top = shadowD;
    this.sunLight.shadow.camera.bottom = -shadowD;
    this.sunLight.shadow.bias = -0.0003;
    this.scene.add(this.sunLight);

    // Secondary Alpine Snow Fill Light (Sunlight bouncing off snow-capped peaks)
    const bounceLight = new THREE.DirectionalLight(0xcbe4f9, 0.85);
    bounceLight.position.set(-300, 80, 300);
    this.scene.add(bounceLight);
  }

  /* ------------------------------------------------------------------------
     Atmospheric Alpine Sky, Volumetric Mountain Clouds & Sun Flare
     ------------------------------------------------------------------------ */
  buildSunsetSkyAndAtmosphere() {
    // 1. Crystal-Clear Alpine Gradient Sky Dome
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 1024;
    const sCtx = skyCanvas.getContext('2d');

    const grad = sCtx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0.0, '#0a2e5c'); // Deep alpine azure zenith
    grad.addColorStop(0.30, '#1d4ed8'); // Pure sky blue
    grad.addColorStop(0.58, '#38bdf8'); // Radiant cerulean
    grad.addColorStop(0.78, '#93c5fd'); // Cool mountain haze
    grad.addColorStop(0.92, '#bae6fd'); // Soft horizon blue
    grad.addColorStop(1.0, '#f0f9ff');  // Crisp snow mist horizon
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 1024);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyGeo = new THREE.SphereGeometry(2600, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false
    });
    this.skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyDome);

    // 2. Photorealistic Mountain Sun Disc with Crystalline Halo Flare
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 512;
    sunCanvas.height = 512;
    const sunCtx = sunCanvas.getContext('2d');

    // Soft radiant golden-white corona
    const sunGrad = sunCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGrad.addColorStop(0.16, 'rgba(255, 250, 220, 0.95)');
    sunGrad.addColorStop(0.42, 'rgba(186, 230, 253, 0.55)');
    sunGrad.addColorStop(0.78, 'rgba(147, 197, 253, 0.15)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sunCtx.fillStyle = sunGrad;
    sunCtx.fillRect(0, 0, 512, 512);

    // Subtle horizontal diamond flare streak
    const flareGrad = sunCtx.createLinearGradient(0, 256, 512, 256);
    flareGrad.addColorStop(0, 'rgba(186, 230, 253, 0)');
    flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    flareGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
    sunCtx.fillStyle = flareGrad;
    sunCtx.fillRect(0, 251, 512, 10);

    const sunTex = new THREE.CanvasTexture(sunCanvas);
    const sunMat = new THREE.SpriteMaterial({
      map: sunTex,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.98,
      fog: false
    });
    const sunSprite = new THREE.Sprite(sunMat);
    sunSprite.position.copy(this.sunLight.position).normalize().multiplyScalar(2200);
    sunSprite.scale.set(720, 720, 1);
    this.scene.add(sunSprite);

    // 3. 3D Volumetric Alpine Cumulus Mountain Clouds
    this.cloudGroup = new THREE.Group();
    const cloudCount = 36;
    const cloudGeo = new THREE.DodecahedronGeometry(1, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xcfe2f3,
      emissiveIntensity: 0.2,
      roughness: 0.92,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82,
      flatShading: true
    });

    for (let c = 0; c < cloudCount; c++) {
      const singleCloud = new THREE.Group();
      const puffCount = 5 + Math.floor(Math.random() * 5);
      const baseScale = 22 + Math.random() * 32;

      for (let p = 0; p < puffCount; p++) {
        const puff = new THREE.Mesh(cloudGeo, cloudMat);
        puff.position.set(
          (Math.random() - 0.5) * baseScale * 1.5,
          (Math.random() - 0.5) * baseScale * 0.45,
          (Math.random() - 0.5) * baseScale * 1.2
        );
        const s = baseScale * (0.6 + Math.random() * 0.7);
        puff.scale.set(s, s * 0.55, s);
        singleCloud.add(puff);
      }

      const angle = (c / cloudCount) * Math.PI * 2;
      const dist = 450 + Math.random() * 950;
      singleCloud.position.set(
        Math.cos(angle) * dist,
        320 + Math.random() * 160,
        Math.sin(angle) * dist
      );
      this.cloudGroup.add(singleCloud);
    }
    this.scene.add(this.cloudGroup);
  }

  /* ------------------------------------------------------------------------
     Winding Blue Neon Flight Spline Corridor
     ------------------------------------------------------------------------ */
  buildFlightPathSpline() {
    // Clean, non-intersecting alpine valley circuit (Sequential zones 01 to 10 with zero crossovers)
    const rawWaypoints = [
      new THREE.Vector3(0, 48, -342),    // [0] Zone 01: Home & Welcome (splineT: 0.0)
      new THREE.Vector3(105, 49, -307),  // [1] Intermediate
      new THREE.Vector3(192, 51, -251),  // [2] Zone 02: About Me (splineT: 0.1)
      new THREE.Vector3(264, 53, -182),  // [3] Intermediate
      new THREE.Vector3(323, 56, -100),  // [4] Zone 03: Projects (splineT: 0.2)
      new THREE.Vector3(360, 58, 0),     // [5] Intermediate
      new THREE.Vector3(362, 58, 112),   // [6] Zone 04: Contact Us (splineT: 0.3)
      new THREE.Vector3(318, 58, 220),   // [7] Intermediate
      new THREE.Vector3(231, 58, 302),   // [8] Zone 05: Skills (splineT: 0.4)
      new THREE.Vector3(118, 57, 344),   // [9] Intermediate
      new THREE.Vector3(0, 57, 342),     // [10] Zone 06: Experience (splineT: 0.5)
      new THREE.Vector3(-105, 57, 307),  // [11] Intermediate
      new THREE.Vector3(-192, 58, 251),  // [12] Zone 07: Services (splineT: 0.6)
      new THREE.Vector3(-264, 58, 182),  // [13] Intermediate
      new THREE.Vector3(-323, 58, 100),  // [14] Zone 08: Testimonials (splineT: 0.7)
      new THREE.Vector3(-360, 57, 0),    // [15] Intermediate
      new THREE.Vector3(-362, 55, -112), // [16] Zone 09: Media Gallery (splineT: 0.8)
      new THREE.Vector3(-318, 52, -220), // [17] Intermediate
      new THREE.Vector3(-231, 50, -302), // [18] Zone 10: Achievements (splineT: 0.9)
      new THREE.Vector3(-118, 48, -344)  // [19] Intermediate
    ];

    this.flightCurve = new THREE.CatmullRomCurve3(rawWaypoints, true, 'centripetal', 0.4);
    this.splineSamplePoints = this.flightCurve.getPoints(1200);

    // High-Contrast Cyan Glowing Spline Ribbon
    const tubeGeo = new THREE.TubeGeometry(this.flightCurve, 900, 0.42, 8, true);
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 3.2,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });
    this.pathTubeMesh = new THREE.Mesh(tubeGeo, this.tubeMaterial);
    this.scene.add(this.pathTubeMesh);

    // Inner Laser Core
    const coreLineGeo = new THREE.BufferGeometry().setFromPoints(this.flightCurve.getPoints(900));
    const coreLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });
    this.pathCoreLine = new THREE.LineLoop(coreLineGeo, coreLineMat);
    this.scene.add(this.pathCoreLine);

    // Floating Guide Rings
    const ringGeo = new THREE.TorusGeometry(3.2, 0.08, 6, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    this.pathRingGroup = new THREE.Group();
    const ringCount = 70;
    for (let i = 0; i < ringCount; i++) {
      const u = i / ringCount;
      const pt = this.flightCurve.getPoint(u);
      const tangent = this.flightCurve.getTangent(u);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pt);
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.pathRingGroup.add(ringMesh);
    }
    this.scene.add(this.pathRingGroup);

    // Spawn drone at start point (Zone 01 Helipad surface level)
    const startPoint = this.flightCurve.getPoint(0);
    const startTangent = this.flightCurve.getTangent(0);
    this.dronePhysics.position.set(startPoint.x, startPoint.y - 4.76, startPoint.z);
    this.dronePhysics.yaw = Math.atan2(-startTangent.x, -startTangent.z);
    this.dronePhysics.velocity.set(0, 0, 0);
  }

  /* ------------------------------------------------------------------------
     Unified Terrain Elevation Function (Realistic Alpine Mountain Massif)
     ------------------------------------------------------------------------ */
  getTerrainElevation(x, z) {
    // 1. Broad undulating continental alpine massif
    const baseMountain = noiseGen.fbmMountain(x * 0.0011, z * 0.0011) * 85;

    // 2. Sharp ridged multifractal peaks & knife-edge snow crests
    const sharpRidges = noiseGen.ridgedNoise(x * 0.0022 + 12.3, z * 0.0022 + 45.7) * 155;

    // 3. High-frequency crag and rock crevice details
    const crags = noiseGen.noise2D(x * 0.008, z * 0.008) * 12;

    let h = baseMountain + sharpRidges + crags;

    // Carve a scenic, smooth alpine river valley along the flight path
    let minDistToPath = 9999;
    for (let s = 0; s < this.splineSamplePoints.length; s += 20) {
      const dx = x - this.splineSamplePoints[s].x;
      const dz = z - this.splineSamplePoints[s].z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < minDistToPath) minDistToPath = d;
    }

    if (minDistToPath < 95) {
      const factor = Math.cos((minDistToPath / 95) * (Math.PI / 2));
      h = Math.max(14, h * (1.0 - factor * 0.72) - factor * 26);
    }

    return h;
  }

  getTerrainHeightAt(x, z) {
    return this.getTerrainElevation(x, z);
  }

  /* ------------------------------------------------------------------------
     Realistic Alpine Snow-Capped Mountain Terrain with Slope & Elevation Shading
     ------------------------------------------------------------------------ */
  generateRealisticCanyonTerrain() {
    const terrainSize = 1600;
    const terrainSegments = 220;

    const terrainGeo = new THREE.PlaneGeometry(
      terrainSize,
      terrainSize,
      terrainSegments,
      terrainSegments
    );
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const h = this.getTerrainElevation(x, z);
      posAttr.setY(i, h);
    }
    terrainGeo.computeVertexNormals();

    // Slope, Altitude & Sun-Angle Based Photorealistic Alpine Snow & Slate Rock Shading
    const normalAttr = terrainGeo.attributes.normal;
    const colors = [];

    // Authentic Alpine Palette (High-Altitude Snow, Granite Cliffs & Scree)
    const snowSunlit = new THREE.Color(0xfcfdff);      // Pristine sunlit powder snow
    const snowShadow = new THREE.Color(0xc0d8ee);      // Azure shadow firn / alpine ice
    const snowSoftDusk = new THREE.Color(0xdce7f2);    // Transition snow dusting
    const graniteLedge = new THREE.Color(0x566577);    // Weathered high-altitude granite ledge
    const graniteBody = new THREE.Color(0x353f4d);     // Sheer dark alpine granite wall
    const graniteDeep = new THREE.Color(0x202832);     // Deep geological fissure / couloir shadow
    const mineralWarm = new THREE.Color(0x4a433c);     // Earthy quartz/iron mineral strata
    const screeTalus = new THREE.Color(0x3d4653);      // Fallen rock scree & moraine rubble
    const alpineTundra = new THREE.Color(0x24352b);    // Sub-alpine dwarf pine / tundra moss
    const riverSilt = new THREE.Color(0x2f3742);       // Glacial outwash river silt & gravel

    // Direction to Alpine Sun for natural slope illumination shading
    const sunDir = new THREE.Vector3(0.69, 0.38, -0.61).normalize();

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      const nx = normalAttr.getX(i);
      const ny = normalAttr.getY(i); // 1.0 = horizontal plateau, 0.0 = vertical wall
      const nz = normalAttr.getZ(i);

      // Sun dot product (-1 to 1) -> 1 is facing directly into sunlight, 0 is perpendicular, -1 in shadow
      const sunDot = nx * sunDir.x + ny * sunDir.y + nz * sunDir.z;
      const sunFacing = Math.max(0.0, Math.min(1.0, (sunDot + 0.2) * 1.2));

      // Natural wavy snowline elevation (starts around 46m - 58m)
      const localSnowline = 48 + noiseGen.noise2D(x * 0.009, z * 0.009) * 10;
      const vColor = new THREE.Color();

      if (y > localSnowline) {
        // High Altitude Mountain Massif & Crests
        const altitudeFactor = Math.min(1.0, (y - localSnowline) / 22.0);

        if (ny > 0.36) {
          // Gentle to medium slopes hold deep pristine snow
          const baseSnow = new THREE.Color().lerpColors(snowShadow, snowSunlit, sunFacing);
          vColor.lerpColors(snowSoftDusk, baseSnow, altitudeFactor);
        } else {
          // Steep vertical couloirs: Snow drops off cliff, revealing dark granite
          const steepFactor = Math.min(1.0, (0.36 - ny) / 0.36);
          const rockCol = new THREE.Color().lerpColors(graniteLedge, graniteBody, steepFactor);
          // Rock crevices with subtle warm mineral strata
          if (Math.sin(y * 0.45 + x * 0.1) > 0.4) {
            rockCol.lerp(mineralWarm, 0.28);
          }
          // Slight snow dusting on shallow rock ledges
          const ledgeDust = Math.max(0.0, ny / 0.36);
          vColor.lerpColors(rockCol, snowSoftDusk, ledgeDust * 0.35);
        }
      } else {
        // Sub-Snowline Valley & Mountain Foundations
        const valleyElevation = Math.max(0.0, Math.min(1.0, (y - 16) / 34.0));

        if (ny > 0.60) {
          // Gentle valley banks & sub-alpine meadows
          vColor.lerpColors(alpineTundra, screeTalus, valleyElevation);
        } else {
          // Lower granite canyon walls
          const wallSteepness = Math.min(1.0, (0.60 - ny) / 0.60);
          vColor.lerpColors(screeTalus, graniteDeep, wallSteepness);
          if (sunFacing > 0.6) {
            vColor.lerp(graniteLedge, (sunFacing - 0.6) * 0.5);
          }
        }

        // Glacial riverbed & pebble gravel
        if (y < 26) {
          vColor.lerp(riverSilt, Math.min(1.0, (26 - y) / 12.0));
        }
      }

      colors.push(vColor.r, vColor.g, vColor.b);
    }

    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const terrainMat = new THREE.MeshStandardMaterial({
      map: this.textures.sandstoneDiffTex,
      bumpMap: this.textures.sandstoneBumpTex,
      bumpScale: 0.22, // Subtle realistic geological relief, eliminates black speckles
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.06,
      flatShading: false
    });

    this.terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);
  }

  /* ------------------------------------------------------------------------
     Obstacle Removal (Unwanted Monolith Cylinders / Obstacles Eliminated)
     ------------------------------------------------------------------------ */
  buildCanyonButtesAndMonoliths() {
    // Intentionally cleared: Obstacle monolith cylinders removed as requested
  }

  /* ------------------------------------------------------------------------
     Distant Snow-Capped Mountain Ranges (2400m Depth Panoramic Horizon)
     ------------------------------------------------------------------------ */
  buildDistantMountainRing() {
    const mountainCount = 48;
    const ringRadius = 1950;

    const mMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.90,
      metalness: 0.05,
      flatShading: false
    });

    for (let i = 0; i < mountainCount; i++) {
      const angle = (i / mountainCount) * Math.PI * 2;
      const x = Math.cos(angle) * (ringRadius + (Math.random() - 0.5) * 320);
      const z = Math.sin(angle) * (ringRadius + (Math.random() - 0.5) * 320);
      const h = 440 + Math.random() * 320;
      const w = 310 + Math.random() * 210;

      // Realistic faceted alpine mountain massif with jagged summit
      const mGeo = new THREE.ConeGeometry(w, h, 14, 6);
      mGeo.translate(0, h * 0.5, 0);

      const posAttr = mGeo.attributes.position;
      const mColors = [];
      const snowSummit = new THREE.Color(0xfcfdff);
      const snowMid = new THREE.Color(0xcde1f4);
      const rockMid = new THREE.Color(0x475569);
      const rockBase = new THREE.Color(0x242e3b);

      for (let v = 0; v < posAttr.count; v++) {
        const vy = posAttr.getY(v);
        const vx = posAttr.getX(v);
        const vz = posAttr.getZ(v);

        // Perturb lower/mid vertices for natural crags
        if (vy < h * 0.92) {
          posAttr.setX(v, vx + (Math.random() - 0.5) * 20);
          posAttr.setZ(v, vz + (Math.random() - 0.5) * 20);
        }

        // Snow-capped summit coloring
        const vRatio = vy / h;
        const c = new THREE.Color();
        if (vRatio > 0.50) {
          // Upper mountain is pure white snow
          c.lerpColors(snowMid, snowSummit, (vRatio - 0.50) / 0.50);
        } else if (vRatio > 0.25) {
          // Mid mountain is weathered rock with snow dusting
          c.lerpColors(rockMid, snowMid, (vRatio - 0.25) / 0.25);
        } else {
          // Lower mountain base is dark granite slate
          c.lerpColors(rockBase, rockMid, vRatio / 0.25);
        }
        mColors.push(c.r, c.g, c.b);
      }
      mGeo.computeVertexNormals();
      mGeo.setAttribute('color', new THREE.Float32BufferAttribute(mColors, 3));

      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(x, 10, z);
      this.scene.add(mMesh);
    }
  }

  /* ------------------------------------------------------------------------
     Winding Glacial River with Crystal Turquoise Alpine Water Reflection
     ------------------------------------------------------------------------ */
  buildCanyonRiver() {
    const riverGeo = new THREE.PlaneGeometry(850, 650, 48, 48);
    riverGeo.rotateX(-Math.PI / 2);

    this.waterTexture = this.textures.riverWaterTex;

    const riverMat = new THREE.MeshStandardMaterial({
      map: this.waterTexture,
      color: 0x0284c7,
      roughness: 0.08,
      metalness: 0.92,
      transparent: true,
      opacity: 0.90
    });

    this.riverMesh = new THREE.Mesh(riverGeo, riverMat);
    this.riverMesh.position.set(20, 16.5, 30);
    this.scene.add(this.riverMesh);
  }

  /* ------------------------------------------------------------------------
     Snow-Dusted Alpine Pine & Spruce Forest
     ------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------
     Stylized Low-Poly Layered Alpine Pine Trees (Option 1)
     - 4-Tier stepped geometric conical canopies with faceted hexagonal silhouettes
     - Crisp, low-poly white snow caps on the shoulders and apex of each tier
     - Tapered warm cedar wood trunk with flared root base
     - High-Performance InstancedMesh architecture
     ------------------------------------------------------------------------ */
  populateDesertFlora() {
    const treeCount = 420;

    // Helper to merge non-indexed BufferGeometries into a single fast draw call
    const mergeGeometries = (geos) => {
      let totalVerts = 0;
      const nonIndexed = geos.map(g => g.toNonIndexed());
      nonIndexed.forEach(g => totalVerts += g.attributes.position.count);
      const posArray = new Float32Array(totalVerts * 3);
      let offset = 0;
      nonIndexed.forEach(g => {
        posArray.set(g.attributes.position.array, offset);
        offset += g.attributes.position.array.length;
      });
      const merged = new THREE.BufferGeometry();
      merged.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      merged.computeVertexNormals();
      return merged;
    };

    // 1. Tapered Cedar Trunk with Flared Root Base
    const trunkMain = new THREE.CylinderGeometry(0.36, 0.68, 4.2, 6);
    trunkMain.translate(0, 2.1, 0);
    const trunkRoots = new THREE.CylinderGeometry(0.68, 1.05, 0.8, 6);
    trunkRoots.translate(0, 0.4, 0);
    const trunkGeo = mergeGeometries([trunkMain, trunkRoots]);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.90,
      metalness: 0.05,
      flatShading: true
    });

    // 2. 4-Tier Stepped Conical Pine Foliage (Deep Alpine Emerald Green)
    const t1 = new THREE.ConeGeometry(3.3, 2.5, 6);
    t1.translate(0, 4.0, 0);
    const t2 = new THREE.ConeGeometry(2.6, 2.3, 6);
    t2.translate(0, 5.5, 0);
    const t3 = new THREE.ConeGeometry(1.9, 2.0, 6);
    t3.translate(0, 6.9, 0);
    const t4 = new THREE.ConeGeometry(1.2, 1.7, 6);
    t4.translate(0, 8.1, 0);
    const foliageGeo = mergeGeometries([t1, t2, t3, t4]);

    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x163d27,
      roughness: 0.82,
      metalness: 0.06,
      flatShading: true
    });

    // 3. Faceted Low-Poly Snow Caps (Stepped shoulder snow rims & apex peak)
    const s1 = new THREE.ConeGeometry(3.35, 0.8, 6);
    s1.translate(0, 4.2, 0);
    const s2 = new THREE.ConeGeometry(2.65, 0.75, 6);
    s2.translate(0, 5.7, 0);
    const s3 = new THREE.ConeGeometry(1.95, 0.7, 6);
    s3.translate(0, 7.1, 0);
    const s4 = new THREE.ConeGeometry(1.24, 1.1, 6);
    s4.translate(0, 8.4, 0);
    const snowGeo = mergeGeometries([s1, s2, s3, s4]);

    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.72,
      metalness: 0.04,
      flatShading: true
    });

    // 3 High-Performance Instanced Meshes for the entire forest
    const instancedTrunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const instancedFoliage = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);
    const instancedSnow = new THREE.InstancedMesh(snowGeo, snowMat, treeCount);

    instancedTrunks.castShadow = true;
    instancedTrunks.receiveShadow = true;
    instancedFoliage.castShadow = true;
    instancedFoliage.receiveShadow = true;
    instancedSnow.castShadow = true;
    instancedSnow.receiveShadow = true;

    const dummy = new THREE.Object3D();
    let placedTrees = 0;

    for (let i = 0; i < treeCount * 6 && placedTrees < treeCount; i++) {
      const rx = (Math.random() - 0.5) * 1250;
      const rz = (Math.random() - 0.5) * 1250;
      const groundY = this.getTerrainElevation(rx, rz);

      if (groundY > 26 && groundY < 85) {
        let nearSpline = false;
        for (let s = 0; s < this.splineSamplePoints.length; s += 16) {
          const pt = this.splineSamplePoints[s];
          const d = Math.hypot(rx - pt.x, rz - pt.z);
          if (d < 16.0) { nearSpline = true; break; }
        }

        if (!nearSpline) {
          dummy.position.set(rx, groundY, rz);
          const sc = 0.85 + Math.random() * 0.45;
          dummy.scale.set(sc, sc, sc);
          dummy.rotation.y = Math.random() * Math.PI * 2;
          dummy.updateMatrix();

          instancedTrunks.setMatrixAt(placedTrees, dummy.matrix);
          instancedFoliage.setMatrixAt(placedTrees, dummy.matrix);
          instancedSnow.setMatrixAt(placedTrees, dummy.matrix);
          placedTrees++;
        }
      }
    }

    instancedTrunks.instanceMatrix.needsUpdate = true;
    instancedFoliage.instanceMatrix.needsUpdate = true;
    instancedSnow.instanceMatrix.needsUpdate = true;

    this.scene.add(instancedTrunks);
    this.scene.add(instancedFoliage);
    this.scene.add(instancedSnow);
  }

  /* ------------------------------------------------------------------------
     Quadcopter 3D Model: Authentic DJI Inspire 3 Cinema Drone
     - Transformable High-Modulus Carbon-Fiber Airframe & Space-Grey Canopy
     - Dual TB51 Intelligent Flight Batteries with 8-Segment Emerald LED Fuel Gauge
     - 3-Axis Motorized Zenmuse X9-8K Cinema Gimbal with Multi-Coated Optics
     - Aerodynamic Folding Propellers with Safety-Orange Wingtips
     - Omnidirectional Vision Sensors (Front & Rear Stereo Obstacle Cameras)
     - Aviation FAA LED Navigation Lights, Pulsing White Anti-Collision Strobe
     ------------------------------------------------------------------------ */
  buildQuadcopterDrone() {
    this.droneGroup = new THREE.Group();

    // 1. High-Detail Aeronautical Materials
    const carbonCompositeMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.38,
      metalness: 0.65
    });

    const spaceGreyCanopyMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.26,
      metalness: 0.88
    });

    const machinedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.20,
      metalness: 0.95
    });

    const darkGunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.28,
      metalness: 0.90
    });

    const polishedCopperMat = new THREE.MeshStandardMaterial({
      color: 0xc27835,
      roughness: 0.25,
      metalness: 0.92
    });

    const opticalLensMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.04,
      metalness: 0.98
    });

    const cinemaArGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1d3557,
      roughness: 0.02,
      metalness: 0.99,
      transparent: true,
      opacity: 0.88
    });

    const batteryShellMat = new THREE.MeshStandardMaterial({
      color: 0x242833,
      roughness: 0.40,
      metalness: 0.35
    });

    const batteryLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    const propBladeCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x16181f,
      roughness: 0.30,
      metalness: 0.70
    });

    const safetyOrangeTipMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.28,
      metalness: 0.15
    });

    const propBlurDiscMat = new THREE.MeshBasicMaterial({
      color: 0x1e232b,
      transparent: true,
      opacity: 0.22
    });

    // 2. Sculpted Aerodynamic Inspire 3 Airframe
    // Lower Chassis Tub in Matte Carbon Fiber
    const mainHullGeo = new THREE.BoxGeometry(1.9, 0.52, 2.9);
    const mainHull = new THREE.Mesh(mainHullGeo, carbonCompositeMat);
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    this.droneGroup.add(mainHull);

    // Upper Aerodynamic Canopy in Satin Space-Grey Aluminum
    const canopyGeo = new THREE.CylinderGeometry(0.55, 0.92, 2.4, 8);
    canopyGeo.rotateX(Math.PI / 2);
    canopyGeo.scale(1.0, 0.52, 1.0);
    const canopy = new THREE.Mesh(canopyGeo, spaceGreyCanopyMat);
    canopy.position.set(0, 0.32, -0.15);
    canopy.castShadow = true;
    this.droneGroup.add(canopy);

    // Central Titanium Dorsal Spine & Vent Ledge
    const spineGeo = new THREE.BoxGeometry(0.72, 0.10, 2.3);
    const spine = new THREE.Mesh(spineGeo, machinedTitaniumMat);
    spine.position.set(0, 0.48, -0.15);
    this.droneGroup.add(spine);

    // Aerodynamic Sloped Nose Cone
    const noseGeo = new THREE.CylinderGeometry(0.35, 0.85, 0.8, 6);
    noseGeo.rotateX(Math.PI / 2);
    noseGeo.scale(1.0, 0.55, 1.0);
    const nose = new THREE.Mesh(noseGeo, spaceGreyCanopyMat);
    nose.position.set(0, 0.08, -1.8);
    this.droneGroup.add(nose);

    // Front Pilot FPV Ultra-Wide Lens Turret
    const fpvHousingGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.18, 12);
    fpvHousingGeo.rotateX(Math.PI / 2);
    const fpvHousing = new THREE.Mesh(fpvHousingGeo, machinedTitaniumMat);
    fpvHousing.position.set(0, 0.12, -2.2);
    this.droneGroup.add(fpvHousing);

    const fpvLensGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const fpvLens = new THREE.Mesh(fpvLensGeo, cinemaArGlassMat);
    fpvLens.position.set(0, 0.12, -2.28);
    this.droneGroup.add(fpvLens);

    // Dual Forward Stereo Obstacle Avoidance Vision Cameras
    const stereoBezelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.14, 12);
    stereoBezelGeo.rotateX(Math.PI / 2);
    const eyeGlassGeo = new THREE.SphereGeometry(0.11, 12, 12);

    [-0.52, 0.52].forEach(xOff => {
      const bezel = new THREE.Mesh(stereoBezelGeo, machinedTitaniumMat);
      bezel.position.set(xOff, 0.10, -1.98);
      this.droneGroup.add(bezel);

      const eye = new THREE.Mesh(eyeGlassGeo, opticalLensMat);
      eye.position.set(xOff, 0.10, -2.04);
      this.droneGroup.add(eye);
    });

    // Top Aerodynamic RTK / GNSS Satellite Navigation Dome
    const rtkBaseGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.12, 20);
    const rtkBase = new THREE.Mesh(rtkBaseGeo, machinedTitaniumMat);
    rtkBase.position.set(0, 0.54, -0.55);
    this.droneGroup.add(rtkBase);

    const rtkDomeGeo = new THREE.SphereGeometry(0.38, 16, 12);
    rtkDomeGeo.scale(1, 0.32, 1);
    const rtkDome = new THREE.Mesh(rtkDomeGeo, spaceGreyCanopyMat);
    rtkDome.position.set(0, 0.61, -0.55);
    this.droneGroup.add(rtkDome);

    // 3. Signature Rear Dual TB51 Intelligent Flight Batteries
    [-0.45, 0.45].forEach(xSide => {
      // Left and right individual battery modules
      const batGeo = new THREE.BoxGeometry(0.78, 0.52, 1.45);
      const batMesh = new THREE.Mesh(batGeo, batteryShellMat);
      batMesh.position.set(xSide, 0.12, 1.15);
      this.droneGroup.add(batMesh);

      // Battery top lock clip
      const lockGeo = new THREE.BoxGeometry(0.25, 0.08, 0.15);
      const lockMesh = new THREE.Mesh(lockGeo, machinedTitaniumMat);
      lockMesh.position.set(xSide, 0.39, 0.72);
      this.droneGroup.add(lockMesh);

      // 4-Dot Emerald Green Fuel Gauge LEDs [● ● ● ●]
      const ledGeo = new THREE.BoxGeometry(0.09, 0.04, 0.07);
      [-0.18, -0.06, 0.06, 0.18].forEach(xDot => {
        const led = new THREE.Mesh(ledGeo, batteryLedMat);
        led.position.set(xSide + xDot, 0.39, 1.35);
        this.droneGroup.add(led);
      });
    });

    // Rear Ducktail Aerodynamic Tail Spoiler & Heatsink
    const tailSpoilerGeo = new THREE.BoxGeometry(1.65, 0.22, 0.45);
    const tailSpoiler = new THREE.Mesh(tailSpoilerGeo, spaceGreyCanopyMat);
    tailSpoiler.position.set(0, 0.25, 1.95);
    this.droneGroup.add(tailSpoiler);

    // Rear Obstacle Avoidance Stereo Cameras
    [-0.45, 0.45].forEach(xOff => {
      const rearBezel = new THREE.Mesh(stereoBezelGeo, machinedTitaniumMat);
      rearBezel.position.set(xOff, 0.20, 2.12);
      this.droneGroup.add(rearBezel);

      const rearEye = new THREE.Mesh(eyeGlassGeo, opticalLensMat);
      rearEye.position.set(xOff, 0.20, 2.16);
      this.droneGroup.add(rearEye);
    });

    // Heatsink Cooling Louver Slots
    const heatsinkGeo = new THREE.BoxGeometry(1.4, 0.24, 0.12);
    const heatsink = new THREE.Mesh(heatsinkGeo, darkGunmetalMat);
    heatsink.position.set(0, -0.05, 1.88);
    this.droneGroup.add(heatsink);

    // 4. Zenmuse X9-8K Full-Frame Cinema Camera & 3-Axis Gimbal
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, -0.42, -1.15);

    // Top Quick-Release Vibration Isolation Damping Plate
    const isolatorPlateGeo = new THREE.BoxGeometry(0.9, 0.08, 0.9);
    const isolatorPlate = new THREE.Mesh(isolatorPlateGeo, machinedTitaniumMat);
    gimbalGroup.add(isolatorPlate);

    // 4 Silicone Vibration Rubber Dampers
    const damperGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8);
    [[-0.32, -0.32], [-0.32, 0.32], [0.32, -0.32], [0.32, 0.32]].forEach(([dx, dz]) => {
      const damper = new THREE.Mesh(damperGeo, carbonCompositeMat);
      damper.position.set(dx, -0.08, dz);
      gimbalGroup.add(damper);
    });

    // 360-Degree Motorized Pan Yaw Motor
    const yawMotorGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.22, 16);
    const yawMotor = new THREE.Mesh(yawMotorGeo, darkGunmetalMat);
    yawMotor.position.set(0, -0.22, 0);
    gimbalGroup.add(yawMotor);

    // Curved CNC Machined Roll Arm Bracket
    const rollArmGeo = new THREE.BoxGeometry(0.15, 0.48, 0.32);
    const rollArm = new THREE.Mesh(rollArmGeo, machinedTitaniumMat);
    rollArm.position.set(0.32, -0.42, 0);
    gimbalGroup.add(rollArm);

    // Cinema Camera Body (Magnesium Alloy)
    const camBodyGeo = new THREE.BoxGeometry(0.72, 0.54, 0.62);
    const camBody = new THREE.Mesh(camBodyGeo, darkGunmetalMat);
    camBody.position.set(0, -0.56, 0);
    gimbalGroup.add(camBody);

    // Cylindrical Multi-Stage Prime Cinema Lens Barrel
    const lensBarrelGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.52, 20);
    lensBarrelGeo.rotateX(Math.PI / 2);
    const lensBarrel = new THREE.Mesh(lensBarrelGeo, darkGunmetalMat);
    lensBarrel.position.set(0, -0.56, -0.44);
    gimbalGroup.add(lensBarrel);

    // Metallic Textured Focus Ring
    const focusRingGeo = new THREE.CylinderGeometry(0.285, 0.285, 0.14, 20);
    focusRingGeo.rotateX(Math.PI / 2);
    const focusRing = new THREE.Mesh(focusRingGeo, machinedTitaniumMat);
    focusRing.position.set(0, -0.56, -0.36);
    gimbalGroup.add(focusRing);

    // Curved Front Glass Element (Anti-Reflective Optical Sheen)
    const frontGlassGeo = new THREE.SphereGeometry(0.24, 20, 16);
    const frontGlass = new THREE.Mesh(frontGlassGeo, cinemaArGlassMat);
    frontGlass.position.set(0, -0.56, -0.68);
    gimbalGroup.add(frontGlass);

    this.droneGroup.add(gimbalGroup);

    // 5. Transformable Carbon-Fiber Landing Skids
    [-0.92, 0.92].forEach(xSide => {
      // Fore and aft diagonal tubular carbon landing struts
      const legGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.95, 8);
      legGeo.rotateZ(xSide > 0 ? -0.36 : 0.36);

      const frontLeg = new THREE.Mesh(legGeo, carbonCompositeMat);
      frontLeg.position.set(xSide * 1.05, -0.48, -0.75);
      this.droneGroup.add(frontLeg);

      const rearLeg = new THREE.Mesh(legGeo, carbonCompositeMat);
      rearLeg.position.set(xSide * 1.05, -0.48, 0.75);
      this.droneGroup.add(rearLeg);

      // Horizontal ground landing skid tube
      const runnerGeo = new THREE.CylinderGeometry(0.075, 0.075, 2.9, 8);
      runnerGeo.rotateX(Math.PI / 2);
      const runner = new THREE.Mesh(runnerGeo, machinedTitaniumMat);
      runner.position.set(xSide * 1.25, -0.90, 0);
      this.droneGroup.add(runner);

      // Rubber touchdown damping foot pads
      [-1.25, 1.25].forEach(zEnd => {
        const footGeo = new THREE.SphereGeometry(0.095, 8, 8);
        const foot = new THREE.Mesh(footGeo, carbonCompositeMat);
        foot.position.set(xSide * 1.25, -0.90, zEnd);
        this.droneGroup.add(foot);
      });
    });

    // 6. Iconic Transformable Carbon-Fiber Truss Booms & Brushless Motors
    const armAngle = Math.PI / 4;
    const armDistance = 2.55;
    const armPositions = [
      { x: Math.cos(armAngle) * armDistance, z: Math.sin(armAngle) * armDistance },
      { x: -Math.cos(armAngle) * armDistance, z: Math.sin(armAngle) * armDistance },
      { x: Math.cos(armAngle) * armDistance, z: -Math.sin(armAngle) * armDistance },
      { x: -Math.cos(armAngle) * armDistance, z: -Math.sin(armAngle) * armDistance }
    ];

    // Main tubular carbon boom
    const boomGeo = new THREE.CylinderGeometry(0.13, 0.17, armDistance * 1.05, 12);
    boomGeo.rotateZ(Math.PI / 2);

    // Diagonal carbon truss brace
    const braceGeo = new THREE.CylinderGeometry(0.07, 0.09, armDistance * 0.85, 8);
    braceGeo.rotateZ(Math.PI / 2);

    // CNC machined aluminum transform pivot clamp
    const pivotClampGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.42, 10);
    pivotClampGeo.rotateZ(Math.PI / 2);

    // Brushless motor components
    const motorBaseGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.26, 16);
    const motorStatorGeo = new THREE.CylinderGeometry(0.40, 0.40, 0.32, 16);
    const motorBellGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.36, 16);
    const propSpinnerGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.20, 12);

    // Folding aerodynamic carbon blades with Inspire safety-orange tips
    const bladeGeo = new THREE.BoxGeometry(2.45, 0.035, 0.23);
    const tipGeo = new THREE.BoxGeometry(0.38, 0.038, 0.23);
    const blurDiscGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.015, 32);

    armPositions.forEach((pos, idx) => {
      // Main Carbon Boom
      const boom = new THREE.Mesh(boomGeo, carbonCompositeMat);
      boom.position.set(pos.x * 0.5, 0.12, pos.z * 0.5);
      boom.lookAt(pos.x, 0.12, pos.z);
      this.droneGroup.add(boom);

      // Lower Diagonal Truss Brace
      const brace = new THREE.Mesh(braceGeo, carbonCompositeMat);
      brace.position.set(pos.x * 0.42, -0.06, pos.z * 0.42);
      brace.lookAt(pos.x, 0.12, pos.z);
      this.droneGroup.add(brace);

      // Titanium Pivot Clamp at Fuselage Junction
      const pivot = new THREE.Mesh(pivotClampGeo, machinedTitaniumMat);
      pivot.position.set(pos.x * 0.24, 0.12, pos.z * 0.24);
      pivot.lookAt(pos.x, 0.12, pos.z);
      this.droneGroup.add(pivot);

      // Brushless Motor Base with Cooling Ports
      const mBase = new THREE.Mesh(motorBaseGeo, darkGunmetalMat);
      mBase.position.set(pos.x, 0.18, pos.z);
      this.droneGroup.add(mBase);

      // Polished Copper Stator Wire Coils
      const mStator = new THREE.Mesh(motorStatorGeo, polishedCopperMat);
      mStator.position.set(pos.x, 0.32, pos.z);
      this.droneGroup.add(mStator);

      // Anodized Gunmetal Motor Bell Housing
      const mBell = new THREE.Mesh(motorBellGeo, darkGunmetalMat);
      mBell.position.set(pos.x, 0.44, pos.z);
      this.droneGroup.add(mBell);

      // CNC Propeller Spinner Lock Nut
      const mNut = new THREE.Mesh(propSpinnerGeo, machinedTitaniumMat);
      mNut.position.set(pos.x, 0.62, pos.z);
      this.droneGroup.add(mNut);

      // Under-Motor Recessed Navigation / Status LED Ring & Lens (Aerospace Grade Flush Mount)
      const podLedBezelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 16);
      const podLedBezel = new THREE.Mesh(podLedBezelGeo, machinedTitaniumMat);
      podLedBezel.position.set(pos.x, 0.06, pos.z);
      this.droneGroup.add(podLedBezel);

      // Aviation standard colors: Front-Left=Red, Front-Right=Green, Rear=Status Amber
      let ledColor = 0xf59e0b;
      if (pos.z < 0) {
        ledColor = (pos.x < 0) ? 0xef4444 : 0x10b981;
      }

      const podLedGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 16);
      const podLedMat = new THREE.MeshStandardMaterial({
        color: ledColor,
        emissive: ledColor,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.4
      });
      const podLed = new THREE.Mesh(podLedGeo, podLedMat);
      podLed.position.set(pos.x, 0.04, pos.z);
      this.droneGroup.add(podLed);
      this.navLights.push(podLed);

      // Rotating Rotor Assembly
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(pos.x, 0.58, pos.z);

      const b1 = new THREE.Mesh(bladeGeo, propBladeCarbonMat);
      rotorGroup.add(b1);
      const b2 = new THREE.Mesh(bladeGeo, propBladeCarbonMat);
      b2.rotation.y = Math.PI / 2;
      rotorGroup.add(b2);

      // Iconic Safety-Orange Aerodynamic Wingtips
      [-1.06, 1.06].forEach(tipX => {
        const t1 = new THREE.Mesh(tipGeo, safetyOrangeTipMat);
        t1.position.set(tipX, 0.001, 0);
        rotorGroup.add(t1);

        const t2 = new THREE.Mesh(tipGeo, safetyOrangeTipMat);
        t2.position.set(0, 0.001, tipX);
        t2.rotation.y = Math.PI / 2;
        rotorGroup.add(t2);
      });

      // Realistic Dark High-Speed Smoke Motion Blur Disc
      const blurDisc = new THREE.Mesh(blurDiscGeo, propBlurDiscMat);
      rotorGroup.add(blurDisc);

      this.droneGroup.add(rotorGroup);
      this.rotors.push({
        mesh: rotorGroup,
        blurDisc: blurDisc,
        dir: idx % 2 === 0 ? 1 : -1
      });
    });

    // 7. Dual Forward High-Power Warm LED Inspection Searchlights (Recessed Projector Bezels)
    const lightBezelGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.18, 16);
    lightBezelGeo.rotateX(Math.PI / 2);
    const searchlightLensMat = new THREE.MeshStandardMaterial({
      color: 0xfffaed,
      emissive: 0xfff3d6,
      emissiveIntensity: 0.95,
      roughness: 0.12,
      metalness: 0.85
    });

    [-0.55, 0.55].forEach(offset => {
      const bezel = new THREE.Mesh(lightBezelGeo, machinedTitaniumMat);
      bezel.position.set(offset, -0.12, -1.68);
      this.droneGroup.add(bezel);

      const lensGeo = new THREE.SphereGeometry(0.12, 14, 14);
      const lens = new THREE.Mesh(lensGeo, searchlightLensMat);
      lens.position.set(offset, -0.12, -1.74);
      this.droneGroup.add(lens);

      const spot = new THREE.SpotLight(0xfffaed, 3.8, 160, Math.PI / 5, 0.38, 1.2);
      spot.position.set(offset, -0.12, -1.7);
      spot.target.position.set(offset, -8, -50);
      this.droneGroup.add(spot);
      this.droneGroup.add(spot.target);
      this.headlights.push(spot);
    });

    // Scale to balanced, realistic proportions
    this.droneGroup.scale.set(1.35, 1.35, 1.35);
    this.scene.add(this.droneGroup);
  }

  /* ------------------------------------------------------------------------
     Futuristic Cyber Helipad Stations (Platforms & Hologram Gates)
     ------------------------------------------------------------------------ */
  buildCheckpointGates() {
    this.gates = [];

    // Octagonal High-Tech Helipad Base
    const helipadBaseGeo = new THREE.CylinderGeometry(11.5, 12.8, 1.5, 8);
    const helipadBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.92
    });

    // Corner Warning Beacon Pylons
    const pylonGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.8, 6);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const pylonCapGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const pylonCapMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // Counter-Rotating Hologram Rings
    const outerRingGeo = new THREE.TorusGeometry(7.6, 0.42, 12, 48);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15
    });

    const neonRingGeo = new THREE.TorusGeometry(7.48, 0.16, 8, 48);
    const neonRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // Rotating Energy Power Crystal
    const crystalGeo = new THREE.OctahedronGeometry(2.4, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 3.5,
      metalness: 0.85,
      roughness: 0.15,
      wireframe: false
    });

    CHECKPOINTS.forEach((cp) => {
      const splinePt = this.flightCurve.getPoint(cp.splineT);
      const tangent = this.flightCurve.getTangent(cp.splineT);

      const stationGroup = new THREE.Group();
      stationGroup.position.copy(splinePt);

      // Helipad Base Deck
      const baseMesh = new THREE.Mesh(helipadBaseGeo, helipadBaseMat);
      baseMesh.position.y = -6.5;
      baseMesh.receiveShadow = true;
      stationGroup.add(baseMesh);

      // Illuminated Deck Landing Pad "H" Texture
      const padDecal = this.createHelipadDecal(cp.id, cp.subtitle);
      padDecal.position.y = -5.74;
      padDecal.rotation.x = -Math.PI / 2;
      stationGroup.add(padDecal);

      // 8 Warning Beacon Pylons
      for (let p = 0; p < 8; p++) {
        const pylonAngle = (p / 8) * Math.PI * 2;
        const px = Math.cos(pylonAngle) * 11.2;
        const pz = Math.sin(pylonAngle) * 11.2;

        const pylon = new THREE.Mesh(pylonGeo, pylonMat);
        pylon.position.set(px, -5.2, pz);
        stationGroup.add(pylon);

        const cap = new THREE.Mesh(pylonCapGeo, pylonCapMat);
        cap.position.set(px, -3.7, pz);
        stationGroup.add(cap);
      }

      // Vertical Hologram Torus Arch (Positioned neatly above helipad deck)
      const ringGroup = new THREE.Group();
      ringGroup.position.y = 2.2;
      ringGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      ringGroup.add(outerRing);

      const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
      ringGroup.add(neonRing);

      stationGroup.add(ringGroup);

      // Billboard Text Header
      const labelMesh = this.createGateTextSprite(cp.id, cp.title, cp.subtitle);
      labelMesh.position.set(0, 13.8, 0);
      stationGroup.add(labelMesh);

      this.scene.add(stationGroup);

      this.gates.push({
        group: stationGroup,
        neonRing: neonRing,
        crystal: null,
        position: splinePt.clone(),
        data: cp,
        isActive: false,
        takeoffCooldown: 0,
        isSkipped: false
      });
    });
  }

  createHelipadDecal(zoneId, zoneName) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Clean circular helipad deck
    ctx.clearRect(0, 0, 512, 512);
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fillStyle = '#0b1120';
    ctx.fill();

    // Outer cyan perimeter ring
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Inner amber safety ring
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 175, 0, Math.PI * 2);
    ctx.stroke();

    // Central "H" Landing Target
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 150px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 256, 256);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText(`ZONE 0${zoneId}`, 256, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(zoneName.toUpperCase(), 256, 415);

    const texture = new THREE.CanvasTexture(canvas);
    const geo = new THREE.CircleGeometry(10.8, 36);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.88,
      metalness: 0.1,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });

    return new THREE.Mesh(geo, mat);
  }

  createGateTextSprite(id, title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.roundRect(10, 10, 492, 160, 24);
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.roundRect(10, 10, 492, 160, 24);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText(`◆ CHECKPOINT 0${id} ◆`, 256, 52);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title, 256, 100);

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● DOCK TO VIEW • PRESS [E]', 256, 146);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const planeGeo = new THREE.PlaneGeometry(7.6, 2.6);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });

    return new THREE.Mesh(planeGeo, planeMat);
  }

  /* ------------------------------------------------------------------------
     Atmospheric Golden Dust Motes
     ------------------------------------------------------------------------ */
  buildAtmosphericDust() {
    const particleCount = 1800;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1100;
      positions[i + 1] = 20 + Math.random() * 120;
      positions[i + 2] = (Math.random() - 0.5) * 1100;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dCtx = dotCanvas.getContext('2d');
    const radGrad = dCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0, 'rgba(255, 230, 150, 1)');
    radGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    dCtx.fillStyle = radGrad;
    dCtx.beginPath();
    dCtx.arc(32, 32, 32, 0, Math.PI * 2);
    dCtx.fill();

    const dotTex = new THREE.CanvasTexture(dotCanvas);
    const pMat = new THREE.PointsMaterial({
      map: dotTex,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dustParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.dustParticles);
  }

  /* ------------------------------------------------------------------------
     Camera Mode Switching (Chase / Cockpit / Panoramic VIP Tour)
     ------------------------------------------------------------------------ */
  toggleCameraMode() {
    const modes = ['chase', 'cockpit', 'tour'];
    const nextIdx = (modes.indexOf(this.cameraMode) + 1) % modes.length;
    this.cameraMode = modes[nextIdx];

    const camLabel = document.getElementById('cam-label');
    const reticle = document.getElementById('flight-reticle');

    if (this.cameraMode === 'chase') {
      if (camLabel) camLabel.textContent = 'Chase (V)';
      if (reticle) reticle.style.display = 'block';
    } else if (this.cameraMode === 'cockpit') {
      if (camLabel) camLabel.textContent = 'Cockpit FPV (V)';
      if (reticle) reticle.style.display = 'block';
    } else if (this.cameraMode === 'tour') {
      if (camLabel) camLabel.textContent = 'VIP Tour (V)';
      if (reticle) reticle.style.display = 'none';
    }
  }

  /* ------------------------------------------------------------------------
     Input Event Listeners
     ------------------------------------------------------------------------ */
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const key = e.code;

      if (key === 'KeyW' || key === 'ArrowUp') {
        this.keys.forward = true;
        if (this.isPageViewerOpen || this.isLanded) {
          this.continueToNextZone();
        }
      }
      if (key === 'KeyS' || key === 'ArrowDown') {
        this.keys.backward = true;
        if (this.isAutoCruise) this.toggleAutoCruise();
      }
      if (key === 'KeyA' || key === 'ArrowLeft') this.keys.left = true;
      if (key === 'KeyD' || key === 'ArrowRight') this.keys.right = true;
      if (key === 'Space' || key === 'ShiftLeft' || key === 'ShiftRight') {
        this.keys.ascend = true;
        if (this.isPageViewerOpen || this.isLanded) {
          this.continueToNextZone();
        }
      }
      if (key === 'ControlLeft' || key === 'ControlRight') this.keys.descend = true;

      if (key === 'Tab') {
        if (this.approachingGate) {
          e.preventDefault();
          this.skipUpcomingStage(this.approachingGate);
        }
      }

      if (key === 'KeyV') this.toggleCameraMode(); // Switch camera view
      if (key === 'KeyC') this.toggleAutoCruise(); // Auto-Cruise toggle
      if (key === 'KeyQ') this.stepZone(-1);       // Previous Zone
      if (key === 'KeyE') this.handleInteractKey();
      if (key === 'KeyR') this.resetDroneToNearestSpline();
      if (key === 'Escape') {
        if (this.isPageViewerOpen) {
          this.continueToNextZone();
        } else {
          this.closeModals();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.code;
      if (key === 'KeyW' || key === 'ArrowUp') this.keys.forward = false;
      if (key === 'KeyS' || key === 'ArrowDown') this.keys.backward = false;
      if (key === 'KeyA' || key === 'ArrowLeft') this.keys.left = false;
      if (key === 'KeyD' || key === 'ArrowRight') this.keys.right = false;
      if (key === 'Space' || key === 'ShiftLeft' || key === 'ShiftRight') this.keys.ascend = false;
      if (key === 'ControlLeft' || key === 'ControlRight') this.keys.descend = false;
    });

    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => {
        e.preventDefault();
        this.keys[action] = true;
        if (this.isAutoCruise) this.toggleAutoCruise();
        if ((action === 'forward' || action === 'ascend') && this.isLanded) {
          this.takeOff();
        }
      };
      const end = (e) => { e.preventDefault(); this.keys[action] = false; };
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
    };

    bindTouch('btn-t-up', 'forward');
    bindTouch('btn-t-down', 'backward');
    bindTouch('btn-t-left', 'left');
    bindTouch('btn-t-right', 'right');
    bindTouch('btn-t-ascend', 'ascend');
    bindTouch('btn-t-descend', 'descend');

    // Click on 3D canvas while landed takes off and flies forward!
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.addEventListener('click', () => {
        if (this.isLanded && !this.isPageViewerOpen) {
          this.continueToNextZone();
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     UI Setup (Camera, Auto-Cruise, Fast Travel, Audio, Prev/Next)
     ------------------------------------------------------------------------ */
  setupUI() {
    // Camera View Toggle
    const camBtn = document.getElementById('btn-camera-toggle');
    if (camBtn) {
      camBtn.addEventListener('click', () => this.toggleCameraMode());
    }

    // Auto-Cruise Pilot Toggle
    const cruiseBtn = document.getElementById('btn-autocruise');
    if (cruiseBtn) {
      cruiseBtn.addEventListener('click', () => this.toggleAutoCruise());
    }

    // Prev / Next Zone
    const prevBtn = document.getElementById('btn-prev-zone');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.stepZone(-1));
    }
    const nextBtn = document.getElementById('btn-next-zone');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.stepZone(1));
    }

    // Audio Mute Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioLabel = document.getElementById('audio-label');
    audioBtn.addEventListener('click', () => {
      const isOn = flightAudio.toggle();
      audioIcon.textContent = isOn ? '🔊' : '🔇';
      audioLabel.textContent = isOn ? 'Sound ON' : 'Sound OFF';
      audioBtn.classList.toggle('active', isOn);
    });

    // Reset Drone
    document.getElementById('btn-reset-drone').addEventListener('click', () => {
      this.resetDroneToNearestSpline();
    });

    // Fast Travel Modal
    const ftModal = document.getElementById('fast-travel-modal');
    document.getElementById('btn-fast-travel').addEventListener('click', () => {
      ftModal.classList.add('active');
    });
    document.getElementById('btn-ft-close').addEventListener('click', () => {
      ftModal.classList.remove('active');
    });

    const ftGrid = document.getElementById('fast-travel-grid');
    ftGrid.innerHTML = '';
    CHECKPOINTS.forEach((cp) => {
      const card = document.createElement('div');
      card.className = 'ft-card';
      card.innerHTML = `
        <div class="ft-card-top">
          <span class="ft-card-badge">Zone 0${cp.id}</span>
          <span style="font-size: 1.25rem;">${cp.icon}</span>
        </div>
        <div class="ft-card-title">${cp.title}</div>
        <div class="ft-card-desc">${cp.subtitle} • ${cp.desc}</div>
      `;
      card.addEventListener('click', () => {
        this.warpToZone(cp.id);
        ftModal.classList.remove('active');
      });
      ftGrid.appendChild(card);
    });

    // Page Viewer Modal Take Off & Next Zone Buttons
    const modalContinueBtn = document.getElementById('btn-modal-continue');
    if (modalContinueBtn) {
      modalContinueBtn.addEventListener('click', () => {
        this.continueToNextZone();
      });
    }

    const modalFooterContinueBtn = document.getElementById('btn-modal-footer-continue');
    if (modalFooterContinueBtn) {
      modalFooterContinueBtn.addEventListener('click', () => {
        this.continueToNextZone();
      });
    }

    // Page Viewer Modal Close
    const modalCloseBtn = document.getElementById('btn-modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        this.continueToNextZone();
      });
    }

    const modalOverlay = document.getElementById('page-viewer-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.continueToNextZone();
        }
      });
    }

    const modalFullscreenBtn = document.getElementById('btn-modal-fullscreen') || document.getElementById('btn-modal-expand');
    if (modalFullscreenBtn) {
      modalFullscreenBtn.addEventListener('click', () => {
        const box = document.querySelector('.page-viewer-box');
        if (box) {
          if (box.style.width === '98vw') {
            box.style.width = '88vw';
            box.style.height = '85vh';
          } else {
            box.style.width = '98vw';
            box.style.height = '96vh';
          }
        }
      });
    }

    const toastPrompt = document.getElementById('gate-prompt-toast');
    if (toastPrompt) {
      toastPrompt.addEventListener('click', () => {
        if (this.isLanded) {
          this.continueToNextZone();
        } else {
          this.handleInteractKey();
        }
      });
    }

    // Skip Stage Button Click Handler
    const skipBtn = document.getElementById('btn-skip-stage');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.skipUpcomingStage();
      });
    }
  }

  /* ------------------------------------------------------------------------
     Circular Minimap Radar
     ------------------------------------------------------------------------ */
  setupRadarCanvas() {
    this.radarCanvas = document.getElementById('radar-canvas');
    this.radarCtx = this.radarCanvas.getContext('2d');

    document.getElementById('btn-radar-plus').addEventListener('click', () => {
      this.radarZoom = Math.min(2.0, this.radarZoom + 0.25);
    });
    document.getElementById('btn-radar-minus').addEventListener('click', () => {
      this.radarZoom = Math.max(0.5, this.radarZoom - 0.25);
    });

    this.radarCanvas.addEventListener('click', (e) => {
      const rect = this.radarCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const scale = (this.radarCanvas.width / (900 / this.radarZoom));
      const centerX = this.radarCanvas.width / 2;
      const centerY = this.radarCanvas.height / 2;

      CHECKPOINTS.forEach((cp) => {
        const pt = this.flightCurve.getPoint(cp.splineT);
        const mapX = centerX + pt.x * scale;
        const mapY = centerY + pt.z * scale;
        const dist = Math.hypot(clickX - mapX, clickY - mapY);
        if (dist < 12) {
          this.warpToZone(cp.id);
        }
      });
    });
  }

  drawRadar() {
    if (!this.radarCtx) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    const scale = (w / (900 / this.radarZoom));

    // Radar Concentric Range Rings
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.25)';
    ctx.lineWidth = 1;
    [0.3, 0.6, 0.9].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, (w / 2) * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Spline curve track
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const splinePts = this.splineSamplePoints;
    for (let i = 0; i < splinePts.length; i += 8) {
      const pt = splinePts[i];
      const mx = cx + pt.x * scale;
      const my = cy + pt.z * scale;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    ctx.closePath();
    ctx.stroke();

    // Checkpoint blips
    CHECKPOINTS.forEach((cp) => {
      const pt = this.flightCurve.getPoint(cp.splineT);
      const mx = cx + pt.x * scale;
      const my = cy + pt.z * scale;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`0${cp.id}`, mx + 6, my + 3);
    });

    // Drone Blip with heading needle
    const dp = this.dronePhysics;
    const dx = cx + dp.position.x * scale;
    const dy = cy + dp.position.z * scale;

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(dp.yaw);

    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /* ------------------------------------------------------------------------
     Platform Helipad Landing & Docking Handlers
     ------------------------------------------------------------------------ */
  startLanding(gate) {
    if (!gate) return;
    this.landingTargetGate = gate;
    this.activeCheckpoint = gate;
    this.landedCheckpoint = gate;
    this.isLanding = true;
    this.isLanded = false;
    this.isTakingOff = false;
    this.landingTimer = 0;

    // Dismiss approaching banner and skip button
    const banner = document.getElementById('approaching-stage-banner');
    const skipContainer = document.getElementById('skip-stage-container');
    if (banner) banner.classList.remove('active');
    if (skipContainer) skipContainer.classList.remove('active');
    this.approachingGate = null;

    if (this.isAutoCruise) {
      this.isAutoCruise = false;
      const btn = document.getElementById('btn-autocruise');
      const icon = document.getElementById('cruise-icon');
      const label = document.getElementById('cruise-label');
      if (btn) btn.classList.remove('active');
      if (icon) icon.textContent = '▶';
      if (label) label.textContent = 'Auto-Cruise';
    }

    const toast = document.getElementById('gate-prompt-toast');
    if (toast) {
      const toastText = document.getElementById('toast-text');
      if (toastText) toastText.textContent = `Zone 0${gate.data.id} • Docking & Landing on Helipad...`;
      toast.classList.add('active');
    }
  }

  landImmediately(gate) {
    if (!gate) return;
    this.landingTargetGate = gate;
    this.landedCheckpoint = gate;
    this.activeCheckpoint = gate;
    this.isLanding = false;
    this.isLanded = true;
    this.isTakingOff = false;
    this.landingTimer = 0;

    // Dismiss approaching banner and skip button
    const banner = document.getElementById('approaching-stage-banner');
    const skipContainer = document.getElementById('skip-stage-container');
    if (banner) banner.classList.remove('active');
    if (skipContainer) skipContainer.classList.remove('active');
    this.approachingGate = null;

    const tangent = this.flightCurve.getTangent(gate.data.splineT);
    const targetYaw = Math.atan2(-tangent.x, -tangent.z);
    const targetPos = new THREE.Vector3(gate.position.x, gate.position.y - 4.76, gate.position.z);

    this.dronePhysics.position.copy(targetPos);
    this.dronePhysics.velocity.set(0, 0, 0);
    this.dronePhysics.yaw = targetYaw;
    this.dronePhysics.pitch = 0;
    this.dronePhysics.roll = 0;
    this.dronePhysics.yawRate = 0;
    this.dronePhysics.throttle = 0;
    this.dronePhysics.airspeedKmh = 0;

    if (this.droneGroup) {
      this.droneGroup.position.copy(targetPos);
      this.droneGroup.rotation.set(0, 0, 0);
      this.droneGroup.rotateY(targetYaw);
    }

    if (this.isAutoCruise) {
      this.isAutoCruise = false;
      const btn = document.getElementById('btn-autocruise');
      const icon = document.getElementById('cruise-icon');
      const label = document.getElementById('cruise-label');
      if (btn) btn.classList.remove('active');
      if (icon) icon.textContent = '▶';
      if (label) label.textContent = 'Auto-Cruise';
    }

    // Suppress warnings while docked
    const warningOverlay = document.getElementById('corridor-warning-overlay');
    const alertBanner = document.getElementById('corridor-alert-banner');
    if (warningOverlay) warningOverlay.style.opacity = '0';
    if (alertBanner) alertBanner.classList.remove('active');

    const targetLabel = document.getElementById('current-target-name');
    if (targetLabel) {
      targetLabel.textContent = `Zone 0${gate.data.id}: ${gate.data.subtitle}`;
    }

    const toast = document.getElementById('gate-prompt-toast');
    if (toast) {
      const toastText = document.getElementById('toast-text');
      if (toastText) toastText.textContent = `Zone 0${gate.data.id} • ${gate.data.title} [LANDED]`;
      toast.classList.add('active');
    }

    const statusPill = document.getElementById('modal-gate-status');
    if (statusPill) {
      statusPill.textContent = '● LANDED ON HELIPAD';
    }
  }

  takeOff() {
    // Put ALL nearby gates into cooldown so under no circumstances can an immediate re-dock happen
    if (this.gates) {
      this.gates.forEach(g => {
        const d = this.dronePhysics.position.distanceTo(g.position);
        if (d < 50.0) {
          g.takeoffCooldown = 15.0;
        }
      });
    }
    if (this.landedCheckpoint) this.landedCheckpoint.takeoffCooldown = 15.0;
    if (this.activeCheckpoint) this.activeCheckpoint.takeoffCooldown = 15.0;
    if (this.landingTargetGate) this.landingTargetGate.takeoffCooldown = 15.0;
    this.approachingGate = null;

    this.isLanded = false;
    this.isLanding = false;
    this.isTakingOff = true;
    this.takeoffTimer = 0;
    this.landingTimer = 0;

    flightAudio.playBoosterPulse();

    const toast = document.getElementById('gate-prompt-toast');
    if (toast) {
      const toastText = document.getElementById('toast-text');
      if (toastText) toastText.textContent = `🚀 Taking off... Flying to next checkpoint!`;
      setTimeout(() => {
        if (!this.isLanded && !this.isLanding && toast) toast.classList.remove('active');
      }, 2500);
    }
  }

  continueToNextZone() {
    const modal = document.getElementById('page-viewer-modal');
    if (modal) modal.classList.remove('active');
    this.isPageViewerOpen = false;

    this.takeOff();
    this.isAutoCruise = true;
    const btn = document.getElementById('btn-autocruise');
    const icon = document.getElementById('cruise-icon');
    const label = document.getElementById('cruise-label');
    if (btn) btn.classList.add('active');
    if (icon) icon.textContent = '⏸';
    if (label) label.textContent = 'Cruising...';
  }

  /* ------------------------------------------------------------------------
     Stage Approaching Popup & Skip Stage Handlers
     ------------------------------------------------------------------------ */
  skipUpcomingStage(gate) {
    if (!gate) gate = this.approachingGate;
    if (!gate) return;

    gate.isSkipped = true;
    gate.takeoffCooldown = 9.0; // Cooldown to let drone cruise smoothly past
    this.approachingGate = null;

    flightAudio.playBoosterPulse();

    const banner = document.getElementById('approaching-stage-banner');
    const titleEl = document.getElementById('approaching-title');
    const descEl = document.getElementById('approaching-desc');
    const skipContainer = document.getElementById('skip-stage-container');

    if (titleEl) {
      titleEl.innerHTML = `⏩ <span style="color: #f59e0b; font-weight: 800;">Zone 0${gate.data.id} Skipped!</span>`;
    }
    if (descEl) {
      descEl.textContent = 'Continuing flight forward along track without landing';
    }
    if (skipContainer) {
      skipContainer.classList.remove('active');
    }

    setTimeout(() => {
      if (banner && !this.approachingGate) {
        banner.classList.remove('active');
      }
    }, 2200);
  }

  updateApproachingUI(gate, dist) {
    const banner = document.getElementById('approaching-stage-banner');
    const skipContainer = document.getElementById('skip-stage-container');
    if (!banner || !skipContainer) return;

    if (gate && !this.isLanded && !this.isLanding && !this.isTakingOff && !this.isPageViewerOpen) {
      this.approachingGate = gate;

      const titleEl = document.getElementById('approaching-title');
      const descEl = document.getElementById('approaching-desc');
      const distEl = document.getElementById('approaching-dist');
      const iconEl = document.getElementById('approaching-icon');
      const skipZoneEl = document.getElementById('skip-stage-name');

      if (titleEl) titleEl.textContent = `Zone 0${gate.data.id}: ${gate.data.title} (${gate.data.subtitle})`;
      if (descEl) descEl.textContent = 'Landing platform in range • Press TAB or click Skip';
      if (distEl) distEl.textContent = `${Math.round(dist)}M`;
      if (iconEl) iconEl.textContent = gate.data.icon || '⚡';
      if (skipZoneEl) skipZoneEl.textContent = `Zone 0${gate.data.id}`;

      banner.classList.add('active');
      skipContainer.classList.add('active');
    } else {
      if (!this.approachingGate || !gate) {
        this.approachingGate = null;
        banner.classList.remove('active');
        skipContainer.classList.remove('active');
      }
    }
  }

  /* ------------------------------------------------------------------------
     Auto-Cruise Pilot & Navigation Helpers
     ------------------------------------------------------------------------ */
  toggleAutoCruise() {
    if (this.isLanded) {
      this.takeOff();
      this.isAutoCruise = true;
      const btn = document.getElementById('btn-autocruise');
      const icon = document.getElementById('cruise-icon');
      const label = document.getElementById('cruise-label');
      if (btn) btn.classList.add('active');
      if (icon) icon.textContent = '⏸';
      if (label) label.textContent = 'Cruising...';
      return;
    }

    this.isAutoCruise = !this.isAutoCruise;
    const btn = document.getElementById('btn-autocruise');
    const icon = document.getElementById('cruise-icon');
    const label = document.getElementById('cruise-label');

    if (this.isAutoCruise) {
      btn.classList.add('active');
      icon.textContent = '⏸';
      label.textContent = 'Cruising...';
      flightAudio.playBoosterPulse();
    } else {
      btn.classList.remove('active');
      icon.textContent = '▶';
      label.textContent = 'Auto-Cruise';
    }
  }

  stepZone(direction) {
    this.currentZoneIndex = (this.currentZoneIndex + direction + CHECKPOINTS.length) % CHECKPOINTS.length;
    const targetCp = CHECKPOINTS[this.currentZoneIndex];
    this.warpToZone(targetCp.id);
  }

  warpToZone(zoneId) {
    const cp = CHECKPOINTS.find(c => c.id === zoneId);
    if (!cp) return;

    this.currentZoneIndex = CHECKPOINTS.indexOf(cp);
    const gate = this.gates ? this.gates.find(g => g.data.id === cp.id) : null;
    if (gate) {
      this.landImmediately(gate);
    }
    this.openPageViewer(cp);
  }

  resetDroneToNearestSpline() {
    this.isLanded = false;
    this.isLanding = false;
    this.isTakingOff = false;
    if (this.isPageViewerOpen) this.closePageViewer();

    const nearest = this.findNearestSplinePoint(this.dronePhysics.position);
    this.dronePhysics.position.copy(nearest.point).add(new THREE.Vector3(0, 2.5, 0));
    this.dronePhysics.velocity.set(0, 0, 0);

    const targetYaw = Math.atan2(-nearest.tangent.x, -nearest.tangent.z);
    this.dronePhysics.yaw = targetYaw;
    this.dronePhysics.pitch = 0;
    this.dronePhysics.roll = 0;
  }

  findNearestSplinePoint(pos) {
    let minDist = Infinity;
    let bestIdx = 0;
    const count = this.splineSamplePoints.length;

    // Coarse search (stride 4)
    for (let i = 0; i < count; i += 4) {
      const dist = pos.distanceTo(this.splineSamplePoints[i]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = i;
      }
    }

    // Fine refinement around bestIdx (+-3) for sub-meter accuracy
    const startIdx = Math.max(0, bestIdx - 3);
    const endIdx = Math.min(count - 1, bestIdx + 3);
    for (let i = startIdx; i <= endIdx; i++) {
      const dist = pos.distanceTo(this.splineSamplePoints[i]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = i;
      }
    }

    const bestPoint = this.splineSamplePoints[bestIdx];
    const bestT = bestIdx / count;

    return {
      point: bestPoint,
      t: bestT,
      tangent: this.flightCurve.getTangent(bestT),
      dist: minDist
    };
  }

  /* ------------------------------------------------------------------------
     6-DoF Quadcopter Physics & Smooth Flight Dynamics
     ------------------------------------------------------------------------ */
  updateDronePhysics(delta) {
    const p = this.dronePhysics;
    let nearestSpline = this.findNearestSplinePoint(p.position);
    this.corridorDistance = nearestSpline.dist;

    // 1. Helipad Landed State (Stationary, Safe Idle Rotors)
    if (this.isLanded) {
      if (this.landedCheckpoint) {
        const gate = this.landedCheckpoint;
        const tangent = this.flightCurve.getTangent(gate.data.splineT);
        const targetYaw = Math.atan2(-tangent.x, -tangent.z);
        p.position.set(gate.position.x, gate.position.y - 4.76, gate.position.z);
        p.yaw = targetYaw;
      }
      p.velocity.set(0, 0, 0);
      p.pitch = 0;
      p.roll = 0;
      p.yawRate = 0;
      p.throttle = 0;
      p.airspeedKmh = 0;

      // Update Drone 3D Group
      this.droneGroup.position.copy(p.position);
      this.droneGroup.rotation.set(0, 0, 0);
      this.droneGroup.rotateY(p.yaw);

      // Gentle rotor idle spin
      const idleSpeed = 8.0;
      this.rotors.forEach(r => {
        r.mesh.rotation.y += idleSpeed * delta * r.dir;
        r.blurDisc.material.opacity = 0.04;
      });   

      if (this.gyroRing) this.gyroRing.rotation.z += delta * 0.4;
      this.thrusterParticles.forEach(cone => {
        cone.scale.set(0.1, 0.1, 0.1);
      });

      const warningOverlay = document.getElementById('corridor-warning-overlay');
      const alertBanner = document.getElementById('corridor-alert-banner');
      if (warningOverlay) warningOverlay.style.opacity = '0';
      if (alertBanner) alertBanner.classList.remove('active');

      flightAudio.update(0.0, 0);
      return;
    }

    // 2. Landing Descent Animation (Smooth Guidance onto Helipad Surface)
    if (this.isLanding && this.landingTargetGate) {
      const gate = this.landingTargetGate;
      this.landingTimer = (this.landingTimer || 0) + delta;

      const tangent = this.flightCurve.getTangent(gate.data.splineT);
      const targetYaw = Math.atan2(-tangent.x, -tangent.z);
      const targetPos = new THREE.Vector3(gate.position.x, gate.position.y - 4.76, gate.position.z);

      // Interpolate towards helipad center and touchdown elevation
      p.position.x = THREE.MathUtils.lerp(p.position.x, targetPos.x, delta * 4.2);
      p.position.z = THREE.MathUtils.lerp(p.position.z, targetPos.z, delta * 4.2);
      p.position.y = THREE.MathUtils.lerp(p.position.y, targetPos.y, delta * 3.8);

      p.velocity.multiplyScalar(Math.max(0, 1 - delta * 4.8));
      p.pitch = THREE.MathUtils.lerp(p.pitch, 0, delta * 5.0);
      p.roll = THREE.MathUtils.lerp(p.roll, 0, delta * 5.0);

      let yawDiff = targetYaw - p.yaw;
      while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      p.yaw += yawDiff * delta * 4.8;

      p.throttle = THREE.MathUtils.lerp(p.throttle, 0.1, delta * 3.5);
      p.airspeedKmh = Math.round(p.velocity.length() * 3.6);

      this.droneGroup.position.copy(p.position);
      this.droneGroup.rotation.set(0, 0, 0);
      this.droneGroup.rotateY(p.yaw);
      this.droneGroup.rotateX(p.pitch);
      this.droneGroup.rotateZ(p.roll);

      const rotorSpeed = 22.0;
      this.rotors.forEach(r => {
        r.mesh.rotation.y += rotorSpeed * delta * r.dir;
        r.blurDisc.material.opacity = 0.14;
      });

      const warningOverlay = document.getElementById('corridor-warning-overlay');
      const alertBanner = document.getElementById('corridor-alert-banner');
      if (warningOverlay) warningOverlay.style.opacity = '0';
      if (alertBanner) alertBanner.classList.remove('active');

      const distToPad = p.position.distanceTo(targetPos);
      if (distToPad < 1.0 || this.landingTimer > 1.4) {
        this.landImmediately(gate);
        if (!this.isPageViewerOpen) {
          this.openPageViewer(gate.data);
        }
      }
      return;
    }

    // 3. Takeoff Climb (Liftoff from Helipad up into Flight Track)
    if (this.isTakingOff) {
      this.takeoffTimer = (this.takeoffTimer || 0) + delta;

      const targetTakeoffY = nearestSpline.point.y + 2.2;
      const trackForwardDir = this.flightCurve.getTangent(nearestSpline.t).normalize();
      trackForwardDir.y = 0;
      trackForwardDir.normalize();
      const trackForwardYaw = Math.atan2(-trackForwardDir.x, -trackForwardDir.z);

      // Smoothly rotate yaw toward track forward direction
      let yawDiff = trackForwardYaw - p.yaw;
      while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      p.yaw += yawDiff * delta * 5.0;

      // Climb towards flight altitude and accelerate forward along track
      p.position.y = THREE.MathUtils.lerp(p.position.y, targetTakeoffY, delta * 4.2);
      const forwardVec = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
      p.velocity.lerp(forwardVec.multiplyScalar(36.0), delta * 4.0);
      p.pitch = THREE.MathUtils.lerp(p.pitch, 0.08, delta * 3.5);
      p.roll = THREE.MathUtils.lerp(p.roll, 0, delta * 4.0);
      p.throttle = 1.0;
      p.position.addScaledVector(p.velocity, delta);
      p.airspeedKmh = Math.round(p.velocity.length() * 3.6);

      this.droneGroup.position.copy(p.position);
      this.droneGroup.rotation.set(0, 0, 0);
      this.droneGroup.rotateY(p.yaw);
      this.droneGroup.rotateX(p.pitch);
      this.droneGroup.rotateZ(p.roll);

      const rotorSpeed = 85.0;
      this.rotors.forEach(r => {
        r.mesh.rotation.y += rotorSpeed * delta * r.dir;
        r.blurDisc.material.opacity = 0.6;
      });

      // Exit takeoff ONLY after full 1.2s liftoff climb has elapsed to ensure smooth transition
      if (this.takeoffTimer >= 1.2) {
        this.isTakingOff = false;
        this.takeoffTimer = 0;
        this.currentForwardSpeed = p.velocity.length();
      }

      flightAudio.update(Math.abs(p.throttle), p.airspeedKmh);
      return;
    }

    // Nearest spline point and forward track heading
    nearestSpline = this.findNearestSplinePoint(p.position);
    this.corridorDistance = nearestSpline.dist;

    // Track forward heading derived directly from spline tangent (100% mathematically aligned with the blue neon tube!)
    const trackForwardDir = this.flightCurve.getTangent(nearestSpline.t).normalize();
    trackForwardDir.y = 0;
    trackForwardDir.normalize();
    const trackForwardYaw = Math.atan2(-trackForwardDir.x, -trackForwardDir.z);

    // Calculate right vector relative to forward track heading
    const rightDir = new THREE.Vector3(-trackForwardDir.z, 0, trackForwardDir.x);

    let targetForwardSpeed = 0.0;

    if (this.isAutoCruise) {
      // 1. Autonomous Guided Flight along Spline Corridor
      targetForwardSpeed = 42.0;
      let yawDiff = trackForwardYaw - p.yaw;
      while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      p.yaw += yawDiff * delta * 5.0;

      p.targetPitch = 0.08;
      p.targetRoll = -yawDiff * 0.95;
      p.throttle = 0.85;

      this.pilotLateralOffset = THREE.MathUtils.lerp(this.pilotLateralOffset || 0, 0, delta * 3.5);

    } else {
      // 2. One-Way Track-Guided Pilot Flight (Bank left/right within corridor, never reverse)
      const MAX_BANK_STEER = 0.35;
      const MAX_LATERAL_OFFSET = 3.2; // Maximum meters pilot can steer away from centerline

      if (this.keys.left) {
        this.pilotSteerAngle = THREE.MathUtils.lerp(this.pilotSteerAngle || 0, MAX_BANK_STEER, delta * 4.5);
        this.pilotLateralOffset = THREE.MathUtils.lerp(this.pilotLateralOffset || 0, -MAX_LATERAL_OFFSET, delta * 3.5);
        p.targetRoll = 0.32;
      } else if (this.keys.right) {
        this.pilotSteerAngle = THREE.MathUtils.lerp(this.pilotSteerAngle || 0, -MAX_BANK_STEER, delta * 4.5);
        this.pilotLateralOffset = THREE.MathUtils.lerp(this.pilotLateralOffset || 0, MAX_LATERAL_OFFSET, delta * 3.5);
        p.targetRoll = -0.32;
      } else {
        this.pilotSteerAngle = THREE.MathUtils.lerp(this.pilotSteerAngle || 0, 0, delta * 5.0);
        this.pilotLateralOffset = THREE.MathUtils.lerp(this.pilotLateralOffset || 0, 0, delta * 3.5);
        p.targetRoll = 0;
      }

      const desiredYaw = trackForwardYaw + (this.pilotSteerAngle || 0);
      let yawDiff = desiredYaw - p.yaw;
      while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      p.yaw += yawDiff * delta * 5.0;

      if (this.keys.forward) {
        // Holding forward: fly smoothly forward along track
        targetForwardSpeed = 46.0;
        p.targetPitch = 0.10;
        p.throttle = 0.95;
      } else if (this.keys.backward) {
        // Active air brake: rapid hover halt
        targetForwardSpeed = 0.0;
        p.targetPitch = -0.06;
        p.throttle = 0.20;
      } else {
        // Hands off controls: Hover stationary in place! No automatic drift!
        targetForwardSpeed = 0.0;
        p.targetPitch = 0.0;
        p.throttle = 0.30;
      }

      // Vertical altitude control
      if (this.keys.ascend) {
        this.pilotAltOffset = Math.min(5.5, (this.pilotAltOffset || 0) + delta * 6.0);
      } else if (this.keys.descend) {
        this.pilotAltOffset = Math.max(-1.5, (this.pilotAltOffset || 0) - delta * 6.0);
      } else {
        this.pilotAltOffset = THREE.MathUtils.lerp(this.pilotAltOffset || 0, 0, delta * 2.5);
      }
    }

    // Smooth acceleration & deceleration (Hands-off smoothly glides to complete hover halt)
    const accelRate = targetForwardSpeed > (this.currentForwardSpeed || 0) ? 3.2 : 5.2;
    this.currentForwardSpeed = THREE.MathUtils.lerp(this.currentForwardSpeed || 0, targetForwardSpeed, delta * accelRate);
    if (this.currentForwardSpeed < 0.20 && targetForwardSpeed === 0) {
      this.currentForwardSpeed = 0;
    }

    // Pure orthogonal lateral alignment relative to forward track heading (Zero backward drag!)
    const toDroneX = p.position.x - nearestSpline.point.x;
    const toDroneZ = p.position.z - nearestSpline.point.z;
    const currentLateralOffset = toDroneX * rightDir.x + toDroneZ * rightDir.z;
    const targetLateralOffset = this.pilotLateralOffset || 0;
    const lateralCorrectionDist = (targetLateralOffset - currentLateralOffset) * Math.min(1.0, delta * 6.5);

    // Forward progress only when speed > 0 + lateral centerline tracking
    p.position.x += trackForwardDir.x * this.currentForwardSpeed * delta + rightDir.x * lateralCorrectionDist;
    p.position.z += trackForwardDir.z * this.currentForwardSpeed * delta + rightDir.z * lateralCorrectionDist;

    const targetAltitude = nearestSpline.point.y + 2.2 + (this.pilotAltOffset || 0);
    p.position.y += (targetAltitude - p.position.y) * delta * 4.5;

    p.velocity.set(
      trackForwardDir.x * this.currentForwardSpeed + rightDir.x * (lateralCorrectionDist / delta),
      (targetAltitude - p.position.y) * 4.5,
      trackForwardDir.z * this.currentForwardSpeed + rightDir.z * (lateralCorrectionDist / delta)
    );
    p.airspeedKmh = Math.round(this.currentForwardSpeed * 3.6);

    p.pitch = THREE.MathUtils.lerp(p.pitch, p.targetPitch, delta * 4.5);
    p.roll = THREE.MathUtils.lerp(p.roll, p.targetRoll, delta * 4.5);

    // Corridor Boundaries check
    this.isNearCorridorEdge = this.corridorDistance > this.CORRIDOR_WARN_RADIUS;
    const warningOverlay = document.getElementById('corridor-warning-overlay');
    const alertBanner = document.getElementById('corridor-alert-banner');

    if (this.isNearCorridorEdge) {
      const alpha = Math.min(0.85, (this.corridorDistance - this.CORRIDOR_WARN_RADIUS) / 3.5);
      warningOverlay.style.opacity = alpha.toString();
      alertBanner.classList.add('active');
    } else {
      warningOverlay.style.opacity = '0';
      alertBanner.classList.remove('active');
    }

    // Update Drone 3D Group
    this.droneGroup.position.copy(p.position);
    this.droneGroup.rotation.set(0, 0, 0);
    this.droneGroup.rotateY(p.yaw);
    this.droneGroup.rotateX(p.pitch);
    this.droneGroup.rotateZ(p.roll);

    // Rotors Animation
    const rotorSpeed = 30.0 + Math.abs(p.throttle) * 75.0;
    const blurAlpha = 0.25 + Math.min(0.55, Math.abs(p.throttle) * 0.65);

    this.rotors.forEach(r => {
      r.mesh.rotation.y += rotorSpeed * delta * r.dir;
      r.blurDisc.material.opacity = blurAlpha;
    });

    if (this.gyroRing) {
      this.gyroRing.rotation.z += delta * 1.8;
    }

    const thrusterScale = 0.85 + Math.abs(p.throttle) * 0.8;
    this.thrusterParticles.forEach(cone => {
      cone.scale.set(1, 1, thrusterScale);
    });

    flightAudio.update(Math.abs(p.throttle), p.airspeedKmh);
  }

  /* ------------------------------------------------------------------------
     Multi-Mode Camera (Chase / Cockpit FPV / Panoramic VIP Tour)
     ------------------------------------------------------------------------ */
  updateChaseCamera(delta) {
    const p = this.dronePhysics;

    if (this.cameraMode === 'cockpit') {
      // 1. First-Person Cockpit FPV Nose Camera
      const forwardDir = new THREE.Vector3(-Math.sin(p.yaw), -p.pitch * 0.8, -Math.cos(p.yaw)).normalize();
      const nosePos = p.position.clone()
        .add(forwardDir.clone().multiplyScalar(2.0))
        .add(new THREE.Vector3(0, 0.45, 0));
      const lookAtPos = nosePos.clone().add(forwardDir.clone().multiplyScalar(40.0));

      this.cameraPos.lerp(nosePos, delta * 14.0);
      this.cameraLookAt.lerp(lookAtPos, delta * 14.0);
      this.camera.position.copy(this.cameraPos);
      this.camera.lookAt(this.cameraLookAt);

      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 74.0, delta * 3.0);
      this.camera.updateProjectionMatrix();
      return;
    }

    if (this.cameraMode === 'tour') {
      // 2. Cinematic Panoramic VIP Tour Camera (Slow Majestic Orbital Drift)
      this.tourAngle = (this.tourAngle || 0) + delta * 0.22;
      const tourDist = 26.0;
      const tourHeight = 8.5;
      const tourPos = new THREE.Vector3(
        p.position.x + Math.sin(this.tourAngle + p.yaw) * tourDist,
        p.position.y + tourHeight,
        p.position.z + Math.cos(this.tourAngle + p.yaw) * tourDist
      );
      const targetLookAt = p.position.clone().add(new THREE.Vector3(0, 1.2, 0));

      this.cameraPos.lerp(tourPos, delta * 2.8);
      this.cameraLookAt.lerp(targetLookAt, delta * 4.2);
      this.camera.position.copy(this.cameraPos);
      this.camera.lookAt(this.cameraLookAt);

      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 58.0, delta * 2.0);
      this.camera.updateProjectionMatrix();
      return;
    }

    // 3. Default: Stabilized Third-Person Chase Camera (Cinematic Hero Drone Framing)
    const chaseDistance = 11.2 + (p.airspeedKmh / 95.0) * 3.6;
    const chaseHeight = 3.6 - p.pitch * 2.8;

    const backVector = new THREE.Vector3(
      Math.sin(p.yaw) * chaseDistance,
      chaseHeight,
      Math.cos(p.yaw) * chaseDistance
    );
    const targetCamPos = p.position.clone().add(backVector);

    const lookAheadVector = new THREE.Vector3(
      -Math.sin(p.yaw) * 12.0,
      0.9,
      -Math.cos(p.yaw) * 12.0
    );
    const targetLookAt = p.position.clone().add(lookAheadVector);

    this.cameraPos.lerp(targetCamPos, delta * 4.6);
    this.cameraLookAt.lerp(targetLookAt, delta * 5.8);

    this.camera.position.copy(this.cameraPos);
    this.camera.lookAt(this.cameraLookAt);

    const targetFOV = 60.0 + (p.airspeedKmh / 75.0) * 9.0;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, delta * 2.5);
    this.camera.updateProjectionMatrix();
  }

  /* ------------------------------------------------------------------------
     100% Reliable Checkpoints Detection & Helipad Animations
     ------------------------------------------------------------------------ */
  updateCheckpoints(delta) {
    let nearestGate = null;
    let minGateDist = Infinity;
    let upcomingApproachingGate = null;
    let upcomingApproachingDist = Infinity;

    const APPROACH_TRIGGER_DIST = 55.0;
    const INSIDE_GATE_DIST = 16.5;

    this.gates.forEach(gate => {
      if (gate.takeoffCooldown && gate.takeoffCooldown > 0) {
        gate.takeoffCooldown -= delta;
      }

      gate.neonRing.rotation.z += delta * 1.8;
      if (gate.crystal) {
        gate.crystal.rotation.y += delta * 2.2;
        gate.crystal.rotation.x += delta * 1.2;
      }

      const dist = this.dronePhysics.position.distanceTo(gate.position);
      if (dist < minGateDist) {
        minGateDist = dist;
        nearestGate = gate;
      }

      // Check if this gate is approaching ahead of the drone
      const canApproach = !gate.isSkipped &&
                          (!gate.takeoffCooldown || gate.takeoffCooldown <= 0) &&
                          !this.isLanded &&
                          !this.isLanding &&
                          !this.isTakingOff &&
                          !this.isPageViewerOpen;

      if (canApproach && dist < APPROACH_TRIGGER_DIST && dist >= INSIDE_GATE_DIST) {
        const toGate = gate.position.clone().sub(this.dronePhysics.position);
        const forwardVec = new THREE.Vector3(-Math.sin(this.dronePhysics.yaw), 0, -Math.cos(this.dronePhysics.yaw));
        if (forwardVec.dot(toGate) > -2.0) {
          if (dist < upcomingApproachingDist) {
            upcomingApproachingDist = dist;
            upcomingApproachingGate = gate;
          }
        }
      }

      // Once drone has flown past a skipped checkpoint (dist > 35m), reset isSkipped
      if (gate.isSkipped && dist > 35.0) {
        gate.isSkipped = false;
      }

      if (dist > 25.0) {
        gate.isActive = false;
      }
    });

    // Update Top Approaching Banner & Bottom Skip Button
    this.updateApproachingUI(upcomingApproachingGate, upcomingApproachingDist);

    if (nearestGate) {
      const targetLabel = document.getElementById('current-target-name');
      if (targetLabel && !this.isLanded) {
        targetLabel.textContent = `Zone 0${nearestGate.data.id}: ${nearestGate.data.subtitle}`;
      }

      if (minGateDist < INSIDE_GATE_DIST) {
        this.activeCheckpoint = nearestGate;

        // If stage was skipped or in takeoff cooldown, do NOT land! Let drone fly freely through along single track
        if (nearestGate.isSkipped || (nearestGate.takeoffCooldown && nearestGate.takeoffCooldown > 0)) {
          return;
        }

        const canLand = !this.isLanded &&
                        !this.isLanding &&
                        !this.isTakingOff;

        if (canLand) {
          nearestGate.isActive = true;
          this.startLanding(nearestGate);
        }
      } else if (minGateDist > 22.0) {
        if (this.activeCheckpoint === nearestGate && !this.isLanded && !this.isLanding) {
          if (this.isPageViewerOpen) {
            this.closePageViewer();
          }
          this.activeCheckpoint = null;
          const toast = document.getElementById('gate-prompt-toast');
          if (toast) toast.classList.remove('active');
        }
      }
    }
  }

  /* ------------------------------------------------------------------------
     Modal Handlers
     ------------------------------------------------------------------------ */
  openPageViewer(cpData) {
    const modal = document.getElementById('page-viewer-modal');
    const iframe = document.getElementById('page-viewer-frame');
    const title = document.getElementById('modal-page-title');

    title.textContent = `Zone 0${cpData.id}: ${cpData.title} (${cpData.subtitle})`;
    if (!iframe.src.endsWith(cpData.page)) {
      iframe.src = cpData.page;
    }

    // Dynamic button label for next zone
    const nextZoneId = (cpData.id % CHECKPOINTS.length) + 1;
    const nextCp = CHECKPOINTS.find(c => c.id === nextZoneId);
    const continueBtn = document.getElementById('btn-modal-continue');
    const continueFooterBtn = document.getElementById('btn-modal-footer-continue');
    const nextLabel = nextCp ? `Zone 0${nextCp.id}: ${nextCp.subtitle}` : `Zone 0${nextZoneId}`;
    if (continueBtn) {
      continueBtn.innerHTML = `<span>🚀 Next Zone (${nextLabel}) ▶</span>`;
    }
    if (continueFooterBtn) {
      continueFooterBtn.innerHTML = `<span>🚀 Take Off & Fly Forward to ${nextLabel} ▶</span>`;
    }

    // Forward key events from inside iframe so keys are never captured/swallowed!
    const attachIframeKeys = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.addEventListener('keydown', (e) => {
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);
            
            // If typing in contact form fields, allow normal typing (ignore W, E, Space)
            if (isInput) {
              if (e.code === 'Escape') {
                e.preventDefault();
                this.continueToNextZone();
              }
              return;
            }

            if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'KeyE' || e.code === 'Space' || e.code === 'Escape') {
              e.preventDefault();
              this.continueToNextZone();
            }
          });
        }
      } catch (err) {}
    };

    attachIframeKeys();
    iframe.onload = attachIframeKeys;

    modal.classList.add('active');
    this.isPageViewerOpen = true;

    // Land drone on the platform for this page
    const gate = this.gates ? this.gates.find(g => g.data.id === cpData.id) : null;
    if (gate && !this.isLanded) {
      this.landImmediately(gate);
    }

    flightAudio.playGateChime();
  }

  closePageViewer() {
    const modal = document.getElementById('page-viewer-modal');
    modal.classList.remove('active');
    this.isPageViewerOpen = false;

    // When closing page viewer, automatically take off and fly forward!
    if (this.isLanded || this.isLanding) {
      this.continueToNextZone();
    }
  }

  closeModals() {
    this.closePageViewer();
    document.getElementById('fast-travel-modal').classList.remove('active');
  }

  handleInteractKey() {
    if (this.isPageViewerOpen || this.isLanded) {
      this.continueToNextZone();
    } else if (this.activeCheckpoint) {
      this.openPageViewer(this.activeCheckpoint.data);
    } else {
      let nearestGate = null;
      let minDist = Infinity;
      this.gates.forEach(g => {
        const d = this.dronePhysics.position.distanceTo(g.position);
        if (d < minDist) { minDist = d; nearestGate = g; }
      });
      if (nearestGate && minDist < 24.0) {
        this.openPageViewer(nearestGate.data);
      }
    }
  }

  /* ------------------------------------------------------------------------
     HUD Instruments & Artificial Horizon
     ------------------------------------------------------------------------ */
  updateHUD() {
    const p = this.dronePhysics;

    document.getElementById('hud-airspeed').textContent = p.airspeedKmh;
    document.getElementById('hud-altitude').textContent = Math.round(p.position.y);
    document.getElementById('corridor-dist-label').textContent = `OFFSET: ${this.corridorDistance.toFixed(1)}M`;

    const horizonDisc = document.getElementById('horizon-disc');
    if (horizonDisc) {
      const pitchOffset = p.pitch * 75;
      const rollDeg = (p.roll * 180) / Math.PI;
      horizonDisc.style.transform = `translateY(${pitchOffset}px) rotate(${rollDeg}deg)`;
    }
  }
/* ------------------------------------------------------------------------
     Render Loop (60 FPS Butter Smooth)
     ------------------------------------------------------------------------ */
  
  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.04);

    this.updateDronePhysics(delta);
    this.updateChaseCamera(delta);
    this.updateCheckpoints(delta);
    this.updateHUD();
    this.drawRadar();

    // Animate Canyon River Wave Ripples
    if (this.waterTexture) {
      this.waterTexture.offset.x += delta * 0.035;
      this.waterTexture.offset.y += delta * 0.018;
    }

    // Drift Volumetric Sunset Clouds across the Sky
    if (this.cloudGroup) {
      this.cloudGroup.position.x += delta * 1.5;
      if (this.cloudGroup.position.x > 800) {
        this.cloudGroup.position.x = -800;
      }
    }

    if (this.dustParticles) {
      this.dustParticles.rotation.y += delta * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Launch application on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.droneApp = new DroneSimulationApp();
});
