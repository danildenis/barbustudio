#!/usr/bin/env python3
"""Сборка страниц Barbustudio из общего шаблона.

Шапка, меню, подвал и окна (заявка, «отправить родителям», просмотр фото) одинаковые
на всех страницах, поэтому они здесь один раз. Запуск из корня репозитория:

    python3 tools/build.py

После правки style.css или app.js поднять VERSION, чтобы браузеры загрузили новые файлы.
"""
from pathlib import Path

VERSION = 56
ROOT_DIR = Path(__file__).resolve().parent.parent
PHONE, PHONE_TEL = '+7 (965) 55-88-008', '+79655588508'

NAV_L = [('sad/', 'Детский сад'), ('nachalnaya/', 'Начальная школа'), ('starshaya/', 'Старшая школа'), ('polistat/', 'Полистать')]
NAV_R = [('kak-zakazat/', 'Как заказать'), ('otzyvy/', 'Отзывы'), ('voprosy/', 'Вопросы'), ('kontakty/', 'Контакты')]
MENU = [
    ('Альбомы', [('', 'Главная'), ('sad/', 'Детский сад'), ('nachalnaya/', 'Начальная школа'), ('starshaya/', 'Старшая школа'), ('polistat/', 'Полистать альбом')]),
    ('Заказ', [('daty/', 'Свободные даты'), ('kak-zakazat/', 'Как заказать'), ('voprosy/', 'Вопросы'), ('kontakty/', 'Контакты')]),
    ('Студия', [('foto/', 'Фото'), ('otzyvy/', 'Отзывы'), ('blog/', 'Блог')]),
]


def links(items, root, current):
    return '\n'.join(f'    <a href="{root}{h}"{" aria-current=page" if h == current else ""}>{t}</a>' for h, t in items)


def layout(path, title, desc, body, kind=''):
    """path — адрес страницы от корня ('' для главной, 'sad/' и т. д.)."""
    root = '../' * path.count('/')
    menu = '\n'.join(
        f'    <div><h2>{group}</h2><ul>' + ''.join(
            f'<li><a href="{root}{h}"{" aria-current=page" if h == path else ""}>{t}</a></li>' for h, t in items) + '</ul></div>'
        for group, items in MENU)
    foot = '\n'.join(
        f'      <div><h2>{group}</h2><ul>' + ''.join(f'<li><a href="{root}{h}">{t}</a></li>' for h, t in items) + '</ul></div>'
        for group, items in MENU)
    full_title = f'{title} — Barbustudio' if path else 'Barbustudio — выпускные фотокниги в Перми'
    kind_cls = f' class="kind-{kind}"' if kind else ''
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{root}img/sad-01.jpg">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="{root}img/logo-full.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}style.css?v={VERSION}">
</head>
<body data-root="{root}" data-kind="{kind}"{kind_cls}>

<header class="head" id="head">
  <nav class="nav nav-l" aria-label="Альбомы">
{links(NAV_L, root, path)}
  </nav>
  <a class="brand" href="{root}" aria-label="Barbustudio — на главную"><img src="{root}img/logo-full.png" alt="" width="46" height="44"><span><b>Barbustudio</b><small>выпускные альбомы · Пермь</small></span></a>
  <nav class="nav nav-r" aria-label="Заказ">
{links(NAV_R, root, path)}
  </nav>
</header>
<!-- при прокрутке шапка прячется в эту иконку -->
<button class="menu-btn" id="menuBtn" aria-controls="mnav" aria-expanded="false" aria-label="Все разделы"><span class="menu-ico" aria-hidden="true"><i></i><i></i><i></i></span></button>
<nav class="mnav" id="mnav" aria-label="Все разделы" hidden>
  <div class="mnav-in">
{menu}
  </div>
  <div class="mnav-foot">
    <a class="num" href="tel:{PHONE_TEL}">{PHONE}</a>
    <button class="link" data-lead="Забронировать съёмку">Забронировать съёмку</button>
  </div>
</nav>

