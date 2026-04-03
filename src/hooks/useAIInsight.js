import { useState, useCallback } from 'react';

export function useAIInsight() {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsight = useCallback(async (title, chartType, purpose, dataSummary) => {
    if (!dataSummary || dataSummary === "{}") {
      setInsight("Tidak ada data yang tersedia untuk dianalisis.");
      return;
    }

    if (insight) return; // Prevent refetching if we already have it

    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError("API Key Groq tidak ditemukan di environment variables.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Anda adalah analis bisnis ahli untuk toko e-commerce 'Kaos Kami'. Anda akan menerima rangkuman data untuk sebuah diagram. Berikan insight/temuan singkat, tajam, dan bisa ditindaklanjuti dalam bahasa Indonesia (maksimal 3 kalimat). Jangan menyarankan hal yang terlalu umum, gunakan data yang diberikan."
            },
            {
              role: "user",
              content: `Nama Diagram: ${title}\nJenis: ${chartType || 'Chart'}\nTujuan: ${purpose || 'Analisis Bisnis'}\n\nRingkasan Data:\n${dataSummary}\n\nBerikan insight:`
            }
          ],
          temperature: 0.3,
          max_tokens: 250,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedInsight = data.choices[0].message.content.trim();
      setInsight(generatedInsight);
    } catch (err) {
      console.error("AI Insight Error:", err);
      setError("Gagal menghasilkan insight AI saat ini.");
    } finally {
      setIsLoading(false);
    }
  }, [insight]);

  return { insight, isLoading, error, fetchInsight };
}
