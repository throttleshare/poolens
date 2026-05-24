// PoolLens app.js — field intelligence UI logic

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
const S = {
  tab: 'errors',
  brand: null,
  category: null,
  shape: null,
  slamType: null,
  clType: 'opening',
  checklists: { opening: {}, closing: {}, weekly: {}, monthly: {} },
  pool: null,      // currently viewed pool id
  poolView: 'list', // 'list' | 'detail' | 'new' | 'edit'
};

const CL_MAP = {
  opening: { data: () => window.OPENING_CHECKLIST, key: 'poolens-cl-opening', label: 'Opening Checklist', freq: 'Season Progress' },
  closing: { data: () => window.CLOSING_CHECKLIST, key: 'poolens-cl-closing', label: 'Closing Checklist', freq: 'Season Progress' },
  weekly:  { data: () => window.WEEKLY_CHECKLIST,  key: 'poolens-cl-weekly',  label: 'Weekly Checklist',  freq: 'This Week'       },
  monthly: { data: () => window.MONTHLY_CHECKLIST, key: 'poolens-cl-monthly', label: 'Monthly Checklist', freq: 'This Month'      },
};

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initErrors();
  initDosing();
  initVolume();
  initSandFilter();
  initGuide();
  initReport();
  loadPersistedVolume();
  initPools();
});

// ═══════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`tab-${name}`);
  const btn   = document.getElementById(`nav-${name}`);
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');
  S.tab = name;
  window.scrollTo(0, 0);
}

// ═══════════════════════════════════════════
// PERSISTENT POOL VOLUME
// ═══════════════════════════════════════════
function onVolumeChange(val) {
  const n = parseFloat(val);
  if (n > 0) {
    localStorage.setItem('poolens-vol', val);
    const badge = document.getElementById('pool-vol-badge');
    const disp  = document.getElementById('pool-vol-display');
    if (badge) badge.style.display = '';
    if (disp)  disp.textContent = Number(n).toLocaleString() + ' gal';
    // Sync to SLAM volume if empty
    const sv = document.getElementById('slam-volume');
    if (sv && !sv.value) sv.value = val;
  }
}

function loadPersistedVolume() {
  const saved = localStorage.getItem('poolens-vol');
  if (!saved) return;
  const el = document.getElementById('dose-volume');
  if (el) { el.value = saved; onVolumeChange(saved); }
}

function focusVolumeInput() {
  showTab('dosing');
  setTimeout(() => {
    const el = document.getElementById('dose-volume');
    if (el) { el.focus(); el.select(); }
  }, 80);
}

// ═══════════════════════════════════════════
// ERROR CODES
// ═══════════════════════════════════════════
function initErrors() {
  renderBrandGrid();
}

function renderBrandGrid() {
  const el = document.getElementById('brand-grid');
  el.innerHTML = Object.entries(window.ERROR_DB).map(([id, b]) =>
    `<button class="brand-btn" id="brand-${id}" onclick="selectBrand('${id}')">${b.label}</button>`
  ).join('');
}

function selectBrand(id) {
  // Toggle off
  if (S.brand === id) {
    resetBrandBtn(id);
    S.brand = null;
    S.category = null;
    document.getElementById('category-strip').style.display = 'none';
    document.getElementById('error-results').innerHTML = emptyState();
    document.getElementById('error-search').value = '';
    document.getElementById('search-clear').style.display = 'none';
    return;
  }
  // Deactivate previous
  if (S.brand) resetBrandBtn(S.brand);
  S.brand = id;
  S.category = null;
  // Activate selected
  const brand = window.ERROR_DB[id];
  const btn = document.getElementById(`brand-${id}`);
  btn.style.background = brand.color + '22';
  btn.style.borderColor = brand.color;
  btn.style.color = brand.color;
  renderCategoryStrip(id);
  renderCodesForBrand(id, null);
}

function resetBrandBtn(id) {
  const btn = document.getElementById(`brand-${id}`);
  if (!btn) return;
  btn.style.background = '';
  btn.style.borderColor = '';
  btn.style.color = '';
}

function renderCategoryStrip(brandId) {
  const brand = window.ERROR_DB[brandId];
  const cats  = Object.keys(brand.categories);
  const strip = document.getElementById('category-strip');
  strip.style.display = '';
  strip.innerHTML = `<div style="display:flex;gap:7px;padding:2px 0;">
    <button class="cat-pill active" id="cat-all" onclick="selectCategory(null)">All</button>
    ${cats.map(c => `<button class="cat-pill" id="cat-${slug(c)}" onclick="selectCategory('${esc(c)}')">${c}</button>`).join('')}
  </div>`;
}

function selectCategory(cat) {
  S.category = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  const targetId = cat ? `cat-${slug(cat)}` : 'cat-all';
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
  if (S.brand) renderCodesForBrand(S.brand, cat);
}

function renderCodesForBrand(brandId, catFilter) {
  const brand = window.ERROR_DB[brandId];
  let html = '';
  Object.entries(brand.categories).forEach(([catName, cat]) => {
    if (catFilter && catName !== catFilter) return;
    html += `
      <div style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${brand.color};flex-shrink:0;display:inline-block;"></span>
          <span style="color:#0f172a;font-weight:800;font-size:13px;">${catName}</span>
        </div>
        ${cat.note ? `<div class="warn-box" style="margin-bottom:8px;font-size:11px;">${cat.note}</div>` : ''}
        <p style="color:#64748b;font-size:11px;margin-bottom:8px;">Models: ${cat.models.slice(0,5).join(' · ')}${cat.models.length > 5 ? ` +${cat.models.length - 5}` : ''}</p>
        ${cat.codes.map((c, i) => codeCard(c, `${brandId}-${slug(catName)}-${i}`, brand.color)).join('')}
      </div>`;
  });
  if (!html) html = `<p style="color:#64748b;text-align:center;padding:32px;">No codes in this category.</p>`;
  document.getElementById('error-results').innerHTML = html;
}

