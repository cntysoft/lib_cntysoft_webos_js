/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Window', {
   extend : 'Ext.window.Window',
   statics : {
      vwIdSeed : 1
   },
   /**
    * 系统桌面对象引用
    *
    * @private
    */
   desktopRef : null,
   constructor : function(config)
   {
      this.desktopRef = WebOs.R_SYS_UI_RENDER.getOsWidget(WebOs.Const.WEBOS_DESKTOP);
      config = config || {};

      this.applyConstraintConfig(config);
      this.callParent([config]);
      this.$_vdesktop_key_$ = Ext.getClassName(this)+ this.statics().vwIdSeed++;
      this.desktopRef.registerWindow(this.$_vdesktop_key_$, this);
      //属于的虚拟桌面的编号
      this.$_vd_index_$ = this.desktopRef.getCurrentVDesktop().moduleKey;
   },
   initComponent : function()
   {
      this.addListener({
         boxready : function()
         {
            this.$_x_ratio_$ = this.getX() / this.desktopRef.getWidth();
         },
         move : function()
         {
            if(!this.desktopRef.isMoving){
               this.$_x_ratio_$ = this.getX() / this.desktopRef.getWidth();
            }
         },
         show : function()
         {
            this.el.shadow.el.setTop(this.el.getTop()+this.el.shadow.offsets.y);
         },
         scope : this
      });
      this.callParent();
   },
   /**
    * 强制配置对象
    * @template
    * @param {Object} config
    */
   applyConstraintConfig : function(config)
   {
      var desktopRef = WebOs.R_SYS_UI_RENDER.getOsWidget(WebOs.Const.WEBOS_DESKTOP);
      Ext.apply(config,{
         hideMode : 'visibility',
         shadow : true,
         constrain : true,
         constrainTo : Ext.getBody(),
         maximizable : true
      });

   },
   /**
    * 当这个窗口属于某个虚拟桌面， 但是这个虚拟桌面没有激活， 那么我们不能调用 doConstrain
    */
   onWindowResize : function(){
      var me = this,
         sizeModel;
      if(me.maximized){
         me.fitContainer();
      } else{
         var x = this.getX();
         if(x > 0 && x < this.desktopRef.getWidth()){
            sizeModel = me.getSizeModel();
            if(sizeModel.width.natural || sizeModel.height.natural){
               me.updateLayout();
            }
            me.doConstrain();
         }
      }
   },
   destroy : function()
   {
      this.desktopRef.unregisterWindow(this.$_vdesktop_key_$, this.$_vd_index_$);
      delete this.$_vdesktop_key_$;
      delete this.$_vd_index_$;
      delete this.desktopRef;
      this.callParent();
   }
});