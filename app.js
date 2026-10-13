/* Barbus Studio — логика сайта. Всё, что меняет владелец, — в CONFIG. */
const CONFIG = {
  // Куда уходит заявка. Пусто — демо-режим (заявка не отправляется, показывается «отправлено»).
  // Сервер принимает POST JSON и пересылает в Telegram (токен бота хранится на сервере, не здесь).
  leadEndpoint: '',
  // Даты весенних съёмок: free — свободна. Пример — заменить на настоящий календарь.
  month: 'май',
  dates: [
    ['2027-05-04', false], ['2027-05-06', true], ['2027-05-11', false], ['2027-05-13', true],
    ['2027-05-14', true], ['2027-05-17', false], ['2027-05-19', true], ['2027-05-20', false],
    ['2027-05-21', true], ['2027-05-25', true], ['2027-05-26', false], ['2027-05-27', true],
  ],
  siteUrl: 'https://barbustudio.ru/',
};

const PACKAGES = [
  { id: 'mini', name: 'Мини', spreads: 1, price: 1600, img: 'img/sad-premium-03.jpg',
    items: ['Индивидуальная обложка', '1 разворот — общее фото в виньетках', '1 выезд фотографа'] },
  { id: 'standart', name: 'Стандарт', spreads: 3, price: 2700, img: 'img/sadik-standart-01.jpg', hit: true,
    items: ['Индивидуальная обложка', 'Разворот с фотографиями выпускника', 'Коллаж с именами и фамилиями всех выпускников', 'Общие и групповые фото, фото с друзьями', '1 выезд + досъёмка отсутствующих'] },
  { id: 'premium', name: 'Премиум', spreads: 5, price: 3800, img: 'img/sad-premium-04.jpg',
    items: ['Индивидуальная обложка', 'Разворот с фотографиями выпускника', 'Выпускник с друзьями', 'Коллаж с именами и фамилиями', 'Общие и групповые фото, фото прошлых лет', '2 выезда + досъёмка отсутствующих'] },
];
const KINDS = { sad: 'Детский сад', nach: 'Начальная школа', star: 'Старшая школа' };
const SPREAD = 400, FAST_PHOTO = 3000, FAST_LAYOUT = 5000, ADVANCE = 5000;

const ALBUMS = [
  { id: 'd', title: '9 «Д» · серо-оранжевый', pages: 11, end: 'Выпускники 2026' },
  { id: 'b', title: '9 «Б» · «Выпуск 2026»', pages: 11, end: 'Школа, мы будем тебя вспоминать' },
  { id: 'v', title: '9 «В» · бело-синий', pages: 9, end: 'Выпускной альбом 2025' },
];

const REVIEWS = [
  ['Фотографии шикарные!! Качество супер! Я даже весь класс просмотрела в облаке! Спасибо за такую красоту!', 'Анжелика'],
  ['Прекрасные альбомы. Хорошее качество исполнения, а фото как всегда великолепны. Альбомы заказывали неоднократно и будем заказывать ещё', 'Елена'],
  ['Спасибо за великолепные фото, не первый раз сотрудничаем и будем продолжать. Спасибо Екатерине за её профессионализм.', 'Екатерина'],
  ['Спасибо за живые и настоящие фотографии, за эмоции детей, за их улыбки и непосредственность', 'Валерия'],
  ['Огромное спасибо за фотографии! Получились замечательные, живые и очень красивые! Фотограф работал быстро и профессионально.', 'Эльвира'],
  ['Спасибо, Екатерина, сын на ваших фото всегда красавчик', 'Ксения'],
  ['Спасибо за классные альбомы! Фотографии чёткие, яркие! Альбомы просто огонь', 'Екатерина'],
  ['Екатерина, спасибо за вашу работу! С вами непринуждённо и легко. Вы, определённо, профессионал своего дела!', 'Оксана'],
  ['Большое спасибо за качество, скорость, креативность!', 'Надежда'],
  ['Не первый раз заказываем у вас фотосессии и каждый раз в восторге. Будем и дальше сотрудничать', 'Валерия'],
  ['Отличные кадры на память о важном событии ребёнка! Фотограф — чудо!', 'Алена'],
  ['Благодарю за качественные фотографии и альбом', 'Ильнара'],
  ['Классные фото класса получились, я доволен!', 'Михаил'],
  ['Очень понравились фото! Красивые, добрые оттенки, цветовая гамма', 'София'],
];

