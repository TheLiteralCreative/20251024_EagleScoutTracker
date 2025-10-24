# Star Rank — Detailed Requirements & UX Notes (as of 2025‑10‑24)

**Purpose:** Provide product‑ready requirement text for **Star** rank (Scouts BSA), with clear descriptions, acceptance notes, and official citations that your Eagle Tracker UX can render as requirement cards. Paraphrased for clarity; link to source for exact wording.

---

## 1) Direct Answer (concise)
**Star** focuses on **consistent participation**, **merit badge progress (6 total, 4 from the Eagle list)**, **service (6 hours)**, **leadership (4 months in POR)**, **personal safety awareness**, **Scout spirit**, and the required **conference** and **board of review**. (Official requirements summarized below with citations.)

---

## 2) Requirement List with Detailed Descriptions (product‑ready)
> **Use in UI:** Each bullet = one requirement card. Include fields: `status`, `date_completed`, `signed_by`, `evidence_link`, `source_url`. Group cards by headings to mirror the official layout.

### PARTICIPATION & SCOUT SPIRIT
**STAR‑1. Active in unit (4 months as First Class)**  
- **Do:** Be **active in your troop** for **at least four months** **as a First Class Scout**.  
- **Accept:** Attendance/participation consistent with unit expectations (see Guide to Advancement on defining "active"). Link to calendar/check‑ins.  
- **Source:** Star Rank PDF (2024), Req 1.  

**STAR‑2. Scout spirit**  
- **Do:** As a First Class Scout, **demonstrate Scout spirit** by living the **Scout Oath & Law**; **tell how** you have done your **duty to God** and lived these ideals **in daily life**.  
- **Accept:** Conversation/reflection; not a retest of skills.  
- **Source:** Star Rank PDF (2024), Req 2.  

### MERIT BADGES
**STAR‑3. Six merit badges (≥4 Eagle‑required)**  
- **Do:** **Earn six** merit badges **total**, including **any four** from the **Eagle‑required list**. You may select **any** badge from the Eagle list to count toward the four.  
- **Accept:** Scoutbook import or blue cards; mark Eagle‑required badges distinctly.  
- **Note:** See **Eagle rank requirement 3** for the current Eagle‑required list.  
- **Source:** Star Rank PDF (2024), Req 3; Scouts BSA Requirements 2025.  

### SERVICE
**STAR‑4. Service (6 hours)**  
- **Do:** While a First Class Scout, **participate in six hours of service** through **one or more** **Scoutmaster‑approved** service projects.  
- **Accept:** May include conservation, community, faith‑based, school, or council projects; log hours and approval.  
- **Source:** Star Rank PDF (2024), Req 4.  

### LEADERSHIP
**STAR‑5. Position of Responsibility (4 months) OR leadership project**  
- **Do:** While a First Class Scout, **serve actively for four months** in **one or more** approved **positions of responsibility** **OR** carry out a **Scoutmaster‑approved leadership project** to help the troop.  
- **Approved PORs (Scouts BSA troop):** patrol leader; assistant senior patrol leader; senior patrol leader; troop guide; OA troop representative; den chief; scribe; librarian; historian; quartermaster; bugler; junior assistant Scoutmaster; chaplain aide; instructor; webmaster; outdoor ethics guide.  
- **Venturing crew equivalents:** president; vice president; secretary; treasurer; **den chief**; historian; guide; quartermaster; chaplain aide; outdoor ethics guide.  
- **Sea Scout ship equivalents:** boatswain; boatswain's mate; purser; yeoman; storekeeper; crew leader; media specialist; specialist; **den chief**; chaplain aide.  
- **Lone Scout:** leadership responsibility in school, religious organization, club, or community.  
- **Important:** **Assistant patrol leader is *not* an approved POR** for **Star, Life, or Eagle**.  
- **Accept:** Track start/end dates per POR; leader verifies. Leadership project requires written plan & completion evidence.  
- **Source:** Star Rank PDF (2024), Req 5 & footnote 6.  

### PERSONAL SAFETY AWARENESS
**STAR‑6. Youth protection—Parent’s Guide & videos**  
- **Do:** With a parent/guardian, **complete the exercises** in **How to Protect Your Children From Child Abuse: A Parent’s Guide** and **view the Personal Safety Awareness videos** (with permission).  
- **Access issues:** If your family lacks internet access and none is readily available at school/public place/device, the **video portion may be waived** by the **Scoutmaster** in consultation with your parent/guardian.  
- **Accept:** Record completion date(s) and waivers (if applicable).  
- **Source:** Star Rank PDF (2024), Req 6 & footnote 7.  

