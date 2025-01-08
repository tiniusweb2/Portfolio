<script lang="ts">
  // Props
  export let name: string = "John Doe";
  export let title: string = "Full Stack Developer";
  export let description: string = "I create beautiful and functional web experiences";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationFrame: number;
  let time = 0;

  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
  }

  function drawTunnel() {
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRadius = Math.max(rect.width, rect.height);
    const gridDensity = 30;
    const perspectiveScale = 0.15;

    // Draw perspective grid
    for (let i = 0; i < gridDensity; i++) {
      const progress = ((time + i * perspectiveScale) % 1);
      const scale = Math.exp(progress * 2);
      const opacity = Math.max(0, 0.4 * (1 - progress));

      // Draw concentric squares for grid effect
      const size = scale * 40;
      ctx.beginPath();
      ctx.rect(centerX - size, centerY - size, size * 2, size * 2);
      ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw diagonal lines
      for (let j = 0; j < 4; j++) {
        const angle = (j / 4) * Math.PI * 2 + Math.PI / 4;
        const x1 = centerX + Math.cos(angle) * size;
        const y1 = centerY + Math.sin(angle) * size;
        const x2 = centerX + Math.cos(angle + Math.PI) * size;
        const y2 = centerY + Math.sin(angle + Math.PI) * size;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw radial lines with perspective
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const gradient = ctx.createLinearGradient(
        centerX + Math.cos(angle) * 40,
        centerY + Math.sin(angle) * 40,
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      );
      
      gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * 40,
        centerY + Math.sin(angle) * 40
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    time += 0.002;
    animationFrame = requestAnimationFrame(drawTunnel);
  }

  function handleResize() {
    if (canvas && ctx) {
      setupCanvas();
    }
  }

  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    setupCanvas();
    drawTunnel();
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    window.removeEventListener('resize', handleResize);
  });
</script>

<section class="hero">
  <canvas bind:this={canvas} class="tunnel-animation"></canvas>
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
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: white;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .tunnel-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    padding: var(--spacing-xl);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: var(--color-text);
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
    .hero-content {
      padding: var(--spacing-lg);
    }

    .cta-buttons {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>