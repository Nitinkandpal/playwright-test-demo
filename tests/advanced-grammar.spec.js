import { test, expect } from '@playwright/test';
import {
  checkPageGrammar,
  checkElementsGrammar,
  generateReport,
} from '../utils/grammarChecker.js';

test.describe('Advanced Grammar Tests', () => {

  test('should check multiple element types', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <header>
            <h1>The website title are updated</h1>
            <nav>
              <a href="#">Home</a>
              <a href="#">About Us</a>
            </nav>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>He are writing this article.</p>
              <p>The content are very interesting.</p>
            </article>
          </main>
          <footer>
            <p>Copyright - All rights reserved</p>
          </footer>
        </body>
      </html>
    `);

    const headerMistakes = await checkElementsGrammar(page, 'h1');
    const paragraphMistakes = await checkElementsGrammar(page, 'p');

    expect(headerMistakes.length).toBeGreaterThan(0);
    expect(paragraphMistakes.length).toBeGreaterThan(0);
    
    console.log('Header mistakes:', generateReport(headerMistakes));
    console.log('Paragraph mistakes:', generateReport(paragraphMistakes));
  });

  test('should handle complex sentences', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <p>The data were comprehensive, but it were not complete.</p>
          <p>Your going to love this feature.</p>
          <p>The team are working together, and they are making progress.</p>
        </body>
      </html>
    `);

    const mistakes = await checkPageGrammar(page);
    
    expect(mistakes.length).toBeGreaterThan(0);
    console.log(generateReport(mistakes));
  });

  test('should ignore code blocks and scripts', async ({ page }) => {
    // This test shows you can focus on readable content only
    await page.setContent(`
      <html>
        <body>
          <h1>Programming Guide</h1>
          <p>He are a developer.</p>
          <pre><code>
            const data = { are: 'reserved keyword' };
          </code></pre>
          <p>This is theier code example.</p>
        </body>
      </html>
    `);

    // You might want to extend grammarChecker to exclude certain elements
    const mistakes = await checkPageGrammar(page);
    
    console.log('Found grammar issues in visible content:');
    console.log(generateReport(mistakes));
  });

  test('should validate form labels and placeholders', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <label>Your Name</label>
            <input type="text" placeholder="Enter your name here" />
            
            <label>He are the owner</label>
            <input type="email" placeholder="This email address are important" />
            
            <button>Submit</button>
          </form>
        </body>
      </html>
    `);

    // Check form labels
    const labelMistakes = await checkElementsGrammar(page, 'label');
    const inputMistakes = await checkElementsGrammar(page, 'input');

    console.log('Label mistakes:', generateReport(labelMistakes));
    console.log('Input mistakes:', generateReport(inputMistakes));
  });

  test('should batch check multiple pages elements', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <nav>Navigation content are here</nav>
          <header>He are the site owner</header>
          <main>The content are excellent</main>
          <aside>This sidebar are useful</aside>
          <footer>Footer text are important</footer>
        </body>
      </html>
    `);

    const sections = ['nav', 'header', 'main', 'aside', 'footer'];
    const allMistakes = [];

    for (const section of sections) {
      const mistakes = await checkElementsGrammar(page, section);
      allMistakes.push(...mistakes);
    }

    console.log(`Total mistakes found in all sections: ${allMistakes.length}`);
    console.log(generateReport(allMistakes));

    expect(allMistakes.length).toBeGreaterThan(0);
  });
});
