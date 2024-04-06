# 布局 Layouts

FLTK-rs提供了这些开箱即用的布局组件：
- Flex
- Pack
- Grid
- 组件相对定位

### Flex
`Flex`组件可以让你灵活的布局。它在`group mod`中定义，实现了`GroupExt Trait`。可以使用`set_type`或`with_type`方法选择Flex的布局形式。比如列（Column）和行（Row）布局：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(400, 300);
    let mut flex = Flex::new(0, 0, 400, 300, None);
    flex.set_type(group::FlexType::Column);
    let expanding = button::Button::default().with_label("Expanding");
    let mut normal = button::Button::default().with_label("Normal");
    flex.fixed(&mut normal, 30);
    flex.end();
    win.end();
    win.show();
    a.run().unwrap();
}
```
`fixed`方法 (在1.4.6版本前是 `set_size`)方法 接收一个放在Flex内部的组件，将其大小（高度或宽度）设置为传递的值，示例中设置高度为30。因为这是一个Column类型的Flex，所以传入的值代表组件的高度。
示例中另一个按钮大小是变的，因为没有为它设置尺寸。参见这个完整的例子：

[示例1](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/flex.rs)

![image](https://github.com/osen/FL_Flex/raw/main/doc/login.png)

### Packs
`Pack`组件同样在`group mod`中，并实现了`GroupExt trait`。类似的，也有两种形式的Pack，`Vertical Pack` 和 `Horizontal Pack`，Pack默认是Vertical，它需要设置子组件的高度，而Horizontal Pack需要设置它的子组件的宽度，比如这个示例：
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
我们在窗口内创建了一个`Pack`，并在其中创建2个按钮。我们不需要设置按钮的坐标。你也可以像 FLTK仓库的示例 中的`Calculator`一样，将Pack互相嵌套。可以试试`Pack::auto_layout()`方法自动布局：

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
这种情况下，我们甚至不需要设置按钮的大小。

![image](https://user-images.githubusercontent.com/37966791/100937983-ef8bf400-3504-11eb-9da1-09c5ac1aade4.png)

### Grid
[Grid Crate](https://github.com/fltk-rs/fltk-grid)实现在另一个Crate中的。它需要使用`Grid::set_layout(&mut self, rows, columns)`来设置一个Layout。然后通过`Grid::insert(&mut self, row, column)`或`Grid::insert_ext(&mut self, row, column, row_span, column_span)`方法添加组件。

```rust
use fltk::{prelude::*, *};
use fltk_grid::Grid;

fn main() {
    let a = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut win = window::Window::default().with_size(500, 300);
    let mut grid = Grid::default_fill();
    // 若为 "true" 便会显示网格的框线和数字
    grid.debug(false); 
    // 设置Grid为 5 行，5 列
    grid.set_layout(5, 5); 
    // 设置组件和所在的行列
    grid.insert(&mut button::Button::default().with_label("Click"), 0, 1); 
    // 设置组件和所在的行列以及行高列宽
    grid.insert_ext(&mut button::Button::default().with_label("Button 2"), 2, 1, 3, 1); 
    win.end();
    win.show();
    a.run().unwrap();
}
```

[Grid example](https://github.com/fltk-rs/fltk-grid/blob/main/examples/form.rs)

![image](https://user-images.githubusercontent.com/37966791/160347418-b8b54408-3dc9-4fc4-93e8-fb6c1c0282e9.png)

### Relative positioning
`WidgetExt Trait`中定义了几个构造方法，允许我们相基于其他组件的大小和位置构建组件。这类似于Qt中Qml的锚定（anchoring）：
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

(我们跳过了一些主题的设计)

这些方法是：
- `above_of(&widget, padding)`: 将该组件放在所传递的组件上面
- `below_of(&widget, padding)`: 将该组件放在所传递的组件下面
- `right_of(&widget, padding)`: 将该组件放在所传递的组件右边
- `left_of(&widget, padding)`:将该组件置于所传递的组件左边
- `center_of(&widget)`: 将组件放置在所传递的组件的中间（包括x和y轴）
- `center_of_parent()`: 将组件放在父组件的中间（包括x轴和y轴）
- `center_x(&widget)`: 将组件放置在所传递的组件的中心（X轴）
- `center_y(&widget)`: 将组件放置在所传递的组件的中心（Y轴）
- `size_of(&widget)`: 构建与所传组件相同大小的组件
- `size_of_parent()`: 构建与其父组件相同大小的组件