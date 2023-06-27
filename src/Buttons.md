# 按钮 Buttons

Button组件的用处很多，它有多种形式：
- [Button](https://docs.rs/fltk/latest/fltk/button/struct.Button.html)
- [CheckButton](https://docs.rs/fltk/latest/fltk/button/struct.CheckButton.html)
- [LightButton](https://docs.rs/fltk/latest/fltk/button/struct.LightButton.html)
- [RadioButton](https://docs.rs/fltk/latest/fltk/button/struct.RadioButton.html)
- [RadioLightButton](https://docs.rs/fltk/latest/fltk/button/struct.RadioLightButton.html)
- [RadioRoundButton](https://docs.rs/fltk/latest/fltk/button/struct.RadioRoundButton.html)
- [RepeatButton](https://docs.rs/fltk/latest/fltk/button/struct.RepeatButton.html)
- [ReturnButton](https://docs.rs/fltk/latest/fltk/button/struct.ReturnButton.html)
- [RoundButton](https://docs.rs/fltk/latest/fltk/button/struct.RoundButton.html)
- [ShortcutButton](https://docs.rs/fltk/latest/fltk/button/struct.ShortcutButton.html)
- [ToggleButton](https://docs.rs/fltk/latest/fltk/button/struct.ToggleButton.html)

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

单选按钮（`RadioRoundButton`、`RadioLightButton`和`RadioButton`）也带有它们的一些值，但在父组件（任何实现`GroupExt`的组件都可以作为父组件）中只有一个可以被选中。因此说，这些组件是可以访问到同一个组合中其他相应组件的值的：
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

<div align="center">
![image](https://user-images.githubusercontent.com/37966791/145727291-8be40de6-8ec6-4e57-bb29-fa0f0ac3b251.png)
</div>

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

<div align="center">
![image](https://user-images.githubusercontent.com/37966791/145727325-7e5bb45f-674e-4bb2-81c8-27d0ee391d34.png)

</div>


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

<div align="center">
![image](https://user-images.githubusercontent.com/37966791/145727352-bf6dba5c-1a0c-4da4-8296-093e10470f0c.png)
</div>

# 组件效果预览

<div align="center">

###  Button

![Button](https://user-images.githubusercontent.com/98977436/245810478-9bb5dd60-714c-4407-b7b5-c3ab060af70b.PNG)

###  CheckButton

![CheckButton](https://user-images.githubusercontent.com/98977436/245810469-2414d2aa-8a7d-461e-ae39-768a5fe3e99d.PNG)

###  LightButton

![LightButton](https://user-images.githubusercontent.com/98977436/245810476-22dda4d2-c8b4-4f24-bd0a-da672877bb9b.PNG)

###  RadioButton

![RadioButton](https://user-images.githubusercontent.com/98977436/245810480-07a9c7b6-7578-4678-8b99-342a00dfb978.PNG)

###  RadioLightButton

![RadioLightButton](https://user-images.githubusercontent.com/98977436/245810483-f5a4602a-34dd-4312-bdd3-9773d9207854.PNG)

###  RadioRoundButton

![RadioRoundButton](https://user-images.githubusercontent.com/98977436/245810485-e842f808-0be9-44ac-971e-4ea549cd5b23.PNG)

###  RepeatButton

![RepeatButton](https://user-images.githubusercontent.com/98977436/245810489-d1c29b47-c51a-46c9-9948-179bc9802a76.PNG)

###  RoundButton

![RoundButton](https://user-images.githubusercontent.com/98977436/245810490-b5b9fcfd-38c8-4108-99d6-d22f50f7496e.PNG)

###  ShortcutButton

![ShortcutButton](https://user-images.githubusercontent.com/98977436/245810494-88930640-862a-4825-9592-488046da8907.PNG)

###  ToggleButton

![ToggleButton](https://user-images.githubusercontent.com/98977436/245810496-25c7b144-fb9c-44de-b1f8-02b0586eb391.PNG)

</div>