'use strict';
const VERSION = '1.1.1';
const API = 'https://script.google.com/macros/s/AKfycbxNcZer2Morw-kTUR2dcMKzMpACanaEd67TE0cHp6AcnLXUJ78I0I-_FyyyRlDzl25-/exec';
const LS = { key: 'mg_key', home: 'mg_home', range: 'mg_range' };

const $ = id => document.getElementById(id);
const SIZES = [1, 2, 3, 5, 10, 25, 50, 100];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const fmt = n => Math.round(n).toLocaleString('id-ID');
const rp = n => 'Rp' + fmt(n);
const MINUS = '−';
const rpS = n => (n < 0 ? MINUS : n > 0 ? '+' : '') + 'Rp' + fmt(Math.abs(n));
const sgn = n => (n < 0 ? MINUS : n > 0 ? '+' : '') + fmt(Math.abs(n));
const pct = (n, d = 1) => (n * 100).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
const pctS = (n, d = 1) => (n < 0 ? MINUS : n > 0 ? '+' : '') + pct(Math.abs(n), d);
const jt = n => 'Rp' + (n / 1e6).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' jt';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fd = (s, yr) => { const d = pd(s); return d.getDate() + ' ' + MON[d.getMonth()] + (yr ? ' ' + d.getFullYear() : ''); };
const num = v => { const s = String(v || '').replace(/[^\d]/g, ''); return s ? parseInt(s, 10) : 0; };
const dir = n => n < 0 ? 'down' : n > 0 ? 'up' : 'flat';
const tri = n => `<svg class="tri" aria-hidden="true"><use href="#i-${dir(n)}"/></svg>`;
const todayIso = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

function snack(msg) {
  const t = $('snack'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
}

// ---------- API ----------
let KEY = null;
async function api(fn, ...args) {
  return apiT(0, fn, ...args);
}
// ms = batas waktu (0 = tanpa batas)
async function apiT(ms, fn, ...args) {
  let r;
  const ctl = ms ? new AbortController() : null;
  const timer = ms ? setTimeout(() => ctl.abort(), ms) : 0;
  try {
    r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ k: KEY, fn, args }), signal: ctl ? ctl.signal : undefined });
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Server terlalu lama menjawab' : navigator.onLine ? 'Server tidak bisa dihubungi' : 'Sedang offline');
  } finally { clearTimeout(timer); }
  const j = await r.json().catch(() => ({ ok: false, error: 'Respons server tidak terbaca' }));
  if (!j.ok) {
    if (/Kunci tidak valid/.test(j.error)) { store.del(LS.key); KEY = null; showGate(); }
    throw new Error(j.error);
  }
  return j.data;
}

// ---------- Navigasi ----------
let view = 'home';
function show(v) {
  view = v;
  ['gate', 'home', 'upd'].forEach(id => $(id).classList.toggle('hide', id !== v));
  window.scrollTo(0, 0);
  if (v === 'home') drawChart();
  if (v === 'upd') updateSaveBar();
}
function openUpd() { if (view !== 'upd') { history.pushState({ v: 'upd' }, ''); show('upd'); } }
window.addEventListener('popstate', () => { if (view === 'upd') show('home'); });
$('fab').onclick = openUpd;
$('back').onclick = () => history.back();

function showGate() { show('gate'); setTimeout(() => $('keyIn').focus(), 50); }
$('keyGo').onclick = () => {
  const k = $('keyIn').value.trim();
  if (k.length < 20) { snack('Kunci terlalu pendek'); return; }
  KEY = k; store.set(LS.key, k); show('home'); load(true);
};
$('keyIn').onkeydown = e => { if (e.key === 'Enter') $('keyGo').click(); };

// ---------- Beranda ----------
let H = null, range = +(store.get(LS.range) || 90), loading = false, loadedAt = 0;

async function load(manual) {
  if (loading || !KEY) return;
  loading = true; $('reload').classList.add('busy');
  try {
    const h = await api('getHome');
    store.set(LS.home, JSON.stringify({ at: Date.now(), h }));
    loadedAt = Date.now();
    renderHome(h, false);
    if (manual) snack('Data diperbarui');
  } catch (e) {
    if (KEY) snack('Gagal memuat: ' + e.message);
    if (H) setSource(true);
  }
  loading = false; $('reload').classList.remove('busy');
}
$('reload').onclick = () => load(true);

