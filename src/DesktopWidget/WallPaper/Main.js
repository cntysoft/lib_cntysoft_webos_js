/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.DesktopWidget.WallPaper.Main', {
    extend: 'WebOs.DesktopWidget.AbstractWidget',
    requires: [
        'SenchaExt.View.ImageView',
        'SenchaExt.Data.Proxy.ApiProxy',
        'WebOs.DesktopWidget.WallPaper.Lang.zh_CN',
        'Ext.ux.colorpick.Selector',
        'WebOs.Component.Uploader.SimpleUploader'
    ],
    mixins : {
        formTooltip : 'Cntysoft.Mixin.FormTooltip'
    },
    statics : {
        TYPE_PANEL_MAP : {
            Color : 0,
            WallpaperLocalImage : 1,
            WallpaperNetImage : 2
        }
    },

    LANG_NAMESPACE : 'WebOs.DesktopWidget.WallPaper.Lang',
    widgetName : 'WallPaper',
    /**
     * 当前登陆的用户
     */
    currentUser : null,
    /**
     * 桌面窗纸图片所在的文件夹
     */
    wallPaperDir : null,
    /**
     * 本地图片操作功能面板
     */
    contextMenuRef : null,
    //private
    desktopRef : null,
    //private
    uploadBtnRef : null,
    //private
    wallpaperLocalImageRef : null,
    //private
    wallpaperNetImageRef : null,
    //private
    wallPaperContainerRef : null,
    //private
    wallPaperColorRef : null,
    //private
    originWallPaper : null,
    //private
    newWallPaper : null,
    /**
     * 这个是服务器端的接口，平台管理和正常的webos可能需要需要请求的网址内容不一样，修复这个bug
     */
    serverApi : null,
    constructor : function()
    {
        this.mixins.formTooltip.constructor.call(this);
        this.LANG_TEXT = this.GET_LANG_TEXT('MAIN');
        var C = WebOs.Kernel.Const;
        this.currentUser = WebOs.getSysEnv().get(C.ENV_CUR_USER);
        this.originWallPaper = this.currentUser.wallPaper;
        this.desktopRef = WebOs.R_SYS_UI_RENDER.getOsWidget(WebOs.Const.WEBOS_DESKTOP);
        this.wallPaperDir = WebOs.ME.getSelfDataRootPath()+'/WallPaper/'+this.currentUser.name;
        this.callParent(arguments);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config, {
            title : this.LANG_TEXT.TITLE,
            width : 1000,
            height : 500,
            resizable : true,
            autoScroll : true
        });
        this.callParent([config]);
    },

    initComponent : function()
    {
        var BTN = this.LANG_TEXT.BTN;
        Ext.apply(this, {
            items : [
                this.getWallPaperTypeContainerConfig(),
                this.getWallPaperContainerConfig()
            ],
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            buttons : [{
                text : BTN.SAVE,
                listeners : {
                    click : this.saveHandler,
                    scope : this
                }
            }, {
                text : BTN.CANCEL,
                listeners : {
                    click : this.cancelChangeHandler,
                    scope : this
                }
            }, {
                text : BTN.CLOSE,
                listeners : {
                    click : function(){
                        this.close();
                    },
                    scope : this
                }
            }]
        });
        this.addListener({
            beforeclose : this.beforeCloseHandler,
            scope : this
        });
        this.callParent();
    },


    getDefaultWallPaper : function()
    {
        return [WebOs.Kernel.Const.WALLPAPER_COLOR,'#1461C9'];
    },

    refreshLocalImgPool : function()
    {
        this.wallpaperLocalImageRef.getStore().load({
            params : {
                path : this.wallPaperDir
            }
        });
    },

    /**
     * 获取本地的图片的存储
     */
    getLocalImageStore : function()
    {
        return new Ext.data.Store({
            fields : [
                {name : 'id', type : 'string'},
                {name : 'name', type : 'string'},
                {name : 'icon', type : 'string'},
                {name : 'type', type : 'string'}
            ],
            proxy : this.getDkWidgetApiProxy('getLocalImages')
        });
    },

    /**
     * 获取widget的API代理配置对象
     *
     * @return {Object}
     */
    getDkWidgetApiProxy : function(method)
    {
        var me = this;
        var serverScriptName = this.widgetName;
        if(this.serverApi){
            serverScriptName = this.serverApi.getServerScriptName();
        }
        return {
            type : 'apigateway',
            callType : 'Sys',
            invokeMetaInfo : {
                name : 'DkWidget',
                method : 'dispatcherRequest'
            },
            invokeParamsReady : function(params)
            {
                return {
                    key : serverScriptName,
                    method : method,
                    args : params
                };
            },
            reader : {
                type : 'json',
                rootProperty : 'items'
            }
        };
    },

    /**
     * 调用Widget的服务器端函数接口
     *
     * @param {String} method
     * @param {Object} params
     * @param {Funtion} callback
     * @param {Scope} scope
     */
    callApi : function(method, params, callback, scope)
    {
        var me = this;
        var serverScriptName = this.widgetName;
        if(this.serverApi){
            serverScriptName = this.serverApi.getServerScriptName();
        }
        Cntysoft.callSys('DkWidget', 'dispatcherRequest', {
            key : serverScriptName,
            method : method,
            args : params
        }, callback, scope);
    },

    /**
     * 单击保存按钮后的操作
     */
    saveHandler : function()
    {
        var MSG = this.LANG_TEXT.MSG;
        if(this.newWallPaper && this.newWallPaper != this.originWallPaper){
            Cntysoft.showQuestionWindow(MSG.SAVE, function(btn){
                if(btn == 'yes'){
                    var type = this.self.TYPE_PANEL_MAP[this.wallPaperTypeComboRef.getValue()];
                    var MAP =  this.self.TYPE_PANEL_MAP;
                    var data = {
                        wallPaper : this.newWallPaper,
                        type : type
                    };
                    if(type == MAP.WallpaperNetImage){
                        data.saveToLocal = this.wallpaperNetImageRef.getForm().getValues().saveToLocal == 'on' ? true : false;
                    }
                    this.setLoading(Cntysoft.GET_LANG_TEXT('MSG.SAVE'));
                    this.callApi('changeWallPaper', data, this.afterSaveHandler, this);
                }
            }, this)
        }
    },



    afterSaveHandler : function(response)
    {
        var MSG = this.LANG_TEXT.MSG;
        this.loadMask.hide();
        if(!response.status){
            Cntysoft.showErrorWindow(response.msg);
        } else{
            var data = response.data;
            this.originWallPaper =  this.newWallPaper;
            this.newWallPaper = null;
            this.currentUser.wallPaper = this.originWallPaper;
            Cntysoft.showAlertWindow(MSG.SAVE_SUCCESS, function(){
                this.close();
            }, this);
            this.refreshLocalImgPool();
        }
    },

    /**
     * 窗口关闭前的事件执行的操作
     */
    beforeCloseHandler : function()
    {
        if(this.newWallPaper && this.newWallPaper != this.originWallPaper){
            var MSG = this.LANG_TEXT.MSG;
            Cntysoft.showQuestionWindow(MSG.BEFORE_CLOSE, function(btn){
                if(btn == 'yes'){
                    this.cancelChangeHandler();
                    this.close();
                }
            }, this);
            return false;
        }
    },

    /**
     * 丢掉现有的修改，恢复最开始的修改
     */
    cancelChangeHandler : function()
    {
        var parts = this.originWallPaper.split('|');
        var type = parseInt(parts[0]);
        if(type != WebOs.Kernel.Const.WALLPAPER_COLOR && type != WebOs.Kernel.Const.WALLPAPER_IMAGE){
            this.desktopRef.changeWallPaper(type, parts[1]);
        }else{
            var wallPaper = this.getDefaultWallPaper();
            this.desktopRef.changeWallPaper(wallPaper[0], wallPaper[1]);
        }
        this.newWallPaper = null;
    },

    /**
     * combobox组件选中时的方法
     */
    typeComboChangeHandler : function(obj, newValue, oldValue)
    {
        if('WallpaperLocalImage' == newValue){
            this.refreshLocalImgPool();
            this.uploadBtnRef.show();
        }else{
            this.uploadBtnRef.hide();
        }
        var index = this.self.TYPE_PANEL_MAP[newValue];
        this.wallPaperContainerRef.getLayout().setActiveItem(index);
        //失效选择的壁纸
        this.newWallPaper = null;
    },

    uploadSuccessHandler : function()
    {
        this.refreshLocalImgPool();
    },

    /**
     * 网络图片地址修改的事件
     */
    netImageChangeHandler : function(obj, newValue)
    {
        var form = this.wallpaperNetImageRef.getForm();
        if(!form.isValid() || !newValue){
            return false;
        }
        this.desktopRef.changeWallPaper(WebOs.Kernel.Const.WALLPAPER_IMAGE, newValue);
        this.newWallPaper = WebOs.Kernel.Const.WALLPAPER_IMAGE + '|' + newValue;
    },

    getWallPaperTypeContainerConfig : function()
    {
        return {
            xtype : 'container',
            height : 35,
            margin : '2',
            layout : {
                type : 'hbox'
            },
            items : [
                this.getWallPaperTypeComboConfig(),
                this.getUploadBtnConfig()
            ]
        };
    },

    getWallPaperTypeComboConfig : function()
    {
        var TITLE = this.LANG_TEXT.COMBO_TITLE;
        var LABEL = this.LANG_TEXT.COMBO_LABEL;
        var BTN = this.LANG_TEXT.BTN;
        var TOOLTIP = this.LANG_TEXT.TOOLTIP;
        var typeStore = Ext.create('Ext.data.Store', {
            fields : ['type', 'name'],
            data : [
                {type : "Color", "name" : TITLE.COLOR},
                {type : "WallpaperLocalImage", "name" : TITLE.LOCAL_IMAGE},
                {type : "WallpaperNetImage", "name" : TITLE.NET_IMAGE}
            ]
        });
        return {
            xtype : 'combobox',
            width : 240,
            labelWidth : 120,
            margin : '0 0 0 8',
            fieldLabel : LABEL.THEME,
            store : typeStore,
            value : 'Color',
            queryModel : 'local',
            displayField : 'name',
            valueField : 'type',
            editable : false,
            toolTipText : TOOLTIP.COMBO,
            listeners : {
                afterrender : function(combo)
                {
                    this.mixins.formTooltip.setupTooltipTarget.call(this, combo);
                    this.wallPaperTypeComboRef = combo;
                },
                change : this.typeComboChangeHandler,
                scope : this
            }
        }
    },

    getUploadBtnConfig : function()
    {
        var BTN = this.LANG_TEXT.BTN;
        var TOOLTIP = this.LANG_TEXT.TOOLTIP;
        return {
            xtype : 'webossimpleuploader',
            uploadPath : this.wallPaperDir,
            createSubDir : false,
            fileTypeExts : ['gif', 'png', 'jpg', 'jpeg'],
            margin : '0 0 0 5',
            hidden : true,
            enableFileRef : false,
            maskTarget : this,
            toolTipText : TOOLTIP.UPLOADER_BTN,
            buttonText : BTN.UPLOAD,
            listeners : {
                fileuploadsuccess : this.uploadSuccessHandler,
                afterrender : function(comp)
                {
                    this.uploadBtnRef = comp;
                },
                scope : this
            }
        };
    },

    getWallPaperContainerConfig : function()
    {
        return {
            xtype : 'container',
            layout : {
                type : 'card'
            },
            listeners : {
                afterrender : function(comp)
                {
                    this.wallPaperContainerRef = comp;
                },
                scope : this
            },
            flex : 1,
            items : [
                this.getColorSettingPanelConfig(),
                this.getWallpaperLocalImagePanelConfig(),
                this.getWallpaperNetImagePanelConfig()
            ]
        };
    },

    getColorSettingPanelConfig : function()
    {
        var parts = this.originWallPaper.split('|');
        var type = parseInt(parts[0]);
        var color = '#1461C9';
        if(type == WebOs.Const.WALLPAPER_COLOR){
            color = parts[1];
        }
        return {
            xtype : 'colorselector',
            value : color,
            listeners : {
                afterrender : function(comp)
                {
                    this.wallPaperColorRef = comp;
                },
                change : function(selector, color)
                {
                    if(!this.$_first_time_$){
                        this.$_first_time_$ = true;
                        return;
                    }
                    var style = '#' + color;
                    this.desktopRef.changeWallPaper(WebOs.Const.WALLPAPER_COLOR, style);
                    this.newWallPaper = WebOs.Const.WALLPAPER_COLOR + '|' + style;
                },
                scope : this
            }
        };
    },

    getWallpaperLocalImagePanelConfig : function()
    {
        var TOOLTIP = this.LANG_TEXT.TOOLTIP;
        return {
            xtype : 'senchaextimageview',
            cls : 'webos-dk-widget-local-image',
            iconInfo : {
                width : 200,
                height : 150,
                iconWidth : 190,
                iconHeight : 130
            },
            autoScroll : false,
            layout : 'fit',
            toolTipText : TOOLTIP.LOCAL_IMAGE,
            store : this.getLocalImageStore(),
            listeners : {
                afterrender : function(view){
                    this.wallpaperLocalImageRef = view;
                    this.mixins.formTooltip.setupTooltipTarget.call(this, view);
                },
                itemclick : function(view, record){
                    this.desktopRef.changeWallPaper(WebOs.Const.WALLPAPER_IMAGE, record.raw.icon);
                    this.newWallPaper = WebOs.Const.WALLPAPER_IMAGE+ '|' + record.raw.icon;
                },
                //itemcontextmenu : this.getLocalImageContextMenu,
                scope : this
            }
        };
    },

    getWallpaperNetImagePanelConfig : function()
    {
        var NET_IMAGE = this.LANG_TEXT.NET_IMAGE;
        var TOOLTIP = this.LANG_TEXT.TOOLTIP;
        return new Ext.form.Panel({
            margin : '0 0 0 10',
            items : [{
                xtype : 'textfield',
                width : 800,
                cls : 'webos-dk-widget-net-image',
                fieldLabel : NET_IMAGE.LABEL,
                labelWidth : 120,
                name : 'url',
                vtype : 'url',
                toolTipText : TOOLTIP.NET_IMAGE,
                listeners : {
                    afterrender : function(formItem){
                        this.mixins.formTooltip.setupTooltipTarget.call(this, formItem);
                    },
                    change : this.netImageChangeHandler,
                    scope : this
                }
            }, {
                xtype : 'checkbox',
                fieldLabel : NET_IMAGE.BOX_LABEL,
                labelWidth : 120,
                name : 'saveToLocal',
                checked : true
            }, {
                xtype : 'displayfield',
                name : 'care',
                cls : 'webos-dk-widget-care',
                value : NET_IMAGE.DISPLAY
            }],
            listeners : {
                afterrender : function(comp)
                {
                    this.wallpaperNetImageRef = comp;
                },
                scope : this
            }
        });
    },

    destroy : function()
    {
        delete this.uploadBtnRef;
        delete this.wallPaperTypeComboRef;
        delete this.wallpaperLocalImageRef;
        delete this.wallpaperNetImageRef;
        delete this.wallPaperColorRef;
        delete this.wallPaperContainerRef;
        delete this.serverApi;
        this.callParent();
    }
});