const FAQ = [
  ['Заключаете ли вы договор?', 'Да, конечно. В договоре фиксируются сроки изготовления, стоимость альбома, общая сумма заказа, прописываются скидки и бонусы.'],
  ['Что нужно для заключения договора?', 'Данные заказчика и предоплата 5 000 ₽.'],
  ['Какое минимальное количество альбомов?', 'Минимальная партия — 15 экземпляров. Если выпускников меньше, стоимость рассчитывается индивидуально.'],
  ['Ребёнок пропустил фотосессию — что делать?', 'Предусмотрена бесплатная досъёмка отсутствующих — один дополнительный выезд.'],
  ['Можно ли родителям присутствовать на съёмке?', 'Да, не более двух представителей от родителей. Присутствие родителя-заказчика обязательно. Пожелания лучше озвучить до начала фотосессии, чтобы фотограф учёл их в работе.'],
  ['Сколько делается альбом?', 'Примерно 2 месяца от фотосессии до выдачи готовых альбомов — при условии, что заказчик соблюдает сроки согласования.'],
  ['Увидим ли мы альбом перед печатью?', 'Да. Мы присылаем макеты на проверку и вносим правки по вашим пожеланиям. Печатаем только после утверждения макетов.'],
  ['Как происходит оплата?', 'Для бронирования — предоплата 5 000 ₽, остальная сумма вносится при отправке альбомов в печать.'],
  ['Что делать, если обнаружили брак?', 'Проверьте альбомы сразу при получении. Если нашли брак — сообщите нам и оформите документально. Брак по вине печати или транспортной компании возместим: альбомы переделаем или исправим.'],
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = n => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200); };

