/* Barbustudio — логика сайта. Данные (цены, даты, вопросы) — в data.js.
   Каждая страница запускает только те части, чьи блоки на ней есть. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ROOT = document.body.dataset.root || '';
const PAGE_KIND = document.body.dataset.kind || '';
const rub = n => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const spreadsWord = n => `${n} ${plural(n, 'разворот', 'разворота', 'разворотов')}`;
const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200); };

/* ---------- шапка: при прокрутке названия и разделы уходят в иконку справа ---------- */
const onScroll = () => document.documentElement.classList.toggle('collapsed', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- кнопки: мягкое увеличение при касании (наведение — в стилях) ---------- */
const POP = '.btn,.link,.door,.pkg,.date:not([disabled]),.step,.mini-step button,.chips button,.book-tabs button,.book-arrow,.menu-btn,.design,.check,.seg label';
addEventListener('pointerdown', e => {
  const el = e.target.closest(POP); if (!el) return;
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}, { passive: true });
addEventListener('animationend', e => { if (e.animationName === 'pop') e.target.classList.remove('pop'); });

/* ---------- меню ---------- */
const menuBtn = $('#menuBtn'), mnav = $('#mnav');
const setMenu = open => {
  mnav.hidden = !open; menuBtn.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-label', open ? 'Закрыть разделы' : 'Все разделы');
};
menuBtn.onclick = () => setMenu(mnav.hidden);
mnav.addEventListener('click', e => { if (e.target.closest('a,button')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !mnav.hidden) setMenu(false); });

/* ---------- свободные даты ---------- */
const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const freeDates = () => CONFIG.dates.filter(d => d[1]);
const dateLabel = iso => { const d = new Date(iso + 'T12:00'); return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + ', ' + WD[d.getDay()]; };
function renderDates() {
  const free = freeDates().length;
  $$('[data-dates-left]').forEach(el => el.textContent = free
    ? `${free} ${plural(free, 'свободная дата', 'свободные даты', 'свободных дат')} на ${CONFIG.month}`
    : `Все даты на ${CONFIG.month} заняты`);
  const list = $('#datesList'); if (!list) return;
  list.innerHTML = CONFIG.dates.map(([iso, ok]) => {
    const d = new Date(iso + 'T12:00');
    return `<button class="date" role="listitem" ${ok ? '' : 'disabled aria-label="занято"'} data-date="${iso}"><b>${d.getDate()}</b><span>${WD[d.getDay()]}${ok ? '' : ' · занято'}</span></button>`;
  }).join('');
  $$('.date:not([disabled])', list).forEach(b => b.onclick = () => openLead('Забронировать съёмку', { date: b.dataset.date }));
}

/* ---------- калькулятор (на странице категории, категория уже выбрана) ---------- */
const st = { kind: PAGE_KIND || 'sad', pkg: 'standart', kids: 25, spreads: 0, fastPhoto: false, fastLayout: false, organizer: true, studio: false };
const studioOn = () => st.kind === 'star' && st.studio && STUDIO_PRICE[st.pkg];
const priceOf = p => st.kind === 'star' && st.studio && STUDIO_PRICE[p.id] ? STUDIO_PRICE[p.id] : p.price;
(function readUrl() {
  const q = new URLSearchParams(location.search);
  if (PACKAGES.some(p => p.id === q.get('p'))) st.pkg = q.get('p');
  const n = +q.get('n'); if (n >= 15 && n <= 40) st.kids = n;
})();
function calc() {
  const p = PACKAGES.find(x => x.id === st.pkg);
  const one = priceOf(p) + st.spreads * SPREAD;
  const fees = (st.fastPhoto ? FAST_PHOTO : 0) + (st.fastLayout ? FAST_LAYOUT : 0);
  const disc = st.organizer ? Math.round(one / 2) : 0;
  const total = one * st.kids + fees - disc;
  const per = Math.ceil((one + fees / st.kids) / 10) * 10;
  return { p, one, fees, disc, total, per, org: one - disc + Math.ceil(fees / st.kids / 10) * 10 };
}
function update() {
  const r = calc();
  $('#kidsOut').textContent = st.kids;
  $('#kids').value = st.kids;
  $('#spreadsOut').textContent = st.spreads;
  $('#rTitle').textContent = `${KINDS[st.kind]} · ${r.p.name}`;
  $$('#pkgs [data-price]').forEach(el => el.textContent = rub(priceOf(PACKAGES.find(p => p.id === el.dataset.price))));
  $('#studioRow').hidden = st.kind !== 'star';
  $('#studio').checked = st.studio;
  $('#studioHint').textContent = st.pkg === 'mini' ? 'для «Мини» цену в студии уточним' : 'студия входит в цену альбома';
  const lines = [[`${st.kids} × ${r.p.name}${st.spreads ? ` +${st.spreads} разв.` : ''}`, rub(r.one * st.kids)]];
  if (st.fastPhoto) lines.push(['Обработка за 3 дня', rub(FAST_PHOTO)]);
  if (st.fastLayout) lines.push(['Вёрстка за 7 дней', rub(FAST_LAYOUT)]);
  if (st.kind === 'star' && st.studio) lines.push(studioOn() ? ['Съёмка в студии', 'входит'] : ['Студия для «Мини»', 'уточним']);
  if (st.organizer) lines.push(['Скидка организатору −50%', '−' + rub(r.disc), 'minus']);
  $('#rLines').innerHTML = lines.map(([a, b, c]) => `<li class="${c || ''}"><span>${a}</span><b>${b}</b></li>`).join('');
  $('#rTotal').textContent = rub(r.total);
  $('#rPer').textContent = rub(r.per);
  $('#rOrgBox').hidden = !st.organizer;
  $('#rOrg').textContent = rub(r.org);
}
function bindCalc() {
  if (!$('#calcForm')) return;
  $('#pkgs').innerHTML = PACKAGES.map(p => `
    <label class="pkg"><input type="radio" name="pkg" value="${p.id}" ${p.id === st.pkg ? 'checked' : ''}>
      <b>${p.name}</b><i>${spreadsWord(p.spreads)}</i><strong data-price="${p.id}">${rub(p.price)}</strong></label>`).join('');
  $$('#pkgs input').forEach(i => i.onchange = () => { st.pkg = i.value; update(); });
  $('#kids').oninput = e => { st.kids = +e.target.value; update(); };
  $$('[data-step]').forEach(b => b.onclick = () => { st.kids = Math.min(40, Math.max(15, st.kids + +b.dataset.step)); update(); });
  $$('[data-spread]').forEach(b => b.onclick = () => { st.spreads = Math.min(6, Math.max(0, st.spreads + +b.dataset.spread)); update(); });
  ['fastPhoto', 'fastLayout', 'organizer', 'studio'].forEach(k => { $('#' + k).checked = st[k]; $('#' + k).onchange = e => { st[k] = e.target.checked; update(); }; });
  bindShare();
  update();
}

/* ---------- отправить расчёт родителям ---------- */
const shareLink = () => `${CONFIG.siteUrl}${KIND_PAGE[st.kind]}?p=${st.pkg}&n=${st.kids}#calc`;
function shareMessage() {
  const r = calc();
  const who = st.kind === 'sad' ? 'группы' : 'класса';
  return [
    `Родители, предлагаю заказать выпускной альбом для нашей ${who} в Barbustudio (Пермь).`,
    '',
    'Варианты, цена за один альбом:',
    ...PACKAGES.map(p => `• ${p.name} — ${spreadsWord(p.spreads)} — ${rub(priceOf(p))}`),
    '',
    `Предлагаю «${r.p.name}»${st.spreads ? ` с доп. разворотом (+${st.spreads})` : ''}: при ${st.kids} детях — ${rub(r.per)} с каждого.`,
    'У каждого выпускника своя обложка, печать на настоящей фотобумаге, макет проверяем перед печатью.',
    '',
    `Посмотреть альбомы и расчёт: ${shareLink()}`,
  ].join('\n');
}
function openShare() { $('#shareText').value = shareMessage(); syncShare(); $('#shNative').hidden = !navigator.share; $('#shareDlg').showModal(); }
function syncShare() {
  const t = $('#shareText').value, enc = encodeURIComponent(t);
  $('#shTg').href = `https://t.me/share/url?url=${encodeURIComponent(shareLink())}&text=${encodeURIComponent(t.replace(/\n*Посмотреть[^\n]*$/, ''))}`;
  $('#shWa').href = `https://wa.me/?text=${enc}`;
  $('#shVk').href = `https://vk.com/share.php?url=${encodeURIComponent(shareLink())}&title=${encodeURIComponent('Выпускной альбом — Barbustudio')}&comment=${enc}`;
}
function bindShare() {
  $('#shareBtn').onclick = openShare;
  $('#leadDoneShare').hidden = false;
  $('#leadDoneShare').onclick = () => { $('#leadDlg').close(); openShare(); };
  $('#shareText').oninput = syncShare;
  $('#shCopy').onclick = async () => {
    try { await navigator.clipboard.writeText($('#shareText').value); toast('Сообщение скопировано — вставьте в чат родителей'); }
    catch { $('#shareText').select(); document.execCommand('copy'); toast('Скопировано'); }
  };
  $('#shNative').onclick = () => navigator.share({ text: $('#shareText').value }).catch(() => {});
}

/* ---------- заявка ---------- */
let leadSource = '';
function openLead(title, pre = {}) {
  const f = $('#leadForm');
  leadSource = title + (PAGE_KIND ? ` (${KINDS[PAGE_KIND]})` : '');
  $('#leadTitle').textContent = title;
  f.hidden = false; $('#leadDone').hidden = true; $('#leadErr').hidden = true;
  f.pkg.innerHTML = '<option value="">Ещё не выбрали</option>' + PACKAGES.map(p => `<option value="${p.id}">${p.name} — ${rub(priceOf(p))}</option>`).join('');
  f.date.innerHTML = '<option value="">Обсудим</option>' + freeDates().map(([d]) => `<option value="${d}">${dateLabel(d)}</option>`).join('');
  if (pre.pkg) f.pkg.value = pre.pkg;
  if (pre.date) f.date.value = pre.date;
  const box = $('#leadCalc');
  if (pre.withCalc && $('#calcForm')) {
    const r = calc();
    f.pkg.value = st.pkg; f.kids.value = st.kids;
    box.textContent = `${KINDS[st.kind]} · ${r.p.name} · ${st.kids} детей — ${rub(r.total)} на класс, ${rub(r.per)} с родителя`;
    box.hidden = false;
  } else box.hidden = true;
  $('#leadDlg').showModal();
  setTimeout(() => f.name.focus(), 50);
}
function bindLead() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lead]');
    if (b) openLead(b.dataset.lead, { pkg: b.dataset.pkg, withCalc: b.hasAttribute('data-with-calc') });
  });
  const f = $('#leadForm');
  f.phone.addEventListener('input', () => f.phone.removeAttribute('aria-invalid'));
  f.onsubmit = async e => {
    e.preventDefault();
    const err = $('#leadErr'), digits = f.phone.value.replace(/\D/g, '');
    let msg = '';
    if (!f.name.value.trim()) msg = 'Напишите, как к вам обращаться';
    else if (digits.length < 10) { msg = 'Проверьте номер телефона'; f.phone.setAttribute('aria-invalid', 'true'); }
    else if (!f.agree.checked) msg = 'Нужно согласие на обработку данных';
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    const r = calc();
    const data = {
      source: leadSource, name: f.name.value.trim(), phone: f.phone.value.trim(), place: f.place.value.trim(),
      kids: f.kids.value, pkg: f.pkg.value, date: f.date.value,
      calc: $('#leadCalc').hidden ? null : { kind: KINDS[st.kind], pkg: r.p.name, kids: st.kids, spreads: st.spreads, total: r.total, perParent: r.per },
    };
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Отправляем…';
    try {
      if (CONFIG.leadEndpoint) {
        const res = await fetch(CONFIG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
      } else { console.info('Демо: заявка', data); await new Promise(r => setTimeout(r, 500)); }
      f.hidden = true; $('#leadDone').hidden = false; f.reset();
    } catch {
      err.textContent = `Не получилось отправить. Позвоните нам: ${CONFIG.phone}`; err.hidden = false;
    } finally { btn.disabled = false; btn.textContent = 'Отправить заявку'; }
  };
}

