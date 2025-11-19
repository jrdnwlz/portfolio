# Formspree Integration Setup

This guide will help you complete the Formspree integration for the testimonial submission page.

## Step 1: Get Your Formspree Form ID

1. Go to [Formspree.io](https://formspree.io) and sign in to your account
2. Create a new form or use an existing one
3. Copy your Form ID (it looks like `xvgpqrst` or similar)

## Step 2: Update the Form Actions

Replace `YOUR_FORM_ID` in **submit-testimonial.html** with your actual Formspree Form ID:

**Line 62:** (Free Form mode)
```html
<form id="testimonial-form" class="testimonial-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Line 118:** (Mad Libs mode)
```html
<form id="madlibs-form" class="testimonial-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Change both instances to:
```html
action="https://formspree.io/f/xvgpqrst"
```
(Replace `xvgpqrst` with your actual Form ID)

## Step 3: Configure Formspree Settings (Optional)

In your Formspree dashboard, you can configure:

- **Email notifications**: Get notified when testimonials are submitted
- **Spam protection**: Enable reCAPTCHA or honeypot protection
- **Redirect URL**: Set a custom thank-you page (optional, we handle this with JavaScript)
- **Webhooks**: Send submissions to other services

## Form Fields

The form will send the following fields to Formspree:

### Free Form Mode:
- `testimonial` - The testimonial text
- `name` - Submitter's name
- `title` - Submitter's title
- `company` - Company name (optional)
- `email` - Email address (optional)
- `permission` - Checkbox confirmation
- `submission_mode` - "Free Form"

### Mad Libs Mode:
- `testimonial` - Generated text from template
- `name` - Submitter's name
- `title` - Submitter's title
- `company` - Company name (optional)
- `email` - Email address (optional)
- `permission` - Checkbox confirmation
- `submission_mode` - "Mad Libs"
- `template` - Which template was used

## Testing

1. After updating the Form IDs, open `submit-testimonial.html` in your browser
2. Fill out either form mode
3. Submit the form
4. Check your Formspree dashboard to see the submission
5. You should see the confetti celebration on success!

## Backup Storage

All submissions are also saved to `localStorage` as a backup with the key `lastTestimonial`. This ensures you never lose a testimonial even if the submission fails.

## Troubleshooting

**Form not submitting:**
- Check that you've replaced `YOUR_FORM_ID` with your actual Formspree ID
- Check browser console for errors
- Verify your Formspree form is active in the dashboard

**Not receiving emails:**
- Check your Formspree notification settings
- Check spam folder
- Verify your email in Formspree dashboard

**CORS errors:**
- Formspree handles CORS automatically, but make sure you're testing on a proper domain (not `file://`)
- Use the local dev server: `python3 -m http.server 8000`

## Features Included

✅ AJAX submission (no page reload)
✅ Success animation with confetti
✅ Error handling with friendly messages
✅ Auto-save draft feature
✅ LocalStorage backup of submissions
✅ Two submission modes (Free Form & Mad Libs)
✅ Live preview functionality
✅ Character counter with personality

Enjoy your fun testimonial submission page! 🎉