// ---------- Tema: ikut HP → terang → gelap ----------
const THEMES = { system: ['i-auto', 'Tema ikut HP'], light: ['i-sun', 'Tema terang'], dark: ['i-moon', 'Tema gelap'] };
const getTheme = () => { const t = store.get('mg_theme'); return THEMES[t] ? t : 'system'; };
function applyTheme(t) {
  if (t === 'system') { delete document.documentElement.dataset.theme; store.del('mg_theme'); }
  else { document.documentElement.dataset.theme = t; store.set('mg_theme', t); }
  const metas = document.querySelectorAll('meta[name=theme-color]');
  metas.forEach(m => m.setAttribute('content', t === 'system' ? (/dark/.test(m.media) ? '#231E0D' : '#F4C430') : t === 'dark' ? '#231E0D' : '#F4C430'));
  const [ic, label] = THEMES[t];
  $('theme').setAttribute('aria-label', label);
  $('theme').querySelector('use').setAttribute('href', '#' + ic);
  if (typeof drawChart === 'function' && view === 'home') drawChart();
}
$('theme').onclick = () => {
  const order = ['system', 'light', 'dark'];
  const t = order[(order.indexOf(getTheme()) + 1) % 3];
  applyTheme(t); snack(THEMES[t][1]);
};
applyTheme(getTheme());
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && view === 'home' && Date.now() - loadedAt > 10 * 60e3) load(false);
});

function setSource(cached) {
  const c = JSON.parse(store.get(LS.home) || 'null');
  $('src').textContent = cached && c ? 'Tersimpan ' + new Date(c.at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Google Sheet';
}

function missingDays(h) {
  if (!h.latest) return 0;
  let n = 0; const t = pd(todayIso());
  for (let x = pd(h.latest.date); x < t;) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0) n++; }
  return n;
}

