/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Uploader.Window', {
   extend: 'Cntysoft.Component.Uploader.Window',

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config.uploaderConfig,{
         requestUrl : WebOs.Kernel.Const.API_GATE_SYS,
         apiRequestMeta : {
            name : 'WebUploader',
            method : 'process'
         }
      })
   }
});