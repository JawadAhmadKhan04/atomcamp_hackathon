import { supabase } from '../lib/supabaseClient';

export const mapCitizenSubmissionToFormData = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    sNo: dbRecord.s_no || '',
    complaintNumber: dbRecord.complaint_number || '',
    complainantName: dbRecord.complainant_name || '',
    agency: dbRecord.agency || '',
    station: dbRecord.station || '',
    diaryDate: dbRecord.diary_date || '',
    admissibility: dbRecord.admissibility || '',
    reasons: dbRecord.reasons || '',
    admissibilityDate: dbRecord.admissibility_date || '',
    status: dbRecord.status || '',
    gender: dbRecord.gender || '',
    address: dbRecord.address || '',
    district: dbRecord.district || '',
    tehsil: dbRecord.tehsil || '',
    city: dbRecord.city || '',
    cnic: dbRecord.cnic || '',
    mobile: dbRecord.mobile || '',
    phone: dbRecord.phone || '',
    fax: dbRecord.fax || '',
    email: dbRecord.email || '',
    receivingOffice: dbRecord.receiving_office || '',
    ntn: dbRecord.ntn || '',
    passport: dbRecord.passport || '',
    agencyRefNo: dbRecord.agency_ref_no || '',
    value: dbRecord.value || 0,
    subject: dbRecord.subject || '',
    mainPoints: dbRecord.main_points || '',
    remarks: dbRecord.remarks || ''
  };
};

export const getComplaintsList = async () => {
  const { data, error } = await supabase
    .from('register_complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching complaints list:', error);
    return [];
  }

  return data.map(mapCitizenSubmissionToFormData);
};

export const getComplaintById = async (complaintNumber) => {
  const { data, error } = await supabase
    .from('register_complaints')
    .select('*')
    .eq('complaint_number', complaintNumber)
    .single();

  if (error) {
    console.error('Error fetching complaint by ID:', error);
    return null;
  }

  return mapCitizenSubmissionToFormData(data);
};

export const saveComplaintReview = async (complaintNumber, reviewData) => {
  // Map frontend camelCase reviewData back to snake_case if needed
  const dbData = {
    admissibility: reviewData.admissibility,
    reasons: reviewData.reasons,
    admissibility_date: reviewData.admissibilityDate,
    status: reviewData.status,
    remarks: reviewData.remarks
  };

  const { data, error } = await supabase
    .from('register_complaints')
    .update(dbData)
    .eq('complaint_number', complaintNumber)
    .select();

  if (error) {
    console.error('Error updating complaint review:', error);
    throw error;
  }

  return data ? mapCitizenSubmissionToFormData(data[0]) : null;
};
