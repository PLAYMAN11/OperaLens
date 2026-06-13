"""
explainer.py — Jaime

Capa 3: recibe los resultados de analyzer.py y anomalies.py y los
traduce a lenguaje natural usando Mistral via Ollama.
"""

import os
import httpx
from typing import Any

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
MODEL = "mistral"
TIMEOUT = 60


def explicar(resultado: dict[str, Any], anomalias: list[dict]) -> str:
    """
    Punto de entrada. Devuelve un párrafo en español con los hallazgos
    principales, listo para mostrar en el dashboard.
    Si Ollama no está disponible devuelve un resumen generado sin IA.
    """
    prompt = _construir_prompt(resultado, anomalias)

    try:
        return _llamar_ollama(prompt)
    except Exception:
        return _resumen_fallback(resultado, anomalias)


# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------

def _construir_prompt(resultado: dict[str, Any], anomalias: list[dict]) -> str:
    perdidas      = resultado.get("perdidas_operativas", {}).get("total", 0)
    inmovilizado  = resultado.get("capital_inmovilizado", {}).get("total", 0)
    inventario    = resultado.get("inventario_valorizado", {}).get("total", 0)
    periodo       = resultado.get("periodo", {})
    inicio        = periodo.get("inicio", "")[:10]
    fin           = periodo.get("fin", "")[:10]

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
# Llamada a Ollama
# ---------------------------------------------------------------------------

def _llamar_ollama(prompt: str) -> str:
    url = f"{OLLAMA_HOST}/api/generate"

    payload = {
        "model": MODEL,
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
