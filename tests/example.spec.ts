import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and renders header/footer', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Header
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header').getByText('블로그')).toBeVisible();

    // Nav links (visible on desktop, hidden on mobile behind menu)
    const isMobile = (page.viewportSize()?.width ?? 1024) < 768;
    if (!isMobile) {
      await expect(page.locator('header').getByRole('link', { name: '홈' })).toBeVisible();
      await expect(page.locator('header').getByRole('link', { name: '글 목록' })).toBeVisible();
    }

    // Search icon link
    await expect(page.locator('header').getByRole('link', { name: '검색' })).toBeVisible();

    // Footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('모든 권리 보유');
  });

  test('shows welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '환영합니다' })).toBeVisible();
  });
});

test.describe('Posts page', () => {
  test('renders posts page', async ({ page }) => {
    const response = await page.goto('/posts');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '글 목록' })).toBeVisible();
  });
});

test.describe('Admin dashboard', () => {
  test('renders admin page', async ({ page }) => {
    const response = await page.goto('/admin');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '관리자 대시보드' })).toBeVisible();
    await expect(page.getByRole('link', { name: '새 글 작성' })).toBeVisible();
    await expect(page.getByRole('link', { name: '카테고리 관리' })).toBeVisible();
  });
});

test.describe('New post page', () => {
  test('renders post creation form', async ({ page }) => {
    const response = await page.goto('/admin/posts/new');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '새 글 작성' })).toBeVisible();

    // Form fields
    await expect(page.getByLabel('제목', { exact: true })).toBeVisible();
    await expect(page.getByLabel('슬러그', { exact: true })).toBeVisible();
    await expect(page.getByText('콘텐츠 유형')).toBeVisible();

    // Editor tabs
    await expect(page.getByRole('tab', { name: '작성' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '미리보기' })).toBeVisible();

    // Sidebar fields
    await expect(page.getByLabel('요약')).toBeVisible();
    await expect(page.getByLabel('태그 (쉼표로 구분)')).toBeVisible();

    // SEO section
    await expect(page.getByText('SEO 설정')).toBeVisible();

    // Buttons
    await expect(page.getByRole('button', { name: '발행' })).toBeVisible();
    await expect(page.getByRole('button', { name: '임시저장' })).toBeVisible();
  });
});

test.describe('Categories page', () => {
  test('renders category management', async ({ page }) => {
    const response = await page.goto('/admin/categories');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: '카테고리 관리' })).toBeVisible();
    await expect(page.getByText('새 카테고리')).toBeVisible();
  });
});

test.describe('Search page', () => {
  test('renders or gracefully handles missing page', async ({ page }) => {
    const response = await page.goto('/search');
    // Should not be 500
    expect(response?.status()).not.toBe(500);
  });
});

test.describe('Non-existent category', () => {
  test('handles gracefully', async ({ page }) => {
    const response = await page.goto('/category/test');
    // Should be 404, not 500
    expect(response?.status()).not.toBe(500);
  });
});

test.describe('Dark mode toggle', () => {
  test('toggles theme', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Click the theme toggle button (simple toggle, no dropdown)
    const toggle = page.getByRole('button', { name: '테마 변경' });
    await toggle.click();
    await page.waitForTimeout(500);

    // HTML should have dark class
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Mobile responsive menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('shows mobile menu button and opens sheet', async ({ page }) => {
    await page.goto('/');

    // Mobile menu trigger should be visible
    const menuButton = page.getByRole('button', { name: '메뉴' });
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Sheet should show nav links
    await expect(page.getByRole('link', { name: '홈' }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: '글 목록' }).last()).toBeVisible();
  });
});
