# 菜单 Menus

FLTK提供了菜单组件，它们均实现了`MenuExt trait`。Menu组件有下面这几种：
- MenuBar
- MenuItem
- Choice (下拉列表)
- SysMenuBar (在MacOS出现在屏幕顶部的menu bar)

Menu主要有两方面的作用：
1. 使用`add_choice()`方法添加菜单选项，然后在设置回调处理不同选项执行的操作：

    ```rust
    use fltk::{prelude::*, *};

    fn main() {
        let app = app::App::default();
        let mut wind = window::Window::default().with_size(400, 300);
        let mut choice = menu::Choice::default().with_size(80, 30).center_of_parent().with_label("Select item");
        choice.add_choice("Choice 1");
        choice.add_choice("Choice 2");
        choice.add_choice("Choice 3");
        // 也可以直接输入 choice.add_choice("Choice 1|Choice 2|Choice 3");
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

另外，你也可以结构出菜单选项的字符串来进行匹配：
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

2. 通过`add()`方法添加菜单选项，你需要在其中设置好每个选项的回调：

    ```rust
    use fltk::{prelude::*, *};

    fn main() {
        let app = app::App::default();
        let mut wind = window::Window::default().with_size(400, 300);
        let mut choice = menu::Choice::default()
            .with_size(80, 30)
            .center_of_parent()

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
另外在 [事件 Events](Events) 还会提到，你可以不适用闭包而传递一个函数：
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

此外，你还可以使用`add_emit()`方法来传递一个`sender`和一个`message`，不必直接设置回调，而是通过`App::wait()`中处理：
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

你可能会问，为什么不直接用第一个例子那样简单的代码，还要使用其他更复杂的方式完成回调。其实每种方法都有它的用途。
对于简单的**下拉菜单**，用第一种方法会更加方便。对于程序的**菜单栏**，用第二种方法会更好，它可以让你为菜单选项设置快捷键`Shortcuts`和选项的类型`MenuFlags`（例如下拉菜单，选择选项，用于分隔的占位菜单等），另外你不用再像第一个例子一样，在菜单的回调中处理所有事件。使用`add_emit()`方法处理子菜单一样很容易，就像在[编辑器示例](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/editor.rs)中那样：

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
注意到最后一个调用，它使用`find_item()`方法，在菜单中匹配到符合的选项，然后把它的Label颜色设为红色：

![image](https://user-images.githubusercontent.com/37966791/145727434-d66c6d55-018d-4341-9570-7c2864b5bf29.png)

## 系统菜单栏
在MacOS上，你可能更喜欢使用系统提供的菜单栏，它通常出现在屏幕的顶部。为此，你可以使用`SysMenuBar`组件。它与所有实现`MenuExt Trait`的组件具有相同的API，当程序为MacOS以外的其他目标平台编译时，该组件将变为一个普通的`MenuBar`。
