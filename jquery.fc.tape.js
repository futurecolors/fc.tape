/**
 * Виджет анимированного спрайта
 * @version 0.1
 */
$.widget('fc.tape', {
    /**
     * Настройки
     */
    options: {
        gradually: null,
        image: null,
        frameCount: null,
        frameHeight: null,
        frameChangeDuration: null,
        backgroundX: 0
    },

    /**
     * Элемент, который воплощает следующий кадр, который фейдится для ровности анимации
     */
    nextFrame: $('<div style="position: absolute; top: 0; left: 0; display: none; width: 100%; height: 100%"/>'),

    /**
     * Текущая позиция (номер кадра)
     */
    position: 0,

    /**
     * Инициализация виджета
     */
    _init: function(options){
        this._initOptionFromData('frameCount', 'frame-count', 0, parseInt);
        this._initOptionFromData('frameChangeDuration', 'frame-change-duration', 50, parseInt);
        this._initOptionFromData('gradually', 'gradually', true);
        this._initOptionFromData('frameHeight', 'frame-height', 0, parseInt);
        this._initOptionFromData('image', 'image', false);


        if (!this.options.image) {
            this.options.image = this.element.css('backgroundImage');
        }
        if (this.element.css('backgroundImage') == 'none') {
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
     * Изменение настроек «на лету»
     */
    setOptions: function(options) {
        $.extend(this.options, options);
    },

    /**
     * Инициализация опции из data-атрибута
     */
    _initOptionFromData: function(optionName, dataOptioName, defaultValue, filterFunction) {
        if (this.options[optionName] === null) {
            var value = this.element.data(dataOptioName);
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
     * Прокрутка к следующему кадру
     */
    windToNext: function(){
        this.position++;
        if (this.position >= this.options.frameCount) {
            this.position = 0;
        }
        this._changeFrame();
    },

    /**
     * Прокрутка к предыдущему кадру
     */
    windToPrev: function(){
        this.position--;
        if (this.position < 0) {
            this.position = this.options.frameCount - 1;
        }
        this._changeFrame();
    },

    /**
     * Прокрутка к заданной позиции
     *
     * @param integer/float position Позиция
     * @param boolean inRelative Указание кадра относительно всей ленты
     *                           (isRelative == true) и целочисленный position
     *                           для указания конкретного кадра
     */
    windTo: function(position, isRelative) {
        this.position = this._calculatePosition(position, isRelative);
        this._changeFrame();
    },

    /**
     * Прокрутка к заданной позиции путём поступательного перемещения по кадрам
     *
     * @param integer/float position Позиция
     * @param boolean inRelative Указание кадра относительно всей ленты
     *                           (isRelative == true) и целочисленный position
     *                           для указания конкретного кадра
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
                return;
            }
        }
        if (this.options.gradually) {
            for (; (targetPosition - this.position) * positionStep >= 0; this.position += positionStep) {

                if (targetPosition == this.position && typeof callback == 'function') {
                    // Для последнего кадра задаём callback
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
     * Установка позиции без анимаций
     */
    setPosition: function(position){
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
     * Вычислние позиции
     *
     * @param integer/float position Позиция
     * @param boolean inRelative Указание кадра относительно всей ленты
     *                           (isRelative == true) и целочисленный position
     *                           для указания конкретного кадра
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
     * Смена кадра
     */
    _changeFrame: function(callback) {
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
