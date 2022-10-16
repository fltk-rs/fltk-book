# 按钮 Buttons

Button widgets 有多种用途和多种形式：
- Button
- RadioButton
- ToggleButton
- RoundButton
- CheckButton
- LightButton
- RepeatButton
- RadioLightButton
- RadioRoundButton

这些可以在可以在 button module 中找到。
其中最简单的就是Button，它在用户点击时产生一些行为。当然所有的按钮都会这样：

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

然而其他按钮可以带有表示自己某些属性的其他值（value）：
例如CheckButton, ToggleButton, LightButton 拥有它们当前状态（比如，是否被选中）的信息。



单选按钮（RadioRoundButton、RadioLightButton和RadioButton）也带有它们的一些值，但在parent group（任何实现GroupExt的widget）中只有一个可以被切换。所以这些组件是知道其他按钮的值的：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 200).column().center_of_parent();
    // only one can be toggled by the user at a time, the other will be automatically untoggled
    let btn1 = button::RadioRoundButton::default().with_label("Option 1");
    let btn2 = button::RadioRoundButton::default().with_label("Option 2"); 
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```

(可以用clear_visible_focus()方法`btn1.clear_visible_focus()`来删除焦点框）

![image](https://user-images.githubusercontent.com/37966791/145727291-8be40de6-8ec6-4e57-bb29-fa0f0ac3b251.png)

其他可切换的按钮没有这个属性。

你可以使用ButtonExt::value()方法查询一个按钮是否被切换：

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
            println!("btn1 is checked");
        }
    });

    a.run().unwrap();
}
```
CheckButton还提供了一个方便的方法is_checked()，而radio buttons提供了一个is_toggled()：

![image](https://user-images.githubusercontent.com/37966791/145727325-7e5bb45f-674e-4bb2-81c8-27d0ee391d34.png)

默认情况下，可切换的按钮在创建时是不可切换的，然而这可以用set_value()，或者方便的方法set_checked()（对CheckButton使用）和set_toggled()（对radio buttons使用）来重写：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 200).column().center_of_parent();
    let mut btn1 = button::CheckButton::default().with_label("Option 1");
    btn1.set_value(true);
    // Similarly you can use btn1.set_checked(true)
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
