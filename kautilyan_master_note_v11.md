# Kautilyan — Master Product, GTM, and Architecture Note
## Version 11.0 | April 2026
### Definitive reference for product, go-to-market, and architecture.

---

# THE GOVERNING PRINCIPLE

**Memory is the mechanism. Business outcomes are the offer.**

**Discovery reveals the problem. Pilot monetizes the first fix. Platform compounds the learning.**

Every conversation, every offer, every engineering decision flows from this. When in doubt about what to build or what to say, come back to these two lines.

---

# WHAT KAUTILYAN IS

Kautilyan is the operating intelligence layer for growing B2B companies.

It does two things simultaneously that have never been combined in a single product before:

**First — it makes the company impossible to damage through knowledge loss.** When a key person leaves, the work continues. When someone joins, they are effective in days not months. When the founder is not in the room, the team still has the context they need. Every decision made, every client relationship built, every process that runs — captured, structured, and accessible to anyone who needs it, any time they need it.

**Second — it makes every person in the company materially more effective at their actual work.** The CSM who just inherited an account has all the context of the person who managed it for three years. The new engineer knows why every architectural decision was made before they joined. The founder who used to brief everyone before every call now reviews recommendations instead of generating them. The team member who spent 40% of their week on context-gathering now spends that time on judgment work.

This is not knowledge management. This is not documentation software. This is not another AI chat tool.

**Kautilyan is the system that captures how your company actually operates — from decisions made, emails sent, meetings held, and approvals given — and turns that accumulated operating logic into shared, queryable intelligence that makes every person and every agent in the company more effective.**

The north star: a founder types "what happened with Northwind in Q3 and what should we do before their renewal" and the system responds with a complete brief, a recommendation, and a draft action — pulled from decisions made, emails sent, meetings held, and patterns observed — without anyone having manually entered any of it. A team member types "show me everything we know about the Contoso onboarding process" and gets a structured answer with decision history, SOP version, who owns it, and what has drifted from the documented process. An agent is about to draft a proposal and it already knows the account history, the pricing policy, the last QBR outcome, and the communication style the client prefers.

That is the product. A company that can query itself.

---

# THE THREE PILLARS

## Context — What the Company Knows

Everything the business knows about its clients, its relationships, its team, its processes, its decisions, and its preferences. Captured automatically from the tools the team already uses. Structured into a context graph. Compiled into constitution files that agents read before every action.

Context is not what is written in Notion or stored in the CRM. Context is the real picture — who actually communicates with which clients, which processes are actually running (not just documented), which relationships are healthy and which are cooling, what the team's actual working preferences are. The difference between the org chart and the communication network. The difference between the documented process and what actually happens.

## Decision — What the Company Chose and Why

Every significant choice made, with the reasoning behind it, by whom, at what point in time, with what context available — and crucially, what happened as a result.

**The why is the entire point.** A decision record without reasoning is just a log. A decision record with reasoning is institutional intelligence. The question Kautilyan answers that no other system answers: "Why did we do it this way?" Three months from now, six months from now, when that question comes up — the answer is in the system, not in someone's memory.

**The delta is the why made visible without anyone writing it down.** When an agent proposes a 15% discount and a human changes it to 12% with the note "competitive pressure, one-time exception" — that modification is a decision trace worth more than a hundred plain approvals. The difference between what the agent recommended and what the human chose, with the reasoning for the change, is the most valuable signal the system captures. This is the write path: capturing judgment at the moment it is exercised, not reconstructing it retrospectively.

Decision subtypes: `approval` (from approval gate), `policy` (standing rule), `strategic` (significant directional choice), `operational` (day-to-day judgment call).

## Action — What the Company and Its Agents Did

Everything done in service of the company's goals — whether by a person or by the system itself. Actions are not just human tasks. They include:

- A person sending a client email
- An agent drafting and sending a proposal after approval
- A cron job running the weekly renewal review playbook
- The system creating an alert when a relationship threshold is crossed
- An agent assigning a task to a team member
- A workflow executing a multi-step onboarding sequence
- The system pushing an artifact to Google Drive

Every action carries a full audit trail: who or what performed it, when, what it was linked to (decision, account, process), what the outcome was, and what context existed at the time. Actions are the observable outputs of the system. Decisions are the reasoning behind them. Context is what informed them.

The compounding loop: Context informs Decision. Decision produces Action. Action generates new Context. The system gets smarter with every turn of the loop.

---

# THE LEARNING LOOP — HOW THE COMPANY GETS SMARTER

The Learning Loop is what separates Kautilyan from a tool that captures data and a platform that compounds intelligence. Without the Learning Loop, the system is sophisticated storage. With it, every action the company takes makes future actions better.

## What Triggers Learning

Four categories of signals feed the Learning Loop continuously from Day 1:

**1. Approval modifications (the delta)**
Every time a human modifies an agent-proposed action — changing a discount, rewording a proposal, adjusting a timeline — the modification and its reasoning are captured. These deltas accumulate into patterns: the company consistently approves at 12% not 15%, the company consistently modifies proposals to include a specific clause, the company consistently rejects a certain type of recommendation.

**2. Alert dismissals with reasons**
Every time a user dismisses an alert and explains why — "already handled offline," "not actually at risk," "wrong account" — that reason is a signal. Nine dismissals with the same reason means the threshold is wrong for this context. The system learns what is genuinely urgent vs noise.

**3. Process deviations**
Every time a recurring process runs differently from its documented SOP — a step skipped, a step added, steps reordered — the deviation is logged. Three consistent deviations in the same direction means the SOP may be wrong, or a better approach has emerged. The system notices.

**4. Positive outcome deviations**
When someone does something differently from the standard approach and achieves a materially better outcome — a renewal email sent Tuesday morning gets 78% response vs 34% team average — the system detects the correlation and surfaces it.

## How Learning Accumulates — Three Stages

**Light Stage (continuous, invisible)**
Every signal goes into a staging buffer. No action is taken yet. The system is observing and accumulating. Users do not see this happening. There is nothing to approve or reject at this stage. The buffer is filling.

**REM Stage (nightly batch, process_mining_worker)**
The nightly process mining worker analyses the accumulated signals:
- Groups signals by type, direction, entity type, and time window
- Counts instances in 30/60/90 day windows
- Checks consistency: what percentage of instances point in the same direction?
- Checks outcome correlation: does this pattern correlate with a measurable result?

If a pattern meets the threshold (minimum 5 instances, 80% consistency): a hypothesis candidate is generated. The hypothesis includes: what was observed, how many times, over what period, with what confidence, and links to the specific underlying records — not just a conclusion but the evidence that produced it.

If a pattern is directional but below threshold (3+ instances, 80% consistency): marked as "watch." It will surface when the threshold is met.

**Deep Stage (Decision Digest + human governance)**
Every Monday morning, the Decision Digest delivers the week's significant decisions, the patterns detected, and the hypothesis candidates — each with its evidence — to the relevant approvers. The human reviews the evidence, not just the conclusion. They can approve, dismiss, modify, or defer.

Governance levels determine what happens when a hypothesis is approved:

**Level 1 — Auto-apply silently (low-stakes, reversible):**
Alert urgency ranking adjustments, notification timing preferences, draft style calibrations. Applied immediately without requiring human action. Logged but not surfaced. Reversible at any time from Settings.

**Level 2 — Propose for approval in Digest (significant, governed):**
SOP changes, policy threshold updates, workflow routing changes, approval authority adjustments. These appear in the Digest with evidence. Human approves, dismisses, or modifies. Nothing changes until a human explicitly acts.

**Level 3 — Never auto-apply (governance-critical):**
Approval authority limits, compliance rules, pricing authority, external communication policies. These require deliberate action in Settings regardless of how many instances support the change or how high the confidence is. No data accumulation unlocks auto-application.

## What Gets Updated When a Hypothesis Is Approved

This is where learning propagates into the system. On approval of a Level 2 hypothesis:

1. **processes.md updated:** The relevant SOP section is rewritten to reflect the new best practice. Version incremented. Previous version preserved. Diff shown for admin review.

2. **Playbook version incremented:** Any playbook that implements the updated process is updated to reflect the new steps. Existing runs in progress are not affected. All new runs use the updated version.

3. **Agent constitution refreshed:** The relevant constitution file sections that agents read before acting are updated. The next agent call for the affected entity type will reflect the improvement.

4. **Skill prompt updated:** If the learning affects a specific skill (e.g., the `email_draft` skill now knows to recommend Tuesday morning for renewal outreach), the skill's system prompt is updated.

5. **decisions.md updated:** If the learning produces a new standing policy, it is added to decisions.md. All future agents will read this policy before proposing related actions.

6. **Governance action logged:** Who approved the change, what changed, what evidence it was derived from, when it was applied. Permanent and auditable.

The result: a pattern that emerged from how the team actually worked has become the new standard. No meeting was held. No retrospective was run. No documentation session was scheduled. One person reviewed the evidence and clicked approve. The system applied the improvement everywhere it is relevant. Every future action in that context is better.

## How Learning Prevents Compounding Bad Data

The risk with automated learning is compounding errors. The system that learns from bad patterns institutionalises bad practices. Three mechanisms prevent this:

**Evidence transparency:** Every hypothesis shows the specific records it was derived from. The human reviewing it can inspect the underlying approvals, dismissals, or process traces. A bad pattern caused by a data error will show unusual underlying records that a reviewer will catch.

**Confidence threshold:** 5 instances and 80% consistency is not a low bar. A coincidental run of 3-4 similar events does not produce a hypothesis. The threshold filters out noise.

**Human gate at Level 2:** No significant change to SOPs, workflows, or policies happens without a human explicitly approving it. The system proposes. The human decides.

---

# EXTERNAL REFERENCES AND DESIGN INFLUENCES

The following sources directly influenced specific design decisions in Kautilyan. Each is credited with what it informed and where that influence is applied. Ideas were adapted, not copied.

**Trilogy AI — Task-graph orchestration**
*"Why Your AI Agents Skip Steps — and How Task Graphs Prevent It"*
Informed: dependency-aware execution, evidence-bearing step completion, blocked as a first-class state, graph inspection over polling rather than status polling. Applied in: the orchestration model, execution envelope design, Flow Builder and Playbooks.

**OpenClaw — Dreaming and agent architecture**
*docs.openclaw.ai/concepts/dreaming*
Informed: staged memory consolidation (Light/REM/Deep stages), threshold-based promotion, the principle of previewing and explaining before applying durable changes, opt-in background consolidation, workspace-level vs individual-level context separation. Also influenced the agent permission model and multi-workspace architecture. Applied in: the Learning Loop (Part above), constitution file governance, workspace isolation design.

**LibreChat — Chat-first agent interface**
*librechat.ai*
Informed: how non-technical users interact with AI in a conversation-first paradigm, multi-channel message threading, the practical UX of connecting multiple AI providers in a single interface, and the challenge of maintaining context across sessions without native memory. Applied in: the Chat surface design, multi-channel architecture (Chat + Telegram + WhatsApp as equal first-class channels), and the decision to build context into the agent rather than relying on conversation history alone.

**Andrej Karpathy — llm-wiki and Software 2.0**
*gist.github.com/karpathy/442a6bf555914893e9891c11519de94f*
Informed: raw sources → compiled memory → schema as three-layer architecture, Ingest/Query/Lint as named operating loops, append-only log for traceability, distinction between query-time RAG and incrementally maintained compiled knowledge. Also informed the broader concept of software systems that accumulate knowledge over time rather than retrieve it on demand. Applied in: constitution files architecture, Memory Agent design, the system landscape.

**Alex Hormozi — Grand Slam Offer and Value Equation**
*$100M Offers*
Informed: the offer structure (dream outcome × likelihood of achievement / time delay × effort and sacrifice), the guarantee design, the bonus stack as a conversion mechanism, the principle that the offer must maximise perceived value before pricing is introduced. Applied in: the entire commercial motion — Stage 0 through Stage 3, the bonus stack, the guarantee structure.

**Rob Fitzpatrick — The Mom Test**
*The Mom Test: How to talk to customers and learn if your business is a good idea when everyone is lying to you*
Informed: the Stage 0 question design. Questions ask about past behaviour, not future intent. "Tell me about the last time..." not "would you ever...". Questions extract evidence of pain, not validation of hypotheses. Applied in: the six Stage 0 questions, the mandatory Q5 follow-up to surface a specific named situation.

**Jaya Gupta — The Write Path and Trillion-Dollar Loop**
Informed: the insight that to capture decision traces, you must be present when the decision is being made — not after. B2B has never had a write path system. The reasoning behind transactions (why a client was given a discount, why a product decision was made) has never been systematically captured. Applied in: the approval gate design, the decision delta as the primary capture mechanism, the positioning of Kautilyan at the moment of judgment rather than retrospectively.

**Jack Dorsey — Intelligence System Framing**
Informed: the ideal company as an intelligence system where every artifact is a signal, every person can query the whole, and the system evolves by learning from decisions. The role evolution as the system matures: people shift from doing and remembering to deciding and directing. Applied in: the north star product vision, the role-specific positioning, the long-term compounding moat narrative.

---

# POSITIONING — WHO THIS IS FOR AND WHAT IT CHANGES

## The One-Line Position

**Build a company that remembers — and makes every person in it more effective.**

## What Kautilyan Changes

For the individual: instead of spending 40% of their week on context-gathering, briefing preparation, and re-explaining what was already decided — they spend that time on the work that requires their judgment. The system handles the memory and the retrieval. The person handles the decision.

For the team: instead of tribal knowledge that walks out the door when someone leaves, the company accumulates operating intelligence that stays and compounds. Every new person starts with the full context of every person before them.

For the organisation: instead of growing linearly — one person's knowledge at a time — the company grows compoundingly. Each person who joins gets smarter faster. Each decision made improves the next one. Each process run makes the next run better.

## The Two Audiences — Protection and Amplification

**For bootstrapped and profitable founders — Revenue Protection and Exit Readiness:**

"You have built ₹3-5 Crore in annual revenue. You carry most of how it works in your head — the client relationships, the pricing decisions, the escalation logic, the team context. Right now, three things are true simultaneously:

One: if you want to take a real vacation, you cannot. Two weeks away and the team is messaging you for context they should be able to find themselves.

