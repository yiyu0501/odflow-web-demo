const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

const templates = window.ODFLOW_TEMPLATES || [];
const generateTemplates = window.ODFLOW_GENERATE_TEMPLATES || [];
const schemas = window.ODFLOW_DOC_SCHEMAS || {};
const app = $("#app");
const pageTitle = $("#pageTitle");
const utilitySection = $("#utilitySection");
const utilityHint = $("#utilityHint");

const pageMeta = {
  home: ["首頁", "Workbench", "一站式社團文件管理站"],
  dashboard: ["儀表板", "Dashboard", "依目前網站資料即時統計"],
  templates: ["空白範本", "Template Center", "下載正式 ODT / ODS 空白範本"],
  generate: ["生成文件", "Generate", "依範本欄位填寫並即時預覽"],
  files: ["檔案庫", "Files", "整理已建立文件與範本下載紀錄"],
  evaluation: ["社團評鑑", "Evaluation", "依目前文件狀態計算準備度"],
  settings: ["社團資料", "Club Profile", "設定社團標籤與作品資訊"],
};

const STORAGE_KEYS = {
  docs: "odflow_generated_documents_v4",
  downloads: "odflow_template_downloads_v4"
};

const REMOTE_REPO = "yiyu0501/SA_ODFlow";
let remoteRepoStats = null;
let remoteRepoLoaded = false;

const evaluationRequirements = [
  { key: "activity_result_report", label: "活動成果報告", category: "社團活動", matchDoc: ["活動成果報告"], matchTemplate: ["activity_result_report"] },
  { key: "income_expense_statement", label: "經費收支表", category: "財務", matchDoc: ["經費收支表", "收支"], matchTemplate: ["income_expense_statement"] },
  { key: "meeting_minutes", label: "會議紀錄", category: "行政", matchDoc: ["會議紀錄"], matchTemplate: ["meeting_minutes"] }
];


