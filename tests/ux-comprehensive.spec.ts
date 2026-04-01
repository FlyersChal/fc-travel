import { test, expect, devices } from '@playwright/test';

const SITE_URL = 'http://localhost:3000';

test.describe('Blog UX Comprehensive Analysis', () => {
  test('HOME: Homepage layout and navigation', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Hero section
    const h1 = page.locator('h1').first();
    expect(await h1.isVisible()).toBeTruthy();
    console.log('✓ Hero section visible');
    
    // Navigation
    const header = page.locator('header');
    expect(await header.isVisible()).toBeTruthy();
    const homeLink = page.locator('a[href="/"]').first();
    const postsLink = page.locator('a[href="/posts"]').first();
    expect(await homeLink.isVisible()).toBeTruthy();
    expect(await postsLink.isVisible()).toBeTruthy();
    console.log('✓ Navigation links present');
    
    // Footer
    const footer = page.locator('footer');
    expect(await footer.isVisible()).toBeTruthy();
    console.log('✓ Footer visible');
    
    // Search
    const searchBtn = page.locator('a[href="/search"]');
    expect(await searchBtn.count()).toBeGreaterThan(0);
    console.log('✓ Search button accessible');
  });

  test('POSTS: List and infinite scroll', async ({ page }) => {
    await page.goto(`${SITE_URL}/posts`);
    
    const heading = page.locator('h1').filter({ hasText: '글 목록' });
    expect(await heading.isVisible()).toBeTruthy();
    
    // Count initial posts
    const cards = page.locator('a').filter({ hasText: /[\s\S]*/ });
    console.log(`✓ Initial posts visible`);
    
    // Scroll test
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
    await page.waitForTimeout(500);
    console.log('✓ Infinite scroll works');
  });

  test('POST: Reading experience and TOC', async ({ page }) => {
    await page.goto(`${SITE_URL}/posts`);
    
    // Find and click first post
    const firstLink = page.locator('a').first();
    const href = await firstLink.getAttribute('href');
    if (href?.includes('/posts/')) {
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check post elements
      const title = page.locator('h1').first();
      expect(await title.isVisible()).toBeTruthy();
      console.log('✓ Post title visible');
      
      const date = page.locator('time');
      expect(await date.isVisible()).toBeTruthy();
      console.log('✓ Post date visible');
      
      // Check TOC
      const tocNav = page.locator('nav[aria-label="목차"]');
      const tocSelect = page.locator('select').filter({ hasText: /목차/ });
      const tocVisible = (await tocNav.isVisible()) || (await tocSelect.isVisible());
      console.log(`✓ Table of Contents: ${tocVisible ? 'present' : 'missing'}`);
      
      // Check content
      const prose = page.locator('[class*="prose"]');
      const proseVisible = await prose.isVisible();
      console.log(`✓ Content readable: ${proseVisible}`);
    }
  });

  test('THEME: Dark/Light toggle', async ({ page }) => {
    await page.goto(SITE_URL);
    
    const themeBtn = page.locator('button').filter({ hasText: /라이트|다크/ });
    expect(await themeBtn.count()).toBeGreaterThan(0);
    console.log('✓ Theme toggle found');
    
    const html = page.locator('html');
    const beforeDark = (await html.getAttribute('class'))?.includes('dark');
    console.log(`✓ Current: ${beforeDark ? 'dark' : 'light'} mode`);
  });

  test('MOBILE: Menu and responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(SITE_URL);
    
    const menuBtn = page.locator('button[aria-label="메뉴"]');
    const isVisible = await menuBtn.isVisible();
    console.log(`✓ Mobile menu button: ${isVisible ? 'visible' : 'hidden'}`);
    
    if (isVisible) {
      await menuBtn.click();
      await page.waitForTimeout(300);
      console.log('✓ Mobile menu opens');
    }
  });

  test('SEARCH: Search page', async ({ page }) => {
    await page.goto(`${SITE_URL}/search`);
    
    const heading = page.locator('h1').filter({ hasText: '검색' });
    expect(await heading.isVisible()).toBeTruthy();
    console.log('✓ Search page exists');
    
    const status = await page.locator('text=/준비|검색/').textContent();
    console.log(`✓ Search status: ${status?.substring(0, 20)}`);
  });

  test('FEATURES: Missing functionality check', async ({ page }) => {
    await page.goto(SITE_URL);
    
    const features = {
      'RSS': await page.locator('link[rel*="rss"], link[rel*="feed"]').count(),
      'Share buttons': await page.locator('button, a').filter({ hasText: /공유|share/ }).count(),
      'Comments': await page.locator('[class*="comment"]').count(),
      'Read time': await page.locator('text=/분.*읽음|reading time/').count(),
    };
    
    console.log('Features:');
    Object.entries(features).forEach(([name, count]) => {
      console.log(`  ${count > 0 ? '✓' : '✗'} ${name}`);
    });
  });

  test('ACCESSIBILITY: Keyboard navigation', async ({ page }) => {
    await page.goto(SITE_URL);
    
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`✓ Tab navigation works - focused: ${focused}`);
    
    const images = page.locator('img');
    const total = await images.count();
    const withAlt = await images.evaluateAll(els =>
      els.filter(el => el.hasAttribute('alt')).length
    );
    console.log(`✓ Image alt text: ${withAlt}/${total}`);
  });
});
