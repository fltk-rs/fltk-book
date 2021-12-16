Tree widgets allow showing items in a tree! There's no tree trait, all methods belong to the Tree type. Items are added using the add method:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145726958-f1f2a095-39c5-496f-b772-18d024dd609d.png)

Sub-items are added by using the forward slash separator:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    tree.add("Item 3/Subitem 1");
    tree.add("Item 3/Subitem 2");
    tree.add("Item 3/Subitem 3");
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727026-bfcff44f-2b01-4679-937b-3e7d441dfdf0.png)

If you try the above code, you'll see that the root item is always indicated by the label "ROOT". This can be changed using the set_root_label() method:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.set_root_label("My Tree");
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    tree.add("Item 3/Subitem 1");
    tree.add("Item 3/Subitem 2");
    tree.add("Item 3/Subitem 3");
    win.end();
    win.show();

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727045-a25be6bc-a514-4b4a-b7b9-0a7ee2e359b4.png)

Or even hidden using the set_show_root(false) method.

Items can be queried using the first_selected_item() method:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.set_show_root(false);
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    tree.add("Item 3/Subitem 1");
    tree.add("Item 3/Subitem 2");
    tree.add("Item 3/Subitem 3");
    win.end();
    win.show();

    
    tree.set_callback(|t| {
        if let Some(item) = t.first_selected_item() {
            println!("{} selected", item.label().unwrap());
        }
    });

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727072-8596cf09-100c-4cb6-a427-0d3c66702b39.png)

Currently our tree only allow single selection, let's change it to multiple (we'll also change the connector style while we're at it):
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.set_select_mode(tree::TreeSelect::Multi);
    tree.set_connector_style(tree::TreeConnectorStyle::Solid);
    tree.set_connector_color(enums::Color::Red.inactive());
    tree.set_show_root(false);
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    tree.add("Item 3/Subitem 1");
    tree.add("Item 3/Subitem 2");
    tree.add("Item 3/Subitem 3");
    win.end();
    win.show();

    
    tree.set_callback(|t| {
        if let Some(item) = t.first_selected_item() {
            println!("{} selected", item.label().unwrap());
        }
    });

    a.run().unwrap();
}
```
The problem now is that we need to get the whole selection instead only of the first selected item, so we'll use the get_selected_items() method which returns an optional Vec, and instead of just getting the label, we'll get the whole path of the item:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    tree.set_select_mode(tree::TreeSelect::Multi);
    tree.set_connector_style(tree::TreeConnectorStyle::Solid);
    tree.set_connector_color(enums::Color::Red.inactive());
    tree.set_show_root(false);
    tree.add("Item 1");
    tree.add("Item 2");
    tree.add("Item 3");
    tree.add("Item 3/Subitem 1");
    tree.add("Item 3/Subitem 2");
    tree.add("Item 3/Subitem 3");
    win.end();
    win.show();

    
    tree.set_callback(|t| {
        if let Some(items) = t.get_selected_items() {
            for i in items {
                println!("{} selected", t.item_pathname(&i).unwrap());
            }
        }
    });

    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727000-4b881896-309d-465d-8305-9a7e0a92eaea.png)
