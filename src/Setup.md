# Setup

Rust (version > 1.45), CMake (version > 3.11), Git and a C++11 compiler need to be installed and in your PATH for a crossplatform build from source. This crate also offers a bundled form of fltk on selected platforms, this can be enabled using the fltk-bundled feature flag (which requires curl and tar to download and unpack the bundled libraries). If you have ninja-build installed, you can enable it using the "use-ninja" feature. This should accelerate build times significantly.

- Windows: No dependencies.
- MacOS: No dependencies.
- Linux: X11 and OpenGL development headers need to be installed for development. The libraries themselves are available on linux distros with a graphical user interface.

For Debian-based GUI distributions, that means running:
```
$ sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
```
For RHEL-based GUI distributions, that means running:
```
$ sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel
```
For Arch-based GUI distributions, that means running:
```
$ sudo pacman -S libx11 libxext libxft libxinerama libxcursor libxrender libxfixes pango cairo libgl mesa --needed
```
For Alpine linux:
```
$ apk add pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
```
- Android: Android Studio, Android Sdk, Android Ndk.

## Detailed setup
This section assumes you don't even have Rust installed, and is separated into different environments:

### Windows (MSVC toolchain)
- Go to https://www.rust-lang.org/learn/get-started
- Follow the link to `Visual Studio C++ Build tools` and download the MSVC compiler and Windows sdk.
- Using the installer, install:

![image](https://user-images.githubusercontent.com/37966791/116013495-2dff8800-a639-11eb-8e4c-8c6228e00abc.png)

and make sure the following are checked:

![image](https://user-images.githubusercontent.com/37966791/116013520-48d1fc80-a639-11eb-934a-fac6609135b4.png)

- You can also check CMake in the previous list, or download CMake from:
https://cmake.org/download/
- If you don't have `git`, make sure to get it from:
https://git-scm.com/downloads
- From the rust-lang.org website, download the correct rustup installer for your architecture.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### Windows (gnu toolchain)
If you don't already have msys2, you can get it from:
https://www.msys2.org/
- You can get the Rust toolchain via the pacman package manager, or via rustup as described previously. The installation process however would require specifying the use of the gnu toolchain (not choosing the default which would install the MSVC toolchain). 
The toolchain should also reflect the architecture of your machine. For example, a 64bit machine should install the x86_64-pc-windows-gnu toolchain.
If you decide to get Rust via the package manager, make sure you're getting the mingw variant, and with the correct MINGW_PACKAGE_PREFIX (for 64bits, that env variable would equate to mingw-w64-x86_64).
- Assuming you're installing everything via pacman, open the mingw shell (not the msys2 shell, it can be found bundled in the msys2 install directory) and run the following:
```
$ pacman -S curl tar git $MINGW_PACKAGE_PREFIX-rust $MINGW_PACKAGE_PREFIX-gcc $MINGW_PACKAGE_PREFIX-cmake $MINGW_PACKAGE_PREFIX-make --needed
```
You can replace $MINGW_PACKAGE_PREFIX-make with $MINGW_PACKAGE_PREFIX-ninja.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### MacOS
- To get the Xcode Command Line Tools (which have the C++ compiler), run:
```
$ xcode-select --install
```
Follow the instructions. Alternatively you can install clang or gcc from homebrew.
- To get CMake, you can get it from:
https://cmake.org/download/
Or from homebrew as well.
- To get the Rust toolchain:
```
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
And follow the default instructions.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.

### Linux
- Use your package manager to get a C++ compiler, CMake, make, git.
Taking Debian/Ubuntu as an example:
```
$ sudo apt-get install g++ cmake git make
```
- To get the dev dependencies for FLTK, you can also use your package manager:
For Debian-based GUI distributions, that means running:
```
$ sudo apt-get install libx11-dev libxext-dev libxft-dev libxinerama-dev libxcursor-dev libxrender-dev libxfixes-dev libpango1.0-dev libgl1-mesa-dev libglu1-mesa-dev
```
For RHEL-based GUI distributions, that means running:
```
$ sudo yum groupinstall "X Software Development" && yum install pango-devel libXinerama-devel
```
For Arch-based GUI distributions, that means running:
```
$ sudo pacman -S libx11 libxext libxft libxinerama libxcursor libxrender libxfixes pango cairo libgl mesa --needed
```
For Alpine linux:
```
$ apk add pango-dev fontconfig-dev libxinerama-dev libxfixes-dev libxcursor-dev
```
- To get the Rust toolchain:
```
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
And follow the default instructions.
- Once you're all set up, you can create a Rust project using `cargo new`, add `fltk` as a dependency in your Cargo.toml and build your application.
