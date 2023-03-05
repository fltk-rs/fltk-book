# 事件 Events

在之前章节的示例中，我们处理事件的方法主要是使用回调（Callback）。但是我们可以根据具体的使用情况选择其他方法，FLTK提供的处理事件的方式有这几种：
- `set_callback()`方法，在点击按钮时自动触发。
- `handle()`方法，用于进行细粒度的事件处理。
- `emit()`方法，接收一个`sender`和一个`message`将触发的事件类型发送，之后在`event loop`中处理事件。
- 我们还可以自定义一个可以在另一个组件的处理方法中被处理的事件。

### 设置回调 Callback
`WidgetExt trait` 中定义了`set_callback`方法。

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

这里闭包捕获的环境是设置回调的组件自身的`&mut self`： 
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
你的按钮何时执行回调方法，点击时？还是鼠标松开时？你需要设置触发器来决定何时执行回调，`set_callback()`方法会设置默认的触发器，不同组件的触发器可能不同。例如按钮组件的触发器便是，当它具有鼠标焦点时的点击或按下回车。
某个组件的触发器是可以通过`set_trigger()`方法改变的。改变按钮的触发方式可能没有意义，但是对于`Input`组建来说，触发器可以被设置为`CallbackTrigger::Changed`，这可以使`Input`组件在状态改变时就触发回调：

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
在这个示例中，用户每输入一个字符都会打印一次。

使用闭包的好处便是因为它能够捕获环境，你可以将闭包环境作用域中的其他变量传递进去：
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

在[菜单](Menus)中，事件处理是在每个`MenuItem`上进行的。

#### 使用方法对象 Function Object
如果你喜欢的话你也可以直接传递函数对象：
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
我们使用`&mut impl WidgetExt`，以便让所有组件都能使用这个回调。或者，你可以直接使用`&mut button::Button`只让`Button`使用。
这种方法的一个缺点是，有时候你必须维护全局状态：

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
这里我们用了`lazy_static`，当然也有其他的`crate`来用来进行状态管理。

同样，对菜单来说，在`MenuExt::add()/insert()`或`MenuItem::add()/insert()`方法中，我们可以使用`&mut impl MenuExt`来设置`Menu`和`Menu Item`的回调。

### 使用处理方法 handle method
`handle`方法接收一个有事件参数的闭包，并在处理后返回一个`bool`。这个返回值让FLTK知道该事件是否被处理。
它的使用是这样的：

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
这段代码将打印出`event`，但并不做其他处理，所以我们返回false。很明显，我们应该做一些有用的处理，所以我们把它改成这样：
```rust
    but.handle(|_, event| match event {
        Event::Push => {
            println!("I was pushed!");
            true
        },
        _ => false,
    });
```
在这里，我们处理事件`Event`然后返回`true`，将其他事件将被忽略并返回`false`。

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
这允许我们创建Channel和`Sender` `Receiver`的结构，在触发后发送Message（Message必须是`Send + Sync`），并在`event loop`中处理。这样做的好处是，当我们需要将我们的一些量传递到闭包或线程中时，不必再使用智能指针来包装它们。
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
    // 相当于 but.set_callback(move |_| s.send(true))

    while app.wait() {
        if let Some(msg) = r.recv() {
            match msg {
                true => println!("Clicked"),
                false => (), // 什么都不做
            }
        }
    }
}
```
跟之前的例子一样，Messages 可以在`event loop`中被接受，另外你也可以在后台线程或`app::add_idle()`的回调中接收`Message`：
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

这里也不限于使用`fltk channel`，你可以使用任何channel。例如，这个例子用使用了`std channel`：
```rust
let (s, r) = std::sync::mpsc::channel::<Message>();
btn.set_callback(move |_| {
    s.send(Message::SomeMessage).unwrap();
});
```

类似于`emit()`方法，你也可以定义一个适用于所有组件的`send()`方法，：
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

### 创建自己的事件
FLTK在`enums::Event`中预先定义了29个事件。我们还可以使用调用`app::handle(impl Into<i32>, window)`创建我们自己的事件。`handle`函数以任意一个大于30的`i32`类型值作为信号标识，最好提前定义好信号标识。我们可以在另一个组件的`handle()`方法中处理事件，注意这个组件需要放在传递给`app::handle`的那个窗口内部。
在下面的例子中，我们创建了一个带有`Frame`和`Button`的窗口。`Button`的回调函数在执行时，通过`app::handle_main`函数发送一个`CHANGED`事件。该`CHANGED`信号在`Frame`的`handle`方法中被接收到并做出处理：

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
发送的`i32`信号可以是动态创建的，也可以把它存在一个局部或全局常量中，或者存放在一个枚举中。

#### 优点
- 无开销。
- 信号的处理方式与其他任何FLTK事件一样。
- `app::handle`函数可以返回一个bool，表示该事件是否被处理。
- 允许在事件循环之外处理自定义信号/事件。
- 允许在程序中使用MVC或SVU架构。

#### 缺点
- 信号只能在一个组件的处理方法中处理。
- 该信号在事件循环中是不可访问的（为解决，可以使用`WidgetExt::emit`或本节前面部分描述的`channel`）。
