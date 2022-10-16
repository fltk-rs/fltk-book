# 组件 Widgets

FLTK提供了大约80个窗口组件。这些组件都实现了WidgetBase和WidgetExt的基本trait集。 我们已经遇到了我们的第一个组件，Window。
正如我们在Window小组件中所看到的，小组件也可以根据其功能实现其他trait。
在我们之前写的例子中添加一个按钮：

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```
![image](https://user-images.githubusercontent.com/37966791/100937814-adfb4900-3504-11eb-8a6b-f42a4fb4e470.png)

注意，这个按钮的父组件是my_window，因为它是在begin()和end()之间创建的。
另一种添加组件的方法是，使用实现了GroupExt trait的widget所提供的add(widget)方法。

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();

    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.add(&but);

    app.run().unwrap();
}
```

另一件要注意的事情是按钮的初始化，它的构造函数基本上与Window相同，这是因为它实现了WidgetBase trait。注意，虽然Window的x和y坐标是相对于屏幕的，但按钮的x和y坐标却是相对于包含按钮的窗口的。你可能已经注意到，这也适用于我们在前一页的嵌入式窗口。

这个按钮也实现了ButtonExt trait，它提供了一些有用的方法，比如设置快捷键来触发我们的按钮以及其他方法。

构建组件也可以用构建器模式来完成：

```rust
let but1 = Button::new(10, 10, 80, 40, "Button 1");
// OR
let but1 = Button::default()
    .with_pos(10, 10)
    .with_size(80, 40)
    .with_label("Button 1");
```
这基本上有相同的效果。

目前，我们的程序显示了一个带有按钮的窗口，这个按钮是可以点击的，但什么也做不了！因此，在下一页中，我们将学习为它添加一些动作。