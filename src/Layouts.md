# 布局 Layouts

Rust提供了开箱即用的：
- A Flex widget
- Pack
- Grid
- Widget relative positioning.

### Flex
Flex widget允许进行灵活的布局。它在group module中，实现了GroupExt trait。有2种形式的Flexwidget，可以使用set_type或with_type方法指定。比如列（Column） 和 行（Row）：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(400, 300);
    let mut flex = Flex::new(0, 0, 400, 300, None);
    flex.set_type(group::FlexType::Column);
    let expanding = button::Button::default().with_label("Expanding");
    let mut normal = button::Button::default().with_label("Normal");
    flex.set_size(&mut normal, 30);
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```
set_size方法接收另一个widget并将其大小固定为所传递的值，在这个例子中是30。因为这是一个column，所以30代表要设置的widget的高度。
另一个widget是可扩展的，因为没有为它设置尺寸。一个完整的例子可以在这里找到。

[第一个例子](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/flex.rs)

![image](https://github.com/osen/FL_Flex/raw/main/doc/login.png)

### Packs
pack widget（在group module中）也实现了GroupExt trait。有两种形式的Pack，Vertical Pack 和 Horizontal Pack，Vertical Pack是默认的。它只需要子widget的高度，而Horizontal Pack只需要它的子widget的宽度，像下面的例子：
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
这就在窗口内创建了一个Pack Widget，并在其中填入2个按钮。注意，按钮的x和y坐标不再需要了。你也可以像 repo 中的Calculator示例一样，在Pack中嵌入Pack。
你也可以使用Pack::auto_layout()方法：

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
在这种情况下，我们甚至不需要按钮的大小。

![image](https://user-images.githubusercontent.com/37966791/100937983-ef8bf400-3504-11eb-9da1-09c5ac1aade4.png)

### Grid
[Grid](https://github.com/fltk-rs/fltk-grid)目前是在一个external crate中实现的。它需要一个layout，使用`Grid::set_layout(&mut self, rows, columns)`来设置。然后通过`Grid::insert(&mut self, row, column)`或`Grid::insert_ext(&mut self, row, column, row_span, column_span)`方法插入widget。

```rust
use fltk::{prelude::*, *};
use fltk_grid::Grid;

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(500, 300);
    let mut grid = Grid::default_fill();
    // 设置为 "true "以显示单元格的框线和数字
    grid.debug(false); 
    // 5 行，5 列
    grid.set_layout(5, 5); 
    // 组件，行，列
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
WidgetExt trait提供了几个构造方法，允许我们相对于其他widget的大小和位置来构造widget。这类似于Qml的锚定（anchoring）：
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

(有一些跳过的主题设计)

这些方法是：
- `above_of(&widget, padding)`: 将该widget置于所传递的widget之上
- `below_of(&widget, padding)`: 将该widget置于所传递的widget之下
- `right_of(&widget, padding)`: 将该widget置于所传递的widget右边
- `left_of(&widget, padding)`:将该widget置于所传递的widget左边
- `center_of(&widget)`: 将widget放置在所传递的widget的中心（包括x和y轴）
- `center_of_parent()`: 将widget放在父widget的中心位置（包括x轴和y轴）
- `center_x(&widget)`: 将widget放置在所传递的widget的中心（X轴）
- `center_y(&widget)`: 将widget放置在所传递的widget的中心（Y轴）
- `size_of(&widget)`: 构建与所传widget相同大小的widget
- `size_of_parent()`: 构建与其父widget相同大小的widget