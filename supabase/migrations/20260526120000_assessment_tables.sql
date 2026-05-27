CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  q1 INT NOT NULL, q2 INT NOT NULL, q3 INT NOT NULL, q4 INT NOT NULL,
  q5 INT NOT NULL, q6 INT NOT NULL, q7 INT NOT NULL, q8 INT NOT NULL,
  q9 INT NOT NULL, q10 INT NOT NULL, q11 INT NOT NULL, q12 INT NOT NULL,
  total_score INT, knowledge_score INT, process_score INT, technology_score INT,
  maturity_level INT, maturity_label TEXT, agent_readiness_level TEXT,
  agent_readiness_score INT, primary_pattern TEXT, patterns JSONB,
  name TEXT NOT NULL, work_email TEXT NOT NULL, company_name TEXT NOT NULL,
  company_website TEXT, role TEXT NOT NULL, employee_count TEXT,
  industry TEXT, biggest_challenge TEXT,
  report_id UUID, report_generated BOOLEAN DEFAULT FALSE,
  report_emailed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS assessment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES assessment_responses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executive_summary TEXT, where_you_are TEXT, cost_analysis TEXT,
  agent_readiness_narrative TEXT, level_up_narrative TEXT,
  roadmap_month1 TEXT, roadmap_month2 TEXT, roadmap_month3 TEXT,
  kautilyan_section TEXT, next_step_narrative TEXT,
  company_research TEXT, full_report_json JSONB
);

ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_responses" ON assessment_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_reports"     ON assessment_reports FOR SELECT USING (true);
CREATE POLICY "service_all_responses"   ON assessment_responses USING (true) WITH CHECK (true);
CREATE POLICY "service_insert_reports"  ON assessment_reports FOR INSERT WITH CHECK (true);
