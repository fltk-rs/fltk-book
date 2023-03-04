# 自定义组件 Custom widgets

fltk-rs允许你创建自定义组件。我们需要定义一个`Struct`来作为自定义组件的类型，我们需要用一个已经存在的`Widget`和`widget type`来扩展它。最基本的`Widget type`是`widget::Widget`。
1. 定义你的`Struct`，以及它需要维护的内部数据：

    ```rust
    use fltk::{prelude::*, *};
    use std::cell::RefCell;
    use std::rc::Rc;

    struct MyCustomButton {
        inner: widget::Widget,
        num_clicks: Rc<RefCell<i32>>,
    }
    ```
你会注意到两件事，我们正在使用一个`Rc<RefCell<T>>`来存储我们需要用到的数据。在一般情况下这是没有必要的。但是，在它的回调方法被调用时它的所有权会被移动，为了在执行完一次回调之后仍能使用它，我们将把它包装在一个`Rc<RefCell<>>`中。这段代码中我们已经导入了必要的模块。

2. 为组件实现方法。最重要的是要有构造函数，因为我们要通过它来初始化组件和内部数据：

    ```rust
    impl MyCustomButton {
    
        pub fn new(radius: i32, label: &str) -> Self {
            let mut inner = widget::Widget::default()
                .with_size(radius * 2, radius * 2)
                .with_label(label)
                .center_of_parent();
            inner.set_frame(enums::FrameType::OFlatBox);
            let num_clicks = 0;
            let num_clicks = Rc::from(RefCell::from(num_clicks));
            let clicks = num_clicks.clone();
            inner.draw(|i| { 
                // 我们需要实现绘制方法
                draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
                draw::set_draw_color(enums::Color::Black);
                // 设置文字的颜色
                draw::set_font(enums::Font::Helvetica, app::font_size());
                draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
            });
            inner.handle(move |i, ev| match ev {
                enums::Event::Push => {
                    *clicks.borrow_mut() += 1; 
                    // 使 num_clicks 在点击时递增
                    i.do_callback(); 
                    // 执行我们使用 set_callback() 设置的回调方法
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

3. 在我们的自定义组件上应用`widget_extends！`宏，该宏需要传入我们的小组件，它扩展的基本类型，以及结构体中表示该基本类型的成员。这是通过实现`Deref Trait`和`DerefMut Trait`实现的。该宏还会自动为我们的自定义组件添加了其他函数和固定的方法（anchoring methods）：

```rust
// 通过宏扩展widget::Widget
widget_extends!(MyCustomButton, widget::Widget, inner);
```

现在来试一试我们的自定义组件：
```rust
fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    app::background(255, 255, 255); // 设置白色背景
    let mut wind = window::Window::new(100, 100, 400, 300, "Hello from rust");
    
    let mut btn = MyCustomButton::new(50, "Click");
    // 注意，set_color和set_callback是宏自动为我们实现了
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

    pub fn new(radius: i32, label: &str) -> Self {
        let mut inner = widget::Widget::default()
            .with_size(radius * 2, radius * 2)
            .with_label(label)
            .center_of_parent();
        inner.set_frame(enums::FrameType::OFlatBox);
        let num_clicks = 0;
        let num_clicks = Rc::from(RefCell::from(num_clicks));
        let clicks = num_clicks.clone();
        inner.draw(|i| { 
            // 我们需要一个绘制的方法
            draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
            draw::set_draw_color(enums::Color::Black); // 设置文字颜色
            draw::set_font(enums::Font::Helvetica, app::font_size());
            draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
        });
        inner.handle(move |i, ev| match ev {
            enums::Event::Push => {
                *clicks.borrow_mut() += 1;
                // 使 num_clicks 在点击时递增
                i.do_callback(); 
                // 执行我们使用 set_callback() 设置的回调方法
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

// 通过宏扩展widget::Widget
widget_extends!(MyCustomButton, widget::Widget, inner);

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    // 设置背景为白色
    app::background(255, 255, 255);
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
