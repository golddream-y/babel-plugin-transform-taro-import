/*
 *  Author:  Erwin
 *  Create time: 19-7-6
 *  Description: babel-plugin-transform-taro-import  demo config
 */
module.exports = function (api) {
    // demo的量级不需要缓存
    api.cache(false);

    /**
     * 获取当前编译平台
     */
    const getCurrentCompilePile = function () {
        return process.env.npm_lifecycle_event ? process.env.npm_lifecycle_event.replace('demo:', '') : null;
    };

    const plugins = [
        [
            "babel-plugin-transform-taro-import",
            {
                "pileName": getCurrentCompilePile()
            }
        ]
    ];

    return {
        plugins
    };
};
