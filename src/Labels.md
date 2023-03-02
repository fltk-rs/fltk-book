# 标签 Labels

FLTK没有可以用来显示文字的Label组件，但很多组件都具有Label属性。如果你想显示文本的话，你可以使用一个`Frame`组件，然后为它添加Label属性。

所有组件都可以使用`::new()`构造函数来创建并设置Label，或者也可以用`with_label()`或`set_label()`来设置。

```rust
let btn = button::Button::new(160, 200, 80, 30, "Click");
```
这个按钮上带有 "Click" 文字。

我们也可以使用`set_label()`或`with_label()`：

```rust
let btn = button::Button::default().with_label("Click");
// 或者
let mut btn = button::Button::default();
btn.set_label("Click");
```

然而，使用`::new()`方法来添加Label属性，需要的字符串是类型`&'static str`，所以下面的代码不能正确运行：
```rust
let label = String::from("Click");  // label变量不是 &'static str
let mut btn = button::Button::new(160, 200, 80, 30, &label);
```
在这种情况下，你应该使用`btn.set_label(&label);`。原因是FLTK本身要求传入的字符串是类型是`const char *` ，对应于Rust中则是`&'static str`。这些字符串保存在程序的二进制代码中。如果你反汇编一个程序，是可以看到这些字符串的。这些字符串具有静态生命周期，因此FLTK在创建组件Label时默认不会保存下这些字符串。而当使用`set_label()`和`with_label()`时，FLTK将调用`Fl_Widget::copy_label()`，并将字符串进行存储。

Label不限于文字，FLTK预定义了一些符号，在Label中可以转换成图像。

![symbols](https://www.fltk.org/doc-1.4/symbols.png)

`@`符号除了可以用来使用这些符号图像外，还可以加上下面这些格式化字符，其顺序和规则如下：

- '#'表示强制进行规则的缩放，因此可以避免组件的形状被扭曲。
- +[1-9]或-[1-9]可以改变缩放比例。
- '$'是水平翻转符号，'%'是垂直翻转符号。
- [0-9] - 旋转45度的倍数。是'5'和'6'时不会发生旋转，而其他数字则会使其指向数字键盘上那个键的方向。
- '0xxxx'，0后有四个数字表示角度，会使其按该度数旋转。

因此，如果要显示一个非常大的指向下方的箭头，你可以使用标签字符串"@+92->"。

符号和文本可以结合在一个Label中，但是符号必须放在文本的开头或结尾处。如果有多行文本，那么符号将被按比例放大以匹配所有行的高度：

![ex](https://www.fltk.org/doc-1.4/symbol-examples.png)