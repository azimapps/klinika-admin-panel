# Clinic content and local mobile demo

Goal: Run the Flutter app on an iOS simulator against a populated local backend, with admin-editable clinic information, public offer and patient agreement.

Approach: Add a localized plain-text content table and authenticated admin editor. Public clients fetch published content each time a document opens or refreshes. Keep version numbers and reject stale admin saves. Import provided documents without translating or inventing legal terms. Replace the mobile Reviews placeholder with clinic/legal links and remove doctor ratings. Use an explicitly local SQLite database and allowlisted demo OTPs.

- [x] Backend: API integration tests for authorization, publication, validation and stale saves; content model/routes; document import and idempotent local sample data.
- [x] Admin: content navigation, localized editor, publication switch, conflict/error handling; build verification.
- [x] Mobile: common configurable API host, readable remote document pages and links, remove reviews/ratings; analyze and simulator verification.
- [x] Run local services, verify catalog APIs and appointment availability, verify admin text changes reach the mobile content API, and document commands and demo credentials. Manual mobile interaction remains unverified due to missing Computer Use permission.

Existing uncommitted doctor changes must be preserved. Demo commands must not use the configured production database or messaging services. Offer source contains two versions; use the user's selection, otherwise the long version with the appended drafting note excluded. Company-detail blanks remain as supplied.

Verification: iPhone 17 Pro Max debug build launched successfully. Admin build and lint passed. Backend integration tests and local API smoke checks passed, including admin-save propagation and idempotent seeding. Flutter has no errors; 22 notices/warnings in unchanged code remain. Manual simulator navigation could not be verified because macOS Computer Use permission is unavailable. Local run instructions and credentials are in ../klinika-backend/docs/LOCAL_DEMO.md.

Final static review: fixed normalized conflict handling and persistence of unsaved admin drafts across navigation. Reviewer reported no further important bugs in the fixes.
