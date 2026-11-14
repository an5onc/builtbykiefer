// Existing named locations, consolidated from homepage/SEO and service-page copy.
// This is not a guarantee of project availability or an office-location record.
export const serviceAreaCities = [
  "Windsor", "Fort Collins", "Loveland", "Greeley", "Timnath", "Johnstown", "Wellington",
] as const;

export const serviceAreaRegion = "Northern Colorado";
export const serviceAreaCityList = new Intl.ListFormat("en-US", { style: "long", type: "conjunction" })
  .format(serviceAreaCities);