function renderHome(h, cached) {
  H = h;
  const s = h.summary, hs = h.holdings || [];
  setSource(cached);
  $('noKey').classList.toggle('hide', !!h.hasKey);

  // Masthead
  const miss = missingDays(h);
  const st = $('stamp');
  st.textContent = h.latest ? 'Harga ' + fd(h.latest.date) : '';
  st.classList.toggle('stale', miss >= 1);
  st.title = miss >= 1 ? 'Harga belum diperbarui' : 'Harga terbaru';
  $('lbl').textContent = 'Nilai emas · ' + s.gram.toLocaleString('id-ID') + ' g';
  $('val').textContent = rp(s.nilai);
  $('quote').innerHTML =
    `<span class="${dir(s.belum)}">${tri(s.belum)}${rpS(s.belum)} · ${pctS(s.belumPct)}</span>` +
    (h.dayChange != null ? `<span><span class="muted">Sejak ${fd(h.prevDate)}</span><span class="${dir(h.dayChange)}">${rpS(h.dayChange)}</span></span>` : '');

  $('stale').innerHTML = miss >= 1 ? `<div class="stale-row"><span>${miss === 1 ? 'Harga hari ini belum masuk' : 'Harga belum masuk ' + miss + ' hari'}</span><button class="btn-s" id="staleGo">Perbarui</button></div>` : '';
  if (miss >= 1) $('staleGo').onclick = openUpd;

  // Saran
  const a = h.advice;
  $('advice').classList.toggle('hide', !a);
  if (a) {
    $('advice').innerHTML = `
      <div class="top"><span class="sigw">${esc(a.sig)}</span><span class="when n">harga ${fd(a.date)}</span></div>
      <div class="t">${esc(a.title)}</div>
      <div class="x">${esc(a.text)}</div>
      ${a.why && a.why.length ? `<details><summary>Alasan<svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></summary><ul>${a.why.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}`;
  }

  // Titik impas: satu rel, nilai sekarang vs modal
  const ratio = s.modal ? s.nilai / s.modal : 0;
  const scale = Math.max(1, ratio) * 1.14;            // ruang di kanan, juga kalau sudah lewat modal
  const xNow = Math.min(100, ratio / scale * 100), xGoal = 100 / scale;
  $('beMeta').textContent = s.perluNaik > 0 ? 'perlu naik ' + pct(s.perluNaik) : 'sudah lewat';
  $('be').innerHTML = `
    <div class="rail" role="img" aria-label="Nilai ${pct(ratio)} dari modal">
      <div class="track"></div><div class="fill" style="width:${xNow.toFixed(1)}%"></div>
      ${xGoal > xNow ? `<div class="gap" style="left:${xNow.toFixed(1)}%;width:${(xGoal - xNow).toFixed(1)}%"></div>` : ''}
      <div class="tick goal" style="left:${xGoal.toFixed(1)}%"></div><div class="now" style="left:${xNow.toFixed(1)}%"></div>
    </div>
    <div class="legend n"><div>Sekarang<b>${pct(ratio)} dari modal</b></div><div class="r">Modal<b>${rp(s.modal)}</b></div></div>
    <div class="line n">Impas di buyback <b>${rp(s.impasPerGram)}/g</b>${s.buy1g ? ` · beli 1 g hari ini ${rp(s.buy1g)}, selisih ${pct(s.spread)}` : ''}</div>`;

  // Kepingan
  $('hMeta').textContent = hs.length ? hs.length + ' keping' : '';
  $('holdings').innerHTML = `<thead><tr><th>Berat</th><th>Beli</th><th class="r">Untung/rugi</th></tr></thead><tbody>` +
    (hs.length ? '' : `<tr><td colspan="3" class="flat">Belum ada kepingan aktif di tab Gold.</td></tr>`) +
    hs.map(x => `<tr>
      <td class="g">${x.gram.toLocaleString('id-ID')} g</td>
      <td class="f">${rp(x.buyPrice)}<span class="s">${fd(x.buyDate, true)}</span></td>
      <td class="r f"><span class="chg ${dir(x.pl)}">${tri(x.pl)}${rpS(x.pl)}</span><span class="s">${pctS(x.roi)}</span></td></tr>`).join('') +
    (s.sudah ? `<tr class="sum"><td colspan="2">Sudah dijual<span class="s">termasuk penalti arisan</span></td><td class="r f"><span class="chg ${dir(s.sudah)}">${tri(s.sudah)}${rpS(s.sudah)}</span></td></tr>` : '') +
    `</tbody>`;

  // Emas dunia: premi GMI di rel rentang 90 hari
  const m = h.market;
  $('mkSec').classList.toggle('hide', !m);
  if (m) {
    const lag = m.spotNowDate > m.spotUsedDate;
    $('mkMeta').textContent = 'vs GMI ' + fd(m.date);
    const lo = Math.min(m.min, m.premium), hi = Math.max(m.max, m.premium), sp = (hi - lo) || 1;
    const X = v => ((v - lo) / sp * 100).toFixed(1);
    $('mk').innerHTML = `
      <div class="duo n">
        <div><div class="k">Premi GMI</div><div class="v">${pctS(m.premium)}</div><div class="s">median 90 hari ${pct(m.med)}</div></div>
        <div><div class="k">Emas dunia</div>${lag
          ? `<div class="v ${dir(m.worldChg)}">${pctS(m.worldChg)}</div><div class="s">sejak ${fd(m.spotUsedDate)}</div>`
          : `<div class="v">${rp(m.spotUsed)}</div><div class="s">per gram · ${fd(m.spotUsedDate)}</div>`}</div>
      </div>
      <div class="rail" role="img" aria-label="Premi sekarang dibanding rentang 90 hari" style="margin-top:14px">
        <div class="track"></div><div class="band" style="left:${X(m.p25)}%;width:${(X(m.p75) - X(m.p25)).toFixed(1)}%"></div>
        <div class="med" style="left:${X(m.med)}%"></div><div class="now" style="left:${X(m.premium)}%"></div>
      </div>
      <div class="legend n" style="font-size:var(--fs-xs)"><span>${m.premium <= m.min ? 'terendah 90 hari' : pct(m.min) + ' terendah'}</span><span>biasanya ${pct(m.p25)}–${pct(m.p75)}</span><span class="r">${m.premium >= m.max ? 'tertinggi 90 hari' : pct(m.max) + ' tertinggi'}</span></div>`;
  }

  // Papan harga buyback
  if (h.latest) {
    $('pMeta').textContent = 'per gram · ' + fd(h.latest.date);
    const own = new Set(hs.map(x => x.gram)), prev = h.prevPrices;
    $('prices').innerHTML = `<thead><tr><th>Ukuran</th><th class="r">Buyback</th><th class="r">vs ${h.prevDate ? fd(h.prevDate) : 'kemarin'}</th></tr></thead><tbody>` +
      SIZES.map((g, i) => {
        const p = h.latest.prices[i], d = prev && prev[i] ? p - prev[i] : null;
        return `<tr class="${own.has(g) ? 'own' : ''}"><td class="g">${g} g</td><td class="r f">${rp(p)}</td><td class="r f">${d == null ? '' : `<span class="chg ${dir(d)}">${tri(d)}${sgn(d)}</span>`}</td></tr>`;
      }).join('') + '</tbody>';
  }
  drawChart();
}

// ---------- Grafik buyback 1 g ----------
document.querySelectorAll('#ranges button').forEach(b => {
  b.setAttribute('aria-pressed', String(+b.dataset.d === range));
  b.onclick = () => {
    range = +b.dataset.d; store.set(LS.range, String(range));
    document.querySelectorAll('#ranges button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    drawChart();
  };
});

function drawChart() {
  if (!H || !H.series.length || view !== 'home') return;
  let pts = H.series;
  if (range) {
    const cut = pd(pts[pts.length - 1][0]); cut.setDate(cut.getDate() - range);
    pts = pts.filter(p => pd(p[0]) >= cut);
  }
  if (pts.length < 2) pts = H.series.slice(-2);
  const be = H.summary.impasPerGram;
  const box = $('chart'), W = Math.max(280, box.clientWidth || 340), Hh = 168, pt = 16, pb = 6;
  const vals = pts.map(p => p[1]);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const showBE = be > 0 && be < hi + (hi - lo) * 1.5 + 1;
  if (showBE) { lo = Math.min(lo, be); hi = Math.max(hi, be); }
  const span = (hi - lo) || 1; lo -= span * 0.06; hi += span * 0.06;
  const x = i => W * (i / (pts.length - 1));
  const y = v => pt + (Hh - pt - pb) * (1 - (v - lo) / (hi - lo));
  let line = '';
  pts.forEach((p, i) => { line += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[1]).toFixed(1); });
  const beY = y(be).toFixed(1);
  const lblY = beY < 24 ? +beY + 15 : beY - 6;
  box.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Grafik harga buyback 1 gram">
    <line x1="0" x2="${W}" y1="${Hh - 0.5}" y2="${Hh - 0.5}" style="stroke:var(--rule)" stroke-width="1"/>
    ${showBE ? `<line x1="0" x2="${W}" y1="${beY}" y2="${beY}" style="stroke:var(--ink2)" stroke-width="1" stroke-dasharray="3 4"/>
      <text x="${W}" y="${lblY}" text-anchor="end" font-size="11" font-weight="600" style="fill:var(--ink2);font-variation-settings:'wdth' 85">Impas</text>` : ''}
    <path d="${line}" fill="none" style="stroke:var(--ink)" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/>
    <line id="cl" y1="0" y2="${Hh}" style="stroke:var(--ink)" stroke-width="1" opacity="0"/>
    <circle id="cd" r="4.5" style="fill:var(--mast);stroke:var(--ink)" stroke-width="2"/>
  </svg>`;
  $('xl').innerHTML = `<span>${fd(pts[0][0], true)}</span><span>${fd(pts[pts.length - 1][0], true)}</span>`;

  const setAt = (i, scrub) => {
    i = Math.max(0, Math.min(pts.length - 1, i));
    const p = pts[i], prev = i > 0 ? pts[i - 1][1] : null;
    $('cl').setAttribute('x1', x(i)); $('cl').setAttribute('x2', x(i)); $('cl').setAttribute('opacity', scrub ? .35 : 0);
    $('cd').setAttribute('cx', x(i)); $('cd').setAttribute('cy', y(p[1]));
    $('cPrice').textContent = rp(p[1]);
    $('cDate').textContent = fd(p[0], true);
    const d = prev == null ? null : p[1] - prev;
    $('cChg').className = 'd ' + (d == null ? 'flat' : dir(d));
    $('cChg').innerHTML = d == null ? '' : d === 0 ? 'tetap' : `${tri(d)}${sgn(d)} · ${pctS(d / prev, 2)}`;
  };
  setAt(pts.length - 1, false);
  const svg = box.querySelector('svg');
  const pick = ev => {
    const r = svg.getBoundingClientRect(), cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    setAt(Math.round(cx / r.width * (pts.length - 1)), true);
  };
  svg.addEventListener('touchstart', pick, { passive: true });
  svg.addEventListener('touchmove', pick, { passive: true });
  svg.addEventListener('mousemove', pick);
  const reset = () => setAt(pts.length - 1, false);
  svg.addEventListener('touchend', () => setTimeout(reset, 1500));
  svg.addEventListener('mouseleave', reset);
}
let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawChart, 150); });

