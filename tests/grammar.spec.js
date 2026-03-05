import { test, expect } from '@playwright/test';
import {
  checkPageGrammar,
  checkElementsGrammar,
  generateReport,
  extractPageText,
} from '../utils/grammarChecker.js';

test.describe('Grammar Checker Tests', () => {
  
  test('should detect grammar mistakes on page', async ({ page }) => {
    // Navigate to a test page with intentional grammar mistakes
    await page.goto('https://example.com');
    
    // Check for grammar mistakes
    const mistakes = await checkPageGrammar(page);
    
    // Log results
    console.log(generateReport(mistakes));
    
    // You can add assertions based on your requirements
    // For example, assert that no critical mistakes are found
    const criticalMistakes = mistakes.filter(m => m.category === 'subjectVerbAgreement');
    expect(criticalMistakes.length).toBe(0);
  });

  test('should find subject-verb agreement mistakes', async ({ page }) => {
    // Create a test page with intentional mistakes
    await page.setContent(`
      <html>
        <body>
          <h1>Grammar Test Page</h1>
          <p>He are going to the store.</p>
          <p>She are very smart.</p>
          <p>The cats is playing.</p>
        </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    
    // Should find subject-verb agreement mistakes
    const svMistakes = mistakes.filter(m => m.category === 'subjectVerbAgreement');
    expect(svMistakes.length).toBeGreaterThan(0);
  });

  test('should find spelling mistakes', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Spelling Test</h1>
          <p>This is theier house.</p>
          <p>I love teh coffee.</p>
        </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    const spellingMistakes = mistakes.filter(m => m.category === 'spelling');
    
    expect(spellingMistakes.length).toBeGreaterThan(0);
    expect(spellingMistakes.some(m => m.mistake.toLowerCase().includes('theier'))).toBeTruthy();
  });

  test('should find article mistakes', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Article Test</h1>
          <p>I saw a apple in the tree.</p>
          <p>He is an student.</p>
        </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    const articleMistakes = mistakes.filter(m => m.category === 'articles');
    
    expect(articleMistakes.length).toBeGreaterThan(0);
  });

  test('should check specific elements for grammar', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div class="content">
            <p class="intro">He are the best student in class.</p>
            <p class="body">The team are ready for action.</p>
          </div>
        </body>
      </html>
    `);
    
    const mistakes = await checkElementsGrammar(page, 'p');
    
    expect(mistakes.length).toBeGreaterThan(0);
    console.log(generateReport(mistakes));
  });

  test('should pass grammar check for correct text', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Correct Grammar</h1>
          <p>He is going to the store.</p>
          <p>She is very smart.</p>
          <p>The cats are playing.</p>
        </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    
    // Should have very few or no mistakes
    expect(mistakes.length).toBeLessThan(3);
  });

  test('should extract all page text', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Test Page</h1>
          <p>This is a test paragraph.</p>
          <div>Some additional content.</div>
        </body>
      </html>
    `);
    
    const text = await extractPageText(page);
    
    expect(text).toContain('Test Page');
    expect(text).toContain('This is a test paragraph');
    expect(text).toContain('Some additional content');
  });

  test('should generate comprehensive grammar report', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p>He are going and it are clear.</p>
          <p>This is theier mistake.</p>
        </body>
      </html>
    `);
    
    const mistakes = await checkPageGrammar(page);
    const report = generateReport(mistakes);
    
    expect(report).toContain('Found');
    expect(report).toContain('grammar mistake');
    expect(mistakes.length).toBeGreaterThan(0);
  });
});
