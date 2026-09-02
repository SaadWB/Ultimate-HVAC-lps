/**
 * Ultimate HVAC - Thank You Page JavaScript
 * Header sticky scroll behavior and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initCardInteractions();
});

/* --- 1. Header Scroll Shadow Effect (Matching Main Page) --- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- 2. Interactive Card Lift & Accessibility Enhancements --- */
function initCardInteractions() {
  const stepCards = document.querySelectorAll('.step-card');
  
  stepCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    
    // Keyboard accessibility for card focus
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.classList.toggle('active-focus');
      }
    });
  });
}
