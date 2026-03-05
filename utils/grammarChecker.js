/**
 * Grammar Check Utilities
 * Contains helper functions for detecting grammar mistakes
 */

// Common grammar mistakes patterns
const grammarPatterns = {
  // Subject-verb agreement
  subjectVerbAgreement: [
    { pattern: /\b(he|she|it|this|that)\s+are\b/gi, error: 'Subject-verb mismatch: singular subject with plural verb "are"' },
    { pattern: /\b(I|we|you|they|these|those)\s+is\b/gi, error: 'Subject-verb mismatch: plural subject with singular verb "is"' },
  ],
  
  // Common spelling mistakes
  spelling: [
    { pattern: /\btheier\b/gi, error: 'Spelling: "theier" should be "their"' },
    { pattern: /\byour\s+going/gi, error: 'Grammar: "your going" should be "you\'re going"' },
    { pattern: /\bits\s+(\w+ing)/gi, error: 'Grammar: "its" should be "it\'s" before verb' },
    { pattern: /\bteh\b/gi, error: 'Spelling: "teh" should be "the"' },
    { pattern: /\breciever\b/gi, error: 'Spelling: "reciever" should be "receiver"' },
  ],
  
  // Article misuse
  articles: [
    { pattern: /\ba\s+[aeiou]/gi, error: 'Article: "a" should be "an" before vowels' },
    { pattern: /\ban\s+[^aeiou]/gi, error: 'Article: "an" should be "a" before consonants' },
  ],
  
  // Common misused words
  misusedWords: [
    { pattern: /\baffect\s+(the|a|an|to)/gi, error: 'Word choice: "affect" should be "effect" (noun)' },
    { pattern: /\baccept\s+(to|it|that)/gi, error: 'Word choice: "accept" vs "except"' },
  ],
};

/**
 * Extract all text content from a page
 * @param {Page} page - Playwright page object
 * @returns {Promise<string>} Text content of the page
 */
export async function extractPageText(page) {
  return await page.evaluate(() => {
    const body = document.body;
    return body ? body.innerText : '';
  });
}

/**
 * Get all visible text nodes from the page
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of text elements with their locations
 */
export async function getTextElements(page) {
  return await page.evaluate(() => {
    const elements = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text.length > 0) {
        elements.push({
          text: text,
          element: node.parentElement.tagName,
          class: node.parentElement.className,
        });
      }
    }
    return elements;
  });
}

/**
 * Find grammar mistakes in text
 * @param {string} text - Text to check
 * @returns {Array} Array of found mistakes
 */
export function findGrammarMistakes(text) {
  const mistakes = [];

  // Check all grammar patterns
  for (const [category, patterns] of Object.entries(grammarPatterns)) {
    patterns.forEach(({ pattern, error }) => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        mistakes.push({
          category,
          error,
          mistake: match[0],
          line: text.substring(0, match.index).split('\n').length,
          position: match.index,
        });
      }
    });
  }

  return mistakes;
}

/**
 * Check page for grammar mistakes
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of grammar mistakes found
 */
export async function checkPageGrammar(page) {
  const pageText = await extractPageText(page);
  return findGrammarMistakes(pageText);
}

/**
 * Check specific elements for grammar mistakes
 * @param {Page} page - Playwright page object
 * @param {string} selector - CSS selector for elements to check
 * @returns {Promise<Array>} Array of grammar mistakes found
 */
export async function checkElementsGrammar(page, selector) {
  const elements = await page.$$eval(selector, (els) => {
    return els.map(el => ({
      text: el.innerText,
      selector: el.className || el.id,
    }));
  });

  const mistakes = [];
  elements.forEach((el) => {
    const found = findGrammarMistakes(el.text);
    found.forEach(mistake => {
      mistakes.push({
        ...mistake,
        element: el.selector,
      });
    });
  });

  return mistakes;
}

/**
 * Generate a report of grammar mistakes
 * @param {Array} mistakes - Array of mistakes found
 * @returns {string} Formatted report
 */
export function generateReport(mistakes) {
  if (mistakes.length === 0) {
    return 'No grammar mistakes found!';
  }

  let report = `Found ${mistakes.length} grammar mistake(s):\n\n`;
  
  mistakes.forEach((mistake, index) => {
    report += `${index + 1}. [${mistake.category}] ${mistake.error}\n`;
    report += `   Mistake: "${mistake.mistake}"\n`;
    report += `   Position: Line ${mistake.line}\n`;
    if (mistake.element) {
      report += `   Element: ${mistake.element}\n`;
    }
    report += '\n';
  });

  return report;
}
