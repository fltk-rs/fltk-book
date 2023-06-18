# Accessibility

FLTK提供了一些开箱即用的无障碍功能：
- 在ui元素之间和内部的键盘导航。
- 键盘快捷键。
- 键盘可替代的鼠标操作。
- IME 支持。
- 为组件和自定义组件设置按键事件。

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