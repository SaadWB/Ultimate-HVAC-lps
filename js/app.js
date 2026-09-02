/**
 * Ultimate HVAC - AC Installation Landing Page JavaScript
 * High-performance conversion handlers, accordion, form validation, and filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSmoothScrollCTAs();
  initFaqAccordion();
  initServiceAreaFilter();
  initServiceRequestForm();
  initServiceCardPreselection();
  initReviewsCarousel();
});

/* --- 1. Header Scroll Shadow Effect --- */
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

/* --- 2. Smooth Scroll to Request Service Form with Autofocus --- */
function initSmoothScrollCTAs() {
  const ctaButtons = document.querySelectorAll('a[href^="#request-service"]');
  const formSection = document.getElementById('request-service');
  const nameInput = document.getElementById('fullname');

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (formSection) {
        const headerOffset = 80;
        const elementPosition = formSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Focus the name input after scroll
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  });
}

/* --- 3. Pre-select Service Dropdown When Clicking Specific Service Card CTAs --- */
function initServiceCardPreselection() {
  const serviceCards = document.querySelectorAll('[data-service-preset]');
  const serviceSelect = document.getElementById('service_type');

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const presetValue = card.getAttribute('data-service-preset');
      if (serviceSelect && presetValue) {
        serviceSelect.value = presetValue;
      }
    });
  });
}

/* --- 4. Interactive Accessible FAQ Accordion --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerWrapper = item.querySelector('.faq-answer-wrapper');

    if (!questionBtn || !answerWrapper) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherWrapper = otherItem.querySelector('.faq-answer-wrapper');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherWrapper) otherWrapper.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerWrapper.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerWrapper.style.maxHeight = answerWrapper.scrollHeight + 'px';
      }
    });
  });
}

/* --- 5. Live Service Area Search & Filter --- */
function initServiceAreaFilter() {
  const searchInput = document.getElementById('area-search');
  const areaChips = document.querySelectorAll('.area-chip');
  const noMatchNotice = document.getElementById('area-no-match');

  if (!searchInput || !areaChips.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let matchesCount = 0;

    areaChips.forEach(chip => {
      const areaName = chip.textContent.toLowerCase().trim();
      if (query === '' || areaName.includes(query)) {
        chip.style.display = 'inline-flex';
        matchesCount++;
      } else {
        chip.style.display = 'none';
      }
    });

    if (noMatchNotice) {
      if (matchesCount === 0 && query !== '') {
        noMatchNotice.style.display = 'block';
      } else {
        noMatchNotice.style.display = 'none';
      }
    }
  });

  // Clicking an area chip auto-fills the Address/City field in the request form
  const addressInput = document.getElementById('address');
  areaChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const location = chip.getAttribute('data-location') || chip.textContent.trim();
      if (addressInput) {
        addressInput.value = location + ', IL';
        addressInput.dispatchEvent(new Event('input'));
      }
      
      const formSection = document.getElementById('request-service');
      if (formSection) {
        const headerOffset = 80;
        const offsetPosition = formSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        setTimeout(() => { if (addressInput) addressInput.focus(); }, 600);
      }
    });
  });
}

/* --- 6. Request Service Form Validation & Instant Client-Side Confirmation --- */
function initServiceRequestForm() {
  const form = document.getElementById('ac-service-request-form');
  const formCard = document.getElementById('service-form-inner');
  const successState = document.getElementById('service-form-success');
  const resetBtn = document.getElementById('reset-form-btn');
  const phoneInput = document.getElementById('phone');

  if (!form) return;

  // Phone number auto-formatter: (XXX) XXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Full Name
    const name = document.getElementById('fullname');
    if (!name.value.trim()) {
      showError(name, 'Please enter your full name');
      isValid = false;
    } else {
      clearError(name);
    }

    // Validate Phone Number
    if (phoneInput) {
      const cleanPhone = phoneInput.value.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        showError(phoneInput, 'Please enter a valid 10-digit phone number');
        isValid = false;
      } else {
        clearError(phoneInput);
      }
    }

    // Validate Email
    const email = document.getElementById('email');
    if (email && email.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(email);
      }
    }

    // Validate Service Type
    const serviceType = document.getElementById('service_type');
    if (serviceType && !serviceType.value) {
      showError(serviceType, 'Please select a service');
      isValid = false;
    } else if (serviceType) {
      clearError(serviceType);
    }

    if (!isValid) return;

    // Simulate submission state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Submitting Request...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show confirmed success view
      if (formCard && successState) {
        formCard.style.display = 'none';
        successState.style.display = 'block';

        const summaryEl = document.getElementById('submitted-customer-summary');
        if (summaryEl) {
          summaryEl.innerHTML = `Thank you, <strong>${escapeHtml(name.value.trim())}</strong>! A licensed Ultimate HVAC specialist will call you at <strong>${escapeHtml(phoneInput.value.trim())}</strong> shortly to confirm your service window.`;
        }
      }
    }, 700);
  });

  // Reset form button
  if (resetBtn && formCard && successState) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      successState.style.display = 'none';
      formCard.style.display = 'block';
    });
  }
}

function showError(inputEl, message) {
  inputEl.classList.add('error');
  const errorEl = inputEl.nextElementSibling;
  if (errorEl && errorEl.classList.contains('field-error')) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearError(inputEl) {
  inputEl.classList.remove('error');
  const errorEl = inputEl.nextElementSibling;
  if (errorEl && errorEl.classList.contains('field-error')) {
    errorEl.style.display = 'none';
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* --- 7. Reviews Section Interactive Carousel / Slider --- */
function initReviewsCarousel() {
  const track = document.getElementById('reviews-carousel-track');
  const prevBtn = document.getElementById('reviews-prev-btn');
  const nextBtn = document.getElementById('reviews-next-btn');
  const dots = document.querySelectorAll('.reviews-dot');
  const cards = document.querySelectorAll('.reviews-carousel-track .review-card');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateActiveDot(index) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
      dot.setAttribute('aria-selected', idx === index ? 'true' : 'false');
    });
  }

  function scrollToCard(index) {
    if (index < 0) index = 0;
    if (index >= totalCards) index = totalCards - 1;
    currentIndex = index;

    const targetCard = cards[currentIndex];
    if (targetCard) {
      const trackPadding = 16;
      track.scrollTo({
        left: targetCard.offsetLeft - trackPadding,
        behavior: 'smooth'
      });
      updateActiveDot(currentIndex);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
      scrollToCard(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
      scrollToCard(newIndex);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide') || '0', 10);
      scrollToCard(slideIndex);
    });
  });

  // Track native touch scrolling and update dots dynamically
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = cards[0].offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex < totalCards && newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateActiveDot(currentIndex);
      }
    }, 80);
  }, { passive: true });
}

