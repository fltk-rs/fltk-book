# Group widgets

These widgets include Window types and others found in the group module: Group, Scroll, Pack, Tile, Flex ...etc.
Widgets implementing the GroupExt trait, are characterized by having to call `::end()` method to basically close them.
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
In the above example, the button `btn` will be parented by the window.
After `end`ing such GroupExt widgets, any other widgets instantiated after the `end` call, will be instantiated outside.
These can still be added using the `::add(&other_widget)` method (or using `::insert`):
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
Another option is to reopen the widget:
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

While most GroupExt widgets require manual layouts, several have automatic layouting. The Flex widget was discussed in the [layouts page](Layouts.md). Packs require the widget or height of the child widget, depending on the Pack's orientation.

A vertical Pack needs to know only the heights of its children:
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

For a horizontal pack, we set the Pack type, then we only need to pass the widths of the children:
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

