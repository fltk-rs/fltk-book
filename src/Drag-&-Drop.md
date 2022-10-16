# 拖放 Drag & Drop

拖放是FLTK支持的事件类型。如果你实现了这些事件，你就可以拖动组件，也可以将外部文件拖入FLTK应用程序。你可能还想实现在widget上绘图，这就要求处理Event::Drag。

## 拖动组件

这里我们将为窗口本身实现拖动。我们将创建一个没有边框的窗口。通常情况下，你可以使用边框来拖动窗口。
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

## 拖动文件

将一个文件拖入程序中会调用Paste事件，并将文件的路径填入app::event_text()。因此，当我们处理拖动时，我们想在Event::Paste中捕获路径，检查文件是否存在，读取其内容并填充我们的text widget：
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
        let buf = buf.clone();
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
                    let path = path.trim();
                    let path = path.replace("file://", "");
                    let path = std::path::PathBuf::from(&path);
                    if path.exists() {
                        // we use a timeout to avoid pasting the path into the buffer
                        app::add_timeout3(0.0, {
                            let mut buf = buf.clone();
                            move |_| {
                                buf.load_file(&path).unwrap();
                            }
                        });
                    }
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

如果你对文件的内容不感兴趣，你可以只取路径并显示给用户：
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

## 拖动绘图
你可以在事件里面绘图，但你会可能想使用屏幕外的画法。在widget绘图方法中，你只是把屏幕外的内容复制到widget中。一个更详细的例子可以在[绘图](Drawing.md#offscreen-drawing)中的屏幕外绘图部分看到。
