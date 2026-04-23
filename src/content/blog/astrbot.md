---
title: astrbot机器人部署教程
description: 面向新手小白的astrbot部署教程
pubDate: 2026-04-21T20:26
image: /images/astrbot/d67e6db03124dabe.png
draft: false
tags:
  - 机器人
  - astrbot
  - bot
categories:
  - 教程
badge: ''
---
这是一篇面向没有服务器与网络基础的新人小白教程。如果你已经有相关经验，建议直接阅读 [AstrBot 官方文档](https://github.com/AstrBotDevs/AstrBot)。

### 购买服务器

玩 Bot 推荐使用海外服务器，体验更舒适。后续如果使用国内服务器，很多情况需要配置代理，而海外服务器则无需处理直连和反代等问题。当然，如果你是各大云厂商的新用户，也推荐去购买他们的新人福利机（一般在 68 到 79 元这个价格区间）。

配置建议：2核 4G 起步。
系统选择：Ubuntu 22 版本。
推荐购买链接：[核云（高性价比海外服务器）](https://www.heyunidc.cn/aff/GLOOWAZZ)

![local-image:ol60qbdh](/images/astrbot/8c847f16a89c1630.png)

### 连接 SSH

购买完成后，进入服务器管理页面，找到你的服务器信息（如下图所示）。
![local-image:bogmsuz0](/images/astrbot/b8b4b0ab6437a5bd.png)

接着下载并安装 SSH 客户端工具：[SSH 工具下载地址](https://www.hostbuf.com/t/988.html)。

打开工具，点击文件图标：
![local-image:f5phtyr1](/images/astrbot/340676104bc3cc6d.png)

再点击“添加服务器”，选择 SSH 连接：
![local-image:ld2xhjr2](/images/astrbot/586d34f5a5bcb065.png)

按照下图填写服务器对应的 IP、用户名（通常是 root）和密码，即可成功连接。
![local-image:e4crx4ii](/images/astrbot/44b494be84aa6cb0.png)

### 安装宝塔面板

新手都给我安装宝塔，可以避免很多麻烦，也可以更好的文件管理。
在 SSH 终端的输入框内粘贴以下命令并回车：

```bash
wget -O install_panel.sh https://download.bt.cn/install/install_panel.sh && sudo bash install_panel.sh ed8484bec
```

安装过程中只需要等待几秒，提示确认时输入 `Y`。等待它安装完成后，终端会输出宝塔面板的登录地址和账号密码，请妥善保存。信息出来后复制ipv4地址到浏览器打开输入账号密码登录即可（进入宝塔首页会推荐很多工具安装，别装）手机也可以不用绑，刷新即可



### 部署 AstrBot

登录宝塔面板后，按照以下步骤依次操作即可完成部署：

1. 在左侧菜单点击“docker”，点击安装。
![](/images/astrbot/6e294f6174cea74b.png)
2. 打开“文件”，进入 `root` 文件夹，在里面创建一个名为 `astrbot` 的新文件夹。
![](/images/astrbot/0a9e10254aad2205.png)
3. 进入 `astrbot` 文件夹，新建一个文件并命名为 `docker-compose.yml`。
![](/images/astrbot/e43bfbb15f8a70e9.png)
4. 双击打开 `docker-compose.yml`，将以下配置代码粘贴进去并保存。

```yaml
services:
  napcat:
    environment:
      - NAPCAT_UID=${NAPCAT_UID:-1000}
      - NAPCAT_GID=${NAPCAT_GID:-1000}
      - MODE=astrbot
    ports:
      - "6099:6099"
      - "3000:3000"
      - "3005:3005"      
    container_name: qq
    restart: always
    image: mlikiowa/napcat-docker:latest
    volumes:
      - ./data:/AstrBot/data
      - ./napcat/config:/app/napcat/config
      - ./ntqq:/app/.config/QQ
    networks:
      - net_qq

  astrbot:
    environment:
      - TZ=Asia/Shanghai
    image: soulter/astrbot:latest
    container_name: astrbot
    restart: always
    ports:
      - "6185:6185" 
      - "9000-9050:9000-9050"  # 添加 9000-9050 端口范围映射
    volumes:
      - ./data:/AstrBot/data
    networks:
      - net_qq

networks:
  net_qq:
    driver: bridge

```

5. 在 `astrbot` 文件夹所在页面的上方，点击“终端”图标打开当前目录的命令行。
![local-image:lwns11uq](/images/astrbot/2e6a679ff3688427.png)

6. 在终端中输入以下部署命令并回车。

```bash
docker compose up -d
```

等待安装完成即可，这一步完了就已经彻底部署完成了！你的后台访问地址如下：
- QQ 后台：`你的服务器IP:6099`
- AstrBot 后台：`你的服务器IP:6185`

### 配置防火墙放行

如果你发现上面两个后台进不去，通常是因为防火墙没有放行相关端口。

首先，如果你用的是腾讯云、阿里云等大厂云，必须在**云服务商的控制台后台**放行 `6185` 和 `6099` 端口（以腾讯云为例）：
![local-image:fw2gnedb](/images/astrbot/97b84907a21ed7b5.png)
![local-image:vwrp3pmc](/images/astrbot/cc2204f19f73a0c3.png)

如果放行后还是进不去，说明服务器系统本身也有防火墙在拦截。请回到 SSH 工具，执行以下命令放行端口：

```bash
sudo ufw allow 6185
sudo ufw allow 6099
```

最后，记得去**宝塔面板**的“安全”界面，关闭宝塔自带的防火墙或者把这两个端口添加进去：
![local-image:ldldurm5](/images/astrbot/f4169e510fb16bf8.png)

这三步做完不可能进不去。OK，部署正式完成，剩下的就只有在后台里的配置问题了！


### 连接与登录 QQ

这里以 QQ 平台为例其他平台自己摸索下，打开napcat后台(`您的服务器IP:6099`)
会出现token让你输入正确token
回到宝塔，点文件，点开这个文件就可以查看token，后续自己改掉
![local-image:h0mrd1cm](/images/astrbot/b3b4be8fbe111b0d.png)
![local-image:awiyhurm](/images/astrbot/9c3504aa00f2d58b.png)

输入 Token 进入后台后，使用手机 QQ 扫码登录。支持与手机端同时在线。

### 配置网络

进去之后点网络配置。默认会有一个默认的在里边，按下边截图填写即可。如果没有默认的一个配置，新建一个即可,类型选择 **Websocket 客户端**。
![local-image:qt3raslm](/images/astrbot/e92f053c62b65649.png)

### 然后对接astrbot

1. 打开 AstrBot 后台（`您的服务器IP:6185`），点击左侧菜单的“机器人”，选择 **OneBot** 协议。
![local-image:znfzrx88](/images/astrbot/78da06f932735cc4.png)

2. 按照下图填写
![local-image:7me5pdbc](/images/astrbot/f18e17576699d28e.png)

3. 填写完毕后，点击“保存”，对接完成

### 检查运行状态

可以点开日志查看是否有连接成功的提醒
![local-image:mota92vy](/images/astrbot/5af22f599d2fc46d.png)