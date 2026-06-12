# OperaLens — Backend

Sistema de detección de pérdidas operativas para PyMEs manufactureras.

## Stack

- **Framework:** Python + FastAPI
- **Procesamiento:** Pandas + NumPy
- **Base de datos:** SQLite
- **IA local:** Ollama + Mistral (nativo en Mac, fuera de Docker)
- **Infraestructura:** Docker Compose

Ollama corre nativo en Mac (puerto 11434). El backend corre en Docker y lo alcanza vía `host.docker.internal:11434`.

---

## Estructura

```
backend/
├── main.py              → Oliver
├── routers/
│   └── api.py           → Oliver
├── services/
│   ├── parser.py        → Oliver
│   ├── normalizer.py    → Oliver
│   ├── analyzer.py      → Emmanuel
│   ├── anomalies.py     → Emmanuel
│   └── history.py       → Emmanuel
├── ai/
│   └── explainer.py     → Jaime
└── database/
    ├── db.py            → Oliver
    └── models.py        → Oliver
```

---

## Las 3 capas del sistema

```
Excel
  ↓
Capa 1 — normalizer.py   IA identifica columnas y mapea a esquema común
  ↓
Capa 2 — analyzer.py     Pandas calcula métricas de pérdidas operativas
          anomalies.py   Detección estadística de anomalías
          history.py     Persistencia en SQLite
  ↓
Capa 3 — explainer.py    IA traduce hallazgos a lenguaje natural
  ↓
Dashboard
```

---

## Contrato del DataFrame (Oliver → Emmanuel)

`normalizer.py` entrega un DataFrame con estas columnas:

| Columna | Tipo | Valores |
|---|---|---|
| `fecha` | datetime | Fecha del movimiento |
| `tipo` | str | `entrada`, `salida`, `produccion`, `desperdicio`, `ajuste` |
| `material` | str | Identificador del material |
| `cantidad` | float | Unidades del movimiento |
| `costo_unitario` | float | Costo por unidad |
| `etapa` | str | Etapa del proceso productivo |

---

## Módulos de Emmanuel

### `services/analyzer.py` — El calculador

Función pública: `analizar(df, consumo_esperado?)` → devuelve un dict con 4 métricas.

**1. Inventario valorizado** — ¿Cuánto dinero hay en almacén?
```
Stock por material = suma entradas − suma (salidas + produccion)
Valor = stock × costo_unitario_promedio
```

**2. Capital inmovilizado** — ¿Qué dinero lleva más de 30 días sin moverse?
Revisa la última fecha de salida de cada material. Si supera 30 días (o nunca tuvo salida), ese valor se considera inmovilizado.

**3. Análisis de consumo** — ¿Se consume más o menos de lo normal?
Compara consumo real vs esperado por material y calcula la desviación en %. Si no se pasa `consumo_esperado`, usa el promedio diario del propio periodo como referencia.

**4. Pérdidas operativas** — ¿Cuánto se pierde en desperdicio y ajustes?
Filtra los renglones `tipo = desperdicio` o `ajuste` y los valoriza (`cantidad × costo_unitario`).

Ejemplo de salida:
```json
{
  "inventario_valorizado": { "total": 16350.0, "por_material": { ... } },
  "capital_inmovilizado":  { "total": 8000.0,  "materiales": [ ... ] },
  "consumo":               { "por_material": { ... } },
  "perdidas_operativas":   { "total": 2000.0,  "por_tipo": { ... } },
  "resumen_etapas":        { "perdidas": { ... }, "consumo": { ... } }
}
```

---

### `services/anomalies.py` — El detector de alertas

Función pública: `detectar(analisis, df_historico?)` → lista de alertas ordenadas por severidad.

Tiene 4 detectores independientes:

**1. Consumo anormal** — Umbral fijo de desviación:
- ≥ 20% de desviación → genera alerta
- Severidad: baja (20–25%), media (25–50%), alta (+50%)

**2. Stock inmovilizado** — Umbral de días sin rotación:
- 30–60 días → severidad media
- +60 días → severidad alta
- Ignora materiales con valor < $100 para evitar ruido

**3. Pérdidas atípicas** — Usa **IQR** (rango intercuartílico):
```
Umbral = Q3 + 1.5 × (Q3 − Q1)
```
Materiales que superan ese umbral son outliers. El **z-score** define si es media (< 2σ) o alta (≥ 2σ).

**4. Costos atípicos vs histórico** — Solo si se pasan datos históricos. Compara el costo unitario actual contra la distribución histórica del material usando z-score. Detecta picos de precio repentinos.

Ejemplo de alerta:
```json
{
  "tipo": "stock_inmovilizado",
  "material": "pintura_epoxi",
  "valor": 8000.0,
  "dias_sin_rotacion": 30,
  "severidad": "media",
  "descripcion": "pintura_epoxi: $8,000.00 inmovilizado (30 días sin rotación)"
}
```

---

### `services/history.py` — La memoria del sistema

Persistencia en SQLite autónoma (usa `sqlite3` de stdlib, sin depender de `db.py` de Oliver).

**Tablas:**

| Tabla | Qué guarda |
|---|---|
| `analisis_historico` | Un registro por cada Excel cargado: totales resumidos + JSON completo |
| `movimientos_historicos` | Cada fila del DataFrame normalizado para estadísticas futuras |

**Funciones de escritura:**

```python
init_tablas()                          # llamar al arrancar la app
guardar_analisis(analisis, anomalias)  # después de analyzer + anomalies; devuelve id
guardar_movimientos(df)                # guarda el DataFrame fila por fila
```

**Funciones de lectura:**

```python
obtener_historial(limite=10)                           # últimos N análisis para el dashboard
obtener_analisis_por_id(id)                            # JSON completo de un análisis anterior
obtener_movimientos_historicos(material?, ultimos_dias=90)  # DataFrame histórico para anomalies.py
tendencia_perdidas(ultimos_n=6)                        # serie de puntos para gráfico de línea
```

---

## Flujo completo de una carga

```python
# 1. Oliver normaliza el Excel
df = normalizer.normalizar(excel_bytes)

# 2. Emmanuel analiza
resultado  = analyzer.analizar(df)
anomalias  = anomalies.detectar(resultado, history.obtener_movimientos_historicos())
analisis_id = history.guardar_analisis(resultado, anomalias)
history.guardar_movimientos(df)

# 3. Jaime explica
texto = explainer.explicar(resultado, anomalias)

# 4. El router devuelve todo al frontend
return { "analisis": resultado, "anomalias": anomalias, "explicacion": texto }
```

---

## Variables de entorno

| Variable | Valor en Docker | Descripción |
|---|---|---|
| `OLLAMA_HOST` | `http://host.docker.internal:11434` | URL de Ollama en el host |

## Levantar el backend

```bash
# Ollama debe correr nativo en Mac primero
ollama serve
ollama pull mistral

# Luego Docker Compose desde la raíz del proyecto
docker compose up --build
```
