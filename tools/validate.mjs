import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = path.resolve(process.argv[2] || '.');
const files = [
  'data/taxonomy.js','data/points-a.js','data/points-b.js','data/points-c.js','data/points-d.js','data/points-e.js','data/points-f.js',
  'data/banks.js','data/questions-a.js','data/questions-b.js','data/questions-c.js','data/questions-d.js',
  'data/interview.js','data/interview-extra.js','data/cards.js','data/timeline.js','data/numbers.js','data/comparisons.js'
];

const ctx = { console };
// 让 window 与全局作用域同一对象，模拟浏览器 classic <script> 环境
ctx.window = ctx;
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { console.error('✖ 加载失败', f, '\n ', e.message); process.exit(1); }
}
const B = ctx.BSQ;
const mods = new Set(B.taxonomy.modules.map(m => m.id));
const banks = new Set(B.taxonomy.banks);
const err = [], warn = [];

const ids = new Set();
B.points.forEach((p, i) => {
  p.id = p.id || ('p' + i);
  if (ids.has(p.id)) err.push(`重复 id: ${p.id}`);
  ids.add(p.id);
  if (!mods.has(p.m)) err.push(`知识点 ${p.id} 模块无效: ${p.m}`);
  if (!p.t || !p.b) err.push(`知识点 ${p.id} 缺 t/b`);
});

const LETTERS = 'ABCDEF';
const qids = new Set();
const stems = new Map();
B.questions.forEach((q, i) => {
  q.id = q.id || ('q' + i);
  if (qids.has(q.id)) err.push(`重复 id: ${q.id}`);
  qids.add(q.id);
  if (!mods.has(q.m)) err.push(`题目 ${q.id} 模块无效: ${q.m}`);
  if (q.b && !banks.has(q.b)) err.push(`题目 ${q.id} 银行无效: ${q.b}`);
  if (!q.q) err.push(`题目 ${q.id} 缺题干`);
  if (!q.e) warn.push(`题目 ${q.id} 缺解析`);
  if (!['single','multi','judge','case'].includes(q.t)) err.push(`题目 ${q.id} 题型无效: ${q.t}`);
  if (q.t === 'judge') {
    if (!Array.isArray(q.o) || q.o.length !== 2) err.push(`题目 ${q.id} 判断题选项异常`);
    if (!['A','B'].includes(q.a)) err.push(`题目 ${q.id} 判断题答案异常: ${q.a}`);
  } else {
    if (!Array.isArray(q.o) || q.o.length < 2) err.push(`题目 ${q.id} 选项异常`);
    const ans = String(q.a).split('');
    if (!ans.length) err.push(`题目 ${q.id} 无答案`);
    ans.forEach(c => { if (!LETTERS.includes(c)) err.push(`题目 ${q.id} 答案字母越界: ${c}`); });
    if (q.o) ans.forEach(c => {
      const n = LETTERS.indexOf(c);
      if (n >= q.o.length) err.push(`题目 ${q.id} 答案 ${c} 超出选项范围(${q.o.length})`);
    });
    if (q.t === 'single' && ans.length !== 1) err.push(`题目 ${q.id} 单选但答案有 ${ans.length} 个`);
    if (q.t === 'multi' && ans.length < 2) warn.push(`题目 ${q.id} 多选仅 1 个答案`);
  }
  const key = String(q.q).replace(/\s+/g, '');
  if (stems.has(key)) warn.push(`相似题干: ${q.id} ≈ ${stems.get(key)}`);
  stems.set(key, q.id);
});

const iv = B.interview;
if (!iv || !Array.isArray(iv.questions) || !Array.isArray(iv.cats)) {
  err.push('面试题库结构缺失');
} else {
  const ivCats = new Set(iv.cats.map(c => c.id));
  const iids = new Set();
  iv.questions.forEach((q, i) => {
    q.id = q.id || ('I' + (i + 1));
    if (iids.has(q.id)) err.push(`重复 id: ${q.id}`);
    iids.add(q.id);
    if (!ivCats.has(q.c)) err.push(`面试题 ${q.id} 分类无效: ${q.c}`);
    if (!q.q || !q.a) err.push(`面试题 ${q.id} 缺题干或答题框架`);
    if (!Array.isArray(q.f) || !q.f.length) err.push(`面试题 ${q.id} 缺追问`);
  });
  if (iv.questions.length !== 146) warn.push(`面试题数量 ${iv.questions.length}（预期 146）`);
}

const cids = new Set();
B.cards.forEach((c, i) => {
  c.id = c.id || ('fc' + i);
  if (cids.has(c.id)) err.push(`重复 id: ${c.id}`);
  cids.add(c.id);
  if (!mods.has(c.m)) err.push(`速记卡 ${c.id} 模块无效: ${c.m}`);
  if (!c.f || !c.b) err.push(`速记卡 ${c.id} 缺正反面`);
});

(B.timeline || []).forEach((e, i) => {
  if (!e.d || !e.t || !e.x) err.push(`时间轴 ${i} 字段缺失`);
  (e.m || []).forEach(m => { if (!mods.has(m)) err.push(`时间轴 ${i} 模块无效: ${m}`); });
});

