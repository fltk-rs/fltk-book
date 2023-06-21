# Widgets

FLTK offers around 80 widgets. These widgets all implement the basic set of traits WidgetBase and WidgetExt. We've already come across our first widget, the Window widget.
As we've seen with the Window widget, widgets can also implement other traits depending on their functionality.
Lets add a button to our previous example.

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut but = button::Button::new(160, 200, 80, 40, "Click me!");
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```

<div align="center">

![widgets](https://user-images.githubusercontent.com/98977436/245810501-0f385285-42c5-4bba-a7ce-5517e114b578.PNG)

</div>

Notice that the button's parent is my_window since it's created between the implicit begin() and end() calls.
Another way to add a widget is using the add(widget) method that's offered by widgets implementing the GroupExt trait:
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

Another thing to notice is the initialization of the button which basically has the same constructor as the Window, that's because it's part of the WidgetBase trait. However, although the Window's x and y coordinates are relative to the screen, the button's x and y coordinates are relative to the window which contains the button. This also applies to our embedded window in the previous page if you hadn't noticed.

The button also implements the ButtonExt trait, which offers some helpful methods like setting shortcuts to trigger our button among other methods.

Constructing widgets can also be done using a builder pattern:
```rust
let but1 = Button::new(10, 10, 80, 40, "Button 1");
// OR
let but1 = Button::default()
    .with_pos(10, 10)
    .with_size(80, 40)
    .with_label("Button 1");
```
Which basically have the same effect.

As it stands, our application shows a window with a button, the button is clickable but does nothing!
So lets add some action in there in the next page!