function codeCard(code, uid, brandColor) {
  const isLED = code.code.startsWith('LED:') || code.code.startsWith('No ');
  const sevClass = { low: 'badge-low', medium: 'badge-med', high: 'badge-high' }[code.severity] || 'badge-med';
  return `
    <div class="error-card" style="border-left:3px solid ${brandColor};">
      <button class="error-toggle" onclick="toggleCode('${uid}')">
        <div style="flex:1;">
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:5px;align-items:center;">
            <span class="badge ${isLED ? 'badge-led' : ''}" style="${!isLED ? `background:#f1f5f9;color:#374151;border:1px solid #e2e8f0;font-size:11px;` : ''}">${code.code}</span>
            <span class="badge ${sevClass}">${code.severity}</span>
            ${code.callpro ? `<span class="badge badge-pro">Call Pro</span>` : ''}
          </div>
          <span style="color:#1e293b;font-size:14px;font-weight:600;">${code.name}</span>
        </div>
        <svg id="chev-${uid}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;margin-top:3px;transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div id="det-${uid}" class="error-detail">
        <div style="padding-top:12px;">
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;">Possible Causes</p>
          <ul style="list-style:none;">
            ${code.causes.map(c => `<li style="display:flex;gap:7px;padding:3px 0;font-size:13px;color:#374151;"><span style="color:#dc2626;flex-shrink:0;margin-top:1px;">•</span>${c}</li>`).join('')}
          </ul>
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin:12px 0 7px;">Fix Steps</p>
          <ol style="list-style:none;">
            ${code.fix.map((f, i) => `<li style="display:flex;gap:8px;padding:4px 0;font-size:13px;color:#374151;"><span style="color:#0284c7;font-weight:900;flex-shrink:0;min-width:16px;">${i+1}.</span>${f}</li>`).join('')}
          </ol>
          ${code.callpro ? `<div class="badge-pro" style="margin-top:10px;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:600;text-transform:none;letter-spacing:0;">⚠ This fault typically requires a licensed technician. Do not bypass safety controls.</div>` : ''}
        </div>
      </div>
    </div>`;
}

function toggleCode(uid) {
  const det  = document.getElementById(`det-${uid}`);
  const chev = document.getElementById(`chev-${uid}`);
  const open = det.classList.toggle('open');
  chev.style.transform = open ? 'rotate(180deg)' : '';
}

function onErrorSearch(q) {
  q = q.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear');
  clearBtn.style.display = q ? '' : 'none';
  if (!q) {
    if (S.brand) renderCodesForBrand(S.brand, S.category);
    else document.getElementById('error-results').innerHTML = emptyState();
    return;
  }
  const matches = [];
  Object.entries(window.ERROR_DB).forEach(([brandId, brand]) => {
    Object.entries(brand.categories).forEach(([catName, cat]) => {
      cat.codes.forEach((code, i) => {
        const hay = [code.code, code.name, ...code.causes, ...code.fix].join(' ').toLowerCase();
        if (hay.includes(q)) matches.push({ brandId, brand, catName, code, i });
      });
    });
  });
  if (!matches.length) {
    document.getElementById('error-results').innerHTML =
      `<p style="color:#64748b;text-align:center;padding:40px;font-size:14px;">No results for "${q}"</p>`;
    return;
  }
  document.getElementById('error-results').innerHTML = matches.map(({ brandId, brand, catName, code, i }) =>
    `<div style="margin-bottom:4px;">
       <p style="color:#64748b;font-size:11px;margin-bottom:3px;display:flex;align-items:center;gap:5px;">
         <span style="width:7px;height:7px;border-radius:50%;background:${brand.color};display:inline-block;"></span>
         ${brand.label} — ${catName}
       </p>
       ${codeCard(code, `srch-${brandId}-${i}`, brand.color)}
     </div>`
  ).join('');
}

function clearSearch() {
  const el = document.getElementById('error-search');
  el.value = '';
  document.getElementById('search-clear').style.display = 'none';
  if (S.brand) renderCodesForBrand(S.brand, S.category);
  else document.getElementById('error-results').innerHTML = emptyState();
  el.focus();
}

function emptyState() {
  return `<div style="text-align:center;padding:40px 16px;">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" style="margin:0 auto 14px;display:block;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <p style="font-size:15px;color:#475569;margin-bottom:5px;font-weight:600;">Pick a brand or search</p>
    <p style="font-size:12px;color:#94a3b8;">Hayward · Pentair · Jandy · Maytronics · Aiper · Raypak</p>
  </div>`;
}

// ═══════════════════════════════════════════
// DOSING CALCULATOR
// ═══════════════════════════════════════════
function initDosing() {
  renderSlamTypeBtns();
  renderSlamProducts();
  renderRangesTable();
  renderAdditionOrder();
}

function onParamChange() {
  const p = document.getElementById('dose-param').value;
  let html = '';
  const fld = (label, id, ph, extra = '') =>
    `<div class="field-group"><label class="field-label">${label}</label>
     <input type="number" id="${id}" placeholder="${ph}" min="0" inputmode="decimal" ${extra}></div>`;
  const sel = (label, id, opts) =>
    `<div class="field-group"><label class="field-label">${label}</label>
     <select id="${id}">${opts}</select></div>`;

  switch (p) {
    case 'fc':
      html += fld('Current FC (ppm)', 'dose-cur', 'e.g. 1');
      html += fld('Target FC (ppm)', 'dose-tgt', 'e.g. 5');
      html += sel('Chlorine Product', 'dose-prod',
        window.CHEM_DATA.dosing.fc.products.map(x => `<option value="${x.id}">${x.label} (${x.unit})</option>`).join(''));
      break;
    case 'ph_lower':
      html += fld('Current pH', 'dose-cur', 'e.g. 7.8', 'step="0.1"');
      html += fld('Target pH', 'dose-tgt', 'e.g. 7.4', 'step="0.1"');
      html += fld('TA Level (ppm)', 'dose-ta', 'e.g. 100');
      html += sel('Product', 'dose-prod',
        window.CHEM_DATA.dosing.ph.lower.map(x => `<option value="${x.id}">${x.label}</option>`).join(''));
      break;
    case 'ph_raise':
      html += fld('Current pH', 'dose-cur', 'e.g. 7.2', 'step="0.1"');
      html += fld('Target pH', 'dose-tgt', 'e.g. 7.4', 'step="0.1"');
      html += sel('Product', 'dose-prod',
        window.CHEM_DATA.dosing.ph.raise.map(x => `<option value="${x.id}">${x.label}</option>`).join(''));
      break;
    case 'ta':
      html += fld('Current TA (ppm)', 'dose-cur', 'e.g. 60');
      html += fld('Target TA (ppm)', 'dose-tgt', 'e.g. 100');
      break;
    case 'ch':
      html += fld('Current CH (ppm)', 'dose-cur', 'e.g. 150');
      html += fld('Target CH (ppm)', 'dose-tgt', 'e.g. 300');
      break;
    case 'cya':
      html += fld('Current CYA (ppm)', 'dose-cur', 'e.g. 20');
      html += fld('Target CYA (ppm)', 'dose-tgt', 'e.g. 50');
      break;
  }
  document.getElementById('dose-fields').innerHTML = html;
  document.getElementById('dose-result').innerHTML = '';
}

function calculateDose() {
  const param  = gv('dose-param');
  const volume = gf('dose-volume');
  const cur    = gf('dose-cur');
  const tgt    = gf('dose-tgt');

  if (!param)        return setEl('dose-result', errorBox('Select a parameter first.'));
  if (!volume || volume <= 0) return setEl('dose-result', errorBox('Enter pool volume in gallons.'));
  if (isNaN(cur) || isNaN(tgt)) return setEl('dose-result', errorBox('Enter current and target levels.'));

  const vf = volume / 10000;
  let amount, unit, product, note, basis;

  switch (param) {
    case 'fc': {
      const delta = tgt - cur;
      if (delta <= 0) return setEl('dose-result', infoBox('FC is at or above target.', 'Stop adding chlorine. Let sunlight and usage reduce it naturally. Do not add sequestrants.'));
      const pid = gv('dose-prod');
      const p   = window.CHEM_DATA.dosing.fc.products.find(x => x.id === pid);
      if (!p)   return setEl('dose-result', errorBox('Select a product.'));
      amount  = delta * vf * p.factor;
      unit    = p.unit;
      product = p.label;
      note    = p.note;
      basis   = `${volume.toLocaleString()} gal · raising FC by ${delta.toFixed(1)} ppm`;
      break;
    }
    case 'ph_lower': {
      const delta = cur - tgt;
      if (delta <= 0) return setEl('dose-result', infoBox('pH is at or below target.', ''));
      const ta     = gf('dose-ta') || 100;
      const pid    = gv('dose-prod');
      if (pid === 'muriaticAcid') {
        amount  = (delta / 0.1) * vf * interpMuriatic(ta);
        unit    = 'fl oz';
        product = 'Muriatic Acid 31.45%';
        note    = 'Pre-dilute in a bucket of water first. Add slowly with pump running. Wait 30 min and retest.';
      } else {
        const murOz = (delta / 0.1) * vf * interpMuriatic(ta);
        amount  = murOz * 0.80;
        unit    = 'oz dry';
        product = 'Dry Acid (Sodium Bisulfate)';
        note    = 'Broadcast across surface with pump running. Safer to handle than muriatic.';
      }
      basis = `${volume.toLocaleString()} gal · lowering pH by ${delta.toFixed(2)} · TA ${ta} ppm`;
      break;
    }
    case 'ph_raise': {
      const delta = tgt - cur;
      if (delta <= 0) return setEl('dose-result', infoBox('pH is at or above target.', ''));
      amount  = (delta / 0.1) * vf * window.CHEM_DATA.dosing.ph.sodaAshFactor;
      unit    = 'oz dry';
      product = 'Soda Ash (pH Up)';
      note    = 'Broadcast across the deep end with pump running. Also raises TA slightly.';
      basis   = `${volume.toLocaleString()} gal · raising pH by ${delta.toFixed(2)}`;
      break;
    }
    case 'ta': {
      const delta = tgt - cur;
      if (delta <= 0) return setEl('dose-result', infoBox('TA is at or above target.', 'To lower TA: add muriatic acid, then aerate to bring pH back up. Multiple doses needed.'));
      amount  = (delta / 10) * vf * window.CHEM_DATA.dosing.ta.raise[0].factor;
      unit    = 'lbs';
      product = 'Baking Soda (Sodium Bicarbonate)';
      note    = 'Broadcast across the surface. Retest in 1 hour. Minor pH rise expected.';
      basis   = `${volume.toLocaleString()} gal · raising TA by ${delta} ppm`;
      break;
    }
    case 'ch': {
      const delta = tgt - cur;
      if (delta <= 0) return setEl('dose-result', infoBox('CH is at or above target.', 'Only way to lower CH is to drain and dilute with fresh water.'));
      amount  = (delta / 10) * vf * window.CHEM_DATA.dosing.ch.raise[0].factor;
      unit    = 'lbs';
      product = 'Calcium Chloride';
      note    = '⚠ Extremely exothermic. Always pre-dissolve in a bucket of water before adding. Never add dry directly to pool.';
      basis   = `${volume.toLocaleString()} gal · raising CH by ${delta} ppm`;
      break;
    }
    case 'cya': {
      const delta = tgt - cur;
      if (delta <= 0) return setEl('dose-result', infoBox('CYA is at or above target.', 'To lower CYA: drain 20-30% and refill. No chemical removes CYA.'));
      amount  = (delta / 10) * vf * window.CHEM_DATA.dosing.cya.raise[0].factor;
      unit    = 'lbs';
      product = 'Cyanuric Acid (Stabilizer)';
      note    = 'Place in a sock in the skimmer basket. Dissolves slowly — takes 1-2 weeks. Retest accurately after 7 days.';
      basis   = `${volume.toLocaleString()} gal · raising CYA by ${delta} ppm`;
      break;
    }
  }

  if (!amount || amount <= 0) return setEl('dose-result', errorBox('No addition needed or check your inputs.'));
  setEl('dose-result', resultCard(amount, unit, product, note, basis));
}

function resultCard(amount, unit, product, note, basis) {
  const { main, alt } = fmtAmt(amount, unit);
  const raw = main;
  return `
    <div class="result-wrap">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;">
        <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">Dose Required</p>
        <button class="copy-btn" onclick="copyText('${raw.replace(/'/g, "\\'")}', this)">Copy</button>
      </div>
      <p class="result-amount">${main}</p>
      ${alt ? `<p class="result-alt">${alt}</p>` : ''}
      <p class="result-product">${product}</p>
      ${note ? `<div class="result-note">${note}</div>` : ''}
      <p class="result-basis">${basis}</p>
    </div>`;
}

// ═══════════════════════════════════════════
// SLAM CALCULATOR
// ═══════════════════════════════════════════
function renderSlamTypeBtns() {
  document.getElementById('slam-type-btns').innerHTML =
    Object.entries(window.CHEM_DATA.slam).map(([id, t]) =>
      `<button class="slam-btn" id="slam-${id}" onclick="selectSlamType('${id}')">${t.label}</button>`
    ).join('');
}

function renderSlamProducts() {
  const opts = window.CHEM_DATA.dosing.fc.products
    .filter(p => p.unit === 'fl oz')
    .map(p => `<option value="${p.id}">${p.label}</option>`).join('');
  document.getElementById('slam-product').innerHTML = opts;
}

function selectSlamType(id) {
  S.slamType = id;
  document.querySelectorAll('.slam-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`slam-${id}`);
  if (btn) btn.classList.add('active');
}

function calculateSlam() {
  const cya  = gf('slam-cya');
  const curFC = gf('slam-current-fc');
  const vol  = gf('slam-volume');
  const pid  = gv('slam-product');

  if (isNaN(cya) || cya <= 0) return setEl('slam-result', errorBox('Enter your CYA level.'));
  if (!S.slamType)             return setEl('slam-result', errorBox('Select a SLAM type.'));
  if (isNaN(vol) || vol <= 0)  return setEl('slam-result', errorBox('Enter pool volume.'));

  const def     = window.CHEM_DATA.slam[S.slamType];
  const targetFC = Math.round(cya * def.mult);
  const currentFC = isNaN(curFC) ? 0 : curFC;
  const delta    = Math.max(0, targetFC - currentFC);
  const product  = window.CHEM_DATA.dosing.fc.products.find(p => p.id === pid);

  let addHtml = '';
  if (delta > 0 && product) {
    const amt = delta * (vol / 10000) * product.factor;
    const { main, alt } = fmtAmt(amt, product.unit);
    addHtml = `
      <div class="result-wrap" style="margin-top:12px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;">
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">Add Now</p>
          <button class="copy-btn" onclick="copyText('${main.replace(/'/g, "\\'")}', this)">Copy</button>
        </div>
        <p class="result-amount">${main}</p>
        ${alt ? `<p class="result-alt">${alt}</p>` : ''}
        <p class="result-product">${product.label}</p>
      </div>`;
  } else if (delta === 0) {
    addHtml = `<div class="info-box" style="margin-top:10px;">FC is already at SLAM level. Maintain and test every 4-6 hours.</div>`;
  }

  setEl('slam-result', `
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <p style="color:#0369a1;font-weight:800;font-size:14px;margin-bottom:12px;">${def.label}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;text-align:center;">
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">SLAM Target FC</p>
          <p style="color:#0f172a;font-size:28px;font-weight:900;">${targetFC} <span style="font-size:14px;color:#64748b;">ppm</span></p>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;text-align:center;">
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;">Need to Add</p>
          <p style="color:${delta > 0 ? '#d97706' : '#166534'};font-size:28px;font-weight:900;">${delta} <span style="font-size:14px;color:#64748b;">ppm</span></p>
        </div>
      </div>
      ${addHtml}
      <div class="info-box" style="margin-top:10px;font-size:11px;">${def.note}</div>
      <p style="color:#94a3b8;font-size:10px;margin-top:8px;">OCLT: After SLAM, test FC at dusk and dawn. Pass = loss &lt; 1 ppm overnight.</p>
    </div>`);
}

// ═══════════════════════════════════════════
// RANGES TABLE
// ═══════════════════════════════════════════
function renderRangesTable() {
  const ranges = window.CHEM_DATA.ranges;
  const labels = { fc:'Free Chlorine', cc:'Combined Chlorine', ph:'pH', ta:'Total Alkalinity', ch:'Calcium Hardness', cya:'CYA / Stabilizer' };
  const rows = ['fc','ph','ta','ch','cya','cc'].map(k => {
    const r = ranges[k];
    return `<div class="range-row">
      <div>
        <p style="color:#1e293b;font-size:13px;font-weight:600;">${labels[k] || k.toUpperCase()}</p>
        ${r.note ? `<p style="color:#94a3b8;font-size:10px;margin-top:1px;">${r.note}</p>` : ''}
      </div>
      <span class="range-pill range-ok">${r.ideal} ${r.unit}</span>
    </div>`;
  }).join('');
  setEl('ranges-table', rows);
}

// ═══════════════════════════════════════════
// ADDITION ORDER
// ═══════════════════════════════════════════
function renderAdditionOrder() {
  setEl('addition-order',
    window.CHEM_DATA.additionOrder.map(s => `
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9;">
        <div style="width:26px;height:26px;min-width:26px;border-radius:50%;background:linear-gradient(135deg,#0284c7,#0369a1);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">${s.step}</div>
        <div>
          <p style="color:#0f172a;font-size:13px;font-weight:700;">${s.chem}</p>
          <p style="color:#0284c7;font-size:11px;margin-top:1px;">Wait: ${s.wait}</p>
          <p style="color:#64748b;font-size:12px;margin-top:3px;line-height:1.4;">${s.reason}</p>
        </div>
      </div>`).join(''));
}

// ═══════════════════════════════════════════
// VOLUME CALCULATOR
// ═══════════════════════════════════════════
const SHAPE_ICONS = { rectangle:'▬', oval:'⬬', round:'●', kidney:'⁀', lshape:'⌐', freeform:'〜' };
const FIELD_LABELS = {
  length:'Length (ft)', width:'Width (ft)', shallowEnd:'Shallow End (ft)', deepEnd:'Deep End (ft)',
  diameter:'Diameter (ft)', length1:'Section 1 Length (ft)', width1:'Section 1 Width (ft)',
  length2:'Section 2 Length (ft)', width2:'Section 2 Width (ft)', surfaceAreaEst:'Surface Area Est (sq ft)'
};

function initVolume() {
  renderShapeGrid();
}

function renderShapeGrid() {
  setEl('shape-grid',
    window.POOL_VOLUME_DATA.shapes.map(s => `
      <button class="shape-btn" id="shape-${s.id}" onclick="selectShape('${s.id}')">
        <div style="font-size:22px;margin-bottom:5px;">${SHAPE_ICONS[s.id] || '⬛'}</div>
        ${s.label}
      </button>`).join(''));
}

function selectShape(id) {
  S.shape = id;
  document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`shape-${id}`).classList.add('active');
  const shape = window.POOL_VOLUME_DATA.shapes.find(s => s.id === id);
  const fields = shape.fields.map(f => `
    <div class="field-group">
      <label class="field-label">${FIELD_LABELS[f] || f}</label>
      <input type="number" id="vol-${f}" placeholder="feet" min="0" step="0.5" inputmode="decimal" oninput="autoCalcVol()">
    </div>`).join('');
  setEl('shape-fields', `
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <p style="color:#64748b;font-size:12px;margin-bottom:14px;">💡 ${shape.tip}</p>
      ${fields}
      <button class="btn-calc" onclick="calcVolume()">Calculate Gallons</button>
    </div>`);
  setEl('vol-result', '');
}

function autoCalcVol() {
  const shape = window.POOL_VOLUME_DATA.shapes.find(s => s.id === S.shape);
  if (!shape) return;
  if (shape.fields.every(f => { const v = gf(`vol-${f}`); return !isNaN(v) && v > 0; })) calcVolume();
}

function calcVolume() {
  const shape = window.POOL_VOLUME_DATA.shapes.find(s => s.id === S.shape);
  if (!shape) return setEl('vol-result', errorBox('Select a pool shape first.'));
  const vals = shape.fields.map(f => gf(`vol-${f}`));
  if (vals.some(v => isNaN(v) || v <= 0)) return setEl('vol-result', errorBox('Fill in all dimensions.'));
  const gallons = shape.formula(...vals);
  if (isNaN(gallons) || gallons <= 0) return setEl('vol-result', errorBox('Check your measurements.'));
  const cubicFt = (gallons / 7.48).toFixed(0);
  const display = Math.round(gallons).toLocaleString();
  setEl('vol-result', `
    <div class="result-wrap" style="text-align:center;">
      <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Estimated Volume</p>
      <p style="font-size:52px;font-weight:900;color:#0369a1;line-height:1;letter-spacing:-2px;">${display}</p>
      <p style="color:#0284c7;font-size:17px;font-weight:600;margin-top:4px;">gallons</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:6px;">${cubicFt} cubic feet</p>
      <div class="result-note" style="text-align:left;margin-top:14px;">
        Use this number in the Dosing tab for accurate chemical calculations.
        <button onclick="useVolumeInDosing(${Math.round(gallons)})" style="display:block;margin-top:8px;background:#eff6ff;border:1px solid #93c5fd;border-radius:6px;color:#0369a1;font-size:11px;font-weight:800;padding:5px 12px;cursor:pointer;width:100%;">
          → Use in Dosing Calculator
        </button>
      </div>
    </div>`);
}

function useVolumeInDosing(gallons) {
  const el = document.getElementById('dose-volume');
  if (el) { el.value = gallons; onVolumeChange(gallons); }
  showTab('dosing');
}

// ═══════════════════════════════════════════
// SAND FILTER
// ═══════════════════════════════════════════
function initSandFilter() {
  renderSandTable();
  renderAltMedia();
}

function renderSandTable() {
  const data = window.SAND_FILTER_DATA.sandByDiameter;
  const rows = data.map((r, i) => `
    <tr class="sand-row" onclick="tapSandRow(${r.dia})" style="background:${i % 2 ? '#f8fafc' : '#ffffff'};">
      <td style="padding:8px 12px;color:#0f172a;font-weight:800;">${r.dia}"</td>
      <td style="padding:8px 12px;color:#0369a1;font-weight:700;">${r.sand} lbs</td>
      <td style="padding:8px 12px;color:#374151;">${r.flow}</td>
      <td style="padding:8px 12px;color:#64748b;">${r.sqft} ft²</td>
    </tr>`).join('');
  setEl('sand-quick-table', `
    <thead>
      <tr style="background:#f1f5f9;border-bottom:2px solid #e2e8f0;">
        <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Dia</th>
        <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Sand</th>
        <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Flow</th>
        <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Sq Ft</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>`);
}

function tapSandRow(dia) {
  const el = document.getElementById('sand-dia');
  if (el) el.value = dia;
  lookupSandFilter(dia);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function lookupSandFilter(dia) {
  dia = parseInt(dia);
  if (!dia || dia < 10) { setEl('sand-result', ''); return; }
  const data = window.SAND_FILTER_DATA.sandByDiameter;
  let match = data.find(d => d.dia === dia);
  let approx = false;
  if (!match) {
    match = data.reduce((p, c) => Math.abs(c.dia - dia) < Math.abs(p.dia - dia) ? c : p);
    approx = true;
  }
  const signs = window.SAND_FILTER_DATA.replacement.signs;
  setEl('sand-result', `
    <div class="result-wrap" style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">Sand Required${approx ? ` (nearest: ${match.dia}")` : ''}</p>
          <p class="result-amount" style="font-size:40px;">${match.sand} lbs</p>
          <p class="result-alt">#20 Silica Sand · ${match.dia}" tank</p>
        </div>
        <div style="text-align:right;">
          <p style="color:#0f172a;font-size:16px;font-weight:800;">${match.flow}</p>
          <p style="color:#94a3b8;font-size:11px;">flow rate</p>
          <p style="color:#64748b;font-size:12px;margin-top:6px;">${match.sqft} sq ft</p>
        </div>
      </div>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 12px;">
        <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">Common Models</p>
        <p style="color:#0369a1;font-size:12px;line-height:1.5;">${match.commonModels.join(' · ')}</p>
      </div>
    </div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <p style="color:#92400e;font-size:12px;font-weight:700;margin-bottom:8px;">Signs Sand Needs Replacing</p>
      ${signs.map(s => `<p style="color:#374151;font-size:12px;padding:3px 0;display:flex;gap:7px;"><span style="color:#dc2626;">•</span>${s}</p>`).join('')}
      <p style="color:#94a3b8;font-size:10px;margin-top:8px;">Residential: 3–5 years · Commercial: 1–2 years</p>
    </div>`);
}

