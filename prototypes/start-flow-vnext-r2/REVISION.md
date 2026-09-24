# Start flow vNext r2 revision record

This is a routine locked revision of the approved `start-flow-vnext` interaction prototype. The baseline is preserved unchanged.

## Baseline

- Path: `prototypes/start-flow-vnext/index.html`
- SHA-256: `21BD770704C514F6779F7C1A707CE159F0895CB7C4AD265BFCF0DDBA61569A5C`

## Candidate

- Path: `prototypes/start-flow-vnext-r2/index.html`
- SHA-256: `E1CC32E7B44E8F2D4048E47CFBAD924F69BC475EE27499DED18F61922FE4413F`
- Paired review: `prototypes/start-flow-vnext-r2/review.html`
- Paired-review SHA-256: `4FEC1A4B5B8D1B5FF31207FD47977CD781078A94EA0FB28B1DF28DF5D78F4752`

## Declared delta

- Reserve a deliberate bottom exclusion zone for browser and app chrome: 48 px desktop, 28 px mobile, 14 px compact mobile and 24 px shallow landscape before the platform safe-area inset is considered.
- Reduce only the vertical row gap on shallow landscape step two so the larger bottom reserve does not create internal scrolling.
- Update the prototype title and visible revision date.
- Add a paired desktop-and-mobile review surface with direct links to each live treatment.
- Upgrade the shared prototype gate to measure the entire action rail, including privacy and recovery copy, against a synthetic bottom-system-chrome zone.

## Preserved invariants

- Copy, questions, answer options and button labels are unchanged.
- Step order, keyboard behaviour, history and close/recovery behaviour are unchanged.
- Desktop drawer and mobile full-width sheet compositions are unchanged.
- Typography, colour, image treatment and interaction timing are unchanged.

## Verification

`npm run qa:start-flow-prototype -- --base http://127.0.0.1:4190/prototypes/start-flow-vnext-r2/` passes at 1440 x 900, 1024 x 768, 390 x 844, 375 x 812, 320 x 568 and 844 x 390.

Measured rendered clearance beneath the complete action rail is 48 px at desktop, 28 px at 390 x 844, 14 px at 320 x 568 and 21-22 px in shallow landscape. No target is smaller than 44 px; no tested state has internal or horizontal overflow.
