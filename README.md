# ODFlow Static Web Demo

這是一個可以直接部署到 GitHub Pages / Cloudflare Pages 的 ODFlow 靜態展示版。

## 功能

- 首頁
- 儀表板
- 空白範本中心
- 生成文件表單與即時預覽
- 檔案庫
- 社團評鑑
- 社團設定
- 預先放入可下載的 ODT / ODS 範本檔案

## 部署到 GitHub Pages

1. 建立新的 GitHub repo，例如 `odflow-web-demo`
2. 把本資料夾全部檔案上傳到 repo 根目錄
3. 到 repo 的 Settings → Pages
4. Source 選 `Deploy from a branch`
5. Branch 選 `main`，資料夾選 `/root`
6. 等待 GitHub Pages 完成部署
7. 連結會是：

```text
https://你的帳號.github.io/odflow-web-demo/
```

## 部署到 Cloudflare Pages

1. 到 Cloudflare Dashboard → Workers & Pages
2. Create application → Pages
3. Connect to GitHub
4. 選擇這個 repo
5. Framework preset 選 `None`
6. Build command 留空
7. Build output directory 留空或填 `/`
8. Deploy

## 注意

這是靜態前端展示版，不依賴 Streamlit。  
正式 ODT / ODS 動態生成可以在下一階段接 FastAPI 後端。
