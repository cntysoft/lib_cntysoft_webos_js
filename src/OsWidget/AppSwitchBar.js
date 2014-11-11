/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.AppSwitchBar',{
   extend : 'Ext.container.Container',
   requires : [
      'Ext.layout.container.HBox',
      'WebOs.OsWidget.TaskButton'
   ],
   statics : {
      INIT_ICON_SIZE : 80,
      MIN_SWITCH_BAR_WIDTH : 800,
      MAX_SWITCH_BAR_HEIGHT : 80
   },
   floating:true,
   /**
    * @var {WebOs.OsWidget.Desktop} desktopRef
    */
   desktopRef : null,
   constructor : function(config)
   {
      config = config || {};
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         height : 80,
         layout : {
            type : 'hbox'
         },
         cls : 'webos-appswitch-bar'
      });
   },

   /**
    * @event relocated
    *
    * @param {WebOs.OsWidget.AppSwitchBar} this
    * @param {Integer} x x坐标
    * @param {Integer} y y坐标
    */

   initComponent : function()
   {
      WebOs.R_SYS_UI_RENDER.setOsWidget(WebOs.C.WEBOS_APP_SWITCH_BAR, this);
      Ext.apply(this,{
         listeners : {
            afterrender : function()
            {
               this.recalculateSwitchBarWidth();
               this.relocateSelf();
            },
            scope : this
         },
         defaults : {
            listeners : {
               click : this.taskBtnClickHandler,
               scope : this
            }
         }
      });
      this.desktopRef.addListener('resize', function(){
         this.recalculateSwitchBarWidth();
         this.relocateSelf();
      }, this);
      this.callParent();
   },
   /**
    * 添加任务栏按钮
    *
    * @param {Object} config
    * @return {WebOs.OsWidget.TaskButton}
    */
   addTaskButton : function(config)
   {
      var appRef = config.widget.appRef;
      var button = {
         xtype : 'webostaskbutton',
         appName : config.widget.pmText.TASK_BTN_TEXT,
         enableToggle : true,
         switchBarRef : this,
         widget : config.widget,
         appIconCls : WebOs.Utils.getWidgetIconCls(appRef.module, appRef.name, config.widget.name),
         toggleGroup : 'APP_SWITCH_BAR',
         id : 'task_btn_' + config.id
      };
      return this.add(button);
   },
   /**
    * 任务按钮左点击处理函数
    *
    * @param {Ext.button.Button} taskBtn
    * @param {Ext.EventObject} e
    */
   taskBtnClickHandler : function(taskBtn, e)
   {
      var widget = taskBtn.widget;
      var app = widget.appRef;
      var W = WebOs.Kernel.ProcessModel.AbstractWidget;
      var desktop = WebOs.R_SYS_UI_RENDER.getOsWidget(WebOs.Const.WEBOS_DESKTOP);
      var vdesktop = desktop.getCurrentVDesktop();
      var curModuleKey = vdesktop.moduleKey;
      //console.log(vdesktop.moving+'-'+vdesktop.winMoving+'-'+widget.moving)
      if(!desktop.isMoving && !widget.isWinMoving){
         if(curModuleKey !== widget.$_vd_index_$){
            desktop.switchDesktop(widget.$_vd_index_$, function(){
               if(widget.status == W.S_RUNNING && widget != Ext.WindowManager.getActive()){
                  widget.toFront();
               } else if(widget.status == W.S_SLEEP){
                  app.selfWakeup = true;
                  app.showWidget(widget.name, {}, true);
               }
            }, this);
         } else{
            if(widget.status == W.S_RUNNING && widget != Ext.WindowManager.getActive()){
               widget.toFront();
            } else if(widget.status == W.S_RUNNING){
               app.selfWakeup = true;
               app.hideWidget(widget.name, true);
            } else if(widget.status == W.S_SLEEP){
               app.selfWakeup = true;
               app.showWidget(widget.name, {}, true);
            }
         }
      }
   },

   /**
    * @param {String} id
    */
   removeTaskButton : function(id)
   {
      this.remove(id, true);
   },

   recalculateSwitchBarWidth : function()
   {
      var total = this.items.getCount();
      var totalItemsWidth = total * (this.self.INIT_ICON_SIZE + 10);
      var constraintWidth = this.desktopRef.width - 40;
      if(totalItemsWidth >= this.self.MIN_SWITCH_BAR_WIDTH && totalItemsWidth <= constraintWidth){
         this.setWidth(totalItemsWidth);
         //重新设置按钮的大小
         this.items.each(function(btn){
            btn.setWidth(this.self.INIT_ICON_SIZE);
            btn.setHeight(this.self.INIT_ICON_SIZE);
            this.setHeight(this.self.INIT_ICON_SIZE + 10);
         }, this);
      }else if(totalItemsWidth > constraintWidth){
         this.setWidth(constraintWidth);
         //重新计算图标的大小
         var size = (constraintWidth - (total * 10)) / total;
         this.setHeight(size + 10);
         this.items.each(function(btn){
            btn.setWidth(size);
            btn.setHeight(size);
         });
      }
   },
   /**
    * 计算面板的坐标
    */
   relocateSelf : function()
   {
      var size = this.desktopRef.getSize();

      var x = (size.width - this.getWidth()) / 2;
      var y = size.height - (this.getHeight() + 5);
      this.setX(x);
      this.setY(y);
      if(this.hasListeners.relocated){
         this.fireEvent('relocated',this, x, y);
      }
   },

   destroy : function()
   {
      delete this.desktopRef;
      this.callParent();
   }
});