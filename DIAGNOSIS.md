# Complete Diagnostic Analysis: Lead Capture & Calendly Flow Failures

**Date**: 2025-01-XX  
**Status**: CRITICAL - Multiple systemic failures identified  
**Scope**: Complete lead capture flow from form submission to Calendly booking

---

## EXECUTIVE SUMMARY

Three critical failures identified:
1. **Calendly popup fails to open** - Race condition with async script loading + popup blockers
2. **No database lead capture** - Leads only sent via email, no persistence
3. **Email failures are silent** - Users proceed to Calendly even when email fails

**Root Cause**: Architectural gaps in error handling, async coordination, and data persistence.

---

## PHASE 1: COMPLETE PROBLEM SCOPE

### Issue 1: Calendly Popup Not Opening

#### Architecture Map
```
User clicks CTA
  ↓
InitialConsultModal.handleSubmit()
  ↓
supabase.functions.invoke('send-lead-email') [async, may fail silently]
  ↓
openCalendlyPopup() [called immediately, no wait]
  ↓
window.Calendly?.initPopupWidget() [may not exist yet]
  OR
window.open() [may be blocked by popup blocker]
```

#### Files Involved
- `src/components/InitialConsultModal.tsx` (lines 108-114)
- `src/utils/calendly.ts` (lines 34-56)
- `index.html` (line 441) - Calendly script loaded async

#### Root Causes Identified

**1.1. Race Condition with Async Script Loading**
- **Location**: `index.html:441` - Script loads with `async` attribute
- **Problem**: `openCalendlyPopup()` called immediately after email send, but `window.Calendly` may not exist yet
- **Evidence**: Code checks `if (window.Calendly)` but has no retry/wait mechanism
- **Impact**: Falls back to `window.open()` which may be blocked

**1.2. Popup Blocker Interference**
- **Location**: `src/utils/calendly.ts:54`
- **Problem**: `window.open()` called without user gesture context (async email call breaks gesture chain)
- **Impact**: Modern browsers block popups not directly triggered by user interaction

**1.3. Missing commitmentLevel in Calendly URL**
- **Location**: `src/utils/calendly.ts:23-28` - Interface doesn't include `commitmentLevel`
- **Location**: `src/components/InitialConsultModal.tsx:109-114` - Not passed to `openCalendlyPopup()`
- **Problem**: Commitment level captured but not sent to Calendly
- **Impact**: Lost context in booking system

**1.4. No Error Handling for Calendly Failures**
- **Location**: `src/utils/calendly.ts:34-56`
- **Problem**: No try/catch, no user feedback if Calendly fails
- **Impact**: Silent failures, user doesn't know booking didn't open

---

### Issue 2: No Database Lead Capture

#### Architecture Map
```
User submits form
  ↓
supabase.functions.invoke('send-lead-email')
  ↓
Edge function processes lead
  ↓
[ONLY SENDS EMAIL - NO DATABASE INSERT]
  ↓
Returns success/error
```

#### Files Involved
- `supabase/functions/send-lead-email/index.ts` (entire file)
- No database migrations found
- No leads table schema

#### Root Causes Identified

**2.1. No Database Table for Leads**
- **Location**: No migrations directory found
- **Problem**: No `leads` table exists in Supabase
- **Evidence**: Architecture.md states "Current Tables: None (no data storage yet)"
- **Impact**: Leads only exist in email, no queryable database

**2.2. Edge Function Doesn't Insert to Database**
- **Location**: `supabase/functions/send-lead-email/index.ts:94-545`
- **Problem**: Function only sends email via Resend API, no database insert
- **Evidence**: No `supabase.from('leads').insert()` calls found
- **Impact**: No persistent record of leads

**2.3. No Database Client in Edge Function**
- **Location**: `supabase/functions/send-lead-email/index.ts`
- **Problem**: No Supabase client imported or initialized
- **Impact**: Cannot insert even if table existed

---

### Issue 3: Email Failures Are Silent

#### Architecture Map
```
User submits form
  ↓
supabase.functions.invoke('send-lead-email')
  ↓
[IF EMAIL FAILS]
  ↓
Error logged to console only
  ↓
User still sees "Opening Calendly" toast
  ↓
Calendly opens (or fails silently)
```

#### Files Involved
- `src/components/InitialConsultModal.tsx` (lines 90-119)
- `src/utils/emailNotification.ts` (lines 25-48)
- `supabase/functions/send-lead-email/index.ts` (lines 527-530)

#### Root Causes Identified

**3.1. Silent Error Swallowing in Frontend**
- **Location**: `src/components/InitialConsultModal.tsx:103-106`
- **Problem**: Email error logged but not thrown, user flow continues
- **Code**: `if (emailError) { console.error('Email error:', emailError); // Don't block... }`
- **Impact**: User proceeds to Calendly even if email failed

