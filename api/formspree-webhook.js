/**
 * Formspree Webhook Handler (Vercel Serverless Function)
 * Receives testimonial submissions and triggers GitHub Action
 *
 * Setup:
 * 1. Deploy to Vercel (or any serverless platform)
 * 2. Get the webhook URL: https://yourdomain.com/api/formspree-webhook
 * 3. Add to Formspree webhook settings
 * 4. Set GITHUB_TOKEN and GITHUB_REPO in Vercel environment variables
 */

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      testimonial,
      name,
      title,
      company,
      email,
      submission_mode,
      template
    } = req.body;

    // Validate required fields
    if (!testimonial || !name || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Trigger GitHub Action via repository dispatch
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO; // Format: "username/repo"

    if (!githubToken || !githubRepo) {
      console.error('Missing GitHub credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const response = await fetch(
      `https://api.github.com/repos/${githubRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'new-testimonial',
          client_payload: {
            testimonial,
            name,
            title,
            company: company || null,
            email: email || null,
            submission_mode: submission_mode || 'Unknown',
            template: template || null,
            auto_approve: false // Set to true for trusted submitters
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API error:', error);
      return res.status(500).json({ error: 'Failed to trigger GitHub Action' });
    }

    // Log success
    console.log(`✓ Testimonial from ${name} queued for processing`);

    return res.status(200).json({
      success: true,
      message: 'Testimonial received and queued for review'
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
