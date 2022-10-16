# 估值器 Valuators

估值器widget实现了ValuatorExt trait。这些widget跟踪（以图形和内部方式）跟踪steps，ranges和bounds。
你可能熟悉滚动条和滑块（scrollbars and sliders）这种估值器。可以在valuator模块中找到fltk提供的这些估值器：

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

在gui中改变valuator的值会触发其回调。Valuator的当前值可以通过value()方法来查询。它也可以用set_value()来为它设置一个值。range和step也可以根据你的使用情况进行查询和改变：
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut slider = valuator::HorNiceSlider::default().with_size(400, 20).center_of_parent();
    slider.set_minimum(0.);
    slider.set_maximum(100.);
    slider.set_step(1., 1); // 每一step增长10
    slider.set_value(50.); // 从中间开始
    win.end();
    win.show();

    slider.set_callback(|s| {
        println!("slider at {}", s.value());
    });
    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727188-4ac06d45-7fd1-44f7-9adc-366d9bb79d8f.png)