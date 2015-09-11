/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WEBOS 系统全局初始化对象
 */
Ext.define('WebOs.Init', {
   requires: [
      'Cntysoft.Kernel.SysEnv',
      'WebOs.Kernel.StdPath',
      'WebOs.Kernel.Const',
      'WebOs.Lang.zh_CN',
      'WebOs.Kernel.ProcessModel.ProcessManager',
      'WebOs.Utils',
      'WebOs.Kernel.StdHandler',
      //桌面小组件
      'WebOs.DesktopWidget.WallPaper.Main'
   ],
   mixins: {
      observable: 'Ext.util.Observable'
   },
   /**
    * 系统准备初始化，加载文件
    *
    * @property {number} SYS_INIT
    */
   SYS_INIT: 1,
   /**
    * 系统验证完成，进入桌面环境
    *
    * @property {number} SYS_AUTH
    */
   SYS_AUTH: 2,
   /**
    * 进入桌面, 拉取用户信息
    *
    *  @property {number} SYS_RETRIEVE_USER_INFO
    */
   SYS_RETRIEVE_USER_INFO: 3,
   /**
    * @property {number} SYS_RENDER_WEBOS
    */
   SYS_RENDER_WEBOS: 4,
   /**
    * 系统初始化完成
    *
    * @property {number} SYS_READY
    */
   SYS_READY: 5,
   /**
    * 系统进程管理器
    *
    * @property {WebOs.Kernel.ProcessModel.ProcessManager} processManager
    */
   processManager: null,
   /**
    * 系统是否已经就绪 , 一些地方可能需要判断一下
    * 在系统桌面就绪的时候值被系统设置成
    *
    * @property {boolean} sysReady
    */
   sysReady: false,
   /**
    * 系统环境变量
    *
    * @property {Cntysoft.Kernel.SysEnv} sysEnv
    */
   sysEnv: null,
   /**
    * 系统标准处理器
    *
    * @property {WebOs.Kernel.StdHandler} stdHandler
    */
   stdHandler: null,
   /**
    * 生产环境根路径
    */
   basePath: window.systemProductionBasePath,
   //是否是生产环境
   isProduction: window.SYSTEM_IS_PRODUCTION,
   //在NotificationCenter构造函数中进行设置
   notificationCenter: null,
   /**
    * 这个属性到时候有专有的系统进行主动设置
    *
    * @property {String} selfDataPath
    */
   selfDataPath: null,
   constructor: function()
   {
      this.mixins.observable.constructor.call(this);
      //建立一个别名
      this.processManager = new WebOs.Kernel.ProcessModel.ProcessManager();
      //实例化系统环境变量
      this.sysEnv = new Cntysoft.Kernel.SysEnv();
      this.stdHandler = new WebOs.Kernel.StdHandler();
      this.openedWidgets = new Ext.util.HashMap();
      this.attachDefaultListeners();
      this.init();
   },
   init: function()
   {
      if (this.hasListeners.beforeinit) {
         this.fireEvent('beforeinit');
      }
      this.initGlobalRef();
      this.initLang();
      this.updateLoadMsg(this.SYS_INIT);
      //this.setupSysEventHandlers();
      this.initRunableReg();
      if (this.hasListeners.afterinit) {
         this.fireEvent('afterinit');
      }
   },
   /**
    * @template
    */
   initLang: function()
   {
      var cls = 'WebOs.Lang.' + this.language;
      var lang = Ext.create(cls);
      Cntysoft.LangManager.register('WebOs', lang);
      //内部使用
      WebOs.GET_LANG_TEXT = Ext.Function.alias(lang, 'getText');
   },
   initGlobalRef: function()
   {
      var alias = Ext.Function.alias;
      Ext.apply(WebOs, {
         PM: alias(this, 'getProcessManager'),
         getSysEnv: alias(this, 'getSysEnv'),
         isReady: alias(this, 'isReady'),
         showLoadScriptMask: alias(Cntysoft, 'showLoadScriptMask'),
         hideLoadScriptMask: alias(Cntysoft, 'hideLoadScriptMask'),
         getLangType: alias(this, 'getLangType'),
         ME: this,
         login: alias(this, 'login'),
         loginByCookie: alias(this, 'loginByCookie'),
         logout: alias(this, 'logout'),
         updateLoadMsg: alias(this, 'updateLoadMsg'),
         hideLoadMsg: alias(this, 'hideLoadMsg'),
         removeLoadMsg: alias(this, 'removeLoadMsg'),
         getSysUrl: alias(this, 'getSysUrl')
      });
   },
   /**
    * 获取系统起始的根路径
    *
    * @return {String}
    */
   getSelfDataRootPath: function()
   {
      return this.selfDataPath;
   },
   /**
    * 发送一条通知信息
    *
    * @param {String} title
    * @param {String} msg
    * @param {Boolean} emergency 是否紧急
    * @param {Object} meta
    */
   sendNotificationMsg: function(title, msg, emergency, meta)
   {
      var argLen = arguments.length;
      var msgType;
      emergency = !!emergency;
      if (4 == argLen) {
         msgType = WebOs.Kernel.Const.SYS_NOTIFICATION_MSG_CALLBACK;
         Cntysoft.Stdlib.Object.ensureRequireKeys(meta, ['module', 'name']);
      } else {
         msgType = WebOs.Kernel.Const.SYS_NOTIFICATION_MSG_TXT;
      }
      if (!this.sysReady) {
         this.addListener('desktopready', function() {
            this.sendNotificationMsg(title, msg, emergency, meta);
         }, this, {
            single: true
         });
         return;
      }
      this.notificationCenter.addRecord(title, msg, msgType, false, emergency, meta);
   },
   /**
    * @returns {WebOs.Kernel.StdHandler}
    */
   getStdHandler: function()
   {
      return this.stdHandler;
   },
   //几个钩子函数
   login: Ext.emptyFn,
   loginByCookie: Ext.emptyFn,
   /**
    * @param {String} location
    * @param {Boolean} isForce
    */
   logout: function(location, isForce)
   {
      if (isForce) {
         this.logoutHandler(location);
      } else {
         var MSG = Cntysoft.GET_LANG_TEXT('MSG.REBOOT_ASK');
         var userName = this.sysEnv.get(WebOs.Kernel.Const.ENV_CUR_USER).name;
         Cntysoft.showQuestionWindow(Ext.String.format(MSG, userName), function(value) {
            if ('yes' == value) {
               this.logoutHandler(location);
            }
         }, this);
      }
   },
   setupSysEventHandlers: function()
   {
      /**
       * 不知道为什么这个事件绑定不上
       */
      window.onbeforeunload = function() {
         return Cntysoft.LangManager.getLang('System').getText('MSG.SYS_RELOAD_INFO');
      };
   },
   /**
    * 初始化可运行对象注册表
    */
   initRunableReg: function()
   {
      var U = Cntysoft.Utils.Common;
      var keyFn = function(config) {
         return config.module + '.' + config.name;
      };
      //系统内置的一些程序
      this.sysEnv.set(
              WebOs.Const.ENV_APP,
              U.generateCollection(this.getBootstrapApps(), keyFn)
              );
      this.sysEnv.set(
              WebOs.Const.ENV_DAEMON,
              U.generateCollection(this.getBootstrapDeamons(), function(item) {
                 return item.name;
              })
              );
   },
   /**
    * 获取语言类型
    *
    * @return {String}
    */
   getLangType: function()
   {
      return this.language;
   },
   /**
    * @returns {Array}
    */
   getLangTypes: function()
   {
      return this.langTypes;
   },
   /**
    * 获取系统加载提示信息
    *
    * @private
    * @param {Number} stage
    * @return {String}
    */
   getLoadMsg: function(stage)
   {
      if (0 == stage) {
         //语言对象没有初始化
         return 'loading files';
      }
      var msg = this.GET_LANG_TEXT('SYS_LOADING_MSG');
      return msg[stage];
   },
   /**
    * 更新系统加载提示信息
    *
    * @private
    * @param {Number} stage
    */
   updateLoadMsg: function(stage)
   {
      var msg = this.getLoadMsg(stage) + '...';
      Ext.fly('loading-msg').update(msg);
   },
   /**
    * 删除系统引导过程中的loadMsg对象
    *
    * @private
    */
   removeLoadMsg: function()
   {
      Ext.fly('loading').remove();
      Ext.fly('loading-mask').remove();
   },
   /**
    * 隐藏loadMsg
    *
    * @private
    */
   hideLoadMsg: function()
   {
      Ext.fly('loading-mask').hide();
   },
   /**
    * 显示loadMask
    *
    * @private
    */
   showLoadMsg: function(msg)
   {
      Ext.fly('loading-mask').show();
   },
   /**
    * 获取系统引导过程中的守护进程
    *
    * @return String[]
    */
   getBootstrapDeamons: function()
   {
      return [{
            name: 'Init'
         }, {
            name: 'Kernel'
         }];
   },
   /**
    * 获取系统默认的APP列表
    */
   getBootstrapApps: function()
   {
      return [{
            name: 'Login',
            module: 'Sys',
            icon: false,
            hasServer: true,
            type: 'App',
            showWidgetMenu: false,
            showOnDesktop: false
         }, {
            name: 'SysUiRender',
            module: 'Sys',
            icon: false,
            hasServer: false,
            type: 'App',
            runConfig: {
               type: 3
            },
            showOnDesktop: false
         }];
   },
   getProcessManager: function()
   {
      return this.processManager;
   },
   run: function()
   {
      ////派发系统级别程序或者Daemon
      this.createInitRunable();
      if (this.hasListeners.run) {
         this.fireEvent('run', this);
      }
   },
   /**
    * 创建系统级别的默认的程序或者守护进程
    */
   createInitRunable: function()
   {
      //派发登录进程
      //系统进程通信相关的进程

      WebOs.PM().runDaemon({
         name: 'Init'
      });
   },
   /**
    * 获取环境变量对象
    *
    * @returns {Cntysoft.Kernel.SysEnv}
    */
   getSysEnv: function()
   {
      return this.sysEnv;
   },
   /**
    * 获取系统完成变量
    *
    * @returns {Boolean}
    */
   isReady: function()
   {
      return this.sysReady;
   },
   /**
    * 获取系统服务器url
    *
    * @return {string} url
    */
   getSysUrl: function()
   {
      var urlInfo = Cntysoft.Global.getDomainInfo();
      return urlInfo.domain;
   },
   /**
    * @returns {WebOs.Kernel.StdHandler}
    */
   getStdHandler : function()
   {
      return this.stdHandler;
   },
           /**
            * 添加一些默认的事件处理函数
            */
           attachDefaultListeners: function()
           {
              //对于程序加载提示符只需要在桌面准备好之后才可以用
              //所以在这里用事件保证
              this.addListener({
                 desktopready: {
                    fn: this.desktopReadyHandler,
                    scope: this
                 }
              });
           },
   /**
    * 进程一些桌面准备的好的事件处理函数
    */
   desktopReadyHandler: function()
   {
      this.hideLoadMsg();
      this.sysReady = true;
      this.selfDataPath = this.sysEnv.get(WebOs.Kernel.Const.ENV_SYS_SETTING).uploadRootPath;
   },
   /**
    * 获取指定APP的语言类的名称
    *
    * @param {String} module 模块名称
    * @param {String} name APP名称
    * @param {String} type 可运行的类型
    * @return {String}
    */
   getRunableLangCls: function(module, name, type)
   {
      if (type !== WebOs.Const.RUN_TYPE_APP && type !== WebOs.Const.RUN_TYPE_DAEMON) {
         Cntysoft.raiseError(Ext.getClassName(this), 'getAppLangCls', 'runable type : ' + type + ' is not supported');
      }
      return [type, module, name, 'Lang', WebOs.getLangType()].join('.');
   },
   /**
    * @param {WebOs.OsWidget.TopStatusBar} topStatusBar
    */
   startBtnRequestHandler: function(topStatusBar)
   {
   },
   /**
    * 几个菜单获取钩子函数
    *
    * @param {Ext.container.Container} menuContainer
    * @return {Object}
    */
   sysmenuRequestHandler: function(menuContainer)
   {
   },
   /**
    *
    * @param {Ext.menu.Menu} menu
    * @return {Object}
    */
   desktopMenuRequestHandler: function(menu)
   {
   },
   /**
    * 运行指定的OsWidget
    *
    * @param {String} cls
    * @param {Object} config 传给DkWidget构造函数的配置对象
    */
   openDesktopWidget: function(name, config)
   {
      config = config || {};
      var cls = 'WebOs.DesktopWidget.' + name + '.Main';
      var widget;
      if (this.openedWidgets.containsKey(cls)) {
         widget = this.openedWidgets.get(cls);
         widget.show();
         widget.openedHandler();
         widget.toFront();
      } else {
         Ext.require(cls, function() {
            Ext.apply(config, {
               openedWidgets: this.openedWidgets
            });
            widget = Ext.create(cls, config);
            this.openedWidgets.add(cls, widget);
            widget.show();
         }, this);
      }
   },
   /**
    * 获取指定的DkWidget对象
    *
    * @param {String} cls
    * @param {Object} config 传给DkWidget构造函数的配置对象
    */
   getWidget: function(cls, config, callback, scope)
   {
      scope = scope || this;
      config = config || {};
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      if (this.openedWidgets.containsKey(cls)) {
         callback.call(scope, this.openedWidgets.get(cls));
      } else {
         Ext.require(cls, function() {
            Ext.apply(config, {
               openedWidgets: this.openedWidgets
            });
            var widget = Ext.create(cls, config);
            this.openedWidgets.add(cls, widget);
            callback.call(scope, widget);
         }, this);
      }
   },
   /**
    * 获取APP的上传目录
    * 
    * @param {String} module
    * @param {String} appname
    * @returns {String}
    */
   getAppUploadFilesPath: function(module, appname)
   {
      var C = FengHuang.Const;
      var setting = this.sysEnv.get(C.ENV_SYS_SETTING);
      return [setting.uploadRootPath, 'Apps', module, appname].join('/');
   },
});