# 💣 Boom Animation

<div align="center">

### 🌐 Choose Language / 言語を選択 / 选择语言

[🇨🇳 简体中文](#简体中文) | [🇬🇧 English](#english) | [🇯🇵 日本語](#日本語)

---

</div>

---

# 简体中文

一个基于 Three.js 的交互式 3D 炸弹动画应用。用户可以与炸弹交互，观看引信燃烧动画，最后触发爆炸效果。

## 📋 项目概述

这个项目使用 **Express.js** 和 **Three.js** 创建了一个沉浸式的 3D 爆炸动画体验。应用渲染了一个逼真的 3D 炸弹，具有动态照明、引信燃烧效果和视觉爆炸反馈。

## 🚀 快速开始

### 前置要求
- Node.js（版本 14+）
- npm

### 安装

1. 克隆或下载项目文件夹
2. 进入项目目录：
   ```bash
   cd boom_animation
   ```
3. 安装依赖：
   ```bash
   npm install
   ```

### 运行服务器

```bash
npm start
```

服务器将启动在 `http://localhost:8000`（如果端口被占用，会自动递增端口号）

在浏览器中打开该地址即可看到 3D 炸弹动画。

## 📁 项目结构

```
boom_animation/
├── package.json          # 项目配置和依赖
├── server.js             # Express.js 服务器
├── README.md             # 项目说明文档
└── public/
    ├── index.html        # 主 HTML 页面
    ├── main.js           # Three.js 动画逻辑（主要代码）
    ├── styles.css        # 样式表和 UI 动画
    └── sfx/
        └── boom.mp3      # 爆炸音效
```

## 🛠️ 技术栈

- **后端**：Express.js 4.19.2（Web 服务器）
- **前端**：Three.js 0.160.0（3D 图形库）
- **标记**：HTML5
- **样式**：CSS3
- **音频**：MP3 格式音效

## ✨ 功能特性

### 3D 渲染
- 完整的 Three.js 3D 场景
- 高质量的灯光系统：
  - 环境光（Ambient Light）
  - 关键光（Key Light）
  - 边缘光（Rim Light）
- 反射和材质效果

### 动画元素
- 炸弹本体和金属领环
- 动态的引信路径和燃烧动画
- 爆炸粒子效果
- "BOOM" 文本动画（带发光效果）

### 交互功能
- **鼠标交互**：拖拽炸弹旋转视角
- **点击触发**：激活爆炸动画
- **用户反馈**：
  - 引信燃烧提示文本
  - 音频反馈（爆炸音效）
  - 视觉反馈（BOOM 文字显示、场景闪光）

### UI 设计
- 响应式全屏 Canvas
- 低 opacity 提示文本在左下角
- 居中的 "BOOM" 文本动画（仅在爆炸时显示）
- 白色背景，深色主体，橙色强调色

## 🎮 使用说明

1. 打开应用后，会看到一个 3D 炸弹
2. 左下角会显示 "Bomb fuse burning..." 的提示
3. 可以使用鼠标**拖拽**炸弹来改变视角
4. **点击炸弹**会触发爆炸动画：
   - "BOOM" 文字会以发光效果显示在屏幕中央
   - 爆炸音效（boom.mp3）会播放
   - 场景会短暂闪白
   - 爆炸粒子会扩散

## 📝 主要代码说明

### main.js（主要逻辑）
- Three.js 场景初始化和渲染循环
- 炸弹 3D 模型构建（球体主体、圆柱体领环、管状引信）
- 引信燃烧效果的实现
- 鼠标交互处理（拖拽、点击）
- 爆炸粒子系统和动画
- 音频播放控制

### styles.css（样式和动画）
- 全屏 Canvas 布局
- BOOM 文字的发光文本阴影效果
- 过渡动画（缩放和透明度）
- 响应式字体大小

### server.js（服务器配置）
- 静态文件服务
- Three.js 库的 `/vendor` 路由映射
- 自动端口递增机制（避免端口冲突）

## 🔧 自定义配置

### 修改端口
在环境变量中设置 `PORT`：
```bash
PORT=3000 npm start
```

### 调整 3D 设置
在 `main.js` 中修改：
- `camera.position`：摄像机位置
- 灯光强度和颜色
- 炸弹大小（Geometry 半径）
- 雾化效果（`scene.fog`）

### 更改音效
将 `public/sfx/boom.mp3` 替换为其他 MP3 文件即可

## 📦 依赖说明

- **express**：用于创建 HTTP 服务器和提供静态文件
- **three**：用于 3D 模型、场景、相机和渲染

## 🎯 浏览器兼容性

需要支持以下特性的现代浏览器：
- WebGL（3D 绘图）
- ES6 模块
- Web Audio API（音频播放）

推荐使用：
- Chrome/Edge （最新版本）
- Firefox （最新版本）
- Safari （14+）

## 💡 可能的改进方向

- 添加更多交互模式（键盘控制）
- 实现 360° 摄像机旋转
- 加入音乐背景层
- 创建关卡系统
- 添加移动设备触摸支持
- 优化粒子性能

---

# English

An interactive 3D bomb animation application based on Three.js. Users can interact with the bomb, watch the fuse burn, and trigger the explosion effect.

## 📋 Project Overview

This project uses **Express.js** and **Three.js** to create an immersive 3D explosion animation experience. The application renders a realistic 3D bomb with dynamic lighting, fuse burning effects, and visual explosion feedback.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14+)
- npm

