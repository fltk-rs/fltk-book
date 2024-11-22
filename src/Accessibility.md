# Accessibility

FLTK offers several accessibility features out of the box:

## Keyboard navigation among and within ui elements

This is automatically enabled by FLTK.
Depending on the order of widget creation, and whether a widget receives focus, you can use the arrow keys or the tab and shift-tab keys to navigate to the next/previous widget.
Similarly for menu items, you can navigate using the keyboard.

## Keyboard shortcuts

Button widgets and Menu widgets provide a method which allows setting the keyboard shortcut:
```rust
use fltk::{prelude::*, *};

let mut menu = menu::MenuBar::default().with_size(800, 35);
menu.add(
    "&File/New...\t",
    Shortcut::Ctrl | 'n',
    menu::MenuFlag::Normal,
    |_m| {},
);

let mut btn = button::Button::new(100, 100, 80, 30, "Click me");
btn.set_shortcut(enums::Shortcut::Ctrl | 'b');
```
## Keyboard alternatives to pointer actions

This is automatically enabled by FLTK.
Depending on whether an item has a by default CallbackTrigger::EnterKey trigger, or the trigger is set using `set_trigger`, it should fire the callback when the enter key is pressed.
Buttons, for example, respond to the enter key automatically if they have focus. To change the trigger for a widget:
```rust
use fltk::{prelude::*, *};

let mut inp = input::Input::new(10, 10, 160, 30, None);
inp.set_trigger(enums::CallbackTrigger::EnterKey);
inp.set_callback(|i| println!("You clicked enter, and the input's current text is: {}", i.value()));
```

## IME support

The input method editor is automatically enabled for languages which require it like Chinese, Japanese and Korean. FLTK uses the OS provided IME in this case.

## Keyboard screen scaling

Similar to many web browsers, FLTK has 3 default global shortcuts (Ctrl/+/-/0/ [Cmd/+/-/0/ under macOS]) that change the value of the GUI scaling factor. Ctrl+ zooms-in all app windows of the focussed display (all displays under macOS); Ctrl- zooms-out these windows; Ctrl 0 restores the initial value of the scaling factor.

## The ability to customize key events for your widgets, even custom widgets

Using the WidgetExt::handle method, you can customize how widgets handle events, including key events. 

```rust
use fltk::{prelude::*, *};

let mut win = window::Window::default().with_size(400, 300);
win.handle(|w, ev| {
    enums::Event::KeyUp => {
        let key = app::event_key();
        match key {
            enums::Key::End => app::quit(), // just an example
            _ => {
                if let Some(k) = key.to_char() {
                    match k {
                        'q' => app::quit(),
                        _ => (),
                    }
                }
            },
        }
        true
    }, 
    _ => false,
});
```

## Screen reader support

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

A demonstration video can be found [here](https://www.youtube.com/watch?v=x53Rxjg8IF8).