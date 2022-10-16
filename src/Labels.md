# 标签 Labels

FLTK没有标签widget。因此，如果你要想显示文本，你可以使用一个Frame widget并给它一个label。

所有widge件都可以使用::new()构造函数，或者用with_label()或set_label()来获取一个标签。

```rust
let btn = button::Button::new(160, 200, 80, 30, "Click");
```
这个按钮有一个显示 "点击 "文字的标签。

同样地，我们可以使用set_label()或with_label()：

```rust
let btn = button::Button::default().with_label("Click");
// or
let mut btn = button::Button::default();
btn.set_label("Click");
```

然而，::new()构造函数实际上是把一个可选的 static str 带到了这里，所以下面的代码会失败：
```rust
let label = String::from("Click"); // label is not a static str
let mut btn = button::Button::new(160, 200, 80, 30, &label);
```
在这种情况下，你应该使用`btn.set_label(&label);`。原因是FLTK期望的label是`const char *` 的，这相当于Rust的`&'static str`。这些字符串存在于程序的二进制代码段中。如果你反汇编一个程序，会显示所有这些静态字符串。由于这些字符串有一个静态的生命周期，FLTK默认不会存储它们。而当使用set_label()和with_label()调用FLTK的Fl_Widget::copy_label()方法时，实际上是存储字符串。

你也不限于文字标签，FLTK有预定义的符号，可以转换成图像。

![symbols](https://www.fltk.org/doc-1.4/symbols.png)

@符号后面还可以加上以下可选的 "格式化 "字符，其顺序和规则如下：

- '#'强制进行方形缩放，而不是对小部件的形状进行扭曲。
- +[1-9]或-[1-9]将缩放比例调大或调小一点。
- $'水平翻转符号，'%'垂直翻转符号。
- [0-9] - 旋转45度的倍数。5'和'6'不做旋转，而其他数字则指向数字键盘上的那个键的方向。'0'，后面还有四个数字，使符号按该度数旋转。

因此，如果要显示一个非常大的指向下方的箭头，你可以使用标签字符串"@+92->"。

符号和文本可以结合在一个标签中，但是符号必须在文本的开头和/或结尾处。如果文本跨越了多行，那么符号将被放大以匹配所有行的高度：

![ex](https://www.fltk.org/doc-1.4/symbol-examples.png)