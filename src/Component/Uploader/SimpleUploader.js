/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WEBOS简单上传组建
 */
Ext.define('WebOs.Component.Uploader.SimpleUploader', {
   extend : 'Cntysoft.Component.Uploader.SimpleUploader',
   alias : 'widget.webossimpleuploader',

   requestUrl : WebOs.Kernel.Const.API_GATE_SYS,
   getApiRequestMeta : function()
   {
      return {
         name : 'WebUploader',
         method : 'process'
      };
   }
});