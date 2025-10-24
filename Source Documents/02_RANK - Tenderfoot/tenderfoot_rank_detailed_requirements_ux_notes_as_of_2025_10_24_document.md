# Tenderfoot Rank — Detailed Requirements & UX Notes (as of 2025‑10‑24)

**Purpose:** Provide product‑ready requirement text for **Tenderfoot** rank (Scouts BSA), with clear descriptions, acceptance notes, and official citations that your Eagle Tracker UX can render as requirement cards. Paraphrased for clarity; link to source for exact wording.

---

## 1) Direct Answer (concise)
**Tenderfoot** builds core **outdoor**, **safety**, **fitness**, **citizenship**, and **Scout spirit** skills. Requirements include camping readiness, cooking & cleanup, knife/saw/ax care, first aid basics, hiking safety with Leave No Trace, physical fitness plan with 30‑day improvement, flag etiquette, service, Teaching EDGE, Scoutmaster conference, and a board of review. (Official sources listed below.)

---

## 2) Requirement List with Detailed Descriptions (product‑ready)
> **Use in UI:** Each bullet = one requirement card. Include fields: `status`, `date_completed`, `signed_by`, `evidence_link`, `source_url`.

**1) Camping Preparation & Ethics**
- **1a. Gear & packing** — Present yourself to a leader **prepared for an overnight campout**; show **personal and camping gear** and demonstrate **how to pack and carry it**.
  - *Why:* Ensures readiness and self‑sufficiency before the first overnight.
  - *Accept:* Demonstration with inspection or photos; unit‑accepted packing method.
- **1b. Overnight campout** — Spend **at least one night** on a **patrol/troop campout**, sleeping in a **tent you helped pitch**.
  - *Accept:* Recorded via outing roster; tent participation confirmed by a leader.
- **1c. Outdoor Code & Leave No Trace** — **Explain** how you **demonstrated** the **Outdoor Code** and **Leave No Trace** on outings.
  - *Accept:* Reflection/discussion with concrete examples (e.g., campsite selection, trash, dishwater, wildlife).

**2) Cooking & Cleanup**
- **2a. Meal prep** — On a campout, **assist in preparing one meal** and explain why **sharing meal prep/cleanup** matters.
- **2b. Dishwashing** — On a campout, **demonstrate the appropriate method** of safely **cleaning cookware/utensils**.
- **2c. Patrol meals** — **Explain the importance** of **eating together as a patrol**.
  - *Why:* Food safety, teamwork, and patrol method.
  - *Accept:* Hands‑on participation and explanation; method may vary (three‑tub, heat/soap/rinse/sanitize per unit SOP).

**3) Knots & Woods Tools**
- **3a–3c. Practical uses of knots** — Demonstrate **practical uses** of the **square knot**, **two half‑hitches**, and **taut‑line hitch**.
- **3d. Woods tools** — Demonstrate **proper care, sharpening, and use** of the **knife, saw, and ax**; **describe when** each should be used.
  - *Accept:* Safe handling, passing, blood‑circle awareness; sharpening shown on one tool minimum; discuss use‑cases.

**4) First Aid Foundations**
- **4a. Show first aid for:** simple cuts/scrapes; blisters (hand/foot); **minor thermal burns/scalds** (first‑degree); **insect/tick bites or stings**; **venomous snakebite**; **nosebleed**; **frostbite and sunburn**; **choking**.
- **4b. Hazardous plants** — **Describe** common poisonous/hazardous plants, **identify** any local to your area/campsite, and **tell how to treat** exposure.
- **4c. Prevention** — **Tell what you can do** on outings to **prevent or reduce** the issues listed in **4a–4b**.
- **4d. Personal first‑aid kit** — **Assemble** a personal kit and **tell how** each item is used.
  - *Accept:* Demonstrations can be simulated; kit must be physically shown.

**5) Buddy System & Hiking Safety**
- **5a. Buddy system** — **Explain** its importance for personal safety **on outings and at home**; **use** it on an outing.
- **5b. If lost** — **Describe** what to do if you become **lost** on a hike/campout.
- **5c. Hiking rules** — **Explain** rules for **safe/responsible hiking** on **highways and cross‑country**, **day and night**.
- **5d. Durable surfaces** — **Explain why** to **hike on trails/durable surfaces** and give **examples observed** on your outing.
  - *Accept:* Conversation plus observed behavior on an outing.

**6) Physical Fitness (baseline → plan → improvement)**
- **6a. Baseline tests (record):** **pushups (60 s)**; **situps/curl‑ups (60 s)**; **back‑saver sit‑and‑reach (distance)**; **1‑mile walk/run (time)**.
- **6b. Plan** — **Develop and describe** a **plan for improvement** for each activity; **track** activity for **≥30 days**.
- **6c. Show improvement** — After ~30 days’ practice, **show improvement** (any degree) in **each** activity and **record** new results.
  - *Accept:* Any measurable improvement counts; keep logs (paper or app). Unit health/safety guidance applies.

