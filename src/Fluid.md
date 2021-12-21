# Fluid

FLTK offers a GUI WYSIWYG rapid application development tool called FLUID which allows creating GUI applications.
Currently there is a video tutorial on youtube on using it with Rust:
[Use FLUID (RAD tool) with Rust](https://www.youtube.com/watch?v=k_P0wG3-dNk)

The fl2rust crate translates the Fluid generated .fl files into Rust code to be compiled into your app.
For more information, you can check the project's [repo](https://github.com/MoAlyousef/fl2rust).

You can get FLUID via fltk-fluid and fl2rust crates using cargo install:
```
$ cargo install fltk-fluid
$ cargo install fl2rust
```
And run using:
```
$ fltk-fluid &
```
Another option to get Fluid is to download it via your system's package manager, it comes as a separate package or part of the fltk package.

Currently, fl2rust, doesn't check the generated Rust code for correctness. It's also limited to constructor methods.

## Usage
To start, you can create a new Rust project using `cargo new app`.
fl2rust is added as a build-dependency to your project:
```toml
# Cargo.toml
[dependencies]
fltk = "1"

[build-dependencies]
fl2rust = "0.4"
```

Then it can be used in the build.rs file (which is run pre-build) to generate Rust code:
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

We'll be naming our fluid file myuifile.fl. We tell cargo to rerun if that file is changed. We'll create the file in our source directory, but you can put it in its own directory if you wish. We tell the generator to take the fluid file and generate a myuifile.rs. This file is generated in the OUT_DIR, so you won't be seeing it in your src directory.
However to include it, you need to create a Rust source file, it can be the same name as our outputted file, and put it in the src directory:
```
$ touch src/myuifile.rs
```

We'll have to import the contents from the auto-generated file using the include! macro:
```rust
// src/myuifile.rs
#![allow(unused_variables)]
#![allow(unused_mut)]
#![allow(unused_imports)]
#![allow(clippy::needless_update)]

include!(concat!(env!("OUT_DIR"), "/myuifile.rs"));
```
Then we'll be able to use the contents in main.rs:
```rust
// src/main.rs
use fltk::{prelude::*, *};
mod myuifile;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```

Now comes the gui part. Open fluid:
```rust
$ fltk-fluid & #or just fluid if installed from a package manager
```
The ampersand tells our shell to open it as a detached process, so we can still use our shell to compile our code.

![image](https://user-images.githubusercontent.com/37966791/146925955-ac778726-1398-4ea2-8e46-a2f8fff89804.png)

We're greeted with an empty window along with a menu bar. Our first step here is to create a Class:
![image](https://user-images.githubusercontent.com/37966791/146926284-cd9f21ce-b4b1-4009-9766-32876a08de98.png)

This will popup a dialog, we can leave the name as it is (UserInterface) by clicking Ok. Now you'll see our class listed:
![image](https://user-images.githubusercontent.com/37966791/146926505-545f26c1-ac7d-4f10-94a9-2d0c16875d4e.png)
(We've expanded the window)

Next, press new again and we'll add a constructor function for our class:
![image](https://user-images.githubusercontent.com/37966791/146926749-9199bd23-0346-4286-993f-bfb7588ae420.png)
We'll also accept the default name which is `make_window()`.

Next we'll add a window:
![image](https://user-images.githubusercontent.com/37966791/146926970-769ad7a1-9d03-457a-91f7-d6a18e2ba3b0.png)

A new window pops up, we can enlarge it a bit by dragging the border:
![image](https://user-images.githubusercontent.com/37966791/146927099-ff014e0d-8ea0-4f90-a500-882eb7b49bb2.png)

Double clicking the window pops up a dialog where we can change the window's gui properties (under the GUI tab), style (under the Style tab) and class properties (under the C++ tab).
![image](https://user-images.githubusercontent.com/37966791/146927520-c2ee18b1-0d17-43cd-93eb-edbf725ddf6c.png)

We'll give the window a label `My Window` in the Gui tab, we'll change the color to white in the Style tab:
![image](https://user-images.githubusercontent.com/37966791/146932899-6a4419ae-9c91-4b48-a363-d87c85b01778.png)

And under the C++ tab, we'll give it the variable name `my_win`:
![image](https://user-images.githubusercontent.com/37966791/146932794-7e1a2819-842d-45c7-88c8-be9fb728e805.png)

Our window will now be accessible via `myuifile::UserInterface::my_win`.

We'll add a button by left clicking the window and adding a Button:
![image](https://user-images.githubusercontent.com/37966791/146928089-ad0454de-252e-4e81-9079-db0ef5c67c8f.png)

This will open the same dialog as before but for the button. Under C++, we'll give it the variable name `btn`. Under style we'll change the color and label color. Then under Gui we'll give it the label "click me":
![image](https://user-images.githubusercontent.com/37966791/146928419-a1a96e03-5b90-4aaa-8f70-9b17f76f9b9f.png)

We'll drag the border to resize and drag the button to any position we want. Fluid has a layout menu where we can modify a number of widgets (if we had multiple buttons for example) to have the same layout/size ...etc:
![image](https://user-images.githubusercontent.com/37966791/146928654-43838e2a-aba8-4a24-8d70-1e25e1717c58.png)

We'll now save the file using `File/Save As...` as myuifile.fl in the src directory.

We can now run `cargo run` to check our build succeeds, but we still haven't call the `make_window()` method, so we won't see anything yet.
Now you can modify src/main.rs to show the window and add a callback to our button:
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


