/**
 * Emails the "new land buyers" alert via Resend.
 *
 * The email is a nudge, not the workspace: it says how many new buyers showed
 * up and previews the top few, then points at the sheet where the mailing work
 * actually happens.
 */

import { isoDate, titleCase } from './normalize.mjs';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildEmail(leads, { sheetUrl = '', csvPath = '' } = {}) {
  const n = leads.length;
  const subject =
    n === 0 ? 'Land leads: no new buyers today' : `${n} new land buyer${n === 1 ? '' : 's'} - postcards ready to send`;

  const preview = leads.slice(0, 10);
  const rows = preview
    .map(
      (l) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(titleCase(l.buyerName))}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
          titleCase(l.situsAddress) || titleCase(l.subdivision) || '—'
        )}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(l.acres)} ac</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">$${Number(
          l.salePrice
        ).toLocaleString()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(
          isoDate(l.saleDate)
        )}</td>
      </tr>`
    )
    .join('');

  const cta = sheetUrl
    ? `<p style="margin:24px 0;"><a href="${escapeHtml(sheetUrl)}"
         style="background:#1f2937;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
         Open the lead sheet</a></p>`
    : `<p style="margin:24px 0;color:#374151;">Lead file: <code>${escapeHtml(csvPath)}</code></p>`;

  const html =
    n === 0
      ? `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#111827;">
           <p>No new qualifying land purchases in Larimer or Weld today.</p>
           <p style="color:#6b7280;font-size:14px;">The check ran successfully — there was simply nothing new.</p>
         </div>`
      : `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#111827;max-width:640px;">
           <h2 style="margin:0 0 4px;">${n} new land buyer${n === 1 ? '' : 's'}</h2>
           <p style="margin:0 0 20px;color:#6b7280;">County records updated. These buyers just closed on vacant land and have a mailing address on file.</p>
           <table style="border-collapse:collapse;width:100%;font-size:14px;">
             <thead>
               <tr style="text-align:left;background:#f9fafb;">
                 <th style="padding:8px 12px;">Buyer</th>
                 <th style="padding:8px 12px;">Property</th>
                 <th style="padding:8px 12px;">Size</th>
                 <th style="padding:8px 12px;">Price</th>
                 <th style="padding:8px 12px;">Sold</th>
               </tr>
             </thead>
             <tbody>${rows}</tbody>
           </table>
           ${n > preview.length ? `<p style="color:#6b7280;font-size:14px;">…and ${n - preview.length} more.</p>` : ''}
           ${cta}
           <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:12px;">
             Mark each one <strong>Postcard Sent?</strong> in the sheet once mailed — they will never be surfaced again.
           </p>
         </div>`;

  return { subject, html };
}

/** Send the alert. Returns { sent, reason }. */
export async function sendAlert(leads, config, { log = () => {}, sheetUrl = '' } = {}) {
  const { apiKey, to, from } = config.email;
  if (!apiKey || !to) {
    log('  email not configured (set RESEND_API_KEY and LAND_LEADS_ALERT_TO) - skipping alert');
    return { sent: false, reason: 'not configured' };
  }

  const { subject, html } = buildEmail(leads, { sheetUrl, csvPath: config.paths.outputCsv });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()), subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    log(`  email failed: ${res.status} ${body}`);
    return { sent: false, reason: `${res.status} ${body}` };
  }
  log(`  emailed alert to ${to}`);
  return { sent: true };
}