/* ---------- шапка и нижняя панель ---------- */
const onScroll = () => {
  $('#head').classList.toggle('scrolled', scrollY > 8);
  $('#dock').classList.toggle('show', scrollY > innerHeight * .7);
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
// высота шапки — для разделов «ровно на экран» и отступа при переходе из меню
const setHead = () => document.documentElement.style.setProperty('--head', $('#head').offsetHeight + 'px');
addEventListener('resize', setHead); setHead();

/* ---------- даты ---------- */
const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
function renderDates() {
  const free = CONFIG.dates.filter(d => d[1]).length;
  $('#datesLeft').innerHTML = free
    ? `Осталось <b>${free}</b> ${plural(free, 'свободная дата', 'свободные даты', 'свободных дат')} на ${CONFIG.month}`
    : `Все даты на ${CONFIG.month} заняты`;
  $('#datesList').innerHTML = CONFIG.dates.map(([iso, ok]) => {
    const d = new Date(iso + 'T12:00');
    return `<button class="date" role="listitem" ${ok ? '' : 'disabled aria-label="занято"'} data-date="${iso}"><b>${d.getDate()}</b><span>${WD[d.getDay()]}${ok ? '' : ' · занято'}</span></button>`;
  }).join('');
  $$('#datesList .date:not([disabled])').forEach(b => b.onclick = () => openLead('Забронировать съёмку', { date: b.dataset.date }));
}
const dateLabel = iso => { const d = new Date(iso + 'T12:00'); return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + ', ' + WD[d.getDay()]; };

/* ---------- калькулятор ---------- */
const st = { kind: 'sad', pkg: 'standart', kids: 25, spreads: 0, fastPhoto: false, fastLayout: false, organizer: true };
(function readUrl() {
  const q = new URLSearchParams(location.search);
  if (KINDS[q.get('k')]) st.kind = q.get('k');
  if (PACKAGES.some(p => p.id === q.get('p'))) st.pkg = q.get('p');
  const n = +q.get('n'); if (n >= 15 && n <= 40) st.kids = n;
})();

function calc() {
  const p = PACKAGES.find(x => x.id === st.pkg);
  const one = p.price + st.spreads * SPREAD;
  const fees = (st.fastPhoto ? FAST_PHOTO : 0) + (st.fastLayout ? FAST_LAYOUT : 0);
  const disc = st.organizer ? Math.round(one / 2) : 0;
  const total = one * st.kids + fees - disc;
  const per = Math.ceil((one + fees / st.kids) / 10) * 10;
  return { p, one, fees, disc, total, per, org: one - disc + Math.ceil(fees / st.kids / 10) * 10 };
}

function renderPkgs() {
  $('#pkgs').innerHTML = PACKAGES.map(p => `
    <label class="pkg"><input type="radio" name="pkg" value="${p.id}" ${p.id === st.pkg ? 'checked' : ''}>
      <b>${p.name}</b><i>${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')}</i><strong>${rub(p.price)}</strong></label>`).join('');
  $$('#pkgs input').forEach(i => i.onchange = () => { st.pkg = i.value; update(); });
}

function update() {
  const r = calc();
  $('#kidsOut').textContent = st.kids;
  $('#kids').value = st.kids;
  $('#spreadsOut').textContent = st.spreads;
  $(`#segKind input[value=${st.kind}]`).checked = true;
  $('#rTitle').textContent = `${KINDS[st.kind]} · ${r.p.name}`;
  const lines = [[`${st.kids} × ${r.p.name}${st.spreads ? ` +${st.spreads} разв.` : ''}`, rub(r.one * st.kids)]];
  if (st.fastPhoto) lines.push(['Обработка за 3 дня', rub(FAST_PHOTO)]);
  if (st.fastLayout) lines.push(['Вёрстка за 7 дней', rub(FAST_LAYOUT)]);
  if (st.organizer) lines.push(['Скидка организатору −50%', '−' + rub(r.disc), 'minus']);
  $('#rLines').innerHTML = lines.map(([a, b, c]) => `<li class="${c || ''}"><span>${a}</span><b>${b}</b></li>`).join('');
  $('#rTotal').textContent = rub(r.total);
  $('#rPer').textContent = rub(r.per);
  $('#rOrgBox').hidden = !st.organizer;
  $('#rOrg').textContent = rub(r.org);
}

function bindCalc() {
  renderPkgs();
  $$('#segKind input').forEach(i => i.onchange = () => { st.kind = i.value; update(); });
  $('#kids').oninput = e => { st.kids = +e.target.value; update(); };
  $$('[data-step]').forEach(b => b.onclick = () => { st.kids = Math.min(40, Math.max(15, st.kids + +b.dataset.step)); update(); });
  $$('[data-spread]').forEach(b => b.onclick = () => { st.spreads = Math.min(6, Math.max(0, st.spreads + +b.dataset.spread)); update(); });
  ['fastPhoto', 'fastLayout', 'organizer'].forEach(k => { $('#' + k).checked = st[k]; $('#' + k).onchange = e => { st[k] = e.target.checked; update(); }; });
  update();
}

/* ---------- поделиться с родителями ---------- */
function shareLink() {
  return `${CONFIG.siteUrl}?k=${st.kind}&p=${st.pkg}&n=${st.kids}#calc`;
}
function shareMessage() {
  const r = calc();
  const who = st.kind === 'sad' ? 'группы' : 'класса';
  return [
    `Родители, предлагаю заказать выпускной альбом для нашей ${who} в Barbus Studio (Пермь).`,
    '',
    'Варианты, цена за один альбом:',
    ...PACKAGES.map(p => `• ${p.name} — ${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')} — ${rub(p.price)}`),
    '',
    `Предлагаю «${r.p.name}»${st.spreads ? ` с доп. разворотом (+${st.spreads})` : ''}: при ${st.kids} детях — ${rub(r.per)} с каждого.`,
    'У каждого выпускника своя обложка, печать на настоящей фотобумаге, макет проверяем перед печатью.',
    '',
    `Полистать готовые альбомы и посмотреть расчёт: ${shareLink()}`,
  ].join('\n');
}
function openShare() {
  $('#shareText').value = shareMessage();
  syncShare();
  $('#shNative').hidden = !navigator.share;
  $('#shareDlg').showModal();
}
function syncShare() {
  const t = $('#shareText').value, enc = encodeURIComponent(t);
  $('#shTg').href = `https://t.me/share/url?url=${encodeURIComponent(shareLink())}&text=${encodeURIComponent(t.replace(/\n*Полистать[^\n]*$/, ''))}`;
  $('#shWa').href = `https://wa.me/?text=${enc}`;
  $('#shVk').href = `https://vk.com/share.php?url=${encodeURIComponent(shareLink())}&title=${encodeURIComponent('Выпускной альбом — Barbus Studio')}&comment=${enc}`;
}
function bindShare() {
  $('#shareBtn').onclick = openShare;
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
  leadSource = title;
  $('#leadTitle').textContent = title;
  f.hidden = false; $('#leadDone').hidden = true; $('#leadErr').hidden = true;
  f.pkg.innerHTML = '<option value="">Ещё не выбрали</option>' + PACKAGES.map(p => `<option value="${p.id}">${p.name} — ${rub(p.price)}</option>`).join('');
  f.date.innerHTML = '<option value="">Обсудим</option>' + CONFIG.dates.filter(d => d[1]).map(([d]) => `<option value="${d}">${dateLabel(d)}</option>`).join('');
  if (pre.pkg) f.pkg.value = pre.pkg;
  if (pre.date) f.date.value = pre.date;
  const box = $('#leadCalc');
  if (pre.withCalc) {
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
      err.textContent = 'Не получилось отправить. Позвоните нам: +7 (965) 55-88-008'; err.hidden = false;
    } finally { btn.disabled = false; btn.textContent = 'Отправить заявку'; }
  };
}

