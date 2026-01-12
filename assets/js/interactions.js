/**
 * Portfolio Interactions
 * Optimized for performance, accessibility, and maintainability
 */

(function() {
  'use strict';

  // Constants
  const HEADER_OFFSET = 72;
  const SELECTORS = {
    nav: '.nav',
    body: 'body',
    anchorLink: 'a[href^="#"]'
  };

  /**
   * Mobile navigation toggle
   * Toggles the mobile menu visibility with proper ARIA states
   */
  function toggleMenu() {
    const nav = document.querySelector(SELECTORS.nav);
    if (!nav) return;

    const isOpen = nav.classList.contains('open');
    nav.classList.toggle('open');

    // Update ARIA for screen readers
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', !isOpen);
    }
  }

  /**
   * Smooth scroll with offset for sticky header
   * @param {Event} e - Click event
   */
  function smoothScroll(e) {
    const anchor = e.target.closest(SELECTORS.anchorLink);
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const id = href.slice(1);
    const targetElement = document.getElementById(id);

    if (!targetElement) return;

    e.preventDefault();

    // Calculate position with header offset
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update focus for accessibility
    targetElement.focus({ preventScroll: true });
  }


  /**
   * Close mobile menu when clicking outside
   * @param {Event} e - Click event
   */
  function handleOutsideClick(e) {
    const nav = document.querySelector(SELECTORS.nav);
    const menuBtn = document.querySelector('.menu-btn');

    if (!nav || !menuBtn) return;
    if (!nav.classList.contains('open')) return;

    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Close mobile menu on escape key
   * @param {KeyboardEvent} e - Keyboard event
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      const nav = document.querySelector(SELECTORS.nav);
      const menuBtn = document.querySelector('.menu-btn');

      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (menuBtn) {
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.focus();
        }
      }
    }
  }

  /**
   * Career Timeline
   * Handles node click interactions for expanding/collapsing details
   */
  function initCareerTimeline() {
    const timeline = document.querySelector('.career-timeline');
    if (!timeline) return;

    const timelineLine = timeline.querySelector('.timeline-line');
    const timelineItems = Array.from(timeline.querySelectorAll('.timeline-item'));

    if (!timelineLine || !timelineItems.length) return;

    // Animate timeline line on load
    timelineLine.classList.add('animate');

    // Expand the first item by default
    timelineItems[0].classList.add('expanded');
    const firstNode = timelineItems[0].querySelector('.timeline-node');
    if (firstNode) {
      firstNode.setAttribute('aria-expanded', 'true');
    }

    // Setup node click handlers
    timelineItems.forEach((item) => {
      const node = item.querySelector('.timeline-node');
      if (!node) return;

      const title = item.querySelector('h3');

      // Configure accessibility
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', `Show details for ${title ? title.textContent : 'position'}`);

      // Click handler
      node.addEventListener('click', function() {
        const isExpanded = item.classList.contains('expanded');

        // Collapse all other items
        timelineItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('expanded');
            const otherNode = otherItem.querySelector('.timeline-node');
            if (otherNode) {
              otherNode.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current item
        item.classList.toggle('expanded');
        node.setAttribute('aria-expanded', !isExpanded);
      });

      // Keyboard support
      node.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
        }
      });
    });
  }

  /* Lightbox (image preview) */
  function initLightbox() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    overlay.innerHTML = '\n      <div class="lightbox-content" role="dialog" aria-modal="true">\n        <button class="lightbox-close" aria-label="Close image">\u00d7</button>\n        <img src="" alt="" />\n        <div class="lightbox-caption" aria-hidden="false"></div>\n      </div>';

    document.body.appendChild(overlay);

    var lbImg = overlay.querySelector('img');
    var lbCaption = overlay.querySelector('.lightbox-caption');
    var lbClose = overlay.querySelector('.lightbox-close');
    var lastFocused = null;

    function openLightbox(src, caption) {
      lastFocused = document.activeElement;
      lbImg.src = src;
      lbImg.alt = caption || '';
      lbCaption.textContent = caption || '';
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      lbClose.focus();
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      lbImg.src = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Delegate clicks on images with preview intent
    document.body.addEventListener('click', function(e) {
      var img = e.target.closest && e.target.closest('.alt-media-img, .figure img');
      if (!img) return;
      e.preventDefault();
      var full = img.getAttribute('data-full') || img.src;
      var captionEl = img.closest('.alt-media') ? img.closest('.alt-media').querySelector('.caption') : img.closest('.figure') ? img.closest('.figure').querySelector('.caption') : null;
      var caption = captionEl ? captionEl.textContent.trim() : '';
      openLightbox(full, caption);
    });

    // Close handlers
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeLightbox();
    });

    lbClose.addEventListener('click', function() { closeLightbox(); });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
    });
  }

  /**
   * Initialize all interactions
   */
  function init() {
    // Smooth scrolling for anchor links
    document.body.addEventListener('click', smoothScroll);

    // Career timeline animations
    initCareerTimeline();
    // Lightbox for image previews
    initLightbox();

    // Mobile menu enhancements
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    // Set initial ARIA state for menu button
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose toggleMenu globally for inline onclick handler
  window.toggleMenu = toggleMenu;

})();