function renderAltMedia() {
  setEl('alt-media-section', `
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <p style="color:#0369a1;font-weight:800;font-size:13px;margin-bottom:12px;">Alternative Filter Media</p>
      ${window.SAND_FILTER_DATA.alternatMedia.map(m => `
        <div style="padding:9px 0;border-bottom:1px solid #f1f5f9;">
          <p style="color:#0f172a;font-size:13px;font-weight:700;">${m.name}</p>
          <p style="color:#0284c7;font-size:11px;font-family:monospace;margin-top:3px;">${m.amount}</p>
          <p style="color:#64748b;font-size:12px;margin-top:3px;line-height:1.4;">${m.note}</p>
        </div>`).join('')}
    </div>`);
}

// ═══════════════════════════════════════════
// OPENING CHECKLIST
// ═══════════════════════════════════════════
function initGuide() {
  // Migrate old single-key format to per-type keys
  const old = localStorage.getItem('poolens-cl');
  if (old) { localStorage.setItem('poolens-cl-opening', old); localStorage.removeItem('poolens-cl'); }
  Object.keys(CL_MAP).forEach(type => {
    try { S.checklists[type] = JSON.parse(localStorage.getItem(CL_MAP[type].key) || '{}'); }
    catch(e) { S.checklists[type] = {}; }
  });
  renderChecklist();
}

