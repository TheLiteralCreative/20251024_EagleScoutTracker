# Eagle Rank — Detailed Requirements & UX Notes (as of 2025‑10‑24)

**Purpose:** Provide product‑ready requirement text for **Eagle** rank (Scouts BSA), with clear descriptions, acceptance notes, and official citations that your Eagle Tracker UX can render as requirement cards. Paraphrased for clarity; link to source for exact wording.

---

## 1) Direct Answer (concise)
**Eagle** requires sustained participation as a **Life** Scout, completion of **21 merit badges (14 Eagle‑required)**, **six months** of **leadership** in an approved position **as a Life Scout**, planning and leading an **Eagle Scout service project** with all required approvals and report, **Scout spirit**, **Scoutmaster conference**, and an **Eagle board of review** (with a **statement of ambitions & life purpose** for the BOR). (Official sources cited below.)

---

## 2) Requirement List with Detailed Descriptions (product‑ready)
> **Use in UI:** Each bullet = one requirement card. Include fields: `status`, `date_completed`, `signed_by`, `evidence_link`, `source_url`. Group cards by headings to mirror the official layout.

### PARTICIPATION & SCOUT SPIRIT
**EAGLE‑1. Active in unit (6 months as Life)**  
- **Do:** Be **active in your troop/crew/ship** for **at least six months** **as a Life Scout**.  
- **Accept:** Attendance/participation consistent with unit expectations per **Guide to Advancement** (GTA); units may **not** add extra attendance quotas. Link to calendar/check‑ins.  
- **Source:** Eagle Rank Requirements PDF (2024), Req 1; GTA 2025.

**EAGLE‑2. Scout spirit**  
- **Do:** As a Life Scout, **demonstrate Scout spirit** by living the **Scout Oath & Law**; **tell how** you have done your **duty to God**, lived the Oath & Law **daily**, and **how these ideals will guide your life**.  
- **Accept:** Conversation/reflection with unit leader; not a retest of skills.  
- **Source:** Eagle PDF (2024), Req 2.

### MERIT BADGES
**EAGLE‑3. Twenty‑one merit badges total (14 Eagle‑required)**  
- **Do:** **Earn a total of 21 merit badges**, including the **14 Eagle‑required** badges listed below. The remaining **7** may be **any** others.  
- **The 14 Eagle‑required badges:**  
  1) **First Aid**  
  2) **Citizenship in the Community**  
  3) **Citizenship in the Nation**  
  4) **Citizenship in Society**  
  5) **Citizenship in the World**  
  6) **Communication**  
  7) **Cooking**  
  8) **Personal Fitness**  
  9) **Personal Management**  
  10) **Camping**  
  11) **Family Life**  
  12) **Emergency Preparedness** **or** **Lifesaving** *(choose one)*  
  13) **Environmental Science** **or** **Sustainability** *(choose one)*  
  14) **Swimming** **or** **Hiking** **or** **Cycling** *(choose one)*  
- **Accept:** Scoutbook import or blue cards; mark Eagle‑required badges distinctly.  
- **Notes:** **Citizenship in Society** is mandatory for Eagle (effective 2022); confirm any mid‑year requirement changes on the official pages.  
- **Source:** Eagle PDF (2024), Req 3; Scouts BSA Requirements 2025; Eagle‑Required MB hub.

### LEADERSHIP
**EAGLE‑4. Position of Responsibility (6 months as Life) OR leadership project**  
- **Do:** While a **Life Scout**, **serve actively for six months** in **one or more** approved **positions of responsibility (POR)** **OR** carry out a **Scoutmaster‑approved leadership project** to help your troop.  
- **Approved PORs — Scouts BSA troop:** patrol leader; assistant senior patrol leader; senior patrol leader; troop guide; OA troop representative; den chief; scribe; librarian; historian; quartermaster; bugler; junior assistant Scoutmaster; chaplain aide; instructor; webmaster; outdoor ethics guide.  
- **Venturing crew equivalents:** president; vice president; secretary; treasurer; **den chief**; historian; guide; quartermaster; chaplain aide; outdoor ethics guide.  
- **Sea Scout ship equivalents:** boatswain; boatswain’s mate; purser; yeoman; storekeeper; crew leader; media specialist; specialist; **den chief**; chaplain aide.  
- **Lone Scout:** leadership responsibility in school, religious organization, club, or community.  
- **Important:** **Assistant patrol leader is *not* an approved POR** for **Star, Life, or Eagle**.  
- **Accept:** Track start/end dates per POR; leadership project requires written plan & completion evidence.  
- **Source:** Eagle PDF (2024), Req 4 & POR footnotes; GTA 2025.

### EAGLE SCOUT SERVICE PROJECT
**EAGLE‑5. Plan, develop, and give leadership to a service project**  
- **Do:** While a Life Scout, **plan, develop, and give leadership** to others in a **service project** helpful to **any religious institution, school, or community**.  
- **Approvals (before work begins):** Benefiting organization; unit leader; unit committee; **council/district** (via the **Eagle Scout Service Project Workbook** proposal section).  
- **Deliverables:** Completed project **Proposal** (approved in advance), **Final Plan** (strongly recommended), **Fundraising Application** (if applicable), and **Project Report**, all within the official **Workbook**.  
- **Constraints:** The project must be **Scout‑led**; may **not** be **routine labor** or a **commercial/fundraising** effort; must **benefit** an eligible organization; safety and two‑deep leadership policies apply.  
- **Accept:** Upload signed proposal approval page (pre‑work) plus **final signed report** (post‑work).  
- **Source:** Eagle PDF (2024), Req 5; **Eagle Scout Service Project Workbook** (2023a); GTA 2025, section 9.0.2.0ff.

