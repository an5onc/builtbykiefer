# Kiefer Built Land Purchase Lead Alert

## Owner Roadmap and Completion Checklist

Prepared for Kiefer Built Contracting  
Prepared July 20, 2026  
Planning document - not legal advice

## Objective

Build a reliable, respectful system that identifies recent purchases of likely vacant land in Larimer and Weld Counties, finds the buyer name and public mailing address, sends Kiefer Built an alert, and prepares the record for a personalized postcard campaign.

The recommended first version is postcard-first. County property records can provide owner names, mailing addresses, parcel details, and sale details, but they do not provide reliable phone numbers or email addresses. Phone/email enrichment should be a later, separately approved phase.

## Executive Decision

Proceed with a staged pilot, not a broad web scraper.

- Use official bulk downloads and licensed feeds wherever possible.
- Do not automate Weld County's recorder search website; its terms explicitly prohibit automated searches, screen scrapers, robots, and similar processes.
- Start Weld County with its official weekly assessor download.
- Start Larimer County with its free assessor files for the prototype. Consider Larimer's licensed daily FTP feed only after the pilot proves the business value.
- Keep a human review step before any postcard is mailed.
- Measure qualified consultations and signed work, not just the number of names collected.

## What the Tool Will Do

1. Pull a fresh county dataset on a schedule.
2. Detect new sales and ownership changes since the prior run.
3. Join the sale to parcel, owner, mailing-address, acreage, land, and improvement data.
4. Filter for likely vacant or lightly improved land in Kiefer Built's service area.
5. Exclude obvious non-prospects and duplicate records.
6. Score and place candidates in a review queue.
7. Send a daily or weekly alert with the best candidates.
8. After approval, create a postcard mailing file and track outreach results.

## What the Tool Will Not Promise

- It will not prove that a parcel is buildable, permitted, accessible, or ready for utilities.
- It will not guarantee that every ownership change is an arms-length land purchase.
- It will not reliably produce buyer phone numbers or email addresses from county records.
- It will not scrape a portal when the portal's terms prohibit automation.
- It will not mail anything without a final human review during the pilot.

## Recommended Data Sources

### Larimer County

- Assessor Public Data Center: free downloadable Account, Owner, Owner Location, Sales, Improvement, Land Attributes, and Value Detail files. The published fields include grantee, sale date, sale price, deed type, owner name, mailing address, building count, acres, and classification data.
- Clerk and Recorder Easy Access: useful for manual research and confirmation.
- Licensed Remote Access FTP: $600 per month as currently published; includes daily FTP uploads of data and document images. This is the preferred near-daily option if the pilot proves worthwhile and the license authorizes the planned processing.

### Weld County

- Assessor Data Download: official CSV and GIS data, typically updated weekly on Wednesdays. Published datasets contain buyer/grantee, sale date, deed type, improved/vacant indicator, owner name, mailing address, acreage, building information, and reception number.
- Recorder Self-Service: manual verification only. Current terms prohibit automated searches and screen scraping.
- ShareFile Cloud Service: currently listed at a $1,000 setup fee plus $500 per month. Before using it, Kiefer Built must confirm with the county exactly what data is included, how often it arrives, and whether the agreement authorizes automated processing.

## Proposed Workflow

County files or approved feed -> secure import -> normalize county fields -> compare with prior snapshot -> identify recent ownership changes -> vacant-land filter -> exclude poor-fit transfers -> score candidates -> human review -> alert and postcard queue -> record response and outcome

## Lead Record

Each candidate should include only the information needed for review and outreach:

- County and parcel/account number
- Buyer/grantee and current owner name
- Public mailing address
- Property/situs address when present
- Legal description or subdivision
- Sale date, sale price, deed type, and reception number
- Acreage and land classification
- Building count or improved/vacant indicator
- Why the parcel matched
- Confidence score and review notes
- Outreach status, mail date, opt-out status, and outcome

## Qualification Rules for the Pilot

A candidate can enter the queue when:

- The sale or ownership change is new since the last successful import.
- The parcel is in Larimer or Weld County and inside the approved service geography.
- The record is real property, not mineral rights, business personal property, or a mobile-home-only account.
- Building count is zero, improvement square footage/value is zero or minimal, or the source marks it vacant.
- The transaction has a buyer/grantee and a deliverable public mailing address.
- The record has enough evidence to distinguish it from the previously known owner state.

Exclude or hold for review when:

- The buyer is a government body, utility, road authority, cemetery, or similar non-prospect.
- The deed appears to be a correction, release, easement, trustee action, quitclaim, intra-family transfer, or other non-market transfer.
- The transaction is a duplicate, multi-parcel package already represented in the queue, or a mailing already sent recently.
- The parcel appears already improved or outside Kiefer Built's practical service area.
- The mailing address is missing, protected, incomplete, or fails address validation.
- The parcel is clearly associated with a competing production builder or developer, unless the owner chooses to include that segment.