/* ---------- альбомы и цены (страница категории) ---------- */
function renderPrices() {
  const box = $('#priceCards'); if (!box) return;
  const k = PAGE_KIND;
  box.innerHTML = PACKAGES.map(p => `
    <article class="pcard ${p.hit ? 'hit' : ''}">
      <figure><img src="${ROOT}img/t/${PKG_IMG[k][p.id]}.jpg" alt="Альбом «${p.name}»" loading="lazy"></figure>
      <div class="pcard-body">
        <p class="pcard-tag">${p.hit ? 'Чаще всего выбирают' : '&nbsp;'}</p>
        <h3>${p.name}</h3>
        <p class="pcard-sub">${spreadsWord(p.spreads)}</p>
        <p class="price num">${rub(p.price)} <small>за альбом</small></p>
        <ul>${PKG_ITEMS[k][p.id].map(([h, d]) => `<li><b>${h}</b>${d ? `<span>${d}</span>` : ''}</li>`).join('')}</ul>
        <button class="btn ${p.hit ? 'btn-accent' : 'btn-ghost'}" data-lead="Заказать «${p.name}»" data-pkg="${p.id}">Заказать</button>
      </div>
    </article>`).join('');
  const note = $('#studioNote');
  if (note) { note.hidden = k !== 'star'; note.innerHTML = 'Снимаем в школе или в студии. Со студией в цене: <b>«Стандарт» 3 000 ₽</b>, <b>«Премиум» 4 100 ₽</b>.'; }
  $('#addonsList').innerHTML = [
    ['Дополнительный разворот', '400 ₽'], ['Дополнительный выезд фотографа', VISIT[k]],
    ['Обработка фотографий за 3 дня', '3 000 ₽'], ['Вёрстка макета за 7 дней', '5 000 ₽'],
  ].map(([a, b]) => `<li><span>${a}</span><b class="num">${b}</b></li>`).join('');
}