### Installation

1. Clone or download the project folder
2. Navigate to the project directory:
   ```bash
   cd boom_animation
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Run the Server

```bash
npm start
```

The server will start at `http://localhost:8000` (if the port is in use, it will auto-increment)

Open the address in your browser to see the 3D bomb animation.

## 📁 Project Structure

```
boom_animation/
├── package.json          # Project configuration and dependencies
├── server.js             # Express.js server
├── README.md             # Project documentation
└── public/
    ├── index.html        # Main HTML page
    ├── main.js           # Three.js animation logic (main code)
    ├── styles.css        # Styles and UI animations
    └── sfx/
        └── boom.mp3      # Explosion sound effect
```

## 🛠️ Tech Stack

- **Backend**: Express.js 4.19.2 (Web server)
- **Frontend**: Three.js 0.160.0 (3D graphics library)
- **Markup**: HTML5
- **Styling**: CSS3
- **Audio**: MP3 sound effect

## ✨ Features

### 3D Rendering
- Complete Three.js 3D scene
- High-quality lighting system:
  - Ambient Light
  - Key Light
  - Rim Light
- Reflection and material effects

### Animation Elements
- Bomb body and metal collar
- Dynamic fuse path and burning animation
- Explosion particle effects
- "BOOM" text animation (with glow effect)

### Interactive Features
- **Mouse Interaction**: Drag to rotate the bomb view
- **Click to Trigger**: Activate explosion animation
- **User Feedback**:
  - Fuse burning hint text
  - Audio feedback (explosion sound)
  - Visual feedback (BOOM text display, scene flash)

### UI Design
- Responsive full-screen Canvas
- Low opacity hint text in bottom-left corner
- Centered "BOOM" text animation (displayed only during explosion)
- White background, dark main color, orange accent

## 🎮 Usage

1. After opening the application, you'll see a 3D bomb
2. A hint "Bomb fuse burning..." appears in the bottom-left corner
3. Use your mouse to **drag** the bomb to change the viewing angle
4. **Click the bomb** to trigger the explosion animation:
   - The "BOOM" text appears in the center with a glow effect
   - Explosion sound (boom.mp3) plays
   - The scene briefly flashes white
   - Explosion particles scatter

## 📝 Code Explanation

### main.js (Main Logic)
- Three.js scene initialization and render loop
- Bomb 3D model construction (sphere body, cylinder collar, tube fuse)
- Fuse burning effect implementation
- Mouse interaction handling (drag and click)
- Explosion particle system and animation
- Audio playback control

### styles.css (Styling and Animation)
- Full-screen Canvas layout
- BOOM text glow text shadow effect
- Transition animations (scale and opacity)
- Responsive font size

### server.js (Server Configuration)
- Static file serving
- Three.js library `/vendor` route mapping
- Auto port increment mechanism (avoid port conflicts)

## 🔧 Customization

### Change Port
Set the `PORT` environment variable:
```bash
PORT=3000 npm start
```

### Adjust 3D Settings
In `main.js`, modify:
- `camera.position`: Camera position
- Light intensity and color
- Bomb size (Geometry radius)
- Fog effect (`scene.fog`)

### Change Sound Effect
Replace `public/sfx/boom.mp3` with another MP3 file

## 📦 Dependencies

- **express**: Create HTTP server and serve static files
- **three**: 3D models, scenes, cameras, and rendering

## 🎯 Browser Compatibility

Requires a modern browser supporting:
- WebGL (3D rendering)
- ES6 modules
- Web Audio API (audio playback)

Recommended:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (14+)

## 💡 Possible Improvements

- Add more interaction modes (keyboard control)
- Implement 360° camera rotation
- Add background music layer
- Create level system
- Add mobile touch support
- Optimize particle performance

---

# 日本語

Three.js ベースのインタラクティブな 3D 爆弾アニメーションアプリケーション。ユーザーは爆弾と対話でき、導火線が燃えるアニメーションを見たり、爆発効果をトリガーしたりできます。

## 📋 プロジェクト概要

このプロジェクトは **Express.js** と **Three.js** を使用して、没入感のある 3D 爆発アニメーション体験を作成します。アプリケーションは、動的な照明、導火線燃焼効果、および視覚的な爆発フィードバック付きの現実的な 3D 爆弾をレンダリングします。

## 🚀 クイックスタート

### 要件
- Node.js（バージョン 14+）
- npm

### インストール

