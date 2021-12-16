Welcome to the fltk-rs wiki!

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