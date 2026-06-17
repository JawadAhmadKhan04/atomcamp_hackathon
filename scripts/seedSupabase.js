import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { mockComplaints } from '../src/data/mockComplaints.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/i);
  if (!match) return null;
  let [_, dd, mm, yyyy, hh, min, ss, ampm] = match;
  hh = parseInt(hh, 10);
  if (ampm.toUpperCase() === 'PM' && hh < 12) hh += 12;
  if (ampm.toUpperCase() === 'AM' && hh === 12) hh = 0;
  return `${yyyy}-${mm}-${dd} ${hh.toString().padStart(2, '0')}:${min}:${ss}`;
};

const runSeed = async () => {
  console.log("Seeding Database...");
  const records = mockComplaints.map(c => ({
    s_no: c.sNo,
    complaint_number: c.complaintNumber,
    complainant_name: c.complainantName,
    agency: c.agency,
    station: c.station,
    diary_date: parseDate(c.diaryDate),
    admissibility: c.admissibility,
    reasons: c.reasons,
    admissibility_date: parseDate(c.admissibilityDate),
    status: c.status,
    gender: c.gender,
    address: c.address,
    district: c.district,
    tehsil: c.tehsil,
    city: c.city,
    cnic: c.cnic,
    mobile: c.mobile,
    phone: c.phone,
    fax: c.fax,
    email: c.email,
    receiving_office: c.receivingOffice,
    ntn: c.ntn,
    passport: c.passport,
    agency_ref_no: c.agencyRefNo,
    value: c.value,
    subject: c.subject,
    main_points: c.mainPoints,
    remarks: c.remarks
  }));

  for (const record of records) {
    const { data, error } = await supabase
      .from('register_complaints')
      .upsert(record, { onConflict: 'complaint_number' });

    if (error) {
      console.error(`Error inserting ${record.complaint_number}:`, error.message);
    } else {
      console.log(`Inserted ${record.complaint_number}`);
    }
  }
  console.log("Seeding complete!");
};

runSeed();
