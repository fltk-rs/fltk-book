# GlutWindow

fltk-rs 通过 `GlutWindow` 提供了 OpenGL Glut 窗口的支持。
下面列举出了使用该组件需要添加的依赖以及其所有关联函数。

## 开发依赖
你的电脑需要配置有 `Git` 和 `CMake` 才可以使用 `GlutWindow`。

1. 安装CMake和Git： 确保它们已经被正确安装，且已经配置在你的系统的PATH环境变量中. 可以点击这里从官网下载 [CMake](https://cmake.org/download/) 和 [Git](https://git-scm.com/downloads) 。

2. 验证PATH的配置： 在安装上述软件后，测试是否可以通过命令行执行它们。 打开你的终端或命令提示符，输入`cmake --version` and `git --version` 来验证。

3. 验证库路径： 若编译失败，提示无法找到 `fltk_gl` 库，你可能需要使用 `-L` 验证库路径是否正确。确定 `fltk_gl` 库在你系统中的位置，并在构建命令中添加适当的标记，例如： 

    ```bash
    cargo build -L /path/to/fltk_gl/library
    ```

    将 `/path/to/fltk_gl/library` 替换为你的系统中 `fltk_gl` 的实际地址。

4. 验证程序依赖： 仔细检查 `Cargo.toml` 文件中配置的依赖项是否正确，确保你添加了正确版本的 `fltk` 和 `fltk-sys` 的依赖项:

    ```toml
    [dependencies]
    fltk = { version = "1.4.4", features = ["enable-glwindow"] }
    ```

5. 清除缓存并重编译：如果上述步骤没有解决你的问题，尝试清除构建文件并重新进行编译。使用以下命令清理构建文件:

    ```bash
    cargo clean
    ```

    清理后重新运行编译:
    
    ```bash
    cargo build
    ```

    完成上述步骤后，你应该能够成功构建你的项目了。



## Methods

    此部分翻译内容较不准确，，请参见原文：[GlutWindow](https://fltk-rs.github.io/fltk-book/GlutWindow.html)

- `default()`: 创建一个默认的初始化的窗口
- `get_proc_address(&self, s: &str)`: 获取一个OpenGL程序的地址
- `flush(&mut self)`: 强制窗口绘制并调用 `draw()` 方法
- `valid(&self)`: 返回表示OpenGL上下文是否存在的布尔值
- `set_valid(&mut self, v: bool)`: 标记OpenGL上下文为有效
- `context_valid(&self)`: 返回表示创建时上下文是否有效的布尔值
- `set_context_valid(&mut self, v: bool)`: 标记创建时上下文为有效
- `context(&self)`: 返回 GlContext.
- `set_context(&mut self, ctx: GlContext, destroy_flag: bool)`: 设置 GlContext.
- `swap_buffers(&mut self)`: 清除前后端缓冲区
- `ortho(&mut self)`: Sets the projection so 0,0 is in the lower left of the window and each pixel is 1 unit wide/tall.
- `can_do_overlay(&self)`: 返回表示 GlutWindow 是否可以覆盖的布尔值
- `redraw_overlay(&mut self)`: 重绘并覆盖
- `hide_overlay(&mut self)`: 隐藏覆盖层
- `make_overlay_current(&mut self)`: 使覆盖层即时
- `pixels_per_unit(&self)`: 返回每 unit/point 的像素值
- `pixel_w(&self)`: 返回窗口宽度的像素值
- `pixel_h(&self)`: 返回窗口高度的像素值
- `mode(&self)`: 返回 GlutWindow 的模式
- `set_mode(&mut self, mode: Mode)`: 设置 GlutWindow 的模式

可以查阅官方文档获取 `GlWindow` 的更多信息 [官方文档](https://docs.rs/fltk/latest/fltk/window/struct.GlutWindow.html).


## 示例

### 绘制一个三角形 OpenGL Triangle

```rust
use fltk::{
    prelude::*,
    *,
    image::IcoImage
};
use glow::*;
fn main() {
    let app = app::App::default();
    let mut win = window::GlWindow::default().with_size(800, 600);
    let icon: IcoImage = IcoImage::load(&std::path::Path::new("src/fltk.ico")).unwrap();
    win.make_resizable(true);
    win.set_icon(Some(icon));
    win.set_mode(enums::Mode::Opengl3);
    win.end();
    win.show();
    unsafe {
        let gl = glow::Context::from_loader_function(|s| {
            win.get_proc_address(s) as *const _
        });
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

### 拖动旋转 Rotate

这个示例使用了 `GlWindow` 创建了一个 `OpenGL` 窗口，并在窗口中绘制了一个三角形，你可以通过拖动鼠标来使它旋转 [示例地址](https://github.com/fltk-rs/demos/tree/master/opengl).

<div align="center">

![rotate](https://raw.githubusercontent.com/fltk-rs/demos/master/opengl/ex.jpg)

</div>