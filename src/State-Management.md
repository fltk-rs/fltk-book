# 状态管理器 State management

FLTK没有固化的某种形式的状态管理方法或程序架构，这些部分交由开发者自行设计选择。fltk-rs仓库和本书中的所有示例几乎都使用了回调（Callback）和消息（message）的方式来处理事件和管理状态，你能找它们的很多例子。
这些都在[事件 Event](Events.md)中讨论过。

此外，为了简单起见，所有的示例都是在`main`函数中处理一切。您可以创建自己的`App`结构，将主窗口和你维护的数据状态放在里面：
```rust
use fltk::{prelude::*, *};

#[derive(Copy, Clone)]
enum Message {
    Inc,
    Dec,
}

struct MyApp {
    app: app::App,
    main_win: window::Window,
    frame: frame::Frame,
    count: i32,
    receiver: app::Receiver<Message>,
}

impl MyApp {
    pub fn new() -> Self {
        let count = 0;
        let app = app::App::default();
        let (s, receiver) = app::channel();
        let mut main_win = window::Window::default().with_size(400, 300);
        let col = group::Flex::default()
            .with_size(100, 200)
            .column()
            .center_of_parent();
        let mut inc = button::Button::default().with_label("+");
        inc.emit(s, Message::Inc);
        let frame = frame::Frame::default().with_label(&count.to_string());
        let mut dec = button::Button::default().with_label("-");
        dec.emit(s, Message::Dec);
        col.end();
        main_win.end();
        main_win.show();
        Self {
            app,
            main_win,
            frame,
            count,
            receiver,
        }
    }

    pub fn run(mut self) {
        while self.app.wait() {
            if let Some(msg) = self.receiver.recv() {
                match msg {
                    Message::Inc => self.count += 1,
                    Message::Dec => self.count -= 1,
                }
                self.frame.set_label(&self.count.to_string());
            }
        }
    }
}

fn main() {
    let a = MyApp::new();
    a.run();
}
```

## 辅助 crates

Rust的Crate生态为我们提供了很多用于进行状态管理的Crate。在`fltk-rs` GitHub组织下有2个crate，它们提供了几种程序架构设计和状态管理的方法：

- [flemish](https://github.com/fltk-rs/flemish):

提供了一个类似`Elm`的SVU架构。它是反应式（reactive）的，本质上不可变，每次发送消息都会让视图进行重绘，参见Elm的设计。

- [fltk-evented](https://github.com/fltk-rs/fltk-evented):

类似于即时模式的GUI界面，所有事件都在事件循环中处理。实际上它也是反应式的，但它是可变且无状态的。使用它可以避免触发事件引起视图重绘。

这两个crate都尽量避免使用回调方法，由于Rust的生命周期和借用检查机制，处理回调极其麻烦。你需要使用内部可变性的智能指针，才能够在回调中借用。

你可以看一下这两个crate，或许会启发你的灵感。

下面是分别使用这两个Crate实现计时器的示例：

## Flemish
```rust
use flemish::{
    button::Button, color_themes, frame::Frame, group::Flex, prelude::*, OnEvent, Sandbox, Settings,
};

pub fn main() {
    Counter::new().run(Settings {
        size: (300, 100),
        resizable: true,
        color_map: Some(color_themes::BLACK_THEME),
        ..Default::default()
    })
}

#[derive(Default)]
struct Counter {
    value: i32,
}

#[derive(Debug, Clone, Copy)]
enum Message {
    IncrementPressed,
    DecrementPressed,
}

impl Sandbox for Counter {
    type Message = Message;

    fn new() -> Self {
        Self::default()
    }

    fn title(&self) -> String {
        String::from("Counter - fltk-rs")
    }

    fn update(&mut self, message: Message) {
        match message {
            Message::IncrementPressed => {
                self.value += 1;
            }
            Message::DecrementPressed => {
                self.value -= 1;
            }
        }
    }

    fn view(&mut self) {
        let col = Flex::default_fill().column();
        Button::default()
            .with_label("Increment")
            .on_event(Message::IncrementPressed);
        Frame::default().with_label(&self.value.to_string());
        Button::default()
            .with_label("Decrement")
            .on_event(Message::DecrementPressed);
        col.end();
    }
}
```

## fltk-evented
```rust
use fltk::{app, button::Button, frame::Frame, group::Flex, prelude::*, window::Window};
use fltk_evented::Listener;

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    app::set_font_size(20);

    let mut wind = Window::default()
        .with_size(160, 200)
        .center_screen()
        .with_label("Counter");
    let flex = Flex::default()
        .with_size(120, 160)
        .center_of_parent()
        .column();
    let but_inc: Listener<_> = Button::default().with_label("+").into();
    let mut frame = Frame::default();
    let but_dec: Listener<_> = Button::default().with_label("-").into();
    flex.end();
    wind.end();
    wind.show();

    let mut val = 0;
    frame.set_label(&val.to_string());

    while a.wait() {
        if but_inc.triggered() {
            val += 1;
            frame.set_label(&val.to_string());
        }

        if but_dec.triggered() {
            val -= 1;
            frame.set_label(&val.to_string());
        }
    }
}
```