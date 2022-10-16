# 开始

欢迎来到 [fltk-rs](https://github.com/fltk-rs/fltk-rs) !

这是为 [fltk crate](https://crates.io/crates/fltk) 而写的一本说明书。 其他资源有:
- [官方文档](https://docs.rs/fltk)
- [视频](https://github.com/fltk-rs/fltk-rs#tutorials)
- [讨论、社区](https://github.com/fltk-rs/fltk-rs/discussions)
- [示例](https://github.com/fltk-rs/fltk-rs/tree/master/fltk/examples)
- [示范](https://github.com/fltk-rs/demos)
- [7guis-fltk-rs](https://github.com/tdryer/7guis-fltk-rs)
- [FLTK-RS-Examples](https://github.com/wyhinton/FLTK-RS-Examples)
- Erco's FLTK cheat [page](http://seriss.com/people/erco/fltk/), which is an excellent FLTK C++ reference. 

[FLTK](https://github.com/fltk/fltk) 是一个跨平台的轻量级 gui库。
该库自身是使用 C++98编写的，具有高度可移植性。 fltk crate 则使用 rust实现，并使用FFI来调用 使用C89和C++11编写的FLTK封装器 [cfltk](https://github.com/MoAlyousef/cfltk)。

该库的构造及其简洁，习惯使用面向对象gui库的开发者会感觉到很熟悉。封装器本身也遵循同样的模式，因为方法的名称与C++的名称相同或相似，这使得文档大大简化。同时也让参考FLTK的C++文档变得非常简单，因为这些方法基本上是相互对应的。

C++：

```c++
int main() {
    auto wind = new Fl_Window(100, 100, 400, 300, "My Window");
    wind->end();
    wind->show();
}
```
Rust：
```rust
fn main() {
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

为什么选择 FLTK ？
- 轻量。二进制文件简小，strip 后仅有大约1MB。 [低内存占用](https://szibele.com/memory-footprint-of-gui-toolkits/)。
- 快速。安装快、构建快、启动快、运行快。
- 仅有一个运行文件。不需要配置DDL库。
- 向前兼容，支持旧架构。
- FLTK的允许性许可证，允许闭源应用静态链接。
- 多主题 (4款默认支持的主题: Base, GTK, Plastic and Gleam)，以及 [fltk-theme](https://crates.io/crates/fltk-theme) 中的其他主题。
- 提供了约80个可供自定义的 widget。
- 内置图像支持。

## 用法

将以下代码添加到你的 Cargo.toml 文件:
```toml
[dependencies]
fltk = "^1.2"
```

使用捆绑的库（适用于 x64 windows (msvc & gnu (msys2)), x64 linux & macos）:
```toml
[dependencies]
fltk = { version = "^1.2", features = ["fltk-bundled"] }
```

该库会自动构建并静态链接到你的二进制文件中。

我们需要导入必要的 fltk 模块，以使我们的第一个rust代码示例工作：

```rust
use fltk::{prelude::*, window::Window};
fn main() {
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

如果你运行代码样本，你可能会发现什么都没有发生。实际上，我们还需要运行事件循环（event loop），这相当于在C++中使用`Fl::run()`：
```rust
use fltk::{app, prelude::*, window::Window};
fn main() {
    let a = app::App::default();
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
    a.run().unwrap();
}
```
我们实例化了 App 结构，它初始化了 runtime 和 styles，在main的最后，我们调用了 run() 函数。

## 为本书做贡献
这本书是使用 [mdbook](https://github.com/rust-lang/mdBook)，根据 [fltk-book](https://github.com/fltk-rs/fltk-book) 仓库的内容生成的。本书的作者为 **Mohammed Alyousef**，由 **Flatig L** 翻译为中文

因此，你可能需要运行 `cargo install mdbook`. 更多说明可以在fltk-book的README文件和mdbook的 [用户指南](https://rust-lang.github.io/mdBook/) 中找到。