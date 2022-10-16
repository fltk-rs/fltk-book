# 图像 Images

FLTK支持矢量图和位图，开箱即提供下列几种图像类型：
- BmpImage
- JpegImage
- GifImage
- PngImage
- SvgImage
- Pixmap
- RgbImage
- XpmImage
- XbmImage
- PnmImage

它还提供了两个helper types：
- SharedImage：它包装了之前所有的类型，所以你不需要指定图像类型。
- TiledImage：它提供了一个任何具体类型的平铺图像（图形学术语）。

图像类型实现了ImageExt trait，提供了允许缩放和检索图像元数据的方法。
Image可以通过向它的load()构造函数传递路径来构建，或者对某些类型可以使用接受图像数据的from_data()构造函数：

```rust
/// 需要一个路径
let image = image::SvgImage::load("screenshots/RustLogo.svg").unwrap();

/// 需要图像数据
let image= image::SvgImage::from_data(&data).unwrap();
```

Image可以通过WidgetExt::set_image()/set_image_scaled()或set_deimage()/set_deimage_scaled()（用于deactivated/grayed image）与widget一起使用。

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

或者通过WidgetExt::draw()方法：
```rust
use fltk::{app, enums::FrameType, frame::Frame, image::SvgImage, prelude::*, window::Window};

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    let mut wind = Window::new(100, 100, 400, 300, "Hello from rust");

    let mut frame = Frame::default().with_size(360, 260).center_of(&wind);
    frame.set_frame(FrameType::EngravedBox);
    let mut image = SvgImage::load("screenshots/RustLogo.svg").unwrap();
    frame.draw(move |f| {
        image.scale(f.w(), f.h(), true, true);
        image.draw(f.x() + 40, f.y(), f.w(), f.h());
    });

    wind.make_resizable(true);
    wind.end();
    wind.show();

    app.run().unwrap();
}
```

![svg](https://github.com/MoAlyousef/fltk-rs/raw/master/screenshots/hello.jpg)

在你的应用程序中使用图像作为图标和背景也有助于赋予你的应用程序以风格。