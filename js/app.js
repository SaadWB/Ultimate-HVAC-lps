/**
 * Ultimate HVAC - AC Installation Landing Page Scripts
 * Handles Header scroll state, Mobile navigation, FAQ accordion,
 * Smooth scrolling, and Form validation & submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Header State on Scroll ---
  const header = document.getElementById('main-header');
  
  function updateHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // --- 2. Mobile Nav Drawer Toggle ---
  const menuToggle = document.getElementById('mobile-menu-btn');
  const navDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggle && navDrawer) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navDrawer.classList.toggle('active');
    });

    // Close mobile nav when clicking any link
    const mobileLinks = navDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('active');
      });
    });
  }

  // --- 3. Accessible FAQ Accordion ---
  const accordionItems = document.querySelectorAll('.faq-accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    const content = item.querySelector('.faq-accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other open accordion items for a cleaner editorial experience
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-accordion-trigger');
            const otherContent = otherItem.querySelector('.faq-accordion-content');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first FAQ by default on desktop
  if (window.innerWidth > 768 && accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const firstTrigger = firstItem.querySelector('.faq-accordion-trigger');
    const firstContent = firstItem.querySelector('.faq-accordion-content');
    if (firstItem && firstTrigger && firstContent) {
      firstItem.classList.add('active');
      firstTrigger.setAttribute('aria-expanded', 'true');
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  // --- 4. Smooth Anchor Scrolling with Header Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 5. Service Request Forms Validation & Submission ---
  const allForms = document.querySelectorAll('.ac-service-request-form, #ac-service-request-form');

  allForms.forEach(form => {
    // Input format helper for phone
    const phoneInput = form.querySelector('input[type="tel"], [name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        if (x) {
          e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        }
      });
    }

    // Clear error states on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Full Name
      const nameField = form.querySelector('[name="fullname"]');
      if (nameField && nameField.value.trim().length < 2) {
        const group = nameField.closest('.form-group');
        if (group) group.classList.add('has-error');
        isValid = false;
      }

      // Validate Phone Number
      const cleanPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      if (!phoneInput || cleanPhone.length < 10) {
        const group = phoneInput ? phoneInput.closest('.form-group') : null;
        if (group) group.classList.add('has-error');
        isValid = false;
      }

      // Validate Service Needed
      const serviceField = form.querySelector('[name="service_type"]');
      if (serviceField && !serviceField.value) {
        const group = serviceField.closest('.form-group');
        if (group) group.classList.add('has-error');
        isValid = false;
      }

      // Validate Email (if provided)
      const emailField = form.querySelector('[name="email"]');
      if (emailField && emailField.value.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          const group = emailField.closest('.form-group');
          if (group) group.classList.add('has-error');
          isValid = false;
        }
      }

      if (!isValid) {
        const firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      // Form is valid — show loading state on button
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
          Submitting...
        `;
      }

      // Process Submission (mock/storage and redirect to Thank You page)
      setTimeout(() => {
        try {
          const addressField = form.querySelector('[name="address"]');
          const timeField = form.querySelector('[name="preferred_time"]');
          const notesField = form.querySelector('[name="notes"]');

          const formData = {
            name: nameField ? nameField.value.trim() : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            email: emailField ? emailField.value.trim() : '',
            address: addressField ? addressField.value.trim() : '',
            service: serviceField ? serviceField.value : '',
            preferredTime: timeField ? timeField.value : '',
            notes: notesField ? notesField.value.trim() : '',
            timestamp: new Date().toISOString()
          };
          sessionStorage.setItem('ultimate_hvac_request', JSON.stringify(formData));
        } catch (err) {
          console.warn('Session storage write error:', err);
        }

        // Check if thank-you page is available, otherwise show inline success state
        if (window.location.hostname !== '' && !window.location.protocol.startsWith('file')) {
          window.location.href = '/thank-you';
        } else {
          // Inline success display for local preview
          const cardParent = form.closest('.service-form-card');
          const formSuccessBox = document.getElementById('service-form-success');
          if (cardParent && formSuccessBox && cardParent.contains(formSuccessBox)) {
            form.style.display = 'none';
            formSuccessBox.style.display = 'block';
            formSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            form.innerHTML = `
              <div style="text-align: center; padding: 2rem 1rem;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h4 style="font-size: 1.25rem; font-weight: 700; color: #001D39; margin-bottom: 0.5rem;">Request Received!</h4>
                <p style="font-size: 0.9rem; color: #64748B; margin-bottom: 1rem;">Our dispatch team will contact you shortly.</p>
                <a href="tel:773-420-6060" class="btn btn-secondary btn-sm">(773) 420-6060</a>
              </div>
            `;
          }
        }
      }, 700);
    });
  });
});
