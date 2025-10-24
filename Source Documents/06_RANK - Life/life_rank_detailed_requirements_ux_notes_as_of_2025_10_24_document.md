# Life Rank — Detailed Requirements & UX Notes (as of 2025‑10‑24)

**Purpose:** Provide product‑ready requirement text for **Life** rank (Scouts BSA), with clear descriptions, acceptance notes, and official citations that your Eagle Tracker UX can render as requirement cards. Paraphrased for clarity; link to source for exact wording.

---

## 1) Direct Answer (concise)
**Life** emphasizes **sustained participation (6 months)**, **merit‑badge progress (11 total; ≥7 from the Eagle list)**, **service (6 hours, ≥3 conservation)**, **leadership in an approved position (6 months)**, **personal safety awareness**, **Scout spirit**, and the required **Scoutmaster conference** and **board of review**. (Official requirements summarized below with citations.)

---

## 2) Requirement List with Detailed Descriptions (product‑ready)
> **Use in UI:** Each bullet = one requirement card. Include fields: `status`, `date_completed`, `signed_by`, `evidence_link`, `source_url`. Group cards by headings to mirror the official layout.

### PARTICIPATION & SCOUT SPIRIT
**LIFE‑1. Active in unit (6 months as Star)**  
- **Do:** Be **active in your troop** for **at least six months** **as a Star Scout**.  
- **Accept:** Attendance/participation consistent with unit expectations (see **Guide to Advancement** on defining “active”). Link to calendar/check‑ins.  
- **Source:** Life Rank PDF (2024), Req 1.  

**LIFE‑2. Scout spirit**  
- **Do:** As a Star Scout, **demonstrate Scout spirit** by living the **Scout Oath & Law**; **tell how** you have done your **duty to God** and lived these ideals **in daily life**.  
- **Accept:** Conversation/reflection; not a retest of skills.  
- **Source:** Life Rank PDF (2024), Req 2.  

### MERIT BADGES
**LIFE‑3. Eleven merit badges total (≥7 Eagle‑required)**  
- **Do:** **Earn five additional** merit badges **(beyond Star)** for a **total of 11**, including **any three more** from the **Eagle‑required list** (so that your **Star + Life total from that list is ≥7**).  
- **Accept:** Scoutbook import or blue cards; mark Eagle‑required badges distinctly.  
- **Note:** You may use **any badges** from the Eagle list; those **previously earned** for Star **count** toward the total of seven.  
- **Source:** Life Rank PDF (2024), Req 3; Scouts BSA Requirements 2025.  

### SERVICE
**LIFE‑4. Service (6 hours; ≥3 conservation)**  
- **Do:** While a Star Scout, **participate in six hours of service** through one or more **Scoutmaster‑approved** service projects. **At least three of these hours must be conservation‑related.**  
- **Accept:** Log hours, project type, and leader approval; tag which hours are conservation.  
- **Source:** Life Rank PDF (2024), Req 4.  

### LEADERSHIP
**LIFE‑5. Position of Responsibility (6 months) OR leadership project**  
- **Do:** While a Star Scout, **serve actively for six months** in **one or more** approved **positions of responsibility** **OR** carry out a **Scoutmaster‑approved leadership project** to help the troop.  
- **Approved PORs (Scouts BSA troop):** patrol leader; assistant senior patrol leader; senior patrol leader; troop guide; OA troop representative; den chief; scribe; librarian; historian; quartermaster; bugler; junior assistant Scoutmaster; chaplain aide; instructor; webmaster; outdoor ethics guide.  
- **Venturing crew equivalents:** president; vice president; secretary; treasurer; **den chief**; historian; guide; quartermaster; chaplain aide; outdoor ethics guide.  
- **Sea Scout ship equivalents:** boatswain; boatswain's mate; purser; yeoman; storekeeper; crew leader; media specialist; specialist; **den chief**; chaplain aide.  
- **Lone Scout:** leadership responsibility in school, religious organization, club, or community.  
- **Important:** **Assistant patrol leader is *not* an approved POR** for **Star, Life, or Eagle**.  
- **Accept:** Track start/end dates per POR; leadership project requires written plan & completion evidence.  
- **Source:** Life Rank PDF (2024), Req 5 & POR footnotes.  

### PERSONAL SAFETY AWARENESS
**LIFE‑6. Youth protection—Parent’s Guide & videos**  
- **Do:** With a parent/guardian, **complete the exercises** in **How to Protect Your Children From Child Abuse: A Parent’s Guide** and **view the Personal Safety Awareness videos** (with permission).  
- **Access issues:** If your family lacks internet access and none is readily available at school/public place/device, the **video portion may be waived** by the **Scoutmaster** in consultation with your parent/guardian.  
- **Accept:** Record completion dates and any waivers (if applicable).  
- **Source:** Life Rank PDF (2024), Req 6 & footnote.  

