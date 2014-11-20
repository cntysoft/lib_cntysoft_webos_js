/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.VDDragZone', {
   extend : 'Ext.dd.DragZone',
   requires : [
      'WebOs.OsWidget.VDDragStatus'
   ],
   /**
    * @property {WebOs.OsWidget.VirtualDesktop} desktopViewRef
    */
   desktopViewRef : null,
   modalDiv : null,
   constructor : function(desktop)
   {
      this.desktopViewRef = desktop;
      this.applyConstraintConfig();
      if(!this.proxy){
         this.proxy = new WebOs.OsWidget.VDDragStatus({
            id : desktop.id + '-drag-status-proxy',
            animRepair : true
         });
      }
      this.callParent([desktop.el.dom.parentNode]);
      this.ddel = Ext.get(document.createElement('div'));
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
   init : function(id, sGroup, config)
   {
      this.initTarget(id, sGroup, config);
      this.desktopViewRef.mon(this.desktopViewRef, {
         itemmousedown : this.itemMouseDownHandler,
         scope : this
      });
   },
   getDragData : function(e)
   {
      var desktop = this.desktopViewRef;
      var item = e.getTarget(desktop.getItemSelector());
      var record = desktop.getRecord(item);
      if(item){
         return {
            event : new Ext.EventObjectImpl(e),
            item : item,
            ddel : this.ddel.dom,
            fromPosition : Ext.fly(item).getXY(),
            record : record
         };
      }
   },
   onInitDrag : function(x, y)
   {
      var data = this.dragData;
      //去掉hovercls
      Ext.fly(data.item).removeCls(this.$_vd_hover_cls_$);
      this.proxy.update(this.getProxyUpdateDom(data.record));
      this.onStartDrag(x, y);
      return true;
   },
   getProxyUpdateDom : function(record)
   {
      return Ext.DomHelper.createDom({
         tag : 'div',
         cls : 'webos-vdesktop-app-wrapper',
         style : 'width:120px;height:120px;',
         children : [{
            tag : 'div',
            cls : 'webos-vdesktop-app-icon '+record.get('iconCls'),
            style : Ext.String.format("background-position: center center;width:{0}px;height:{1}px;margin:10px auto;{2}", record.get('iconWidget'), record.get('iconHeight'), record.get('iconBgStyle'))
         }, {
            tag : 'div',
            cls : 'webos-vdesktop-app-bg',
            style : Ext.String.format('height : 20px;width : {0}px;{1}', record.get('textWidth'), record.get('position'))
         }, {
            tag : 'div',
            cls : 'webos-vdesktop-app-text',
            style : Ext.String.format('height : 20px;width : {0}px;{1}', record.get('textWidth'), record.get('position')),
            children : {
               tag : 'div',
               style : 'margin:0 auto;font-size:12px;',
               html : record.get('text')
            }
         }]
      });
   },
   getRepairXY : function(e, data)
   {
      return data ? data.fromPosition : false;
   },
   /**
    * 处理拖动
    */
   itemMouseDownHandler : function(view, record, item, index, e)
   {
      this.handleMouseDown(e);
   },
   afterRepair : function()
   {
      this.dragging = false;
   },
   /**
    * 当拖动的时候禁止桌面hover
    */
   b4StartDrag : function(x, y)
   {
      this.$_vd_hover_cls_$ = this.desktopViewRef.overItemCls;
      var vdesktopEl = this.desktopViewRef.el;
      var vdesktopViewEl = this.desktopViewRef.el;
      vdesktopEl.setStyle('z-index', 99);
      if(!this.modalDiv){
         this.modalDiv = Ext.get(Ext.DomHelper.createDom({
            tag : 'div',
            style : 'position:absolute;left 0px;top : 0px;background:#000000; z-index:1;opacity:0'
         }));
         this.modalDiv.setSize(vdesktopEl.getWidth(), vdesktopEl.getHeight());
         this.desktopViewRef.addListener({
            resize : function(vd, width,height)
            {
               this.modalDiv.setSize(vdesktopEl.getWidth(), vdesktopEl.getHeight());
            },
            scope : this
         });
      }else{
         this.modalDiv.setOpacity(0);
         this.modalDiv.show();
      }
      vdesktopViewEl.$_org_z_index_$ = vdesktopViewEl.getStyle('z-index');
      vdesktopViewEl.setStyle('z-index', 2);
      vdesktopViewEl.parent().appendChild(this.modalDiv);
      this.modalDiv.setOpacity(0.5, true);
      //设置桌面图标
      var icons = this.desktopViewRef.getIconItems();
      var len = icons.length;
      for(var i =0; i < len; i++){
         Ext.fly(icons[i]).setOpacity(0.3);
      }
      this.desktopViewRef.overItemCls = '';
      this.callParent(arguments);
   },
   onEndDrag : function(dragData, e)
   {
      var vdesktopViewEl = this.desktopViewRef.el;
      this.desktopViewRef.overItemCls = this.$_vd_hover_cls_$;
      vdesktopViewEl.setStyle('z-index',  vdesktopViewEl.$_org_z_index_$);
      this.modalDiv.hide(true);
      //还原图标
      //设置桌面图标
      var icons = this.desktopViewRef.getIconItems();
      var len = icons.length;
      for(var i =0; i < len; i++){
         Ext.fly(icons[i]).setOpacity(1);
      }
   },
   destroy : function()
   {
      delete this.desktopViewRef;
      this.callParent();
   }
});