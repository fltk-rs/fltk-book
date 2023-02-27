# Fluid

FLTK提供了一个名为FLUID的，所见即所得的快速GUI程序开发工具，它可以方便地编写GUI程序。
目前在Youtube上有一个教你基于Rust使用它的视频教程：
[Use FLUID (RAD tool) with Rust](https://www.youtube.com/watch?v=k_P0wG3-dNk)

fl2rust crate将Fluid生成的.fl文件转换成Rust代码，并编译进你的程序中。
要获取更多详细信息，请查看它的官方[仓库](https://github.com/MoAlyousef/fl2rust)。

你可以使用cargo install 安装 fltk-fluid 和 fl2rust crate 来使用FLUID。
```
cargo install fltk-fluid
cargo install fl2rust
```
然后运行：
```
fluid &
```
你也可以通过使用包管理器获取Fluid，这样的话它将作为一个单独的程序或者是fltk程序的一部分安装到你的系统中。

目前，fl2rust并不能确保生成的Rust代码的正确性。它的使用也只限于构造方法。

## 用法
为了演示用法，我们使用`cargo new app`创建一个新的Rust项目。
fl2rust将作为 `build-dependdencies` 添加到你的项目中：

```toml
# Cargo.toml
[dependencies]
fltk = "1"

[build-dependencies]
fl2rust = "0.4"
```

然后在编译文件build.rs（该文件会在编译Rust程序时运行）中调用它提供的方法来将`.fl`文件转换成Rust代码。
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

我们在src目录下创建一个fluid文件 `myuifile.fl`。我们通过`println!`中的指令告诉Cargo，如果文件发生改变就重新运行脚本。这里的文件名和目录是为了演示而设置的，你可以自己选择目录，以及输入和输出的文件名。这里我们将`myuifile.fl`文件转换成`myuifile.rs`，它生成在`OUT_DIR`中，因此我们不会在`src`目录下看到它。
为了可以使用转换后的文件，你需要在`src`目录创建一个与上述的输出文件同名的文件：

```
touch src/myuifile.rs
```

然后使用 `include` 宏，载入生成的文件中的内容。
```rust
// src/myuifile.rs
#![allow(unused_variables)]
#![allow(unused_mut)]
#![allow(unused_imports)]
#![allow(clippy::needless_update)]

include!(concat!(env!("OUT_DIR"), "/myuifile.rs"));
```
最后我们就可以在`main.rs`中使用这些内容了：
```rust
// src/main.rs
use fltk::{prelude::*, *};
mod myuifile;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```

现在到了gui的编写部分，打开fluid：
```bash
fltk-fluid & # 如果从包管理器安装，只需要运行 fluid
```
`&`使终端将它作为一个独立的进程打开，所以我们仍然可以使用终端来使用cargo编译我们的代码，或者你可以打开另一个终端。



![image](https://user-images.githubusercontent.com/37966791/146925955-ac778726-1398-4ea2-8e46-a2f8fff89804.png)



我们看到的是一个空窗口和一个菜单栏。编写程序的第一步是创建一个类：



![image](https://user-images.githubusercontent.com/37966791/146926284-cd9f21ce-b4b1-4009-9766-32876a08de98.png)



现在会弹出一个对话框，我们直接点击 "OK "让它使用默认的名称（UserInterface）。现在你会看到我们刚才创建的类出现在下面的列表中：



![image](https://user-images.githubusercontent.com/37966791/146926505-545f26c1-ac7d-4f10-94a9-2d0c16875d4e.png)

接下来，再次点击new，为这个类添加一个构造函数：



![image](https://user-images.githubusercontent.com/37966791/146926749-9199bd23-0346-4286-993f-bfb7588ae420.png)

同样使用它的默认名称，即`make_window()`。

接下来我们添加一个窗口：



![image](https://user-images.githubusercontent.com/37966791/146926970-769ad7a1-9d03-457a-91f7-d6a18e2ba3b0.png)



现在出现了一个新的窗口，我们可以拖动边框放大它：



![image](https://user-images.githubusercontent.com/37966791/146927099-ff014e0d-8ea0-4f90-a500-882eb7b49bb2.png)



双击窗口，这会弹出一个对话框，可以用来设置窗口的gui属性（在GUI标签下）、风格（在Style标签下）和类属性（在C++标签下）。



![image](https://user-images.githubusercontent.com/37966791/146927520-c2ee18b1-0d17-43cd-93eb-edbf725ddf6c.png)



我们在GUI标签中给这个窗口设置`My Window`标签 ，然后在Style标签中把颜色改为白色：



![image](https://user-images.githubusercontent.com/37966791/146932899-6a4419ae-9c91-4b48-a363-d87c85b01778.png)



在C++标签下，我们为这个窗口变量起个名字，`my_win`。



![image](https://user-images.githubusercontent.com/37966791/146932794-7e1a2819-842d-45c7-88c8-be9fb728e805.png)



现在，可以通过`myuifile::UserInterface::my_win`访问窗口了。

之后，用鼠标左键点击窗口，然后添加一个Button（按钮）：



![image](https://user-images.githubusercontent.com/37966791/146928089-ad0454de-252e-4e81-9079-db0ef5c67c8f.png)



这次我们选择Button。在C++标签下，我们为这个按钮变量起一个名字，`btn`。在style下，改变按钮的颜色和标签的颜色。然后在GUI下，把它的标签（按钮显示的文字） "click me"。



![image](https://user-images.githubusercontent.com/37966791/146928419-a1a96e03-5b90-4aaa-8f70-9b17f76f9b9f.png)



可以拖动边框来调整大小，拖动按钮来改变它的位置。Fluid有一个Layout菜单，可以用它修改一组小部件（例如有很多按钮的情况），使其具有相同的布局/大小...等。



![image](https://user-images.githubusercontent.com/37966791/146928654-43838e2a-aba8-4a24-8d70-1e25e1717c58.png)



现在点击`File/Save As...`将文件保存在src目录下，命名为`myuifile.fl`。

可以运行`cargo run`来看看能不能编译通过，但我们还没有调用`make_window()`方法，所以暂时还不会看到任何东西。
现在修改 src/main.rs 来让窗口可以显示出来，并为我们的按钮添加一个点击回调事件（callback）。

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
