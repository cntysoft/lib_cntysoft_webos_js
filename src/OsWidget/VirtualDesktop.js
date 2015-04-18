/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 虚拟桌面当前是按照功能进行分类，CMS内容管理系统,服务号，企业号等等
 */
Ext.define('WebOs.OsWidget.VirtualDesktop',{
    extend : 'Ext.view.View',
    requires : [
        'WebOs.OsWidget.VDDragZone',
        'WebOs.OsWidget.VDDropZone'
    ],
    alias : 'widget.webosvirtualdesktopview',
    statics : {
        PX : {
            PADDING : 5
        }
    },
    /**
     * 虚拟桌面的识别key
     */
    moduleKey : null,
    /**
     * 指定渲染模板
     *
     * @property {Ext.XTemplate} tpl
     */
    tpl : new Ext.XTemplate(['<tpl for=".">',
        '<div class="webos-vdesktop-app-wrapper x-unselectable" id="{name}-shortcut" style="width:{width}px;height:{height}px">',
        '<div class="webos-vdesktop-app-icon {iconCls}"  style="width:{iconWidth}px;height:{iconHeight}px;margin:10px auto;{iconBgStyle}" title="{text}">',
        '</div>',
        '<div class="webos-vdesktop-app-bg" style = "height : 20px;width : {textWidth}px;{position}"></div>',
        '<div class="webos-vdesktop-app-text" style = "line-height:20px;height : 20px;width : {textWidth}px;{position}">',
        '<div style ="margin:0 auto;font-size:12px;">{text}</div>',
        '</div>',
        '</div>',
        '</tpl>',
        '<div class="x-clear"></div>']),
    //private
    desktopRef : null,

    /**
     * @property {WebOs.OsWidget.VDesktopGragZone} dragZone
     */
    dragZone : null,
    /**
     * @property {WebOs.OsWidget.VDesktopDropZone} dropZone
     */
    dropZone : null,
    /**
     * 构造函数
     *
     * @param {object} config
     */
    constructor : function(config)
    {
        config =  config || {};
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },
    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            shadow: false,
            itemSelector : 'div.webos-vdesktop-app-wrapper',
            trackOver : true,
            overItemCls : 'webos-vdesktop-app-icon-hover',
            /**
             * 图标信息
             *
             * @property {object} iconInfo
             */
            iconInfo : {
                width : 120,
                height : 120,
                iconWidth : 72,
                iconHeight : 72,
                padding : 4,
                margin : 4,
                textWidth : 110,
                position : 'left: 5px'
            }
        });
    },
    initComponent : function()
    {
        Ext.apply(this,{
            store : this.createDesktopIconsStore()
        });
        this.desktopRef.addListener({
            resize : function()
            {
                this.sortIcons();
            },
            scope : this
        });
        this.addListener({
            containercontextmenu : function(self, event)
            {
                var pos = event.getXY();
                var menu = this.desktopRef.getDesktopMenu();
                event.stopEvent();
                menu.showAt(pos[0], pos[1]);
            },
            scope : this
        });
        this.callParent();
    },

    createDesktopIconsStore : function()
    {
        var C = WebOs.C;
        var appCol = WebOs.getSysEnv().get(C.ENV_APP);
        var apps = [];
        var mkey = this.moduleKey;
        var order = 0;
        appCol.each(function(app){
            if(mkey == app.module && app.showOnDesktop){
                //计算icon css
                app.iconCls = WebOs.Utils.getAppIconCls(app.module, app.name)
                apps.push(app);
                app.order = order++;
            }
        });
        var store = new Ext.data.Store({
            id : C.WEBOS_V_DESKTOP + 'STORE_' + mkey,
            data : apps,
            fields: [
                {name : 'name', types : 'string'},
                {name : 'text', type : 'string'},
                {name : 'iconCls', type : 'string'},
                {name : 'module', type : 'string'},
                {name : 'showOnDesktop', type : 'boolean'},
                {name : 'runConfig', type : 'auto'},
                {name : 'order', type : 'integer'}
            ]
        });
        return store;
    },
    /**
     * Function which can be overridden to provide custom formatting for each Record that is used by this
     * DataView's {@link #tpl template} to render each node.
     * @param {Object/Object[]} data The raw data object that was used to create the Record.
     * @param {Number} recordIndex the index number of the Record being prepared for rendering.
     * @param {Ext.data.Model} record The Record being prepared for rendering.
     * @return {Array/Object} The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
     * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
     */
    prepareData : function(data, index, record)
    {
        var data = this.callParent([data, index, record]);
        Ext.apply(data, this.iconInfo);
        //设置背景大小 CSS3
        var types = [
            '-moz-background-size',
            '-webkit-background-size',
            '-o-background-size',
            'background-size'
        ];
        var len = types.length;
        var style = '';
        for(var i = 0; i < len; i++){
            style += types[i] + ':'+data.iconWidth + 'px '+data.iconWidth+'px;';
        }

        data.iconBgStyle = style;
        return data;
    },

    /**
     * @inhritdoc
     */
    onBoxReady : function(width, height)
    {
        this.dragZone = new WebOs.OsWidget.VDDragZone(this);
        this.dropZone = new WebOs.OsWidget.VDDropZone(this);
        this.callParent(arguments);
    },
    /**
     * 获取桌面项目
     *
     * @return [] 返回桌面项的dom对象
     */
    getIconItems : function()
    {
        var div = this.getTargetEl().dom;
        return Ext.query(this.getItemSelector(), true, div);
    },
    /**
     * 进行桌面项布局
     *
     * @param {Ext.view.View} selfView
     * @param {int} width
     * @param {int} height
     */
    doItemLayout : function(selfView, width, height)
    {
        var items = this.getIconItems();
        var box = this.getIconBox();
        var rows = Math.floor(height / box.height);
        var curCol = 0;
        var rowCount = 0;
        var info = this.iconInfo;
        //像素排列
        Ext.each(items, function(item){
            var el = Ext.fly(item);
            var left = curCol == 0 ? 0 : (info.margin + box.width) * curCol;
            left += this.self.PX.PADDING;
            var top = rowCount == 0 ? 0 : (info.margin + info.height) * rowCount;
            top += this.self.PX.PADDING;
            el.setLeft(left);
            el.setTop(top);
            rowCount++;
            if(rowCount == rows){
                rowCount = 0;
                curCol++;
            }
        }, this);
    },
    /**
     * 获取icon的box
     * @private
     * @return {object}
     */
    getIconBox : function()
    {
        var info = this.iconInfo;
        return {
            width : info.width + info.margin,
            height : info.height + info.margin
        };
    },
    /**
     * 进行一个布局，居然afterrender派发时候 item不可取
     */
    refresh : function()
    {
        this.callParent();
        if(!this.refleshLayout){
            this.doItemLayout(this, this.desktopRef.desktopViewGhostRef.getWidth(), this.desktopRef.desktopViewGhostRef.getHeight());
            this.refleshLayout = true;
        }
    },
    /**
     * 重新排列图标
     */
    sortIcons : function()
    {
        this.doItemLayout(this, this.desktopRef.desktopViewGhostRef.getWidth(), this.desktopRef.desktopViewGhostRef.getHeight());
    },
    destroy : function()
    {
        delete this.desktopRef;
        this.dragZone.destroy();
        delete this.dragZone;
        this.dropZone.destroy();
        delete this.dropZone;
        this.callParent();
    }
});