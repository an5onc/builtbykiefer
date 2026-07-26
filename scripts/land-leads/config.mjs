/**
 * Land purchase lead alert - targeting configuration.
 *
 * This is the file to edit when you want more or fewer postcards per week.
 * Everything else in scripts/land-leads/ reads from here.
 */

// Must come first: this populates process.env from .env before the values
// below are read. Real environment variables still take precedence.
import './lib/env.mjs';

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
   * Assessor account types worth mailing, across both counties.
   *
   * Excludes Personal (business personal property), Exempt (government and
   * nonprofit), Nat Resources (mineral rights), Leasing, Commercial and
   * Industrial - none of which are someone building a house.
   *
   * "Vacant Land" is Weld's own category; Larimer has no equivalent and marks
   * vacancy through its building count instead.
   */
  allowedAccountTypes: ['Residential', 'Agricultural', 'Vacant Land'],

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
   * Deed codes treated as arms-length market sales. Union of both counties,
   * verified against each county's live data over a trailing 120 days.
   *
   *   WD / SWD    Warranty and Special Warranty Deed - the real purchases
   *   *J          Larimer joint-tenancy variant, usually a couple buying
   *   *E          Weld variant of the same deed types
   *   PRD         Personal Representative's Deed - a real purchase from an estate
   *
   * Deliberately excluded: QC (quit claim - family and cleanup transfers),
   * TRU (trustee), CONS (conservator), D, BSD, VOA, and every corrected deed.
   */
  armsLengthDeedCodes: [
    'WD', 'WDJ', 'WDE',
    'SWD', 'SWDJ', 'SWDE',
    'PRD', 'PRDJ', 'PRDE',
  ],

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
   * Weld County's public open-data parcel service.
   *
   * This is the layer behind the county's own "Assessor Data Explorer and
   * Download Tool" (an ArcGIS Experience app linked from their Data Download
   * page). The service is owned by WeldCounty, published with public access,
   * and named for open data, so querying it is the intended use.
   *
   * It is NOT the recorder self-service portal, whose terms prohibit automated
   * searches. Do not point anything at that.
   *
   * One layer carries owner name, mailing address, last sale and parcel facts,
   * so no join is needed.
   */
  weldParcelService:
    'https://services.arcgis.com/ewjSqmSyHJnkfBLL/arcgis/rest/services/Parcels_open_data/FeatureServer/0',

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
