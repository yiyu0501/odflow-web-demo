# ODFlow Pro Static Web Demo v3

這是一個可以直接部署到 GitHub Pages / Cloudflare Pages 的 ODFlow Pro 靜態展示版。

## v3 更新

- 作者資訊修正為：簡廷宇（Eric）
- 移除固定死的 72%、18 份文件等展示數字
- 首頁、儀表板、社團評鑑、社團資料改成依目前資料即時計算
- 可下載範本數量由 `assets/data.js` 的實際範本資料計算
- 已建立文件會儲存在瀏覽器 localStorage
- 點擊範本下載會留下下載紀錄
- 社團評鑑進度依已建立文件與下載紀錄計算，初始狀態為 0%

## 部署到既有 GitHub Pages repo

```bash
cd "$HOME/Downloads"
unzip -o ODFlow_static_github_pages_v3.zip
cd "$HOME/Downloads/odflow_static_pages"

git status
git add .
git commit -m "Use real local data for ODFlow demo"
git push origin main
```

網站網址：

```text
https://yiyu0501.github.io/odflow-web-demo/
```
