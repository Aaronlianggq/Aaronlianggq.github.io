(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.hybrid = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var DFWInteral = {
    dfwToNativeWith: function dfwToNativeWith(methodName, params, callback) {
      var p = {};

      if (params) {
        p = params;
      }

      var userAgent = navigator.userAgent;
      var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
      var isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var nativeParams = {
        'methodName': methodName ? methodName : '',
        'params': p
      };

      if (callback) {
        var callbackTag = methodName + '_' + this.uuidTag();
        nativeParams.callbackTag = callbackTag;
        window.__dfwApp[nativeParams.callbackTag] = callback;
      }

      if (isIOS) {
        window.webkit.messageHandlers.DFWWebKitHander.postMessage(nativeParams);
      } else if (isAndroid && window.android) {
        window.android.dispatchMethod(methodName, JSON.stringify(nativeParams), 'dfwNativeCallback');
      } else {
        dfwNativeCallback(nativeParams);
      }
    },
    uuidTag: function uuidTag() {
      return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }; //【重要】 dfwNativeCallback，native回调js方法，不能删除

  window.dfwNativeCallback = function (callbackData) {
    if (!callbackData) {
      return;
    }

    var typeStr = _typeof(callbackData).toLowerCase();

    var respData = callbackData;

    if (typeStr === 'string') {
      respData = JSON.parse(callbackData);
    }

    var callbackTag = respData.callbackTag;

    if (callbackTag && window.__dfwApp[callbackTag]) {
      var callbackFunc = window.__dfwApp[callbackTag];
      delete respData.callbackTag;
      typeof callbackFunc == 'function' && callbackFunc(respData);
      window.__dfwApp[callbackTag] = null;
      delete window.__dfwApp[callbackTag];
    }
  };

  var DFWShare = {
    /**
    @desc     调用分享功能
    @method   appShare
    @param    params 类型{Object} 需要js传的参数
    @param    callback 类型{Function}
     params = {
      'shareUrl'  : 'xxxx',            //分享地址    （必填）
      'imgUrl'    : 'xxxx',            //缩略图地址  （必填）
      'title'     : 'xxxx',            //分享的标题  （必填）
      'content'   : 'xxxx',            //分享内容   （必填）
    }
     callback = function(respData){
      respData = {
        code: '102' //状态码
      }
    }
    */
    appShare: function appShare(params, callback) {
      DFWInteral.dfwToNativeWith('share', params, callback);
    }
  };

  var DFWPhoto = {
    /**
    @desc     只调用native拍照功能
    @method   appTakePhotoOnly
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
          picUrl: 'https:xxx' //图片地址
        }
      }
    }
    */
    appTakePhotoOnly: function appTakePhotoOnly(callback) {
      DFWInteral.dfwToNativeWith('takePhotoOnly', null, callback);
    },

    /**
    @desc     选择并上传图片
    @method   appTakePhotoOnly
    @param    params 类型{Object} 需要js传的参数
    @param    callback 类型{Function}
     params = {
      'num' : '4', 最大选择图片数量 不填默认最多9张 （选填）
    }
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
          [{
            'imgUrl':'https:xxx' //图片地址
          }],
          [{
            'imgUrl':'https:xxx' //图片地址
          }],
          .....
        }
      }
    }
     */
    appChoosePic: function appChoosePic(params, callback) {
      DFWInteral.dfwToNativeWith('choosePic', params, callback);
    },

    /**
    @desc     浏览照片
    @method   appBrowsePictures
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
          picturesUrl: ['https:xxx' //图片地址,'https:xxx' //图片地址]
        }
      }
    }
    */
    appBrowsePictures: function appBrowsePictures(params, callback) {
      DFWInteral.dfwToNativeWith('browsePictures', params, callback);
    }
  };

  var DFWFile = {
    /**
    @desc     清除缓存
    @method   appClearCache
    */
    appClearCache: function appClearCache(callback) {
      DFWInteral.dfwToNativeWith('clearCache', null, callback);
    }
  };

  var DFWUtils = {
    /**
    @desc     从新的webview打开页面功能
    @method   appOpenNewWeb
    @param    params 类型{Object}
     param = {
      url : 'https:xxxx'  //新打开页面 （必填）
      height: '100'   //新页面展示的高度，0为全屏展示  默认0
    }
    */
    appOpenNewWeb: function appOpenNewWeb(params) {
      DFWInteral.dfwToNativeWith('openNewWeb', params, null);
    },

    /**
    @desc     唤起app页面
    @method   appShowPage
    @param    params 类型{Object}
    @param    callback 类型{Function}
     param = {
      pageName : ''  //页面名称  必填
      pageData: {       //参数  可填
       }
    }
    pageName可选值
    'user'  //个人中心页
      callback = function(respData){
      respData = {
        code: '102',             //状态码
        data: {
         }
      }
    }
    */
    appShowPage: function appShowPage(params, callback) {
      DFWInteral.dfwToNativeWith('showPage', params, callback);
    },

    /**
    @desc     关闭当前页面
    @method   appFinish
    */
    appFinish: function appFinish() {
      DFWInteral.dfwToNativeWith('finish', null, null);
    },

    /**
    @desc     修改页面title
    @method   appSetPageTitle
    @param    params 类型{Object}
     params = {
      title: 'xxx'   //title字符串   (必填)
    }
    */
    appSetPageTitle: function appSetPageTitle(params) {
      DFWInteral.dfwToNativeWith('setPageTitle', params, null);
    },

    /**
    @desc     唤起第三方应用
    @method   appOpenThirdPkg
    @param    params 类型{Object}
    @param    callback 类型{Function}
     params = {
      'type'     : 'xxxx',       //“url”为链接打开 “pkgName”为包名打开，如 csd://pull.csd.demo/cyn?type=110    （必填）
      'openKey' : 'xxxx',       //包名或url      （必填）
      'params'  : {Object}      //参数集合，如params:{“account”:”li123”,”pwd”:”123456”}    （选填）
    }
     callback = function(respData){
      respData = {
        code: '102'             //状态码
      }
    }
    */
    appOpenThirdPkg: function appOpenThirdPkg(params, callback) {
      DFWInteral.dfwToNativeWith('openThirdPkg', params, callback);
    }
  };

  var DFWLocation = {
    /**
    @desc     获取gps定位位置
    @method   appGetGpsLoc
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
             double   latitude,//维度
             double   longitude,//经度
             String   province,//省
             String   city,//城市
             String   cityCode,//城市代码
             String   address,//详细地址
             String   country,//国家
             String   poiName,//位置名称
             String   street,//街道
             int      errorCode,//错误码
             String   errorInfo,//错误信息
        }
      }
    }
     */
    appGetGpsLoc: function appGetGpsLoc(callback) {
      DFWInteral.dfwToNativeWith('getGpsLoc', null, callback);
    }
  };

  var DFWDevice = {
    /**
    @desc     获取gps定位位置
    @method   appGetDeviceInfo
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
          String   model;//手机型号
          String   manufacturer; //制造商
          String   imei;//国际移动设备识别码
          String   macAddress;//mac地址
          String   SDKVersionName;    //系统版本名
          int      SDKVersionCode;//系统版本码
        }
      }
    }
    */
    appGetDeviceInfo: function appGetDeviceInfo(callback) {
      DFWInteral.dfwToNativeWith('getDeviceInfo', null, callback);
    },

    /**
    @desc     获取当前wifi的名称
    @method   appGetWifiInfo
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
           boolean    isWifi,//是否是wifi
           boolean    wifiEnabled,//判断 wifi 是否打开
           boolean    wifiConnected, //wifi 是否连接状
           boolean    wifiAvailable,//wifi 数据是否可用
           String     ipAddressByWifi,//获取网络 IP 地址
           String     gatewayByWifi, //获取网关 IP 地址
        }
      }
    }
    */
    appGetWifiInfo: function appGetWifiInfo(callback) {
      DFWInteral.dfwToNativeWith('getWifiInfo', null, callback);
    }
  };

  var DFWApp = {
    /**
    @desc     获取app信息
    @method   getAppInfo
    @param    callback 类型{Function}
     callback = function(respData){
      respData = {
        code: '102', //状态码
        data:{
          String appVersionName,          //app版本名
          String appVersionCode,             //app版本号
        }
      }
    }
    */
    appGetAppInfo: function appGetAppInfo(callback) {
      DFWInteral.dfwToNativeWith('getAppInfo', null, callback);
    }
  };

  function dfwapp() {
    // 判断是否注入
    var __isDFWNativeLoaded = false;

    if (!__isDFWNativeLoaded || !window.dfwApp) {
      window.__dfwApp = {};
      __isDFWNativeLoaded = true;
      window.dfwAppclass = window.dfwAppclass || {};
      window.dfwAppclass.DFWShare = DFWShare; // 分享

      window.dfwAppclass.DFWPhoto = DFWPhoto; // 图片

      window.dfwAppclass.DFWFile = DFWFile; // 文件

      window.dfwAppclass.DFWUtils = DFWUtils; // 工具

      window.dfwAppclass.DFWDevice = DFWDevice;
      window.dfwAppclass.DFWLocation = DFWLocation;
      window.dfwAppclass.DFWInteral = DFWInteral;
      window.dfwAppclass.DFWApp = DFWApp;
    }
  }

  dfwapp();

  return dfwapp;

})));