### CONFERENCE & BOARD OF REVIEW
**STAR‑7. Scoutmaster conference**  
- **Do:** While a First Class Scout, **participate in a Scoutmaster conference**.  
- **Policy:** A conference is **not a retest** of other requirements.  
- **Source:** Star Rank PDF (2024), Req 7; Guide to Advancement 2025.  

**STAR‑8. Board of review**  
- **Do:** **Successfully complete** your **Star board of review**.  
- **Appeal:** If not approved, the decision **may be appealed** per **Guide to Advancement 8.0.4.0**.  
- **Source:** Star Rank PDF (2024), Req 8 & footnote 8; Guide to Advancement 2025.  

---

## 3) Acceptance & Policy Notes (for implementers)
- **Active participation (Req 1):** Follow **Guide to Advancement** definitions for “active,” considering registration, participation, and Scout‑spirit elements; units may **not** set extra attendance quotas beyond policy.  
- **Merit badge tracking (Req 3):** Distinguish **Eagle‑required** badges; accept **Emergency Preparedness/Lifesaving**, **Environmental Science/Sustainability**, and **Swimming/Hiking/Cycling** as Eagle list members (any may count toward the four for Star).  
- **Service (Req 4):** Allow multiple entries summing to **6 hours**; capture project approval metadata. (Conservation hours are **not required** at Star; that caveat applies to **Life**.)  
- **Leadership (Req 5):** Enforce **assistant patrol leader excluded**; support **multi‑POR** accumulation to reach **4 months total**. Provide an **alternate pathway** field for a **Scoutmaster‑approved leadership project** with artifact upload.  
- **Conference/BOR:** Track conference date and committee BOR outcome; remember BOR is **not a retest**.  

---

## 4) Data Model Suggestions (UX)
- **Requirement fields:** `id`, `title`, `detail`, `status`, `date_completed`, `signed_by`, `source_url`, `evidence_link`, `subtasks[]`, `notes`.  
- **Merit badge schema:** list of 6 with flag `is_eagle_required`; validate `count(is_eagle_required) ≥ 4`.  
- **POR schema:** role, start_date, end_date, unit_type (troop/crew/ship/lone), leadership_project (bool + artifact).  
- **Safety schema:** parent_guide_done (date), videos_done (date), **waiver_flag** with reason.  
- **Audit fields:** `version_checked = 2025‑10‑24`, `source_urls[]` for each card.

---

## 5) Uncertainty Box
- **Unknowns:** Mid‑year edits to online wording; Eagle list composition occasionally changes (verify at time of advancement).  
- **Assumptions:** The **2024 Star Rank PDF** equals the current online requirement text; **Scouts BSA Requirements 2025** is consistent.  
- **Data quality:** High (official PDFs & policy guide).  
- **Reduce uncertainty:** Link directly to the **Star PDF**, **Requirements 2025**, and **Guide to Advancement**; show "last verified" timestamp in‑app.  
- **Confidence:** **High** (checked **2025‑10‑24**).

---

## 6) Citations (official)
1) Scouting America. *Star Rank Requirements (official PDF — effective Jan 1, 2024).* 2024‑01. https://www.scouting.org/wp-content/uploads/2024/01/2024-Star-Rank-requirements.pdf  
2) Scouting America. *Scouts BSA Requirements — 2025 edition (3321624).* 2025‑04. https://www.scouting.org/wp-content/uploads/2025/04/3321624-Scouts-BSA-Requirements.pdf  
3) Scouting America. *Guide to Advancement 2025 (33088).* 2025. https://filestore.scouting.org/filestore/pdf/33088.pdf  
4) Scouting America. *Advancement & Awards — Scouts BSA (hub).* 2025. https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/

---

## 7) Evidence Table (claims → sources)
| # | Claim | Source(s) | Pub date | Checked | Notes |
|---|---|---|---|---|---|
| 1 | STAR‑1 through STAR‑8 accurately paraphrase current Star requirements. | 1, 2 | 2024–2025 | 2025‑10‑24 | Exact wording in source PDF. |
| 2 | Assistant patrol leader is not an approved POR for Star/Life/Eagle. | 1 | 2024 | 2025‑10‑24 | Footnote 6. |
| 3 | BOR is not a retest; appeals via GTA 8.0.4.0. | 3 | 2025 | 2025‑10‑24 | Policy guidance. |

---

### Ready to proceed
If this meets your needs, I’ll produce **Life** next with the same structure (requirement cards, UX fields, and sources).

