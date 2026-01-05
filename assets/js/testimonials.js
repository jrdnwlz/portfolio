/**
 * Dynamic Testimonials Loader
 * Fetches and displays approved testimonials from JSON data file
 * Includes caching and improved error handling
 */
(function() {
  'use strict';

  const testimonialsContainer = document.querySelector('.testimonials');

  if (!testimonialsContainer) return;

  // Ensure the container is keyboard-focusable (in case markup is changed later)
  if (!testimonialsContainer.hasAttribute('tabindex')) {
    testimonialsContainer.setAttribute('tabindex', '0');
  }
  if (!testimonialsContainer.hasAttribute('aria-label')) {
    testimonialsContainer.setAttribute('aria-label', 'Testimonials — horizontal scroll');
  }

  // Keyboard arrow support: Left/Right scroll the container by ~60% of its width
  testimonialsContainer.addEventListener('keydown', (e) => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const amount = Math.round(testimonialsContainer.clientWidth * 0.6) || 300;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      testimonialsContainer.scrollBy({ left: amount, behavior: isReduced ? 'auto' : 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      testimonialsContainer.scrollBy({ left: -amount, behavior: isReduced ? 'auto' : 'smooth' });
    }
  });

  // Scroll navigation buttons (prev/next)
  const prevBtn = document.querySelector('.testimonials-nav.prev');
  const nextBtn = document.querySelector('.testimonials-nav.next');

  function updateNavState() {
    if (!prevBtn || !nextBtn) return;
    const atStart = testimonialsContainer.scrollLeft <= 1;
    const atEnd = testimonialsContainer.scrollLeft + testimonialsContainer.clientWidth >= testimonialsContainer.scrollWidth - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  if (prevBtn && nextBtn) {
    const getAmount = () => Math.round(testimonialsContainer.clientWidth * 0.6) || 300;

    prevBtn.addEventListener('click', () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      testimonialsContainer.scrollBy({ left: -getAmount(), behavior: isReduced ? 'auto' : 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      testimonialsContainer.scrollBy({ left: getAmount(), behavior: isReduced ? 'auto' : 'smooth' });
    });

    testimonialsContainer.addEventListener('scroll', updateNavState);
    window.addEventListener('resize', updateNavState);

    // initialize after potential image/layout load
    setTimeout(updateNavState, 100);
  }

  const CACHE_KEY = 'testimonials_cache';
  const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  async function loadTestimonials() {
    try {
      // Check cache first
      const cached = getCachedData();
      if (cached) {
        renderTestimonials(cached);
        return;
      }

      const response = await fetch('data/testimonials.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const testimonials = await response.json();

      // Filter for approved and featured testimonials
      const featured = testimonials.filter(t => t.approved && t.featured);

      // Sort by timestamp, most recent first
      featured.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Cache the data
      setCachedData(featured);

      // Render testimonials
      renderTestimonials(featured);

    } catch (error) {
      console.error('Error loading testimonials:', error);
      // Keep fallback HTML testimonials if fetch fails
      showFallbackMessage();
    }
  }

  function getCachedData() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  function setCachedData(data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  function showFallbackMessage() {
    // Silently fail - keep any existing HTML testimonials
    console.info('Using fallback testimonials from HTML');
  }

  function renderTestimonials(testimonials) {
    // Only replace if we have testimonials to show
    if (testimonials.length === 0) {
      console.info('No featured testimonials found, keeping fallback HTML');
      return;
    }

    // Truncate quote for card display (first 150 characters)
    const truncateQuote = (quote) => {
      if (quote.length <= 150) return quote;
      return quote.substring(0, 150) + '...';
    };

    // Add fade-out transition before replacing content
    testimonialsContainer.style.opacity = '0';
    testimonialsContainer.style.transition = 'opacity 0.2s ease-in-out';

    // Wait for fade-out, then replace content
    setTimeout(() => {
      testimonialsContainer.innerHTML = testimonials.map((t, index) => `
        <div class="testimonial" data-index="${index}">
          <blockquote>
            <p class="testimonial-quote">${escapeHtml(truncateQuote(t.quote))}</p>
          </blockquote>
          <div class="testimonial-author">
            <strong>${escapeHtml(t.author)}</strong>
            <span class="muted">${escapeHtml(t.role)}</span>
          </div>
        </div>
      `).join('');

      // Add click handlers to open dialog
      testimonialsContainer.querySelectorAll('.testimonial').forEach((card, index) => {
        card.addEventListener('click', () => {
          openTestimonialDialog(testimonials[index]);
        });

        // Add keyboard support
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Read full testimonial from ${testimonials[index].author}`);

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openTestimonialDialog(testimonials[index]);
          }
        });
      });

      // Fade in the new content
      testimonialsContainer.style.opacity = '1';
    }, 200);
  }

  function openTestimonialDialog(testimonial) {
    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.className = 'testimonial-dialog';

    // Format quote with line breaks preserved
    const formattedQuote = escapeHtml(testimonial.quote).replace(/\n/g, '<br><br>');

    dialog.innerHTML = `
      <div class="dialog-content">
        <button class="dialog-close" aria-label="Close dialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <blockquote class="dialog-quote">
          <p>"${formattedQuote}"</p>
        </blockquote>
        <div class="dialog-author">
          <strong>${escapeHtml(testimonial.author)}</strong>
          <span class="muted">${escapeHtml(testimonial.role)}</span>
          ${testimonial.company ? `<span class="muted">${escapeHtml(testimonial.company)}</span>` : ''}
        </div>
        ${testimonial.timestamp ? `<time class="dialog-date muted">${formatDate(testimonial.timestamp)}</time>` : ''}
      </div>
    `;

    document.body.appendChild(dialog);

    // Close handlers
    const closeBtn = dialog.querySelector('.dialog-close');
    closeBtn.addEventListener('click', () => {
      dialog.close();
      dialog.remove();
    });

    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
        dialog.remove();
      }
    });

    // Close on Escape key
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dialog.close();
        dialog.remove();
      }
    });

    // Show dialog with animation
    dialog.showModal();
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Load testimonials on page load
  loadTestimonials();

})();
