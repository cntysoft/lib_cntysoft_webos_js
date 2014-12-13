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
      'Ext.layout.container.HBox',
      'WebOs.OsWidget.SysMenu'
   ],
   statics : {
      HEIGHT : 30,
      START_BTN_MARGIN : 4
   },
   //private
   desktopRef : null,
   //private
   clockTimer : null,
   //private
   clockRef : null,
   //private
   startBtnRef : null,
   //private
   sysmenuRef : null,
   initComponent : function()
   {
      Ext.apply(this,{
         layout : 'hbox',
         height : this.self.HEIGHT,
         shadow: false,
         items : [
            this.getStartupButtonConfig(),
            this.getMenuBarConfig(),
            this.getClockConfig(),
            this.getNotificationButtonConfig()
         ],
         cls : 'webos-status-bar'
      });

      this.callParent();
   },
   /**
    * 获取日期字符
    *
    * @param {Integer} day
    * @return {String}
    */
   getDayText : function(day)
   {
      day = Ext.Number.constrain(day, 0, 6);
      var DAY_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.TOP_STATUS_BAR.WEEK_NAMES');
      return  DAY_TEXT[day];
   },

   updateTimeHandler : function()
   {
      var now = new Date();
      var time = Ext.Date.format(now,'h:i:s A');
      var day = this.getDayText(now.getDay());
      var time = day + ' ' + time;
      if(this.$_lastText_$ != time){
         this.clockRef.update(time);
         this.$_lastText_$ = time;
      }
      this.timer = Ext.Function.defer(this.updateTimeHandler, 1000, this);
   },
   getClockConfig : function()
   {
      return {
         xtype : 'component',
         height : this.self.HEIGHT,
         width : 150,
         padding : '5 0 0 0',
         listeners : {
            afterrender : function(cmp)
            {
               this.clockRef = cmp;
               Ext.Function.defer(this.updateTimeHandler, 100, this);
            },
            scope : this
         }
      };
   },
   getMenuBarConfig : function()
   {
      return {
         xtype : 'container',
         flex : 1
      };
   },

   getStartupButtonConfig : function()
   {
      return WebOs.ME.startBtnRequestHandler(this);
   },

   toggleSysMenu : function()
   {
      if(!this.sysmenuRef){
         this.sysmenuRef = new WebOs.OsWidget.SysMenu({
            desktopRef : this.desktopRef,
            startBtnRef : this.startBtnRef
         });
      }
      if(this.sysmenuRef.isHidden()){
         //设置显示坐标
         this.sysmenuRef.showAt(this.self.START_BTN_MARGIN, this.self.HEIGHT);
      }else{
         this.sysmenuRef.hide();
      }
   },
   getNotificationButtonConfig : function()
   {
      return {
         xtype : 'button',
         iconCls : 'webos-notification-btn-icon',
         cls : 'webos-notification-btn',
         height : this.self.HEIGHT,
         listeners : {
            afterrender : function(btn)
            {
               btn.el.on({
                  mousedown : function(){
                     btn.setIconCls('webos-notification-btn-icon-click');
                  },
                  mouseup : function()
                  {
                     btn.setIconCls('webos-notification-btn-icon');
                  },
                  scope : this
               });
            },
            click : function()
            {
               var target = Ext.getCmp(WebOs.Const.WEBOS_DESKTOP);
               target.toggleNotificationPanel();
            },
            scope : this
         }
      };
   },
   destroy : function()
   {
      delete this.desktopRef;
      delete this.clockRef;
      delete this.clockTimer;
      delete this.startBtnRef;
      if(this.sysmenuRef){
         this.sysmenuRef.destroy();
         delete this.sysmenuRef;
      }
      this.callParent();
   }
});