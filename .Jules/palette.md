# Palette's Journal - Critical Learnings

## 2026-01-02 - Search Experience & Accessibility
**Learning:** Adding simple `aria-label` attributes to input and select elements is a high-impact, low-effort accessibility win. It immediately clarifies the purpose of form controls for screen reader users without affecting visual design.
**Action:** Always audit form inputs for accessible labels, especially when visual labels are omitted for design reasons.

## 2024-05-23 - Accessibility Patterns in Vanilla JS SPAs
**Learning:** This application manually re-renders views (`initProductDetail`) to update UI state (like button text) instead of using a reactive framework. This means any accessible states (like `aria-pressed`, `aria-busy`, or focus management) need to be manually preserved or re-applied after re-render, otherwise the user context is lost.
**Action:** When implementing loading states or toggles, ensure the state persists across the manual re-renders or avoid full re-renders for small state changes.

## 2024-05-23 - Alert vs Toast
**Learning:** The application uses a mix of `showToast` and relying on `apiRequest` error handling. Some interactions have no visual feedback other than the UI updating.
**Action:** Standardize on `showToast` for success/error messages to provide consistent non-blocking feedback, especially for screen reader users (if implemented with `role="status"`).

## 2026-01-02 - Vanilla JS Template Literal Attribute Escaping
**Learning:** When injecting dynamic strings into HTML attributes (like `aria-label`) via template literals, double quotes in the content will break the HTML markup.
**Action:** Always use `.replace(/"/g, '&quot;')` or a utility function when placing user-generated content into HTML attributes in this codebase.
