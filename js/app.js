
const state={tools:[],category:null,files:[]};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const color=cat=>REY_CATEGORIES[cat]||'#7199B5';

fetch('assets/tools.json').then(r=>r.json()).then(tools=>{
  state.tools=tools; renderCategories(); renderPopular(); renderNew(); bind();
}).catch(()=>{ $('#categories').innerHTML='<div class="empty">Unable to load tools.json.</div>'; });

function renderCategories(){
  $('#categories').innerHTML=Object.keys(REY_CATEGORIES).map(cat=>{
    const dark=['Image','Audio','QR','Converter','Education'].includes(cat);
    return `<a href="#" class="cat-card ${dark?'dark':''}" style="background:${color(cat)}" data-cat="${esc(cat)}">
      <span class="cat-icon">${REY_SYMBOLS[cat]||'◈'}</span><span class="cat-name">${esc(cat)}</span><span class="cat-count">10 tools</span></a>`;
  }).join('');
}
const popularNames=['PDF to Excel','PDF Merge','Image Compressor','QR Code Generator','Password Generator','JSON Formatter','Image Resizer','Percentage Calculator','Background Remover','Text Counter'];
function card(t){
 return `<a href="#" class="tool-card" data-tool="${esc(t.id)}"><span class="tool-icon" style="background:${color(t.category)}22;color:${color(t.category)}">${esc(REY_SYMBOLS[t.category]||'◈')}</span><span class="tool-info"><h3>${esc(t.name)}</h3><p>${esc(t.category)}</p></span><span class="tool-arrow">↗</span></a>`;
}
function renderPopular(){ $('#popular').innerHTML=popularNames.map(n=>state.tools.find(t=>t.name===n)).filter(Boolean).map(card).join(''); }
function renderNew(){ $('#newTools').innerHTML=state.tools.slice(-10).map(card).join(''); }