1. プロジェクトフォルダをクローンまたはダウンロードします
2. プロジェクトディレクトリに移動します：
   ```bash
   cd boom_animation
   ```
3. 依存関係をインストールします：
   ```bash
   npm install
   ```

### サーバーの実行

```bash
npm start
```

サーバーは `http://localhost:8000` で起動します（ポートが使用中の場合は自動的に増分します）

ブラウザでアドレスを開くと、3D 爆弾アニメーションが表示されます。

## 📁 プロジェクト構造

```
boom_animation/
├── package.json          # プロジェクト設定と依存関係
├── server.js             # Express.js サーバー
├── README.md             # プロジェクトドキュメント
└── public/
    ├── index.html        # メイン HTML ページ
    ├── main.js           # Three.js アニメーションロジック（メインコード）
    ├── styles.css        # スタイルと UI アニメーション
    └── sfx/
        └── boom.mp3      # 爆発音効果
```

## 🛠️ 技術スタック

- **バックエンド**：Express.js 4.19.2（Web サーバー）
- **フロントエンド**：Three.js 0.160.0（3D グラフィックスライブラリ）
- **マークアップ**：HTML5
- **スタイリング**：CSS3
- **オーディオ**：MP3 サウンド効果

## ✨ 機能

### 3D レンダリング
- 完全な Three.js 3D シーン
- 高品質の照明システム：
  - アンビエントライト
  - キーライト
  - リムライト
- 反射とマテリアル効果

### アニメーション要素
- 爆弾本体と金属カラー
- ダイナミックな導火線パスと燃焼アニメーション
- 爆発パーティクル効果
- 「BOOM」テキストアニメーション（グロー効果付き）

### インタラクティブ機能
- **マウスインタラクション**：ドラッグして爆弾ビューを回転
- **クリックでトリガー**：爆発アニメーションをアクティブ化
- **ユーザーフィードバック**：
  - 導火線燃焼ヒントテキスト
  - オーディオフィードバック（爆発音）
  - ビジュアルフィードバック（BOOM テキスト表示、シーンフラッシュ）

### UI デザイン
- レスポンシブ全画面キャンバス
- 左下隅の低不透明度ヒントテキスト
- 中央の「BOOM」テキストアニメーション（爆発時のみ表示）
- 白背景、濃い主色、オレンジアクセント

## 🎮 使用方法

1. アプリケーションを開くと、3D 爆弾が表示されます
2. 左下隅に「Bomb fuse burning...」ヒントが表示されます
3. マウスを使用して爆弾を **ドラッグ** してビューアングルを変更します
4. **爆弾をクリック** して爆発アニメーションをトリガーします：
   - グロー効果を付けた「BOOM」テキストが画面中央に表示されます
   - 爆発音（boom.mp3）が再生されます
   - シーンが短時間白くフラッシュします
   - 爆発パーティクルが散乱します

## 📝 コード説明

### main.js（メインロジック）
- Three.js シーン初期化とレンダーループ
- 爆弾 3D モデル構築（球体本体、円筒形カラー、チューブ導火線）
- 導火線燃焼効果の実装
- マウスインタラクション処理（ドラッグとクリック）
- 爆発パーティクルシステムとアニメーション
- オーディオ再生制御

### styles.css（スタイリングとアニメーション）
- 全画面キャンバスレイアウト
- BOOM テキストグロー効果
- トランジションアニメーション（スケールと不透明度）
- レスポンシブフォントサイズ

### server.js（サーバー構成）
- 静的ファイルサービング
- Three.js ライブラリの `/vendor` ルートマップ
- 自動ポート増分メカニズム（ポート競合を回避）

## 🔧 カスタマイズ

### ポートの変更
`PORT` 環境変数を設定します：
```bash
PORT=3000 npm start
```

### 3D 設定の調整
`main.js` では以下を変更できます：
- `camera.position`：カメラ位置
- ライトの強度と色
- 爆弾サイズ（ジオメトリ半径）
- フォグ効果（`scene.fog`）

### サウンド効果の変更
`public/sfx/boom.mp3` を別の MP3 ファイルに置き換えます

## 📦 依存関係

- **express**：HTTP サーバーを作成し、静的ファイルをサービングします
- **three**：3D モデル、シーン、カメラ、およびレンダリング

## 🎯 ブラウザ互換性

以下の機能をサポートする最新のブラウザが必要です：
- WebGL（3D レンダリング）
- ES6 モジュール
- Web Audio API（オーディオ再生）

推奨：
- Chrome/Edge（最新）
- Firefox（最新）
- Safari（14+）

## 💡 改善の可能性

- より多くのインタラクションモード（キーボード制御）を追加
- 360° カメラ回転を実装
- バックグラウンド音楽レイヤーを追加
- レベルシステムを作成
- モバイルタッチサポートを追加
- パーティクルパフォーマンスを最適化

---

<div align="center">

**Created**: February 2026  
**Version**: 1.0.0

[⬆ Back to top](#-boom-animation)

</div>
