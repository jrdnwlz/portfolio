# Testimonials Management Workflow

This document explains how the dynamic testimonials system works and how to add new testimonials to your portfolio.

## How It Works

### Architecture

1. **Submission Form** ([submit-testimonial.html](submit-testimonial.html))
   - Users submit testimonials via Formspree
   - Two modes: Free Form and Mad Libs
   - Submissions go to: `https://formspree.io/f/xdkbdgae`

2. **Data Storage** ([data/testimonials.json](data/testimonials.json))
   - JSON file stores all approved testimonials
   - Fields: `id`, `quote`, `author`, `role`, `featured`, `approved`, `timestamp`

3. **Dynamic Display** ([assets/js/testimonials.js](assets/js/testimonials.js))
   - JavaScript fetches JSON on page load
   - Filters for `approved: true` and `featured: true`
   - Renders testimonials dynamically on homepage

4. **Admin Interface** ([admin-testimonials.html](admin-testimonials.html))
   - Review current testimonials
   - Edit JSON with validation
   - Copy/download updated file

---

## Adding New Testimonials

### Step 1: Check Formspree for Submissions

1. Go to your [Formspree dashboard](https://formspree.io/forms/xdkbdgae/submissions)
2. Review new testimonial submissions
3. Copy the details you want to add

### Step 2: Use the Admin Interface

1. Open [admin-testimonials.html](http://localhost:8000/admin-testimonials.html) in your browser
2. The current testimonials JSON will load automatically
3. Add a new testimonial entry using this template:

```json
{
  "id": 4,
  "quote": "Paste the testimonial text here",
  "author": "First Last",
  "role": "Title, Company Name",
  "featured": true,
  "approved": true,
  "timestamp": "2024-11-19T12:00:00Z"
}
```

### Step 3: Validate and Save

1. Click **Validate JSON** to check for errors
2. If valid, click **Copy to Clipboard** or **Download File**
3. Save the updated JSON to `data/testimonials.json`

### Step 4: Deploy

```bash
git add data/testimonials.json
git commit -m "Add new testimonial from [Author Name]"
git push
```

The testimonials will update automatically on your live site!

---

## JSON Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Number | Yes | Unique identifier (increment from last ID) |
| `quote` | String | Yes | The testimonial text |
| `author` | String | Yes | Person's full name |
| `role` | String | Yes | Title and company (e.g., "VP of Product, Sonatype") |
| `featured` | Boolean | Yes | `true` to show on homepage, `false` to hide |
| `approved` | Boolean | Yes | `true` to publish, `false` to keep private |
| `timestamp` | String | Yes | ISO 8601 date (e.g., "2024-11-19T12:00:00Z") |

---

## Managing Testimonials

### To Feature a Testimonial on Homepage:
```json
{
  "featured": true,
  "approved": true
}
```

### To Approve But Not Feature:
```json
{
  "featured": false,
  "approved": true
}
```

### To Keep Private (Not Show):
```json
{
  "featured": false,
  "approved": false
}
```

---

## Example: Adding a New Testimonial

**Formspree Submission:**
- Name: Alex Johnson
- Title: Product Manager
- Company: TechCorp
- Testimonial: "Jordan's design leadership transformed our product. She delivered a scalable design system in record time."

**JSON Entry:**
```json
{
  "id": 4,
  "quote": "Jordan's design leadership transformed our product. She delivered a scalable design system in record time.",
  "author": "Alex Johnson",
  "role": "Product Manager, TechCorp",
  "featured": true,
  "approved": true,
  "timestamp": "2024-11-19T14:30:00Z"
}
```

Add this to the array in `data/testimonials.json`, save, commit, and push!

---

## Tips

- **Always validate JSON** before saving to avoid syntax errors
- **Increment IDs** sequentially (4, 5, 6, etc.)
- **Use current timestamp** in ISO 8601 format
- **Edit quotes for clarity** if needed (with permission)
- **Keep backups** of testimonials.json before major edits
- **Test locally** before pushing to production

---

## Fallback Behavior

If the JSON file fails to load (network error, syntax error, etc.), the homepage will keep the hardcoded HTML testimonials as a fallback. This ensures the page always displays something.

---

## Future Enhancements

Consider adding:
- Automated Formspree webhook integration
- Server-side approval workflow
- Testimonial rotation/randomization
- Search/filter in admin interface
- Export to CSV/PDF

---

**Questions?** Review the code in:
- [assets/js/testimonials.js](assets/js/testimonials.js) - Dynamic loader
- [admin-testimonials.html](admin-testimonials.html) - Admin interface
- [data/testimonials.json](data/testimonials.json) - Data storage