/* ---------- дизайны (страница категории) ---------- */
function renderDesigns() {
  const grid = $('#designGrid'); if (!grid) return;
  const list = DESIGNS[PAGE_KIND].filter(d => d[1]); // без фото не показываем
  grid.innerHTML = list.map(([n, img]) =>
    `<button class="design" data-img="${img}"><span class="design-img"><img src="${ROOT}img/t/${img}.jpg" alt="Дизайн «${n}»" loading="lazy"></span><span class="design-n">${n}</span></button>`).join('');
  grid.onclick = e => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    const L = list.map(([, img]) => [img + '.jpg']);
    openLbList(L, L.findIndex(x => x[0] === b.dataset.img + '.jpg'));
  };
}

/* ---------- листалка ---------- */
const book = { album: 0, cur: 0, leaves: 0 };
function renderBook() {
  const a = ALBUMS[book.album], el = $('#book3d');
  const pages = Array.from({ length: a.pages }, (_, i) => `${ROOT}book/${a.id}-${String(i).padStart(2, '0')}.jpg`);
  pages.push(null); // задняя обложка
  book.leaves = Math.ceil(pages.length / 2); book.cur = 0;
  let html = '';
  for (let i = 0; i < book.leaves; i++) {
    const fr = pages[2 * i], bk = pages[2 * i + 1];
    const face = (src, cls) => src ? `<div class="face ${cls}" style="background-image:url('${src}')"></div>` : `<div class="face ${cls} end">${a.end}</div>`;
    html += `<div class="leaf" data-i="${i}">${face(fr, 'front' + (i === 0 ? ' cover' : ''))}${face(bk, 'back')}</div>`;
  }
  el.innerHTML = html;
  $$('.leaf', el).forEach(l => l.onclick = () => +l.dataset.i < book.cur ? flip(-1) : flip(1));
  layoutBook();
  pages.slice(1, 5).forEach(s => s && (new Image().src = s));
}
function layoutBook() {
  const el = $('#book3d');
  $$('.leaf', el).forEach((l, i) => {
    const f = i < book.cur;
    l.classList.toggle('flipped', f);
    l.style.zIndex = f ? i + 1 : book.leaves - i;
  });
  el.classList.toggle('closed', book.cur === 0);
  el.classList.toggle('ended', book.cur === book.leaves);
  $('#bookPrev').disabled = book.cur === 0;
  $('#bookNext').disabled = book.cur === book.leaves;
  $('#bookCount').textContent = book.cur === 0 ? 'Обложка' : book.cur === book.leaves ? 'Конец альбома' : `Разворот ${book.cur} из ${book.leaves - 1}`;
  const a = ALBUMS[book.album], next = 2 * book.cur + 2;
  [next, next + 1].forEach(i => i < a.pages && (new Image().src = `${ROOT}book/${a.id}-${String(i).padStart(2, '0')}.jpg`));
}
function flip(d) {
  const c = book.cur + d;
  if (c < 0 || c > book.leaves) return;
  const leaf = $$('#book3d .leaf')[d > 0 ? book.cur : c];
  if (leaf) leaf.style.zIndex = 100;
  book.cur = c;
  requestAnimationFrame(() => { layoutBook(); if (leaf) leaf.style.zIndex = 100; setTimeout(() => layoutBook(), 900); });
}
function bindBook() {
  if (!$('#book3d')) return;
  $('#bookTabs').innerHTML = ALBUMS.map((a, i) => `<button role="tab" aria-selected="${i === 0}" data-a="${i}">${a.title}</button>`).join('');
  $$('#bookTabs button').forEach(b => b.onclick = () => {
    $$('#bookTabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    book.album = +b.dataset.a; renderBook();
  });
  $('#bookPrev').onclick = () => flip(-1);
  $('#bookNext').onclick = () => flip(1);
  const el = $('#book3d');
  el.onkeydown = e => { if (e.key === 'ArrowRight') flip(1); if (e.key === 'ArrowLeft') flip(-1); };
  let x0 = null, y0 = 0, swiped = false;
  el.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; swiped = false; });
  el.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; flip(dx < 0 ? 1 : -1); }
  });
  el.addEventListener('click', e => { if (swiped) { e.stopPropagation(); swiped = false; } }, true);
  renderBook();
}

