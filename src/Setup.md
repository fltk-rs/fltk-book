# 配置

请确保你的电脑上配置了 Rust (version > 1.45)，CMake (version > 3.11)，Git， C++11 编译工具链，并设置好了PATH，这样便可以方便地构建跨平台程序。我们还提供了特定平台上fltk的捆绑库形式，可以通过启用fltk-bundle这个feature来启用（这里会用到curl来下载库，tar来解包）。如果你安装了 ninja-build 构建工具，你可以使用 "use-ninja" feature来启用。它可能会加快构建速度。

- Windows: 
    - MSVC: Windows SDK
    - Gnu: 无依赖
- MacOS: 无依赖
- Linux: 需要安装 X11 and OpenGL 头文件。具有图形用户界面的Linux发行版上带有这些库。

    基于 Debian 的Linux发行版，运行：
    ```
    sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
    ```
    基于 RHEL的Linux发行版，运行：
    ```
    sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel libstdc++-static
    ```
    基于 Arch 的Linux发行版，运行：
    ```
    sudo pacman -S libx11 libxext libxft libxinerama libxcursor libxrender libxfixes pango cairo libgl mesa --needed
    ```
    Alpine Linux：
    ```
    apk add pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
    ```
- Android： Android Studio，Android Sdk， Android Ndk。

## 配置细节
这一部分将假设你没有安装Rust，分几个不同的环境进行讨论：

### Windows (MSVC toolchain)
- 访问rust语言官网的 [开始](https://www.rust-lang.org/learn/get-started)。
- 按照 "Visual Studio C++ build tools "的链接，下载MSVC编译器和Windows sdk。
- 使用安装器安装：

![image](https://user-images.githubusercontent.com/37966791/116013495-2dff8800-a639-11eb-8e4c-8c6228e00abc.png)

确保选中这些：

![image](https://user-images.githubusercontent.com/37966791/116013520-48d1fc80-a639-11eb-934a-fac6609135b4.png)

- 你可以在其中查看有没有CMake安装选项，或者直接点这里下载 [Cmake](https://cmake.org/download/)。
- 如果你还没有GIt，请点击下载 [Git](https://git-scm.com/downloads)。
- 从 rust-lang.org 网站上，下载适合你的架构的正确的rustup安装程序。
- 一切准备好后，就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`依赖，然后开始编写你的应用程序。

### Windows (gnu toolchain)
如果你没有msys2，点击这里安装 [msys2](https://www.msys2.org/)。

- 你可以通过pacman软件包管理器安装Rust工具链，或者通过前面所说的rustup（推荐）。注意，使用pacman安装需要显示指定你要使用gnu工具链（否则会默认安装MSVC工具链）。
你应该依据你电脑的架构安装合适的工具链。例如，64位设备应该安装x86_64-pc-windows-gnu工具链。
如果你决定通过软件包管理器安装Rust，请确保你得到的是mingw的变体，并且有正确的MINGW_PACKAGE_PREFIX（对于64位机器，这个环境变量相当于mingw-w64-x86_64）。
- 假设你通过pacman安装了东西，打开mingw shell（注意，这里不是msys2 shell，它可以在msys2安装目录下找到，或者通过`source shell mingw64`）并运行以下内容：
    ```
    pacman -S curl tar git $MINGW_PACKAGE_PREFIX-rust $MINGW_PACKAGE_PREFIX-gcc $MINGW_PACKAGE_PREFIX-cmake $MINGW_PACKAGE_PREFIX-make --needed
    ```
    如果你打算使用ninja，可以用`$MINGW_PACKAGE_PREFIX-ninja`替换`$MINGW_PACKAGE_PREFIX-make`。
- 一切准备好后，就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`依赖，然后开始编写你的应用程序。

### MacOS
- 运行下列代码安装Xcode命令行工具（它带有C++编译器）：
    ```
     xcode-select --install
    ```
    按照说明执行步骤。或者可以不用XCode，直接用Homebrew安装clang或gcc：
- 可以点击这里下载[CMake](https://cmake.org/download/)。
    或者，也可以跟上面一样使用Homebrew：
    ```
    brew install cmake
    ```

- 安装Rust Toolchain：
    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

    按照默认设置进行即可。
- 一切准备好后，就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`依赖，然后开始编写你的应用程序。

### Linux
- 使用你的软件包管理器安装一个C++编译器，以及CMake，make，git。
以Debian/Ubuntu 为例：
    ```
    sudo apt-get install g++ cmake git make
    ```
- 要使用FLTK的开发依赖项（dependencies-dev），你还可以使用软件包管理器。
对基于Debian的GUI发行版，运行下列代码：
    ```
    sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
    ```
    对于基于RHEL的GUI发行版，运行下列代码：
    ```
    sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel
    ```
    对于基于Arch Linux的GUI发行版，运行下列代码：
    ```
    sudo pacman -S libx11 libxext libxft libxinerama libxcursor libxrender libxfixes pango cairo libgl mesa --needed
    ```
    对于Alpine linux：
    ```
    apk add pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
    ```
- 安装Rust Toolchain：
    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
    一切按默认即可。
- 一切准备好后，就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`依赖，然后开始编写你的应用程序。
