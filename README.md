# fc.tape widget

jQuery widget  for sprite animations. Background image (sprite) consisting of picture frames
like the movie tape is animated. Widget supports options to adjust smothness and speed of animations
as well as methods to control animation behavior.


## Installation

`fc.tape` has following dependencies:

* [jQuery](http://jquery.com/) (1.6+) and
* [jQuery UI](http://jqueryui.com/) (1.8+, Core and Widget)


## Usage

```js
$('#element').tape(options);
```


## Options


### smooth (boolean)

Switch frames with smooth transition (next frame overlays previous with a small
transparent fade). Useful for animations with a small number of frames,
slow speed animations and for several effects.

```js
$('#tape').tape({
    smooth: false
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

Duration of transition between frames in milliseconds for `smooth` mode,
for normal mode - number of milliseconds each frame is visible during animation.

If `smooth` is set to `true`, you might experience slowdowns in animations
when calling widget methods more frequently than `frameChangeDuration` as transitions
will take the same amount of time.

```js
$('#tape').tape({
    frameChangeDuration: 30
});
```
    
Default: `50`.

### backgroundX (integer)

Background horizontal offset (by x axis). Useful when you have several
sprites joined together in one background image. In this case animations start
from the top frame and continue to bottom (offset specifies correct sprite).

```js
$('#tape').tape({
    backgroundX: -150
});
```
    
Default: `0`.

### preload (boolean)

Background image with a sprite is preloaded and animation starts only after it
finished. After loading `tape-loaded` event is triggered on the element.

```js
$('#tape').tape({
    preload: false
});
```
    
Default: `true`.

### loop (boolean)

Loop animation, when sprite goes out of its borders.

```js
$('#tape').tape({
    loop: false
});
```

Default: `true`.


## Options via data-attributes

Options can be set up using corresponding `data-` attributes:

**Option**          | **Data attribute**         |
--------------------|----------------------------|
smooth              | data-smooth                |
image               | data-image                 |
frameCount          | data-frame-count           |
frameHeight         | data-frame-height          |
frameChangeDuration | data-frame-change-duration |
preload             | data-preload               |
loop                | data-loop                  |

```html
<div id="b-tape" data-frame-count="20" data-frame-height="150"></div>
```


## Methods


### windToNext

Wind sprite to the next frame. If current frame is the last one and `loop` option is `true`,
the first fame is displayed.

```js
$('#tape').tape('windToNext');
```

### windToPrev

Wind sprite to the previous frame. If current frame is the first one and `loop` option is `true`,
the last fame is displayed.

```js
$('#tape').tape('windToPrev');
```

### windTo

Wind to specific frame, skipping intermediate frames. If `smooth` is
set to `true` this transitions takes `frameChangeDuration` milliseconds.

```js
$('#tape').tape('windTo', 4);
$('#tape').tape('windTo', '30%');
```

Parameters:

* position — target frame index (to which tape is animated) or position as a percentage of the
length of the tape (string).


### stepInTo

Animate the tape from the current frame to the target one, not skipping frames, opposite
to what `WindTo` does. Each transition between frames takes `frameChangeDuration` milliseconds.

```js
$('#tape').tape('stepInTo', 36, function(){
    console.log('Animation is finished');
});
```

Parameters:

* position — target frame index (to which tape is animated) or position as a percentage of the
length of the tape (string).
* callback — callback, which is fired after reaching target frame. It's called after all animations
within the bounds of this method are done.

### setPosition

Change current frame without any animation at all. Useful for widget initialization,
when your animation shouldn't start from the very first frame.

```js
$('#tape').tape('setPosition', 14);
```

Parameters:

* position — target frame index (to which tape is animated) or position as a percentage of the
length of the tape (string).

### setOptions

This method supports options change "on the fly".

```js
$('#tape').tape('setOptions', {
    frameCount: 37
    frameChangeDuration: 70
});
```

Parameters:

* options — settings object.

### getOption

Get current settings value.

```js
var height = $('#tape').tape('getOption', 'frameHeight');
```

Parameters:

* optionName — option name.


## Behaviors


### rotate

Animate the tape backwards and forwards with the left mouse button pressed and the
mouse cursor is moving. It's used to emulate rotation.

```js
$('#tape').tape('rotate', {
    element: $('#handler'),
    deltaX: 3
});
// ...
$('#tape').tape('rotate', {
    destroy: true
});
```

Parameters:

* options — settings object:
    * element — jQuery-element, which will acquire rotation behavior. By default, it's the original
tape element.
    * deltaX — minimal cursor movement, required for animation to start. Larger `deltaX`, slower the tape rotation.
    * destroy — set to `true` when you need to disable rotation behavior.
    * direction — the directon of tape movement when the mouse cursor moves right:
1 for down, -1 for up.
