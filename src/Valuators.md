# 估值器 Valuators

FLTK提供的`Valuator`组件均实现了`ValuatorExt trait`。这些组件会在内部跟踪步长`step`，范围`range`和边界`bound`这些数据，你会在图形界面上看到它们的具体作用。
你可能在别的地方使用过`Scrollbar`和`Sliders`这些组件。可以在`Valuator` mod中找到这些组件：

- Slider
- NiceSlider
- ValueSlider
- Dial
- LineDial
- Counter
- Scrollbar
- Roller
- Adjuster
- ValueInput
- ValueOutput
- FillSlider
- FillDial
- HorSlider (Horizontal slider)
- HorFillSlider
- HorNiceSlider
- HorValueSlider

在图形界面通过拖动等方式改变`Valuator`的值会触发其回调。`Valuator`的当前值可以通过`value()`方法来获取，可以用`set_value()`来设置其值。根据使用情况，你也可以获取和改变`range`和`step`的值：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut slider = valuator::HorNiceSlider::default().with_size(400, 20).center_of_parent();
    slider.set_minimum(0.);
    slider.set_maximum(100.);
    slider.set_step(1., 1); // 设置步长为10
    slider.set_value(50.); // 设置开始
    win.end();
    win.show();

    slider.set_callback(|s| {
        println!("slider at {}", s.value());
    });
    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727188-4ac06d45-7fd1-44f7-9adc-366d9bb79d8f.png)