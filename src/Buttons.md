Button widgets serve multiple purposes and come in several forms:
- Button
- RadioButton
- ToggleButton
- RoundButton
- CheckButton
- LightButton
- RepeatButton
- RadioLightButton
- RadioRoundButton

These can be found in the button module.
The simplest of which is the Button widget, which basically runs some action when clicked. This applies to all buttons as well:
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

However other buttons can have other value.
CheckButton, ToggleButton, LightButton for example hold their current value, i.e. whether they were toggled or not:

Radio buttons (RadioRoundButton, RadioLightButton and RadioButton) also hold their value, but only one can be toggled in the parent group (any widget implementing GroupExt). So they are aware of the values of other radio buttons:
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

(The focus box can be removed using the clear_visible_focus() method `btn1.clear_visible_focus()`).
![image](https://user-images.githubusercontent.com/37966791/145727291-8be40de6-8ec6-4e57-bb29-fa0f0ac3b251.png)

Other toggle-able buttons don't have this property.

You can query whether a button is toggled or not using the ButtonExt::value() method:
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
CheckButton also provides a convenience method is_checked(), while radio buttons provide an is_toggled().

![image](https://user-images.githubusercontent.com/37966791/145727325-7e5bb45f-674e-4bb2-81c8-27d0ee391d34.png)

By default, toggle-able buttons are created untoggled, however this can be overridden using set_value(), or the convenience methods set_checked() (for CheckButton) and set_toggled() (for radio buttons):
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
            println!("btn1 is checked");
        }
    });

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727352-bf6dba5c-1a0c-4da4-8296-093e10470f0c.png)