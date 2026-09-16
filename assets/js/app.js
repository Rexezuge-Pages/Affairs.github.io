// 通用交互：主题 / 导航 / 搜索 / 进度 / 回顶
(function(){
  const root=document.documentElement;
  const savedTheme=localStorage.getItem('affairs-theme');
  if(savedTheme) root.setAttribute('data-theme',savedTheme);
  function toggleTheme(){
    const cur=root.getAttribute('data-theme')==='dark'?'light':'dark';
    if(cur==='light') root.removeAttribute('data-theme'); else root.setAttribute('data-theme','dark');
    localStorage.setItem('affairs-theme',cur);
    const b=document.getElementById('themeBtn'); if(b) b.textContent=(cur==='dark'?'☀️ 浅色':'🌙 深色');
  }
  window.toggleTheme=toggleTheme;
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.getElementById('themeBtn');
    if(b) b.textContent=(root.getAttribute('data-theme')==='dark'?'☀️ 浅色':'🌙 深色');
    // 移动端菜单
    const m=document.getElementById('menuBtn');
    if(m) m.onclick=()=>document.querySelector('.nav').classList.toggle('open');
    // 高亮当前导航
    const path=location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.nav a').forEach(a=>{
      if(a.getAttribute('href')===path) a.classList.add('active');
    });
    // 回顶
    const top=document.getElementById('toTop');
    if(top){
      addEventListener('scroll',()=>{top.style.display=scrollY>400?'block':'none'});
      top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
    }
    // 全文搜索（首页+模块页通用：过滤 .searchable）
    const inp=document.getElementById('q');
    if(inp){
      inp.addEventListener('input',()=>{
        const kw=inp.value.trim();
        const items=document.querySelectorAll('.searchable');
        let n=0;
        items.forEach(el=>{
          if(!kw){el.style.display='';el.classList.remove('search-hit');return;}
          const hit=el.textContent.includes(kw);
          el.style.display=hit?'':'none';
          el.classList.toggle('search-hit',hit);
          if(hit) n++;
        });
        const c=document.getElementById('searchCount');
        if(c) c.textContent=kw?`命中 ${n} 处 · 输入清空恢复`:'';
      });
      // 支持 ?q= 深度链接
      const u=new URLSearchParams(location.search);
      if(u.get('q')){inp.value=u.get('q');inp.dispatchEvent(new Event('input'));}
    }
    // 学习进度勾选
    const boxes=document.querySelectorAll('input.done[data-key]');
    const update=()=>{
      const all=document.querySelectorAll('input.done[data-key]');
      const done=[...all].filter(x=>x.checked).length;
      const bar=document.getElementById('progressFill');
      const txt=document.getElementById('progressText');
      if(bar) bar.style.width=(all.length?Math.round(done/all.length*100):0)+'%';
      if(txt) txt.textContent=`已掌握 ${done} / ${all.length}`;
    };
    boxes.forEach(ch=>{
      const k='affairs-done-'+ch.dataset.key;
      ch.checked=localStorage.getItem(k)==='1';
      ch.addEventListener('change',()=>{localStorage.setItem(k,ch.checked?'1':'0');update();});
    });
    update();
    // 卡片翻转（速记页通用）
    document.querySelectorAll('.flash').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('flip')));
  });
})();