Two: you hired a Head of CS six months ago. She is still briefed before every client call. You are paying ₹4 lakh a month for someone operating at half their potential because your institutional context is not accessible to her.

Three: if you ever want to sell this company or bring on a partner, the valuation takes a hit because the operating logic lives in you, not in a system. Buyers discount for founder dependency.

Kautilyan captures how your company actually operates — from your emails, meetings, decisions, and approvals — and makes that operating logic accessible to your team. Your Head of CS now has everything she needs. Your team operates without your daily involvement. And your company's value is in the system, not in you personally."

**For Series A and funded founders — Institutional Scalability:**

"Your investors gave you capital to build a company that scales. Scaling means the company gets better as it grows — not just bigger. But right now, every new hire takes 3 months to become effective. Every decision gets relitigated because the context behind the last decision was never captured. Every AI tool your team uses produces generic outputs because it has no access to how your company actually works.

Kautilyan is the operating intelligence layer that makes your company scale correctly. New hires are effective in weeks. Decisions are made with full context of what was decided before. Your AI tools know your clients, your policies, and your processes — because Kautilyan gives them that knowledge. And your board can see a legible operating model instead of having to ask you what happens if you get hit by a bus."

## What We Never Say in a First Conversation

"AI transformation." "Digital soul." "Operating infrastructure." "Organisational memory and execution platform." "Knowledge management." These are either internal language or category labels that trigger scepticism rather than curiosity. Use the specific situations. Use the specific pain. Use the specific outcome.

## The Hook for Each Role

**Founder / CEO:** "Stop being the backup brain for your company. Every question your team cannot answer without you is context you are personally carrying — and that cannot scale."

**Head of CS / Revenue Lead:** "Know your clients better than the person who built the company. Every conversation starts with complete context. You are never the person who missed a signal."

**Engineering / Technical Lead:** "Your architectural decisions stop being re-explained to every new engineer. Ask why something was built this way and get the full reasoning, not 'I think that was decided before I joined.'"

**Operations / Delivery Lead:** "Your processes get better every time they run. Not because someone wrote a retrospective — because the system detected what worked, proposed it as standard, and you approved it."

**New hire:** "Be effective in 18 days, not 3 months. Everything your predecessor knew is accessible. You do not have to shadow anyone."

---

# TRIGGER EVENTS — HOW TO FIND THE RIGHT BUYERS AT THE RIGHT MOMENT

## Why Trigger Events Matter

The best time to sell Kautilyan is when the pain is fresh. A founder whose key person just left and took three years of client context with them is not evaluating this rationally — they are in pain. A founder who is preparing for Series A and the board asked "what happens if you leave?" is urgently looking for an answer. Trigger events identify companies in that state.

## The Triggers and How to Find Them

**Trigger 1: First senior non-founding hire, last 6-9 months, underperforming expectations**
What it looks like: a founder posts "excited to welcome [Name] as our new Head of CS / VP Sales / Head of Operations." They might post an intro thread about the hire. 6-9 months later, if the role is not working as expected, the founder starts posting about "scaling challenges" or "building the right team."
How to find it: LinkedIn job change alerts for target companies (set up on company pages you follow). Congratulations posts on LinkedIn. Filter: joined as VP / Head / Director level at a company with 20-100 employees in the last 6-9 months.
The hook: "Quick question — how does [Name] know what you know about your top clients? What does she have access to that doesn't require asking you?"

**Trigger 2: Key person recently resigned or departed, last 1-6 months**
What it looks like: a former senior employee updates their LinkedIn to "Open to Work" or announces a new role. The company posts a "hiring for [same role]" job description.
How to find it: Google Alerts set on "[company name] is hiring [role]." LinkedIn "open to work" filter on people who work at target companies. Job postings on Naukri, LinkedIn Jobs filtered by company.
The hook: "When [Name] left, what happened to everything they knew about your clients and your operating processes? Is that knowledge recoverable?"

**Trigger 3: Rapid hiring pace — 3+ hires in last 90 days**
What it looks like: multiple "we're hiring" posts, multiple "welcome to the team" posts in a short window, 3+ open roles simultaneously on job boards.
How to find it: LinkedIn company page activity (filter by "posts"). Naukri/LinkedIn Jobs filtered by company with multiple active postings. Founders posting about team growth.
The hook: "You have brought on [N] people in the last 3 months. How long before each of them is operating independently without needing you in the room?"

**Trigger 4: First institutional investor just joined**
What it looks like: press release, TechCrunch India / Inc42 / YourStory article, founder post announcing the round, Crunchbase update.
How to find it: Inc42 and YourStory funding round alerts. Crunchbase Pro alerts for Indian B2B companies raising Series A. LinkedIn posts tagged with #funded or #seriesA from target founders.
The hook: "Your investors are going to want to understand how your company operates independent of you. That is a standard Series A ask. Do you have a clear answer to that question yet?"

**Trigger 5: Preparing for Series A, need to show operational legibility**
What it looks like: founders attending Series A focused events, posts about "fundraising learnings," posts about "what investors ask," AngelList or LinkedIn activity showing investor conversations.
How to find it: startup community events in Bangalore (iSPIRT, YourStory, specific accelerator events). LinkedIn posts from founders in the "preparing to raise" phase. Warm intros from investors who see portfolio companies in this state.
The hook: "Make your company legible before your investors ask. Every significant decision logged, every process documented from how you actually operate, every client relationship mapped — the operating model your board wants to see."

**Trigger 6: Missed renewal or client churn traceable to a knowledge gap**
What it looks like: a founder mentions a client loss, a difficult renewal, or a relationship that "fell through the cracks." Usually shared informally in community conversations or as a lesson-learned post.
How to find it: community Slack groups (founder communities in Bangalore), WhatsApp groups, LinkedIn posts where founders share a loss or learning.
The hook: "How do you make sure that never happens again? Not by working harder — by making sure the signals are visible before the relationship breaks."

**Trigger 7: Board asked "what happens if [key person] leaves?"**
What it looks like: founders discuss this in community settings, often as a concern about their next board meeting or a recent investor question.
How to find it: community conversations, warm network, direct inquiry in the Stage 0 conversation (Q6 often surfaces this).
The hook: Direct — "We help you answer that question with data, not with 'we have good people.'"

**The GTM Autoresearch Protocol before any outreach:**
Before sending a single LinkedIn message: build four LLM personas (Series A founder, bootstrapped profitable founder, pre-Series A founder, sceptical founder). Run four message variants against all four personas. Score each on a 0-4 rubric (0 = reject, 4 = asks for a meeting). A variant is ready when it scores 3+ across 2+ of 4 personas with no persona below 2 including the sceptic. Only then does real outreach begin.

---

# THE ENTRY MOTION

## The Entry Motion Statement

**"We show you where your company is fragile and where your team is operating below their potential — in 72 hours. Then we fix the highest-value problem first."**

This is the entry motion. Two components:

**"Where your company is fragile"** — the protection angle. At-risk relationships, undocumented processes, knowledge concentrated in one person, decisions that will get relitigated.

**"Where your team is operating below their potential"** — the amplification angle. Context that is not accessible. Briefings that consume founder time unnecessarily. New hires that take 3 months to become useful. AI tools that produce generic outputs because they have no company-specific knowledge.

**"Then we fix the highest-value problem first"** — the how is the Discovery Report. The report is the diagnosis. After the report, "highest-value" is not a guess — it is visible in the data. The workstream recommendation follows directly from what the report found: ghost relationships → WS1, 71% founder involvement → WS2, 4 undocumented critical processes → WS3.

## Two Steps

**Stage 0:** Knowledge Drain Diagnosis — quantify the pain in rupees from their own numbers.

**Stage 1:** Discovery and Intelligence Report — show exactly where and how using their own data.

The pilot workstream is selected after Stage 1 based on what the report reveals. The buyer hears one sentence: "Based on what we found, this is the highest-value place to start." They do not see a menu. They get a recommendation.

---

# THE GRAND SLAM OFFER

## The Core Promise

**"In 45 days, the highest-value problem identified in your Discovery Report is fixed — measurably, with before-and-after evidence. Guaranteed or full refund."**

This is not a feature promise. This is a business outcome guarantee tied to a specific workstream selected from real data. The guarantee is honest because the workstream is not a guess — it is a diagnosis.

## The Offer Stack

**Stage 0 — Knowledge Drain Diagnosis (Free, 45 minutes)**

What they get:
- A 45-minute structured conversation using six questions designed to surface specific, named situations — not abstract concerns
- Live calculation of their monthly knowledge drain cost using their own numbers
- The Knowledge Drain Score Card: a physical one-page artefact with their rupee number, calculated in the session, specific enough to show their co-founder or board

The value even if they never buy anything: a founder walks out of 45 minutes knowing exactly how much their company is leaking every month, in a document they can use. This is enough value to make the session worth their time regardless of what follows.

---

**Stage 1 — Discovery and Intelligence Report (₹25,000 | credited against annual)**

What they get (standard — single Google account connected):
- Six-section Discovery Report covering: relationship health map, at-risk relationships, recurring meetings and process patterns, process library (what runs and what is undocumented), team communication analysis, knowledge drain risk score
- Personal 60-minute session with Harsha to walk through the findings — not a sales presentation, a genuine reading of their company's operating reality
- The Score Card cost credited against this

What they get (bonus — org-level access, multiple accounts connected):
- Team Communication Network Report: the 6-month analysis showing who actually manages which client relationships, founder dependency by account, single points of failure, communication network centrality. Management consultants charge ₹20-30 lakh for this analysis. Generated in 72 hours.
- Visual Communication Network Map: an actual network diagram showing who connects to whom, colour-coded for relationship strength. Something they can put on the wall and show their board.
- Process Archaeology Report: for processes that exist but have never been documented — first-draft SOPs generated from the observed patterns. "You have been running a QBR process every quarter for 18 months. Here is the first draft we wrote from observing 6 instances. Is this accurate?"
- Ghost Relationships Map: client accounts with zero active relationship owner in the last 60 days, visualised. "These accounts are invisible to your team right now."

The conviction to buy must be established in the Stage 1 session — not at Day 45. By the end of this session, the buyer must believe the outcome is achievable because they can see the problem in their own data. Day 45 is operationalisation and evidence. The conviction comes here.

---

**Stage 2 — 45-Day Pilot (₹75,000 | credited against annual)**

What they get:
- One selected workstream configured for their specific situation
- 90-minute Week 1 onboarding session: baseline metrics set, system configured, team connected
- Weekly 30-minute check-ins for 5 weeks
- Written Day 45 outcome report: before-and-after metrics, named evidence, workstream performance against the guarantee
- All Stage 1 + Stage 2 spend (₹1,00,000) credited against the annual contract

The pilot is not a proof of concept. The proof of concept is the Discovery Report. The pilot is the first 45 days of the product working inside their specific context.

---

**Stage 3 — Annual Contract (₹20-30 lakh/year)**

What they are buying: the compounding intelligence their company has been building for 45 days — and cannot afford to lose.

By Day 45, the workspace contains: 45 days of decision traces, calibrated alert thresholds tuned to their specific context, a context graph built from their actual relationships, SOPs generated from their actual patterns, and constitution files that make every agent call company-specific rather than generic. Leaving means losing all of this and starting fresh elsewhere with zero accumulated intelligence. The switching cost is the product of their own data.

Pricing:
- ₹20 lakh/year: up to 25 people, standard integrations, quarterly business reviews
- ₹25 lakh/year: up to 50 people, additional integrations, monthly business reviews
- ₹30 lakh/year: up to 100 people, all integrations, Experiment framework access, monthly reviews

---

**Stage 4 — Expansion (₹5-10 lakh additional/year)**

Additional seats, integrations, Experiment framework, training. Natural expansion as context graph value grows with usage and switching cost compounds.

---

## The ROI Framing — Payback Period, Not Percentages

Never claim a specific percentage capture rate. "We recover 50% of your knowledge drain" is a made-up number and sophisticated founders know it.

Instead: payback period and named outcomes.

"Your knowledge drain is approximately ₹8 lakh per month. Kautilyan costs ₹20 lakh per year. If we catch one at-risk renewal that you did not see coming, the software pays for itself. If we fix 25% of the identified problem, it pays for itself in 10 weeks."

Then after the pilot: named evidence. Not percentages. Specific accounts, specific decisions, specific outcomes. "We protected ₹18 lakh in renewals in the first 45 days. The annual contract is ₹20 lakh. The software has paid for itself."

---

# THE STAGE 0 SCRIPT — SIX QUESTIONS

Mom Test principles throughout: ask about past behaviour, not future intent. Ask for specific situations, not general concerns.

**Q1:** "Tell me about the last senior person you hired in the last 12 months. How long did it take them to start handling their responsibilities independently — without you in the room?"

Listen for: time to independence, what briefing was required, whether they are still dependent.

**Q2:** "Think about the last senior person who left your company. When they left, what happened to what they knew — about clients, about how things were done, about decisions that had been made?"

Listen for: specific knowledge lost, time to recover, whether it is recoverable at all.

**Q3:** "In a typical week, how many times do people come to you for context that should be self-service — 'what did we agree with client X,' 'what is our policy on Y'?"

Listen for: the number, the types of questions, the emotional weight of being the backup brain.

**Q4:** "Tell me about the last time something fell through the cracks because it lived in someone's head rather than somewhere accessible."

Listen for: specific incidents, the cost of the incident, whose head it lived in.

**Q5 (mandatory follow-up after Q4):** "What was the specific client or situation?"

This is the question that sells Stage 1. The rupee number closes Stage 0. The named situation is what the prospect will think about for the next 72 hours. "Priya at Northwind, the renewal that almost slipped." "The CTO who took the architecture context when he left." Always surface a specific situation. Use their words.

**Q6:** "If you could fix one thing about how knowledge and context flow in your company — the one thing that would make the biggest difference — what would it be?"

Listen for: the self-diagnosed solution. This tells you which workstream to recommend before the Discovery Report is even run.

**After the six questions:**

Calculate the Knowledge Drain Cost live using their numbers. Show the calculation. Write the total on the Score Card. Hand it to them.

**The Stage 0 close:**
"Your company is leaking approximately ₹X lakh per month. Would you like to see exactly where this is happening — specifically with [the named situation from Q5]? We can generate a full picture from your Google Workspace in 72 hours. ₹25,000, credited against any engagement."

---

