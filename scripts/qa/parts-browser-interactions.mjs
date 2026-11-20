import assert from "node:assert/strict";

export async function checkPartsInteractions(page, name, capture) {
  if (name === "download") {
    const ticks = page.getByRole("checkbox");
    assert.equal(await ticks.count(), 4);
    for (const tick of await ticks.all()) { await tick.focus(); await tick.press("Space"); assert(await tick.isChecked()); }
    assert(await page.getByText("4 of 4 complete").isVisible());
    await capture("-checklist");
    await ticks.first().press("Space"); assert.equal(await ticks.first().isChecked(), false);
    return;
  }
  const trigger = name === "catalogue"
    ? page.getByRole("button", { name: "Questions before you start" })
    : page.getByRole("button", { name: "Questions?", exact: true });
  await trigger.focus(); await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Questions before you start" });
  await dialog.waitFor();
  assert(await dialog.evaluate(node => node.contains(document.activeElement)));
  assert.equal(await dialog.evaluate(node => node.scrollWidth > node.clientWidth), false, "Drawer overflows horizontally");
  const smallControls = await dialog.locator("button, summary, a").evaluateAll(nodes => nodes.filter(node => {
    const box = node.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
  }).map(node => node.textContent));
  assert.deepEqual(smallControls, [], "Drawer controls must be at least 44px");
  const close = dialog.getByRole("button", { name: "Close questions" });
  await close.focus(); await page.keyboard.press("Shift+Tab");
  assert(await dialog.evaluate(node => node.contains(document.activeElement)), "Focus escaped the modal");
  await capture("-questions");
  await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" });
  assert(await trigger.evaluate(node => node === document.activeElement));
  await trigger.press("Space"); await dialog.waitFor();
  await close.focus(); await close.press("Enter"); await dialog.waitFor({ state: "hidden" });
  if (name === "catalogue") {
    const evidence = page.locator(".mc-example > details");
    await evidence.locator(":scope > summary").press("Enter");
    assert(await evidence.getByText("Conflicting figures").isVisible());
    assert(await evidence.getByText("evidence/people.txt, line 1", { exact: true }).isVisible());
    await evidence.locator(":scope > summary").press("Enter");
    const library = page.locator("#kit-catalogue");
    assert(await library.getByText(/full refund within 14 days/).isVisible());
    await library.getByRole("button", { name: "Set a price" }).press("Enter");
    const rows = library.locator("details.mc-module");
    assert.equal(await rows.count(), 2);
    await rows.first().locator("summary").press("Enter");
    const offer = rows.first().getByRole("link");
    assert(await offer.isVisible());
    assert.equal(await offer.getAttribute("href"), "/brain-modules/lowest-price");
    await library.getByRole("button", { name: /^All/ }).press("Enter");
    assert.equal(await rows.count(), 8);
  } else {
    const human = page.getByRole("button", { name: "What only you can judge" });
    assert.equal(await human.getAttribute("aria-expanded"), "true");
    const checks = page.getByRole("button", { name: "What it checks" });
    assert.equal(await checks.getAttribute("aria-expanded"), "false");
    await human.scrollIntoViewIfNeeded(); await capture("-accordion");
    await checks.focus(); await checks.press("Enter");
    assert.equal(await human.getAttribute("aria-expanded"), "false");
    assert.equal(await checks.getAttribute("aria-expanded"), "true");
  }
}
