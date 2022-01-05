# Animations

Animations can be shown in fltk-rs using several mechanism:
- Leveraging the event loop
- Spawning threads
- Timeouts


## Leveraging the event loop

fltk offers app::wait() and app::check() which allow updating the ui during a blocking operation:
```rust
use fltk::{enums::*, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.set_color(Color::White);
    // our button takes the whole left side of the window
    let mut sliding_btn = button::Button::new(0, 0, 100, 300, None);
    style_btn(&mut sliding_btn);
    win.end();
    win.show();

    sliding_btn.set_callback(|btn| {
        if btn.w() > 0 && btn.w() < 100 {
            return; // we're still animating
        }
        while btn.w() != 0 {
            btn.set_size(btn.w() - 2, btn.h());
            app::sleep(0.016);
            btn.parent().unwrap().redraw();
            app::wait(); // or app::check();
        }
    });
    a.run().unwrap();
}

fn style_btn(btn: &mut button::Button) {
    btn.set_color(Color::from_hex(0x42A5F5));
    btn.set_selection_color(Color::from_hex(0x42A5F5));
    btn.set_frame(FrameType::FlatBox);
}
```

## Spawning threads

This ensures we don't block the main/ui thread:
```rust
use fltk::{enums::*, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.set_color(Color::White);
    // our button takes the whole left side of the window
    let mut sliding_btn = button::Button::new(0, 0, 100, 300, None);
    style_btn(&mut sliding_btn);
    win.end();
    win.show();

    sliding_btn.set_callback(|btn| {
        if btn.w() > 0 && btn.w() < 100 {
            return; // we're still animating
        }
        std::thread::spawn({
            let mut btn = btn.clone();
            move || {
                while btn.w() != 0 {
                    btn.set_size(btn.w() - 2, btn.h());
                    app::sleep(0.016);
                    app::awake(); // to awaken the ui thread
                    btn.parent().unwrap().redraw();
                }
            }
        });
    });
    a.run().unwrap();
}

fn style_btn(btn: &mut button::Button) {
    btn.set_color(Color::from_hex(0x42A5F5));
    btn.set_selection_color(Color::from_hex(0x42A5F5));
    btn.set_frame(FrameType::FlatBox);
}
```

## Timeouts

fltk offers timeouts for recurring operations. We can add a timeout, repeat it and remove it:
```rust
use fltk::{enums::*, prelude::*, *};

fn move_button(mut btn: button::Button, handle: app::TimeoutHandle) {
    btn.set_size(btn.w() - 2, btn.h());
    btn.parent().unwrap().redraw();
    if btn.w() == 20 {
        app::remove_timeout3(handle);
    } else {
        app::repeat_timeout3(0.016, handle);
    }
}

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.set_color(Color::White);
    let mut btn = button::Button::new(0, 0, 100, 300, None);
    style_btn(&mut btn);
    btn.clear_visible_focus();
    win.end();
    win.show();

    btn.set_callback(|b| {
        let btn = b.clone();
        app::add_timeout3(0.016, move |handle| {
            let btn = btn.clone();
            move_button(btn, handle)
        });
    });

    a.run().unwrap();
}

fn style_btn(btn: &mut button::Button) {
    btn.set_color(Color::from_hex(0x42A5F5));
    btn.set_selection_color(Color::from_hex(0x42A5F5));
    btn.set_frame(FrameType::FlatBox);
}
```

We basically add the timeout when the user clicks the button, and depending on the size of the button we either repeat it or remove it.
