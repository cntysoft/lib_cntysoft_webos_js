/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.TaskButton',{
   extend : 'Ext.button.Button',
   alias : 'widget.webostaskbutton',
   statics : {
      INDICATOR_COLOR : {
         RUNNING : '#3892d3',
         SLEEP : '#B5830D',
         KILLED : '#cccccc'
      },
      MAX_ICON_SIZE : 64
   },
   /**
    * @var {Ext.Component} indicatorRef
    */
   indicatorRef : null,
   /**
    * @var {WebOs.OsWidget.AppSwitchBar} switchBarRef
    */
   switchBarRef : null,
   /**
    * @var {Ext.tip.ToolTip} too;tipRef
    */
   tooltipRef : null,

   constructor : function(config)
   {
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },

   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         width : 64,
         height : 64,
         cls : 'webos-taskbutton '+config.appIconCls,
         overCls : 'webos-cls-none',
         focusCls : 'webos-cls-none',
         _pressedCls : 'webos-cls-none'

      });
   },

   initComponent : function()
   {
      Ext.apply(this,{
         listeners : {
            boxready : function()
            {
               this.setIndicatorStatus(1);
            },
            afterrender : function()
            {
               this.tooltipRef = new Ext.tip.ToolTip({
                  target : this.el,
                  autoHide : false,
                  anchor : 'top'
               });
            },
            mouseover : function()
            {
               this.tooltipRef.update(this.appName);
               this.tooltipRef.show();
            },
            mouseout : function()
            {
               this.tooltipRef.hide();
            },
            move : function(comp, x, y)
            {
               this.relocateIndicatorHandler(this.switchBarRef, x, this.switchBarRef.getY());
            },
            scope : this
         }
      });

      this.switchBarRef.addListener({
         relocated : this.relocateIndicatorHandler,
         scope : this
      });
      this.setIconSizeStyle(this.self.MAX_ICON_SIZE);
      this.callParent();
   },

   setIndicatorStatus : function(status)
   {
      if(!this.indicatorRef){
         this.indicatorRef = this.getIndicator();
      }
      var C = WebOs.Const;
      if(C.S_RUNNING == status){
         this.indicatorRef.setStyle('background-color', this.self.INDICATOR_COLOR.RUNNING);
      }else if(C.S_SLEEP == status){
         this.indicatorRef.setStyle('background-color', this.self.INDICATOR_COLOR.SLEEP);
      }else if(C.S_KILLED == status){
         this.indicatorRef.setStyle('background-color', this.self.INDICATOR_COLOR.S_KILLED);
      }
   },


   /**
    * @return {Ext.Component}
    */
   getIndicator : function()
   {
      var targetY;
      var switchBarHeight = Ext.getClass(this.switchBarRef).MAX_SWITCH_BAR_HEIGHT;
      targetY = this.switchBarRef.getY() + switchBarHeight - 10;
      return new Ext.Component({
         floating : true,
         x : this.getX() + 2,
         y : targetY,
         height : 10,
         width : this.getWidth() - 4,
         renderTo : Ext.getBody(),
         listeners : {
            afterrender : function(comp)
            {
               comp.setZIndex(4)
            },
            scope : this
         }
      });
   },

   relocateIndicatorHandler : function(bar, x, y)
   {
      if(this.indicatorRef){
         targetY = y + this.switchBarRef.getHeight() - 10;
         var width = this.getWidth() - 4;
         this.indicatorRef.setX(this.getX() + 2);
         this.indicatorRef.setY(targetY);
         this.indicatorRef.setWidth(width);

         this.setIconSizeStyle(width);
      }
   },

   /**
    * @return {String}
    */
   setIconSizeStyle : function(size)
   {
      var cssValue = size + 'px '+ size + 'px';
      this.setStyle('-moz-background-size',cssValue);
      this.setStyle('-webkit-background-size',cssValue);
      this.setStyle('-o-background-size',cssValue);
      this.setStyle('background-size',cssValue);
   },

   destroy : function()
   {
      this.indicatorRef.destroy();
      delete this.switchBarRef;
      delete this.indicatorRef;
      this.tooltipRef.destroy();
      delete this.tooltipRef;
      this.callParent();
   }
});