**3.2. Silent Error Swallowing in Utility**
- **Location**: `src/utils/emailNotification.ts:40-47`
- **Problem**: Errors caught and logged, never thrown
- **Code**: `catch (err) { console.error('Failed to send lead email:', err); // Don't throw... }`
- **Impact**: ConsultationBooking component never knows email failed

**3.3. Edge Function Throws But Frontend Doesn't Handle**
- **Location**: `supabase/functions/send-lead-email/index.ts:527-530`
- **Problem**: Function throws error after retries, but frontend doesn't check response
- **Evidence**: Frontend checks `emailError` but doesn't check if `data` contains error
- **Impact**: HTTP 500 errors may be returned but frontend treats as success

**3.4. No User Feedback for Email Failures**
- **Location**: `src/components/InitialConsultModal.tsx:116-119`
- **Problem**: Toast always shows "Opening Calendly" regardless of email status
- **Impact**: User has no idea email failed

---

## PHASE 2: ROOT CAUSE INVESTIGATION

### Call Graph Analysis

#### Complete Flow: InitialConsultModal Submit
```
1. handleSubmit() called
   ├─> Validates form fields
   ├─> setIsLoading(true)
   └─> try {
         ├─> supabase.functions.invoke('send-lead-email', { body })
         │   ├─> [ASYNC] Edge function processes
         │   ├─> [IF ERROR] emailError set, but not thrown
         │   └─> [IF SUCCESS] emailData returned
         │
         ├─> if (emailError) { console.error(); } // Silent failure
         │
         ├─> openCalendlyPopup() // Called regardless of email status
         │   ├─> Checks window.Calendly (may not exist)
         │   ├─> [IF EXISTS] window.Calendly.initPopupWidget()
         │   └─> [IF NOT] window.open() // May be blocked
         │
         ├─> onOpenChange(false) // Modal closes
         └─> toast("Opening Calendly") // Always shown
       } catch (error) {
         └─> Only catches non-email errors
       }
```

#### Complete Flow: Edge Function
```
1. Request received
   ├─> Validates input with Zod
   ├─> Extracts email domain
   ├─> [IF NOT PERSONAL] Calls Gemini API for company research
   ├─> Builds email HTML
   └─> Attempts to send email (3 retries)
       ├─> [IF SUCCESS] Returns { success: true }
       └─> [IF FAILS] Throws error (but frontend may not catch)
```

### Payload Flow Analysis

#### Expected Payload (InitialConsultModal → Edge Function)
```typescript
{
  name: string,
  email: string,
  jobTitle: string,
  selectedProgram: string,
  commitmentLevel?: string,  // ✅ Present
  audienceType?: string,     // ✅ Present
  pathType?: string,         // ✅ Present
  sessionData: object
}
```

#### Actual Payload Received
- ✅ All fields present in InitialConsultModal
- ❌ commitmentLevel NOT passed to Calendly
- ❌ No database insert attempted

#### Expected Response (Edge Function → Frontend)
```typescript
{ success: true } | { error: string }
```

#### Actual Response Handling
- ✅ Frontend receives response
- ❌ Frontend doesn't check for error in response body
- ❌ Frontend only checks `emailError` from Supabase client
- ❌ If edge function returns 500, Supabase client may not set `error`

---

## PHASE 3: ALL FAILURE POINTS IDENTIFIED

### Failure Point 1: Calendly Script Loading Race Condition
**Severity**: HIGH  
**Frequency**: Common (especially on slow connections)  
**Location**: `index.html:441`, `src/utils/calendly.ts:50-55`

**Root Cause**: 
- Calendly script loads asynchronously
- `openCalendlyPopup()` called immediately after async email call
- No mechanism to wait for script to load

**Evidence**:
```typescript
// index.html
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>

// calendly.ts
if (window.Calendly) {
  window.Calendly.initPopupWidget({ url: calendlyUrl });
} else {
  window.open(calendlyUrl, '_blank'); // Fallback - may be blocked
}
```

**Impact**: 
- Calendly popup doesn't open
- Falls back to `window.open()` which may be blocked by popup blockers
- No user feedback

---

### Failure Point 2: Popup Blocker Interference
**Severity**: HIGH  
**Frequency**: Common (all modern browsers)  
**Location**: `src/utils/calendly.ts:54`

**Root Cause**:
- `window.open()` called after async operation (email send)
- Browser popup blockers require direct user gesture
- Async email call breaks the gesture chain

**Evidence**:
```typescript
// User clicks button (gesture)
// ↓
// Async email call (breaks gesture chain)
// ↓
// window.open() called (blocked by browser)
```

