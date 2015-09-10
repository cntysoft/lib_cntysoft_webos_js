/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.QiniuCkEditor.Editor', {
   extend : 'Cntysoft.Component.QiniuCkEditor.Editor',
   requires : [
      'WebOs.Kernel.Const'
   ],
   uploadRequestMeta : {
      url : WebOs.Kernel.Const.API_GATE_SYS,
      meta : {
         name : 'WebUploader',
         method : 'process'
      }
   }
});