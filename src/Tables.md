fltk offers a table widget, the use code for which can be found in the examples. However, using the [fltk-table crate](https://crates.io/crates/fltk-table) would require much less boilerplate code and also offers an easier and more intuitive interface:
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

    /// We pass the rows and columns thru the TableOpts field
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

    // Just filling the vec with some values
    for i in 0..30 {
        for j in 0..15 {
            table.set_cell_value(i, j, &(i + j).to_string());
        }
    }

    // set the value at the row,column 4,5 to "another", notice that indices start at 0
    table.set_cell_value(3, 4, "another");

    assert_eq!(table.cell_value(3, 4), "another");

    // To avoid closing the window on hitting the escape key
    wind.set_callback(move |_| {
        if app::event() == enums::Event::Close {
            app.quit();
        }
    });

    app.run().unwrap();
}
```

![fltk-table](https://github.com/fltk-rs/fltk-table/raw/HEAD/screenshots/styled.jpg)