# 边框类型 FrameTypes

FLTK提供了丰富的边框类型。这些可以在`enums`mod下找到：
![image](https://github.com/fltk-rs/fltk-rs/raw/master/screenshots/frames.jpg)

你可以用`WidgetExt::set_frame()`来为组件选择边框。一些组件或Trait也支持`set_down_frame()`方法：
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

在这里，我们将Frame的`FrameType`设置为`EngravedBox`，你可以看到图片周围出现的边框。

​`ButtonExt Trait`支持使用`set_down_frame()`：
```rust
btn1.set_frame(enums::FrameType::RFlatBox);
btn1.set_down_frame(enums::FrameType::RFlatBox);
```

此外，我们可以使用`app::set_frame_type_cb()`来改变我们选择的相应`FrameTypes`的绘制方式：
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

这就用自定义的`down_box`绘制方法改变了默认的`DownBox`。我们还可以在绘制方法中使用`ImageExt::draw()`来绘制图像（比如画一个svg图像，以获得可缩放的圆角边框）。