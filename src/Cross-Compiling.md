# 交叉编译


## 使用预编译包
如果你要为以下平台编译fltk程序的话，很幸运，它们已经有预编译包了：
- x86_64-pc-windows-gnu
- x86_64-pc-windows-msvc
- x86_64-apple-darwin
- aarch64-apple-darwin
- x86_64-unknown-linux-gnu
- aarch64-unknown-linux-gnu

通过rustup设置目标平台（target），然后调用进行编译：

```
rustup target add <your target> # 使用上列目标平台替换target
cargo build --target=<your target> --features=fltk-bundled
```
对于arch64-unknonw-linux-gnu，你可能需要指定链接器：

```
CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --target=aarch64-unknown-linux-gnu --features=fltk-bundled
```

你可以在 `.cargo/config.toml` （HOME下全局配置或在项目根目录下局部配置）中指定好链接器，这样你就不需要在命令中使用了：
```
# .cargo/config.toml
[target.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"
```
之后便可以直接编译了：
```
cargo build --target=aarch64-unknown-linux-gnu --features=fltk-bundled
```


## 使用cross
如果你安装了docker，可以试试用 [cross](https://github.com/cross-rs/cross)：
```
cargo install cross
cross build --target=<your target>  # 使用你的target替换，cross build时Docker守护进程必须正在运行，不需要通过rustup添加target
```

如果你的target需要外部依赖项（比如在Linux上），你必须创建自定义Docker镜像，并经过如下步骤来进行交叉编译：
1. 设置`Cross.toml`文件。

    例如，对一个有如下结构的项目来说：
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
    arm64-dockerfile则是自定义的Docker镜像文件（名称并不重要，只要确保Cross.toml指向该文件）的内容：
    ```dockerfile
    FROM ghcr.io/cross-rs/aarch64-unknown-linux-gnu:edge

    ENV DEBIAN_FRONTEND=noninteractive

    RUN dpkg --add-architecture arm64 && \
        apt-get update && \
        apt-get install --assume-yes --no-install-recommends \
        libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 \
        libxinerama-dev:arm64 libxcursor-dev:arm64 \
        libxrender-dev:arm64  libxfixes-dev:arm64  libgl1-mesa-dev:arm64 \
        libglu1-mesa-dev:arm64 libasound2-dev:arm64 libpango1.0-dev:arm64
    ```
    注意库包名称后面的架构，如：libx11-dev:arm64。

    Cross.toml的内容：

    ```toml
    [target.aarch64-unknown-linux-gnu]
    dockerfile = "./arm64-dockerfile"
    ```

2. 配置`Cargo.toml`文件：
    ```toml
    [target.aarch64-unknown-linux-gnu]
    pre-build = [""" \
    dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install --assume-yes --no-install-recommends \
    libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 \
    libxinerama-dev:arm64 libxcursor-dev:arm64 \
    libxrender-dev:arm64  libxfixes-dev:arm64  libgl1-mesa-dev:arm64 \
    libglu1-mesa-dev:arm64 libasound2-dev:arm64 libpango1.0-dev:arm64 \
    """]
    ```
3. 运行cross：
    ```
    cross build --target=aarch64-unknown-linux-gnu
    ```
    第一次运行可能会花较长时间


## 使用交叉编译 C/C++ toolchain

你需要有一个C/C++交叉编译器，还有设置好前面的方案中提到过的target，（通过`rustup target add`安装）。

对于Windows和MacOS，系统编译器已经可以向特定的target编译程序了。比如在MacOS上，如果你已经可以使用编译器编译fltk应用程序，你可以这样为其他平台编译（假设你有一个intel x86_64 mac）：
```
rustup target add aarch64-apple-darwin
cargo build --target=arch64-apple-darwin
```

### Linux 编译 64位Windows

在你能够为自己的设备正确编译之后，如果你想在Linux上为64位Windows交叉编译应用程序：
- 你需要使用下列命令添加Rust target：
    ```
    rustup target add x86_64-pc-windows-gnu # 此时在arch上编译
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
- 在项目根目录添加`.cargo/config.toml` （如果你想全局设置的话，也可以修改HOME目录下的相应文件），并指定链接器和打包工具：
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

### x64 linux-gnu 编译 aarch64 linux-gnu

另一个例子是，在基于x86_64 debian的发行版上为基于arm64 debian的发行版进行编译：
假设你已经安装了cmake：

- 使用下列命令添加 rust target：
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
- 你可能需要将下列镜像添加到`/etc/apt/sources.list`以便下载：
    ```
    sudo sed -i "s/deb http/deb [arch=amd64] http/" /etc/apt/sources.list
    echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s) main multiverse universe" | sudo tee -a /etc/apt/sources.list
    echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-security main multiverse universe" | sudo tee -a /etc/apt/sources.list
    echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-backports main multiverse universe" | sudo tee -a /etc/apt/sources.list
    echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-updates main multiverse universe" | sudo tee -a /etc/apt/sources.list
    ```
    第一条命令改变当前镜像为该系统的 amd64 架构的镜像。其他命令则将 arm64 部分添加到 /etc/apt/sources.list 文件中。
- 更新程序清单：
    ```
    sudo apt-get update
    ```
- 为目标平台安装需要的依赖：
    ```
    sudo apt-get install libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxrender-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 libasound2-dev:arm64
    ```
    注意，软件包名称中的`:arm64`后缀。
- 运行build：
    ```
    CC=aarch64-linux-gnu-gcc CXX=aarch64-linux-gnu-g++ CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc cargo build --target=aarch64-unknown-linux-gnu
    ```
    你可以在 `.cargo/config.toml` （HOME下全局配置或在项目根目录下局部配置）中指定好链接器，这样你就不需要在命令中使用了：
    ```
    # .cargo/config.toml
    [target.aarch64-unknown-linux-gnu]
    linker = "aarch64-linux-gnu-gcc"
    ```
    之后便可以运行：
    ```
    cargo build --target=aarch64-unknown-linux-gnu
    ```


## 使用docker
直接使用目标平台的docker镜像可以让你免去使用cross交叉编译到不同linux target的麻烦。
你需要一个Dockerfile，来拉取你需要的target，并安装Rust和C++工具链以及所需的依赖。
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
你的二进制文件将生成在`./out`目录中。
注意在alpine上，如果你通过rustup安装Rust，你可能需要在你的dockerfile中让musl-gcc和musl-g++指向相应的工具链（运行`cargo build`之前）。

```dockerfile
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-gcc /usr/bin/musl-gcc
RUN ln -s /usr/bin/x86_64-alpine-linux-musl-g++ /usr/bin/musl-g++
```

由于Rust工具链的这个问题[Issue-61328](https://github.com/rust-lang/rust/issues/61328)，你可能还在编译时需要添加`-C target-feature=-crt-static`这个环境变量。

另一个例子是在 amd64 linux-gnu 编译 arm64 linux-gnu 程序：
```dockerfile
FROM ubuntu:20.04 AS ubuntu_build

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qq
RUN	apt-get install -y --no-install-recommends lsb-release g++-aarch64-linux-gnu g++ cmake curl tar git make
RUN apt-get install -y ca-certificates && update-ca-certificates --fresh && export SSL_CERT_DIR=/etc/ssl/certs
RUN	dpkg --add-architecture arm64 
RUN sed -i "s/deb http/deb [arch=amd64] http/" /etc/apt/sources.list
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s) main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-security main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-backports main multiverse universe" | tee -a /etc/apt/sources.list 
RUN echo "deb [arch=arm64] http://ports.ubuntu.com/ $(lsb_release -c -s)-updates main multiverse universe" | tee -a /etc/apt/sources.list 
RUN	apt-get update -qq && apt-get install -y --no-install-recommends -o APT::Immediate-Configure=0 libx11-dev:arm64 libxext-dev:arm64 libxft-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxrender-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libgl1-mesa-dev:arm64 libglu1-mesa-dev:arm64 libasound2-dev:arm64
RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain stable --profile minimal -y

