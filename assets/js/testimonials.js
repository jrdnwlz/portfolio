/**
 * Dynamic Testimonials Loader
 * Fetches and displays approved testimonials from JSON data file
 * Includes caching and improved error handling
 */
(function() {
  'use strict';

  const testimonialsContainer = document.querySelector('.testimonials');

  if (!testimonialsContainer) return;

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
  }

  function renderTestimonials(testimonials) {
    if (testimonials.length === 0) return;

    testimonialsContainer.innerHTML = testimonials.map((t, index) => `
      <div class="testimonial" data-index="${index}">
        <blockquote>
          <p class="testimonial-quote">${escapeHtml(t.quote)}</p>
        </blockquote>
        <div class="testimonial-author">
          <strong>${escapeHtml(t.author)}</strong>
          <span class="muted">${escapeHtml(t.role)}</span>
        </div>
      </div>
    `).join('');

    // Add click handlers for expansion
    testimonialsContainer.querySelectorAll('.testimonial').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Load testimonials on page load
  loadTestimonials();

})();
