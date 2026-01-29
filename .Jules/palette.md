# Palette's Journal - Critical Learnings

## 2026-01-02 - Search Experience & Accessibility
**Learning:** Adding simple `aria-label` attributes to input and select elements is a high-impact, low-effort accessibility win. It immediately clarifies the purpose of form controls for screen reader users without affecting visual design.
**Action:** Always audit form inputs for accessible labels, especially when visual labels are omitted for design reasons.

**Learning:** Debouncing search inputs is critical for both performance and user experience. It prevents API spamming and UI "jitter" while the user is typing, making the interface feel more polished and responsive.
**Action:** Use the `debounce` utility for any real-time search or filter inputs.

## 2025-05-27 - Icon-Only Buttons
**Learning:** Icon-only buttons (like "Send" or "Remove") are invisible to screen readers without an `aria-label`. Visually they are clear, but programmatically they are empty.
**Action:** Always add `aria-label` to buttons that contain only icons.

## 2025-02-18 - [Loading States for Async Forms]
**Learning:** Users often double-submit forms or feel uncertain when there is no visual feedback during asynchronous operations (like login, registration, or posting comments). A simple loading spinner and disabled button state significantly improves perceived performance and prevents errors.
**Action:** Implemented a reusable `setLoading` utility in `public/js/utils/loading.js` that disables the button, swaps the text for a spinner, and restores the original state. Applied this to Login, Register, Sell, and Product Detail (comments) forms. Future forms should use this utility by default.

## 2024-05-23 - Accessibility Patterns in Vanilla JS SPAs
**Learning:** This application manually re-renders views (`initProductDetail`) to update UI state (like button text) instead of using a reactive framework. This means any accessible states (like `aria-pressed`, `aria-busy`, or focus management) need to be manually preserved or re-applied after re-render, otherwise the user context is lost.
**Action:** When implementing loading states or toggles, ensure the state persists across the manual re-renders or avoid full re-renders for small state changes.

## 2024-05-23 - Alert vs Toast
**Learning:** The application uses a mix of `showToast` and relying on `apiRequest` error handling. Some interactions have no visual feedback other than the UI updating.
**Action:** Standardize on `showToast` for success/error messages to provide consistent non-blocking feedback, especially for screen reader users (if implemented with `role="status"`).

## 2026-01-17 - Chat Accessibility Polish
**Learning:** Icon-only buttons (like send icons) are invisible to screen readers without an `aria-label`. Adding `aria-label` and hiding the icon with `aria-hidden="true"` is essential.
**Action:** When using FontAwesome icons as buttons, always wrap them in a semantic `<button>` tag with an accessible name.

## 2026-01-02 - Real-time Content Accessibility
**Learning:** For dynamic content like chat logs or status updates, simply appending HTML isn't enough for screen readers. They require `role="log"` or `role="status"` with `aria-live="polite"` to announce updates without stealing focus.
**Action:** Always wrap real-time data containers with appropriate ARIA live regions.

## 2025-05-30 - Standardizing Feedback Text
**Learning:** While spinners indicate activity, adding descriptive text (e.g., "Buying...", "Sending...") provides clarity on *what* is happening, especially for longer operations. Refactoring ad-hoc logic to a centralized `setLoading` utility ensures this pattern is applied consistently.
**Action:** Use `setLoading` with descriptive text for all async action buttons.
