# Accessibility

FLTK提供了一些开箱即用的无障碍功能：
- 在ui元素之间和内部的键盘导航。

FLTK 会自动启用此功能。
根据组件的创建顺序，以及其是否获得焦点，您可以使用箭头键或Tab和Shift-Tab移动到下一个/上一个组件。
同样，相同的操作也适用于菜单项。

## 键盘快捷键。

Button widgets and Menu widgets provide a method which allows setting the keyboard shortcut:
```rust
use fltk::{prelude::*, *};

let mut menu = menu::MenuBar::default().with_size(800, 35);
menu.add(
    "&File/New...\t",
    Shortcut::Ctrl | 'n',
    menu::MenuFlag::Normal,
    |_m| {},
);

let mut btn = button::Button::new(100, 100, 80, 30, "Click me");
btn.set_shortcut(enums::Shortcut::Ctrl | 'b');
```

## 键盘可替代的鼠标操作。

FLTK 会自动启用此功能。
根据项目是否有默认的 `CallbackTrigger::EnterKey` 触发器，或使用 `set_trigger` 设置了触发器，在按下回车键是会触发回调。
例如，按钮如果有焦点，就会自动响应回车键。以下代码为组件设置了触发器：
```rust
use fltk::{prelude::*, *};

let mut inp = input::Input::new(10, 10, 160, 30, None);
inp.set_trigger(enums::CallbackTrigger::EnterKey);
inp.set_callback(|i| println!("You clicked enter, and the input's current text is: {}", i.value()));
```

## IME 支持。

对于中文、日文和韩文等需要输入法编辑器(Input Method Editor, IME)的语言，IME会自动启用。在这种情况下，FLTK 使用操作系统提供的 IME。

## 为组件和自定义组件设置按键事件。

使用 `WidgetExt::handle` 方法，你可以自定义组件如何处理事件，包括按键事件。 

```rust
use fltk::{prelude::*, *};

let mut win = window::Window::default().with_size(400, 300);
win.handle(|w, ev| {
    enums::Event::KeyUp => {
        let key = app::event_key();
        match key {
            enums::Key::End => app::quit(),     // 以quit为例
            _ => {
                if let Some(k) = key.to_char() {
                    match k {
                        'q' => app::quit(),
                        _ => (),
                    }
                }
            },
        }
        true
    }, 
    _ => false,
});
```

## 屏幕阅读器的支持

屏幕阅读器的支持集成在另一个 crate 中:
- [fltk-accesskit](https://github.com/fltk-rs/fltk-accesskit)

这个例子使用了 `fltk-accesskit` 编写了一个无障碍程序的示例：

例子:
```rust
#![windows_subsystem = "windows"]
use fltk::{prelude::*, *};
use fltk_accesskit::{AccessibilityContext, AccessibleApp};

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Oxy);
    let mut w = window::Window::default()
        .with_size(400, 300)
        .with_label("Hello fltk-accesskit");
    let col = group::Flex::default()
        .with_size(200, 100)
        .center_of_parent()
        .column();
    let inp = input::Input::default().with_id("inp").with_label("Enter name:");
    let mut btn = button::Button::default().with_label("Greet");
    let out = output::Output::default().with_id("out");
    col.end();
    w.end();
    w.make_resizable(true);
    w.show();

    btn.set_callback(btn_callback);

    let ac = AccessibilityContext::new(
        w,
        vec![Box::new(inp), Box::new(btn), Box::new(out)],
    );

    a.run_with_accessibility(ac).unwrap();
}

fn btn_callback(_btn: &mut button::Button) {
    let inp: input::Input = app::widget_from_id("inp").unwrap();
    let mut out: output::Output = app::widget_from_id("out").unwrap();
    let name = inp.value();
    if name.is_empty() {
        return;
    }
    out.set_value(&format!("Hello {}", name));
}
```

`Accessible Trait` 是为一些特定的组件实现的。
这个例子中，你需要实例化一个`fltk_accesskit::AccessibilityContext`，它需要你将根组件（主窗口），以及会被屏幕阅读器识别的组件作为参数。
最后你需要使用特殊的 `run_with_accessibility` 来运行 App结构。

可以在这里观看示例视频示例 [YouTube](https://www.youtube.com/watch?v=x53Rxjg8IF8).