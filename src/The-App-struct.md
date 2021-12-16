# The App struct

The crate offers an App struct in the app module. Initializing the App struct initializes all the internal styles, fonts and supported image types. It also initializes the multithreaded environment in which the app will run.
```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    app.run().unwrap();
}
```
The run methods runs the event loop of the gui application.
To have fine grained control of events, you can use the wait() method.
```rust
use fltk::*;

fn main() {
    let app = app::App::default();
    while app.wait() {
        // handle events
    }
}
```

Furthermore, the App struct allows you to set the global scheme of your application using the with_scheme() initializer:
```rust
use fltk::*;

fn main() {
    let app = app::App::default().with_scheme(app::Scheme::Gtk);
    app.run().unwrap();
}
```
This will give your application a Gtk app appearance. There are other built-in schemes: Basic, Plastic and Gleam.

The App struct is also responsible for loading system fonts at the start of the application using the load_system_fonts() method. 

A typical fltk-rs application will construct the App struct prior to creating any widgets and showing the main window. 

Any logic added after calling the run() method, will be executed after the event loop is terminated (typically by closing the all windows of your application, or by calling the quit() method). That logic could include respawning the app if needed. 

In addition to the App struct, the app module itself contains structs and free functions pertaining to the global state of your app. These include visuals like setting background and foreground colors and default fontface and size, screen functions, clipboard functions, global handlers, app events, channels (Sender and Receiver) and timeouts. 

Some of these will be discussed elsewhere in the book. 