# 绘制事物 Drawing things

fltk-rs在draw module中提供了让你绘制自定义元素的自由函数。只有当调用是在允许绘制的上下文中进行时，例如在WidgetBase::draw()方法中或在Offscreen上下文中，绘制才有效：

## 在组件上绘制

注意，我们在widget的draw方法中使用了draw调用：
```rust
use fltk::{enums, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.end();
    win.show();

    win.draw(|w| {
        use draw::*;
        // 白色窗口
        draw_rect_fill(0, 0, w.w(), w.h(), enums::Color::White);
        // 画一个蓝色的圆
        set_draw_color(enums::Color::Blue.inactive());
        draw_pie(w.w() / 2 - 50, w.h() / 2 - 50, 100, 100, 0.0, 360.0);
        // 绘制具有角度的字体
        set_draw_color(enums::Color::Red);
        set_font(enums::Font::Courier, 16);
        draw_text_angled(45, "Hello World", w.w() / 2, w.h() / 2);
    });

    a.run().unwrap();
}
```

![draw](https://user-images.githubusercontent.com/37966791/145693473-defb2298-fc6b-4d2f-8a0c-3d4902b39dd3.jpg)

我们用整个窗口作为我们的画布，也可以是在任何widget上。其他可用的功能允许绘制直线、矩形、弧线、饼、循环、多边形，甚至图像。

## 在屏幕外绘制
有时你想根据事件来画东西，比如推拖光标的时候。在这种情况下，你可以使用draw::Offscreen来做到这一点。在这种情况下，我们使用widget的draw方法只是复制屏幕外的内容，而绘制是在widget的handle方法中进行的。
```rust
use fltk::{
    app,
    draw::{
        draw_line, draw_point, draw_rect_fill, set_draw_color, set_line_style, LineStyle, Offscreen,
    },
    enums::{Color, Event, FrameType},
    frame::Frame,
    prelude::*,
    window::Window,
};
use std::cell::RefCell;
use std::rc::Rc;

const WIDTH: i32 = 800;
const HEIGHT: i32 = 600;

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gtk);

    let mut wind = Window::default()
        .with_size(WIDTH, HEIGHT)
        .with_label("RustyPainter");
    let mut frame = Frame::default()
        .with_size(WIDTH - 10, HEIGHT - 10)
        .center_of(&wind);
    frame.set_color(Color::White);
    frame.set_frame(FrameType::DownBox);

    wind.end();
    wind.show();

    // We fill our offscreen with white
    let offs = Offscreen::new(frame.width(), frame.height()).unwrap();
    #[cfg(not(target_os = "macos"))]
    {
        offs.begin();
        draw_rect_fill(0, 0, WIDTH - 10, HEIGHT - 10, Color::White);
        offs.end();
    }

    let offs = Rc::from(RefCell::from(offs));

    frame.draw({
        let offs = offs.clone();
        move |_| {
            let mut offs = offs.borrow_mut();
            if offs.is_valid() {
                offs.rescale();
                offs.copy(5, 5, WIDTH - 10, HEIGHT - 10, 0, 0);
            } else {
                offs.begin();
                draw_rect_fill(0, 0, WIDTH - 10, HEIGHT - 10, Color::White);
                offs.copy(5, 5, WIDTH - 10, HEIGHT - 10, 0, 0);
                offs.end();
            }
        }
    });

    frame.handle({
        let mut x = 0;
        let mut y = 0;
        move |f, ev| {
            // println!("{}", ev);
            // println!("coords {:?}", app::event_coords());
            // println!("get mouse {:?}", app::get_mouse());
            let offs = offs.borrow_mut();
            match ev {
                Event::Push => {
                    offs.begin();
                    set_draw_color(Color::Red);
                    set_line_style(LineStyle::Solid, 3);
                    let coords = app::event_coords();
                    x = coords.0;
                    y = coords.1;
                    draw_point(x, y);
                    offs.end();
                    f.redraw();
                    set_line_style(LineStyle::Solid, 0);
                    true
                }
                Event::Drag => {
                    offs.begin();
                    set_draw_color(Color::Red);
                    set_line_style(LineStyle::Solid, 3);
                    let coords = app::event_coords();
                    draw_line(x, y, coords.0, coords.1);
                    x = coords.0;
                    y = coords.1;
                    offs.end();
                    f.redraw();
                    set_line_style(LineStyle::Solid, 0);
                    true
                }
                _ => false,
            }
        }
    });

    app.run().unwrap();
}
```

注意我们是如何用offs.begin()打开一个Offscreen上下文，然后用offs.end()关闭它。这使得我们可以在Offscreen内调用绘图函数：

![image](https://user-images.githubusercontent.com/37966791/146173813-67038a94-7739-480e-a181-29498aac842a.png)