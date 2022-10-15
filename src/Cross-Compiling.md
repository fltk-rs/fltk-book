# 交叉编译


## 使用预置Bundle
如果你要为下列平台编译的话，很幸运，它们已经有一个预置包了：
- x86_64-pc-windows-gnu
- x86_64-pc-windows-msvc
- x86_64-apple-darwin
- aarch64-apple-darwin
- x86_64-unknown-linux-gnu
- aarch64-unknown-linux-gnu

通过rustup添加target，然后调用build：

```
rustup target add <your target> # 使用上列目标平台替换target
cargo build --target=<your target> --features=fltk-bundled
```
对于arch64-unknonw-linux-gnu，你可能需要验证链接器：

```
CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --target=<your target> --features=fltk-bundled
```


## Using a cross-compiling C/C++ toolchain

The idea is that you need a C/C++ cross-compiler and a Rust target installed via `rustup target add` as mentioned in the previous scenario.

For Windows and MacOS, the system compiler would already support targetting the supported architectures. For example, on MacOS, if you can already build fltk apps using your system compiler, you can target a different architecture using (assuming you have an intel x86_64 mac):
```
rustup target add aarch64-apple-darwin
cargo build --target=arch64-apple-darwin
```

### Linux to 64-bit Windows

Assuming you would like to cross-compile from Linux to 64-bit Windows, and are already able to build on your host machine:
- You'll need to add the Rust target using:
```
rustup target add x86_64-pc-windows-gnu # depending on the arch
```
- Install a C/C++ cross-compiler like the Mingw toolchain. On Debian-based distros, you can run:
```
apt-get install mingw-w64 # or gcc-mingw-w64-x86-64
```
On RHEL-based distros:
```
dnf install mingw64-gcc
```
On Arch:
```
pacman -S mingw-w64-gcc
```
On Alpine:
```
apk add mingw-w64-gcc
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
cargo build --target=x86_64-pc-windows-gnu
```

### x64 linux-gnu to aarch64 linux-gnu

Another example is building from x86_64 debian-based distro to arm64 debian-based distro:
Assuming you already have cmake already installed.
- You'll need to add the Rust target using:
```
rustup target add aarch64-unknown-linux-gnu
```
- Install a C/C++ cross-compiler like the Mingw toolchain. On Debian-based distros, you can run:
```
apt-get install g++-aarch64-linux-gnu
```
- Add the required architecture to your system:
```
sudo dpkg --add-architecture arm64
```
- You might need to add the following mirrors to /etc/apt/sources.list:
```
sudo sed -i "s/deb http/deb [arch=amd64] http/" /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s) main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-security main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-backports main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-updates main multiverse universe" | sudo tee -a /etc/apt/sources.list
```
The first command changes the current mirrors to reflect your current amd64 system. The others add the arm64 ports to your /etc/apt/sources.list file.
- Update your package manager's database:
```
sudo apt-get update
```
- Install the required dependencies for your target architecture:
```
sudo apt-get install libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxrender-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 libasound2-dev:arm64
```
Notice the `:arm64` suffix in the packages' name.
- Run the build:
```
CC=aarch64-linux-gnu-gcc CXX=aarch64-linux-gnu-g++ CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --target=aarch64-unknown-linux-gnu
```

## Using cross
If you have Docker installed, you can try [cross](https://github.com/cross-rs/cross).
```
cargo install cross
cross build --target=x86_64-pc-windows-gnu # replace with your target, the Docker daemon has to be running, no need to add via rustup
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
     |_arm64-dockerfile
```

The arm64-dockerfile (the name doesn't matter, just make sure Cross.toml points to the file) contents:
```dockerfile
FROM ghcr.io/cross-rs/aarch64-unknown-linux-gnu:latest

RUN dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install --assume-yes --no-install-recommends \
    libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 \
    libxinerama-dev:arm64 libxcursor-dev:arm64 \
    libxrender-dev:arm64  libxfixes-dev:arm64  libgl1-mesa-dev:arm64 \
    libglu1-mesa-dev:arm64 libasound2-dev:arm64 libpango1.0-dev:arm64
```
Notice the architecture appended to the library package's name like: libx11-dev:arm64.

The Cross.toml contents:
```toml
[target.aarch64-unknown-linux-gnu]
dockerfile = "./arm64-dockerfile"
```

Then run cross:
```
cross build --target=aarch64-unknown-linux-gnu
```
(This might take a while for the first time)

## Using docker
Using a docker image of the target platform directly can save you from the hassle of cross-compiling to a different linux target using cross.
You'll need a Dockerfile which pulls the target you want and install the Rust and C++ toolchains and the required dependencies.
For example, building for alpine linux:
```dockerfile
FROM alpine:latest AS alpine_build
RUN apk add rust cargo git cmake make g++ pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
COPY . .
RUN cargo build --release

FROM scratch AS export-stage
COPY --from=alpine_build target/release/<your binary name> .
```
And run using:
```
DOCKER_BUILDKIT=1 docker build --file Dockerfile --output out .
```
Your binary will be in the `./out` directory.
Note on alpine, if you install Rust via rustup, you might have to point the musl-gcc and musl-g++ to the appropriate toolchain in your dockerfile (before running `cargo build`):
```dockerfile
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-gcc /usr/bin/musl-gcc
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-g++ /usr/bin/musl-g++
```

Another example to compile from amd64 linux-gnu to arm64 linux-gnu:
```dockerfile
FROM ubuntu:latest AS ubuntu_build

RUN apt-get update -qq
RUN	apt-get install -y --no-install-recommends lsb-release g++-aarch64-linux-gnu g++ cmake curl tar git 
RUN	dpkg --add-architecture arm64 
RUN sed -i "s/deb http/deb [arch=amd64] http/" /etc/apt/sources.list
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s) main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-security main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-backports main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-updates main multiverse universe" | tee -a /etc/apt/sources.list 
RUN	apt-get update -qq && apt-get install -y --no-install-recommends libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxrender-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 libasound2-dev:arm64
RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain stable --profile minimal -y

ENV PATH=/root/.cargo/bin:$PATH

RUN rustup target add aarch64-unknown-linux-gnu
# works around an include path issue in some debian versions
RUN apt-get install -y libharfbuzz-dev libpango1.0-dev --no-install-recommends && cp /usr/include/harfbuzz/*.h /usr/include/aarch64-linux-gnu

COPY . .

RUN CC=aarch64-linux-gnu-gcc CXX=aarch64-linux-gnu-g++ CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --release --target=aarch64-unknown-linux-gnu

FROM scratch AS export-stage
COPY --from=ubuntu_build target/aarch64-unknown-linux-gnu/release/<your binary 
```
