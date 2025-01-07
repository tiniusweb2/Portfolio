<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Hero from './components/Hero.svelte';
  import Projects from './components/Projects.svelte';
  import Contact from './components/Contact.svelte';
  import type { NavItem } from './types/nav';

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Navigation state
  let isMenuOpen = false;
  let isScrolled = false;
  let activeSection = 'home';

  // Navigation items
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  onMount(() => {
    // Handle navbar background on scroll
    const handleScroll = () => {
      isScrolled = window.scrollY > 50;
    };
    window.addEventListener('scroll', handleScroll);

    // Set up scroll-based section detection
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      rootMargin: '-50% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Animate sections on scroll
    sections.forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  });

  // Handle smooth scroll
  function handleNavClick(id: string) {
    isMenuOpen = false;
    const element = document.querySelector(`#${id}`);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset,
        behavior: 'smooth'
      });
    }
  }
</script>

<header class="header" class:scrolled={isScrolled}>
  <nav class="navbar">
    <div class="logo">
      <a href="#home" on:click|preventDefault={() => handleNavClick('home')}>
        Portfolio
      </a>
    </div>

    <button 
      class="menu-toggle"
      aria-label="Toggle menu"
      aria-expanded={isMenuOpen}
      on:click={() => isMenuOpen = !isMenuOpen}
    >
      <span class="hamburger" class:active={isMenuOpen}></span>
    </button>

    <ul class="nav-links" class:open={isMenuOpen}>
      {#each navItems as { id, label }}
        <li>
          <a 
            href="#{id}" 
            class:active={activeSection === id}
            on:click|preventDefault={() => handleNavClick(id)}
          >
            {label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<main>
  <section id="home" class="section hero-section">
    <Hero 
      name="Your Name"
      title="Full Stack Developer"
      description="I'm a passionate developer focused on creating beautiful and functional web experiences."
    />
  </section>

  <section id="projects" class="section projects-section">
    <Projects />
  </section>

  <section id="contact" class="section contact-section">
    <Contact />
  </section>
</main>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .header.scrolled {
    background: var(--color-background);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .navbar {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .logo a:hover {
    color: var(--color-secondary);
  }

  .nav-links {
    display: flex;
    gap: var(--spacing-lg);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    padding: var(--spacing-xs) 0;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--color-primary);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  .nav-links a:hover::after,
  .nav-links a.active::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs);
  }

  .hamburger {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text);
    position: relative;
    transition: background-color 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: var(--color-text);
    transition: transform 0.3s ease;
  }

  .hamburger::before {
    top: -8px;
  }

  .hamburger::after {
    bottom: -8px;
  }

  .hamburger.active {
    background: transparent;
  }

  .hamburger.active::before {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.active::after {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .section {
    min-height: 100vh;
    padding: calc(var(--spacing-xl) * 2) var(--spacing-md);
    display: flex;
    flex-direction: column;
    justify-content: center;
    scroll-margin-top: 80px;
  }

  .hero-section {
    padding-top: 0;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    .nav-links {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background: var(--color-background);
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-lg);
      gap: var(--spacing-md);
      transform: translateY(-100%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-links.open {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style> 