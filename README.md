<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smart Health Coach (智慧健康教練)

這是一個 React 專案，旨在協助教育人員進行健康管理。

[View in AI Studio](https://ai.studio/apps/drive/1-0LZSxygmMOOsKv4Xba3uvpVTblZVYRN)

## 📦 專案設定 (Project Setup)

### 前置需求 (Prerequisites)
- [Node.js](https://nodejs.org/) (建議 v20 或以上)

### 安裝 (Installation)
1. 複製專案到本地
   ```bash
   git clone <repo-url>
   cd health_helper
   ```
2. 安裝套件
   ```bash
   npm install
   ```
   > 備註：此步驟會根據 `package.json` 安裝所有必要的依賴套件。

## 🚀 開發與指令 (Development)

- **啟動開發伺服器**：
  ```bash
  npm run dev
  ```
  啟動後可於瀏覽器預覽應用程式。

- **建立生產版本**：
  ```bash
  npm run build
  ```
  此指令會將應用程式打包至 `dist/` 資料夾。

- **預覽生產版本**：
  ```bash
  npm run preview
  ```

## ⚙️ 部署 (Deployment)

本專案已設定 GitHub Actions 自動部署至 GitHub Pages。

### 流程
1. 將程式碼 Push 到 GitHub 的 `main` 分支。
2. GitHub Action (`.github/workflows/deploy.yml`) 會自動觸發：
   - 安裝依賴
   - 執行 `npm run build` 打包
   - 將 `dist/` 資料夾部署至 `gh-pages` 分支
3. 部署完成後，可於 GitHub Pages URL 存取網站。

> 注意：
> 1. 請確保 GitHub Repository Settings > Pages > Source 設為 `GitHub Actions`。
> 2. `vite.config.ts` 已設定 `base: './'` 以支援相對路徑部署。

## 🛡️ 檔案忽略 (.gitignore)

為了保護隱私與維持專案整潔，以下檔案已被設定忽略，不會上傳至 Git：
- `node_modules/` (依賴套件)
- `dist/` (打包產物)
- `.env`, `.env.*` (環境變數與金鑰)
- `.vscode/` (編輯器設定)
- Log files (`*.log`)

---
Designed by React Engineer
