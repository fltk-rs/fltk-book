# 组控件 Group widgets

这里介绍的是fltk中的容器控件，包括窗口类型和在`Group` mod中的其他组件，如：Group，Scroll，Pack，Tile，Flex ...等等。
它们都实现了`GroupExt Trait`，该Trait中定义了`end()`方法，这些控件必须调用`::end()`方法来表示其包含的范围结束：

```rust
use fltk::{
    app,
    button::Button,
    prelude::{GroupExt, WidgetBase, WidgetExt},
    window::Window,
};

fn main() {
    let a = app::App::default();
    let mut win = Window::default().with_size(400, 300);
    let _btn = Button::new(160, 200, 80, 30, "Click");
    win.end();
    win.show();
    a.run().unwrap();
}
```
在上面的例子中，按钮 "_btn" 的父组件是Window。
在组控件调用`end()`后创建的其他组件将不被包含在该控件中，即会创建在这个组控件的外面。
但这些组件仍然可以使用`::add(&other_widget)`或`::insert`添加进组控件中。

```rust
use fltk::{
    app,
    button::Button,
    prelude::{GroupExt, WidgetBase, WidgetExt},
    window::Window,
};

fn main() {
    let a = app::App::default();
    let mut win = Window::default().with_size(400, 300);
    win.end();
    win.show();

    let btn = Button::new(160, 200, 80, 30, "Click");
    win.add(&btn);
    
    a.run().unwrap();
}
```
另一个选择是重新调用组控件的`begin()`方法：
```rust
use fltk::{
    app,
    button::Button,
    prelude::{GroupExt, WidgetBase, WidgetExt},
    window::Window,
};

fn main() {
    let a = app::App::default();
    let mut win = Window::default().with_size(400, 300);
    win.end();
    win.show();

    win.begin();
    let _btn = Button::new(160, 200, 80, 30, "Click");
    win.end();

    a.run().unwrap();
}
```

多数实现`GroupExt`的组控件需要手动布局，但还有几个控件可以自动布局。比如`Flex`组件，它会在 [布局 layout](Layouts.md) 中介绍。`Pack`需要设置子组件的高度（height）或宽度（width）进行布局，这取决于Pack是垂直的还是水平的。

Pack默认是垂直的（Vertical），我们只需要设置其中子组件的高度：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(200, 300);
    let mut pack = group::Pack::default_fill();
    pack.set_spacing(5);
    for i in 0..2 {
        frame::Frame::default().with_size(0, 40).with_label(&format!("field {}", i));
        input::Input::default().with_size(0, 40);
    }
    frame::Frame::default().with_size(0, 40); // 占位
    button::Button::default().with_size(0, 40).with_label("Submit");
    pack.end();
    wind.end();
    wind.show();

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727469-a7181ebf-a3a3-4675-af23-ec40d847a593.png)

要设置水平（horizontal）的Pack，我们需要手动设置`with_type()`，然后只需要设置其中子组件的宽度：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(300, 100);
    let mut pack = group::Pack::default_fill().with_type(group::PackType::Horizontal);
    pack.set_spacing(5);
    for i in 0..2 {
        frame::Frame::default().with_size(40, 0).with_label(&format!("field {}", i));
        input::Input::default().with_size(40, 0);
    }
    frame::Frame::default().with_size(40, 0); // 占位
    button::Button::default().with_size(40, 0).with_label("Submit");
    pack.end();
    wind.end();
    wind.show();

    app.run().unwrap();
}
```