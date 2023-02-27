# App 结构

Fltk crate的app模块中有一个App结构体。初始化App结构体，将会初始化所有内部样式、字体和支持的图像类型。它还会初始化程序将要在其中运行的多线程环境。
```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```
run方法将会启动gui程序的事件循环（event loop）。
如果要对事件进行细粒度控制，可以使用wait()方法：

```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    while app.wait() {
        // 处理事件
    }
}
```

此外，可以在App的实例上使用`with_scheme()`来设置程序的全局主题：
```rust
use fltk::*;

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gtk);
    app.run().unwrap();
}
```
这将你的程序的主题设置为GTK。还有其他的内置主题方案，Basic、Plastic和Gleam（有一个`fltk-theme crate`提供了更多主题，你也可以自定义主题让它看起来更好看(^ο^)）。

还可以在App的实例上调用`load_system_fonts()`方法，让程序在启动时加载系统字体。

一个典型的fltk-rs程序将在创建任何组件并显示窗口之前创建App结构体。

任何写在调用`run()`方法后的代码，将在事件循环结束后执行（通常是关闭程序的所有窗口时，或者调用`quit()`方法时）。这包括必要时重启程序的指令等。

除了App结构体外，`app`模块本身还包含与你的程序的全局状态有关的结构体和自由函数。其中包括设置背景色和前景色，以及默认字体和大小等视觉效果，还有屏幕功能、剪贴板功能、全局事件处理器、程序事件、通道（发送器和接收器）和超时等。

其中一些将在本书的其他部分讨论。

    原文名词对照：
    自由函数 - free functions
    屏幕，剪切板功能 - screen functions, clipboard functions
    全局事件处理器 - global handler
    程序事件 - app events
    通道，发送器和接收器 - channels, sender and receiver
