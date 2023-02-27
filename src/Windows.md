# 窗口 Windows

FLTK在它支持的系统平台上调用原生窗口，然后基本上是自己绘制图形界面的。它会在windows上调用`HWND`，在MacOS上调用`NSWindow`，在X11系统（linux, BSD）上调用`XWindow`。

Window 与FLTK的其他组件具有相同的接口，`WidgetExt trait`。这将在下一节讨论。

让我们用到目前为止学到的东西来创建一个Window。

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```

![img1](https://user-images.githubusercontent.com/37966791/100937363-f82ffa80-3503-11eb-8f3a-9afe34bdad59.jpg)

调用`new()`方法需要五个参数：
- `x` 从电脑屏幕最左侧开始计算的水平距离。
- `y` 从电脑屏幕最上侧开始计算的垂直距离。
- `width` Window的宽度。
- `height` Window的高度。
- `title` Window的标题。

这里还调用了`end()`方法。`GroupExt Trait`定义了`begin()`方法和`end()`方法，Window以及其他实现了该Trait的组件，将**持有**任何在`begin()`和`end()`方法间创建的组件（通过`new()`创建Window时，隐式调用了`begin()`），或者成为这些组件的父组件。
调用`show()`会让Window出现在屏幕上。

Window可以被嵌入到其他Window内：

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut my_window2 = window::Window::new(10, 10, 380, 280, "");
    my_window2.set_color(Color::Black);
    my_window2.end();
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```
![embed](https://user-images.githubusercontent.com/37966791/100937446-139b0580-3504-11eb-8738-1e4161175d0b.jpg)

在这里创建了第二个窗口`my_window2`，它会被嵌入到第一个窗口`my_window`里面。我们把它的颜色设为黑色，这样我们才能注意到它。注意，它的父组件是第一个Window。在父窗口外创建第2个窗口才会创建出两个独立的窗口，需要注意每个窗口都需要调用`show()`方法才会显示：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();
    let mut my_window2 = window::Window::new(10, 10, 380, 280, "");
    my_window2.end();
    my_window2.show();
    app.run().unwrap();
}
```

可以使用`my_window.set_border(false)`方法取消`my_window`的边框，实现无边框窗口：

![image](https://user-images.githubusercontent.com/37966791/100937639-565cdd80-3504-11eb-8cf6-e135243c38b0.png)

`set_border(bool)`方法也定义在`WindowExt trait`中，除了直线了`WidgetExt Trait`和`GroupExt Trait`的组件外（实现WindowExt需要实现GroupExt，实现GroupExt需要实现WidgetExt），FLTK中的所有窗口类型都实现了该Trait。
所有的Trait可以在fltk crate的`fltk::prelude`模块中找到：

[FLTK Trait文档](https://docs.rs/fltk/*/fltk/prelude/index.html)