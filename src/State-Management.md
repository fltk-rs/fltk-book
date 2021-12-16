FLTK doesn't impose a certain form of state management or app architecture. This is left to the user. All the examples in the fltk-rs repo and this wiki already use either callbacks or messages, you'll find many examples of both methods.
Those were discussed in the [events page](https://github.com/fltk-rs/fltk-rs/wiki/events).

Also all the examples might appear to handle everything in the main function, this is only for simplicity. You can create your own App struct, include the main window in it and the state of your app:
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

The crates ecosystem offers many crates which provide state management. Also there are 2 crates under the fltk-rs org which offer means of architecting your app and managing its state:

- [flemish](https://github.com/fltk-rs/flemish):

Offers an Elm like SVU architecture. This is reactive, immutable in essence, and tears down the view which each Message.

- [fltk-evented](https://github.com/fltk-rs/fltk-evented):

This resembles immediate-mode guis in that all events are handled in the event loop. In reality it's also reactive but mutable and stateless. This doesn't cause a redraw with triggers.

Both crates avoid the use of callbacks since these can be a pain in Rust in terms of lifetimes and borrowing. You need to use shared smart pointers with interior mutability to be able to borrow into a callback.

You can take a look at both crates for inspiration.

A sample counter in both:

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

    while a.wait() {
        if but_inc.triggered() {
            val += 1;
        }

        if but_dec.triggered() {
            val -= 1;
        }

        frame.set_label(&val.to_string());
    }
}
```