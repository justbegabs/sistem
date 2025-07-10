const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:3000']
}));
app.use(express.json());

const HF_TOKEN = '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';

app.post('/api/huggingface', async (req, res) => {
  const { prompt, model } = req.body;
  console.log('Recebido:', { prompt, model }); // <-- log de entrada
  if (!prompt || !model) {
    console.log('Prompt ou modelo ausente!');
    return res.status(400).json({ error: 'Prompt e modelo são obrigatórios.' });
  }
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro da Hugging Face:', errText); // <-- log detalhado
      return res.status(500).json({ error: 'Erro na API Hugging Face', details: errText });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mime = contentType;
      return res.json({ image: `data:${mime};base64,${base64}` });
    } else {
      const data = await response.json();
      console.error('Resposta inesperada:', data); // <-- log detalhado
      return res.status(500).json({ error: 'Resposta inesperada da API Hugging Face', details: data });
    }
  } catch (err) {
    console.error('Erro no backend:', err); // <-- log detalhado
    return res.status(500).json({ error: 'Erro no servidor', details: err.message });
  }
});

app.listen(4001, () => console.log('Proxy Hugging Face rodando em http://127.0.0.1:4001'));
