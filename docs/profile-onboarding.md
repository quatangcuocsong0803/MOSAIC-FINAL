# Profile, Mosaic ID and onboarding

Implemented on `feat/profile-mid-onboarding`. No production database migration,
main merge or production deployment is part of this change.

## Data and compatibility

- Username is unique, including case-insensitive uniqueness enforced by a PostgreSQL expression index. New usernames use 3–30 letters, digits or underscores. Unchanged legacy usernames are accepted when editing another field.
- Display name is independent and editable. Existing accounts receive their old username as the initial display name.
- Avatar, date of birth, biography, interests, location, username and display name have separate PUBLIC / FRIENDS / PRIVATE policies. Interest codes share the interests policy. Derived age and zodiac share the birth-date policy. Date of birth and location start private.
- Only ACCEPTED relationships grant friend visibility. Blocked accounts are excluded from Discover and cannot read another account's profile.
- Public profile pages allow guests and non-friends to see only public fields; the owner profile and blocked-user management still require authentication.
- Server projections remove protected values before returning data. Discover search and interest filters use the same visibility rules to avoid revealing hidden values through matching.
- Existing biography, location and free-text hobbies remain available. Legacy hobbies are kept until the user selects structured interests. Known structured interest codes and their labels are maintained in `lib/interests.ts`; codes must not be renamed or recycled.
- Existing accounts are marked onboarding-complete by the compatibility migration. New accounts start at step zero. Completion and progress belong to the account, replacing the old browser-wide skip flag.
- Extra typology values are validated against stable allowlists and always public. Editing a type selected from a test explicitly switches the changed identity to MANUAL; saving unchanged values preserves TEST provenance. Other profile changes do not change Statistics consent.

## Mosaic ID

`User.mid` is an integer allocated by a PostgreSQL GENERATED ALWAYS identity
sequence with a unique index, range check, MAXVALUE 9999999 and NO CYCLE.
Existing rows are ordered by `createdAt`, then `id` for deterministic ties, and
receive IDs starting at one. The sequence starts after the highest backfilled ID.
An update trigger rejects changing an ID. Deleting an account never resets the
sequence; concurrent allocation is atomic. Rolled-back inserts can leave gaps,
which avoids reusing allocated numbers. Exhaustion fails instead of wrapping.

API/UI formatting always uses seven digits. A seven-digit Discover query is an
exact MID lookup, so `0000001` is kept intact in the input and rendered output.

## Onboarding pages and location

New registrations go to `/onboarding`. The server resumes the account's saved step
at `/onboarding/username`, `/display-name`, `/avatar`, `/location`, `/birthday`,
`/bio`, `/interests`, or `/typology` (all under `/onboarding`). Each route renders
one full-page step; the old global dialog has been removed. The onboarding shell
replaces the normal navigation and retains MOSAIC typography and colors.
Changing the URL or using browser history never bypasses the saved progress:
outdated or future URLs redirect to the current step. Use the in-form Back button
to save changes and return to the previous step. Pending saves block the form;
failed saves preserve input and keep the user on the same page.

Username → display name → avatar → location → birth date → biography → interests
→ typology. Every navigation action saves to the authenticated account; the
server checks the expected step to detect concurrent sessions. Back navigation
and save-for-later preserve the current values. Save-for-later returns to the
original destination (the profile by default), pauses automatic redirects in the
current browser tab for that account, and shows a resume link. Opening onboarding
clears that pause; a new browser session resumes unfinished setup automatically.
Completed accounts continue to their requested destination without repeating setup.
Sign-in return paths remain validated and onboarding never overwrites the page
remembered before authentication. Avatar, location, biography and
interests are optional. Final completion requires a username, display name and
birth date. The Tests button saves typology and marks completion before routing
to `/test`; a failed save prevents navigation.

Geolocation is called only from the explicit consent button. Denial, unsupported
browsers and timeouts all keep manual country/city entry available. Exact
coordinates are not saved. After granting permission, the user still selects the
coarse country/city to share; no external reverse-geocoding service is used.

Avatar editing and onboarding use the existing authenticated upload API with
file signature checks. Privacy restricts disclosure of an avatar URL in profile
and social payloads. The existing public Storage bucket does not revoke access
to an image URL already known or copied elsewhere.

## Migration and validation

Three SQL migrations are checked in: profile/visibility and compatibility,
immutable MID allocation, and additional typology with a GIN interest-code index.
They have only been applied to disposable local PostgreSQL databases for tests.
The environment's supplied DATABASE_URL and DIRECT_URL were not migrated.

Fonts (Playfair Display, Cinzel, Cormorant Garamond and Inter) are served with the
app through Fontsource. Build and browser typography no longer fetch Google Fonts.
Clerk remains enabled; no auth bypass or placeholder credentials were introduced.
Prisma uses one cached development client to avoid hot-reload connection churn.

Run ordinary checks:

```sh
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Run the database suite with a local Docker daemon:

```sh
bash scripts/test-profile-database.sh
```

The script provisions a temporary PostgreSQL container, checks the complete
migration chain on a clean database, and checks the three new migrations against
pre-feature data. It tests legacy-account ordering and retention, 40 concurrent
registrations, concurrent provisioning of one Clerk account, MID immutability
and non-reuse, username collisions, profile edits, typology edits, onboarding
resume/completion, exact MID search, friends, privacy and blocking. The container
is removed on exit. The script overrides database URLs per command with loopback
addresses and never uses the inherited production/service database URLs.

UI tests cover explicit geolocation consent and denial, manual location, resume,
back navigation, save failures, completion before Tests, multi-select interests,
name/privacy edits and upload endpoint integration. Clerk and Storage are mocked
in these tests. Real sign-in and remote Storage uploads still require a separate
staging/browser check; passing local tests does not establish remote credentials
or services are reachable. Responsive page layouts use a desktop progress sidebar and a compact mobile
header, normal page scrolling, visible progress, and a focused heading on each
step. Route tests cover authentication, resume, canonical step redirects,
completion, and safe return paths. Gate and wizard tests cover save-for-later,
account separation, save failures, and navigation after successful saves.

## Verification recorded for this branch

- Prisma validate, TypeScript, the full local test suite (80 tests), and a production build pass.
- Eight PostgreSQL integration tests pass separately; the full test suite intentionally skips them without a disposable database URL.
- ESLint reports zero errors and nine warnings (native image rendering, effect cleanup and pre-existing image directives). The build retains the existing `unpdf` bundling warning.
- Local production-server smoke checks return HTTP 200 for `/`, `/sign-in` and a guest public profile. `/profile` returns a 307 sign-in redirect. The public-profile response displays `0000001` and does not contain its private date of birth.
- Clerk publishable/secret key formats and test/live modes match in the applied environment; no key values were printed or committed. Actual signed-in Clerk sessions and remote Supabase uploads were not exercised.


## Full-page onboarding update

This presentation/routing update requires no new database migration. It reuses the
existing eight-step persistence and server validation. Verify on the feature-branch
Preview with a fresh test account; production is not part of this update.

Validation for this update: 96 ordinary tests pass; the eight disposable-PostgreSQL
tests remain skipped without a test database. Typecheck and production build pass;
lint has zero errors and nine existing-category warnings. Live Clerk sign-up and
remote uploads still require a Preview check.
