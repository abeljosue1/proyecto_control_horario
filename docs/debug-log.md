# Debug Log - Sprint 0

## Bug 1: Timer Synchronous State Loop
**Severity**: Medium
**Component**: `components/dashboard/Timer.tsx`

### Issue Description
The `useEffect` hook in the Timer component was calling `setCurrentTime(new Date())` synchronously.
This triggered a React warning: "Calling setState synchronously within an effect can trigger cascading renders". While not a runtime crash, it impacts performance and indicates improper Effect usage.

### Fix
Wrapped the initial `setCurrentTime` call in a `setTimeout(..., 0)` or simply relied on the `setInterval` to handle updates, ensuring the state update happens asynchronously after the render cycle completes. The final implementation uses a clean `setInterval` approach.

---

## Bug 2: Unsafe Type Handling in Auth
**Severity**: Medium/High
**Component**: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`

### Issue Description
Authentication error handling was using `catch (err: any)`.
This bypasses TypeScript's safety checks and can lead to runtime errors if `err` is not an object with a `message` property (e.g., if a string or null is thrown).

### Fix
Replaced strict `any` usage with a type check:
```typescript
catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    setError(message);
}
```
This ensures the application only attempts to access `.message` on valid Error objects, providing a safer fallback for other types of thrown values.
