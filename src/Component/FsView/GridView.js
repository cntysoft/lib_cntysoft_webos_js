/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.FsView.GridView', {
   extend : 'Cntysoft.Component.FsView.GridView',
   requires : [
      'WebOs.Component.Editor.Code',
      'WebOs.Component.Editor.Text'
   ],
   statics : {
      VE_MAP : {
         js : [true, true, 'WebOs.Component.Editor.Code'],
         php : [true, true, 'WebOs.Component.Editor.Code'],
         html : [true, true, 'WebOs.Component.Editor.Code'],
         css : [true, true, 'WebOs.Component.Editor.Code'],
         txt : [true, true, 'WebOs.Component.Editor.Text']
      }
   },
   /**
    * @return {Object}
    */
   getVeMapItem : function(fileType)
   {
      return this.statics().VE_MAP[fileType];
   },

   renderUploaderWindow : function()
   {
      WebOs.showLoadScriptMask();
      Ext.require('WebOs.Component.Uploader.Window', function(){
         WebOs.hideLoadScriptMask();
         if(null == this.uploaderRef){
            Ext.apply(this.uploaderConfig, {
               initUploadPath : '/' + this.path,
               listeners : {
                  uploadcomplete : function()
                  {
                     this.uploaderRef.close();
                     this.refresh();
                  },
                  scope : this
               },
               uploaderConfig : {
                  randomize : false,
                  fileTypeExts : ['gif', 'png', 'jpg', 'jpeg', 'txt', 'rar', 'zip', 'tar.gz', 'html', 'css', 'js']
               }
            });
            this.uploaderRef = new WebOs.Component.Uploader.Window(this.uploaderConfig);
         } else{
            this.uploaderRef.changUploadPath('/' + this.path);
         }
         this.uploaderRef.center();
         this.uploaderRef.show();
      }, this);
   },
});