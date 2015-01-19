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
            appRef : this,
            name : name
         });
         WebOs.showLoadScriptMask();
         Ext.require(cls, function(){
            WebOs.hideLoadScriptMask();
            var widgetObject = Ext.create(this.widgetMap[name], config);
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
   setupWidget : function(name, widgetObject)
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

            taskButton = WebOs.R_SYS_UI_RENDER.getOsWidget(WebOs.C.WEBOS_APP_SWITCH_BAR).addTaskButton({
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