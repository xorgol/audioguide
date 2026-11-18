import AxeBuilder from '@axe-core/playwright';

export async function verifyAccessibility({
  page,
  AxeBuilderClass = AxeBuilder,
}: {
  page: import('@playwright/test').Page;
  AxeBuilderClass?: typeof AxeBuilder;
}) {
  const accessibilityScanResults = await new AxeBuilderClass({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();

  if (accessibilityScanResults.violations.length > 0) {
    throw new Error(
      `Accessibility violations found: ${accessibilityScanResults.violations.length}. Details: ${JSON.stringify(
        accessibilityScanResults.violations,
      )}`,
    );
  }
}
