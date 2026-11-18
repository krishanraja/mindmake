MINDMAKE / PART OF YOUR AI BRAIN

# Fact\-check my board update

## 2 claims need attention

2 of 4 candidate claims match supplied evidence; read the claim table before sharing the update\.

update\.md

backed: 2 | conflicting: 1 | not found: 1

## What to do first

### ACT: Resolve conflicting values

We hired 5 engineers in October\. We hired 3 engineers in October\. \[people\.txt, line 1\]

Next: Check the update against both values at We hired 3 engineers in October\. \[people\.txt, line 1\]\.

## Claim table

| Claim | Result | Evidence and location |
| --- | --- | --- |
| Revenue in October was GBP 40000\. \[update\.md, line 3\] | backed | Revenue in October was GBP 40000\. \[finance\.csv, row 2\] |
| We hired 5 engineers in October\. \[update\.md, line 4\] | conflicting | We hired 3 engineers in October\. \[people\.txt, line 1\] |
| Alex will deliver the launch plan by 30 November\. \[update\.md, line 5\] | backed | Alex will deliver the launch plan by 30 November\. \[plan\.md, line 1\] |
| Customer satisfaction was higher than September\. \[update\.md, line 6\] | not found | No matching statement in the supplied evidence |

## What we need from you to finish

- Add a dated evidence \.md/\.txt passage or CSV statement column for update line 6: Customer satisfaction was higher than September\.

## What this could not establish

- Backed means matching text in the supplied files, not independent proof that a statement is true\. A copy or stale source can repeat an error\.
- This deterministic sweep catches numeric, date, commitment and comparison patterns\. It cannot guarantee that every implied or unusually worded claim is recognised; review the original update alongside the table\.
- Matching requires the same statement wording after case, spacing and numeric formatting are normalised\. Paraphrases stay not found\. Conflicts use different numeric values or explicit not/never negation in the same wording\. Other semantic conflicts need human review; different reporting dates can also cause a numeric conflict\.
- CSV evidence accepts claim or statement, or metric, period, value and optional currency columns\. Other rows are shown as labelled fields\.

<details><summary>Details for checking</summary>

```json
{
  "Fingerprint": "eee5ba1a91439bb8b555035dee274e9b5df0da4b5b081ed9b801dd6ab6bbdc35",
  "Findings": [
    {
      "Id": "claim-1",
      "Severity": "act",
      "Title": "Resolve conflicting values",
      "Evidence": "We hired 5 engineers in October.\nWe hired 3 engineers in October. [people.txt, line 1]",
      "Action": "Check the update against both values at We hired 3 engineers in October. [people.txt, line 1]."
    },
    {
      "Id": "claim-2",
      "Severity": "unknown",
      "Title": "Evidence not found",
      "Evidence": "Customer satisfaction was higher than September.\nNo matching statement in the supplied evidence",
      "Action": "Add a dated evidence .md/.txt passage or CSV statement column for update line 6: Customer satisfaction was higher than September."
    }
  ],
  "Figures": {
    "Claims": [
      {
        "Text": "Revenue in October was GBP 40000.",
        "Line": 3,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "e7ca6283cbca7c87c51a7137ccd660a1b52835a377d703af39a770e4c45371bb",
          "Row": null,
          "Line": 3,
          "Date": null
        },
        "Status": "backed",
        "Evidence": [
          {
            "Text": "Revenue in October was GBP 40000.",
            "Raw": "metric,period,value,currency\nRevenue,October,40000,GBP\n",
            "Source": {
              "File": "finance.csv",
              "Fingerprint": "6a2a9095e06d8237db92fcc5913d56ee3d4da5f1c81c7c91c3da8357d45ed04c",
              "Row": 2,
              "Line": null,
              "Date": null
            }
          }
        ],
        "Locations": "Revenue in October was GBP 40000. [finance.csv, row 2]"
      },
      {
        "Text": "We hired 5 engineers in October.",
        "Line": 4,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "e7ca6283cbca7c87c51a7137ccd660a1b52835a377d703af39a770e4c45371bb",
          "Row": null,
          "Line": 4,
          "Date": null
        },
        "Status": "conflicting",
        "Evidence": [
          {
            "Text": "We hired 3 engineers in October.",
            "Raw": "We hired 3 engineers in October.\n",
            "Source": {
              "File": "people.txt",
              "Fingerprint": "91536ceb05add028b7b30316591a39b07e652b3aca724688b3847c196fd7a60f",
              "Row": null,
              "Line": 1,
              "Date": null
            }
          }
        ],
        "Locations": "We hired 3 engineers in October. [people.txt, line 1]"
      },
      {
        "Text": "Alex will deliver the launch plan by 30 November.",
        "Line": 5,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "e7ca6283cbca7c87c51a7137ccd660a1b52835a377d703af39a770e4c45371bb",
          "Row": null,
          "Line": 5,
          "Date": null
        },
        "Status": "backed",
        "Evidence": [
          {
            "Text": "Alex will deliver the launch plan by 30 November.",
            "Raw": "Alex will deliver the launch plan by 30 November.\n",
            "Source": {
              "File": "plan.md",
              "Fingerprint": "9df858e165f982a3510c949441a471a44952636fda82275259d979aeb6a1150d",
              "Row": null,
              "Line": 1,
              "Date": null
            }
          }
        ],
        "Locations": "Alex will deliver the launch plan by 30 November. [plan.md, line 1]"
      },
      {
        "Text": "Customer satisfaction was higher than September.",
        "Line": 6,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "e7ca6283cbca7c87c51a7137ccd660a1b52835a377d703af39a770e4c45371bb",
          "Row": null,
          "Line": 6,
          "Date": null
        },
        "Status": "not found",
        "Evidence": [],
        "Locations": "No matching statement in the supplied evidence"
      }
    ],
    "Update fingerprint": "e7ca6283cbca7c87c51a7137ccd660a1b52835a377d703af39a770e4c45371bb",
    "Evidence fingerprint": "d011c894439be59ae35a6dac73c072e387bb84db4131a8288476c3cf3c86ba9d",
    "Copies of the update excluded": 0,
    "Skipped": []
  },
  "Checks": []
}
```

</details>

## Who decided

**What this kit checked:** Detected claims in your update were checked for matching wording, conflicting numbers and explicit negation in the supplied evidence\.

**What only you can judge:** Whether the evidence is trustworthy and the update gives the board a fair account of the business\.

AI makes strong judgement stronger and weak judgement weaker. This report is built to make yours stronger.

---

Calculated on this computer. Input files left unchanged. Review missing facts before acting.