/* ---------- фото: вся галерея (страница «Фото») или подборка категории ---------- */
const CATS = [['all', 'Все'], ['sad', 'Детский сад'], ['young', 'Начальная школа'], ['old', 'Старшая школа'], ['album', 'Альбомы и обложки'], ['more', 'Ещё съёмки']];
const gal = { cat: 'all', shown: 24, list: [] };
const MIXED = (() => {
  const by = ['young', 'old', 'album', 'sad', 'more'].map(c => GALLERY.filter(g => g[3] === c));
  const out = [];
  for (let i = 0; out.length < GALLERY.length; i++) by.forEach(l => l[i] && out.push(l[i]));
  return out;
})();
function renderGallery() {
  const box = $('#masonry');
  gal.list = PAGE_KIND ? GALLERY.filter(KIND_PHOTO[PAGE_KIND]) : gal.cat === 'all' ? MIXED : GALLERY.filter(g => g[3] === gal.cat);
  box.innerHTML = gal.list.slice(0, gal.shown).map(([n, w, h], i) =>
    `<button data-i="${i}" aria-label="Открыть фото"><img src="${ROOT}img/t/${n}" width="${w}" height="${h}" loading="lazy" decoding="async" alt=""></button>`).join('');
  const more = $('#moreBtn');
  if (more) { more.hidden = gal.shown >= gal.list.length; more.textContent = `Показать ещё ${gal.list.length - gal.shown}`; }
}
function bindGallery() {
  if (!$('#masonry')) return;
  if (PAGE_KIND) gal.shown = 12;
  const chips = $('#chips');
  if (chips) {
    chips.innerHTML = CATS.map(([id, t]) => `<button role="tab" aria-selected="${id === 'all'}" data-c="${id}">${t}</button>`).join('');
    $$('button', chips).forEach(b => b.onclick = () => {
      $$('button', chips).forEach(x => x.setAttribute('aria-selected', x === b));
      gal.cat = b.dataset.c; gal.shown = 24; renderGallery();
    });
  }
  const more = $('#moreBtn'); if (more) more.onclick = () => { gal.shown += 24; renderGallery(); };
  $('#masonry').onclick = e => { const b = e.target.closest('button'); if (b) openLb(+b.dataset.i); };
  renderGallery();
}
let lbI = 0, lbList = null;
function openLb(i) { lbList = null; lbI = i; showLb(); $('#lb').showModal(); }
function openLbList(list, i) { lbList = list; lbI = Math.max(0, i); showLb(); $('#lb').showModal(); }
function showLb() {
  const L = lbList || gal.list, n = L.length; lbI = (lbI + n) % n;
  $('#lbImg').src = ROOT + 'img/' + L[lbI][0];
  $('#lbN').textContent = `${lbI + 1} / ${n}`;
  const nx = L[(lbI + 1) % n]; if (nx) new Image().src = ROOT + 'img/' + nx[0];
}
function bindLb() {
  const lb = $('#lb');
  $('#lbX').onclick = () => lb.close();
  $('#lbPrev').onclick = () => { lbI--; showLb(); };
  $('#lbNext').onclick = () => { lbI++; showLb(); };
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { lbI++; showLb(); } if (e.key === 'ArrowLeft') { lbI--; showLb(); } });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  let x0 = null;
  lb.addEventListener('pointerdown', e => x0 = e.clientX);
  lb.addEventListener('pointerup', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) { lbI += e.clientX < x0 ? 1 : -1; showLb(); } x0 = null; });
}