# PILOT WORKSTREAM CATALOG

## The Selection Principle

The Discovery Report tells us where the company is fragile. The buyer hears one recommendation: "Based on what we found, this is the highest-value place to start." They do not see a catalog. The catalog is internal.

**Selection rule:** Choose WS1 when the primary pain is named revenue at risk. Choose WS2 when the primary pain is the founder as the routing layer. Choose WS3 when the primary pain is undocumented processes creating a single point of failure. When two are true, choose where the measurement is cleaner in 45 days.

**Active catalog: 3 workstreams.** WS4 and WS5 are future — not offered until after 90+ days of platform use when context is rich enough to measure them.

---

## Workstream 1 — Revenue Leak Plugging

**When to select:** Discovery Report shows ghost relationships, unanswered proposals, at-risk accounts with no follow-up, champion silence, renewal approaching with no active engagement.

**Pilot promise:** By Day 45, every revenue-critical relationship flagged in the Discovery Report will have an owner, an action taken, and a visible outcome trail.

**Opening line:** "Your Discovery Report flagged [N] accounts where revenue is at risk and nothing is being done about it yet. That is the highest-value place to start."

**Baseline metrics (set Week 1, reviewed Day 45):**

| Metric | Measurement method | Baseline | Target |
|---|---|---|---|
| At-risk accounts surfaced | Discovery Report count | [N] | 100% actioned within 7 days |
| Unanswered follow-ups > 14 days | Gmail metadata scan | [N] | Reduce to 0 |
| Ghost relationships — no active owner | Contact ownership analysis | [N] | All assigned, reactivated, or closed |
| Founder involvement in revenue threads | Gmail metadata: % with founder address | [N]% | Reduce by 50% |
| Revenue protected | Named accounts × ARR | ₹0 | ₹X lakh (specific accounts) |

**Day 45 report:** Named evidence per account. What happened. Was the relationship recovered. What the intervention was worth in rupees.

---

## Workstream 2 — Founder Dependency Reduction

**When to select:** Discovery Report shows high founder involvement in client communications, senior hire underperforming, or concentration of decisions flowing through the founder.

**Pilot promise:** By Day 45, measurable reduction in founder involvement with named examples of decisions or conversations handled without founder intervention.

**Opening line:** "Your Discovery Report shows [N]% of client communications involve you directly. [Person] has been in the role for [N] months and still needs you in the room. We fix the context transfer problem in 45 days."

**Baseline metrics (set Week 1, reviewed Day 45):**

| Metric | Measurement method | Available from | Baseline | Target |
|---|---|---|---|---|
| Founder thread participation rate | Gmail metadata: % external emails with founder address | Day 1 | [N]% | Reduce by 40%+ |
| Founder meeting attendance | Calendar: % recurring external meetings with founder | Day 1 | [N]% | Reduce by 50% |
| Approval routing without founder | Approval system: % decisions resolved without founder | Week 2 | [N]% | Increase to 70%+ |
| Self-service context queries | Chat logs: queries answered without founder involvement | Week 1 | [N]/week | Increase 5x+ |

**Named evidence requirement:** At least 2 specific examples — with dates and account names — of decisions or client interactions handled by the team without founder involvement.

**Day 45 report:** Side-by-side comparison of all four metrics Week 1 vs Day 45. Named examples. "Priya handled the Northwind renewal conversation independently on [date] — first time this happened without founder involvement."

---

## Workstream 3 — Process Legibility and SOP Capture

**When to select:** Discovery Report shows undocumented processes, compliance pressure, enterprise client requiring SOPs, rapid hiring where onboarding is breaking, recurring processes owned by one person's memory.

**Pilot promise:** By Day 45, every critical process selected for the pilot will be documented, assigned, and operationally usable by someone other than the person who previously carried it in memory.

**Opening line:** "Your Discovery Report found [N] processes running with no documentation. [Specific process] has run [N] times in the last 6 months and is owned by one person. We document it, assign a backup owner, and make sure it never breaks because of a single departure."

**Baseline metrics (set Week 1, reviewed Day 45):**

| Metric | Baseline | Target |
|---|---|---|
| Undocumented processes identified | [N from report] | All converted to reviewed SOPs |
| SOP drafts generated and approved | 0 | [N] approved by Day 30 |
| Process owners with backup assigned | [N]% | 100% |
| Skipped-step frequency | [N]% of runs | Below [threshold]% |
| New hire time to process independence | [N] days | Reduce 50% |

**Day 45 report:** Before and after on all five metrics. First evidence of the documented process being used by someone other than the original owner.

---

## Workstream 4 — AI Context Layer (Future — Not Currently Offered)

Moved to future catalog. The metric "grounded AI outputs" is too hard to isolate in 45 days — cannot cleanly separate Kautilyan's impact from the underlying AI tools. The first three workstreams build the context infrastructure that makes this workstream possible. Activate after 90+ days when the context graph is rich.

---

## Workstream 5 — Product and Roadmap Intelligence (Future — Not Currently Offered)

Requires accumulated decision traces and client signals. Not honest to offer as a Day 1 pilot. Activate for Year 1 customers who have the history.

---

# WHAT THE BUYER HEARS VS WHAT HAPPENS INTERNALLY

| | What the buyer hears | What happens internally |
|---|---|---|
| After Stage 0 | "Here is how much your knowledge drain is costing you" | We identify which trigger event brought them in and which workstream the pain maps to |
| After Stage 1 | "Here is exactly where your company is fragile" | We select the workstream from what the report found |
| At Stage 2 kickoff | "Based on what we found, this is the highest-value place to start" | We configure the pilot for the selected workstream |
| At Day 45 | "Here is what changed — specific accounts, specific decisions, specific rupee values" | We present the outcome report and convert to annual |

---

# PART 1 — THE PROBLEM AND WHY IT HAS NEVER BEEN SOLVED

## The Problem

Businesses run on knowledge that lives in people's heads, WhatsApp threads, email chains, and meetings that were never documented. When people leave, the knowledge leaves. When teams grow, the founder becomes the bottleneck. Every decision gets relitigated because nobody recorded why it was made the first time. Every new hire takes three to four months to become useful because context cannot be transferred — it can only be shadowed.

Enterprise software has never solved this:
- CRMs record transactions. Not the reasoning behind them.
- Wikis store documents. That nobody reads and nobody updates.
- Project tools track tasks. Not the context behind the decisions that created those tasks.
- AI copilots generate content. From generic models that know nothing specific about the company.

None capture the reasoning layer — why a decision was made, who made it, what context existed at the time, and what happened as a result. That reasoning layer is what makes a company operate the way it does. And it has never been captured systematically.

**The statistic that anchors the problem:** 70-90% of operational decisions are never formally written down. 79% of organisations have adopted AI agents but only 34% have achieved full-scale implementation — because the context gap means generic AI cannot access the specific, unwritten memory of the organisation. Knowledge workers spend 58% of their time on "work about work" — status updates, context-gathering, re-explaining what was already decided.

## The Infrastructure Analogy

The ERP was how businesses captured financial transactions. Every business above a certain size eventually needed one — not because it was fashionable but because managing financial complexity without it became impossible.

The CRM was how businesses captured customer relationships. Eventually, every business needed one — not because consultants recommended it but because losing track of customer history at scale was too costly.

Kautilyan is how businesses capture the reasoning layer — the decisions, the context, and the operating logic that makes everything else work. Every business that grows past 30-40 people will eventually need this layer. The ones that build it intentionally will compound intelligence over time. The ones that do not will restart from scratch every time a key person leaves.

This is not a prediction about AI adoption. It is a prediction about organisational complexity. As companies grow, the cost of not having this layer grows faster than the cost of building it.

---

# PART 2 — HOW CONTEXT IS CAPTURED AND KEPT CURRENT

## The Capture Mechanisms

Kautilyan captures operating intelligence from four mechanisms simultaneously. The system does not require people to manually update anything. It captures from how the team already works.

**Mechanism 1 — Passive capture from integrations (automatic, continuous)**

From Gmail (metadata only by default — email bodies are never read without explicit action):
- Who emailed whom, when, subject line, thread ID
- Thread response time (how quickly each party replies)
- Unanswered thread detection (last message from the org side, no reply for N days)
- Email volume patterns per external domain (weekly rolling average)
- New external domain detection (potential new account)

Full email body is accessed only on demand — when an agent needs to summarise a specific conversation for a brief or a context retrieval.

From Google Calendar:
- Event title, start time, attendees, recurrence pattern
- External attendee detection (non-org email domains)
- Meeting type classification from attendee mix and title patterns
- Missed meeting detection (declined or cancelled last-minute)

From Jira / Linear / ClickUp:
- Issue title, type, status, priority, assignee, labels
- Status change timestamps, time in each status
- Comment count, last activity

From Slack / Teams (pattern data only, no message content without explicit opt-in):
- Who messages whom (relationship graph, not content)
- Response time patterns between specific people
- Channel activity levels

**Update frequency:**
- `last_contacted_at` on Contact and Account: real-time on each integration event
- Account health score: recalculated daily at midnight, plus triggered immediately on critical signals
- Context graph edges: triggered when a new signal implies a relationship change
- Constitution files: clients.md nightly, team.md on team change events, others per governance rules

**Mechanism 2 — Decision checkpoints at approval gates (at every significant action)**

Every time the system proposes an action and a human approves, modifies, or rejects it:
- Agent proposal captured: what was recommended
- Human decision captured: what was chosen
- Delta captured: the difference between the two
- Reasoning captured: the one-line note the human provides explaining why

This is the write path. The delta IS the decision. The reasoning note IS the institutional intelligence. Captured at the moment of judgment, not reconstructed later.

**Mechanism 3 — Explicit decision logging from Chat (on demand)**

