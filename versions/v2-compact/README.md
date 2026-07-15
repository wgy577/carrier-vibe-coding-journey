# 舰载机出动演示

> 来源：ChatGPT Sites 私有源仓库提交 `967375b`。公开快照移除了私有
> Sites 项目绑定。

紧凑、低多边形的 Three.js 舰载机弹射 3D Demo。场景包含局部航母甲板、弹射轨道、虚构舰载机、牵引车、甲板设备、阴天海面，以及一次性的准备、弹射、离舰爬升动画。

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址。鼠标左键旋转、滚轮缩放、右键平移；点击“出动”播放动画，结束后点击“重新演示”恢复初始状态。

## 构建与检查

```bash
npm run build
npm run test:launch
```

## 部署到 Vercel

1. 将本目录推送至 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 中选择 **New Project** 并导入该仓库。
3. Framework Preset 保持自动检测，Build Command 使用 `npm run build`。
4. 点击 Deploy。项目不需要环境变量、账号系统或数据库。

相较 v1，本版将场景拆为 `CarrierDemo`、`Deck`、`Aircraft` 与独立发射
状态机，并用测试锁定 preparing → launching → climbing → finished 的顺序。
