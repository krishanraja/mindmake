# Local route-smoke evidence for the r18 pass

These are `qa:release-routes` runs from a Linux development container, not a CI
release receipt. They are kept because one of them failed and the reason is a
standing limitation rather than a defect in the change they were run against.

Build under test: `dist` document digest `2db9ce8cba27`, the
`/new-age-leadership` scroll-build repair recorded in
`quality/route-lock/approved-production-r18.json`.

| Engine | Cases | Result |
| --- | --- | --- |
| chromium | 104 + 5 supplemental | pass |
| firefox | 52 + 2 supplemental | pass |
| webkit | 52 | 2 failed |

Both WebKit failures are `/case-studies`, at 390x844 and 1440x900, and neither
is a failure of the route this pass changed. The recorded readiness for each
stops at `curtain-released` with one request still outstanding:

    /assets/opportunities-resolve-loop-r01-20s-720p-web-sealed-S9fA_MZl.mp4

That is the documented Linux WebKit media limitation, and it is why
`.github/workflows/approved-route-lock.yml` runs WebKit on macOS rather than
here. The two `core-navigation` entries in the same reports are knock-on: the
page is already wedged when they run.

The macOS WebKit leg in CI is what covers this engine for the release. Nothing
in this directory should be read as standing in for it.
