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
    * 这个属性在生产环境里面用到，用于快速判断模块是否加载
    */
   loadedModules : {},
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
      if(config.runConfig){
         Ext.apply(config, {
            type : WebOs.Const.RUN_TYPE_APP,
            processConfig : {
               runLevel : WebOs.Kernel.Const.RUN_LEVEL_USER
            }
         });
      }else{
         Ext.apply(config, {
            type : WebOs.Const.RUN_TYPE_APP
         });
      }
      
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
      this.runKernel(config, Ext.emptyFn, this);
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
      if(WebOs.ME.isProduction){
         var moduleName;
         if(config.type == WebOs.Const.RUN_TYPE_DAEMON){
            moduleName = 'daemons';
            moduleFile = WebOs.ME.basePath + '/modules/daemons.js';
         }else if(config.type == WebOs.Const.RUN_TYPE_APP){
            moduleName = config.module;
            moduleFile = WebOs.ME.basePath + '/modules/'+ config.module.toLowerCase() + '.js';
         }
         if(!!this.loadedModules[moduleName]){
            this.doRunKernel(key, type, runConfig, config, callback, scope);
         }else{
            Ext.Loader.loadScript({
               url : moduleFile,
               onLoad : function(){
                  this.loadedModules[moduleName] = true;
                  this.doRunKernel(key, type, runConfig, config, callback, scope);
               },
               scope : this
            });
         }
      }else{
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