/* ---------- отзывы ---------- */
let revAll = false;
const revText = t => esc(t.replace(/([!?.])\1{3,}/g, '$1$1$1')).replace(/\n/g, '<br>');
const revLead = () => REVIEWS.reduce((a, b) => b[0].length > a[0].length ? b : a);
function renderReviews() {
  $$('[data-rev-count]').forEach(el => el.textContent = `${REVIEWS.length} ${plural(REVIEWS.length, 'отзыв', 'отзыва', 'отзывов')}`);
  const lead = revLead();
  $$('[data-rev-lead]').forEach(el => el.innerHTML = `<blockquote>${revText(lead[0])}</blockquote><figcaption>${esc(lead[1])}</figcaption>`);
  const grid = $('#revGrid'); if (!grid) return;
  const rest = REVIEWS.filter(r => r !== lead);
  const list = revAll ? rest : rest.slice(0, 12);
  grid.innerHTML = list.map(([t, n]) => `<figure class="rev"><blockquote>${revText(t)}</blockquote><figcaption>${esc(n)}</figcaption></figure>`).join('');
  const more = $('#revMore');
  more.hidden = revAll; more.textContent = `Показать все ${REVIEWS.length} ${plural(REVIEWS.length, 'отзыв', 'отзыва', 'отзывов')}`;
  more.onclick = () => { revAll = true; renderReviews(); };
}