async function syncRemoteRepoStats(){
  try{
    const res = await fetch(`https://api.github.com/repos/${REMOTE_REPO}/git/trees/main?recursive=1`, {
      headers: { "Accept": "application/vnd.github+json" }
    });
    if(!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    const paths = (data.tree || []).filter(item => item.type === "blob").map(item => item.path);
    const odfFiles = paths.filter(path => /\.(odt|ods)$/i.test(path));
    const generatedFiles = odfFiles.filter(path => /(^|\/)(data\/generated|generated|documents|outputs|downloads)\//i.test(path));
    const templateLikeFiles = odfFiles.filter(path => /(template|blank|範本|downloads)/i.test(path));
    remoteRepoStats = {
      fileCount: paths.length,
      odfFiles: odfFiles.length,
      generatedFiles: generatedFiles.length,
      templateLikeFiles: templateLikeFiles.length,
      checkedAt: new Date().toISOString()
    };
  }catch(err){
    remoteRepoStats = {error: String(err && err.message ? err.message : err), checkedAt: new Date().toISOString()};
  }finally{
    remoteRepoLoaded = true;
    refreshSidebarMeta();
    if(typeof render === "function") render();
  }
}

function remoteNumber(key, fallback){
  if(remoteRepoStats && typeof remoteRepoStats[key] === "number") return remoteRepoStats[key];
  return fallback;
}

let currentPage = location.hash.replace("#","") || "home";
let currentGenerate = generateTemplates[0] || {schema:"活動企劃書", name:"活動企劃書"};

function readJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function getDocs(){ return readJson(STORAGE_KEYS.docs, []); }
function setDocs(docs){ writeJson(STORAGE_KEYS.docs, docs); }
function getDownloadHistory(){ return readJson(STORAGE_KEYS.downloads, []); }
function setDownloadHistory(rows){ writeJson(STORAGE_KEYS.downloads, rows); }

function recordTemplateDownload(templateId){
  const template = templates.find(t => t.id === templateId);
  if(!template) return;
  const rows = getDownloadHistory();
  rows.unshift({
    id: `${templateId}-${Date.now()}`,
    templateId,
    name: template.name,
    fmt: template.fmt,
    category: template.category,
    recordedAt: new Date().toISOString()
  });
  setDownloadHistory(rows.slice(0, 80));
  refreshSidebarMeta();
}

function saveGeneratedDocument(data){
  const docs = getDocs();
  const title = data.content.activity_name || data.content.meeting_title || data.content.club_name || data.template || "未命名文件";
  const row = {
    id: `doc-${Date.now()}`,
    title,
    template: data.template,
    schema: data.schema,
    fmt: "ODT",
    status: "草稿",
    category: categoryForSchema(data.schema),
    createdAt: new Date().toISOString(),
    content: data.content
  };
  docs.unshift(row);
  setDocs(docs.slice(0, 80));
  refreshSidebarMeta();
  return row;
}

function categoryForSchema(schema){
  if((schema || "").includes("成果")) return "社團活動";
  if((schema || "").includes("年度")) return "管理運作";
  if((schema || "").includes("會議")) return "行政";
  return "社團活動";
}

function computeEvaluation(){
  const docs = getDocs();
  const downloads = getDownloadHistory();
  const items = evaluationRequirements.map(req => {
    const hasDoc = docs.some(doc => req.matchDoc.some(term => `${doc.title} ${doc.template} ${doc.schema}`.includes(term)));
    const hasTemplate = downloads.some(row => req.matchTemplate.includes(row.templateId));
    const done = hasDoc || hasTemplate;
    return {...req, done, status: done ? "完成" : "缺件"};
  });
  const completed = items.filter(i => i.done).length;
  const total = items.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return {items, completed, total, percent, missing: total - completed};
}

function getStats(){
  const docs = getDocs();
  const downloads = getDownloadHistory();
  const downloadable = templates.filter(t => !!t.file);
  const odfTemplates = templates.filter(t => ["ODT","ODS"].includes(t.fmt));
  const evalState = computeEvaluation();
  const remoteOdfFiles = remoteNumber("odfFiles", null);
  const remoteGeneratedFiles = remoteNumber("generatedFiles", null);
  const remoteTemplateLikeFiles = remoteNumber("templateLikeFiles", null);
  return {
    docs: docs.length,
    downloads: downloads.length,
    templates: templates.length,
    downloadable: downloadable.length,
    generatedTypes: generateTemplates.length,
    odfPercent: templates.length ? Math.round((odfTemplates.length / templates.length) * 100) : 0,
    evalPercent: evalState.percent,
    evalMissing: evalState.missing,
    evalCompleted: evalState.completed,
    evalTotal: evalState.total,
    remoteLoaded: remoteRepoLoaded,
    remoteError: remoteRepoStats && remoteRepoStats.error,
    remoteOdfFiles,
    remoteGeneratedFiles,
    remoteTemplateLikeFiles
  };
}

function refreshSidebarMeta(){
  const stats = getStats();
  const meta = $(".club-meta");
  if(meta){
    meta.innerHTML = `<span>文件 ${stats.docs}</span><span>範本 ${stats.downloadable}</span><span>評鑑 ${stats.evalPercent}%</span>`;
  }
}

function setPage(page){
  currentPage = page || "home";
  location.hash = currentPage;
  const meta = pageMeta[currentPage] || pageMeta.home;
  $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === currentPage));
  pageTitle.textContent = meta[0];
  utilitySection.textContent = meta[1];
  utilityHint.textContent = meta[2];
  refreshSidebarMeta();
  render();
}

$$(".nav-item").forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));
window.addEventListener("hashchange", () => setPage(location.hash.replace("#","") || "home"));

function pageWrap(html){
  app.innerHTML = html;
  app.classList.remove("content");
  void app.offsetWidth;
  app.classList.add("content");
}

