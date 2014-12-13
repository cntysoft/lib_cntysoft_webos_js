/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.Desktop',{
    extend : 'Ext.container.Viewport',
    requires : [
        'Ext.layout.container.Border',
        'Ext.layout.container.HBox',
        'Ext.layout.container.Fit',
        'Ext.layout.container.Card',
        'Ext.container.Container',
        'WebOs.OsWidget.TopStatusBar',
        'WebOs.OsWidget.AppSwitchBar',
        'WebOs.OsWidget.NotificationCenter',
        'WebOs.OsWidget.ModuleSelector',
        'WebOs.OsWidget.VirtualDesktop'
    ],
    //private
    appRef : null,
    //private
    advicePanelShowed : false,
    //private
    advicePanelShowing : false,
    //private
    appSwitchBarRef : null,
    //private
    notificationRef : null,
    //private
    floatWinPool : null,
    //private
    desktopViewRef : null,
    //private
    desktopViewGhostRef : null,
    //private
    moduleSelector : null,
    //private
    desktopMenuRef : null,
    /**
     * 虚拟桌面关联的窗口
     *
     * @property {Array} vdWindows
     */
    vdWindows : [],
    /**
     * 按照模块进行重新组织
     *
     * @cfg {Object} appMetas
     */
    appMetas : {},

    //几个标志位
    isMoving : false,
    isWinMoving : false,
    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP');
        Ext.apply(config,{
            id : WebOs.Const.WEBOS_DESKTOP,
            layout : {
                type : 'border'
            }
        });
        var appCol = WebOs.getSysEnv().get(WebOs.C.ENV_APP);
        var metas = {};
        appCol.each(function(app){
            if(!Ext.isDefined(metas[app.module])){
                metas[app.module] = [];
            }
            metas[app.module].push(app);
        },this);
        this.appMetas = metas;
        var supportedModules = WebOs.getSysEnv().get(C.ENV_SUPPORTED_MODULES);
        this.$_mkeys_$ = [];
        this.$_module_index_map_$ = {};
        var index = 0;
        for(var mkey in supportedModules){
            this.$_mkeys_$.push(mkey);
            this.$_module_index_map_$[mkey] = index;
            this.vdWindows[mkey] = new Ext.util.HashMap();
            index++;
        }
        this.callParent([config]);
    },
    /**
     * @event notificationpanelopenbegin
     * 通知栏打开开始
     *
     * @param {WebOs.OsWidget.NotificationCenter} notificationPanel
     */
    /**
     * @event notificationpanelopenend
     * 通知栏打开完成
     *
     *  @param {WebOs.OsWidget.NotificationCenter} notificationPanel
     */
    /**
     * @event notificationpanelclosebegin
     * 通知栏关闭开始
     *
     * @param {WebOs.OsWidget.NotificationCenter} notificationPanel
     */
    /**
     * @event notificationpanelcloseend
     * 通知栏关闭完成
     *
     * @param {WebOs.OsWidget.NotificationCenter} notificationPanel
     */
    /**
     * @event vdesktopswitch
     * 虚拟桌面切换
     * @param {String} newModule
     * @param {String} orgModule
     */
    /**
     * @event sysmenuitemclick
     * 系统菜单项点击事件
     *
     * @param {WebOs.OsWidget.SysMenu} menu
     * @param {}
     */
    initComponent : function()
    {
        WebOs.R_SYS_UI_RENDER.setOsWidget(WebOs.Const.WEBOS_DESKTOP, this);
        Ext.apply(this,{
            shadow: false,
            items : [new WebOs.OsWidget.TopStatusBar({
                region : 'north'
            }), this.getDesktopContainer()]
        });
        this.addListener({
            afterrender : function()
            {
                WebOs.ME.fireEvent('desktopready');
            },
            boxready : this.desktopBoxReadyHandler,

            scope : this
        });
        Ext.getBody().addListener({
            click : this.notificationClickCloseHandler,
            scope : this
        });
        this.addListener({
            notificationpanelopenbegin : this.notificationPanelOpenBeginHandler,
            notificationpanelclosebegin : this.notificationPanelCloseBeginHandler,
            scope : this
        });

        this.callParent();
    },

    notificationPanelOpenBeginHandler : function(notification)
    {
        var curVdesktop = this.getCurrentVDesktop();
        var curModuleKey = curVdesktop.moduleKey;
        var curWins = this.vdWindows[curModuleKey];
        curWins.each(function(key, win){
            var x = win.getX() - Ext.getClass(notification).WIDTH;
            win.animate({
                to : {
                    x : x
                }
            });
        }, this);
    },

    notificationPanelCloseBeginHandler : function(notification)
    {
        var curVdesktop = this.getCurrentVDesktop();
        var curModuleKey = curVdesktop.moduleKey;
        var curWins = this.vdWindows[curModuleKey];
        curWins.each(function(key, win){
            var x = win.getX() + Ext.getClass(notification).WIDTH;
            win.animate({
                to : {
                    x : x
                }
            });
        }, this);
    },

    /**
     * 切换虚拟桌面
     *
     * @param {String} mkey
     * @param {Function} callback
     * @param {Object}
     */
    switchDesktop : function(mkey, callback, scope)
    {
        if(!this.isMoving/* && !this.isWinMoving*/){
            if(!Ext.Array.contains(this.$_mkeys_$, mkey)){
                Cntysoft.raiseError(
                    Ext.getClassName(this),
                    'switchDesktop',
                    'mkey : '+mkey + ' is not supported'
                );
            }
            callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
            scope = scope ? scope : this;
            var curVdesktop = this.getCurrentVDesktop();
            var curModuleKey = curVdesktop.moduleKey;
            if(mkey == curModuleKey){
                return;
            }
            var layout = this.desktopViewRef.getLayout();
            var curIndex = this.$_module_index_map_$[curModuleKey];
            var targetIndex = this.$_module_index_map_$[mkey];
            this.isMoving = true;
            //当前需要移动的大小
            if(targetIndex < curIndex){
                //向右移动
                var moveLength = this.desktopViewRef.getWidth();
            }else{
                //向左移动
                var moveLength = -this.desktopViewRef.getWidth();
            }
            this.moveVDesktopWins(curModuleKey, mkey, moveLength);
            curVdesktop.animate({
                to : {
                    x : moveLength
                },
                callback : function()
                {
                    this.isMoving = false;
                    curVdesktop.setX(0);
                    layout.setActiveItem(targetIndex);
                    if(this.hasListeners.vdesktopswitch){
                        this.fireEvent('vdesktopswitch', mkey, curModuleKey);
                    }
                },
                scope : this
            });
        }
    },
    /**
     * 移动虚拟桌面关联的窗口
     *
     * @param {Integer} curModuleKey 当前的虚拟桌面
     * @param {Integer} targetModuleKey 目标的虚拟桌面
     * @param {Integer} moveLength
     */
    moveVDesktopWins : function(curModuleKey, targetModuleKey, moveLength)
    {
        var curIndex = this.$_module_index_map_$[curModuleKey];
        var targetIndex = this.$_module_index_map_$[targetModuleKey];
        var curWins = this.vdWindows[curModuleKey];
        var targetWins = this.vdWindows[targetModuleKey];
        this.isWinMoving = true;
        var curCount = curWins.getCount();
        var targetCount = targetWins.getCount();
        var finishCount = 0;
        var total = curCount + targetCount;
        curWins.each(function(key, win){
            win.animate({
                to : {
                    x : moveLength
                },
                callback : function()
                {
                    finishCount++;
                    if(finishCount == targetCount){
                        this.isWinMoving = false;
                    }
                    win.hide();
                },
                scope : this
            });
        }, this);
        targetWins.each(function(key, win){
            //计算显示的x坐标
            var x = win.$_x_ratio_$ * this.desktopViewRef.getWidth();
            win.show();
            win.animate({
                to : {
                    x : x
                },
                callback : function()
                {
                    finishCount++;
                    if(finishCount == targetCount){
                        this.isWinMoving = false;
                    }
                },
                scope : this
            });
        }, this);
    },
    /**
     * 把一个窗口注册到当前激活状态的虚拟桌面容器中
     *
     * @param {String} key
     * @param {Ext.window.Window} win
     */
    registerWindow : function(key, win)
    {
        var cur = this.getCurrentVDesktop();
        var mkey = cur.moduleKey;
        var hashMap = this.vdWindows[mkey];
        if(!hashMap.containsKey(key)){
            hashMap.add(key, win);
        }
    },

    /**
     * 把相关的窗口从关联的虚拟桌面删除
     *
     * @param {String} key
     * @param {String} moduleKey
     */
    unregisterWindow : function(key, moduleKey)
    {
        var hashMap = this.vdWindows[moduleKey];
        if(hashMap.containsKey(key)){
            hashMap.removeAtKey(key);
        }
    },

    /**
     * 获取当前的虚拟桌面对象引用
     */
    getCurrentVDesktop : function()
    {
        return this.desktopViewRef.getLayout().getActiveItem();
    },


    /**
     * 获取桌面的容器对象
     */
    getDesktopContainer : function()
    {
        return {
            region : 'center',
            xtype : 'container',
            listeners : {
                afterrender : function(cmp)
                {
                    this.desktopViewGhostRef = cmp;
                },
                scope : this
            }
        };
    },

    generateVirtualItems : function()
    {
        var C = WebOs.C;
        var supportModules = WebOs.getSysEnv().get(C.ENV_SUPPORTED_MODULES);
        var items = [];
        for(var mkey in supportModules) {
            items.push({
                xtype : 'container',
                layout : 'fit',
                moduleKey : mkey,
                items : {
                    id : C.WEBOS_V_DESKTOP + '_' + mkey,
                    xtype : 'webosvirtualdesktopview',
                    desktopRef : this,
                    appRef : this.appRef,
                    moduleKey : mkey,
                    listeners : {
                        itemclick : this.iconLeftClickHandler,
                        //itemcontextmenu : desktop.iconRightClickHandler,
                        //containercontextmenu : desktop.desktopContextClickHandler,
                        scope : this
                    }
                }
            });
        }
        //暂时就想到这么多，以后肯定会越来越丰富
        return items;
    },
    /**
     * 改变桌面的壁纸， 两种类型，纯色和图片壁纸
     *
     * @param {Integer} type
     * @param {String} value
     */
    changeWallPaper : function(type, value)
    {
        var C = WebOs.Const;
        var bgValue;
        if(type == C.WALLPAPER_COLOR){
            bgValue = value;
        }else if(type == C.WALLPAPER_IMAGE){
            bgValue = 'url('+value+')';
        }
        if(this.rendered){
            this.desktopViewRef.setStyle('background', bgValue);
            this.desktopViewRef.setStyle('background-size', window.screen.width + 'px ' + window.screen.height + 'px');
        }
    },
    toggleNotificationPanel : function()
    {
        if(!this.notificationPanelShowing){
            if(!this.notificationPanelShowed){
                //打开
                this.notificationPanelShowing = true;
                if(this.hasListeners.notificationpanelopenbegin){
                    this.fireEvent('notificationpanelopenbegin', this.notificationRef);
                }
                var width = Ext.getClass(this.notificationRef).WIDTH;
                this.desktopViewRef.setX(-width,  {
                    callback : function()
                    {
                        this.notificationPanelShowed = true;
                        this.notificationPanelShowing = false;
                        if(this.hasListeners.notificationpanelopenend){
                            this.fireEvent('notificationpanelopenend', this.notificationRef);
                        }
                    },
                    scope : this
                });
            }else{
                if(this.hasListeners.notificationpanelclosebegin){
                    this.fireEvent('notificationpanelclosebegin', this.notificationRef);
                }
                this.desktopViewRef.setX(0,{
                    callback : function()
                    {
                        this.notificationPanelShowed = false;
                        this.notificationPanelShowing = false;
                        if(this.hasListeners.notificationpanelcloseend){
                            this.fireEvent('notificationpanelcloseend', this.notificationRef);
                        }
                    },
                    scope : this
                });
            }
        }
    },

    /**
     * 打开 消息通知面板
     */
    openNotificationPanel : function()
    {
        if(!this.notificationPanelShowing){
            if(!this.notificationPanelShowed){
                //打开
                this.notificationPanelShowing = true;
                if(this.hasListeners.notificationpanelopenbegin){
                    this.fireEvent('notificationpanelopenbegin', this.notificationRef);
                }
                var width = Ext.getClass(this.notificationRef).WIDTH;
                this.desktopViewRef.setX(-width,  {
                    callback : function()
                    {
                        this.notificationPanelShowed = true;
                        this.notificationPanelShowing = false;
                        if(this.hasListeners.notificationpanelopenend){
                            this.fireEvent('notificationpanelopenend', this.notificationRef);
                        }
                    },
                    scope : this
                });
            }
        }
    },

    /**
     * 关闭消息通知面板
     */
    closeNotificationPanel : function()
    {
        if(!this.notificationPanelShowing){
            if(this.notificationPanelShowed){
                if(this.hasListeners.notificationpanelclosebegin){
                    this.fireEvent('notificationpanelclosebegin', this.notificationRef);
                }
                this.desktopViewRef.setX(0,{
                    callback : function()
                    {
                        this.notificationPanelShowed = false;
                        this.notificationPanelShowing = false;
                        if(this.hasListeners.notificationpanelcloseend){
                            this.fireEvent('notificationpanelcloseend', this.notificationRef);
                        }
                    },
                    scope : this
                });
            }
        }
    },

    /**
     * @param {String} module
     * @param {String} app
     * @param {Object} runConfig
     */
    runApp : function(module, app, runConfig)
    {
        var STD_HANDLER = this.appRef.getStdHandler();
        var CM = WebOs.Kernel.StdHandler.CODE_MAP;
        //从桌面点击进入的App强制widget为 entry
        if(Ext.isArray(runConfig)){
            runConfig = {};
        }
        Ext.apply(runConfig,{
            widgetName : 'Entry'
        });
        STD_HANDLER.request(CM.RUN_APP, [module, app, runConfig]);
    },

    /**
     * 桌面图标左键点击事件处理函数
     *
     * @param {WebOs.OsWidget.VirtualDesktop} desktopView
     * @param {Ext.data.Model} record
     * @param {HTMLElement}
     * @param {int} index
     * @param {Ext.EventObject} e
     */
    iconLeftClickHandler : function(desktopView, record, item, index, e)
    {
        if(!this.$_move_click_$){
            var module = record.get('module');
            var name = record.get('name');
            var runConfig = record.get('runConfig');
            this.runApp(module, name, runConfig);
        }else{
            //只能用一次
            this.$_move_click_$ = false;
        }

    },
    notificationClickCloseHandler : function(event)
    {
        if(this.notificationPanelShowed){
            var xy = event.getXY();
            var region = this.notificationRef.getRegion();
            if(region.isOutOfBoundX(xy[0]) || region.isOutOfBoundY(xy[1])){
                this.toggleNotificationPanel()
            }
        }
    },

    desktopBoxReadyHandler : function()
    {
        this.appSwitchBarRef = new WebOs.OsWidget.AppSwitchBar({
            renderTo : Ext.getBody(),
            desktopRef : this,
            listeners : {
                afterrender : function(cmp)
                {
                    cmp.setZIndex(3);
                },
                scope : this
            }
        });

        this.desktopViewRef = new Ext.container.Container({
            floating : true,
            renderTo : Ext.getBody(),
            y : WebOs.OsWidget.TopStatusBar.HEIGHT,
            x : 0,
            layout : {
                type : 'card'
            },
            width : this.desktopViewGhostRef.getWidth(),
            height : this.desktopViewGhostRef.getHeight(),
            items : this.generateVirtualItems(),
            listeners : {
                afterrender : function(cmp){
                    this.desktopViewRef = cmp;
                    var C = WebOs.Const;
                    var sysUser = WebOs.getSysEnv().get(C.ENV_CUR_USER);
                    WebOs.R_SYS_UI_RENDER.setOsWidget(WebOs.Const.WEBOS_V_DESKTOP, cmp);
                    var wallpaper = sysUser.wallPaper;
                    var wallpaper = wallpaper.split('|');
                    this.changeWallPaper(parseInt(wallpaper[0]), wallpaper[1]);
                    cmp.setZIndex(2);
                    this.desktopViewGhostRef.addListener({
                        resize : function(ghostCmp, width, height)
                        {
                            cmp.setWidth(width);
                            cmp.setHeight(height);
                        },
                        scope : this
                    });
                    //this.moduleSelector = new WebOs.Os.ModuleSelector({
                    //   renderTo : Ext.getBody(),
                    //   desktopRef : this,
                    //   listeners : {
                    //      afterrender : function(cmp)
                    //      {
                    //         WebOs.R_SYS_UI_RENDER.setOsWidget(WebOs.Const.WEBOS_MODULE_SELECTOR, cmp);
                    //         cmp.setZIndex(3);
                    //      },
                    //      scope : this
                    //   }
                    //});
                },
                scope : this
            }
        });
        //避免出现闪屏
        Ext.Function.defer(function(){
            this.notificationRef = new WebOs.OsWidget.NotificationCenter({
                renderTo : Ext.getBody(),
                desktopRef : this,
                style : 'background:#FED14B',
                desktopViewGhostRef : this.desktopViewGhostRef,
                listeners : {
                    afterrender : function(cmp)
                    {
                        WebOs.R_SYS_UI_RENDER.setOsWidget(WebOs.Const.WEBOS_SYS_NOTICE, cmp);
                        cmp.setZIndex(1);
                    },
                    scope : this
                }
            });
        }, 200, this);
    },

    /**
     * @return {Ext.menu.Menu}
     */
    getDesktopMenu : function()
    {
        if(null == this.desktopMenuRef){
            this.desktopMenuRef = new Ext.menu.Menu({
                width : 250,
                listeners : {
                    afterrender : function(menu){
                        WebOs.ME.desktopMenuRequestHandler(menu);
                    },
                    scope : this
                }
            });
        }
        return this.desktopMenuRef;
    },

    destroy : function()
    {
        if(this.desktopMenuRef){
            this.desktopMenuRef.destroy();
            delete this.desktopMenuRef;
        }
        delete this.LANG_TEXT;
        delete this.appRef;
        delete this.desktopViewRef;
        delete this.desktopViewGhostRef;
        delete this.appSwitchBarRef;
        delete this.notificationRef;
        delete this.appMetas;
        delete this.$_mkeys_$;
        delete this.$_module_index_map_$;
        this.callParent();
    }
});