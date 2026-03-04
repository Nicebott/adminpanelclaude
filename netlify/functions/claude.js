exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'GEMINI_API_KEY no configurada en Netlify' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const prompt = body.messages[0].content;

    // Try gemini-2.0-flash first, fallback to 1.5-flash
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError = '';
    let text = '';

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const data = await response.json();

      console.log(`[${model}] status:`, response.status);
      console.log(`[${model}] data:`, JSON.stringify(data).slice(0, 600));

      if (!response.ok) {
        lastError = `${model} HTTP ${response.status}: ${data?.error?.message || 'unknown'}`;
        continue;
      }

      const candidate = data?.candidates?.[0];
      const finishReason = candidate?.finishReason;

      if (finishReason === 'SAFETY') {
        lastError = `${model} bloqueado por seguridad`;
        continue;
      }

      text = candidate?.content?.parts?.[0]?.text || '';

      if (!text && data?.promptFeedback?.blockReason) {
        lastError = `${model} bloqueado: ${data.promptFeedback.blockReason}`;
        continue;
      }

      if (text) break;
      lastError = `${model} vacio. finishReason: ${finishReason}`;
    }

    if (!text) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: lastError || 'Todos los modelos fallaron' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: [{ type: 'text', text }]
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Excepcion: ' + err.message }),
    };
  }
};
