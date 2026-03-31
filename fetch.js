import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing env variables', { supabaseUrl, supabaseKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      company_core_values(*),
      company_brand_reputation(*),
      company_business(
        *,
        company_unique_differentiators(unique_differentiators),
        company_core_value_proposition(core_value_proposition),
        company_focus_sectors(focus_sectors),
        company_offerings_description(offerings_description),
        company_top_customers(top_customers),
        company_competitive_advantages(competitive_advantages),
        company_key_competitors(key_competitors)
      ),
      company_compensation(*),
      company_culture(*),
      company_financials(*),
      company_logistics(*),
      company_people(*),
      company_talent_growth(*),
      company_technologies(*)
    `)
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  const allKeys = [];
  const printKeys = (obj, prefix = '') => {
    if (!obj) return;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        printKeys(obj[key], `${prefix}${key}.`);
      } else if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === 'object') {
        printKeys(obj[key][0], `${prefix}${key}[].`);
      } else {
        allKeys.push(`${prefix}${key}`);
      }
    }
  };

  printKeys(data);
  import('fs').then(fs => fs.writeFileSync('keys.json', JSON.stringify({ data, allKeys }, null, 2)));
}

run();
