/**
 * Land purchase lead alert - targeting configuration.
 *
 * This is the file to edit when you want more or fewer postcards per week.
 * Everything else in scripts/land-leads/ reads from here.
 */

export const config = {
  /** Counties to include. Weld requires a manual weekly CSV drop (see README). */
  counties: {
    larimer: { enabled: true },
    weld: { enabled: true },
  },

  /**
   * Acreage band for a "buildable homesite" lead.
   * Below min filters out slivers, easements and common-area remnants.
   * Above max filters out large ag/ranch parcels.
   *
   * The median vacant parcel in Larimer is 0.33 acres - ordinary subdivision
   * building lots - so a 1-acre floor would discard most real homesites.
   */
  acres: { min: 0.1, max: 40 },

  /**
   * Assessor account types worth mailing. Excludes Personal (business personal
   * property), Exempt (government/nonprofit), Nat Resources (mineral rights)
   * and Leasing, none of which are people building a house.
   */
  allowedAccountTypes: ['Residential', 'Agricultural'],

  /** Ignore sales below this price: $1 transfers, gifts, corrections. */
  minSalePrice: 50_000,

  /**
   * Ignore sales above this price per acre.
   *
   * This is the single most important quality filter. The assessor adds a new
   * house to the roll months after it sells, so a just-completed production
   * home looks like "vacant land" that sold for $560k on a tenth of an acre -
   * roughly $5M/acre. Genuine raw land in Larimer runs $3k-$70k/acre, and even
   * an in-town building lot rarely clears $1M/acre.
   *
   * Filtering here removes both finished homes and builders buying blocks of
   * lots, which is what you want: those buyers already have a builder.
   * Raise this if you also want in-town infill lots.
   */
  maxPricePerAcre: 1_000_000,

  /** Only surface sales that closed within this many days of the run. */
  lookbackDays: 120,

  /**
   * Deed codes treated as arms-length market sales.
   *
   * Verified against the live Larimer export (trailing 120 days):
   *   WD / WDJ    Warranty Deed (JT = joint tenancy, usually a couple buying)
   *   SWD / SWDJ  Special Warranty Deed
   *   PRD / PRDJ  Personal Representative's Deed - a real purchase from an estate
   *
   * Deliberately excluded: QC/QCJ (quit claim - family and cleanup transfers),
   * BSD (bargain & sale), VOA (verification of application), DE (bare deed),
   * and every C* corrected deed.
   */
  armsLengthDeedCodes: ['WD', 'WDJ', 'SWD', 'SWDJ', 'PRD', 'PRDJ'],

  /** Buyer name patterns that mark a non-prospect. Surfaced as a flag, not dropped. */
  excludePatterns: [
    // Government / public
    /\b(COUNTY|CITY OF|TOWN OF|STATE OF|UNITED STATES|USA|FEDERAL|DISTRICT|AUTHORITY|MUNICIPAL|SCHOOL|UNIVERSITY|COLLEGE)\b/i,
    // Utility / infrastructure / ROW
    /\b(UTILITY|UTILITIES|ELECTRIC|POWER|GAS|WATER|SANITATION|PIPELINE|MIDSTREAM|TELECOM|RAILROAD|RAILWAY|DITCH|RESERVOIR|CEMETERY)\b/i,
    // Financial / institutional
    /\b(BANK|MORTGAGE|LENDING|CREDIT UNION|FINANCIAL|CAPITAL ONE|FANNIE MAE|FREDDIE MAC|HUD|SECRETARY OF)\b/i,
    // Builders / developers / competitors
    /\b(\w*HOMES|HOMEBUILD\w*|BUILDERS?|CONSTRUCTION|CONTRACTING|DEVELOPMENT|DEVELOPERS?|COMMUNITIES|PROPERTIES INC|REALTY|LAND COMPANY|INVESTMENTS?)\b/i,
    // HOA / church / nonprofit
    /\b(HOMEOWNERS|ASSOCIATION|HOA|CHURCH|MINISTRIES|FOUNDATION|NONPROFIT)\b/i,
  ],

  /** Patterns that mark the buyer as an entity rather than a person. */
  entityPatterns: [
    /\b(LLC|L\.L\.C|INC|INCORPORATED|CORP|CORPORATION|COMPANY|CO\b|LP\b|LLP|LTD|PARTNERSHIP|TRUST|TRUSTEE|ESTATE OF|FUND)\b/i,
  ],

  paths: {
    dataDir: '.land-leads-data',
    cacheDir: '.land-leads-data/cache',
    weldInbox: '.land-leads-data/inbox/weld',
    stateFile: '.land-leads-data/seen.json',
    outputCsv: '.land-leads-data/land-leads.csv',
  },

  larimerUrls: {
    sales: 'https://storage.googleapis.com/lc-public/asr/assessor-public-sales.csv',
    owner: 'https://storage.googleapis.com/lc-public/asr/assessor-public-owner.csv',
    account: 'https://storage.googleapis.com/lc-public/asr/assessor-public-account.csv',
  },

  /**
   * Optional integrations. Both are read from environment variables so no
   * secret is ever stored in this repository.
   *
   *   GOOGLE_SERVICE_ACCOUNT_JSON  path to the service-account key file
   *   LAND_LEADS_SHEET_ID          the target Google Sheet id
   *   RESEND_API_KEY               for the email alert
   *   LAND_LEADS_ALERT_TO          where the alert is sent
   */
  google: {
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
    sheetId: process.env.LAND_LEADS_SHEET_ID || '',
    tabName: 'Leads',
  },
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    to: process.env.LAND_LEADS_ALERT_TO || '',
    from: process.env.LAND_LEADS_ALERT_FROM || 'Land Leads <onboarding@resend.dev>',
  },
};

export default config;
