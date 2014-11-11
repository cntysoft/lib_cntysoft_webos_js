/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统标准的处理函数，可以在系统的很多地方都会调用，集中在一个地方处理比较方便
 */
Ext.define('WebOs.Kernel.StdHandler',{
   statics : {
      CODE_MAP : {
         RUN_APP : 1,
         SHOW_DESKTOP : 2,
         ADD_FAVORITE : 3,
         OPEN_APP_SHOP : 4,
         SYS_SETTING : 5,
         CONTROLL_PANEL : 6,
         OPEN_DOC : 7,
         ADVANCE : 8,
         BBS : 9,
         WEIBO : 10,
         ABORT_CNTYSOFT : 11,
         LOGOUT : 12,
         LOCK_SYS : 13,
         TILE_WINDOW : 14,
         CASCADE_WINDOW : 15,
         SHOW_APP_INFO : 16,
         MOVE_ICON : 17,
         CHANGE_WALLPAPER : 18,
         GOTO_FRONT : 19,
         MV_APP_TO_VD : 20
      }
   },
   constructor : function()
   {
      var CM = this.self.CODE_MAP;
      var AM = {};
      AM[CM.RUN_APP] = this.runApp;
      //AM[CM.SHOW_DESKTOP] = this.showDesktop;
      //AM[CM.ADD_FAVORITE] = this.addFavorite;
      //AM[CM.OPEN_APP_SHOP] = this.openAppShop;
      //AM[CM.SYS_SETTING] = this.sysSetting;
      //AM[CM.CONTROLL_PANEL] = this.openControllPanel;
      //AM[CM.OPEN_DOC] = this.openDoc;
      //AM[CM.ADVANCE] = this.advance;
      //AM[CM.BBS] = this.bbs;
      //AM[CM.WEIBO] = this.weibo;
      //AM[CM.ABORT_CNTYSOFT] = this.about;
      //AM[CM.LOGOUT] = this.logout;
      //AM[CM.LOCK_SYS] = this.lockSys;
      //AM[CM.TILE_WINDOW] = this.tileWindow;
      //AM[CM.CASCADE_WINDOW] = this.cascadeWindow;
      //AM[CM.SHOW_APP_INFO] = this.showAppInfo;
      //AM[CM.MOVE_ICON] = this.moveIcon;
      //AM[CM.CHANGE_WALLPAPER] = this.changeWallPaper;
      //AM[CM.GOTO_FRONT] = this.gotoFront;
      //AM[CM.MV_APP_TO_VD] = this.mvAppToVDesktop;
      this.self.ACTION_MAP = AM;
   },
   /**
    * 处理调用请求
    * @param {int} code
    * @param {array} arg 函数需要的参数通过这个参数调用
    * @return {mix}
    */
   request : function(code, arg)
   {
      var AM = this.self.ACTION_MAP;
      var fn;
      if(!AM.hasOwnProperty(code)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'request',
            arguments.callee.displayName + ' CODE :' + code + ' is not support'
         );
      }
      if(!Ext.isDefined(arg)){
         arg = [];
      }
      if(!Ext.isArray(arg)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'request',
            arguments.callee.displayName + ' arg must be the type of the array'
         );
      }
      fn = AM[code];
      return fn.apply(this, arg);
   },

   /**
    * 系统运行App接口
    *
    * @param {String} module
    * @param {string} name
    * @param {String} runConfig
    */
   runApp : function(module, name, runConfig)
   {
      WebOs.PM().runApp({
         module : module,
         name : name,
         runConfig : runConfig
      });
   }
});