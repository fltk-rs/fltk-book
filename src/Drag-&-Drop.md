# Drag & Drop

Drag and Drop are Event types supported by FLTK. You can drag widgets around if you implement these events, and you can drag outside files into an FLTK application. You might also want to implement drawing over widgets which would require handling Event::Drag at least.

## Dragging widgets

Here we'll implement dragging for the window itself. We'll create a window without a border. Normally you can drag windows around using the border:
```rust
use fltk::{prelude::*, *};

fn main() {
    let app = app::App::default();
    let mut wind = window::Window::default().with_size(400, 400);
    wind.set_color(enums::Color::White);
    wind.set_border(false);
    wind.end();
    wind.show();

    wind.handle({
        let mut x = 0;
        let mut y = 0;
        move |w, ev| match ev {
            enums::Event::Push => {
                let coords = app::event_coords();
                x = coords.0;
                y = coords.1;
                true
            }
            enums::Event::Drag => {
                w.set_pos(app::event_x_root() - x, app::event_y_root() - y);
                true
            }
            _ => false,
        }
    });

    app.run().unwrap();
}
```

## Dragging Files

Dragging a file into an application basically invokes the Paste event, and fills the app::event_text() with the path of the file. So when we handle dragging, we want to capture the path in Event::Paste, check if the file exists, read its content and fill our text widget:
```rust
use fltk::{prelude::*, enums::Event, *};

fn main() {
    let app = app::App::default();
    let buf = text::TextBuffer::default();
    let mut wind = window::Window::default().with_size(400, 400);
    let mut disp = text::TextDisplay::default_fill();
    wind.end();
    wind.show();

    disp.set_buffer(buf.clone());
    disp.handle({
        let mut dnd = false;
        let mut released = false;
        let mut buf = buf.clone();
        move |_, ev| match ev {
            Event::DndEnter => {
                dnd = true;
                true
            }
            Event::DndDrag => true,
            Event::DndRelease => {
                released = true;
                true
            }
            Event::Paste => {
                if dnd && released {
                    let path = app::event_text();
                    let path = std::path::Path::new(&path);
                    assert!(path.exists());
                    buf.load_file(&path).unwrap();
                    dnd = false;
                    released = false;
                    true
                } else {
                    false
                }
            }
            Event::DndLeave => {
                dnd = false;
                released = false;
                true
            }
            _ => false,
        }
    });
    app.run().unwrap();
}
```

If you're not interested in the contents of the file, you can just take the path and show it to the user:
```rust
use fltk::{prelude::*, enums::Event, *};

fn main() {
    let app = app::App::default();
    let buf = text::TextBuffer::default();
    let mut wind = window::Window::default().with_size(400, 400);
    let mut disp = text::TextDisplay::default_fill();
    wind.end();
    wind.show();

    disp.set_buffer(buf.clone());
    disp.handle({
        let mut dnd = false;
        let mut released = false;
        let mut buf = buf.clone();
        move |_, ev| match ev {
            Event::DndEnter => {
                dnd = true;
                true
            }
            Event::DndDrag => true,
            Event::DndRelease => {
                released = true;
                true
            }
            Event::Paste => {
                if dnd && released {
                    let path = app::event_text();
                    buf.append(&path);
                    dnd = false;
                    released = false;
                    true
                } else {
                    false
                }
            }
            Event::DndLeave => {
                dnd = false;
                released = false;
                true
            }
            _ => false,
        }
    });
    app.run().unwrap();
}
```

## Dragging to draw
You can draw inside events, but you'll want to use offscreen drawing. In the widgets draw method, you just copy the offscreen content into the widget. A more detailed example can be seen here:
https://github.com/fltk-rs/fltk-rs/wiki/drawing#offscreen-drawing
