let DATA=[];
function money(n){if(n==null||n==='')return'—';const x=Number(n);if(Number.isNaN(x))return'—';return x.toLocaleString('en-US',{style:'currency',currency:'USD'});}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);}
function companyShort(c){c=String(c||'');if(/grinberg/i.test(c))return'Grinberg';if(/richmond/i.test(c))return'Richmond';if(/siny/i.test(c))return'SINY';return c;}
let abc='all',co='all',q='',region='all';
function filtered(){const qq=q.trim().toLowerCase();return DATA.filter(p=>{if(abc!=='all'&&String(p.abc||'').toUpperCase()!==abc)return false;if(co!=='all'&&companyShort(p.company)!==co)return false;if(region!=='all'){const r=String(p.region||'NY').toUpperCase();if(region==='NY'){if(r!=='NY'&&r!=='NJ')return false;}else if(r!==region)return false;}if(qq){const hay=(p.address+' '+p.slug+' '+p.company+' '+(p.abc||'')+' '+(p.region||'')).toLowerCase();if(!hay.includes(qq))return false;}return true;});}
function renderList(){const rows=filtered();document.getElementById('countMeta').textContent=DATA.length+' properties · showing '+rows.length;const a=DATA.filter(p=>String(p.abc).toUpperCase()==='A').length;const b=DATA.filter(p=>String(p.abc).toUpperCase()==='B').length;const c=DATA.filter(p=>String(p.abc).toUpperCase()==='C').length;const cost=DATA.reduce((s,p)=>s+(Number(p.costToDateDocumented)||0),0);document.getElementById('cards').innerHTML=`<div class="card"><div class="label">Properties</div><div class="value">${DATA.length}</div></div><div class="card a"><div class="label">A</div><div class="value">${a}</div></div><div class="card b"><div class="label">B</div><div class="value">${b}</div></div><div class="card c"><div class="label">C</div><div class="value">${c}</div></div><div class="card"><div class="label">Cost-to-date (doc)</div><div class="value" style="font-size:16px">${money(cost)}</div></div>`;document.getElementById('tbody').innerHTML=rows.map(p=>{const docs=(p.documents||[]).length;return `<tr><td><a href="#/p/${encodeURIComponent(p.slug)}">${esc(p.address||p.slug)}</a></td><td>${esc(p.abc||'')}</td><td>${esc(p.company||'')}</td><td>${esc(p.region||'')}</td><td class="num">${money(p.purchaseBasis)}</td><td class="num">${money(p.rmHoldingAllTime)}</td><td class="num">${money(p.costToDateDocumented)}</td><td>${docs||'—'}</td></tr>`;}).join('');}
function specVal(specs,key){if(!specs||specs[key]==null||specs[key]==='')return'—';return esc(specs[key]);}
function renderDetail(slug){const p=DATA.find(x=>x.slug===slug);const root=document.getElementById('detailRoot');if(!p){root.innerHTML='<p>Property not found.</p>';return;}const specs=p.specs||{};const docs=p.documents||[];root.innerHTML=`<header style="margin:0 0 12px;border:none;background:transparent;padding:0"><h1 style="font-size:22px">${esc(p.address||p.slug)}</h1><div class="meta">${esc(p.company||'')} · ABC ${esc(p.abc||'—')} · ${esc(p.region||'')} · ${esc(p.slug)}</div></header><div class="section"><h2>Cost stack</h2><div class="kv"><div class="k">Purchase basis</div><div>${money(p.purchaseBasis)} <span class="meta">${esc(p.purchaseSource||'')}</span></div><div class="k">RM holding (all-time)</div><div>${money(p.rmHoldingAllTime)}</div><div class="k">Mortgage (display)</div><div>${money(p.mortgageAmount)} <span class="meta">${esc(p.mortgageSource||'')}</span></div><div class="k">Closing estimate</div><div>${money(p.closingEstimate)}</div><div class="k">Cost-to-date (documented)</div><div><strong>${money(p.costToDateDocumented)}</strong></div><div class="k">Cost-to-date + closing est.</div><div>${money(p.costToDateWithClosingEst)}</div></div></div><div class="section"><h2>Operations</h2><div class="kv"><div class="k">Acquired</div><div>${esc(p.acqDate||'—')}</div><div class="k">Monthly rent</div><div>${money(p.monthlyRent)}</div><div class="k">Monthly costs</div><div>${money(p.monthlyCosts)}</div><div class="k">Action</div><div>${esc(p.action||'—')}</div><div class="k">Sold / pre-close</div><div>${p.sold?'Sold':''}${p.sold&&p.preClose?' / ':''}${p.preClose?'Pre-close':''}${(!p.sold&&!p.preClose)?'—':''}</div><div class="k">Notes</div><div>${esc(p.notes||'—')}</div></div></div><div class="section"><h2>Specs</h2><div class="kv"><div class="k">Zoning</div><div>${specVal(specs,'zoning')}</div><div class="k">Lot area (sf)</div><div>${specVal(specs,'lotAreaSf')}</div><div class="k">Bldg area (sf)</div><div>${specVal(specs,'bldgAreaSf')}</div><div class="k">Units</div><div>${specVal(specs,'units')}</div><div class="k">Stories</div><div>${specVal(specs,'stories')}</div><div class="k">Year built</div><div>${specVal(specs,'yearBuilt')}</div><div class="k">Building class</div><div>${specVal(specs,'bldgClass')}</div><div class="k">Owner name (PLUTO)</div><div>${specVal(specs,'ownerName')}</div></div></div><div class="section"><h2>Documents (${docs.length})</h2>${docs.length?docs.map(d=>`<div class="doc">${esc(d.name||d.title||d.path||JSON.stringify(d))}</div>`).join(''):'<div class="meta">No documents listed.</div>'}</div>`;}
function route(){const h=(location.hash||'#/').replace(/^#\/?/,'');if(h.startsWith('p/')){document.body.classList.add('show-detail');renderDetail(decodeURIComponent(h.slice(2)));}else{document.body.classList.remove('show-detail');renderList();}}
document.querySelectorAll('[data-abc]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('[data-abc]').forEach(x=>x.classList.remove('on'));el.classList.add('on');abc=el.dataset.abc;renderList();}));
document.querySelectorAll('[data-co]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('[data-co]').forEach(x=>x.classList.remove('on'));el.classList.add('on');co=el.dataset.co;renderList();}));
document.querySelectorAll('[data-region]').forEach(el=>el.addEventListener('click',()=>{document.querySelectorAll('[data-region]').forEach(x=>x.classList.remove('on'));el.classList.add('on');region=el.dataset.region;renderList();}));
const qEl=document.getElementById('q'); if(qEl) qEl.addEventListener('input',e=>{q=e.target.value;renderList();});
window.addEventListener('hashchange',route);
(async function(){
  try {
    const urls=[
      'https://ppr-seed-0.vercel.app/seed.0.b64.txt',
      'https://ppr-seed-1.vercel.app/seed.1.b64.txt',
      'https://ppr-seed-2p0.vercel.app/seed.2p0.b64.txt',
      'https://ppr-seed-2p1.vercel.app/seed.2p1.b64.txt',
      'https://ppr-seed-2p2.vercel.app/seed.2p2.b64.txt',
      'https://ppr-seed-2p3a.vercel.app/seed.2p3a.b64.txt',
      'https://ppr-seed-2p3b.vercel.app/seed.2p3b.b64.txt',
      'https://ppr-seed-3.vercel.app/seed.3.b64.txt'
    ];
    const b64=(await Promise.all(urls.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(u+' '+r.status);return r.text();}))).join('').trim();
    const bin=Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
    const ds=new DecompressionStream('gzip');
    const stream=new Blob([bin]).stream().pipeThrough(ds);
    const text=await new Response(stream).text();
    const seed=JSON.parse(text);
    DATA=seed.properties||[];
    route();
  } catch(err) {
    const el=document.getElementById('countMeta'); if(el) el.textContent='Failed to load properties';
    console.error(err);
  }
})();
