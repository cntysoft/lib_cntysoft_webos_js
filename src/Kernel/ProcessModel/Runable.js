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