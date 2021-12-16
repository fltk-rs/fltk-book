Animations can be shown in fltk-rs using several mechanism:
- Leveraging the event loop
- Spawning threads
- Timeouts


## Leveraging the event loop

fltk offers app::wait() and app::check() which allow updating the ui during a blocking operation:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    // our button takes the whole left side of the window
    let mut sliding_btn = button::Button::new(0, 0, 100, 300, None);
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
```

## Spawning threads

This ensures we don't block the main/ui thread:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    // our button takes the whole left side of the window
    let mut sliding_btn = button::Button::new(0, 0, 100, 300, None);
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
```

## Timeouts

fltk offers timeouts for recurring operations. We can add a timeout, repeat it and remove it:
```rust
extern crate once_cell;
use fltk::{prelude::*, *};

fn move_button(mut btn: button::Button) {
    btn.set_size(btn.w() - 2, btn.h());
    btn.parent().unwrap().redraw();
    if btn.w() == 0 {
        app::remove_timeout(move || {
            let btn = btn.clone();
            move_button(btn);
        });
    } else {
        app::repeat_timeout(0.3, move || {
            let btn = btn.clone();
            move_button(btn);
        });
    }
}

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut btn = button::Button::new(0, 0, 100, 300, None);
    win.end();
    win.show();

    btn.set_callback(|b| {
        let btn = b.clone();
        app::add_timeout(0.016, move || {
            let btn = btn.clone();
            move_button(btn)
        });
    });

    a.run().unwrap();
}
```

We basically add the timeout when the user clicks the button, and depending on the size of the button we either repeat it or remove it.
