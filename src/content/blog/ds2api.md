---
title: 部署逆向deepseek项目ds2api
description: 逆向deepseek实现模型接口自由
pubDate: 2026-05-03T17:32
image: /images/ds2api/b87c62913ed7eb1d.jpg
draft: false
tags:
  - 逆向
  - 教程
  - deepseek
categories:
  - 教程
badge: ''
---
> 教程只面向小白，有基础的直接看作者项目地址：[https://github.com/CJackHwang/ds2api](https://github.com/CJackHwang/ds2api)

### 1. 打开宝塔面板的文件管理（没有的小白都给我装）
在 **root** 目录下新建一个项目文件夹命名为 `ds2api`

![local-image:0ctk1vtc](/images/ds2api/86133a342025ce4b.png)

### 2. 进入 ds2api 文件夹点击终端

![local-image:xpr8fzhz](/images/ds2api/68e8e9b19b1fc566.png)

依次输入这两个命令：
```bash
curl -O https://raw.githubusercontent.com/CJackHwang/ds2api/main/config.example.json
cp config.example.json config.json
```

### 3. 配置 docker-compose
然后叉掉终端，回到 `ds2api` 文件夹内，新建文件命名为：`docker-compose.yml`
![](/images/ds2api/f61749a54a9ff0fe.png)
双击编辑刚新建的 `docker-compose.yml`，把下边内容复制进去保存：
```yaml
services:
  ds2api:
    image: ghcr.io/cjackhwang/ds2api:latest
    container_name: ds2api
    restart: always
    ports:
      - "6011:5001"  # 宿主机端口 6011 映射到容器 5001
    environment:
      - DS2API_ADMIN_KEY=admin123 # 管理后台的登录密码可以自行更换
      - DS2API_CONFIG_PATH=/data/config.json
      - TZ=Asia/Shanghai
    volumes:
      - ./config.json:/data/config.json:rw  # 映射配置文件，必须可写以保存 Token
    user: "root" # 确保容器有权修改挂载的 config.json
```

### 4. 运行容器
再点终端，输入 `docker-compose up -d` 回车（**一定要在 ds2api 文件夹内点**）等待 docker 跑完即可。

![local-image:iry26inl](/images/ds2api/1e3792b3da0a9d66.png)

### 5. 放行端口
跑完后放行 **6011** 端口，请在你的服务器平台防火墙放行 6011，这边以腾讯云为例：

![local-image:0chedjq6](/images/ds2api/9dc0cbab83303527.png)

### 6. 登录 ds2api 面板
浏览器访问：`http://你的服务器IP:6011/admin`
默认密码为：**admin123**

---

### 7. 账号添加建议流程
到这步就已经是部署完成了，下边说下账号建议添加流程。

账号建议都用**微软邮箱**创建账号添加，因为微软邮箱注册简单，不想自己手动注册也可以去咸鱼买现成的，微软邮箱账号很便宜的。有了邮箱之后，再用国外节点去 deepseek 官网用微软邮箱注册账号，注册完把邮箱和注册时的密码填入这里添加即可。

![local-image:0t2qzhan](/images/ds2api/21f2c70f9c7d2c4e.png)

### 8. 调用接口
接口是 **OpenAI 兼容接口**：
`http://你的服务器ip:6011/v1`

**key** 取决于你这边设置的：

![local-image:1p8zb76m](/images/ds2api/07c5653727e0143c.png)

# 完成 🎉