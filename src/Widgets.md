# 组件 Widgets

FLTK提供了80多个组件。这些组件都实现了`WidgetBase`和`WidgetExt`组成的基本集合。 我们已经见过了我们的第一个组件，Window组件。
正如我们在Window组件中了解的，基于功能的不同，不同的组件还会各自实现其他Trait。
在我们之前写的例子中添加一个按钮：

```rust
uuse fltk::{prelude::*, *};

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

注意，这个按钮的父组件是my_window，因为它是在隐式调用的`begin()`和`end()`之间创建的。
在程序中添加组件的另一种方法是，在实现了`GroupExt Trait`的Widget上调用该Trait提供的`add(widget)`方法。

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

需要注意一下按钮的初始化方式，它的构造方法基本上与Window相同，因为`new()`方法是定义在`WidgetBase trait`中的，而大部分组件都实现了这个Trait。注意，虽然Window的x和y坐标是相对于屏幕而言的，但按钮的x和y坐标却是相对于作为按钮父组件的的Window而言的。你可能已经注意到了这一点，这也适用于我们在上一节中提到的嵌入在另一个窗口中的窗口。

Button组件也实现了`ButtonExt trait`，它定义了一些有用的方法，比如设置快捷键`Shortcut`来通过其他方法触发我们的按钮。

也可以使用构建器模式来创建一个组件：

```rust
let but1 = Button::new(10, 10, 80, 40, "Button 1");
// 下面为构建器模式
let but1 = Button::default()
    .with_pos(10, 10)
    .with_size(80, 40)
    .with_label("Button 1");
```
它们的效果基本是相同的。

目前位置，我们的程序会显示一个窗口和其中的按钮。这个按钮可以点击，但什么用都没有！但别担心，在下一节中，我们将学习为它添加一些行为（Actions）。