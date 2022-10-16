# Fluid

FLTK提供了一个名为FLUID的，所见即所得的快速GUI应用开发工具，用它可以创建GUI应用。
目前在youtube上有一个使用基于Rust使用它的视频教程。
[Use FLUID (RAD tool) with Rust](https://www.youtube.com/watch?v=k_P0wG3-dNk)

fl2rust crate将Fluid生成的.fl文件翻译成Rust代码，并编译进你的程序中。
要获取更多详细信息，请查看它的官方[仓库](https://github.com/MoAlyousef/fl2rust)。

你可以使用cargo install 安装 fltk-fluid和fl2rust crates来获得FLUID。
```
cargo install fltk-fluid
cargo install fl2rust
```
然后运行：
```
fluid &
```
你也可以通过你系统的包管理器获取Fluid，这样的话它将作为一个单独的包或fltk包的一部分。

目前，fl2rust并不能检查生成的Rust代码的正确性。它也只限于构造方法。

## 用法
首先，你可以使用`cargo new app`创建一个新的Rust项目。
fl2rust将作为一个构建依赖项，被添加到你的项目中：

```toml
# Cargo.toml
[dependencies]
fltk = "1"

[build-dependencies]
fl2rust = "0.4"
```

然后就可以在build.rs文件中使用它（该文件在预编译时运行）来生成Rust代码。
```rust
// build.rs
fn main() {
    use std::path::PathBuf;
    use std::env;
    println!("cargo:rerun-if-changed=src/myuifile.fl");
    let g = fl2rust::Generator::default();
    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    g.in_out("src/myuifile.fl", out_path.join("myuifile.rs").to_str().unwrap()).expect("Failed to generate rust from fl file!");
}
```

我们将把fluid文件命名为myuifile.fl。我们告诉cargo，如果该文件被修改，就重新运行。我们将在我们的源代码目录创建文件，但如果你愿意，也可以为它创建自己的文件夹放进去。我们告诉生成器，让它接受fluid文件并生成一个myuifile.rs。这个文件是在OUT_DIR中生成的，所以你不会在你的src目录中看到它。
但是为了包含（include）它，你需要创建一个Rust源文件，它可以和我们输出的文件同名，并把它放在src目录中：

```
touch src/myuifile.rs
```

我们将使用include！宏，从自动生成的文件中导入这些内容。
```rust
// src/myuifile.rs
#![allow(unused_variables)]
#![allow(unused_mut)]
#![allow(unused_imports)]
#![allow(clippy::needless_update)]

include!(concat!(env!("OUT_DIR"), "/myuifile.rs"));
```
然后我们就可以使用main.rs中的内容了：
```rust
// src/main.rs
use fltk::{prelude::*, *};
mod myuifile;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```

现在到了gui部分。打开fluid：
```rust
fltk-fluid & #or just fluid if installed from a package manager
```
“&”符号让shell把它作为一个分离进程打开，所以我们仍然可以用我们的shell来编译我们的代码。



![image](https://user-images.githubusercontent.com/37966791/146925955-ac778726-1398-4ea2-8e46-a2f8fff89804.png)



我们第一眼看到的是一个空窗口和一个菜单栏。我们在这里的第一步是创建一个类：



![image](https://user-images.githubusercontent.com/37966791/146926284-cd9f21ce-b4b1-4009-9766-32876a08de98.png)



这将弹出一个对话框，我们直接点击 "OK "让它使用默认的名称（UserInterface）。现在你会看到我们的类出现在列表中：



![image](https://user-images.githubusercontent.com/37966791/146926505-545f26c1-ac7d-4f10-94a9-2d0c16875d4e.png)

(我们已经扩展了这个窗口)

接下来，再次按下new键，我们将为我们的类添加一个构造函数：



![image](https://user-images.githubusercontent.com/37966791/146926749-9199bd23-0346-4286-993f-bfb7588ae420.png)

同样使用它的默认名称，即`make_window()`。

接下来我们将添加一个窗口：



![image](https://user-images.githubusercontent.com/37966791/146926970-769ad7a1-9d03-457a-91f7-d6a18e2ba3b0.png)



现在弹出了一个新的窗口，我们可以拖动边框将其放大一些：



![image](https://user-images.githubusercontent.com/37966791/146927099-ff014e0d-8ea0-4f90-a500-882eb7b49bb2.png)



双击窗口会弹出一个对话框，我们可以改变窗口的gui属性（在GUI标签下）、风格（在Style标签下）和类属性（在C++标签下）。



![image](https://user-images.githubusercontent.com/37966791/146927520-c2ee18b1-0d17-43cd-93eb-edbf725ddf6c.png)



我们在GUI标签中给这个窗口一个`My Window`标签 ，然后在Style标签中把颜色改为白色：



![image](https://user-images.githubusercontent.com/37966791/146932899-6a4419ae-9c91-4b48-a363-d87c85b01778.png)



在C++标签下，我们给它一个变量名`my_win`。



![image](https://user-images.githubusercontent.com/37966791/146932794-7e1a2819-842d-45c7-88c8-be9fb728e805.png)



现在，我们的窗口可以通过`myuifile::UserInterface::my_win`访问。

现在左击窗口并添加一个Button（按钮）：



![image](https://user-images.githubusercontent.com/37966791/146928089-ad0454de-252e-4e81-9079-db0ef5c67c8f.png)



这将打开与之前相同的对话框，但这次我们选择按钮。在C++下，我们将给它一个变量名`btn`。在style下，我们将改变颜色和标签的颜色。然后在Gui下，我们将给它一个标签 "click me"。



![image](https://user-images.githubusercontent.com/37966791/146928419-a1a96e03-5b90-4aaa-8f70-9b17f76f9b9f.png)



可以拖动边框来调整大小，把按钮拖到任何想要的位置。Fluid有一个布局菜单，可以用它修改一些小部件（如果我们有很多按钮），使其具有相同的布局/大小...等。



![image](https://user-images.githubusercontent.com/37966791/146928654-43838e2a-aba8-4a24-8d70-1e25e1717c58.png)



我们现在点击`File/Save As...`将文件保存在src目录下，命名为srcmyuifile.fl。

现在可以运行`cargo run`来看看是否能编译通过，但我们还没有调用`make_window()`方法，所以暂时还不会看到任何东西。
现在你可以修改 src/main.rs 来显示窗口，并为我们的按钮添加一个回调。

```rust
use fltk::{prelude::*, *};
mod myuifile;

fn main() {
    let app = app::App::default();
    let mut ui = myuifile::UserInterface::make_window();
    let mut win = ui.my_win.clone();
    ui.btn.set_callback(move |b| {
        b.set_label("clicked");
        win.set_label("Button clicked");
        println!("Works!");
    });
    app.run().unwrap();
}
```

