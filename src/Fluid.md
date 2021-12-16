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