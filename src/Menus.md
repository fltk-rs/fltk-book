# Menus

Menus in FLTK are widgets which implement the [MenuExt](https://docs.rs/fltk/latest/fltk/prelude/trait.MenuExt.html) trait. To that end, there are several types:

- [MenuBar](https://docs.rs/fltk/latest/fltk/menu/struct.MenuBar.html)
- [MenuButton](https://docs.rs/fltk/latest/fltk/menu/struct.MenuButton.html)
- [MenuItem](https://docs.rs/fltk/latest/fltk/menu/struct.MenuItem.html)
- [Choice](https://docs.rs/fltk/latest/fltk/menu/struct.Choice.html) *dropdown list*
- [SysMenuBar](https://docs.rs/fltk/latest/fltk/menu/struct.SysMenuBar.html) *MacOS menu bar which appears at the top of the screen*
- [MacAppMenu](https://docs.rs/fltk/latest/fltk/menu/struct.MacAppMenu.html)

Menu types function in 2 main ways:

**1-** Add choices using the [add_choice()](https://docs.rs/fltk/latest/fltk/prelude/trait.MenuExt.html#tymethod.add_choice) method, then handling the user's selection in the callback:

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
<div align="center">

![image](https://user-images.githubusercontent.com/37966791/145727397-dd713782-9f8e-474b-b009-f2ebeb5170ea.png)

</div>

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

**2-** Adding choices via the [add()](https://docs.rs/fltk/latest/fltk/prelude/trait.MenuExt.html#tymethod.add) method, you pass each choice's callback distinctively.

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

Also as mentioned in the [Events section](Events), you can use a function object instead of passing closures:

```rust
use fltk::{enums::*, prelude::*, *};

fn menu_cb(m: &mut impl MenuExt) {
    if let Some(choice) = m.choice() {
        match choice.as_str() {
            "New\t" => println!("New"),
            "Open\t" => println!("Open"),
            "Third" => println!("Third"),
            "Quit\t" => {
                println!("Quitting");
                app::quit();
            },
            _ => println!("{}", choice),
        }
    }
}

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut menubar = menu::MenuBar::new(0, 0, 400, 40, "rew");
    menubar.add("File/New\t", Shortcut::None, menu::MenuFlag::Normal, menu_cb);
    menubar.add(
        "File/Open\t",
        Shortcut::None,
        menu::MenuFlag::Normal,
        menu_cb,
    );
    let idx = menubar.add(
        "File/Recent",
        Shortcut::None,
        menu::MenuFlag::Submenu,
        menu_cb,
    );
    menubar.add(
        "File/Recent/First\t",
        Shortcut::None,
        menu::MenuFlag::Normal,
        menu_cb,
    );
    menubar.add(
        "File/Recent/Second\t",
        Shortcut::None,
        menu::MenuFlag::Normal,
        menu_cb,
    );
    menubar.add(
        "File/Quit\t",
        Shortcut::None,
        menu::MenuFlag::Normal,
        menu_cb,
    );
    let mut btn1 = button::Button::new(160, 150, 80, 30, "Modify 1");
    let mut btn2 = button::Button::new(160, 200, 80, 30, "Modify 2");
    let mut clear = button::Button::new(160, 250, 80, 30, "Clear");
    win.end();
    win.show();

    btn1.set_callback({
        let menubar = menubar.clone();
        move |_| {
            if let Some(mut item) = menubar.find_item("File/Recent") {
                item.add(
                    "Recent/Third",
                    Shortcut::None,
                    menu::MenuFlag::Normal,
                    menu_cb,
                );
                item.add(
                    "Recent/Fourth",
                    Shortcut::None,
                    menu::MenuFlag::Normal,
                    menu_cb,
                );
            }
        }
    });

    btn2.set_callback({
        let mut menubar = menubar.clone();
        move |_| {
            menubar.add(
                "File/Recent/Fifth\t",
                Shortcut::None,
                menu::MenuFlag::Normal,
                menu_cb,
            );
            menubar.add(
                "File/Recent/Sixth\t",
                Shortcut::None,
                menu::MenuFlag::Normal,
                menu_cb,
            );
        }
    });

    clear.set_callback(move |_| {
        menubar.clear_submenu(idx).unwrap();
    });

    a.run().unwrap();
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
For simple drop down widgets, go with the first method. For an application's menu bar, go with the second. It allows you to specify Shortcuts and [MenuFlags](https://docs.rs/fltk/latest/fltk/menu/struct.MenuFlag.html), and allows better decoupling of events, so you won't have to handle everything in the menu's callback. It's also easier to deal with submenus using the add() method, as in the [editor example](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/editor.rs):
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

<div align="center">

![image](https://user-images.githubusercontent.com/37966791/145727434-d66c6d55-018d-4341-9570-7c2864b5bf29.png)

</div>

## System Menu Bar

On MacOS, you might prefer to use a system menu bar, which typically appears on the top of the screen. For that, you can use a [SysMenuBar](https://docs.rs/fltk/latest/fltk/menu/struct.SysMenuBar.html#) widget. This has the same api as all widgets implementing MenuExt, and it translates into a normal MenuBar when the app is compiled for other targets than a MacOS.
