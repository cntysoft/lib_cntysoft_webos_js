/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.NotificationCenter', {
   extend: 'Ext.container.Container',
   alias : 'widget.webosnotificationcenter',
   statics : {
      WIDTH : 300
   },
   //private
   desktopRef : null,
   //private
   desktopViewGhostRef : null,
   constructor : function(config)
   {
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         floating : true,
         width : this.self.WIDTH,
         y : WebOs.OsWidget.TopStatusBar.HEIGHT
      });
   },
   initComponent : function()
   {
      Ext.apply(this,{
         height : this.desktopViewGhostRef.getHeight(),
         x : this.calculateX()
      });
      this.desktopViewGhostRef.addListener({
         resize : function(ghost, width, height)
         {
            this.setHeight(height);
            this.setX(this.calculateX());
         },
         scope : this
      });
      this.callParent();
   },
   calculateX : function()
   {
      return this.desktopViewGhostRef.getWidth() - this.self.WIDTH;
   },
   toFront : Ext.emptyFn,

   destroy : function()
   {
      delete this.desktopRef;
      delete this.desktopViewGhostRef;
      this.callParent();
   }
});