<main>
{body}
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="{root}"><img src="{root}img/logo-full.png" alt="" width="46" height="44"><span><b>Barbustudio</b><small>выпускные альбомы · Пермь</small></span></a>
        <a class="foot-phone num" href="tel:{PHONE_TEL}">{PHONE}</a>
        <button class="link" data-lead="Забронировать съёмку">Забронировать съёмку</button>
      </div>
{foot}
    </div>
    <div class="foot-legal">
      <p><b>ИП Барбус Е.А.</b> · ИНН 590419040034 · ОГРНИП 324595800108375</p>
      <p><a href="https://barbusbook.ru/politika-obrabotki-dannyh" target="_blank" rel="noopener">Политика обработки персональных данных</a> · <a href="https://barbusbook.ru/oferta" target="_blank" rel="noopener">Оферта</a></p>
    </div>
  </div>
</footer>

<!-- ЗАЯВКА -->
<dialog class="sheet" id="leadDlg" aria-labelledby="leadTitle">
  <form method="dialog" class="sheet-x"><button aria-label="Закрыть">×</button></form>
  <form id="leadForm" class="lead-form" novalidate>
    <h2 id="leadTitle">Забронировать съёмку</h2>
    <p class="muted">Пара полей — и заявка у нас. Ответим и согласуем детали.</p>
    <div class="lead-calc" id="leadCalc" hidden></div>
    <label>Имя<input name="name" autocomplete="given-name" required></label>
    <label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7" required></label>
    <div class="pair">
      <label>Сад или школа, группа/класс<input name="place" placeholder="Школа № 3, 4 «Б»"></label>
      <label>Детей<input name="kids" type="number" min="1" max="60" inputmode="numeric"></label>
    </div>
    <div class="pair">
      <label>Альбом<select name="pkg"><option value="">Ещё не выбрали</option></select></label>
      <label>Дата съёмки<select name="date"><option value="">Обсудим</option></select></label>
    </div>
    <label class="agree"><input type="checkbox" name="agree" required> <span>Согласен(на) на обработку персональных данных по <a href="https://barbusbook.ru/politika-obrabotki-dannyh" target="_blank" rel="noopener">политике</a></span></label>
    <p class="err" id="leadErr" hidden></p>
    <button class="btn btn-primary wide" type="submit">Отправить заявку</button>
  </form>
  <div class="lead-done" id="leadDone" hidden>
    <p class="done-mark">✓</p>
    <h2>Заявка отправлена</h2>
    <p class="muted">Скоро свяжемся с вами, чтобы обсудить детали и закрепить дату.</p>
    <button class="btn btn-ghost" id="leadDoneShare" hidden>Отправить расчёт родителям</button>
  </div>
</dialog>

<!-- ПОДЕЛИТЬСЯ -->
<dialog class="sheet" id="shareDlg" aria-labelledby="shareTitle">
  <form method="dialog" class="sheet-x"><button aria-label="Закрыть">×</button></form>
  <h2 id="shareTitle">Отправить родителям</h2>
  <p class="muted">Готовое сообщение с вариантами и ценами. Можно поправить перед отправкой.</p>
  <textarea id="shareText" rows="10"></textarea>
  <div class="share-btns">
    <a class="btn btn-primary" id="shTg" target="_blank" rel="noopener">Telegram</a>
    <a class="btn btn-primary" id="shWa" target="_blank" rel="noopener">WhatsApp</a>
    <a class="btn btn-primary" id="shVk" target="_blank" rel="noopener">ВКонтакте</a>
    <button class="btn btn-ghost" id="shCopy">Скопировать</button>
    <button class="btn btn-ghost" id="shNative" hidden>Ещё…</button>
  </div>
</dialog>

<!-- ЗАПИСЬ БЛОГА -->
<dialog class="sheet" id="postDlg" aria-labelledby="postTitle">
  <form method="dialog" class="sheet-x"><button aria-label="Закрыть">×</button></form>
  <img id="postImg" alt="">
  <h2 id="postTitle"></h2>
  <div id="postBody"></div>
</dialog>

<!-- ПРОСМОТР ФОТО -->
<dialog class="lb" id="lb" aria-label="Просмотр фото">
  <button class="lb-x" id="lbX" aria-label="Закрыть">×</button>
  <button class="lb-nav prev" id="lbPrev" aria-label="Предыдущее">‹</button>
  <img id="lbImg" alt="">
  <button class="lb-nav next" id="lbNext" aria-label="Следующее">›</button>
  <p class="lb-n" id="lbN"></p>
