# 对话框 Dialogs

FLTK提供了文件对话框等一系列对话框类型

## 文件对话框 File dialogs
有2种文件对话框类型，系统原生的文件对话框和FLTK自己的文件对话框。原生文件对话框即进行文件选择时会弹出系统的文件选择窗口。对于Windows，弹出的便是Win32对话框，对于MacOS，弹出的是Cocoa对话框，对于其他Posix系统来说，它取决于你的桌面环境。在GNOME和其他基于GTK的桌面上，弹出的是GTK对话框，在KDE上弹出的是kdialog。

### 原生对话框 Native dialogs
这样可以调出一个原生对话框：
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

运行这段代码会弹出一个系统原生的文件对话框，选择一个文件后将在终端打印出文件名。你需要为`new()`提供一个`NativeFileChooserType`类型的参数，它表明你该对话框要选择的文件类型，是多个文件还是文件夹之类的。这段代码我们选择了`BrowseFile`，你可以用`BrowseDir`替换掉来试试，也可试试多文件/目录的类型选项。如果你选择了多个文件，你可以使用`filenames()`方法得到一个包含多个文件名的Vector：
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

你可以通过添加过滤器来限制文件类型：
```rust
    btn.set_callback(|_| {
        let mut dialog = dialog::NativeFileChooser::new(dialog::NativeFileChooserType::BrowseMultiFile);
        dialog.set_filter("*.{txt,rs,toml}");
        dialog.show();
        println!("{:?}", dialog.filenames());
    });
```
这将让对话框只能选取`.txt`、`.rs`和`.toml`文件。

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
            ".",                            /*对话框弹出时所在目录*/
            "*.{txt,rs,toml}",              /*文件类型限定*/
            dialog::FileChooserType::Multi, /*对话框类型*/
            "Select file:",                 /*对话框标题*/
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

使用`file_chooser()`和`dir_chooser()`方法可以简化一些操作：
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

### 帮助文档对话框 Help dialog
FLTK提供了一个帮助文档对话框，可以用来将HTML文件转换为文档显示出来：
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
也可以用`HelpDialog::load(path_to_html_file)`方法加载一个HTML文件：

![image](https://user-images.githubusercontent.com/37966791/145726889-442d0453-e1d0-4b41-8717-f121fdf860fa.png)

### 提示对话框 Alert dialogs
FLTK还提供了下面几种使用很方便的对话框类型，只需要调用相关函数即可显示：
- message
- alert
- choice
- input
- password (类似于input，但会隐藏输入的内容)

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
执行这段代码，将在默认位置（大致在鼠标位置）显示一个message对话框。如果你想手动设置显示的坐标，可以使用`message()`函数：
```rust
    btn.set_callback(|_| {
        dialog::message(100, 100, "Message");
    });
```

这些函数都有相对的变体，一个有`_default()`后缀，不需要设置坐标，另一个没有后缀，需要手动输入坐标。
有些对话框会返回一个值，比如`choice`，`input` 和 `password`。`input`和`password`返回用户输入的文本，而`choice`则返回选择值的索引：

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
        // password() 和 input() 需要第二个参数来表示默认显示的值
        let pass = dialog::password_default("Enter password:", "");
        if let Some(pass) = pass {
            println!("{}", pass);
        }
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726850-61fc17e4-cd6e-4821-a9b5-396203806066.png)

使用`choice`的示例：
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
在用户选择按钮后将在控制台打印出选项索引，选择No将打印0，Yes将打印1，Cancel将打印2。

![image](https://user-images.githubusercontent.com/37966791/145726775-d000a807-8bf5-439b-a991-8bf25fcd5049.png)

你可能已经发现这些对话框没有标题。你可以在调用对话框前调用这个函数来为对话框添加标题：
```rust
        dialog::message_title("Exit!");
        let choice = dialog::choice_default("Would you like to save", "No", "Yes", "Cancel");
```

你也可以在程序的开头调用`dialog::message_title_default()`来设置所有对话框的默认标题：
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
上面这些对话框可能并不是你想要的样子，尤其是颜色和字体。如果你的程序是高度风格化的，你绝对还需要自定义对话框。对话框基本是在程序运行期间生成的一个模型窗口（Modal Windows），我们想要制作自定义对话框，只要制作一个窗口即可，它的主题与你为程序设置的主题将是一致的：
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

## 打印对话框 Printer dialog
FLTK还提供了打印对话框，它会调用你的系统平台的本地打印机对话框：
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
这里打印了按钮的图像并指定了它的位置。你可以传递任何组件（像TextEditor组件之类的）作为被打印的组件。