## Project Checklist

### Phase 0 - Approve the Pilot

- [ ] Confirm that "Welk County" means Weld County.
- [ ] Confirm Kiefer Built's exact service-area boundaries.
- [ ] Set minimum/maximum acreage and any target towns or ZIP codes.
- [ ] Decide which entities to exclude: builders, developers, governments, trusts, LLCs, or others.
- [ ] Approve postcard-first outreach and the initial message.
- [ ] Choose the internal owner of lead review and mailing decisions.
- [ ] Approve a 60- to 90-day pilot and success thresholds.

Exit criteria: written pilot rules, named owner, approved message, and go/no-go authority.

### Phase 1 - Validate Data Access and Rules

- [ ] Download sample Larimer Assessor datasets and document their actual update pattern.
- [ ] Download sample Weld Assessor datasets and verify the published Wednesday update.
- [ ] Ask Larimer County for the current Remote Access/FTP license and permitted-use terms.
- [ ] Ask Weld County whether ShareFile provides a usable recording index/feed and obtain written automation terms.
- [ ] Confirm whether each source permits commercial prospecting and automated processing.
- [ ] Have counsel review direct-mail, privacy, record-use, retention, and opt-out practices.
- [ ] Create a source register with URL, owner, refresh schedule, file schema, and fallback process.

Exit criteria: approved source for each county, documented terms, sample data, and no unresolved automation prohibition.

### Phase 2 - Build the Data Prototype

- [ ] Store raw county files unchanged with import date and checksum.
- [ ] Build separate Larimer and Weld import adapters.
- [ ] Normalize parcel, owner, address, sale, acreage, and improvement fields.
- [ ] Compare snapshots and detect new sale/owner events without duplicates.
- [ ] Add vacant-land and non-market-transfer filters.
- [ ] Produce a reviewable CSV or spreadsheet of candidates.
- [ ] Test at least 30 known records from each county against the public source.

Exit criteria: repeatable imports, explainable matches, idempotent reruns, and an agreed false-positive rate.

### Phase 3 - Build the Minimum Viable Tool

- [ ] Add a secure lead database and audit history.
- [ ] Add a simple review screen with Approve, Reject, Snooze, and Do Not Contact.
- [ ] Show the source evidence and reason each lead matched.
- [ ] Add daily/weekly email alerts and a missed-run alert.
- [ ] Add postcard CSV export with owner name and mailing address.
- [ ] Add address standardization and returned-mail tracking.
- [ ] Add role-based access, encrypted connections, backups, and error logging.
- [ ] Add a permanent suppression list for opt-outs.

Exit criteria: reviewer can approve a lead from evidence, export a clean mailing list, and recover from a failed import without duplicate outreach.

### Phase 4 - Run the 60- to 90-Day Pilot

- [ ] Run imports on the agreed schedule.
- [ ] Manually review every candidate before mailing.
- [ ] Mail a small first batch and inspect deliverability and tone.
- [ ] Record mailed, returned, contacted, qualified, consultation, estimate, and signed-job outcomes.
- [ ] Tune exclusions, acreage, geography, and confidence scoring every two weeks.
- [ ] Review false positives and missed opportunities monthly.
- [ ] Compare Larimer weekly data against the daily FTP value proposition before buying the feed.
- [ ] Decide whether Weld's paid service provides enough speed/value to justify its cost.

Exit criteria: documented economics, acceptable complaint/return rate, and proof that qualified opportunities justify ongoing operation.

### Phase 5 - Production Launch

- [ ] Approve county feed subscriptions based on pilot results.
- [ ] Replace temporary spreadsheets with the production workflow where justified.
- [ ] Add automated monitoring for stale files, schema changes, and unusual volume.
- [ ] Document monthly data-source and suppression-list review.
- [ ] Train a backup reviewer.
- [ ] Set quarterly ROI and compliance reviews.
- [ ] Approve or reject phone/email enrichment as a separate project.

Exit criteria: reliable operation, named backup, measured ROI, current permissions, and a written shutdown/fallback procedure.

## Acceptance Criteria

- The same county file can be processed twice without creating duplicate leads.
- Every lead shows its county source, import date, and reason for matching.
- The system does not automate Weld Recorder Self-Service.
- At least 95% of sampled owner names and mailing addresses match the source record.
- Vacant-land classification is explainable from published county fields.
- A reviewer can reject, suppress, or approve a record before export.
- Opted-out recipients never appear in a future mailing export.
- Failed or stale imports create an alert and do not silently reuse old data as new.
- The pilot reports timeliness, candidate count, approval rate, return rate, response rate, qualified consultations, estimates, signed jobs, cost per qualified opportunity, and attributable revenue.

