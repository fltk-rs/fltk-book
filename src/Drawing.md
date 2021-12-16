# Drawing things

fltk-rs provides free functions in the draw module which allow you to draw custom elements. The drawing works only if the calls are done in a context which allows drawing, such as in the WidgetBase::draw() method or in an Offscreen context:

## Drawing in widgets

Notice we use the draw calls inside our widget's draw method:
```rust
use fltk::{enums, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    win.end();
    win.show();

    win.draw(|w| {
        use draw::*;
        // fill the window white
        draw_rect_fill(0, 0, w.w(), w.h(), enums::Color::White);
        // draw a blue pie
        set_draw_color(enums::Color::Blue.inactive());
        draw_pie(w.w() / 2 - 50, w.h() / 2 - 50, 100, 100, 0.0, 360.0);
        // draw angled red text
        set_draw_color(enums::Color::Red);
        set_font(enums::Font::Courier, 16);
        draw_text_angled(45, "Hello World", w.w() / 2, w.h() / 2);
    });

    a.run().unwrap();
}
```

![draw](https://user-images.githubusercontent.com/37966791/145693473-defb2298-fc6b-4d2f-8a0c-3d4902b39dd3.jpg)

We've used the whole window as our canvas, but it can be any widget as well. Other available functions allow drawing lines, rects, arcs, pies, loops, polygons, even images.

## Offscreen drawing
Sometimes you would like to draw things in response to events, such as when the patients pushes and drags the cursor. In this case, you can use a draw::Offscreen to do that. In that case, we use the widget's draw method to just copy the Offscreen contents, while we do our drawing in the widget's handle method:
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

Notice how we open an Offscreen context using offs.begin() then close it with offs.end(). This allows us to call drawing functions inside the Offscreen.

![image](https://user-images.githubusercontent.com/37966791/146173813-67038a94-7739-480e-a181-29498aac842a.png)