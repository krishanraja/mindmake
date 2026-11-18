MINDMAKE / PART OF YOUR AI BRAIN

# Fact\-check my board update

Run history was switched off for this run\.

## 2 claims need attention

0 of 4 candidate claims are backed by two or more independent sources and 2 by one source only; read the claim table before sharing the update\.

update\.md

backed: 0 | one source: 2 | conflicting: 1 | not found: 1

## What to do first

### WATCH: Backed by one source only

Cash and short\-term investments were $1\.6bn at 2026\-09\-30\. Cash and short\-term investments were $1\.6bn at 2026\-09\-30\. \[finance\.csv, row 2\]

Next: Add a second, independent source for update line 3, or say where the figure comes from\.

### ACT: Resolve conflicting values

We hired 5 engineers in October\. We hired 3 engineers in October\. \[people\.txt, line 1\]

Next: Check the update against both values at We hired 3 engineers in October\. \[people\.txt, line 1\]\.

### WATCH: Backed by one source only

Alex will deliver the launch plan by 30 November\. Alex will deliver the launch plan by 30 November\. \[plan\.md, line 1\]

Next: Add a second, independent source for update line 5, or say where the figure comes from\.

## Claim table

| Claim | Result | Evidence and location |
| --- | --- | --- |
| Cash and short\-term investments were $1\.6bn at 2026\-09\-30\. \[update\.md, line 3\] | Backed by one source only | Cash and short\-term investments were $1\.6bn at 2026\-09\-30\. \[finance\.csv, row 2\] |
| We hired 5 engineers in October\. \[update\.md, line 4\] | conflicting | We hired 3 engineers in October\. \[people\.txt, line 1\] |
| Alex will deliver the launch plan by 30 November\. \[update\.md, line 5\] | Backed by one source only | Alex will deliver the launch plan by 30 November\. \[plan\.md, line 1\] |
| Customer satisfaction was higher than September\. \[update\.md, line 6\] | not found | No matching statement in the supplied evidence |

## What happened to each file

| File | Outcome | Why |
| --- | --- | --- |
| finance\.csv | Used | Supported 1 claim\. |
| people\.txt | Used | Supported 1 claim\. |
| plan\.md | Used | Supported 1 claim\. |

## Plain\-language check

36 words\. Hedges 0, filler 0 and stock phrases 0 per 1,000 words\. These are flags to read, not errors\.

| Line | Kind | Words | Why it matters |
| --- | --- | --- | --- |
| None | None | No flags | Nothing in the general rule set was found\. |

## What we need from you to finish

- Add a dated evidence passage or CSV statement column for update line 6: Customer satisfaction was higher than September\.

## What this could not establish

- Backed means matching text in two or more independent supplied files, not proof that a statement is true\. Rows that name the same source, and identical copies of a file, count once\. A copy or stale source can still repeat an error\.
- This deterministic sweep catches numeric, date, commitment and comparison patterns\. It cannot guarantee that every implied or unusually worded claim is recognised; review the original update alongside the table\.
- Matching requires the same statement wording after case, spacing and numeric formatting are normalised\. A near match that carries every number is shown as a possible paraphrase with the words the source never said; you decide whether it means the same\. Conflicts use different numeric values or explicit not/never negation in the same wording\. Different reporting dates can also cause a numeric conflict\.
- Figures from one to twelve, and years, are not called unsupported on their own: they are too common to judge\. Plain\-language flags come from a general rule set and are for you to judge\.
- CSV evidence accepts claim or statement, or metric, period, value and optional currency and source columns\. Other rows are shown as labelled fields\.
- Run history is kept only on this computer, in your user folder, and is never sent anywhere\. It stores the results and the text of the items checked, not your files\.

<details><summary>Details for checking</summary>