function bind(){
 document.addEventListener('click',e=>{
   const cat=e.target.closest('[data-cat]'); if(cat){e.preventDefault();showCategory(cat.dataset.cat);return}
   const tc=e.target.closest('[data-tool]'); if(tc){e.preventDefault();openTool(state.tools.find(t=>t.id===tc.dataset.tool));}
 });
 $('#search').addEventListener('input',e=>{
   const q=e.target.value.trim().toLowerCase(); const box=$('#searchResults');
   if(!q){box.classList.add('hidden');return}
   const found=state.tools.filter(t=>(t.name+' '+t.category).toLowerCase().includes(q));
   box.classList.remove('hidden'); $('#resultCount').textContent=found.length+' matches'; $('#resultsGrid').innerHTML=found.map(card).join('')||'<div class="empty">No tools found.</div>';
 });
 $('#back').onclick=()=>showHome(); $('#allToolsBtn').onclick=()=>showHome(); $('#brand').onclick=e=>{e.preventDefault();showHome()};
}
function showHome(){
 $('#home').style.display='block';$('#workspace').classList.remove('active');window.scrollTo({top:0,behavior:'smooth'});
}
function showCategory(cat){
 $('#home').style.display='block';$('#workspace').classList.remove('active');
 const found=state.tools.filter(t=>t.category===cat); $('#popular').innerHTML=found.map(card).join('');
 $('#newTools').innerHTML='<div class="empty">Select a tool above. Category view shows all 10 tools.</div>';
 document.querySelector('.section-head h2').textContent=cat.toUpperCase();
 window.scrollTo({top:document.querySelector('.section-head').offsetTop-70,behavior:'smooth'});
}
function openTool(t){
 if(!t)return;
 $('#home').style.display='none';$('#workspace').classList.add('active');
 $('#toolTitle').textContent=t.name.toUpperCase();$('#toolDesc').textContent=description(t.name);
 $('#bigIcon').textContent=REY_SYMBOLS[t.category]||'◈';$('#bigIcon').style.background=color(t.category)+'22';$('#bigIcon').style.color=color(t.category);
 $('#workspacePanel').innerHTML=engine(t);
 window.scrollTo({top:0,behavior:'smooth'});
 wireEngine(t);
}
function description(n){
 return ({
  'PDF to Excel':'Extract selectable PDF tables into an editable Excel workbook in your browser.',
  'PDF Merge':'Combine multiple PDF files into a single PDF document.',
  'PDF Split':'Split a PDF into selected page ranges.',
  'Image Resizer':'Resize an image while keeping control of its output dimensions.',
  'Image Compressor':'Compress an image in your browser using canvas encoding.',
  'QR Code Generator':'Generate a QR code from text or a URL without uploading your content.',
  'JSON Formatter':'Format JSON for readability and validation.',
  'Password Generator':'Generate cryptographically strong random passwords locally.'
 })[n]||'A focused REY TOOLS utility for '+n.toLowerCase()+'.';
}
function engine(t){
 const n=t.name;
 if(n==='PDF Merge') return `<label class="dropzone" id="drop"><div class="drop-inner"><div class="drop-plus">+</div><strong>Drop PDF files here</strong><small>or click to browse</small><input id="file" type="file" accept=".pdf,application/pdf" multiple hidden></div></label><div class="workspace-title"><strong>Selected Files</strong><span id="count">0 files</span></div><div id="files" class="file-list"><div class="empty">No files selected.</div></div><div class="action-row"><button class="primary" id="run" disabled>MERGE PDF</button></div><div class="result" id="result"><h3>PDF ready</h3><p id="resultText"></p><a class="download" id="download" download="rey-tools-merged.pdf">DOWNLOAD</a></div>`;
 if(n==='PDF Split') return `<div class="notice">Choose a PDF and enter pages such as <b>1-3,5,8-10</b>. The output is generated locally.</div><label class="dropzone" id="drop"><div class="drop-inner"><div class="drop-plus">+</div><strong>Choose a PDF</strong><small>PDF stays in your browser</small><input id="file" type="file" accept=".pdf,application/pdf" hidden></div></label><input id="pages" placeholder="Pages: 1-3,5,8-10" style="margin-top:12px;width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px"><div class="action-row"><button class="primary" id="run" disabled>SPLIT PDF</button></div><div class="result" id="result"><h3>PDF ready</h3><p id="resultText"></p><a class="download" id="download" download="rey-tools-split.pdf">DOWNLOAD</a></div>`;
 if(n==='PDF to Excel') return `<div class="notice">Best for PDFs containing selectable text arranged in simple rows/columns. Scanned/image-only PDFs require OCR and are not silently misread.</div><label class="dropzone" id="drop"><div class="drop-inner"><div class="drop-plus">+</div><strong>Choose PDF</strong><small>Extract text locally and build an XLSX workbook</small><input id="file" type="file" accept=".pdf,application/pdf" hidden></div></label><div class="action-row"><button class="primary" id="run" disabled>CONVERT TO EXCEL</button></div><div class="result" id="result"><h3>Excel ready</h3><p id="resultText"></p><a class="download" id="download" download="rey-tools-pdf.xlsx">DOWNLOAD XLSX</a></div>`;
 if(n==='Image Resizer'||n==='Image Compressor') return `<label class="dropzone" id="drop"><div class="drop-inner"><div class="drop-plus">+</div><strong>Choose image</strong><small>JPG, PNG, WebP</small><input id="file" type="file" accept="image/*" hidden></div></label><div class="workspace-title"><strong>Options</strong></div><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="w" type="number" placeholder="Width" style="padding:10px;border:1px solid #ddd8cf;border-radius:9px"><input id="h" type="number" placeholder="Height" style="padding:10px;border:1px solid #ddd8cf;border-radius:9px"><select id="fmt" style="padding:10px;border:1px solid #ddd8cf;border-radius:9px"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div><div class="action-row"><button class="primary" id="run" disabled>PROCESS IMAGE</button></div><div class="result" id="result"><h3>Image ready</h3><p id="resultText"></p><a class="download" id="download">DOWNLOAD</a></div>`;
 if(n==='QR Code Generator') return `<input id="text" placeholder="Enter text or URL" style="width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px"><div class="action-row"><button class="primary" id="run">GENERATE QR</button></div><div id="qr" style="display:grid;place-items:center;margin-top:18px"></div>`;
 if(n==='JSON Formatter'||n==='JSON Minifier') return `<textarea id="input" rows="12" placeholder='Paste JSON here...' style="width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px;resize:vertical"></textarea><div class="action-row"><button class="primary" id="run">PROCESS JSON</button></div><textarea id="output" rows="12" readonly style="margin-top:12px;width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px;resize:vertical"></textarea>`;
 if(n==='Password Generator') return `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><input id="len" type="number" min="4" max="256" value="24" style="padding:10px;border:1px solid #ddd8cf;border-radius:9px"><label><input id="symbols" type="checkbox" checked> Symbols</label></div><div class="action-row"><button class="primary" id="run">GENERATE PASSWORD</button></div><textarea id="output" rows="3" readonly style="margin-top:12px;width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px"></textarea>`;
 return generic(t);
}
function generic(t){
 const calc=['Calculator','Finance','Business','E-Commerce','Marketing','Date & Time','Converter'].includes(t.category);
 const placeholder=calc?'Enter values for '+t.name+'...':'Enter text for '+t.name+'...';
 return `<textarea id="input" rows="9" placeholder="${esc(placeholder)}" style="width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px;resize:vertical"></textarea><div class="action-row"><button class="primary" id="run">RUN TOOL</button></div><textarea id="output" rows="9" readonly style="margin-top:12px;width:100%;padding:12px;border:1px solid #ddd8cf;border-radius:10px"></textarea><div class="notice">This tool uses a local browser engine where possible. Specialized AI, OCR, codec, or third-party data services are not fabricated when they are unavailable offline.</div>`;
}
function wireEngine(t){
 const n=t.name;
 if(n==='PDF Merge') wireMerge();
 else if(n==='PDF Split') wireSplit();
 else if(n==='PDF to Excel') wirePdfExcel();
 else if(n==='Image Resizer'||n==='Image Compressor') wireImage(n);
 else if(n==='QR Code Generator') $('#run').onclick=()=>{const q=$('#qr');q.innerHTML='';new QRCode(q,{text:$('#text').value||' ',width:220,height:220,correctLevel:QRCode.CorrectLevel.M});};
 else if(n==='JSON Formatter'||n==='JSON Minifier') $('#run').onclick=()=>{try{const x=JSON.parse($('#input').value);$('#output').value=n.includes('Formatter')?JSON.stringify(x,null,2):JSON.stringify(x)}catch(e){$('#output').value='Invalid JSON: '+e.message}};
 else if(n==='Password Generator') $('#run').onclick=()=>{const len=Math.min(256,Math.max(4,+$('#len').value||24)), sym=$('#symbols').checked;let chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'+(sym?'!@#$%^&*()-_=+[]{};:,.?':'');let out='';const a=new Uint32Array(len);crypto.getRandomValues(a);for(let i=0;i<len;i++)out+=chars[a[i]%chars.length];$('#output').value=out};
 else {const run=$('#run');if(run)run.onclick=()=>genericRun(t)};
}
function genericRun(t){
 const input=$('#input')?.value||'';
 if(t.name==='Text Counter'||t.name==='Word Counter'||t.name==='Character Counter'||t.name==='Line Counter'){
   const lines=input?input.split(/\r?\n/).length:0, words=(input.match(/\S+/g)||[]).length, chars=input.length;
   $('#output').value=`Characters: ${chars}\nWords: ${words}\nLines: ${input?lines:0}`;return;
 }
 if(t.name==='Text Case Converter'){ $('#output').value=input.toLowerCase()+'\n\n'+input.toUpperCase()+'\n\n'+input.replace(/\b\w/g,c=>c.toUpperCase());return}
 if(t.name==='Remove Duplicate Lines'){ $('#output').value=[...new Set(input.split(/\r?\n/))].join('\n');return}
 if(t.name==='Sort Lines'){ $('#output').value=input.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join('\n');return}
 if(t.name==='Whitespace Cleaner'){ $('#output').value=input.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();return}
 if(t.name==='Base64 Encoder'){ $('#output').value=btoa(unescape(encodeURIComponent(input)));return}
 if(t.name==='Base64 Decoder'){try{$('#output').value=decodeURIComponent(escape(atob(input)))}catch(e){$('#output').value='Invalid Base64'}return}
 if(t.name==='URL Encoder'){$('#output').value=encodeURIComponent(input);return}
 if(t.name==='URL Decoder'){try{$('#output').value=decodeURIComponent(input)}catch(e){$('#output').value='Invalid URL encoding'}return}
 if(t.name==='URL Slug Generator'){$('#output').value=slug(input);return}
 if(t.name==='JSON to CSV'){try{const a=JSON.parse(input);const rows=Array.isArray(a)?a:[a];const keys=[...new Set(rows.flatMap(o=>Object.keys(o)))];$('#output').value=[keys.join(','),...rows.map(o=>keys.map(k=>JSON.stringify(o[k]??'')).join(','))].join('\n')}catch(e){$('#output').value='Invalid JSON'}return}
 $('#output').value=input;
}
function readPdfBytes(file){return file.arrayBuffer()}
function wireMerge(){
 let files=[];const input=$('#file'),drop=$('#drop'),list=$('#files'),run=$('#run'),count=$('#count');
 const render=()=>{list.innerHTML=files.length?files.map((f,i)=>`<div class="file-row"><span class="name">${esc(f.name)}</span><span>${(f.size/1048576).toFixed(1)} MB</span><button class="remove" data-i="${i}">×</button></div>`).join(''):'<div class="empty">No files selected.</div>';count.textContent=files.length+' files';run.disabled=files.length<2};
 const add=fs=>{files=files.concat([...fs].filter(f=>f.type==='application/pdf'||/\.pdf$/i.test(f.name)));render()};
 input.onchange=e=>add(e.target.files);drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');add(e.dataTransfer.files)};
 list.onclick=e=>{const b=e.target.closest('[data-i]');if(b){files.splice(+b.dataset.i,1);render()}};
 run.onclick=async()=>{const out=await PDFLib.PDFDocument.create();for(const f of files){const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p))}const bytes=await out.save();const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));$('#download').href=url;$('#resultText').textContent=`${files.length} PDFs merged successfully.`;$('#result').classList.add('show')};render();
}
function wireSplit(){
 let file=null;const input=$('#file'),drop=$('#drop'),run=$('#run');input.onchange=e=>{file=e.target.files[0];run.disabled=!file};drop.ondrop=e=>{e.preventDefault();file=e.dataTransfer.files[0];run.disabled=!file};
 run.onclick=async()=>{if(!file)return;const src=await PDFLib.PDFDocument.load(await file.arrayBuffer()),out=await PDFLib.PDFDocument.create();const nums=$('#pages').value.match(/\d+(?:-\d+)?/g)||[];let ids=[];nums.forEach(x=>{let[a,b]=x.split('-').map(Number);if(!b)b=a;for(let i=a;i<=b;i++)if(i>=1&&i<=src.getPageCount())ids.push(i-1)});const pages=await out.copyPages(src,[...new Set(ids)]);pages.forEach(p=>out.addPage(p));const bytes=await out.save();$('#download').href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));$('#resultText').textContent=`Created ${pages.length} pages.`;$('#result').classList.add('show')};
}
async function wirePdfExcel(){
 const input=$('#file'),drop=$('#drop'),run=$('#run');let file=null;input.onchange=e=>{file=e.target.files[0];run.disabled=!file};drop.ondrop=e=>{e.preventDefault();file=e.dataTransfer.files[0];run.disabled=!file};
 run.onclick=async()=>{
   if(!file)return;
   if(!window.pdfjsLib){$('#resultText').textContent='PDF.js is still loading. Please try again.';$('#result').classList.add('show');return}
   const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;let rows=[];
   for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p),content=await page.getTextContent();const items=content.items.map(x=>({t:x.str,x:x.transform[4],y:x.transform[5]})).filter(x=>x.t.trim());const lines={};items.forEach(it=>{const y=Math.round(it.y/3)*3;(lines[y]??=[]).push(it)});Object.keys(lines).sort((a,b)=>b-a).forEach(y=>{const line=lines[y].sort((a,b)=>a.x-b.x).map(x=>x.t).join(' | ');rows.push([p,line])})}
   if(!window.XLSX){$('#resultText').textContent='XLSX library is still loading. Please try again.';$('#result').classList.add('show');return}
   const ws=XLSX.utils.aoa_to_sheet([['Page','Extracted row'],...rows]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PDF Extract');const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});$('#download').href=URL.createObjectURL(new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));$('#resultText').textContent=`Extracted ${rows.length} text rows. For scanned PDFs, OCR is required.`;$('#result').classList.add('show');
 };
}
function wireImage(n){
 let file=null;const input=$('#file'),drop=$('#drop'),run=$('#run');input.onchange=e=>{file=e.target.files[0];run.disabled=!file};drop.ondrop=e=>{e.preventDefault();file=e.dataTransfer.files[0];run.disabled=!file};
 run.onclick=()=>{if(!file)return;const img=new Image();img.onload=()=>{const maxW=+$('#w').value||img.naturalWidth,maxH=+$('#h').value||img.naturalHeight;const c=document.createElement('canvas'),ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);c.width=Math.round(img.naturalWidth*ratio);c.height=Math.round(img.naturalHeight*ratio);c.getContext('2d').drawImage(img,0,0,c.width,c.height);const url=c.toDataURL($('#fmt').value,n==='Image Compressor'?0.72:.92);$('#download').href=url;$('#download').download='rey-tools-image.'+$('#fmt').value.split('/')[1];$('#resultText').textContent=`Output: ${c.width} × ${c.height}`;$('#result').classList.add('show')};img.src=URL.createObjectURL(file)};
}
