# 动画 Animations

可以通过这几种机制在FLTK-rs中制作动画效果：
- 利用事件循环 Event loop
- 使用线程 Spawning threads
- 超时 Timeouts


## 利用事件循环

fltk提供了`app::wait()`和`app::check()`，允许使用一个阻塞操作更新UI：
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
            return; // 绘制已经完成
        }
        while btn.w() != 0 {
            btn.set_size(btn.w() - 2, btn.h());
            app::sleep(0.016);
            btn.parent().unwrap().redraw();
            app::wait(); // 或 app::check();
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

使用线程可以让我们不会阻塞主/ui线程：
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
            return; // 绘制已经完成
        }
        std::thread::spawn({
            let mut btn = btn.clone();
            move || {
                while btn.w() != 0 {
                    btn.set_size(btn.w() - 2, btn.h());
                    app::sleep(0.016);
                    app::awake(); // 唤醒UI线程进行绘制
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

fltk为重复性操作提供了`timeout`功能。使用`timeout`会像循环一样持续性执行一段代码，我们可以添加条件让它持续重复，或者删除`timeout`让它停止。
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

这段代码在用户点击时添加`timeout`，当按钮宽度到达预定值时，删除`timeout`使其停止重复。
