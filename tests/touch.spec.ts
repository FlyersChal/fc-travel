import { test, expect } from '@playwright/test';

test.describe('Touch: Dark mode toggle', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test('dark mode works with tap events', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Tap the theme toggle trigger (simple toggle, no dropdown)
    const trigger = page.getByRole('button', { name: '테마 변경' });
    await expect(trigger).toBeVisible();
    await trigger.tap();
    await page.waitForTimeout(500);

    const htmlClass = await page.locator('html').getAttribute('class') ?? '';
    console.log('After tap dark - html class:', htmlClass);
    expect(htmlClass).toContain('dark');

    await page.screenshot({ path: 'tests/screenshots/touch-dark.png' });

    console.log('Console errors:', errors);
    expect(errors.filter(e => !e.includes('next-devtools'))).toHaveLength(0);
  });
});

test.describe('Touch: Hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test('hamburger menu works with tap events', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Tap the menu button
    const menuBtn = page.getByRole('button', { name: '메뉴' });
    await expect(menuBtn).toBeVisible();
    await menuBtn.tap();

    // Wait for dialog/sheet
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3000 });

    await page.screenshot({ path: 'tests/screenshots/touch-menu.png' });

    // Tap "글 목록" link
    const postsLink = dialog.getByRole('link', { name: '글 목록' });
    await expect(postsLink).toBeVisible();
    await postsLink.tap();

    await page.waitForURL('**/posts', { timeout: 5000 });
    expect(page.url()).toContain('/posts');

    console.log('Console errors:', errors);
  });
});
