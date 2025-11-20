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
    anchorLink: 'a[href^="#"]',
    tabGroup: '[data-tabs]',
    tabButton: '[role="tab"]',
    tabPanel: '[role="tabpanel"]'
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
   * Initialize accessible tab components
   * Follows ARIA Authoring Practices Guide for tabs
   */
  function initTabs() {
    const tabGroups = document.querySelectorAll(SELECTORS.tabGroup);
    if (!tabGroups.length) return;

    tabGroups.forEach(group => {
      const buttons = Array.from(group.querySelectorAll(SELECTORS.tabButton));
      const panels = Array.from(group.querySelectorAll(SELECTORS.tabPanel));

      if (!buttons.length || !panels.length) return;

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Deactivate all tabs
          buttons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
          });

          // Activate clicked tab
          button.setAttribute('aria-selected', 'true');
          button.setAttribute('tabindex', '0');

          // Show corresponding panel
          const targetId = button.getAttribute('aria-controls');
          panels.forEach(panel => {
            panel.hidden = panel.id !== targetId;
          });
        });

        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
          let newIndex = index;

          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            newIndex = (index + 1) % buttons.length;
            e.preventDefault();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            newIndex = (index - 1 + buttons.length) % buttons.length;
            e.preventDefault();
          } else if (e.key === 'Home') {
            newIndex = 0;
            e.preventDefault();
          } else if (e.key === 'End') {
            newIndex = buttons.length - 1;
            e.preventDefault();
          } else {
            return;
          }

          buttons[newIndex].click();
          buttons[newIndex].focus();
        });
      });
    });
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

  /**
   * Initialize all interactions
   */
  function init() {
    // Smooth scrolling for anchor links
    document.body.addEventListener('click', smoothScroll);

    // Tab functionality
    initTabs();

    // Career timeline animations
    initCareerTimeline();

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
