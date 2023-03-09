# 自定义风格 Styling

FLTK提供了自定义程序风格的很多方法（不然实在有点丑）。我们可以设置颜色，不同的字体，自定义绘制组件等等。自定义风格用到了所有这些。我们可以使用`WidgetExt`中定义的方法为每个组件单独设置风格，也可以使用`app`模块中的函数为程序全局设置风格。

## WidgetExt
`WidgetExt Trait`的大多数方法与修改边框、标签、组件颜色、文本颜色、字体和文本大小这些自定义的功能有关。
对相应的属性，都提供了`setter`和`getter`方法，可以在[WidgetExt]（https://docs.rs/fltk/*/fltk/prelude/trait.WidgetExt.html）找到。

看看这个示例：

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

    // 设置风格
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
    // 风格应用结束

    but.set_callback(move |_| {
        let label = (count.label().parse::<i32>().unwrap() + 1).to_string();
        count.set_label(&label);
    });

    app.run().unwrap();
}
```

![counter](https://github.com/MoAlyousef/fltk-rs/raw/master/screenshots/flutter_like.jpg)

理论上所有组件都支持在其中显示图像，参见 图像 章节。

## Global styling

全局风格化方法可以在 `app` mod中找到。先看看如何改变程序的主题：
```rust
use fltk::{prelude::*, enums::*, *};
let app = app::App::default().with_scheme(app::Scheme::Plastic);
```
FLTK本身提供四个主题：
- Base
- Gtk
- Gleam
- Plastic

这个例子设置了程序的颜色、默认字体、默认边框和是否在组件上显示焦点：
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
FLTK还提供了绘图基本图形（drawing primitives），这可以大大简化为组件自定义外观的步骤。我们使用接收一个闭包参数的`draw()`方法完成绘制。让我们来绘制一个自己的按钮，虽然FLTK已经提供了`ShadowFrame`框架类型，为了演示我们自己再做一个：
```rust
use fltk::{prelude::*, enums::*, *};

fn main() {
    let app = app::App::default();
    app::set_color(255, 255, 255); // 白色
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

`draw()`方法也支持在组件内部的绘制，你可以在下一节看到。

## fltk-theme
这是一个[FLTK主题crate](https://github.com/fltk-rs/fltk-theme)，它提供了好几个预定义的主题，只需要加载就可以使用。

这里有很多好看的FLTK主题，或许可以挽留一下被界面劝退的你：
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