import { test, expect } from '@playwright/test';
import { checkPageGrammar, generateReport } from '../utils/grammarChecker.js';

// Example test that checks a real website
test.describe('Real Website Grammar Tests', () => {
  
  test('should check example.com for grammar', async ({ page }) => {
    // Example: Change this to your target website
    await page.goto('https://example.com');
    
    const mistakes = await checkPageGrammar(page);
    
    if (mistakes.length > 0) {
      console.log('\n=== GRAMMAR MISTAKES FOUND ===');
      console.log(generateReport(mistakes));
    } else {
      console.log('✅ No grammar mistakes detected!');
    }
    
    // You can add assertions or just report
    // expect(mistakes.length).toBe(0); // Fail if mistakes found
  });

  test('should test custom webpage with intentional errors', async ({ page }) => {
    // Load a test page with known grammar mistakes
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Grammar Test Page</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .error { color: red; }
          .correct { color: green; }
        </style>
      </head>
      <body>
        <h1>Grammar Checker Test Page</h1>
        
        <section>
          <h2>Common Mistakes</h2>
          
          <h3>Subject-Verb Agreement</h3>
          <p class="error">He are the manager of this team.</p>
          <p class="error">She are very talented in her field.</p>
          <p class="correct">They are working together on the project.</p>
          
          <h3>Spelling Mistakes</h3>
          <p class="error">This is theier office space.</p>
          <p class="error">I love drinking teh coffee every morning.</p>
          <p class="correct">Their office is very nice.</p>
          
          <h3>Article Usage</h3>
          <p class="error">I saw a elephant at the zoo.</p>
          <p class="error">He is an developer with 10 years experience.</p>
          <p class="correct">She is an excellent teacher.</p>
          
          <h3>Correct Sentences</h3>
          <p>The team is ready for the presentation.</p>
          <p>She works efficiently and delivers quality results.</p>
          <p>We are committed to excellence.</p>
        </section>
        
        <footer>
          <p>End of grammar test page.</p>
        </footer>
      </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    
    console.log('\n=== COMPLETE TEST REPORT ===');
    console.log(generateReport(mistakes));
    
    // Assertions
    expect(mistakes.length).toBeGreaterThan(0);
    
    // Count mistakes by category
    const categories = {};
    mistakes.forEach(m => {
      categories[m.category] = (categories[m.category] || 0) + 1;
    });
    
    console.log('\n=== MISTAKES BY CATEGORY ===');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`${cat}: ${count}`);
    });
  });
});