function switchClType(type) {
  S.clType = type;
  ['opening','closing','weekly','monthly'].forEach(t => {
    const btn = document.getElementById(`cl-btn-${t}`);
    if (btn) btn.classList.toggle('active', t === type);
  });
  const meta = CL_MAP[type];
  setEl('cl-title', meta.label);
  const freq = document.getElementById('cl-freq-label');
  if (freq) freq.textContent = meta.freq;
  renderChecklist();
}

function renderChecklist() {
  const phases = CL_MAP[S.clType].data();
  const cl = S.checklists[S.clType];
  setEl('checklist-content',
    phases.map((phase, pi) => `
      <div style="margin-bottom:16px;">
        <div style="border-left:3px solid #0284c7;padding:9px 12px;background:#eff6ff;border-radius:0 8px 8px 0;margin-bottom:8px;">
          <p style="color:#0369a1;font-weight:800;font-size:13px;">${phase.phase}</p>
        </div>
        ${phase.steps.map((step, si) => {
          const k = `${pi}-${si}`;
          const done = !!cl[k];
          return `<div id="cli-${k}" class="cl-item${done ? ' done' : ''}" onclick="toggleItem(${pi},${si})">
            <input type="checkbox" id="chk-${k}" ${done ? 'checked' : ''} onclick="event.stopPropagation();toggleItem(${pi},${si})">
            <span class="cl-text">${step}</span>
          </div>`;
        }).join('')}
      </div>`).join(''));
  updateProgress();
}

