<div align="center">

# From Prompt Failure to Carrier Operations

### 一天内，把“勉强能动”的 Prompt 原型迭代成可公开体验的 3D 航母演示

**GPT × Claude Code × Human Review**

![Build](https://img.shields.io/badge/Build-2026--07--14-183B56?style=flat-square)
![Duration](https://img.shields.io/badge/Duration-One_Day-C68A3A?style=flat-square)
![Method](https://img.shields.io/badge/Method-Agent_Harness-2F6B5F?style=flat-square)
![Final](https://img.shields.io/badge/Final_Source-Private-5B526A?style=flat-square)

[**体验最终 Demo**](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/) ·
[**打开 v1 原始 Demo**](https://carrier-prompt-only-v1-wgy.wgy577-sortie.workers.dev) ·
[**打开 v2 原始 Demo**](https://carrier-prompt-only-v2-wgy.wgy577-sortie.workers.dev) ·
[**Demo API**](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo)

</div>

---

> **这不是一个“我写出了一条神奇 Prompt”的故事。** 这是一次在 **2026 年 7 月 14 日，一个自然日内**完成的 Vibe Coding 实验：最初两次直接生成都很差；随后 GPT 把人的观看反馈转译成可执行规格，Claude Code 读取项目、实现和验证，Harness 则逐步把上下文、坐标、对象、动画、性能和发布边界固定下来。

## 先看结果：从最差到最终版

| 阶段 | 当时采用的方法 | 得到的结果 | 直接体验 | 源码 |
|:--|:--|:--|:--:|:--:|
| 00 | 一次性 Prompt 生成 GIF / MP4 | 有弹射语义，但构图、模型和空间关系都很抽象 | [GIF](media/01-one-shot-carrier-launch.gif) · [MP4](media/01-one-shot-carrier-launch.mp4) | — |
| 00.5 | Claude Code 快速 2D 尝试 | 叙事更统一，但仍不是可观察、可交互的三维系统 | [GIF](media/02-claude-code-catapult.gif) | — |
| 01 | 原始 Prompt 直接生成 3D 页面 | 能运行，但舰体、飞机和代码结构都很粗糙 | [**Live v1**](https://carrier-prompt-only-v1-wgy.wgy577-sortie.workers.dev) | [原始快照](versions/v1-initial/) |
| 02 | 更长 Prompt 再生成一次 | 有组件和状态机，但“Prompt 更长”仍没有带来可信场景 | [**Live v2**](https://carrier-prompt-only-v2-wgy.wgy577-sortie.workers.dev) | [原始快照](versions/v2-compact/) |
| Final | GPT–Claude Code 闭环 + 多层 Harness | 完整航母、真实资产、轨迹驱动、连续攀升、海天环境与性能保护 | [**Live Final**](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/) · [API](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo) | Private |

[![最终舰载机离舰持续攀升画面](media/final-private-demo.png)](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/)

最终版公开运行，但实现保持私有。读者可以实际操作航母场景、查看单架舰载机工序 1–8、单独出动、持续攀升、亮度和甲板机数量档位，也可以读取公开接口；真实甲板生成逻辑、MATLAB 轨迹、GLB/EXR 资产与最终源代码不进入本仓库。

## 一天是怎样完成的？

**时间戳：2026-07-14（Asia/Shanghai） · 从第一份失败输出到最终可发布版本，全部发生在同一个自然日。**

| 一日阶段 | 发生了什么 | Harness 成熟度 |
|:--|:--|:--|
| 上午 · 快速试错 | 直接把目标交给模型，生成 GIF、2D 动画和最早 3D 页面；结果“能动”，但明显不像真实航母场景 | `L0` 几乎没有 Harness |
| 中段 · 连续否决 | 人只做观看、指出“平板漂在海上”“飞机不像飞机”“攀升拐直角”等问题；GPT 将反馈改写成几何、镜头、状态与禁止项 | `L1–L2` 规格与上下文 Harness |
| 下午 · 项目落地 | Claude Code 读取现有 Python/甲板/轨迹语义，建立坐标契约、CarrierGroup、真实资产装载和对象所有权 | `L3–L4` 数据、对象与动画 Harness |
| 晚间 · 环境与性能 | 海天环境、云层、尾迹、连续攀升、Mac 发热、机数档位、停止渲染逐项进入回归约束 | `L5` 视觉与热预算 Harness |
| 发布前 · 边界收口 | 最终版本闭源；v1/v2 原样开源并部署；敏感文件扫描、构建、测试与发布入口全部验证 | `L6` Privacy / Release Harness |

这个时间线不是为了证明“一天能替代传统工程”，而是展示：当反馈链短、执行 Agent 能读取完整仓库、约束被逐层固化时，Vibe Coding 可以在一天内完成非常高密度的可见迭代。

---

## 真正的协作方式：两个模型执行，人只做方向判断

```text
                 少量目标输入 / 观看后的意见
                            │
                            ▼
┌────────────────┐   编译意图与约束   ┌────────────────────┐
│ Human reviewer │ ────────────────▶ │ GPT                │
│ 看、否决、选择  │                   │ Prompt / Spec 编译器 │
└───────▲────────┘                   └──────────┬─────────┘
        │                                       │
        │        截图、运行结果、失败现象        │ 可执行 Prompt、验收项
        │                                       ▼
        │                            ┌────────────────────┐
        └────────────────────────────│ Claude Code        │
                                     │ 仓库读取、实现、验证 │
                                     └──────────┬─────────┘
                                                │
                                                ▼
                                     Running Demo / Build
```

### 分工不是传统的“人写需求、AI 补代码”

| 角色 | 实际工作 |
|:--|:--|
| **GPT** | 与人对话，解释失败原因，把“感觉不对”编译成结构化 Prompt、坐标约束、状态机、视觉验收和禁止项；本 README 中的大多数长 Prompt 都来自这一步。 |
| **Claude Code** | 主要工程执行者：读取已有项目，修改代码，建立模型与动画，搜索和筛选资产，运行构建，根据下一轮 Prompt 继续迭代。 |
| **Human reviewer / WGY** | 提供最初目标和少量 Prompt 注入；实际观看每轮结果，决定保留、否决或继续；提出直观意见并负责最终验收与公开边界。 |
| **Codex（后期）** | 对独立作品集仓库进行公开边界审计、历史快照核验、README 整理、CI 与发布入口维护；不是最终场景的主要实现者。 |

换句话说，人没有手工设计 15 条完整技术 Prompt，也没有逐行实现 Three.js。人的核心价值是持续观看和做判断；GPT 负责把判断变成语言接口；Claude Code 负责把语言接口变成可运行系统。

---

## 为什么 v1 / v2 必须原样保留？

它们不是为了作品集重新制作的“假失败案例”。两个目录与早期 Sites 源仓库中的历史文件树一致，没有补模型、重写结构或偷偷美化。

### v1 · `bb0ce0d` · Prompt-only 初始 3D Demo

[![Live v1](https://img.shields.io/badge/OPEN-LIVE_v1-2F6B5F?style=for-the-badge)](https://carrier-prompt-only-v1-wgy.wgy577-sortie.workers.dev)
[![Source v1](https://img.shields.io/badge/VIEW-SOURCE_v1-4A6072?style=for-the-badge)](versions/v1-initial/)

模型把航母、飞机、海面、镜头、UI 和动画集中到单个页面里，用硬编码几何体最快完成“关键词覆盖”。它有动态海面、三种镜头、OrbitControls、轨迹和弹射重播，却也有最典型的 One-shot 问题：舰体像盒子、飞机像挤出的图标、运动状态藏在渲染循环中。

**它证明：直接 Prompt 可以很快得到能打开的网页，但“能运行”与“看起来可信”完全不是一回事。**

### v2 · `967375b` · Prompt-only 紧凑版

[![Live v2](https://img.shields.io/badge/OPEN-LIVE_v2-C68A3A?style=for-the-badge)](https://carrier-prompt-only-v2-wgy.wgy577-sortie.workers.dev)
[![Source v2](https://img.shields.io/badge/VIEW-SOURCE_v2-4A6072?style=for-the-badge)](versions/v2-compact/)

第二条更长 Prompt 让模型拆出 `CarrierDemo`、`Deck`、`Aircraft` 和 `preparing → launching → climbing → finished` 状态机，并增加了状态测试。结构更好了，但甲板仍然是通用盒体，飞机和车辆仍是代码几何体，环境和真实项目数据也没有进入系统。

**它证明：Prompt 变长可以改善局部结构，却不会自动获得项目上下文、真实资产、反馈闭环和回归保护。**

---

## Harness 不是最后突然加上的名词，而是逐步长出来的

早期 v1/v2 几乎没有 Harness。真正的跃迁发生在失败意见被一层层固化之后。

```text
L0  Direct Prompt
    └─ 只描述想要什么，结果不可预测

L1  Visual Contract
    └─ “像航母 / 像飞机 / 连续攀升”变成可观察验收项

L2  Context Grounding
    └─ 先读仓库、Python、甲板语义和轨迹来源，再写代码

L3  Data & Geometry Isolation
    └─ 唯一坐标转换；Hull / Deck / Island 分块；不再各自猜位置

L4  Object & State Ownership
    └─ 弹射飞机、牵引飞机、静态资产拥有明确身份和唯一控制者

L5  Visual / Performance Regression
    └─ 截图复核、连续曲线、DPR/FPS、机数档位、标签页暂停和 WebGL 释放

L6  Privacy / Release Gate
    └─ 历史源码公开，最终源码私有；敏感格式扫描、CI、Demo 与 API 分离
```

### 最终形成的 15 个控制点

<details>
<summary><strong>展开查看完整 Harness（15 项）</strong></summary>

| 组 | 控制点 | 防止的问题 |
|:--|:--|:--|
| Intent | 01. 远景叙事契约 | 功能很多，但第一眼看不懂 |
| Intent | 02. GPT Prompt Compiler | 人的视觉意见无法落到代码 |
| Context | 03. Repository Archaeology | 重画项目中已经存在的事实 |
| Context | 04. Source-of-Truth Gate | 坐标、轨迹和设备位置被猜测 |
| Context | 05. Asset Due Diligence | 模型许可、比例和渲染成本失控 |
| Geometry | 06. Coordinate Contract | Python 二维坐标与 Three.js 世界错位 |
| Geometry | 07. Geometry Decomposition | 舰体成为不可调的单一盒子 |
| Assets | 08. GLB Normalization | 模型悬空、比例错乱、重复加载 |
| Objects | 09. Instance Ownership | 飞机重影、下标混乱、重复实例 |
| Motion | 10. State Machine | 多个动画同时争抢同一对象 |
| Visual | 11. Screenshot Critic Loop | 构建通过但画面仍然错误 |
| Environment | 12. Layered Sky / Sea / Wake | 天空拼接、海面假、特效过重 |
| Performance | 13. Thermal Budget | Mac 发热、标签页后台持续渲染 |
| Verification | 14. Build / Test / Anchor Checks | 后续修改破坏早先正确结果 |
| Release | 15. Privacy Boundary | 最终资产与研究数据进入公开 Git 历史 |

</details>

OpenAI 对 Codex 定制层的说明也把持久指令、Skills、MCP 与自动检查视为相互补充的 Harness 组成部分，而不是依赖一条无限增长的 Prompt：[Codex Customization](https://learn.chatgpt.com/docs/customization/overview)。关于工具、文件、审批、guardrails 与运行环境边界的进一步说明见：[Agent Harness / compute separation](https://developers.openai.com/cookbook/examples/agents_sdk/migrate-from-claude-agent-sdk/readme#why-migrate)。

本仓库中可以直接检查的发布 Harness：

- [AGENTS.md](AGENTS.md)：历史快照和私有边界的持久规则；
- [OPEN_SOURCE_BOUNDARY.md](OPEN_SOURCE_BOUNDARY.md)：公开 / 私有内容矩阵；
- [scripts/check-open-source-boundary.mjs](scripts/check-open-source-boundary.mjs)：阻止研究数据、模型资产、环境文件和私有标记进入公共提交；
- [.github/workflows/validate.yml](.github/workflows/validate.yml)：边界检查、v1 构建和 v2 原始测试。

---

## 关键工程转向

### 1. 从“写一个航母”改为“读取项目事实”

Claude Code 不再凭感觉重新画甲板，而是先理解既有 Python 甲板语义、区域、设备和轨迹来源；所有二维坐标经唯一契约进入 Three.js。最终数据和转换实现保持私有。

### 2. 从“一个 Mesh”改为“可分离 CarrierGroup”

舰体、甲板、舰岛、标线、静态资产与运动对象分别管理。这样修舰体不会改坏甲板，改天空不会触碰牵引状态。

### 3. 从“模型能加载”改为“资产进入规范化管线”

工程 Agent 对候选资产做了联网搜索和许可/性能核对：飞机与牵引车使用包围盒归一化、统一前向轴和最低点贴地，同一 GLB 只加载一次再 clone。环境资产也纳入透明材质和热预算评估。

- [Shenyang J31 “Gyrfalcon”](https://sketchfab.com/3d-models/shenyang-j31-gyrfalcon-23dbff530e21491299ac67bbab42b553)
- [pushback](https://sketchfab.com/3d-models/pushback-e15e6f76f18e4b02b7009df0fb018fc8)
- [Fluffy Cloud](https://sketchfab.com/3d-models/fluffy-cloud-2c887a28840f47cfae6b5dee0d11b842)
- [Kloppenheim 07 Pure Sky](https://polyhaven.com/a/kloppenheim_07_puresky)

### 4. 从“播放动画”改为“对象所有权 + 状态机”

弹射飞机、被牵引飞机、演示牵引车和静态资产不再靠临时下标控制。动画互斥、重置确定、飞机始终只有一个运动控制者，消除了重影与多个循环争抢。

### 5. 从“视觉越多越好”改为“热预算也是功能”

云模型、海面波动、静态飞机数量、DPR 和渲染频率都纳入性能门禁。最终 Demo 提供甲板机数量档位和“结束并停止”，页面隐藏时暂停，结束后释放 WebGL 资源。

---

## Prompt 演进档案

> 下列长 Prompt 不是人从头手写的技术文档。主要过程是：**人给出一句观看意见 → GPT 解释原因并生成结构化 Prompt → Claude Code 执行 → 人重新观看。** 为可读性，重复路径和上传确认已合并；关键转向完整保留。

<details>
<summary><strong>01 · 自由生成：先让舰载机飞起来</strong></summary>

```text
调用多模态模型或使用代码生成 GIF。
可以使用舰载机建模，甲板不一定俯视。
表现弹射、加速、离舰和一小段攀升；加入天空和大海。
```

结果快速，但飞机、甲板和背景不属于同一视觉系统。
</details>

<details>
<summary><strong>02 · 从 GIF 转向可旋转 3D 网页</strong></summary>

```text
创建可公开部署的 Three.js 3D Demo。
低多边形甲板、弹射器、主飞机、静止飞机、牵引车与阴天海面。
出动包含准备、加速、离舰和 3~5 秒攀升；使用明确动画状态。
```

产生了完整方向，也产生了“平板漂在海上”的典型失败。
</details>

<details>
<summary><strong>03 · v1：第一次完整交互场景</strong></summary>

```text
先做可运行的完整原型：航母、飞机、动态海面、弹射轨迹、
三个镜头、OrbitControls 和重播。优先验证整体故事。
```

[Live](https://carrier-prompt-only-v1-wgy.wgy577-sortie.workers.dev) · [Source / bb0ce0d](versions/v1-initial/)
</details>

<details>
<summary><strong>04 · v2：缩小场景并拆分状态</strong></summary>

```text
当前 Demo 太大、不够细节。重做为紧凑局部甲板。
飞机必须能辨认主要部件；动画只播放一次，主飞机只有一个实例。
拆分场景、状态、模型与 UI，并运行构建和测试。
```

[Live](https://carrier-prompt-only-v2-wgy.wgy577-sortie.workers.dev) · [Source / 967375b](versions/v2-compact/)
</details>

<details>
<summary><strong>05 · 拒绝“海上平板”</strong></summary>

```text
中远距离必须一眼认出是航空母舰。
补出舰首、舰尾、船舷、吃水线以上体积与侧置舰岛。
从前、侧、后旋转观看都不能变成薄片。
```
</details>

<details>
<summary><strong>06 · 停止凭感觉设计</strong></summary>

```text
先读取已有 Python 甲板生成逻辑，建立唯一坐标转换。
轮廓、区域、设备、舰岛与弹射器共享同一套世界坐标。
不要随机摆放，不要把截图贴到矩形平面。
```
</details>

<details>
<summary><strong>07 · 分块建模完整舰体</strong></summary>

```text
以顶部轮廓构造中层、水线层和底层截面。
舰首收尖、舰尾相对平直、侧面向水线内收。
CarrierGroup 内分离 Hull / Deck / Island。
```
</details>

<details>
<summary><strong>08 · 资产搜索、归一化与贴地</strong></summary>

```text
联网筛选远景可用的舰载机、牵引车和环境资产，核对许可与成本。
GLB 只加载一次再 clone；使用 Box3 自动缩放和最低点贴地。
前进方向只在根节点做一次固定修正。
```
</details>

<details>
<summary><strong>09 · 真实轨迹与对象所有权</strong></summary>

```text
MATLAB 数据先转换为前端路径点，但轨迹来源不能替换。
主飞机、被牵引飞机和两辆演示牵引车使用明确命名。
任何时刻只有一个动画拥有对象控制权。
```
</details>

<details>
<summary><strong>10 · 单架飞机工序 1–8</strong></summary>

```text
不做 20 架同时调度，只演示一架飞机完整经历工序 1–8。
包括牵引车接近、挂接、牵引、准备、弹射和持续攀升。
同一架飞机不得被多个动画同时控制。
```
</details>

<details>
<summary><strong>11 · 环境从“特效”回到空气感</strong></summary>

```text
丁达尔效应不能像舞台光柱；只保留低对比空气透视。
海面叠加长波和短波；天空统一、无接缝，上方厚云、地平线开阔。
```
</details>

<details>
<summary><strong>12 · 连续飞行曲线</strong></summary>

```text
飞机不能水平飞到甲板边缘后突然直角向上。
位置、速度方向和俯仰角都要连续，沿弧线攀升并继续飞向天际。
```
</details>

<details>
<summary><strong>13 · 航母航行与世界参考系</strong></summary>

```text
舰首浪花、侧边扰动和舰尾尾迹持续存在。
海面、云层和航母产生一致相对运动；出动动画不能取消尾迹。
```
</details>

<details>
<summary><strong>14 · 热预算与主动停止</strong></summary>

```text
限制 FPS 和 DPR，减少静态飞机并提供数量档位。
页面隐藏时暂停；增加“结束并停止”，释放 WebGL 资源。
README 提醒用户结束 Demo，本地还要 Ctrl+C 关闭开发服务器。
```
</details>

<details>
<summary><strong>15 · 最终发布边界</strong></summary>

```text
最终 Demo 和真实甲板保持闭源，只公开运行入口和 API。
原样公开 v1/v2，展示 Prompt-only 失败到 Harness 系统的过程。
提交前阻止研究数据、最终资产、私有托管信息和绝对路径进入 Git。
```
</details>

---

## 最终版与开源边界

- **最终 Demo：** <https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/>
- **公开接口：** [`GET /api/demo`](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo)
- **最终源码：** Private
- **保持私有：** 真实甲板导出、Python 生成逻辑、MATLAB 轨迹及转换结果、GLB/EXR 运行资产和最终装配代码
- **公开内容：** 原始 v1/v2 源码、早期媒体、演进记录、CI 与发布边界检查

详细规则见 [OPEN_SOURCE_BOUNDARY.md](OPEN_SOURCE_BOUNDARY.md)。

## 仓库结构

```text
Carrier-Vibe-Coding-Journey/
├── README.md
├── AGENTS.md
├── OPEN_SOURCE_BOUNDARY.md
├── scripts/check-open-source-boundary.mjs
├── .github/workflows/validate.yml
├── media/
└── versions/
    ├── v1-initial/    # bb0ce0d 原始文件树
    └── v2-compact/    # 967375b 原始文件树
```

## 本地运行原始版本

```bash
node scripts/check-open-source-boundary.mjs

cd versions/v1-initial
npm ci
npm run build
npm run dev

cd ../v2-compact
npm ci
npm test
npm run dev
```

v1/v2 是未经美化的 Prompt-only 历史证据。请不要把它们误解为最终工程质量；它们的“差”，正是这份作品集需要保留的对照组。

## License

本仓库中的原创公开代码与文档采用 [MIT License](LICENSE)。最终私有 Demo、研究数据和未随仓库提供的第三方资产不在此许可范围内。

---

<div align="center">

**One day. Two collaborating models. One human review loop. A Harness that grew from failure.**

Created by **Guangyu Wu (WGY)** · 2026-07-14

</div>
