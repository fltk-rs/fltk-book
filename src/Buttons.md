# 按钮 Buttons

Button组件的用处很多，它有多种形式：
- Button
- RadioButton
- ToggleButton
- RoundButton
- CheckButton
- LightButton
- RepeatButton
- RadioLightButton
- RadioRoundButton

这些组件可以在 `Button mod` 中找到。
其中最简单的就是`Button`组件，它能在发生点击事件时执行一些行为。当然所有的按钮都可以这样：

```rust
use fltk::{app, button::Button, frame::Frame, prelude::*, window::Window};

fn main() {
    let app = app::App::default();
    let mut wind = Window::default().with_size(400, 300);
    let mut frame = Frame::default().with_size(200, 100).center_of(&wind);
    let mut but = Button::new(160, 210, 80, 40, "Click me!");
    wind.end();
    wind.show();

    but.set_callback(move |_| frame.set_label("Hello world"));

    app.run().unwrap();

}
```

其他一些按钮可以带有表示自己某些属性的其他值：
例如`CheckButton`, `ToggleButton`, `LightButton` 带有表示它们当前状态（比如，是否被选中）的信息。

单选按钮（RadioRoundButton、RadioLightButton和RadioButton）也带有它们的一些值，但在父组件（任何实现GroupExt的组件都可以作为父组件）中只有一个可以被选中。因此说，这些组件是可以访问到同一个组合中其他相应组件的值的：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 200).column().center_of_parent();
    // 用户同一时间只能选中一个按钮，选中后，另一个会被取消选中
    let btn1 = button::RadioRoundButton::default().with_label("Option 1");
    let btn2 = button::RadioRoundButton::default().with_label("Option 2"); 
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```

可以用`clear_visible_focus()`方法来取消焦点（`btn1.clear_visible_focus()`）

![image](https://user-images.githubusercontent.com/37966791/145727291-8be40de6-8ec6-4e57-bb29-fa0f0ac3b251.png)

其他可选择的按钮没有这个属性。

`ButtonExt::value()`方法会返回一个布尔值，表示一个按钮是否被选中：

```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 200).column().center_of_parent();
    let btn1 = button::CheckButton::default().with_label("Option 1");
    let btn2 = button::CheckButton::default().with_label("Option 2");
    let mut btn3 = button::Button::default().with_label("Submit");
    flex.end();
    win.end();
    win.show();

    btn3.set_callback(move |btn3| {
        if btn1.value() {
            println!("btn1 is checked");
        }
        if btn2.value() {
            println!("btn2 is checked");
        }
    });

    a.run().unwrap();
}
```
`CheckButton`还提供了一个方便的方法`is_checked()`，一系列`RadioButton`提供了`is_toggled()`用来判断：

![image](https://user-images.githubusercontent.com/37966791/145727325-7e5bb45f-674e-4bb2-81c8-27d0ee391d34.png)

默认情况下，可选择的按钮在创建时都是没有选中的，但这可以用`set_value()`，（`CheckButton`可以使用的）`set_checked()`和（RadioButton可以使用的）`set_toggled()`等方法来默认选中一个按钮：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 200).column().center_of_parent();
    let mut btn1 = button::CheckButton::default().with_label("Option 1");
    btn1.set_value(true);
    // 同样可以使用 btn1.set_checked(true)
    let btn2 = button::CheckButton::default().with_label("Option 2");
    let mut btn3 = button::Button::default().with_label("Submit");
    flex.end();
    win.end();
    win.show();

    btn3.set_callback(move |btn3| {
        if btn1.value() {
            println!("btn1 is checked");
        }
        if btn2.value() {
            println!("btn2 is checked");
        }
    });

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727352-bf6dba5c-1a0c-4da4-8296-093e10470f0c.png)
