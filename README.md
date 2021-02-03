[![Build Status](https://github.com/axetroy/vd/workflows/ci/badge.svg)](https://github.com/axetroy/vd/actions?query=workflow%3Aci)

# Video Downloader

一个支持多线程下载的视频下载工具

支持的站点

| 站点                                 | 状态                                                                          | 说明                  |
| ---------------------------------- | --------------------------------------------------------------------------- | ------------------- |
| [Youtube](https://youtube.com)     | ![Build Status](https://github.com/axetroy/vd/workflows/youtube/badge.svg)  | **需要科学上网**          |
| [Bilibili](https://bilibili.com)   | ![Build Status](https://github.com/axetroy/vd/workflows/bilibili/badge.svg) | 不支持番剧/电影/集合下载，视频无声音 |
| [5dm.tv](https://www.5dm.tv)       | ![Build Status](https://github.com/axetroy/vd/workflows/5dm/badge.svg)      |                     |
| [Haokan](https://haokan.baidu.com) | ![Build Status](https://github.com/axetroy/vd/workflows/haokan/badge.svg)   |                     |
| [PornHub](https://pornhub.com)     | ![Build Status](https://github.com/axetroy/vd/workflows/pornhub/badge.svg)  | **需要科学上网**          |
| [XVideos](https://xvideos.com)     | ![Build Status](https://github.com/axetroy/vd/workflows/xvideos/badge.svg)  | **需要科学上网**          |
| [xnxx](https://xnxx.com)           | ![Build Status](https://github.com/axetroy/vd/workflows/xnxx/badge.svg)     | **需要科学上网**          |

## 安装

> 在使用前请先安装 [Deno](https://github.com/denoland/deno) v1.7.x

在终端输入以下命令进行安装

```bash
deno install \
  --unstable \
  --allow-read \
  --allow-write \
  --allow-net \
  --allow-run \
  --allow-env \
  --no-check \
  --reload \
  -f \
  https://github.com/axetroy/vd/raw/v0.2.0/vd.ts
```

查看是否安装成功

```bash
$ vd --help
vd - Video Downloader
A tool focused on downloading videos.

USAGE:
  dv [OPTIONS] <URL>

OPTIONS:
  -n                Number of threads for file download (defaults to: 8)
  --help,-h         Print help information
  --version,-V      Print the version information

EXAMPLE:
  dv "https://video.website/com/play/page"
```

## 使用

```bash
$ vd "https://www.youtube.com/watch?v=fEcnrA6RIzo"

Site:     https://www.youtube.com/watch?v=fEcnrA6RIzo
Title:    No Damage Escape From Steve With Knife Bug !?
Streams:
┌───────┬─────────┬─────────┬──────────────┐
│ (idx) │ quality │   ext   │     size     │
├───────┼─────────┼─────────┼──────────────┤
│   1   │ "480p"  │ ".mp4"  │ "731.14 KiB" │
│   2   │ "480p"  │ ".webm" │ "580.31 KiB" │
│   3   │ "360p"  │ ".mp4"  │ "346.88 KiB" │
│   4   │ "360p"  │ ".webm" │ "315.96 KiB" │
│   5   │ "240p"  │ ".mp4"  │ "321.53 KiB" │
│   6   │ "240p"  │ ".webm" │ "174.04 KiB" │
│   7   │ "144p"  │ ".mp4"  │ "142.08 KiB" │
│   8   │ "144p"  │ ".webm" │ "99.74 KiB"  │
└───────┴─────────┴─────────┴──────────────┘
Please Enter the Number to download [1] 7
Downloading 'https://r1---sn-i3belnl6.googlevideo.com/videoplayback?expire=1604262373&ei=hcWeX9z4ENKFlQTZ1bCYBg&ip=1.36.218.215&id=o-ADEx7AwJ09Rh4NnfzzUrT25o1phAC3fmUiNsVAH48Vxt&itag=160&aitags=133%2C134%2C135%2C160%2C242%2C243%2C244%2C278&source=youtube&requiressl=yes&mh=tF&mm=31%2C26&mn=sn-i3belnl6%2Csn-npoeenl7&ms=au%2Conr&mv=m&mvi=1&pl=19&initcwndbps=800000&vprv=1&mime=video%2Fmp4&ns=iQyQNV8P9ovE0BHxD4J93KYF&gir=yes&clen=145494&dur=10.634&lmt=1393271156539824&mt=1604240671&fvip=1&keepalive=yes&c=WEB&n=X7yCgpPLsS4kHXT&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIgONW2beEtltU7cR0E9GGqgHqvPzgTld8wpHQJXe8FDSECIQCrbpyAFM_cK5LhFSRRTWGVm5KNJbist9f4xidG_lD9Nw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgQWDeDA5QO3V_ADlwYYJUGreIVqMVE4zCFziP4UZRIToCIQCKaEFwG7vib7Libmous7hiL_5XVPO-Nbx2wFAPWJlfjg%3D%3D'
145494/145494 fEcnrA6RIzo_144p.mp4 1.1s [==========================================] 100.00% 210Kb/s
Download complete.
```

## 使用例子

```bash
# 下载 Youtue
$ vd "https://www.youtube.com/watch?v=fEcnrA6RIzo"
# 下载 Bilibili
$ vd "https://www.bilibili.com/video/BV11K411A7eo"
# 下载 5md.tv
$ vd "https://www.5dm.tv/bangumi/dv43066"
# 下载 haokan.baidu.com
$ vd "https://haokan.baidu.com/v?vid=13675044210054905324"
# 下载 PornHub
$ vd "https://www.pornhub.com/view_video.php?viewkey=ph5dc34284a0844"
# 下载 XVideos
$ vd "https://www.xvideos.com/video57010397/scared_teen_stepsisters_pranked_by_stepbro_during_halloween"
```

## 免责声明

该工具意在交流学习，请准守当地法律法规，您的一切行为以及产生的法律后果都由使用者承担，与此工具作者无关。

**在您使用该工具时，既代表同意这一准则**

## 开源许可

The [MIT License](LICENSE)
