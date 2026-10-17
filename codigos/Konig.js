// 1) O brilho acompanha o cursor dentro de cada botão
document.querySelectorAll('.glow').forEach(function (el) {
  el.addEventListener('pointermove', function (e) {
    var r = el.getBoundingClientRect();
    el.style.setProperty('--x', (e.clientX - r.left) + 'px');
    el.style.setProperty('--y', (e.clientY - r.top) + 'px');
  });
  el.addEventListener('pointerleave', function () {
    el.style.setProperty('--x', '50%');
    el.style.setProperty('--y', '50%');
  });
});

// 2) Destaca no menu a seção que está na tela
var links = document.querySelectorAll('nav a');
var sections = document.querySelectorAll('main section');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { io.observe(s); });
}

// 3) Gráficos do WakaTime
var WAKA_LANGS = 'https://wakatime.com/share/@7020808d-8ec7-4082-b192-26ba167de716/54c89e19-9fbd-4192-80c9-c31ad42fdb56.json';
var WAKA_DAYS = 'https://wakatime.com/share/@7020808d-8ec7-4082-b192-26ba167de716/c782d62e-9f9e-43ce-b292-6934e5ad91c7.json';

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatTime(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.round((seconds % 3600) / 60);
  if (h > 0) return h + ' h ' + m + ' min';
  return m + ' min';
}

function showError(box) {
  box.textContent = '';
  box.appendChild(el('p', 'waka-msg', 'Não foi possível carregar agora. / Could not load right now.'));
}

function renderLanguages(box, data) {
  box.textContent = '';
  data.forEach(function (lang) {
    var row = el('div', 'lang-row');
    var head = el('div', 'lang-row-head');
    var name = el('span');
    var dot = el('i', 'lang-dot');
    dot.style.background = lang.color;
    name.appendChild(dot);
    name.appendChild(document.createTextNode(lang.name));
    head.appendChild(name);
    head.appendChild(el('span', 'lang-pct', lang.percent.toFixed(1).replace('.', ',') + '%'));
    var meter = el('div', 'meter');
    var fill = document.createElement('i');
    fill.style.width = Math.max(lang.percent, 1) + '%';
    meter.appendChild(fill);
    row.appendChild(head);
    row.appendChild(meter);
    box.appendChild(row);
  });
}

function renderDays(box, data) {
  box.textContent = '';
  var max = Math.max.apply(null, data.map(function (d) { return d.grand_total.total_seconds; }));
  data.forEach(function (d) {
    var secs = d.grand_total.total_seconds;
    var parts = d.range.date.split('-');
    var col = el('div', 'day-col');
    col.title = d.range.text + ': ' + formatTime(secs);
    col.appendChild(el('span', 'day-time', secs > 0 ? formatTime(secs) : '–'));
    var bar = el('div', 'day-bar' + (secs > 0 ? '' : ' empty'));
    bar.style.height = (max > 0 ? Math.max((secs / max) * 100, 0) : 0) + 'px';
    col.appendChild(bar);
    col.appendChild(el('span', '', parts[2] + '/' + parts[1]));
    box.appendChild(col);
  });
}

function loadWaka(url, boxId, render) {
  var box = document.getElementById(boxId);
  if (!box) return;
  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (json) { render(box, json.data); })
    .catch(function () { showError(box); });
}

loadWaka(WAKA_LANGS, 'waka-langs', renderLanguages);
loadWaka(WAKA_DAYS, 'waka-days', renderDays);

// 4) Foto: se o caminho não existir, tenta os lugares mais comuns
var foto = document.querySelector('.photo img');
var caminhos = [
  '../pfp/foto.png', 'pfp/foto.png', 'foto.png',
  '../pfp/foto.jpg', 'pfp/foto.jpg', 'foto.jpg',
  '../pfp/Foto.png', 'pfp/Foto.png'
];
var tentativa = 0;

function proximaFoto() {
  tentativa++;
  if (tentativa < caminhos.length) foto.src = caminhos[tentativa];
}

if (foto) {
  foto.addEventListener('error', proximaFoto);
  if (foto.complete && foto.naturalWidth === 0) proximaFoto();
}