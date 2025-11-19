/**
 * Testimonial Form Interactions
 * Handles mode switching, mad libs, preview, and form submission
 */
(function() {
  'use strict';

  // Mode switching
  const modeBtns = document.querySelectorAll('.mode-btn');
  const freeformMode = document.getElementById('freeform-mode');
  const madlibsMode = document.getElementById('madlibs-mode');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      // Update active button
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide modes
      if (mode === 'freeform') {
        freeformMode.style.display = 'block';
        madlibsMode.style.display = 'none';
      } else {
        freeformMode.style.display = 'none';
        madlibsMode.style.display = 'block';
      }
    });
  });

  // Character counter with personality
  const testimonialText = document.getElementById('testimonial-text');
  const charCount = document.getElementById('char-count');
  const charEncouragement = document.getElementById('char-encouragement');

  const encouragementMessages = [
    { min: 0, max: 50, msg: " — Just getting warmed up! Keep going! 💪" },
    { min: 51, max: 100, msg: " — Nice start! Tell me more! 🌟" },
    { min: 101, max: 200, msg: " — Now we're talking! ✨" },
    { min: 201, max: 300, msg: " — This is great! You're on fire! 🔥" },
    { min: 301, max: 500, msg: " — Wow, thanks for being so detailed! 🙌" },
    { min: 501, max: 99999, msg: " — Okay you can stop now... just kidding! This is gold! 🏆" }
  ];

  if (testimonialText) {
    testimonialText.addEventListener('input', () => {
      const count = testimonialText.value.length;
      charCount.textContent = count;

      const message = encouragementMessages.find(m => count >= m.min && count <= m.max);
      charEncouragement.textContent = message ? message.msg : '';
    });
  }

  // Mad Libs template switching
  const templateRadios = document.querySelectorAll('input[name="template"]');
  const madlibsFields = document.getElementById('madlibs-fields');

  const templates = {
    template1: [
      { label: 'Working with Jordan was', field: 'adjective', placeholder: 'amazing, transformative, game-changing...' },
      { label: 'He helped us', field: 'achievement', placeholder: 'ship a design system, validate our MVP...' }
    ],
    template2: [
      { label: "Jordan's superpower is", field: 'skill', placeholder: 'rapid prototyping, systems thinking...' },
      { label: 'He turned our', field: 'problem', placeholder: 'messy component library, confusing UX...' },
      { label: 'into', field: 'solution', placeholder: 'a cohesive design system, delightful experience...' }
    ],
    template3: [
      { label: "I'd describe Jordan's work in three words:", field: 'word1', placeholder: 'thoughtful' },
      { label: '', field: 'word2', placeholder: 'efficient' },
      { label: 'and', field: 'word3', placeholder: 'impactful' }
    ],
    template4: [
      { label: "Jordan doesn't just", field: 'verb', placeholder: 'design interfaces' },
      { label: '—he', field: 'betterVerb', placeholder: 'designs systems' },
      { label: 'His', field: 'quality', placeholder: 'attention to accessibility' }
    ]
  };

  function updateMadlibsFields(templateId) {
    const fields = templates[templateId];
    madlibsFields.innerHTML = fields.map(field => `
      <div class="form-group">
        ${field.label ? `<label>${field.label}</label>` : ''}
        <input type="text" class="madlib-input" data-field="${field.field}" placeholder="${field.placeholder}" required/>
      </div>
    `).join('');
  }

  templateRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateMadlibsFields(e.target.value);
    });
  });

  // Preview functionality
  const previewCard = document.getElementById('preview-card');
  const previewText = document.getElementById('preview-text');
  const previewName = document.getElementById('preview-name');
  const previewRole = document.getElementById('preview-role');
  const closePreviewBtn = document.getElementById('close-preview');

  function showPreview(text, name, title, company) {
    previewText.textContent = `"${text}"`;
    previewName.textContent = name || 'Your Name';

    let roleText = title || 'Your Title';
    if (company) {
      roleText += `, ${company}`;
    }
    previewRole.textContent = roleText;

    previewCard.style.display = 'block';
    previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Freeform preview
  const previewBtn = document.getElementById('preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('testimonial-form');
      const text = form.testimonial.value;
      const name = form.name.value;
      const title = form.title.value;
      const company = form.company.value;

      if (!text) {
        alert('Please write your testimonial first! 😊');
        return;
      }

      showPreview(text, name, title, company);
    });
  }

  // Mad Libs preview
  const madlibsPreviewBtn = document.getElementById('madlibs-preview-btn');
  if (madlibsPreviewBtn) {
    madlibsPreviewBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const selectedTemplate = document.querySelector('input[name="template"]:checked').value;
      const inputs = document.querySelectorAll('.madlib-input');
      const values = {};

      inputs.forEach(input => {
        values[input.dataset.field] = input.value || `[${input.placeholder.split(',')[0]}]`;
      });

      let generatedText = '';

      if (selectedTemplate === 'template1') {
        generatedText = `Working with Jordan was ${values.adjective}. He helped us ${values.achievement} in record time.`;
      } else if (selectedTemplate === 'template2') {
        generatedText = `Jordan's superpower is ${values.skill}. He turned our ${values.problem} into ${values.solution}.`;
      } else if (selectedTemplate === 'template3') {
        generatedText = `I'd describe Jordan's work in three words: ${values.word1}, ${values.word2}, and ${values.word3}.`;
      } else if (selectedTemplate === 'template4') {
        generatedText = `Jordan doesn't just ${values.verb}—he ${values.betterVerb}. His ${values.quality} sets a new standard.`;
      }

      const form = document.getElementById('madlibs-form');
      const name = form.name.value;
      const title = form.title.value;
      const company = form.company.value;

      showPreview(generatedText, name, title, company);
    });
  }

  // Close preview
  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', () => {
      previewCard.style.display = 'none';
    });
  }

  // Form submission handlers
  const testimonialForm = document.getElementById('testimonial-form');
  const madlibsForm = document.getElementById('madlibs-form');
  const successOverlay = document.getElementById('success-overlay');

  function showSuccess() {
    successOverlay.style.display = 'flex';

    // Create confetti effect
    createConfetti();
  }

  function createConfetti() {
    const colors = ['#3b82f6', '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#84cc16'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      successOverlay.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }

  async function handleFormSubmit(e, isMadLibs = false) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // If mad libs, generate the testimonial text and add to form
    if (isMadLibs) {
      const selectedTemplate = document.querySelector('input[name="template"]:checked').value;
      const inputs = document.querySelectorAll('.madlib-input');
      const values = {};

      inputs.forEach(input => {
        values[input.dataset.field] = input.value;
      });

      let generatedText = '';

      if (selectedTemplate === 'template1') {
        generatedText = `Working with Jordan was ${values.adjective}. He helped us ${values.achievement} in record time.`;
      } else if (selectedTemplate === 'template2') {
        generatedText = `Jordan's superpower is ${values.skill}. He turned our ${values.problem} into ${values.solution}.`;
      } else if (selectedTemplate === 'template3') {
        generatedText = `I'd describe Jordan's work in three words: ${values.word1}, ${values.word2}, and ${values.word3}.`;
      } else if (selectedTemplate === 'template4') {
        generatedText = `Jordan doesn't just ${values.verb}—he ${values.betterVerb}. His ${values.quality} sets a new standard.`;
      }

      formData.set('testimonial', generatedText);

      // Add mode indicator
      formData.set('submission_mode', 'Mad Libs');
    } else {
      formData.set('submission_mode', 'Free Form');
    }

    // Save to localStorage as backup
    const testimonialData = {
      testimonial: formData.get('testimonial'),
      name: formData.get('name'),
      title: formData.get('title'),
      company: formData.get('company') || '',
      email: formData.get('email') || '',
      mode: formData.get('submission_mode'),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('lastTestimonial', JSON.stringify(testimonialData));

    // Submit to Formspree
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Clear draft on successful submission
        localStorage.removeItem('testimonialDraft');
        showSuccess();
      } else {
        const data = await response.json();
        if (data.errors) {
          alert('Oops! There were some errors: ' + data.errors.map(e => e.message).join(', '));
        } else {
          alert('Oops! There was a problem submitting your testimonial. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Oops! There was a problem submitting your testimonial. Please check your internet connection and try again.');
    }
  }

  if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => handleFormSubmit(e, false));
  }

  if (madlibsForm) {
    madlibsForm.addEventListener('submit', (e) => handleFormSubmit(e, true));
  }

  // Save draft to localStorage on input
  function saveDraft() {
    const activeMode = document.querySelector('.mode-btn.active').dataset.mode;
    const form = activeMode === 'freeform' ? testimonialForm : madlibsForm;

    if (form) {
      const formData = new FormData(form);
      localStorage.setItem('testimonialDraft', JSON.stringify({
        mode: activeMode,
        data: Object.fromEntries(formData),
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Auto-save draft every 5 seconds
  setInterval(saveDraft, 5000);

  // Load draft on page load
  window.addEventListener('DOMContentLoaded', () => {
    const draft = localStorage.getItem('testimonialDraft');
    if (draft) {
      const { mode, data } = JSON.parse(draft);

      // Offer to restore draft
      if (confirm('You have a saved draft. Would you like to restore it?')) {
        // Switch to correct mode
        const modeBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (modeBtn) modeBtn.click();

        // Populate fields
        Object.entries(data).forEach(([key, value]) => {
          const input = document.querySelector(`[name="${key}"]`);
          if (input) {
            if (input.type === 'checkbox') {
              input.checked = value === 'on';
            } else {
              input.value = value;
            }
          }
        });
      }
    }
  });

})();
