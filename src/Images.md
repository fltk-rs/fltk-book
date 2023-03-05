# 图像 Images

FLTK支持矢量图和位图，提供下面几种开箱即用的图像类型：
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
- SharedImage：它包装了上述所有的类型，使用时不需要提供图像的类型。
- TiledImage：它提供了任何具体类型的平铺图像（Tiled Image）。

图像类型均实现了`ImageExt Trait`，该Trait中定义了缩放和检索图像元数据的方法。
可以通过向图像类型的`load()`函数传递图像路径来显示图像，对于某些类型，可以使用`from_data()`接收图像数据来构建图像：

```rust
/// 需要图像路径
let image = image::SvgImage::load("screenshots/RustLogo.svg").unwrap();

/// 需要图像数据
let image= image::SvgImage::from_data(&data).unwrap();
```

可以通过使用`WidgetExt::set_image()`/`set_image_scaled()`或`set_deimage()`/`set_deimage_scaled()`（用于deactivated/grayed image）在其他组件上使用`Image`组件：

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

或者通过`WidgetExt::draw()`方法：
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

使用`Image`作为你的程序的图标或背景将让你的程序更具风格化，更加美观（在FLTK中你可能需要使用其他主题或自定义）。