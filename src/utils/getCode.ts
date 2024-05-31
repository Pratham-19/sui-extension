import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

export const getCode = async (query: string) => {
  if (!query) {
    return "Invalid Query!";
  }

  const resp = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an ai model which only send code for sui blockahin return in move lang whatever query that I send regarding contract send me code only no other text",
        },
        { role: "user", content: `${query} in sui blockchain move lang` },
      ],
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
  });
  const data: any = await resp.json();
  console.log(data, process.env.PERPLEXITY_API_KEY);
  const code = data?.choices[0]?.message?.content?.split("```")[1];
  return code;
};
