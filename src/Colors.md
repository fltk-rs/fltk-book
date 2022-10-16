# 颜色 Colors

FLTK可以处理[true color](https://en.wikipedia.org/wiki/Color_depth#True_color_(24-bit))。一些方便的颜色在enums::Color枚举中列举：
- Black
- White
- Red
- Blue
- Cyan
...etc.

你也可以使用颜色方法构建你的颜色：
- by_index()。这使用了fltk的colorormap。值范围是0到255。
```rust
let red = Color::by_index(88);
```

![colormap](https://www.fltk.org/doc-1.3/fltk-colormap.png)

- from_hex()。这需要一个24位的十六进制值，形式为RGB。
```rust
const RED: Color = Color::from_hex(0xff0000); // notice it's a const functions
```

- from_rgb()。这需要3个值r、g、b：
```rust
const RED: Color = Color::from_rgb(255, 0, 0); // notice it's a const functions
```

颜色枚举还提供了一些方便的方法，使用.darker()、.lighter()、.inactive()等方法生成所选颜色的不同色调的颜色：
```rust
let col = Color::from_rgb(176, 100, 50).lighter();
```

如果你喜欢html十六进制字符串的颜色，你可以使用from_hex_str()方法：
```rust
let col = Color::from_hex_str("#ff0000");
```