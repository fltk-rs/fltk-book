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

- You can also check CMake in the previous list, or download CMake from [here](https://cmake.org/download/).
- If you don't have `git`, make sure to get it from [here](https://git-scm.com/downloads).
- From the rust-lang.org website, download the correct rustup installer for your architecture.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### Windows (gnu toolchain)
If you don't already have msys2, you can get it from [here](https://www.msys2.org/).

- You can get the Rust toolchain via the pacman package manager, or via rustup as described previously. The installation process however would require specifying the use of the gnu toolchain (not choosing the default which would install the MSVC toolchain). 
The toolchain should also reflect the architecture of your machine. For example, a 64bit machine should install the x86_64-pc-windows-gnu toolchain.
If you decide to get Rust via the package manager, make sure you're getting the mingw variant, and with the correct MINGW_PACKAGE_PREFIX (for 64bits, that env variable would equate to mingw-w64-x86_64).
- Assuming you're installing everything via pacman, open the mingw shell (not the msys2 shell, it can be found bundled in the msys2 install directory, or via `source shell mingw64`) and run the following:
```
pacman -S curl tar git $MINGW_PACKAGE_PREFIX-rust $MINGW_PACKAGE_PREFIX-gcc $MINGW_PACKAGE_PREFIX-cmake $MINGW_PACKAGE_PREFIX-make --needed
```
You can replace $MINGW_PACKAGE_PREFIX-make with $MINGW_PACKAGE_PREFIX-ninja if you plan to use ninja via the use-ninja feature.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### MacOS
- To get the Xcode Command Line Tools (which have the C++ compiler), run:
```
xcode-select --install
```
Follow the instructions. Alternatively you can install clang or gcc from homebrew.
- To get CMake, you can get it from [here](https://cmake.org/download/).

Or from homebrew as well.
```
brew install cmake
```

- To get the Rust toolchain:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

And follow the default instructions.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### Linux
- Use your package manager to get a C++ compiler, CMake, make, git.
Taking Debian/Ubuntu as an example:
```
sudo apt-get install g++ cmake git make
```
- To get the dev dependencies for FLTK, you can also use your package manager:
For Debian-based GUI distributions, that means running:
```
sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
```
For RHEL-based GUI distributions, that means running:
```
sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel
```
For Arch-based GUI distributions, that means running:
```
sudo pacman -S libx11 libxext libxft libxinerama libxcursor libxrender libxfixes pango cairo libgl mesa --needed
```
For Alpine linux:
```
apk add pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
```
- To get the Rust toolchain:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
And follow the default instructions.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.
