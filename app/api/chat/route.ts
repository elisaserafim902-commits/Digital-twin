notepad app\api\chat\route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
const { message } = await req.json();
const text = String(message || "").toLowerCase();

let reply = "";

if (text.includes("modules") || text.includes("modules")) {
reply = `NEUROTWIN 2050 ACTIVE MODULES`

1. Cognitive Center
2. Global Observatory
3. Strategic Alerts
4. Executive Reports
5. Opportunity Radar
6. Global Trends
7. Institutional NeuroCore
8. Voice Command

Status:
All main modules are operational for demonstration.
} else if (text.includes("alert")) {
reply = `STRATEGIC ALERTS

Overall status:
Operational.

Active alerts:
1. Climate: moderate level in Southern Brazil.
2. Economy: pay attention to global markets.
3. Infrastructure: preventive monitoring.
4. Observatory: continuous monitoring.

Critical level:
No active emergencies.
} else if (text.includes("report") || text.includes("report")) {
reply = `NEUROTWIN 2050 EXECUTIVE REPORT`

Summary:
The system is operational and ready for institutional demonstration.

Applications:
Civil defense, urban management, climate, infrastructure, economy, strategic projects and support for public decision-making.

Recommendation:
Introducing NeuroTwin as a national operational intelligence platform with modular expansion.
} else if (text.includes("government")) {
reply = `ANALYSIS FOR GOVERNMENT

NeuroTwin 2050 can be presented as a strategic intelligence platform to support public decision-making.

Key differentiators:
Data integration, conversational AI, global observatory, executive reporting, and risk monitoring.

Next action:
Consolidate the demonstration across three screens: Dashboard, Global Observatory, and Executive Reports.
} else if (text.includes("status")) {
reply = `OPERATIONAL STATUS`

System:
Online.

AI:
Active.

Voice:
Operational.

Observatory:
Online.

Reports:
Available.

Risk:
Low.

Readiness:
High for demonstration.`;
} else {
reply = `NEUROTWIN 2050 ANALYSIS`

Command received:
${message}

Situation:
Active operating system.

Risk:
Low.

Recommendation:
Proceed with strategic analysis and direct the command to the corresponding module.
}

return NextResponse.json({ reply });
}