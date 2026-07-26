# Land Purchase Lead Alert

Finds people who just bought vacant land in Larimer and Weld counties, and puts
them in a spreadsheet with the mailing address you need to send the postcard.

```bash
npm run leads:preview   # see what it would find, write nothing
npm run leads           # real run: update the sheet and send the alert
```

## What it does

1. Downloads the Larimer County assessor's daily public files (free, no account).
2. Joins each sale to the parcel record and the owner's mailing address.
3. Keeps only genuine vacant-land purchases (see *How leads are chosen*).
4. Skips anything it has surfaced before, so nobody gets two postcards.
5. Adds the new leads to your spreadsheet and emails you that they are there.

You mail the postcards. The script never mails anything.

## Realistic expectations

**Volume:** about **4–6 new leads a week** from Larimer. That is the number left
after removing resales of existing houses, family transfers, and builders buying
lots. Weld adds more once you start dropping its file in.

**Timing:** you will not beat the closing table. The assessor publishes a sale
roughly **1–3 weeks** after it closes, and recent weeks fill in gradually. In
practice a buyer shows up 9–20 days after they bought. That is still early while
they are choosing a builder, and well ahead of word of mouth — but it is not
same-day.

**Accuracy:** every lead is a real recorded sale. The main thing the county data
cannot tell you is whether a parcel is actually buildable, permitted or served by
utilities. Treat each lead as "worth a postcard", not as a qualified project.

## How leads are chosen

A sale becomes a lead only if all of these are true. Every rule lives in
`config.mjs` and is safe to change.

| Rule | Why |
| --- | --- |
| Sold within the last 120 days | Recent enough that they are still deciding |
| Warranty or special warranty deed | Real purchases; excludes quit claims and family transfers |
| Sale price at least $50,000 | Removes $1 transfers, gifts and corrections |
| No building on the parcel | They need something built |
| Under $1,000,000 per acre | **The most important filter** — see below |
| Between 0.1 and 40 acres | Excludes slivers and easements, and large ranches |
| Residential or agricultural | Excludes mineral rights and business equipment |
| Has a deliverable mailing address | Otherwise there is nowhere to send it |
| Buyer is not a builder, bank or government | They already have a builder |

### Why the price-per-acre rule matters

The assessor adds a newly built house to the record months after it sells. Until
then a brand-new production home looks exactly like vacant land: a 0.12-acre
parcel that sold for $560,000. That is about $5M per acre, and it is a finished
house, not a homesite.

Real land in Larimer runs $3,000–$70,000 per acre. The $1M ceiling separates the
two cleanly. Without it, roughly **three out of four "leads" are people who
already bought a finished house** — the worst possible postcard to receive.

Raise `maxPricePerAcre` if you also want expensive in-town infill lots.

### Turning the volume up or down

Edit `config.mjs`:

- **More leads:** raise `maxPricePerAcre`, lower `minSalePrice`, widen `acres`,
  or increase `lookbackDays`.
- **Fewer, better leads:** raise `minSalePrice`, or narrow `acres` to the parcel
  size you actually like to build on.

Run `npm run leads:preview` after any change. In preview mode it prints every
reason it dropped a sale, so you can see exactly which rule is biting.

## The spreadsheet

| Column | |
| --- | --- |
| Sale Date, County | When and where |
| Buyer Name, Mail To | Who to address it to |
| Mailing Address, City, State, ZIP | **What goes on the postcard** |
| Property Address, Subdivision, Acres | What they bought |
| Sale Price, Buyer Type | Individual or LLC |
| Why It Matched | Why this one is here |
| **Postcard Sent?** | **You fill this in** |
| Notes | Yours |

**Mark "Postcard Sent?" once you mail someone.** The script reads that column
back and will never surface them again.

Without Google set up, the file is `.land-leads-data/land-leads.csv` — double
click to open it in Excel or Numbers.

## Setup

Nothing below is required. The script already works and writes the CSV.

### Live Google Sheet

So you can check leads from your phone.

1. Create a sheet at <https://sheets.new> and copy its ID from the URL:
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
2. Go to <https://console.cloud.google.com/> → create a project (any name).
3. **APIs & Services → Library** → search "Google Sheets API" → **Enable**.
4. **APIs & Services → Credentials → Create credentials → Service account.**
   Name it anything, skip the optional steps.
5. Open the service account → **Keys → Add key → Create new key → JSON.**
   Save the file outside the repo, e.g. `~/land-leads-service-account.json`.
6. Open that file, copy the `client_email` value, and **share your sheet with
   that address as an Editor** — same as sharing with a person. This step is
   what grants access; without it you get a 403.
