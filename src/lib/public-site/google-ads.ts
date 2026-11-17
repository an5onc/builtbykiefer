// Owner's shared Google tag, loaded by its Ads ID and linked to GA4 G-0W0SW6FW4G.
// Configure conversion actions separately; do not add a second Analytics/GTM loader.
export const GOOGLE_ADS_ID = "AW-11035153313";
export const GOOGLE_ADS_SCRIPT_ID = "google-ads-tag";

// Keep local development and hosted previews out of the advertising account.
// Next's root Script runs once across client navigation; the loader guard also
// prevents duplicate initialization if the bootstrap is evaluated again.
export const googleAdsBootstrap = `
(function () {
  if (!['kbuiltco.com', 'www.kbuiltco.com'].includes(window.location.hostname)) return;
  if (document.getElementById('google-ads-loader')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', '${GOOGLE_ADS_ID}');
  var script = document.createElement('script');
  script.id = 'google-ads-loader';
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}';
  document.head.appendChild(script);
})();
`;
