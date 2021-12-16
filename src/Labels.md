# Labels

FLTK doesn't have a Label widget. So if you would just like to show text, you can use a Frame widget and give it a label. 

All widgets takes a label in the ::new() constructor or using with_label() or set_label():
```rust
let btn = button::Button::new(160, 200, 80, 30, "Click");
```
This button has a label showing the text "click".

Similarly we can use set_label() or with_label():
```rust
let btn = button::Button::default().with_label("Click");
// or
let mut btn = button::Button::default();
btn.set_label("Click");
```

However, the ::new() constructor takes in reality an optional to a static str, so the following would fail:
```rust
let label = String::from("Click"); // label is not a static str
let mut btn = button::Button::new(160, 200, 80, 30, &label);
```
You would want to use `btn.set_label(&label);` in this case. The reason is that FLTK expects a `const char *` label, which is the equivalent of Rust's `&'static str`. These strings live in the program's code segment. If you disassemble an application, it would show all these static strings. And since these have a static lifetime, FLTK by default doesn't store them. 
While using set_label() and with_label() calls FLTK's Fl_Widget::copy_label() method which actually stores the string.

You are also not limited to text labels, FLTK has predefined symbols which translate into images:

![symbols](https://www.fltk.org/doc-1.4/symbols.png)

The @ sign may also be followed by the following optional "formatting" characters, in this order:

- '#' forces square scaling, rather than distortion to the widget's shape.
- +[1-9] or -[1-9] tweaks the scaling a little bigger or smaller.
- '$' flips the symbol horizontally, '%' flips it vertically.
- [0-9] - rotates by a multiple of 45 degrees. '5' and '6' do no rotation while the others point in the direction of that key on a numeric keypad. '0', followed by four more digits rotates the symbol by that amount in degrees.

Thus, to show a very large arrow pointing downward you would use the label string "@+92->".

Symbols and text can be combined in a label, however the symbol must be at the beginning and/or at the end of the text. If the text spans multiple lines, the symbol or symbols will scale up to match the height of all the lines:

![ex](https://www.fltk.org/doc-1.4/symbol-examples.png)