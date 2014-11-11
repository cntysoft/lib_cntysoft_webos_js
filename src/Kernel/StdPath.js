/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Kernel.StdPath',{
   extend : 'Cntysoft.Kernel.StdPath',
   inheritableStatics : {
      /**
       * 获取WebOs应用图片路径
       *
       * @param {String} module
       * @param {String} app
       * @return {String}
       */
      getAppImagePath : function(module, app)
      {
         return this.getSiteMgrResPath()+'/App/'+module+'/'+app;
      },

      /**
       * 获取APP根目录
       *
       * @param string module
       * @param string app
       * @returns {string}
       */
      getAppPath : function(module, app)
      {
         return '/Apps/'+module+'/'+app;
      },

      /**
       * 获取系统标准的上传路径
       *
       * @returns {string}
       */
      getStdUploadPath : function()
      {
         return '/PrivateSpace/UploadFiles';
      }
   }
});
