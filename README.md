<div align="center">

# From Flat Prototype to Carrier Operations

## 一次从 One-shot 失败、Prompt 编译到多层 Agent Harness 的 Vibe Coding 实验

**Created and directed by Guangyu Wu (WGY)**

[最终在线 Demo](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/) ·
[Demo API](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo) ·
[开源 v1](versions/v1-initial/) ·
[开源 v2](versions/v2-compact/) ·
[开源边界](OPEN_SOURCE_BOUNDARY.md)

</div>

---

## 简历版摘要

我用自然语言持续导演 Codex，把一个“能动但不像航母”的一次性原型，迭代成具有完整舰体、真实资产、轨迹驱动、状态隔离、海天环境、性能保护和公开接口的 3D 航母演示。

项目真正的成果不是某一条“神奇 Prompt”，而是一套由 **15 层 Harness、6 个隔离边界和 5 条反馈回路**组成的生成式软件工作流：人的视觉判断负责方向，GPT 负责把反馈编译成规格，Codex 负责仓库级实现与验证，Claude Code 负责快速探索，自动测试和发布门禁负责阻止系统退化。

> 稍微夸张但准确地说：第一版是在浏览器里“画了一艘会动的船”，最终版是在数据、对象所有权、视觉验收、热预算和隐私边界共同约束下运行的微型数字场景系统。

## 成果地图

| 阶段 | 结果 | 公开内容 | 入口 |
|---|---|---|---|
| 0 | One-shot GIF / MP4 | 媒体与早期实验结果 | [GIF](media/01-one-shot-carrier-launch.gif) · [MP4](media/01-one-shot-carrier-launch.mp4) |
| 0.5 | Claude Code 2D 原型 | 动画结果 | [查看 GIF](media/02-claude-code-catapult.gif) |
| 1 | ChatGPT Sites 初始 3D Demo | 完整历史源码 | [v1 源码](versions/v1-initial/) |
| 2 | 紧凑、组件化 3D Demo | 完整历史源码 | [v2 源码](versions/v2-compact/) |
| Final | 数据与真实资产驱动的完整演示 | **源码闭源，仅提供界面** | [在线 Demo](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/) · [API](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo) |

## 最终版本：公开运行，私有实现

[![最终舰载机离舰攀升画面](media/final-private-demo.png)](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/)

最终版展示单架舰载机从甲板保障、牵引、准备、进入弹射器到离舰持续攀升的完整流程，并提供镜头旋转、亮度调节、甲板机数量档位、独立出动和停止渲染等交互。

- **Demo：** <https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/>
- **接口：** [`GET /api/demo`](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/api/demo)
- **源码状态：** Private
- **不公开内容：** 最终源码、真实甲板导出、Python 生成逻辑、MATLAB 轨迹与转换结果、GLB/EXR 运行资产。

这一边界不是“缺少开源文件”，而是作品设计的一部分：读者可以体验结果、读取接口、审查早期演进，却不能从本仓库取得研究数据和最终实现。详细规则见 [OPEN_SOURCE_BOUNDARY.md](OPEN_SOURCE_BOUNDARY.md)。

---

## v1 和 v2 到底是怎么来的？

它们不是后来重新拼出来的示例，而是从同一个 ChatGPT Sites 私有源仓库的真实历史提交中导出的两个时间切片。公开时移除了私有 Sites 项目绑定；为遵守甲板保密边界，v1 的项目轮廓点也被替换为通用低多边形航母轮廓，交互与动画结构保持不变。

### v1 · `bb0ce0d` · Build interactive carrier launch 3D demo

[打开 v1 源码](versions/v1-initial/)

v1 是第一次把“舰载机弹射”变成可交互网页的版本。它采用典型的快速 Vibe Coding 策略：把航母、飞机、海面、镜头、UI 和动画集中在一个 `app/page.tsx` 中，用代码几何体快速验证故事是否成立。公开版使用经过隐私清理的通用甲板轮廓。

它已经具备：

- Three.js / React Three Fiber 场景；
- 可变形动态海面；
- 航母、代码飞机、舰岛和弹射轨道；
- 全舰、弹射位、舰艏三个镜头；
- OrbitControls、自动环绕、轨迹显示与弹射重播。

