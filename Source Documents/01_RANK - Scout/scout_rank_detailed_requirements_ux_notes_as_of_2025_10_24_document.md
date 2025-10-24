# Scout Rank — Detailed Requirements & UX Notes (as of 2025‑10‑24)

**Purpose:** Give product‑ready, comprehensive requirement text for **Scout** rank (Scouts BSA), with plain‑language descriptions, acceptance notes, and official citations suitable for an Eagle Tracker UX. This version paraphrases the official requirements and links the current canonical sources.

---

## 1) Direct Answer (concise)
The **Scout rank** establishes a new member’s foundation in ideals, structure, safety, and basic skills. The official requirements (effective **Jan 1, 2024** and current as of **2025‑10‑24**) include learning the **Oath/Law/Motto/Slogan/Pledge**, understanding **troop & patrol** operations and **advancement**, basic **knots & rope care**, **pocketknife safety**, **personal safety awareness** with a parent/guardian, and a **Scoutmaster conference**. (Official PDFs and pages cited below.)

---

## 2) Requirement List with Detailed Descriptions (product‑ready)
> **Use in UI:** Each bullet = one requirement card. Keep the wording below as the app’s display text; link each card to its source. Mark completion with date & initials per your data model.

1) **Ideals: Oath, Law, Motto, Slogan, Pledge**  
   - **What to do:** Recite from memory the **Scout Oath**, **Scout Law**, **Scout Motto**, **Scout Slogan**, and the **Pledge of Allegiance**; in your own words, explain what each means.  
   - **Why it matters:** Confirms shared values and the promise to live them.  
   - **Acceptance notes:** Leader listens for accuracy and a sincere personal explanation (no verbatim script needed).  
   - **Source:** *Scout Rank Requirements* (official PDF, 2024); *Scouts BSA Requirements 2025* (booklet).  

2) **Scout Sign, Salute, and Handshake**  
   - **What to do:** Demonstrate the **sign**, **salute**, and **handshake**; tell when each is appropriate.  
   - **Why it matters:** Signals membership and respect in ceremonies and flag etiquette.  
   - **Acceptance notes:** Correct form and situational use.  
   - **Source:** Official Scout rank PDF (2024).  

3) **Troop & Advancement Basics**  
   - **What to do:** After attending at least **one troop meeting**, explain:  
     a) How Scouts provide **leadership** in the troop;  
     b) The **four steps of advancement**;  
     c) What the **Scouts BSA ranks** are and how they’re earned;  
     d) What **merit badges** are and how they’re earned.  
   - **Why it matters:** Orients new members to the program’s structure, goals, and self‑paced progress model.  
   - **Acceptance notes:** Conversation/demonstration with a designated leader; no written test required.  
   - **Source:** Official Scout rank PDF (2024); *Guide to Advancement 2025* (sections on mechanics of advancement).  

4) **Patrol Method**  
   - **What to do:** Explain the **patrol method** and **describe patrol types** used in your troop (e.g., new‑Scout, mixed‑age, venture).  
   - **Why it matters:** Patrols are the primary small‑group leadership lab.  
   - **Acceptance notes:** Show understanding of how your troop actually organizes and operates patrols.  
   - **Source:** Official Scout rank PDF (2024).  

5) **Knots & Rope Care**  
   - **What to do:** Tie a **square knot**, **two half‑hitches**, and a **taut‑line hitch**; explain when each is used. Show proper care of rope by **whipping or fusing ends** depending on rope type.  
   - **Why it matters:** Core outdoor skills for securing gear, shelters, and lines safely.  
   - **Acceptance notes:** Correct tying and appropriate use‑cases; show whipping/fusing on suitable rope.  
   - **Source:** Official Scout rank PDF (2024).  

6) **Pocketknife Safety**  
   - **What to do:** Explain rules for **safe handling**, **sharpening**, **passing**, **opening/closing**, and **storage** of a pocketknife.  
   - **Why it matters:** Tool use starts early; safety habits prevent injuries.  
   - **Acceptance notes:** Discussion or demonstration; local units may also require **Totin’ Chip** later, but for Scout rank, a knowledge check suffices unless the unit sets a stricter policy.  
   - **Source:** Official Scout rank PDF (2024).  

