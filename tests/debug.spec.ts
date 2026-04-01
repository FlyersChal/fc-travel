import { test, expect } from '@playwright/test';

test.describe('Strict: Dark mode', () => {
  test('full dark mode flow with strict verification', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(`PAGEERROR: ${err.message}`));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const initialBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log('Initial bg:', initialBg);

    // Step 1: Click the toggle trigger (simple toggle button, no dropdown)
    const trigger = page.getByRole('button', { name: '테마 변경' });
    await expect(trigger).toBeVisible();
    await expect(trigger).toBeEnabled();
    await trigger.click();

    // Step 2: Wait and verify dark mode applied
    await page.waitForTimeout(500);

    const htmlClass = await page.locator('html').getAttribute('class') ?? '';
    expect(htmlClass).toContain('dark');

    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log('After dark bg:', darkBg);
    expect(darkBg).not.toBe(initialBg);

    await page.screenshot({ path: 'tests/screenshots/strict-dark.png' });

    // Step 3: Persist check — refresh and verify dark mode persists
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const afterReloadClass = await page.locator('html').getAttribute('class') ?? '';
    console.log('After reload class:', afterReloadClass);
    expect(afterReloadClass).toContain('dark');

    await page.screenshot({ path: 'tests/screenshots/strict-dark-reload.png' });

    // Step 4: Toggle back to light
    await page.getByRole('button', { name: '테마 변경' }).click();
    await page.waitForTimeout(500);

    const lightClass = await page.locator('html').getAttribute('class') ?? '';
    expect(lightClass).not.toContain('dark');

    console.log('Console errors:', errors);
    expect(errors.filter(e => !e.includes('next-devtools'))).toHaveLength(0);
  });
});

test.describe('Strict: Mobile hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('full mobile menu flow with strict verification', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Step 1: Desktop nav should be hidden on mobile
    const desktopNav = page.locator('nav.hidden');
    await expect(desktopNav).toBeHidden();

    // Step 2: Hamburger button should be visible
    const menuBtn = page.getByRole('button', { name: '메뉴' });
    await expect(menuBtn).toBeVisible();

    // Step 3: Click hamburger
    await menuBtn.click();
    await page.waitForTimeout(500);

    // Step 4: Dialog/Sheet should appear
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3000 });

    await page.screenshot({ path: 'tests/screenshots/strict-mobile-menu.png' });

    // Step 5: Nav links inside dialog should be visible and clickable
    const homeLink = dialog.getByRole('link', { name: '홈' });
    const postsLink = dialog.getByRole('link', { name: '글 목록' });
    await expect(homeLink).toBeVisible();
    await expect(postsLink).toBeVisible();

    // Step 6: Click "글 목록" link and verify navigation
    await postsLink.click();
    await page.waitForURL('**/posts', { timeout: 5000 });
    expect(page.url()).toContain('/posts');

    await page.screenshot({ path: 'tests/screenshots/strict-mobile-after-nav.png' });

    // Step 7: Sheet should be closed after navigation
    await page.waitForTimeout(500);
    const dialogAfterNav = page.locator('[role="dialog"]');
    if (await dialogAfterNav.count() > 0) {
      const isVis = await dialogAfterNav.isVisible().catch(() => false);
      expect(isVis).toBeFalsy();
    }

    // Step 8: Verify page content loaded
    await expect(page.getByRole('heading', { name: '글 목록' })).toBeVisible();

    console.log('Console errors:', errors);
  });
});

test.describe('Strict: Theme toggle on mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('dark mode works on mobile too', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const trigger = page.getByRole('button', { name: '테마 변경' });
    await expect(trigger).toBeVisible();

    await trigger.click();
    await page.waitForTimeout(500);

    const htmlClass = await page.locator('html').getAttribute('class') ?? '';
    expect(htmlClass).toContain('dark');

    await page.screenshot({ path: 'tests/screenshots/strict-mobile-dark.png' });
  });
});
