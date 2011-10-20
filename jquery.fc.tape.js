/**
 * Sprite animation widget
 * @version 0.1
 */
$.widget('fc.tape', {
    /**
     * Settings
     */
    options: {
        gradually: null,
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
    nextFrame: $('<div style="position: absolute; top: 0; left: 0; display: none; width: 100%; height: 100%"/>'),

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
    _init: function(options){
        this._initOptionFromData('frameCount', 'frame-count', 0, parseInt);
        this._initOptionFromData('frameChangeDuration', 'frame-change-duration', 50, parseInt);
        this._initOptionFromData('gradually', 'gradually', true);
        this._initOptionFromData('frameHeight', 'frame-height', 0, parseInt);
        this._initOptionFromData('image', 'image', false);
        this._initOptionFromData('preload', 'preload', true);

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

        var background = 'url(' + this.options.image + ') no-repeat';
        if (this.options.gradually) {
            this.nextFrame
                .css('background', background)
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
    _initOptionFromData: function(optionName, dataOptionName, defaultValue, filterFunction) {
        if (this.options[optionName] === null) {
            var value = this.element.data(dataOptionName);
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
     * @param boolean inRelative If isRelative is true, position is part of frames length (<1)
     *
     *
     */
    windTo: function(position, isRelative) {
        this.position = this._calculatePosition(position, isRelative);
        this._changeFrame();
    },

    /**
     * Animate sprite to specific frame
     *
     * @param integer/float position Frame number
     * @param boolean inRelative If isRelative is true, position is part of frames length (<1)
     * @param function callback
     *
     */
    stepInTo: function(position, isRelative, callback) {
        var targetPosition = this._calculatePosition(position, isRelative);
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
        if (this.options.gradually) {
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
                if (that.position == targetPosition) {
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
        if (!this.isLoaded) {
            return;
        }

        if (position < 0) {
            this.position = 0;
        } else {
            if (position < this.options.frameCount) {
                this.position = position;
            } else {
                this.position = this.options.frameCount;
            }
        }
        var nextFrameBackgroundPosition = this.options.backgroundX + 'px -' + (this.position * this.options.frameHeight) + 'px';
        this.element.css('backgroundPosition', nextFrameBackgroundPosition);
    },

    /**
     * Get int framenumber
     *
     * @param integer/float position Frame number
     * @param boolean inRelative If isRelative is true, position is part of frames length (<1)
     * @return integer
     */
    _calculatePosition: function(position, isRelative) {
        if (isRelative) {
            return Math.floor(this.options.frameCount * position)
        } else {
            return (position >= this.options.frameCount) ? 0 : position;
        }
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
        if (this.options.gradually) {
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
            this.element
                .css('backgroundPosition', nextFrameBackgroundPosition);
            if (typeof callback == 'function') {
                callback();
            }
        }
    }
});
