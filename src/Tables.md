# 表格 Tables

fltk提供了table widget，其使用代码可以在例子中找到。然而，使用[fltk-table crate](https://crates.io/crates/fltk-table)将需要更少的模板代码，并且还提供了一个更简单、更直观的界面。
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

    /// 我们通过 TableOpts 域传递行和列
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

    // 用一些值填充
    for i in 0..30 {
        for j in 0..15 {
            table.set_cell_value(i, j, &(i + j).to_string());
        }
    }

    // 把行列为4，5的单元设置为"another", 注意索引是从0开始的
    table.set_cell_value(3, 4, "another");

    assert_eq!(table.cell_value(3, 4), "another");

    // 防治点击空格键的时候关闭窗口
    wind.set_callback(move |_| {
        if app::event() == enums::Event::Close {
            app.quit();
        }
    });

    app.run().unwrap();
}
```

![fltk-table](https://github.com/fltk-rs/fltk-table/raw/HEAD/screenshots/styled.jpg)