# 输入输出 Input & Output

输入和输出 widget 实现了InputExt trait。在input&output modules中还可以找到这些：
- Input
- IntInput
- FloatInput
- MultilineInput
- SecretInput
- FileInput
- Output
- MultilineOutput

这种trait的特点是，这些widget会带有一个文本值，可以用value()方法查询，用set_value()方法改变：
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

请注意，我们使用了一个IntInput来限制输入整数值。虽然用户不能输入字符串，但就开发者而言，value()的返回值仍然是一个String。

输出部件不允许用户修改其数值：
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

输入部件也可以使用 InputExt::set_readonly(bool) 方法变成只读：
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
这使我们的输入在用户点击按钮后成为只读。
