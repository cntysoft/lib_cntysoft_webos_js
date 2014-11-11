/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Utils', {
   statics : {
      /**
       * 获取app图标的css类名称
       *
       * @param module
       * @param app
       * @returns {string}
       */
      getAppIconCls : function(module, app)
      {
         var cls = 'app-'+ module+'-'+app+'-icon';
         return cls.toLowerCase();
      },
      /**
       * 获取App的widget icon 类名称
       *
       * @param module
       * @param app
       * @param widget
       */
      getWidgetIconCls : function(module, app, widget)
      {
         var cls = 'app-'+ module+'-'+app+'-widget-'+widget+'-icon';
         return cls.toLowerCase();
      }
   }
});