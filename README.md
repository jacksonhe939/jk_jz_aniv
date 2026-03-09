# zjy & ljz Anniversary Site

一个给 `ljz` 的一周年纪念静态网站，包含：

- 浪漫开场页
- 回忆照片画廊
- 时间线故事区
- `Words to Say` 信件区
- 一键下载明信片 PNG
- GitHub Pages 自动部署工作流

## 如何替换照片

当前相册使用的是这些预留路径：

- `assets/photos/photo-01.jpg`
- `assets/photos/photo-02.jpg`
- `assets/photos/photo-03.jpg`
- `assets/photos/photo-04.jpg`
- `assets/photos/photo-05.jpg`
- `assets/photos/photo-06.jpg`

你可以直接创建 `assets/photos/` 目录，然后把你们的照片按上面的文件名放进去。

也可以修改 `script.js` 顶部的 `photoMemories` 数组，把 `image` 改成你自己的图片地址。

## 发布到 GitHub Pages

1. 把当前项目推送到 GitHub 仓库。
2. 打开仓库的 `Settings -> Pages`。
3. 在 `Build and deployment` 里选择 `GitHub Actions`。
4. 等待 `Deploy Anniversary Site` 工作流跑完。
5. 页面地址通常会是：

`https://jacksonhe939.github.io/jk_jz_aniv/`

仓库地址：
[https://github.com/jacksonhe939/jk_jz_aniv.git](https://github.com/jacksonhe939/jk_jz_aniv.git)
