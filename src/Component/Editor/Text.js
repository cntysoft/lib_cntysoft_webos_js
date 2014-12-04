/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.Editor.Text', {
   extend: 'WebOs.Component.Window',
   requires : [
      'Ext.layout.container.Fit',
      'WebOs.Component.Editor.Lang.zh_CN'
   ],
   mixins : {
      langTextProvider : 'Cntysoft.Mixin.LangTextProvider'
   },
   LANG_NAMESPACE : 'WebOs.Component.Editor.Lang',
   /**
    * @property {String} filename
    */
   filename : '',

   mode : WebOs.Kernel.Const.NEW_MODE,
   /**
    * 文本编辑器
    *
    * @property {Ext.form.TextArea} editorRef
    */
   editorRef : null,
   /**
    * 原始数据， 判断是否改变
    *
    * @property {String} string
    */
   orgValue : '',

   /**
    * @property {Cntysoft.Framework.Core.Filesystem} fs
    */
   fs : null,

   /**
    * @property {Ext.util.KeyMap} keyMap
    */
   keyMap : null,

   constructor : function(config)
   {
      config = config || {};
      this.LANG_TEXT = this.GET_LANG_TEXT('TEXT_EDITOR');
      this.callParent([config]);
      if(!Ext.isDefined(this.filename) || '' == config.filename){
         Cntysoft.raiseError(Ext.getClassName(this), 'constructor', 'must specify filename');
      }
      //修改标题的名称

      if(this.mode == WebOs.Const.MODIFY_MODE){
         this.addListener('afterrender', function(){
            this.loadFile(config.filename);
         }, this, {
            single : true
         });
      }
   },

   applyConstraintConfig : function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         title : this.LANG_TEXT.TITLE + '  [ ' + config.filename + ' ] ',
         closeAction : 'destroy',
         width : 1000,
         minWidth : 1000,
         height : 600,
         minHeight : 600,
         maximizable : true,
         constrain : true,
         constrainTo : Ext.getBody(),
         resizable : true,
         layout : 'fit',
         bodyBorder : false,
         bodyStyle : {
            background : '#ffffff'
         }
      });
   },
   /**
    * @event datasaved
    * 数据保存事件 保存成功的时候才派发
    *
    * @param {WebOs.Component.Editor.Text} editor
    * @param {String} data
    */
   initComponent : function()
   {
      var B_TEXT = Cntysoft.GET_LANG_TEXT('UI.BTN');
      Ext.apply(this, {
         buttons : [{
            text : B_TEXT.SAVE,
            listeners : {
               click : this.saveHandler,
               scope : this
            }
         }, {
            text : B_TEXT.CANCEL,
            listeners : {
               click : function()
               {
                  this.close();
               },
               scope : this
            }
         }]
      });
      Ext.apply(this, {
         items : this.getEditorItems()
      });
      this.addListener({
         resize : this.winResizeHandler,
         beforeclose : this.beforeCloseHandler,
         afterrender : function(){
            this.keyMap = new Ext.util.KeyMap({
               target : this.el,
               binding : {
                  ctrl : true,
                  key : Ext.EventObject.S,
                  fn : function(keyCode, e){
                     e.stopEvent();
                     this.saveHandler();
                  },
                  scope : this
               }
            });
         },
         scope : this
      });

      this.callParent();
   },

   /**
    * 模板函数
    * @template
    */
   getEditorItems : function()
   {
      return [this.getEditorConfig()];
   },
   /**
    * @return {Cntysoft.Framework.Core.Filesystem}
    */
   getFsObject : function()
   {
      if(null == this.fs){
         this.fs = new Cntysoft.Framework.Core.Filesystem();
      }
      return this.fs;
   },
   //private
   loadFile : function(filename)
   {
      this.filename = filename;
      this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.LOAD'));
      var fs = this.getFsObject();
      fs.cat(filename, this.loadFileHandler, this);
   },

   saveHandler : function()
   {
      var value = this.editorRef.getValue();
      if(value !== this.orgValue){
         this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
         var fs = this.getFsObject();
         fs.save({
            filename : this.filename,
            content : value
         }, function(response){
            this.loadMask.hide();
            if(!response.status){
               Cntysoft.Kernel.Utils.processApiError(response);
               return;
            } else{
               if(this.hasListeners.datasaved){
                  this.fireEvent('datasaved', this, value);
               }
               Cntysoft.showAlertWindow(Cntysoft.GET_LANG_TEXT('MSG.SAVE_OK'), function(){
                  this.orgValue = value;
                  if(this.mode == this.self.M_NEW){
                     this.close();
                  }
               }, this);
            }
         }, this);
      } else{
         Cntysoft.showAlertWindow(Ext.String.format(this.LANG_TEXT.MSG.NO_CHANGE, this.filename));
      }
   },

   beforeCloseHandler : function(window)
   {
      if(!this.$_force_quit_$ && this.editorRef.getValue() != this.orgValue){
         var msg = this.LANG_TEXT.MSG.NOT_SAVE;
         Cntysoft.showQuestionWindow(Ext.String.format(msg, this.filename), function(bid){
            if('yes' == bid){
               this.$_force_quit_$ = true;
               this.close();
            }
         }, this);
         return false;
      }
      return true;
   },

   loadFileHandler : function(response)
   {
      this.loadMask.hide();
      if(!response.status){
         Cntysoft.raiseError(Ext.getClassName(this), 'loadFileHandler', 'load  file error : ' + response.msg);
      } else{
         this.orgValue = response.data.content;
         this.editorRef.setValue(response.data.content);
         this.editorFirstAssignedValueHandler();
      }
   },
   /**
    * @template
    * 编辑器首次被赋值
    */
   editorFirstAssignedValueHandler : Ext.emptyFn,

   winResizeHandler : function(win, width, height)
   {
      if(this.editorRef){
         this.editorRef.setHeight(win.body.getHeight());
      }
   },
   /**
    * 获取编辑器配置对象
    *
    * @return {Object}
    */
   getEditorConfig : function()
   {
      return {
         xtype : 'textarea',
         listeners : {
            afterrender : function(editor){
               this.winResizeHandler(this);
               this.editorRef = editor;
            },
            scope : this
         },
         border : false,
         bodyBorder : false
      };
   },
   destroy : function()
   {
      if(this.loadMask){
         this.loadMask.destroy();
         delete this.loadMask;
      }
      this.keyMap.destroy();
      delete this.keyMap;
      delete this.editorRef;
      delete this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});