# 文字 Text

`Text`组件实现了`DisplayExt trait`。FLTK提供了3个文字组件，可以在`text` mod中找到：
- TextDisplay
- TextEditor
- SimpleTerminal

文本组件的主要作用是显示或编辑文本。前两个部件需要一个`TextBuffer`，`SimpleTerminal`内部有一个`TextBuffer`：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut buf = text::TextBuffer::default();

    let mut win = window::Window::default().with_size(400, 300);
    let mut txt = text::TextEditor::default().with_size(390, 290).center_of_parent();
    txt.set_buffer(buf.clone());
    win.end();
    win.show();

    buf.set_text("Hello world!");
    buf.append("\n");
    buf.append("This is a text editor!");

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727101-175fe355-1383-4789-ae40-2945ef0c63e2.png)

在文本组件上，对内容的操作多数是使用`TextBuffer`完成的。可以用`append()`来添加文本，也可以用`set_text()`来设置Buffer的内容。
你可以使用`DisplayExt::buffer()`方法得到Buffer的Clone（TextBuffer内部存储了一个对实际Buffer的可变指针引用），继而可以通过它来操作Buffer：

```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let buf = text::TextBuffer::default();

    let mut win = window::Window::default().with_size(400, 300);
    let mut txt = text::TextEditor::default().with_size(390, 290).center_of_parent();
    txt.set_buffer(buf);
    win.end();
    win.show();

    let mut my_buf = txt.buffer().unwrap();

    my_buf.set_text("Hello world!");
    my_buf.append("\n");
    my_buf.append("This is a text editor!");

    a.run().unwrap();
}
```

`DisplayExt`定义了很多管理文本属性的方法，例如可以设置何时换行，光标位置，字体，颜色，大小等。
```rust
use fltk::{enums::Color, prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut buf = text::TextBuffer::default();
    buf.set_text("Hello world!");
    buf.append("\n");
    buf.append("This is a text editor!");

    let mut win = window::Window::default().with_size(400, 300);
    let mut txt = text::TextDisplay::default().with_size(390, 290).center_of_parent();
    txt.set_buffer(buf);
    // 设置换行模式
    // 不同于 AtPixel 和 AtColumn, AtBounds不需要第二个参数
    // AtBounds 会设置文本到达输入框边界便会自动换行，对于大小可变的窗口很好用。
    txt.wrap_mode(text::WrapMode::AtBounds, 0);
    txt.set_text_color(Color::Red);
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727121-8396c77e-836d-4406-abd1-92af32ff7242.png)

`TextBuffer`还有第二个用途，它可以作为样式缓冲区（Style Buffer）。Style Buffer是你的Text Buffer的一个镜像，它使用样式表（包含字体、颜色和大小的配置）来为你的文本细粒度地设置样式，样式表中的样式本身是有索引的，具体说是使用相应的顺序字母作为索引：
```rust
use fltk::{
    enums::{Color, Font},
    prelude::*,
    *,
};

const STYLES: &[text::StyleTableEntry] = &[
    text::StyleTableEntry {
        color: Color::Green,
        font: Font::Courier,
        size: 16,
    },
    text::StyleTableEntry {
        color: Color::Red,
        font: Font::Courier,
        size: 16,
    },
    text::StyleTableEntry {
        color: Color::from_u32(0x8000ff),
        font: Font::Courier,
        size: 16,
    },
];

fn main() {
    let a = app::App::default();
    let mut buf = text::TextBuffer::default();
    let mut sbuf = text::TextBuffer::default();
    buf.set_text("Hello world!");
    // A是样式表中的第一个元素的索引，这里为“Hello world!”的每个字母应用A代表的样式
    sbuf.set_text(&"A".repeat("Hello world!".len())); 
    buf.append("\n"); 
    // 虽然针对换行的样式可能并没有显示出来，但是这里还需要将其写上，以免弄乱之后的文字样式
    sbuf.append("B"); 
    buf.append("This is a text editor!");
    sbuf.append(&"C".repeat("This is a text editor!".len()));

    let mut win = window::Window::default().with_size(400, 300);
    let mut txt = text::TextDisplay::default()
        .with_size(390, 290)
        .center_of_parent();
    txt.set_buffer(buf);
    txt.set_highlight_data(sbuf, STYLES.to_vec());
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727157-be992344-763d-41f9-b3d8-2dfa13fbaab1.png)

`Terminal`的例子使用了`SimpleTerminal`和一个有样式的`TextBuffer`，点击这里查看这个例子 [Terminal](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/terminal.rs) 
