import { expect, test, type Page } from "@playwright/test";

async function openMobileNavigationIfNeeded(page: Page) {
  const openButton = page.getByRole("button", { name: "Open navigation" });
  if (await openButton.isVisible()) await openButton.click();
}

test("navigation works on desktop and mobile", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Progress" }).click();
  } else {
    await page.goto("/");
    await page.getByRole("link", { name: "Games" }).click();
  }

  await expect(page).toHaveURL(/\/(progress|games)$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("Size It Up supports keyboard input, answer reveal, scoring and archive saving", async ({ page }) => {
  await page.goto("/games/size-it-up");
  await page.getByRole("button", { name: /Start playing/ }).click();

  const slider = page.getByRole("slider", { name: "Adjust your size estimate" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: /Lock in estimate/ }).click();
  await expect(page.getByText(/The actual size is/)).toBeVisible();
  await expect(page.getByText("YOUR ROUND SCORE")).toBeVisible();

  for (let round = 0; round < 4; round += 1) {
    await page.getByRole("button", { name: round === 3 ? /See final results/ : /Next object/ }).click();
    if (round < 3) {
      await page.getByRole("button", { name: /Lock in estimate/ }).click();
    }
  }

  await expect(page.getByRole("heading", { name: "You sized it up." })).toBeVisible();
  await expect(page.getByText("Score saved to your local archive.")).toBeVisible();
  await openMobileNavigationIfNeeded(page);
  await page.getByRole("link", { name: "Archive" }).click();
  await expect(page.getByRole("heading", { name: "Size It Up" })).toBeVisible();
});

test("Higher or Lower completes a game and saves it to the archive", async ({ page }) => {
  await page.goto("/games/higher-or-lower");

  for (let round = 0; round < 10; round += 1) {
    await page.getByRole("button", { name: /Higher/ }).click();
  }

  await expect(page.getByRole("heading", { name: /Sharp instincts|Nice run|Keep practicing/ })).toBeVisible();
  await expect(page.getByText("Score saved to your local archive.")).toBeVisible();
  await page.getByRole("link", { name: "All games" }).click();
  await openMobileNavigationIfNeeded(page);
  await page.getByRole("link", { name: "Archive" }).click();
  await expect(page.getByRole("heading", { name: "Higher or Lower" })).toBeVisible();
});