7. Add to your shell profile:

   ```bash
   export GOOGLE_SERVICE_ACCOUNT_JSON="$HOME/land-leads-service-account.json"
   export LAND_LEADS_SHEET_ID="the id from step 1"
   ```

Keep the key file out of the repo. It is your credential, not the script's.

### Email alerts

Settings live in a `.env` file at the project root. It is git-ignored, so the
key never leaves this machine.

```bash
cp .env.example .env    # if you do not have one yet
```

Then open `.env` and fill in:

```
RESEND_API_KEY=re_your_key_here
LAND_LEADS_ALERT_TO=you@example.com
```

The key comes from <https://resend.com/api-keys>. **The website's quote form
uses this same key**, so filling it in here also fixes quote-request email
locally.

Check that it worked — this sends one real email with two sample leads:

```bash
npm run leads -- --test-email
```

Every run also prints whether alerts are on, near the top:

```
Configuration:
  email alerts: ON  -> you@example.com
```

A note on the sender: `LAND_LEADS_ALERT_FROM` defaults to your
`builtbykiefer.com` address, which works if that domain is verified in Resend.
If the test email fails with a domain error, switch it to
`onboarding@resend.dev` — that always works but can only deliver to the address
that owns the Resend account.

Without any of this the script still runs and still updates the spreadsheet; it
just does not email you.

### Weld County

Weld's download is behind a CDN that blocks scripts, and their recorder's terms
prohibit automated searches. So Weld is manual, on purpose:

1. Once a week (they update Wednesdays) open
   <https://www.weld.gov/Government/Departments/Assessor/Data-Download>
2. Download the assessor sales/owner CSV.
3. Drop it in `.land-leads-data/inbox/weld/`.

The next run picks it up automatically. Column names vary between Weld exports,
so the adapter matches headers by alias rather than assuming a fixed layout — if
a required column is missing it says so by name and skips that file.

**Do not point this script at Weld's recorder search portal.** Their terms
forbid it.

### Run it automatically every morning

A ready-made schedule is in `com.builtbykiefer.landleads.plist`. To install it:

```bash
cp scripts/land-leads/com.builtbykiefer.landleads.plist ~/Library/LaunchAgents/ && launchctl load ~/Library/LaunchAgents/com.builtbykiefer.landleads.plist
```

That runs it at 8:00am daily and logs to `.land-leads-data/run.log`. To stop:

```bash
launchctl unload ~/Library/LaunchAgents/com.builtbykiefer.landleads.plist
```

Edit `StartCalendarInterval` in the file to change the hour. Your `.env` is read
automatically, so keys do not need to be repeated in the plist.

## Options

| | |
| --- | --- |
| `--dry-run` | Show what would happen, write and send nothing |
| `--offline` | Use already-downloaded files, skip the network |
| `--reset` | Forget history and re-surface everything |
| `--lookback 30` | Override the 120-day window |
| `--test-email` | Send one sample alert to check the Resend key |

With `npm run`, pass flags after `--`, e.g. `npm run leads -- --test-email`.

## Files

```
run.mjs            entry point
config.mjs         all tuning knobs - start here
qualify.mjs        the rules that decide what becomes a lead
normalize.mjs      shared lead shape
store.mjs          remembers what was already surfaced
sheet.mjs          writes the CSV and the Google Sheet
notify.mjs         the email alert
sources/larimer.mjs  downloads and joins the three county files
sources/weld.mjs     reads whatever you drop in the inbox
lib/csv.mjs        streaming RFC-4180 parser
lib/fetch-cache.mjs  conditional download
```

Working data lives in `.land-leads-data/`, which is git-ignored: it holds real
people's names and home addresses and must stay on this machine.

## Notes on the data

Two things about the Larimer export that are easy to get wrong:

- **`BUILDINGCOUNT` is blank, never `0`,** for a parcel with no structure. The
  value `0` does not appear anywhere in the file. Reading blank as "unknown"
  discards every vacant parcel.
- **The street address is in `MAILADDRESS2`,** not `MAILADDRESS1`. `MAILADDRESS1`
  is an optional first line and is empty on ~97% of records. Requiring it
  discards almost every address.

Both are covered by tests in `land-leads.test.mjs`:

```bash
npx vitest run scripts/land-leads
```

## Compliance

- Larimer data is free public assessor data, downloaded from the county's own
  published endpoints.
- Weld is manual because their terms prohibit automated access.
- The script reads public records and writes a spreadsheet. It does not contact
  anyone.
- Keep a suppression habit: if someone asks not to be contacted, put them in the
  sheet with a note and never mail them again.

This is a marketing tool built on public records, not legal advice. The roadmap
in `docs/land-purchase-lead-alert/` covers the compliance review worth doing
before mailing at volume.
