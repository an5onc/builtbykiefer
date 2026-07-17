export type EducationSource = {
  id: number;
  citation: string;
  independent: boolean;
};

export const educationSources: EducationSource[] = [
  {
    id: 1,
    citation:
      "U.S. Environmental Protection Agency, The Inside Story: A Guide to Indoor Air Quality, and EPA Report on the Environment. Indoor air can be two to five times more polluted than outdoor air; people spend roughly 90% of their time indoors; energy-efficient construction without sufficient ventilation can worsen indoor air quality.",
    independent: true,
  },
  {
    id: 2,
    citation:
      "Health and Wellbeing of Occupants in Highly Energy-Efficient Buildings: A Field Study, peer-reviewed, U.S. National Library of Medicine (PMC). Occupants of energy-efficient, mechanically-ventilated homes rated indoor air quality and comfort significantly higher than a standard-construction control group.",
    independent: true,
  },
  {
    id: 3,
    citation:
      "Structural Insulated Panel Association (SIPA) and SIP manufacturer technical data, including Oak Ridge National Laboratory whole-wall R-value research. Industry testing and field data cited at 40–60% greater energy efficiency versus comparable stick-frame construction, and whole-wall performance of roughly R-14 for SIP walls versus roughly R-9.5 for standard 2×4 framing.",
    independent: false,
  },
  {
    id: 4,
    citation:
      "SIPA-conducted missile-impact and high-wind testing, evaluated alongside APA – The Engineered Wood Association. SIP wall assemblies withstood simulated wind loads of 140+ mph and debris impact without structural failure.",
    independent: false,
  },
  {
    id: 5,
    citation:
      "Industry case reporting on Hurricane Irma (2017): a SIP-built home in Ramrod Key, FL, engineered for 200+ mph winds, remained structurally intact while neighboring conventionally-framed homes were destroyed.",
    independent: false,
  },
  {
    id: 6,
    citation:
      "Oak Ridge National Laboratory / U.S. Department of Energy, ORNL/TM-2011/17, High Performance Homes That Use 50% Less Energy Than the DOE Building America Benchmark Building. Federally monitored structural-insulated-panel demonstration home (ZEH5), Lenoir City, TN: 50% less energy use than the DOE Building America Benchmark over a full year of metered data, with a 1.65 ACH50 airtight envelope and an extensive moisture-control package.",
    independent: true,
  },
  {
    id: 7,
    citation:
      "U.S. Department of Energy, Zero Energy Ready Home (ZERH) Program, National Program Requirements. DOE-certified ZERH homes — over 12,000 nationwide — are typically 40–50% more energy-efficient than a typical new home, and must meet EPA Indoor airPLUS indoor-air-quality requirements as a condition of certification.",
    independent: true,
  },
  {
    id: 8,
    citation:
      "U.S. Department of Energy, Tour of Zero homeowner case study, Durango, CO. Independent homeowner account of a certified Zero Energy Ready Home reporting near-zero electric costs and approximately $350 in total propane costs across a ten-month heating season.",
    independent: true,
  },
  {
    id: 9,
    citation:
      "Christian, Jeff, and T.W. Petrie, Heating and Blower Door Tests of the Rooms for the SIPA/Reiker Project, Oak Ridge National Laboratory, 2002. Blower-door testing found a structural-insulated-panel test room to have approximately 90% less air leakage — roughly fifteen times tighter — than an equivalent stick-framed room with fiberglass insulation.",
    independent: true,
  },
  {
    id: 10,
    citation:
      "U.S. Environmental Protection Agency, Indoor airPLUS Program requirements, as incorporated into the U.S. DOE Zero Energy Ready Home National Program Requirements. Certification-level requirements covering moisture control, combustion safety, ventilation, and low-emission material selection.",
    independent: true,
  },
  {
    id: 11,
    citation:
      "Rocky Mountain Insurance Information Association and Colorado Division of Insurance, public hail-loss reporting. Colorado ranks second nationally in hail insurance claims; hail has been the leading driver of the state's insured losses in eight of the past eleven years; the May 2017 Denver-metro hailstorm caused an estimated $2.3 billion in damage.",
    independent: true,
  },
  {
    id: 12,
    citation:
      "National Oceanic and Atmospheric Administration (Climate.gov) and University of Colorado Boulder Natural Hazards Center, post-event reporting on the Marshall Fire, Boulder County, CO (December 30, 2021). Colorado's most destructive wildfire on record, destroying 1,084 homes in approximately six hours, driven by wind gusts exceeding 100 mph; more than half of Coloradans live in the wildland-urban interface.",
    independent: true,
  },
  {
    id: 13,
    citation:
      "Larimer County Building Department and Structural Engineers Association of Colorado (SEAC), Colorado Design Snow Loads and county structural design standards. County-specific ground snow load, roof snow load, and basic wind speed requirements referenced for Northern Colorado construction.",
    independent: true,
  },
];

export const SOURCES_DISCLAIMER =
  "Sources marked “Industry testing data” reflect structural insulated panel industry testing and manufacturer field data, cited here by source rather than represented as independent research. All other sources draw on independent government, national laboratory, and public agency data.";