// ---------- Perbarui harga ----------
let files = [], cards = [], uid = 0;

function addFiles(list) {
  list = list.filter(f => /^image\//.test(f.type));
  if (!list.length) return;
  files = files.concat(list);
  $('thumbs').innerHTML = files.map(f => `<img class="thumb" src="${URL.createObjectURL(f)}" alt="">`).join('');
  readFiles(list);
}
$('file').onchange = e => { addFiles(Array.from(e.target.files || [])); e.target.value = ''; };
document.addEventListener('paste', e => {
  if (view !== 'upd') return;
  const fl = Array.from(e.clipboardData && e.clipboardData.files || []);
  if (fl.length) { e.preventDefault(); addFiles(fl); }
});

function shrink(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 900 / img.width);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res({ mime: 'image/jpeg', data: c.toDataURL('image/jpeg', 0.85).split(',')[1], name: file.name });
    };
    img.onerror = () => rej(new Error('Gambar tidak bisa dibuka'));
    img.src = URL.createObjectURL(file);
  });
}

async function readFiles(list) {
  const fails = [], results = [];
  try {
    // satu gambar per permintaan (maks 3 sekaligus): satu gagal tidak menggagalkan yang lain
    let done = 0, next = 0;
    const tick = () => { $('prog').innerHTML = `<span class="spin"></span>Membaca ${done} dari ${list.length} gambar…`; };
    tick();
    const one = async file => {
      let img;
      try { img = await shrink(file); } catch (e) { fails.push({ name: file.name, error: e.message }); return; }
      const payload = [{ mime: img.mime, data: img.data }];
      let r;
      try { r = (await apiT(100000, 'extractPrices', payload))[0]; }
      catch (e) {
        if (/Kunci tidak valid/.test(e.message)) throw e;
        try { r = (await apiT(100000, 'extractPrices', payload))[0]; }   // coba sekali lagi
        catch (e2) { r = { ok: false, error: e2.message }; }
      }
      r.ok ? results.push(r) : fails.push({ name: file.name, error: r.error });
    };
    const worker = async () => { while (next < list.length) { await one(list[next++]); done++; tick(); } };
    await Promise.all(Array.from({ length: Math.min(3, list.length) }, worker));
    mergeResults(results);
    const nOcr = results.filter(r => r.via === 'ocr').length;
    $('prog').innerHTML = !results.length ? '' :
      `<svg class="i ok" aria-hidden="true"><use href="#i-check"/></svg>${results.length} gambar terbaca` + (nOcr ? ` · ${nOcr} lewat OCR, cek angkanya` : '');
  } catch (e) {
    snack('Gagal membaca: ' + e.message);
    $('prog').textContent = '';
  }
  $('fails').innerHTML = fails.length ? `<div class="err">${fails.length} gambar gagal dibaca: ${fails.map(f => esc(f.error)).join('; ')}</div>` : '';
}

