# Accessibility

FLTK offers several accessibility features out of the box:
- Keyboard navigation among and within ui elements.
- Keyboard shortcuts.
- Keyboard alternatives to pointer actions.
- IME support.
- The ability to customize key events for your widgets, even custom widgets.

Screen reader support is currently implemented as an external crate:
- [fltk-accesskit](https://github.com/fltk-rs/fltk-accesskit)

This uses the accesskit crate to complete the accessibility story for FLTK.

Example:
```rust
#![windows_subsystem = "windows"]
use fltk::{prelude::*, *};
use fltk_accesskit::{AccessibilityContext, AccessibleApp};

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Oxy);
    let mut w = window::Window::default()
        .with_size(400, 300)
        .with_label("Hello fltk-accesskit");
    let col = group::Flex::default()
        .with_size(200, 100)
        .center_of_parent()
        .column();
    let inp = input::Input::default().with_id("inp").with_label("Enter name:");
    let mut btn = button::Button::default().with_label("Greet");
    let out = output::Output::default().with_id("out");
    col.end();
    w.end();
    w.make_resizable(true);
    w.show();

    btn.set_callback(btn_callback);

    let ac = AccessibilityContext::new(
        w,
        vec![Box::new(inp), Box::new(btn), Box::new(out)],
    );

    a.run_with_accessibility(ac).unwrap();
}

fn btn_callback(_btn: &mut button::Button) {
    let inp: input::Input = app::widget_from_id("inp").unwrap();
    let mut out: output::Output = app::widget_from_id("out").unwrap();
    let name = inp.value();
    if name.is_empty() {
        return;
    }
    out.set_value(&format!("Hello {}", name));
}
```
The Accessible trait is implemented for several FLTK widgets.
The example requires instantiating an fltk_accesskit::AccessibilityContext, in which you pass the root (main window) and the widgets you want recognized by the screen-reader. 
Then you would run the App struct using the special method `run_with_accessibility`.