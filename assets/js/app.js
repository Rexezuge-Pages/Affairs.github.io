/* app · bootstrap / theme / nav / search UI / shortcuts */
(function (BSQ) {
  'use strict';
  var U = BSQ.util, S = BSQ.state;

  /* ── theme ── */
  var SUN = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"></path></svg>';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var b = document.getElementById('themeBtn');
    if (b) b.innerHTML = t === 'dark' ? SUN : MOON;
    var m = document.querySelector('meta[name=theme-color]');
    if (m) m.setAttribute('content', t === 'dark' ? '#0b1421' : '#132a43');
  }
  applyTheme(S.theme);

  /* ── nav / menu ── */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  var navMore = document.getElementById('navMore');
  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) menuBtn.onclick = function () { setMenu(!nav.classList.contains('open')); };
  function syncNav() {
    if (!navMore) return;
    navMore.open = window.innerWidth <= 900;
    if (window.innerWidth > 900) setMenu(false);
  }
  syncNav();
  addEventListener('resize', syncNav, { passive: true });
  if (nav && nav.addEventListener) nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      setMenu(false);
      if (navMore && window.innerWidth > 900) navMore.open = false;
    }
  });
  addEventListener('hashchange', function () { setMenu(false); });
  document.addEventListener('click', function (e) {
    if (navMore && navMore.open && window.innerWidth > 900 &&
        !navMore.contains(e.target)) navMore.open = false;
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) &&
        menuBtn && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ── search panel ── */
  var panel = document.getElementById('searchPanel');
  var input = document.getElementById('globalSearch');
  var results = document.getElementById('searchResults');
  var selIdx = -1;
  var KLABEL = { point: '知识点', q: '题目', bank: '银行', time: '时间轴', num: '数字表' };
  var HOT = ['五篇大文章', '金融强国', '十五五', '试用期', '诉讼时效', '因您而变', '核心价值观', '凌汛', '诺奖', '内卷式竞争'];

  function openSearch() { panel.hidden = false; input.focus(); input.select(); if (!input.value.trim()) showIdle(); }
  function closeSearch() { panel.hidden = true; }

  function showIdle() {
    results.innerHTML = '<div class="sr-group">试试搜索</div>' +
      HOT.map(function (w) {
        return '<a class="sr-item" data-kw="' + U.esc(w) + '"><div class="sr-t">🔎 ' + U.esc(w) + '</div></a>';
      }).join('') +
      '<div class="sr-group">快速跳转</div>' +
      [['#/quiz?m=finance', '📝 金融时政专项'], ['#/quiz?m=law', '⚖️ 法律专项'],
       ['#/quiz?t=judge', '✅ 判断题专项'], ['#/banks', '🏦 9 家银行'],
       ['#/numbers', '🔢 数字速记表'], ['#/compare', '⚖️ 横向对比表']]
        .map(function (p) { return '<a class="sr-item" href="' + p[0] + '" data-close="1"><div class="sr-t">' + p[1] + '</div></a>'; }).join('');
    wire();
  }

  function doSearch(kw) {
    kw = (kw || '').trim();
    if (!kw) { showIdle(); return; }
    var res = BSQ.search(kw, 50);
    if (!res.length) {
      results.innerHTML = '<div class="sr-empty">没有找到「' + U.esc(kw) + '」<br><span class="small">换个关键词试试，比如：五篇大文章 / 票据 / 黄河 / 招行</span></div>';
      return;
    }
    var groups = {};
    res.forEach(function (r) { (groups[r.k] = groups[r.k] || []).push(r); });
    selIdx = -1;
    var h = '';
    Object.keys(groups).forEach(function (k) {
      h += '<div class="sr-group">' + (KLABEL[k] || k) + '（' + groups[k].length + '）</div>';
      groups[k].forEach(function (r) {
        h += '<a class="sr-item" href="' + r.ref + '" data-close="1">' +
          '<div class="sr-t">' + U.hl(r.t, kw) + '</div>' +
          '<div class="sr-d">' + U.hl(r.d, kw) + '</div></a>';
      });
    });
    results.innerHTML = h;
    wire();
  }

  function wire() {
    results.querySelectorAll('[data-close]').forEach(function (a) { a.addEventListener('click', closeSearch); });
    results.querySelectorAll('[data-kw]').forEach(function (a) {
      a.addEventListener('click', function () { input.value = a.dataset.kw; doSearch(a.dataset.kw); });
    });
  }

  function moveSel(d) {
    var items = [].slice.call(results.querySelectorAll('.sr-item'));
    if (!items.length) return;
    if (selIdx >= 0 && items[selIdx]) items[selIdx].classList.remove('sel');
    selIdx = (selIdx + d + items.length) % items.length;
    items[selIdx].classList.add('sel');
    items[selIdx].scrollIntoView({ block: 'nearest' });
  }

  var sBtn = document.getElementById('searchBtn');
  if (sBtn) sBtn.onclick = function () { panel.hidden ? openSearch() : closeSearch(); };
  input.addEventListener('input', function () { doSearch(input.value); });
  input.addEventListener('focus', function () { if (!input.value.trim()) showIdle(); });

  /* ── keyboard ── */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select';

    if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape') {
      closeSearch(); setMenu(false);
      if (navMore && window.innerWidth > 900) navMore.open = false;
      if (typing) e.target.blur();
      return;
    }

    if (!panel.hidden && document.activeElement === input) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); return; }
      if (e.key === 'Enter') {
        var its = results.querySelectorAll('.sr-item');
        if (its.length) { e.preventDefault(); (its[selIdx] || its[0]).click(); }
        return;
      }
    }

    if (typing) return;

    if (e.key === 't' || e.key === 'T') { toggleTheme(); return; }
    if (e.key === 'f' || e.key === 'F') {
      var f = document.querySelector('.fc');
      if (f) { e.preventDefault(); if (window._fcFlip) window._fcFlip(); else f.classList.toggle('flip'); }
      return;
    }
    if (e.key === 'w' || e.key === 'W') {
      if ((location.hash || '').indexOf('#/numbers') === 0) {
        e.preventDefault();
        U.go('#/numbers?hide=' + (U.query().hide === '1' ? '0' : '1'));
      }
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      var opts = document.querySelectorAll('.q .opt');
      var n = +e.key - 1;
      if (opts.length && opts[n]) { e.preventDefault(); opts[n].click(); }
      return;
    }
    if (e.key === 'Enter') {
      var nb = document.querySelector('#nextBtn');
      if (nb && !nb.disabled) { e.preventDefault(); nb.click(); }
    }
  });

  function toggleTheme() {
    S.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(S.theme); S.save();
  }
  window.toggleTheme = toggleTheme;
  var tBtn = document.getElementById('themeBtn');
  if (tBtn) tBtn.onclick = toggleTheme;

  /* ── to top ── */
  var toTop = document.getElementById('toTop');
  if (toTop) toTop.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  addEventListener('scroll', function () {
    if (toTop) toTop.style.display = scrollY > 400 ? 'grid' : 'none';
  }, { passive: true });

  /* ── ensure ids + start ── */
  (BSQ.points || []).forEach(function (p, i) { if (!p.id) p.id = 'p' + i; });
  (BSQ.questions || []).forEach(function (q, i) { if (!q.id) q.id = 'q' + i; });
  BSQ.start();

  if (window.console && console.info) {
    console.info('%c银行笔试学习站', 'font:700 15px sans-serif;color:#0f766e',
      '\n知识点 ' + BSQ.points.length + ' · 题目 ' + BSQ.questions.length +
      ' · 速记卡 ' + BSQ.cards.length + ' · 时间轴 ' + BSQ.timeline.length +
      ' · 数字表 ' + BSQ.numbers.length + ' · 对比表 ' + BSQ.comparisons.length);
  }
})(window.BSQ);