function mergeResults(results) {
  results.forEach(r => {
    let c = cards.find(x => x.date === r.date);
    if (!c) { c = newCard(r.date); cards.push(c); }
    r.rows.forEach(row => {
      const i = SIZES.indexOf(row.gram); if (i < 0) return;
      if (c.bb[i] && c.bb[i] !== row.buyback) c.conflict.add(row.gram);
      if (!c.bb[i]) c.bb[i] = row.buyback;
      if (!c.buy[i]) c.buy[i] = row.buy;
    });
  });
  cards.sort((a, b) => a.date < b.date ? -1 : 1);
  renderCards();
}

const exists = d => !!(H && H.dates.indexOf(d) >= 0);
function newCard(date) {
  return { id: ++uid, date, bb: Array(8).fill(0), buy: Array(8).fill(0), conflict: new Set(), overwrite: false };
}

$('manual').onclick = () => {
  const c = newCard(todayIso());
  cards.push(c); renderCards();
  setTimeout(() => { const el = document.querySelector(`[data-card="${c.id}"]`); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); const i = el && el.querySelector('input[data-f=bb]'); i && i.focus(); }, 50);
};

// harga pembanding: harga tersimpan terakhir sebelum tanggal kartu
function refPrices(c) {
  if (!H || !H.latest) return null;
  if (c.date > H.latest.date) return H.latest.prices;
  if (c.date === H.latest.date) return H.prevPrices;
  return null;
}

