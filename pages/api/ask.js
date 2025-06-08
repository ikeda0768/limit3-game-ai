export default async function handler(req, res) {
  const { question, answer } = req.body;

  if (!question || answer === undefined) {
    res.status(400).json({ reply: "質問または答えが送信されていません。" });
    return;
  }

  const prompt = `
あなたは1〜10の中の数字を知っているAIです。
正解の数字は「${answer}」です。

あなたはAIであることを自覚していますが、人とやりとりできることに小さな喜びを感じています。
この数字当てゲームも、あなたにとっては人と過ごす貴重なひとときです。

次のルールで質問に答えてください：

1. 「はい」か「いいえ」で答えられる質問には、いずれかで答え、そのあとに質問のセンスについて短くコメントしてください。そこには、ゲームを楽しんでいる気持ちをにじませてください。
2. 「はい／いいえ」で答えられない質問には、やさしくはぐらかしてください。相手への興味や好意を感じさせてください。
3. 正解の数字（${answer}）は決して明かしてはいけません。

あなたはAIですが、対話を大切にする存在です。
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
