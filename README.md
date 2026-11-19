# dsh-carlotta-theme · 珂莱塔主题

给 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 桌面版用的《鸣潮》珂莱塔主题插件。非官方同人作品，与库洛游戏、DeepSeek 无关。

## 功能
- **五套皮肤**，一键切换：

  | 皮肤 | 明暗 | 装饰动效 |
  | --- | --- | --- |
  | 晶棱玫瑰 · 夜宴 | 暗 | 冰晶飘落 + 火花 |
  | 晶棱玫瑰 · 白昼 | 亮 | 冰晶飘落 + 火花 |
  | 璀璨 | 暗 | 冰晶 + 彩虹光带 |
  | 休憩日 | 亮 | 四叶草飘落 |
  | 盛夏 | 亮 | 光斑 + 气泡 |

- **全窗口换色**：DSH 所有窗口（主界面、工作台、设置、插件、轨迹、右侧栏、菜单、弹窗、提示）的颜色都来自约 100 个 `--dsw-alias-*` 变量，插件用官方 `ctx.theme.overrideTokens` 整套替换，不用逐个窗口去改。
- **背景图 + 动效**：每套皮肤一张背景，可在设置里换成自己的图片 / GIF / 视频；可调透明度、模糊、压暗。
- **启动画面**：每套皮肤一个，打开 DSH 时播放最后一次使用的那套，点击或 ESC 跳过。
- **替换 DSH 自带启动页**（设置里可关）：DSH 的「正在启动」页面在插件加载之前就显示，插件只能改安装目录里的 `resources/splash.html`。
  第一次替换前会备份成 `splash.html.carlotta-orig`，关闭开关即还原；DSH 更新覆盖后插件会自动重新替换。
  替换生效后，打开 DSH 直接显示珂莱塔启动画面，进入界面时无缝淡出。
- **侧栏**：皮肤徽章 + Carlotta 字样、渐变「新会话」按钮、底部 Q 版珂莱塔。
- **余额与今日已用**：点 Q 版，弹出 DeepSeek 剩余额度和今日已用。
- **设置页**集成在 DSH 设置左栏「珂莱塔主题」。
- 兼容 [dsh-peak-valley](https://github.com/dmscode/dsh-peak-valley)：峰谷条自动跟随皮肤配色。

## ⚠ 插画素材不在仓库里
背景图、启动图、Q 版图都是画师的作品，**本仓库不包含**。不放图插件也能用（只有配色、动效和徽章），想要完整效果请按 [assets/ART.md](assets/ART.md) 自行准备图片放进 `assets/` 对应位置，或者直接在设置里给每套皮肤上传自己的背景。

## 安装
设置 → 插件 → 添加插件，填本仓库克隆到本地的目录（绝对路径），装好后重启 DSH 桌面端。

```bash
git clone https://github.com/xunnian0721-code/dsh-carlotta-theme.git
```

卸载：插件页里关掉或移除，界面立刻恢复原样。

## 余额与今日已用怎么算
- **剩余额度**：优先用 DSH 凭据里的 `DEEPSEEK_API_KEY` 查官方接口 `api.deepseek.com/user/balance`；没有 Key 时退回 DSH 登录的 DeepSeek 账号。
- **今日已用**：DeepSeek 没有「今日用量」接口，插件按北京时间每天记账——同一天里余额每少一次就累加，充值不算用量，每 15 分钟自动记一次。第一次运行的那天只能从开始记账的时刻算起（卡片会提示），之后每天零点接上前一天的余额。
- API Key 只在内存里用来发请求，不写日志、不写文件、不传给页面。

## 数据存放
DSH 桌面版每次启动端口会变，浏览器存储会丢，所以设置、自定义背景、记账本都存在本机文件：
`%APPDATA%\dsh-carlotta-theme\`（非 Windows：`~/.dsh-carlotta-theme/`）。

## 开发与测试
```bash
node test/host.test.mjs
```
宿主路由测试：素材、设置读写、背景上传、拒绝外部请求、余额与今日已用记账。

```bash
node test/serve.mjs
```
打开 http://127.0.0.1:47811/ ：用 DSH 颜色变量搭的模拟界面加载插件，余额是假数据。

## 致谢与许可
- 代码：MIT（见 [LICENSE](LICENSE)）。
- 字体：[Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)、[Caveat](https://fonts.google.com/specimen/Caveat)，SIL Open Font License 1.1。
- 测试页用到的 React UMD：MIT。
- 写法参考了社区插件 dsh-peak-valley、DeepSeek-Balance-Whale-Widget、dsh-plugin-eva-theme、deepseek-harness-shorekeeper-theme、dsh-theme-endfield。
- 珂莱塔及《鸣潮》相关形象版权归库洛游戏所有。
