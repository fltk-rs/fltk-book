fltk-rs allows you to create custom widgets. We need to define a struct which extends an already existing widget and widget type. The most basic widget type being widget::Widget. 
1- Define your struct and whatever other internal data needs to be stored in it.
```rust
use fltk::{prelude::*, *};
use std::cell::RefCell;
use std::rc::Rc;

struct MyCustomButton {
    inner: widget::Widget,
    num_clicks: Rc<RefCell<i32>>,
}
```
You'll notice 2 things, we're using an Rc RefCell for the data we're storing. This isn't necessary in the general case, however, since we need to move that data into a callback, while still having access to it after we mutate it, we'll wrap it in an Rc RefCell. We've imported the necessary modules.

2- Define the implementation of your struct. The most important of these being the constructor since it's how we'll initialize the internal data as well:
```rust
impl MyCustomButton {
    // our constructor
    pub fn new(radius: i32, label: &str) -> Self {
        let mut inner = widget::Widget::default()
            .with_size(radius * 2, radius * 2)
            .with_label(label)
            .center_of_parent();
        inner.set_frame(enums::FrameType::OFlatBox);
        let num_clicks = 0;
        let num_clicks = Rc::from(RefCell::from(num_clicks));
        let clicks = num_clicks.clone();
        inner.draw(|i| { // we need a draw implementation
            draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
            draw::set_draw_color(enums::Color::Black); // for the text
            draw::set_font(enums::Font::Helvetica, app::font_size());
            draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
        });
        inner.handle(move |i, ev| match ev {
            enums::Event::Push => {
                *clicks.borrow_mut() += 1; // increment num_clicks
                i.do_callback(); // do the callback which we'll set using set_callback().
                true
            }
            _ => false,
        });
        Self {
            inner,
            num_clicks,
        }
    }

    // get the times our button was clicked
    pub fn num_clicks(&self) -> i32 {
        *self.num_clicks.borrow()
    }
}
```

3- Apply the widget_extends! macro to our struct, the macro requires the base type, and the member via which our custom type is extended. This is done via implementing the Deref and DerefMut traits. The macro also adds other convenience constructors and anchoring methods:
```rust
// Extend widget::Widget via the member `inner` and add other initializers and constructors
widget_extends!(MyCustomButton, widget::Widget, inner);
```

Now we're ready to try out our struct:
```rust
fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    app::background(255, 255, 255); // make the background white
    let mut wind = window::Window::new(100, 100, 400, 300, "Hello from rust");
    
    let mut btn = MyCustomButton::new(50, "Click");
    // notice that set_color and set_callback are automatically implemented for us!
    btn.set_color(enums::Color::Cyan);
    btn.set_callback(|_| println!("Clicked"));
    
    wind.end();
    wind.show();

    app.run().unwrap();
    
    // print the number our button was clicked on exit
    println!("Our button was clicked {} times", btn.num_clicks());
}
```

Full code:
```rust
use fltk::{prelude::*, *};
use std::cell::RefCell;
use std::rc::Rc;

struct MyCustomButton {
    inner: widget::Widget,
    num_clicks: Rc<RefCell<i32>>,
}

impl MyCustomButton {
    // our constructor
    pub fn new(radius: i32, label: &str) -> Self {
        let mut inner = widget::Widget::default()
            .with_size(radius * 2, radius * 2)
            .with_label(label)
            .center_of_parent();
        inner.set_frame(enums::FrameType::OFlatBox);
        let num_clicks = 0;
        let num_clicks = Rc::from(RefCell::from(num_clicks));
        let clicks = num_clicks.clone();
        inner.draw(|i| { // we need a draw implementation
            draw::draw_box(i.frame(), i.x(), i.y(), i.w(), i.h(), i.color());
            draw::set_draw_color(enums::Color::Black); // for the text
            draw::set_font(enums::Font::Helvetica, app::font_size());
            draw::draw_text2(&i.label(), i.x(), i.y(), i.w(), i.h(), i.align());
        });
        inner.handle(move |i, ev| match ev {
            enums::Event::Push => {
                *clicks.borrow_mut() += 1; // increment num_clicks
                i.do_callback(); // do the callback which we'll set using set_callback().
                true
            }
            _ => false,
        });
        Self {
            inner,
            num_clicks,
        }
    }

    // get the times our button was clicked
    pub fn num_clicks(&self) -> i32 {
        *self.num_clicks.borrow()
    }
}

// Extend widget::Widget via the member `inner` and add other initializers and constructors
widget_extends!(MyCustomButton, widget::Widget, inner);

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gleam);
    app::background(255, 255, 255); // make the background white
    let mut wind = window::Window::new(100, 100, 400, 300, "Hello from rust");
    let mut btn = MyCustomButton::new(50, "Click");
    btn.set_color(enums::Color::Cyan);
    btn.set_callback(|_| println!("Clicked"));
    wind.end();
    wind.show();

    app.run().unwrap();
    
    // print the number our button was clicked on exit
    println!("Our button was clicked {} times", btn.num_clicks());
}
```

![image](https://user-images.githubusercontent.com/37966791/145727718-fd0ee71f-f0c2-4438-a038-9b6950638a35.png)
