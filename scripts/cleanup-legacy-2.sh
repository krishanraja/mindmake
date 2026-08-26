#!/usr/bin/env bash
# Follow-up to cleanup-legacy.sh (same approved HANDOVER/05 batch):
# the retired static testimonials tool, missed in the first pass. Its
# public route already redirects to /case-studies.
set -euo pipefail
git rm -r -q public/testimonials
echo "testimonials static tool removed"
