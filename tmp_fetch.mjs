import fs from 'fs';
const res = await fetch('https://jtxolemagmoqlbdilpxu.supabase.co/rest/v1/companies?select=company_id,name,tier,category', {
  headers: {
    'apikey': 'sb_publishable_J0yLreLxR3oZD2JVVSBH-w_g9Y2jakg',
    'Authorization': 'Bearer sb_publishable_J0yLreLxR3oZD2JVVSBH-w_g9Y2jakg'
  }
});
const data = await res.json();
const tierCounts = data.reduce((acc, row) => {
  const t = String(row.tier);
  acc[t] = (acc[t] || 0) + 1;
  return acc;
}, {});
fs.writeFileSync('c:/Users/bogas/OneDrive/Desktop/Talencia Global/pixel-perfect-replication-main/pixel-perfect-replication-main/tmp_tiers.json', JSON.stringify(tierCounts, null, 2));
