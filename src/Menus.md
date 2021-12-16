Menus in FLTK are widgets which implement the MenuExt trait. To that end, there are several types:
- MenuBar
- MenuItem
- Choice (dropdown list)
- SysMenuBar (MacOS menu bar which appears at the top of the screen)

Menu types function in 2 main ways:
1- Add choices using the add_choice() method, then handling the user's selection in the callback:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);
    let mut choice = menu::Choice::default().with_size(80, 30).center_of_parent().with_label("Select item");
    choice.add_choice("Choice 1");
    choice.add_choice("Choice 2");
    choice.add_choice("Choice 3");
    // You can also simply type choice.add_choice("Choice 1|Choice 2|Choice 3");
    wind.end();
    wind.show();

    choice.set_callback(|c| {
        match c.value() {
            0 => println!("choice 1 selected"),
            1 => println!("choice 2 selected"),
            2 => println!("choice 3 selected"),
            _ => unreachable!(),
        }
    });

    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727397-dd713782-9f8e-474b-b009-f2ebeb5170ea.png)

Alternatively you can query the textual value of the selected item:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);
    let mut choice = menu::Choice::default().with_size(80, 30).center_of_parent().with_label("Select item");
    choice.add_choice("Choice 1|Choice 2|Choice 3");
    wind.end();
    wind.show();

    choice.set_callback(|c| {
        if let Some(choice) = c.choice() {
            match choice.as_str() {
                "Choice 1" => println!("choice 1 selected"),
                "Choice 2" => println!("choice 2 selected"),
                "Choice 3" => println!("choice 3 selected"),
                _ => unreachable!(),
            }
        }
    });

    app.run().unwrap();
}
```

2- Adding choices via the add() method, you pass each choice's callback distinctively.
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 300);
    let mut choice = menu::Choice::default()
        .with_size(80, 30)
        .center_of_parent()
        .with_label("Select item");

    choice.add(
        "Choice 1",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        |_| println!("choice 1 selected"),
    );
    choice.add(
        "Choice 2",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        |_| println!("choice 2 selected"),
    );
    choice.add(
        "Choice 3",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        |_| println!("choice 3 selected"),
    );

    wind.end();
    wind.show();

    app.run().unwrap();
}
```
Alternatively, you can use the add_emit() to pass a Sender and a message instead of passing callbacks:
```rust
use fltk::{prelude::*, *};

#[derive(Clone)]
enum Message {
    Choice1,
    Choice2,
    Choice3,
}

fn main() {
    let a = app::App::default();
    let (s, r) = app::channel();
    let mut wind = window::Window::default().with_size(400, 300);
    let mut choice = menu::Choice::default()
        .with_size(80, 30)
        .center_of_parent()
        .with_label("Select item");

    choice.add_emit(
        "Choice 1",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        s.clone(),
        Message::Choice1,
    );
    choice.add_emit(
        "Choice 2",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        s.clone(),
        Message::Choice2,
    );
    choice.add_emit(
        "Choice 3",
        enums::Shortcut::None,
        menu::MenuFlag::Normal,
        s,
        Message::Choice3,
    );

    wind.end();
    wind.show();

    while a.wait() {
        if let Some(msg) = r.recv() {
            match msg {
                Message::Choice1 => println!("choice 1 selected"),
                Message::Choice2 => println!("choice 2 selected"),
                Message::Choice3 => println!("choice 3 selected"),
            }
        }
    }
}
```

You might wonder, why go from a handful of lines in the first examples to a more complex manner of doing things. Each method has it's uses. 
For simple drop down widgets, go with the first method. For an application's menu bar, go with the second. It allows you to specify Shortcuts and MenuFlags, and allows better decoupling of events, so you won't have to handle everything in the menu's callback. It's also easier to deal with submenus using the add() method, as in the [editor example](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/editor.rs):
```rust
        let mut menu = menu::SysMenuBar::default().with_size(800, 35);
        menu.set_frame(FrameType::FlatBox);
        menu.add_emit(
            "&File/New...\t",
            Shortcut::Ctrl | 'n',
            menu::MenuFlag::Normal,
            *s,
            Message::New,
        );

        menu.add_emit(
            "&File/Open...\t",
            Shortcut::Ctrl | 'o',
            menu::MenuFlag::Normal,
            *s,
            Message::Open,
        );

        menu.add_emit(
            "&File/Save\t",
            Shortcut::Ctrl | 's',
            menu::MenuFlag::Normal,
            *s,
            Message::Save,
        );

        menu.add_emit(
            "&File/Save as...\t",
            Shortcut::Ctrl | 'w',
            menu::MenuFlag::Normal,
            *s,
            Message::SaveAs,
        );

        menu.add_emit(
            "&File/Print...\t",
            Shortcut::Ctrl | 'p',
            menu::MenuFlag::MenuDivider,
            *s,
            Message::Print,
        );

        menu.add_emit(
            "&File/Quit\t",
            Shortcut::Ctrl | 'q',
            menu::MenuFlag::Normal,
            *s,
            Message::Quit,
        );

        menu.add_emit(
            "&Edit/Cut\t",
            Shortcut::Ctrl | 'x',
            menu::MenuFlag::Normal,
            *s,
            Message::Cut,
        );

        menu.add_emit(
            "&Edit/Copy\t",
            Shortcut::Ctrl | 'c',
            menu::MenuFlag::Normal,
            *s,
            Message::Copy,
        );

        menu.add_emit(
            "&Edit/Paste\t",
            Shortcut::Ctrl | 'v',
            menu::MenuFlag::Normal,
            *s,
            Message::Paste,
        );

        menu.add_emit(
            "&Help/About\t",
            Shortcut::None,
            menu::MenuFlag::Normal,
            *s,
            Message::About,
        );

        if let Some(mut item) = menu.find_item("&File/Quit\t") {
            item.set_label_color(Color::Red);
        }
```
Also notice the last call, which uses find_item() to find an item in the menu, and we hence set its label color to red.

![image](https://user-images.githubusercontent.com/37966791/145727434-d66c6d55-018d-4341-9570-7c2864b5bf29.png)

## System Menu Bar
On MacOS, you might prefer to use a system menu bar, which typically appears on the top of the screen. For that, you can use a SysMenuBar widget. This has the same api as all widgets implementing MenuExt, and it translates into a normal MenuBar when the app is compiled for other targets than a MacOS.