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


下面列举了使用不同的 `Valuator` 组件实现这个例子的效果：

<details>
<summary><b>展开查看示例</b></summary>

## Adjuster widget

<div align="center">

![Adjuster](https://user-images.githubusercontent.com/98977436/242296674-1e126073-2c9f-443d-9dab-fccd66733e39.PNG)
</div>

## Counter widget

<div align="center">

![Counter](https://user-images.githubusercontent.com/98977436/242744205-f2729663-ed21-4e8b-a957-093c436fd00f.PNG)
</div>

## Dial widget

<div align="center">

![Dial](https://user-images.githubusercontent.com/98977436/242744149-cf050906-0be9-4212-9d0c-ae4f33bbef5a.PNG)
</div>

## FillDial widget

<div align="center">

![FillDial](https://user-images.githubusercontent.com/98977436/242744161-7c210cc6-4869-4c17-8a8d-eb115c4a05b3.PNG)
</div>

## FillSlider widget

<div align="center">

![FillSlider](https://user-images.githubusercontent.com/98977436/242744164-ad6cb154-82bc-4379-988a-205c0991071e.PNG)
</div>

## HorFillSlider widget

<div align="center">

![HorFillSlider](https://user-images.githubusercontent.com/98977436/242744166-34698d23-6ace-4971-8a46-5e41d9e03b7f.PNG)
</div>

## HorNiceSlider widget

<div align="center">

![HorNiceSlider](https://user-images.githubusercontent.com/98977436/242744167-4975a80b-eee9-45e9-9655-ade47ac331c2.PNG)
</div>

## HorSlider widget

<div align="center">

![HorSlider](https://user-images.githubusercontent.com/98977436/242744168-eaa87ef0-932a-48b0-9b39-1f35245e0dfe.PNG)
</div>

## HorValueSlider widget

<div align="center">

![HorValueSlider](https://user-images.githubusercontent.com/98977436/242744171-d17f2c12-aa65-4b95-b026-a501dd9d7112.PNG)
</div>

## LineDial widget

<div align="center">

![LineDial](https://user-images.githubusercontent.com/98977436/242744174-57e1dee1-104e-4870-99b7-cd1bf8cb82a7.PNG)
</div>

## NiceSlider widget

<div align="center">

![NiceSlider](https://user-images.githubusercontent.com/98977436/242744175-b75f737d-5d93-4d98-9a17-700cd7d74fae.PNG)
</div>

## Roller widget

<div align="center">

![Roller](https://user-images.githubusercontent.com/98977436/242744176-63fc716c-c0ac-45b2-b2ed-1ab79b62c64d.PNG)
</div>

## Scrollbar widget

<div align="center">

![Scrollbar](https://user-images.githubusercontent.com/98977436/242744178-ed347599-b75a-41e9-8feb-8f87e3f65ec8.PNG)
</div>

## Slider widget

<div align="center">

![Slider](https://user-images.githubusercontent.com/98977436/242744188-7115f63d-cd53-412a-a603-1f606a15d644.PNG)
</div>

## ValueInput widget

<div align="center">

![ValueInput](https://user-images.githubusercontent.com/98977436/242744198-85708994-2123-4d24-97ef-b3e9feb4392e.PNG)
</div>

## ValueOutput widget

<div align="center">

![ValueOutput](https://user-images.githubusercontent.com/98977436/242744199-d62b300e-3661-4d0b-9eea-fd971cedb53e.PNG)
</div>

## ValueSlider widget

<div align="center">

![ValueSlider](https://user-images.githubusercontent.com/98977436/242744201-739d9730-c765-434e-a37e-00b89e7d9a10.PNG)
</div>
</details>

---

# Valuator 枚举
`fltk::valuator`枚举为`Valuator`组件提供了一些可用的特性。如果你要使用这些效果，请添加下面的代码：

```rust
let mut valuator_object = valuator::Counter::default().with_size(200, 50).center_of_parent();
// 为你的组件添加下面这行代码
valuator_object.clone().with_type(fltk::valuator::CounterType::Simple);
```

下面演示了 `Counter`, `Dial`, `Scrollbar` 和`Slider` 组件使用这些特性的示例：

<details>
<summary><b>点击查看枚举示例</b></summary>

## CounterType::Normal

<div align="center">

![CounterTypeNormal](https://user-images.githubusercontent.com/98977436/242744208-123e67c2-7d99-4e1e-ba18-961f6a045c3c.PNG)
</div>

## CounterType::Simple

<div align="center">

![CounterTypeSimple](https://user-images.githubusercontent.com/98977436/242744209-5a32155d-2481-420d-a4df-e65cb94c896b.PNG)
</div>

---

## DialType::Normal

<div align="center">

![DialTypeNormal](https://user-images.githubusercontent.com/98977436/242744158-40daa466-d0ff-4829-a59e-ea53a828316a.PNG)
</div>

## DialType::Line

<div align="center">

![DialTypeLine](https://user-images.githubusercontent.com/98977436/242744156-81aadbdd-349f-4e8f-9a18-aa3aab192384.PNG)
</div>

## DialType::Fill

<div align="center">

![DialTypeFill](https://user-images.githubusercontent.com/98977436/242744153-86da086c-e41d-474d-93a7-1a5724c1936b.PNG)
</div>

---

## ScrollbarType::Vertical

<div align="center">

![ScrollbarTypeVertical](https://user-images.githubusercontent.com/98977436/242744185-f3d0d260-1d51-4818-8d5e-44a569de13fd.PNG)
</div>

## ScrollbarType::Horizontal

<div align="center">

![ScrollbarTypeHorizontal](https://user-images.githubusercontent.com/98977436/242744179-2c1ab7b0-3d0c-478b-8991-57e03c830cc2.PNG)
</div>

## ScrollbarType::VerticalFill

<div align="center">

![ScrollbarTypeVerticalFill](https://user-images.githubusercontent.com/98977436/242744186-4e11a7a3-ead8-4662-a253-adec6f462fae.PNG)
</div>

## ScrollbarType::HorizontalFill

<div align="center">

![ScrollbarTypeHorizontalFill](https://user-images.githubusercontent.com/98977436/242744181-a46e4e21-98b2-4ff8-82e0-2592c2bd6c36.PNG)
</div>

## ScrollbarType::VerticalNice

<div align="center">

![ScrollbarTypeVerticalNice](https://user-images.githubusercontent.com/98977436/242744187-4cbb48c1-91e5-42e8-91c0-a207570ba02c.PNG)
</div>

## ScrollbarType::HorizontalNice

<div align="center">

![ScrollbarTypeHorizontalNice](https://user-images.githubusercontent.com/98977436/242744183-64c40027-584a-496d-93f0-4909a3addf43.PNG)
</div>

---

## SliderType::Vertical

<div align="center">

![SliderTypeVertical](https://user-images.githubusercontent.com/98977436/242744192-ca19a6e9-1221-4253-b357-cd4cf12a0801.PNG)
</div>

## SliderType::VerticalFill

<div align="center">

![SliderTypeVerticalFill](https://user-images.githubusercontent.com/98977436/242744194-20b3c4a9-cd42-4c07-ae44-9753d7ab4393.PNG)
</div>

## SliderType::HorizontalFill

<div align="center">

![SliderTypeHorizontalFill](https://user-images.githubusercontent.com/98977436/242744190-11f4f4f4-137a-4d10-8beb-13514c6e8357.PNG)
</div>

## SliderType::VerticalNice

<div align="center">

![SliderTypeVerticalNice](https://user-images.githubusercontent.com/98977436/242744196-96dac4e1-bf0d-4622-ba45-84d20985ec89.PNG)
</div>

## SliderType::HorizontalNice

<div align="center">

![SliderTypeHorizontalNice](https://user-images.githubusercontent.com/98977436/242744191-83d3520d-c648-4372-8fc6-32ad29ec3162.PNG)
</div>

</details>

---