/**
 * TATTOO & PIERCING STUDIO - CORE GLOBAL JAVASCRIPT
 * Handles Header, Navigation, Click-Only Dropdowns, Mobile Drawer,
 * Dark Mode, RTL/LTR Engine, Auth Modal, Scroll to Top, and Branded Loader.
 */

(function () {
  'use strict';

  // ---------------- Page Loader ----------------
  window.addEventListener('load', function () {
    const loader = document.getElementById('page-loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 400);
    }
  });

  // ---------------- DOM Ready Execution ----------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    initHeaderScroll();
    initHomeDropdown();
    initMobileDrawer();
    initAuthModal();
    initScrollToTop();
    initActiveNav();
    initContactForm();
    initFilmstrip();
  });

  // ---------------- 1. Dark Mode Engine (#000000 Mandatory Dark Base) ----------------
  function initTheme() {
    const savedTheme = localStorage.getItem('studio_theme') || 'dark';
    applyTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studio_theme', theme);

    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    if (theme === 'dark') {
      sunIcons.forEach(icon => icon.classList.remove('hidden'));
      moonIcons.forEach(icon => icon.classList.add('hidden'));
    } else {
      sunIcons.forEach(icon => icon.classList.add('hidden'));
      moonIcons.forEach(icon => icon.classList.remove('hidden'));
    }
  }

  // ---------------- 2. RTL / LTR Direction Engine ----------------
  function initDirection() {
    const savedDir = localStorage.getItem('studio_dir') || 'ltr';
    applyDirection(savedDir);

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir);
      });
    });
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('studio_dir', dir);

    const dirTexts = document.querySelectorAll('.rtl-indicator-text');
    dirTexts.forEach(txt => {
      txt.textContent = dir.toUpperCase();
    });
  }

  // ---------------- 3. Fixed Header Scroll Elevation ----------------
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---------------- 4. Home Dropdown (CLICK ONLY - NO HOVER, AUTO CLOSE) ----------------
  function initHomeDropdown() {
    const dropdownContainer = document.querySelector('.desktop-dropdown');
    if (!dropdownContainer) return;

    const trigger = dropdownContainer.querySelector('.dropdown-trigger');
    if (!trigger) return;

    function closeDropdown() {
      if (dropdownContainer.classList.contains('open')) {
        dropdownContainer.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

    function openDropdown() {
      dropdownContainer.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    // Toggle ONLY when Home is clicked
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (dropdownContainer.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Automatically close when clicking anywhere outside
    document.addEventListener('click', function (e) {
      if (!dropdownContainer.contains(e.target)) {
        closeDropdown();
      }
    });

    // Automatically close when hovering or clicking other nav links
    const otherNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
    otherNavLinks.forEach(link => {
      link.addEventListener('mouseenter', closeDropdown);
      link.addEventListener('click', closeDropdown);
    });

    // Automatically close on scroll
    window.addEventListener('scroll', function () {
      closeDropdown();
    }, { passive: true });

    // Automatically close with Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });
  }

  // ---------------- 5. Mobile Drawer & Mobile Accordion ----------------
  function initMobileDrawer() {
    const drawerOpenBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
    const accordion = document.querySelector('.mobile-accordion');
    const accordionToggle = accordion ? accordion.querySelector('.mobile-accordion-toggle') : null;

    if (!drawer || !overlay) return;

    function closeAccordion() {
      if (accordion) {
        accordion.classList.remove('open');
        if (accordionToggle) accordionToggle.setAttribute('aria-expanded', 'false');
      }
    }

    function openAccordion() {
      if (accordion) {
        accordion.classList.add('open');
        if (accordionToggle) accordionToggle.setAttribute('aria-expanded', 'true');
      }
    }

    function openDrawer() {
      // Ensure accordion is closed by default whenever drawer opens
      closeAccordion();
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (drawerOpenBtn) drawerOpenBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      // Always reset and close accordion when drawer closes
      closeAccordion();
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (drawerOpenBtn) drawerOpenBtn.setAttribute('aria-expanded', 'false');
    }

    if (drawerOpenBtn) {
      drawerOpenBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openDrawer();
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Mobile Home Accordion: CLICK ONLY - Opens ONLY when Home is clicked, otherwise automatically closes
    if (accordion && accordionToggle) {
      accordionToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (accordion.classList.contains('open')) {
          closeAccordion();
        } else {
          openAccordion();
        }
      });

      // Automatically close accordion when clicking anywhere in drawer outside the accordion
      drawer.addEventListener('click', function (e) {
        if (!accordion.contains(e.target)) {
          closeAccordion();
        }
      });
    }

    // Clicking navigation links inside drawer (except accordion toggle) closes the drawer
    const navigationsLinks = drawer.querySelectorAll('.mobile-nav-link, .mobile-sub-link, .mobile-sublink, .mobile-drawer-controls a');
    navigationsLinks.forEach(link => {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  // ---------------- 6. Login / Register Modal ----------------
  function initAuthModal() {
    const modalOverlay = document.querySelector('.auth-modal-overlay');
    const modalCloseBtn = document.querySelector('.auth-modal-close');
    const loginTriggers = document.querySelectorAll('.btn-login, .mobile-login-trigger');

    if (!modalOverlay) return;

    function openAuthModal() {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      const firstInput = modalOverlay.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 150);
    }

    function closeAuthModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    loginTriggers.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openAuthModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeAuthModal);
    }

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeAuthModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeAuthModal();
      }
    });

    // Tab Switch between Login and Register
    const tabBtns = modalOverlay.querySelectorAll('.auth-tab-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        if (targetTab === 'login') {
          if (formLogin) formLogin.classList.remove('hidden');
          if (formRegister) formRegister.classList.add('hidden');
        } else {
          if (formLogin) formLogin.classList.add('hidden');
          if (formRegister) formRegister.classList.remove('hidden');
        }
      });
    });

    // Handle form demo submit
    const forms = modalOverlay.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Processing...';
          submitBtn.disabled = true;
          setTimeout(() => {
            alert('Authentication demo simulation successful!');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            closeAuthModal();
          }, 600);
        }
      });
    });
  }

  // ---------------- 7. Scroll to Top Button ----------------
  function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top-btn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------- 8. Active Navigation Highlighting ----------------
  function initActiveNav() {
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') {
      currentPath = 'index.html';
    }

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link, .mobile-sublink');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === 'index.html' && (href === 'index.html' || href === './')))) {
        link.classList.add('active');

        // When Home 1 or Home 2 is active, highlight the desktop Home trigger and mobile Home accordion
        if (link.classList.contains('dropdown-item')) {
          const parentTrigger = document.querySelector('.dropdown-trigger');
          if (parentTrigger) parentTrigger.classList.add('active');
        }
        if (link.classList.contains('mobile-sub-link') || link.classList.contains('mobile-sublink')) {
          const accordionToggle = document.querySelector('.mobile-accordion-toggle');
          if (accordionToggle) accordionToggle.classList.add('active');
          const accordion = document.querySelector('.mobile-accordion');
          if (accordion) accordion.classList.add('has-active');
        }
      }
    });

    // If currently on Home 1 (index.html), ensure Home trigger is explicitly active
    if (currentPath === 'index.html') {
      const parentTrigger = document.querySelector('.dropdown-trigger');
      if (parentTrigger) parentTrigger.classList.add('active');
      const accordionToggle = document.querySelector('.mobile-accordion-toggle');
      if (accordionToggle) accordionToggle.classList.add('active');
    }
  }

  // ---------------- 9. Contact & Consultation Form Handler ----------------
  function initContactForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
          </svg>
          <span>Securing Consultation...</span>
        `;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        const successMsg = document.getElementById('formSuccessMessage');
        if (successMsg) {
          successMsg.classList.remove('hidden');
        }
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = `
            <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Consultation Request Sent</span>
          `;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }, 3500);
        }
      }, 700);
    });
  }

  // ---------------- 10. Interactive Expanding Filmstrip Atelier ----------------
  function initFilmstrip() {
    const wrapper = document.getElementById('filmstripAtelier');
    if (!wrapper) return;

    const panels = wrapper.querySelectorAll('.filmstrip-panel');
    panels.forEach(panel => {
      panel.addEventListener('mouseenter', function () {
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });

      panel.addEventListener('click', function () {
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });

      panel.addEventListener('focus', function () {
        panels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
})();