它的问题也非常典型：单文件过重、舰体像盒子、飞机是二维轮廓挤出、运动状态隐含在渲染循环里。它“把想法做出来了”，但还没有形成可靠的软件结构。

### v2 · `967375b` · Refine compact carrier launch demo

[打开 v2 源码](versions/v2-compact/) · [查看发射状态机](versions/v2-compact/lib/launch-machine.mjs)

v2 不是简单换皮，而是第一次结构化重构：

- 从 188 行页面逻辑中拆出 `CarrierDemo`；
- 独立建立 `Deck` 与 `Aircraft` 模型组件；
- 飞机增加机身、机翼、座舱、尾翼、喷口和简化起落架；
- 增加 `preparing → launching → climbing → finished` 状态机；
- 用测试验证持续时间、状态顺序与最终攀升姿态；
- 缩小场景范围，让用户第一眼更容易读懂“弹射出动”。

如果说 v1 验证的是“AI 能否在一次交互中造出完整场景”，那么 v2 验证的是“当人开始提供结构、状态和验收标准后，AI 能否把原型变成可维护代码”。

---

## 为什么直接给一条很长的 Prompt，仍然很难得到好 Demo？

早期结果已经证明：Prompt 可以很快制造“语义正确”的画面——海、船、飞机、起飞都在——但它无法自动知道人的隐性标准。

![One-shot 结果](media/01-one-shot-carrier-launch.gif)

Claude Code 随后生成了构图更统一的 2D 动画。它非常适合快速验证故事节奏，却也暴露了二维原型无法承载空间观察、真实资产、轨迹和对象状态的问题。

![Claude Code 2D 原型](media/02-claude-code-catapult.gif)

One-shot 容易失败的原因并不是模型“不会写 Three.js”，而是缺少：

1. **事实来源：** 哪些坐标、文件和资产才是权威输入；
2. **识别标准：** 什么叫“像航母”，什么叫“飞机真的在攀升”；
3. **对象所有权：** 谁控制主飞机，什么时候可以重置；
4. **回归保护：** 修改天空时不能破坏牵引，优化海面时不能让 Mac 过热；
5. **发布边界：** 什么可以展示，什么永远不能进入公共 Git 历史。

所以我们不再追求“更长的万能 Prompt”，而是逐层搭建 Harness。

---

## 15 层 Agent Harness

这里的“15 层”是对完整工作过程的工程化复盘：并不是声称部署了 15 个独立服务，而是把原本混在聊天里的约束拆成 15 个可以检查、替换和回滚的责任层。

| 层 | Harness | 实际作用 |
|---:|---|---|
| 01 | **Intent Layer** | 先定义远景叙事：完整航母、单架飞机、连续离舰攀升，而不是堆功能。 |
| 02 | **Prompt Compiler** | 让 GPT 把“看着不对”转换成轮廓、镜头、状态、持续时间和禁止项。 |
| 03 | **Repository Archaeology** | Codex 先检查现有 Python、MAT、前端结构和素材，避免重画已经存在的事实。 |
| 04 | **Source-of-Truth Gate** | 坐标、设施和轨迹只允许来自指定源；禁止不同组件分别猜位置。 |
| 05 | **Web Asset Due Diligence** | 联网检查候选模型的轮廓、面数、许可、文件大小和实时渲染风险。 |
| 06 | **Coordinate Contract** | 固定二维到三维的唯一转换协议，所有对象共享同一世界坐标。 |
| 07 | **Geometry Decomposition** | 舰体、甲板、舰岛、边缘和水线分块建模，任何一块可单独调整。 |
| 08 | **Asset Normalization** | GLB 单次加载、包围盒归一化、统一前向轴、贴地，再安全 clone。 |
| 09 | **Instance Ownership** | 主飞机、牵引飞机、演示牵引车和静态资产拥有明确身份，禁止下标混用。 |
| 10 | **Animation State Machine** | 状态互斥、单一动画控制者、确定性 reset，消除重影与多循环争抢。 |
| 11 | **Visual Critic Loop** | 每轮以截图和实际观看反馈检查舰体轮廓、镜头比例、云层高度与运动连续性。 |
| 12 | **Environment Stack** | 天空、云、雾、长短波海面、航行尾迹分层处理，降低“一个 Shader 解决一切”的耦合。 |
| 13 | **Performance & Thermal Gate** | FPS、DPR、甲板机数量、标签页暂停和 WebGL 释放共同组成热预算。 |
| 14 | **Deterministic Verification** | 构建、状态顺序、路径来源、对象分配和关键锚点用自动测试锁定。 |
| 15 | **Privacy & Release Gate** | 公共 v1/v2、私有最终版、运行接口三层分离；提交前自动扫描敏感资产。 |

