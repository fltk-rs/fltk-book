# 输入输出 Input & Output

FLTK提供的输入/输出组件均实现了`InputExt trait`。在`Input`和`Output` mod中可以找到这些组件：
- Input
- IntInput
- FloatInput
- MultilineInput
- SecretInput
- FileInput
- Output
- MultilineOutput

实现了`InputExt trait`的组件都会携带一个文本值，对应用户输入的文本，可以用`value()`方法获得文本值，用`set_value()`方法修改文本值：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 100).column().center_of_parent();
    let label = frame::Frame::default().with_label("Enter age");
    let input = input::IntInput::default();
    let mut btn = button::Button::default().with_label("Submit");
    flex.end();
    win.end();
    win.show();

    btn.set_callback(move |btn| {
        println!("your age is {}", input.value());
    });

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727249-2fa4d384-2bd3-41fd-bbae-61a3a33b12f6.png)

需要注意的是，我们使用了`IntInput`来限制用户只能输入整数值。虽然用户不能再输入字符了，但就开发者而言，`value()`获取到的文本值仍然是一个`String`。

`Output`组件的值不能被用户修改，可以视作一个无法编辑的输入框：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(200, 50).column().center_of_parent();
    let label = frame::Frame::default().with_label("Check this text:");
    let mut output = output::Output::default();
    output.set_value("You can't edit this!");
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727261-88ec533f-200b-4df7-a570-76ebd2ba520a.png)

也可以使用`InputExt::set_readonly(bool)`方法将`Input`组件设置为只读：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let flex = group::Flex::default().with_size(100, 100).column().center_of_parent();
    let label = frame::Frame::default().with_label("Enter age");
    let mut input = input::IntInput::default();
    let mut btn = button::Button::default().with_label("Submit");
    flex.end();
    win.end();
    win.show();

    btn.set_callback(move |btn| {
        println!("your age is {}", input.value());
        input.set_readonly(true);
    });

    a.run().unwrap();
}
```
这会在用户输入内容并按下按钮后让文本框不可修改。
