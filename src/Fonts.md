# Fonts

FLTK has already 16 fonts which can be found in enums::Font:
- Helvetica
- HelveticaBold
- HelveticaItalic
- HelveticaBoldItalic
- Courier
- CourierBold
- CourierItalic
- CourierBoldItalic
- Times
- TimesBold
- TimesItalic 
- TimesBoldItalic 
- Symbol 
- Screen 
- ScreenBold 
- Zapfdingbats

It also allows loading system and bundled fonts.

System fonts depend on the system, and are not loaded by default. These can be loaded using the App::load_system_fonts() method.
The fonts can then be acquired using the app::fonts() function or be queried using the app::font_count(), app::font_name() and app::font_index() functions.
And then can be used using the Font::by_index() or Font::by_name() methods.
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default().load_system_fonts();
    // To load a font by path, check the App::load_font() method
    let fonts = app::fonts();
    // println!("{:?}", fonts);
    let mut wind = window::Window::default().with_size(400, 300);
    let mut frame = frame::Frame::default().size_of(&wind);
    frame.set_label_size(30);
    wind.set_color(enums::Color::White);
    wind.end();
    wind.show();
    println!("The system has {} fonts!\nStarting slideshow!", fonts.len());
    let mut i = 0;
    while app.wait() {
        if i == fonts.len() {
            i = 0;
        }
        frame.set_label(&format!("[{}]", fonts[i]));
        frame.set_label_font(enums::Font::by_index(i));
        app::sleep(0.5);
        i += 1;
    }
}
```

If you would like to load a bundled font without it being in the system, you can alternatively use Font::load_font() and Font::set_font(), this allows you to replace one of FLTK's predefined fonts with a custom font:
```rust
use fltk::{app, enums::Font, button::Button, frame::Frame, prelude::*, window::Window};

fn main() {
    let app = app::App::default();

    let font = Font::load_font("angelina.ttf").unwrap();
    Font::set_font(Font::Helvetica, &font);
    app::set_font_size(24);

    let mut wind = Window::default().with_size(400, 300);
    let mut frame = Frame::default().with_size(200, 100).center_of(&wind);
    let mut but = Button::new(160, 210, 80, 40, "Click me!");
    wind.end();
    wind.show();

    but.set_callback(move |_| frame.set_label("Hello world"));

    app.run().unwrap();
}
```

load_font() loads the font from the .ttf file, set_font() replaces Font::Helvetica (FLTK's default font) with our loaded font.

![image](https://user-images.githubusercontent.com/37966791/145735197-130f7dd6-a31f-4bc6-a362-90a13493a556.png)