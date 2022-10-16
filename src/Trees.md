# 树 Trees

Tree widgets 让你可以以树状的形式显示一些元素。这里并没有 tree trait，所有方法来自 Tree type。可以使用add方法添加元素：
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

子项目可以使用正斜线分隔符来添加：
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

如果你试试上面的代码，你会发现根项标签总是 "ROOT "。可以通过set_root_label()方法来改变根标签：
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

甚至可以使用set_show_root(false)方法隐藏根标签。

树中的元素可以使用first_selected_item()方法进行查询：
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

目前我们的树只允许单选，让我们把它改成多选（我们也要改变连接器connecter的样式）：
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
现在的问题是，我们需要得到所有的选项，而不只是第一个被选中的项目，这里我们使用get_selected_items()方法，该方法返回一个可选的Vec，而不是只得到标签，我们将得到item的整个路径。
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
