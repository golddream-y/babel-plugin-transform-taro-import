# babel-plugin-transform-taro-import

用于 Taro 工程编译前转换代码中对于“@tarojs/taro”的引用

### 为何使用？

当你有需求如下需求可能会使用：

- 准备对 Taro 进行外层的封装
- 你的库中引用了一些 Taro 的各个运行时 API 的实现

> 可以看出小程序和 Web 端上**组件标准**与 **API** 标准有很大差异，这些差异仅仅通过代码编译手段是无法抹平的，例如你不能直接在编译时将小程序的 `<view />` 直接编译成 `<div />`，因为他们虽然看上去有些类似，但是他们的组件属性有很大不同的，仅仅依靠代码编译，无法做到一致，同理，众多 `API` 也面临一样的情况。针对这样的情况，Taro 采用了定制一套运行时标准来抹平不同平台之间的差异。
>
> 这一套标准主要以三个部分组成，包括**标准运行时框架**、**标准基础组件库**、**标准端能力 API**，其中运行时框架和 API 对应 **@taro/taro**，组件库对应 **@tarojs/components**，通过在不同端实现这些标准，从而达到去差异化的目的。

如上（引自：[Taro 多端开发实现原理与项目实战](https://juejin.im/book/5b73a131f265da28065fb1cd)），Taro 有一部分的端能力 API 是通过编译时初始化到 Taro 的核心库上的。所以在编译前你的库引用的是“_@tarojs/taro_”,编译后（如果你的平台是微信小程序）引用的应该是是“_@tarojs/taro-weapp_”。但 Taro 目前编译工具并未对三方库对其核心包的引用做编译，所以我们如果自己的库引用了 Taro 的核心库且使用的一些运行时的 API，就需要该插件。

### 效果

#### `{ "pileName": "alipay" }`

```javascript
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tarojs/taro'), require('other')) : typeof define === 'function' && define.amd ? define(['@tarojs/taro', 'other'], factory) : (global = global || self, global.demo = factory(global.Taro, global.other));
})(this, function (Taro, other) {});

      ↓ ↓ ↓ ↓ ↓ ↓

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tarojs/taro-alipay'), require('other')) : typeof define === 'function' && define.amd ? define(['@tarojs/taro-alipay', 'other'], factory) : (global = global || self, global.demo = factory(global.Taro, global.other));
})(this, function (Taro, other) {});
```

### 使用

```bash
npm install babel-plugin-transform-taro-import --save-dev
```

编辑 `.babelrc`

```js
{
  "plugins": [["transform-taro-import", options]]
}
```

### options

`options` 是一个 object.

```javascript
{
  "pileName": "alipay",  // 或  h5 、weapp 、swan 、 tt等
}
```

For Example（babel@7+）:

```javascrit
// .babelrc
"plugins": [
  ["transform-taro-import", { "pileName": "alipay",}]
]
```

#### pileName

```
h5            ->         '@tarojs/taro-h5',
weapp   ->         '@tarojs/taro-weapp',
swan      ->         '@tarojs/taro-swan',
alipay    ->         '@tarojs/taro-alipay',
tt             ->         '@tarojs/taro-tt'
```

### 例子

详见工程下的 demo。

- `.babelrc`

  ```
  {
    "plugins": [
      [
        "babel-plugin-transform-taro-import",
        {
          "pileName": "alipay"
        }
      ]
    ]
  }
  ```

- `babel.config.js` （babel@7+）

  ```javascript
  module.exports = function(api) {
    // demo的量级不需要缓存
    api.cache(false);

    /**
     * 获取当前编译平台
     */
    const getCurrentCompilePile = function() {
      return process.env.npm_lifecycle_event
        ? process.env.npm_lifecycle_event.replace("demo:", "")
        : null;
    };

    const plugins = [
      [
        "babel-plugin-transform-taro-import",
        {
          pileName: getCurrentCompilePile()
        }
      ]
    ];

    return {
      plugins
    };
  };
  ```

### 计划

- 增加测试用例
- 增加 debug
- 增加代码构建
- ~~增加 ESM 文件的转换~~
