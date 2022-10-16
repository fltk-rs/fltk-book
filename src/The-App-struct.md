# App 结构

crate在app模块中提供了一个App结构。初始化App结构可以初始化所有内部样式、字体和支持的图像类型。它还初始化了程序将要运行的多线程环境。
```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```
run方法运行gui应用程序的事件循环（event loop）。
要对事件进行精细的控制，可以使用wait()方法：

```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    while app.wait() {
        // handle events
    }
}
```

此外，App结构允许你使用with_scheme()初始器来设置程序的全局主题：
```rust
use fltk::*;

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gtk);
    app.run().unwrap();
}
```
这将使你的程序具有Gtk程序的样子。还有其他的内置方案，Basic、Plastic和Gleam。

App结构还负责在应用程序开始时使用load_system_fonts()方法加载系统字体。

一个典型的fltk-rs应用程序，将在创建任何部件和显示主窗口之前构建App结构。

任何在run()方法调用后添加的逻辑，将在事件循环结束后执行（通常是关闭应用程序的所有窗口时，或者调用quit()方法时）。该逻辑可能包括在必要时重启程序的逻辑。

除了App结构外，App模块本身还包含与你的程序的全局状态有关的结构和自由函数。其中包括设置背景和前景颜色、默认字体和大小等视觉效果、屏幕功能、剪贴板功能、全局处理器、应用事件、通道（channels）（发送器和接收器）和超时。

其中一些将在本书的其他部分讨论。