/* ---------- цены ---------- */
function renderPrices() {
  $('#priceCards').innerHTML = PACKAGES.map(p => `
    <article class="pcard ${p.hit ? 'hit' : ''}">
      <figure><img src="${p.img.replace('img/', 'img/t/')}" alt="Альбом «${p.name}»" loading="lazy"></figure>
      <div class="pcard-body">
        ${p.hit ? '<span class="badge">Чаще всего выбирают</span>' : ''}
        <h3>${p.name}<small>${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')}</small></h3>
        <p class="price">${rub(p.price)} <small>за альбом</small></p>
        <ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
        <button class="btn ${p.hit ? 'btn-coral' : 'btn-ink'}" data-lead="Заказать «${p.name}»" data-pkg="${p.id}">Заказать</button>
      </div>
    </article>`).join('');
}

/* ---------- листалка ---------- */
const book = { album: 0, cur: 0, leaves: 0 };
function renderBook() {
  const a = ALBUMS[book.album], el = $('#book3d');
  const pages = Array.from({ length: a.pages }, (_, i) => `book/${a.id}-${String(i).padStart(2, '0')}.jpg`);
  pages.push(null); // задняя обложка
  book.leaves = Math.ceil(pages.length / 2); book.cur = 0;
  let html = '';
  for (let i = 0; i < book.leaves; i++) {
    const fr = pages[2 * i], bk = pages[2 * i + 1];
    const face = (src, cls) => src ? `<div class="face ${cls}" style="background-image:url('${src}')"></div>`
                                   : `<div class="face ${cls} end">${a.end}</div>`;
    html += `<div class="leaf" data-i="${i}">${face(fr, 'front' + (i === 0 ? ' cover' : ''))}${face(bk, 'back')}</div>`;
  }
  el.innerHTML = html;
  $$('.leaf', el).forEach(l => l.onclick = () => +l.dataset.i < book.cur ? flip(-1) : flip(1));
  layoutBook();
  // заранее грузим следующие страницы
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
  const n = book.leaves - 1;
  $('#bookCount').textContent = book.cur === 0 ? 'Обложка' : book.cur === book.leaves ? 'Конец альбома' : `Разворот ${book.cur} из ${n}`;
  const a = ALBUMS[book.album];
  const next = 2 * book.cur + 2;
  [next, next + 1].forEach(i => i < a.pages && (new Image().src = `book/${a.id}-${String(i).padStart(2, '0')}.jpg`));
}
function flip(d) {
  const c = book.cur + d;
  if (c < 0 || c > book.leaves) return;
  // во время переворота лист должен быть сверху
  const leaf = $$('#book3d .leaf')[d > 0 ? book.cur : c];
  if (leaf) leaf.style.zIndex = 100;
  book.cur = c;
  requestAnimationFrame(() => { layoutBook(); if (leaf) leaf.style.zIndex = 100; setTimeout(() => layoutBook(), 900); });
}
function bindBook() {
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

/* ---------- галерея ---------- */
const CATS = [['all', 'Все'], ['young', 'Начальная школа'], ['old', 'Старшая школа'], ['sad', 'Детский сад'], ['album', 'Альбомы и обложки'], ['more', 'Ещё съёмки']];
const gal = { cat: 'all', shown: 24, list: [] };
// «Все» — вперемешку по разделам, чтобы сверху были и школы, и сад, и альбомы
const MIXED = (() => {
  const by = ['young', 'old', 'album', 'sad', 'more'].map(c => GALLERY.filter(g => g[3] === c));
  const out = [];
  for (let i = 0; out.length < GALLERY.length; i++) by.forEach(l => l[i] && out.push(l[i]));
  return out;
})();
function renderGallery() {
  gal.list = gal.cat === 'all' ? MIXED : GALLERY.filter(g => g[3] === gal.cat);
  $('#masonry').innerHTML = gal.list.slice(0, gal.shown).map(([n, w, h], i) =>
    `<button data-i="${i}" aria-label="Открыть фото"><img src="img/t/${n}" width="${w}" height="${h}" loading="lazy" decoding="async" alt=""></button>`).join('');
  $('#moreBtn').hidden = gal.shown >= gal.list.length;
  $('#moreBtn').textContent = `Показать ещё (${gal.list.length - gal.shown})`;
}
function bindGallery() {
  $('#chips').innerHTML = CATS.map(([id, t]) => {
    const n = id === 'all' ? GALLERY.length : GALLERY.filter(g => g[3] === id).length;
    return `<button role="tab" aria-selected="${id === 'all'}" data-c="${id}">${t} <small>${n}</small></button>`;
  }).join('');
  $$('#chips button').forEach(b => b.onclick = () => {
    $$('#chips button').forEach(x => x.setAttribute('aria-selected', x === b));
    gal.cat = b.dataset.c; gal.shown = 24; renderGallery();
  });
  $('#moreBtn').onclick = () => { gal.shown += 24; renderGallery(); };
  $('#masonry').onclick = e => { const b = e.target.closest('button'); if (b) openLb(+b.dataset.i); };
  renderGallery();
}
let lbI = 0;
function openLb(i) { lbI = i; showLb(); $('#lb').showModal(); }
function showLb() {
  const n = gal.list.length; lbI = (lbI + n) % n;
  $('#lbImg').src = 'img/' + gal.list[lbI][0];
  $('#lbN').textContent = `${lbI + 1} / ${n}`;
  const nx = gal.list[(lbI + 1) % n]; if (nx) new Image().src = 'img/' + nx[0];
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

/* ---------- отзывы, вопросы ---------- */
function renderText() {
  $('#revTrack').innerHTML = REVIEWS.map(([t, n]) => `<figure class="rev"><p>«${t}»</p><b>${n}</b></figure>`).join('');
  $('#faqList').innerHTML = FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
  // открыт только один вопрос
  $$('#faqList details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('#faqList details').forEach(o => o !== d && (o.open = false)); }));
}

// закрытие окон кликом по фону
$$('dialog.sheet').forEach(d => d.addEventListener('click', e => {
  if (e.target !== d) return;
  const r = d.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
}));

renderDates(); bindCalc(); bindShare(); bindLead(); renderPrices(); bindBook(); bindGallery(); bindLb(); renderText();
