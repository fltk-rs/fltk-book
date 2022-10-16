# 窗口 Windows

FLTK会在它支持的系统平台上调用原生窗口，然后基本上通过自己的方法来绘制。它会在windows上调用HWND，在MacOS上调用NSWindow，在X11系统（linux, BSD）上调用XWindow。

Window 本身具有与FLTK提供的其他部件相同的接口，即WidgetExt trait，这将在下一页讨论。

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

调用new()函数需要五个参数：
- `x` 以电脑屏幕最左侧为原点的水平距离。
- `y` 以电脑屏幕最左侧为原点的垂直距离。
- `width` window的宽度。
- `height` window的高度。
- `title` window标题。

接下来注意对end()的调用。window，以及其他类型的widget，实现了GroupExt trait。实现该trait的这些部件将 持有 任何在call()和end()间创建的widget（通过new()创建串口时，隐式调用了begin()），或者作为其父widget。
下一个调用show()唤起了window，使其出现在显示屏上。

window可以被嵌入到其他window内：

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

在这里，第二个窗口，my_window2，被嵌入到第一个窗口，my_window里面。我们把它的颜色设为黑色，这样它才会被我们看到。注意，它的父窗口是第一个窗口。在父窗口之外创建第2个窗口才会创建两个独立的窗口，不要忘记还要调用show()：
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

可以使用my_window.set_border(false)方法实现无边框窗口：

![image](https://user-images.githubusercontent.com/37966791/100937639-565cdd80-3504-11eb-8cf6-e135243c38b0.png)

set_border(bool)方法是WindowExt trait的一部分，除了WidgetExt和GroupExt trait外，FLTK中的所有窗口类型都实现了它。
所有trait的列表可以在crates的prelude module中找到：

[文档](https://docs.rs/fltk/*/fltk/prelude/index.html)