**7) Flag Etiquette**
- **7a. U.S. flag** — **Demonstrate** how to **display, raise, lower, and fold** the **United States flag**.
- **7b. Service** — **Participate in a total of one hour of service** in one or more **Scoutmaster‑approved** projects; **explain** how your service relates to the **Scout slogan** and **motto**.

**8) Teaching EDGE**
- **8. Teach a square knot** — **Describe** the steps of **Teaching EDGE**, then **use** EDGE to **teach** another person how to **tie a square knot**.

**9) Scout Spirit**
- **9. Live the ideals** — **Demonstrate Scout spirit** by living the **Scout Oath and Law**; **tell** how you have done your **duty to God** and lived **four** points of the Law in daily life.

**10) Scoutmaster Conference**
- **10. Conference** — While working toward Tenderfoot (and **after completing Scout rank requirement 7**), **participate** in a **Scoutmaster conference**.
  - *Accept:* This is a mentoring conversation, **not a retest** (policy per Guide to Advancement).

**11) Board of Review**
- **11. BOR** — **Successfully complete** your **Tenderfoot board of review**.

**Notes (official)**
- **Simultaneous work:** You may work on **Scout, Tenderfoot, Second Class, and First Class** requirements at the same time, **but ranks must be earned in sequence**.
- **Alternate requirements:** Available for Scouts with qualifying disabilities per policy.

---

## 3) Acceptance & Policy Notes (for implementers)
- **Testing/Sign‑off authority:** Unit leader designates who may test and sign; record name & date with each requirement.
- **Conference vs. BOR:** Conference is required for Tenderfoot; **BOR starts at Tenderfoot** (none for Scout rank). BOR is not a retest.
- **Data entry:** Log **fitness baseline**, **plan**, **30‑day improvement results** as separate sub‑fields to avoid ambiguity.
- **Service tracking:** Allow multiple entries to total **one hour** with project approval metadata.
- **Woods tools:** Local councils/camps may set **additional tool‑use rules**; include a unit policy link.

---

## 4) Data Model Suggestions (UX)
- **Requirement object fields:** `id`, `title`, `detail`, `status`, `date_completed`, `signed_by`, `evidence_link`, `source_url`, `subtasks` (for 6a/6b/6c & 4a lists), `notes`.
- **Fitness sub‑schema:** `baseline`, `plan_text`, `log_entries[]`, `improved (bool)`, `final_metrics`.
- **Progress guards:** Mark rank ready for BOR only when **Reqs 1–9** complete and **Req 10** (conference) recorded.

---

## 5) Uncertainty Box
- **Unknowns:** Mid‑year edits to wording; local tool safety policies.
- **Assumptions:** The **2024 Tenderfoot PDF** reflects current Tenderfoot requirements; website remains source of truth.
- **Data quality:** High (official PDFs & policy guide).  
- **Reduce uncertainty:** Link live to the official PDF; surface a **“last verified”** timestamp in‑app and enable admin update.
- **Confidence:** **High** (checked **2025‑10‑24**).

---

## 6) Citations (official)
1) Scouting America. *Tenderfoot Rank Requirements (official PDF — effective Jan 1, 2024).* 2024‑01. https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf  
2) Scouting America. *Scouts BSA Requirements — 2025 edition (3321624).* 2025‑04. https://www.scouting.org/wp-content/uploads/2025/04/3321624-Scouts-BSA-Requirements.pdf  
3) Scouting America. *Guide to Advancement 2025 (33088).* 2025. https://filestore.scouting.org/filestore/pdf/33088.pdf  
4) Scouting America. *Advancement & Awards — Scouts BSA (hub).* 2025. https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/

---

## 7) Evidence Table (claims → sources)
| # | Claim | Source(s) | Pub date | Checked | Notes |
|---|---|---|---|---|---|
| 1 | Items 1–11 are accurate paraphrases of the current Tenderfoot requirements. | 1, 2 | 2024–2025 | 2025‑10‑24 | Exact text in source PDF. |
| 2 | Simultaneous work across Scout→First Class allowed; ranks awarded sequentially. | 1, 2 | 2024–2025 | 2025‑10‑24 | Policy note reproduced. |
| 3 | BOR required starting at Tenderfoot; not a retest. | 3 | 2025 | 2025‑10‑24 | Guide to Advancement policy. |

---

### Ready to proceed
If this meets your needs, I’ll produce **Second Class** next with the same structure (requirement cards, UX fields, and sources).

