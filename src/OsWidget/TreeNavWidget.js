/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.TreeNavWidget', {
   extend : 'WebOs.Kernel.ProcessModel.AbstractWidget',
   requires : [
      'SenchaExt.View.IconView'
   ],
   statics : {
      A_CODES : {
         OPEN : 1,
         ENTER : 2
      }
   },
   /**
    * 功能导航树数据
    *
    * @property {Object} navTreeData
    */
   navTreeData : null,
   /**
    * @property {Ext.data.TreeStore} navStore
    */
   navStore : null,
   /**
    * 当前显示的view的
    *
    * @property {Ext.data.Store} viewStore
    */
   viewStore : null,
   /**
    * @property {Cntysoft.Kernel.CoreComp.View.IconView} viewObject
    */
   viewObject : null,
   /**
    * @property {Ext.data.NodeInterface}
    */
   currentNode : null,
   /**
    * @property {Ext.menu.Menu} contextMenu
    */
   contextMenu : null,
   /**
    * @property {Ext.button.Button} gobackBtnRef
    */
   gobackBtnRef : null,
   model : [
      {name : 'id', type : 'string', persist : false},
      {name : 'text', type : 'string', persist : false},
      {name : 'icon', type : 'string', persist : false}
   ],
   initComponent : function()
   {
      this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.TREE_NAV_WIDGET');
      this.viewStore = this.getViewStore();
      this.navStore = this.getNavStoreObject();
      var appRef = this.appRef;
      Ext.apply(this, {
         tbar : {
            xtype : 'toolbar',
            layout : {
               type : 'vbox',
               align : 'end',
               padding : '0 5 0 0'
            },

            items : {
               xtype : 'button',
               text : this.LANG_TEXT.BTN.GO_BACK,
               disabled : true,
               listeners : {
                  afterrender : function(btn)
                  {
                     this.gobackBtnRef = btn;
                  },
                  click : function()
                  {
                     this.loadParentView();
                  },
                  scope : this
               }
            }
         },
         items : [{
            xtype : 'senchaexticonview',
            iconWidth : 64,
            iconHeight : 64,
            flex : 1,
            listeners : {
               afterrender : function(view)
               {
                  this.viewObject = view;
               },
               itemclick : this.widgetClickHandler,
               itemcontextmenu : this.itemContextMenuHandler,
               scope : this
            },
            setupIconCls : function(data)
            {
               data.iconCls = ('app-'+appRef.module+'-'+appRef.name+'-widget-'+data.id+'-icon').toLowerCase();
            },
            store : this.viewStore
         }]
      });
      this.addListener({
         afterrender : this.afterRenderHandler,
         scope : this
      });

      this.callParent();
   },
   /**
    * @inheritdoc
    */
   applyConstraintConfig : function(config)
   {

      this.callParent([config]);
      Ext.apply(config, {
         bodyStyle : {
            background : '#ffffff'
         },
         width : 600,
         height : 300,
         resizable : false,
         closable : true
      });

   },
   /**
    * 获取功能导航数据
    *
    * @return {Object}
    */
   getNavTreeData : Ext.emptyFn,
   /**
    * 默认打开Widget窗口
    *
    * @param {Ext.data.NodeInterface} node
    */
   onActionRequest : function(node)
   {
      this.appRef.showWidget(node.get('id'));
   },
   /**
    * 获取功能导航数据仓库
    *
    * @return {Ext.data.TreeStore}
    */
   getNavStoreObject : function()
   {
      var tree = this.getNavTreeData();
      return new Ext.data.TreeStore({
         fields : this.model,
         root : tree
      });
   },
   /**
    * 获取当前显示面板数据仓库
    *
    * @return {Ext.data.Store}
    */
   getViewStore : function()
   {
      return new Ext.data.Store({
         fields : this.model
      });
   },
   /**
    * 加载数据到ViewObject中
    *
    * @property {Ext.data.NodeInterface} node
    */
   loadView : function(node)
   {
      var items = node.childNodes;
      var len = items.length;
      if(len > 0){
         this.viewStore.loadData(items);
      }
      if(node.isRoot()){
         this.gobackBtnRef.setDisabled(true);
      }else{
         this.gobackBtnRef.setDisabled(false);
      }
      this.currentNode = node;
   },

   /**
    * 加载父节点的数据内容
    *
    * @property {Ext.data.NodeInterface} node
    */
   loadParentView : function()
   {
      var current = this.currentNode;
      var parent = current.parentNode;
      if(parent){
         this.loadView(parent);
      }
   },

   getContextMenu : function(record)
   {
      if(null == this.contextMenu){
         this.contextMenu = new Ext.menu.Menu({
            ignoreParentClicks : true,
            listeners : {
               click : this.menuItemClickHandler,
               scope : this
            }
         });
      }else{
         this.contextMenu.removeAll();
      }
      this.contextMenu.record = record;
      if(record.isLeaf()){
         this.contextMenu.add({
            text : Ext.String.format(WebOs.GET_LANG_TEXT('DESKTOP.TREE_NAV_WIDGET.MENU.OPEN'), record.get('text'))
         });
      }else{
         this.contextMenu.add({
            text : WebOs.GET_LANG_TEXT('DESKTOP.TREE_NAV_WIDGET.MENU.ENTER')
         });
      }
      return this.contextMenu;
   },
   menuItemClickHandler : function(menu, item)
   {
      if(item){
         this.widgetClickHandler(this.viewObject, menu.record);
      }
   },
   itemContextMenuHandler : function(view, record, item, index, event)
   {
      var menu = this.getContextMenu(record);
      var pos = event.getXY();
      event.stopEvent();
      menu.showAt(pos[0], pos[1]);
   },
   afterRenderHandler : function()
   {
      //将根节点的功能加载到view中
      var root = this.navStore.getRootNode();
      this.loadView(root);
   },
   /**
    * 处理图标点击
    *
    * @param {Cntysoft.Kernel.CoreComp.View.IconView} view
    * @param {Ext.data.NodeInterface} node
    */
   widgetClickHandler : function(view, node)
   {
      if(!node.isLeaf()){
         this.loadView(node);
      } else{
         this.onActionRequest(node);
      }
   },

   destroy : function()
   {
      delete this.navTreeData;
      delete this.navStore;
      delete this.viewStore;
      delete this.viewObject;
      delete this.gobackBtnRef;
      this.callParent();
   }
});