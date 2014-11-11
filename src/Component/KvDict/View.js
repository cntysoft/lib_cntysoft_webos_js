/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Component.KvDict.View', {
   extend : 'Ext.window.Window',
   requires : [
      'SenchaExt.Data.Proxy.ApiProxy',
      'Ext.layout.container.Fit',
      'WebOs.Component.KvDict.Lang.zh_CN'
   ],
   mixins : {
      langTextProvider : 'Cntysoft.Mixin.LangTextProvider'
   },
   /**
    * @inheritdoc
    */
   LANG_NAMESPACE : 'Cntysoft.Component.KvDict.Lang',
   /**
    * 是否允许多选
    *
    * @private
    * @property {Boolean} allowMulti
    */
   allowMulti : false,
   /**
    * @private
    * @propety {Ext.grid.Panel} dataListRef
    */
   dataListRef : null,
   /**
    * 构造函数
    */
   constructor : function(config)
   {
      config = config || {};
      if(!Ext.isDefined(config.targetMapKey)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'targetMapKey parameter can not be null'
         );
      }
      this.LANG_TEXT = this.GET_ROOT_LANG_TEXT();
      this.applyConstraintConfig();
      this.callParent([config]);
   },
   applyConstraintConfig : function()
   {
      Ext.apply(this, {
         width : 300,
         height : 300,
         layout : 'fit',
         resizable : false,
         closeAction : 'hide',
         bodyStyle : 'background : #ffffff',
         bodyBorder : false,
         title : this.LANG_TEXT.TITLE,
         modal : true,
         autoShow : false
      });
   },

   /**
    * @event itemselected
    * 如果没有数据选中就不派发这个事件
    *
    *  @param {Object} record
    */
   initComponent : function()
   {
      var BTN = Cntysoft.GET_LANG_TEXT('UI.BTN');
      Ext.apply(this, {
         items : this.getListViewConfig(),
         buttons : [{
            text : BTN.OK,
            listeners : {
               click : this.submitHandler,
               scope : this
            }
         }, {
            text : BTN.CANCEL,
            listeners : {
               click : function(){
                  this.close();
               },
               scope : this
            }
         }]
      });
      this.callParent();
   },
   createKvStore : function()
   {
      return new Ext.data.Store({
         autoLoad : true,
         fields : [
            {name : 'name', type : 'string', persist : false},
            {name : 'value', type : 'string', persist : false}
         ],
         proxy : {
            type : 'apigateway',
            callType : 'Sys',
            invokeMetaInfo : {
               name : 'KvDict',
               method : 'getMapItems'
            },
            onDataReady : this.onKvItemsReady,
            pArgs : {
               key : this.targetMapKey
            },
            reader : {
               type : 'json',
               rootProperty : 'data'
            }
         }
      });
   },

   onKvItemsReady : function(items)
   {
      var ret = [];
      var item;
      var len = items.length;
      var value;
      var parts;
      for(var i = 0; i < len; i++){
         item = items[i];
         if(!item.enable){
            continue;
         }
         value = item.value;
         parts = value.split('|');
         if(parts.length == 2){
            ret.push({
               name : parts[0],
               value : parts[1]
            });
         }else{
            ret.push({
               name : value,
               value : value
            });
         }
      }
      return ret;
   },
   /**
    * 选择列表中的项
    */
   selectItems : function(items)
   {
      var selModel = this.dataListRef.getSelectionModel();
      selModel.select(items);
   },
   getListViewConfig : function()
   {
      return {
         xtype : 'grid',
         header : false,
         bodyBorder : false,
         border : false,
         store : this.createKvStore(),
         columns : [
            {text : this.LANG_TEXT.VALUE, dataIndex : 'name', flex : 1, resizable : false, menuDisabled : true}
         ],
         selModel : {
            allowDeselect : true,
            mode : this.allowMulti ? 'MULTI' : 'SINGLE'
         },
         listeners : {
            afterrender : function(grid){
               this.dataListRef = grid;
            },
            scope : this
         }
      };
   },
   submitHandler : function()
   {
      var selModel = this.dataListRef.getSelectionModel();
      if(selModel.hasSelection()){
         if(this.hasListeners.itemselected){
            this.fireEvent('itemselected', selModel.getSelection());
         }
         selModel.deselectAll();
      }
      this.close();
   },
   destroy : function()
   {
      delete this.dataListRef;
      this.mixins.langTextProvider.destroy.call(this);
      this.callParent();
   }
});