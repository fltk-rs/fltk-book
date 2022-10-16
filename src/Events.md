# 事件 Events

在前面提到的例子中，你主要看到了回调（Callback），除此之外，FLTK还提供了多种处理事件的方式：
- 我们可以使用set_callback()方法，在点击我们的按钮时自动触发该方法。
- 我们可以使用handle()方法进行细粒度的事件处理。
- 我们可以使用emit()方法，该方法接收一个sender和一个message，这使我们可以在event loop中处理事件。
- 我们可以定义我们自己的事件，它可以在另一个部件的处理方法中被处理。

### 设置回调 Callback
WidgetExt trait 提供了set_callback方法。

#### 使用闭包

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    but.set_callback(|_| println!("The button was clicked!"));
    app.run().unwrap();
}
```

捕获的参数是你所设置了回调的widget的可变借用`&mut Self`： 
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    but.set_callback(|b| b.set_label("Clicked!"));
    app.run().unwrap();
}
```
set_callback()方法有默认的触发器，不同widget可能有不同的触发器。对按钮来说，当它有焦点时，触发器是点击或按下回车。
可以通过set_trigger()方法为widget改变触发器。对于按钮可能没什么意义，但是对于Input widget来说，触发器可以被设置为 "CallbackTrigger::Changed"，这可以使Input widget的状态改变时触发回调：

```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut inp = input::Input::default()
        .with_size(160, 30)
        .center_of_parent();
    win.end();
    win.show();
    inp.set_trigger(enums::CallbackTrigger::Changed);
    inp.set_callback(|i| println!("{}", i.value()));
    a.run().unwrap();
}
```
用户每输入一个字符就会打印一次。

使用闭包的好处是能够“关闭”作用域参数，即你也可以将周围作用域中的变量传递到闭包中：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    but.set_callback(move |_| {
        my_window.set_label("button was pressed");
    });
    app.run().unwrap();
}
```

你会注意到在[菜单](Menus)中，处理是在每个MenuI tem基础上进行的。

#### 使用方法对象
如果你喜欢的话你也可以直接设置方法对象：
```rust
use fltk::{prelude::*, *};

fn button_cb(w: &mut impl WidgetExt) {
    w.set_label("Clicked");
}

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    but.set_callback(button_cb);
    app.run().unwrap();
}
```
我们使用`&mut impl WidgetExt`，以便能够在多种不同的widget类型中重复使用这个函数对象。或者，你可以直接使用`&mut button::Button`来表示只有Button可以使用。
这种方法的一个缺点是，为了处理状态，你必须管理全局状态：

```rust
extern crate lazy_static;

use fltk::{prelude::*, *};
use std::sync::Mutex;

#[derive(Default)]
struct State {
    count: i32,
}

impl State {
    fn increment(&mut self) {
        self.count += 1;
    }
}

lazy_static::lazy_static! {
    static ref STATE: Mutex<State> = Mutex::new(State::default());
}


fn button_cb(_w: &mut button::Button) {
    let mut state = STATE.lock().unwrap();
    state.increment();
}

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Increment!");
    my_window.end();
    my_window.show();
    
    but.set_callback(button_cb);
    
    app.run().unwrap();
}
```
这里我们使用lazy_static，也有其他的crate来优化状态管理。

同样，对菜单来说，在`MenuExt::add()/insert()`或`MenuItem::add()/insert()`方法中，我们可以使用`&mut impl MenuExt`来设置menu widget和menu item的回调。

### 使用处理方法 handle method
handle方法接收一个参数为事件的闭包，并为已处理的事件返回一个bool。这个bool值让FLTK知道该事件是否被处理。
它的调用是这样的：

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();

    but.handle(|_, event| {
        println!("The event: {:?}", event);
        false
    });
    
    app.run().unwrap();
}
```
这将打印出event，但并不处理它，因为我们返回false。很明显，我们想做一些有用的事情，所以把处理调用改为：
```rust
    but.handle(|_, event| match event {
        Event::Push => {
            println!("I was pushed!");
            true
        },
        _ => false,
    });
```
在这里，我们做一些有用的事情来处理推送事件并返回真，将其他事件都忽略并返回假。

另一个例子：
```rust
    but.handle(|b, event| match event {
        Event::Push => {
            b.set_label("Pushed");
            true
        },
        _ => false,
    });
```

