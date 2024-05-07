翻译最近更新于：2024/05/07

翻译已基本完成，受限于译者水平，内容有错误和不足，欢迎大家提交Issue 和 PullRequest 一起改进！

# 开始

欢迎来到 [fltk-rs](https://github.com/fltk-rs/fltk-rs) 教程 !

这是为 [fltk crate](https://crates.io/crates/fltk) 而写的一本说明书。 其他资源有:
- [官方文档](https://docs.rs/fltk)
- [视频](https://github.com/fltk-rs/fltk-rs#tutorials)
- [讨论、社区](https://github.com/fltk-rs/fltk-rs/discussions)
- [示例](https://github.com/fltk-rs/fltk-rs/tree/master/fltk/examples)
- [示范](https://github.com/fltk-rs/demos)
- [7guis-fltk-rs](https://github.com/tdryer/7guis-fltk-rs)
- [FLTK-RS-Examples](https://github.com/wyhinton/FLTK-RS-Examples)
- Erco's FLTK cheat [page](http://seriss.com/people/erco/fltk/), 一份优秀的FLTK C++ 参考 

[FLTK](https://github.com/fltk/fltk) 是一个跨平台的轻量级 GUI库。
该库自身是使用 C++98编写的，具有高度可移植性。 fltk crate 是使用 rust 编写的，它是通过FFI来调用一个 使用C89和C++11编写的FLTK封装器 [cfltk](https://github.com/MoAlyousef/cfltk)。

该库的构造极其简洁，对习惯使用面向对象GUI库的开发者比较友好。该封装本身也遵循简化文档的相同模型，因为方法的名称与C++所对应的函数是相同或类似的。这使得 FLTK C++ 的文档变得非常简单，因为这些方法基本上是相互对映的。

C++：

```c++
#include <FL/Fl_Window.H>

int main() {
    auto wind = new Fl_Window(100, 100, 400, 300, "My Window");
    wind->end();
    wind->show();
}
```
映射为Rust后：
```rust
use fltk::{prelude::*, window};

fn main() {
    let mut wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

为什么选择 FLTK ？
- 轻量。二进制文件简小，`strip` 后仅有大约1MB。 [低内存占用](https://szibele.com/memory-footprint-of-gui-toolkits/)。
- 快速。安装快、构建快、启动快、运行快。
- 仅有一个运行文件。不需要配置DDL库。
- 向前兼容，支持旧架构。
- FLTK的允许性许可证，允许闭源应用静态链接。
- 主题化 (4款默认支持的主题: Base, GTK, Plastic and Gleam)，以及 [fltk-theme](https://crates.io/crates/fltk-theme) 中的其他主题。
- 提供了约80个可供自定义的 widget。
- 内置图像支持。

## 用法

将以下代码添加到你的 Cargo.toml 文件:
```toml
[dependencies]
fltk = "^1.4"
```

使用捆绑库（适用于 x64 windows (msvc & gnu (msys2)), x64 linux & macos）:
```toml
[dependencies]
fltk = { version = "^1.4", features = ["fltk-bundled"] }
```

该库提供了特定平台的绑定，它会自动编译,并使用静态链接的方式链接到你的二进制文件中。

现在编写我们的第一个示例，导入必要的 fltk 模块：

```rust
use fltk::{prelude::*, window::Window};

fn main() {
    let mut wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

运行这段示例，你会发现并没有什么反应。我们还需要使用一行代码运行事件循环（event loop），这相当于在C++中使用`Fl::run()`：
```rust
use fltk::{app, prelude::*, window::Window};

fn main() {
    let a = app::App::default();
    let mut wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
    a.run().unwrap();
}
```
这段代码中，我们实例化了 App 结构，它会初始化运行时（runtime）和样式（styles）。在程序的末尾，我们调用 run() 函数来让程序正常工作。

## 贡献本书
这本书是使用 [mdbook](https://github.com/rust-lang/mdBook)，根据 [fltk-book](https://github.com/fltk-rs/fltk-book) 仓库的内容生成的。本书的作者为 **Mohammed Alyousef**，由 **Flatig L** 翻译为中文

你可能需要执行 `cargo install mdbook`. 更多说明可以在fltk-book的README文件和mdbook的 [用户指南](https://rust-lang.github.io/mdBook/) 中找到。

你也可以在这里贡献中文翻译 [fltk-book-zh](https://github.com/Flatigers/fltk-book-zh)。