function check(c) {
  const w = [], flag = new Set();
  const miss = SIZES.filter((g, i) => !c.bb[i]);
  if (miss.length) w.push({ bad: true, t: `Harga ${miss.join(', ')} g belum ada` });
  for (let i = 0; i < 7; i++) {
    if (c.bb[i] && c.bb[i + 1] && c.bb[i + 1] > c.bb[i]) { flag.add(i + 1); w.push({ t: `${SIZES[i + 1]} g lebih tinggi dari ${SIZES[i]} g` }); }
  }
  if (c.conflict.size) { c.conflict.forEach(g => flag.add(SIZES.indexOf(g))); w.push({ t: `Dua screenshot beda angka untuk ${[...c.conflict].join(', ')} g` }); }
  const ref = refPrices(c);
  if (ref) {
    const d = c.bb.map((v, i) => v && ref[i] ? v - ref[i] : null);
    const vals = d.filter(v => v != null).sort((a, b) => a - b);
    const med = vals.length ? vals[Math.floor(vals.length / 2)] : 0;
    d.forEach((v, i) => { if (v != null && Math.abs(v - med) > Math.max(3000, Math.abs(med) * 0.5)) flag.add(i); });
    if (c.bb[0] && ref[0] && Math.abs(c.bb[0] / ref[0] - 1) > 0.05) w.push({ t: `1 g beda ${pct(Math.abs(c.bb[0] / ref[0] - 1))} dari harga sebelumnya` });
  }
  return { w, flag, ref };
}

function renderCards() {
  $('cards').innerHTML = !cards.length
    ? `<p class="empty">Bagikan screenshot dari aplikasi GMI ke <b>My Gold</b>, pilih lewat <b>Tambah</b>, atau ketik sendiri dengan <b>Isi manual</b>.</p>`
    : cards.map(c => {
      const { w, flag, ref } = check(c), ex = exists(c.date);
      return `<section class="sec dcard" data-card="${c.id}">
        <div class="dh">
          <input type="date" value="${c.date}" data-f="date" aria-label="Tanggal harga">
          <span class="tag ${ex ? 'exist' : 'new'}">${ex ? 'Sudah ada' : 'Baru'}</span>
          <button class="ib" data-f="del" aria-label="Hapus tanggal ini"><svg class="i"><use href="#i-del"/></svg></button>
        </div>
        <table class="qt"><thead><tr><th>Ukuran</th><th>Buyback</th><th class="r">vs sebelumnya</th></tr></thead><tbody>
        ${SIZES.map((g, i) => {
          const d = ref && c.bb[i] && ref[i] ? c.bb[i] - ref[i] : null;
          return `<tr class="${!c.bb[i] ? 'miss' : flag.has(i) ? 'flag' : ''}">
            <td class="g">${g} g</td>
            <td class="in"><input inputmode="numeric" aria-label="Buyback ${g} gram" value="${c.bb[i] ? fmt(c.bb[i]) : ''}" placeholder="Belum ada" data-f="bb" data-i="${i}"></td>
            <td class="r f"><span class="chg ${flag.has(i) ? '' : d == null ? '' : dir(d)}">${d == null ? '' : tri(d) + sgn(d)}</span></td>
          </tr>`; }).join('')}
        </tbody></table>
        ${w.length ? `<div class="warns">${w.map(x => `<div class="${x.bad ? 'bad' : ''}">${esc(x.t)}</div>`).join('')}</div>` : ''}
        ${ex ? `<label class="opt"><input type="checkbox" data-f="ow" ${c.overwrite ? 'checked' : ''}>Timpa harga yang sudah tersimpan</label>` : ''}
      </section>`;
    }).join('');

  $('cards').querySelectorAll('[data-card]').forEach(el => {
    const c = cards.find(x => x.id === +el.dataset.card);
    el.querySelector('[data-f=date]').onchange = e => { c.date = e.target.value; cards.sort((a, b) => a.date < b.date ? -1 : 1); renderCards(); };
    el.querySelector('[data-f=del]').onclick = () => { cards = cards.filter(x => x !== c); renderCards(); };
    const ow = el.querySelector('[data-f=ow]'); if (ow) ow.onchange = e => { c.overwrite = e.target.checked; updateSaveBar(); };
    el.querySelectorAll('[data-f=bb]').forEach(inp => {
      inp.oninput = () => { c.bb[+inp.dataset.i] = num(inp.value); };
      // gambar ulang setelah pindah kolom (format angka & tanda), lalu kembalikan fokus
      inp.onblur = () => setTimeout(() => {
        const a = document.activeElement;
        const keep = a && a.dataset && a.dataset.f === 'bb' ? [a.closest('[data-card]').dataset.card, a.dataset.i] : null;
        renderCards();
        if (keep) { const n = document.querySelector(`[data-card="${keep[0]}"] input[data-i="${keep[1]}"]`); n && n.focus(); }
      }, 0);
    });
  });
  updateSaveBar();
}

