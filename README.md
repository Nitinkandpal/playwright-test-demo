# Playwright Grammar Checker Framework

A comprehensive Playwright JavaScript framework for detecting and reporting grammar mistakes in webpages.

## Features

- ✅ Subject-verb agreement detection
- ✅ Spelling mistake identification
- ✅ Article misuse detection (a/an)
- ✅ Common misused words detection
- ✅ Page-wide grammar checking
- ✅ Element-specific grammar checking
- ✅ Detailed error reporting
- ✅ Support for multiple browsers (Chromium, Firefox, WebKit)

## Project Structure

```
playwright-test-demo/
├── package.json                 # Project dependencies and scripts
├── playwright.config.js         # Playwright configuration
├── utils/
│   └── grammarChecker.js       # Grammar checking utilities and patterns
├── tests/
│   ├── grammar.spec.js         # Basic grammar tests
│   └── advanced-grammar.spec.js # Advanced test scenarios
├── .gitignore                   # Git ignore file
└── README.md                    # This file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Usage

### Run All Tests
```bash
npm test
```

### Run Tests with UI Mode
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Debug Tests
```bash
npm run test:debug
```

### View HTML Report
```bash
npm run report
```

## Grammar Patterns Detected

### 1. Subject-Verb Agreement
- `He/She/It are` → should be `is`
- `I/We/You/They is` → should be `are`

### 2. Spelling Mistakes
- `theier` → `their`
- `teh` → `the`
- `your going` → `you're going`
- `reciever` → `receiver`

### 3. Article Misuse
- `a apple` → should be `an apple`
- `an student` → should be `a student`

### 4. Misused Words
- `affect` vs `effect`
- `accept` vs `except`

## API Reference

### `checkPageGrammar(page)`
Checks entire page for grammar mistakes.

```javascript
const mistakes = await checkPageGrammar(page);
```

**Returns:** Array of mistake objects

### `checkElementsGrammar(page, selector)`
Checks specific elements matching a CSS selector.

```javascript
const mistakes = await checkElementsGrammar(page, 'p');
```

**Returns:** Array of mistake objects with element info

### `extractPageText(page)`
Extracts all visible text from the page.

```javascript
const text = await extractPageText(page);
```

**Returns:** String containing all page text

### `findGrammarMistakes(text)`
Finds grammar mistakes in a given text string.

```javascript
const mistakes = findGrammarMistakes('He are here');
```

**Returns:** Array of mistake objects

### `generateReport(mistakes)`
Generates a human-readable report of mistakes.

```javascript
const report = generateReport(mistakes);
console.log(report);
```

**Returns:** Formatted string report

## Example Test

```javascript
test('should detect subject-verb agreement mistakes', async ({ page }) => {
  await page.setContent(`
    <html>
      <body>
        <p>He are going to the store.</p>
      </body>
    </html>
  `);
  
  const mistakes = await checkPageGrammar(page);
  expect(mistakes.length).toBeGreaterThan(0);
});
```

## Extending Grammar Patterns

To add new grammar patterns, edit `utils/grammarChecker.js`:

```javascript
const grammarPatterns = {
  myCategory: [
    { pattern: /regex pattern/gi, error: 'Error description' },
  ],
};
```

## Test Reports

Playwright generates HTML reports automatically:
- Location: `playwright-report/` directory
- View: `npm run report`

## Configuration

Edit `playwright.config.js` to:
- Change base URL: `baseURL: 'http://your-site.com'`
- Add new browsers
- Adjust timeout settings
- Configure retry policies

## Continuous Integration

The framework is CI-ready:
- Automatic retries in CI environment
- Screenshot on failure
- Trace collection
- HTML report generation

## Tips

1. **Test Specific Pages:** Update the `baseURL` in config or use `page.goto()`
2. **Custom Patterns:** Add regex patterns to match your specific content
3. **Parallel Testing:** Tests run in parallel by default for faster execution
4. **Debug Mode:** Use `--debug` flag to step through tests

## Troubleshooting

### Tests not finding mistakes?
- Verify the grammar pattern is correct
- Check the text content using `extractPageText()`
- Use `test:debug` to inspect

### Browser not launching?
```bash
npx playwright install
```

### Need to target specific environment?
```bash
BASE_URL=https://example.com npm test
```

## Future Enhancements

- [ ] Natural language processing integration
- [ ] Machine learning-based detection
- [ ] Multi-language support
- [ ] Integration with Grammarly API
- [ ] Custom rule builder UI
- [ ] Automated fix suggestions

## License

ISC

## Author

Created for testing grammar mistakes in webpages using Playwright.
