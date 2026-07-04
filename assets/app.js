const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const templates = window.ODFLOW_TEMPLATES || [];
const generateTemplates = window.ODFLOW_GENERATE_TEMPLATES || [];
const schemas = window.ODFLOW_DOC_SCHEMAS || {};
const app = $("#app");
const pageTitle = $("#pageTitle");

const titles = {
  home: "首頁",
  dashboard: "儀表板",
  templates: "空白範本",
  generate: "生成文件",
  files: "檔案庫",
  evaluation: "社團評鑑",
  settings: "社團設定",
};

let currentPage = location.hash.replace("#","") || "home";
let currentGenerate = generateTemplates[0] || {schema:"活動企劃書", name:"活動企劃書"};

function setPage(page){
  currentPage = page;
  location.hash = page;
  $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  pageTitle.textContent = titles[page] || "首頁";
  render();
}

$$(".nav-item").forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));
window.addEventListener("hashchange", () => setPage(location.hash.replace("#","") || "home"));

function pageWrap(html){ app.innerHTML = html; app.classList.remove("content"); void app.offsetWidth; app.classList.add("content"); }

function downloadJson(filename, data){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function renderHome(){
  pageWrap(`
    <div class="grid two">
      <section class="card hero">
        <div class="hero-illus">📁</div>
        <div>
          <div class="kicker">台灣學生社團 ODF 文件工作台</div>
          <h1>一站式管理社團 ODF 文件與評鑑</h1>
          <p class="muted">從空白範本、文件填寫、預覽確認到社團評鑑整理，ODFlow 讓社團文件更有效率、更有條理。</p>
          <div class="stat-row">
            <div class="stat"><span>📄</span><div><strong>${templates.length}</strong><span>官方範本</span></div></div>
            <div class="stat"><span>📝</span><div><strong>${generateTemplates.length}</strong><span>生成文件</span></div></div>
            <div class="stat"><span>✅</span><div><strong>100%</strong><span>ODF 格式</span></div></div>
            <div class="stat"><span>⚡</span><div><strong>0</strong><span>後端等待</span></div></div>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="kicker">資料依目前 demo 更新</div>
        <h2 style="font-size:34px;margin:8px 0 18px">社團評鑑準備度</h2>
        <div style="display:flex;gap:24px;align-items:center">
          <div class="ring"><div class="ring-inner"><div><div style="font-size:30px">72%</div><div style="color:#64748b;font-size:12px">準備度</div></div></div></div>
          <div style="display:grid;gap:12px;flex:1">
            <div class="stat"><span>⚠️</span><div><strong>3</strong><span>待補佐證</span></div></div>
            <div class="stat"><span>✅</span><div><strong>12</strong><span>可下載範本</span></div></div>
            <button class="btn coral" data-go="evaluation">前往社團評鑑 →</button>
          </div>
        </div>
      </section>
    </div>
    <h2 class="section-title">快速開始</h2>
    <div class="grid three">
      ${action("📄","下載空白範本","快速下載 ODT / ODS 空白範本，直接開始整理文件。","templates")}
      ${action("📝","建立正式文件","依照不同文件欄位填寫資料，立即產生預覽。","generate")}
      ${action("📦","整理社團評鑑","檢查文件與佐證資料，掌握補件進度。","evaluation")}
    </div>`);
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.go)));
}

function action(icon,title,desc,page){
  return `<section class="card action-card"><div class="icon">${icon}</div><div><h3>${title}</h3><p class="muted">${desc}</p><button class="btn secondary" data-go="${page}">前往</button></div></section>`
}

function renderDashboard(){
  pageWrap(`
    <div class="grid four">
      ${kpi("目前文件","18","demo 文件庫")}
      ${kpi("空白範本",templates.length,"可下載")}
      ${kpi("待補文件","3","社團評鑑")}
      ${kpi("完成率","72%","展示資料")}
    </div>
    <div class="grid two" style="margin-top:20px">
      <section class="card"><h2>近期任務</h2>
        <div class="file-row"><strong>活動企劃書</strong><span>草稿</span><span>社團活動</span><button class="btn secondary" data-go="generate">建立</button></div>
        <div class="file-row"><strong>會議紀錄</strong><span>待補</span><span>管理運作</span><button class="btn secondary" data-go="generate">建立</button></div>
        <div class="file-row"><strong>經費預算表</strong><span>完成</span><span>財務</span><button class="btn secondary" data-go="templates">下載</button></div>
      </section>
      <section class="card"><h2>ODF 狀態</h2><p class="muted">此靜態版不依賴 Streamlit，頁面切換由前端完成，適合 GitHub Pages / Cloudflare Pages 展示。</p></section>
    </div>`);
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.go)));
}

function kpi(title,value,sub){ return `<section class="card kpi"><div><span>${title}</span><strong>${value}</strong><p class="muted">${sub}</p></div></section>` }

