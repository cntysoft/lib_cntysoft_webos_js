/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Window', {
   extend : 'Ext.window.Window',
   statics : {
      vwIdSeed : 1
   },
   /**
    * 系统虚拟桌面对象引用
    *
    * @property {WebOs.OsWidget.VirtualDesktop} vdesktop
    */
   vdesktop : null,
   constructor : function(config)
   {
      this.vdesktop = Cntysoft.R_SYS_UI_RENDER.getOsWidget(Cntysoft.Const.WEBOS_V_DESKTOP);
      config = config || {};
      this.applyConstraintConfig(config);
      this.callParent([config]);
      this.$_vdesktop_key_$ = Ext.getClassName(this)+ this.statics().vwIdSeed++;
      this.vdesktop.registerWindow(this.$_vdesktop_key_$, this);
      //属于的虚拟桌面的编号
      this.$_vd_index_$ = this.vdesktop.current;
   },
   initComponent : function()
   {
      this.addListener({
         boxready : function()
         {
            this.$_x_ratio_$ = this.getX() / this.vdesktop.getWidth();
         },
         move : function()
         {
            this.$_x_ratio_$ = this.getX() / this.vdesktop.getWidth();
         },
         scope : this
      });
      this.callParent();
   },
   /**
    * 强制配置对象
    * @template
    * @param {Object} config
    */
   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         hideMode : 'visibility',
         constrain : true,
         constrainTo : Ext.get('WEBOS_V_DESKTOP')
      });
   },
   /**
    * 当这个窗口属于某个虚拟桌面， 但是这个虚拟桌面没有激活， 那么我们不能调用 doConstrain
    */
   onWindowResize : function(){
      var me = this,
         sizeModel;
      if(me.maximized){
         me.fitContainer();
      } else{
         var x = this.getX();
         if(x > 0 && x < this.vdesktop.getWidth()){
            sizeModel = me.getSizeModel();
            if(sizeModel.width.natural || sizeModel.height.natural){
               me.updateLayout();
            }
            me.doConstrain();
         }
      }
   },
   destroy : function()
   {
      this.vdesktop.unregisterWindow(this.$_vdesktop_key_$, this.$_vd_index_$);
      delete this.$_vdesktop_key_$;
      delete this.vdesktop;
      this.callParent();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Kernel.Const', {
   extend : 'Cntysoft.Kernel.Const',
   inheritableStatics: {
      /**
       * 核心环境变量名称，守护进程数据键名称，这个在系统引导过程会用到
       *
       * @readonly
       * @property {String} ENV_DAEMON
       */
      ENV_DAEMON : 'ENV_DAEMON',
      /**
       * 核心环境变量名称，应用程序数据键名称，这个在系统引导过程会用到
       *
       * @readonly
       * @property {String} ENV_APP
       */
      ENV_APP : 'ENV_APP',
      /**
       * WEBO环境组件引用名称，任务栏UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_TASK_BAR
       */
      WEBOS_TASK_BAR : 'WEBOS_TASK_BAR',
      /**
       * 虚拟桌面选择器
       *
       * @readonly
       * @property {String} WEBOS_VDS
       */
      WEBOS_VDS : 'WEBOS_VDS',
      /**
       * WEBO环境组件引用名称，桌面容器对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_DESKTOP
       */
      WEBOS_DESKTOP : 'WEBOS_DESKTOP',
      /**
       * WEBO环境组件引用名称，虚拟桌面UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_V_DESKTOP
       */
      WEBOS_V_DESKTOP : 'WEBOS_V_DESKTOP',
      /**
       * WEBO环境组件引用名称，系统菜单UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_MENU
       */
      WEBOS_SYS_MENU : 'WEBOS_SYS_MENU',
      /**
       * WEBO环境组件引用名称，快速启动栏UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_QUICK_BAR
       */
      WEBOS_QUICK_BAR : 'WEBOS_QUICK_BAR',
      /**
       * WEBO环境组件引用名称，开始按钮UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_START_BTN
       */
      WEBOS_START_BTN : 'WEBOS_START_BTN',
      /**
       * WEBO环境组件引用名称，应用程序选择器UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_APP_SWITCH_BAR
       */
      WEBOS_APP_SWITCH_BAR : 'WEBOS_APP_SWITCH_BAR',
      /**
       * WEBO环境组件引用名称，系统通知栏UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_TRAY
       */
      WEBOS_SYS_TRAY : 'WEBOS_SYS_TRAY',
      /**
       * WEBO环境组件引用名称，桌面背景UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_BG
       */
      WEBOS_SYS_BG : 'WEBOS_SYS_BG',
      /**
       * WEBO环境组件引用名称，系统通知组件对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_NOTICE
       */
      WEBOS_SYS_NOTICE : 'WEBOS_SYS_NOTICE',
      /**
       * WEBO环境组件引用名称，桌面上下文菜单对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_DESKTOP_MENU
       */
      WEBOS_DESKTOP_MENU : 'WEBOS_DESKTOP_MENU',
      /**
       * WEBO环境组件引用名称，窗口管理器对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_WIN_MGR
       */
      WEBOS_WIN_MGR : 'WEBOS_WIN_MGR',
      /**
       * 核心的APP引用，系统初始化APP引用名称
       *
       * @readonly
       * @property {String} R_INIT
       */
      R_INIT : 'RUNABLE_INIT',
      /**
       * 核心的APP引用，桌面环境渲染APP引用名称
       *
       * @readonly
       * @property {String} R_SYS_UI_RENDER
       */
      R_SYS_UI_RENDER : 'R_SYS_UI_RENDER',
      /**
       * 核心的APP引用，任务管理器对象引用名称
       *
       * @readonly
       * @property {String} R_TASK_MANAGER
       */
      R_TASK_MANAGER : 'R_TASK_MANAGER',
      /**
       * 核心环境变量名称，当前登录系统的用户的相关数据
       *
       * @readonly
       * @property {String} ENV_CUR_USER
       */
      ENV_CUR_USER : 'ENV_CUR_USER',
      /**
       * 核心环境变量名称，当前登录系统的用户权限的相关数据
       *
       * @readonly
       * @property {String} ENV_ACL
       */
      ENV_ACL : 'ENV_ACL_KEY',
      /**
       * APP运行的次数相关数据
       *
       * @readonly
       * @property {String} ENV_APP_RUN_RECORD
       */
      ENV_APP_RUN_RECORD : 'ENV_APP_RUN_RECORD',
      /**
       * php相关的设置
       *
       * @readonly
       * @property {String} ENV_PHP_SETTING
       */
      ENV_PHP_SETTING : 'ENV_PHP_SETTING',
      /**
       * 两种可运行实体的类型名称，应用程序
       *
       * @readonly
       * @property {String} RUN_TYPE_APP
       */
      RUN_TYPE_APP : 'App',
      /**
       * 两种可运行实体的类型名称， 守护进程
       *
       * @readonly
       * @property {String} RUN_TYPE_DAEMON
       */
      RUN_TYPE_DAEMON : 'Daemon',
      /**
       * 第三方扩展的文件夹名称，比如 CkEditor源文件就存放这里
       *
       * @readonly
       * @property {String} VENDER_DIR
       */
      VENDER_DIR : 'Vender',
      /**
       * 系统应用程序定义文件存放目录
       *
       * @readonly
       * @property {String} APP_DIR
       */
      APP_DIR : 'App',
      /**
       * 系统守护进程定义文件存放目录
       *
       * @readonly
       * @property {String} DAEMON_DIR
       */
      DAEMON_DIR : 'Daemon',
      /**
       * 简单的纯文字的通知信息
       *
       * @readonly
       * @property {String} SYS_TRAY_MSG_TXT
       */
      SYS_TRAY_MSG_TXT : 1,
      /**
       * 回调函数方式的通知信息
       *
       * @readonly
       * @property {String} SYS_TRAY_MSG_TXT
       */
      SYS_TRAY_MSG_CALLBACK : 2,
      /**
       * 系统运行级别， 核心级别
       *
       * @readonly
       * @property {String} RUN_LEVEL_KERNEL
       */
      RUN_LEVEL_KERNEL : 'kernel',
      /**
       * 系统运行级别， 用户空间级别
       *
       * @readonly
       * @property {String} RUN_LEVEL_USER
       */
      RUN_LEVEL_USER : 'user'
   }
}, function(){
   alias = Ext.Function.alias;
   Ext.apply(WebOs,{
      Const : this,
      C : this
   })
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Lang.zh_CN', {
   extend : 'Cntysoft.Kernel.AbstractLangHelper',
   data : {
      DESKTOP : {

      }
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * Runable对象抽象库对象类定义,暂时还没加上什么东西但是以后肯定会加上的
 */
Ext.define('WebOs.Kernel.ProcessModel.AbstractLib', {
   /**
    * @property {WebOs.Kernel.ProcessModel.Runable} runable
    */
   runable : null,
   /**
    * 构造函数
    *
    * @param {WebOs.Kernel.ProcessModel.Runable} runable
    */
   constructor : function(runable)
   {
      this.runable = runable;
   },
   /**
    * 获取可运行实体
    *
    * @return {WebOs.Kernel.ProcessModel.Runable}
    */
   getRunable : function()
   {
      return this.runable;
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统可执行对象基类 在这里会进程一些进程见通信相关的接口
 */
Ext.define('WebOs.Kernel.ProcessModel.Runable', {
   mixins : {
      observable : 'Ext.util.Observable',
      callApp : 'Cntysoft.Mixin.CallApp'
   },
   requires : [
      'Cntysoft.Framework.Net.Gateway',
      'Cntysoft.Stdlib.Object',
      'WebOs.Kernel.ProcessModel.AbstractLib'
   ],
   inheritableStatics : {
      S_RUNNING : 1,
      S_SLEEP : 2,
      S_CLOSE : 3
   },
   /**
    * 可运行种类
    *
    * @property {string} runableType
    */
   runableType : '',
   /**
    * 程序运行空间，共两种空间, 默认的程序的都是运行在用户空间
    * 一种是内核空间
    * 一种是用户空间
    *
    * @property {string} runLevel
    */
   runLevel : 'user', //Cntysoft.Const.RUN_LEVEL_USER,
   /**
    * 运行实体的名称 这个值是全局唯一的
    * 名称的结构 ModuleName.AppName
    * @todo怎么保证这个全局唯一性
    *
    * @property {string} id
    */
   id : '',
   /**
    * 是否允许存在多个实例
    *
    * @property {boolean} allowMultiInstance
    */
   allowMultiInstance : false,
   /**
    * 系统进程管理
    *
    * @property {Cntysoft.Kernel.ProcessModel.ProcessManager} processManager
    */
   processManager : null,
   /**
    * 运行核心关联的进程对象
    *
    * @property {Cntysoft.Kernel.ProcessModel.Process} process
    */
   process : null,
   /**
    * 系统环境变量
    *
    * @property {Cntysoft.Kernel.SysEnv} sysEnv
    */
   sysEnv : null,
   /**
    * 可运行实体状态
    *
    * @property {int} status
    */
   status : null,
   /**
    * 系统初始化传入的参数
    *
    * @property {Object} invokeConfig
    */
   invokeConfig : {},
   /**
    * 是否被运行过
    *
    * @property {Boolean} isRunned
    */
   isRunned : false,
   /**
    * 程序对象多次run的参数
    *
    * @property {Object} runConfig
    */
   runConfig : {},
   /**
    * 是否kill
    *
    * @property {boolean} isKilled
    */
   isKilled : false,
   /**
    * APP程序的版本信息
    *
    * @property {Object} version
    */
   version : {},
   /**
    * 程序的名称空间
    *
    * @property {String} namespace
    */
   namespace : null,
   /**
    * 判断runable是否具有语言数据
    *
    * @property {Boolean} hasLangText
    */
   hasLangText : true,
   /**
    * Runable语言对象
    *
    * @property {Cntysoft.Kernel.AbstractLangHelper} lang
    */
   lang : null,
   /**
    * 语言对象引用
    *
    * @property {Object} 语言对象引用
    */
   LANG_TEXT : null,
   /**
    * 当函数接口按照API方式调用的时候这个值为tree
    *
    * @property {Boolean} isApiInvoke
    */
   isApiInvoke : false,
   /**
    * 构造函数
    *
    * @param {Object} config
    */
   constructor : function(config)
   {
      if(Ext.isDefined(config.invokeConfig)){
         this.invokeConfig = config.invokeConfig;
         delete config.invokeConfig;
      }
      /**
       * 虽然process有kill相关事件的派发
       * 但是有个问题 process的生成是受系统管理的，开发者一般是不能process绑定相关事件
       * 但是开发人员却可以给APP绑定kill事件处理函数
       *
       * statuschange
       * run
       * sleep
       * wakeup
       * kill
       */
      this.sysEnv = WebOs.getSysEnv();
      this.processManager = WebOs.PM();
      this.mixins.observable.constructor.call(this, config);
      //检查ID是否设置
      if(Ext.isEmpty(this.id)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'Runable must have id property'
         );
      }
      this.setupIdHandler();
      this.libRefs = new Ext.util.HashMap();
      if(this.hasLangText){
         //这里貌似是动态构造，但是我们还是必须手动require语言包
         if(!Cntysoft.LangManager.hasLang(this.id)){
            Ext.require(this.getLangCls())
            this.lang = Ext.create(this.getLangCls());
            Cntysoft.LangManager.register(this.id, this.lang);
         } else{
            this.lang = Cntysoft.LangManager.getLang(this.id);
         }
      }
   },
   /**
    * @template
    *
    * 设置系统ID字段
    */
   setupIdHandler : Ext.emptyFn,
   /**
    * @template
    * 获取语言类名称
    *
    * @return string
    */
   getLangCls : Ext.emptyFn,
   /**
    * 获取应用程序范围里面的语言数据,使用大写的为了让大家知道这个是一个特殊的方法
    * @see {Cntysoft.Kernel.AbstractLangHelper#getText}
    *
    * @param {String} key
    * @return {Object}
    */
   GET_LANG_TEXT : function(key)
   {
      if(this.hasLangText){
         return this.lang.getText(key);
      }
   },
   /**
    * 获取进程管理器条目显示文字
    *
    * @return {String}
    */
   GET_PROCESS_DISPLAY_TEXT : function()
   {
      var text = this.GET_LANG_TEXT('PM_TEXT.DISPLAY_TEXT');
      //这里是否抛出错误
      if(Ext.isEmpty(text)){
         text = 'program : ' + this.category + '.' + this.name;
      }
      return text;
   },
   /**
    * 获取本Runable的名称空间
    *
    * @return string
    */
   getNamespace : function()
   {
      if(null == this.namespace){
         var ns = Ext.getClassName(this);
         this.namespace = ns.substring(0, ns.lastIndexOf('.'));
      }
      return this.namespace;
   },
   /**
    * 设置环境变量, 在Runable里面我们都要优先调用这个接口， 这个接口使用了前缀， 防止名称冲突
    *
    * @param {String} key
    * @param {Object} value
    * @return {Cntysoft.Kernel.ProcessModel.Runable}
    */
   setEnvVar : function(key, value)
   {
      key = ['RUNABLE', this.runableType, this.id, key].join('.');
      this.sysEnv.set(key, value);
      return this;
   },
   /**
    * 获取Runable相关联的环境变量
    *
    * @param {String} key
    * @return {Object}
    */
   getEnvVar : function(key)
   {
      key = ['RUNABLE', this.runableType, this.id, key].join('.');
      return this.sysEnv.get(key);
   },
   /**
    * 设置可运行实体的进程数据
    *
    * @param {Cntysoft.Kernel.App.Process} process
    * @return {Cntysoft.Kernel.App.Runable}
    */
   setProcess : function(process)
   {
      if(!process instanceof WebOs.Kernel.ProcessModel.Process){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'setProcess',
            'process must be the type of WebOs.Kernel.ProcessModel.Process'
         );
      }
      this.process = process;
      return this;
   },
   /**
    * 获取可运行实体相关联的进行对象
    *
    * @return {Cntysoft.Kernel.App.Process}
    */
   getProcess : function()
   {
      return this.process;
   },
   /**
    * 获取调用配置信息
    *
    * @return {Object}
    */
   getInvokeConfig : function()
   {
      return this.invokeConfig;
   },
   /**
    * 获取程序运行参数
    *
    * @return {Object}
    */
   getRunConfig : function()
   {
      return this.runConfig;
   },
   /**
    * 获取运行实体类型
    *
    * @return {String}
    */
   getRunableType : function()
   {
      return this.runableType;
   },
   /**
    * 获取可运行识别ID
    *
    * @return {String}
    */
   getId : function()
   {
      return this.id;
   },
   /**
    * 可运行实体是否允许多个实例
    *
    * @return {boolean}
    */
   isAllowMultiInstance : function()
   {
      return !!this.allowMutiInstance;
   },
   /**
    * 系统构造函数 运行相关程序 初始化客运行实体
    *
    * @return {Cntysoft.Kernel.ProcessModel.Runable}
    */
   run : function(runConfig)
   {
      var S = this.self;
      /**
       * 检查一些必要字段是否设置
       */
      this.runConfig = runConfig;
      this.status = S.S_RUNNING;
      if('' == Ext.String.trim(this.id)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'run',
            'id must not be empty'
         );
      }
      if(this.hasListeners.run){
         this.fireEvent('run', this);
      }
      return this;
   },
   /**
    * 消息通知接收接口, 在这个接口里面一定要自己关闭APP进程， 系统只负责打开进程
    *
    * @template
    * @param {Object} config 这个参数是发送msg的调用者指定的元对象
    */
   msgNotifyHandler : Ext.emptyFn,
   /**
    * 系统钩子函数
    *
    * 激活可运行实体
    *
    * @return  {Cntysoft.Kernel.ProcessModel.Runable}
    */
   wakeup : function()
   {
      this.status = this.self.S_RUNNING;
      if(this.hasListeners.wakeup){
         this.fireEvent('wakeup', this);
      }
      return this;
   },
   /**
    * 系统钩子函数
    *
    * 休眠可运行实体
    *
    * @return  {Cntysoft.Kernel.ProcessModel.Runable}
    */
   sleep : function()
   {
      this.status = this.self.S_SLEEP;
      if(this.hasListeners.sleep){
         this.fireEvent('sleep', this);
      }
      return this;
   },
   /**
    * 设置可运行实体的状态
    *
    * @param {int} status
    * @return {Cntysoft.Kernel.ProcessModel.Runable}
    */
   setStatus : function(status)
   {
      if(this.status != status){
         this.status = status;
         if(this.hasListeners.statuschange){
            this.fireEvent('statuschange', status, this);
         }
      }
      return this;
   },
   /**
    * 获取运行状态
    *
    * @return {int}
    */
   getStatus : function()
   {
      return this.status;
   },
   /**
    * 杀死可运行实体钩子函数, 千万不要直接调用这个函数， 这个函数只能由ProcessManager调用
    */
   kill : function()
   {
      delete this.process;
      this.destroy();
      this.isKilled = true;
      this.status = this.self.S_KILLED;
      if(this.hasListeners.kill){
         this.fireEvent('kill', this);
      }
      return this;
   },
   /**
    * 程序正常退出， 这个函数使用进程管理器结束本APP关联的进程， 最终关闭本APP
    */
   exit : function()
   {
      if(this.isApiInvoke){
         //是API调用，这个时候看看是否有widget，如果有widget那么什么都不做
         if('App' == this.runableType && this.widgets.getCount() > 0){
            if(this.widgets.getCount() > 0){
               return;
            }
         }
      }
      WebOs.PM().killProcess(this.process);
   },
   /**
    * 系统资源清除
    */
   destroy : function()
   {
      this.clearListeners();
      delete this.processManager;
      delete this.sysEnv;
      delete this.process;
      delete this.LANG_TEXT;
      delete this.lang;
   }
}, function(){
   //增加两个方便获取APP和DAEMON语言数据的方法
   Ext.apply(WebOs, {
      /**
       * 获取指定APP的语言数据， 这个貌似每次都要查询速度会比较慢
       *
       * @param {String} module
       * @param {String} name
       * @param {String} key
       * @returns {Object}
       */
      GET_APP_LANG_TEXT : function(module, name, key)
      {
         var app = WebOs.PM().getAppByKey(module, name);
         return app.GET_LANG_TEXT(key);
      },
      /**
       * 获取指定DAEMON的语言数据， 这个貌似每次都要查询速度会比较慢
       *
       * @param {String} module
       * @param {String} name
       * @param {String} key
       * @returns {Object}
       */
      GET_DAEMON_LANG_TEXT : function(module, name, key)
      {
         var daemon = WebOs.PM().getDaemonByKey(module, name);
         return daemon.GET_LANG_TEXT(key);
      }
   });
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统进程对象
 *
 * 改进第一版的通知机制，改用事件绑定机制
 *
 * 第一版 建立框架
 *
 * 加入进程间通信相关接口
 *
 * 在WEBOS里面每个程序都有一个与之匹配的进程对象，也就是模拟操作系统里面的进程，这个进程可以进行的操作有
 *
 * 1. 激活
 * 2. 杀死
 * 3. 休眠
 *
 * 进程的创建，状态的改变，删除都是由进程管理器代理 {@link WebOs.Kernel.ProcessModel.ProcessManager}
 */
Ext.define('WebOs.Kernel.ProcessModel.Process', {
   /**
   * 类定义开始
   */
   mixins : {
      observable : 'Ext.util.Observable'
   },
   requires : [
      'Cntysoft.Utils.Common',
      'WebOs.Kernel.ProcessModel.Runable'
   ],
   /**
   * 类定义结束
   */
   statics : {
      /**
       * 进程支持的运行实体类型， 进程一个可以支持两种实体
       *
       * 1. APP <span style = "color:blue">这个实体类型一般是有图形界面的</span>
       * 2. DAEMON <span style = "color:blue">这个对应到操作系统中是守护进程， 一般是没有图形界面，周而复始的运行在后台的程序</span>
       *
       * @readonly
       * @property {String} P_TYPE_APP
       */
      P_TYPE_APP : 'App',
      /**
       * 守护进程类型常量
       *
       * @property {String} P_TYPE_DAEMON
       * @readonly
       */
      P_TYPE_DAEMON : 'Daemon',
      /**
       * 进程是否为空常量， 一个进程可能创建了 但是没有程序load进去，这个时候进程的状态就是 P_STATUS_EMPTY
       *
       * @readonly
       */
      P_STATUS_EMPTY : 0,
      /**
       * 进程暂停状态常量
       *
       * @readonly
       */
      P_STATUS_STOP : 2,
      /**
       * 进程运行状态常量
       *
       * @readonly
       */
      P_STATUS_RUNNING : 1,
      /**
       * 进程id种子
       *
       * @readonly {Integer}  PROCESS_ID_SEED
       */
      PROCESS_ID_SEED : 0,
      /**
       * 进程调用方式 API的调用方式
       *
       * @readonly {Integer} I_TYPE_API
       */
      I_TYPE_API : 0,
      /**
       * 进程调用方式 Widget的调用方式
       *
       * @eadyonly {Integer} I_TYPE_WIDGET
       */
      I_TYPE_WIDGET : 1,
      /**
       * 生成进程id
       *
       * @return {int}
       */
      generatePid : function()
      {
         return ++this.PROCESS_ID_SEED;
      },
      /**
       * 获取系统支持进程状态种类
       *
       * @return {Number[]}
       */
      getSupportStatus : function()
      {
         return [
            this.P_STATUS_STOP,
            this.P_STATUS_RUNNING
         ];
      },
      /**
       * 获取支持的进程种类
       *
       * @return {String[]}
       */
      getSupportProcessTypes : function()
      {
         return [
            this.P_TYPE_APP,
            this.P_TYPE_DAEMON
         ];
      }
   },
   /**
   * 不安全的类型判断,一般粗略的判断一个对象是否为进程对象
   *
   * @readonly
   * @property {Boolean} isProcess
   */
   isProcess : true,
   /**
   * 系统进程状态
   *
   * @readonly
   * @property {int} status
   */
   status : null,
   /**
   * 进程启动时间
   *
   * @readonly
   * @property {Number} startTime
   */
   startTime : null,
   /**
   * 系统进程id
   *
   * @readonly
   * @property {Number} pid
   */
   pid : null,
   /**
   * 与进程关联的运行对象
   *
   * @readonly
   * @private
   * @property {Cntysoft.Kernel.App.Process} runable
   */
   runable : null,
   /**
   * 跟进程关联的任务栏按钮
   *
   * @readonly
   * @private
   * @property {Cntysoft.SysUi.OsWidget.Ui.TaskButton} taskButton
   */
   taskButton : null,
   /**
   * 进程运行时间任务对象
   *
   * @readonly
   * @private
   * @property {Object} runTimeTask
   */
   runTimeTask : null,
   /**
   * 是否killed
   *
   * @readonly
   * @property {Boolean} Killed
   */
   killed : false,
   /**
   * 构造函数
   *
   * @param {Object} config
   */
   constructor : function(config)
   {
      this.startTime = new Date();
      this.pid = this.statics().generatePid();
      //初始状态的进程状态 ， 默认为正在运行可以省去很多麻烦
      this.status = this.self.P_STATUS_RUNNING;

      /**
       * @ignore
       * 这里对Process相关事件进行点说明
       *
       * 因为process是系统进程模型的内部使用，外部是不太可能给其绑定事件的，但是要绑定也是可以的
       * 通过ProcessConfig参数进行绑定
       *
       * exetime
       * statechange
       * kernelload
       * start
       * wakeup
       * sleep
       * kill
       */
      this.initNotifyTimeTask();
      Ext.apply(this, config);
      this.mixins.observable.constructor.call(this, config);
      this.callParent([config]);
   },
   /**
   * 加载正常程序或者守护进程
   *
   * @param {Cntysoft.Kernel.App.Runable} runable
   * @return {WebOs.Kernel.ProcessModel.Process}
   */
   load : function(runable)
   {
      if(!(runable instanceof WebOs.Kernel.ProcessModel.Runable)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'load',
            'runable must be instanceof WebOs.Kernel.ProcessModel.Runable'
         );
      }
      this.runable = runable;
      runable.setProcess(this);
      /**
      * 便于引用
      */
      if(this.hasListeners.kernelload){
         this.fireEvent('kernelload', this);
      }

   },
   /**
   * 启动进程对象, 相关程序的窗体将被打开
   *
   * {@link WebOs.Kernel.ProcessModel.App#method-run}
   *
   * @param {Object} runConfig
   * @return {Cntysoft.Kernel.App.Process}
   */
   start : function(runConfig)
   {
      if(!this.isLoaded()){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'start',
            'process have not kernel'
         );
      }
      this.status = this.statics().P_STATUS_RUNNING;
      //怎么给Run方法传递参数呢？
      this.runable.run(runConfig);
      if(this.hasListeners.start){
         this.fireEvent('start', this);
      }
      return this;
   },
   /**
   * 判断一个进程是否加载核心
   *
   * @return {Boolean}
   */
   isLoaded : function()
   {
      return this.runable instanceof WebOs.Kernel.ProcessModel.Runable;
   },
   /**
   * 唤醒进程， APP类型的进程的窗体将全部显示出来
   *
   * @return {Cntysoft.Kernel.App.Process}
   */
   wakeup : function()
   {
      if(!this.isLoaded()){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'wakeup',
            'process has not runable instance'
         );
      }
      this.runable.wakeup();
      this.status = this.statics().P_STATUS_RUNNING;
      if(this.hasListeners.wakeup){
         this.fireEvent('wakeup', this);
      }
      return this;
   },
   /**
   * 休眠进程 ， APP类型的进程的窗体将全部最小化
   *
   * @return {Cntysoft.Kernel.App.Process}
   */
   sleep : function()
   {
      if(!this.isLoaded()){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'sleep',
            'process has not runable instance'
         );
      }
      this.status = this.statics().P_STATUS_STOP;
      this.runable.sleep();
      if(this.hasListeners.sleep){
         this.fireEvent('sleep', this);
      }
      return this;
   },
   /**
   * 杀死进程, 跟这个进程相关的资源都将被释放
   *
   * @return {WebOs.Kernel.ProcessModel.Process}
   */
   kill : function()
   {
      if(!this.isLoaded()){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'kill',
            'process has not runable instance'
         );
      }
      /**
       * 这里是否要探测状态
       * 可能程序有未保存的数据
       * @ignore
       * @todo
       */
      this.runable.kill();
      this.killed = true;
      if(this.hasListeners.kill){
         this.fireEvent('kill', process);
      }
      return this;
   },
   /**
   * 获取运行时间 单位是分钟
   *
   * @return {Number}
   */
   getProcessRunTime : function()
   {
      var now = new Date(),
         minute = Math.floor((now - this.startTime) / 60000);
      return minute;
   },
   /**
   * 获取进行类型,根据runable类型判断
   *
   * 具体请看 :
   * {@link #P_TYPE_APP}
   *
   * {@link #P_TYPE_DAEMON}
   *
   * @return {String}
   */
   getProcessType : function()
   {
      if(!this.isLoaded()){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getProcessType',
            'process has not runable instance'
         );
      }
      return this.runable.getRunableType();
   },
   /**
   * 获取当前进程运行状态
   *
   * @return {Number}
   */
   getStatus : function()
   {
      return this.status;
   },
   /**
   * 获取进程id, 每个创建的进程都具有一个唯一的进程ID
   *
   * @return {Number}
   */
   getPid : function()
   {
      return this.pid;
   },
   /**
   * 获取可运行的对象，每个进程都关联一个可以运行的对象实体
   * 具体请看 :
   * {@link #P_TYPE_APP}
   *
   * {@link #P_TYPE_DEAMON}
   *
   * @return {Cntysoft.Kernel.App.Runable}
   */
   getRunable : function()
   {
      return this.runable;
   },
   /**
   * 派发时间的任务初始化， 这个定时器主要实现记录当前进程的运行时间
   *
   * @private
   */
   initNotifyTimeTask : function()
   {
      this.runTimeTask = Ext.TaskManager.start({
         run : function(){
            if(this.hasListeners.exetime){
               this.fireEvent('exetime', this, this.getProcessRunTime());
            }
         },
         interval : 60000,
         scope : this
      });
   },
   /**
   * 清除当前进程对象关联的一些对象引用
   *
   * @template
   */
   destroy : function()
   {
      //删除时间任务
      this.clearListeners();
      Ext.TaskManager.stop(this.runTimeTask);
      //需要这样删除吗？
      delete this.runTimeTask;
      delete this.taskButton;
      //这里这是删除引用
      //真正的资源释放在runable的kill方法中实现
      delete this.runable;
      this.runTimeTask = null;
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统进程管理器,提供进程的创建，暂停，停止相关接口
 */
Ext.define('WebOs.Kernel.ProcessModel.ProcessManager', {
   extend : 'Ext.util.MixedCollection',
   requires : [
      'WebOs.Kernel.ProcessModel.Process',
      'Cntysoft.Stdlib.Object'
   ],
   /**
    * 不安全的类型检查
    *
    * @property {Boolean} isProcesssManager
    */
   isProcesssManager : true,
   /**
    * 查询可运行实体的时候，缓存结果
    *
    * @private
    * @property {Ext.util.HashMap} runableRefCache
    */
   runableRefCache : null,
   /**
    * 构造函数
    */
   constructor : function()
   {
      /**
       * 事件名称
       * processadd
       * processcreate
       * processstart
       * processsleep
       * processwakeup
       * processkill
       * notifytime
       * statuschange
       */
      this.callParent([false, Ext.bind(function(process){
         return this.getProcessIdKey(process.pid);
      }, this)]);
      this.runableRefCache = new Ext.util.HashMap({
         keyFn : function(runable)
         {
            return runable.runableType + '_' + runable.module + '_' + runable.name;
         }
      });
      //this.attachDefaultListeners();
   },
   /**
    * 注意异步执行
    *
    * 运行一个指定的App
    * {
     * 	module : 'module',
     * 	name : 'name',
     * 	invokeConfig : 'invokeConfig', 这个参数是在初始化 App 或者 Daemon的时候传给其构造函数的配置对象
     * 	processConfig : 'processConfig',  这个是在进程初始化的时候传给其构造函数的配置对象
     * 	runConfig : 'runConfig'
     * }
    *
    * @param {Object} config
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   runApp : function(config, callback, scope)
   {
      Ext.apply(config, {
         type : WebOs.Const.RUN_TYPE_APP
      });
      this.runKernel(config, callback, scope);
   },
   /**
    * 调用APP应用程序接口， 暂时API调用完成马上删除进程
    *
    * @param {String} module 模块名称
    * @param {String} name App识别ID
    * @param {String} method 调用的方法名称
    * @param {Object} params 调用参数
    * @param {Function} callback 接受结果的回调函数
    * @param {Object} scope 回调函数执行的作用域
    */
   callApi : function(module, name, method, params, callback, scope)
   {
      this.runApp({
         module : module,
         name : name,
         runConfig : {
            apiName : method,
            apiParams : params,
            callback : callback,
            scope : scope
         }
      });
   },
   /**
    * 运行一个指定的Daemon
    * {
     * 	module : 'module',
     * 	name : 'name',
     * 	invokeConfig : 'invokeConfig', 这个参数是在初始化 App 或者 Daemon的时候传给其构造函数的配置对象
     * 	processConfig : 'processConfig',  这个是在进程初始化的时候传给其构造函数的配置对象
     * 	runConfig : 'runConfig'
     * }
    *
    * @param {Object} config
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   runDaemon : function(config)
   {
      Ext.apply(config, {
         type : WebOs.Const.RUN_TYPE_DAEMON
      });
      this.runKernel(config);
   },
   /**
    * @param {Object} config
    * @param {String} type
    */
   runKernel : function(config, callback, scope)
   {
      var runConfig;
      var cls;
      this.checkMetaFields(config);
      var key;
      var type = config.type;
      if(type === WebOs.Const.RUN_TYPE_DAEMON){
         key = config.name;
      } else{
         key = config.module + '.' + config.name;
      }
      Ext.applyIf(config, this.getRunableConfig(key, type));
      runConfig = config.runConfig;
      delete config.runConfig;
      //异步加载cls
      cls = this.getClsFromConfig(config);
      if(!Ext.ClassManager.get(cls)){
         WebOs.showLoadScriptMask();
         Ext.require(cls, function(){
            WebOs.hideLoadScriptMask();
            this.doRunKernel(key, type, runConfig, config, callback, scope);
         }, this);
      } else{
         this.doRunKernel(key, type, runConfig, config, callback, scope);
      }
   },
   /**
    * 运行核心
    *
    * @param string key runable的识别KEY
    */
   doRunKernel : function(key, type, runConfig, config, callback, scope)
   {
      callback = callback || Ext.emptyFn;
      scope = scope || this;
      //创建相关进程
      /**
      * 判断实例是否存在
      * @todo 是否实现多实例
      */
      process = this.getProcessByRunableName(key, type);

      if(process instanceof WebOs.Kernel.ProcessModel.Process){
         //重新运行程序
         this.startProcess(process, runConfig);
         callback.call(scope, process);
         return process;
      }
      process = this.createProcess(config);
      this.startProcess(process, runConfig);
      callback.call(scope, process);
   },
   /**
    * 创建一个进程对象
    *
    * @param {Object} config
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   createProcess : function(config)
   {
      var process;
      var runable;

      process = new WebOs.Kernel.ProcessModel.Process(config.processConfig);

      delete config.processConfig;
      runable = this.getRunableIntance(config);


      //建立关联
      runable.process = process;
      this.setupProcess(process);

      process.load(runable);
      if(this.hasListeners.processcreate){
         this.fireEvent('processcreate', process);
      }

      return this.add(process);
   },
   /**
    * 运行一个进程对象
    *
    * @param {int | WebOs.Kernel.ProcessModel.Process} process
    * @param {Object} runConfig
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   startProcess : function(process, runConfig)
   {
      if(Ext.isNumber(process)){
         if(!this.hasProcess(process)){
            Cntysoft.raiseError(
               Ext.getClassName(this),
               'startProcess',
               'process : ' + process + 'is not exist'
            );
         }
         process = this.getProcess(process);
      }
      if(!(process instanceof WebOs.Kernel.ProcessModel.Process)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'startProcess',
            'process must the instanceof WebOs.Kernel.ProcessModel.Process'
         );
      }
      process.start(runConfig);
      if(this.hasListeners.processstart){
         this.fireEvent('processstart', process);
      }
      return process;
   },
   /**
    * 杀死一个进程
    *
    * @param {int | WebOs.Kernel.ProcessModel.Process} process
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   killProcess : function(process)
   {
      if(Ext.isNumber(process)){
         process = this.getProcess(process);
      }
      if(!(process instanceof WebOs.Kernel.ProcessModel.Process)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'killProcess',
            'process must instanceof WebOs.Kernel.ProcessModel.Process'
         );
      }
      process.kill();
      this.remove(process, true);
      return process;
   },
   /**
    * 休眠一个进程
    *
    * @param {int | WebOs.Kernel.ProcessModel.Process} process
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   sleepProcess : function(process)
   {
      process = this.getProcess(process);
      process.sleep();
      if(this.hasListeners.processsleep){
         this.fireEvent('processsleep', process);
      }
      return process;
   },
   /**
    * 唤醒一个进程
    *
    * @param {int | WebOs.Kernel.ProcessModel.Process} process
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   wakeupProcess : function(process)
   {
      process = this.getProcess(process);
      process.wakeup();
      if(this.hasListeners.processwakeup){
         this.fireEvent('processwakeup', process);
      }
      return process;
   },
   /**
    * 休眠所有的进程
    *
    * @return {WebOs.Kernel.ProcessModel.ProcessManager}
    */
   sleepAllProcess : function()
   {
      this.each(function(process){
         this.sleepProcess(process);
      }, this);
      return this;
   },
   /**
    * 激活所有进程
    *
    * @return {WebOs.Kernel.ProcessModel.ProcessManager}
    */
   wakeupAllProcess : function()
   {
      this.each(function(process){
         this.wakeupProcess(process);
      }, this);
      return this;
   },
   /**
    * 杀死所有进程
    *
    * @return {WebOs.Kernel.ProcessModel.ProcessManager}
    */
   killAllProcess : function()
   {
      this.each(function(process){
         this.killProcess(process);
      }, this);
      return this;
   },
   /**
    * 根据进程类型结束相关进程
    *
    * @param {String} type
    * @return {WebOs.Kernel.ProcessModel.ProcessManager}
    */
   killProcessByType : function(type)
   {
      //检查类型正确性
      if(!Ext.Array.contains(this.getSupportRunableTypes(), type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'killProcessByType',
            'type : ' + type + ' is not supported'
         );
      }
      this.each(function(process){
         if(type == process.runable.runableType){
            this.killProcess(process);
         }
      }, this);
      return this;
   },
   /**
    * 根据进程的运行级别结束相关进程
    *
    * @param {String} level
    * @return {WebOs.Kernel.ProcessModel.ProcessManager}
    */
   killProcessByRunLevel : function(level)
   {
      var allowTypes = [
         WebOs.Const.RUN_LEVEL_KERNEL,
         WebOs.Const.RUN_LEVEL_USER
      ];
      if(!Ext.Array.contains(allowTypes, level)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'killProcessByRunLevel',
            'level type : ' + level + ' is not supported'
         );
      }
      this.each(function(process){
         if(level == process.runLevel){
            this.killProcess(process);
         }
      }, this);
      return this;
   },
   /**
    * 进程状态变化请求处理函数
    *
    * @param {int} status
    * @param {WebOs.Kernel.ProcessModel.Process} process
    */
   reflectStatusChange : function(status, process){
      var APP = WebOs.Kernel.ProcessModel.App;
      if(process.status == status){
         return;
      }
      switch (status) {
         case APP.S_RUNNING:
            this.wakeupProcess(process);
            break;
         case APP.S_SLEEP:
            this.sleepProcess(process);
            break;
         case APP.S_CLOSE:
            this.killProcess(process);
            break;
      }
   },
   /**
    * 获取可运行实体对象
    *
    * @param {Object} config
    * @return {Cntysoft.Kernel.App.Runable}
    */
   getRunableIntance : function(config)
   {
      var instance;
      var cls;
      cls = this.getClsFromConfig(config);
      var runableConfig = {};
      if(config.type == WebOs.Const.RUN_TYPE_APP){
         runableConfig.meta = {
            module : config.module,
            name : config.name,
            widgets : config.widgets
         };
      } else{
         runableConfig.meta = {
            name : config.name
         };
      }
      runableConfig.invokeConfig = config.invokeConfig;
      //实例是在这里设置 还是在其他地方
      //meta对象里面可能会有事件绑定
      return Ext.create(cls, runableConfig);
   },
   /**
    * 从配置文件获取类的名称， 这个地方可能要设置名称空间
    *
    * @param {Object} config
    * @return {String}
    */
   getClsFromConfig : function(config)
   {
      var P = WebOs.Kernel.ProcessModel.Process;
      var cls;
      var entry = 'Main';//暂时硬编码
      var namespaces = Ext.app.namespaces;
      /**
       * 一般可以运行的实体都必须有个入口文件
       * 名称 : Main
       */
      if(config.type == P.P_TYPE_APP){
         cls = [
            'App',
            config.module,
            config.name,
            entry
         ].join('.');
      } else if(config.type == P.P_TYPE_DAEMON){
         cls = [
            'Daemon',
            config.name,
            entry
         ].join('.');
      }
      return cls;
   },
   /**
    * 获取进程对象
    *
    * @property {WebOs.Kernel.ProcessModel.Process | int} process
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   getProcess : function(process)
   {
      var key;
      if(process instanceof WebOs.Kernel.ProcessModel.Process){
         return process;
      } else if(Ext.isNumber(process)){
         key = this.getProcessIdKey(process);
         process = this.getByKey(key);
         if(Ext.isEmpty(process)){
            return null;
         }
         return process;
      } else{
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getProcess',
            'process must be the type of number or WebOs.Kernel.ProcessModel.Process'
         );
      }
   },
   /**
    * 根据可运行实体名称获取相关的进程对象
    *
    * @param {String} key Runable的识别ID
    * @param {String} type
    * @return {WebOs.Kernel.ProcessModel.Process}
    */
   getProcessByRunableName : function(key, type)
   {
      var runable;
      var target;
      var P = WebOs.Kernel.ProcessModel.Process;
      if(!Ext.Array.contains(P.getSupportProcessTypes(), type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getProcessByRunableName',
            Ext.String.format('type : {0} is not supported', type)
         );
      }

      this.each(function(process){
         runable = process.getRunable();
         if(runable.getRunableType() == type && key == runable.getId()){
            target = process;
            return false;
         }
      });
      return target;
   },
   /**
    * 根据模型和应用程序获取APP对象,查询一个内部的缓存
    *
    * @param {String} module
    * @param {String} name
    * @return {WebOs.Kernel.ProcessModel.App}
    */
   getAppByKey : function(module, name)
   {
      var key = WebOs.Const.RUN_TYPE_APP + '_' + module + '_' + name;
      if(!this.runableRefCache.containsKey(key)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getAppByKey',
            Ext.String.format('App : {0} current is not running', module + '.' + name)
         );
      }
      return this.runableRefCache.get(key);
   },
   /**
    * 根据模型和应用程序获取守护对象， 查询一个内部的缓存
    *
    * @param {String} module
    * @param {String} name
    * @return {WebOs.Kernel.ProcessModel.Daemon}
    */
   getDaemonByKey : function(module, name)
   {
      var key = WebOs.Const.RUN_TYPE_DAEMON + '_' + module + '_' + name;
      if(!this.runableRefCache.containsKey(key)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getDaemonByKey',
            Ext.String.format('Daemon : {0} current is not running', module + '.' + name)
         );
      }
      return this.runableRefCache.get(key);
   },
   /**
    * 判断一个进程是否存在
    *
    * @param {int} | {WebOs.Kernel.ProcessModel.ProcessModel.Process}  process
    * @return {boolean}
    */
   hasProcess : function(process)
   {
      if(Ext.isNumber(process)){
         return this.containsKey(this.getProcessIdKey(process));
      } else if(process instanceof WebOs.Kernel.ProcessModel.ProcessModel.Process){
         return this.contains(process);
      }
      return false;
   },
   /**
    * 获取所有的进程
    *
    * @return array
    */
   getAllProcess : function()
   {
      return this.items;
   },
   /**
    * 获取进程id
    *
    * @param {int} pid
    * @return {String}
    */
   getProcessIdKey : function(pid)
   {
      if(!Ext.isNumber(pid)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getProcessIdKey',
            'process id must be the type of int'
         );
      }
      return 'PID.' + pid;
   },
   /**
    * 绑定系统默认的事件监听函数
    */
   attachDefaultListeners : function()
   {
      /**
      * @todo 这里可以用relay event实现
      */
      this.addListener({
         add : function(index, item){
            //添加一个缓存到RunableCache中
            this.runableRefCache.add(item.runable);
            if(this.hasListeners.processadd){
               this.fireEvent('processadd', item);
            }
         },
         remove : function(process)
         {
            this.runableRefCache.remove(process.runable);
            if(this.hasListeners.processkill){
               this.fireEvent('processkill', process);
            }
         },
         scope : this
      });
   },
   /**
    * 判断当前系统是否可以执行相关指定的Runable
    *
    * @param {String} module
    * @param {String} name
    * @param {String} type
    * @return {Boolean}
    */
   isSysHasRunable : function(module, name, type)
   {
      var P = WebOs.Kernel.ProcessModel.Process;
      var runableKey = module + '.' + name;
      var runables;
      if(!Ext.Array.contains(P.getSupportProcessTypes(), type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'isSysHasRunable',
            Ext.String.format('type : {0} is not supported', type)
         );
      }
      if(type == P.P_TYPE_APP){
         runables = WebOs.getSysEnv().get(WebOs.Const.ENV_APP);
      } else if(type == P.P_TYPE_DAEMON){
         runables = WebOs.getSysEnv().get(WebOs.Const.ENV_DAEMON);
      }
      return runables.containsKey(runableKey);
   },
   /**
    * 获取Runable元信息，这个方法放在这里不知道合适不合适
    *
    * @param {String} key runable的识别ID
    * @param {String} type
    * @return {Object}
    */
   getRunableMetaInfo : function(key, type)
   {
      var C = WebOs.Const;
      var P = WebOs.Kernel.ProcessModel.Process;
      if(!Ext.Array.contains(this.getSupportRunableTypes(), type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getRunableMetaInfo',
            'Runable Type : ' + type + 'is not supported'
         );
      }
      if(type == P.P_TYPE_APP){
         runables = WebOs.getSysEnv().get(C.ENV_APP);
      } else if(type == P.P_TYPE_DAEMON){
         runables = WebOs.getSysEnv().get(C.ENV_DAEMON);
      }
      return;
      metaInfo = runables.getByKey(key);
      /**
       * @todo 在这里是否检查必要字段
       */
      if(Ext.isEmpty(metaInfo)){
         //当前请求的程序的meta信息不存在，证明不能被运行
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getRunableMetaInfo',
            'Runable : ' + key + ' is not exist , or can not be run by current user'
         );
      }
      return metaInfo;
   },
   /**
    * 获取支持的可运行实体类型
    *
    * @return {Array}
    */
   getSupportRunableTypes : function()
   {
      var C = WebOs.Const;
      return [
         C.RUN_TYPE_APP,
         C.RUN_TYPE_DAEMON
      ];
   },
   /**
    * 获取可运行实体配置信息，这些信息都是存放在环境变量里面
    *
    * @param {String} key
    * @param {String} type
    * @return {Object}
    */
   getRunableConfig : function(key, type)
   {
      var info = this.getRunableMetaInfo(key, type);
      //一些默认值
      Ext.applyIf(info, {
         invokeConfig : {},
         processConfig : {},
         runConfig : {},
         hasServer : false,
         showWidgetMenu : false
      });
      return info;
   },
   /**
    * 检查调用元信息是否合法
    *
    * @param {Object} config
    * @return {Boolean}
    */
   checkMetaFields : function(config)
   {
      var requires = null;
      if(config.type == WebOs.Const.RUN_TYPE_APP){
         requires = ['module', 'name'];
      } else{
         requires = ['name'];
      }
      if(!Cntysoft.Stdlib.Object.hasRequireKeys(config, requires)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'checkMetaFields',
            'meta object need require fields'
         );
      }
      return true;
   },
   /**
    * 设置进程，主要给进程和进程管理器绑定事件监听函数
    *
    * @param {WebOs.Kernel.ProcessModel.Process} process
    */
   setupProcess : function(process)
   {
      /**
       * 绑定一个处理进程运行事件的处理器
       */
      process.addListener('exetime', this.processRuntimeHandler, this);
   },
   /**
    * 进程运行时间处理器
    *
    * @param {Cntysoft.Process.ProcessModel.Process} process
    * @param {int} minute
    */
   processRuntimeHandler : function(process, minute)
   {
      if(this.hasListeners.notifytime){
         this.fireEvent('notifytime', process, minute);
      }
   },
   /**
    * 资源清除
    */
   destroy : function()
   {
      this.clearListeners();
      this.each(function(process){
         process.kill();
      });
      this.runableRefCache.clear();
      delete this.runableRefCache;
      delete this.ExtAppNs;
      this.clear();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Init',{
   requires : [
      'Cntysoft.Kernel.SysEnv',
      'Cntysoft.Kernel.StdPath',
      'WebOs.Kernel.Const',
      'WebOs.Lang.zh_CN',
      'WebOs.Kernel.ProcessModel.ProcessManager'
   ],
   mixins : {
      observable : 'Ext.util.Observable'
   },
   /**
    * 系统准备初始化，加载文件
    *
    * @property {number} SYS_INIT
    */
   SYS_INIT : 1,
   /**
    * 系统验证完成，进入桌面环境
    *
    * @property {number} SYS_AUTH
    */
   SYS_AUTH :  2,
   /**
    * 进入桌面, 拉取用户信息
    *
    *  @property {number} SYS_RETRIEVE_USER_INFO
    */
   SYS_RETRIEVE_USER_INFO : 3,

   /**
    * @property {number} SYS_RENDER_WEBOS
    */
   SYS_RENDER_WEBOS : 4,
   /**
    * 系统初始化完成
    *
    * @property {number} SYS_READY
    */
   SYS_READY : 5,

   /**
    * 系统进程管理器
    *
    * @property {WebOs.Kernel.ProcessModel.ProcessManager} processManager
    */
   processManager : null,
   /**
    * 系统是否已经就绪 , 一些地方可能需要判断一下
    * 在系统桌面就绪的时候值被系统设置成
    *
    * @property {boolean} sysReady
    */
   sysReady : false,

   /**
    * 系统主题结构渲染完成
    *
    * @private
    * @property {Boolean}
    */
   sysUiReady : false,

   /**
    * 系统环境变量
    *
    * @property {Cntysoft.Kernel.SysEnv} sysEnv
    */
   sysEnv : null,

   constructor : function()
   {
      this.mixins.observable.constructor.call(this);
      //建立一个别名
      this.processManager = new WebOs.Kernel.ProcessModel.ProcessManager();
      //实例化系统环境变量
      this.sysEnv = new Cntysoft.Kernel.SysEnv();
      this.attachDefaultListeners();
      this.init();
   },

   init : function()
   {
      if(this.hasListeners.beforeinit){
         this.fireEvent('beforeinit');
      }
      this.initGlobalRef();
      this.initLang();
      this.updateLoadMsg(this.SYS_INIT);
      //this.setupSysEventHandlers();
      this.initRunableReg();
      if(this.hasListeners.afterinit){
         this.fireEvent('afterinit');
      }
   },
   /**
    * @template
    */
   initLang : function()
   {
      var cls = 'WebOs.Lang.'+this.language;
      var lang = Ext.create(cls);
      Cntysoft.LangManager.register('WebOs', lang);
      //内部使用
      WebOs.GET_LANG_TEXT = Ext.Function.alias(lang, 'getText');
   },

   initGlobalRef : function()
   {
      var alias =  Ext.Function.alias;
      Ext.apply(WebOs,{
         PM : alias(this, 'getProcessManager'),
         getSysEnv : alias(this, 'getSysEnv'),
         isReady : alias(this, 'isReady'),
         showLoadScriptMask : alias(Cntysoft, 'showLoadScriptMask'),
         hideLoadScriptMask : alias(Cntysoft, 'hideLoadScriptMask'),
         getLangType : alias(this, 'getLangType'),
         ME : this,
         login : alias(this, 'login'),
         loginByCookie : alias(this, 'loginByCookie'),
         updateLoadMsg : alias(this, 'updateLoadMsg'),
         hideLoadMsg : alias(this, 'hideLoadMsg'),
         removeLoadMsg : alias(this, 'removeLoadMsg'),
         getSysUrl : alias(this, 'getSysUrl')
      });
   },

   //几个钩子函数
   login : Ext.emptyFn,
   loginByCookie : Ext.emptyFn,

   setupSysEventHandlers : function()
   {
      /**
       * 不知道为什么这个事件绑定不上
       */
      window.onbeforeunload = function(){
         return Cntysoft.LangManager.getLang('System').getText('MSG.SYS_RELOAD_INFO');
      };
   },

   /**
    * 初始化可运行对象注册表
    */
   initRunableReg : function()
   {
      var U = Cntysoft.Utils.Common;
      var keyFn = function(config){
         return config.module + '.' + config.name;
      };
      //系统内置的一些程序
      this.sysEnv.set(
         WebOs.Const.ENV_APP,
         U.generateCollection(this.getBootstrapApps(), keyFn)
      );
      this.sysEnv.set(
         WebOs.Const.ENV_DAEMON,
         U.generateCollection(this.getBootstrapDeamons(), function(item){
            return item.name;
         })
      );
   },
   /**
    * 获取语言类型
    *
    * @return {String}
    */
   getLangType : function()
   {
      return this.language;
   },

   /**
    * @returns {Array}
    */
   getLangTypes : function()
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
   getLoadMsg : function(stage)
   {
      if(0 == stage){
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
   updateLoadMsg : function(stage)
   {
      var msg = this.getLoadMsg(stage) + '...';
      Ext.fly('loading-msg').update(msg);
   },

   /**
    * 删除系统引导过程中的loadMsg对象
    *
    * @private
    */
   removeLoadMsg : function()
   {
      Ext.fly('loading').remove();
      Ext.fly('loading-mask').remove();
   },

   /**
    * 隐藏loadMsg
    *
    * @private
    */
   hideLoadMsg : function()
   {
      Ext.fly('loading-mask').hide();
   },
   /**
    * 显示loadMask
    *
    * @private
    */
   showLoadMsg : function(msg)
   {
      Ext.fly('loading-mask').show();
   },
   /**
    * 获取系统引导过程中的守护进程
    *
    * @return String[]
    */
   getBootstrapDeamons : function()
   {
      return [{
         name : 'Init'
      },{
         name : 'Kernel'
      }];
   },
   /**
    * 获取系统默认的APP列表
    */
   getBootstrapApps : function()
   {
      return [{
         name : 'Login',
         module : 'Sys',
         icon : false,
         hasServer : true,
         type : 'App',
         showWidgetMenu : false,
         showOnDesktop : false
      }, {
         name : 'SysUiRender',
         module : 'Sys',
         icon : false,
         hasServer : false,
         type : 'App',
         runConfig : {
            type : 3
         },
         showOnDesktop : false
      }];
   },

   getProcessManager : function()
   {
      return this.processManager;
   },

   run : function()
   {
      ////派发系统级别程序或者Daemon
      this.createInitRunable();
      if(this.hasListeners.run){
         this.fireEvent('run', this);
      }
   },

   /**
    * 创建系统级别的默认的程序或者守护进程
    */
   createInitRunable : function()
   {
      //派发登录进程
      //系统进程通信相关的进程

      WebOs.PM().runDaemon({
         name : 'Init'
      });
   },

   /**
    * 获取环境变量对象
    *
    * @returns {Cntysoft.Kernel.SysEnv}
    */
   getSysEnv : function()
   {
      return this.sysEnv;
   },
   /**
    * 获取系统完成变量
    *
    * @returns {Boolean}
    */
   isReady : function()
   {
      return this.sysReady;
   },
   /**
    * 获取系统服务器url
    *
    * @return {string} url
    */
   getSysUrl : function()
   {
      var urlInfo = Cntysoft.Global.getDomainInfo();
      return urlInfo.domain;
   },

   /**
    * 添加一些默认的事件处理函数
    */
   attachDefaultListeners : function()
   {
      //对于程序加载提示符只需要在桌面准备好之后才可以用
      //所以在这里用事件保证
      this.addListener({
         desktopready : {
            fn : this.desktopReadyHandler,
            scope : this
         }
      });
   },

   /**
    * 进程一些桌面准备的好的事件处理函数
    */
   desktopReadyHandler : function()
   {
      this.hideLoadMsg();
      this.sysReady = true;
   },

   /**
    * 获取指定APP的语言类的名称
    *
    * @param {String} module 模块名称
    * @param {String} name APP名称
    * @param {String} type 可运行的类型
    * @return {String}
    */
   getRunableLangCls : function(module, name, type)
   {
      if(type !== WebOs.Const.RUN_TYPE_APP && type !== WebOs.Const.RUN_TYPE_DAEMON){
         Cntysoft.raiseError(Ext.getClassName(this), 'getAppLangCls', 'runable type : ' + type + ' is not supported');
      }
      return [type, module, name, 'Lang', WebOs.getLangType()].join('.');
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统用户接口组件,能派发事件，但是上层系统依赖
 */
Ext.define('WebOs.Kernel.ProcessModel.AbstractWidget', {
   extend : 'WebOs.Component.Window',
   inheritableStatics : {
      /**
       * widget只需要这两个状态
       */
      S_RUNNING : 1,
      S_SLEEP : 2,
      S_INIT : 3
   },
   /**
    * widget关联的程序
    *
    * @property {WebOs.Kernel.ProcessModel.App} application
    */
   application : null,
   /**
    * widget管理器
    *
    * @property {WebOs.Kernel.ProcessModel.WidgetManager} widgetManager
    */
   widgetManager : null,
   /**
    * widget状态
    *
    * @property {int} status
    */
   status : -1,
   /**
    * 关联的任务栏按钮
    *
    * @property {Cntysoft.SysUi.OsWidget.TaskButton} taskButton
    */
   taskButton : null,
   /**
    * 显示在任务栏按钮的数据
    *
    * @property {String} taskButtonText
    */
   taskButtonText : '',
   /**
    * widget名称，这个名称必须在APP范围内唯一
    *
    * @property {String} name
    */
   name : '',
   /**
    * 判断是否提供zindex值变化的监听能力
    *
    * @property {Boolean} hasZindexEventProvide
    */
   hasZindexEventProvide : true,
   /**
    * APP的语言对象
    *
    * @property {Cntysoft.Kernel.AbstractLangHelper} lang
    */
   lang : null,
   /**
    * 进程管理相关的数据
    *
    * @property {Object} pmText
    */
   pmText : null,
   /**
    * @property {Object} LANG_TEXT 语言对象
    */
   LANG_TEXT : null,
   /**
    * @property {Boolean} moving 判断窗口是否移动
    */
   moving : false,
   /**
    * @param {Cntysoft.SysUi.OsWidget.VirtualDesktop} vdesktop
    */
   vdesktop : null,
   /**
    * 构造函数
    *
    * @param {object} config
    */
   constructor : function(config)
   {
      config = config || {};
      this.applyConstraintConfig(config);
      //这个版本对frame 支持有问题
      //检查application是否设置
      if(!(config.application instanceof WebOs.Kernel.ProcessModel.App)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'config must have application field and must be the type of WebOs.Kernel.ProcessModel.App'
         );
      }
      /**
       * statuschange
       */
      Ext.apply(this, {
         application : config.application
      });
      delete config.application;
      this.initLangTextRef();
      this.callParent([config]);
      this.status = this.self.S_INIT;
   },
   /**
    * 初始化语言引用, 这个方法很重要， 在很多时候，子类中的构造函数获取语言的时候，但是application引用还没有建立
    * 导致调用失败
    *
    * @template
    */
   initLangTextRef : Ext.emptyFn,
   /**
    * 初始化组件
    */
   initComponent : function()
   {
      /**
       * zindexchange
       */
      this.attachDefaultListeners();
      this.callParent();
   },
   /**
    * 强制设置组件的配置属性，因为有的时候配置信息不想被外界改变
    *
    * @protected
    * @template
    * @param {Object} config
    */
   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         layout : 'fit',
         bodyStyle : 'background:#ffffff',
         minimizable : true,
         bodyPadding : 1,
         closable : true,
         hidden : false,
         constrain : true,
         constrainTo : Ext.get('WEBOS_V_DESKTOP')
      });
   },
   /**
    * @see {Cntysoft.Kernel.AbstractLangHelper#getText}
    */
   GET_LANG_TEXT : function(key)
   {
      return this.application.GET_LANG_TEXT(key);
   },
   /**
    * 获取进行相关的数据
    *
    * @param {String} key APP的widget映射键值
    * @return {Object}
    */
   GET_PM_TEXT : function(key)
   {
      var key = 'PM_TEXT.' + key;
      return this.GET_LANG_TEXT(key);
   },
   /**
    * @return {WebOs.Kernel.ProcessModel.App}
    */
   getApplication : function()
   {
      return this.application;
   },
   /**
    * 获取当前APP的权限树对象
    *
    * @return {Object}
    */
   getPermissionTree : function()
   {
      return this.application.permissionTree;
   },
   /**
    * 代理APP中同名方法
    *
    * @return {Boolean}
    */
   hasPermission : function(key)
   {
      return this.application.hasPermission(key);
   },
   /**
    * @param {String} key
    * @return {Object}
    */
   getPermissionNode : function(key)
   {
      return this.application.getPermissionNode(key);
   },
   /**
    * 获取当前widget状态
    *
    * @return {int}
    */
   getStatus : function()
   {
      return this.status;
   },
   /**
    * 处理Widget关闭
    */
   doClose : function(callback, scope)
   {
      this.fireEvent('close', this);
      this.destroy();
   },
   show : function(config, animate, callback, scope)
   {
      if(animate){
         callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
         scope = scope || this;
         if(!this.moving){
            this.moving = true;
            this.setupBeforeShow(config);
            var me = this;
            this.callParent([this.animTarget, function(){
               callback.call(this);
               me.moving = false;
            }, scope]);
         }
      } else{
         this.moving = false;
         this.setupBeforeShow(config);
         this.callParent();
      }
   },
   /**
    * 钩子函数， 在widget显示之前设置widget相关数据
    */
   setupBeforeShow : Ext.emptyFn,
   /**
    * 关闭widget
    */
   close : function()
   {
      if(this.fireEvent('beforeclose', this) !== false){
         this.application.selfOperation = true;
         //请求APP进行widget窗口关闭
         this.application.closeWidget(this.name);
      }
   },
   /**
    * 提供派发zindex改变的事件
    *
    * @param {int} index
    */
   setZIndex : function(index)
   {
      if(this.hasListeners.zindexchange){
         this.fireEvent('zindexchange', index);
      }
      return this.callParent([index]);
   },
   /**
    * 添加一些默认的事件处理器
    */
   attachDefaultListeners : function()
   {
      //这些都是与状态有关的事件
      //因为我们在TaskBar的上下文菜单上没有还原按钮
      //所有这里没有处理restore事件
      this.addListener({
         minimize : this.minimizeHandler,
         show : this.showHandler,
         activate : this.activateHandler,
         afterrender : this.setWidgetPmTextHandler,
         scope : this
      });
   },
   /**
    * widget最小化处理函数
    *
    * @param {WebOs.Kernel.ProcessModel.AbstractWidget} widget
    */
   minimizeHandler : function(widget)
   {
      //请求APP进行关闭
      this.application.selfOperation = true;
      this.application.hideWidget(widget.name, true);
   },
   /**
    * 隐藏widget窗口
    *
    * @param {Boolean} animation 是否需要动画
    */
   doMinimize : function(animation)
   {
      if(animation){
         if(!this.moving){
            this.moving = true;
            this.hide(this.animTarget, function(){
               if(this.hasListeners.statuschange){
                  this.fireEvent('statuschange', this, this.status);
               }
               this.taskButton.toggle(false);
               this.moving = false;
            }, this);

         }
      } else{
         this.hide(false);
         if(this.hasListeners.statuschange){
            this.fireEvent('statuschange', this, this.status);
         }
         this.moving = false;
         this.taskButton.toggle(false);
      }
   },
   /**
    * 处理widget显示事件
    */
   showHandler : function()
   {
      this.status = this.self.S_RUNNING;
      if(this.hasListeners.statuschange){
         this.fireEvent('statuschange', widget, this.status);
      }
      this.taskButton.toggle(true);
   },
   /**
    * 窗口激活事件处理器
    */
   activateHandler : function()
   {
      this.taskButton.toggle(true);
   },
   /**
    * 设置widget进程模型相关的Text
    */
   setWidgetPmTextHandler : function()
   {
      //如果没有设置的话默认使用
      if(undefined == this.title){
         //设置title
         this.setTitle(this.pmText.WIDGET_TITLE);
      }
      if('' == this.taskButtonText){
         this.taskButtonText = this.pmText.TASK_BTN_TEXT;
         this.taskButton.setText(this.taskButtonText);
      }
   },
   /**
    * 资源清除
    */
   destroy : function()
   {
      delete this.application;
      delete this.taskButton;
      delete this.animTarget;
      delete this.widgetManager;
      delete this.LANG_TEXT;
      this.callParent();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统APP基类, 所有在WEBOS上运行的APP都是继承于这个类
 *
 * 一个APP有自己的标准结构
 *     |- Ui              //这里面一般存放一些复杂的界面逻辑代码
 *     |- Image        //这里面存放APP使用的一些图片
 *     |- Css            //这里面存放APP使用的样式文件
 *     |- Widget      //这个里面存放了APP所有的可调度的窗体程序， 这个相当于APP中的线程
 *     |- Comp        //一般存放APP自定义的一些UI组建
 *     |- Main.js      //APP入口程序，没有APP必须有的文件
 */
Ext.define('WebOs.Kernel.ProcessModel.App', {
   extend : 'WebOs.Kernel.ProcessModel.Runable',
   requires : [
      'Cntysoft.Utils.Common',
      'Cntysoft.Stdlib.Object'
   ],
   mixins : {
      callApp : 'Cntysoft.Mixin.CallApp'
   },
   /**
    * 是否未App对象
    *
    * @property {Boolean} isApp
    */
   isApp : true,
   /**
    * @property {String} runableType
    */
   runableType : 'App',
   /**
    * 程序可视化组建管理器
    *
    * @property {WebOs.Kernel.ProcessModel.WidgetManager} widgetManager
    */
   widgetManager : null,
   /**
    * 程序组建映射数据
    *
    * @property {Object} widgetMap
    */
   widgetMap : {},
   /**
    * widget对象映射数据
    *
    * @property {Ext.util.HashMap} widgets
    */
   widgets : null,
   /**
    * 子widget通信机制
    *
    * @property {Object} dataPool
    */
   dataPool : {},
   /**
    * 事件上浮开关，很重要防止死循环,由函数调用主动操作的时候这个上报开关是需要关闭的
    *
    * @property {Boolean} selfOperation
    */
   selfOperation : true,
   /**
    * 是否自己激活
    *
    * @property {Boolean} selfWakeup
    */
   selfWakeup : false,
   /**
    * 应用程序用来缓存一些异步数据的对象
    *
    * @property {Ext.util.HashMap} cache
    */
   cache : null,
   /**
    * 系统权限数据
    *
    * @property {Object} permissionTree
    */
   permissionTree : null,
   /**
    * 构造函数
    *
    * @param {Object} config
    */
   constructor : function(config)
   {
      //设置权限项
      var permissions = WebOs.getSysEnv().get(WebOs.Const.ENV_ACL);
      if(permissions && permissions.hasOwnProperty(this.id)){
         this.permissionTree = permissions[this.id];
      }
      this.widgets = new Ext.util.HashMap({
         keyFn : function(widget){
            return widget.name;
         }
      });
      this.callParent([config]);
      this.setupApp();
      this.cache = new Ext.util.HashMap();
   },
   /**
    * 设置app对象，APP初始化钩子函数
    */
   setupApp : function()
   {
   },
   /**
    * @inheritdoc
    */
   setupIdHandler : function()
   {
      var ids = this.id.split('.');
      this.module = ids[0];
      this.name = ids[1];
   },

   /**
    * @template
    * @return string
    */
   getLangCls : function()
   {
      return [WebOs.Const.RUN_TYPE_APP, this.module, this.name, 'Lang', WebOs.getLangType()].join('.');
   },
   /**
    * 进程模型钩子函数
    * 运行程序接口
    *
    * @param {Object} runConfig
    * @return {Web.Kernel.ProcessModel.App}
    */
   run : function(runConfig)
   {
      var apiName;
      var apiParams = [];
      var callback;
      var scope;
      this.callParent([runConfig]);
      if(!Ext.isEmpty(runConfig) && !Ext.isEmpty(runConfig.widgetName)){
         if(undefined == this.widgetMap[runConfig.widgetName]){
            Cntysoft.raiseError(
               Ext.getClassName(this),
               'run',
               'Widget : ' + runConfig.widgetName + ' is not exist'
            );
         }
         //暂时不传递参数
         this.showWidget(runConfig.widgetName, runConfig.widgetConfig);
         if(undefined === this.process.$_invoke_type_$){
            this.process.$_invoke_type_$ = Ext.getClass(this.process).I_TYPE_WIDGET;
         }
         return;
      }
      if(undefined === this.process.$_invoke_type_$){
         this.process.$_invoke_type_$ = Ext.getClass(this.process).I_TYPE_API;
      }
      //为了调用功能
      /**
       * 刚开始准备写一个派发的接口，但是想想还是不这样为好，应为应用程序里面的lib类还是不要直接被外界所调用，
       * 一 不方便
       * 二 应用程序对外的接口应该通过Main类对外公开
       * 所以综上所述 还是直接调用这个里面的函数吧
       *
       * 被调用的API一般最后两个参数是回调函数和回调函数的作用域
       */
      if(!Ext.isDefined(runConfig.apiName)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'run',
            'you call APP`s API, but have no API Name in runConfig'
         );
      }
      apiName = runConfig.apiName;
      if(!Ext.isDefined(this[apiName]) || !Ext.isFunction(this[apiName])){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'run',
            'Api : ' + apiName + ' is not exist or is not a function'
         );
      }
      if(Ext.isDefined(runConfig.apiParams) && Ext.isArray(runConfig.apiParams)){
         //只接受
         apiParams = runConfig.apiParams;
      }
      callback = runConfig.callback || Ext.emptyFn;
      scope = runConfig.scope || this;
      //最后两个参数是callback 和 作用域 这个是用于通知调用者的
      apiParams.push(callback, scope);
      this.isApiInvoke = true;
      this[apiName].apply(this, apiParams);
   },
   /**
    * 获取权限数据
    *
    * @return {Array}
    */
   getAclData : function()
   {
      return this.sysEnv.get(WebOs.Const.ENV_ACL);
   },
   /**
    * 系统进程模型钩子函数
    * 杀死进行钩子函数
    *
    * @return {Web.Kernel.ProcessModel.App}
    */
   kill : function()
   {
      this.selfOperation = false;
      this.widgets.each(function(name){
         this.closeWidget(name);
      }, this);
      this.selfOperation = true;
      this.callParent();
      return this;
   },
   /**
    * 进程模型钩子函数
    * 激活程序
    *
    * @return {Web.Kernel.ProcessModel.App}
    */
   wakeup : function()
   {
      this.selfOperation = false;
      if(!this.selfWakeup){
         this.widgets.each(function(name){
            this.showWidget(name, {}, true);
         }, this);
      }
      this.selfWakeup = false;
      this.selfOperation = true;
      this.callParent();
      return this;
   },
   /**
    * 系统进程模型钩子函数
    * 休眠程序
    *
    * @return {Web.Kernel.ProcessModel.App}
    */
   sleep : function()
   {
      this.selfOperation = false;
      this.widgets.each(function(name){
         this.hideWidget(name, true);
      }, this);
      this.selfOperation = true;
      this.callParent();
   },
   /**
    * 获取APP本身的权限树
    *
    * @return {Object}
    */
   getPermissionTree : function()
   {
      return this.permissionTree;
   },
   /**
    * 判断是否具有指定的权限
    *
    * @param {String} key 需要检查的权限键
    * @return {Boolean}
    */
   hasPermission : function(key)
   {
      return Cntysoft.Stdlib.Object.hasKeyPath(this.permissionTree, key);
   },
   /**
    * 根据权限路径， 获取子权限对象
    *
    * @param {String} key
    * @return {Object}
    */
   getPermissionNode : function(key)
   {
      return Cntysoft.Stdlib.Object.followPath(this.permissionTree, key);
   },
   /**
    * 获取属于widget对象
    *
    * @param {String} name
    * @param {Object} config
    * @param {Boolean} sync 是否为同步
    * @param {Function} callback 一部获取回调函数 参数为widget, isExist
    */
   getWidget : function(name, config, sync, callback, scope)
   {
      config = config || {};
      sync = Ext.isBoolean(sync) ? sync : true;
      callback = callback || Ext.emptyFn;
      scope = scope || this;
      if(undefined != (widget = this.widgets.get(name)) &&
         widget instanceof WebOs.Kernel.ProcessModel.AbstractWidget){
         //存在而且对象的类型符合要求
         if(sync){
            return widget;
         }
         callback.call(scope, widget, true);
         return;
      }
      //创建新的widget对象
      if(!Ext.isEmpty(this.widgetMap[name])){
         var cls = this.widgetMap[name];
         Ext.apply(config, {
            application : this,
            listeners : {
               close : this.widgetCloseHandler,
               scope : this
            }
         });
         WebOs.showLoadScriptMask();
         Ext.require(cls, function(){
            Cntysoft.hideLoadScriptMask();
            widgetObject = Ext.create(this.widgetMap[name], config);
            if(!(widgetObject instanceof WebOs.Kernel.ProcessModel.AbstractWidget)){
               Cntysoft.raiseError(
                  Ext.getClassName(this),
                  'getWidget',
                  'widgetObject must be instanceof of Web.Kernel.ProcessModel.AbstractWidget'
               );
            }
            this.setupWidget(name, widgetObject);
            this.widgets.add(widgetObject);
            callback.call(scope, widgetObject, false);
         }, this);
      } else{
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getWidget',
            'widget :' + name + ' is not exist'
         );
      }
   },
   /**
    * 检查widget一些配置项，赋予一些默认值
    *
    * @param {String} name
    * @param {Web.Kernel.ProcessModel.AbstractWidget} widget
    */
   setupWidget : function(name, widget)
   {
      //赋予widget名称
      if('' == Ext.String.trim(widgetObject.name)){
         widgetObject.name = name;
      }
   },
   /**
    * 显示一个widget
    *
    * @param {String} name
    * @param {String} config
    * @param {String} animation 是否需要动画
    * @param {Object} 回调函数集合
    * @return {Web.Kernel.ProcessModel.App}
    */
   showWidget : function(name, config, animation, callbacks)
   {
      config = config || {};
      callbacks = callbacks || {};
      this.getWidget(name, config, false, function(widget, isExist){
         var beforeShowHandler = Ext.isFunction(callbacks.beforeShowHandler) ? callbacks.beforeShowHandler : Ext.emptyFn;
         var afterShowHandler = Ext.isFunction(callbacks.afterShowHandler) ? callbacks.afterShowHandler : Ext.emptyFn;
         var scope = callbacks.scope ? callbacks.scope : this;
         var taskButton;
         var W = WebOs.Kernel.ProcessModel.AbstractWidget;
         if(undefined == widget.taskButton){
            taskButton = this.self.TASK_BAR.addTaskButton({
               id : this.process.pid + '_' + widget.name,
               widget : widget
            });
            this.setTaskButton(widget, taskButton);
         }
         widget.addListener('beforeshow', function(){
            beforeShowHandler.call(scope, widget);
         }, this, {
            single : true
         });
         widget.addListener('show', function(){
            afterShowHandler.call(scope, widget);
         }, this, {
            single : true
         });
         if(widget.status !==  W.S_RUNNING && !widget.moving){
            if(isExist){
               //如果窗口存在则进行相关的处理
               //唉 架构决定多窗口 很不好处理 临时的解决方案
               var widgetExistHandler = config.widgetExistHandler || Ext.emptyFn;
               var scope = config.scope || {};
               widgetExistHandler.call(scope, widget);
            }
            //console.log(widget.name + ' before show:'+widget.status);
            widget.show(config, animation);
            widget.status = W.S_RUNNING;
            //console.log(widget.name + ' after show:'+widget.status);
            if(this.selfOperation){
               //自身操作才需要检查状态
               this.checkRuntimeStatus();
            }
         }else if(widget.status ==  W.S_RUNNING && widget != Ext.WindowManager.getActive()){
            widget.toFront();
         }
      }, this);
   },
   /**
    * 隐藏weiget窗口
    *
    * @param {String} name
    * @param {String} animation 是否需要动画
    * @return {Web.Kernel.ProcessModel.App}
    */
   hideWidget : function(name, animation)
   {
      var widget = this.getWidget(name),
         W = WebOs.Kernel.ProcessModel.AbstractWidget;
      if(widget.status !==  W.S_SLEEP &&  !widget.moving){
         //console.log(widget.name + ' before hide:'+widget.status);
         widget.doMinimize(animation);
         widget.status = W.S_SLEEP;
         //console.log(widget.name +  ' after hide:'+widget.status);
         if(this.selfOperation){
            //自身操作才需要检查状态
            this.checkRuntimeStatus();
         }
      }

      return this;
   },
   /**
    * 关闭widget窗口
    *
    * @param {String} name
    * @return {Web.Kernel.ProcessModel.App}
    */
   closeWidget : function(name)
   {
      var widget = this.getWidget(name);
      this.widgets.remove(widget);
      if(this.selfOperation){
         //自身操作才需要检查状态
         this.checkRuntimeStatus();
      }
      widget.doClose();
   },
   /**
    * 检查新的状态，如果和原来的状态不一样则通知PM
    */
   checkRuntimeStatus : function()
   {
      var status = this.getRuntimeStatus();
      if(status != this.status){
         this.selfOperation = true;
         WebOs.PM().reflectStatusChange(status, this.process);
         if(this.hasListeners.statuschange){
            this.fireEvent('statuschange', this, this.status, status);
            this.status = status;
         }
      }
   },
   /**
    * 获取应用程序运行时状态，通过检查所有的widget状态得到
    *
    * @return {boolean}
    */
   getRuntimeStatus : function()
   {
      var status = -1;
      var APP = WebOs.Kernel.ProcessModel.App;
      W = WebOs.Kernel.ProcessModel.AbstractWidget;
      var running = false;
      if(0 == this.widgets.getCount()){
         status = APP.S_CLOSE;
      } else{
         this.widgets.each(function(widgetName, widget){
            if(widget.status == W.S_RUNNING){
               running = true;
            }
         });
         if(running){
            status = APP.S_RUNNING;
         } else{
            status = APP.S_SLEEP;
         }
      }
      return status;
   },
   /**
    * 子widget通信接口
    *
    * @param {String} key
    *
    * @return {Object}
    */
   getData : function(key)
   {
      return this.dataPool[key];
   },
   /**
    * 子widget通信接口
    *
    * @param {String} key
    * @param {Object} value
    * @return {Web.Kernel.ProcessModel.App}
    */
   setData : function(key, value)
   {
      this.dataPool[key] = value;
      return this;
   },

   /**
    * widget manager状态改变处理函数
    *
    * @param {int} status
    */
   statusChangeHandler : function(status)
   {
      //在这里只能请求进程管理器进行实际的操作
      //这样做是为了防止死循环
      if(this.openReflection){
         WebOs.PM().reflectStatusChange(status, this.process);
      }
   },
   /**
    * widget关闭处理器
    *
    * @param {Cntysoft.Process.ProcessModel.Process} widget
    */
   widgetCloseHandler : function(widget)
   {
      var S = this.self;
      S.TASK_BAR.removeTaskButton(widget.taskButton.id);
   },
   /**
    * 给widget窗口设置关联的任务栏按钮
    *
    * @param {String} widgetName
    * @param {Ext.dom.Element} target
    */
   setTaskButton : function(widget, taskButton)
   {
      widget.taskButton = taskButton;
      //保证资源释放
      //为了响应快速 不使用动画
      widget.on('show', function(){
         this.animTarget = taskButton.el;
      }, widget, {
         single : true
      });
   },
   /**
    * 资源清除
    */
   destroy : function()
   {
      delete this.permissionTree;
      this.widgets.clear();
      Ext.destroy(this.widgets);
      delete this.widgets;
      this.cache.clear();
      this.cache = null;
      delete this.cache;
      this.callParent();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统守护进程基础功能类
 */
Ext.define('WebOs.Kernel.ProcessModel.Daemon', {
   extend : 'WebOs.Kernel.ProcessModel.Runable',
   mixins : {
      callSys : 'Cntysoft.Mixin.CallSys'
   },
   /**
    * @inheritdoc
    */
   runableType : 'Daemon',
   /**
    * 用在不可靠的类型判断
    */
   isRunable : true,
   /**
    * @inheritdoc
    */
   scriptName : 'DaemonGateway',
   /**
    * 任务启动器,有的守护进程不需要任务启动器
    *
    * @property {Ext.util.TaskRunner} taskRunner
    */
   taskRunner : null,
   /**
    * 该守护进程的开启的任务集合,方便可能需要进行任务对象的引用
    *
    * @property {Ext.util.MixedCollection} tasks
    */
   tasks : null,
   /**
    * 构造函数
    *
    * @param {object} config
    */
   constructor : function(config)
   {
      var me = this;
      me.callParent([config]);
      this.tasks = new Ext.util.MixedCollection();
      if(this.hasLangText){
         this.LANG_TEXT = this.GET_LANG_TEXT();
      }
      me.setupDaemon();
   },
   /**
    * 设置守护进程钩子函数
    */
   setupDaemon : Ext.emptyFn,
   /**
    * @inheritdoc
    */
   getLangCls : function()
   {
      return [WebOs.Const.RUN_TYPE_DAEMON, this.name, 'Lang', WebOs.getLangType()].join('.');
   },
   /**
    * @inheritdoc
    */
   setupIdHandler : function()
   {
      this.name = this.id;
   },

   /**
    * @inheritdoc
    */
   run : function(runConfig)
   {
      this.callParent([runConfig]);
      this.setupTask();
   },
   /**
    * 调用守护进程的API
    *
    * @param {String} method API的名称
    * @param {Array} params API调用的相关参数
    */
   callService : function(method, params, callback, scope)
   {
      //这里是对callSys的简单封装
      this.callSys('dispatcherRequest',{
         key : this.name,
         method : method,
         args : params
      }, callback, scope);
   },
   /**
    * 获取指定名称的人物对象
    *
    * @return {Ext.util.TaskRunner.Task}
    */
   getTask : function(name)
   {
      return this.tasks.get(name);
   },
   /**
    * 创建新的任务对象
    *
    * @param {String} name 任务名称
    * @param {Object} config
    * @return {Ext.util.TaskRunner.Task}
    */
   createTask : function(name, config, autoStart)
   {
      var runner = this.getTaskRunner();
      var task;
      var autoStart = !!autoStart;
      task = runner.newTask(config);
      this.tasks.add(name, task);
      if(autoStart){
         task.start();
      }
      return task;
   },
   /**
    * 获取任务管理器
    *
    * @return {Ext.util.TaskRunner}
    */
   getTaskRunner : function()
   {
      if(null == this.taskRunner){
         this.taskRunner = new Ext.util.TaskRunner();
      }
      return this.taskRunner;
   },
   /**
    * 这个钩子函数用于设置守护进程的相关任务
    */
   setupTask : Ext.emptyFn,
   /**
    * @inheritdoc
    */
   destroy : function()
   {
      this.callParent();
      if(this.taskRunner){
         this.taskRunner.destroy();
      }
      this.tasks.clear();
      this.tasks.clearListeners();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统标准的处理函数，可以在系统的很多地方都会调用，集中在一个地方处理比较方便
 */
Ext.define('WebOs.Kernel.StdHandler',{
   statics : {
      CODE_MAP : {
         RUN_APP : 1,
         SHOW_DESKTOP : 2,
         ADD_FAVORITE : 3,
         OPEN_APP_SHOP : 4,
         SYS_SETTING : 5,
         CONTROLL_PANEL : 6,
         OPEN_DOC : 7,
         ADVANCE : 8,
         BBS : 9,
         WEIBO : 10,
         ABORT_CNTYSOFT : 11,
         LOGOUT : 12,
         LOCK_SYS : 13,
         TILE_WINDOW : 14,
         CASCADE_WINDOW : 15,
         SHOW_APP_INFO : 16,
         MOVE_ICON : 17,
         CHANGE_WALLPAPER : 18,
         GOTO_FRONT : 19,
         MV_APP_TO_VD : 20
      }
   },
   constructor : function()
   {
      var CM = this.self.CODE_MAP;
      var AM = {};
      AM[CM.RUN_APP] = this.runApp;
      //AM[CM.SHOW_DESKTOP] = this.showDesktop;
      //AM[CM.ADD_FAVORITE] = this.addFavorite;
      //AM[CM.OPEN_APP_SHOP] = this.openAppShop;
      //AM[CM.SYS_SETTING] = this.sysSetting;
      //AM[CM.CONTROLL_PANEL] = this.openControllPanel;
      //AM[CM.OPEN_DOC] = this.openDoc;
      //AM[CM.ADVANCE] = this.advance;
      //AM[CM.BBS] = this.bbs;
      //AM[CM.WEIBO] = this.weibo;
      //AM[CM.ABORT_CNTYSOFT] = this.about;
      //AM[CM.LOGOUT] = this.logout;
      //AM[CM.LOCK_SYS] = this.lockSys;
      //AM[CM.TILE_WINDOW] = this.tileWindow;
      //AM[CM.CASCADE_WINDOW] = this.cascadeWindow;
      //AM[CM.SHOW_APP_INFO] = this.showAppInfo;
      //AM[CM.MOVE_ICON] = this.moveIcon;
      //AM[CM.CHANGE_WALLPAPER] = this.changeWallPaper;
      //AM[CM.GOTO_FRONT] = this.gotoFront;
      //AM[CM.MV_APP_TO_VD] = this.mvAppToVDesktop;
      this.self.ACTION_MAP = AM;
   },
   /**
    * 处理调用请求
    * @param {int} code
    * @param {array} arg 函数需要的参数通过这个参数调用
    * @return {mix}
    */
   request : function(code, arg)
   {
      var AM = this.self.ACTION_MAP;
      var fn;
      if(!AM.hasOwnProperty(code)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'request',
            arguments.callee.displayName + ' CODE :' + code + ' is not support'
         );
      }
      if(!Ext.isDefined(arg)){
         arg = [];
      }
      if(!Ext.isArray(arg)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'request',
            arguments.callee.displayName + ' arg must be the type of the array'
         );
      }
      fn = AM[code];
      return fn.apply(this, arg);
   },

   /**
    * 运行运行
    *
    * @param {String} module
    * @param {string} name
    * @param {String} runConfig
    */
   runApp : function(module, name, runConfig)
   {
      WebOs.PM().runApp({
         module : module,
         name : name,
         runConfig : runConfig
      });
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 这个让使用这个mixin的类具有访问指定Runable的语言数据的接口
 */
Ext.define('WebOs.Mixin.RunableLangTextProvider', {
   /**
    * 目标Runable的元信息,
    *
    * @property {Array| String} runableLangKey
    */
   runableLangKey : null,
   /**
    * @property {Object} LANG_TEXT 语言对象
    */
   LANG_TEXT : null,
   /**
    * 获取APP对象的语言信息
    * {@link Cntysoft.Kernel.AbstractLangHelper#getText}
    *
    * @param {String} key
    * @return {Object}
    */
   GET_LANG_TEXT : function(key)
   {
      var lang;
      var langKey = this.runableLangKey;
      if(Ext.isArray(langKey)){
         var len = langKey.length;
         var keyItem;
         for(var i = 0; i < len; i++) {
            keyItem = langKey[i];
            if(!Cntysoft.LangManager.hasLang(keyItem)){
               this.loadLang(keyItem);
            }
            lang = Cntysoft.LangManager.getLang(keyItem);
            try {
               return lang.getText(key);
            } catch (e) {
               continue;
            }
         }
         Cntysoft.raiseError(Ext.getClassName(this), 'GET_LANG_TEXT', key + ' is not exist');
      } else{
         if(!Cntysoft.LangManager.hasLang(langKey)){
            this.loadLang(langKey);
         }
         lang = Cntysoft.LangManager.getLang(langKey);
         return lang.getText(key);
      }
   },
   /**
    * 获取根语言对象引用
    *
    * @return {Object}
    */
   GET_ROOT_LANG_TEXT : function()
   {
      var lang;
      var langKey = this.runableLangKey;
      if(!Cntysoft.LangManager.hasLang(langKey)){
         this.loadLang(langKey);
      }
      lang = Cntysoft.LangManager.getLang(langKey);
      return lang.getAllLangText();
   },
   /**
    * 加载语言对象
    */
   loadLang : function(key)
   {
      var parts = key.split('.');
      if(3 != parts.length){
         Cntysoft.raiseError(Ext.getClassName(this), 'loadLang', 'Key format error, like this type.module.name');
      }
      var cls = WebOs.ME.getRunableLangCls(parts[1], parts[2], parts[0]);
      Cntysoft.LangManager.register(key, Ext.create(cls));
   },
   destroy : function()
   {
      delete this.LANG_TEXT;
      this.callParent();
   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.TopStatusBar',{
   extend : 'Ext.container.Container',
   requires : [
      'Ext.layout.container.HBox'
   ],
   initComponent : function()
   {
      Ext.apply(this,{
         layout : 'hbox',
         height : 30,
         items : [
            this.getStartupButtonConfig(),
            this.getMenuBarConfig(),
            this.getAdviceButtonConfig()
         ]
      });
      this.callParent();
   },

   getMenuBarConfig : function()
   {
      return {
         xtype : 'container',
         flex : 1,
         style : 'background : #cccccc'
      };
   },

   getStartupButtonConfig : function()
   {
      return {
         xtype : 'button',
         text : 'C',
         cls : 'webos-status-btn'
      };
   },

   getAdviceButtonConfig : function()
   {

   }
});

/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.Desktop',{
   extend : 'Ext.container.Viewport',
   requires : [
      'Ext.layout.container.Border',
      'WebOs.OsWidget.TopStatusBar'
   ],
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP');
      Ext.apply(config,{
         id : WebOs.Const.WEBOS_DESKTOP,
         layout : {
            type : 'border'
         },
         listeners : {
            afterrender : function()
            {
               WebOs.ME.fireEvent('desktopready');
            },
            scope : this
         }
      });
      this.callParent([config]);
   },

   initComponent : function()
   {
      Ext.apply(this,{
         items : [new WebOs.OsWidget.TopStatusBar({
            region : 'north'
         }),{
            xtype : 'panel',
            title : 'asdasdasd',
            region : 'center',
            html : 'asdasdadasasdasdsa'
         }]
      });
      this.callParent();
   },

   destroy : function()
   {
      delete this.LANG_TEXT;
      this.callParent();
   }
});

