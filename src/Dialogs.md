# 对话框 Dialogs

fltk提供了几种对话框类型，有文件对话框和其他一些。

## 文件对话框 File dialogs
有2种类型，原生文件对话框和FLTK自己的文件对话框。原生对话框只是显示操作系统自己的对话框。对于windows来说，那是win32对话框，对于MacOS来说，那是Cocoa对话框，而对于其他posix系统来说，取决于你正在运行什么。在GNOME和其他基于gtk的桌面上，它显示gtk对话框，在KDE上它显示kdialog。

### 原生对话框 Native dialogs
唤起一个原生对话框：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(80, 30)
        .with_label("Select file")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let mut dialog = dialog::NativeFileChooser::new(dialog::NativeFileChooserType::BrowseFile);
        dialog.show();
        println!("{:?}", dialog.filename());
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/146625105-94b11a5d-0938-4962-96d1-aaff5424ffe8.png)

这将打印出所选文件的路径。有几种类型可以作为NativeFileChooserType被传递，这里我们浏览文件，你可以选择BrowseDir来代替，也可以启用多文件/目录选择。如果你选择了多个文件，你可以使用filenames()方法得到一个Vec：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Select files")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let mut dialog = dialog::NativeFileChooser::new(dialog::NativeFileChooserType::BrowseMultiFile);
        dialog.show();
        println!("{:?}", dialog.filenames());
    });

    app.run().unwrap();
}
```

你也可以选择添加过滤器来有选择地选取文件：
```rust
    btn.set_callback(|_| {
        let mut dialog = dialog::NativeFileChooser::new(dialog::NativeFileChooserType::BrowseMultiFile);
        dialog.set_filter("*.{txt,rs,toml}");
        dialog.show();
        println!("{:?}", dialog.filenames());
    });
```
这将只显示.txt、.rs和.toml文件。

### FLTL提供的文件选择器 FLTK's own file chooser
FLTK也提供了自己的文件选择器：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Select file")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let mut dialog = dialog::FileChooser::new(
            /*start dir*/ ".",
            /*pattern*/ "*.{txt,rs,toml}",
            /*type*/ dialog::FileChooserType::Multi,
            /*title*/ "Select file:",
        );
        dialog.show();
        while dialog.shown() {
            app::wait();
        }
        if dialog.count() > 1 {
            for i in 1..=dialog.count() { // values start at 1
                println!(" VALUE[{}]: '{}'", i, dialog.value(i).unwrap());
            }
        }
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726912-600e4c58-32b7-4a1b-8e6a-44e640549722.png)

用file_chooser()和dir_chooser()函数提供了一个方便的函数：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Select file")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let file = dialog::file_chooser(
            "Choose File",
            "*.rs",
            /*start dir*/ ".",
            /*relative*/ true,
        );
        if let Some(file) = file {
            println!("{}", file);
        }
    });

    app.run().unwrap();
}
```

### 帮助对话框 Help dialog
FLTK提供了一个帮助对话框，可以显示html 2文档：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Show dialog")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let mut help = dialog::HelpDialog::new(100, 100, 400, 300);
        help.set_value("<h2>Hello world</h2>"); // this takes html
        help.show();
        while help.shown() {
            app::wait();
        }
    });

    app.run().unwrap();
}
```
html文件也可以用HelpDialog::load(path_to_html_file)方法加载：

![image](https://user-images.githubusercontent.com/37966791/145726889-442d0453-e1d0-4b41-8717-f121fdf860fa.png)

### 提示对话框 Alert dialogs
FLTK还提供了几种对话框类型，可以使用自由函数方便地显示：
- message
- alert
- choice
- input
- password (类似于input，但不显示输入内容)

显示一个简单的message对话框：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Show dialog")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        dialog::message_default("Message");
    });

    app.run().unwrap();
}
```
这将在默认的位置（基本上在指针附近）显示一个message。如果你想手动输入坐标，你可以使用 message() 函数：
```rust
    btn.set_callback(|_| {
        dialog::message(100, 100, "Message");
    });
```

前面提到的所有函数都有变体，一个有_default()后缀，不需要坐标，另一个没有，需要坐标。
有些对话框会返回一个值，比如choice，input，and password。input和password返回输入的文本，而choice则返回选择值的索引：

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Show dialog")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        // 密码和输入也需要第二个参数，这是默认值
        let pass = dialog::password_default("Enter password:", "");
        if let Some(pass) = pass {
            println!("{}", pass);
        }
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726850-61fc17e4-cd6e-4821-a9b5-396203806066.png)