**Impact**:
- Popup blocked silently
- No user feedback
- User thinks booking opened but it didn't

---

### Failure Point 3: Missing commitmentLevel in Calendly
**Severity**: MEDIUM  
**Frequency**: Always (when commitmentLevel provided)  
**Location**: `src/utils/calendly.ts:23-28`, `src/components/InitialConsultModal.tsx:109-114`

**Root Cause**:
- `CalendlyParams` interface doesn't include `commitmentLevel`
- Not passed to `openCalendlyPopup()` call
- Not included in Calendly URL

**Evidence**:
```typescript
// calendly.ts - Interface missing commitmentLevel
export interface CalendlyParams {
  name?: string;
  email?: string;
  source: CalendlySource;
  preselectedProgram?: string;
  // ❌ commitmentLevel missing
}

// InitialConsultModal.tsx - Not passed
openCalendlyPopup({
  name,
  email,
  source: 'initial-consult',
  preselectedProgram: programValue,
  // ❌ commitmentLevel not passed
});
```

**Impact**:
- Lost context in Calendly booking
- Cannot track which commitment level user selected
- Analytics incomplete

---

### Failure Point 4: No Database Lead Capture
**Severity**: CRITICAL  
**Frequency**: Always  
**Location**: `supabase/functions/send-lead-email/index.ts` (entire file)

**Root Cause**:
- No database table exists for leads
- Edge function doesn't attempt database insert
- No Supabase client in edge function

**Evidence**:
- No migrations directory found
- Architecture.md states "Current Tables: None"
- Edge function only sends email, no database operations

**Impact**:
- No queryable lead database
- Cannot track lead status
- Cannot analyze lead sources
- No backup if email fails

---

### Failure Point 5: Silent Email Failures
**Severity**: CRITICAL  
**Frequency**: When email service fails  
**Location**: Multiple files

**Root Cause**:
- Errors caught and logged but not thrown
- User flow continues regardless of email status
- No user feedback for failures

**Evidence**:
```typescript
// InitialConsultModal.tsx:103-106
if (emailError) {
  console.error('Email error:', emailError);
  // Don't block the booking flow if email fails
}
// Flow continues to Calendly

// emailNotification.ts:40-47
catch (err) {
  console.error('Failed to send lead email:', err);
  // Don't throw - we don't want to block the user flow
}
```

**Impact**:
- Leads lost if email fails
- No way to recover lost leads
- User has no idea email failed
- Business loses potential customers

---

### Failure Point 6: Edge Function Error Response Not Handled
**Severity**: MEDIUM  
**Frequency**: When edge function throws  
**Location**: `src/components/InitialConsultModal.tsx:90-101`

**Root Cause**:
- Frontend only checks `emailError` from Supabase client
- Doesn't check response body for errors
- Edge function may return 500 with error in body

**Evidence**:
```typescript
const { data: emailData, error: emailError } = await supabase.functions.invoke(...);

if (emailError) {
  // Only checks Supabase client error
  // Doesn't check if data contains { error: "..." }
}
```

**Impact**:
- Some errors not caught
- Inconsistent error handling

---

### Failure Point 7: No Retry/Wait for Calendly Script
**Severity**: MEDIUM  
**Frequency**: On slow connections  
**Location**: `src/utils/calendly.ts:50-55`

**Root Cause**:
- No polling/waiting mechanism for Calendly script
- Immediate fallback to window.open
- No timeout handling

**Impact**:
- Premature fallback to window.open
- Popup blocker interference

---

### Failure Point 8: Missing Error Boundaries
**Severity**: LOW  
**Frequency**: On unexpected errors  
**Location**: No error boundaries found

**Root Cause**:
- No React error boundaries around critical flows
- Unhandled errors crash component

**Impact**:
- Poor error recovery
- Bad UX on errors

---

## PHASE 4: ARCHITECTURAL GAPS

### Gap 1: No Async Coordination Pattern
**Problem**: Multiple async operations (email send, Calendly script load) not coordinated  
**Impact**: Race conditions, silent failures

### Gap 2: No Data Persistence Layer
**Problem**: Leads only in email, no database  
**Impact**: No queryable data, no backup

### Gap 3: No Error Propagation Strategy
**Problem**: Errors swallowed at multiple levels  
**Impact**: Silent failures, lost leads

### Gap 4: No Monitoring/Alerting
**Problem**: Errors only logged to console  
**Impact**: No visibility into failures

### Gap 5: No User Feedback for Critical Failures
**Problem**: Users not informed of failures  
**Impact**: Poor UX, lost trust

---

## PHASE 5: VERIFICATION REQUIREMENTS

