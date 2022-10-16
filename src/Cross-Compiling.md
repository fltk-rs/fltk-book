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


## 使用交叉编译 C/C++ toolchain

我们的想法是，你需要一个C/C++交叉编译器和一个正如前面的方案中提到的，通过`rustup target add`安装的Rust target。

对于Windows and MacOS，系统编译器已经支持为特定的架构为目标编译。例如，在MacOS上，如果你已经可以使用你的系统编译器构建fltk应用程序，你可以针对不同的架构使用下列命令进行编译（假设你有一个intel x86_64 mac）：
```
rustup target add aarch64-apple-darwin
cargo build --target=arch64-apple-darwin
```

### Linux to 64-bit Windows

假设你想从Linux交叉编译到64位Windows，在此之前你已经能够在你的主机上进行编译。
- 你需要使用下令命令添加Rust target：
```
rustup target add x86_64-pc-windows-gnu # 基于arch
```
- 安装一个C/C++ 交叉编译器，比如Mingw toolchain。在基于Debian的发行部上，你可以运行：
```
apt-get install mingw-w64 # 或者 gcc-mingw-w64-x86-64
```
在基于RHEL的发行部上：
```
dnf install mingw64-gcc
```
在Arch上：
```
pacman -S mingw-w64-gcc
```
在Alpine上：
```
apk add mingw-w64-gcc
```
- 在你项目根目录添加一个`.cargo/config.toml` （如果你想全局设置的话，也可以是HOME目录）并指定交叉链接器和归档管理器：
```toml
# .cargo/config.toml
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-gcc-ar"
```
- 运行build：
```
cargo build --target=x86_64-pc-windows-gnu
```

### x64 linux-gnu to aarch64 linux-gnu

另一个例子是，从基于x86_64 debian的发行版到基于arm64 debian的发行部：
假设你已经安装了cmake：

- 你需要使用下列命令添加 rust target：
```
rustup target add aarch64-unknown-linux-gnu
```
- 安装一个C/C++ 交叉编译器，比如Mingw toolchain。在基于Debian的发行版上，你可以运行：
```
apt-get install g++-aarch64-linux-gnu
```
- 为你的系统添加需要的架构：
```
sudo dpkg --add-architecture arm64
```
- 你可能需要将下列镜像添加到/etc/apt/sources.list：
```
sudo sed -i "s/deb http/deb [arch=amd64] http/" /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s) main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-security main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-backports main multiverse universe" | sudo tee -a /etc/apt/sources.list
echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-updates main multiverse universe" | sudo tee -a /etc/apt/sources.list
```
第一条命令改变了当前的镜像， 以反映你当前的 amd64 系统。其他命令则将 arm64 的端口添加到 /etc/apt/sources.list 文件中。
- 更新你的包管理器数据库：
```
sudo apt-get update
```
- 为你的目标平台安装需要的依赖：
```
sudo apt-get install libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxrender-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 libasound2-dev:arm64
```
注意软件包名称中的`:arm64`后缀。
- 运行build：
```
CC=aarch64-linux-gnu-gcc CXX=aarch64-linux-gnu-g++ CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --target=aarch64-unknown-linux-gnu
```

## 使用cross
如果你已经安装了docker，你可以试试 [cross](https://github.com/cross-rs/cross)：
```
cargo install cross
cross build --target=x86_64-pc-windows-gnu # replace with your target, the Docker daemon has to be running, no need to add via rustup
```

如果你的target需要外部依赖，比如在Linux上，你将必须创建一个自定义的docker镜像，并通过Cross.toml文件将其用于交叉编译。例如，对于一个有如下结构的项目来说。
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

arm64-dockerfile（名称并不重要，只要确保Cross.toml指向该文件）的内容：
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
注意库包名称后面附加的架构，如：libx11-dev:arm64。

Cross.toml的内容：

```toml
[target.aarch64-unknown-linux-gnu]
dockerfile = "./arm64-dockerfile"
```

最后运行cross：
```
cross build --target=aarch64-unknown-linux-gnu
```
第一次运行可能会花较长时间

## 使用docker
直接使用目标平台的docker镜像可以让你免去使用cross交叉编译到不同linux目标的麻烦。
你需要一个Docker文件，它可以拉出你想要的target，并安装Rust和C++工具链以及所需的依赖。
例如，为allpine linux构建：

```dockerfile
FROM alpine:latest AS alpine_build
RUN apk add rust cargo git cmake make g++ pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
COPY . .
RUN cargo build --release

FROM scratch AS export-stage
COPY --from=alpine_build target/release/<your binary name> .
```
然后运行：
```
DOCKER_BUILDKIT=1 docker build --file Dockerfile --output out .
```
你的二进制文件将在`./out`目录中。
注意在alpine上，如果你通过rustup安装Rust，你可能需要在你的dockerfile中把musl-gcc和musl-g++指向相应的工具链（在运行`cargo build`之前）。

```dockerfile
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-gcc /usr/bin/musl-gcc
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-g++ /usr/bin/musl-g++
```

另一个例子是将 amd64 linux-gnu 编译成 arm64 linux-gnu：
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
