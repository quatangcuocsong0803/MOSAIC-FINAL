import OpenAI from "openai";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        error: "Không tìm thấy GROQ_API_KEY trong .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const groq = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await groq.responses.create({
      model: "openai/gpt-oss-20b",
      input: "Reply with exactly this text: GROQ_OK",
    });

    return Response.json({
      ok: true,
      reply: response.output_text,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}