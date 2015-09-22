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
       * @readonly {Integer} I_TYPE_WIDGET
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