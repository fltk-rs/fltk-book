# 菜单 Menus

FLTK中的菜单是实现MenuExt trait的widget。Menu有下面这几种类型：
- MenuBar
- MenuItem
- Choice (dropdown list)
- SysMenuBar (MacOS上则是出现在屏幕顶部的menu bar)

Menu类型主要有两个方面的功能：
1- 使用add_choice()方法添加选项，然后在callback中处理用户的选择：

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

另外，你也可以获取所选项目的文本内容来操作：
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

2- 通过add()方法添加选项，你要明确地传递每个选项的回调：

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
另外，正如在 [事件 Events](Events)中提到的，你可以使用一个函数对象，而不必传递闭包：
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

另外，你可以使用add_emit()来传递一个sender和一个message，而不必要传递回调：
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

你可能会问，为什么我们要从第一个例子中的几行代码，转到更复杂的方式。其实每种方法都有它的用途。
对于简单的下拉widget，建议用第一种方法。对于一个程序的菜单栏，用第二种方法。它允许你指定Shortcuts和MenuFlags，并且可以更好地解耦事件，所以你不必在菜单的回调中处理一切。使用add()方法处理子菜单也更容易，就像在[编辑器例子](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/editor.rs)中那样：

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
注意到最后一个调用，它使用find_item()在menu中找到一个item，然后我们将其标签颜色设置为红色：

![image](https://user-images.githubusercontent.com/37966791/145727434-d66c6d55-018d-4341-9570-7c2864b5bf29.png)

## 系统菜单栏
在MacOS上，你可能更喜欢使用系统菜单栏，它通常出现在屏幕的顶部。为此，你可以使用一个SysMenuBar widget。它与所有实现MenuExt trait的widget具有相同的api，当程序为MacOS以外的其他目标平台编译时，它将转化为一个普通的MenuBar。