ENV PATH="/root/.cargo/bin:$PATH" \
	CC=aarch64-linux-gnu-gcc CXX=aarch64-linux-gnu-g++ \
	CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc \
    CC_aarch64_unknown_linux_gnu=aarch64-linux-gnu-gcc \
    CXX_aarch64_unknown_linux_gnu=aarch64-linux-gnu-g++ \
    PKG_CONFIG_PATH="/usr/lib/aarch64-linux-gnu/pkgconfig/:${PKG_CONFIG_PATH}"

RUN rustup target add aarch64-unknown-linux-gnu

COPY . .

RUN  cargo build --release --target=aarch64-unknown-linux-gnu

FROM scratch AS export-stage
COPY --from=ubuntu_build target/aarch64-unknown-linux-gnu/release/<your binary name> .
```

## 使用CMake文件

文件的路径可以传递给 CFLTK_TOOLCHAIN 环境变量：
```
CFLTK_TOOLCHAIN=$(pwd)/toolchain.cmake cargo build --target=<your target>
```
在较新版本的 CMake（3.20 以上）中，可以直接设置 CMAKE_TOOLCHAIN_FILE 环境变量。

CMake 文件的内容通常是，设置 CMAKE_SYSTEM_NAME 以及交叉编译器。 在 Linux/BSD 上还需要设置 PKG_CONFIG_EXECUTABLE 和 PKG_CONFIG_PATH。一个示例：
```cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm64)

set(triplet aarch64-linux-gnu)
set(CMAKE_C_COMPILER /usr/bin/${triplet}-gcc)
set(CMAKE_CXX_COMPILER /usr/bin/${triplet}-g++)
set(ENV{PKG_CONFIG_EXECUTABLE} /usr/bin/${triplet}-pkg-config)
set(ENV{PKG_CONFIG_PATH} "$ENV{PKG_CONFIG_PATH}:/usr/lib/${triplet}/pkgconfig")

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

```
注意 CMAKE_SYSTEM_PROCESSOR 通常是目标平台上 uname -m 的值，其他可能的值参见[Possible Values](https://stackoverflow.com/questions/70475665/what-are-the-possible-values-of-cmake-system-processor/70498851#70498851)。 我们将此示例中的`triplet`变量设置为 aarch64-linux-gnu，这是用于 gcc/g++ 编译器以及 pkg-config 的前缀。 这个`triplet`也等同于 Rust `triplet` aarch64-unknown-linux-gnu。 PKG_CONFIG_PATH 设置为包含我们target的 `.pc` 文件的目录，这些是 Linux/BSD 上的 cairo 和 pango 依赖项所必需的。 最后 4 个选项可以防止CMake混淆host/taregt（当前机器和交叉编译的目标机器）的include/library的路径。