function renderTemplates(){
  pageWrap(`
    <div class="template-toolbar">
      <input id="templateSearch" placeholder="搜尋範本名稱..." />
      <select id="fmtFilter"><option value="">全部格式</option><option>ODT</option><option>ODS</option></select>
      <select id="catFilter"><option value="">全部分類</option>${[...new Set(templates.map(t=>t.category))].map(c=>`<option>${c}</option>`).join("")}</select>
    </div>
    <div id="templateGrid" class="template-grid"></div>`);
  function draw(){
    const q=$("#templateSearch").value.trim().toLowerCase();
    const fmt=$("#fmtFilter").value;
    const cat=$("#catFilter").value;
    const rows = templates.filter(t => (!q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) && (!fmt || t.fmt===fmt) && (!cat || t.category===cat));
    $("#templateGrid").innerHTML = rows.map(t=>`
      <section class="card template-card">
        <div class="doc-thumb" data-fmt="${t.fmt}"></div>
        <div><span class="tag">${t.category}</span><h3>${t.name}</h3><p class="muted">${t.desc}</p>
        ${t.file ? `<a class="btn" href="${t.file}" download>下載 ${t.fmt}</a>` : `<button class="btn secondary" disabled>尚未開放</button>`}
        </div>
      </section>`).join("");
  }
  ["input","change"].forEach(evt => {
    $("#templateSearch").addEventListener(evt, draw);
    $("#fmtFilter").addEventListener(evt, draw);
    $("#catFilter").addEventListener(evt, draw);
  });
  draw();
}

function renderGenerate(){
  const options = generateTemplates.map((t,i)=>`<option value="${i}">${t.name}</option>`).join("");
  pageWrap(`
    <div class="grid two">
      <section class="card">
        <h2>選擇範本並填寫資料</h2>
        <div class="field"><label>文件範本</label><select id="genTemplate">${options}</select></div>
        <form id="genForm" class="form-grid" style="margin-top:16px"></form>
      </section>
      <section class="card">
        <h2>即時預覽</h2>
        <div id="preview" class="preview-paper"></div>
        <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
          <button class="btn" id="downloadData">下載填寫資料 JSON</button>
          <button class="btn secondary" id="goTemplateDownload">下載對應空白範本</button>
        </div>
      </section>
    </div>`);
  $("#genTemplate").addEventListener("change", e => { currentGenerate = generateTemplates[+e.target.value]; drawForm(); });
  $("#downloadData").addEventListener("click", () => downloadJson("odflow-document-data.json", collectForm()));
  $("#goTemplateDownload").addEventListener("click", () => setPage("templates"));
  drawForm();
}

function drawForm(){
  const schemaName = currentGenerate.schema || "活動企劃書";
  const schema = schemas[schemaName] || schemas["活動企劃書"];
  $("#genForm").innerHTML = schema.fields.map(([key,label,type]) => `
    <div class="field" style="${type==='textarea' ? 'grid-column:1/3' : ''}">
      <label>${label}</label>
      ${type === "textarea" ? `<textarea name="${key}" placeholder="請輸入${label}"></textarea>` : `<input name="${key}" type="${type}" placeholder="請輸入${label}" />`}
    </div>`).join("");
  $$("input,textarea", $("#genForm")).forEach(el => el.addEventListener("input", updatePreview));
  updatePreview();
}

function collectForm(){
  const data = {};
  $$("[name]", $("#genForm")).forEach(el => data[el.name] = el.value);
  return {template: currentGenerate.name, schema: currentGenerate.schema, content: data, exportedAt: new Date().toISOString()};
}

function updatePreview(){
  const data = collectForm();
  const rows = Object.entries(data.content).map(([k,v]) => `<tr><td>${labelFor(k)}</td><td>${(v||"—").replace(/\n/g,"<br>")}</td></tr>`).join("");
  $("#preview").innerHTML = `<h2>${data.content.activity_name || data.content.meeting_title || data.content.club_name || data.template}</h2><table>${rows}</table><p class="muted">此頁為靜態展示版，正式 ODT/ODS 後端可由 FastAPI 接現有 Python generator。</p>`;
}

function labelFor(key){
  const schema = schemas[currentGenerate.schema] || {};
  const field = (schema.fields || []).find(f => f[0]===key);
  return field ? field[1] : key;
}

function renderFiles(){
  pageWrap(`<section class="card"><h2>檔案庫</h2>${templates.slice(0,8).map(t=>`<div class="file-row"><strong>${t.name}</strong><span>${t.fmt}</span><span>${t.category}</span>${t.file ? `<a class="btn secondary" href="${t.file}" download>下載</a>` : `<span>—</span>`}</div>`).join("")}</section>`);
}

function renderEvaluation(){
  pageWrap(`<div class="grid two"><section class="card"><h2>社團評鑑缺件</h2><div class="file-row"><strong>活動成果報告</strong><span>缺件</span><span>社團活動</span><button class="btn secondary" data-go="generate">建立</button></div><div class="file-row"><strong>經費收支表</strong><span>待補</span><span>財務</span><button class="btn secondary" data-go="templates">下載</button></div><div class="file-row"><strong>會議紀錄</strong><span>完成</span><span>行政</span><button class="btn secondary" data-go="files">查看</button></div></section><section class="card"><h2>準備建議</h2><p class="muted">先補活動成果、財務表格與會議資料，可快速提升評鑑完整度。</p></section></div>`);
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.go)));
}

function renderSettings(){
  pageWrap(`<section class="card"><h2>社團設定</h2><div class="form-grid"><div class="field"><label>社團名稱</label><input value="ODFlow 示範社團"></div><div class="field"><label>學年度</label><input value="114"></div><div class="field"><label>校區</label><input value="天母校區"></div><div class="field"><label>輸出格式</label><input value="ODT / ODS"></div></div></section>`);
}

function render(){
  if(currentPage==="dashboard") return renderDashboard();
  if(currentPage==="templates") return renderTemplates();
  if(currentPage==="generate") return renderGenerate();
  if(currentPage==="files") return renderFiles();
  if(currentPage==="evaluation") return renderEvaluation();
  if(currentPage==="settings") return renderSettings();
  return renderHome();
}

setPage(currentPage);