function toggleItem(pi, si) {
  const k = `${pi}-${si}`;
  const cl = S.checklists[S.clType];
  cl[k] = !cl[k];
  localStorage.setItem(CL_MAP[S.clType].key, JSON.stringify(cl));
  const row = document.getElementById(`cli-${k}`);
  const chk = document.getElementById(`chk-${k}`);
  if (row) row.classList.toggle('done', !!cl[k]);
  if (chk) chk.checked = !!cl[k];
  updateProgress();
}

function updateProgress() {
  const phases = CL_MAP[S.clType].data();
  const cl = S.checklists[S.clType];
  let total = 0, done = 0;
  phases.forEach((phase, pi) =>
    phase.steps.forEach((_, si) => { total++; if (cl[`${pi}-${si}`]) done++; }));
  setEl('progress-text', `${done} / ${total}`);
  const pct = total ? (done / total * 100) : 0;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = `${pct}%`;
  const txt = document.getElementById('progress-text');
  if (txt) txt.style.color = (done === total && total > 0) ? '#166534' : '#0369a1';
}

function resetChecklist() {
  if (!confirm(`Reset ${CL_MAP[S.clType].label}?`)) return;
  S.checklists[S.clType] = {};
  localStorage.removeItem(CL_MAP[S.clType].key);
  renderChecklist();
}

// ═══════════════════════════════════════════
// VISIT REPORT
// ═══════════════════════════════════════════
let _chemRowId = 0;

function initReport() {
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('rpt-date');
  if (dateEl && !dateEl.value) dateEl.value = today;
  addChemRow();
}

function addChemRow() {
  _chemRowId++;
  const id = _chemRowId;
  const container = document.getElementById('chem-rows');
  if (!container) return;
  const div = document.createElement('div');
  div.id = `chem-row-${id}`;
  div.style.cssText = 'display:grid;grid-template-columns:1fr 90px 36px;gap:6px;margin-bottom:8px;align-items:center;';
  div.innerHTML = `
    <input type="text" id="cr-name-${id}" placeholder="Chemical name..." style="background:#ffffff;border:1px solid #cbd5e1;color:#0f172a;border-radius:9px;padding:10px 12px;font-size:14px;font-family:inherit;width:100%;">
    <input type="text" id="cr-amt-${id}"  placeholder="Amount" inputmode="decimal" style="background:#ffffff;border:1px solid #cbd5e1;color:#0f172a;border-radius:9px;padding:10px 12px;font-size:14px;font-family:inherit;width:100%;">
    <button type="button" onclick="removeChemRow(${id})" style="background:#180000;border:1px solid #7f1d1d;color:#f87171;border-radius:8px;padding:0;height:36px;width:36px;cursor:pointer;font-size:18px;line-height:1;">×</button>`;
  container.appendChild(div);
}

function removeChemRow(id) {
  const row = document.getElementById(`chem-row-${id}`);
  if (row) row.remove();
}

function _rptVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

function buildReportText() {
  const customer = _rptVal('rpt-customer') || 'Customer';
  const address  = _rptVal('rpt-address');
  const tech     = _rptVal('rpt-tech') || 'Tech';
  const rawDate  = _rptVal('rpt-date');
  const date     = rawDate ? new Date(rawDate + 'T12:00:00').toLocaleDateString() : new Date().toLocaleDateString();
  const type     = _rptVal('rpt-type');
  const work     = _rptVal('rpt-work');
  const equip    = _rptVal('rpt-equip');
  const rec      = _rptVal('rpt-rec');
  const rawNext  = _rptVal('rpt-next');
  const next     = rawNext ? new Date(rawNext + 'T12:00:00').toLocaleDateString() : '';

  const readings = [
    ['FC', _rptVal('rpt-fc')], ['CC', _rptVal('rpt-cc')], ['pH', _rptVal('rpt-ph')],
    ['TA', _rptVal('rpt-ta')], ['CH', _rptVal('rpt-ch')], ['CYA', _rptVal('rpt-cya')]
  ].filter(([,v]) => v).map(([l,v]) => `${l}: ${v}`).join('  |  ');

  const chems = [];
  document.querySelectorAll('[id^="chem-row-"]').forEach(row => {
    const rid  = row.id.replace('chem-row-', '');
    const name = _rptVal(`cr-name-${rid}`);
    const amt  = _rptVal(`cr-amt-${rid}`);
    if (name) chems.push(`  • ${name}${amt ? ' — ' + amt : ''}`);
  });

  const HR = '─'.repeat(42);
  const lines = [
    `POOL SERVICE REPORT`, date,
    HR,
    `Customer : ${customer}`,
    ...(address ? [`Address  : ${address}`] : []),
    `Tech     : ${tech}`,
    `Visit    : ${type}`,
    '',
    ...(readings ? ['WATER READINGS:', readings, ''] : []),
    ...(chems.length ? ['CHEMICALS ADDED:', ...chems, ''] : []),
    ...(work  ? ['WORK PERFORMED:', work, '']  : []),
    ...(equip ? ['EQUIPMENT NOTES:', equip, ''] : []),
    ...(rec   ? ['RECOMMENDATIONS:', rec, '']  : []),
    ...(next  ? [`NEXT VISIT: ${next}`, '']    : []),
    HR,
    'Generated by PoolLens Field Reference',
  ];
  return lines.join('\n');
}

