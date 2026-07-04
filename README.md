# ODFlow Pro Static Web Demo v4

這是一個可以部署到 GitHub Pages / Cloudflare Pages 的 ODFlow Pro 靜態展示版。

## v4 更新

- 右上角改成「社團平建 / 114 學年度 / 鈴鐺 / 使用者頭像」
- 使用者頭像顯示「簡廷宇」
- 左下角作者標記改成小字灰色單行：© 2026 ODFlow by 簡廷宇（Eric）
- 修正「社團評鑑」文字
- 首頁 hero 重新調整，文件圖往上，四個數據卡改成 2x2，避免文字擠成直排
- 數據持續依本頁 localStorage、範本清單即時計算
- 新增對原始 SA_ODFlow 公開 repo 的 ODF 檔案偵測：
  - 透過 GitHub public API 讀取 `yiyu0501/SA_ODFlow` 的檔案樹
  - 顯示原專案偵測到的 ODT / ODS 數量
  - 若 GitHub API 失敗，會顯示「讀取失敗」

## 數據說明

GitHub Pages 是靜態網站，不能直接讀取 Streamlit runtime 的資料庫或本機資料。  
這版可讀取的真實資料來源有三種：

1. 本頁內建的 `assets/data.js` 範本清單
2. 使用者在本頁建立文件後存入瀏覽器 localStorage 的資料
3. 公開 GitHub repo `yiyu0501/SA_ODFlow` 的檔案樹偵測結果

如果要完全同步 Streamlit 的資料庫，下一階段需要 FastAPI 後端或輸出一份 JSON manifest。

## 部署到既有 GitHub Pages repo

```bash
cd "$HOME/Downloads"
unzip -o ODFlow_static_github_pages_v4.zip
cd "$HOME/Downloads/odflow_static_pages"

git status
git add .
git commit -m "Polish ODFlow static web demo v4"
git push origin main
```

網站網址：

```text
https://yiyu0501.github.io/odflow-web-demo/
```
