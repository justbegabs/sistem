from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import os
import io
from PIL import Image
import base64
from flask_cors import CORS
from collections import defaultdict

app = Flask(__name__)
CORS(app)

HF_TOKEN = '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'

# Controle de limite por IP
limite_por_ip = 5
usos_por_ip = defaultdict(int)

@app.route('/api/huggingface', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt')
    model = data.get('model', 'yyyyyxie/textflux')

    if not prompt:
        return jsonify({'error': 'Prompt é obrigatório'}), 400

    # Exceção para testes no Cursor ou Visual Studio Code
    user_agent = request.headers.get('User-Agent', '')
    if 'Cursor' in user_agent or 'Visual Studio Code' in user_agent:
        pass  # Sem limite
    else:
        ip = request.remote_addr
        if usos_por_ip[ip] >= limite_por_ip:
            return jsonify({'error': 'Limite de 5 criações atingido para este IP.'}), 429
        usos_por_ip[ip] += 1

    # Escolhe o provider de acordo com o modelo
    if model == "black-forest-labs/FLUX.1-dev":
        provider = "nebius"
    elif model == "yyyyyxie/textflux":
        provider = "fal-ai"
    elif model == "stabilityai/sdxl-turbo":
        provider = "replicate"
    else:
        provider = "fal-ai"

    try:
        client = InferenceClient(
            provider=provider,
            api_key=HF_TOKEN
        )
        image = client.text_to_image(
            prompt,
            model=model
        )
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        return jsonify({'image': f'data:image/png;base64,{img_base64}'})
    except Exception as e:
        print("Erro no backend:", e)
        return jsonify({'error': 'Erro no backend', 'details': str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate():
    data = request.get_json()
    texto = data.get('texto')
    model = data.get('model', 'Helsinki-NLP/opus-mt-mul-en')

    if not texto:
        return jsonify({'error': 'Texto é obrigatório'}), 400

    try:
        client = InferenceClient(
            provider="hf-inference",
            api_key=HF_TOKEN
        )
        result = client.translation(
            texto,
            model=model
        )
        # Se result for dict, pegue o campo correto
        if isinstance(result, dict) and 'translation_text' in result:
            translation = result['translation_text']
        else:
            translation = str(result)
        return jsonify({'translation': translation})
    except Exception as e:
        print("Erro na tradução:", e)
        return jsonify({'error': 'Erro na tradução', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True) 