# 样式设计 Styling

FLTK在风格化应用方面提供了许多东西。我们已经看到，我们可以使用true color和不同的字体，此外还可以进行自定义绘制。Styling就是利用所有这些。它可以利用WidgetExt中的方法在每个widget上进行，也可以使用app模块中的函数在全局上完成。

## WidgetExt
大多数WidgetExt trait与修改框架类型、标签类型、widget颜色、文本颜色、文本字体和文本大小有关。
这些都有setter和 getter，可以在[这里]（https://docs.rs/fltk/*/fltk/prelude/trait.WidgetExt.html）找到。

一个例子：

```rust
use fltk::{
    enums::{Align, Color, Font, FrameType},
    prelude::*,
    *,
};

const BLUE: Color = Color::from_hex(0x42A5F5);
const SEL_BLUE: Color = Color::from_hex(0x2196F3);
const GRAY: Color = Color::from_hex(0x757575);
const WIDTH: i32 = 600;
const HEIGHT: i32 = 400;

fn main() {
    let app = app::App::default();
    let mut win = window::Window::default()
        .with_size(WIDTH, HEIGHT)
        .with_label("Flutter-like!");
    let mut bar =
        frame::Frame::new(0, 0, WIDTH, 60, "  FLTK App!").with_align(Align::Left | Align::Inside);
    let mut text = frame::Frame::default()
        .with_size(100, 40)
        .center_of(&win)
        .with_label("You have pushed the button this many times:");
    let mut count = frame::Frame::default()
        .size_of(&text)
        .below_of(&text, 0)
        .with_label("0");
    let mut but = button::Button::new(WIDTH - 100, HEIGHT - 100, 60, 60, "@+6plus");
    win.end();
    win.make_resizable(true);
    win.show();

    // Theming
    app::background(255, 255, 255);
    app::set_visible_focus(false);

    bar.set_frame(FrameType::FlatBox);
    bar.set_label_size(22);
    bar.set_label_color(Color::White);
    bar.set_color(BLUE);
    bar.draw(|b| {
        draw::set_draw_rgb_color(211, 211, 211);
        draw::draw_rectf(0, b.height(), b.width(), 3);
    });

    text.set_label_size(18);
    text.set_label_font(Font::Times);

    count.set_label_size(36);
    count.set_label_color(GRAY);

    but.set_color(BLUE);
    but.set_selection_color(SEL_BLUE);
    but.set_label_color(Color::White);
    but.set_frame(FrameType::OFlatFrame);
    // End theming

    but.set_callback(move |_| {
        let label = (count.label().parse::<i32>().unwrap() + 1).to_string();
        count.set_label(&label);
    });

    app.run().unwrap();
}
```

![counter](https://github.com/MoAlyousef/fltk-rs/raw/master/screenshots/flutter_like.jpg)

widget也支持在其中显示图像，这在image章节有更多讨论。

## Global styling

这些可以在程序module中找到。从改变程序的主题开始：
```rust
use fltk::{prelude::*, enums::*, *};
let app = app::App::default().with_scheme(app::Scheme::Plastic);
```
提供有四个主题：
- Base
- Gtk
- Gleam
- Plastic

设置应用程序的颜色、默认字体、默认框架类型和是否在widget上显示焦点：
```rust
use fltk::{app, button::Button, enums, frame::Frame, prelude::*, window::Window};

fn main() {
    let app = app::App::default();
    app::set_background_color(170, 189, 206);
    app::set_background2_color(255, 255, 255);
    app::set_foreground_color(0, 0, 0);
    app::set_selection_color(255, 160,  63);
    app::set_inactive_color(130, 149, 166);
    app::set_font(enums::Font::Times);
    
    let mut wind = Window::default().with_size(400, 300);
    let mut frame = Frame::default().with_size(200, 100).center_of(&wind);
    let mut but = Button::new(160, 210, 80, 40, "Click me!");
    wind.end();
    wind.show();

    but.set_callback(move |_| frame.set_label("Hello world"));

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727821-5923fcd4-3a57-4a15-b36f-574b3e5321ea.png)

### Custom Drawing
FLTK还提供了原始绘图drawing primitives，这使得给widget自定义外观非常容易。这是用draw()方法完成的，它需要一个闭包。让我们来绘制一个自己的按钮（虽然FLTK提供了一个ShadowFrame FrameType），在这里创建一个我们自己的：
```rust
use fltk::{prelude::*, enums::*, *};

fn main() {
    let app = app::App::default();
    app::set_color(255, 255, 255); // white
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");

    let mut but = button::Button::default()
        .with_pos(160, 210)
        .with_size(80, 40)
        .with_label("Button1");

    but.draw2(|b| {
        draw::set_draw_color(Color::Gray0);
        draw::draw_rectf(b.x() + 2, b.y() + 2, b.width(), b.height());
        draw::set_draw_color(Color::from_u32(0xF5F5DC));
        draw::draw_rectf(b.x(), b.y(), b.width(), b.height());
        draw::set_draw_color(Color::Black);
        draw::draw_text2(
            &b.label(),
            b.x(),
            b.y(),
            b.width(),
            b.height(),
            Align::Center,
        );
    });

    my_window.end();
    my_window.show();

    app.run().unwrap();
}
```

![draw](https://user-images.githubusercontent.com/37966791/100938232-62956a80-3505-11eb-888f-ffe655e7aadc.jpg)

draw()方法也支持在widget内部绘制图像，这将在下一节看到。

## fltk-theme
这是一个[crate](https://github.com/fltk-rs/fltk-theme)，它提供了几个预定义的主题，只要加载主题就可以使用
```rust
use fltk::{prelude::*, *};
use fltk_theme::{widget_themes, WidgetTheme, ThemeType};

fn main() {
    let a = app::App::default();
    let widget_theme = WidgetTheme::new(ThemeType::Aero);
    widget_theme.apply();
    let mut win = window::Window::default().with_size(400, 300);
    let mut btn = button::Button::new(160, 200, 80, 30, "Hello");
    btn.set_frame(widget_themes::OS_DEFAULT_BUTTON_UP_BOX);
    win.end();
    win.show();
    a.run().unwrap();
}
```

![aqua-classic](https://github.com/fltk-rs/fltk-theme/raw/main/screenshots/aqua_classic.jpg)