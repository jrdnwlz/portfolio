/**
 * Dynamic Testimonials Loader
 * Fetches and displays approved testimonials from JSON data file
 */
(function() {
  'use strict';

  const testimonialsContainer = document.querySelector('.testimonials');

  if (!testimonialsContainer) return;

  async function loadTestimonials() {
    try {
      const response = await fetch('data/testimonials.json');
      if (!response.ok) throw new Error('Failed to load testimonials');

      const testimonials = await response.json();

      // Filter for approved and featured testimonials
      const featured = testimonials.filter(t => t.approved && t.featured);

      // Sort by timestamp, most recent first
      featured.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Render testimonials
      renderTestimonials(featured);

    } catch (error) {
      console.error('Error loading testimonials:', error);
      // Keep fallback HTML testimonials if fetch fails
    }
  }

  function renderTestimonials(testimonials) {
    if (testimonials.length === 0) return;

    testimonialsContainer.innerHTML = testimonials.map(t => `
      <div class="testimonial">
        <blockquote>
          <p>"${escapeHtml(t.quote)}"</p>
        </blockquote>
        <div class="testimonial-author">
          <strong>${escapeHtml(t.author)}</strong>
          <span class="muted">${escapeHtml(t.role)}</span>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Load testimonials on page load
  loadTestimonials();

})();
