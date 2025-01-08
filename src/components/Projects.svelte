<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import type { Project } from '../types/project';
  import { onMount } from 'svelte';

  // Example projects data
  const projects: Project[] = [
    {
      id: "1",
      title: "Project One",
      description: "A brief description of the project",
      longDescription: "A more detailed description of the project that explains the technical challenges, solutions, and outcomes.",
      image: "/assets/project1.jpg",
      githubUrl: "https://github.com/username/project1",
      liveUrl: "https://project1.com",
      techStack: [
        { name: "React", color: "#61dafb" },
        { name: "TypeScript", color: "#3178c6" },
        { name: "Node.js", color: "#339933" }
      ]
    },
    // Add more example projects
    {
      id: "2",
      title: "Project Two",
      description: "Another amazing project",
      longDescription: "Detailed explanation of the second project.",
      image: "/assets/project2.jpg",
      githubUrl: "https://github.com/username/project2",
      techStack: [
        { name: "Svelte", color: "#FF3E00" },
        { name: "TypeScript", color: "#3178c6" }
      ]
    },
    {
      id: "3",
      title: "Project Three",
      description: "Third project showcase",
      longDescription: "More details about the third project.",
      image: "/assets/project3.jpg",
      githubUrl: "https://github.com/username/project3",
      liveUrl: "https://project3.com",
      techStack: [
        { name: "Vue", color: "#4FC08D" },
        { name: "JavaScript", color: "#F7DF1E" }
      ]
    }
  ];

  let currentIndex = 0;
  const projectsPerPage = 3;

  let projectsContainer: HTMLElement;
  let isAnimating = false;
  
  $: visibleProjects = projects.slice(
    currentIndex,
    currentIndex + projectsPerPage
  );

  function animateSlide(direction: 'next' | 'prev') {
    if (isAnimating) return;
    isAnimating = true;

    const cards = projectsContainer.querySelectorAll('.project-item');
    const xOffset = direction === 'next' ? -100 : 100;
    
    gsap.to(cards, {
      x: `${-xOffset}%`,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power3.in",
      stagger: 0.15,
      onComplete: () => {
        // Update index
        if (direction === 'next') {
          currentIndex = (currentIndex + projectsPerPage) % projects.length;
        } else {
          currentIndex = (currentIndex - projectsPerPage + projects.length) % projects.length;
        }
        
        // Reset position for new cards
        gsap.set(cards, { x: `${xOffset}%`, opacity: 0, scale: 0.8 });
        
        // Animate new cards in
        gsap.to(cards, {
          x: "0%",
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          onComplete: () => {
            isAnimating = false;
          }
        });
      }
    });
  }

  function nextSlide() {
    animateSlide('next');
  }

  function previousSlide() {
    animateSlide('prev');
  }

  onMount(() => {
    // Initial animation
    gsap.from(projectsContainer.querySelectorAll('.project-item'), {
      y: 50,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15
    });

    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<section class="projects-section">
  <h2>My Projects</h2>
  
  <div class="projects-container">
    <button class="nav-button prev" on:click={previousSlide} aria-label="Previous projects">
      ←
    </button>
    
    <div class="projects-grid" bind:this={projectsContainer}>
      {#each visibleProjects as project (project.id)}
        <div class="project-item">
          <ProjectCard {project} />
        </div>
      {/each}
    </div>

    <button class="nav-button next" on:click={nextSlide} aria-label="Next projects">
      →
    </button>
  </div>

  <div class="dots">
    {#each Array(Math.ceil(projects.length / projectsPerPage)) as _, i}
      <button 
        class="dot" 
        class:active={Math.floor(currentIndex / projectsPerPage) === i}
        on:click={() => currentIndex = i * projectsPerPage}
        aria-label={`Go to slide ${i + 1}`}
      />
    {/each}
  </div>
</section>

<style>
  .projects-section {
    padding: var(--spacing-xl) 0;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text);
  }

  .projects-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .nav-button {
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: background-color 0.2s ease;
  }

  .nav-button:hover {
    background: var(--color-secondary);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-text);
    opacity: 0.3;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .dot.active {
    opacity: 1;
  }

  @media (max-width: 1024px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 