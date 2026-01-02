## 2026-01-02 - Search Experience & Accessibility
**Learning:** Adding simple `aria-label` attributes to input and select elements is a high-impact, low-effort accessibility win. It immediately clarifies the purpose of form controls for screen reader users without affecting visual design.
**Action:** Always audit form inputs for accessible labels, especially when visual labels are omitted for design reasons.

**Learning:** Debouncing search inputs is critical for both performance and user experience. It prevents API spamming and UI "jitter" while the user is typing, making the interface feel more polished and responsive.
**Action:** Use the `debounce` utility for any real-time search or filter inputs.
