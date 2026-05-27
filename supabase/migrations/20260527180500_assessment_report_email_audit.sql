-- Audit trail for diagnostic report email delivery (Apps Script / Gmail).
ALTER TABLE assessment_responses
  ADD COLUMN IF NOT EXISTS report_email_error TEXT,
  ADD COLUMN IF NOT EXISTS report_emailed_at TIMESTAMPTZ;

COMMENT ON COLUMN assessment_responses.report_email_error IS 'Last failure reason when sending the report email via GAS; NULL if none or send succeeded.';
COMMENT ON COLUMN assessment_responses.report_emailed_at IS 'Timestamp of the last completed report-email attempt (success or failure).';