function copyReport() {
  const text = buildReportText();
  navigator.clipboard.writeText(text).then(() => {
    const el = document.getElementById('rpt-copy-confirm');
    if (el) { el.style.display = 'block'; setTimeout(() => { el.style.display = 'none'; }, 2600); }
  });
}

function printReport() {
  const text = buildReportText();
  const safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const win  = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Pool Service Report</title>
    <style>body{font-family:'Courier New',monospace;font-size:13px;color:#111;padding:36px;max-width:620px;margin:0 auto;}
    pre{white-space:pre-wrap;word-wrap:break-word;line-height:1.75;}
    @media print{body{padding:16px;}}</style>
  </head><body><pre>${safe}</pre>
  <script>window.onload=()=>window.print();<\/script></body></html>`);
  win.document.close();
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function gv(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function gf(id) { const el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; }
function setEl(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_'); }
function esc(s)  { return s.replace(/'/g, "\\'"); }

function fmtAmt(amount, unit) {
  if (unit === 'fl oz') {
    if (amount >= 128) return { main: `${(amount/128).toFixed(2)} gal`, alt: `(${amount.toFixed(0)} fl oz)` };
    if (amount >= 32)  return { main: `${(amount/32).toFixed(2)} qts`, alt: `(${amount.toFixed(0)} fl oz)` };
    if (amount >= 8)   return { main: `${(amount/8).toFixed(1)} cups`, alt: `(${amount.toFixed(0)} fl oz)` };
    return { main: `${amount.toFixed(1)} fl oz`, alt: '' };
  }
  if (unit === 'oz dry') {
    if (amount >= 32) return { main: `${(amount/16).toFixed(2)} lbs`, alt: `(${amount.toFixed(0)} oz)` };
    if (amount >= 16) { const lbs = Math.floor(amount/16); return { main: `${lbs} lb ${(amount - lbs*16).toFixed(0)} oz`, alt: '' }; }
    return { main: `${amount.toFixed(1)} oz`, alt: '' };
  }
  if (unit === 'lbs') {
    const lbs = Math.floor(amount);
    const oz  = Math.round((amount - lbs) * 16);
    if (oz === 0 || lbs === 0) return { main: `${amount.toFixed(2)} lbs`, alt: '' };
    return { main: `${lbs} lbs ${oz} oz`, alt: `(${amount.toFixed(2)} lbs)` };
  }
  return { main: `${amount.toFixed(2)} ${unit}`, alt: '' };
}

function interpMuriatic(ta) {
  const f = window.CHEM_DATA.dosing.ph.muriaticFactor;
  const keys = Object.keys(f).map(Number).sort((a,b) => a-b);
  if (ta <= keys[0]) return f[keys[0]];
  if (ta >= keys[keys.length-1]) return f[keys[keys.length-1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (ta >= keys[i] && ta <= keys[i+1]) {
      const r = (ta - keys[i]) / (keys[i+1] - keys[i]);
      return f[keys[i]] + r * (f[keys[i+1]] - f[keys[i]]);
    }
  }
  return f[100];
}

// ═══════════════════════════════════════════
// POOLS — CUSTOMER PROFILES
// ═══════════════════════════════════════════
const POOLS_KEY = 'poolens-pools';

function getPools() {
  try { return JSON.parse(localStorage.getItem(POOLS_KEY) || '[]'); }
  catch(e) { return []; }
}

function savePools(pools) {
  localStorage.setItem(POOLS_KEY, JSON.stringify(pools));
}

function initPools() {
  renderPoolList();
}

// ─── POOL LIST VIEW ───────────────────────
function renderPoolList() {
  S.poolView = 'list';
  S.pool = null;
  const pools = getPools();
  const container = document.getElementById('pools-content');
  if (!container) return;

  if (pools.length === 0) {
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <p style="color:#0369a1;font-weight:900;font-size:16px;">My Pools</p>
      </div>
      <div style="text-align:center;padding:48px 16px 32px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.2" style="margin:0 auto 16px;display:block;"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <p style="font-size:16px;color:#475569;font-weight:700;margin-bottom:6px;">No pools saved yet</p>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:22px;">Save customer profiles with chemistry history.</p>
        <button onclick="renderPoolForm(null)" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:white;border:none;border-radius:10px;padding:13px 28px;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:0.03em;">+ Add Your First Pool</button>
      </div>`;
    return;
  }

  const cards = pools.map(p => {
    const lastDate = p.history && p.history.length
      ? `Last service: ${p.history[p.history.length - 1].date}`
      : 'No service history yet';
    const gallonsDisplay = p.gallons ? Number(p.gallons).toLocaleString() + ' gal' : '';
    return `
      <div class="pool-card" onclick="renderPoolDetail('${p.id}')">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
          <div style="flex:1;min-width:0;">
            <div class="pool-card-name">${escHtml(p.name)}</div>
            ${p.address ? `<div class="pool-card-meta" style="margin-bottom:3px;">${escHtml(p.address)}</div>` : ''}
            <div class="pool-card-meta">${[p.type, p.sanitizer, gallonsDisplay].filter(Boolean).join(' · ')}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;margin-top:4px;"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
          <span style="color:#64748b;font-size:11px;">${lastDate}</span>
          ${p.history && p.history.length ? `<span style="color:#0369a1;font-size:11px;font-weight:700;float:right;">${p.history.length} reading${p.history.length !== 1 ? 's' : ''}</span>` : ''}
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <p style="color:#0369a1;font-weight:900;font-size:16px;">My Pools</p>
      <button onclick="renderPoolForm(null)" style="background:#0369a1;color:white;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:800;cursor:pointer;letter-spacing:0.03em;">+ New Pool</button>
    </div>
    ${cards}`;
}

// ─── POOL DETAIL VIEW ─────────────────────
function renderPoolDetail(id) {
  S.poolView = 'detail';
  S.pool = id;
  const pools = getPools();
  const p = pools.find(x => x.id === id);
  if (!p) { renderPoolList(); return; }

  const historyHtml = (() => {
    if (!p.history || p.history.length === 0) {
      return `<p style="color:#94a3b8;font-size:13px;padding:14px 0;text-align:center;">No readings saved yet.</p>`;
    }
    const sorted = [...p.history].reverse().slice(0, 20);
    return sorted.map((r, i) => {
      const uid = `reading-${id}-${i}`;
      const dateStr = r.date || '';
      const summary = [
        r.fc  != null ? `FC ${r.fc}`  : '',
        r.ph  != null ? `pH ${r.ph}`  : '',
        r.ta  != null ? `TA ${r.ta}`  : '',
        r.cya != null ? `CYA ${r.cya}` : '',
      ].filter(Boolean).join('  ');
      return `
        <div class="pool-reading-row" onclick="toggleReadingDetail('${uid}')">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <span style="color:#0f172a;font-size:13px;font-weight:700;">${dateStr}</span>
              ${r.note ? `<span style="color:#64748b;font-size:11px;margin-left:8px;">· ${escHtml(r.note)}</span>` : ''}
            </div>
            <svg id="rchev-${uid}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <p style="color:#64748b;font-size:12px;margin-top:4px;">${summary}</p>
          <div id="${uid}" class="pool-reading-detail">
            ${poolReadingDetailGrid(r)}
          </div>
        </div>`;
    }).join('');
  })();

  const container = document.getElementById('pools-content');
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <button onclick="renderPoolList()" style="background:#f1f5f9;border:none;border-radius:8px;padding:7px 12px;cursor:pointer;display:flex;align-items:center;gap:5px;color:#374151;font-size:13px;font-weight:700;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <p style="color:#0369a1;font-weight:900;font-size:16px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(p.name)}</p>
      <button onclick="renderPoolForm('${id}')" style="background:#f1f5f9;border:none;border-radius:8px;padding:7px 12px;cursor:pointer;color:#374151;font-size:12px;font-weight:700;">Edit</button>
    </div>

    <!-- Info pills -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
      ${p.gallons ? poolPill(Number(p.gallons).toLocaleString() + ' gal') : ''}
      ${p.type    ? poolPill(p.type)    : ''}
      ${p.filter  ? poolPill(p.filter + (p.filterDia ? ' ' + p.filterDia + '"' : '') + ' filter') : ''}
      ${p.sanitizer ? poolPill(p.sanitizer) : ''}
    </div>

    ${p.heater ? `
      <div class="pool-form-panel" style="padding:12px;margin-bottom:10px;">
        <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Equipment</p>
        <p style="color:#0f172a;font-size:13px;">${escHtml(p.heater)}</p>
      </div>` : ''}

    <!-- Notes -->
    <div class="pool-form-panel" style="padding:12px;margin-bottom:14px;">
      <p style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Notes</p>
      <textarea id="pool-notes-ta" class="pool-textarea" rows="3" placeholder="Gate code, special instructions…" onblur="savePoolNotes('${id}')">${escHtml(p.notes || '')}</textarea>
    </div>

    <!-- Use in Dosing -->
    ${p.gallons ? `
    <button class="btn-outline-blue" style="margin-bottom:14px;" onclick="usePoolInDosing(${Number(p.gallons)})">
      → Use ${Number(p.gallons).toLocaleString()} gal in Dosing Calculator
    </button>` : ''}

    <!-- Chemistry History -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <p style="color:#0369a1;font-weight:900;font-size:15px;">Chemistry History</p>
      <button onclick="showChemForm('${id}')" style="background:#eff6ff;border:1px solid #93c5fd;color:#0369a1;font-size:12px;font-weight:700;padding:6px 12px;border-radius:6px;cursor:pointer;">+ Save Today</button>
    </div>

    <div id="chem-form-wrap-${id}"></div>

    <div id="history-list-${id}">
      ${historyHtml}
    </div>

    <hr class="section-div">
    <button class="btn-delete" onclick="deletePool('${id}')">Delete Pool</button>
    <div style="height:8px;"></div>`;
}

function poolPill(text) {
  return `<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:20px;padding:4px 11px;font-size:12px;font-weight:700;color:#374151;">${escHtml(text)}</span>`;
}

function poolReadingDetailGrid(r) {
  const fields = [
    ['FC', r.fc], ['CC', r.cc], ['pH', r.ph],
    ['TA', r.ta], ['CH', r.ch], ['CYA', r.cya],
  ];
  return fields.filter(([,v]) => v != null && v !== '').map(([label, val]) =>
    `<div style="background:#f8fafc;border-radius:6px;padding:8px;text-align:center;">
       <p style="color:#64748b;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;">${label}</p>
       <p style="color:#0f172a;font-size:16px;font-weight:900;margin-top:2px;">${val}</p>
     </div>`
  ).join('') +
  (r.note ? `<div style="grid-column:1/-1;background:#eff6ff;border-radius:6px;padding:8px;font-size:12px;color:#0369a1;margin-top:2px;">${escHtml(r.note)}</div>` : '');
}

function toggleReadingDetail(uid) {
  const el   = document.getElementById(uid);
  const chev = document.getElementById(`rchev-${uid}`);
  if (!el) return;
  const open = el.classList.toggle('open');
  if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
}

function savePoolNotes(id) {
  const ta = document.getElementById('pool-notes-ta');
  if (!ta) return;
  const pools = getPools();
  const p = pools.find(x => x.id === id);
  if (!p) return;
  p.notes = ta.value;
  savePools(pools);
}

// ─── CHEM READING FORM ────────────────────
function showChemForm(poolId) {
  const wrap = document.getElementById(`chem-form-wrap-${poolId}`);
  if (!wrap) return;
  const today = new Date().toISOString().split('T')[0];
  wrap.innerHTML = `
    <div class="inline-chem-form" id="chem-form-inner-${poolId}">
      <p style="color:#0369a1;font-weight:800;font-size:13px;margin-bottom:12px;">Save Reading</p>
      <div class="field-group">
        <label class="field-label">Date</label>
        <input type="date" id="cf-date-${poolId}" value="${today}" style="color-scheme:light;">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;">
        <div><label class="field-label">FC</label><input type="number" id="cf-fc-${poolId}" placeholder="—" inputmode="decimal" step="0.1" min="0"></div>
        <div><label class="field-label">CC</label><input type="number" id="cf-cc-${poolId}" placeholder="—" inputmode="decimal" step="0.1" min="0"></div>
        <div><label class="field-label">pH</label><input type="number" id="cf-ph-${poolId}" placeholder="—" inputmode="decimal" step="0.1" min="0"></div>
        <div><label class="field-label">TA</label><input type="number" id="cf-ta-${poolId}" placeholder="—" inputmode="decimal" min="0"></div>
        <div><label class="field-label">CH</label><input type="number" id="cf-ch-${poolId}" placeholder="—" inputmode="decimal" min="0"></div>
        <div><label class="field-label">CYA</label><input type="number" id="cf-cya-${poolId}" placeholder="—" inputmode="decimal" min="0"></div>
      </div>
      <div class="field-group">
        <label class="field-label">Note (optional)</label>
        <textarea id="cf-note-${poolId}" class="pool-textarea" rows="2" placeholder="Backwashed filter, added shock…"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button onclick="saveChemReading('${poolId}')" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:white;border:none;border-radius:9px;padding:12px;font-weight:800;font-size:14px;cursor:pointer;">Save</button>
        <button onclick="cancelChemForm('${poolId}')" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;">Cancel</button>
      </div>
    </div>`;
}

function cancelChemForm(poolId) {
  const wrap = document.getElementById(`chem-form-wrap-${poolId}`);
  if (wrap) wrap.innerHTML = '';
}

function saveChemReading(poolId) {
  const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const getF = id => { const v = parseFloat(get(id)); return isNaN(v) ? null : v; };

  const date = get(`cf-date-${poolId}`) || new Date().toISOString().split('T')[0];
  const fc   = getF(`cf-fc-${poolId}`);
  const cc   = getF(`cf-cc-${poolId}`);
  const ph   = getF(`cf-ph-${poolId}`);
  const ta   = getF(`cf-ta-${poolId}`);
  const ch   = getF(`cf-ch-${poolId}`);
  const cya  = getF(`cf-cya-${poolId}`);
  const note = get(`cf-note-${poolId}`);

  if ([fc, cc, ph, ta, ch, cya].every(v => v === null)) {
    alert('Enter at least one reading value.');
    return;
  }

  const reading = { date };
  if (fc  !== null) reading.fc  = fc;
  if (cc  !== null) reading.cc  = cc;
  if (ph  !== null) reading.ph  = ph;
  if (ta  !== null) reading.ta  = ta;
  if (ch  !== null) reading.ch  = ch;
  if (cya !== null) reading.cya = cya;
  if (note) reading.note = note;

  const pools = getPools();
  const p = pools.find(x => x.id === poolId);
  if (!p) return;
  if (!p.history) p.history = [];
  p.history.push(reading);
  // Cap at 100 readings (newest kept)
  if (p.history.length > 100) p.history = p.history.slice(-100);
  savePools(pools);
  renderPoolDetail(poolId);
}

// ─── NEW / EDIT POOL FORM ─────────────────
function renderPoolForm(id) {
  S.poolView = id ? 'edit' : 'new';
  const pools = getPools();
  const p = id ? pools.find(x => x.id === id) : null;

  const v = (field, fallback = '') => p ? (p[field] != null ? p[field] : fallback) : fallback;
  const sel = (field, value) => v(field) === value ? 'selected' : '';

  const container = document.getElementById('pools-content');
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <button onclick="${id ? `renderPoolDetail('${id}')` : 'renderPoolList()'}" style="background:#f1f5f9;border:none;border-radius:8px;padding:7px 12px;cursor:pointer;display:flex;align-items:center;gap:5px;color:#374151;font-size:13px;font-weight:700;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <p style="color:#0369a1;font-weight:900;font-size:16px;">${id ? 'Edit Pool' : 'New Pool'}</p>
    </div>

    <div class="pool-form-panel">
      <div class="field-group">
        <label class="field-label">Pool Name <span style="color:#dc2626;">*</span></label>
        <input type="text" id="pf-name" placeholder="e.g. Smith Residence" value="${escAttr(v('name'))}">
      </div>
      <div class="field-group">
        <label class="field-label">Address</label>
        <input type="text" id="pf-address" placeholder="123 Main St" value="${escAttr(v('address'))}">
      </div>
      <div class="field-group">
        <label class="field-label">Pool Volume (gallons) <span style="color:#dc2626;">*</span></label>
        <input type="number" id="pf-gallons" placeholder="e.g. 15000" min="100" inputmode="decimal" value="${v('gallons')}">
      </div>
      <div class="field-group">
        <label class="field-label">Pool Type</label>
        <select id="pf-type">
          <option value="">— Select —</option>
          <option value="Inground Gunite" ${sel('type','Inground Gunite')}>Inground Gunite</option>
          <option value="Inground Vinyl" ${sel('type','Inground Vinyl')}>Inground Vinyl</option>
          <option value="Inground Fiberglass" ${sel('type','Inground Fiberglass')}>Inground Fiberglass</option>
          <option value="Above Ground" ${sel('type','Above Ground')}>Above Ground</option>
        </select>
      </div>
      <div class="field-group">
        <label class="field-label">Sanitizer</label>
        <select id="pf-sanitizer">
          <option value="">— Select —</option>
          <option value="Chlorine" ${sel('sanitizer','Chlorine')}>Chlorine</option>
          <option value="Salt" ${sel('sanitizer','Salt')}>Salt</option>
          <option value="Bromine" ${sel('sanitizer','Bromine')}>Bromine</option>
        </select>
      </div>
      <div class="field-group">
        <label class="field-label">Filter Type</label>
        <select id="pf-filter" onchange="toggleFilterDia()">
          <option value="">— Select —</option>
          <option value="Sand" ${sel('filter','Sand')}>Sand</option>
          <option value="Cartridge" ${sel('filter','Cartridge')}>Cartridge</option>
          <option value="DE" ${sel('filter','DE')}>DE (Diatomaceous Earth)</option>
        </select>
      </div>
      <div class="field-group" id="pf-dia-wrap" style="${['Sand','DE'].includes(v('filter')) ? '' : 'display:none;'}">
        <label class="field-label">Filter Tank Diameter (inches)</label>
        <input type="number" id="pf-filterDia" placeholder="e.g. 24" min="10" max="48" inputmode="decimal" value="${v('filterDia')}">
      </div>
      <div class="field-group">
        <label class="field-label">Heater / Equipment</label>
        <input type="text" id="pf-heater" placeholder="e.g. Hayward H250" value="${escAttr(v('heater'))}">
      </div>
      <div class="field-group">
        <label class="field-label">Notes</label>
        <textarea id="pf-notes" class="pool-textarea" rows="3" placeholder="Gate code, special instructions…">${escHtml(v('notes'))}</textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
        <button onclick="savePool('${id || ''}')" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:white;border:none;border-radius:10px;padding:13px;font-weight:800;font-size:14px;cursor:pointer;">Save Pool</button>
        <button onclick="${id ? `renderPoolDetail('${id}')` : 'renderPoolList()'}" style="background:#f1f5f9;border:1px solid #e2e8f0;color:#64748b;border-radius:10px;padding:13px;font-weight:700;font-size:14px;cursor:pointer;">Cancel</button>
      </div>
    </div>`;
}

function toggleFilterDia() {
  const sel = document.getElementById('pf-filter');
  const wrap = document.getElementById('pf-dia-wrap');
  if (!sel || !wrap) return;
  wrap.style.display = ['Sand', 'DE'].includes(sel.value) ? '' : 'none';
}

function savePool(id) {
  const name = (document.getElementById('pf-name')?.value || '').trim();
  if (!name) { alert('Pool name is required.'); return; }

  const gallonsRaw = document.getElementById('pf-gallons')?.value;
  const gallons = gallonsRaw ? parseInt(gallonsRaw, 10) : null;

  const pool = {
    name,
    address:    (document.getElementById('pf-address')?.value   || '').trim(),
    gallons:    gallons || null,
    type:        document.getElementById('pf-type')?.value      || '',
    sanitizer:   document.getElementById('pf-sanitizer')?.value || '',
    filter:      document.getElementById('pf-filter')?.value    || '',
    filterDia:   parseInt(document.getElementById('pf-filterDia')?.value || '0') || null,
    heater:     (document.getElementById('pf-heater')?.value    || '').trim(),
    notes:      (document.getElementById('pf-notes')?.value     || '').trim(),
  };

  const pools = getPools();
  if (id) {
    const idx = pools.findIndex(x => x.id === id);
    if (idx !== -1) {
      pool.id = id;
      pool.history = pools[idx].history || [];
      pools[idx] = pool;
    }
  } else {
    pool.id = String(Date.now());
    pool.history = [];
    pools.push(pool);
  }
  savePools(pools);
  renderPoolDetail(pool.id);
}

// ─── DELETE POOL ──────────────────────────
function deletePool(id) {
  if (!confirm('Delete this pool profile and all its history? This cannot be undone.')) return;
  const pools = getPools().filter(x => x.id !== id);
  savePools(pools);
  renderPoolList();
}

// ─── USE POOL IN DOSING ───────────────────
function usePoolInDosing(gallons) {
  const el = document.getElementById('dose-volume');
  if (el) { el.value = gallons; onVolumeChange(gallons); }
  showTab('dosing');
}

// ─── POOL HTML HELPERS ────────────────────
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escAttr(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = '#4ade80';
    btn.style.borderColor = '#166534';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 1800);
  }).catch(() => {});
}

function errorBox(msg) {
  return `<div class="error-box">${msg}</div>`;
}
function infoBox(main, sub) {
  return `<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
    <p style="color:#0f172a;font-size:14px;font-weight:600;">${main}</p>
    ${sub ? `<p style="color:#64748b;font-size:12px;margin-top:6px;line-height:1.5;">${sub}</p>` : ''}
  </div>`;
}