OpenAI 的 Codex 官方资料将 `AGENTS.md`、Skills、MCP、Memories 与 Subagents 描述为相互补充的定制层，并建议用 hooks、linters 和类型检查器固化反复出现的反馈。[Codex Customization](https://learn.chatgpt.com/docs/customization/overview)

OpenAI 也将现代 Agent Harness 描述为围绕工具、文件、记忆、审批、沙箱计算、guardrails 与 tracing 组织的可信运行层，并强调把 Harness 与计算环境的所有权显式分开。[Agent Harness / compute separation](https://developers.openai.com/cookbook/examples/agents_sdk/migrate-from-claude-agent-sdk/readme#why-migrate)

本仓库把这种思路落实为真实文件：

- [AGENTS.md](AGENTS.md) 保存持久发布规则；
- [开源边界检查](scripts/check-open-source-boundary.mjs) 阻止敏感格式和私有标记进入 Git；
- [GitHub Actions](.github/workflows/validate.yml) 同时验证边界、v1 和 v2；
- v2 的测试锁定动画状态，而不是只确认“页面能打开”。

## 6 个隔离边界

1. **数据隔离：** 研究数据与展示代码不在同一个公开仓库。
2. **版本隔离：** v1、v2 是只读历史快照；最终版在独立私有仓库演进。
3. **对象隔离：** 静态飞机、牵引飞机和弹射飞机不共享控制权。
4. **状态隔离：** 牵引、准备、弹射、攀升互斥，重置是显式转换。
5. **渲染隔离：** 海面、云、舰体和 UI 可单独降级，不牵连核心流程。
6. **发布隔离：** 公共仓库只保留早期源码；最终版只有 URL、API 和截图。

## 5 条反馈回路

```text
视觉反馈  → Prompt 规格 → 场景修正 → 新截图
数据反馈  → 锚点测试   → 坐标修正 → 回归测试
运动反馈  → 曲线约束   → 状态机   → 连续性验收
性能反馈  → 热预算     → 降频/档位 → 设备实测
发布反馈  → 边界扫描   → 隔离源码 → GitHub 验证
```

---

## 联网资产调研：不是“搜到模型就塞进去”

最终私有版本的资产环节采用了候选搜索与许可尽调。Codex 不只检查“像不像”，还比较远景轮廓、三角面数量、文件体积、透明材质成本、前向轴和贴地难度。

- 舰载机候选 [Shenyang J31 “Gyrfalcon”](https://sketchfab.com/3d-models/shenyang-j31-gyrfalcon-23dbff530e21491299ac67bbab42b553) 具有清楚的飞机轮廓，页面标注约 51.6k triangles、CC Attribution。
- 牵引车候选 [pushback](https://sketchfab.com/3d-models/pushback-e15e6f76f18e4b02b7009df0fb018fc8) 页面标注约 11.2k triangles、CC Attribution。
- 云资产 [Fluffy Cloud](https://sketchfab.com/3d-models/fluffy-cloud-2c887a28840f47cfae6b5dee0d11b842) 虽只有约 1.4k triangles，但作者明确提醒大量透明平面可能在桌面端仍然消耗很高——这直接解释了“模型不大，Mac 却发热”的现象。
- 天空候选来自 [Poly Haven 的 Kloppenheim 07 Pure Sky](https://polyhaven.com/a/kloppenheim_07_puresky)，用于统一海上多云色调。

这些最终运行资产**不随本仓库发布**。这里公开的是调研决策与方法，而不是资产文件和最终装配代码。

---

## Prompt 演进档案

以下保留了决定项目方向的 Prompt 轨迹。为可读性合并了重复路径、上传确认和很短的按钮调整，但没有删除任何关键转向。

<details>
<summary><strong>01 — 自由生成：先让舰载机飞起来</strong></summary>

```text
调用一个多模态模型或使用代码生成 GIF。
可以使用舰载机建模，甲板不一定俯视。
表现弹射、加速、离舰和一小段攀升；加入天空、大海，自由发挥，做漂亮一点。
```

结果快速、直观，但飞机、甲板和背景不属于同一视觉系统，也没有项目数据。
</details>

<details>
<summary><strong>02 — 从 GIF 转向可旋转的 3D 网页</strong></summary>

```text
使用 Vite / Three.js 创建可公开部署的 3D Demo。
低多边形、局部甲板、弹射器、主飞机、静止飞机、牵引车、阴天海面。
出动包含准备、加速、离舰和 3~5 秒攀升，相机跟随。
使用 loading / ready / preparing / launching / climbing / finished 状态。
```

这条 Prompt 产生了功能完整的方向，但视觉仍然像“平板放在水上”。
</details>

<details>
<summary><strong>03 — v1：第一次完整交互场景</strong></summary>

```text
先做一个可运行的完整交互原型：
航母、飞机、动态海面、弹射轨迹、三个镜头、OrbitControls 和重播。
优先验证浏览器中的整体故事，不追求高模和复杂材质。
```

对应公开快照：[v1 / bb0ce0d](versions/v1-initial/)。
</details>

<details>
<summary><strong>04 — v2：缩小场景并拆分状态</strong></summary>

```text
当前 Demo 太大、不够细节。重做为紧凑局部甲板场景。
飞机必须能辨认机头、机身、机翼、尾翼、座舱、喷口和起落架。
动画只播放一次，结束后重新演示；主飞机始终只有一个实例。
拆分场景、状态、模型与 UI，并运行构建和测试。
```

对应公开快照：[v2 / 967375b](versions/v2-compact/)。
</details>

<details>
<summary><strong>05 — 拒绝“海上平板”</strong></summary>

```text
从中远距离必须一眼认出是航空母舰。
不能只放甲板平面；补出舰首、舰尾、船舷、吃水线以上舰体厚度和侧置舰岛。
默认镜头接近航母平行的斜侧视角，从前、侧、后都不能变成薄片。
```

“像航母”第一次被转换成可观察的几何验收标准。
</details>

<details>
<summary><strong>06 — 数据优先：停止凭感觉设计</strong></summary>

```text
先读取已有 Python 甲板生成逻辑，建立唯一坐标转换。
轮廓、区域、设备、舰岛与弹射器必须共享同一套世界坐标。
不要重新随机摆放，不要把截图贴到矩形平面。
```

从这里开始，具体研究数据进入私有实现，不再包含在本公开仓库中。
</details>

<details>
<summary><strong>07 — 分块建模完整舰体</strong></summary>

```text
以顶部轮廓为上层截面，构造中层、水线层和底层并连接。
舰首逐渐收尖，舰尾相对平直，侧面向水线内收，底部继续收窄。
CarrierGroup 内部分离 Hull / Deck / Island，禁止合成不可调整的单一网格。
```

这建立了几何分块 Harness。
</details>

<details>
<summary><strong>08 — 资产搜索、归一化与贴地</strong></summary>

```text
联网检查适合远景的舰载机、牵引车和环境资产，核对许可与渲染成本。
GLB 只加载一次，再 clone 实例；使用 Box3 自动缩放和最低点贴地。
模型前进方向只允许在根节点做一次固定修正。
```

最终资产与装配代码保持私有，本仓库只记录选择方法与来源页面。
</details>

<details>
<summary><strong>09 — 真实轨迹与对象所有权</strong></summary>

```text
浏览器不能直接使用 MATLAB 数据时，先转换为前端路径点。
主飞机、被牵引飞机、移动牵引车和牵引演示车必须使用明确命名。
任何时刻只有一个动画拥有对象控制权；重置恢复位置、朝向和状态。
```

轨迹文件、转换结果与实现全部位于最终私有项目。
</details>

<details>
<summary><strong>10 — 单架飞机工序 1~8</strong></summary>

```text
不要做 20 架同时调度，只演示一架飞机完整经历工序 1~8。
包括牵引车接近、挂接、牵引、准备、进入弹射器、弹射和持续攀升。
同一架飞机不能同时被多个动画控制，不得重影、复制或瞬移。
```

用一条可信故事线替代了数量更大但难读的演示。
</details>

<details>
<summary><strong>11 — 环境从“特效”回到空气感</strong></summary>

```text
丁达尔效应不能像舞台光柱；太阳藏在云后，只保留低对比空气透视。
海面叠加长波和短波，远处更灰、更雾化，不能像镜子或暴风。
天空统一、无接缝，上方厚云、地平线开阔，并让云层缓慢移动。
```

环境被拆成天空、云、雾、海面和尾迹五个可独立调节的层。
</details>

<details>
<summary><strong>12 — 连续飞行曲线</strong></summary>

```text
飞机不能水平飞到甲板边缘后突然直角向上。
位置、速度方向和俯仰角都要连续：向前加速的同时逐渐抬头，
沿弧线攀升并继续飞向天际，画面保留海面、天空和部分航母参照。
```

视觉意见被转换成连续性约束。
</details>

<details>
<summary><strong>13 — 航母航行与世界参考系</strong></summary>

```text
航母要处于轻微航行状态：舰首浪花、侧边扰动和舰尾尾迹持续存在。
海面、云层和航母产生一致的相对运动；出动动画不能取消尾迹。
```

场景从静态展台变成同一参考系里的运动世界。
</details>

<details>
<summary><strong>14 — 热预算与主动停止</strong></summary>

```text
Mac 运行时发热严重。限制 FPS 和 DPR，减少静态飞机，提供数量档位。
页面隐藏时暂停；增加“结束并停止”，停止渲染循环并释放 WebGL 资源。
README 提醒用户看完后停止 Demo，本地还要 Ctrl+C 关闭开发服务器。
```

性能从“最后优化”升级为产品级验收项。
</details>

<details>
<summary><strong>15 — 最终发布边界</strong></summary>

```text
最终 Demo 和真实甲板保持闭源，只公开在线运行入口和 API。
公开 v1 与 v2，展示从单文件原型到组件化状态机的过程。
Vibe Coding 作品集使用独立 Git 仓库和独立 README。
提交前自动阻止研究数据、最终资产、私有托管信息和绝对路径进入 Git。
```

这条 Prompt 最终变成了本仓库的 [AGENTS.md](AGENTS.md)、[边界文档](OPEN_SOURCE_BOUNDARY.md) 和 [自动检查](scripts/check-open-source-boundary.mjs)。
</details>

---

## 人与模型的分工

- **Guangyu Wu / WGY：** 产品目标、研究边界、审美判断、失败诊断、最终验收和开源决策。
- **GPT：** 将自然语言意见编译成分阶段 Prompt、状态约束、视觉标准和禁止项。
- **Codex：** 仓库检查、联网尽调、代码实现、分块重构、构建测试、性能修正与发布隔离。
- **Claude Code：** 快速生成代码原生 2D 原型，验证构图和叙事节奏。
- **自动 Harness：** 在人不盯着每一行代码时，持续守住状态、构建、性能与隐私边界。

这不是模型排行榜。真正有效的做法是让不同工具承担适合自己的工作，并让人始终掌握方向与验收权。

## 仓库结构

```text
Carrier-Vibe-Coding-Journey/
├── README.md                       # 完整作品集与 Prompt 演进
├── AGENTS.md                       # Codex 的持久仓库规则
├── OPEN_SOURCE_BOUNDARY.md         # 公开 / 私有边界
├── scripts/
│   └── check-open-source-boundary.mjs
├── .github/workflows/validate.yml  # 边界 + v1/v2 构建测试
├── media/                          # 早期结果与最终版截图
└── versions/
    ├── v1-initial/                 # 私有 Sites 提交 bb0ce0d 的公开快照
    └── v2-compact/                 # 私有 Sites 提交 967375b 的公开快照
```

## 本地运行

```bash
# 检查公共仓库没有越过发布边界
node scripts/check-open-source-boundary.mjs

# v1
cd versions/v1-initial
npm ci
npm test
npm run dev

# v2
cd ../v2-compact
npm ci
npm test
npm run dev
```

两个版本都属于历史教学快照，不代表最终画面质量。最终结果请直接访问[在线 Demo](https://wgy-carrier-operations-demo.wgy577-sortie.workers.dev/)。

## License

本仓库中的原创公开代码与文档采用 [MIT License](LICENSE)。最终私有 Demo、研究数据和未随仓库提供的第三方资产不在此许可范围内。

---

<div align="center">

**The first prompt produced a picture. The Harness produced a system.**

</div>
