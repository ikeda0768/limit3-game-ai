// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [questionCount, setQuestionCount] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [log, setLog] = useState([]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [finalGuess, setFinalGuess] = useState("");
  const [guessResult, setGuessResult] = useState("");
  const maxQuestions = 3;

  useEffect(() => {
    // 初期化
    const generatedAnswer = Math.floor(Math.random() * 10) + 1;
    setAnswer(generatedAnswer);
    setQuestionCount(0);
    setLog([]);
    setCustomQuestion("");
    setFinalGuess("");
    setGuessResult("");
    console.log("答え（デバッグ用）:", generatedAnswer);
  }, []);

  const handleQuestionSubmit = async () => {
    if (questionCount >= maxQuestions) {
      alert("質問は3回までです");
      return;
    }

    if (!customQuestion.trim()) {
      alert("質問を入力してください");
      return;
    }

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: customQuestion, answer }),
      });

      const data = await res.json();
      const reply = data.reply || "（エラー: 返答なし）";
      setLog([...log, `${customQuestion} → ${reply}`]);
      setQuestionCount(questionCount + 1);
      setCustomQuestion("");
    } catch (error) {
      alert("エラーが発生しました");
      console.error(error);
    }
  };

  const handleGuess = async () => {
    const guess = parseInt(finalGuess);
    if (isNaN(guess) || guess < 1 || guess > 10) {
      alert("1〜10の数字を入力してください");
      return;
    }

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: `正解は ${guess} ですか？`, answer }),
      });

      const data = await res.json();
      const reply = data.reply || "（エラー: 返答なし）";
      if (reply.includes("はい")) {
        setGuessResult("🎉 正解です！");
      } else {
        setGuessResult("❌ 不正解！");
      }
    } catch (error) {
      alert("エラーが発生しました");
      console.error(error);
    }
  };

  const handleRestart = () => {
    const newAnswer = Math.floor(Math.random() * 10) + 1;
    setAnswer(newAnswer);
    setQuestionCount(0);
    setLog([]);
    setCustomQuestion("");
    setFinalGuess("");
    setGuessResult("");
    console.log("答え（デバッグ用）:", newAnswer);
  };

  return (
    <>
      <Head>
        <title>Limit 3 - 数字当てゲーム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo-image-circle.png" />
      </Head>

      <main className="container">
        <section className="title-wrapper"></section>

        <section>
          <h2>質問フェーズ</h2>
          <p>1〜10のどれかの数字が選ばれている</p>
          <p>使える質問は3回だけ</p>
          <p>自由に質問して</p>
          <p>AIが「はい / いいえ」の回答を行うので</p>
          <p>推理して正解を導き出そう</p>
          <input
            type="text"
            value={customQuestion}
            placeholder="例: その数字は5以上ですか？"
            onChange={(e) => setCustomQuestion(e.target.value)}
          />
          <button onClick={handleQuestionSubmit}>質問する</button>
        </section>

        <section>
          <p>残り質問回数: {maxQuestions - questionCount}</p>
          <ul id="questionLog">
            {log.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </section>

        {questionCount >= maxQuestions && (
          <section>
            <h2>回答フェーズ</h2>
            <p>1〜10の数字を入力してください</p>
            <input
              type="number"
              min="1"
              max="10"
              value={finalGuess}
              onChange={(e) => setFinalGuess(e.target.value)}
            />
            <button onClick={handleGuess}>予想する</button>
            <p>{guessResult}</p>
          </section>
        )}

        <section>
          <button onClick={handleRestart}>リスタート</button>
        </section>
      </main>
    </>
  );
}
