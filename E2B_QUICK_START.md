# 🚀 E2B Code Interpreter - 快速上手指南

## ⚡ 5 分钟快速开始

### 步骤 1: 获取 E2B API Key (2 分钟)

1. 访问 **[E2B Dashboard](https://e2b.dev/dashboard)**
2. 点击 **Sign Up** 注册账户（支持 GitHub 登录）
3. 登录后，点击 **Create API Key**
4. 复制生成的 API Key（格式: `e2b_...`）

---

### 步骤 2: 配置环境变量 (1 分钟)

打开项目根目录的 `.env.local` 文件，添加：

```env
E2B_API_KEY=e2b_your_api_key_here
```

如果文件不存在，从模板创建：
```bash
cp .env.local.example .env.local
```

---

### 步骤 3: 重启开发服务器 (30 秒)

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

---

### 步骤 4: 配置用户 API Key (30 秒)

1. 打开浏览器访问 http://localhost:3000
2. 点击右上角的 **⚙️ 设置图标**
3. 选择 API 提供商（OpenAI 或 Anthropic）
4. 输入您的 API Key
5. 点击 **Save API Key**

---

### 步骤 5: 执行 Python 代码 (1 分钟)

1. 在左侧文件树点击 **src/main.py**
2. 查看编辑器上方的绿色 **▶ Run** 按钮
3. 点击 Run 按钮
4. 在底部终端查看执行结果！

---

## 🎯 第一次运行

### 示例代码

打开 `src/main.py`，会看到：

```python
# Welcome to Codex IDE
import sys

def main():
    print("Hello from Codex IDE!")
    print("This is a professional VS Code-like interface")
    
    # Example: Calculate fibonacci
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    
    for i in range(10):
        print(f"Fibonacci({i}) = {fibonacci(i)}")

if __name__ == "__main__":
    main()
```

### 点击 Run 后的输出

```
╔════════════════════════════════════════╗
║  Executing Python Code via E2B...    ║
╚════════════════════════════════════════╝

✓ Execution completed (1234ms)

Output:
Hello from Codex IDE!
This is a professional VS Code-like interface
Fibonacci(0) = 0
Fibonacci(1) = 1
Fibonacci(2) = 1
Fibonacci(3) = 2
Fibonacci(4) = 3
Fibonacci(5) = 5
Fibonacci(6) = 8
Fibonacci(7) = 13
Fibonacci(8) = 21
Fibonacci(9) = 34

$ 
```

---

## 🧪 测试代码示例

### 1. Hello World
```python
print("Hello from E2B Sandbox!")
print("Python is running in the cloud!")
```

### 2. 简单计算
```python
# 计算圆的面积
import math

radius = 5
area = math.pi * radius ** 2
print(f"半径 {radius} 的圆面积: {area:.2f}")
```

### 3. 列表操作
```python
# 数字处理
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print("原始:", numbers)
print("平方:", squared)
print("总和:", sum(squared))
```

### 4. 字符串处理
```python
# 文本分析
text = "Hello from Codex IDE!"
print(f"长度: {len(text)}")
print(f"大写: {text.upper()}")
print(f"单词: {text.split()}")
```

### 5. 函数定义
```python
# 温度转换
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

temps = [0, 20, 37, 100]
for c in temps:
    f = celsius_to_fahrenheit(c)
    print(f"{c}°C = {f}°F")
```

---

## 🎨 终端输出说明

### 成功执行
```
✓ Execution completed (1234ms)  ← 绿色勾号 + 执行时间

Output:                          ← 白色标题
[您的代码输出]                   ← 标准输出

$ 
```

### 执行错误
```
✗ Execution failed               ← 红色叉号

Error:                           ← 红色标题
NameError: name 'x' is not defined  ← 错误详情

$ 
```

### 警告信息
```
Warnings/Info:                   ← 黄色标题
[警告或信息内容]                 ← stderr 输出
```

---

## 💡 使用技巧

### 技巧 1: 清空终端
在终端输入 `clear` 命令：
```
$ clear
```

### 技巧 2: 查看帮助
在终端输入 `help` 命令：
```
$ help
```

### 技巧 3: 多次执行
可以多次点击 Run 按钮：
- 每次执行都会在终端显示新结果
- 执行历史保留在终端中

### 技巧 4: 代码片段
尝试这些有趣的代码：

**当前时间:**
```python
from datetime import datetime
print(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
```

**随机数:**
```python
import random
print("随机数:", random.randint(1, 100))
print("掷骰子:", random.randint(1, 6))
```

**系统信息:**
```python
import sys
print("Python 版本:", sys.version)
print("平台:", sys.platform)
```

---

## 🔍 故障排除

### 问题 1: "E2B API key is not configured"

**原因**: 服务器未配置 E2B API Key

**解决**:
```bash
# 1. 检查 .env.local
cat .env.local

# 2. 确保有这行
E2B_API_KEY=e2b_...

# 3. 重启服务器
npm run dev
```

---

### 问题 2: "API key is required"

**原因**: 用户未配置 API Key

**解决**:
1. 点击右上角 ⚙️ 图标
2. 输入 OpenAI 或 Anthropic API Key
3. 保存

---

### 问题 3: Run 按钮是灰色的

**原因**:
- 没有打开文件，或
- 文件内容为空，或
- 未配置 API Key

**解决**:
1. 打开 Python 文件
2. 确保有代码内容
3. 配置 API Key

---

### 问题 4: 执行超时

**原因**: 代码运行时间超过 50 秒

**解决**:
- 优化代码逻辑
- 减少计算量
- 移除无限循环

---

## 📚 更多资源

### 官方文档
- 📖 [E2B_INTEGRATION.md](./E2B_INTEGRATION.md) - 详细集成指南
- 📖 [BYOK_GUIDE.md](./BYOK_GUIDE.md) - API Key 配置
- 📖 [README.md](./README.md) - 项目总览

### 在线资源
- 🌐 [E2B 官网](https://e2b.dev/)
- 📚 [E2B 文档](https://e2b.dev/docs)
- 💬 [E2B Discord](https://discord.gg/U7KEcGErtQ)

---

## 🎯 下一步

### 探索更多功能

1. **AI 代码修复** 🔧
   - 点击 Fix 按钮
   - AI 会自动修复代码错误

2. **代码分析** ✨
   - 点击 Analyze 按钮
   - 获取代码质量建议

3. **AI 聊天** 💬
   - 在右侧聊天面板提问
   - 获得代码帮助和建议

### 尝试高级功能

```python
# 数据可视化
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.title('Sine Wave')
plt.savefig('/tmp/plot.png')
print("图表已保存!")
```

```python
# HTTP 请求
import requests

response = requests.get('https://api.github.com')
print(f"状态码: {response.status_code}")
data = response.json()
print(f"GitHub API 响应: {data.get('current_user_url')}")
```

```python
# 文件操作
with open('/tmp/test.txt', 'w') as f:
    f.write('Hello from E2B Sandbox!')

with open('/tmp/test.txt', 'r') as f:
    content = f.read()
    print(f"文件内容: {content}")
```

---

## 🎉 恭喜！

您已经成功配置并使用 E2B Code Interpreter！

### 现在您可以:
- ✅ 在安全沙箱中执行 Python 代码
- ✅ 查看实时输出和错误
- ✅ 使用丰富的 Python 库
- ✅ 享受专业的 IDE 体验

### 继续探索:
- 🔧 尝试 AI 代码修复
- ✨ 使用代码分析功能
- 💬 与 AI 助手对话
- 📚 阅读详细文档

---

**🚀 开始您的编码之旅！**

*如有问题，请查看 [E2B_INTEGRATION.md](./E2B_INTEGRATION.md) 获取详细帮助。*

**Happy Coding! 🎊**
