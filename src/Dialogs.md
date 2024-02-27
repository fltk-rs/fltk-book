# Dialogs

fltk offers several dialog types including file dialogs and others. 

## File dialogs
There are 2 types, the native file dialog and FLTK's own file dialog. Native dialogs just show a the OS's own dialog. For windows, that's the win32 dialog, for MacOS, that's the Cocoa dialog, and for other posix systems, it depends on what you're running. On GNOME and other gtk-based desktops, it shows the gtk dialog and on KDE it shows kdialog.

### Native dialogs
To spawn a native dialog:
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

This prints the Path of the chosen file. There are several types which can be passed as NativeFileChooserType, here we browse files, you can choose to BrowseDir instead, also enable mutli file/dir selection. If you select multiple files, you can get a Vec using the filenames() method:
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

You can also add filter the files to show:
```rust
    btn.set_callback(|_| {
        let mut dialog = dialog::NativeFileChooser::new(dialog::NativeFileChooserType::BrowseMultiFile);
        dialog.set_filter("*.{txt,rs,toml}");
        dialog.show();
        println!("{:?}", dialog.filenames());
    });
```
This will only show .txt, .rs and .toml files.

### FLTK's own file chooser
FLTK also offers its own file chooser:
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

A convenience function is also provided using file_chooser() and dir_chooser() functions:
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

### Help dialog
FLTK offers a help dialog which can show html 2 documents:
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
The html can also be loaded using the HelpDialog::load(path_to_html_file) method. 

![image](https://user-images.githubusercontent.com/37966791/145726889-442d0453-e1d0-4b41-8717-f121fdf860fa.png)

### Alert dialogs
FLTK also offers several dialog types which can be conveniently shown using free functions:
- message
- alert
- choice
- input
- password (like input but doesn't show the inputted data)

To show up a simple message dialog:
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
This shows a message at a default location (basically near the pointer). If you would like to enter coordinates manually, you can use the message() function:
```rust
    btn.set_callback(|_| {
        dialog::message(100, 100, "Message");
    });
```

All the previously mentioned functions have 2 variants, one with _default() suffix which doesn't require coordinates, and the other without which requires coordinates.
Some dialogs return a value, like choice, input, and password. Input and password return the inputted text, while choice returns an index of the chosen value:
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
        // password and input also takes a second arg which is the default value
        let pass = dialog::password_default("Enter password:", "");
        if let Some(pass) = pass {
            println!("{}", pass);
        }
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726850-61fc17e4-cd6e-4821-a9b5-396203806066.png)

An example with choice:
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
This will print the index, i.e. choosing No will print 0, Yes will print 1 and Cancel will print 2.

![image](https://user-images.githubusercontent.com/37966791/145726775-d000a807-8bf5-439b-a991-8bf25fcd5049.png)

You have noticed that all of these dialogs didn't have a title. You can add a title also using a free function called before the dialog:
```rust
        dialog::message_title("Exit!");
        let choice = dialog::choice_default("Would you like to save", "No", "Yes", "Cancel");
```

You can also set the default title of all these dialog boxes using dialog::message_title_default(), you'll want to do this in the start of your app:
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

## Custom dialogs
All these dialogs make assumptions about your app that might not be correct, especially regarding colors and fonts. If you have a heavily customized app you would probably also want custom dialogs. A dialog is basically a modal window which is spawned during the application. This can have the same styling as the rest of your app:
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

## Printer dialog
FLTK also offers a printer dialog which uses your platform's native printer dialog:
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
Here it's just printing the button's image and specifying where it shows on the paper. You can pass any widget (mostly like a TextEditor widget) as the printed widget.
