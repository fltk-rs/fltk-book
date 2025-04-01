# State management

FLTK doesn't impose a certain form of state management or app architecture. This is left to the user. All the examples in the fltk-rs repo and this book already use either callbacks or messages, you'll find many examples of both methods.
Those were discussed in the [events page](Events.md).

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

The crates ecosystem offers many crates which provide state management. Also there are 3 crates under the fltk-rs org which offer means of architecting your app and managing its state:

- [fltk-observe](https://github.com/fltk-rs/fltk-observe)
Provides an observer-like mechanism on top of fltk-rs. With it, you can implement patterns such as MVC, MVP, or MVVM. The crate helps decouple your data (Model) from your UI (View) by automatically triggering updates in the UI when state changes, making your code cleaner and easier to maintain.

- [flemish](https://github.com/fltk-rs/flemish):

Implements an Elm-like architecture, sometimes referred to as SVU (State-View-Update). It uses an immutable, reactive approach: each time you send a Message, Flemish compares the difference in the virtual dom and updates the View according to the updated state. This can simplify logic by making view rendering a pure function of your state.

- [fltk-evented](https://github.com/fltk-rs/fltk-evented):

Adopts a more immediate-mode paradigm, where all events are handled centrally in the event loop. Despite being described as “reactive” and “stateless,” it still processes user interactions in a single pass, updating state as needed without forcing redraws unless explicitly triggered. This avoids needing multiple callbacks scattered throughout your code.

All three crates aim to sidestep heavy use of callbacks, which can introduce borrowing complexities in Rust. Instead, they lean on shared smart pointers, internal mutability, or fully reactive state flows, so you don’t have to juggle lifetimes and manual callback wiring. If you’re looking for alternative approaches to managing state and events in your fltk-rs application, check out each crate for inspiration on different ways to structure your GUI logic.

A sample counter in the above mentioned crates:
## fltk-observe
```rust
use fltk::{app, button::Button, prelude::*, window::Window};
use fltk_observe::{Runner, WidgetObserver};

struct Counter {
    value: i32,
}

impl Counter {
    fn new() -> Self {
        Self { value: 0 }
    }

    fn value(&self) -> i32 {
        self.value
    }

    fn increment(&mut self, _b: &Button) {
        self.value += 1;
    }

    fn update_label(&self, b: &mut Button) {
        b.set_label(&self.value().to_string());
    }
}

fn main() {
    let a = app::App::default().use_state(Counter::new).unwrap();

    let mut window = Window::default().with_size(200, 200).with_label("Add data");
    let mut inc = Button::default_fill();
    inc.set_action(Counter::increment);
    inc.set_view(Counter::update_label);
    window.end();
    window.show();

    a.run().unwrap();
}
```

An example of an MVVM architecture on top of fltk-observe:
```rust
use fltk::{app, button::Button, frame::Frame, group::Flex, prelude::*, window::Window};

struct Counter {
    value: i32,
}

impl Counter {
    fn new() -> Self {
        Self { value: 0 }
    }
    fn increment(&mut self) {
        self.value += 1;
    }
    fn decrement(&mut self) {
        self.value -= 1;
    }
    fn get_value(&self) -> i32 {
        self.value
    }
}

struct CounterViewModel {
    model: Counter,
}

impl CounterViewModel {
    fn new() -> Self {
        Self {
            model: Counter::new(),
        }
    }

    fn increment(&mut self, _btn: &Button) {
        self.model.increment();
    }

    fn decrement(&mut self, _btn: &Button) {
        self.model.decrement();
    }

    fn update_display(&self, frame: &mut Frame) {
        frame.set_label(&self.model.get_value().to_string());
    }
}

struct CounterView {
    inc_btn: Button,
    dec_btn: Button,
    display: Frame,
}

impl CounterView {
    fn new() -> Self {
        let mut window = Window::default()
            .with_size(300, 160)
            .with_label("MVVM (fltk-observe)");
        let flex = Flex::default_fill().column();
        let inc_btn = Button::default().with_label("Increment");
        let display = Frame::default();
        let dec_btn = Button::default().with_label("Decrement");
        flex.end();
        window.end();
        window.show();
        Self {
            inc_btn,
            dec_btn,
            display,
        }
    }
}

struct CounterApp {
    app: app::App,
}

impl CounterApp {
    fn new() -> Self {
        use fltk_observe::{Runner, WidgetObserver};
        let app = app::App::default()
            .use_state(CounterViewModel::new)
            .unwrap();

        let mut view = CounterView::new();
        view.inc_btn.set_action(CounterViewModel::increment);
        view.dec_btn.set_action(CounterViewModel::decrement);
        view.display.set_view(CounterViewModel::update_display);

        Self { app }
    }

    fn run(&self) {
        self.app.run().unwrap();
    }
}

fn main() {
    let app = CounterApp::new();
    app.run();
}
```


## Flemish
```rust
use flemish::{view::*, Settings};

pub fn main() {
    flemish::application("counter", Counter::update, Counter::view)
        .settings(Settings {
            size: (300, 100),
            resizable: true,
            ..Default::default()
        })
        .run();
}

#[derive(Default)]
struct Counter {
    value: i32,
}

#[derive(Debug, Clone, Copy)]
enum Message {
    Increment,
    Decrement,
}

impl Counter {
    fn update(&mut self, message: Message) {
        match message {
            Message::Increment => {
                self.value += 1;
            }
            Message::Decrement => {
                self.value -= 1;
            }
        }
    }

    fn view(&self) -> View<Message> {
        Column::new(&[
            Button::new("+", Message::Increment).view(),
            Frame::new(&self.value.to_string()).view(),
            Button::new("-", Message::Decrement).view(),
        ])
        .view()
    }
}
```

## fltk-evented
```rust
use fltk::{app, button::Button, frame::Frame, group::Flex, prelude::*, window::Window};
use fltk_evented::Listener;

struct Counter {
    value: i32,
}

impl Counter {
    fn new() -> Self {
        Self { value: 0 }
    }
    fn increment(&mut self) {
        self.value += 1;
    }
    fn decrement(&mut self) {
        self.value -= 1;
    }
    fn value(&self) -> i32 {
        self.value
    }
}

struct CounterApp {
    counter: Counter,
    a: app::App,
    but_inc: Listener<Button>,
    frame: Frame,
    but_dec: Listener<Button>,
}

impl CounterApp {
    pub fn new(counter: Counter) -> Self {
        let a = app::App::default().with_scheme(app::Scheme::Gtk);
        app::set_font_size(20);

        let mut wind = Window::default()
            .with_size(160, 200)
            .with_label("Counter");
        let flex = Flex::default()
            .with_size(120, 160)
            .center_of_parent()
            .column();
        let but_inc: Listener<_> = Button::default().with_label("+").into();
        let frame = Frame::default().with_label(&counter.value().to_string());
        let but_dec: Listener<_> = Button::default().with_label("-").into();
        flex.end();
        wind.end();
        wind.show();
        Self {
            counter,
            a,
            but_inc,
            frame,
            but_dec,
        }
    }
    pub fn run(&mut self) {
        while self.a.wait() {
            if fltk_evented::event() {
                if self.but_inc.triggered() {
                    self.counter.increment();
                }
                if self.but_dec.triggered() {
                    self.counter.decrement();
                }
                self.frame.set_label(&self.counter.value().to_string());
            }
        }
    }
}

fn main() {
    let mut app = CounterApp::new(Counter::new());
    app.run();
}
```

