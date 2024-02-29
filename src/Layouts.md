# Layouts

Out of the box, fltk-rs offers:
- A Flex widget
- Pack
- Grid
- Widget relative positioning.

### Flex
The Flex widget allows flexbox layouts. It's in group module and implements the GroupExt trait. There are 2 forms of Flex widgets, which can be specified using the set_type or with_type methods. These are the column and row:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(400, 300);
    let mut flex = group::Flex::new(0, 0, 400, 300, None);
    flex.set_type(group::FlexType::Column);
    let expanding = button::Button::default().with_label("Expanding");
    let normal = button::Button::default().with_label("Normal");
    flex.fixed(&normal, 30);
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```
The `fixed` (and `set_size` in fltk < 1.4.6) method takes another widget and fixes its size to the value passed, in the example it's 30. Since this is a column, the 30 represents the height of the widget to be set.
The other widget will be expandable since no size is set for it. A full example can be found here:

[Flex example](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/flex.rs)

![image](https://github.com/osen/FL_Flex/raw/main/doc/login.png)

### Packs
The Pack widget (in the group module) also implement the GroupExt trait. There are 2 forms of packs, Vertical and Horizontal packs, Vertical being the default. Vertical packs only require the height of its children widgets, while horizontal packs only require the width of its children widgets, like in the example below:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    
    let mut my_window = window::Window::default().with_size(400, 300);
    let mut hpack = group::Pack::default().with_size(190, 40).center_of(&my_window);
    hpack.set_type(group::PackType::Horizontal);
    hpack.set_spacing(30);
    let _but1 = button::Button::default().with_size(80, 0).with_label("Button1");
    let _but2 = button::Button::default().with_size(80, 0).with_label("Button2");
    hpack.end();
    my_window.end();
    my_window.show();

    app.run().unwrap();
}
```
This creates a pack widget inside the window, and fills it with 2 buttons. Notice that the x and y coordinates are no longer needed for the buttons. You can also embed packs inside packs like in the calculator example in the repo. 
You can also use the Pack::auto_layout() method:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    
    let mut my_window = window::Window::default().with_size(400, 300);
    let mut hpack = group::Pack::new(0, 200, 400, 100, "");
    hpack.set_type(group::PackType::Horizontal);
    hpack.set_spacing(30);
    let _but1 = button::Button::default().with_label("Button1");
    let _but2 = button::Button::default().with_label("Button2");
    hpack.end();
    hpack.auto_layout();
    my_window.end();
    my_window.show();

    app.run().unwrap();
}
```
In which case we don't even need the size of the buttons.

![image](https://user-images.githubusercontent.com/37966791/100937983-ef8bf400-3504-11eb-9da1-09c5ac1aade4.png)

### Grid
[Grid](https://github.com/fltk-rs/fltk-grid) is implemented currently in an external crate. It requires a layout which is set using `Grid::set_layout(&mut self, rows, columns)`. Then widgets are inserted via the `Grid::insert(&mut self, row, column)` or `Grid::insert_ext(&mut self, row, column, row_span, column_span)` methods:
```rust
use fltk::{prelude::*, *};
use fltk_grid::Grid;

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(500, 300);
    let mut grid = Grid::default_fill();
    // set to true to show cell outlines and numbers
    grid.debug(false); 
    // 5 rows, 5 columns
    grid.set_layout(5, 5); 
    // widget, row, col
    grid.insert(&mut button::Button::default().with_label("Click"), 0, 1); 
    // widget, row, col, row_span, col_span
    grid.insert_ext(&mut button::Button::default().with_label("Button 2"), 2, 1, 3, 1); 
    win.end();
    win.show();
    a.run().unwrap();
}
```

[Grid example](https://github.com/fltk-rs/fltk-grid/blob/main/examples/form.rs)

![image](https://user-images.githubusercontent.com/37966791/160347418-b8b54408-3dc9-4fc4-93e8-fb6c1c0282e9.png)

### Relative positioning
The WidgetExt trait offers several constructor methods which allow us to construct widgets relative to other widgets size and position. This is similar to Qml's anchoring.
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default()
        .with_size(160, 200)
        .center_screen()
        .with_label("Counter");
    let mut frame = frame::Frame::default()
        .with_size(100, 40)
        .center_of(&wind)
        .with_label("0");
    let mut but_inc = button::Button::default()
        .size_of(&frame)
        .above_of(&frame, 0)
        .with_label("+");
    let mut but_dec = button::Button::default()
        .size_of(&frame)
        .below_of(&frame, 0)
        .with_label("-");
    wind.end();
    wind.show();
    app.run().unwrap();
}
```

![counter](https://github.com/MoAlyousef/fltk-rs/raw/master/screenshots/counter.jpg)

(With some skipped theming)

These methods are namely:
- `above_of(&widget, padding)`: places the widget above the passed widget
- `below_of(&widget, padding)`: places the widget below the passed widget
- `right_of(&widget, padding)`: places the widget right of the passed widget
- `left_of(&widget, padding)`: places the widget left of the passed widget
- `center_of(&widget)`: places the widget at the center (both x and y axes) of the passed widget.
- `center_of_parent()`: places the widget at the center (both x and y axes) of the parent.
- `center_x(&widget)`: places the widget at the center (x-axis) of the passed widget.
- `center_y(&widget)`: places the widget at the center (y-axis) of the passed widget.
- `size_of(&widget)`: constructs the widget with the same size of the passed widget.
- `size_of_parent()`: constructs the widget with the same size of its parent.
