# 字体 Fonts

FLTK已经有16种字体，可以在enums::Font中找到：
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

它还允许加载系统字体和捆绑字体。

系统字体依赖于系统，默认情况下不被加载。这些字体可以用App::load_system_fonts()方法加载。
然后可以使用app::fonts()函数获取字体，还可以使用app::font_count()、app::font_name()和app::font_index()函数进行查询。
然后可以使用Font::by_index()或Font::by_name()方法来使用。

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default().load_system_fonts();
    // 要按路径加载字体，请检查App::load_font()方法
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

如果你想加载一个不在系统中的捆绑字体，你可以选择使用Font::load_font()和Font::set_font()，这允许你用自定义字体替换FLTK的预定义字体：
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

load_font()从.ttf文件中加载字体，set_font()用我们加载的字体替换Font::Helvetica（FLTK的默认字体）：

![image](https://user-images.githubusercontent.com/37966791/145735197-130f7dd6-a31f-4bc6-a362-90a13493a556.png)