import OpenAI from "openai"

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
const body = await req.json()

const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "Você é o NeuroBot do sistema NeuroTwin."
},
{
role: "user",
content: body.message
}
]
})

return Response.json({
reply: response.choices[0].message.content
})
}