
<script lang="ts">
  // Props
  export let name: string = "John Doe";
  export let title: string = "Full Stack Developer";
  export let description: string = "I create beautiful and functional web experiences";
  export let speed: number = 0.0003;
  export let gridDensity: number = 80;
  export let lineColor: string = "rgba(0,0,0,0.3)";
  export let lineThickness: number = 1;

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

  function drawTunnelGrid() {
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRadius = Math.max(rect.width, rect.height);
    const baseRadius = 40;
    const numCircles = 80;
    const maxLines = 36;

    // Draw dense center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = lineThickness * 2;
    ctx.stroke();

    // Draw flowing circles with progressive spacing
    for (let i = 0; i < numCircles; i++) {
      const progress = ((time + i * (1 / numCircles)) % 1);
      const easedProgress = Math.pow(progress, 1.5); // Non-linear spacing
      const distance = easedProgress * maxRadius;
      const opacity = Math.max(0, 0.5 * (1 - Math.pow(progress, 0.8)));
      
      // Calculate dynamic line density
      const lineSpacing = Math.floor(maxLines * (1 - Math.pow(1 - progress, 2)));
      const numLines = Math.max(12, maxLines - lineSpacing);
      
      // Draw circle with varying density
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + distance, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
      ctx.lineWidth = lineThickness * (1 - progress * 0.3);
      ctx.stroke();

      // Draw radial lines with progressive spacing
      for (let j = 0; j < numLines; j++) {
        const angle = (j / numLines) * Math.PI * 2;
        const radius = baseRadius + distance;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * baseRadius,
          centerY + Math.sin(angle) * baseRadius
        );
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.4})`;
        ctx.lineWidth = lineThickness * (0.6 - progress * 0.3);
        ctx.stroke();
      }
    }

    // Add connecting lines
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const gradient = ctx.createLinearGradient(
        centerX + Math.cos(angle) * 40,
        centerY + Math.sin(angle) * 40,
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      );
      
      gradient.addColorStop(0, lineColor);
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
      ctx.lineWidth = lineThickness;
      ctx.stroke();
    }

    time += speed;
    animationFrame = requestAnimationFrame(drawTunnelGrid);
  }

  function handleResize() {
    if (canvas && ctx) {
      setupCanvas();
    }
  }

  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    setupCanvas();
    drawTunnelGrid();
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
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
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
