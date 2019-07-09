(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require("@tarojs/taro-alipay"), require('other')) : typeof define === 'function' && define.amd ? define(["@tarojs/taro-alipay", 'other'], factory) : (global = global || self, global.demo = factory(global.Taro, global.other));
})(this, function (Taro, other) {});
