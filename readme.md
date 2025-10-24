# Path to Eagle — Tracker & Timeline

**Version:** 1.0 (Initial Release)  
**Workbook:** `Path_to_Eagle_Complete_Tracker.xlsx`

A full-journey tracker for Scouts (Scout → Tenderfoot → Second Class → First Class → Star → Life → Eagle) with:
- rank requirement tables,
- automatic eligibility & projected Board of Review (BOR) dates,
- a simplified Gantt timeline,
- a print-friendly progress report,
- a centralized **Profile** (feeds a header on every sheet),
- a **Leadership Log** (feeds “Approved By” dropdowns for sign-offs).

---

## Contents
- [1. Purpose & Scope](#1-purpose--scope)
- [2. What’s Included (Sheets Overview)](#2-whats-included-sheets-overview)
- [3. Quick Start (5 minutes)](#3-quick-start-5-minutes)
- [4. Profile Tab (Scout-User)](#4-profile-tab-scout-user)
- [5. Leadership Log (Approvers)](#5-leadership-log-approvers)
- [6. Standard Header on Every Sheet](#6-standard-header-on-every-sheet)
- [7. Rank Sheets (Scout → Eagle)](#7-rank-sheets-scout--eagle)
- [8. Eagle Badges (14 Required + 7 Electives)](#8-eagle-badges-14-required--7-electives)
- [9. Overview (Rank Timeline)](#9-overview-rank-timeline)
- [10. Progress Report (Printable One-Pager)](#10-progress-report-printable-one-pager)
- [11. Gantt (Simple Timeline)](#11-gantt-simple-timeline)
- [12. Projection Logic & Formulas](#12-projection-logic--formulas)
- [13. Using Approval Dropdowns](#13-using-approval-dropdowns)
- [14. Printing & Page Layout](#14-printing--page-layout)
- [15. Multi-User / Multi-Scout Setup](#15-multi-user--multi-scout-setup)
- [16. Data Protection & Youth Privacy](#16-data-protection--youth-privacy)
- [17. Customization & Theming](#17-customization--theming)
- [18. Troubleshooting](#18-troubleshooting)
- [19. FAQ](#19-faq)
- [20. Change Log & Maintenance](#20-change-log--maintenance)
- [21. Repo Hints (VS Code / CI)](#21-repo-hints-vs-code--ci)

---

## 1) Purpose & Scope
This workbook lets a Scout (and leaders/parents) see the full path to Eagle, track requirement starts/completions, project eligibility & BOR dates, visualize progress, and capture which leader approved each requirement.

---

## 2) What’s Included (Sheets Overview)

**Profile**  
Scout info (Name, SID#, DOB→Age auto, Phone, Email, Unit, Council, Current Rank) and **Next 3 Steps**.  
_All other sheets pull header fields from here._

**Leadership Log**  
Roster of approvers (Initials, Full Name, Position, Phone, Email, SID#).  
_Requirement rows use a dropdown of these Initials for “Approved By.”_

**Inputs**  
Globals for projections: Today’s Date, default BOR Buffer (days), optional merit badge pace.

**Rank Tabs:** `Scout`, `Tenderfoot`, `Second Class`, `First Class`, `Star`, `Life`, `Eagle`  
Condensed requirements, Start/Done dates, auto **Eligible/Auto** (for duration-gated items), and **Projected BOR (with buffer)**.

**Eagle Badges**  
14 Eagle-required + 7 elective placeholders, automatic counts, and milestone dates that feed back to the Eagle sheet.

**Overview**  
One line per rank: **Previous BOR (auto)**, **Projected BOR**, **Actual BOR**.

**Progress Report**  
Print-ready snapshot with header block, current/next rank, timeline, and **Next 3 Steps**.

**Gantt**  
Simple timeline (data bars) showing Start → Projected BOR per rank.

---

## 3) Quick Start (5 minutes)
1. **Profile:** fill in Scout info; DOB auto-calculates Age. Enter the **Next 3 Steps**.  
2. **Leadership Log:** add approvers; keep **Initials** unique and consistent.  
3. Open the current **rank tab** (e.g., Tenderfoot). Enter **Start**/**Done** dates as items are signed.  
4. In **Approved By (Initials)** choose the signing leader from the dropdown.  
5. Check **Overview** / **Progress Report** for projected timelines; tweak **Inputs → BOR buffer** to match your unit/district cadence.

---

## 4) Profile Tab (Scout-User)
**Fields:** Name · SID# · DOB · Age (auto) · Phone · Email · Unit · Council · Current Rank · **Next 3 Steps**.  
The Profile feeds the printed header across the workbook and the “Next 3 Steps” panel in **Progress Report**.

---

## 5) Leadership Log (Approvers)
**Columns:** Initials · Full Name · Position · Phone · Email · SID# (BSA ID).  
- Requirement sheets reference **Initials** (column A) for the approval dropdown.  
- If initials change, update them here to propagate globally.

---

## 6) Standard Header on Every Sheet
Each sheet prints a standardized header with **Name, SID#, Age, Phone, Unit, Council, Current Rank** pulled live from **Profile**, set to **repeat on every printed page**.

---

## 7) Rank Sheets (Scout → Eagle)
Each rank tab includes:
- **BOR summary**: Previous BOR (auto), This Rank BOR (Actual), This Rank BOR (Projected).  
- **Requirement rows**: Start Date, Done Date, optional **duration** (e.g., 30-day or 4-week fitness streak), auto **Eligible/Auto** for duration-gated tasks, **Approved By (Initials)** dropdown, and Notes.  
- **Star / Life** add tenure (Active months), POR months, and rank-level merit badge mini-tables (6/4 and 11/7).  
- **Eagle** is summarized here; see **Eagle Badges** for the 14 required and total 21 count gates.

---

## 8) Eagle Badges (14 Required + 7 Electives)
- Enter completion dates; counts auto-update (required, elective, total).  
- Two milestone dates auto-compute:
  - **Date All Required Completed (14)**
  - **Date 21 Badges Completed**  
- These dates feed back to the Eagle tab’s milestone rows.

---

## 9) Overview (Rank Timeline)
A compact, single place to see each rank’s **Previous BOR (auto)**, **Projected BOR**, and **Actual BOR** (once set).

---

## 10) Progress Report (Printable One-Pager)
Print-friendly (portrait, fit-to-width) with:
- standard header,
- current / next rank,
- rank timeline,
- **Next 3 Steps** from Profile.

---

## 11) Gantt (Simple Timeline)
A visual of Start → Projected Finish (BOR) per rank with a duration **data bar** for quick scanning.

---

## 12) Projection Logic & Formulas

**Month-based clocks**  
```
Eligibility = EDATE(Start, n_months)
```
- Star active time (4 months), Life active time (6 months), Eagle (active as Life 6 months; leadership 6 months).

**Fixed-day streaks**  
```
Eligibility = Start + N days
```
- Tenderfoot fitness plan: **30 days**.  
- Second Class / First Class fitness streaks: **28 days** (4 weeks).

**Badge gates**  
- When count thresholds are met, **Gate Date = MAX(all relevant completion dates)**.

**Per-rank eligibility**  
```
Projected Eligibility = MAX(all Eligible/Auto cells, all Done dates)
Projected BOR (buffered) = Projected Eligibility + BufferDays
```
(BufferDays is set on **Inputs**—default 21.)

**Eagle projection**  
```
Projected Eligibility (Eagle) = MAX(
  Life active 6 mo,
  Life leadership 6 mo,
  Date all 14 required badges completed,
  Date 21 badges completed,
  Project milestones (proposal/work/report/UL conf/app)
)
Projected Board Date = Projected Eligibility + BufferDays
```

---

## 13) Using Approval Dropdowns
- Every requirement row has **Approved By (Initials)** with a dropdown sourced from **Leadership Log → Initials (A2:A200)**.  
- If a leader isn’t listed, add them to the log; the dropdowns update automatically.

---

## 14) Printing & Page Layout
- The header is configured to **repeat** on every printed page.  
- **Progress Report** is tuned for a one-pager.  
- If your council/district needs more header fields: add them on **Profile** and extend each sheet’s header formulas.

---

## 15) Multi-User / Multi-Scout Setup

**Simplest:** one workbook **per Scout**  
- Duplicate `Path_to_Eagle_Complete_Tracker.xlsx`.  
- Use versioned filenames (e.g., `Lastname_Firstname_PathToEagle_v1.xlsx`).

**Web / portal approach:**  
- Move data to a DB (SQLite/Postgres) to avoid concurrent-edit issues.  
- Map Profile + Leadership Log to forms/tables; generate the workbook as an export.  
- Add auth, activity/audit logs (timestamp, user, requirement, approver).

---

## 16) Data Protection & Youth Privacy
- Limit PII to what’s necessary; restrict access to registered leaders/guardians.  
- For screenshots or demos, **redact** name, SID#, DOB, phone, email.  
- Follow your council’s and organization’s youth protection policies.

---

## 17) Customization & Theming
- Add troop colors/crest, extra Profile fields, or local milestones.  
- If inserting columns or moving blocks, confirm dependent formulas still point to the intended ranges (especially headers and approval columns).

---

## 18) Troubleshooting
- **Projected BOR is blank** → Enter required **Start**/**Done** dates; ensure the **previous rank BOR** is set (actual or projected).  
- **Approval list empty** → Populate **Leadership Log** (Initials in column A).  
- **Dates render as numbers** → Format as **Date** (`yyyy-mm-dd`).  
- **Array-style formulas not evaluating** → In older Excel, use helper cells/ranges or ensure dynamic arrays are supported.

---

## 19) FAQ
**Q:** Can a Scout work on multiple ranks at once?  
**A:** Requirements can be pursued in parallel, but **ranks are earned in order**. Use **Overview** to sequence BORs.

**Q:** How do we track POR across multiple roles?  
**A:** Enter the initial start date; use **Notes** for ranges. For granular tracking, add a POR Log sheet.

**Q:** Can we store counselor info with badges?  
**A:** Yes—add columns to **Eagle Badges** (Counselor Name/Phone/Email). Keep count/date formulas intact.

---

## 20) Change Log & Maintenance
- **v1.0** — Initial release: Profile, Leadership Log, repeating headers, rank sheets, Eagle Badges, Overview, Progress Report, Gantt.  
- **v1.1** — _<date>_: _<summary of updates>_  
- **v1.2** — _<date>_: _<summary of updates>_

---

## 21) Repo Hints (VS Code / CI)

**Suggested tree**
```
/ (repo)
├─ /docs
│  ├─ README_Path_to_Eagle.docx
│  └─ screenshots/ (optional, with redactions)
├─ /tooling
│  └─ scripts/ (ETL/export/import if you web-enable)
├─ README.md
└─ Path_to_Eagle_Complete_Tracker.xlsx
```

**VS Code tips**
- Add an **Excel** or **Office** extension to preview sheets quickly.
- Use a **.gitattributes** rule (`*.xlsx binary`) to avoid spurious diffs.
- For web enablement, manage state in a DB and offer exports to this template.

**CI ideas**
- Lint scripts that generate/update the workbook (schema checks).
- Optional: a unit test that opens the workbook and confirms critical ranges exist (headers, validation lists, formulas not #REF!).

---

### Best Practices (Quick List)
- Keep one authoritative copy per Scout; version filenames.  
- Enter **Actual BOR** dates promptly (they anchor tenure clocks).  
- Start timed fitness items immediately; mirror them into **Next 3 Steps**.  
- Standardize leader **Initials**; avoid duplicates.  
- Before printing, sanity-check **Progress Report** and header.

---

**Questions / improvements?** Open an issue or PR with examples (redacted).

