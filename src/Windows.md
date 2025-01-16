# Windows

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
<div align="center">

![img1](https://user-images.githubusercontent.com/98977436/244393458-7add4afc-11ec-47dc-b62e-68488ada132f.PNG)

</div>

The [new()](https://docs.rs/fltk/latest/fltk/prelude/trait.WidgetBase.html#tymethod.new) call takes 5 parameters:
- `x` which is the horizontal distance from the left of the screen.
- `y` which is the vertical distance from the top of the screen.
- `width` which is the window's width.
- `height` which is the window's height.
- `title` which is the window's title.

Next notice the call to [end()](https://docs.rs/fltk/latest/fltk/prelude/trait.GroupExt.html#tymethod.end). Windows, among other types of widgets, implement the GroupExt trait. These widgets will own/parent any widget created between the call [begin()](https://docs.rs/fltk/latest/fltk/prelude/trait.GroupExt.html#tymethod.begin) (which is implicit here with the creation of the window) and the call end().
The next call [show()](https://docs.rs/fltk/latest/fltk/prelude/trait.WidgetExt.html#tymethod.show) basically raises the window so it appears on the display.

---

## Embedded windows

Windows can be embedded inside other windows:
```rust
use fltk::{prelude::*, enums::Color, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    let mut my_window2 = window::Window::new(10, 10, 380, 280, None);
    my_window2.set_color(Color::Black);
    my_window2.end();
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```
<div align="center">

![embed](https://user-images.githubusercontent.com/98977436/244393452-8b8f11ef-036a-4be6-8d6f-b49418322f3c.PNG)

</div>

Here, the 2nd window, my_window2, is embedded inside the 1st window, my_window. We've set its color to black for visibility. Note that its parent is the first window. If the 2nd window is created outside the parent, it will essentially create 2 separate windows, requiring a call to show() to display them:

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.end();
    my_window.show();
    let mut my_window2 = window::Window::new(10, 10, 380, 280, None);
    my_window2.end();
    my_window2.show();
    app.run().unwrap();
}
```

---

## Borders

Windows can also be borderless using the my_window.set_border(false) method.

<div align="center">

![image](https://user-images.githubusercontent.com/37966791/100937639-565cdd80-3504-11eb-8cf6-e135243c38b0.png)

</div>

The [set_border(bool)](https://docs.rs/fltk/latest/fltk/prelude/trait.WindowExt.html#tymethod.set_border) method is part of the WindowExt trait, implemented by all window types in FLTK, in addition to the WidgetExt and GroupExt traits.
The list of traits can be found in the prelude module of the crate:

[docs](https://docs.rs/fltk/*/fltk/prelude/index.html)

---

## Fullscreen

If you want to use fltk-rs for immersive applications, with full use of the screen, you can develop your applications by adding the [fullscreen(bool)](https://docs.rs/fltk/latest/fltk/prelude/trait.WindowExt.html#tymethod.fullscreen) method to the main window, setting it to true.

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut my_window = window::Window::new(100, 100, 400, 300, "My Window");
    my_window.fullscreen(true);
    my_window.end();
    my_window.show();
    app.run().unwrap();
}
```
