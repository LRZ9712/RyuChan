---
title: Genie-TTS部署教程
description: ''
pubDate: 2026-04-19T18:56
image: /images/tts/db6c793464de9f3b.png
draft: false
tags: [tts]
categories: []
---

### 一、环境与依赖准备
首先，更新系统软件源并安装必要的系统依赖，包括 Python、Git 以及用于拉取大语言模型文件的 Git LFS。

```bash
sudo apt update
sudo apt install python3 python3-pip git git-lfs -y

# 初始化 Git LFS
git lfs install
```

### 二、项目初始化与模型配置
在系统目录中创建专门的项目文件夹，并安装 TTS 核心 Python 库。

```bash
mkdir -p ~/genie-tts-server
cd ~/genie-tts-server

# 安装 tts 核心依赖
pip install genie-tts
```

接着，在 `genie-tts-server` 目录下创建一个 `models` 文件夹，将下载好的模型文件放置到该目录中。
- 模型下载地址：[Genie-TTS-model (原神模型包)](https://github.com/LRZ9712/Genie-TTS-model/releases/tag/%E5%8E%9F%E7%A5%9E)
- 目录结构如图所示：
![](/images/tts/54f405ceea488280.png)


### 三、编写启动脚本
在项目根目录（`~/genie-tts-server`）下创建并编辑 `server.py` 文件。以下是完整的 Python 脚本内容，默认配置为加载“甘雨”的语音模型：

```python
import genie_tts as genie
import os

# 配置：模型仓库的路径
MODEL_BASE_PATH = "models" 

# 检查路径是否存在
if not os.path.exists(MODEL_BASE_PATH):
    print(f"错误：找不到 {MODEL_BASE_PATH} 文件夹。请确保你已经正确下载了模型文件。")
    exit(1)

print("正在初始化 Genie-TTS...")

# --- 加载角色模型 ---
# 默认加载甘雨模型，需确保模型文件位于 models/甘雨 目录下
try:
    genie.load_character(
        character_name='甘雨', 
        onnx_model_dir=os.path.join(MODEL_BASE_PATH, '甘雨'),
        language='zh'
    )
    print("✅ 甘雨 模型加载成功")
except Exception as e:
    print(f"⚠️ 甘雨 模型加载失败: {e}")

# --- 启动服务 ---
print("\n🚀 正在启动服务器，监听 0.0.0.0:8000 ...")
genie.start_server(
    host="0.0.0.0",
    port=8000,
    workers=1
)
```

### 四、系统内存与 Swap 优化
为了防止在加载大模型时因内存不足导致进程被系统强制结束（OOM Kill），需要优化内存分配机制并扩充 4GB 的 Swap 虚拟内存。这是给2-2小内存服务器的操作，鸡大可以不用看。

```bash
# 1. 清理页面缓存、目录项和 inode
sync && echo 3 > /proc/sys/vm/drop_caches

# 2. 调整内核内存策略
echo 1 > /proc/sys/vm/overcommit_memory     # 允许过度使用内存
echo 50 > /proc/sys/vm/vfs_cache_pressure   # 降低内核杀进程的倾向
echo 80 > /proc/sys/vm/swappiness           # 提高使用 Swap 的倾向

# 3. 重新创建并挂载 4GB Swap 交换文件
swapoff /swapfile
dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 4. 清空内核历史日志，方便后续排错
dmesg -c
```

### 五、启动与验证服务
应用更保守的 Python 内存管理策略，在后台启动服务进程，最后通过日志确认程序是否成功运行。

```bash
# 开启保守的内存管理与日志屏蔽
export PYTHONUNBUFFERED=1
export TF_CPP_MIN_LOG_LEVEL=3

# 在后台启动服务器并将输出重定向到 log.txt
nohup python3 server.py > log.txt 2>&1 &

# 实时查看启动日志
tail -f log.txt
```

当你在日志中看到 `✅ 甘雨 模型加载成功` 以及 `Uvicorn running on http://0.0.0.0:8000` 时，就代表服务器已经大功告成了！
