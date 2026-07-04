# ODFlow Pro Static Web Demo v5

這是一個可以部署到 GitHub Pages / Cloudflare Pages 的 ODFlow Pro 靜態展示版。

## v5 更新

- 首頁 hero 數據卡改為三張橫向等寬卡片。
- 移除首頁的「ODF 格式」數據卡。
- 移除社團評鑑準備度裡的「原專案 ODF」卡片。
- 儀表板改成更接近 Streamlit 版本的資訊架構：
  - 4 張 KPI 卡
  - 專案進度總覽
  - 缺件 / 待補清單
  - 最近文件
  - 工作提醒
  - 快捷操作
  - 本週摘要
- 左側欄加入工作台、文件製作、評鑑管理、社團資料分組，保留目前較清爽的 v4 視覺。
- `assets/data.js` 改為讀入 22 個原專案範本定義，其中 12 個目前有實際 ODT / ODS 下載檔。

## 目前可吃到多少空白檔案？

目前這個靜態網站包裡實際有檔案的空白 ODT / ODS 是 12 個：

- 6 個 ODT
- 6 個 ODS

同時，網站已把原本 SA_ODFlow 範本登錄裡的 22 個範本名稱放進 `assets/data.js`，但其中 10 個目前沒有實際空白下載檔，因此會顯示為尚未開放。

## 為什麼不能直接吃 Streamlit 的全部資料？

GitHub Pages 是靜態網站，沒有 Python runtime，不能直接讀 Streamlit app 的 database、session state 或本機 `data/` 資料夾。

如果要完全同步 Streamlit 的真實資料，有兩個做法：

1. 從 Streamlit/SA_ODFlow repo 匯出一份 JSON manifest，放到這個 GitHub Pages repo。
2. 做 FastAPI 後端，讓靜態前端呼叫 API 讀取真實資料與產生文件。

## 部署到既有 GitHub Pages repo

```bash
cd "$HOME/Downloads"
unzip -o ODFlow_static_github_pages_v5.zip
cd "$HOME/Downloads/odflow_static_pages"

git status
git add .
git commit -m "Polish ODFlow static dashboard v5"
git push origin main
```

網站網址：

```text
https://yiyu0501.github.io/odflow-web-demo/
```