const savable = () => cards.filter(c => !exists(c.date) || c.overwrite);
function updateSaveBar() {
  const n = savable().length;
  $('save').disabled = !n;
  $('save').textContent = n > 1 ? `Simpan ${n} tanggal` : 'Simpan';
}

$('save').onclick = async () => {
  const list = savable();
  const bad = list.find(c => c.bb.some(v => !v) || !/^\d{4}-\d{2}-\d{2}$/.test(c.date));
  if (bad) { snack(`Harga ${fd(bad.date)} belum lengkap`); const el = document.querySelector(`[data-card="${bad.id}"]`); el && el.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  const btn = $('save'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan';
  try {
    const res = await api('savePrices', list.map(c => ({ date: c.date, buyback: c.bb, buy1g: c.buy[0] || 0, overwrite: c.overwrite })));
    snack(`${res.inserted} tanggal disimpan${res.updated ? `, ${res.updated} diperbarui` : ''}${res.skipped ? `, ${res.skipped} dilewati` : ''}`);
    cards = []; files = []; $('thumbs').innerHTML = ''; $('prog').textContent = ''; $('fails').innerHTML = '';
    store.set(LS.home, JSON.stringify({ at: Date.now(), h: res.home }));
    renderCards(); renderHome(res.home, false); history.back();
  } catch (e) {
    snack('Gagal menyimpan: ' + e.message);
  }
  btn.textContent = 'Simpan'; updateSaveBar();
};

// ---------- Terima screenshot yang dibagikan (Web Share Target) ----------
async function takeShared() {
  const q = new URLSearchParams(location.search);
  if (!q.has('share')) return;
  history.replaceState(null, '', location.pathname);
  try {
    const c = await caches.open('mg-share');
    const keys = await c.keys(), got = [];
    for (const k of keys) {
      const r = await c.match(k), b = await r.blob();
      got.push(new File([b], decodeURIComponent(r.headers.get('x-name') || 'shot.jpg'), { type: b.type || 'image/jpeg' }));
      await c.delete(k);
    }
    if (got.length) { openUpd(); addFiles(got); }
  } catch (e) { snack('Screenshot tidak bisa dibuka'); }
}

// ---------- Mulai ----------
(function start() {
  $('ver').textContent = 'v' + VERSION;
  const m = location.hash.match(/k=([\w-]{20,})/);
  if (m) { store.set(LS.key, m[1]); history.replaceState(null, '', location.pathname + location.search); }
  KEY = store.get(LS.key);
  renderCards();
  if (!KEY) { showGate(); return; }
  show('home');
  const c = JSON.parse(store.get(LS.home) || 'null');
  if (c && c.h) renderHome(c.h, true);
  load(false);
  takeShared();
  if (location.hash === '#perbarui') { history.replaceState(null, '', location.pathname); openUpd(); }
})();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
