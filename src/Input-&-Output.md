# Input & Output

Input and Output widgets implement the InputExt trait. These are found between the input and output modules:
- Input
- IntInput
- FloatInput
- MultilineInput
- SecretInput
- FileInput
- Output
- MultilineOutput

The hallmark of this trait is that these widgets have a textual value which can be queried using the value() method, and changed using the set_value() method:
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

Notice that we used an IntInput to limit ourselves to integral values. Even though for the user they can't enter strings, the return of value() is still a String as far as the developer is concerned.

Output widgets don't allow the user to modify their values:
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

Input widgets also support being made read-only using the InputExt::set_readonly(bool) method:
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
This makes our input read-only once the user hits the button.