### CONFERENCE & BOARD OF REVIEW
**LIFE‑7. Scoutmaster conference**  
- **Do:** While a Star Scout, **participate in a Scoutmaster conference**.  
- **Policy:** A conference is **not a retest** of other requirements.  
- **Source:** Life Rank PDF (2024), Req 7; Guide to Advancement 2025.  

**LIFE‑8. Board of review**  
- **Do:** **Successfully complete** your **Life board of review**.  
- **Appeal:** If not approved, the decision **may be appealed** per **Guide to Advancement 8.0.4.0**.  
- **Source:** Life Rank PDF (2024), Req 8; Guide to Advancement 2025.  

---

## 3) Acceptance & Policy Notes (for implementers)
- **Active participation (Req 1):** Follow **Guide to Advancement** definitions for “active”; units may **not** impose extra attendance quotas beyond policy.  
- **Merit badge tracking (Req 3):** Distinguish **Eagle‑required** badges; accept the three **choose‑one** groups (E‑Prep/Lifesaving; EnvSci/Sustainability; Swim/Hike/Cycle) as Eagle‑list badges. Validate **Star+Life Eagle‑list count ≥7**.  
- **Service (Req 4):** Require tagging of **conservation** vs **other** hours; enforce **≥3 conservation hours** within the six.  
- **Leadership (Req 5):** Enforce **assistant patrol leader excluded**; support multi‑POR accumulation to reach **6 months total**; include alternative **leadership project** pathway with artifact upload.  
- **Conference/BOR:** Track conference date and committee BOR outcome; remember BOR is **not a retest**.  

---

## 4) Data Model Suggestions (UX)
- **Requirement fields:** `id`, `title`, `detail`, `status`, `date_completed`, `signed_by`, `source_url`, `evidence_link`, `subtasks[]`, `notes`.  
- **Merit badge schema:** list of 11 with flag `is_eagle_required`; validate `count(is_eagle_required) ≥ 7`.  
- **POR schema:** role, start_date, end_date, unit_type (troop/crew/ship/lone), leadership_project (bool + artifact).  
- **Service schema:** hours, project(s), approval, **conservation_flag** per hour entry.  
- **Safety schema:** parent_guide_done (date), videos_done (date), **waiver_flag** with reason.  
- **Audit fields:** `version_checked = 2025‑10‑24`, `source_urls[]` for each card.

---

## 5) Uncertainty Box
- **Unknowns:** Mid‑year edits to online wording; composition of the Eagle list can change (confirm at time of advancement).  
- **Assumptions:** The **2024 Life Rank PDF** equals the current online requirement text; **Scouts BSA Requirements 2025** is consistent.  
- **Data quality:** High (official PDFs & policy guide).  
- **Reduce uncertainty:** Link directly to the **Life PDF**, **Requirements 2025**, and **Guide to Advancement**; show "last verified" timestamp in‑app.  
- **Confidence:** **High** (checked **2025‑10‑24**).

---

## 6) Citations (official)
1) Scouting America. *Life Rank Requirements (official PDF — effective Jan 1, 2024).* 2024‑01. https://www.scouting.org/wp-content/uploads/2024/01/2024-Life-Rank-requirements.pdf  
2) Scouting America. *Scouts BSA Requirements — 2025 edition (3321624).* 2025‑04. https://www.scouting.org/wp-content/uploads/2025/04/3321624-Scouts-BSA-Requirements.pdf  
3) Scouting America. *Guide to Advancement 2025 (33088).* 2025. https://filestore.scouting.org/filestore/pdf/33088.pdf  
4) Scouting America. *Advancement & Awards — Scouts BSA (hub).* 2025. https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/

---

## 7) Evidence Table (claims → sources)
| # | Claim | Source(s) | Pub date | Checked | Notes |
|---|---|---|---|---|---|
| 1 | LIFE‑1 through LIFE‑8 accurately paraphrase current Life requirements. | 1, 2 | 2024–2025 | 2025‑10‑24 | Exact wording in source PDF. |
| 2 | Assistant patrol leader is not an approved POR for Star/Life/Eagle. | 1 | 2024 | 2025‑10‑24 | Footnote in rank PDF. |
| 3 | Service must total 6 hours with ≥3 conservation hours. | 1 | 2024 | 2025‑10‑24 | New since 2024 update; enforce via flags. |
| 4 | BOR is not a retest; appeals via GTA 8.0.4.0. | 3 | 2025 | 2025‑10‑24 | Policy guidance. |

---

### Ready to proceed
If this meets your needs, I’ll produce **Eagle** next with the same structure (requirement cards, UX fields, and sources).

