/* views · all page renderers */
(function (BSQ) {
  'use strict';
  var U = BSQ.util, S = BSQ.state, TX = BSQ.taxonomy;
  var R = {};
  var homeTrack = 'all';

  function tagHtml(tags) {
    return (tags || []).map(function (t) {
      var cfg = TX.tags[t];
      return cfg ? '<span class="tag ' + cfg.cls + '">' + U.esc(cfg.name) + '</span>' : '';
    }).join(' ');
  }
  function modProgress(mid) {
    var pts = BSQ.points.filter(function (p) { return p.m === mid; });
    var d = pts.filter(function (p) { return S.points[p.id] === 1; }).length;
    return { d: d, t: pts.length, pct: U.pct(d, pts.length) };
  }
  function head(title, sub, crumb) {
    return '<div class="page-head">' + (crumb ? '<div class="crumbs">' + crumb + '</div>' : '') +
      '<h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>';
  }
  var CRUMB_HOME = '<a href="#/">首页</a><span>/</span>';
  BSQ.tagHtml = tagHtml; BSQ.modProgress = modProgress;

  /* ══════════ 首页 ══════════ */
  R.home = function (v) {
    var st = BSQ.stats();
    var d = S.daily[BSQ.today()] || { q: 0, ok: 0, card: 0 };
    var goal = S.goal || 20;
    var now = Date.now();
    var dueCards = BSQ.cards.filter(function (c) {
      var s = S.cards[c.id];
      return !s || !s.due || s.due <= now;
    }).length;
    var lastMod = '', lastTs = 0;
    Object.keys(S.qlog).forEach(function (id) {
      var l = S.qlog[id], q = BSQ.questions.filter(function (x) { return x.id === id; })[0];
      if (q && l.last && l.last > lastTs) { lastTs = l.last; lastMod = q.m; }
    });

    var h = '<div class="masthead"><div class="masthead-main">' +
      '<div class="eyebrow">2025.9 — 2026.11 · 银行笔试备考</div>' +
      '<h1>银行笔试全量学习站</h1>' +
      '<p>时政 · 理论思想 · 法律 · 地理黄河 · 民生社保 · 9 家银行行情 · 金融市场 —— 知识点 ' + st.totalPts +
      ' 条，题目 ' + st.totalQ + ' 道，速记卡 ' + st.totalCards + ' 张。</p>' +
      '<div class="masthead-cta"><a class="btn primary" href="#/learn">进入知识库 →</a>' +
      '<a class="btn" href="#/quiz">直接刷题</a></div></div>' +
      '<div class="goal-wrap"><div class="ring" style="--p:' + U.pct(d.q, goal) + '"><div>' +
      '<div class="pv">' + d.q + '/' + goal + '</div><div class="pl">今日题量</div></div></div>' +
      '<div class="small">今日目标完成度</div></div></div>';

    /* 继续学习 */
    h += '<div class="continue-strip">' +
      '<a class="cs-item" href="#/cards?due=1"><span class="cs-ico" aria-hidden="true">🃏</span>' +
      '<span class="cs-txt"><b>待复习速记卡</b><small>' + dueCards + ' 张 · 遗忘曲线安排</small></span><span class="cs-arrow">→</span></a>' +
      '<a class="cs-item" href="#/wrong"><span class="cs-ico" aria-hidden="true">❌</span>' +
      '<span class="cs-txt"><b>错题待巩固</b><small>' + st.wrongN + ' 道 · 答对即移出</small></span><span class="cs-arrow">→</span></a>' +
      (lastMod ? '<a class="cs-item" href="#/learn/' + lastMod + '"><span class="cs-ico" aria-hidden="true">📖</span>' +
        '<span class="cs-txt"><b>继续学习</b><small>' + U.esc(U.modName(lastMod)) + '</small></span><span class="cs-arrow">→</span></a>' :
        '<a class="cs-item" href="#/timeline"><span class="cs-ico" aria-hidden="true">⏳</span>' +
        '<span class="cs-txt"><b>从时间轴开始</b><small>' + BSQ.timeline.length + ' 个时政事件</small></span><span class="cs-arrow">→</span></a>') +
      '</div>';

    /* stats */
    h += '<div class="grid g4 sec">' +
      '<div class="stat"><div class="lb">知识点掌握</div><div class="v">' + st.mastered +
      '<span class="muted" style="font-size:15px">/' + st.totalPts + '</span></div>' +
      '<div class="bar thin" style="margin-top:6px"><i style="width:' + st.mastery + '%"></i></div></div>' +
      '<div class="stat"><div class="lb">已练题目</div><div class="v">' + st.attemptedQ +
      '<span class="muted" style="font-size:15px">/' + st.totalQ + '</span></div>' +
      '<div class="bar thin" style="margin-top:6px"><i style="width:' + U.pct(st.attemptedQ, st.totalQ) + '%"></i></div></div>' +
      '<div class="stat"><div class="lb">答题正确率</div><div class="v">' + st.acc +
      '<span class="muted" style="font-size:15px">%</span></div><div class="s">累计 ' + st.attempts + ' 次作答</div></div>' +
      '<div class="stat"><div class="lb">错题本</div><div class="v">' + st.wrongN + '</div>' +
      '<div class="s"><a href="#/wrong">去复习 →</a></div></div></div>';

    /* bank picker */
    h += '<div class="card sec"><div class="row between"><h2 class="sec-t" style="margin:0">🎯 我的目标银行</h2>' +
      (S.bank ? '<button class="btn sm ghost" id="clearBank">清除选择</button>' : '') + '</div>' +
      '<p class="muted small" style="margin:6px 0 10px">选定后，刷题可一键筛选该银行专属题目。</p>' +
      '<div class="row">' + TX.banks.map(function (id) {
        var b = BSQ.banks[id];
        return '<button class="btn sm' + (S.bank === id ? ' on' : '') + '" data-bank="' + id + '">' +
          U.esc(b.short) + '</button>';
      }).join('') + '</div>';
    if (S.bank) {
      var bk = BSQ.banks[S.bank];
      var qn = BSQ.questions.filter(function (q) { return q.b === S.bank; }).length;
      h += '<div class="callout" style="margin-bottom:0">当前目标：<b>' + U.esc(bk.name) + '</b>　·　专属题目 <b>' + qn +
        '</b> 道　·　<a href="#/banks/' + S.bank + '">查看档案 →</a>　·　' +
        '<a href="#/quiz?bank=' + S.bank + '">只刷这家 →</a></div>';
    }
    h += '</div>';

    /* track tabs + module grid */
    h += '<div class="tabs" id="trackTabs">' +
      '<button data-track="all"' + (homeTrack === 'all' ? ' class="on"' : '') + '>全部 <span>' + TX.modules.length + '</span></button>' +
      TX.tracks.map(function (t) {
        var n = TX.modules.filter(function (m) { return m.track === t.id; }).length;
        return '<button data-track="' + t.id + '"' + (homeTrack === t.id ? ' class="on"' : '') + '>' +
          t.icon + ' ' + t.name + ' <span>' + n + '</span></button>';
      }).join('') + '</div><div id="homeModules">' + modulesHtml() + '</div>';

    U.html(v, h);

    v.querySelectorAll('#trackTabs [data-track]').forEach(function (b) {
      b.onclick = function () {
        homeTrack = b.dataset.track;
        v.querySelectorAll('#trackTabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
        U.html(v.querySelector('#homeModules'), modulesHtml());
      };
    });
    v.querySelectorAll('[data-bank]').forEach(function (b) {
      b.onclick = function () {
        S.bank = S.bank === b.dataset.bank ? '' : b.dataset.bank;
        S.save(); R.home(v);
        U.toast(S.bank ? '已选择：' + BSQ.banks[S.bank].name : '已清除目标银行');
      };
    });
    var cb = v.querySelector('#clearBank');
    if (cb) cb.onclick = function () { S.bank = ''; S.save(); R.home(v); };

    function modulesHtml() {
      var hh = '';
      TX.tracks.filter(function (t) { return homeTrack === 'all' || homeTrack === t.id; }).forEach(function (t) {
        var mods = TX.modules.filter(function (m) { return m.track === t.id; });
        var pts = BSQ.points.filter(function (p) { return mods.some(function (m) { return m.id === p.m; }); });
        var done = pts.filter(function (p) { return S.points[p.id] === 1; }).length;
        hh += '<h2 class="sec-t">' + t.icon + ' ' + t.name +
          ' <span class="muted" style="font-size:13px;font-weight:400">' + t.desc + '　（' + done + '/' + pts.length + '）</span></h2>';
        hh += '<div class="grid gauto">';
        mods.forEach(function (m) {
          var mp = modProgress(m.id);
          var qs = BSQ.questions.filter(function (q) { return q.m === m.id; }).length;
          var bank = TX.banks.indexOf(m.id) >= 0 ? BSQ.banks[m.id] : null;
          hh += '<a class="mod' + (mp.pct === 100 && mp.t ? ' done' : '') + '" href="#/learn/' + m.id + '"' +
            (bank ? ' style="border-left:4px solid ' + bank.color + '"' : '') + '>' +
            (mp.pct === 100 && mp.t ? '<span class="mbadge">✓ 已完成</span>' : '') +
            '<div class="mh"><span class="mi">' + m.icon + '</span><span class="mt">' + U.esc(m.name) + '</span></div>' +
            '<div class="md">' + U.esc(m.desc) + '</div>' +
            '<div class="bar thin"><i style="width:' + mp.pct + '%"></i></div>' +
            '<div class="mstat"><span>' + mp.d + '/' + mp.t + ' 知识点</span><span>' + qs + ' 题</span></div></a>';
        });
        hh += '</div>';
      });
      hh += '<div class="tools-row">' +
        '<a href="#/numbers">🔢 数字速记表</a><a href="#/compare">⚖️ 横向对比表</a>' +
        '<a href="#/timeline">⏳ 时政时间轴</a><a href="#/wrong">❌ 错题本</a>' +
        '<a href="#/progress">📈 学习进度</a><a href="#/cards">🃏 速记卡</a></div>';
      return hh;
    }
  };
  BSQ.totalCards = function () { return (BSQ.cards || []).length; };

  /* ══════════ 知识库总览 ══════════ */
  R.learn = function (v) {
    var h = head('📚 知识库', '按模块学习；勾选"已掌握"记录进度，自动保存。共 ' + BSQ.points.length + ' 条知识点、' + BSQ.questions.length + ' 道题。', CRUMB_HOME + '知识库');
    TX.tracks.forEach(function (t) {
      var mods = TX.modules.filter(function (m) { return m.track === t.id; });
      h += '<h2 class="sec-t sec">' + t.icon + ' ' + t.name + ' <span class="muted" style="font-size:13px;font-weight:400">' + t.desc + '</span></h2>';
      h += '<div class="grid gauto">';
      mods.forEach(function (m) {
        var mp = modProgress(m.id);
        var qs = BSQ.questions.filter(function (q) { return q.m === m.id; }).length;
        var cs = BSQ.cards.filter(function (c) { return c.m === m.id; }).length;
        var bank = TX.banks.indexOf(m.id) >= 0 ? BSQ.banks[m.id] : null;
        h += '<a class="mod" href="#/learn/' + m.id + '"' + (bank ? ' style="border-left:4px solid ' + bank.color + '"' : '') + '>' +
          '<div class="mh"><span class="mi">' + m.icon + '</span><span class="mt">' + U.esc(m.name) + '</span></div>' +
          '<div class="md">' + U.esc(m.desc) + '</div>' +
          '<div class="bar thin"><i style="width:' + mp.pct + '%"></i></div>' +
          '<div class="mstat"><span>' + mp.d + '/' + mp.t + ' 知识点</span><span>' + qs + ' 题' + (cs ? ' · ' + cs + ' 卡' : '') + '</span></div></a>';
      });
      h += '</div>';
    });
    U.html(v, h);
  };

  /* ══════════ 模块详情 ══════════ */
  R.learn_ = function (v, id, q) {
    var m = U.module(id);
    if (!m) { U.html(v, '<div class="empty"><div class="ei">🤷</div><p>模块不存在</p><a class="btn" href="#/learn">返回知识库</a></div>'); return; }
    var pts = BSQ.points.filter(function (p) { return p.m === id; });
    var qs = BSQ.questions.filter(function (q2) { return q2.m === id; });
    var mp = modProgress(id);
    var bank = TX.banks.indexOf(id) >= 0 ? BSQ.banks[id] : null;

    var h = '<div class="page-head"><div class="crumbs"><a href="#/">首页</a><span>/</span>' +
      '<a href="#/learn">知识库</a><span>/</span>' + U.esc(m.name) + '</div><h1>' + m.icon + ' ' + U.esc(m.name) + '</h1>' +
      '<p>' + U.esc(m.desc) + '　·　' + U.trackName(id) + ' / ' + U.modName(id) + '</p></div>';

    h += '<div class="card"><div class="row between">' +
      '<div style="flex:1;min-width:180px"><div class="row" style="margin-bottom:6px">' +
      '<b>掌握进度 ' + mp.d + ' / ' + mp.t + '</b><span class="muted small">（' + mp.pct + '%）</span></div>' +
      '<div class="bar"><i style="width:' + mp.pct + '%"></i></div></div>' +
      '<div class="row">' +
      (qs.length ? '<a class="btn sm primary" href="#/quiz?m=' + id + '">📝 刷本模块 ' + qs.length + ' 题</a>' : '') +
      '<button class="btn sm" id="expandAll">展开全部</button>' +
      '<button class="btn sm ghost" id="resetMod">重置进度</button>' +
      '</div></div></div>';

    if (bank) h += bankPanel(bank, id);

    h += '<div class="filters sec"><label>筛选标签' +
      '<select id="fTag"><option value="">全部</option>' +
      Object.keys(TX.tags).map(function (k) { return '<option value="' + k + '">' + TX.tags[k].name + '</option>'; }).join('') +
      '</select></label>' +
      '<label>状态<select id="fSt"><option value="">全部</option><option value="1">已掌握</option>' +
      '<option value="2">待复习</option><option value="3">存疑</option><option value="0">未标记</option></select></label>' +
      '<input id="fQ" type="text" placeholder="本模块内搜索…" style="width:180px">' +
      '<span class="muted small" id="fCount"></span></div>';

    h += '<div id="ptList">' + pts.map(pointHtml).join('') + '</div>';
    if (!pts.length) h = h.replace('<div id="ptList"></div>', '<div class="empty"><div class="ei">📭</div><p>本模块暂无知识点</p></div>');

    U.html(v, h);
    wirePoints(v, pts, id);
  };

  function pointHtml(p) {
    var st = S.points[p.id] || 0;
    return '<details class="pt" id="pt-' + U.esc(p.id) + '"' + (st === 1 ? ' data-st="1"' : '') + '>' +
      '<summary><span class="pchev">' + BSQ.ico('chevron-right') + '</span><span style="flex:1">' + U.esc(p.t) + '</span>' +
      '<span class="pmeta">' + tagHtml(p.tag) + '</span></summary>' +
      '<div class="pbody"><div>' + p.b + '</div>' +
      '<div class="pacts">' +
      '<button class="star' + (st === 1 ? ' on' : '') + '" data-mark="1">✓ 已掌握</button>' +
      '<button class="star' + (st === 2 ? ' on' : '') + '" data-mark="2">🔁 待复习</button>' +
      '<button class="star' + (st === 3 ? ' on' : '') + '" data-mark="3">❓ 存疑</button>' +
      '<a class="btn sm ghost" href="#/quiz?m=' + p.m + '">刷本模块题</a>' +
      '</div></div></details>';
  }

  function wirePoints(v, pts, mid) {
    var list = v.querySelector('#ptList');
    v.querySelectorAll('.pt').forEach(function (d) {
      var id = d.id.replace('pt-', ''), p = pts.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      d.querySelectorAll('[data-mark]').forEach(function (b) {
        b.onclick = function () {
          var mk = +b.dataset.mark;
          S.points[id] = S.points[id] === mk ? 0 : mk;
          S.save();
          d.querySelectorAll('[data-mark]').forEach(function (x) { x.classList.toggle('on', +x.dataset.mark === S.points[id]); });
          applyFilter();
        };
      });
      if (p.k && p.k.length) {
        var kw = d.querySelector('summary');
        kw.style.cursor = 'pointer';
      }
    });
    var ea = v.querySelector('#expandAll');
    if (ea) ea.onclick = function () {
      var ds = v.querySelectorAll('.pt');
      var anyClosed = [].some.call(ds, function (d) { return !d.open; });
      [].forEach.call(ds, function (d) { d.open = anyClosed; });
      ea.textContent = anyClosed ? '收起全部' : '展开全部';
    };
    var rb = v.querySelector('#resetMod');
    if (rb) rb.onclick = function () {
      pts.forEach(function (p) { delete S.points[p.id]; });
      S.save(); R.learn_(v, mid, {}); U.toast('已重置本模块进度');
    };

    var fT = v.querySelector('#fTag'), fS = v.querySelector('#fSt'), fQ = v.querySelector('#fQ');
    function applyFilter() {
      var kw = (fQ.value || '').trim().toLowerCase();
      var n = 0;
      v.querySelectorAll('.pt').forEach(function (d) {
        var id = d.id.replace('pt-', ''), p = pts.filter(function (x) { return x.id === id; })[0];
        if (!p) return;
        var ok = true;
        if (fT.value && (p.tag || []).indexOf(fT.value) < 0) ok = false;
        if (fS.value && String(S.points[id] || 0) !== fS.value) ok = false;
        if (kw && (p.t + ' ' + U.strip(p.b) + ' ' + (p.k || []).join(' ')).toLowerCase().indexOf(kw) < 0) ok = false;
        d.style.display = ok ? '' : 'none';
        if (ok) n++;
      });
      v.querySelector('#fCount').textContent = '显示 ' + n + ' / ' + pts.length + ' 条';
    }
    [fT, fS].forEach(function (e) { e.onchange = applyFilter; });
    fQ.oninput = applyFilter;
    applyFilter();
  }

  /* ══════════ 银行档案面板（复用） ══════════ */
  function bankPanel(b, id) {
    id = id || b.id || '';
    function kvList(arr) {
      if (!arr || !arr.length) return '';
      return '<div class="kvlist">' + arr.map(function (r) {
        return '<div class="kv"><div class="k">' + U.esc(r[0]) + '</div><div class="v">' + r[1] + '</div></div>';
      }).join('') + '</div>';
    }
    var h = '<div class="card sec" style="border-left:4px solid ' + b.color + '">';
    h += '<div class="row between"><h2 class="sec-t" style="margin:0">' + BSQ.bankIcon(id) + U.esc(b.name) + ' <span class="bc tag">' + U.esc(b.cat) + '</span></h2>' +
      '<a class="btn sm" href="#/banks/' + id + '">完整档案 →</a></div>';
    h += '<div class="callout" style="margin:11px 0"><b>考情：</b>' + b.exam + '</div>';
    h += '<h3 class="sec-t">🏛 基础档案</h3>' + kvList(b.basic);
    h += '<h3 class="sec-t">💎 企业文化</h3>' + kvList(b.culture);
    if (b.guan && b.guan.length) h += '<h3 class="sec-t">🧭 五观</h3>' + kvList(b.guan);
    h += '<h3 class="sec-t">🎯 核心战略</h3>' + kvList(b.strategy);
    h += '<h3 class="sec-t">🏷 特色产品 / 平台</h3>' + kvList(b.products);
    h += '<h3 class="sec-t">📊 经营数据（2025—2026）</h3>' + kvList(b.metrics);
    if (b.traps && b.traps.length) {
      h += '<h3 class="sec-t">⚠️ 易混淆避坑</h3>' + b.traps.map(function (t) {
        return '<div class="trap"><div class="th">⚠️ 陷阱</div>' + t + '</div>';
      }).join('');
    }
    h += '<div class="row" style="margin-top:12px"><a class="btn sm primary" href="#/quiz?bank=' + id + '">📝 刷该行 ' +
      BSQ.questions.filter(function (q) { return q.b === id; }).length + ' 题</a></div>';
    h += '</div>';
    return h;
  }
  BSQ.bankPanel = bankPanel;

  /* ══════════ 银行总览 ══════════ */
  R.banks = function (v, arg, q) {
    var h = head('🏦 银行行情', '9 家银行企业文化 / 战略 / 产品 / 经营数据 ＋ 金融市场行情。银行特色题每年必考，属送分模块。', CRUMB_HOME + '银行');
    h += '<div class="grid gauto">';
    TX.banks.forEach(function (id) {
      var b = BSQ.banks[id];
      var qn = BSQ.questions.filter(function (x) { return x.b === id; }).length;
      var vn = b.values || (b.culture[0] ? b.culture[0][1] : '');
      h += '<a class="bk" href="#/banks/' + id + '" style="--bc:' + b.color + '">' +
        '<div class="bh"><span class="bn">' + BSQ.bankIcon(id) + U.esc(b.name) + '</span><span class="bc">' + U.esc(b.cat) + '</span></div>' +
        '<div class="bv">' + U.strip(vn).slice(0, 70) + '</div>' +
        '<div class="bm">' + U.esc(b.basic[0][1]) + '</div>' +
        '<div class="row" style="margin-top:8px"><span class="tag bank">' + qn + ' 题</span>' +
        '<span class="tag">' + (b.basic[3] ? U.esc(b.basic[3][1]) : '') + '</span></div></a>';
    });
    h += '</div>';
    var mk = U.module('market');
    h += '<div class="mod sec" style="margin-top:14px;display:block"><div class="mh"><span class="mi">📈</span>' +
      '<span class="mt">金融市场行情（通用）</span></div><div class="md">' + U.esc(mk.desc) + '</div>' +
      '<a class="btn sm primary" href="#/learn/market">进入学习 →</a></div>';
    U.html(v, h);
  };

  /* ══════════ 银行详情 ══════════ */
  R.banks_ = function (v, id) {
    var b = BSQ.banks[id];
    if (!b) { U.html(v, '<div class="empty"><div class="ei">🤷</div><p>未找到该银行</p><a class="btn" href="#/banks">返回</a></div>'); return; }
    U.html(v, '<div class="page-head"><div class="crumbs"><a href="#/">首页</a><span>/</span>' +
      '<a href="#/banks">银行行情</a><span>/</span>' + U.esc(b.name) + '</div><h1>' + BSQ.bankIcon(id) + U.esc(b.name) +
      ' <span class="tag bank">' + U.esc(b.cat) + '</span></h1>' +
      '<p>' + U.esc(b.en) + '</p></div>' + bankPanel(b, id) +
      '<div class="row sec"><a class="btn" href="#/banks">← 返回银行列表</a></div>');
  };

  /* ══════════ 刷题配置 ══════════ */
  R.quiz = function (v, arg, q) {
    var all = BSQ.questions;
    var f = {
      m: q.m || '', b: q.bank || S.bank || '', t: q.type || '', g: q.g || '',
      d: q.diff || '', n: +(q.n || 30), order: q.order || 'seq'
    };
    var h = head('📝 智能刷题', '筛选条件 → 选择题量 → 开始。支持单选 / 多选 / 判断 / 情景题，即时答案与解析。', CRUMB_HOME + '刷题');
    h += '<div class="card"><div class="filters" style="margin:0;border:0;padding:0;box-shadow:none">' +
      '<label>模块<select id="cM"><option value="">全部模块</option>' +
      TX.modules.map(function (m) { return '<option value="' + m.id + '"' + (f.m === m.id ? ' selected' : '') + '>' + U.esc(m.name) + '</option>'; }).join('') +
      '</select></label>' +
      '<label>银行<select id="cB"><option value="">全部银行</option>' +
      TX.banks.map(function (id) { return '<option value="' + id + '"' + (f.b === id ? ' selected' : '') + '>' + U.esc(BSQ.banks[id].name) + '</option>'; }).join('') +
      '</select></label>' +
      '<label>题型<select id="cT">' + ['', 'single', 'multi', 'judge', 'case'].map(function (t) {
        var nm = t ? TX.qtypes.filter(function (x) { return x.id === t; })[0].name : '全部';
        return '<option value="' + t + '"' + (f.t === t ? ' selected' : '') + '>' + nm + '</option>';
      }).join('') + '</select></label>' +
      '<label>难度<select id="cD">' + ['', '1', '2', '3'].map(function (t) {
        return '<option value="' + t + '"' + (f.d === t ? ' selected' : '') + '>' + ({ '': '全部', '1': '1 基础', '2': '2 进阶', '3': '3 高难' })[t] + '</option>';
      }).join('') + '</select></label>' +
      '<label>题量<input id="cN" type="number" min="1" max="200" value="' + f.n + '" style="width:74px"></label>' +
      '<label>顺序<select id="cO">' + [['seq', '按顺序'], ['rand', '随机']].map(function (x) {
        return '<option value="' + x[0] + '"' + (f.order === x[0] ? ' selected' : '') + '>' + x[1] + '</option>';
      }).join('') + '</select></label>' +
      '</div>' +
      '<div class="row" style="margin-top:12px">' +
      '<button class="btn primary" id="startBtn">▶ 开始答题</button>' +
      '<a class="btn" href="#/wrong">❌ 错题本（' + Object.keys(S.wrong).length + '）</a>' +
      '<a class="btn" href="#/quiz?t=judge">⚖️ 只做判断题</a>' +
      '<a class="btn" href="#/quiz?t=multi">☑️ 只做多选题</a>' +
      '</div>' +
      '<div class="muted small" style="margin-top:10px">当前题库共 <b>' + all.length + '</b> 题：' +
      TX.qtypes.map(function (t) {
        return t.name + ' ' + all.filter(function (x) { return x.t === t.id; }).length + ' 道';
      }).join('　·　') + '</div></div>';

    /* module quick list */
    h += '<h2 class="sec-t sec">按模块快速开始</h2><div class="row">';
    TX.modules.forEach(function (m) {
      var n = all.filter(function (x) { return x.m === m.id; }).length;
      if (!n) return;
      h += '<a class="btn sm" href="#/quiz?m=' + m.id + '&n=' + Math.min(n, 30) + '">' + m.icon + ' ' + U.esc(m.name) + ' <span class="muted">' + n + '</span></a>';
    });
    h += '</div>';
    U.html(v, h);

    v.querySelector('#startBtn').onclick = function () {
      var p = new URLSearchParams();
      if (v.querySelector('#cM').value) p.set('m', v.querySelector('#cM').value);
      if (v.querySelector('#cB').value) p.set('bank', v.querySelector('#cB').value);
      if (v.querySelector('#cT').value) p.set('type', v.querySelector('#cT').value);
      if (v.querySelector('#cD').value) p.set('diff', v.querySelector('#cD').value);
      p.set('n', v.querySelector('#cN').value || 30);
      p.set('order', v.querySelector('#cO').value);
      U.go('#/quiz/run?' + p.toString());
    };
  };

  /* ══════════ 刷题运行 ══════════ */
  R.quizrun = function (v, arg, q) {
    var pool = BSQ.questions.filter(function (x) {
      if (q.m && x.m !== q.m) return false;
      if (q.bank && x.b !== q.bank) return false;
      if (q.type && x.t !== q.type) return false;
      if (q.diff && String(x.d) !== q.diff) return false;
      return true;
    });
    if (!pool.length) {
      U.html(v, '<div class="empty"><div class="ei">🔍</div><p>没有符合条件的题目</p><a class="btn" href="#/quiz">调整筛选</a></div>');
      return;
    }
    if (q.order === 'rand') pool = U.shuffle(pool);
    var want = Math.max(1, Math.min(+(q.n || 30), pool.length));
    var list = pool.slice(0, want);

    var i = 0, right = 0, answered = false;
    var startTs = Date.now();

    function render() {
      var x = list[i];
      var answeredFlag = !!S.qlog[x.id];
      var isMulti = x.t === 'multi';
      var sel = {};
      (x.o || []).forEach(function (_, n) { sel[n] = false; });

      var h = '<div class="quiz-head"><div style="flex:1;min-width:220px">' +
        '<div class="row" style="gap:6px;margin-bottom:7px">' +
        '<a class="btn sm ghost" href="#/quiz">← 返回配置</a>' +
        '<span class="tag">第 ' + (i + 1) + ' / ' + list.length + ' 题</span>' +
        '<span class="tag">' + TX.qtypes.filter(function (t) { return t.id === x.t; })[0].name + '</span>' +
        '<span class="tag">' + '★'.repeat(x.d || 1) + '</span>' +
        '<span class="tag">' + U.esc(U.modName(x.m)) + '</span>' +
        (answeredFlag ? '<span class="tag ok">已作答</span>' : '') + '</div>' +
        '<div class="bar thin"><i style="width:' + U.pct(i, list.length) + '%"></i></div></div>' +
        '<div class="quiz-meta"><span class="muted small" id="rightCount">正确 <b>' + right + '</b> 题</span>' +
        '<span class="kbd">数字键选项 · Enter 下一题</span></div></div>';

      h += '<div class="q" id="qBox"><div class="qh"><span class="qn">' + (i + 1) + '</span>' +
        '<span class="qs">' + x.q + '</span></div>' +
        '<div class="opts" id="opts">' + x.o.map(function (o, n) {
          return '<label class="opt" data-n="' + n + '"><span class="ol">' + 'ABCDEF'[n] + '</span><span>' + o + '</span></label>';
        }).join('') + '</div>' +
        '<div class="qfoot">' +
        '<button class="btn sm primary" id="checkBtn">' + (isMulti ? '提交答案' : '确认答案') + '</button>' +
        '<button class="btn sm ghost" id="showBtn">直接看解析</button>' +
        '<button class="btn sm ghost" id="starQ">' + (S.star[x.id] ? '★ 已收藏' : '☆ 收藏') + '</button>' +
        '</div></div>';

      h += '<div class="row quiz-nav"><button class="btn" id="prevBtn"' + (i === 0 ? ' disabled' : '') + '>← 上一题</button>' +
        '<button class="btn" id="nextBtn">下一题 →</button>' +
        '<button class="btn ghost" id="finishBtn">交卷看报告</button></div>';

      h += '<details class="answer-sheet"><summary class="sheet-toggle">🎯 答题卡' +
        '<span class="muted small">第 ' + (i + 1) + ' / ' + list.length + ' 题 · 点击展开</span></summary>' +
        '<div class="sheet-grid">' + list.map(function (_, n) {
          var l = S.qlog[list[n].id];
          var cls = n === i ? ' on' : (l ? (l.lastOk ? ' primary' : '') : '');
          return '<button class="btn sm' + cls + '" data-jump="' + n + '">' + (n + 1) + '</button>';
        }).join('') + '</div></details>';

      U.html(v, h);

      var box = v.querySelector('#qBox');
      function lock() {
        box.classList.add('show');
        v.querySelectorAll('.opt').forEach(function (el) {
          el.classList.add('lock');
          var n = +el.dataset.n;
          var ansArr = String(x.a).split('');
          if (ansArr.indexOf('ABCDEF'[n]) >= 0) el.classList.add('ok');
          else if (sel[n]) el.classList.add('no');
        });
        U.insert(box, 'beforeend', '<div class="expl"><div class="eh">✅ 正确答案：' + U.esc(x.a) + '　' + (isMulti ? '（多选，少选/错选不得分）' : '') + '</div>' +
          (x.e || '') + '</div>');
        var mine = picked();
        var ok = mine === String(x.a);
        box.classList.add(ok ? 'right' : 'wrong');
        record(x, ok);
        v.querySelector('#checkBtn').style.display = 'none';
        v.querySelector('#showBtn').style.display = 'none';
        v.querySelector('#starQ').style.display = 'none';
        if (ok) right++;
        renderFoot(right);
      }
      function picked() {
        var out = [];
        x.o.forEach(function (_, n) { if (sel[n]) out.push('ABCDEF'[n]); });
        return out.sort().join('');
      }
      v.querySelectorAll('.opt').forEach(function (el) {
        el.onclick = function () {
          if (answered) return;
          var n = +el.dataset.n;
          if (isMulti) { sel[n] = !sel[n]; el.classList.toggle('sel', sel[n]); }
          else {
            Object.keys(sel).forEach(function (k) { sel[k] = false; });
            v.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
            sel[n] = true; el.classList.add('sel');
            setTimeout(lock, 190);
          }
        };
      });
      v.querySelector('#checkBtn').onclick = lock;
      v.querySelector('#showBtn').onclick = function () {
        Object.keys(sel).forEach(function (k) { sel[k] = false; });
        lock();
      };
      v.querySelector('#starQ').onclick = function () {
        S.star[x.id] = S.star[x.id] ? 0 : 1; S.save();
        U.html(this, S.star[x.id] ? '★ 已收藏' : '☆ 收藏');
        U.toast(S.star[x.id] ? '已收藏' : '已取消收藏');
      };
      v.querySelector('#prevBtn').onclick = function () { if (i > 0) { i--; answered = false; render(); } };
      v.querySelector('#nextBtn').onclick = next;
      v.querySelector('#finishBtn').onclick = report;
      v.querySelectorAll('[data-jump]').forEach(function (b) {
        b.onclick = function () { i = +b.dataset.jump; answered = false; render(); };
      });

      function renderFoot(r) {
        var bar = v.querySelector('.quiz-head .bar i');
        if (bar) bar.style.width = U.pct(i + 1, list.length) + '%';
        var lab = v.querySelector('#rightCount');
        if (lab) U.html(lab, '正确 <b>' + r + '</b> 题');
      }
      function next() { if (i < list.length - 1) { i++; answered = false; render(); } else report(); }
      function record(qx, ok) {
        answered = true;
        var l = S.qlog[qx.id] || { n: 0, ok: 0, wrong: 0 };
        l.n++; l.lastOk = ok; l.last = Date.now();
        if (ok) l.ok++; else { l.wrong++; S.wrong[qx.id] = (S.wrong[qx.id] || 0) + 1; }
        S.qlog[qx.id] = l;
        S.save();
        BSQ.bumpDaily('q');
        if (ok) BSQ.bumpDaily('ok');
      }
      function report() {
        var done = list.filter(function (x) { return S.qlog[x.id]; }).length;
        var att = 0, okc = 0;
        list.forEach(function (x) { var l = S.qlog[x.id]; if (l) { att += l.n; okc += l.ok; } });
        var wrongList = list.filter(function (x) { var l = S.qlog[x.id]; return l && l.lastOk === false; });
        var secs = Math.round((Date.now() - startTs) / 1000);
        var hh = '<div class="card" style="text-align:center"><h2 class="sec-t" style="justify-content:center">📊 本次答题报告</h2>' +
          '<div class="grid g4" style="margin-top:12px">' +
          '<div class="stat"><div class="lb">完成题数</div><div class="v">' + done + '<span class="muted" style="font-size:15px">/' + list.length + '</span></div></div>' +
          '<div class="stat"><div class="lb">正确率</div><div class="v">' + U.pct(okc, att) + '<span class="muted" style="font-size:15px">%</span></div></div>' +
          '<div class="stat"><div class="lb">用时</div><div class="v">' + secs + '<span class="muted" style="font-size:15px">s</span></div></div>' +
          '<div class="stat"><div class="lb">本次答错</div><div class="v">' + wrongList.length + '</div></div>' +
          '</div>' +
          '<div class="row" style="justify-content:center;margin-top:16px">' +
          '<button class="btn primary" id="againBtn">再来一组</button>' +
          '<a class="btn" href="#/wrong">去错题本</a>' +
          '<a class="btn ghost" href="#/quiz">换筛选</a></div></div>';
        if (wrongList.length) {
          hh += '<h2 class="sec-t sec">本次错题</h2>';
          wrongList.forEach(function (x) { hh += qHtml(x, null, true); });
        }
        U.html(v, hh);
        v.querySelector('#againBtn').onclick = function () { U.go('#/quiz/run?' + U.qs(location.hash)); };
        v.querySelectorAll('[data-rev]').forEach(function (b) {
          b.onclick = function () {
            var x = list.filter(function (y) { return y.id === b.dataset.rev; })[0];
            U.insert(b.closest('.q'), 'beforeend', '<div class="expl"><div class="eh">正确答案：' + U.esc(x.a) + '</div>' + (x.e || '') + '</div>');
          };
        });
      }
    }
    render();
  };

  function qHtml(x, sel, showAns) {
    var isMulti = x.t === 'multi';
    var h = '<div class="q"><div class="qh"><span class="qn">?</span><span class="qs">' + x.q + '</span></div><div class="opts">' +
      x.o.map(function (o, n) {
        var c = '';
        if (showAns && String(x.a).split('').indexOf('ABCDEF'[n]) >= 0) c = ' ok';
        return '<div class="opt lock' + c + '"><span class="ol">' + 'ABCDEF'[n] + '</span><span>' + o + '</span></div>';
      }).join('') + '</div>';
    h += '<div class="qfoot">' + tagHtml(x.g) +
      '<span class="tag">' + U.esc(U.modName(x.m)) + '</span>' +
      (x.b ? '<a class="tag bank" href="#/banks/' + x.b + '">' + U.esc(BSQ.banks[x.b].short) + '</a>' : '') +
      '<button class="btn sm ghost" data-rev="' + x.id + '">看解析</button></div>';
    h += '</div>';
    return h;
  }

  /* ══════════ 错题本 ══════════ */
  R.wrong = function (v) {
    var ids = Object.keys(S.wrong).filter(function (id) { return S.qlog[id] && S.qlog[id].lastOk === false; });
    if (!ids.length) {
      U.html(v, head('❌ 错题本', '答错的题目会自动收集到这里。') +
        '<div class="empty"><div class="ei">🎉</div><p>暂时没有错题，继续保持！</p><a class="btn primary" href="#/quiz">去刷题</a></div>');
      return;
    }
    var list = U.shuffle(ids.map(function (id) { return BSQ.questions.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean));
    var i = 0, mode = 'list';

    var h = head('❌ 错题本', '共 <b>' + list.length + '</b> 道待复习（答错自动收录，重做正确后自动移出）。');
    h += '<div class="row"><button class="btn primary" id="redoBtn">🔁 开始重做（' + list.length + '）</button>' +
      '<button class="btn ghost" id="clearBtn">🗑 清空错题本</button></div>';
    h += '<div id="wBody" class="sec"></div>';
    U.html(v, h);

    function renderList() {
      U.html(v.querySelector('#wBody'), list.map(function (x) {
        var l = S.qlog[x.id];
        return qHtml(x, null, false).replace('<button class="btn sm ghost" data-rev=',
          '<span class="tag">错 ' + (l.wrong || 1) + ' 次</span><button class="btn sm ghost" data-rev=');
      }).join(''));
      wire();
    }
    function wire() {
      v.querySelectorAll('[data-rev]').forEach(function (b) {
        b.onclick = function () {
          var x = list.filter(function (y) { return y.id === b.dataset.rev; })[0];
          var box = b.closest('.q');
          if (box.querySelector('.expl')) return;
          U.insert(box, 'beforeend', '<div class="expl"><div class="eh">正确答案：' + U.esc(x.a) + '</div>' + (x.e || '') + '</div>');
          box.querySelectorAll('.opt').forEach(function (el, n) {
            if (String(x.a).split('').indexOf('ABCDEF'[n]) >= 0) el.classList.add('ok');
          });
        };
      });
    }
    function redo() {
      mode = 'run';
      i = 0; step();
    }
    function step() {
      var x = list[i];
      var isMulti = x.t === 'multi', sel = {};
      U.html(v.querySelector('#wBody'), '<div class="row" style="margin-bottom:10px"><span class="tag">第 ' + (i + 1) + ' / ' + list.length + ' 题</span>' +
        '<a class="btn sm ghost" href="#/wrong">← 退出重做</a></div>' +
        '<div class="q" id="qBox"><div class="qh"><span class="qn">' + (i + 1) + '</span><span class="qs">' + x.q + '</span></div>' +
        '<div class="opts">' + x.o.map(function (o, n) {
          return '<label class="opt" data-n="' + n + '"><span class="ol">' + 'ABCDEF'[n] + '</span><span>' + o + '</span></label>';
        }).join('') + '</div>' +
        '<div class="qfoot"><button class="btn sm primary" id="ck">' + (isMulti ? '提交' : '确认') + '</button>' +
        '<button class="btn sm ghost" id="sk">跳过</button></div></div>');
      function pick() {
        var out = []; x.o.forEach(function (_, n) { if (sel[n]) out.push('ABCDEF'[n]); });
        return out.sort().join('');
      }
      function lock() {
        var box = v.querySelector('#qBox');
        var ok = pick() === String(x.a);
        box.classList.add(ok ? 'right' : 'wrong');
        v.querySelectorAll('.opt').forEach(function (el) {
          el.classList.add('lock');
          if (String(x.a).split('').indexOf('ABCDEF'[el.dataset.n]) >= 0) el.classList.add('ok');
          else if (sel[el.dataset.n]) el.classList.add('no');
        });
        U.insert(box, 'beforeend', '<div class="expl"><div class="eh">' + (ok ? '✅ 正确！' : '❌ 正确答案：' + U.esc(x.a)) + '</div>' + (x.e || '') + '</div>');
        var l = S.qlog[x.id] || { n: 0, ok: 0, wrong: 0 };
        l.n++; l.last = Date.now();
        if (ok) { l.ok++; l.lastOk = true; delete S.wrong[x.id]; }
        else { l.wrong++; l.lastOk = false; S.wrong[x.id] = (S.wrong[x.id] || 0) + 1; }
        S.qlog[x.id] = l; S.save(); BSQ.bumpDaily('q');
        v.querySelector('#ck').style.display = 'none';
        var nb = document.createElement('button');
        nb.className = 'btn sm primary';
        U.html(nb, i < list.length - 1 ? '下一题 →' : '完成');
        nb.onclick = function () { i++; if (i < list.length) step(); else done(); };
        v.querySelector('#qBox .qfoot').appendChild(nb);
      }
      v.querySelectorAll('.opt').forEach(function (el) {
        el.onclick = function () {
          var n = +el.dataset.n;
          if (isMulti) { sel[n] = !sel[n]; el.classList.toggle('sel', sel[n]); }
          else { Object.keys(sel).forEach(function (k) { sel[k] = false; }); v.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); }); sel[n] = true; el.classList.add('sel'); setTimeout(lock, 180); }
        };
      });
      v.querySelector('#ck').onclick = function () { if (!Object.keys(sel).some(function (k) { return sel[k]; })) return U.toast('请先选择答案'); lock(); };
      v.querySelector('#sk').onclick = function () { i++; if (i < list.length) step(); else done(); };
    }
    function done() {
      var left = list.filter(function (x) { return S.wrong[x.id]; }).length;
      U.html(v.querySelector('#wBody'), '<div class="empty"><div class="ei">' + (left ? '💪' : '🎉') + '</div>' +
        '<p>' + (left ? '还有 <b>' + left + '</b> 道题需要巩固' : '错题本已清空，全部掌握！') + '</p>' +
        '<div class="row" style="justify-content:center"><a class="btn primary" href="#/quiz">继续刷题</a>' +
        '<button class="btn" onclick="location.reload()">查看结果</button></div></div>');
      R.wrongCount = left;
    }

    v.querySelector('#clearBtn').onclick = function () {
      if (!confirm('确定清空错题本？此操作不可撤销。')) return;
      S.wrong = {}; S.save(); R.wrong(v); U.toast('错题本已清空');
    };
    v.querySelector('#redoBtn').onclick = redo;
    renderList();
  };

  /* ══════════ 速记卡 ══════════ */
  R.cards = function (v, arg, q) {
    var f = { m: q.m || '', due: q.due === '1' };
    var pool = BSQ.cards.filter(function (c) { return !f.m || c.m === f.m; });
    var today = Date.now();
    var dueList = pool.filter(function (c) {
      var s = S.cards[c.id];
      return !s || !s.due || s.due <= today;
    });
    var gradedN = pool.filter(function (c) { return S.cards[c.id] && S.cards[c.id].n; }).length;

    var h = head('🃏 速记卡', '共 ' + BSQ.cards.length + ' 张。点击卡片翻面，用「认识 / 模糊 / 不认识」安排下次复习（遗忘曲线）。');
    h += '<div class="filters">' +
      '<label>模块<select id="cM"><option value="">全部</option>' +
      TX.modules.map(function (m) {
        var n = BSQ.cards.filter(function (c) { return c.m === m.id; }).length;
        return n ? '<option value="' + m.id + '"' + (f.m === m.id ? ' selected' : '') + '>' + U.esc(m.name) + '（' + n + '）</option>' : '';
      }).join('') + '</select></label>' +
      '<label>范围<select id="cD"><option value="">全部卡片</option>' +
      '<option value="1"' + (f.due ? ' selected' : '') + '>仅待复习（' + dueList.length + '）</option></select></label>' +
      '<button class="btn sm primary" id="startC">▶ 开始复习</button>' +
      '<button class="btn sm" id="allC">全部过一遍</button>' +
      '<span class="muted small">待复习 ' + dueList.length + ' 张</span></div>';

    if (!pool.length) { h += '<div class="empty"><div class="ei">📭</div><p>该模块暂无速记卡</p></div>'; U.html(v, h); return; }

    h += '<div class="row between sec" style="gap:12px">' +
      '<div class="bar" style="flex:1"><i style="width:' + U.pct(gradedN, pool.length) + '%"></i></div>' +
      '<span class="muted small">当前范围已复习 ' + gradedN + ' / ' + pool.length + ' 张</span></div>';

    var showAll = !f.due;
    h += '<div class="fc-grid" id="fcGrid">' + pool.map(function (c) {
      var s = S.cards[c.id];
      var due = !s || !s.due || s.due <= today;
      return '<div class="fc' + (showAll ? '' : (due ? '' : ' hidden-card')) + '" data-cid="' + c.id + '">' +
        '<div class="fc-in">' +
        '<div class="face"><div class="fk">❓ ' + U.esc(U.modName(c.m)) + '</div><div class="fq">' + U.esc(c.f) + '</div>' +
        '<div class="fcfoot"><span class="mini" data-act="flip">点我看答案</span></div></div>' +
        '<div class="face back"><div class="fk">✅ 答案</div><div>' + c.b + '</div>' +
        '<div class="fcfoot">' +
        '<button class="mini bad" data-act="no">不认识</button>' +
        '<button class="mini mid" data-act="mid">模糊</button>' +
        '<button class="mini good" data-act="yes">认识</button>' +
        '</div></div></div></div>';
    }).join('') + '</div>';
    if (!showAll) h += '<style>.hidden-card{display:none}</style>';
    U.html(v, h);

    function go(cards) {
      if (!cards.length) { U.toast('没有待复习的卡片 🎉'); return; }
      cards = U.shuffle(cards);
      var i = 0;
      function step() {
        var c = cards[i];
        U.html(v.querySelector('#fcGrid'), '<div class="row" style="margin-bottom:12px;grid-column:1/-1"><span class="tag">第 ' + (i + 1) + ' / ' + cards.length + '</span>' +
          '<button class="btn sm ghost" id="exitC">← 退出</button></div>' +
          '<div class="fc" id="oneCard" style="height:250px;grid-column:1/-1;max-width:520px;margin:0 auto;width:100%">' +
          '<div class="fc-in">' +
          '<div class="face"><div class="fk">❓ ' + U.esc(U.modName(c.m)) + '</div><div class="fq">' + U.esc(c.f) + '</div>' +
          '<div class="fcfoot"><span class="mini">点击翻面 · 空格键</span></div></div>' +
          '<div class="face back"><div class="fk">✅ 答案</div><div>' + c.b + '</div>' +
          '<div class="fcfoot">' +
          '<button class="mini bad" data-g="no">不认识</button>' +
          '<button class="mini mid" data-g="mid">模糊</button>' +
          '<button class="mini good" data-g="yes">认识</button>' +
          '</div></div></div></div>');
        var card = v.querySelector('#oneCard');
        card.onclick = function (e) {
          if (e.target.closest('button')) return;
          card.classList.toggle('flip');
        };
        v.querySelectorAll('[data-g]').forEach(function (b) {
          b.onclick = function (e) { e.stopPropagation(); grade(c, b.dataset.g); i++; if (i < cards.length) step(); else fin(); };
        });
        v.querySelector('#exitC').onclick = function () { R.cards(v, {}, {}); };
        window._fcFlip = function () { card.classList.toggle('flip'); };
      }
      function fin() {
        U.html(v.querySelector('#fcGrid'), '<div class="empty" style="grid-column:1/-1"><div class="ei">🎉</div><p>本轮复习完成！</p>' +
          '<div class="row" style="justify-content:center"><button class="btn primary" onclick="location.reload()">查看卡片</button></div></div>');
      }
      step();
    }

    v.querySelector('#startC').onclick = function () {
      go(v.querySelector('#cD').value === '1' ? dueList : pool);
    };
    v.querySelector('#allC').onclick = function () { go(pool); };
    v.querySelectorAll('.fc').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var act = e.target.dataset && e.target.dataset.act;
        var card = BSQ.cards.filter(function (c) { return c.id === el.dataset.cid; })[0];
        if (act === 'flip') { el.classList.toggle('flip'); return; }
        if (act) { grade(card, act); el.classList.toggle('flip'); }
        else el.classList.toggle('flip');
      });
    });

    function grade(c, g) {
      var s = S.cards[c.id] || { n: 0, ef: 2.5, iv: 0 };
      s.n++;
      if (g === 'yes') { s.ef = Math.min(3, s.ef + 0.1); s.iv = s.iv ? Math.round(s.iv * s.ef) : 2; }
      else if (g === 'mid') { s.ef = Math.max(1.3, s.ef - 0.2); s.iv = s.iv ? Math.max(1, Math.round(s.iv * 1.2)) : 1; }
      else { s.ef = Math.max(1.3, s.ef - 0.4); s.iv = 0; }
      var days = s.iv === 0 ? 0.02 : s.iv;
      s.due = Date.now() + days * 864e5;
      s.last = Date.now();
      S.cards[c.id] = s; S.save(); BSQ.bumpDaily('card');
      U.toast(g === 'yes' ? '👍 ' + Math.round(days) + ' 天后再见' : g === 'mid' ? '↻ ' + Math.max(1, Math.round(days)) + ' 天后再看' : '📌 已加入今日复习');
    }
  };

  /* ══════════ 时间轴 ══════════ */
  R.timeline = function (v, arg, q) {
    var tr = q.t || '';
    var list = BSQ.timeline.filter(function (e) {
      if (!tr) return true;
      return tr === 'all' || e.g.indexOf(tr) >= 0 || (e.m || []).some(function (m) { return m === tr; });
    });
    var months = {};
    list.forEach(function (e) { (months[e.d] = months[e.d] || []).push(e); });

    var h = head('⏳ 时政时间轴', '2025.9 — 2026.11 共 ' + BSQ.timeline.length + ' 个事件，按月分组。点标签可筛选。');
    var tags = {};
    BSQ.timeline.forEach(function (e) { (e.g || []).forEach(function (g) { tags[g] = 1; }); });
    h += '<div class="filters"><span class="muted small">筛选：</span>' +
      '<button class="btn sm' + (!tr ? ' on' : '') + '" data-t="">全部</button>' +
      Object.keys(tags).map(function (g) {
        return '<button class="btn sm' + (tr === g ? ' on' : '') + '" data-t="' + U.esc(g) + '">' + U.esc(g) + '</button>';
      }).join('') + '</div>';

    Object.keys(months).sort().forEach(function (mo) {
      h += '<h2 class="sec-t sec">' + mo + ' <span class="muted" style="font-size:13px;font-weight:400">' + months[mo].length + ' 项</span></h2>';
      h += '<div class="tl">';
      months[mo].forEach(function (e) {
        h += '<div class="tli" id="tl-' + U.esc(e.d) + '"><span class="tld">' + e.d + '</span>' +
          '<div class="tlt">' + e.t + '</div><div class="tlx">' + e.x + '</div>' +
          '<div class="row" style="margin-top:5px">' + tagHtml(e.g) +
          (e.m || []).map(function (m) { return '<a class="tag" href="#/learn/' + m + '">' + U.esc(U.modName(m)) + '</a>'; }).join('') +
          '</div></div>';
      });
      h += '</div>';
    });
    U.html(v, h);
    v.querySelectorAll('[data-t]').forEach(function (b) {
      b.onclick = function () { U.go('#/timeline?t=' + encodeURIComponent(b.dataset.t)); };
    });
  };

  /* ══════════ 数字速记 ══════════ */
  R.numbers = function (v, arg, q) {
    var hide = q.hide === '1';
    var h = head('🔢 数字速记表', '共 ' + BSQ.numbers.length + ' 组必背数字。点「遮盖」隐藏答案自测。');
    h += '<div class="filters"><button class="btn sm' + (hide ? '' : ' on') + '" id="tgHide">' +
      (hide ? '👁 显示数值' : '🙈 遮盖数值自测') + '</button>' +
      '<span class="muted small">打印后遮盖列可直接当小测卷用</span></div>';
    BSQ.numbers.forEach(function (g, gi) {
      var m = U.module(g.m);
      h += '<div class="card sec" id="ng-' + gi + '"><h2 class="sec-t" style="margin:0 0 4px">' +
        (m ? m.icon + ' ' : '') + U.esc(g.t) + '</h2>' +
        '<div class="muted small" style="margin-bottom:8px">' + U.esc(U.modName(g.m)) + '</div>' +
        '<div class="tw' + (hide ? ' hide' : '') + '"><table><thead><tr><th>项目</th><th>数值 / 结论</th></tr></thead><tbody>' +
        g.rows.map(function (r) {
          return '<tr><td class="k">' + r[0] + '</td><td>' + r[1] + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    });
    U.html(v, h);
    v.querySelector('#tgHide').onclick = function () {
      U.go('#/numbers?hide=' + (hide ? '0' : '1'));
    };
  };

  /* ══════════ 对比表 ══════════ */
  R.compare = function (v, arg, q) {
    var hide = q.hide === '1';
    var h = head('⚖️ 横向对比表', '对比是行测最高频出题套路——把不同银行、两年、不同概念放在一起让你选。共 ' + BSQ.comparisons.length + ' 张。');
    h += '<div class="filters"><button class="btn sm' + (hide ? '' : ' on') + '" id="tgHide">' +
      (hide ? '👁 显示全部列' : '🙈 遮盖列自测') + '</button>' +
      '<span class="muted small">遮盖后鼠标悬停任意行可临时查看</span></div>';
    BSQ.comparisons.forEach(function (c) {
      h += '<div class="card sec"><h2 class="sec-t" style="margin:0 0 4px">' + U.esc(c.t) + '</h2>' +
        (c.note ? '<div class="callout" style="margin:8px 0"><b>提示：</b>' + c.note + '</div>' : '') +
        '<div class="tw' + (hide ? ' hide' : '') + '"><table><thead><tr>' +
        c.cols.map(function (x) { return '<th>' + U.esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        c.rows.map(function (r) {
          return '<tr>' + r.map(function (cell, n) {
            return n === 0 ? '<td class="k">' + cell + '</td>' : '<td>' + cell + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div></div>';
    });
    U.html(v, h);
    v.querySelector('#tgHide').onclick = function () { U.go('#/compare?hide=' + (hide ? '0' : '1')); };
  };

  /* ══════════ 进度 ══════════ */
  R.progress = function (v) {
    var st = BSQ.stats();
    var h = head('📈 学习进度', '所有数据保存在本机浏览器（localStorage），不上传。可导出 JSON 备份或迁移到其他设备。');
    h += '<div class="card"><div class="row" style="gap:20px;align-items:center">' +
      '<div class="ring" style="--p:' + st.mastery + '"><div><div class="pv">' + st.mastery + '%</div><div class="pl">知识点掌握</div></div></div>' +
      '<div style="flex:1;min-width:200px"><div class="grid g3">' +
      '<div class="stat"><div class="lb">已掌握</div><div class="v">' + st.mastered + '</div><div class="s">共 ' + st.totalPts + ' 条</div></div>' +
      '<div class="stat"><div class="lb">待复习 / 存疑</div><div class="v">' + st.review + ' / ' + st.flagged + '</div></div>' +
      '<div class="stat"><div class="lb">正确率</div><div class="v">' + st.acc + '%</div><div class="s">' + st.attempts + ' 次作答</div></div>' +
      '</div></div></div>' +
      '<div class="row" style="margin-top:14px">' +
      '<button class="btn sm" id="expBtn">⬇ 导出进度</button>' +
      '<button class="btn sm" id="impBtn">⬆ 导入进度</button>' +
      '<button class="btn sm ghost" id="rstPts">重置知识点进度</button>' +
      '<button class="btn sm ghost" id="rstQ">重置答题记录</button>' +
      '<input type="file" id="impFile" accept="application/json" hidden>' +
      '</div></div>';

    h += '<h2 class="sec-t sec">分模块掌握情况</h2><div class="tw"><table><thead><tr>' +
      '<th>模块</th><th>掌握进度</th><th>知识点</th><th>题目数</th><th>该模块正确率</th><th>操作</th></tr></thead><tbody>';
    TX.modules.forEach(function (m) {
      var mp = modProgress(m.id);
      var qs = BSQ.questions.filter(function (x) { return x.m === m.id; });
      var att = 0, okc = 0;
      qs.forEach(function (x) { var l = S.qlog[x.id]; if (l) { att += l.n; okc += l.ok; } });
      var acc = att ? U.pct(okc, att) + '%' : '—';
      h += '<tr><td class="k"><a href="#/learn/' + m.id + '">' + m.icon + ' ' + U.esc(m.name) + '</a></td>' +
        '<td style="min-width:110px"><div class="bar thin"><i style="width:' + mp.pct + '%"></i></div><span class="small muted">' + mp.pct + '%</span></td>' +
        '<td>' + mp.d + ' / ' + mp.t + '</td><td>' + qs.length + '</td><td>' + acc + '</td>' +
        '<td><a class="btn sm ghost" href="#/quiz?m=' + m.id + '">刷题</a></td></tr>';
    });
    h += '</tbody></table></div>';

    /* 近 7 天 */
    var days = [], now = Date.now();
    for (var i = 6; i >= 0; i--) {
      var dt = new Date(now - i * 864e5);
      var key = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
      days.push({ k: key, l: (dt.getMonth() + 1) + '/' + dt.getDate(), d: S.daily[key] || { q: 0, ok: 0, card: 0 } });
    }
    var mx = Math.max.apply(null, days.map(function (x) { return Math.max(x.d.q, x.d.card); }).concat([1]));
    h += '<h2 class="sec-t sec">近 7 天活跃</h2><div class="card"><div class="row" style="align-items:flex-end;gap:8px;height:130px">' +
      days.map(function (x) {
        var hq = Math.round(x.d.q / mx * 88), hc = Math.round(x.d.card / mx * 88);
        return '<div style="flex:1;text-align:center"><div class="row" style="justify-content:center;align-items:flex-end;gap:3px;height:92px">' +
          '<div title="答题 ' + x.d.q + '" style="width:14px;height:' + Math.max(x.d.q ? 3 : 0, hq) + 'px;background:var(--navy);border-radius:3px 3px 0 0"></div>' +
          '<div title="卡片 ' + x.d.card + '" style="width:14px;height:' + Math.max(x.d.card ? 3 : 0, hc) + 'px;background:var(--accent);border-radius:3px 3px 0 0"></div>' +
          '</div><div class="small muted" style="margin-top:4px">' + x.l + '</div>' +
          '<div class="small muted">' + (x.d.q || 0) + '题</div></div>';
      }).join('') + '</div>' +
      '<div class="row small muted" style="justify-content:center;margin-top:8px;gap:14px">' +
      '<span><span style="display:inline-block;width:9px;height:9px;background:var(--navy);border-radius:2px"></span> 答题</span>' +
      '<span><span style="display:inline-block;width:9px;height:9px;background:var(--accent);border-radius:2px"></span> 卡片</span></div></div>';

    h += '<h2 class="sec-t sec">每日目标</h2><div class="card"><div class="row">' +
      '<label class="muted small">每天做题目标<input id="goalIn" type="number" min="5" max="200" value="' + (S.goal || 20) + '" style="width:80px;margin-left:6px"></label>' +
      '<button class="btn sm" id="saveGoal">保存</button></div></div>';

    U.html(v, h);

    v.querySelector('#expBtn').onclick = function () {
      var blob = new Blob([JSON.stringify({ v: 1, ts: Date.now(), points: S.points, cards: S.cards, qlog: S.qlog, wrong: S.wrong, star: S.star, daily: S.daily, goal: S.goal, bank: S.bank }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'bank-study-progress-' + BSQ.today() + '.json';
      a.click();
      U.toast('已导出');
    };
    v.querySelector('#impBtn').onclick = function () { v.querySelector('#impFile').click(); };
    v.querySelector('#impFile').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          ['points', 'cards', 'qlog', 'wrong', 'star', 'daily'].forEach(function (k) { if (d[k]) S[k] = d[k]; });
          if (d.goal) S.goal = d.goal;
          if (d.bank !== undefined) S.bank = d.bank;
          S.save(); R.progress(v); U.toast('导入成功');
        } catch (err) { U.toast('文件格式错误'); }
      };
      r.readAsText(f);
    };
    v.querySelector('#rstPts').onclick = function () {
      if (!confirm('重置所有知识点掌握标记？')) return;
      S.points = {}; S.cards = {}; S.save(); R.progress(v); U.toast('已重置');
    };
    v.querySelector('#rstQ').onclick = function () {
      if (!confirm('重置所有答题记录与错题本？')) return;
      S.qlog = {}; S.wrong = {}; S.star = {}; S.daily = {}; S.save(); R.progress(v); U.toast('已重置');
    };
    v.querySelector('#saveGoal').onclick = function () {
      S.goal = Math.max(5, +v.querySelector('#goalIn').value || 20);
      S.save(); U.toast('目标已保存');
    };
  };

  /* ── register routes ── */
  BSQ.route('home', R.home);
  BSQ.route('learn', R.learn);
  BSQ.route('learn/', R.learn_);
  BSQ.route('banks', R.banks);
  BSQ.route('banks/', R.banks_);
  BSQ.route('quiz', R.quiz);
  BSQ.route('quiz/run', R.quizrun);
  BSQ.route('cards', R.cards);
  BSQ.route('timeline', R.timeline);
  BSQ.route('numbers', R.numbers);
  BSQ.route('compare', R.compare);
  BSQ.route('wrong', R.wrong);
  BSQ.route('progress', R.progress);
  BSQ.views = R;

})(window.BSQ);