function downloadJson(filename, data){
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function action(icon,title,desc,page){
  return `
    <section class="card action-card home-bottom-card">
      <div>
        <div class="action-head"><div class="icon">${icon}</div><h3>${title}</h3></div>
        <p class="muted">${desc}</p>
      </div>
      <button class="btn secondary" data-go="${page}">前往 <span>→</span></button>
    </section>`;
}

function kpi(title,value,sub){
  return `<section class="card kpi"><div class="label">${title}</div><strong>${value}</strong><p class="muted">${sub}</p></section>`;
}

function smallKpi(label, value, tone="red"){
  return `<div class="mini-stat"><span class="mini-dot" style="background:${tone === "blue" ? "#60a5fa" : tone === "orange" ? "#f59e0b" : "#ff6b6b"}"></span><div class="mini-label">${label}</div><strong>${value} 份</strong></div>`;
}

function emptyBlock(icon,title,desc,button,page){
  return `<div class="dash-empty"><div><div class="empty-icon">${icon}</div><h3>${title}</h3><p class="muted">${desc}</p><button class="btn secondary" data-go="${page}">${button} →</button></div></div>`;
}

function renderHome(){
  const stats = getStats();
  pageWrap(`
    <div class="grid two">
      <section class="card hero">
        <div class="hero-illus">📁</div>
        <div>
          <div class="kicker">台灣學生社團 ODF 文件工作台</div>
          <h1>一站式社團<br>文件管理站</h1>
          <p class="lead">空白範本、文件填寫、預覽確認與評鑑整理集中在同一個工作台，讓社團行政不再散落各處。</p>
          <div class="stat-row hero-metrics">
            <div class="stat"><span>📄</span><div><strong>${stats.downloadable}</strong><span>可下載範本</span></div></div>
            <div class="stat"><span>📝</span><div><strong>${stats.docs}</strong><span>已建立文件</span></div></div>
            <div class="stat"><span>📦</span><div><strong>${stats.evalPercent}%</strong><span>評鑑進度</span></div></div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="kicker">依目前網站資料即時更新</div>
        <h2 style="font-size:34px;margin:10px 0 22px">社團評鑑準備度</h2>
        <div class="assessment-card">
          <div class="ring" style="--pct:${stats.evalPercent}"><div class="ring-inner"><div><strong>${stats.evalPercent}%</strong><span>準備度</span></div></div></div>
          <div class="assessment-list">
            <div class="assessment-item"><div>⚠️ 待補佐證</div><span>${stats.evalMissing} 份</span></div>
            <div class="assessment-item"><div>✅ 已完成項目</div><span>${stats.evalCompleted} / ${stats.evalTotal}</span></div>
            <div class="assessment-item"><div>📄 目前文件</div><span>${stats.docs} 份</span></div>
            <button class="btn coral" data-go="evaluation">前往社團評鑑 →</button>
          </div>
        </div>
      </section>
    </div>

    <h2 class="section-title">快速開始</h2>
    <div class="grid three">
      ${action("📄","下載空白範本","下載 ODT / ODS 空白範本，直接開始整理正式文件。","templates")}
      ${action("📝","建立正式文件","依不同文件欄位填寫資料，儲存後會進入檔案庫。","generate")}
      ${action("📦","整理社團評鑑","檢查目前文件與下載紀錄，掌握補件進度。","evaluation")}
    </div>`);
  bindGoButtons();
}

function renderDashboard(){
  const stats = getStats();
  const evalState = computeEvaluation();
  const docs = getDocs();
  const recentDocs = docs.slice(0, 3);
  const reminders = evalState.items.filter(item => !item.done);
  pageWrap(`
    <div class="grid four">
      ${kpi("目前專案","0 個","依現有文件統計")}
      ${kpi("本週新增文件",stats.docs,"目前資料庫文件數")}
      ${kpi("待補文件",stats.evalMissing,"依評鑑缺件統計")}
      ${kpi("未歸檔檔案",docs.filter(d => !d.category).length,"草稿或待確認文件")}
    </div>

    <div class="grid two" style="margin-top:20px">
      <section class="card" style="min-height:330px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <h2>專案進度總覽</h2><span class="tag">目前資料</span>
        </div>
        ${docs.length ? docs.slice(0,4).map((doc,idx)=>`<div class="progress-row"><div class="progress-head"><span>${escapeHtml(doc.title)}</span><small>${doc.status || "草稿"}</small></div><div class="progress-bar"><i style="--value:${Math.min(100,35+idx*15)}%"></i></div></div>`).join("") : emptyBlock("📫","目前尚無專案","建立文件並歸入專案後，這裡會顯示進度。","建立文件","generate")}
      </section>

      <section class="card" style="min-height:330px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <h2>缺件 / 待補清單</h2><button class="btn secondary" data-go="evaluation" style="height:36px">查看全部</button>
        </div>
        <div class="mini-stat-grid">
          ${smallKpi("核心文件缺", stats.evalMissing, "red")}
          ${smallKpi("待審", 0, "orange")}
          ${smallKpi("草稿", docs.length, "orange")}
          ${smallKpi("已完成", evalState.completed, "blue")}
        </div>
        <h3 style="margin-top:20px">最緊急待補文件</h3>
        ${reminders.length ? reminders.slice(0,4).map(item=>`<div class="reminder-row"><span class="reminder-dot"></span><div><strong>${item.label}</strong><small>${item.category}</small></div><span class="status-red">待補</span></div>`).join("") : `<p class="muted">目前沒有待補項目。</p>`}
        <button class="btn secondary" data-go="evaluation" style="margin-top:14px;width:100%">查看完整待補清單 →</button>
      </section>
    </div>

    <div class="grid three" style="margin-top:20px">
      <section class="card" style="min-height:300px">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2>最近文件</h2><button class="btn secondary" data-go="files" style="height:36px">查看全部</button></div>
        ${recentDocs.length ? recentDocs.map(doc=>`<div class="file-row"><strong>${escapeHtml(doc.title)}</strong><span>${doc.fmt}</span><span>${doc.category}</span><button class="btn secondary" data-go="files">查看</button></div>`).join("") : emptyBlock("📫","目前尚無文件","建立第一份文件後，最近文件會顯示在這裡。","建立文件","generate")}
      </section>

      <section class="card" style="min-height:300px"><h2>工作提醒</h2>
        ${reminders.length ? reminders.concat(evalState.items).slice(0,4).map(item=>`<div class="reminder-row"><span class="reminder-dot"></span><div><strong>${item.label}</strong><small>社團評鑑</small></div><span class="status-red">${item.done ? "完成" : "待補"}</span></div>`).join("") : `<p class="muted">目前沒有提醒。</p>`}
      </section>

      <section class="card" style="min-height:300px"><h2>快捷操作</h2>
        <div class="quick-list">
          <button class="quick-link" data-go="templates"><span>📄 下載範本</span><span>›</span></button>
          <button class="quick-link" data-go="generate"><span>📝 建立文件</span><span>›</span></button>
          <button class="quick-link" data-go="files"><span>🗂️ 查看檔案庫</span><span>›</span></button>
          <button class="quick-link" data-go="settings"><span>⚙️ 社團設定</span><span>›</span></button>
        </div>
        <div class="card summary-card" style="margin-top:18px;box-shadow:none;display:flex;align-items:center">
          <span class="summary-check">✓</span><p class="muted"><strong>本週摘要</strong><br>目前資料庫共有 ${stats.docs} 份文件，草稿 ${docs.length} 份，待補 ${stats.evalMissing} 份。</p>
        </div>
      </section>
    </div>`);
  bindGoButtons();
}

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
    const rows = templates.filter(t =>
      (!q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) &&
      (!fmt || t.fmt===fmt) &&
      (!cat || t.category===cat)
    );
    $("#templateGrid").innerHTML = rows.map(t=>`
      <section class="card template-card">
        <div class="doc-thumb" data-fmt="${t.fmt}"></div>
        <div>
          <span class="tag">${t.category}</span>
          <h3>${t.name}</h3>
          <p class="muted">${t.desc}</p>
          ${t.file ? `<a class="btn template-download" data-template-id="${t.id}" href="${t.file}" download>下載 ${t.fmt}</a>` : `<button class="btn secondary" disabled>尚未開放</button>`}
        </div>
      </section>`).join("");
    $$(".template-download").forEach(a => a.addEventListener("click", () => recordTemplateDownload(a.dataset.templateId)));
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
        <p class="muted">填寫後可儲存到檔案庫，首頁與評鑑進度會同步更新。</p>
        <div class="field"><label>文件範本</label><select id="genTemplate">${options}</select></div>
        <form id="genForm" class="form-grid" style="margin-top:16px"></form>
      </section>
      <section class="card">
        <h2>即時預覽</h2>
        <div id="preview" class="preview-paper"></div>
        <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
          <button class="btn" id="saveDoc">儲存到檔案庫</button>
          <button class="btn secondary" id="downloadData">下載填寫資料 JSON</button>
          <button class="btn secondary" id="goTemplateDownload">下載空白範本</button>
        </div>
        <p id="saveNotice" class="muted" style="margin-top:12px"></p>
      </section>
    </div>`);
  $("#genTemplate").addEventListener("change", e => { currentGenerate = generateTemplates[+e.target.value]; drawForm(); });
  $("#downloadData").addEventListener("click", () => downloadJson("odflow-document-data.json", collectForm()));
  $("#goTemplateDownload").addEventListener("click", () => setPage("templates"));
  $("#saveDoc").addEventListener("click", () => {
    const row = saveGeneratedDocument(collectForm());
    $("#saveNotice").textContent = `已儲存「${row.title}」到檔案庫。`;
    updatePreview();
  });
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
  const rows = Object.entries(data.content).map(([k,v]) => `<tr><td>${labelFor(k)}</td><td>${escapeHtml(v || "—").replace(/\n/g,"<br>")}</td></tr>`).join("");
  $("#preview").innerHTML = `<h2>${escapeHtml(data.content.activity_name || data.content.meeting_title || data.content.club_name || data.template)}</h2><table>${rows}</table><p class="muted">此頁目前會把資料儲存在瀏覽器 localStorage；下一階段可接 FastAPI 產生正式 ODT/ODS。</p>`;
}

function labelFor(key){
  const schema = schemas[currentGenerate.schema] || {};
  const field = (schema.fields || []).find(f => f[0]===key);
  return field ? field[1] : key;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function renderFiles(){
  const docs = getDocs();
  const downloads = getDownloadHistory();
  pageWrap(`
    <div class="grid two">
      <section class="card"><h2>已建立文件</h2>
        ${docs.length ? docs.map(doc=>`<div class="file-row"><strong>${escapeHtml(doc.title)}</strong><span>${doc.fmt}</span><span>${doc.category}</span><button class="btn secondary" data-doc-json="${doc.id}">JSON</button></div>`).join("") : `<p class="muted">目前尚未建立文件。到「生成文件」儲存後，會出現在這裡。</p>`}
      </section>
      <section class="card"><h2>範本下載紀錄</h2>
        ${downloads.length ? downloads.slice(0,10).map(row=>`<div class="file-row"><strong>${escapeHtml(row.name)}</strong><span>${row.fmt}</span><span>${row.category}</span><span class="muted">${formatDate(row.recordedAt)}</span></div>`).join("") : `<p class="muted">目前尚無下載紀錄。點擊空白範本下載後，會自動記錄。</p>`}
      </section>
    </div>
    <section class="card" style="margin-top:20px"><h2>全部可下載範本</h2>${templates.map(t=>`<div class="file-row"><strong>${t.name}</strong><span>${t.fmt}</span><span>${t.category}</span>${t.file ? `<a class="btn secondary template-download" data-template-id="${t.id}" href="${t.file}" download>下載</a>` : `<span>—</span>`}</div>`).join("")}</section>`);
  $$(".template-download").forEach(a => a.addEventListener("click", () => recordTemplateDownload(a.dataset.templateId)));
  $$("[data-doc-json]").forEach(btn => btn.addEventListener("click", () => {
    const doc = getDocs().find(d => d.id === btn.dataset.docJson);
    if(doc) downloadJson(`${doc.title || "odflow-document"}.json`, doc);
  }));
}

function renderEvaluation(){
  const evalState = computeEvaluation();
  pageWrap(`
    <div class="grid two">
      <section class="card"><h2>社團評鑑缺件</h2>
        ${evalState.items.map(item => `<div class="file-row"><strong>${item.label}</strong><span>${item.status}</span><span>${item.category}</span><button class="btn secondary" data-go="${item.done ? "files" : (item.key==="income_expense_statement" ? "templates" : "generate")}">${item.done ? "查看" : (item.key==="income_expense_statement" ? "下載" : "建立")}</button></div>`).join("")}
      </section>
      <section class="card"><h2>準備建議</h2>
        <div class="assessment-card" style="grid-template-columns:132px 1fr">
          <div class="ring" style="--pct:${evalState.percent}"><div class="ring-inner"><div><strong>${evalState.percent}%</strong><span>準備度</span></div></div></div>
          <p class="muted">目前完成 ${evalState.completed} / ${evalState.total} 項。系統依「已建立文件」與「範本下載紀錄」計算，不使用固定展示數字。</p>
        </div>
        <div class="assessment-list" style="margin-top:18px">
          <div class="assessment-item"><div>優先順序</div><span>成果 → 財務 → 行政</span></div>
          <div class="assessment-item"><div>資料來源</div><span>本頁資料 / 原 repo 偵測</span></div>
        </div>
      </section>
    </div>`);
  bindGoButtons();
}

function renderSettings(){
  const stats = getStats();
  pageWrap(`
    <section class="card">
      <h2>社團標籤</h2>
      <p class="muted">這裡展示目前網站所屬社團、年度與作者資訊。統計數字由目前資料即時產生。</p>
      <div class="form-grid" style="margin-top:20px">
        <div class="field"><label>社團名稱</label><input value="四團平建"></div>
        <div class="field"><label>學年度</label><input value="114"></div>
        <div class="field"><label>校區</label><input value="天母校區"></div>
        <div class="field"><label>輸出格式</label><input value="ODT / ODS"></div>
        <div class="field"><label>作品名稱</label><input value="ODFlow Pro"></div>
        <div class="field"><label>製作者</label><input value="簡廷宇（Eric） © 2026"></div>
      </div>
      <div class="grid four" style="margin-top:22px">
        ${kpi("本頁文件",stats.docs,"已建立")}
        ${kpi("範本下載",stats.downloads,"次")}
        ${kpi("可下載範本",stats.downloadable,"份")}
        ${kpi("原專案 ODF",stats.remoteLoaded ? (stats.remoteError ? "—" : stats.remoteOdfFiles) : "…","GitHub 偵測")}
      </div>
      <button class="btn secondary" id="clearData" style="margin-top:18px">清除本機展示資料</button>
    </section>`);
  $("#clearData").addEventListener("click", () => {
    if(confirm("確定清除已建立文件與下載紀錄？")){
      localStorage.removeItem(STORAGE_KEYS.docs);
      localStorage.removeItem(STORAGE_KEYS.downloads);
      refreshSidebarMeta();
      renderSettings();
    }
  });
}

function formatDate(iso){
  if(!iso) return "—";
  const d = new Date(iso);
  if(Number.isNaN(d.getTime())) return "—";
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function bindGoButtons(){
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.go)));
}

function render(){
  refreshSidebarMeta();
  if(currentPage==="dashboard") return renderDashboard();
  if(currentPage==="templates") return renderTemplates();
  if(currentPage==="generate") return renderGenerate();
  if(currentPage==="files") return renderFiles();
  if(currentPage==="evaluation") return renderEvaluation();
  if(currentPage==="settings") return renderSettings();
  return renderHome();
}

setPage(currentPage);
syncRemoteRepoStats();