/* ---------- блог ---------- */
function renderBlog() {
  const grid = $('#blogGrid'); if (!grid) return;
  grid.innerHTML = POSTS.map((p, i) => `
    <article class="post-card">
      <button data-post="${i}" ${p.body.length ? '' : 'disabled'}>
        <span class="post-img"><img src="${ROOT}img/t/${p.img}.jpg" alt="" loading="lazy"></span>
        <h3>${p.title}</h3>
        ${p.body.length ? `<p>${p.body[0].length > 110 ? p.body[0].slice(0, 105).replace(/\s\S*$/, '') + '…' : p.body[0]}</p>` : ''}
      </button>
    </article>`).join('');
  grid.onclick = e => {
    const b = e.target.closest('[data-post]'); if (!b || b.disabled) return;
    const p = POSTS[+b.dataset.post];
    $('#postImg').src = `${ROOT}img/${p.img}.jpg`; $('#postTitle').textContent = p.title;
    $('#postBody').innerHTML = p.body.map(x => `<p>${x}</p>`).join('');
    $('#postDlg').showModal();
  };
}

/* ---------- вопросы: все или первые несколько ---------- */
function renderFaq() {
  $$('[data-faq]').forEach(box => {
    const n = +box.dataset.faq || FAQ.length;
    box.innerHTML = FAQ.slice(0, n).map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
    $$('details', box).forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('details', box).forEach(o => o !== d && (o.open = false)); }));
  });
}

// закрытие окон кликом по фону
$$('dialog.sheet').forEach(d => d.addEventListener('click', e => {
  if (e.target !== d) return;
  const r = d.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
}));

renderDates(); renderPrices(); renderDesigns(); bindCalc(); bindLead(); bindBook(); bindGallery(); bindLb(); renderReviews(); renderBlog(); renderFaq();