### Required Logs/Evidence
1. Browser console errors when Calendly fails
2. Network tab showing email API calls
3. Supabase edge function logs
4. Calendly script load status
5. Popup blocker status

### Required Testing
1. Test with slow 3G connection (Calendly script delay)
2. Test with popup blocker enabled
3. Test with email API failure (mock)
4. Test with Calendly script blocked
5. Test database insert (when implemented)

---

## NEXT STEPS

1. **Create Implementation Plan** with fixes for all 8 failure points
2. **Add database schema** for leads table
3. **Implement Calendly script wait mechanism**
4. **Add database insert to edge function**
5. **Improve error handling and user feedback**
6. **Add commitmentLevel to Calendly URL**
7. **Add monitoring/alerting**

---

## FILES REQUIRING CHANGES

1. `src/utils/calendly.ts` - Add commitmentLevel, wait for script, better error handling
2. `src/components/InitialConsultModal.tsx` - Pass commitmentLevel, handle errors properly
3. `supabase/functions/send-lead-email/index.ts` - Add database insert, better error responses
4. `supabase/migrations/` - Create leads table migration (new)
5. `src/utils/emailNotification.ts` - Better error handling
6. `index.html` - Consider loading Calendly script synchronously or with callback

---

**Diagnostic Complete** - Ready for implementation plan.

---

## ADDENDUM: 2026-02-21 — ROUND 2 DIAGNOSTIC

### Context
Previous round (Issues 1-8 above) resulted in comprehensive fixes to `send-lead-email`, `InitialConsultModal`, and `calendly.ts`. However, fixes were **applied unevenly** — the other two email edge functions (`send-contact-email`, `send-leadership-insights-email`) were left with the original vulnerable patterns.

### Verified via Deployment Check
```
send-lead-email:                HEALTHY (HTTP 200) — hardened version IS deployed
send-contact-email:             HTTP 500 "Unexpected end of JSON input" — OLD version deployed (no health check)
send-leadership-insights-email: HTTP 500 "Unexpected end of JSON input" — OLD version deployed (no health check)
```

### New Failure Points Identified (10 Total)

| # | Failure | Severity | File | Status |
|---|---------|----------|------|--------|
| F1 | `send-contact-email` has no RESEND_API_KEY validation | CRITICAL | `supabase/functions/send-contact-email/index.ts` | FIXED |
| F2 | `send-leadership-insights-email` has no RESEND_API_KEY validation | CRITICAL | `supabase/functions/send-leadership-insights-email/index.ts` | FIXED |
| F3 | `send-contact-email` has no retry logic | HIGH | Same as F1 | FIXED |
| F4 | `send-leadership-insights-email` has no retry logic | HIGH | Same as F2 | FIXED |
| F5 | Contact form submissions have no database persistence | MEDIUM | Same as F1 | NOTED (future) |
| F6 | Contact form sends embedded data instead of structured fields | MEDIUM | `src/pages/Contact.tsx` | FIXED |
| F7 | Leadership insights sends to user email (requires Resend paid plan) | MEDIUM | Same as F2 | NOTED (graceful degradation added) |
| F8 | Edge function deployment gap — code may not match deployed functions | CRITICAL | No CI/CD pipeline | VERIFICATION SCRIPT CREATED |
| F9 | `escapeHtml` in contact/leadership functions crashes on null/undefined | HIGH | Both functions | FIXED |
| F10 | No health check endpoints in contact/leadership functions | MEDIUM | Both functions | FIXED |

### Architectural Root Cause
Inconsistency across the three email edge functions. `send-lead-email` was comprehensively hardened; the other two were not. No shared enforcement of patterns. No deployment verification.

### Fixes Applied
1. **`send-contact-email`**: Rewritten with API key validation, retry (3 attempts, exponential backoff), null-safe `escapeHtml`, health check endpoint, structured logging with requestId, Zod schema expanded for optional company/role/interest fields.
2. **`send-leadership-insights-email`**: Rewritten with same hardening. Added `sendEmailWithRetry` helper. User email failure is now non-blocking (notification to Krish still sent).
3. **`Contact.tsx`**: Now sends company, role, interest as separate body fields instead of embedding in message string. Edge function template conditional rendering now works correctly.
4. **`AIDecisionHelper.tsx`**: Fixed duplicate `variant="outline"` JSX attribute (build warning).
5. **`scripts/verify-edge-functions.sh`**: New deployment verification script that tests health and validation endpoints for all 3 email functions.

### CRITICAL: Deployment Required
All edge function changes must be deployed to Supabase:
```bash
supabase functions deploy send-contact-email
supabase functions deploy send-leadership-insights-email
```
Without deployment, the code changes have zero effect on production.
