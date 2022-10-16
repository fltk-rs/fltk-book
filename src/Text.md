# 文字 Text

Text widget实现了DisplayExt trait，共有3个，可以在text module中找到：
- TextDisplay
- TextEditor
- SimpleTerminal

这些部件的主要目的是显示/编辑文本。前两个部件需要一个TextBuffer，而SimpleTerminal有一个内部缓冲器：
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

大多数操作是通过TextBuffer完成的。可以用append()来追加文本，也可以用set_text()来设置其全部内容。
你可以使用DisplayExt::buffer()方法取回缓冲区的clone（reference type）：

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

DisplayExt提供了其他方法来管理文本属性，wrapping，cursor position，font，color，size...等。
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
    txt.wrap_mode(text::WrapMode::AtBounds, 0); // bounds don't require the second argument, unlike AtPixel and AtColumn
    txt.set_text_color(Color::Red);
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727121-8396c77e-836d-4406-abd1-92af32ff7242.png)

TextBuffer还有第二个用途，那就是提供一个样式缓冲区（style buffer）。样式缓冲区反映了你的文本缓冲区，并使用一个样式表（包含字体、颜色和大小）来为你的文本添加细粒度的样式，样式表本身是有索引的，具体说是使用相应的字母：
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
    sbuf.set_text(&"A".repeat("Hello world!".len())); // A represents the first entry in the table, repeated for every letter
    buf.append("\n"); 
    sbuf.append("B"); // Although a new line and the style might not apply, but it's needed to avoid messing out subsequent entries
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

Terminal的例子使用了SimpleTerminal和一个有样式的TextBuffer，你可以在 [这儿](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/terminal.rs) 找到