### 使用messages
这允许我们创建Channel和一个Sender Receiver结构，然后我们可以发射Message（必须是Send + Sync安全的），并在我们的事件循环中处理。这样做的好处是，当我们需要将我们的类型传递到闭包或生成的线程中时，我们不必用智能指针来包装它们。
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();

    let (s, r) = app::channel();
    
    but.emit(s, true);
    // 这等同于调用but.set_callback(move |_| s.send(true))

    while app.wait() {
        if let Some(msg) = r.recv() {
            match msg {
                true => println!("Clicked"),
                false => (), // 这里不作任何事
            }
        }
    }
}
```
跟之前的例子一样，Messages 可以在事件循环中被接受， 另外你也可以在后台线程或app::add_idle()的回调中接收Message：
```rust
    app::add_idle(move || {
        if let Some(msg) = r.recv() {
            match msg {
                true => println!("Clicked"),
                false => (), // 这里不做任何事
            }
        }
    });
```

你也不限于使用fltk channel，你可以使用任何channel。例如，这个使例子用std channel：
```rust
let (s, r) = std::sync::mpsc::channel::<Message>();
btn.set_callback(move |_| {
    s.send(Message::SomeMessage).unwrap();
});
```

你也可以定义一个适用于所有widget的方法，类似于emit()方法：
```rust
use std::sync::mpsc::Sender;

pub trait SenderWidget<W, T>
where
    W: WidgetExt,
    T: Send + Sync + Clone + 'static,
{
    fn send(&mut self, sender: Sender<T>, msg: T);
}

impl<W, T> SenderWidget<W, T> for W
where
    W: WidgetExt,
    T: Send + Sync + Clone + 'static,
{
    fn send(&mut self, sender: Sender<T>, msg: T) {
        self.set_callback(move |_| {
            sender.send(msg.clone()).unwrap();
        });
    }
}

fn main() {
    let btn = button::Button::default();
    let (s, r) = std::sync::mpsc::channel::<Message>();
    btn.send(s.clone(), Message::SomeMessage);
}
```

### 创建自己的events
FLTK识别了29个事件，这些事件在enums::Event中可以看到。然而，它允许我们使用app::handle(impl Into<i32>, window)调用创建我们自己的事件。handle函数接受一个任意的i32（>30）值作为信号，理想情况下，这些值应该是预定义的，可以在另一个widget的handle()方法中处理，另一个widget需要在传递给app::handle的窗口中。
在下面的例子中，我们创建了一个带有Frame和button的窗口。button的回调通过app::handle_main函数发送一个CHANGED事件。该CHANGED信号在框架的handle方法中被查询到：

```rust
use fltk::{app, button::*, enums::*, frame::*, group::*, prelude::*, window::*};
use std::cell::RefCell;
use std::rc::Rc;

pub struct MyEvent;

impl MyEvent {
    const CHANGED: i32 = 40;
}

#[derive(Clone)]
pub struct Counter {
    count: Rc<RefCell<i32>>,
}

impl Counter {
    pub fn new(val: i32) -> Self {
        Counter {
            count: Rc::from(RefCell::from(val)),
        }
    }

    pub fn increment(&mut self) {
        *self.count.borrow_mut() += 1;
        app::handle_main(MyEvent::CHANGED).unwrap();
    }

    pub fn decrement(&mut self) {
        *self.count.borrow_mut() -= 1;
        app::handle_main(MyEvent::CHANGED).unwrap();
    }

    pub fn value(&self) -> i32 {
        *self.count.borrow()
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let app = app::App::default();
    let counter = Counter::new(0);
    let mut wind = Window::default().with_size(160, 200).with_label("Counter");
    let mut pack = Pack::default().with_size(120, 140).center_of(&wind);
    pack.set_spacing(10);
    let mut but_inc = Button::default().with_size(0, 40).with_label("+");
    let mut frame = Frame::default()
        .with_size(0, 40)
        .with_label(&counter.clone().value().to_string());
    let mut but_dec = Button::default().with_size(0, 40).with_label("-");
    pack.end();
    wind.end();
    wind.show();

    but_inc.set_callback({
        let mut c = counter.clone();
        move |_| c.increment()
    });

    but_dec.set_callback({
        let mut c = counter.clone();
        move |_| c.decrement()
    });
    
    frame.handle(move |f, ev| {
        if ev == MyEvent::CHANGED.into() {
            f.set_label(&counter.clone().value().to_string());
            true
        } else {
            false
        }
    });

    Ok(app.run()?)
}
```
发送的i32信号可以即时创建，或者也可以添加到局部/全局常量中，或者添加到一个枚举中。

#### 优点
- 无开销。
- 该信号的处理与任何fltk事件一样。
- app::handle函数可以返回一个bool，表示该事件是否被处理。
- 允许在事件循环之外处理自定义信号/事件。
- 允许在你的应用程序中采用MVC或SVU架构。

#### 缺点
- 该信号只能在一个widget的处理方法中处理。
- 该信号在事件循环中是不可访问的（为此，你可能想使用WidgetExt::emit或本页之前描述的channel）。
