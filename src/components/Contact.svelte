<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import gsap from 'gsap';
  import type { ContactForm, FormErrors, FormState } from '../types/contact';
  import { onMount } from 'svelte';

  // Form data
  let formData: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  // Form state
  let formState: FormState = {
    isSubmitting: false,
    isSubmitted: false,
    hasError: false
  };

  // Form errors
  let errors: FormErrors = {};

  // References for animation
  let form: HTMLFormElement;
  let successMessage: HTMLDivElement;
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let messageInput: HTMLTextAreaElement;
  let submitButton: HTMLButtonElement;

  onMount(() => {
    gsap.from(form, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    gsap.from('.form-elements', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Validate email format
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate form
  function validateForm(): boolean {
    errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    return isValid;
  }

  // Handle form submission
  async function handleSubmit() {
    if (!validateForm()) return;

    formState.isSubmitting = true;
    formState.hasError = false;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      formState.isSubmitted = true;
      formData = { name: '', email: '', message: '' };

      // Animate success message
      gsap.from(successMessage, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "back.out"
      });
    } catch (error) {
      formState.hasError = true;
      formState.errorMessage = 'Failed to send message. Please try again.';
    } finally {
      formState.isSubmitting = false;
    }
  }

  // Basic animation functions -  Expand these for a complete implementation
  function animateLabel(input: HTMLInputElement) {
    gsap.to(input.previousElementSibling, { y: -15, opacity: 1, duration: 0.3 });
  }

  function resetLabel(input: HTMLInputElement) {
    if (!input.value) {
      gsap.to(input.previousElementSibling, { y: 0, opacity: 0.7, duration: 0.3 });
    }
  }

  function highlightInput(input: HTMLInputElement) {
    gsap.to(input, { backgroundColor: "#e0f2fe", duration: 0.3 });
  }

  function unhighlightInput(input: HTMLInputElement) {
    gsap.to(input, { backgroundColor: "white", duration: 0.3 });
  }

  function animateButton(button: HTMLButtonElement) {
    gsap.to(button, { scale: 1.05, backgroundColor: "#1677b9", duration: 0.3 });
  }

  function resetButton(button: HTMLButtonElement){
    gsap.to(button, { scale: 1, backgroundColor: "#1e87cd", duration: 0.3 });
  }


</script>

<section class="contact-section">
  <h2>Get in Touch</h2>

  {#if formState.isSubmitted}
    <div 
      class="success-message" 
      bind:this={successMessage}
      transition:slide
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <p>Thank you for your message! I'll get back to you soon.</p>
      <button 
        class="reset-btn"
        on:click={() => formState.isSubmitted = false}
      >
        Send Another Message
      </button>
    </div>
  {:else}
    <form 
      bind:this={form}
      on:submit|preventDefault={handleSubmit}
      class:submitting={formState.isSubmitting}
      class="form-elements"
    >
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          class:error={errors.name}
          disabled={formState.isSubmitting}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          on:focus={(e) => animateLabel(e.target)}
          on:blur={(e) => resetLabel(e.target)}
          bind:this={nameInput}
          on:focus={() => highlightInput(nameInput)}
          on:blur={() => unhighlightInput(nameInput)}
        />
        {#if errors.name}
          <span class="error-message" id="name-error" transition:fade>
            {errors.name}
          </span>
        {/if}
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          class:error={errors.email}
          disabled={formState.isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          on:focus={(e) => animateLabel(e.target)}
          on:blur={(e) => resetLabel(e.target)}
          bind:this={emailInput}
          on:focus={() => highlightInput(emailInput)}
          on:blur={() => unhighlightInput(emailInput)}
        />
        {#if errors.email}
          <span class="error-message" id="email-error" transition:fade>
            {errors.email}
          </span>
        {/if}
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          id="message"
          bind:value={formData.message}
          class:error={errors.message}
          disabled={formState.isSubmitting}
          rows="5"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          on:focus={(e) => animateLabel(e.target)}
          on:blur={(e) => resetLabel(e.target)}
          bind:this={messageInput}
          on:focus={() => highlightInput(messageInput)}
          on:blur={() => unhighlightInput(messageInput)}
        ></textarea>
        {#if errors.message}
          <span class="error-message" id="message-error" transition:fade>
            {errors.message}
          </span>
        {/if}
      </div>

      {#if formState.hasError}
        <div class="form-error" transition:slide>
          {formState.errorMessage}
        </div>
      {/if}

      <button 
        type="submit" 
        class="submit-btn"
        disabled={formState.isSubmitting}
        bind:this={submitButton}
        on:mouseover={() => animateButton(submitButton)}
        on:mouseout={() => resetButton(submitButton)}
      >
        {#if formState.isSubmitting}
          <span class="spinner"></span>
          Sending...
        {:else}
          Send Message
        {/if}
      </button>
    </form>
  {/if}
</section>

<style>
  .contact-section {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--color-text);
    font-weight: 500;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  input, textarea {
    width: 100%;
    padding: var(--spacing-sm);
    border: 2px solid var(--color-text);
    border-radius: 6px;
    background: var(--color-background);
    color: var(--color-text);
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  input.error, textarea.error {
    border-color: #ef4444;
  }

  .error-message {
    display: block;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: var(--spacing-xs);
  }

  .submit-btn {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .submit-btn:hover:not(:disabled) {
    background: var(--color-secondary);
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  .success-message {
    text-align: center;
    padding: var(--spacing-xl);
    background: #ecfdf5;
    border-radius: 12px;
    color: #065f46;
  }

  .success-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto var(--spacing-lg);
    color: #059669;
  }

  .reset-btn {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: #059669;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .reset-btn:hover {
    background: #047857;
  }

  .form-error {
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    background: #fef2f2;
    border-radius: 6px;
    color: #dc2626;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .contact-section {
      padding: var(--spacing-lg) var(--spacing-sm);
    }

    h2 {
      font-size: 2rem;
    }
  }
</style>