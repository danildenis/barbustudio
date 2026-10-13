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

// Состав и цены — со страниц старого сайта (сад, начальная, старшая школа)
const PACKAGES = [
  { id: 'mini', name: 'Мини', spreads: 1, price: 1600 },
  { id: 'standart', name: 'Стандарт', spreads: 3, price: 2700, hit: true },
  { id: 'premium', name: 'Премиум', spreads: 5, price: 3800 },
];
// Старшая школа, съёмка в студии (студия входит в цену). Для «Мини» цена в студии на сайте не указана.
const STUDIO_PRICE = { standart: 3000, premium: 4100 };
const COVER = {
  sad: ['Обложка', 'твёрдая, с глянцевой ламинацией, портрет ребёнка, название садика и группы'],
  nach: ['Обложка', 'твёрдая, с глянцевой ламинацией, портрет ребёнка, номер школы и класса'],
  star: ['Обложка', 'твёрдая, с глянцевой ламинацией, портрет выпускника, номер школы и класса'],
};
const VIGNETTE = ['Виньетка', 'фото всех выпускников с подписями имён и фамилий'];
const PKG_ITEMS = {
  sad: {
    mini: [COVER.sad, VIGNETTE, ['1 выезд фотографа']],
    standart: [COVER.sad, ['Портретный разворот', 'индивидуальный, с портретами вашего ребёнка'], VIGNETTE, ['Общий разворот', 'общие фото ребят в группе, фото с друзьями'], ['1 выезд', '+ выезд для съёмки отсутствующих']],
    premium: [['Всё из «Стандарта»'], ['Спортивный разворот', 'ребята в спортзале, фото с друзьями'], ['Прогулка', 'общие фото ребят на прогулке'], ['2 выезда', '+ выезд для съёмки отсутствующих']],
  },
  nach: {
    mini: [COVER.nach, VIGNETTE, ['Оборот обложки', 'фото с друзьями, общее фото класса'], ['1 выезд фотографа в школу']],
    standart: [COVER.nach, ['Портретный разворот', 'индивидуальный, с портретами вашего ребёнка'], VIGNETTE, ['Общий разворот', 'общие фото класса, фото с друзьями'], ['1 выезд', '+ выезд для съёмки отсутствующих']],
    premium: [['Всё из «Стандарта»'], ['Разворот с друзьями', 'выпускник с друзьями'], ['Общие и групповые фото', 'фото прошлых лет и др.'], ['2 выезда', '+ выезд для съёмки отсутствующих']],
  },
  star: {
    mini: [COVER.star, VIGNETTE, ['Оборот обложки', 'фото с друзьями, общее фото класса'], ['1 выезд', 'в школе или в студии']],
    standart: [COVER.star, ['Индивидуальный разворот'], VIGNETTE, ['Общий разворот', 'общие фото класса, фото с друзьями'], ['1 выезд', '+ выезд для съёмки отсутствующих']],
    premium: [['Всё из «Стандарта»'], ['Другая локация', 'другой зал фотостудии или спортивная съёмка в школе'], ['Свободный стиль', 'или выпускной, последний звонок — по согласованию'], ['2 выезда', '+ выезд для съёмки отсутствующих']],
  },
};
const PKG_IMG = {
  sad: { mini: 'sad-premium-03', standart: 'sadik-standart-01', premium: 'sad-premium-04' },
  nach: { mini: 'nachalnaya-mini-02', standart: 'nachalnaya-standart-01', premium: 'nachalnaya-standart-02' },
  star: { mini: 'starshie-himiya-1-02', standart: 'starshie-himiya-1-05', premium: 'starshie-himiya-1-07' },
};
const VISIT = { sad: '2 000 ₽/час', nach: '5 000 ₽/час', star: '5 000 ₽/час' };

