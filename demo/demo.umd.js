(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tarojs/taro'), require('other')) :
        typeof define === 'function' && define.amd ? define(['@tarojs/taro', 'other'], factory) :
            (global = global || self, global.demo = factory(global.Taro, global.other));
}(this, function (Taro, other) {}));