(B.numbers || []).forEach((g, i) => {
  if (!mods.has(g.m)) err.push(`数字表 ${i} 模块无效: ${g.m}`);
  if (!g.rows || !g.rows.length) err.push(`数字表 ${i} 无行`);
  g.rows.forEach((r, j) => { if (r.length < 2) err.push(`数字表 ${i} 第 ${j} 行列数不足`); });
});

(B.comparisons || []).forEach((c, i) => {
  if (!c.cols || !c.rows) return err.push(`对比表 ${i} 结构缺失`);
  c.rows.forEach((r, j) => { if (r.length !== c.cols.length) err.push(`对比表 ${i} 第 ${j} 行列数 ${r.length} ≠ 表头 ${c.cols.length}`); });
});

Object.keys(B.banks).forEach(k => {
  if (!banks.has(k)) err.push(`banks.${k} 未登记在 taxonomy.banks`);
  ['basic','culture','strategy','products','metrics'].forEach(f => {
    if (!Array.isArray(B.banks[k][f]) || !B.banks[k][f].length) err.push(`banks.${k} 缺 ${f}`);
    else B.banks[k][f].forEach((r, j) => { if (r.length < 2) err.push(`banks.${k}.${f} 第 ${j} 行异常`); });
  });
});
B.taxonomy.banks.forEach(k => { if (!B.banks[k]) err.push(`taxonomy.banks 引用了不存在的 banks.${k}`); });

/* ── icon coverage: every rendered pictograph / arrow / star must have an SVG ── */
const iconSrc = fs.readFileSync(path.join(root, 'assets/js/icons.js'), 'utf8');
vm.runInContext(iconSrc, ctx, { filename: 'assets/js/icons.js' });
const ICON = ctx.BSQ.icons;
const TOKEN_RE = /(?:[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2580}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}])(?:\u{FE0F})?/gu;
const sprite = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const spriteIds = new Set([...sprite.matchAll(/<symbol id="(i-[^"]+)"/g)].map(m => m[1]));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.name === '.git') return [];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    if (p.endsWith(path.join(root, 'tools/validate.mjs'))) return [];
    return /\.(js|html|css)$/.test(e.name) ? [p] : [];
  });
}
for (const f of walk(root)) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, n) => {
    for (const m of line.matchAll(TOKEN_RE)) {
      if (!(m[0] in ICON.map)) err.push(`图标未映射: ${m[0]} (${path.relative(root, f)}:${n + 1})`);
    }
  });
}
Object.entries(ICON.map).forEach(([token, def]) => {
  if (!spriteIds.has('i-' + def[0])) err.push(`图标 sprite 缺失: i-${def[0]} (${token})`);
});
const leftovers = ICON.iconify(Object.keys(ICON.map).join(' ')).match(TOKEN_RE);
if (leftovers) err.push(`iconify 仍有残留 token: ${[...new Set(leftovers)].join(' ')}`);

console.log('── 内容规模 ──');
console.log('知识点    ', B.points.length);
console.log('题目      ', B.questions.length, JSON.stringify(B.questions.reduce((a,q)=>{a[q.t]=(a[q.t]||0)+1;return a;},{})));
console.log('面试题    ', B.interview.questions.length, `(${(B.interview.questions||[]).filter(q=>q.hot).length} 道高频)`);
console.log('速记卡    ', B.cards.length);
console.log('时间轴    ', B.timeline.length);
console.log('数字表    ', B.numbers.length, `(${(B.numbers||[]).reduce((a,g)=>a+g.rows.length,0)} 行)`);
console.log('对比表    ', B.comparisons.length, `(${(B.comparisons||[]).reduce((a,c)=>a+c.rows.length,0)} 行)`);
console.log('银行      ', Object.keys(B.banks).length);
console.log('模块      ', B.taxonomy.modules.length);

console.log('\n── 分模块题目分布 ──');
B.taxonomy.modules.forEach(m => {
  const n = B.questions.filter(q => q.m === m.id).length;
  const p = B.points.filter(x => x.m === m.id).length;
  const c = B.cards.filter(x => x.m === m.id).length;
  console.log(`${m.name.padEnd(14, '　')} 题 ${String(n).padStart(3)} | 知识点 ${String(p).padStart(3)} | 卡 ${String(c).padStart(3)}`);
});

console.log('\n── 分银行题目分布 ──');
B.taxonomy.banks.forEach(b => console.log(`${B.banks[b].name.padEnd(6,'　')} ${B.questions.filter(q => q.b === b).length} 题`));
console.log(`金融市场(通用, m=market) ${B.questions.filter(q => q.m === 'market').length} 题`);

if (warn.length) { console.log('\n⚠ 警告 ' + warn.length + ' 项:'); warn.slice(0,40).forEach(w => console.log('  ·', w)); if (warn.length>40) console.log('  … 其余', warn.length-40, '项'); }
if (err.length) { console.log('\n✖ 错误 ' + err.length + ' 项:'); err.slice(0,60).forEach(e => console.log('  ·', e)); process.exit(1); }
console.log('\n✅ 校验通过：无错误');
