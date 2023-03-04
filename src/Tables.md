# 表格 Tables

FLTK还提供了`Table`组件，Table的使用方法可以参见GitHub库中的例子[示例](https://github.com/fltk-rs/fltk-rs/blob/master/fltk/examples/table.rs)。有个好处是，我们提供了[fltk-table crate](https://crates.io/crates/fltk-table)，使用它的话我们可以写更少的样板代码，写出的界面也会更简单、直观。
```rust
extern crate fltk_table;

use fltk::{
    app, enums,
    prelude::{GroupExt, WidgetExt},
    window,
};
use fltk_table::{SmartTable, TableOpts};

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut wind = window::Window::default().with_size(800, 600);

    // 通过 TableOpts 结构体设置行和列
    let mut table = SmartTable::default()
    .with_size(790, 590)
    .center_of_parent()
    .with_opts(TableOpts {
        rows: 30,
        cols: 15,
        editable: true,
        ..Default::default()
    });
    
    wind.end();
    wind.show();

    // 用一些值填充表格
    for i in 0..30 {
        for j in 0..15 {
            table.set_cell_value(i, j, &(i + j).to_string());
        }
    }

    // 把 第4行第5列 的表格设置为"another", 需要注意索引是从0开始的
    table.set_cell_value(3, 4, "another");

    assert_eq!(table.cell_value(3, 4), "another");

    // 防止按 Esc键 时关闭窗口
    wind.set_callback(move |_| {
        if app::event() == enums::Event::Close {
            app.quit();
        }
    });

    app.run().unwrap();
}
```

![fltk-table](https://github.com/fltk-rs/fltk-table/raw/HEAD/screenshots/styled.jpg)