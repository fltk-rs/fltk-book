# 颜色 Colors

FLTK可以处理[True color](https://en.wikipedia.org/wiki/Color_depth#True_color_(24-bit))。一些常用的颜色在`enums::Color`中列举出来方便使用：
- Black
- White
- Red
- Blue
- Cyan
...etc.

你也可以使用下列方法构建其他的颜色：
- `by_index()`方法使用fltk的colormap选取颜色。取值范围是0到255。
```rust
let red = Color::by_index(88);
```

![colormap](https://www.fltk.org/doc-1.3/fltk-colormap.png)

- `from_hex()`方法需要传入一个`24bit`的十六进制RGB值。
```rust
const RED: Color = Color::from_hex(0xff0000); // 注意它是一个Const函数
```

- `from_rgb()`方法需要传入3个代表R、G、B的值：
```rust
const RED: Color = Color::from_rgb(255, 0, 0); // 注意它是一个Const函数
```

`Color Enum`还提供了一些方便的方法，使用`.darker()`、`.lighter()`、`.inactive()`等方法可以在所选颜色的基础上生成色调有些变化的颜色，常用作阴影或按钮点击反馈等：
```rust
let col = Color::from_rgb(176, 100, 50).lighter();
```

如果你喜欢使用html十六进制字符串生成颜色，可以使用`from_hex_str()`方法生成：
```rust
let col = Color::from_hex_str("#ff0000");
```