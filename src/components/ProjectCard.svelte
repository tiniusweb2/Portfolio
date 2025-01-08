<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { Project } from '../types/project';
  import gsap from 'gsap';
  import { onMount } from 'svelte';

  export let project: Project;
  
  let isExpanded = false;
  let card: HTMLElement;

  let techBadges: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Card entrance animation
          gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            onComplete: () => {
              // Animate tech badges after card appears
              gsap.from(techBadges.children, {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.4,
                ease: "power2.out"
              });
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  });

  function toggleDescription() {
    isExpanded = !isExpanded;
  }
</script>

<div class="project-card" bind:this={card}>
  <div class="image-container">
    <img 
      src={project.image} 
      alt={project.title}
      loading="lazy"
    />
    <div class="overlay">
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="live-link">
          View Live
        </a>
      {/if}
    </div>
  </div>

  <div class="content">
    <h3>{project.title}</h3>
    
    <div class="tech-stack" bind:this={techBadges}>
      {#each project.techStack as tech}
        <span class="tech-badge" style="--badge-color: {tech.color}">
          {tech.name}
        </span>
      {/each}
    </div>

    <p class="description">
      {project.description}
      {#if isExpanded}
        <span transition:slide>
          {project.longDescription}
        </span>
      {/if}
    </p>

    <button 
      class="expand-btn"
      on:click={toggleDescription}
      aria-expanded={isExpanded}
    >
      {isExpanded ? 'Show Less' : 'Read More'}
    </button>

    <div class="actions">
      <a 
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="github-btn"
      >
        View on GitHub
      </a>
    </div>
  </div>
</div>

<style>
  .project-card {
    background: var(--color-background);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    overflow: hidden;
  }

  .image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .image-container:hover .overlay {
    opacity: 1;
  }

  .image-container:hover img {
    transform: scale(1.05);
  }

  .content {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
  }

  .tech-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
    background: var(--badge-color);
    color: white;
  }

  .description {
    color: var(--color-text);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }

  .expand-btn {
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    padding: 0;
    margin-bottom: var(--spacing-md);
    font-weight: 500;
  }

  .actions {
    margin-top: auto;
  }

  .github-btn {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.2s ease;
    text-align: center;
  }

  .github-btn:hover {
    background: var(--color-secondary);
  }

  .live-link {
    color: white;
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid white;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .live-link:hover {
    background: white;
    color: var(--color-primary);
  }
</style> 