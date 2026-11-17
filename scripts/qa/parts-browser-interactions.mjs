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
    assert.deepEqual(await page.locator(".parts-evidence-track span").evaluateAll(bars => bars.map(bar => Number(bar.dataset.value))), [.46, -.54]);
    const beforePrice = await page.evaluate(() => {
      const sample = document.querySelector(".parts-sample"); const price = document.querySelector(".kit-card-link");
      return !!(sample.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    assert(beforePrice, "Real sample must precede the first price");
    for (const price of await page.locator(".parts-card-price").all()) {
      assert(await price.getByText("Full refund within 14 days, no questions asked.").isVisible());
      const questions = price.getByRole("button", { name: "Questions?" });
      await questions.focus(); await questions.press("Enter"); await dialog.waitFor();
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" });
    }
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
