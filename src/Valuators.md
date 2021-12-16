# Valuators

Valuator widgets implement the ValuatorExt trait. These keep track (graphically and internally) of numerical values along with steps, ranges and bounds.
Such a valuator which you might be familiar with are scrollbars and sliders. The list offered by fltk is found in the valuator module:
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

Changing the valuators value in the gui triggers its callback. The current value of the valuator can be queried using the value() method. It can also be set using set_value(). The ranges and step can also be queried and changed to your use case:
```rust
use fltk::{prelude::*, *};

fn main() {
    let a = app::App::default();
    let mut win = window::Window::default().with_size(400, 300);
    let mut slider = valuator::HorNiceSlider::default().with_size(400, 20).center_of_parent();
    slider.set_minimum(0.);
    slider.set_maximum(100.);
    slider.set_step(1., 1); // increment by 1.0 at each 1 step
    slider.set_value(50.); // start in the middle
    win.end();
    win.show();

    slider.set_callback(|s| {
        println!("slider at {}", s.value());
    });
    a.run().unwrap();
}
```

![image](https://user-images.githubusercontent.com/37966791/145727188-4ac06d45-7fd1-44f7-9adc-366d9bb79d8f.png)