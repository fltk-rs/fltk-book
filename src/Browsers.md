# Browsers

Browser widgets implement the BrowserExt trait:
- Browser
- SelectBrowser
- HoldBrowser
- MultiBrowser
- FileBrowser
- CheckBrowser

These can be found in the browser module.

To instantiate a browser, it also needs the column widths, as well as the separator char that will be used in the add() method to separate items into columns:
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

To gain additional formatting, we can use special character `@` followed by a formatting specifier:
- '@.' Print rest of line, don't look for more '@' signs
- '@@' Print rest of line starting with '@'
- '@l' Use a LARGE (24 point) font
- '@m' Use a medium large (18 point) font
- '@s' Use a small (11 point) font
- '@b' Use a bold font (adds FL_BOLD to font)
- '@i' Use an italic font (adds FL_ITALIC to font)
- '@f' or '@t' Use a fixed-pitch font (sets font to FL_COURIER)
- '@c' Center the line horizontally
- '@r' Right-justify the text
- '@B0', '@B1', ... '@B255' Fill the backgound with fl_color(n)
- '@C0', '@C1', ... '@C255' Use fl_color(n) to draw the text
- '@F0', '@F1', ... Use fl_font(n) to draw the text
- '@S1', '@S2', ... Use point size n to draw the text
- '@u' or '@_' Underline the text.
- '@-' draw an engraved line through the middle.

In the following example, we color %CPU to red by preceding it with @C88:
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

The colors follow FLTK's colormap, which can be indexed from 0 to 255:

![colormap](https://www.fltk.org/doc-1.4/fltk-colormap.png)