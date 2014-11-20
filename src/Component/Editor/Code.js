/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Editor.Code', {
   extend: 'WebOs.Component.Editor.Text',
   requires : [
      'Cntysoft.Component.Editor.Code'
   ],
   /**
    * @inheritdoc
    */
   getEditorConfig : function()
   {
      var pathInfo = Cntysoft.Stdlib.Common.pathInfo(this.filename);
      var type = pathInfo.extension;
      return {
         xtype : 'compeditorcode',
         listeners : {
            editorready : function(editor)
            {
               editor.changeMode(type);
            },
            afterrender : function(editor){
               this.editorRef = editor;
               this.winResizeHandler(this);
            },
            scope : this
         }
      };
   },

   /**
    * @inheritdoc
    */
   editorFirstAssignedValueHandler : function()
   {
      this.editorRef.clearHistory();
      this.editorRef.markClean();
   }
});