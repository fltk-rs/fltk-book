# 组控件 Group widgets

这些组件包括window类型和在group module中发现的其他部件：Group，Scroll，Pack，Tile，Flex ...等等。
实现GroupExt trait的部件具有一个特点，即必须调用`::end()`方法来关闭它们：

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
在上面的例子中，按钮 "btn "的父部件将是window。
在 `end`这样的GroupExt部件后，任何在 `end` 后实例化的其他widget，将在该部件外实例化。
但这些widget仍然可以使用`::add(&other_widget)`方法来添加进去（或使用`::insert`）。

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
另一个选择是重新begin该widget：
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

虽然大多数GroupExt widget需要手动布局，但有几个widget具有自动布局功能。Flex widget在 [布局 layout](Layouts.md)中会讨论。Pack需要子widget的height，这取决于Pack的方向。

一个vertical pack只需要知道它的子widget的height：
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
    frame::Frame::default().with_size(0, 40); // a filler
    button::Button::default().with_size(0, 40).with_label("Submit");
    pack.end();
    wind.end();
    wind.show();

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727469-a7181ebf-a3a3-4675-af23-ec40d847a593.png)

对于一个horizontal pack，我们设置Pack type，然后我们只需要传递子widget的width：
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
    frame::Frame::default().with_size(40, 0); // a filler
    button::Button::default().with_size(40, 0).with_label("Submit");
    pack.end();
    wind.end();
    wind.show();

    app.run().unwrap();
}
```

