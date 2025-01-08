<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;

  // Types for the component props
  interface HeroProps {
    name: string;
    title: string;
    description: string;
  }

  // Component props with defaults
  export let name: HeroProps['name'] = "John Doe";
  export let title: HeroProps['title'] = "Full Stack Developer";
  export let description: HeroProps['description'] = "I create beautiful and functional web experiences";

  // Animation timeline
  let tl: gsap.core.Timeline;

  onMount(() => {
    // Initialize Three.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: 0xffffff,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particles.geometry.attributes.position.array.forEach((value, index, array) => {
        if (index % 3 === 2) {
          array[index] -= 0.01;
          if (array[index] < -10) array[index] = 10;
        }
      });
      particles.geometry.attributes.position.needsUpdate = true;
      
      camera.position.z -= 0.005;
      if (camera.position.z < -10) camera.position.z = 10;

      renderer.render(scene, camera);
    };

    animate();

    // Initialize GSAP timeline
    tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate geometric shapes
    tl.from(".geometric-shape", {
      scale: 0,
      rotation: -45,
      opacity: 0,
      duration: 1,
      stagger: 0.2
    })
    .from(".hero-content > *", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.5");

    // Animate floating shapes
    gsap.to(".floating", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });
  });
</script>

<section class="hero">
  <canvas bind:this={canvas} class="particle-tunnel"></canvas>
  <div class="geometric-background">
    <!-- Geometric shapes -->
    <svg class="geometric-shape floating" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" class="shape-primary" />
    </svg>
    <svg class="geometric-shape floating" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="60" class="shape-secondary" />
    </svg>
    <svg class="geometric-shape floating" viewBox="0 0 100 100">
      <polygon points="50,20 80,80 20,80" class="shape-accent" />
    </svg>
    <!-- Add more shapes as needed -->
  </div>

  <div class="hero-content">
    <h1>{name}</h1>
    <h2>{title}</h2>
    <p>{description}</p>
    <div class="cta-buttons">
      <button class="primary">View Projects</button>
      <button class="secondary">Contact Me</button>
    </div>
  </div>
</section>

<style>
  .particle-tunnel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--color-background);
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .geometric-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .geometric-shape {
    position: absolute;
    width: 200px;
    height: 200px;
  }

  .geometric-shape:nth-child(1) {
    top: 10%;
    left: 10%;
  }

  .geometric-shape:nth-child(2) {
    top: 60%;
    right: 15%;
  }

  .geometric-shape:nth-child(3) {
    bottom: 20%;
    left: 20%;
  }

  .shape-primary {
    fill: var(--color-primary);
    opacity: 0.1;
  }

  .shape-secondary {
    fill: var(--color-secondary);
    opacity: 0.1;
  }

  .shape-accent {
    fill: var(--color-accent);
    opacity: 0.1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    padding: var(--spacing-xl);
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: var(--color-secondary);
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
    line-height: 1.6;
    max-width: 600px;
    margin-inline: auto;
  }

  .cta-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  button {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: 30px;
    font-weight: 600;
    transition: transform 0.2s ease;
    cursor: pointer;
  }

  button:hover {
    transform: translateY(-2px);
  }

  button.primary {
    background: var(--color-primary);
    color: white;
    border: none;
  }

  button.secondary {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  @media (max-width: 768px) {
    .geometric-shape {
      width: 150px;
      height: 150px;
    }

    .hero-content {
      padding: var(--spacing-lg);
    }

    .cta-buttons {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style> 