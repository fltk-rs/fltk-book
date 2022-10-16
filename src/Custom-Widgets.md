# 自定义组件 Custom widgets

fltk-rs允许你创建自定义widget。我们需要定义一个struct，它需要扩展一个已经存在的widget和widget type。最基本的widget type是widget::Widget。
1- 定义你的struct和任何其他需要存储在其中的内部数据：

```rust
use fltk::{prelude::*, *};
use std::cell::RefCell;
use std::rc::Rc;

struct MyCustomButton {
    inner: widget::Widget,
    num_clicks: Rc<RefCell<i32>>,
}
```
你会注意到两件事，我们正在使用一个Rc RefCell来存储数据。这在一般情况下是没有必要的，但是，由于我们需要将这些数据所有权move到一个回调中，同时在我们修改它之后仍然可以访问它，我们将把它包装在一个Rc RefCell中。我们已经导入了必要的模块。

2- 定义结构的impl。其中最重要的是构造函数，因为我们要通过它来初始化内部数据：

```rust
impl MyCustomButton {
    // 我们定义的结构体
    pub fn new(radius: i32, label: &str) -> Self {
        let mut inner = widget::Widget::default()
            .with_size(radius * 2, radius * 2)
            .with_label(label)
            .center_of_parent();
        inner.set_frame(enums::FrameType::OFlatBox);
        let num_clicks = 0;
        let num_clicks = Rc::from(RefCell::from(num_clicks));
        let clicks = num_clicks.clone();
        inner.draw(|i| { // 我们需要一个绘图的实现 draw implementation
            draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
            draw::set_draw_color(enums::Color::Black); // 设置文字颜色
            draw::set_font(enums::Font::Helvetica, app::font_size());
            draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
        });
        inner.handle(move |i, ev| match ev {
            enums::Event::Push => {
                *clicks.borrow_mut() += 1; // 递增 num_clicks
                i.do_callback(); // 使用 set_callback() 时设置的回调
                true
            }
            _ => false,
        });
        Self {
            inner,
            num_clicks,
        }
    }

    // 获得我们的按钮被点击的次数
    pub fn num_clicks(&self) -> i32 {
        *self.num_clicks.borrow()
    }
}
```

3- 对我们的struct应用widget_extends！宏，该宏需要基本类型，已经我们通过该成员扩展的自定义类型。这是通过实现Deref和DerefMut trait实现的。该宏还添加了其他方便的构造函数和锚定方法（anchoring methods）：

```rust
// 通过成员`inner`扩展widget::Widget，并添加其他初始化器和构造函数
widget_extends!(MyCustomButton, widget::Widget, inner);
```

现在来试一试我们的struct：
```rust
fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    app::background(255, 255, 255); // 设置白色背景
    let mut wind = window::Window::new(100, 100, 400, 300, "Hello from rust");
    
    let mut btn = MyCustomButton::new(50, "Click");
    // 注意，set_color和set_callback已经自动为我们实现了
    btn.set_color(enums::Color::Cyan);
    btn.set_callback(|_| println!("Clicked"));
    
    wind.end();
    wind.show();

    app.run().unwrap();
    
    // 打印我们的按钮被点击的数字，退出
    println!("Our button was clicked {} times", btn.num_clicks());
}
```

全部代码：
```rust
use fltk::{prelude::*, *};
use std::cell::RefCell;
use std::rc::Rc;

struct MyCustomButton {
    inner: widget::Widget,
    num_clicks: Rc<RefCell<i32>>,
}

impl MyCustomButton {
    // 我们定义的结构体
    pub fn new(radius: i32, label: &str) -> Self {
        let mut inner = widget::Widget::default()
            .with_size(radius * 2, radius * 2)
            .with_label(label)
            .center_of_parent();
        inner.set_frame(enums::FrameType::OFlatBox);
        let num_clicks = 0;
        let num_clicks = Rc::from(RefCell::from(num_clicks));
        let clicks = num_clicks.clone();
        inner.draw(|i| { // 我们需要一个绘图的实现 draw implementation
            draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
            draw::set_draw_color(enums::Color::Black); // 设置文字颜色
            draw::set_font(enums::Font::Helvetica, app::font_size());
            draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
        });
        inner.handle(move |i, ev| match ev {
            enums::Event::Push => {
                *clicks.borrow_mut() += 1; // 递增 num_clicks
                i.do_callback(); // 使用 set_callback() 时设置的回调
                true
            }
            _ => false,
        });
        Self {
            inner,
            num_clicks,
        }
    }

    // 获得我们的按钮被点击的次数
    pub fn num_clicks(&self) -> i32 {
        *self.num_clicks.borrow()
    }
}

// 通过成员`inner`扩展widget::Widget，并添加其他初始化器和构造函数
widget_extends!(MyCustomButton, widget::Widget, inner);

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    app::background(255, 255, 255); // 设置白色背景
    let mut wind = window::Window::new(100, 100, 400, 300, "Hello from rust");
    let mut btn = MyCustomButton::new(50, "Click");
    btn.set_color(enums::Color::Cyan);
    btn.set_callback(|_| println!("Clicked"));
    wind.end();
    wind.show();

    app.run().unwrap();
    
    // 打印我们的按钮被点击的数字，退出
    println!("Our button was clicked {} times", btn.num_clicks());
}
```

![image](https://user-images.githubusercontent.com/37966791/145727718-fd0ee71f-f0c2-4438-a038-9b6950638a35.png)
