# Cross-compiling

## Using cargo-cross
If you have Docker installed, you can try [cargo-cross](https://github.com/rust-embedded/cross).
```
$ cargo install cross
$ cross build --target=x86_64-pc-windows-gnu # replace with your target, the Docker daemon has to be running, no need to add via rustup
```

If your target requires external dependencies, like on Linux, you would have to create a custom docker image and use it for your cross-compilation via a Cross.toml file.

For example, for a project of the following structure:
```
myapp
     |_src
     |    |_main.rs    
     |
     |_Cargo.toml
     |
     |_Cross.toml
     |
     |_archs
            |_aarch64-linux
                           |_Dockerfile
```

The Dockerfile contents:
```
FROM rustembedded/cross:aarch64-unknown-linux-gnu-0.2.1

RUN dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install --assume-yes --no-install-recommends \
    libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 \
    libxinerama-dev:arm64 libxcursor-dev:arm64 \
    libxrender-dev:arm64  libxfixes-dev:arm64  libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 
```
Notice the architecture appended to the library package's name like: libx11-dev:arm64.

The Cross.toml contents:
```toml
[target.aarch64-unknown-linux-gnu]
image = "my-arm64-image:0.1"
```

To build a new image, run:
```
$ docker build -t my-arm64-image:0.1 archs/aarch64-linux/
```

Then run cross:
```
$ cross build --features=no-pango --target=aarch64-unknown-linux-gnu
```
(This might take a while)

P.S. If you need pango support, you would have to install pkg-config:arch and point PKG_CONFIG_LIBDIR to the pkgconfig directory relevant to that architecture.

## Using a prebuilt bundle
If the target you're compiling to, already has a prebuilt package:
- x86_64-pc-windows-gnu
- x86_64-pc-windows-msvc
- x86_64-apple-darwin
- x86_64-unknown-linux-gnu

Add the target via rustup, then invoke the build:
```
$ rustup target add <your target> # replace with one of the targets above
$ cargo build --target=<your target> --features=fltk-bundled
```

## Using a cross-compiling C/C++ toolchain

The idea is that you need a C/C++ cross-compiler and a Rust target installed via `rustup target add` as mentioned in the previous scenario.

Assuming you would like to cross-compile from Linux to 64-bit Windows, and are already able to build on your host machine:
- You'll need to add the Rust target using:
```
$ rustup target add x86_64-pc-windows-gnu # depending on the arch
```
- Install a C/C++ cross-compiler like the Mingw toolchain. On Debian-based distros, you can run:
```
$ apt-get install mingw-w64 # or gcc-mingw-w64-x86-64
```
On RHEL-based distros:
```
$ dnf install mingw64-gcc
```
On Arch:
```
$ pacman -S mingw-w64-gcc
```
On Alpine:
```
$ apk add mingw-w64-gcc
```
- Add a `.cargo/config.toml` in your project root (or HOME dir if you want the setting to be global), and specify the cross-linker and the archiver:
```toml
# .cargo/config.toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-gcc-ar"
```
- Run the build:
```
$ cargo build --target=x86_64-pc-windows-gnu
```

