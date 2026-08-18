/**
 * DHANANJAY PARMAR - PORTFOLIO INTERACTIVITY JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initThemeToggle();
  initNavigation();
  initSkillsFilter();
  initModals();
  initCopyButtons();
  initContactForm();
  initBackToTop();
  updateCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('dp_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark

  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dp_theme', newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'info');
  });
}

/* --------------------------------------------------------------------------
   2. Navigation, Active Scroll Spy, and Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile navigation
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link on scroll (Scroll Spy)
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Skills Category Filtering
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-tabs .filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Modals (Resume Viewer & Case Study)
   -------------------------------------------------------------------------- */
function initModals() {
  // Resume Modal
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (resumeModal && openResumeBtn) {
    openResumeBtn.addEventListener('click', () => {
      openModal(resumeModal);
    });
  }

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => {
      closeModal(resumeModal);
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Project Modal
  const projectModal = document.getElementById('projectModal');
  const openProjectModalBtns = document.querySelectorAll('.open-project-modal-btn');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const viewMetricsBtn = document.getElementById('viewMetricsBtn');

  if (projectModal) {
    openProjectModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        openModal(projectModal);
      });
    });

    if (viewMetricsBtn) {
      viewMetricsBtn.addEventListener('click', () => {
        openModal(projectModal);
      });
    }

    if (closeProjectModalBtn) {
      closeProjectModalBtn.addEventListener('click', () => {
        closeModal(projectModal);
      });
    }
  }

  // Close modals when clicking the overlay backdrop
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   5. Copy to Clipboard Functionality
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy], #quickCopyEmailBtn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy') || btn.getAttribute('data-email');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
        })
        .catch(() => {
          // Fallback if clipboard API fails
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
        });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & Dispatch
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const messageInput = document.getElementById('formMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset error states
    clearErrors();

    // Validate Name
    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'nameError', 'Please enter your name');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showFieldError(emailInput, 'emailError', 'Please enter your email address');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'emailError', 'Please enter a valid email format');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput, 'subjectError', 'Please enter a subject');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showFieldError(messageInput, 'messageError', 'Please write your message');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'messageError', 'Message should be at least 10 characters');
      isValid = false;
    }

    if (isValid) {
      const recipient = 'dhananjayparmar5041@gmail.com';
      const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );

      // Open email client with prefilled details
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

      showToast('Opening your default email client to send message...', 'success');
      contactForm.reset();
    }
  });

  function showFieldError(inputEl, errorElId, message) {
    inputEl.classList.add('error');
    const errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearErrors() {
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.classList.remove('error');
    });
    ['nameError', 'emailError', 'subjectError', 'messageError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }
}

/* --------------------------------------------------------------------------
   7. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function updateCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   9. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3500);
}