const DESIGNS = {
  sad: [['Облака', 'sadik-standart-09'], ['Небо', 'diz-01'], ['В облаках', 'sadik-standart-05'], ['Акварели', 'sadik-standart-06'], ['Ушастики', 'diz-03'], ['Карандаши', 'diz-04'], ['Кудряшки', 'sadik-standart-08'], ['Рисование', 'sadik-standart-07'], ['Клубничка', null]],
  nach: [['Русский язык', 'diz-05'], ['Математика', 'diz-06'], ['Чтение', 'diz-07'], ['Рисование', 'diz-08'], ['Музыка', 'diz-09'], ['Природоведение', 'nachalnaya-mini-06'], ['Перемена', null]],
  star: [['Геометрия', 'starsh-33'], ['Экономика', 'starsh-34'], ['ИЗО', 'starsh-35'], ['История', 'starsh-36'], ['Литература', 'starsh-37'], ['Алгебра', 'starsh-38'], ['Химия', 'starsh-39'], ['Черчение', 'starsh-40'], ['Кадетский', 'starsh-41']],
};

const POSTS = [
  { title: 'Первоклассная фотосессия!', img: 'blog-01', body: ['«Первое сентября, первый звонок и самый первый класс! Провожаем лето, встречаем осень и начинаем наш большой школьный путь»'] },
  { title: 'Поздравляем всех учеников и студентов с Днём знаний!', img: 'blog-02', body: [
    'Привет-привет всем будущим отличникам и отличницам, талантливым первоклашкам и опытным старшеклассникам!',
    'Вот оно снова настало — первое сентября! День, когда мы прощаемся с беззаботными летними днями и погружаемся в волшебное море новых открытий и приключений 😍✨',
    'В этот день хочется пожелать вам, ребята, побольше ярких эмоций, интересных уроков, крепкой дружбы и нескончаемой мотивации двигаться вперёд. Пусть ваши тетрадки будут полны пятёрок, а рюкзаки — только нужных учебников (а не чипсов и шоколадок 😜).',
    'А родителям хотим сказать отдельное спасибо за то, что они всегда рядом и готовы поддержать нас во всём. Ведь вы самые лучшие учителя в мире ❤️',
    'Так что берите ручки покрепче, открывайте свои школьные дневники и отправляйтесь навстречу новым знаниям! Впереди вас ждёт целый год удивительных событий и невероятных достижений 💪',
    'С первым днём учёбы, друзья! Счастья, вдохновения и отличного настроения вам на весь учебный год! ✨🌟'] },
  { title: 'Как так каникулы заканчиваются? Мы ещё не готовы))))', img: 'nach-27', body: [] },
  { title: 'Заключительная неделя лета! Увы, следующий понедельник уже будет осенним — 1 сентября 🍁', img: 'blog-03', body: ['Начинаем подготовку к новому учебному году'] },
];

const KINDS = { sad: 'Детский сад', nach: 'Начальная школа', star: 'Старшая школа' };
const SPREAD = 400, FAST_PHOTO = 3000, FAST_LAYOUT = 5000, ADVANCE = 5000;

