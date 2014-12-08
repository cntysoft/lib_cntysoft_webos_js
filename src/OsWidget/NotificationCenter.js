/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.NotificationCenter', {
    extend: 'Ext.grid.Panel',
    requires : [
        'WebOs.OsWidget.NotificationMsgReader'
    ],
    alias : 'widget.webosnotificationcenter',
    statics : {
        WIDTH : 300,
        AM : {
            READ : 1,
            IGNORE : 2,
            IGNORE_ALL : 3,
            CLEAR_READED : 4
        }
    },
    //private
    desktopRef : null,
    //private
    desktopViewGhostRef : null,

    /**
     * @property {Ext.menu.Menu} contextMenu
     */
    contextMenuRef : null,

    constructor : function(config)
    {
        this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.NOTIFICATION_CENTER');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            floating : true,
            width : this.self.WIDTH,
            y : WebOs.OsWidget.TopStatusBar.HEIGHT
        });
    },
    /**
     * @event recordreaded
     * 消息阅读事件
     *
     * @param {Object} record
     */
    /**
     * @event recordignored
     * 消息忽略事件
     *
     * @param {Object} record
     */
    /**
     * @event recordadded
     * 消息添加事件
     *
     * @param {Object} record
     */
    /**
     * @event recordadded
     * 清除已读记录
     *
     * @param {Object} record
     */
    initComponent : function()
    {
        Ext.apply(this,{
            height : this.desktopViewGhostRef.getHeight(),
            x : this.calculateX(),
            columns :  this.getColsConfig(),
            store : this.createStore()
        });
        this.desktopViewGhostRef.addListener({
            resize : function(ghost, width, height)
            {
                this.setHeight(height);
                this.setX(this.calculateX());
            },
            scope : this
        });
        //建立一个快速引用
        WebOs.ME.notificationCenter = this;
        this.addListener({
            itemcontextmenu : this.itemContextMenuHandler,
            itemdblclick : this.itemDbClickHandler,
            scope : this
        });
        this.callParent();
    },

    /**
     *
     * @param {String} title
     * @param {String} msg
     * @param {Integer} msgType
     * @param {Boolean} status
     *  @param {Boolean} emergency 是否紧急
     * @param {Object} meta 当msgType为WebOs.Kernel.Const.SYS_NOTIFICATION_MSG_CALLBACK有效
     */
    addRecord : function(title, msg, msgType, status, emergency, meta)
    {
        var store = this.store;
        var record = {
            id : store.getCount() + 1,
            title : title,
            msg : msg,
            status : status,
            msgType : msgType,
            meta : meta
        };
        store.add(record);
        store.sort('id', 'DESC');
        if(emergency){
            this.desktopRef.openNotificationPanel();
        }
        if(this.hasListeners.recordadded){
            this.fireEvent('recordadded', record);
        }
    },

    readRecord : function(record)
    {
        record.set('status', true);
        new WebOs.OsWidget.NotificationMsgReader({
            record : record
        });
        this.desktopRef.closeNotificationPanel();
        if(this.hasListeners.recordreaded){
            this.fireEvent('recordreaded', record);
        }
    },

    ignoreRecord : function(record)
    {
        record.set('status', true);
        if(this.hasListeners.recordignored){
            this.fireEvent('recordignored', record);
        }
    },

    clearReadedRecords : function()
    {
        var records = [];
        this.store.each(function(record){
            if(record.get('status')){
                records.push(record);
            }
        }, this);
        this.store.remove(records);
        if(this.hasListeners.recordcleared){
            this.fireEvent('recordcleared');
        }
    },

    getContextMenu : function()
    {
        if(null == this.contextMenuRef){
            var M_TEXT = this.LANG_TEXT.MENU;
            var C = this.self.AM;
            this.contextMenuRef = new Ext.menu.Menu({
                ignoreParentClicks : true,
                items : [{
                    text : M_TEXT.READ,
                    code : C.READ
                }, {
                    text : M_TEXT.IGNORE,
                    code : C.IGNORE
                },{
                    text : M_TEXT.IGNORE_ALL,
                    code : C.IGNORE_ALL
                },{
                    text : M_TEXT.CLEAR_READED,
                    code : C.CLEAR_READED
                }],
                listeners : {
                    click : this.menuItemClickHandler,
                    scope : this
                }
            });
        }
        return this.contextMenuRef;
    },

    itemContextMenuHandler : function(grid, record, htmlItem, index, event)
    {
        var menu = this.getContextMenu();
        var pos = event.getXY();
        menu.record = record;
        event.stopEvent();
        menu.showAt(pos[0], pos[1]);
    },

    itemDbClickHandler : function(grid, record)
    {
        this.readRecord(record);
    },

    menuItemClickHandler : function(menu, item)
    {
        var M = this.self.AM;
        var record = menu.record;
        var code = item.code;
        switch(code){
            case M.READ:
                this.readRecord(record);
                break;
            case M.IGNORE:
                this.ignoreRecord(record);
                break;
            case M.IGNORE_ALL:
                var items = this.store.getRange();
                var len = items.length;
                for(var i = 0; i < len; i++){
                    this.ignoreRecord(items[i]);
                }
                break;
            case M.CLEAR_READED:
                this.clearReadedRecords();
                break;
        }
    },

    calculateX : function()
    {
        return this.desktopViewGhostRef.getWidth() - this.self.WIDTH;
    },
    toFront : Ext.emptyFn,

    /**
     * @return {Ext.data.Store}
     */
    createStore : function()
    {
        return new Ext.data.Store({
            autoLoad : true,
            fields : [
                {name : 'title', type : 'string', persist : false},
                {name : 'status', type : 'boolean', persist : false},
                {name : 'msgType', type : 'integer', persist : false},
                {name : 'msg', type : 'string', persist : false},
                {name : 'meta', type : 'auto', persist : false}
            ]
        });
    },

    statusRenderer : function(value)
    {
        if(value){
            return '<span style = "color:blue">' + this.LANG_TEXT.READED + '</span>';
        }else{
            return '<span style = "color:red">'+this.LANG_TEXT.UNREADED+'</span>';
        }
    },

    getColsConfig : function()
    {
        var COLS = this.LANG_TEXT.COLS;
        return [
            {text : COLS.TITLE, dataIndex : 'title', flex : 1, resizable : false, sortable : false, menuDisabled : true},
            {text : COLS.STATUS, dataIndex : 'status', width : 60, resizable : false, sortable : false, menuDisabled : true, renderer : Ext.bind(this.statusRenderer, this)}
        ];
    },

    destroy : function()
    {
        delete this.LANG_TEXT;
        delete this.desktopRef;
        delete this.desktopViewGhostRef;
        this.callParent();
    }
});