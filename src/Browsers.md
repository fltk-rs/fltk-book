# 阅览器 Browsers

Browser widgets 实现了 BrowserExt trait：
- Browser
- SelectBrowser
- HoldBrowser
- MultiBrowser
- FileBrowser
- CheckBrowser

这些可以在 browser module中找到。

为了实例化一个browser，需要提供每一项的列宽column widths，以及在add()方法中用于将item分成几列的分隔符column char：

```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut win = window::Window::default().with_size(900, 300);
    let mut b = browser::Browser::new(10, 10, 900 - 20, 300 - 20, "");
    let widths = &[50, 50, 50, 70, 70, 40, 40, 70, 70, 50];
    b.set_column_widths(widths);
    b.set_column_char('\t');
    // we can now use the '\t' char in our add method.
    b.add("USER\tPID\t%CPU\t%MEM\tVSZ\tRSS\tTTY\tSTAT\tSTART\tTIME\tCOMMAND");
    b.add("root\t2888\t0.0\t0.0\t1352\t0\ttty3\tSW\tAug15\t0:00\t@b@f/sbin/mingetty tty3");
    b.add("erco\t2889\t0.0\t13.0\t221352\t0\ttty3\tR\tAug15\t1:34\t@b@f/usr/local/bin/render a35 0004");
    b.add("uucp\t2892\t0.0\t0.0\t1352\t0\tttyS0\tSW\tAug15\t0:00\t@b@f/sbin/agetty -h 19200 ttyS0 vt100");
    b.add("root\t13115\t0.0\t0.0\t1352\t0\ttty2\tSW\tAug30\t0:00\t@b@f/sbin/mingetty tty2");
    b.add(
        "root\t13464\t0.0\t0.0\t1352\t0\ttty1\tSW\tAug30\t0:00\t@b@f/sbin/mingetty tty1 --noclear",
    );
    win.end();
    win.show();
    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145733437-e3061015-12fa-4f2e-a1e3-01f59c4b189d.png)

可以使用特殊字符`@`来实现其他丰富的格式化效果，我们需要后面跟一个格式化指定符：
- '@.' 打印其余行，且不会再寻找其他的'@'符号
- '@@' 打印其余以'@'开头的行
- '@l'  使用大号字体(24 point) 
- '@m' 使用中号字体(18 point)
- '@s' 使用小号字体(11 point)
- '@b' 使用宽字体(adds FL_BOLD to font)
- '@i' 使用斜体(adds FL_ITALIC to font)
- '@f' 或 '@t' 使用等距字体 (sets font to FL_COURIER)
- '@c' 水平居中
- '@r' 向右对齐文本
- '@B0', '@B1', ... '@B255' 使用fl_color(n)填充背景
- '@C0', '@C1', ... '@C255' 使用fl_color(n) 渲染文本
- '@F0', '@F1', ... 使用 fl_font(n) 渲染文本
- '@S1', '@S2', ... 使用相应的尺寸来渲染文本
- '@u' or '@_' 字体添加下划线
- '@-' 字体中间添加修改线

在下面的例子中，我们在%CPU前面加上@C88，将其渲染成红色：
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut win = window::Window::default().with_size(900, 300);
    let mut b = browser::Browser::new(10, 10, 900 - 20, 300 - 20, "");
    let widths = &[50, 50, 50, 70, 70, 40, 40, 70, 70, 50];
    b.set_column_widths(widths);
    b.set_column_char('\t');
    b.add("USER\tPID\t@C88%CPU\t%MEM\tVSZ\tRSS\tTTY\tSTAT\tSTART\tTIME\tCOMMAND");
    win.end();
    win.show();
    app.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145733713-2fe3207d-25f7-4acd-ae91-754679c5696a.png)

这些颜色遵循FLTK的颜色映射，可以从0到255进行索引。

![colormap](https://www.fltk.org/doc-1.4/fltk-colormap.png)