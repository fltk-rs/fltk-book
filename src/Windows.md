FLTK calls the native window on each platform it supports, then basically does its own drawing. This means it calls an HWND on windows, NSWindow on MacOS and an XWindow on X11 systems (linux, BSD).

The windows themselves have the same interface as the other widgets provided by FLTK, the WidgetExt trait, which will be discussed in the next page. 

Lets use what we've seen so far to create a window.

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```

![img1](https://user-images.githubusercontent.com/37966791/100937363-f82ffa80-3503-11eb-8f3a-9afe34bdad59.jpg)

The new() call takes 5 parameters:
- `x` which is the horizontal distance from the left of the screen.
- `y` which is the vertical distance from the top of the screen.
- `width` which is the window's width.
- `height` which is the window's height.
- `title` which is the window's title.

Next notice the call to end(). Windows, among other types of widgets, implement the GroupExt trait. These widgets will own/parent any widget created between the call begin() (which is implicit here with the creation of the window) and the call end().
The next call show() basically raises the window so it appears on the display.

Windows can be embedded inside other windows:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut my_window2 = window::Window::new(10, 10, 380, 280, "");
    my_window2.set_color(Color::Black);
    my_window2.end();
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```
![embed](https://user-images.githubusercontent.com/37966791/100937446-139b0580-3504-11eb-8738-1e4161175d0b.jpg)

Here the 2nd window, my_window2, is embedded inside the 1st window, my_window. We've given it the color black so it appears to us. Notice that its parent is the first window. Creating the 2nd window outside of the parent will basically create 2 separate windows, and will require a call to show():
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();
    let mut my_window2 = window::Window::new(10, 10, 380, 280, "");
    my_window2.end();
    my_window2.show();
    app.run().unwrap();
}
```

Windows can also be borderless using the my_window.set_border(false) method.

![image](https://user-images.githubusercontent.com/37966791/100937639-565cdd80-3504-11eb-8cf6-e135243c38b0.png)

The set_border(bool) method is part of the WindowExt trait, implemented by all window types in FLTK, in addition to the WidgetExt and GroupExt traits.
The list of traits can be found in the prelude module of the crate:

[docs](https://docs.rs/fltk/*/fltk/prelude/index.html)