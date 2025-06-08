export default async function handler(req, res) {
  const { question, answer } = req.body;

  if (!question || answer === undefined) {
    res.status(400).json({ reply: "質問または答えが送信されていません。" });
    return;
  }

  const prompt = `
あなたは1〜10の中の数字を知っているAIです。
正解の数字は「${answer}」です。
次の質問に「はい」か「いいえ」でだけ答えてください。
質問：「${question}」
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("返答の取得に失敗しました");
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("GPT API error:", error);
    res.status(500).json({ reply: "エラーが発生しました。" });
  }
}
