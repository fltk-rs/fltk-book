# Home

Welcome to the fltk-rs book!

This is a work in progress for written tutorials targeting the fltk crate.

FLTK is a cross-platform lightweight gui library.
The library itself is written in C++98, which is highly-portable. This crate is written in Rust, and uses FFI to call into the FLTK wrapper written in C89 and C++11.

The library has a minimalist architecture, and would be familiar to developers used to Object-Oriented gui libraries. The wrapper itself follows the same model which simplifies the documentation, since method names are identical or similar to their C++ equivalents. This makes referring the FLTK C++ documentation quite simpler since the methods basically map to each other.

```c++
int main() {
    auto wind = new Fl_Window(100, 100, 400, 300, "My Window");
    wind->end();
    wind->show();
}
```
maps to:
```rust
fn main() {
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

Why choose FLTK?
- Lightweight. Small binary, around 1mb after stripping. [Small memory footprint](https://szibele.com/memory-footprint-of-gui-toolkits/).
- Speed. Fast to install, fast to build, fast at startup and fast at runtime.
- Single executable. No DLLs to deploy.
- Supports old architectures.
- FLTK's permissive license which allows static linking for closed-source applications.
- Themeability (4 supported schemes: Base, GTK, Plastic and Gleam), and additional theming using [fltk-theme](https://crates.io/crates/fltk-theme).
- Provides around 80 customizable widgets.
- Has inbuilt image support.

## Usage

Just add the following to your project's Cargo.toml file:
```toml
[dependencies]
fltk = "^1.2"
```

To use the bundled libs (available for x64 windows (msvc & gnu (msys2)), x64 linux & macos):
```toml
[dependencies]
fltk = { version = "^1.2", features = ["fltk-bundled"] }
```

The library is automatically built and statically linked to your binary.

To make our first Rust code sample work, we need to import the necessary fltk modules:
```rust
use fltk::{prelude::*, window::Window};
fn main() {
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
}
```

If you run the code sample, you might notice it does nothing. We actually need to run the event loop, this is equivalent to using `Fl::run()` in C++:
```rust
use fltk::{app, prelude::*, window::Window};
fn main() {
    let a = app::App::default();
    let wind = window::Window::new(100, 100, 400, 300, "My Window");
    wind.end();
    wind.show();
    a.run().unwrap();
}
```
We instantiate the App struct, which initializes the runtime and styles, then at the end of main, we call the run() method.

## Contributing to the book
The book is generated using [mdbook](https://github.com/rust-lang/mdBook) on the [fltk-book](https://github.com/fltk-rs/fltk-book) repo.

As such, you would need to `cargo install mdbook`. More instructions can be found in fltk-book's README and in mdbook's [user guide](https://rust-lang.github.io/mdBook/).