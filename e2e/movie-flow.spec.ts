import { expect, test } from "@playwright/test";

test("home page renders the hero and search", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /find your next watch/i }),
  ).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
});

test("search results are included in the initial HTML", async ({ request }) => {
  const response = await request.get("/search?q=Matrix");
  expect(response.ok()).toBeTruthy();

  const html = await response.text();
  expect(html).toMatch(/The Matrix/i);
});

test("shows an empty state for queries with no matches", async ({ page }) => {
  await page.goto("/search?q=zzzznomatch");
  await expect(
    page.getByRole("heading", { name: /no results found/i }),
  ).toBeVisible();
});

test("search → details modal → favorite → persistence → remove", async ({
  page,
}) => {
  await page.goto("/search?q=Matrix");

  await page.getByRole("link", { name: /The Matrix/i }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: /The Matrix/i }),
  ).toBeVisible();

  await dialog.getByRole("button", { name: /add to favorites/i }).click();
  await expect(
    dialog.getByRole("button", { name: /in favorites/i }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.goto("/favorites");
  await expect(
    page.getByRole("heading", { name: /^The Matrix$/i }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: /^The Matrix$/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /clear all/i }).click();
  await expect(
    page.getByRole("heading", { name: /no favorites yet/i }),
  ).toBeVisible();
});
