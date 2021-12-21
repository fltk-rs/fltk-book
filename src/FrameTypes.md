# FrameTypes

FLTK has a wide range of frame types. These can be found under the enums module:
![image](https://github.com/fltk-rs/fltk-rs/raw/master/screenshots/frames.jpg)

These can be set using WidgetExt::set_frame(). Some widgets/traits also support set_down_frame():
```rust
use fltk::{app, enums::FrameType, frame::Frame, image::SvgImage, prelude::*, window::Window};

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    let mut wind = Window::new(100, 100, 400, 300, "Hello from rust");

    let mut frame = Frame::default().with_size(360, 260).center_of(&wind);
    frame.set_frame(FrameType::EngravedBox);
    let mut image = SvgImage::load("screenshots/RustLogo.svg").unwrap();
    image.scale(200, 200, true, true);
    frame.set_image(Some(image));

    wind.make_resizable(true);
    wind.end();
    wind.show();

    app.run().unwrap();
}
```
![image](https://github.com/fltk-rs/fltk-rs/raw/master/screenshots/hello.jpg)
Here we set the frame's FrameType to EngravedBox, which you can see around the image.

ButtonExt supports set_down_frame():
```rust
btn1.set_frame(enums::FrameType::RFlatBox);
btn1.set_down_frame(enums::FrameType::RFlatBox);
```

Furthermore, we can change the draw routine for our FrameTypes using app::set_frame_type_cb():
```rust
use fltk::{
    enums::{Color, FrameType},
    prelude::*,
    *
};

fn down_box(x: i32, y: i32, w: i32, h: i32, c: Color) {
    draw::draw_box(FrameType::RFlatBox, x, y, w, h, Color::BackGround2);
    draw::draw_box(FrameType::RoundedFrame, x - 10, y, w + 20, h, c);
}

fn main() {
    let app = app::App::default();
    app::set_frame_type_cb(FrameType::DownBox, down_box, 0, 0, 0, 0);
    let mut w = window::Window::default().with_size(480, 230).with_label("Gui");
    w.set_color(Color::from_u32(0xf5f5f5));

    let mut txf = input::Input::default().with_size(160, 30).center_of_parent();    
    txf.set_color(Color::Cyan.darker());

    w.show();

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/146932070-ae63fd63-3f37-4d97-978e-4604d2bc0e4b.png)

This changes the default DownBox with a custom down_box routine. We can also ImageExt::draw() inside our draw routines to draw images (Like svg images to get scalable rounded borders).