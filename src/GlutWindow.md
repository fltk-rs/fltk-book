# GlutWindow

The `GlutWindow` struct represents a OpenGL Glut window widget in the fltk-rs crate. Below you can look about depencendies and all the methods associated with this widget.

## Dependencies

To use GlutWindow you need to have Cmake and Git in your computer.

1. Install CMake and Git: Make sure that CMake and Git are installed on your system and added to your system's PATH environment variable. You can download [CMake](https://cmake.org/download/) from the official website and Git from the [Git](https://git-scm.com/downloads) website.

2. Verify PATH configuration: After installing CMake and Git, check if their executables can be accessed from the command line. Open a terminal or command prompt and type `cmake --version` and `git --version` to verify that they are recognized.

3. Specify library paths: If the build process still can't find the `fltk_gl` library, you may need to specify additional library paths using the `-L` flag. Identify the location of the `fltk_gl` library on your system and add the appropriate flag to the build command. For example:

```bash
cargo build -L /path/to/fltk_gl/library
```

Replace `/path/to/fltk_gl/library` with the actual path to the `fltk_gl` library.

4. Ensure correct dependencies: Double-check that you have the correct dependencies specified in your project's `Cargo.toml` file. Make sure you have the `fltk` and `fltk-sys` dependencies included with their appropriate versions. Here's an example of how it should look:

```toml
[dependencies]
fltk = { version = "1.5.2", features = ["enable-glwindow"] }
```

5. Clean and rebuild: If the above steps do not resolve the issue, you can try cleaning the build artifacts and rebuilding the project. Use the following command to clean the project:

```bash
cargo clean
```

After cleaning, rebuild the project with:

```bash
cargo build
```

By following these steps, you should be able to successfully build your project.

---

## Methods

- `default()`: Creates a default-initialized glut window.
- `get_proc_address(&self, s: &str)`: Gets an OpenGL function address.
- `flush(&mut self)`: Forces the window to be drawn and calls the `draw()` method.
- `valid(&self)`: Returns whether the OpenGL context is still valid.
- `set_valid(&mut self, v: bool)`: Marks the OpenGL context as still valid.
- `context_valid(&self)`: Returns whether the context is valid upon creation.
- `set_context_valid(&mut self, v: bool)`: Marks the context as valid upon creation.
- `context(&self)`: Returns the GlContext.
- `set_context(&mut self, ctx: GlContext, destroy_flag: bool)`: Sets the GlContext.
- `swap_buffers(&mut self)`: Swaps the back and front buffers.
- `ortho(&mut self)`: Sets the projection so 0,0 is in the lower left of the window and each pixel is 1 unit wide/tall.
- `can_do_overlay(&self)`: Returns whether the GlutWindow can do overlay.
- `redraw_overlay(&mut self)`: Redraws the overlay.
- `hide_overlay(&mut self)`: Hides the overlay.
- `make_overlay_current(&mut self)`: Makes the overlay current.
- `pixels_per_unit(&self)`: Returns the pixels per unit/point.
- `pixel_w(&self)`: Gets the window's width in pixels.
- `pixel_h(&self)`: Gets the window's height in pixels.
- `mode(&self)`: Gets the Mode of the GlutWindow.
- `set_mode(&mut self, mode: Mode)`: Sets the Mode of the GlutWindow.

For more detailed information of GlWindow, please refer to the official documentation [here](https://docs.rs/fltk/latest/fltk/window/struct.GlutWindow.html).

---

## Examples

### OpenGL Triangle

The dependencies section in  your project's Cargo.toml file should be:
```rust
[dependencies]
fltk = { version = "^1.5", features = ["enable-glwindow"] }
glow = "0.16.0"
```
main.rs
```rust
use fltk::{prelude::*, *};
use glow::*;

fn main() {
    let app = app::App::default();
    let mut win = window::GlWindow::default().with_size(800, 600);
    win.make_resizable(true);
    win.set_mode(enums::Mode::Opengl3);
    win.end();
    win.show();

    unsafe {
        let gl = glow::Context::from_loader_function(|s| win.get_proc_address(s) as *const _);

        let vertex_array = gl
            .create_vertex_array()
            .expect("Cannot create vertex array");
        gl.bind_vertex_array(Some(vertex_array));

        let program = gl.create_program().expect("Cannot create program");

        let (vertex_shader_source, fragment_shader_source) = (
            r#"const vec2 verts[3] = vec2[3](
                vec2(0.5f, 1.0f),
                vec2(0.0f, 0.0f),
                vec2(1.0f, 0.0f)
            );
            out vec2 vert;
            void main() {
                vert = verts[gl_VertexID];
                gl_Position = vec4(vert - 0.5, 0.0, 1.0);
            }"#,
            r#"precision mediump float;
            in vec2 vert;
            out vec4 color;
            void main() {
                color = vec4(vert, 0.5, 1.0);
            }"#,
        );

        let shader_sources = [
            (glow::VERTEX_SHADER, vertex_shader_source),
            (glow::FRAGMENT_SHADER, fragment_shader_source),
        ];

        let mut shaders = Vec::with_capacity(shader_sources.len());

        for (shader_type, shader_source) in shader_sources.iter() {
            let shader = gl
                .create_shader(*shader_type)
                .expect("Cannot create shader");
            gl.shader_source(shader, &format!("#version 410\n{}", shader_source));
            gl.compile_shader(shader);
            if !gl.get_shader_compile_status(shader) {
                panic!("{}", gl.get_shader_info_log(shader));
            }
            gl.attach_shader(program, shader);
            shaders.push(shader);
        }

        gl.link_program(program);
        if !gl.get_program_link_status(program) {
            panic!("{}", gl.get_program_info_log(program));
        }

        for shader in shaders {
            gl.detach_shader(program, shader);
            gl.delete_shader(shader);
        }

        gl.use_program(Some(program));
        gl.clear_color(0.1, 0.2, 0.3, 1.0);

        win.draw(move |w| {
            gl.clear(glow::COLOR_BUFFER_BIT);
            gl.draw_arrays(glow::TRIANGLES, 0, 3);
            w.swap_buffers();
        });
    }

    app.run().unwrap();
}
```

![gl-img](https://raw.githubusercontent.com/fltk-rs/demos/master/glow/ex.jpg)

### Rotate

This program uses GlWindow to create an OpenGL window where a triangle is drawn and can be rotated by dragging it with the mouse. You can look the code of this example [here](https://github.com/fltk-rs/demos/tree/master/opengl).

<div align="center">

![rotate](https://raw.githubusercontent.com/fltk-rs/demos/master/opengl/ex.jpg)

</div>
