/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 虚拟桌面的拖动接受区域定义
 */
Ext.define('WebOs.OsWidget.VDDropZone', {
   extend : 'Ext.dd.DropZone',
   requires : [
      'Cntysoft.Kernel.StdPath',
      'Cntysoft.Kernel.Utils'
   ],
   /**
    * 判断当前是否是可以drop的
    *
    * @property {Boolean} valid
    */
   valid : true,
   /**
    * @property {Ext.Component} indicator
    */
   indicator : null,
   /**
    * 当前的目标APP
    */
   currentTarget : null,
   /**
    * @property {WebOs.OsWidget.VirtualDesktop} desktopViewRef
    */
   desktopViewRef : null,
   constructor : function(desktopView)
   {
      this.desktopViewRef = desktopView;
      this.applyConstraintConfig();
      this.callParent([desktopView.el.dom.parentNode]);
   },
   /**
    * 应用强制参数
    */
   applyConstraintConfig : function()
   {
      Ext.apply(this, {
         ddGroup : 'VDESKTOP_DD_ZONE_' + this.desktopViewRef.moduleKey
      });
   },
   /**
    * @return string
    */
   onNodeOver : function(node, dragZone, e, data)
   {
      if(node == data.item){
         this.valid = false;
      } else if(this.currentTarget != node){
         var targetEl = Ext.fly(node);
         targetEl.setOpacity(1);
         targetEl.removeCls('cnty-os-view-hover');
         this.currentTarget = node;
      }
      return this.valid ? this.dropAllowed : this.dropNotAllowed;
   },
   onNodeOut : function(node, dd, e, data)
   {
      if(node !== data.item){
         var targetEl = Ext.fly(node);
         targetEl.setOpacity(0.3);
         this.currentTarget = null;
      }
   },
   onNodeDrop : function(node, dd, e, data)
   {
      if(node == data.item){
         this.desktopViewRef.vdesktop.desktop.$_move_click_$ = true;
         return false;
      }else{
         var desktopView = this.desktopViewRef;
         var target = desktopView.getRecord(node);
         var drag =desktopView.getRecord(data.item);
         var tmp = target.get('order');
         target.set('order', drag.get('order'));
         drag.set('order', tmp);
         desktopView.refleshLayout = false;
         desktopView.store.sort('order', 'ASC');
         this.saveSortResult();
      }
   },
   saveSortResult : function()
   {
      var dv = this.desktopViewRef;
      var store = dv.store;
      var app = dv.appRef;
      var data = {};
      var key;
      store.each(function(record){
         key = record.get('module')+'.'+record.get('name');
         data[key] = record.get('order');
      }, this);
      app.updateAppVdOrder(data, function(response){
         if(!response.status){
            Cntysoft.processApiError(response);
         }
      }, this);
   },
   getTargetFromEvent : function(e)
   {
      return e.getTarget(this.desktopViewRef.getItemSelector());
   },
   destroy : function()
   {
      delete this.desktopViewRef;
      this.callParent();
   }
});