#!/usr/bin/env node

/**
 * Local Testimonial Addition Script
 * Run this locally to add testimonials without GitHub Actions
 *
 * Usage:
 *   node scripts/add-testimonial-local.js
 *
 * Then follow the prompts!
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🎉 Add New Testimonial\n');

  // Gather information
  const testimonial = await question('Testimonial text: ');
  const name = await question('Author name: ');
  const title = await question('Author title: ');
  const company = await question('Company (optional, press Enter to skip): ');
  const featured = await question('Feature on homepage? (y/n): ');
  const approved = await question('Approve and publish? (y/n): ');

  // Validate
  if (!testimonial || !name || !title) {
    console.error('\n❌ Error: testimonial, name, and title are required');
    rl.close();
    process.exit(1);
  }

  // Load current testimonials
  const testimonialsPath = path.join(__dirname, '../data/testimonials.json');
  let testimonials = [];

  try {
    testimonials = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading testimonials.json:', error.message);
    rl.close();
    process.exit(1);
  }

  // Generate new ID
  const maxId = testimonials.reduce((max, t) => Math.max(max, t.id), 0);
  const newId = maxId + 1;

  // Create role string
  const role = company ? `${title}, ${company}` : title;

  // Create new testimonial entry
  const newTestimonial = {
    id: newId,
    quote: testimonial,
    author: name,
    role: role,
    featured: featured.toLowerCase() === 'y',
    approved: approved.toLowerCase() === 'y',
    timestamp: new Date().toISOString()
  };

  // Add to array
  testimonials.push(newTestimonial);

  // Sort by timestamp (newest first)
  testimonials.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Save back to file
  try {
    fs.writeFileSync(testimonialsPath, JSON.stringify(testimonials, null, 2) + '\n');
    console.log(`\n✅ Successfully added testimonial #${newId} from ${name}`);
    console.log(`   Status: ${newTestimonial.approved ? 'Approved' : 'Pending'}`);
    console.log(`   Featured: ${newTestimonial.featured ? 'Yes' : 'No'}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes in data/testimonials.json');
    console.log('   2. git add data/testimonials.json');
    console.log(`   3. git commit -m "Add testimonial from ${name}"`);
    console.log('   4. git push\n');
  } catch (error) {
    console.error('\n❌ Error saving testimonials.json:', error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

main();
