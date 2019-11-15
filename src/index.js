/*
 *  Author:  Erwin
 *  Create time: 19-7-5
 *  Description: babel plugin for Taro import
 */
"use strict";

exports.default = function({ types: t }) {
  const isAMD = parentPath => {
    if (parentPath.parent.hasOwnProperty("callee"))
      return (
        t.isArrayExpression(parentPath.node) &&
        parentPath.parent.callee.name === "define"
      );
    else return false;
  };

  const isCJS = ({ node }) => {
    if (node.hasOwnProperty("callee"))
      return t.isCallExpression(node) && node.callee.name === "require";
    else return false;
  };

  const pkgNameTaros = [
    "@tarojs/taro",
    "@tarojs/taro-h5",
    "@tarojs/taro-weapp",
    "@tarojs/taro-swan",
    "@tarojs/taro-alipay",
    "@tarojs/taro-tt"
  ];

  /**
   * 根据NPM命令获取导入名称
   * @param compilePile
   */
  const getImportName = compilePile => {
    if (compilePile) {
      switch (compilePile) {
        case "h5":
          return pkgNameTaros[1];
        case "weapp":
          return pkgNameTaros[2];
        case "swan":
          return pkgNameTaros[3];
        case "alipay":
          return pkgNameTaros[4];
        case "tt":
          return pkgNameTaros[5];
        default:
          const err = new Error("请配置要转换的平台。");
          console.error(err.message);
      }
    } else {
      const err = new Error("获取编译平台失败。");
      console.error(err.message);
    }
  };

  return {
    visitor: {
      // UMD format
      StringLiteral(path, { opts }) {
        if (pkgNameTaros.indexOf(path.node.value) !== -1) {
          // commonjs require引用：判断是否为函数调用，且调用者名为“require”
          if (isCJS(path.parentPath)) {
            path.node.value = getImportName(opts.pileName);
          }

          // AMD define引用：判断是否为数组表达式，且调用者名为“define”
          if (isAMD(path.parentPath)) {
            path.node.value = getImportName(opts.pileName);
          }
        }
      },
      // ESM format
      ImportDeclaration(path, { opts }) {
        if (pkgNameTaros.indexOf(path.node.source.value) !== -1) {
          path.node.source.value = getImportName(opts.pileName);
        }
      }
    }
  };
};

module.exports = exports["default"];
