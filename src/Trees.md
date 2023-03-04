# 树 Trees

`Tree`组件可以实现元素按照的。你可能会想，它是不是定义在`TreeExt trait`中，哈哈哈，然而这里并没有。所有方法都是来自`Tree`结构体类型。可以使用`add()`方法为Tree添加元素：
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

Item下还可以子Item，可以使用正斜线分隔符`/`来添加：
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

看过上面代码的例子，你会发现树的根标签总是 "ROOT "。可以通过`set_root_label()`方法来设置根标签：
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

还能调用`set_show_root(false)`方法来隐藏根标签。

可以使用`first_selected_item()`方法来获取被点击到的元素：
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

现在我们的Tree中的元素只能单选，让我们把它改成允许多选的树（这里我们也改变了元素之间连线的样式）：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut tree = tree::Tree::default().with_size(390, 290).center_of_parent();
    // 设置Tree的选择模式为多选
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
现在的问题是，我们需要获取选择到的所有选项，而不只是第一个被选中的项目，这里我们使用`get_selected_items()`方法，该方法返回一个`Option<Vec>`。这里我们使用`item_pathname()`来获取Item在树中的路径。
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
