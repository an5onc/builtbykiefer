export type EducationSource = {
  id: number;
  citation: string;
  independent: boolean;
  links: Array<{ label: string; url: string }>;
};

export const educationSources: EducationSource[] = [
  {
    id: 1,
    citation:
      "U.S. Environmental Protection Agency, The Inside Story and Report on the Environment. Some indoor pollutant concentrations are two to five times outdoor levels; Americans spend roughly 90% of their time indoors. Tight construction needs adequate ventilation.",
    independent: true,
    links: [
      { label: "EPA indoor air guide", url: "https://www.epa.gov/indoor-air-quality-iaq/inside-story-guide-indoor-air-quality" },
      { label: "EPA indoor air indicators", url: "https://www.epa.gov/report-environment/indoor-air-quality" },
    ],
  },
  {
    id: 2,
    citation:
      "Wallner et al., Health and Wellbeing of Occupants in Highly Energy-Efficient Buildings: A Field Study (2017), peer-reviewed Austrian research. Residents of 123 modern homes reported better perceived air quality and climate with mechanical ventilation; overall health did not differ significantly between the groups.",
    independent: true,
    links: [{ label: "Read the study abstract on PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/28335491/" }],
  },
  {
    id: 3,
    citation:
      "Structural Insulated Panel Association (SIPA), R-Values in the Real World. Industry explanation of thermal bridging and whole-wall insulation. Values depend on the specified wall assembly; this is not a measured savings claim for a Kiefer Built home.",
    independent: false,
    links: [{ label: "SIPA whole-wall insulation explanation", url: "https://www.sips.org/resources/r-values-in-the-real-world" }],
  },
  {
    id: 4,
    citation:
      "SIPA, SIPs and the Hurricane Impact Missile Test (2021), reporting ICC NTA testing of a particular 6.5-inch SIP assembly against a 2×4 debris impact. An assembly-specific impact test is not a universal wind-speed rating for SIPs.",
    independent: false,
    links: [{ label: "SIPA impact-test report and assembly references", url: "https://www.sips.org/blog/sips-and-the-hurricane-impact-missile-test" }],
  },
  {
    id: 5,
    citation:
      "SIPA industry case reporting: the Brisson house in Ramrod Key, Florida, used Innova magnesium-oxide-faced SIPs and reportedly sustained minimal damage in Hurricane Irma (2017). This is a different builder and panel system, not proof of storm performance for every SIP home.",
    independent: false,
    links: [
      { label: "SIPA Brisson house project record", url: "https://www.sips.org/projects/brisson-sip-house-ramrod-key-fl" },
      { label: "SIPA Hurricane Irma case reporting", url: "https://www.sips.org/blog/sips-and-the-hurricane-impact-missile-test" },
    ],
  },
  {
    id: 6,
    citation:
      "Oak Ridge National Laboratory / U.S. Department of Energy, ORNL/TM-2011/17 (2011). ZEH5 in Lenoir City, Tennessee, combined SIPs, geothermal equipment and solar systems. Tables 4–6 distinguish occupied-year measurements from a calibrated-model comparison: 53% less energy without PV against the modeled Building America benchmark. Not a SIP-only effect or utility-bill guarantee.",
    independent: true,
    links: [{ label: "Read the original ORNL report (PDF)", url: "https://www.sips.org/documents/ORNL-SIP-Homes-50-Less-Energy-than-Benchmark.pdf" }],
  },
  {
    id: 7,
    citation:
      "U.S. Department of Energy, Efficient New Homes program, formerly Zero Energy Ready Home. DOE describes certified homes as typically 40–50% more efficient than typical new homes. Certification requires defined whole-home measures and third-party verification; no Kiefer Built project certification is implied here.",
    independent: true,
    links: [{ label: "DOE program overview", url: "https://www.energy.gov/cmei/buildings/zero-energy-programs" }],
  },
  {
    id: 8,
    citation:
      "U.S. Department of Energy, 2015 case study: Mantell-Hecathorn Builders, Shenandoah Circle, Durango, Colorado. This 3,841-square-foot advanced wood-framed home had a HERS rating of 50 without solar PV and 21 with PV. Ratings and estimated savings describe that home, not Kiefer Built work or measured future bills.",
    independent: true,
    links: [{ label: "Read the original DOE Durango case study (PDF)", url: "https://www.energy.gov/sites/prod/files/2015/10/f27/Mantell_2015_DOE_ZER-HIA_casestudy_PNNL-10-5-15.pdf" }],
  },
  {
    id: 9,
    citation:
      "Christian and Petrie, Heating and Blower Door Tests of the Rooms for the SIPA/Reiker Project, Oak Ridge National Laboratory (2002). The best-sealed SIP test room had about fifteen times lower leakage at 50 pascals than the wood-framed test room. These are test rooms, with results dependent on sealing, not occupied Kiefer Built homes.",
    independent: true,
    links: [{ label: "Read the original ORNL test-room report (PDF)", url: "https://www.portersips.com/hubfs/Porter%20Sips/Bulletins/ORNL%20Air%20Infiltration%20Report.pdf?hsLang=en" }],
  },
  {
    id: 10,
    citation:
      "U.S. Environmental Protection Agency, Indoor airPLUS Program requirements, as incorporated into the U.S. DOE Zero Energy Ready Home National Program Requirements. Certification-level requirements covering moisture control, combustion safety, ventilation, and low-emission material selection.",
    independent: true,
    links: [
      { label: "EPA Indoor AirPlus program", url: "https://www.epa.gov/indoorairplus" },
      { label: "DOE certification requirements", url: "https://www.energy.gov/cmei/buildings/doe-efficient-new-homes-program-requirements" },
    ],
  },
  {
    id: 11,
    citation:
      "Colorado Division of Insurance, consumer resources on disaster readiness and hail insurance. Public-agency guidance supports planning for hail and reviewing coverage; this page makes no current national hail ranking or insurance-savings claim.",
    independent: true,
    links: [{ label: "Colorado insurance consumer resources", url: "https://doi.colorado.gov/for-consumers/consumer-resources/special-insurance-topics" }],
  },
  {
    id: 12,
    citation:
      "Boulder County Fireshed account and University of Colorado Boulder Western Water Assessment briefing (2022) on the December 30, 2021 Marshall Fire. The county reports 1,084 homes destroyed; the university briefing documents gusts exceeding 100 mph and compound fire hazards.",
    independent: true,
    links: [
      { label: "Boulder County Marshall Fire account", url: "https://bouldercounty.gov/property-and-land/forest-health/fireshed/" },
      { label: "CU Boulder compound-hazards briefing", url: "https://wwa.colorado.edu/resources/hazard-assessments/briefing/compound-hazards-and-marshall-fire-january-13-2022" },
    ],
  },
  {
    id: 13,
    citation:
      "Larimer County Building Division, structural design information and wind/snow resources. Requirements depend on the site, adopted code and jurisdiction. Ground snow load, roof snow load and ultimate wind speed are distinct engineering inputs; one generic panel test cannot establish site compliance.",
    independent: true,
    links: [{ label: "Larimer County building and design resources", url: "https://www.larimer.gov/building" }],
  },
];

export const SOURCES_DISCLAIMER =
  "Sources marked “Industry testing data” are SIP-industry explanations, testing or case reporting. Other sources draw on independent government, national laboratory, and public agency data, alongside identified peer-reviewed university research. A laboratory report remains a laboratory source when hosted by an industry site; hosting does not turn its results into a guarantee for your home. Photos show Kiefer Built projects, not the research test rooms or other builders’ case-study homes.";