```json
{
  "Fingerprint": "cffaaf9a495bfa4e8ea27478d13fea393cc3928047438c160eab8795b62d0b36",
  "Findings": [
    {
      "Id": "claim-1",
      "Evidence": "Cash and short-term investments were $1.6bn at 2026-09-30.\nCash and short-term investments were $1.6bn at 2026-09-30. [finance.csv, row 2]",
      "Severity": "watch",
      "Title": "Backed by one source only",
      "Action": "Add a second, independent source for update line 3, or say where the figure comes from."
    },
    {
      "Id": "claim-2",
      "Evidence": "We hired 5 engineers in October.\nWe hired 3 engineers in October. [people.txt, line 1]",
      "Severity": "act",
      "Title": "Resolve conflicting values",
      "Action": "Check the update against both values at We hired 3 engineers in October. [people.txt, line 1]."
    },
    {
      "Id": "claim-3",
      "Evidence": "Alex will deliver the launch plan by 30 November.\nAlex will deliver the launch plan by 30 November. [plan.md, line 1]",
      "Severity": "watch",
      "Title": "Backed by one source only",
      "Action": "Add a second, independent source for update line 5, or say where the figure comes from."
    },
    {
      "Id": "claim-4",
      "Evidence": "Customer satisfaction was higher than September.\nNo matching statement in the supplied evidence",
      "Severity": "unknown",
      "Title": "Evidence not found",
      "Action": "Add a dated evidence passage or CSV statement column for update line 6: Customer satisfaction was higher than September."
    }
  ],
  "Figures": {
    "Claims": [
      {
        "Text": "Cash and short-term investments were $1.6bn at 2026-09-30.",
        "Line": 3,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "c424b77fc6a0b3624a7b885acdd6cca3084eadcaaf732d539c771302c0c71203",
          "Row": null,
          "Line": 3,
          "Date": null
        },
        "Status": "one source",
        "Evidence": [
          {
            "Text": "Cash and short-term investments were $1.6bn at 2026-09-30.",
            "Raw": "statement\nCash and short-term investments were $1.6bn at 2026-09-30.\n",
            "Owner": null,
            "Source": {
              "File": "finance.csv",
              "Fingerprint": "34b9868ddbe9f45829d652b214428f2682855744a1f223c46b4c1dedf88f32a8",
              "Row": 2,
              "Line": null,
              "Date": null
            }
          }
        ],
        "Locations": "Cash and short-term investments were $1.6bn at 2026-09-30. [finance.csv, row 2]",
        "Independent sources": 1,
        "Estimate": false,
        "Commitment": false,
        "Unsupported figures": [],
        "Paraphrase": null
      },
      {
        "Text": "We hired 5 engineers in October.",
        "Line": 4,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "c424b77fc6a0b3624a7b885acdd6cca3084eadcaaf732d539c771302c0c71203",
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
        "Locations": "We hired 3 engineers in October. [people.txt, line 1]",
        "Independent sources": 0,
        "Estimate": false,
        "Commitment": false,
        "Unsupported figures": [],
        "Paraphrase": null
      },
      {
        "Text": "Alex will deliver the launch plan by 30 November.",
        "Line": 5,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "c424b77fc6a0b3624a7b885acdd6cca3084eadcaaf732d539c771302c0c71203",
          "Row": null,
          "Line": 5,
          "Date": null
        },
        "Status": "one source",
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
        "Locations": "Alex will deliver the launch plan by 30 November. [plan.md, line 1]",
        "Independent sources": 1,
        "Estimate": false,
        "Commitment": true,
        "Unsupported figures": [],
        "Paraphrase": null
      },
      {
        "Text": "Customer satisfaction was higher than September.",
        "Line": 6,
        "Heading": false,
        "Source": {
          "File": "update.md",
          "Fingerprint": "c424b77fc6a0b3624a7b885acdd6cca3084eadcaaf732d539c771302c0c71203",
          "Row": null,
          "Line": 6,
          "Date": null
        },
        "Status": "not found",
        "Evidence": [],
        "Locations": "No matching statement in the supplied evidence",
        "Independent sources": 0,
        "Estimate": false,
        "Commitment": false,
        "Unsupported figures": [],
        "Paraphrase": null
      }
    ],
    "Update fingerprint": "c424b77fc6a0b3624a7b885acdd6cca3084eadcaaf732d539c771302c0c71203",
    "Evidence fingerprint": "e2c25c0b3eef007c0315cad2f47e57673582b4ab8d16f05652850ec5866a0f00",
    "Copies of the update excluded": 0,
    "Skipped": [],
    "Files": [
      {
        "File": "finance.csv",
        "Outcome": "Used",
        "Reason": "Supported 1 claim."
      },
      {
        "File": "people.txt",
        "Outcome": "Used",
        "Reason": "Supported 1 claim."
      },
      {
        "File": "plan.md",
        "Outcome": "Used",
        "Reason": "Supported 1 claim."
      }
    ],
    "Plain language": {
      "Words": 36,
      "Flags": [],
      "Rates": {
        "Hedges per 1000 words": 0,
        "Filler per 1000 words": 0,
        "Stock phrases per 1000 words": 0
      }
    },
    "Memory": {
      "Status": "not remembered",
      "Subject": "update.md",
      "Outcome digest": "3bafe9940e4581ccc60b7d6fd91e19e9617b9993c01878e7538eb59754ec601e",
      "Changes": [],
      "Note": "Run history was switched off for this run."
    }
  },
  "Checks": []
}
```

</details>

## Where to go next

- More parts of your AI brain: <https://mindmake.co/parts>
- Build your whole AI brain with Mindmake: <https://mindmake.co>

You will never get marketing emails from us\. We will check in with you once, personally, to make sure this part is working for you\. If it is not, we will run a free session with you to put it right\. Reply to your download email at any time\.

## Who decided

**What this kit checked:** Detected claims in your update were checked against the supplied evidence for matching wording, conflicting numbers, negation, a second independent source, unsupported figures, paraphrases and firm promises, then compared with your last run\.

**What only you can judge:** Whether the evidence is trustworthy and the update gives the board a fair account of the business\.

AI makes strong judgement stronger and weak judgement weaker. This report is built to make yours stronger.

---

Calculated on this computer. Input files left unchanged. Review missing facts before acting.
