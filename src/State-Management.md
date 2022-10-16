# 状态管理器 State management

FLTK并不强加某种形式的状态管理或应用程序架构。这是留给用户自己选择的。fltk-rs repo和本书中的所有例子都已经使用了回调（Callback）或消息（message），你会发现很多这两种方法的例子。
这些都在[事件 Event](Events.md)中讨论过。

此外，所有的例子可能看起来都是在主函数中处理一切，这只是为了简化。您可以创建自己的应用程序结构，将主窗口和您的应用程序的状态包含在其中：
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

## Helper crates

crates生态系统给出了许多提供状态管理的crates。此外，在fltk-rs组织下有2个crate，它们提供了架构你的应用程序和管理其状态的方法：

- [flemish](https://github.com/fltk-rs/flemish):

提供了一个类似Elm的SVU架构。这是反应式（reactive）的，本质上是不可变的，而且拆解了每个Message的view。

- [fltk-evented](https://github.com/fltk-rs/fltk-evented):

这类似于即时模式的guis，所有事件都在事件循环中处理。在现实中，它也是反应式的，但却是可变的和无状态的。这不会引起触发器的重绘。

这两个crate都避免使用回调，因为在Rust中，由于生命周期和借用机制，处理这些回调极其麻烦。你需要使用具有内部可变性的共享智能指针，才能够借用回调。

你可以看一下这两个crate以获得灵感。

在这两个crate中都展示了一个示例计数器：

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