使用choice的一个例子：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Show dialog")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let choice = dialog::choice_default("Would you like to save", "No", "Yes", "Cancel");
        println!("{}", choice);
    });

    app.run().unwrap();
}
```
这将打印索引，即选择No将打印0，Yes将打印1，Cancel将打印2。

![image](https://user-images.githubusercontent.com/37966791/145726775-d000a807-8bf5-439b-a991-8bf25fcd5049.png)

你已经注意到，所有这些对话框都没有一个。你也可以在对话框前调用函数来添加一个title：
```rust
        dialog::message_title("Exit!");
        let choice = dialog::choice_default("Would you like to save", "No", "Yes", "Cancel");
```

你也可以使用 dialog::message_title_default() 来设置所有这些对话框的默认标题，你要在你的程序的开始部分这样做：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    dialog::message_title_default("My App!");
    let mut wind = window::Window::default().with_size(400, 300);

    let mut btn = button::Button::default()
        .with_size(100, 30)
        .with_label("Show dialog")
        .center_of_parent();

    wind.end();
    wind.show();

    btn.set_callback(|_| {
        let choice = dialog::choice_default("Would you like to save", "No", "Yes", "Cancel");
        println!("{}", choice);
    });

    app.run().unwrap();
}
```
![image](https://user-images.githubusercontent.com/37966791/145726685-f086bde2-db63-4fa8-a579-954dbacbe44d.png)

## 自定义对话框 Custom dialogs
所有这些对话框与你的程序设想的样子可能不相符合，特别是关于颜色和字体。如果你有一个深度定制的程序，你可能也会想要定制对话框。对话框基本上是一个在应用程序中生成的模式窗口。它可以与你的应用程序的其他部分具有相同的风格：
```rust
use fltk::{
    app, button,
    enums::{Color, Font, FrameType},
    frame, group, input,
    prelude::*,
    window,
};

fn style_button(btn: &mut button::Button) {
    btn.set_color(Color::Cyan);
    btn.set_frame(FrameType::RFlatBox);
    btn.clear_visible_focus();
}

pub fn show_dialog() -> MyDialog {
    MyDialog::default()
}

pub struct MyDialog {
    inp: input::Input,
}

impl MyDialog {
    pub fn default() -> Self {
        let mut win = window::Window::default()
            .with_size(400, 100)
            .with_label("My Dialog");
        win.set_color(Color::from_rgb(240, 240, 240));
        let mut pack = group::Pack::default()
            .with_size(300, 30)
            .center_of_parent()
            .with_type(group::PackType::Horizontal);
        pack.set_spacing(20);
        frame::Frame::default()
            .with_size(80, 0)
            .with_label("Enter name:");
        let mut inp = input::Input::default().with_size(100, 0);
        inp.set_frame(FrameType::FlatBox);
        let mut ok = button::Button::default().with_size(80, 0).with_label("Ok");
        style_button(&mut ok);
        pack.end();
        win.end();
        win.make_modal(true);
        win.show();
        ok.set_callback({
            let mut win = win.clone();
            move |_| {
                win.hide();
            }
        });
        while win.shown() {
            app::wait();
        }
        Self { inp }
    }
    pub fn value(&self) -> String {
        self.inp.value()
    }
}

fn main() {
    let a = app::App::default();
    app::set_font(Font::Times);
    let mut win = window::Window::default().with_size(600, 400);
    win.set_color(Color::from_rgb(240, 240, 240));
    let mut btn = button::Button::default()
        .with_size(80, 30)
        .with_label("Click")
        .center_of_parent();
    style_button(&mut btn);
    let mut frame = frame::Frame::new(btn.x() - 40, btn.y() - 100, btn.w() + 80, 30, None);
    frame.set_frame(FrameType::BorderBox);
    frame.set_color(Color::Red.inactive());
    win.end();
    win.show();
    btn.set_callback(move |_| {
        let d = show_dialog();
        frame.set_label(&d.value());
    });
    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726727-a0018457-1d87-4519-9d6e-08d8f8030d1a.png)

## 打印机话框 Printer dialog
FLTK还提供了一个打印机对话框，它使用你的系统平台的本地打印机对话框：
```rust
use fltk::{prelude::*, *};
let mut but = button::Button::default();
but.set_callback(|widget| {
    let mut printer = printer::Printer::default();
    if printer.begin_job(1).is_ok() {
        printer.begin_page().ok();
        let (width, height) = printer.printable_rect();
        draw::set_draw_color(enums::Color::Black);
        draw::set_line_style(draw::LineStyle::Solid, 2);
        draw::draw_rect(0, 0, width, height);
        draw::set_font(enums::Font::Courier, 12);
        printer.set_origin(width / 2, height / 2);
        printer.print_widget(widget, -widget.width() / 2, -widget.height() / 2);
        printer.end_page().ok();
        printer.end_job();
    }
});
```
这里只是打印按钮的图像并指定它在纸上显示的位置。你可以传递任何widget（主要是像TextEditor widget）作为打印widget。