import express from 'express';
import { runComplaintAgent } from '../graph/complaintGraph.js';
import { supabase } from '../db/supabaseClient.js';

export const autofillRouter = express.Router();

/**
 * POST /api/autofill/:complaintId
 * Runs the full LangGraph agent against a complaint and returns the
 * suggested fields. Mirrors the existing classifyComplaint() stub's role,
 * but does NOT write to the database -- the frontend shows the purple
 * confirmation banner and the human clicks "Save" (a separate request)
 * to persist + mark reviewed, same UX pattern as your current stub.
 */
autofillRouter.post('/autofill/:complaintId', async (req, res) => {
  const { complaintId } = req.params;

  try {
    const { data: complaint, error: fetchError } = await supabase
      .from('register_complaints')
      .select('*')
      .eq('complaint_number', complaintId)
      .single();

    if (fetchError || !complaint) {
      return res.status(404).json({ error: 'Complaint not found', details: fetchError?.message });
    }

    const result = await runComplaintAgent(complaint);

    const decision = result.admissibilityDecision;
    const isRejected = decision?.decision === 'reject';
    const isUncertain = !decision || decision.decision === 'uncertain';

    // shape the response to match what the existing Autofill UI expects
    // (admissibility dropdown, admissibility status, remarks) PLUS the new
    // fields your routing/email features need.
    const response = {
      admissibility: isUncertain ? 'Pending Manual Review' : isRejected ? 'Rejected' : 'Admitted',
      admissibilityStatus: decision?.decision || 'uncertain',
      remarks: decision?.reasons || 'Automated review inconclusive; please assess manually.',
      citedRegulations: decision?.citedRegulations || [],
      confidence: decision?.confidence || 'low',
      jurisdictionOffice: result.routingDecision?.office || null,
      jurisdictionJustification: result.routingDecision?.justification || null,
      forwardEmail: result.forwardEmailDraft || null,
      rejectionLetter: result.rejectionLetterDraft || null,
      verification: result.verification || null,
      requiresHumanReview: isUncertain || !result.verification?.passed,
      errors: result.errors || [],
    };

    return res.json(response);
  } catch (err) {
    console.error('autofill failed:', err);
    return res.status(500).json({ error: 'Autofill agent failed', details: err.message });
  }
});

/**
 * POST /api/autofill/:complaintId/confirm
 * Called when the human official clicks "Save" after reviewing the agent's
 * suggestions. Persists the agent's output onto register_complaints and
 * marks it human-reviewed. Does NOT send the forward email automatically --
 * per regulation 23/24, the Mohtasib's approval is part of the real process,
 * so actual email dispatch stays a deliberate, separate action for now.
 * Wire your SMTP/email provider into the TODO below when you're ready to
 * automate sending.
 */
autofillRouter.post('/autofill/:complaintId/confirm', async (req, res) => {
  const { complaintId } = req.params;
  const { admissibility, remarks, jurisdictionOffice, citedRegulations, forwardEmail } = req.body;

  try {
    const { error: updateError } = await supabase
      .from('register_complaints')
      .update({
        admissibility,
        remarks,
        ai_jurisdiction_office: jurisdictionOffice || null,
        ai_cited_regulations: Array.isArray(citedRegulations) ? citedRegulations.join(', ') : null,
        ai_forward_email_draft: forwardEmail?.body || null,
        ai_forward_email_to: forwardEmail?.to || null,
        ai_reviewed_by_human: true,
        ai_processed_at: new Date().toISOString(),
      })
      .eq('complaint_number', complaintId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to save reviewed result', details: updateError.message });
    }

    // TODO: integrate real email dispatch (e.g. SendGrid, nodemailer + SMTP)
    // once you're ready to automate the actual sending step. For now this
    // just confirms the human-reviewed record was saved.
    console.log(`[confirm] complaint ${complaintId} marked reviewed. Forward email NOT auto-sent (manual step).`);

    return res.json({ success: true });
  } catch (err) {
    console.error('confirm failed:', err);
    return res.status(500).json({ error: 'Confirm failed', details: err.message });
  }
});
