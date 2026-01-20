## 2024-05-23 - Authentication Loading States
**Learning:** Users lack feedback during asynchronous form submissions (like Login/Register) in vanilla JS SPAs if not explicitly handled. The browser doesn't provide a native loading indicator for AJAX requests like it does for full page loads.
**Action:** Always implement a manual loading state (disable button + spinner) for critical form submissions in vanilla JS views. The pattern `disable -> show spinner -> await -> restore/redirect` is robust.
