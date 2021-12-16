# Colors

FLTK can handle [true color](https://en.wikipedia.org/wiki/Color_depth#True_color_(24-bit)). Some convenience colors are made available in the enums::Color enum:
- Black
- White
- Red
- Blue
- Cyan
...etc.

You can also construct your colors using Color methods:
- by_index(). This uses fltk's colormap. Values range from 0 to 255:
```rust
let red = Color::by_index(88);
```

![colormap](https://www.fltk.org/doc-1.3/fltk-colormap.png)

- from_hex(). This takes a 24-bit hex value in the form RGB:
```rust
const RED: Color = Color::from_hex(0xff0000); // notice it's a const functions
```

- from_rgb(). This takes 3 values r, g, b:
```rust
const RED: Color = Color::from_rgb(255, 0, 0); // notice it's a const functions
```

The Color enum also offers some convenience methods to generate different shades of the chosen color, using .darker(), .lighter(), .inactive() methods and others:
```rust
let col = Color::from_rgb(176, 100, 50).lighter();
```

If you prefer html hex string colors, you can use the from_hex_str() method:
```rust
let col = Color::from_hex_str("#ff0000");
```