7) **Personal Safety Awareness (with Parent/Guardian)**  
   - **What to do:** With a parent/guardian, **complete the exercises** in *How to Protect Your Children From Child Abuse: A Parent’s Guide* and **view the Personal Safety Awareness videos** (with permission).  
   - **Why it matters:** Confirms youth & family awareness of abuse prevention and online safety expectations.  
   - **Acceptance notes:** Unit records completion date; specific video titles may be updated on the official site—link from the rank page.  
   - **Source:** Official Scout rank PDF (2024); Scouting.org advancement resources hub.  

8) **Scoutmaster Conference**  
   - **What to do:** Participate in a **Scoutmaster conference** while working on Scout rank.  
   - **Why it matters:** Provides mentoring, checks understanding, and plans next steps.  
   - **Acceptance notes:** This is **not a retest** of requirements; it is a conversation. (See *Guide to Advancement* for policy.)  
   - **Source:** *Guide to Advancement 2025*; Official Scout rank PDF (2024).  

**Sequencing Note:** Work on **Scout, Tenderfoot, Second Class, First Class** requirements **simultaneously**, but ranks are **awarded in sequence** (you must be approved for Scout before Tenderfoot, etc.). (Official Scout rank PDF notes.)

---

## 3) Acceptance & Policy Notes (for implementers)
- **Who may test & sign off:** The unit leader authorizes who may test and pass a Scout on requirements; records must reflect who signed and when. (*Guide to Advancement 2025*.)
- **Current text lives online:** Printed books/pamphlets can lag; **scouting.org** holds the latest requirements. If there is a conflict, defer to the website and current **Scouts BSA Requirements** PDF. (2025 edition.)
- **No Board of Review for Scout rank:** A BOR is **not required** for the Scout rank; it begins at Tenderfoot. (*Guide to Advancement 2025*.)
- **Parent/Guardian safety modules:** The titles/hosting for the **Personal Safety Awareness** videos may change; link out rather than embedding static titles.

---

## 4) Data Model Suggestions (UX)
- Fields per requirement: `status`, `date_completed`, `signed_by`, `notes`, `evidence_link` (optional file/photo), `source_url`.
- Global rank fields: `start_date`, `scoutmaster_conference_date`, `awarded_date` (read‑only until export), `version_checked` (e.g., “2024‑01 requirements, verified 2025‑10‑24”).
- Validation: prevent “rank complete” unless all requirements are marked complete and conference date is set.

---

## 5) Uncertainty Box
- **Unknowns:** Mid‑year edits to online requirement text or hosting for safety videos.  
- **Assumptions:** The **2024 Scout rank PDF** and the **2025 Requirements book** reflect the same requirement set; scouting.org is the source of truth.  
- **Data Quality:** High; all citations are official Scouting America sources.  
- **What reduces uncertainty:** Re‑check the official rank PDF/page prior to release; include a remote‑config message that updates the “version_checked” field app‑wide.
- **Confidence:** **High** (last checked **2025‑10‑24**).

---

## 6) Citations (minimal template)
1) Scouting America. *Scout Rank Requirements (official PDF — effective Jan 1, 2024).* 2024‑01. https://www.scouting.org/wp-content/uploads/2024/01/2024-Scout-Rank-Requirements.pdf  
2) Scouting America. *Scouts BSA Requirements — 2025 edition (3321624).* 2025‑04. https://www.scouting.org/wp-content/uploads/2025/04/3321624-Scouts-BSA-Requirements.pdf  
3) Scouting America. *Guide to Advancement 2025 (33088).* 2025. https://filestore.scouting.org/filestore/pdf/33088.pdf  
4) Scouting America. *Advancement & Awards — Scouts BSA (hub).* 2025. https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/

---

## 7) Evidence Table (claims → sources)
| # | Claim | Source(s) | Pub date | Checked | Notes |
|---|---|---|---|---|---|
| 1 | The eight Scout‑rank requirement domains above accurately paraphrase the current official requirements. | 1, 2 | 2024–2025 | 2025‑10‑24 | Text paraphrased; defer to official pages for exact wording. |
| 2 | Scout rank includes Personal Safety Awareness with a parent/guardian. | 1 | 2024‑01 | 2025‑10‑24 | Cyber Chip retired; videos requirement persists per PDF. |
| 3 | No BOR for Scout rank; Scoutmaster conference only. | 3 | 2025 | 2025‑10‑24 | BOR begins at Tenderfoot. |
| 4 | Leaders designate who may test/sign off; website is the live source of truth vs. print. | 2, 3 | 2025 | 2025‑10‑24 | Policy/recency guidance. |

---

### Ready to proceed
If this meets your needs, I’ll produce **Tenderfoot** next in the same format (detailed requirements, UX notes, and citations).

