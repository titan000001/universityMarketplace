## 2025-05-18 - [Add Loading States for Auth Actions]
**Learning:** Users lack feedback during async authentication requests (login/register), leading to potential double-submissions and uncertainty.
**Action:** Implemented a reusable `setLoading` utility that toggles button state and displays a spinner. This pattern should be applied to all future async form submissions (e.g., checkout, product creation) to maintain consistency and "smoothness".
