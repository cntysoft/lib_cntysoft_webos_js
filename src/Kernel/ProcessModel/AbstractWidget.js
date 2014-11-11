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
    * @property {WebOs.Kernel.ProcessModel.App} appRef
    */
   appRef : null,
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
      //这个版本对frame 支持有问题
      //检查appRef是否设置
      if(!(config.appRef instanceof WebOs.Kernel.ProcessModel.App)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'config must have appRef field and must be the type of WebOs.Kernel.ProcessModel.App'
         );
      }
      /**
       * statuschange
       */
      Ext.apply(this, {
         appRef : config.appRef
      });

      delete config.appRef;
      this.initLangTextRef();
      this.initPmTextRef();
      this.callParent([config]);
      this.status = this.self.S_INIT;
   },
   /**
    * 初始化语言引用, 这个方法很重要， 在很多时候，子类中的构造函数获取语言的时候，但是appRef引用还没有建立
    * 导致调用失败
    *
    * @template
    */
   initLangTextRef : Ext.emptyFn,
   /**
    * 初始化任务管理语言引用
    *
    * @template
    */
   initPmTextRef : Ext.emptyFn,
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
         hidden : false
      });
   },
   /**
    * @see {Cntysoft.Kernel.AbstractLangHelper#getText}
    */
   GET_LANG_TEXT : function(key)
   {
      return this.appRef.GET_LANG_TEXT(key);
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
      return this.appRef;
   },
   /**
    * 获取当前APP的权限树对象
    *
    * @return {Object}
    */
   getPermissionTree : function()
   {
      return this.appRef.permissionTree;
   },
   /**
    * 代理APP中同名方法
    *
    * @return {Boolean}
    */
   hasPermission : function(key)
   {
      return this.appRef.hasPermission(key);
   },
   /**
    * @param {String} key
    * @return {Object}
    */
   getPermissionNode : function(key)
   {
      return this.appRef.getPermissionNode(key);
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
         this.appRef.selfOperation = true;
         //请求APP进行widget窗口关闭
         this.appRef.closeWidget(this.name);
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
      this.appRef.selfOperation = true;
      this.appRef.hideWidget(widget.name, true);
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
               this.taskButton.setIndicatorStatus(this.status);
               this.moving = false;
            }, this);

         }
      } else{
         this.hide(false);
         if(this.hasListeners.statuschange){
            this.fireEvent('statuschange', this, this.status);
         }
         this.moving = false;
         this.taskButton.setIndicatorStatus(this.status);
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
      this.taskButton.setIndicatorStatus(this.status);
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
   },
   /**
    * 资源清除
    */
   destroy : function()
   {
      delete this.appRef;
      delete this.taskButton;
      delete this.animTarget;
      delete this.LANG_TEXT;
      delete this.pmText;
      this.callParent();
   }
});