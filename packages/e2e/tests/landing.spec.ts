import { test, expect } from "@playwright/test";

const BASE_URL = "https://sifchain-dex.vercel.app";

test.describe("Landing page", async () => {
  test("Should redirect to /pools", async ({ page }) => {
    await page.goto(BASE_URL);

    const expectedUrl = `${BASE_URL}/pools`;

    await page.waitForURL(expectedUrl);

    const url = page.url();

    expect(url).toBe(expectedUrl);
  });
});
