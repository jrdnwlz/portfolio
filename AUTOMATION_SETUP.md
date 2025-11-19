# Testimonials Automation Setup Guide

This guide explains how to automate testimonial additions using GitHub Actions and Formspree webhooks.

---

## 🎯 Three Automation Options

### Option 1: Manual GitHub Action (Easiest) ⭐ RECOMMENDED

**Best for:** Simple workflow, full control, no external services needed

**How it works:**
1. Receive testimonial email from Formspree
2. Go to GitHub Actions tab
3. Manually trigger workflow with testimonial details
4. Auto-commits to repository

**Setup:**
- ✅ Already configured in `.github/workflows/email-to-testimonial.yml`
- ✅ No additional setup required
- ✅ Works immediately

**Usage:**
1. Check your email for new Formspree submission
2. Go to: `https://github.com/YOUR_USERNAME/portfolio/actions`
3. Click "Email to Testimonial (Manual Trigger)"
4. Click "Run workflow"
5. Fill in the form fields from the submission
6. Choose whether to auto-approve
7. Click "Run workflow" button
8. Done! Changes auto-commit and deploy

---

### Option 2: Formspree Webhook + Vercel Function (Fully Automated)

**Best for:** High volume, zero manual work

**How it works:**
1. User submits testimonial
2. Formspree sends webhook to your serverless function
3. Function triggers GitHub Action
4. Auto-commits to repository (pending approval)

**Setup:**

#### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Step 2: Set Environment Variables in Vercel
```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=yourusername/portfolio
```

**Creating GitHub Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy token and add to Vercel

#### Step 3: Configure Formspree Webhook
1. Go to Formspree dashboard
2. Select your form (xdkbdgae)
3. Go to "Integrations" → "Webhooks"
4. Add webhook URL: `https://your-vercel-domain.com/api/formspree-webhook`
5. Save

#### Step 4: Test
Submit a test testimonial and check:
- Vercel function logs
- GitHub Actions tab
- `data/testimonials.json` for new entry

---

### Option 3: Zapier/Make.com Integration (No-Code)

**Best for:** Non-technical users, visual workflow builder

**How it works:**
1. Formspree → Zapier/Make.com trigger
2. Parse submission data
3. Make HTTP request to GitHub API
4. Create pull request or commit directly

**Setup:**
1. Create Zapier account
2. New Zap: Formspree → GitHub
3. Configure trigger: New Formspree submission
4. Configure action: Create file in GitHub
5. Map fields to JSON format
6. Test and activate

---

## 🛠️ Files Overview

### GitHub Actions Workflows

**`.github/workflows/add-testimonial.yml`**
- Triggered by repository dispatch events
- Used with Option 2 (webhook automation)

**`.github/workflows/email-to-testimonial.yml`**
- Manually triggered from GitHub UI
- Used with Option 1 (manual workflow)

### Scripts

**`.github/scripts/add-testimonial.js`**
- Node.js script that adds testimonial to JSON
- Generates unique ID
- Handles approval status
- Sorts by timestamp

### API Functions

**`api/formspree-webhook.js`**
- Vercel serverless function
- Receives Formspree webhook
- Triggers GitHub Action via repository dispatch

---

## 📊 Comparison

| Feature | Manual Action | Webhook + Vercel | Zapier |
|---------|--------------|------------------|--------|
| Setup Time | 0 min | 30 min | 20 min |
| Cost | Free | Free tier | Free tier |
| Automation | Partial | Full | Full |
| Control | High | Medium | Medium |
| Maintenance | None | Low | Low |
| Approval Flow | Manual | Configurable | Configurable |

---

## 🚀 Recommended Workflow

**For Most Users (Option 1):**

1. **Receive Notification:**
   - Formspree emails you when testimonial submitted

2. **Review Submission:**
   - Read the testimonial
   - Decide if you want to approve/feature it

3. **Add via GitHub:**
   - Go to Actions tab
   - Run "Email to Testimonial" workflow
   - Copy/paste details from email
   - Set auto_approve to true/false

4. **Done:**
   - Changes commit automatically
   - Site deploys with new testimonial

**Time per testimonial:** ~2 minutes

---

## 🔒 Security & Approval

### Default Behavior
- All new testimonials: `approved: false`, `featured: false`
- You manually approve in admin interface or GitHub Action

### Auto-Approval
- Set `auto_approve: true` in GitHub Action
- Only for trusted submitters
- Testimonial goes live immediately

### Trusted Submitter List
Add to `.github/scripts/add-testimonial.js`:

```javascript
const trustedEmails = [
  'colleague@company.com',
  'trusted@email.com'
];

const auto_approve = trustedEmails.includes(email);
```

---

## 🐛 Troubleshooting

### GitHub Action Fails
- Check permissions: Settings → Actions → General → Workflow permissions → Read and write
- Verify `data/testimonials.json` exists
- Check Node.js script for syntax errors

### Webhook Not Triggering
- Verify Vercel function is deployed
- Check Vercel logs for errors
- Verify GitHub token has `repo` scope
- Check Formspree webhook URL is correct

### JSON Syntax Errors
- Run admin interface validation
- Check for unescaped quotes in testimonial text
- Ensure valid JSON structure

---

## 📝 Manual Override

If automation fails, you can always:

1. Open `data/testimonials.json`
2. Add testimonial manually
3. Validate JSON in admin interface
4. Commit and push

---

## 🎉 Next Steps

1. **Choose your option** (we recommend Option 1 to start)
2. **Test with a submission** from yourself
3. **Monitor for 1-2 weeks** to ensure smooth operation
4. **Upgrade to full automation** (Option 2) if needed

---

## 💡 Pro Tips

- **Create email filter** in Gmail/Outlook for Formspree notifications
- **Use GitHub mobile app** to approve testimonials on-the-go
- **Set up protected branch** to require approval before deployment
- **Create template responses** for thanking submitters

---

**Questions?** Review the workflow files in `.github/workflows/` or the admin interface at `admin-testimonials.html`.
