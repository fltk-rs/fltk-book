Text widgets are those that implement the DisplayExt. There are 3 and these can be found in the text module:
- TextDisplay
- TextEditor
- SimpleTerminal

The main purpose of these widgets is displaying/editing text. The first 2 widgets require a TextBuffer, while the SimpleTerminal has an internal buffer:
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

Most operations are done through the TextBuffer. Text can be appended using append() or the whole content can be set using set_text().
You can get back a clone (reference type) of the buffer using the DisplayExt::buffer() method:
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

The DisplayExt offers other methods to manage the text properties such as wrapping, cursor position, font, color, size...etc:
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

The TextBuffer has also a second purpose, and that's to provide a style buffer. A style buffer mirrors your text buffer and uses a style table (containing font, color and size) to add granular styling to your text, the style table itself is indexed, so to speak, using the corresponding letter:
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

The terminal example uses the SimpleTerminal along with a style TextBuffer. It can be found here:
https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/terminal.rs