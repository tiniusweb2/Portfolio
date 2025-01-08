<script>
  import { onMount } from 'svelte';

  let isScrolled = false;

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 50;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-md) var(--spacing-xl);
    z-index: 100;
    transition: all 0.3s ease;
  }

  .header.scrolled :global(a) {
    color: white;
    transition: color 0.3s ease;
  }

  .header:not(.scrolled) :global(a) {
    color: var(--color-text);
    transition: color 0.3s ease;
  }
</style>

<header class="header" class:scrolled={isScrolled}>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</header>