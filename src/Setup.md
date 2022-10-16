# 配置

请确保 Rust (version > 1.45)，CMake (version > 3.11)，Git 和一个 C++11 编译器已安装并在 PATH 中配置，以此通过源代码构建跨平台程序。这个 crate 还在选定的平台上提供了fltk的捆绑形式，这可以使用fltk-bundle feature flag 来启用（这需要curl和tar来下载并解包捆绑的库）。如果你安装了 ninja-build ，你可以使用 "use-ninja" feature来启用它。这应该会大大加快构建时间。

- Windows: 
    - MSVC: Windows SDK
    - Gnu: 无依赖
- MacOS: 无依赖
- Linux: 开发时需要安装 X11 and OpenGL 头文件。这些库本身可以在具有图形用户界面的Linux发行版上使用。

基于 Debian 的Linux发行版，运行：
```
sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
```
基于 RHEL的Linux发行版，运行：
```
sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel
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

## 具体配置细节
本节假设你甚至没有安装Rust，我们分几个不同的环境讨论：

### Windows (MSVC toolchain)
- 访问rust语言官网的 [开始](https://www.rust-lang.org/learn/get-started)。
- 按照 "Visual Studio C++ build tools "的链接，下载MSVC编译器和Windows sdk。
- 使用安装器安装：

![image](https://user-images.githubusercontent.com/37966791/116013495-2dff8800-a639-11eb-8e4c-8c6228e00abc.png)

确保选中这些：

![image](https://user-images.githubusercontent.com/37966791/116013520-48d1fc80-a639-11eb-934a-fac6609135b4.png)

- 你也需要在前面的列表中检查是否有CMake，或者点击这里直接下载 [Cmake](https://cmake.org/download/)。
- 如果你还没有GIt，请点击下载 [Git](https://git-scm.com/downloads)。
- 从 rust-lang.org 网站上，下载适合你的架构的正确的rustup安装程序。
- 一旦你都准备好了，你就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`作为依赖，然后开始构建你的应用程序。

### Windows (gnu toolchain)
如果你还没有msys2，点击这里安装 [msys2](https://www.msys2.org/)。

- 你可以通过pacman软件包管理器获得Rust工具链，或者通过前面所说的rustup。然而，在安装过程中需要指定使用gnu工具链（而不是默认安装MSVC工具链）。
工具链也应该反映你的机器的结构。例如，一台64位机器应该安装x86_64-pc-windows-gnu工具链。
如果你决定通过软件包管理器来获得Rust，请确保你得到的是mingw的变体，并且有正确的MINGW_PACKAGE_PREFIX（对于64位机器，这个环境变量相当于mingw-w64-x86_64）。
- 假设你通过pacman安装了所有东西，打开mingw shell（不是msys2 shell，它可以在msys2安装目录下找到，或者通过`source shell mingw64`）并运行以下内容：
```
pacman -S curl tar git $MINGW_PACKAGE_PREFIX-rust $MINGW_PACKAGE_PREFIX-gcc $MINGW_PACKAGE_PREFIX-cmake $MINGW_PACKAGE_PREFIX-make --needed
```
如果你打算通过use-ninja使用ninja，你可以用$MINGW_PACKAGE_PREFIX-ninja替换$MINGW_PACKAGE_PREFIX-make。
- 一旦你都准备好了，你就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`作为依赖，然后开始构建你的应用程序。

### MacOS
- 要获得Xcode命令行工具（它带有C++编译器），运行下列代码：
```
xcode-select --install
```
​	之后按照说明进行。或者，你也可以通过Homebrew安装clang或gcc：
- 为了下载CMake，你可以点击这里下载[CMake](https://cmake.org/download/)。

或者，也可以跟上面一样使用Homebrew：
```
brew install cmake
```

- 安装Rust Toolchain：
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

按照默认设置进行即可。
- 一旦你都准备好了，你就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`作为依赖，然后开始构建你的应用程序。

### Linux
- 使用你的软件包管理器安装一个C++编译器，还有CMake，make，git。
以Debian/Ubuntu 为例：
```
sudo apt-get install g++ cmake git make
```
- 要获得FLTK的开发依赖项，你也可以使用你的软件包管理器。
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
按照默认设置进行即可。
- 一旦你都准备好了，你就可以用`cargo new`创建一个Rust项目，在Cargo.toml中添加`fltk`作为依赖，然后开始构建你的应用程序。
