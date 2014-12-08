/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.SysMenu',{
    extend : 'Ext.container.Container',
    statics : {
        AM : {
            ACCOUNT : 1,
            MODIFY_PWD : 2,
            SETTING : 3,
            ABOUT_GZY : 4,
            HELP_CENTER : 5,
            LOGOUT : 6
        }
    },
    //private
    desktopRef : null,
    //private
    startBtnRef : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.SYS_MENU');
        this.applyConstraintConfig(config);
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            width : 200,
            height : 250,
            floating : true,
            hidden : true,
            style : 'background:#ffffff',
            layout : 'fit'
        });
    },

    initComponent : function()
    {
        Ext.getBody().addListener({
            click : this.sysMenuCloseHandler,
            scope : this
        });
        Ext.apply(this, {
            items : this.getMenuConfig()
        });
        this.callParent();
    },

    sysMenuCloseHandler : function(event)
    {
        if(!this.isHidden()){
            var xy = event.getXY();
            var region = this.getRegion();
            var btnRegion = this.startBtnRef.getRegion();
            if((region.isOutOfBoundX(xy[0]) || region.isOutOfBoundY(xy[1]))
                && (btnRegion.isOutOfBoundX(xy[0]) || btnRegion.isOutOfBoundY(xy[1]))){
                this.hide();
            }
        }
    },

    getMenuConfig : function()
    {
        var M = this.self.AM;
        return {
            xtype : 'menu',
            floating : false,
            items : [{
                text : this.LANG_TEXT.ACCOUNT,
                iconCls : 'webos-start-btn-account-icon',
                code : M.ACCOUNT
            },{
                text : this.LANG_TEXT.MODIFY_PWD,
                iconCls : 'webos-start-btn-modify-pwd-icon',
                code : M.MODIFY_PWD
            },{
                text : this.LANG_TEXT.SETTING,
                iconCls : 'webos-start-btn-setting-icon',
                code : M.SETTING
            },{
                xtype  :'menuseparator'
            },{
                text : this.LANG_TEXT.ABOUT_GZY,
                iconCls : 'webos-start-btn-about-gzy-icon',
                code : M.ABOUT_GZY
            },{
                text : this.LANG_TEXT.HELP_CENTER,
                iconCls : 'webos-start-btn-help-icon',
                code : M.HELP_CENTER
            },
                //   {
                //   text : this.LANG_TEXT.APP_STORE,
                //   iconCls : 'webos-start-btn-appstore-icon'
                //},
                {
                    xtype  :'menuseparator'
                },{
                    text : this.LANG_TEXT.LOGOUT,
                    iconCls : 'webos-start-btn-logout-icon',
                    code : M.LOGOUT
                }],
            listeners : {
                click : this.menuItemClickHandler,
                scope : this
            }
        };
    },

    menuItemClickHandler : function(menu, item)
    {
        if(item){
            var code = item.code;
            var M = this.self.AM;
            switch(code){
                case M.ACCOUNT:
                    break;
                case M.ABOUT_GZY:
                    break;
                case M.MODIFY_PWD:
                    break;
                case M.SETTING:
                    break;
                case M.HELP_CENTER:
                    break;
                case M.LOGOUT:
                    WebOs.ME.logout();
                    break;
            }
        }
        this.hide();
    },

    destroy : function()
    {
        delete this.LANG_TEXT;
        delete this.desktopRef;
        delete this.startBtnRef;
        this.callParent();
    }
});