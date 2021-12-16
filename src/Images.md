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
    let mut frame = frame::Frame::new(0, 0, 400, 300, "");
    let mut image = image::SvgImage::load("screenshots/RustLogo.svg").unwrap();
    image.scale(200, 200, true, true);
    frame.set_image(Some(image));
```

Or via WidgetExt::draw() method:
```rust
    let mut frame = frame::Frame::new(0, 0, 400, 300, "");
    let mut image = image::SvgImage::load("screenshots/RustLogo.svg").unwrap();
    frame.draw2(move |f| {
        image.scale(f.width(), f.height(), true, true);
        image.draw(f.x(), f.y(), f.width(), f.height());
    });
```

![svg](https://github.com/MoAlyousef/fltk-rs/blob/master/screenshots/hello.jpg)

Using images in your app for icons and backgrounds also helps in giving your app its style.