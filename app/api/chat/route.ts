import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const body = await req.json();

const message = String(
body.message ||
body.message ||
""
).trim();

const text = message.toLowerCase();

let reply = "";

if (
text.includes("modules") ||
text.includes("modules") ||
text.includes("module") ||
text.includes("module")
) {
reply = `NEUROTWIN 2050 — OPERATIONAL MODULES

1. Cognitive Center
2. Global Observatory
3. Strategic Alerts
4. Executive Reports
5. Opportunity Radar
6. Global Trends
7. NeuroCore
8. Voice Command

Status:
Active operational core.
} else if (
text.includes("earthquake") ||
text.includes("cataclysm") ||
text.includes("disaster")
) {
reply = `NEUROTWIN OBSERVATORY

The natural events module is prepared to query external data from the Observatory.

Integrated sources:
USGS — earthquakes.
NASA EONET — natural events.

For current data, please refer to the Global Observatory module.
} else if (
text.includes("alert") ||
text.includes("alerts")
) {
reply = `NEUROTWIN ALERTS`

The system has the structure to consolidate natural and strategic alerts.

The information should be sorted by:
- source;
- time;
- location;
- severity;
- status;
- reliability.`;
} else if (
text.includes("status")
) {
reply = `STATUS NEUROTWIN 2050

Chat API: operational.
Observatory: integrated.
Voice command: available on the dashboard.
Reports: module available.
NeuroCore: evolving.

Next priority:
Connect more real-world sources and validate each integration.
} else {
reply = `NEUROTWIN 2050

Command received:
${message || "No command entered."}

The core is operational and awaiting direction to the corresponding module.
}

return NextResponse.json({
status: "ok",
reply,
});
} catch (error) {
console.error("NeuroTwin chat error:", error);

return NextResponse.json(
{
status: "error",
Reply: "Internal error in the conversation core."
},
{ status: 500 }
);
}
}