When someone types a decision statement in Chat ("We have decided to offer Northwind a 12% renewal discount, not 15%), the agent classifies it and prompts: "Should I log this as a decision?" One tap. The full message becomes the reasoning field. The linked entity (Northwind) is auto-detected and linked.

**Mechanism 4 — Cross-source aggregation (normalised event stream)**

All integration events are normalised into a standard event schema: source, actor (Person), entity affected, event type, timestamp, and metadata. All events flow into the activity_log in normalised form. Agents query this normalised stream, not individual integration APIs. The UI renders a unified timeline with channel badges.

## How Context Flows Across the Organisation

**The proposed-not-confirmed principle**

The system never silently treats inferred data as confirmed fact. Everything the system infers from integrations is proposed for human confirmation before it becomes authoritative.

When Gmail metadata detects a new external domain (e.g., `acme-systems.com`) with 3+ emails in 30 days:
1. System proposes: "I found 3 emails with acme-systems.com. Should I create an Account called Acme Systems and a Contact for the sender?"
2. Admin confirms with one click
3. All three previous emails are retroactively linked to the new entities

When a new sender appears at a known domain (e.g., `maya@northwind.com` where only `alex@northwind.com` was known):
1. Northwind Account identified from domain
2. System proposes: "New sender at Northwind: maya@northwind.com. Should I create a Contact for Maya? What is her role?"
3. Admin adds role, Contact created, retrospective linking applied

Target: 80% of entity classifications correct on first pass. 20% require human correction — one tap or one word.

**Who can see what**

Scope is a first-class property of every entity:

`individual` — creator only. Personal preferences, private notes, individual constitution files.
`team` — all members of a specific Team. Team SOPs, shared client context within a function.
`org` — all workspace members. Company identity, org-wide policies, all Account and Contact records.

RBAC enforces scope at database row level via RLS:
- Owner: full access to everything
- Admin: read/write org + team scope. Can configure integrations, approve SOPs, manage policies.
- Moderator: can view team activity, assign tasks, publish team-level SOPs
- Member: read org + their team, write individual scope. Default for all team members.
- Viewer: read org scope only. For board members, investors, contractors.

**How context stays current**

The contact freshness system runs nightly:
- Updates `last_contacted_at`, `last_inbound_at`, `waiting_for_response` for all Contacts from Gmail metadata
- Recomputes Account health scores from relationship signals
- Flags Contacts or Accounts that have not been updated in 30+ days as potentially stale

The constitution_lint job runs nightly:
- Scans all constitution files for contradictions (same entity, conflicting facts)
- Scans for staleness (claims older than 90 days with no corroborating recent data)
- Surfaces potential issues for admin review — never silently resolves contradictions

**How conflicts are resolved**

When new context contradicts existing context about the same entity (Malaysia Express ARR was ₹22 lakh in the approval record, but ₹16 lakh appears in a renewal email), the Memory Agent flags the contradiction for human resolution rather than silently overwriting. The admin sees both values, their sources, and selects the correct one. Both the original and the correction are preserved in the entity audit log.

Manually entered data is never auto-overwritten. If an admin manually set Malaysia Express's ARR to ₹18 lakh, the system will not overwrite it even if an email suggests a different number. It will flag the discrepancy and ask.

## The Template Library

Templates are reusable document structures — proposals, project plans, status reports, QBR decks, onboarding SOPs, outcome reports — that the system fills with company-specific context on demand.

**What a template is:** A structured document shell with variables that the agent substitutes from the context graph, constitution files, and user input at generation time. Not a static document. A context-aware document that produces different output for Northwind vs Malaysia Express vs DHL Freight — because the context is different.

**Template types:**
- Document: Word-compatible (.docx) — proposals, project plans, SOPs, reports
- Spreadsheet: Excel-compatible (.xlsx) — pilot tracking, budget templates, metric snapshots
- Presentation: PowerPoint-compatible (.pptx) — QBR decks, board updates, onboarding decks
- Report: PDF — Discovery Report, Day 45 outcome report, weekly status report

**How templates work:**
1. Admin creates a template with named variables: `{{account_name}}`, `{{renewal_date}}`, `{{arr}}`, `{{open_items}}`, `{{last_qbr_date}}`
2. Template stored in the Template Library with scope: `team` or `org`
3. User requests: "Generate the Q2 renewal proposal for Northwind"
4. Agent identifies the template (renewal_proposal_template), assembles context for Northwind from the context graph, substitutes variables
5. User reviews the generated document, modifies if needed, approves
6. Document pushed to Drive (in Northwind/Proposals/ folder), shared as link, or downloaded

**Templates the system ships with (seeded at workspace setup):**
- Renewal proposal
- QBR deck
- New client onboarding plan
- Weekly status report
- Day 45 pilot outcome report
- Knowledge Drain Score Card
- Discovery Report

**Template governance:**
Same governance as SOPs — version controlled, admin approves changes, previous versions preserved. Templates linked to the process they belong to: the "Renewal Proposal" template is linked to the "Renewal Outreach" SOP.

**Storage:**
Templates stored as artifacts in the artifact_templates table. Generated instances stored as standard artifacts, linked to the account and session that created them.

---

# PART 3 — THE ENTITY MODEL

## Core Entities

**PERSON**
Any human actor in or around the business.
Subtypes: `team_member`, `client_contact`, `partner_contact`, `vendor_contact`, `board_member`, `investor`, `advisor`
Key fields: name, email, role, designation, reports_to (→ Person), teams (→ Team[]), accounts_owned (→ Account[]), communication_preference, timezone, working_hours

**ORGANISATION**
The company itself. One per workspace.
Key fields: name, industry, business_model, description, website, size_range, primary_channel, founding_year

**TEAM**
Named functional grouping within Organisation.
Key fields: name, function_type, lead (→ Person), members (→ Person[]), parent_team (→ Team)

**ACCOUNT**
Any external entity the organisation has a relationship with.
Subtypes: `client`, `partner`, `vendor`, `investor`, `competitor`, `prospect`
Key fields: name, type, industry, health_score (0-100), relationship_stage, owner (→ Person), priority, last_contacted_at, next_followup_at, waiting_for_response (computed), requires_followup (computed), renewal_date, contract_value, arr, tier

**CONTACT**
Specific Person at an Account.
Key fields: name, email, role_at_account, account (→ Account), relationship_owner (→ Person), last_contacted_at, last_interaction_channel, interaction_count, response_pattern, sentiment, influence_level (champion/user/blocker/economic_buyer), last_inbound_at

**MEETING**
A specific meeting or call.
Key fields: title, start_time, end_time, attendees (→ Person[]), type, notes, outcomes (→ Decision[]), linked_account (→ Account), follow_up_actions (→ Action[])

**DECISION**
A choice made with full reasoning. The core entity of the system.
Subtypes: `approval`, `policy`, `strategic`, `operational`
Key fields: type, made_by (→ Person), made_at, reasoning, linked_entities, outcome, channel_source, importance_score (1-10), has_delta (boolean), agent_proposal (JSONB), human_modification (JSONB), modification_note
The reasoning field is mandatory. A decision without reasoning is not logged — it is an event. Reasoning is what makes it institutional intelligence.

**ACTION**
Anything done by any actor — person or agent or system — that changes the state of the world.
Subtypes: `email_sent`, `task_created`, `document_generated`, `api_call`, `calendar_event_created`, `approval_granted`, `approval_rejected`, `message_sent`, `record_updated`, `call_made`, `meeting_scheduled`, `playbook_run`, `alert_created`, `artifact_generated`, `sop_updated`, `policy_applied`
Key fields: type, performed_by (→ Person or Agent or System), performed_at, status, triggered_by_decision (→ Decision), linked_entities, channel, evidence (what changed as a result)

Note: Actions are performed by people, agents, and the system itself. A cron job running a playbook is an Action. An agent sending an email after approval is an Action. The system creating an alert is an Action. All actions carry the same audit trail regardless of who or what performed them.

**PROCESS / SOP**
Documented recurring workflow. Aspirational version of how work should be done.
Key fields: name, trigger, owner (→ Person), frequency, steps (ordered list), success_criteria, linked_workflows (→ Workflow[]), version, last_reviewed_at, drift_status (on_track/drifting/critical)

**WORKFLOW**
Executable automation. Operational implementation of a Process.
Key fields: name, process (→ Process), trigger_type, trigger_config, steps (WorkflowStep[]), owner_agent (→ Agent), approval_required_from (→ Person[]), status, run_history

**SIGNAL**
Raw observation from integration or threshold crossing. Input to the observer engine.
Key fields: type, source (→ Integration), raw_value, threshold_crossed, severity, created_at, produced_alerts (→ Alert[])

**ALERT**
System's interpretation of a Signal into something actionable. Output of the observer engine.
Key fields: title, body, urgency (low/medium/high/critical), linked_signals, linked_entities, recommended_action, status (new/acknowledged/actioned/dismissed/resolved), delivered_via

**ARTIFACT**
Any document or file generated or stored by the system.
Key fields: type, content_or_url, linked_entities, linked_session, run_id, share_token, drive_url, version, status (draft/generated/awaiting_review/approved/shared/archived)

**TEMPLATE**
A reusable document structure with variables for context substitution.
Key fields: name, type (document/spreadsheet/presentation/report), template_body, variables (JSONB), linked_process (→ Process), scope, version, owner

**AGENT**
AI agent with defined domain, skills, and permission scope.
Key fields: name, domain, constitution_files_read (which files this agent reads), skills (→ Skill[]), permission_scope, parent_agent (→ Agent), status

**SKILL**
Reusable capability unit that Agents invoke.
Key fields: name, description, system_prompt, input_schema, output_schema, tools_used (→ Tool[]), version, model_preference

**INTEGRATION**
Configured connection to external data source or tool.
Key fields: name, type, status, auth_type, scopes_granted, sync_frequency, last_synced_at, field_mappings (JSONB)

## Vertical Extensions

**B2B SaaS adds:** `Subscription`, `Expansion Opportunity`, `Churn Risk`, `QBR`, `Support Ticket`
**D2C / E-commerce adds:** `Product`, `Order`, `Customer (D2C)`, `Campaign`, `Return`
**WMS / Operations adds:** `Warehouse`, `Zone`, `SKU`, `Putaway Rule`, `Task Strategy`
**Custom Entity Builder:** Any workspace can define custom entity types via metadata JSONB and custom_entity_definitions table. No code changes required.

---

# PART 4 — STANDARDISED TERMINOLOGY

| Correct Term | Do Not Use | Context |
|---|---|---|
| Person | User (except auth) | Any human actor |
| Organisation | Org (shorthand only) | The business entity |
| Workspace | Organisation | Technical Supabase container |
| Account | Client (too narrow) | External entity with a relationship |
| Contact | Client Contact | Specific human at an Account |
| Workflow | Flow, Automation | Executable process |
| Process / SOP | Procedure | Documented process description |
| Signal | Trigger, Event | Raw observation from integration |
| Alert | Notification, Warning | System's interpretation of signals |
| Delta | Difference, Change | Modification between agent proposal and human choice |
| Constitution file | Config file, Settings | Compiled context files served to agents |
| Pilot | Trial, Test | Commercial 45-day engagement |
| Template | Form, Shell | Reusable document with variables |

---

# PART 5 — CONSTITUTION FILES

## What They Are

Constitution files are human-readable summaries of the underlying structured data. Not the data store — a compiled translation layer between the SQL database and AI agents. Agents do not query the database directly. They read the relevant sections of constitution files that have been assembled for their specific task.

Think of them as the wiki the company has always needed but never maintained — because maintenance is automatic.

## Seven Org-Level Files

**org.md** — Who the company is. Business description, what they do, who they serve, business model, values, primary communication channel. Written once by admin. Updated manually only.

**team.md** — Who does what. Every team member with role, domain ownership, reporting line, communication preference, authority level, working hours. Auto-regenerated on any team change event.

**clients.md** — What the company knows about each client. One section per active Account: health status, key contacts, open items, recent decisions, renewal timeline, risk flags. Auto-regenerated nightly from the context graph and Gmail metadata.

**processes.md** — How the company does recurring work. Every approved SOP with steps, owner, frequency, version, and drift status. Updated when an Experiment confirms improvement and admin approves.

**decisions.md** — Standing policies and governance rules. Approval thresholds, pricing authority, external communication rules. Manual update only. Flagged for review every 90 days. Agents always read this before proposing significant actions.

**signals.md** — What to watch for. Observer rule configurations, alert thresholds, notification routing. Updated when the Learning Loop proposes threshold recalibration and admin approves.

**preferences.md** — How this workspace likes to work. Brief format, notification style, communication preferences. Level 1 (auto-calibrate silently for low-risk changes), Level 2 (propose for approval for significant changes).

## Five Individual Files Per Team Member

**SOUL.md** — What this person cares about and why they are here. Role, core responsibilities, what success looks like for them.

**IDENTITY.md** — How this person operates. Communication style, decision-making approach, working style preferences.

**USER.md** — Practical context. Working hours, timezone, preferred channels, notification preferences.

**HEARTBEAT.md** — Current state. Active accounts, current priorities, pending items, what this person is focused on this week. Updated from activity.

**AGENTS.md** — Rules for how agents should behave on this person's behalf. What they can do autonomously, what requires approval, what they should never do.

## How Agents Use Constitution Files

When an agent is about to act, the context assembly function runs:

1. Identifies the task type (email_draft, meeting_brief, process_retrieval, etc.)
2. Selects relevant constitution file sections based on task type and linked entities
3. Assembles context within a 500-1,500 token budget (trimmed by recency and relevance)
4. Prepends assembled context to the agent prompt

Example for an email draft to Northwind:
- Loads: clients.md → Northwind section (current health, open items, renewal date)
- Loads: decisions.md → email approval policy, pricing policy
- Loads: user/preferences.md → Riya's communication style, preferred format
- Loads: user/HEARTBEAT.md → Riya's current priorities

The output reflects org knowledge + personal style. Neither layer overrides the other completely.

## Version Control and Governance

Every constitution file update creates a new version. Previous version preserved. Changes shown as a diff for admin review. Admin can revert to any previous version.

Nothing is ever deleted. Archival only: status = 'archived'. A decision made and later reversed is more valuable than either alone — the reversal shows the system learned something.

---

# PART 6 — AGENT ORCHESTRATION

## The Agent Model

Agents in Kautilyan are not general-purpose AI assistants. They are specialised actors with defined domains, skill sets, and permission scopes. Every agent reads a specific set of constitution file sections and has access to a specific set of tools. The main agent coordinates; specialised agents and skills execute.

**Main Agent:** Receives user intent, classifies it, assembles context, and routes to:
- A **Skill** for synchronous, single-step capabilities (email_draft, context_retrieval, decision_classifier)
- A **Sub-agent** for async, multi-step complex tasks (Discovery Report generation, relationship analysis, BRD generation)
- An **Approval Gate** for any action that modifies something outside the Kautilyan workspace

**Skills:** Reusable, versioned capability units. Each skill has a defined system prompt, input schema, output schema, and model preference. Skills are the building blocks. Agents call skills; users experience the results.

**Sub-agents:** Spawned by the main agent for complex tasks that require multiple steps, multiple data sources, or significant compute time. The user sees a progress indicator, not the sub-agent's work.

**Cron jobs:** Scheduled agents that run automatically. The proactive intelligence layer.

| Cron Job | Schedule | What it does |
|---|---|---|
| morning_brief | Daily at user's configured time | Assembles overnight activity, calendar, alerts, pending approvals into a personalised brief |
| observer_poll | Every 15-30 minutes | Evaluates integration signals against configured thresholds, creates alerts |
| contact_freshness | Nightly 2am | Updates last_contacted_at, last_inbound_at, waiting_for_response for all contacts |
| process_mining_worker | Nightly 3am | Groups signals, detects patterns, generates hypothesis candidates |
| decision_digest | Weekly (Sunday 10pm, delivers Monday 8am) | Compiles significant decisions, patterns, and recommendations into the Digest |
| constitution_lint | Nightly 2:30am | Scans constitution files for contradictions and staleness |
| process_reminders | Configurable | Sends reminders for scheduled processes |

## The Approval Gate

Every significant action — sending an external email, modifying a policy, updating a shared document, assigning a task to another team member — passes through an approval gate before execution.

**What the approval gate captures:**
- `agent_proposal`: what the agent recommended, in structured JSON
- `human_modification`: what the human chose, if different from the proposal
- `modification_note`: the one-line reason the human provides
- `has_delta`: boolean — was anything changed?
- `status`: pending / approved / approved_with_modification / rejected / expired (7 days)

**When an approval is modified:**
A database trigger fires on tool_approval_requests when status changes to approved and has_delta is true. This trigger immediately creates a Decision record: type: approval, made_by: the approving human, agent_proposal: the original recommendation, human_modification: what was chosen, modification_note: the reasoning. The Decision record is linked to the relevant Account, Process, and session.

This is the write path in action. The delta IS the institutional intelligence. Captured without anyone having to remember to log it.

## The Execution Model

Every non-trivial request gets a `run_id` assigned at the moment it begins. Every step in the execution generates a `step_id` linked to the run. All steps are logged to activity_log with their outcome.

Supabase Edge Functions are the single orchestration runtime and data authority. Dev-proxy is compute-only — it executes steps and writes results back to Supabase. The orchestrator inspects the execution graph; it does not poll workers.

A step can be in one of these states: `pending`, `running`, `completed`, `failed`, `blocked` (waiting on a dependency), `waiting_for_approval`, `skipped`, `cancelled`.

`blocked` is a first-class state — not an error, not a timeout. It means a dependency has not been met. The system surfaces blocked steps explicitly and explains what is needed to unblock.

---

# PART 7 — DISCOVERY ENGINE AND PROCESS INTELLIGENCE

## Cold Start — How the System Builds Context from Day 1

The Discovery Engine runs on initial setup to solve the day-one value problem. Before any interactions have been captured, the system analyses historical data from connected integrations.

**Scope constraints (first run):**
- Last 6 months of Gmail metadata
- Connected user's account only initially
- Drive: documents modified in last 90 days with SOP-like titles
- Minimum: 3+ emails to a domain to qualify as a meaningful relationship

**What is derived from one connected account (the founder):**
- Communication network: who emails whom, how often, response times
- Client relationship ownership: who actually handles which accounts (not the org chart)
- Founder dependency by account: what percentage of client communications involve the founder
- Single points of failure: accounts where only one person has communicated in 30 days
- Silent accounts: accounts active 6 months ago that have gone quiet
- Process patterns: recurring calendar events that suggest undocumented processes

Management consultants charge ₹20-30 lakh for this analysis. It takes them weeks. Kautilyan generates it in 24 hours from one Google account.

## Messy Workspace Protocol

A messy Google Workspace is the best sales asset. If the scan finds zero documented processes and 400 orphaned threads, the Discovery Report becomes a mirror the founder cannot look away from.

But a report generated from genuinely bad data destroys trust. If the scan returns below threshold data — fewer than 30 unique external domains, fewer than 60 days of email history, fewer than 10 recurring calendar events with external attendees — flag this within 24 hours:

"We scanned your workspace and found less data than typical. Here is what we found: [summary]. Common reasons: [shared inboxes, communication primarily on WhatsApp/Slack, personal Gmail used for work, connected account is not the primary communication account]. Your options: [connect additional team accounts / forward recent email threads to a Discovery Folder / proceed with a note about data scope / cancel with full refund]."

Never generate a misleading report. An honest "we need more data" is worth more than a thin report.

## As-Is Process Intelligence and BRD Generation (C6 — Phase 3)

**What it does:** Connects to existing tools, observes how work actually happens, generates a structured BRD or As-Is process map for human review and refinement.

**The approach:**
1. Ingest: emails, existing SOPs, docs, Jira tickets, Git (for code-based processes), calendar patterns
2. Analyse: identify key processes, participants, frequency, deviations from stated procedures
3. Generate: FRD/BRD documents for human review
4. Improve: on feedback, refine until accurate
5. Output: structured documents humans can understand and act on

**Coverage:** Kautilyan covers 80-85% of the understanding needed to write a BRD — the process intelligence layer: what process runs, how often, who is involved, where it deviates, and what the implicit requirements are.

**The remaining 15-20%:** Screen-level UI capture — how a specific screen works, button flows, field validations. This is handled by tools like Guidde or Guideflow. These are complementary, not competing. Kautilyan provides the process context (what the UI is serving and why). Screen recording tools provide the execution detail (how to use the UI to do it). Together: complete process documentation.

**Phase:** Phase 3. The integration layer, sub-agent model, and artifact generation infrastructure are built for WS1-WS3. C6 packages these into a named deliverable for a different buyer context — transformation leads, ops leads, founders planning process redesign.

---

# PART 8 — THE DECISION DIGEST

## What It Is

A weekly one-page summary of decisions made, patterns detected, and one or two improvement recommendations. Delivered every Monday morning. The most important product moment for converting a pilot to an annual contract.

## Structure

**Section 1 — Decisions this week:** Five to ten significant decisions with type, maker, reasoning summary, and importance score. Linked to the underlying records.

**Section 2 — Pattern detected:** The highest-significance pattern from accumulated signals. Includes: what was observed, how many instances, over what period, confidence level, and links to the specific underlying records. The human can inspect the evidence before acting.

**Section 3 — Recommendation:** One proposed change — to a policy, SOP, or workflow — derived from the pattern. Evidence in plain language. One-click: [Approve] [Dismiss] [Modify] [Discuss first].

**Section 4 — Pending from last week:** Any proposals still awaiting action.

## The Evidence Requirement

Every pattern surfaced in the Digest must link to specific evidence records. "8 instances detected" is not enough — the Digest must show which 8 instances, with dates and linked entities. This is what allows the human reviewer to spot a bad pattern before approving a bad policy.

---

# PART 9 — ADOPTION DASHBOARD

## Three Views

**Founder / CEO:** Company Knowledge Health Score (1-100). Below 40: underused. 40-70: working. Above 70: compounding. Plus: DAU, decisions logged this week, context graph growth rate, at-risk accounts surfaced and actioned, founder dependency metric trend.

**Team Lead:** Who is active, what they are doing, who has not logged in, Champion badge for highest-usage member. Public within team.

**Individual:** Decisions logged, context added, actions taken, comparison to team average. Streak mechanic — consistent usage builds a streak visible to the user.

---

# PART 10 — INTEGRATION ARCHITECTURE

## MCP-First Where Available

Use existing MCP servers (Google Workspace, GitHub, Jira, Slack, Notion, Linear, Salesforce partial) rather than building custom integrations. For tools without MCP: build custom Edge Functions normalising events to the standard event schema → activity_log.

## Real-Time vs Batch

`last_contacted_at` updates: real-time (webhook or polling every 5 minutes where webhooks are unavailable). Alerts for at-risk accounts must not be 12-24 hours stale — real-time is required.

Account health score: recalculated daily at midnight plus triggered immediately on critical signals.

Constitution files: clients.md nightly. team.md on team change events.

## Token Cost Architecture

Primary model: Gemini 2.0 Flash for 85-90% of all tasks.
Routing: Gemini Flash for morning briefs, email drafts, context enrichment, observer alerts, standard chat. Gemini Pro or Claude Sonnet for complex reasoning, decision classification, Digest compilation, BRD generation.

Estimated cost per customer per month: ₹1,000-2,000 at typical usage. Gross margin at ₹24 lakh/year pricing: 95%+.

## Schema Registry

A data dictionary mapping all connected sources — not just internal Supabase tables but external integrated systems (Shopify, HubSpot, Jira, SAP). Agents always query against the Schema Registry — never free-form SQL against an unknown schema. This prevents hallucinated field names and incorrect joins. Critical correctness guarantee for a system making business decisions.

---

# PART 11 — POSITIONING BY STAKEHOLDER

## The Value Equations — Five Levels

**Level 1 — Emotional (first contact):**
"Build a company that remembers."
"Stop being the backup brain for your company."
"Every question your team cannot answer without you is context you are personally carrying — and that cannot scale."

**Level 2 — Problem Recognition (Stage 0, their numbers):**
"You spent ₹40 lakh hiring a Head of CS. She is six months in and still briefed before every client call. That is ₹20 lakh in salary for someone operating at half their potential."
"Your last senior hire left and took 18 months of client context. How long did it take the replacement to rebuild it? Multiply that by their monthly cost."
"You answer 'what did we decide about X' 15-20 times per week. At your opportunity cost: ₹2-3 lakh per month of founder time on retrievable information."

**Level 3 — Solution Proof (Stage 1, their actual data):**
"In the last 6 months, you have had 47 conversations with Northwind. The last one was 18 days ago and has had no reply. Kautilyan found this."
"73% of your client emails involve you directly. If you are unavailable for one week, 8 of your 11 active accounts have no active owner."

**Level 4 — ROI (pilot to annual):**
Named outcomes. Not percentages.
"In 45 days: 3 at-risk accounts flagged and actioned. 2 renewals protected — ₹24 lakh ARR. Founder involvement in client calls: 12 per week to 4 per week. The annual contract is ₹24 lakh. The renewals we protected in the first 45 days paid for the year."

**Level 5 — Strategic Moat (Series A):**
"Every decision logged, every approval processed, every agent modification captured — these compound into institutional intelligence that a better model or a faster competitor cannot replicate. The company that has been running Kautilyan for 18 months has a fundamentally different quality of institutional memory than one starting fresh. That gap grows every week."

---

# PART 12 — DATA QUALITY AND ACCURACY

## The Risk and the Response

A system that learns from patterns can compound errors. If the learning loop promotes a bad pattern to policy, it institutionalises a bad practice. Three mechanisms address this.

**Proposed-not-confirmed:** The system never treats inferred data as authoritative. Everything inferred is proposed for human confirmation. 80% correct on first pass; 20% requires human correction — one tap.

**Evidence transparency in the Digest:** Every hypothesis links to specific underlying records. The human reviews the evidence, not just the conclusion. A bad pattern shows unusual underlying records.

**Governance gates:** Level 2 changes (SOPs, policies, thresholds) require explicit human approval. Level 3 changes (approval authority, compliance rules) require deliberate Settings action regardless of data support.

## Anti-Hallucination Architecture

Agents query against the Schema Registry — never free-form SQL. Field names and join conditions are always validated before execution. This prevents hallucinated field names and data fabrication in query results.

Every LLM output that makes a factual claim about the company (a brief, a decision summary, a pattern description) includes the source reference — which constitution file section, which activity_log entry, which decision record. Claims without sources are flagged as inferred.

---

# PART 13 — COMPETITIVE LANDSCAPE

## The Category

"Organisational Memory and Execution Platform" is internal language. In customer conversations: "the system that captures how your company actually operates and makes that operating logic accessible to everyone." In investor conversations: Decision Intelligence meets AI Execution, designed for the Indian mid-market.

## Direct Competitors

**Interloom ($16.5M seed, March 2026, London/Munich):** "Forever Memory" — extracts operational expertise from emails, tickets, call transcripts into decision traces. Gap: large enterprise only (Zurich Insurance-scale). Not built for 30-100 person Indian B2B. Retrospective extraction only — not at the write path.

**ReMemora (pre-seed, stealth):** "Collaborative Memory Infrastructure." Gap: concept-stage, no customers, no product shipped.

**WorkDone.ai (mid-market):** "Expertise Capture" — observes how work happens vs how managers think it does. Gap: manufacturing and US market focus. Heavy consulting overlay. Not self-serve.

**Coworker.ai ($16.5M seed, May 2025):** Operator-driven agents. GTM/outbound focus. Gap: execution-focused (doing work) not memory-focused (capturing reasoning). No decision trace as first-class entity.

## Adjacent Players

**Kogo.ai (~$3M, Bengaluru):** Execution-focused autonomous agents. Gap: Kogo automates work. Kautilyan captures why work was done the way it was. Kogo is doing. Kautilyan is knowing and learning.

**Lyzr, Dify:** Developer infrastructure. Not business-user facing. No decision memory.

## Kyra — Complement, Not Competitor

Kyra is a runtime AI agent governance platform. Intercepts every AI agent tool call and enforces organisational policies before execution.

Kautilyan's question: what context should the agent act on, and what happened as a result?
Kyra's question: is the agent allowed to do this?

These are orthogonal. The integration story: Kautilyan provides the intelligence. Kyra provides the governance. For regulated sector customers (financial services, healthcare), this combination is compelling. Explore formal integration when the first regulated sector customer is identified.

## Positioning Matrix

| | Generic AI | Kautilyan | Interloom | Kogo/Lyzr | Kyra |
|---|---|---|---|---|---|
| Primary goal | Drafting | Context + execution + learning | Memory capture | Execution | Governance |
| Decision capture | None | First-class entity with why | First-class entity | None | Audit trail only |
| Write path | None | At approval gates | Retrospective | None | Intercept only |
| Learning loop | None | Governed, compounding | None | None | None |
| Indian mid-market | Generic | Built specifically | Not targeted | Not targeted | Not targeted |

---

# PART 14 — PRIVACY AND COMPLIANCE

## Privacy — The One Sentence

"We access email metadata — who you emailed, when, and the subject line — never email body content. You can see exactly what we access in Settings, and you can revoke access in 30 seconds from Google."

One sentence. No qualifications. No caveats. The Settings page shows the exact OAuth scopes granted in plain language. A live "what we can see" view is accessible at any time.

## Data Normalization Reality

Goal: minimal manual entry, not zero. 80% of entity classifications correct on first pass from auto-detection. 20% require human correction — one tap per entity.

Opinionated data model: force messy customer data into the standard schema (Account, Contact, Decision, Process). Do not let customers build custom objects in Year 1. The LLM layer maps their chaotic external labels into the standard schema. An opinionated schema is what allows agents to reason reliably.

## India DPDP Act

The Digital Personal Data Protection Act applies. Requirements: clear consent (handled by OAuth flow), purpose limitation (metadata only, purpose stated), data deletion mechanism (workspace deletion removes all workspace data), designated Data Fiduciary contact. Achievable without significant engineering overhead.

## GDPR

Not an immediate priority for the current ICP — Indian B2B companies. Comply when a specific contract requires it as a condition of purchase.

---

# PART 15 — FEATURE DISCIPLINE

## What Must Exist Before the First Paying Pilot

Test for every candidate feature: "Does this directly enable a pilot workstream to deliver measurable results in 45 days?"

**Must exist before first WS1 pilot:**
- Google OAuth with explicit scope explanation
- Gmail metadata scan (6-month initial, nightly thereafter)
- Account and Contact entity creation from scan results
- Observer rules: account cooling threshold alerts
- Alert delivery: Today page + Telegram/WhatsApp
- Draft and send: email draft with account context, approval gate, Gmail send
- Pilot baseline form: 5 metrics recorded in Week 1
- Adoption dashboard: basic — which users active, alerts actioned vs dismissed

**Must exist before WS2 pilot:**
- All WS1 items
- Thread participation rate extraction (Gmail metadata → % with founder address)
- Calendar attendance extraction (% meetings with founder)
- Approval routing metric tracking (% resolved without founder)
- Context retrieval via Chat with account and decision data

**Must exist before WS3 pilot:**
- All WS1 items
- Process entity in context graph
- SOP draft generation from Process Archaeology findings
- Process Library in Knowledge page
- Process run trace for drift detection

**Phase 2 (after first pilots):**
Decision Digest (activate Week 3 of pilot — requires data accumulation), full constitution file compilation, learning loop auto-hypothesis

**Phase 3 (months 3-6):**
Experiment/Eval framework, full process mining, predictive capabilities (churn prediction, single point of failure alerts), Template Library full implementation

**Phase 4 (months 6+):**
As-Is Process Intelligence / BRD Generation (C6), Schema Registry full implementation, vertical extensions, Entity Builder

**Defer indefinitely (until a contract requires it):**
Microsoft 365, GDPR formal certification, permissioned inference

---

# PART 16 — IMPLEMENTATION PRIORITY

## Priority 1 — Enables Stage 0 and Stage 1 (Weeks 1-3)

Stage 0: no product needed. Structured conversation + Score Card.
Stage 1: Discovery Report generator including the Communication Network Analysis. 3-4 days of engineering work. Start the commercial motion immediately.

## Priority 2 — Makes Stage 2 Pilot Reliable (Weeks 3-6)

Today page with real data. Morning brief automatic. Approval flow with delta capture. Basic adoption dashboard. Observer rules for WS1. Email draft with account context. Alert delivery.

## Priority 3 — Converts Pilot to Annual (Weeks 6-10)

Decision Digest basic version (activate at Week 3 of pilot). Stakeholder Pulse with automated follow-up. These two features close pilot-to-annual conversion.

## Priority 4 — Expansion and Higher Contracts (Months 3-6)

Constitution files full implementation. Experiment/Eval framework. Full process mining. Predictive capabilities. Template Library.

## Priority 5 — Phase 3 Capabilities (Months 6+)

C6 / BRD Generation. Schema Registry full. Vertical extensions. Advanced experiment framework.

## Immediate Next Steps (Before Building Anything More)

1. Get 3 founders to agree to a Stage 0 session this week
2. Manually run the metadata analysis on a friendly founder's inbox
3. Present a mockup of the Discovery Report — see if their eyes go wide
4. If they go wide: build the software that automates that specific report
5. Do not build more features until the first Stage 0 has happened and a founder has said "I did not know it was this bad"

---

# PART 17 — REVENUE AND COMMERCIAL TARGETS

## Revenue Path

**Customers 1-3 (now — month 4):** Friends, warm network, community. Stage 0 sessions this week. Stage 1 Reports ₹25,000 each. Convert to pilots. Convert to annuals ₹20-24 lakh. Target: ₹60-75 lakh ARR.

**Customers 4-15 (months 2-8):** Case studies + LinkedIn trigger event outreach. Annual contracts ₹20-30 lakh. Target: ₹2-3 Crore ARR.

**Customers 16-30 (months 8-18):** Inbound from case studies + direct Series A outreach. ₹24-36 lakh contracts. Target: ₹5.4-8.4 Crore ARR.

**Customers 31-42+ (months 18-24):** Expansion from existing customers + larger contracts ₹50-75 lakh for 100+ person companies. Target: ₹10+ Crore ARR.

**On the ₹10 Crore target:** Achievable at ₹24 lakh average across 42 customers. Likely underambitious — the right answer may be ₹25-30 Crore with fewer, larger customers at the 100-person tier. Revisit after first 5 pilots with real conversion rate and contract value data. Optimise for average contract value, not number of customers.

---

# PART 18 — OPEN ARCHITECTURE DECISIONS

1. **Microsoft 365:** Google-first. M365 post-first-10-customers. If asked: "Yes, on roadmap. Starting with Google because it covers 80% of our ICP."
2. **Domain-wide Gmail delegation:** Per-user primary. Domain-wide for Google Workspace Enterprise.
3. **Permissioned inference:** Post-first-10-customers.
4. **Worker service:** When any customer crosses 10,000 events/day.
5. **Kyra partnership:** Explore formal integration when first regulated sector customer is identified.
6. **Template Library formats:** docx, xlsx, pptx, pdf — prioritise by which formats first pilot customers actually request.
7. **Mobile app:** Do not build a native mobile app now. Architecture must be mobile-ready from Phase 0: API-first, channel-agnostic rendering, all workflows available via Telegram/WhatsApp. Native app is a future layer on top of an already-mobile-capable API.
8. **GraphQL customer API:** Phase 1 decision. Phase 0: build internal API typed and consistent. Phase 1: expose customer-facing GraphQL endpoint for context graph querying, workflow triggering, and artifact access. GraphQL preferred over REST because the context graph is inherently relational — customers need graph traversal, not flat resource endpoints.
9. **Multi-entity workspace:** Phase 1 architecture decision. Schema must support it from Phase 0 even if the management UI comes later. One workspace can contain multiple Organisations (holding company structure), each with isolated context, isolated constitution files, isolated team. Cross-entity reporting available to workspace owner only. Cross-entity context access requires explicit grant.
10. **E2B for code execution:** Use E2B (e2b.dev) for sandboxed execution of Python, JavaScript/Node, and general code. Do not build a sandboxed execution environment in-house — that is weeks of security infrastructure E2B has already solved. For Google Apps Script specifically: generate the script and deploy via Google Apps Script API (execution happens in Google's runtime, E2B is not involved). E2B is the standard choice — used by Lovable, Bolt, Cursor, Perplexity, and most AI-native builders.

---

# PART 19 — DYNAMIC UI AND INTERFACE ARCHITECTURE

## Dynamic UI as a Phase 0 Non-Negotiable

The interface is not a chatbot with text responses. It is an operating system with typed, interactive components rendered dynamically from agent output. This is non-negotiable from Phase 0 because every core product moment depends on it:

- The morning brief approval card (one-tap approve, not "type '1' to approve")
- The relationship health map (visual, filterable, clickable nodes — not a text table)
- The approval gate (inline editor, diff view, one-click approve/reject — not a message thread)
- The Context Explorer (visual graph with drag, filter, query — not a list of records)
- The Decision Digest (approve/dismiss/modify buttons on each recommendation — not a read-only report)
- The workflow builder (visual trigger-condition-action canvas — not a form)
- Generated artifacts (rendered preview with action buttons — not a download link)

**The architecture principle:** Agents always return typed structured JSON, never unstructured text strings. The rendering layer receives the JSON and renders the appropriate component for the current channel.

```
Agent output (JSON):
{
  "type": "approval_card",
  "proposal": { "action": "send_email", "to": "alex@northwind.com", "subject": "...", "body": "..." },
  "context": { "account": "Northwind", "arr": 1800000, "renewal_days": 38 },
  "actions": ["approve", "modify", "reject"],
  "expires_at": "2026-04-15T08:00:00Z"
}

Web Chat renders: → Full approval card with inline editor, diff view, and action buttons
Telegram renders: → Summarised text with numbered reply options + link to full web view
WhatsApp renders: → Same as Telegram
Today page renders: → Compact card in the attention queue
```

**The implementation approach:** AG-UI protocol for the agent-to-UI communication contract. CopilotKit's React UI components for the embedded agent experience in the web app (chat within context, not navigate to a separate chat page). All components in the Kautilyan design system are typed — the agent cannot return an unknown component type. New component types are added to the design system first, then the agent learns to use them.

## Omnichannel — One Agent, Multiple Rendering Layers

The same agent, the same intent, the same context — rendered differently per channel:

| Channel | Rendering capability | For complex actions |
|---|---|---|
| Web Chat | Full dynamic components, inline editing, rich previews | Native |
| Today page | Card-based, action buttons, no free-form input | Native |
| Telegram | Structured text, numbered options, inline keyboard buttons | CTA link to web |
| WhatsApp | Simplified text, numbered options | CTA link to web |
| Email notification | Summary text, single CTA button | Links to web |
| Inbound webhook | JSON response | API response |

The channel parity rule: any action available in web Chat is available in every channel — the format differs, the capability does not. If something cannot be done in Telegram format, a link to web Chat is provided. The user is never blocked.

---

# PART 20 — SURFACES AND USER INTERFACES

## The Six Primary Surfaces

**Today Page** — The morning briefing surface. Assembles overnight activity, pending approvals, calendar, and active alerts into a prioritised view. Resets daily. The "start your day" surface. Not a persistent queue.

**Unified Inbox** — The persistent attention surface. Everything requiring human response or action, always current, updated in real time. Includes: pending approvals (from any channel), unactioned alerts, @mentions not responded to, task overdue notifications, messages from Telegram/WhatsApp awaiting reply, external emails flagged for follow-up. Different from Today: the inbox does not reset. An unactioned approval from three days ago is still there until it is actioned or expired.

Priority logic: items in the inbox are ranked by urgency (HIGH alerts first), then time sensitivity (approval expiring soonest), then ARR value (highest-value account actions surface first). User can re-rank or snooze.

**Chat** — The conversation and command surface. Natural language interface to the full system. Renders dynamic components inline. Context-aware: the agent knows what entity the user is looking at and uses that as implicit context. Available embedded within any other surface (chat within the context of a specific account, a specific process, a specific workflow run).

**Context Explorer** — The knowledge graph visualisation and query surface. Two modes:

*Visual graph mode:* Nodes (Accounts, Contacts, Persons, Processes, Decisions) and edges (relationships) rendered as an interactive network graph. Filterable by entity type, date range, relationship type, health status. Clickable nodes open the entity detail panel. Searchable — type a name or query and matching nodes are highlighted. Zoomable. Shareable as a link (view-only snapshot).

*List/table mode:* The same context graph data in a sortable, filterable table. Export to CSV. Useful for audit, compliance, and data extraction.

*Query mode:* Natural language queries against the context graph. "Show me all accounts where the champion changed in the last 90 days." "Show me every decision we made about discounts in Q1." "Show me all processes owned by Priya." Results rendered as a list or graph view. Query history saved for reuse.

**Knowledge** — The library surface. Process Library (all approved SOPs), Template Library (all document templates), Constitution Files (admin-visible, version-controlled), Data Dictionary (Schema Registry user-facing view). Browsable, searchable, versioned.

**Live Ops / Observe** — The monitoring surface. Running workflows, recent runs with status, scheduled jobs, integration health, alert history, cron job last-run status. For admins and team leads. The workspace health view.

---

# PART 21 — WORKFLOW ENGINE

## The Complete Trigger Model

Every workflow in Kautilyan is a combination of: Trigger → Conditions → Steps → Actions → Output. This is the universal structure regardless of complexity.

### Trigger Types

**Time-based:**
- Cron: specific datetime expression (every Monday at 8am, first day of month at 9am)
- Interval: every N seconds / minutes / hours / days / weeks
- Scheduled: run once at a specific datetime

**Event-based (internal):**
- Entity state change: Account health drops below threshold, Contact goes silent, renewal date within N days
- Integration event: email received matching pattern, Jira ticket created with label, calendar event added
- System event: approval completed, SOP updated, new team member joined, workflow completed
- User action: user taps a button in the UI, user submits a form, user approves an artifact

**Event-based (external — inbound webhooks):**
- HTTP POST to a workspace-specific webhook endpoint
- Payload validated against a configured schema
- Any external system can trigger a Kautilyan workflow via webhook: client portal form submission, billing system event, ERP status change, IoT sensor reading
- Webhook receiver creates a Signal entity, which the observer engine evaluates against configured rules

**Threshold-based (KPI-triggered):**
- Metric falls below floor: renewal rate drops below 60%, NPS drops below 40
- Metric exceeds ceiling: response time exceeds 24 hours, error rate exceeds 5%
- Rate of change: metric declining more than 20% week-over-week
- Pattern threshold: same process step skipped 3 consecutive times, same decision type reversed twice in 6 months

**Dependency-based:**
- Run after another workflow completes (with or without condition on the result)
- Run only if a previous step succeeded (blocked state if dependency fails)
- Wait for human approval before continuing (approval gate as a workflow step)
- Wait for an external event (e.g., wait for a reply to a sent email before sending the follow-up)

### Conditions

Every trigger can have conditions that filter whether the workflow proceeds:
- Entity property conditions: Account.arr > 1000000, Contact.influence_level == "champion"
- Time conditions: only run on weekdays, only run during business hours
- Data conditions: previous step output contains specific value
- Existence conditions: only run if no existing open task for this account

### Steps

Each workflow step is one of:
- `agent_call`: invoke an agent or skill with specified inputs
- `action`: execute a tool (send email, create Jira ticket, push to Drive, post to Telegram)
- `approval`: pause and wait for human approval (creates tool_approval_requests record)
- `condition`: branch based on data (if/else)
- `loop`: iterate over a list (for each account in at-risk list, do X)
- `wait`: pause for duration or until condition
- `webhook`: call an external API endpoint
- `code`: execute a code snippet via E2B sandbox
- `transform`: reshape data from one step for use in the next

### The Natural Language Workflow Builder

Users describe what they want in plain language. The system creates the workflow.

User: "When a client visit report is submitted via WhatsApp, extract the key details, generate the solution note using the standard template, get my approval, and push it to the client's Drive folder."

System:
1. Classifies intent: workflow creation
2. Identifies: trigger (inbound WhatsApp message matching "site visit report" pattern), steps (extract → generate artifact → approval gate → Drive push)
3. Renders a visual workflow canvas showing the proposed workflow
4. User reviews, modifies if needed, activates
5. Workflow saved, versioned, runs automatically from that point

The NL workflow builder does not require the user to understand trigger types, step types, or API calls. They describe the outcome. The system produces the workflow. The user approves the structure.

### Workflow Testing and Sandbox

Before activating any workflow, users can test it with sample data in sandbox mode:
- Sandbox runs do not trigger real external actions (emails not sent, Drive files not created)
- Sandbox output shows exactly what would have happened with real data
- Edge cases can be tested by providing different sample inputs
- Sandbox results shown in Live Ops alongside production runs with a "sandbox" badge

---

# PART 22 — ARTIFACTS, SHARING, AND CONTENT MANAGEMENT

## Artifact Types

Kautilyan generates and manages four categories of artifacts:

**Document artifacts:** Word-compatible (.docx), PDF, Markdown. Generated from templates or from agent composition. Examples: renewal proposals, SOPs, project plans, outcome reports, meeting summaries, BRDs.

**Spreadsheet artifacts:** Excel-compatible (.xlsx), CSV. Generated from structured data queries, analysis runs, or template fills. Examples: pilot metric trackers, account health snapshots, capacity planning sheets, financial models.

**Presentation artifacts:** PowerPoint-compatible (.pptx). Generated from templates with agent-filled slides. Examples: QBR decks, board updates, onboarding presentations, pilot outcome presentations.

**Code artifacts:** Python scripts, JavaScript/Node, Apps Script, SQL queries. Generated by the coding agent. Executable via E2B (Python/JS) or Google Apps Script API (Apps Script). Examples: data analysis scripts, workflow automations, reporting scripts, integration connectors.

**Prototype artifacts:** HTML/CSS/JavaScript. Runnable in an iframe within Kautilyan and via a public share link. Generated by the coding agent for rapid UI prototyping. The share link renders the prototype directly — not the code, the working prototype.

## Sharing Model

Every artifact has a share token generated on creation. Sharing options:

**View-only link:** Anyone with the link can see the rendered artifact. No Kautilyan account required. Configurable expiry (never, 7 days, 30 days, custom).

**Comment link:** View + add comments. Requires the commenter to identify themselves (name + email, no Kautilyan account needed). Comments visible to the creator and anyone else with the link.

**Edit access:** Requires a Kautilyan account and explicit grant. Grantee can modify the artifact, their changes are versioned.

**Drive push:** One-click push to the linked Google Drive folder for the associated account. Future: SharePoint push (M365, Phase 2).

**Embed:** An embed code that renders the artifact in an iframe in any external page. Respects the same access controls as the view-only link.

**Runnable prototype:** For code artifacts of type `prototype`, the share link renders the working prototype directly. The viewer sees the prototype, not the code. There is a separate "view source" option for those with edit access.

## Content Review Workflow

Before any artifact is marked as approved and shareable externally:

1. **Draft:** Agent generates the artifact. Status: `draft`. Visible only to creator.
2. **Internal review:** Creator shares with team members for comment. Status: `under_review`. Internal links only.
3. **Revision:** Creator updates based on comments. Version incremented. Status: `draft`.
4. **Approval:** For artifacts requiring formal approval (proposals above a certain value, external-facing SOPs, board materials), the approval gate fires. Status: `awaiting_approval`.
5. **Approved:** Approver signs off. Status: `approved`. External share links can now be generated.
6. **Shared:** External link generated. Status: `shared`. Recipient access logged.
7. **Archived:** Superseded by a new version. Status: `archived`. Accessible but not active.

## RBAC for Artifacts

Artifact visibility follows the same scope model as all entities:
- `individual`: creator only
- `team`: creator's team members
- `org`: all workspace members
- `external`: anyone with the share link (requires explicit share action)

Artifacts linked to an Account inherit the Account's visibility by default. A proposal for Northwind is `org` scope by default — all team members can see it. The creator can restrict to `individual` or `team` if needed.

---

# PART 23 — AGENT CATALOG AND ORCHESTRATION

## The Agent Architecture

Kautilyan's agent model has four layers:

**Layer 1 — Main Orchestrator:** The single entry point for all user requests. Receives intent, classifies it, assembles context, and routes to the appropriate Layer 2 agent or Layer 3 skill. Maintains state across a multi-step run. Handles partial failures (which steps succeeded, which failed, what to retry). One orchestrator per workspace session.

**Layer 2 — Domain Agents:** Specialised agents with a defined domain, specific constitution files they read, and specific skills they call. Each domain agent is a first-class entity with its own permission scope and tool access.

**Layer 3 — Skills:** Reusable, stateless capability units. Called by domain agents. Return typed structured output. Versioned — breaking changes require a new skill version.

**Layer 4 — Tools:** External capabilities. API calls, integration read/writes, code execution via E2B, file system operations. Tools are called by skills. Every tool call is logged with its inputs, outputs, and latency.

## How the Orchestrator Decides

```
User intent arrives
  ↓
Intent classification (Gemini Flash, <500ms)
  → context_retrieval: route to Context Agent
  → draft_communication: route to Communication Agent
  → workflow_creation: route to Workflow Agent
  → analysis_request: route to Analysis Agent
  → code_generation: route to Coding Agent
  → process_mapping: route to BRD Agent
  → multi_step_complex: spawn relevant agents in sequence with dependency graph
  ↓
Context assembly (const files + context graph, 500-1500 token budget)
  ↓
Domain Agent receives: intent + assembled context + run_id
  ↓
Agent calls relevant skills
  ↓
Skills call relevant tools
  ↓
Results returned up the chain
  ↓
Approval gate (if required per decisions.md)
  ↓
Output delivered to originating channel as typed JSON
  ↓
Rendering layer converts JSON to channel-appropriate component
  ↓
Result logged to activity_log with run_id, step_ids, evidence
```

## Named Domain Agents

**Context Agent:** Retrieves and synthesises company knowledge. Reads: clients.md, processes.md, decisions.md. Skills: context_retrieval, meeting_brief, relationship_analysis, pattern_retrieval.

**Communication Agent:** Drafts and sends communications. Reads: clients.md, preferences.md, decisions.md. Skills: email_draft, message_compose, proposal_generator, meeting_summary. Requires approval gate for external sends.

**Workflow Agent:** Creates, modifies, and runs workflows. Reads: processes.md, signals.md. Skills: workflow_creation_from_nl, playbook_runner, trigger_configurator. Requires admin approval for new workflow activation.

**Analysis Agent:** Analyses data from integrations and the context graph. Reads: schema registry, clients.md. Skills: kpi_query, trend_analysis, cohort_analysis. Spawns Coding Agent for complex analyses requiring code execution.

**Coding Agent:** Writes, executes, and iterates on code. Reads: schema registry, relevant process context. Skills: code_generation, e2b_executor, apps_script_deployer, code_reviewer. All code executions sandboxed via E2B. Output returned as code artifact (reviewable and shareable).

**BRD Agent (Phase 3):** Generates As-Is process maps and BRDs from existing tools. Reads: schema registry, processes.md. Skills: process_mapping, brd_generator, gap_identifier.

**Discovery Agent:** Generates Discovery Reports from connected integrations. Reads: schema registry, org.md. Skills: email_network_analysis, process_archaeology, ghost_relationship_detector.

**Coordination Agent:** Tracks commitments and ensures follow-through. Reads: clients.md, team.md. Skills: commitment_tracker, overdue_detector, escalation_router, followup_drafter. Runs proactively — does not wait for user requests.

**Optimisation Agent:** Surfaces resource and priority recommendations. Reads: clients.md, team.md, processes.md. Skills: account_prioritiser, capacity_analyser, project_planner, renewal_scheduler. Produces recommendations in the morning brief and Digest.

**Forecasting Agent:** Models scenarios and surfaces risks/opportunities. Reads: clients.md, decisions.md, external signals. Skills: pipeline_modeller, churn_predictor, expansion_detector, scenario_simulator. Produces weekly forecasts in the Digest.

## Pre-Built Agent Personas (Out-of-the-Box)

These are configured instances of domain agents with specific contexts and purposes:

**End User Reviewer:** Before an external communication is sent, this agent simulates how the recipient would read it — based on the Contact's known communication preferences, relationship history, sentiment signals, and cultural context. Output: "As Alex Rivera, I would read this email as [interpretation]. Concerns: [list]. Suggestions: [list]." This is not a writing assistant — it is a recipient simulation. It catches tone mismatches, missing context, and incorrect assumptions before they reach the client.

**Product Leader Agent:** Reviews use cases, feature requests, and product decisions from a product strategy perspective. When a PM drafts a spec or a feature request comes in from a client, this agent evaluates: commercial priority, technical feasibility signals, customer segment fit, alignment with known roadmap. Output: structured review with priority score and recommendation.

**Domain Expert Agent (configurable):** A pre-built agent that can be configured for any domain expertise relevant to the company — logistics domain expert, healthcare domain expert, fintech compliance expert. The domain is set by populating specific constitution file sections for that agent. Used for: reviewing proposals before they go to clients, checking that domain-specific terminology is correct, validating that commitments are feasible.

**Code Reviewer Agent:** Reviews code artifacts before they are shared or deployed. Checks for: correctness (does it do what the description says?), safety (does it make unintended external calls?), readability (is it maintainable?). Particularly important for Apps Script automations that will run on client data.

## Multi-Agent Coordination

When a request requires multiple agents working in sequence:

1. Main orchestrator decomposes the request into a dependency graph
2. Each step is assigned to the appropriate domain agent
3. Agents that can run in parallel are spawned simultaneously
4. Agents that depend on others wait for their dependency's output (blocked state)
5. If one agent fails, downstream dependent agents are marked blocked with the failure reason
6. Orchestrator reports: what completed, what failed, what is blocked, and what the user needs to do to unblock

Example — "Generate the StackBOX solution note from Venky's site visit report":
- Step 1 (Discovery Agent): extract structured data from Venky's WhatsApp message
- Step 2 (Context Agent): retrieve StackBOX account context, project history, template
- Step 3 (Communication Agent): generate solution note using template + extracted data + context
- Step 4 (Orchestrator): surface approval card for Harsha
- Step 5 (on approval): push to Drive, send notification to project lead

Steps 1 and 2 run in parallel. Step 3 waits for both. Steps 4 and 5 are sequential.

---

# PART 24 — KPI MONITORING AND METRICS AGENT

## What It Does

The Metrics Agent monitors business KPIs from connected integrations and surfaces alerts when metrics deviate from expected ranges. Unlike relationship signals (which watch communication patterns), the Metrics Agent watches structured business data.

## What It Monitors

**Revenue metrics:** MRR/ARR growth rate, renewal close rate, average time to renewal close, churn rate, expansion revenue rate, net revenue retention.

**Relationship metrics:** Average response time per account, accounts with no contact in N days, founder involvement percentage, accounts with single owner risk.

**Operational metrics:** Process adherence rate, average task completion time, SOP drift frequency, time-to-onboard for new hires.

**Custom metrics:** Any metric the workspace defines, sourced from connected integrations (Jira velocity, product usage from Mixpanel, support ticket resolution time from Zendesk).

## How Alerts Are Generated

Metrics are evaluated on a configurable schedule (nightly by default, real-time for critical metrics). When a metric crosses a configured threshold:
- Threshold types: absolute floor/ceiling, percentage change from previous period, rate of change (declining X% per week)
- Alert generated with: current value, threshold, trend (improving/stable/declining), linked entities (which accounts are contributing to the metric change)
- Alert delivered per standard urgency rules (HIGH → Today page + Telegram, MEDIUM → Today page only)

## How Metrics Appear to Users

In the morning brief: "Your renewal close rate this week is 54%, down from 72% last week. 3 accounts are in final negotiation. 2 have been unresponsive for 7+ days. [See at-risk accounts]"

In the Digest: trend analysis with contributing factors. "Renewal close rate has declined 3 weeks in a row. Pattern: accounts where QBR was not held in the 60 days before renewal are closing at 43% vs 78% for accounts where QBR was held. Recommend: enforce QBR requirement in renewal SOP."

In the Context Explorer: KPI dashboard view showing all tracked metrics with trends, thresholds, and drill-down to contributing entities.

---

# PART 25 — COLLABORATION PRIMITIVES

## @Mentions

Users can @mention any Person or Agent in any surface — Chat, a comment on an artifact, a note on an entity, a workflow step description.

**@Person mentions:** The mentioned person receives a notification on their preferred channel. The mention is linked to the context where it appeared. If they have not responded in 24 hours, a follow-up notification is sent. @mentions in Chat threads pull the person into the conversation with full context of what was discussed before they joined.

**@Agent mentions:** Triggering an agent directly from any surface. "@RenewalAgent review this proposal before I send it" in a Chat thread invokes the Communication Agent with the proposal as context. "@ProductLeaderAgent evaluate this feature request from DHL Freight" invokes the Product Leader agent. Agents respond inline in the same thread.

## Sharing Within the Workspace

Any entity, artifact, or context can be shared with a specific person or team within the workspace:
- Share with comment: send with a note ("Riya, can you review this before it goes out?")
- Share for action: assign a specific action to the recipient ("Alex, please approve this by Friday")
- Share for awareness: no action required, just visibility ("FYI — Northwind account context")

All shares create an activity_log entry. Shares requiring action appear in the recipient's unified inbox.

## Tagging

Tags are lightweight, flexible labels that can be applied to any entity. Tags do not have predefined meanings — they are workspace-defined. Common uses: urgency flags (#urgent, #this-week), project tags (#Q2-renewals, #stackbox-pilot), status tags (#waiting-on-client, #in-progress). Tags are searchable and can be used as workflow conditions.

---

# PART 26 — SEARCH AND DISCOVERY

## Three Search Modes

**Lookup (known entity search):** The user knows what they are looking for. "Find the Northwind renewal proposal from March." Full-text search across entity names, artifact titles, decision reasoning fields, and process names. Results ranked by relevance and recency.

**Semantic search (contextual):** The user knows the concept but not the exact words. "What do we know about our pricing approach with enterprise clients?" Vector search across the context graph, constitution files, and decision records. Returns semantically relevant content even when the exact terms do not match.

**Pattern discovery (exploratory):** The user is looking for patterns they did not know to search for. "Show me all accounts where the champion changed in the last 90 days." "Show me all decisions we made about discounts." "Show me all processes owned by a single person with no backup owner." Structured queries against the context graph using natural language — the system translates to graph traversal.

## Where Search Lives

Search is always available from a persistent search bar accessible from any surface. Results rendered as:
- Entity cards (for accounts, contacts, persons — with quick action buttons)
- Artifact cards (for documents — with preview and share option)
- Decision records (with full reasoning and linked entities)
- Process entries (with current version and drift status)

Search results are saveable as "saved views" — a named query that runs on demand and shows current results. Useful for recurring monitoring needs: "All accounts with renewal in next 60 days and no recent contact" saved as "Renewal Risk View."

---

# PART 27 — EXTERNAL INTELLIGENCE

## What It Is

External Intelligence extends Kautilyan's signal pipeline from internal signals (Gmail, Calendar, Jira) to external signals (news about client companies, posts from client executives, industry regulatory changes, market events).

This is a Phase 2 capability — built on the same Signal → Alert → Observer model as internal signals. The architecture is identical. The source differs.

## External Signal Sources

**News API:** Company-specific news monitoring. When a client company is mentioned in financial news, industry publications, or press releases, the system evaluates relevance and creates a Signal if relevant.

**X (Twitter) API:** Post monitoring for client executives or companies. A client's CEO posts about evaluating competitors → risk signal. A client announces expansion → opportunity signal. A client's engineer posts about a technical problem that Kautilyan's product solves → expansion signal.

**LinkedIn API:** Company and executive announcements. New hire at a client company in a relevant role → Signal to update Contact records and assign a new relationship owner. Key contact departs → relationship risk Signal.

**Regulatory/compliance feeds:** Industry-specific regulatory changes that affect client operations. Configurable by industry vertical.

## How Signals Are Classified

Every external signal is evaluated for:
- **Relevance:** Is this about one of our accounts? A contact at one of our accounts? An industry that 3+ accounts operate in?
- **Type:** Risk (competitor mentioned, leadership change, negative press, regulatory pressure), Opportunity (expansion announcement, funding, new initiative), Neutral (general industry news, not directly relevant)
- **Urgency:** HIGH (immediate account risk), MEDIUM (monitor), LOW (FYI for next Digest)

Only MEDIUM and HIGH signals surface as alerts. LOW signals are aggregated into the Digest as "industry signals this week."

## How It Appears to Users

Morning brief: "Northwind Logistics announced a ₹50 Crore funding round. This is likely to accelerate their expansion. Their renewal is in 38 days — this is a good moment to discuss expanded coverage. [Draft expansion proposal] [View Northwind account]"

Alert: "Malaysia Express's CEO mentioned evaluating [competitor] on X yesterday. This may be relevant to your renewal conversation next week. [See post] [Prepare competitive brief] [Adjust renewal approach]"

Digest: "Industry signals this week: 2 of your accounts are in industries affected by the new GST circular. Review pricing impact before their next renewal conversations."

---

# PART 28 — AUTO-APPROVAL, GOVERNANCE, AND ANTI-GAMING

## Auto-Approval Rules

Not all actions require human approval. Certain action types below certain thresholds can be configured for auto-approval by workspace admins.

**Default auto-approved (no human review required):**
- Send a standard check-in email to any account (using an approved template, to a contact already in the context graph)
- Create a task assigned to yourself
- Log a context note to an entity you own
- Generate a draft artifact (approval required before sharing externally)
- Update your own constitution files (USER.md, HEARTBEAT.md)

**Default requires approval:**
- Send any email to an account with ARR > configured threshold
- Discount or pricing modification proposal
- Task assigned to another team member
- Artifact shared externally
- New workflow activation
- SOP change or policy update

**Configurable by admin:** Any of the above rules can be changed for the specific workspace context. An admin can make all external emails auto-approved for a specific team (e.g., the CS team that sends high volumes of standard emails). Or can require approval for all outbound communication regardless of ARR.

## Exception Surfacing

When an action deviates significantly from what the system has seen before, it flags for manager attention even if the action type is nominally auto-approved:

- Unusually large action (discount being offered is 3x the workspace average)
- Action targeting an account the agent has not previously acted on
- Action outside the configured working hours for the workspace
- Action in a category that has a recent failed/rejected pattern

Exception flags surface in the Unified Inbox of the team lead or admin, not the individual performing the action.

## Anti-Gaming Detection

If the system is to learn from human judgment, it must detect when that judgment is being rubber-stamped rather than genuinely exercised.

**Rubber-stamp detection:** If the same person approves actions of the same type without any modification 10+ consecutive times, the system surfaces this to the admin: "Riya has approved 12 consecutive renewal discount proposals without modification. You may want to review whether this approval gate is still adding governance value, or whether the agent's default proposal should simply be the standard."

**Pattern of gaming detection:** If a user is consistently approving their own proposals within 60 seconds (faster than genuine review is possible), the system flags this as a potential governance issue.

**Escalation bypass detection:** If a user is consistently routing actions to avoid specific approvers (always choosing a path that does not require the manager's review when that path is available), the system surfaces this pattern.

None of these trigger automatic action. They are surfaced to the admin for human judgment about whether a governance change is needed.

---

# PART 29 — MODEL SELECTION, ROUTING, AND BYOK

## The Model Routing Policy

Every agent call is routed to the appropriate model based on task type and complexity:

| Task type | Default model | Reasoning |
|---|---|---|
| Morning brief, contact updates, simple context retrieval | Gemini 2.0 Flash | Speed and cost. These run at high frequency. |
| Email drafts, standard chat, alert evaluation | Gemini 2.0 Flash | Good quality at this complexity. |
| Decision classification, pattern analysis | Gemini 1.5 Pro | Needs better reasoning. |
| Decision Digest compilation, complex briefing | Gemini 1.5 Pro | High quality matters here — this is what founders read. |
| BRD generation, strategic analysis, code generation | Claude Sonnet / Gemini 1.5 Pro | Highest quality for complex document generation. |
| Code review, security evaluation | Claude Sonnet | Superior reasoning for code-level analysis. |

Model routing is configurable per workspace by admin. Admins can override defaults for any task type. Cost per model is shown in the adoption dashboard so admins can make informed tradeoffs.

## BYOK — Bring Your Own Key

Enterprise customers can provide their own API keys for any supported model provider:
- Anthropic (Claude models)
- Google (Gemini models)
- OpenAI (GPT models)
- Any OpenAI-compatible endpoint (for self-hosted or custom models)

With BYOK: usage is billed directly to the customer's API account. Kautilyan does not mark up API costs. The customer's key is stored encrypted and never logged in plaintext. The customer retains data residency guarantees from their own provider.

BYOK is particularly important for: enterprise customers with existing API commitments, customers with data residency requirements, customers who want usage visibility in their own API dashboards.

Default (no BYOK): Kautilyan API keys used, token costs included in the subscription price.

---

# PART 30 — CONNECTOR FRAMEWORK AND MCP

## MCP-First Integration Philosophy

Use existing MCP (Model Context Protocol) servers wherever they exist rather than building custom integrations. MCP provides: standardised tool definitions, automatic schema discovery, versioned tool contracts, and a growing ecosystem of pre-built connectors.

Current MCP-available integrations: Google Workspace, GitHub, Jira, Slack, Notion, Linear, Salesforce (partial).

For tools without MCP: build custom Edge Function connectors that normalise events to the standard Kautilyan event schema → activity_log.

## The MCP Manifest and Connector Registry

Every connected integration (MCP-based or custom) registers in the Connector Registry:
- Integration name, type, version
- Available tools (for MCP: auto-discovered from MCP server manifest)
- Scopes granted and scopes available
- Health status, last successful call, error rate
- Field mappings to Kautilyan entity schema
- Rate limit status and quota remaining

When the orchestrator needs to call an external tool, it consults the Connector Registry to:
1. Verify the integration is connected and healthy
2. Verify the workspace has granted the required scope
3. Retrieve the tool's schema (to prevent hallucinated parameter names)
4. Select the correct API version

The orchestrator never calls an MCP tool without consulting the registry first. This is the anti-hallucination layer for tool calls — the same principle as the Schema Registry for data queries.

## How the Orchestrator Calls MCP Correctly

```
Orchestrator needs to create a Jira ticket:
  1. Check Connector Registry: is Jira connected? Yes.
  2. Retrieve tool schema: create_issue requires [project, summary, description, issue_type]
  3. Verify scope: workspace has granted 'write:issue' scope? Yes.
  4. Construct call with validated parameters (no hallucinated fields)
  5. Execute via MCP server
  6. Receive structured response
  7. Log to activity_log: tool=jira_create_issue, inputs, outputs, latency, run_id
  8. Return result to calling skill
```

## Inbound Webhooks

Every workspace gets a unique inbound webhook endpoint: `https://api.kautilyan.com/webhooks/{workspace_id}/{webhook_name}`

Inbound webhook setup:
1. Admin creates a named webhook in Settings → Integrations → Webhooks
2. Configures: expected payload schema, authentication method (shared secret, HMAC), what workflow to trigger on receipt
3. Gets the webhook URL to provide to the external system

When a webhook fires:
1. Payload received and validated against configured schema
2. Authentication verified
3. Signal entity created with source: `external_webhook`, payload stored in raw_data
4. Configured workflow triggered with the webhook payload as the trigger context

Examples: client portal form submission → generate onboarding documents, billing system payment failure → create alert and task, ERP inventory level change → trigger reorder workflow.

---

# PART 31 — MULTI-ENTITY WORKSPACE

## What Multi-Entity Means

One Kautilyan workspace can contain multiple Organisations. This serves:
- Holding companies managing multiple business units
- Consulting firms managing their own operations and tracking client engagements separately
- Companies with multiple product lines that operate with distinct teams and client sets

## How It Works

**Context isolation:** Each Organisation within a workspace has its own:
- Constitution files (org.md, clients.md, processes.md, etc.)
- Account and Contact records
- Decision records and decision policies
- Team assignments and permission scopes

An employee of Organisation A does not see Organisation B's clients unless explicitly granted cross-entity access.

**Cross-entity reporting (workspace owner only):**
The workspace owner can see aggregate health across all entities:
- Combined ARR across all entities
- Founder dependency metric across all entities
- Common processes that could be standardised
- Shared contacts (when the same person is a Contact in multiple entities)

**Shared resources (optional):**
Workspace-level resources that span all entities:
- Template Library (templates can be marked workspace-scope to be available to all entities)
- Agent catalog (same pre-built agents available to all entities)
- Connector registry (an integration connected at workspace level is available to all entities)

**How it appears to users:**
Team members see an entity selector at the top of every surface. Switching entities changes the context graph, constitution files, and all data shown. Users only see the entities they have been granted access to.

---

# PART 32 — THE THREE COORDINATION PROBLEM AGENTS

Most business problems fall into three categories: things that need to be followed up on, things that need to be prioritised or allocated optimally, and things that need to be modelled or forecast. Kautilyan has a named agent for each.

## Coordination Agent — The Follow-Up and Accountability Layer

**What it does:** Knows what was committed to, by whom, by when. Tracks whether it happened. Surfaces what has not. Drafts follow-ups. Escalates when warranted.

**How it works:** Monitors the task graph (all open tasks and their owners and due dates), the commitment graph (all decisions and actions that imply a future commitment), and the communication graph (emails sent that await response, proposals sent that await decision, approvals pending). Runs continuously — does not wait for user requests.

**What it surfaces:**
- Today page: "3 things are overdue. 2 are high-stakes. [Review]"
- Morning brief: "Northwind has not responded to the renewal proposal in 14 days. This was committed to by Riya on April 2. [Draft follow-up]"
- Proactive Telegram: "The stakeholder mapping step in the new client onboarding for DHL Freight was supposed to happen by yesterday. No evidence it was completed. [Complete it] [Reassign] [Mark as not needed]"

**Why this matters:** Most business failures are coordination failures, not capability failures. The Coordination Agent is the answer to "things fall through the cracks" — it makes the cracks visible before anything falls through them.

## Optimisation Agent — The Resource and Priority Layer

**What it does:** Given a set of constraints (team capacity, deadlines, account priorities) and a set of demands (projects, renewals, onboardings, requests), surfaces the optimal allocation. Answers: "What should we work on, in what order, given who is available?"

**Use cases:**
- Client prioritisation: "You have 12 accounts that need attention this week. Here is the recommended order and the reasoning: [Northwind: renewal in 8 days, HIGH], [Malaysia Express: proposal unanswered 11 days, HIGH], [DHL Freight: QBR overdue, MEDIUM]..."
- Project planning: "You have committed to 3 client deliverables due in the next 2 weeks. Riya has capacity for 6 hours of project work. Here is the recommended allocation and what will need to be pushed: [Deliverable A: 4 hours, keep], [Deliverable B: 3 hours, push or reassign]."
- Product prioritisation: "17 feature requests are active from 11 clients. Here is the commercial priority ranking: [Real-time tracking API: 4 clients, 2 with open commitments, ₹32L at renewal risk], [Custom SLA dashboard: 3 clients, 1 with open commitment]..."
- Resource planning: "If you onboard 3 new clients this quarter with your current CS team of 4, here is which existing accounts will be at risk of under-servicing based on historical time-per-account data."

## Forecasting and Simulation Agent — The Scenario Layer

**What it does:** Given current context, models scenarios forward and surfaces risks and opportunities before they become obvious. Does not predict with false precision — surfaces scenarios and makes tradeoffs visible.

**Use cases:**
- Pipeline forecast: "If Northwind closes at ₹16L (current proposal) and Malaysia Express churns (at-risk signal), Q2 ARR is ₹4.2 Crore vs ₹4.8 Crore target. You are ₹60L short. These 2 expansion opportunities could close the gap: [list]."
- Capacity simulation: "At your current hiring pace (1 new hire per quarter), your CS team will hit capacity in 6 months at current client growth. If you accelerate onboarding, you hit capacity in 4 months."
- Churn forecast: "Based on relationship health signals, communication patterns, and renewal history, these 3 accounts are at elevated churn risk in the next 90 days: [Northwind: 34% churn probability, Malaysia Express: 28%, TechStream: 22%]. Confidence: based on 6 months of comparable patterns."
- Opportunity detection: "Northwind's funding announcement suggests 40-60% probability of seat expansion in the next 6 months. Historical pattern: companies in this sector that raise at this stage expand their software spend by 30-70% within 2 quarters."

---

# UPDATED PART 18 — OPEN ARCHITECTURE DECISIONS (COMPLETE)

1. **Microsoft 365:** Google-first. M365 post-first-10-customers.
2. **Domain-wide Gmail delegation:** Per-user primary. Domain-wide for Google Workspace Enterprise.
3. **Permissioned inference:** Post-first-10-customers.
4. **Worker service:** When any customer crosses 10,000 events/day.
5. **Kyra partnership:** Explore formal integration when first regulated sector customer is identified.
6. **Template Library formats:** docx, xlsx, pptx, pdf — prioritise by what first pilot customers request.
7. **Mobile app:** Architectural readiness only. No native app. API-first, channel-agnostic. All workflows available via Telegram/WhatsApp. Native app is a future layer.
8. **GraphQL customer API:** Phase 1. Phase 0: build internal API correctly. Phase 1: expose customer-facing GraphQL for context graph querying and workflow triggering.
9. **Multi-entity workspace:** Phase 1 management UI. Schema supports it from Phase 0.
10. **E2B for code execution:** Standard choice for sandboxed Python/JS execution. Apps Script via Google Apps Script API. Do not build custom sandbox infrastructure.
11. **BYOK:** Available from Phase 1. Enterprise customers can bring their own API keys for any model provider.
12. **Inbound webhooks:** Phase 1. Enables external systems to trigger Kautilyan workflows.
13. **External Intelligence (news/X API):** Phase 2. Same signal pipeline, new source. Architecture must support external signal types from Phase 0 schema design.
14. **Dynamic UI:** Phase 0 non-negotiable. AG-UI protocol for agent-to-UI contract. CopilotKit for React components. All agent output is typed JSON, never unstructured text strings.
15. **Context Explorer:** Phase 0. Visual graph + list/table + semantic query. Core to the "company that can query itself" vision.
16. **Unified Inbox:** Phase 0. Persistent attention surface, distinct from Today page. Everything requiring human action in one real-time queue.

---

*Version 11.0. April 2026. All prior versions superseded.*

*New in v11: Dynamic UI architecture (Part 19), Surfaces and UI (Part 20), Workflow Engine with full trigger model and NL builder (Part 21), Artifacts and Content Management (Part 22), Agent Catalog and Orchestration (Part 23), KPI Monitoring (Part 24), Collaboration Primitives (Part 25), Search and Discovery (Part 26), External Intelligence (Part 27), Anti-Gaming and Governance (Part 28), Model Selection and BYOK (Part 29), Connector Framework and MCP (Part 30), Multi-Entity Workspace (Part 31), Three Coordination Problem Agents (Part 32). Open Architecture Decisions expanded to 16 items.*

*This document is the master reference for product vision, go-to-market, entity model, architecture, and commercial motion. Read it before building. Read it before selling.*
