// Cloudflare Pages Function — AI Scanner backend
// POST /api/scan
// Body: { image: string (base64 JPEG), mode: 'error_code' | 'parts_snap' | 'test_strip' }
// Env: ANTHROPIC_API_KEY (CF Pages secret)

const CLAUDE_API = 'https://api.anthropic.com/v1/messages';

const PROMPTS = {
  error_code: `You are a pool equipment technician's assistant. Analyze this image of pool equipment and identify any error codes, fault codes, or error messages displayed.

Return ONLY valid JSON in this exact format:
{
  "codes": ["E01", "FLO"],
  "brand": "Hayward",
  "model": "H-Series",
  "context": "Heater showing pressure fault",
  "confidence": "high"
}

Rules:
- codes: array of exact code strings visible (empty array if none found)
- brand: equipment brand if identifiable, null otherwise
- model: model name/series if visible, null otherwise
- context: brief description of what you see (20 words max)
- confidence: "high" if codes are clearly visible, "medium" if partially visible, "low" if uncertain

If you cannot identify any codes or pool equipment, return: {"codes":[],"brand":null,"model":null,"context":"No error code visible","confidence":"low"}`,

  parts_snap: `You are a pool equipment parts identification specialist. Analyze this image and identify the pool equipment part or component shown.

Return ONLY valid JSON in this exact format:
{
  "manufacturer": "Hayward",
  "category": "pump",
  "component": "impeller",
  "model": "Super Pump SP2607X10",
  "partNumber": "SPX2607C",
  "description": "1 HP impeller for Super Pump",
  "condition": "worn",
  "replacementNotes": "Check for wear marks on vanes; replace annually if running 8+ hours daily",
  "searchTerms": ["hayward impeller", "SPX2607C", "super pump impeller"],
  "confidence": "high"
}

Rules:
- manufacturer: brand name or null
- category: one of pump, filter, heater, cleaner, valve, motor, seal, impeller, basket, gauge, o-ring, controller, sensor, other
- component: specific part name
- model: equipment model this belongs to (null if unknown)
- partNumber: OEM part number if visible or identifiable (null if unknown)
- description: what this part does (15 words max)
- condition: new, good, worn, damaged, unknown
- replacementNotes: when/why to replace this (20 words max, null if not applicable)
- searchTerms: 2-4 search strings that would find this part online
- confidence: high/medium/low

If image does not show pool equipment: {"manufacturer":null,"category":"other","component":"unknown","model":null,"partNumber":null,"description":"Not a pool part","condition":"unknown","replacementNotes":null,"searchTerms":[],"confidence":"low"}`,

  test_strip: `You are a pool water chemistry analyzer. The user has photographed a pool test strip. Read the color blocks and estimate the water chemistry values.

Return ONLY valid JSON in this exact format:
{
  "fc": 3.0,
  "ph": 7.4,
  "ta": 100,
  "ch": 250,
  "cya": 40,
  "notes": "pH slightly high, FC adequate",
  "confidence": "medium",
  "disclaimer": "Visual strip reading is approximate; verify with drop-test kit for critical adjustments"
}

Rules:
- fc: Free Chlorine in ppm (typical range 1-10, null if not visible)
- ph: pH value (typical range 6.8-8.2, null if not visible)
- ta: Total Alkalinity in ppm (typical range 60-180, null if not visible)
- ch: Calcium Hardness in ppm (typical range 150-400, null if not visible)
- cya: Cyanuric Acid / Stabilizer in ppm (typical range 20-100, null if not visible)
- notes: 1-2 sentence plain-english summary of water state
- confidence: low (strip reading is inherently imprecise — almost always use low or medium)
- disclaimer: always include the standard accuracy disclaimer

If image is not a test strip: {"fc":null,"ph":null,"ta":null,"ch":null,"cya":null,"notes":"No test strip visible","confidence":"low","disclaimer":"Please photograph the test strip clearly"}`
};

export async function onRequestPost({ request, env }) {
  // CORS
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': (origin.includes('splashlens') || origin.includes('poolens')) ? origin : 'https://poolens.pages.dev',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI scanner not configured', offline: true }), { status: 503, headers: corsHeaders });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: corsHeaders });
  }

  const { image, mode = 'error_code' } = body;
  if (!image) return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400, headers: corsHeaders });
  if (!PROMPTS[mode]) return new Response(JSON.stringify({ error: 'Unknown mode' }), { status: 400, headers: corsHeaders });

  // Strip data URL prefix if present
  const base64 = image.replace(/^data:image\/\w+;base64,/, '');

  try {
    const apiRes = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: PROMPTS[mode] }
          ]
        }]
      })
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      console.error('Anthropic API error:', apiRes.status, err);
      return new Response(JSON.stringify({ error: 'AI service error', status: apiRes.status }), { status: 502, headers: corsHeaders });
    }

    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: 'AI response parse failed', raw: text.slice(0, 200) }), { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true, mode, result: parsed }), { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Scan worker error:', err);
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), { status: 500, headers: corsHeaders });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
