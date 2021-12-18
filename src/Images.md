# Images

FLTK supports vector and raster graphics, and out of the box offers several image types, namely:
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

It also defines 2 more helper types:
- SharedImage: which wraps all the previous types so you don't need to specify the image type.
- TiledImage: which offers a tiled image of any of the concrete types.

Image types implement the ImageExt trait which offers methods to allow scaling, and retrieving image metadata. 
Images can be constructed by passing a path to the image's load() constructor, or for some types, by using a from_data() constructor which accepts image data.

```rust
/// Takes a path
let image = image::SvgImage::load("screenshots/RustLogo.svg").unwrap();

/// Takes data
let image= image::SvgImage::from_data(&data).unwrap();
```

Images can be used with widgets either via the WidgetExt::set_image()/set_image_scaled() or set_deimage()/set_deimage_scaled() (for deactivated/grayed image):

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

Or via WidgetExt::draw() method:
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

Using images in your app for icons and backgrounds also helps in giving your app its style.