/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.ModuleSelector',{
   extend : 'Ext.container.Container',
   requires : [
      'Ext.layout.container.VBox'
   ],
   //private
   desktopRef : null,
   //private
   isAnimating : false,
   //private
   isModuleHide : true,
   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.MODULE_SELECTOR');
      this.applyConstraintConfig(config);
      this.callParent([config]);
   },
   applyConstraintConfig : function(config)
   {
      Ext.apply(config,{
         floating:true,
         width : 90,
         height : 40,
         cls : 'webos-module-selector',
         layout : {
            type : 'vbox',
            align : 'stretch'
         }
      });
   },

   initComponent : function()
   {
      var items = [{
         xtype : 'component',
         height : 40,
         cls : 'webos-module-selector-header',
         html : this.LANG_TEXT.TITLE,
         listeners : {
            afterrender : function(comp)
            {
               comp.el.addListener('click', function(){
                  this.toggleModulePanel();
               }, this);

            },
            scope : this
         }
      }];
      var modules = this.getModuleConfig();
      for(var i = 0; i < modules.length; i++){
         items.push(modules[i]);
      }
      var desktopView = this.desktopRef.desktopViewRef;
      //计算坐标

      Ext.apply(this, {
         constrain : true,
         constrainTo : desktopView.el,
         items : items,
         y : 60,
         x : desktopView.getWidth()
      });
      this.desktopRef.addListener({
         resize : function(desktop, width, height)
         {
            this.setX(width - 90);
            this.setY(60);
         },
         notificationpanelopenbegin : function(notification)
         {
            var x = this.getX() - Ext.getClass(notification).WIDTH;
            this.animate({
               to : {
                  x : x
               }
            })
         },
         notificationpanelclosebegin : function(notification)
         {
            var x = this.getX() + Ext.getClass(notification).WIDTH;
            this.animate({
               to : {
                  x : x
               }
            });
         },
         scope : this
      });
      this.callParent();
   },

   toggleModulePanel : function()
   {
      if(this.rendered) {
         if (!this.isAnimating) {
            if (this.isModuleHide) {
               this.isAnimating = true;
               this.animate({
                  to: {
                     height: this.items.getCount()*40
                  },
                  callback: function () {
                     this.isAnimating = false;
                     this.isModuleHide = false;
                  },
                  scope: this
               });
            } else {
               this.isAnimating = true;
               this.animate({
                  to: {
                     height: 40
                  },
                  callback: function () {
                     this.isAnimating = false;
                     this.isModuleHide = true;
                  },
                  scope: this
               });
            }
         }
      }
   },

   moduleItemClickHandler : function(comp)
   {
      this.desktopRef.switchDesktop(comp.moduleKey);
   },

   getModuleConfig : function()
   {
      //这里读取环境变量的数据
      var C = WebOs.Const;
      var supportedModules = WebOs.getSysEnv().get(C.ENV_SUPPORTED_MODULES);
      var module;
      var items = [];
      var miconCls;
      for(var mkey in supportedModules){
         module = supportedModules[mkey];
         items.push({
            xtype : 'component',
            cls : 'webos-module-selector-item',
            autoEl: {
               tag: 'div',
               children : [{
                  tag : 'div',
                  cls : 'webos-module-selector-item-text',
                  html : module.text
               }]
            },
            moduleKey : mkey,
            listeners : {
               afterrender : function(comp)
               {
                  comp.el.addListener({
                     click : function(){
                        this.moduleItemClickHandler(comp);
                     },
                     scope : this
                  });
               },
               scope : this
            }
         });
      }
      return items;
   },

   destroy : function()
   {
      delete this.desktopRef;
      delete this.LANG_TEXT;
      this.callParent();
   }

});