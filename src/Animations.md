# 动画 Animations

动画可以通过几种机制在fltk-rs中显示：
- 利用事件循环 Leveraging the event loop
- 使用线程 Spawning threads
- 超时 Timeouts


## 利用事件循环

fltk提供了app::wait()和app::check()，允许在一个阻塞操作中更新ui：
```rust
use fltk::{enums::*, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.set_color(Color::White);
    // 我们的按钮占据了窗口的左侧
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

## 使用线程

这确保我们不会阻塞主/ui线程：
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

## 超时

fltk为重复性操作提供了timeout功能。我们可以添加一个timeout，重复操作或让它消失。
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

我们是在用户点击按钮时加入timeout，根据按钮的大小，我可以重复使用或者删除它。
