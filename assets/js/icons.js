/* icons · emoji / arrow / star tokens → inline SVG (see sprite in index.html) */
window.BSQ = window.BSQ || {};
(function (BSQ) {
  'use strict';

  /* token → [sprite name, extra class, accessible label ('' = decorative)] */
  var MAP = {
    '→': ['arrow-right', 'ico-inline', ''], '←': ['arrow-left', 'ico-inline', ''],
    '↑': ['arrow-up', 'ico-inline', ''], '⬇': ['download', '', ''],
    '⬆': ['upload', '', ''], '▶': ['play', '', ''], '↻': ['refresh', 'ico-inline', ''],
    '☑️': ['check-square', 'ico-ok', '已选'], '☑': ['check-square', 'ico-ok', '已选'],
    '✓': ['check', 'ico-ok', '正确'], '★': ['star', 'ico-inline', '星'], '☆': ['star-o', 'ico-inline', '空星'],
    '▸': ['chevron-right', 'ico-inline', ''], '▾': ['chevron-down', 'ico-inline', ''],
    '❌': ['x-circle', 'ico-err', '错误'], '✅': ['check-circle', 'ico-ok', '正确'],
    '⚠️': ['alert-triangle', 'ico-warn', '注意'], '⚠': ['alert-triangle', 'ico-warn', '注意'],
    '❓': ['help-circle', '', '疑问'], '⚖️': ['scales', '', ''], '⚖': ['scales', '', ''],
    '🃏': ['cards', '', ''], '🔁': ['repeat', '', ''], '🔍': ['search', '', ''], '🔎': ['search', '', ''],
    '📌': ['pin', '', ''], '📈': ['trending-up', '', ''], '📊': ['chart', '', ''],
    '📝': ['file-pen', '', ''], '📚': ['books', '', ''], '📖': ['book-open', '', ''],
    '📰': ['newspaper', '', ''], '🏦': ['bank', '', ''], '🇨🇳': ['flag-cn', 'ico-flag', '中国'],
    '🤝': ['handshake', '', ''], '📜': ['scroll', '', ''], '🚀': ['rocket', '', ''],
    '💰': ['coins', '', ''], '🗺️': ['map', '', ''], '🗺': ['map', '', ''], '🌾': ['wheat', '', ''],
    '🌐': ['globe', '', ''], '🎤': ['mic', '', ''], '🎯': ['target', '', ''], '⏳': ['hourglass', '', ''],
    '🏛': ['landmark', '', ''], '💎': ['gem', '', ''], '🧭': ['compass', '', ''],
    '🏷': ['tag', '', ''], '🗑': ['trash', '', ''], '💪': ['dumbbell', '', ''],
    '👍': ['thumbs-up', '', ''], '🎉': ['party', '', ''], '🤷': ['shrug', '', ''],
    '📭': ['inbox', '', ''], '👁': ['eye', '', ''], '🙈': ['eye-off', '', ''], '🔢': ['hash', '', ''],
    '🔵': ['dot', 'ico-dot-blue', ''], '🔴': ['dot', 'ico-dot-red', ''],
    '🟢': ['dot', 'ico-dot-green', ''], '🟠': ['dot', 'ico-dot-orange', ''],
    '🔷': ['diamond', 'ico-dot-blue', ''], '🔶': ['diamond', 'ico-dot-orange', ''],
    'bank:spdb': ['bank-spdb', 'ico-bank', ''], 'bank:ccb': ['bank-ccb', 'ico-bank', ''],
    'bank:cmb': ['bank-cmb', 'ico-bank', ''], 'bank:citic': ['bank-citic', 'ico-bank', ''],
    'bank:icbc': ['bank-icbc', 'ico-bank', ''], 'bank:boc': ['bank-boc', 'ico-bank', ''],
    'bank:pab': ['bank-pab', 'ico-bank', ''], 'bank:abc': ['bank-abc', 'ico-bank', ''],
    'bank:bocom': ['bank-bocom', 'ico-bank', '']
  };

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var TOKEN = new RegExp(Object.keys(MAP).sort(function (a, b) { return b.length - a.length; })
    .map(esc).join('|'), 'g');

  var I = BSQ.icons = {
    map: MAP,
    tokenPattern: TOKEN.source,
    /** Inline SVG for a sprite symbol. */
    ico: function (name, cls, label) {
      var a = 'class="ico i-' + name + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" ' +
        (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + ' focusable="false"';
      return '<svg ' + a + '><use href="#i-' + name + '"></use></svg>';
    },
    /** Replace all supported tokens in an HTML string with inline SVG. */
    iconify: function (html) {
      return String(html == null ? '' : html).replace(TOKEN, function (t) {
        var m = MAP[t];
        return I.ico(m[0], m[1], m[2]);
      });
    }
  };

  BSQ.ico = I.ico;
  BSQ.bankIcon = function (id) { return I.ico('bank-' + id, 'ico-bank'); };

  TOKEN.lastIndex = 0;
})(window.BSQ);
