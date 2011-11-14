# jQuery.fc.tape widget

jQuery widget for sprite animations. Background image (sprite) consisting of picture frames
like the movie tape is animated. Widget supports options to adjust smothness and speed of animations
as well as methods to control animation behavior.


## Installation

`jQuery.fc.tape` has following dependencies:

* [jQuery](http://jquery.com/) и
* [jQuery UI](http://jqueryui.com/) (Core и Widget)


## Usage

```js
$('#element').tape(options);
```


## Options


### gradually (boolean)

Switch frames with smooth transition (next frame overlays previous with a small
transparent fade). Useful for animations with a small number of frames,
slow speed animations and for several effects.

```js
$('#tape').tape({
    gradually: false
});
```
    
Default: `true`.

### image (string)

Background image path (sprite with frames to animate). Frames should be aligned
vertially, top to bottom.

```js
$('#tape').tape({
    image: '/img/tape.png'
});
```
    
Default: DOM element's backgound-image is used.

### frameCount (integer)

Number of frames in animation. It can be less than real number of frames,
if you don't want to use the whole tape, but it can't be greater than there
actually is.

```js
$('#tape').tape({
    frameCount: 12
});
```
    
Default: `0` (that is no animation by default).

### frameHeight (integer)

Frame height in pixels. In other words, background image offset for the second frame.

```js
$('#tape').tape({
    frameHeight: 250
});
```

Default: same as DOM element height.

### frameChangeDuration (integer)

Duration of transition between frames in milliseconds for `gradually` mode,
for normal mode - number of milliseconds each frame is vivible during animation.

If `gradually` is set to `true`, you might experience slowdowns in animations
when calling widget methods more frequently than `frameChangeDuration` as transitions
will take the same amount of time.

```js
$('#tape').tape({
    frameChangeDuration: 30
});
```
    
Default: `50`.

### backgroundX (integer)

Beackground horizontal offset (by x axis). Useful when you have several
sprites joined together in one background image. In this case animations start
from the top frame and continue to bottom (offset specifies correct sprite).

```js
$('#tape').tape({
    backgroundX: -150
});
```
    
Default: `0`.

### preload (boolean)

Предзагрузка изображения со спрайтом и отображение анимаций только после этого
события. После загрузки возбуждается событие `tape-loaded` на элементе.

```js
$('#tape').tape({
    preload: false
});
```
    
Default: `true`.

## Options via data-attributes

Options can be set up using corresponding `data-` attributes:

**Option**          | **Data attribute**         |
--------------------|----------------------------|
gradually           | data-gradually             |
image               | data-image                 |
frameCount          | data-frame-count           |
frameHeight         | data-frame-height          |
frameChangeDuration | data-frame-change-duration |
preload             | data-preload               |

```html
<div id="b-tape" data-frame-count="20" data-frame-height="150"></div>
```


## Methods


### .windToNext()

Прокрутка к следующему кадру спрайта. Если до вызова отображался последний кадр, то будет показан первый.

```js
$('#tape').tape('windToNext');
```

### .windToNext()

Прокрутка к предыдущему кадру спрайта. Если до вызова отображался первый кадр, то будет показан последний.

```js
$('#tape').tape('windToPrev');
```

`windTo` — перемещение к заданной позиции, минуя промежуточные кадры, параметры:

* `position` — позиция;
* `isRelative` — способ указания кадра относительно всей ленты (isRelative == true) и
целочисленный position для указания конкретного кадра;

`stepInTo` — прокрутка к заданной позиции путём поступательного перемещения по кадрам, параметры:

* `position` — позиция;
* `isRelative` — аналогично `windTo`;
* `callback` — обратный вызов после всех анимаций в рамках прокрутки;

`setPosition` — установка позиции без анимаций, параметры:

* `position` — позиция;

`setOptions` — изменение настроек «на лету», параметры:

* `options` — объект настроек.

`getOption` — получение значения настройки, параметры:

* `optionName` — название настройки.


### Behaviors

`rotate` — перемещение плёнки назад-вперёд при помощи мыши. Используется для имитации вращения.
Принимает один параметр — объект с настройками:

* `element` — $-элемент, на котором будет активизировано управление мышью. По умолчанию — сама плёнка.
* `deltaX` — смещение курсора мыши, воспринимаемое как минимальный шаг для начала вращения.
Чем больше, тем медленнее вращается плёнка.
* `destroy` — true, усли нужно отвязать поведение от элемента.
* `direction` — направление движения плёнки при движении курсора мыши вправо: 1 для движения
вниз и -1 для движения вверх.

