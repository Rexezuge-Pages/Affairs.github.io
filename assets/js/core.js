/* core · state / storage / router / search / utils */
window.BSQ = window.BSQ || {};
(function (BSQ) {
  'use strict';

  /* ── utils ── */
  var U = BSQ.util = {
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    strip: function (s) { return String(s || '').replace(/<[^>]*>/g, ''); },
    html: function (el, s) { el.innerHTML = BSQ.icons.iconify(s); },
    insert: function (el, where, s) { el.insertAdjacentHTML(where, BSQ.icons.iconify(s)); },
    hl: function (s, kw) {
      var t = U.strip(s);
      if (!kw) return t;
      var i = t.toLowerCase().indexOf(kw.toLowerCase());
      if (i < 0) return t;
      return U.esc(t.slice(0, i)) + '<mark>' + U.esc(t.slice(i, i + kw.length)) + '</mark>' + U.esc(t.slice(i + kw.length));
    },
    qs: function (h) {
      var i = h.indexOf('?');
      return i < 0 ? '' : h.slice(i + 1);
    },
    query: function () {
      var o = {}, s = location.hash.split('?')[1];
      if (!s) return o;
      s.split('&').forEach(function (p) {
        if (!p) return;
        var kv = p.split('=');
        o[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      });
      return o;
    },
    go: function (h) { location.hash = h; },
    module: function (id) {
      var ms = BSQ.taxonomy.modules;
      for (var i = 0; i < ms.length; i++) if (ms[i].id === id) return ms[i];
      return null;
    },
    modName: function (id) { var m = U.module(id); return m ? m.name : id; },
    trackName: function (id) {
      var m = U.module(id); if (!m) return '';
      var ts = BSQ.taxonomy.tracks;
      for (var i = 0; i < ts.length; i++) if (ts[i].id === m.track) return ts[i].name;
      return '';
    },
    toast: function (msg) {
      var t = document.getElementById('toast');
      if (!t) return;
      U.html(t, U.esc(msg)); t.hidden = false;
      clearTimeout(U._tt);
      U._tt = setTimeout(function () { t.hidden = true; }, 1900);
    },
    shuffle: function (a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    pct: function (a, b) { return b ? Math.round(a / b * 100) : 0; },
    plural: function (n, s) { return n + ' ' + (s || '个'); }
  };

  /* ── storage ── */
  var KEY = 'bsq.v1.';
  var cache = {};
  var Store = BSQ.store = {
    get: function (k, dflt) {
      if (k in cache) return cache[k];
      try {
        var v = localStorage.getItem(KEY + k);
        var val = v === null ? dflt : JSON.parse(v);
        cache[k] = val;
        return val;
      } catch (e) { cache[k] = dflt; return dflt; }
    },
    set: function (k, v) {
      cache[k] = v;
      try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {}
      return v;
    },
    num: function (k) { var v = Store.get(k, 0); return typeof v === 'number' ? v : 0; },
    toggle: function (k, cur) { var v = cur ? 0 : 1; Store.set(k, v); return v; }
  };

  /* 进度状态 */
  BSQ.state = {
    theme: Store.get('theme', 'light'),
    bank: Store.get('bank', ''),         // 当前目标银行（bank picker）
    points: Store.get('points', {}),     // pid -> 1掌握 2待复习 3存疑
    cards: Store.get('cards', {}),       // cid -> {n, ef, iv, due, last}
    qlog: Store.get('qlog', {}),         // qid -> {n, ok, wrong, last}
    wrong: Store.get('wrong', {}),       // qid -> 次数
    star: Store.get('star', {}),         // qid -> 1
    daily: Store.get('daily', {}),       // '2026-01-01' -> {q:n, ok:n, card:n}
    goal: Store.get('goal', 20),
    save: function () {
      Store.set('points', this.points);
      Store.set('cards', this.cards);
      Store.set('qlog', this.qlog);
      Store.set('wrong', this.wrong);
      Store.set('star', this.star);
      Store.set('daily', this.daily);
      Store.set('bank', this.bank);
      Store.set('goal', this.goal);
    }
  };

  BSQ.today = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  BSQ.bumpDaily = function (k) {
    var t = BSQ.today(), d = BSQ.state.daily;
    d[t] = d[t] || { q: 0, ok: 0, card: 0 };
    d[t][k] = (d[t][k] || 0) + 1;
    BSQ.state.save();
  };

  /* ── derived stats ── */
  BSQ.stats = function () {
    var s = BSQ.state, pts = BSQ.points || [], qs = BSQ.questions || [];
    var mastered = 0, review = 0, flagged = 0;
    pts.forEach(function (p) {
      var v = s.points[p.id || (p.id = 'p' + BSQ.points.indexOf(p))];
      if (v === 1) mastered++; else if (v === 2) review++; else if (v === 3) flagged++;
    });
    var att = 0, okc = 0, qsWithLog = 0;
    Object.keys(s.qlog).forEach(function (k) {
      var l = s.qlog[k]; att += l.n || 0; okc += l.ok || 0; if (l.n) qsWithLog++;
    });
    return {
      totalPts: pts.length, mastered: mastered, review: review, flagged: flagged,
      totalQ: qs.length, attemptedQ: qsWithLog, attempts: att, correct: okc,
      wrongN: Object.keys(s.wrong).length,
      totalCards: (BSQ.cards || []).length,
      acc: att ? Math.round(okc / att * 100) : 0,
      mastery: U.pct(mastered, pts.length)
    };
  };

  /* ── search index ── */
  var idx = null;
  BSQ.buildIndex = function () {
    idx = [];
    (BSQ.points || []).forEach(function (p, i) {
      idx.push({ k: 'point', t: p.t, d: U.strip(p.b), m: p.m, extra: (p.k || []).join(' '),
                 ref: '#/learn/' + p.m + '?pt=' + (p.id || (p.id = 'p' + i)) });
    });
    (BSQ.questions || []).forEach(function (q, i) {
      idx.push({ k: 'q', t: U.strip(q.q), d: q.e ? U.strip(q.e) : '', m: q.m,
                 extra: (q.g || []).join(' ') + ' ' + (q.o || []).join(' '),
                 ref: '#/quiz?q=' + (q.id || (q.id = 'q' + i)) });
    });
    Object.keys(BSQ.banks).forEach(function (k) {
      var b = BSQ.banks[k];
      var flat = [b.name, b.cat, b.exam].concat(
        (b.culture || []).map(function (x) { return x[0] + x[1]; }),
        (b.guan || []).map(function (x) { return x[0] + x[1]; }),
        (b.strategy || []).map(function (x) { return x[0] + x[1]; }),
        (b.products || []).map(function (x) { return x[0] + x[1]; }),
        (b.metrics || []).map(function (x) { return x[0] + x[1]; }),
        (b.traps || []).join(' ')
      ).join(' ');
      idx.push({ k: 'bank', t: b.name, d: U.strip(flat).slice(0, 400), m: k, extra: flat, ref: '#/banks/' + k });
    });
    (BSQ.timeline || []).forEach(function (e, i) {
      idx.push({ k: 'time', t: e.d + ' ' + e.t, d: U.strip(e.x), m: (e.m || [])[0] || '',
                 extra: (e.g || []).join(' '), ref: '#/timeline?e=' + i });
    });
    (BSQ.numbers || []).forEach(function (g, i) {
      idx.push({ k: 'num', t: g.t, d: g.rows.map(function (r) { return U.strip(r[0]) + ' ' + U.strip(r[1]); }).join(' · ').slice(0, 400),
                 m: g.m, extra: '', ref: '#/numbers?g=' + i });
    });
    return idx;
  };
  BSQ.search = function (kw, limit) {
    if (!idx) idx = BSQ.buildIndex();
    kw = (kw || '').trim().toLowerCase();
    if (!kw) return [];
    var out = [];
    for (var i = 0; i < idx.length && out.length < (limit || 40); i++) {
      var it = idx[i];
      var hay = (it.t + ' ' + it.d + ' ' + it.extra).toLowerCase();
      if (hay.indexOf(kw) >= 0) out.push(it);
    }
    return out;
  };

  /* ── router ── */
  var routes = {};
  BSQ.route = function (name, fn) { routes[name] = fn; };

  BSQ.start = function () {
    function dispatch() {
      var h = (location.hash || '#/').replace(/^#/, '');
      var path = h.split('?')[0] || '/';
      var q = U.query();
      var seg = path.replace(/^\//, '').split('/');
      var name = path === '/' ? 'home' : seg[0];
      var arg = seg[1] || '';
      // 两段式路由（learn/finance、banks/ccb、quiz/run）优先匹配
      // 精确两段（quiz/run）→ 前缀两段（learn/:id、banks/:id）→ 单段
      // 无参数时用单段路由；有第二段时先试精确（quiz/run）再试前缀（learn/:id）
      var fn;
      if (arg) fn = routes[seg[0] + '/' + seg[1]] || routes[seg[0] + '/'] || routes[name] || routes.home;
      else fn = routes[name] || routes.home;
      var navKey = '/' + seg[0];
      var v = document.getElementById('view');
      document.querySelectorAll('.nav a').forEach(function (a) {
        a.classList.toggle('active', a.dataset.r === navKey || (name === 'home' && a.dataset.r === '/'));
      });
      v.innerHTML = '';
      try { fn(v, arg, q); }
      catch (err) {
        U.html(v, '<div class="empty"><div class="ei">⚠️</div><p>页面出错：' + U.esc(err.message) + '</p></div>');
        if (window.console) console.error(err);
      }
      window.scrollTo(0, 0);
    }
    addEventListener('hashchange', dispatch);
    dispatch();
  };

})(window.BSQ);