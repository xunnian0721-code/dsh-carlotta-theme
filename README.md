# 鸣潮主题 · dsh-carlotta-theme

给 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 桌面版用的《鸣潮》角色主题插件：**珂莱塔、卡提希娅、爱弥斯、达妮娅、西格莉卡，共 30 套皮肤**。
非官方同人作品，与库洛游戏、DeepSeek 无关。

> ⚠ **本仓库不包含任何画师的插画。** 背景图、启动画面、Q 版和立绘都需要你**取得原作者同意后**自己放进去。
> 原作链接和作品 ID 见 [图片清单](docs/图片清单.md)，放图步骤见 [插图教程](docs/插图教程.md)，使用前请先读 [免责声明](#免责声明)。
> 不放图也能用：配色、动效、徽章、字体都在，背景显示纯色。

## 皮肤一览

| 角色 | 皮肤 |
| --- | --- |
| 珂莱塔 Carlotta | 晶棱玫瑰 · 夜宴（暗）/ 晶棱玫瑰 · 白昼 / 璀璨（暗）/ 休憩日 / 盛夏 |
| 卡提希娅 Cartethyia | 苍风 · 圣女 / 月誓 · 静夜（暗）/ 潮汐 · 拉古那 / 花野 · 休憩日 / 盛夏 · 海风 |
| 爱弥斯 Aemeath | 星辉 · 歌姬（暗）/ 远航星 · 靛青宇宙（暗）/ 隧者兵装 · 机兵 / 归家 · 小爱弥斯 / 盛夏 · 星海 |
| 达妮娅 Denia | 伪装 · 泡影 / 幻灭 · 真形（暗）/ 天之弱（暗）/ 生日漫游 · 橙子蛋糕 / 盛夏 · 汽水泡泡 / Solar5 · 偶像 / 残星会 · 实验体（暗）/ 娅娅与西格莉卡 / 甜点社 · 下午茶 / 午睡 · 嘘 |
| 西格莉卡 Sigrika | 符文 · 语义解现（暗）/ 昭日 · 日光祝福 / 罗伊 · 日灵伙伴 / 小橘子 · 星炬日常 / 盛夏 · 橘子海 |

每套皮肤都有自己的配色、首页流光标题、徽章图标、背景动效（符文连线、日光尘埃、泡泡、海浪、落花……）和启动画面加载文字。

## 功能
- **全窗口换色**：DSH 所有窗口（主界面、工作台、设置、插件、轨迹、右侧栏、菜单、弹窗、提示）的颜色都来自约 100 个 `--dsw-alias-*` 变量，插件用官方 `ctx.theme.overrideTokens` 整套替换。
- **背景图 + 动效**：每套皮肤一张背景，可在设置里换成自己的图片 / GIF / 视频；可调透明度、模糊、压暗。
- **启动画面**：每套皮肤一个；打开 DSH、或在设置里换皮肤时播放，点击或 ESC 跳过。
- **替换 DSH 自带启动页**（设置里可关）：插件会改安装目录里的 `resources/splash.html`，第一次替换前备份成 `splash.html.carlotta-orig`，关闭开关即还原；DSH 更新覆盖后会自动重新替换。
- **侧栏**：皮肤徽章 + 角色名、渐变「新会话」按钮、底部 Q 版。
- **余额与今日已用**：点 Q 版，弹出 DeepSeek 剩余额度和今日已用。
- **跟随系统明暗**：可以分别指定亮色、暗色时用哪套。
- **设置页**集成在 DSH 设置左栏「鸣潮主题」。
- 兼容 [dsh-peak-valley](https://github.com/dmscode/dsh-peak-valley)：峰谷条自动跟随皮肤配色。

## 安装
1. 下载本仓库（绿色「Code」按钮 → Download ZIP 解压），或：
   ```bash
   git clone https://github.com/xunnian0721-code/dsh-carlotta-theme.git
   ```
2. （可选）按 [插图教程](docs/插图教程.md) 把**已获授权**的图片放进 `assets/`。
3. DSH → 设置 → 插件 → 添加插件，填插件目录的绝对路径，然后重启 DSH。

> DSH 安装插件时会复制一份快照。以后改了图片或代码，要在插件页**移除再重新添加**，然后重启；自带启动页要再重启一次才更新。

卸载：插件页里关掉或移除，界面立刻恢复原样。

## 免责声明

1. **本仓库不包含、也不分发任何画师的插画。** [图片清单](docs/图片清单.md) 只记录主题作者参考过的原作页面链接和 Pixiv 作品 ID，目的是让使用者能找到原作者。
2. **插画版权归各位画师所有。** 在下载、使用（包括只放进自己电脑的插件里自用）、修改（裁剪、抠图、转换格式）或以任何形式传播这些图片之前，**必须先取得原作者的同意**，并遵守原作者提出的使用条件。
3. 未经原作者许可，请勿上传、转发、打包分享这些图片，也不要传播放入了这些图片的插件、截图或录屏；请勿删除画师的签名或水印；请勿用于商业用途或 AI 训练。
4. 使用者因未取得授权而使用、修改、传播他人作品所产生的一切后果和纠纷，由使用者自行承担，与本项目作者无关。
5. 如果你是画师本人，不希望作品出现在清单中，请提交 Issue，会尽快删除相关链接。
6. 《鸣潮》及其角色的版权归库洛游戏所有。本项目为非官方同人作品，与库洛游戏、DeepSeek 均无关联。

## 余额与今日已用怎么算
- **剩余额度**：优先用 DSH 凭据里的 `DEEPSEEK_API_KEY` 查官方接口 `api.deepseek.com/user/balance`；没有 Key 时退回 DSH 登录的 DeepSeek 账号。
- **今日已用**：DeepSeek 没有「今日用量」接口，插件按北京时间每天记账——同一天里余额每少一次就累加，充值不算用量，每 15 分钟自动记一次。第一次运行的那天只能从开始记账的时刻算起。
- API Key 只在内存里用来发请求，不写日志、不写文件、不传给页面。

## 数据存放
DSH 桌面版每次启动端口会变，浏览器存储会丢，所以设置、自定义背景、记账本都存在本机文件：
`%APPDATA%\dsh-carlotta-theme\`（非 Windows：`~/.dsh-carlotta-theme/`）。

## 目录
| 路径 | 内容 |
| --- | --- |
| `lib/` | 插件代码（`client.js` 界面与皮肤，`index.js` 本机服务，`splash.js` 启动页替换，`quota.js` 余额） |
| `assets/fonts/` | 字体子集（SIL OFL 1.1，许可证在 `licenses/`） |
| `assets/img/crest.svg` | 插件图标 |
| `assets/bg/`、`assets/boot/`、`assets/img/` | **你自己放的插画**（不入库） |
| `docs/图片清单.md` | 原作链接、作品 ID、画师 |
| `docs/插图教程.md` | 取得授权、下载、放图、调整构图的详细步骤 |
| `tools/prepare.py` | 把图片转成插件要的尺寸 / 格式 / 文件名（不联网） |
| `tools/images.json` | 图片清单的机器可读版本 |
| `test/` | 测试 |

## 开发与测试
```bash
node test/host.test.mjs
```
宿主路由测试：素材、设置读写、背景上传、拒绝外部请求、余额与今日已用记账、启动页替换。

```bash
node test/serve.mjs
```
打开 http://127.0.0.1:47811/ ：用 DSH 颜色变量搭的模拟界面加载插件，余额是假数据。

## 致谢与许可
- 代码：MIT（见 [LICENSE](LICENSE)）。**MIT 许可只覆盖本仓库的代码，不覆盖任何插画。**
- 字体：[Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)、[Caveat](https://fonts.google.com/specimen/Caveat)、[站酷小薇](https://fonts.google.com/specimen/ZCOOL+XiaoWei)、[站酷庆科黄油体](https://fonts.google.com/specimen/ZCOOL+QingKe+HuangYou)、[站酷快乐体](https://fonts.google.com/specimen/ZCOOL+KuaiLe)，均为 SIL Open Font License 1.1。
- 测试页用到的 React UMD：MIT。
- 写法参考了社区插件 dsh-peak-valley、DeepSeek-Balance-Whale-Widget、dsh-plugin-eva-theme、deepseek-harness-shorekeeper-theme、dsh-theme-endfield。
- 感谢 [图片清单](docs/图片清单.md) 里的每一位画师。
