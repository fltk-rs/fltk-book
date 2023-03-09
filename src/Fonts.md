# 字体 Fonts

FLTK自带了16种字体，可以在`enums::Font`中找到：
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

FLTK也允许加载系统默认字体或者将字体文件编译进二进制文件中。

系统字体依赖于用户的系统，默认情况下FLTK并不会加载。但你可以用`App::load_system_fonts()`方法来让程序加载系统字体。
然后可以使用`app::fonts()`函数获取加载到的字体，或者用`app::font_count()`、`app::font_name()`和`app::font_index()`函数查看字体的数量，名称等。
查询到后，便可以使用`Font::by_index()`或`Font::by_name()`方法来为程序应用字体。

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default().load_system_fonts();
    // 要加载指定路径的字体的话，参见 App::load_font() 函数
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

如果你想加载一个自己的字体，你可以选择使用`Font::load_font()`和`Font::set_font()`方法：
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

`load_font()`会加载`.ttf`格式的字体，然后我们使用`set_font()`用我们这个字体替换FLTK的默认字体`Font::Helvetica`：

![image](https://user-images.githubusercontent.com/37966791/145735197-130f7dd6-a31f-4bc6-a362-90a13493a556.png)