### CONFERENCE & BOARD OF REVIEW (WITH BOR PREP STATEMENT)
**EAGLE‑6. Scoutmaster conference**  
- **Do:** While a Life Scout, **participate in a Scoutmaster conference**. (A conference is **not a retest**.)  
- **Source:** Eagle PDF (2024), Req 6; GTA 2025.  

**EAGLE‑7. Board of review + BOR prep statement**  
- **Do:** **Successfully complete** an **Eagle Scout board of review**.  
- **BOR prep:** **Before** the BOR, **prepare** and bring a **Statement of your ambitions and life purpose** and a **listing of leadership positions held**, honors, and awards.  
- **Appeal:** If not approved, the decision **may be appealed** per **GTA 8.0.4.0**.  
- **Source:** Eagle PDF (2024), Req 7; Eagle Scout Rank Application (2025); GTA 2025.

---

## 3) Acceptance & Policy Notes (for implementers)
- **Active participation (Req 1):** Use GTA definitions for “active” (registration, participation, Scout spirit). Units may **not** add requirements.  
- **MB validation (Req 3):** Validate **total = 21** with **Eagle‑required = 14** across the three **choose‑one** groups. Surface warning if MB requirement texts changed after app’s “version_checked.”  
- **POR tracking (Req 4):** Support **multi‑POR accumulation** to reach **6 months**; enforce that the POR service occurs **as a Life Scout**; exclude **assistant patrol leader**.  
- **Project workflow (Req 5):** Implement **gated stages** (Proposal → Approvals → Plan → Execution → Report → Signatures). Store PDFs from the official **Workbook**; include fields for beneficiary contact, scope, hours, materials, fundraising approval, hazards/safety.  
- **Dates vs. 18th birthday:** **All rank requirements (1–7) must be completed before the Scout’s 18th birthday**; the **BOR may be held after** the 18th per GTA.  
- **BOR & conference:** Neither is a retest; they assess readiness and compliance with policy.  

---

## 4) Data Model Suggestions (UX)
- **Requirement fields:** `id`, `title`, `detail`, `status`, `date_completed`, `signed_by`, `source_url`, `evidence_link`, `subtasks[]`, `notes`.  
- **Merit badge schema:** total badges (21), list of 14 Eagle‑required with **group logic**; validation rules for **choose‑one** sets.  
- **POR schema:** role, start_date, end_date, unit_type, leadership_project (bool + artifact).  
- **Project schema:** proposal approvals (beneficiary/unit/council), final plan file, fundraising approval, execution logs (dates, participants, hours), risk controls, photos, final report signatures.  
- **BOR prep schema:** ambitions_statement (file/text), leadership/awards list, references listed on **Eagle Application**.  
- **Audit fields:** `version_checked = 2025‑10‑24`, `source_urls[]` per card.

---

## 5) Uncertainty Box
- **Unknowns:** Mid‑year edits to wording; minor workbook/version updates; local council processing specifics (but **requirements** are national).  
- **Assumptions:** The **2024 Eagle Rank PDF** equals the current online requirement text; **Scouts BSA Requirements 2025** is consistent.  
- **Data quality:** High (official PDFs & policy guide).  
- **Reduce uncertainty:** Link directly to **Eagle PDF**, **Eagle Application (latest)**, **Workbook (2023a or newer)**, **GTA 2025**; display in‑app “last verified” timestamp.  
- **Confidence:** **High** (checked **2025‑10‑24**).

---

## 6) Citations (official)
1) Scouting America. *Eagle Rank Requirements (official PDF).* 2024‑11. https://www.scouting.org/wp-content/uploads/2024/11/eagle-rank-requirements.pdf  
2) Scouting America. *Scouts BSA Requirements — 2025 edition (3321624).* 2025‑04. https://www.scouting.org/wp-content/uploads/2025/04/3321624-Scouts-BSA-Requirements.pdf  
3) Scouting America. *Eagle‑Required Merit Badges (hub).* 2025. https://www.scouting.org/skills/merit-badges/eagle-required/  
4) Scouting America. *Guide to Advancement 2025 (33088).* 2025. https://filestore.scouting.org/filestore/pdf/33088.pdf  
5) Scouting America. *Eagle Scout Service Project Workbook (No. 512‑927, version 2023a).* 2023. https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/eagle-scout-workbook/  
6) Scouting America. *Eagle Scout Rank Application (512‑728, current).* 2025‑01. https://www.scouting.org/wp-content/uploads/2025/01/512-72825-Eagle-Scout-Application.pdf

---

## 7) Evidence Table (claims → sources)
| # | Claim | Source(s) | Pub date | Checked | Notes |
|---|---|---|---|---|---|
| 1 | Eagle requires 21 MB total with 14 from the Eagle list. | 1, 2, 3 | 2024–2025 | 2025‑10‑24 | Eagle list includes three choose‑one groups. |
| 2 | Six months’ POR as Life (or leadership project) with approved positions listed; APL excluded. | 1, 4 | 2024–2025 | 2025‑10‑24 | POR lists & exclusion in rank notes/GTA. |
| 3 | Service project must be planned, developed, led; approvals before starting; workbook forms & report required. | 1, 5 | 2023–2024 | 2025‑10‑24 | GTA §9.0.2.0ff governs. |
| 4 | Statement of ambitions & life purpose needed for BOR; Eagle Application provides format; BOR may occur after 18th; requirements before 18th. | 1, 4, 6 | 2024–2025 | 2025‑10‑24 | GTA §8.0.3.1, §9.0.1.5. |

---

### Ready to proceed
If you want, I can export a **single master JSON/CSV** with **Scout → Eagle** rank requirements, normalized IDs and validation rules, ready for seeding your app.

