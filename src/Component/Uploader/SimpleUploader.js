/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Uploader.SimpleUploader', {
   extend : 'Cntysoft.Component.Uploader.SimpleUploader',
   alias : 'widget.webossimpleuploader',

   requestUrl : WebOs.Kernel.Const.API_GATE_SYS,
   //requires : [
   //   'WebOs.Component.Uploader.Lang.zh_CN'
   //],
   //setupLangNamespace : function()
   //{
   //   var langs = [];
   //   if(Ext.isString(this.LANG_NAMESPACE)){
   //      langs.unshift(this.LANG_NAMESPACE);
   //   }
   //   langs.unshift('WebOs.Component.Uploader.Lang');
   //   this.LANG_NAMESPACE = langs;
   //},
   //
   //initComponent : function()
   //{
   //   this.callParent();
   //}
   getApiRequestMeta : function()
   {
      return {
         name : 'WebUploader',
         method : 'process'
      };
   }
});