const ALBUMS = [
  { id: 'd', title: '9 «Д» · серо-оранжевый', pages: 11, end: 'Выпускники 2026' },
  { id: 'b', title: '9 «Б» · «Выпуск 2026»', pages: 11, end: 'Школа, мы будем тебя вспоминать' },
  { id: 'v', title: '9 «В» · бело-синий', pages: 9, end: 'Выпускной альбом 2025' },
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
const st = { kind: 'sad', pkg: 'standart', kids: 25, spreads: 0, fastPhoto: false, fastLayout: false, organizer: true, studio: false };
const studioOn = () => st.kind === 'star' && st.studio && STUDIO_PRICE[st.pkg];
const priceOf = p => st.kind === 'star' && st.studio && STUDIO_PRICE[p.id] ? STUDIO_PRICE[p.id] : p.price;
(function readUrl() {
  const q = new URLSearchParams(location.search);
  if (KINDS[q.get('k')]) st.kind = q.get('k');
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

function renderPkgs() {
  $('#pkgs').innerHTML = PACKAGES.map(p => `
    <label class="pkg"><input type="radio" name="pkg" value="${p.id}" ${p.id === st.pkg ? 'checked' : ''}>
      <b>${p.name}</b><i>${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')}</i><strong data-price="${p.id}">${rub(p.price)}</strong></label>`).join('');
  $$('#pkgs input').forEach(i => i.onchange = () => { st.pkg = i.value; update(); });
}

function update() {
  const r = calc();
  $('#kidsOut').textContent = st.kids;
  $('#kids').value = st.kids;
  $('#spreadsOut').textContent = st.spreads;
  $(`#segKind input[value=${st.kind}]`).checked = true;
  $('#rTitle').textContent = `${KINDS[st.kind]} · ${r.p.name}`;
  $$('[data-price]').forEach(el => el.textContent = rub(priceOf(PACKAGES.find(p => p.id === el.dataset.price))));
  // студия — только для старшей школы
  $('#studioRow').hidden = st.kind !== 'star';
  $('#studio').checked = st.studio;
  $('#studioHint').textContent = st.pkg === 'mini' ? 'для «Мини» цену в студии уточним' : 'студия входит в цену альбома';
  syncPriceKind();
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
  renderPkgs();
  $$('#segKind input').forEach(i => i.onchange = () => { st.kind = i.value; update(); renderDesigns(); });
  $('#kids').oninput = e => { st.kids = +e.target.value; update(); };
  $$('[data-step]').forEach(b => b.onclick = () => { st.kids = Math.min(40, Math.max(15, st.kids + +b.dataset.step)); update(); });
  $$('[data-spread]').forEach(b => b.onclick = () => { st.spreads = Math.min(6, Math.max(0, st.spreads + +b.dataset.spread)); update(); });
  ['fastPhoto', 'fastLayout', 'organizer', 'studio'].forEach(k => { $('#' + k).checked = st[k]; $('#' + k).onchange = e => { st[k] = e.target.checked; update(); }; });
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
    ...PACKAGES.map(p => `• ${p.name} — ${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')} — ${rub(priceOf(p))}`),
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
  f.pkg.innerHTML = '<option value="">Ещё не выбрали</option>' + PACKAGES.map(p => `<option value="${p.id}">${p.name} — ${rub(priceOf(p))}</option>`).join('');
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
let priceKind = null;
function syncPriceKind() { if (priceKind !== st.kind) renderPrices(); }
function renderPrices() {
  priceKind = st.kind;
  $(`#segPrices input[value=${st.kind}]`).checked = true;
  $('#priceCards').innerHTML = PACKAGES.map(p => `
    <article class="pcard ${p.hit ? 'hit' : ''}">
      <figure><img src="img/t/${PKG_IMG[st.kind][p.id]}.jpg" alt="Альбом «${p.name}»" loading="lazy"></figure>
      <div class="pcard-body">
        ${p.hit ? '<span class="badge">Чаще всего выбирают</span>' : ''}
        <h3>${p.name}<small>${p.spreads} ${plural(p.spreads, 'разворот', 'разворота', 'разворотов')}</small></h3>
        <p class="price num">${rub(p.price)} <small>за альбом</small></p>
        <ul>${PKG_ITEMS[st.kind][p.id].map(([h, d]) => `<li><b>${h}</b>${d ? ` — ${d}` : ''}</li>`).join('')}</ul>
        <button class="btn ${p.hit ? 'btn-coral' : 'btn-ink'}" data-lead="Заказать «${p.name}»" data-pkg="${p.id}">Заказать</button>
      </div>
    </article>`).join('');
  const note = $('#studioNote');
  note.hidden = st.kind !== 'star';
  note.innerHTML = 'Снимаем в школе или в студии (студия — отдельно). Со студией в цене: <b>«Стандарт» 3 000 ₽</b>, <b>«Премиум» 4 100 ₽</b>.';
  $('#addonsList').innerHTML = [
    ['Дополнительный разворот', '400 ₽'], ['Дополнительный выезд фотографа', VISIT[st.kind]],
    ['Обработка фотографий за 3 дня', '3 000 ₽'], ['Вёрстка макета за 7 дней', '5 000 ₽'],
  ].map(([a, b]) => `<li><span>${a}</span><b class="num">${b}</b></li>`).join('');
}
function bindPrices() {
  $$('#segPrices input').forEach(i => i.onchange = () => { st.kind = i.value; renderPrices(); update(); renderDesigns(); });
  renderPrices();
}

/* ---------- дизайны ---------- */
let designKind = 'sad';
function renderDesigns(kind) {
  designKind = kind || st.kind;
  $$('#designTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === designKind));
  $('#designGrid').innerHTML = DESIGNS[designKind].map(([n, img]) => img
    ? `<button class="design" data-img="${img}"><span class="design-img"><img src="img/t/${img}.jpg" alt="Дизайн «${n}»" loading="lazy"></span><span class="design-n">${n}</span></button>`
    : `<div class="design design-empty"><span class="design-img"><span>пример<br>по запросу</span></span><span class="design-n">${n}</span></div>`).join('');
}
function bindDesigns() {
  $('#designTabs').innerHTML = Object.entries(KINDS).map(([k, t]) => `<button role="tab" data-k="${k}">${t} <small>${DESIGNS[k].length}</small></button>`).join('');
  $$('#designTabs button').forEach(b => b.onclick = () => renderDesigns(b.dataset.k));
  $('#designGrid').onclick = e => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    const list = DESIGNS[designKind].filter(d => d[1]).map(([n, img]) => [img + '.jpg']);
    openLbList(list, list.findIndex(x => x[0] === b.dataset.img + '.jpg'));
  };
  renderDesigns();
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
let lbList = null;
function openLb(i) { lbList = null; lbI = i; showLb(); $('#lb').showModal(); }
function openLbList(list, i) { lbList = list; lbI = Math.max(0, i); showLb(); $('#lb').showModal(); }
function showLb() {
  const L = lbList || gal.list, n = L.length; lbI = (lbI + n) % n;
  $('#lbImg').src = 'img/' + L[lbI][0];
  $('#lbN').textContent = `${lbI + 1} / ${n}`;
  const nx = L[(lbI + 1) % n]; if (nx) new Image().src = 'img/' + nx[0];
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
const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let revAll = false;
function renderReviews() {
  const list = revAll ? REVIEWS : REVIEWS.slice(0, 9);
  $('#revCount').textContent = `${REVIEWS.length} ${plural(REVIEWS.length, 'отзыв', 'отзыва', 'отзывов')} с нашего сайта — без правок`;
  $('#revGrid').innerHTML = list.map(([t, n]) => `<figure class="rev"><blockquote>${esc(t.replace(/([!?.])\1{3,}/g, '$1$1$1')).replace(/\n/g, '<br>')}</blockquote><figcaption>${esc(n)}</figcaption></figure>`).join('');
  $('#revMore').hidden = revAll;
  $('#revMore').textContent = `Показать все ${REVIEWS.length} ${plural(REVIEWS.length, 'отзыв', 'отзыва', 'отзывов')}`;
}
function renderBlog() {
  $('#blogGrid').innerHTML = POSTS.map((p, i) => `
    <article class="post-card">
      <button data-post="${i}" ${p.body.length ? '' : 'disabled'}>
        <span class="post-img"><img src="img/t/${p.img}.jpg" alt="" loading="lazy"></span>
        <h3>${p.title}</h3>
        ${p.body.length ? `<p>${p.body[0].length > 110 ? p.body[0].slice(0, 105).replace(/\s\S*$/, '') + '…' : p.body[0]}</p><span class="post-more">Читать</span>` : ''}
      </button>
    </article>`).join('');
  $('#blogGrid').onclick = e => {
    const b = e.target.closest('[data-post]'); if (!b || b.disabled) return;
    const p = POSTS[+b.dataset.post];
    $('#postImg').src = `img/${p.img}.jpg`; $('#postTitle').textContent = p.title;
    $('#postBody').innerHTML = p.body.map(x => `<p>${x}</p>`).join('');
    $('#postDlg').showModal();
  };
}
function renderText() {
  renderReviews(); renderBlog();
  $('#revMore').onclick = () => { revAll = true; renderReviews(); };
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

bindPrices(); bindDesigns(); renderDates(); bindCalc(); bindShare(); bindLead(); bindBook(); bindGallery(); bindLb(); renderText();
