# 拖放 Drag & Drop

FLTK支持拖放的事件类型。如果你为组件实现了拖放事件，你就可以拖动组件，也可以把文件拖入程序框内。如果还想在组件上绘图，处理`Event::Drag`事件将会帮你做到。

## 拖动组件

通常情况下，你可以拖动窗口边框来移动窗口。现在我们将窗口设置为无边框，然后再为窗口本身实现拖放事件：
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

将一个文件拖入程序框中会触发`Paste`事件，并将文件的路径传入`app::event_text()`。因此，当我们处理文件拖放时，我们需要在`Event::Paste`中捕获路径，这里我们将检查文件是否存在，读取其内容并填充我们的`text`组件：
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
                        // 我们使用 timeout 来避免路径传入缓冲区
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

如果你对文件的内容不感兴趣，你可以只取得文件的路径并显示：
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
我们已经学会了如何在屏幕内通过拖放绘制组件，现在我们还可以响应屏幕外的事件，比如用鼠标绘画这些。我们会将屏幕外事件，如鼠标的移动坐标等等，复制到组件中，然后进行绘制。一个更详细的例子可以在[绘图 Drawing](Drawing.md#offscreen-drawing)中看到。
