## 2024-01-01 - Async Feedback Patterns
**Learning:** Users often double-click buttons (like "Register" or "Login") when there's no immediate visual feedback during async operations, leading to multiple submissions or frustration.
**Action:** Always implement a `setLoading` state for buttons that trigger network requests, disabling the button and showing a spinner to indicate progress and prevent duplicate actions.