</dialog>

<div class="toast" id="toast" role="status"></div>

<script src="{root}gallery.js?v={VERSION}"></script>
<script src="{root}reviews.js?v={VERSION}"></script>
<script src="{root}data.js?v={VERSION}"></script>
<script src="{root}app.js?v={VERSION}"></script>
</body>
</html>
'''


STRIPE = '<hr class="stripe">'

STEPS = '''<ol class="steps">
        <li><span class="n">1</span><h3>Договор</h3><p>Выбираете альбом, фиксируем сроки, цену, скидки и бонусы. Аванс 5 000 ₽ закрепляет дату.</p><small>в день обращения</small></li>
        <li><span class="n">2</span><h3>Съёмка</h3><p>Фотограф находит контакт с каждым ребёнком. Кто пропустил — бесплатная досъёмка.</p><small>в выбранную дату</small></li>
        <li><span class="n">3</span><h3>Макет на проверку</h3><p>Обработка — до 3 недель, вёрстка — до 3 недель. Вы проверяете макеты, мы вносим правки.</p><small>до 6 недель</small></li>
        <li><span class="n">4</span><h3>Печать</h3><p>Печатаем только после вашего утверждения. Остаток оплаты — при отправке в печать.</p><small>после утверждения</small></li>
        <li><span class="n">5</span><h3>Выдача</h3><p>Привозим готовые альбомы. Проверьте их сразу: брак по вине печати или доставки переделаем.</p><small>≈ 2 месяца от съёмки</small></li>
      </ol>'''

PROMOS = '''<div class="tiles two">
        <article class="tile kind-sad">
          <p class="tile-big num">−50%</p>
          <h3>Организатору — альбом за полцены</h3>
          <p>Организатор тратит на подготовку съёмки больше времени, чем остальные родители. В благодарность — скидка на его фотокнигу.</p>
          <details><summary>Условия</summary><p>Организатор — один человек от группы или класса. С ним заключается договор, он ведёт переговоры и согласования и участвует в организации фотосессии.</p></details>
        </article>
        <article class="tile kind-nach">
          <p class="tile-big num">0 ₽</p>
          <h3>Приведи друга — альбом бесплатно</h3>
          <p>Расскажите о нас другому классу. Если заказ пришёл по вашей рекомендации — ваша фотокнига бесплатно.</p>
          <details><summary>Условия</summary><p>Нужно подтверждение от представителя класса (группы), в заказе — больше 15 фотокниг. Скидка действует на фотокнигу выпускника или индивидуальную фотокнигу на 3 разворота.</p></details>
        </article>
      </div>'''


def cta(root, title='Забронируйте дату съёмки', text=None):
    text = text or 'Весенние съёмки: <b data-dates-left>…</b>. Дату закрепляем после договора и аванса 5&nbsp;000&nbsp;₽.'
    return f'''  <section class="sec cta">
    <div class="wrap">
      <h2 class="h2">{title}</h2>
      <p class="lead">{text}</p>
      <div class="actions">
        <button class="btn btn-primary" data-lead="Забронировать съёмку">Оставить заявку</button>
        <a class="link" href="{root}daty/">Все свободные даты</a>
        <a class="link" href="tel:{PHONE_TEL}">{PHONE}</a>
      </div>
    </div>
  </section>'''


def page_head(title, lead, kicker=''):
    k = f'<p class="kicker">{kicker}</p>' if kicker else ''
    return f'''  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        {k}<h1 class="h1">{title}</h1>
        <p class="lead">{lead}</p>
      </div>'''


# ---------- главная ----------
def home():
    root = ''
    doors = '\n'.join(f'''        <a class="door kind-{k}" href="{h}">
          <span class="door-k">{t}</span>
          <span class="door-t">{d}</span>
          <span class="door-p">от 1 600 ₽ за альбом</span>
          <span class="door-go">Смотреть альбомы</span>
        </a>''' for k, h, t, d in [
        ('sad', 'sad/', 'Детский сад', 'Альбом для выпускной группы'),
        ('nach', 'nachalnaya/', 'Начальная школа', 'Альбом для выпуска 4 класса'),
        ('star', 'starshaya/', 'Старшая школа', 'Альбом для 9 и 11 класса'),
    ])
    body = f'''  <section class="hero-home">
    <div class="wrap">
      <p class="kicker">Barbustudio · Пермь · с 2014 года</p>
      <h1 class="h1">Выпускные фотокниги, которые будут листать всю жизнь</h1>
      <p class="lead">Снимаем, верстаем и печатаем выпускные альбомы для детских садов и школ. Для кого альбом?</p>
      <div class="doors">
{doors}
      </div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap split">
      <figure><img src="img/sad-01.jpg" alt="Готовые выпускные альбомы" loading="lazy"></figure>
      <div>
        <p class="kicker">Кто мы</p>
        <h2 class="h2">Студия выпускных фотокниг</h2>
        <p class="lead">Фотокнига — это страницы истории жизни. Снимаем, верстаем и печатаем на настоящей фотобумаге — химической «мокрой» печатью, которая не выцветает годами.</p>
        <dl class="stats">
          <div><dt class="num">18 000+</dt><dd>выпускных альбомов</dd></div>
          <div><dt class="num">142 000+</dt><dd>фотографий выпускников</dd></div>
          <div><dt>с 2014</dt><dd>делаем фотокниги</dd></div>
        </dl>
      </div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Какие бывают альбомы</h2>
        <p class="lead">Три варианта, цена одна для сада и школы. Точный состав зависит от возраста — он на странице вашей категории.</p>
      </div>
      <div class="tiles">
        <article class="tile">
          <span class="tile-tag"></span>
          <h3>Мини</h3><p class="tile-sub">1 разворот</p>
          <p>Обложка с портретом и виньетка — фото всех выпускников с подписями.</p>
          <p class="tile-price num">1 600 ₽</p>
        </article>
        <article class="tile hit">
          <span class="tile-tag">Чаще всего выбирают</span>
          <h3>Стандарт</h3><p class="tile-sub">3 разворота</p>
          <p>Обложка, портретный разворот вашего ребёнка, виньетка и общий разворот с друзьями.</p>
          <p class="tile-price num">2 700 ₽</p>
        </article>
        <article class="tile">
          <span class="tile-tag"></span>
          <h3>Премиум</h3><p class="tile-sub">5 разворотов</p>
          <p>Всё из «Стандарта» и ещё два разворота, два выезда фотографа.</p>
          <p class="tile-price num">3 800 ₽</p>
        </article>
      </div>
      <div class="sec-foot actions">
        <a class="link" href="sad/">Для детского сада</a>
        <a class="link" href="nachalnaya/">Для начальной школы</a>
        <a class="link" href="starshaya/">Для старшей школы</a>
      </div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Почему нам доверяют</h2>
      </div>
      <div class="tiles">
        <article class="tile"><h3>Фотограф находит контакт с каждым ребёнком</h3><ul><li>качественные фото за счёт профессиональной техники</li><li>бесплатная досъёмка тех, кто пропустил</li></ul></article>
        <article class="tile"><h3>Книги не выцветают годами</h3><ul><li>настоящая «мокрая» фотопечать</li><li>твёрдая персональная обложка с глянцевой ламинацией</li><li>книжный переплёт, плотные страницы</li></ul></article>
        <article class="tile"><h3>Всё по договору</h3><ul><li>макеты проверяете до печати</li><li>все вопросы — через одного родителя-представителя</li><li>около 2 месяцев от съёмки до альбомов</li></ul></article>
      </div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Бонусы для родителей</h2>
      </div>
      {PROMOS}
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Как проходит заказ</h2>
        <p class="lead">От договора до альбомов в руках — около 2 месяцев.</p>
      </div>
      {STEPS}
      <div class="sec-foot"><a class="link" href="kak-zakazat/">Подробнее о заказе и условиях</a></div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <figure class="quote" data-rev-lead></figure>
      <div class="sec-foot"><a class="link" href="otzyvy/">Все <span data-rev-count>отзывы</span> родителей</a></div>
    </div>
  </section>
  {STRIPE}
{cta(root)}'''
    return layout('', '', 'Выпускные фотокниги для детских садов и школ Перми с 2014 года. Альбомы Мини, Стандарт и Премиум, расчёт на класс и свободные даты.', body)


# ---------- страницы категорий ----------
KIND = {
    'sad': dict(path='sad/', name='Детский сад', group='группу', title='Выпускной альбом для детского сада',
                lead='Обложка с портретом ребёнка, названием садика и группы. Внутри — портреты, общие фото группы и фото с друзьями.',
                photo='img/sad-premium-02.jpg', alt='Разворот выпускного альбома детского сада',
                where='Снимаем в детском саду'),
    'nach': dict(path='nachalnaya/', name='Начальная школа', group='класс', title='Выпускной альбом для начальной школы',
                 lead='Обложка с портретом ребёнка, номером школы и класса. Внутри — портреты, виньетка и общие фото класса.',
                 photo='img/nach-17.jpg', alt='Выпускницы начальной школы на фотосессии',
                 where='Снимаем в школе'),
    'star': dict(path='starshaya/', name='Старшая школа', group='класс', title='Выпускной альбом для 9 и 11 класса',
                 lead='Обложка с портретом выпускника, номером школы и класса. Снимаем в школе или в студии.',
                 photo='img/starsh-15.jpg', alt='Выпускницы старшей школы в студии',
                 where='Снимаем в школе или в студии'),
}


def kind_page(k):
    d = KIND[k]
    root = '../'
    book = ('<a class="link" href="../polistat/">Полистать готовые альбомы 9 классов</a>' if k == 'star' else '')
    body = f'''  <section class="hero-kind">
    <div class="wrap split">
      <div>
        <p class="crumb"><a href="../">Главная</a> · {d['name']}</p>
        <h1 class="h1">{d['title']}</h1>
        <p class="lead">{d['lead']}</p>
        <ul class="facts">
          <li>от 1 600 ₽ за альбом, три варианта на выбор</li>
          <li>{d['where']}</li>
          <li>от 15 альбомов в заказе</li>
          <li>около 2 месяцев от съёмки до альбомов</li>
        </ul>
        <div class="actions">
          <a class="btn btn-accent" href="#calc">Посчитать на {d['group']}</a>
          <button class="btn btn-ghost" data-lead="Забронировать съёмку">Забронировать съёмку</button>
        </div>
      </div>
      <figure><img src="../{d['photo']}" alt="{d['alt']}" fetchpriority="high"></figure>
    </div>
  </section>
  {STRIPE}
  <section class="sec" id="albums">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Какой альбом выбрать</h2>
        <p class="lead">Цена за один альбом. Чем больше разворотов, тем больше фото вашего ребёнка и класса.</p>
      </div>
      <div class="price-cards" id="priceCards"></div>
      <p class="studio-note" id="studioNote" hidden></p>
      <div class="addons">
        <div class="tile"><h3>Дополнительные услуги</h3><ul id="addonsList"></ul></div>
        <div class="tile"><h3>Также можно заказать</h3><p>Фотографии в электронном виде · печать фотографий · сувенирную продукцию — календари, кружки и другое · плакаты и холсты с фотографиями</p></div>
      </div>
      {f'<div class="sec-foot">{book}</div>' if book else ''}
    </div>
  </section>
  {STRIPE}
  <section class="sec" id="calc">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Сколько выйдет на {d['group']}</h2>
        <p class="lead">Сумма на {d['group']} и на одного ребёнка — сразу, со скидкой организатора.</p>
      </div>
      <div class="calc-box">
        <form class="calc-form" id="calcForm" onsubmit="return false">
          <fieldset><legend>Альбом</legend><div class="pkgs" id="pkgs"></div></fieldset>
          <fieldset>
            <legend>Сколько детей <output id="kidsOut">25</output></legend>
            <div class="kids">
              <button type="button" class="step" data-step="-1" aria-label="Меньше">−</button>
              <input type="range" id="kids" min="15" max="40" value="25" aria-label="Количество детей">
              <button type="button" class="step" data-step="1" aria-label="Больше">+</button>
            </div>
            <p class="hint">Минимальный заказ — 15 альбомов. Если выпускников меньше, посчитаем индивидуально.</p>
          </fieldset>
          <fieldset class="extras">
            <legend>Дополнительно</legend>
            <div class="row">
              <span>Дополнительный разворот в каждый альбом <small>+400 ₽ за альбом</small></span>
              <span class="mini-step"><button type="button" data-spread="-1" aria-label="Убрать разворот">−</button><output id="spreadsOut">0</output><button type="button" data-spread="1" aria-label="Добавить разворот">+</button></span>
            </div>
            <label class="row check"><span>Обработка фото за 3 дня <small>+3 000 ₽ на заказ</small></span><input type="checkbox" id="fastPhoto"><i></i></label>
            <label class="row check"><span>Вёрстка макета за 7 дней <small>+5 000 ₽ на заказ</small></span><input type="checkbox" id="fastLayout"><i></i></label>
            <label class="row check" id="studioRow" hidden><span>Съёмка в студии <small id="studioHint">студия входит в цену</small></span><input type="checkbox" id="studio"><i></i></label>
            <label class="row check"><span>Я организатор <small>−50% на мой альбом</small></span><input type="checkbox" id="organizer" checked><i></i></label>
          </fieldset>
        </form>
        <aside class="receipt" aria-live="polite">
          <p class="receipt-k" id="rTitle">{d['name']}</p>
          <ul class="receipt-lines" id="rLines"></ul>
          <div class="receipt-total"><span>{'На всю группу' if k == 'sad' else 'На весь класс'}</span><strong id="rTotal">—</strong></div>
          <div class="receipt-split">
            <div><span>С одного родителя</span><strong id="rPer">—</strong></div>
            <div id="rOrgBox"><span>Альбом организатора</span><strong id="rOrg">—</strong></div>
          </div>
          <p class="receipt-note">Аванс 5 000 ₽ — при договоре, остальное — когда утвердите макеты.</p>
          <div class="receipt-cta">
            <button class="btn btn-accent" id="shareBtn">Отправить расчёт родителям</button>
            <button class="btn btn-primary" data-lead="Заказать по расчёту" data-with-calc>Забронировать съёмку</button>
          </div>
        </aside>
      </div>
    </div>
  </section>
  {STRIPE}
  <section class="sec" id="designs">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Дизайны обложек</h2>
        <p class="lead">Выберите готовый макет. Можем разработать индивидуальный дизайн, поменять порядок разворотов и подбор фотографий.</p>
      </div>
      <div class="design-grid" id="designGrid"></div>
    </div>
  </section>
  {STRIPE}
  <section class="sec" id="photos">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Как это выглядит</h2>
        <p class="lead">Снимки и альбомы с наших съёмок.</p>
      </div>
      <div class="masonry" id="masonry"></div>
      <div class="sec-foot"><a class="link" href="../foto/">Все фото</a></div>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="h2">Как проходит заказ</h2>
        <p class="lead">От договора до альбомов в руках — около 2 месяцев.</p>
      </div>
      {STEPS}
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">Частые вопросы</h2></div>
      <div class="faq-list" data-faq="5"></div>
      <div class="sec-foot"><a class="link" href="../voprosy/">Все вопросы и ответы</a></div>
    </div>
  </section>
  {STRIPE}
{cta(root)}'''
    return layout(d['path'], d['title'], f"{d['title']} в Перми: варианты Мини, Стандарт и Премиум, расчёт на {d['group']}, дизайны обложек и фото.", body, kind=k)


# ---------- общие страницы ----------
def simple(path, title, lead, inner, desc, kicker=''):
    body = f'''{page_head(title, lead, kicker)}
{inner}
    </div>
  </section>
  {STRIPE}
{cta('../')}'''
    return layout(path, title, desc, body)


PAGES = {
    'index.html': home(),
    'sad/index.html': kind_page('sad'),
    'nachalnaya/index.html': kind_page('nach'),
    'starshaya/index.html': kind_page('star'),
    'daty/index.html': simple('daty/', 'Свободные даты', 'Весенние съёмки: <b data-dates-left>…</b>. Нажмите на свободную дату, чтобы оставить заявку. Дату закрепляем за группой после договора и аванса 5&nbsp;000&nbsp;₽.',
        '      <div class="dates-list" id="datesList" role="list"></div>', 'Свободные даты весенних выпускных съёмок Barbustudio в Перми.'),
    'polistat/index.html': simple('polistat/', 'Полистайте готовые альбомы', 'Настоящие выпускные альбомы 9 классов — разворот за разворотом.',
        '''      <div class="book-tabs" id="bookTabs" role="tablist"></div>
      <div class="book-stage">
        <button class="book-arrow prev" id="bookPrev" aria-label="Назад">‹</button>
        <div class="book" id="book3d" tabindex="0" aria-label="Альбом. Листайте стрелками или свайпом"></div>
        <button class="book-arrow next" id="bookNext" aria-label="Вперёд">›</button>
      </div>
      <p class="book-count" id="bookCount"></p>
      <p class="book-hint">Нажмите на край страницы или проведите пальцем</p>''', 'Полистайте готовые выпускные альбомы Barbustudio.'),
    'kak-zakazat/index.html': simple('kak-zakazat/', 'Как заказать альбом', 'От договора до альбомов в руках — около 2 месяцев.',
        f'''      {STEPS}
      <ul class="terms">
        <li>Работаем только по договору</li>
        <li>Все вопросы согласуем с одним родителем-представителем</li>
        <li>На съёмке — не больше двух родителей, заказчик присутствует обязательно</li>
      </ul>
    </div>
  </section>
  {STRIPE}
  <section class="sec">
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">Бонусы для родителей</h2></div>
      {PROMOS}''', 'Как заказать выпускной альбом в Barbustudio: договор, съёмка, макет, печать и выдача.'),
    'otzyvy/index.html': simple('otzyvy/', 'Отзывы родителей', '<span data-rev-count>Отзывы</span> с нашего сайта — без правок.',
        '''      <figure class="quote" data-rev-lead></figure>
    </div>
  </section>
  <section class="sec" style="padding-top:0">
    <div class="wrap">
      <div class="rev-grid" id="revGrid"></div>
      <div class="sec-foot"><button class="btn btn-ghost" id="revMore">Показать все отзывы</button></div>''', 'Отзывы родителей о выпускных альбомах Barbustudio.'),
    'blog/index.html': simple('blog/', 'Блог', 'Новости студии.', '      <div class="blog-grid" id="blogGrid"></div>', 'Новости фотостудии Barbustudio.'),
    'voprosy/index.html': simple('voprosy/', 'Вопросы и ответы', 'Не нашли ответ — позвоните или оставьте заявку.', '      <div class="faq-list" data-faq></div>', 'Ответы на частые вопросы о выпускных альбомах Barbustudio.'),
    'kontakty/index.html': simple('kontakty/', 'Контакты', 'Оставьте заявку — ответим, расскажем детали и закрепим дату съёмки.',
        f'''      <div class="split">
        <figure><img src="../img/nach-01.jpg" alt="Класс на выпускной фотосессии" loading="lazy"></figure>
        <div>
          <ul class="contact-list">
            <li><a class="num" href="tel:{PHONE_TEL}">{PHONE}</a></li>
            <li><a href="mailto:barbus.book@mail.ru">barbus.book@mail.ru</a></li>
            <li><a href="https://vk.ru/barbustudio" target="_blank" rel="noopener">ВКонтакте</a> · <a href="https://max.ru/u/f9LHodD0cOKKDfXPJ8Dr0yk0RmMc_TVhewGxX2aHMtHZao0wfUe473rxg_c" target="_blank" rel="noopener">MAX</a></li>
          </ul>
          <div class="actions" style="margin-top:28px"><button class="btn btn-primary" data-lead="Забронировать съёмку">Оставить заявку</button></div>
        </div>
      </div>''', 'Контакты фотостудии Barbustudio в Перми: телефон, почта, ВКонтакте, MAX.'),
    'foto/index.html': simple('foto/', 'Фото с наших съёмок', 'Детские сады, начальная и старшая школа, готовые альбомы.',
        '''      <div class="chips" id="chips" role="tablist"></div>
      <div class="masonry" id="masonry"></div>
      <div class="sec-foot"><button class="btn btn-ghost" id="moreBtn">Показать ещё</button></div>''', 'Фото с выпускных съёмок Barbustudio.'),
}

if __name__ == '__main__':
    for rel, html in PAGES.items():
        p = ROOT_DIR / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(html, encoding='utf-8')
        print('собрано:', rel)
