import { expect, test, type Page } from "@playwright/test";

async function openMobileNavigationIfNeeded(page: Page) {
  const openButton = page.getByRole("button", { name: "Open navigation" });
  if (await openButton.isVisible()) await openButton.click();
}

test("navigation works on desktop and mobile", async ({ page }, testInfo) => {
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Progress" }).click();
  } else {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Games", exact: true }).click();
  }

  await expect(page).toHaveURL(/\/(progress|games)$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("Size It Up supports keyboard input, answer reveal, scoring and archive saving", async ({ page }) => {
  await page.goto("/games/size-it-up", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Start playing/ }).click();

  const slider = page.getByRole("slider", { name: "Adjust your size estimate" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: /Lock in estimate/ }).click();
  await expect(page.getByText(/The actual size is/)).toBeVisible();
  await expect(page.getByText("YOUR ROUND SCORE")).toBeVisible();

  for (let round = 0; round < 4; round += 1) {
    await page.getByRole("button", { name: /Next object/ }).click();
    await page.getByRole("button", { name: /Lock in estimate/ }).click();
  }
  await page.getByRole("button", { name: /See final results/ }).click();

  await expect(page.getByRole("heading", { name: "You sized it up." })).toBeVisible();
  await expect(page.getByText("Score saved to your local archive.")).toBeVisible();
  await openMobileNavigationIfNeeded(page);
  await page.getByRole("link", { name: "Archive" }).click();
  await expect(page.getByRole("heading", { name: "Size It Up" })).toBeVisible();
});

test("Higher or Lower completes a game and saves it to the archive", async ({ page }) => {
  await page.goto("/games/higher-or-lower", { waitUntil: "domcontentloaded" });

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


test("Daily Quiz is playable, saves its score, and can be replayed from the archive", async ({ page }) => {
  await page.goto("/games/daily-quiz", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Start the quiz/ }).click();

  const answers = ["Mars", "Six", "Pacific", "Nectar", "Thermometer"];
  for (let index = 0; index < answers.length; index += 1) {
    await page.getByRole("button", { name: new RegExp(answers[index]) }).click();
    await page.getByRole("button", { name: index === answers.length - 1 ? /Finish quiz/ : /Lock answer/ }).click();
  }

  await expect(page.getByRole("heading", { name: "Brilliant brain." })).toBeVisible();
  await expect(page.getByText("Your quiz score was saved to your local archive.")).toBeVisible();
  await page.getByRole("link", { name: "All games" }).click();
  await openMobileNavigationIfNeeded(page);
  await page.getByRole("link", { name: "Archive" }).click();
  await expect(page.getByRole("heading", { name: "Daily Quiz" })).toBeVisible();
  await page.getByRole("link", { name: /Replay practice Daily Quiz/ }).click();
  await expect(page.getByRole("button", { name: /Start the quiz/ })).toBeVisible();
});
