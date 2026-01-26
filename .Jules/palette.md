<<<<<<< HEAD
<<<<<<< HEAD
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
=======
## 2024-01-01 - Async Feedback Patterns
**Learning:** Users often double-click buttons (like "Register" or "Login") when there's no immediate visual feedback during async operations, leading to multiple submissions or frustration.
**Action:** Always implement a `setLoading` state for buttons that trigger network requests, disabling the button and showing a spinner to indicate progress and prevent duplicate actions.

## 2025-05-18 - [Add Loading States for Auth Actions]
**Learning:** Users lack feedback during async authentication requests (login/register), leading to potential double-submissions and uncertainty.
**Action:** Implemented a reusable `setLoading` utility that toggles button state and displays a spinner. This pattern should be applied to all future async form submissions (e.g., checkout, product creation) to maintain consistency and "smoothness".

## 2025-10-27 - Manual Implementations vs Utilities
**Learning:** Manual implementations of common UI patterns (like loading states) often miss subtle accessibility attributes (like `aria-busy`) that centralized utilities handle correctly.
**Action:** Always refactor manual UI logic to use established utilities to ensure accessibility compliance across the board.