## Proposed Schedule

- Weeks 1-2: Phase 0 and Phase 1 - decisions, sample data, county permissions, and compliance review.
- Weeks 3-4: Phase 2 - prototype imports, change detection, filtering, and sample validation.
- Weeks 5-7: Phase 3 - review screen, alerts, postcard export, suppression, and monitoring.
- Weeks 8-19: Phase 4 - 60- to 90-day pilot, tuning, and ROI measurement.
- Week 20: go/no-go decision and Phase 5 production plan.

The technical MVP is approximately 6-7 weeks after decisions and permissions are available. A responsible business decision requires the additional pilot period.

## Planning Allowance

These are planning ranges, not a quote.

- Discovery, data access, rules, and source validation: 20-35 hours.
- Import and matching prototype: 35-60 hours.
- Review tool, alerts, postcard export, security, and monitoring: 50-90 hours.
- Pilot support, tuning, and reporting: 20-40 hours.
- Total initial effort: approximately 125-225 hours.
- Infrastructure: likely modest for an internal tool, plus printing/postage and any selected county feed fees.
- Known published county options to evaluate: Larimer daily FTP at $600/month; Weld ShareFile at $1,000 setup plus $500/month; Weld weekly assessor downloads are free.

## Owner Decisions Needed Before Coding

1. Confirm Weld County and the target service geography.
2. Confirm whether the pilot includes individuals, LLCs, trusts, and developers.
3. Approve the postcard-first approach.
4. Choose the initial alert frequency: daily for Larimer when data permits and weekly for Weld.
5. Name the reviewer and establish a maximum number of postcards per week.
6. Approve the compliance and data-retention guardrails.
7. Approve the 60- to 90-day pilot and the success threshold for continuing.

## Suggested First Postcard Concept

Front: Congratulations on your recent land purchase.

Back: If you are still choosing a builder, Kiefer Built would be glad to learn what you have in mind. We build custom homes and construction projects for Colorado conditions. This is a one-time introduction based on public property records. No pressure - just a local resource if and when you need one.

Include Kiefer Built's website, phone number, a specific landing-page URL or QR code, and a simple way to request no future mail.

Final wording, claims, targeting, and opt-out language should be reviewed before launch.

## Risk Register

| Risk | Control |
| --- | --- |
| Portal automation violates terms | Use downloads or licensed feeds; obtain written permission; never automate Weld Recorder Self-Service. |
| Assessor records arrive after the deed | Measure lag; use Larimer daily FTP if ROI supports it; investigate an authorized Weld feed. |
| False positives from family/title transfers | Deed-type exclusions, sale-value checks, and human review. |
| Vacant does not mean buildable | Describe leads as likely vacant; never make buildability claims without due diligence. |
| Wrong or stale mailing address | Use current owner files, address standardization, return tracking, and suppression. |
| Privacy or reputational harm | Minimize stored fields, restrict access, keep audit logs, honor opt-outs, and use respectful one-time messaging. |
| County schema or schedule changes | Schema validation, stale-data alerts, raw-file retention, and a documented fallback. |
| Low business value | Use a capped pilot and track cost per qualified consultation and attributable signed work. |

## Sources Verified July 20, 2026

1. Larimer County Assessor Public Data Center: https://www.larimer.gov/assessor/publicdata
2. Larimer County Easy Access and user guide: https://www.larimer.gov/clerk/recording/easy-access and https://www.larimer.gov/clerk/recording/easy-access/navigation
3. Larimer County Remote Access/FTP options: https://www.larimer.gov/clerk/recording/easy-access/remote
4. Weld County Assessor Data Download: https://www.weld.gov/Government/Departments/Assessor/Data-Download
5. Weld County Assessor Data Dictionary: https://www.weld.gov/Government/Departments/Assessor/Data-Download/Data-Dictionary
6. Weld County Recording Department: https://www.weld.gov/Government/Departments/Clerk-and-Recorder/Recording-Department
7. Weld County Recorder Self-Service terms: https://recording.weld.gov/web/user/disclaimer
8. Weld County Recording Department Fees: https://www.weld.gov/Government/Departments/Clerk-and-Recorder/Recording-Department/Recording-Department-Fees
9. Weld County recording requirements, including grantee mailing address: https://www.weld.gov/Government/Departments/Clerk-and-Recorder/Recording-Department/Recording-a-Document

## Change Log

- Version 1.0 - July 20, 2026 - Initial owner roadmap and checklist.
