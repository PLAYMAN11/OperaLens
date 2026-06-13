"""
explainer.py — Jaime

Capa 3: traduce los resultados de analyzer.py y anomalies.py a lenguaje
natural usando IA.

Orden de prioridad:
  1. AWS Bedrock via bearer token (AWS_BEARER_TOKEN_BEDROCK)
  2. AWS Bedrock via credenciales IAM (AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY)
  3. Ollama local (Mistral)
  4. Resumen de texto plano
"""

import json
import os
import httpx
from typing import Any

# --- Bedrock ---
AWS_REGION       = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
BEDROCK_MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"
BEDROCK_ENDPOINT = f"https://bedrock-runtime.{AWS_REGION}.amazonaws.com"

# --- Ollama ---
OLLAMA_HOST  = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = "mistral"

TIMEOUT = 60


def explicar(resultado: dict[str, Any], anomalias: list[dict]) -> str:
    """
    Punto de entrada. Devuelve un párrafo en español con los hallazgos
    principales, listo para mostrar en el dashboard.
    """
    prompt = _construir_prompt(resultado, anomalias)

    # 1. Bedrock con bearer token
    bearer = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
    if bearer:
        try:
            return _llamar_bedrock_bearer(prompt, bearer)
        except Exception:
            pass

    # 2. Bedrock con credenciales IAM
    if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
        try:
            return _llamar_bedrock_boto3(prompt)
        except Exception:
            pass

    # 3. Ollama local
    try:
        return _llamar_ollama(prompt)
    except Exception:
        pass

    # 4. Sin IA
    return _resumen_fallback(resultado, anomalias)


# ---------------------------------------------------------------------------
# Prompt compartido
# ---------------------------------------------------------------------------

def _construir_prompt(resultado: dict[str, Any], anomalias: list[dict]) -> str:
    perdidas     = resultado.get("perdidas_operativas", {}).get("total", 0)
    inmovilizado = resultado.get("capital_inmovilizado", {}).get("total", 0)
    inventario   = resultado.get("inventario_valorizado", {}).get("total", 0)
    periodo      = resultado.get("periodo", {})
    inicio       = periodo.get("inicio", "")[:10]
    fin          = periodo.get("fin", "")[:10]

    alertas_altas = [a for a in anomalias if a.get("severidad") == "alta"]
    alertas_texto = "\n".join(
        f"- {a['descripcion']}" for a in anomalias[:5]
    ) or "- Sin anomalías detectadas"

    materiales_inmovilizados = resultado.get("capital_inmovilizado", {}).get("materiales", [])
    detalle_inmovilizado = "\n".join(
        f"- {m['material']}: ${m['valor_inmovilizado']:,.2f} ({m['dias_sin_rotacion']} días sin rotación)"
        for m in materiales_inmovilizados[:3]
    ) or "- Ninguno"

    return f"""Eres un consultor de operaciones para una PyME manufacturera mexicana.
Analiza los siguientes datos del periodo {inicio} al {fin} y explica los hallazgos
en 4 a 6 oraciones en español, como si se lo explicaras directamente al dueño de la empresa.
Sé directo, menciona los montos en pesos y señala qué acciones concretas debe tomar.
No uses tecnicismos ni bullet points, solo párrafo corrido.

DATOS DEL PERIODO:
- Inventario valorizado total: ${inventario:,.2f}
- Capital inmovilizado (sin rotación): ${inmovilizado:,.2f}
- Pérdidas operativas (desperdicio y ajustes): ${perdidas:,.2f}
- Alertas detectadas: {len(anomalias)} ({len(alertas_altas)} de severidad alta)

ALERTAS PRINCIPALES:
{alertas_texto}

MATERIALES INMOVILIZADOS:
{detalle_inmovilizado}

EXPLICACIÓN PARA EL DUEÑO:"""


# ---------------------------------------------------------------------------
# AWS Bedrock — bearer token (HTTP directo)
# ---------------------------------------------------------------------------

def _llamar_bedrock_bearer(prompt: str, token: str) -> str:
    url = f"{BEDROCK_ENDPOINT}/model/{BEDROCK_MODEL_ID}/invoke"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 500,
        "temperature": 0.3,
        "messages": [{"role": "user", "content": prompt}],
    }

    with httpx.Client(timeout=TIMEOUT) as client:
        response = client.post(url, headers=headers, json=body)
        response.raise_for_status()

    return response.json()["content"][0]["text"].strip()


# ---------------------------------------------------------------------------
# AWS Bedrock — credenciales IAM (boto3)
# ---------------------------------------------------------------------------

def _llamar_bedrock_boto3(prompt: str) -> str:
    import boto3

    client = boto3.client("bedrock-runtime", region_name=AWS_REGION)

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 500,
        "temperature": 0.3,
        "messages": [{"role": "user", "content": prompt}],
    })

    response = client.invoke_model(modelId=BEDROCK_MODEL_ID, body=body)
    result = json.loads(response["body"].read())
    return result["content"][0]["text"].strip()


# ---------------------------------------------------------------------------
# Ollama — Mistral local
# ---------------------------------------------------------------------------

def _llamar_ollama(prompt: str) -> str:
    url = f"{OLLAMA_HOST}/api/generate"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 500,
        },
    }

    with httpx.Client(timeout=TIMEOUT) as client:
        response = client.post(url, json=payload)
        response.raise_for_status()

    return response.json()["response"].strip()


# ---------------------------------------------------------------------------
# Fallback sin IA
# ---------------------------------------------------------------------------

def _resumen_fallback(resultado: dict[str, Any], anomalias: list[dict]) -> str:
    perdidas     = resultado.get("perdidas_operativas", {}).get("total", 0)
    inmovilizado = resultado.get("capital_inmovilizado", {}).get("total", 0)
    altas        = sum(1 for a in anomalias if a.get("severidad") == "alta")

    partes = [f"Se detectaron pérdidas operativas por ${perdidas:,.2f}."]

    if inmovilizado > 0:
        partes.append(f"Hay ${inmovilizado:,.2f} en capital inmovilizado sin rotación.")

    if altas > 0:
        partes.append(f"Se encontraron {altas} alerta(s) de severidad alta que requieren atención inmediata.")
    elif anomalias:
        partes.append(f"Se detectaron {len(anomalias)} anomalía(s) en el periodo analizado.")

    return " ".join(partes)
