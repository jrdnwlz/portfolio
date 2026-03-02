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
   * Generic tabs
   * Activates any [data-tabs] group with proper keyboard support
   */
  function initTabs() {
    const tabGroups = document.querySelectorAll('[data-tabs]');
    if (!tabGroups.length) return;

    tabGroups.forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
      const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));
      if (!tabs.length || !panels.length) return;

      const getPanelForTab = (tab) => {
        const panelId = tab.getAttribute('aria-controls');
        return panelId ? group.querySelector(`#${panelId}`) : null;
      };

      const setActive = (activeTab) => {
        tabs.forEach((tab) => {
          const isActive = tab === activeTab;
          tab.setAttribute('aria-selected', String(isActive));
          tab.setAttribute('tabindex', isActive ? '0' : '-1');

          const panel = getPanelForTab(tab);
          if (panel) panel.hidden = !isActive;
        });
      };

      const initialTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      setActive(initialTab);

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          setActive(tab);
          tab.focus();
        });

        tab.addEventListener('keydown', (e) => {
          let nextIndex = null;

          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') nextIndex = 0;
          if (e.key === 'End') nextIndex = tabs.length - 1;

          if (nextIndex !== null) {
            e.preventDefault();
            setActive(tabs[nextIndex]);
            tabs[nextIndex].focus();
          }
        });
      });
    });
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

    overlay.innerHTML = '\n      <div class="lightbox-content" role="dialog" aria-modal="true">\n        <button class="lightbox-close" aria-label="Close image">\u00d7</button>\n        <div class="lightbox-media"></div>\n        <div class="lightbox-caption" aria-hidden="false"></div>\n      </div>';

    document.body.appendChild(overlay);

    var lbMedia = overlay.querySelector('.lightbox-media');
    var lbCaption = overlay.querySelector('.lightbox-caption');
    var lbClose = overlay.querySelector('.lightbox-close');
    var lastFocused = null;

    function openLightbox(content, caption) {
      lastFocused = document.activeElement;
      
      // Clear previous content
      lbMedia.innerHTML = '';
      
      // Handle both image URLs and SVG elements
      if (typeof content === 'string') {
        // It's an image source URL
        var img = document.createElement('img');
        img.src = content;
        img.alt = caption || '';
        lbMedia.appendChild(img);
      } else if (content instanceof SVGElement) {
        // It's an SVG element - clone and append
        lbMedia.appendChild(content.cloneNode(true));
      }
      
      lbCaption.textContent = caption || '';
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      lbClose.focus();
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      lbMedia.innerHTML = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Delegate clicks on images and SVGs with preview intent
    document.body.addEventListener('click', function(e) {
      var element = e.target.closest && e.target.closest('.alt-media-img, .figure img, .figure svg, svg[data-lightbox]');
      if (!element) return;
      e.preventDefault();
      
      var caption = '';
      var captionEl = null;
      
      if (element.tagName.toLowerCase() === 'svg') {
        // It's an SVG element
        captionEl = element.closest('.alt-media') ? element.closest('.alt-media').querySelector('.caption') : 
                     element.closest('.figure') ? element.closest('.figure').querySelector('.caption') : null;
        caption = captionEl ? captionEl.textContent.trim() : '';
        openLightbox(element, caption);
      } else {
        // It's an img element
        var full = element.getAttribute('data-full') || element.src;
        captionEl = element.closest('.alt-media') ? element.closest('.alt-media').querySelector('.caption') : 
                    element.closest('.figure') ? element.closest('.figure').querySelector('.caption') : null;
        caption = captionEl ? captionEl.textContent.trim() : '';
        openLightbox(full, caption);
      }
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
    // Tabs
    initTabs();
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
