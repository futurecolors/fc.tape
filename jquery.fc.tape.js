/**
 * Sprite animation widget
 * http://futurecolors.github.com/fc.tape/
 *
 * @version     0.2
 * @author      Artem Golikov, Future Colors <art@futurecolors.ru>
 *
 * @requires    jQuery, jQuery UI (core and widget)
 */
$.widget('fc.tape', {
    /**
     * Settings
     */
    options: {
        smooth: null,
        image: null,
        frameCount: null,
        frameHeight: null,
        frameChangeDuration: null,
        backgroundX: 0,
        preload: true
    },

    /**
     * Dom element, holding next frame, needed for animation smoothness
     */
    nextFrame: null,

    /**
     * Html for next frame, needed for animation smoothness
     */
    nextFrameHtml: '<div style="position: absolute; top: 0; left: 0; display: none; width: 100%; height: 100%"/>',

    /**
     * Current frame number
     */
    position: 0,

    /**
     * Current frame number
     */
    isLoaded: false,

    /**
     * Widget initialization
     */
    _init: function(){
        this._initOptionFromData('frameCount', 0, parseInt);
        this._initOptionFromData('frameChangeDuration', 50, parseInt);
        this._initOptionFromData('smooth', true);
        this._initOptionFromData('frameHeight', 0, parseInt);
        this._initOptionFromData('image', false);
        this._initOptionFromData('preload', true);

        this._preload();
        if (!this.options.image) {
            this.options.image = this.element.css('backgroundImage');
        } else {
            this.options.image = 'url("' + this.options.image + '")';
        }
        if (this.element.css('backgroundImage') == 'none' && this.isLoaded) {
            this.element.css('background', 'url(' + this.options.image + ') ' +
                this.options.backgroundX + 'px 0px no-repeat');
        }

        if (this.element.css('position') == 'static') {
            this.element.css('position', 'relative');
        }

        if (this.options.smooth) {
            this.nextFrame = $(this.nextFrameHtml)
                .css('backgroundImage', this.options.image)
                .appendTo(this.element);
        }

        if (!this.options.frameHeight) {
            this.options.frameHeight = this.element.height();
        }
    },

    /**
     * Preload image
     */
    _preload: function(){
        if (!this.options.preload) {
            this.isLoaded = true;
        } else {
            // Preload image
            var that = this;
            var imageSrcMatch = /url\((.+?)\)/g.exec(this.options.image);
            var imageSrc = imageSrcMatch ? imageSrcMatch[1] : this.options.image;

            var $preloader = $('<img src=' + imageSrc + ' />').load(function(){
                that.isLoaded = true;
                that.element
                    .css('background', that.options.image + ' ' + that.options.backgroundX + 'px 0px no-repeat')
                    .trigger('tape-loaded');
            });

            $preloader
                .appendTo('<div style="display: none"></div>')
                .parent()
                .appendTo('body');
        }
    },

    /**
     * Set options on the fly
     */
    setOptions: function(options) {
        $.extend(this.options, options);
    },

    /**
     * Get option value
     */
    getOption: function(optionName) {
        return this.options[optionName];
    },

    /**
     * Initialize widget from html data-* attributes
     */
    _initOptionFromData: function(optionName, defaultValue, filterFunction) {
        if (this.options[optionName] === null) {
            var value = this.element.data(optionName);

            if (typeof value == 'boolean') {
                this.options[optionName] = value;
            } else {
                if (value) {
                    var filtredValue = filterFunction ? filterFunction(value) : value;
                    this.options[optionName] = filtredValue || defaultValue;
                } else {
                    this.options[optionName] = defaultValue;
                }
            }
        }
    },

    /**
     * Show next animation frame
     */
    windToNext: function(){
        this.position++;
        if (this.position >= this.options.frameCount) {
            this.position = 0;
        }
        this._changeFrame();
    },

    /**
     * Show previous animation frame
     */
    windToPrev: function(){
        this.position--;
        if (this.position < 0) {
            this.position = this.options.frameCount - 1;
        }
        this._changeFrame();
    },

    /**
     * Skip animation frames and show specific frame instantly
     *
     * @param integer/float position Frame number
     */
    windTo: function(position) {
        this.position = this._calculatePosition(position);
        this._changeFrame();
    },

    /**
     * Animate sprite to specific frame
     *
     * @param integer/float position Frame number
     * @param function callback
     */
    stepInTo: function(position, callback) {
        var targetPosition = this._calculatePosition(position);
        var positionStep;
        if (targetPosition > this.position) {
            positionStep = 1;
        } else {
            if (targetPosition < this.position) {
                positionStep = -1;
            } else {
                if (typeof callback == 'function') {
                    callback();
                }
                return;
            }
        }
        if (this.options.smooth) {
            for (; (targetPosition - this.position) * positionStep >= 0; this.position += positionStep) {

                if (targetPosition == this.position && typeof callback == 'function') {
                    // callback is triggered after last frame is reached
                    this._changeFrame(callback);
                } else {
                    this._changeFrame();
                }
            }
        } else {
            var that = this;
            var timeout;
            timeout = window.setInterval(function(){
                that.position += positionStep;
                that._changeFrame();
                if (that.position * positionStep >= targetPosition * positionStep) {
                    clearTimeout(timeout);
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            }, this.options.frameChangeDuration);
        }
    },

    /**
     * Set frame with no animation
     */
    setPosition: function(position){
        var nextFrameBackgroundPosition;

        if (!this.isLoaded) {
            return;
        }

        this.position = this._calculatePosition(position);
        nextFrameBackgroundPosition = this.options.backgroundX + 'px -' + (this.position * this.options.frameHeight) + 'px';
        this.element.css('backgroundPosition', nextFrameBackgroundPosition);
        this.element.css('backgroundImage', this.options.image);
    },

    /**
     * Apply rotation behavior
     *
     * @param object/string options Options for rotation
     */
    rotate: function(options){
        options = $.extend({
            element: this.element,
            deltaX: 1,
            destroy: false,
            direction: 1
        }, options);

        if (options.destroy) {
            options.element.unbind('.rotate');
            return;
        }

        var clientX = 0;
        var isActive = false;
        var that = this;
        var initialSmooth = this.options.smooth;

        options.element
            .bind('mousedown.rotate', function(){
            isActive = true;
            that.options.smooth = false;
        })
            .bind('mouseup.rotate mouseleave.rotate', function(){
                isActive = false;
                that.options.smooth = initialSmooth;
            })
            .bind('mousemove.rotate', function(e){
                if (isActive && that.isLoaded) {
                    if (e.clientX > clientX + options.deltaX) {
                        if (options.direction > 0) {
                            that.windToNext();
                        } else {
                            that.windToPrev();
                        }
                        clientX = e.clientX;
                    }
                    if (e.clientX < clientX - options.deltaX) {
                        if (options.direction > 0) {
                            that.windToPrev();
                        } else {
                            that.windToNext();
                        }
                        clientX = e.clientX;
                    }
                }
            });
    },

    /**
     * Get int framenumber
     *
     * @param integer/float position Frame number
     * @return integer
     */
    _calculatePosition: function(position) {
        var type = $.type(position),
            putInBorders = function(value, bottom, top){
                if (value > top) {
                    return top;
                } else {
                    return (value < bottom) ?  bottom : value;
                }
            },
            percentMatch,
            integerValue;


        switch (type) {
            case 'number':
                integerValue = position;
                break;
            case 'string':
                percentMatch = /(\d+)%/.exec(position);
                if (!percentMatch) {
                    throw 'Value ' + position + ' must be in "x%" format';
                }
                integerValue = Math.floor(this.options.frameCount * parseInt(percentMatch[1]) / 100);
                break;
            default:
                throw 'Type of position in incorrect (' + type + ')';
        }

        return putInBorders(integerValue, 0, this.options.frameCount - 1);
    },

    /**
     * Change frame
     *
     * @param callback
     */
    _changeFrame: function(callback) {
        if (!this.isLoaded) {
            return;
        }

        var nextFrameBackgroundPosition = this.options.backgroundX + 'px -' + (this.position * this.options.frameHeight) + 'px';
        if (this.options.smooth) {
            var $element = this.element;
            var $nextFrame = this.nextFrame;
            var duration = this.options.frameChangeDuration;
            $element.queue(function(next){
                $nextFrame
                    .css('backgroundPosition', nextFrameBackgroundPosition)
                    .fadeIn(duration, 'linear', function(){
                        $element.css('backgroundPosition', nextFrameBackgroundPosition);
                        $(this).hide();
                        next();
                        if (typeof callback == 'function') {
                            callback();
                        }
                    });
            });
        } else {
            this.element.css('backgroundPosition', nextFrameBackgroundPosition);
            if (typeof callback == 'function') {
                callback();
            }
        }
    }
});
