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