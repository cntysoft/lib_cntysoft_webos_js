/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.SysMenu',{
    extend : 'Ext.container.Container',

    //private
    desktopRef : null,
    //private
    startBtnRef : null,

    constructor : function(config)
    {
        config = config || {};
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
        this.addListener({
            afterrender : function(menuWrapper)
            {
                WebOs.ME.sysmenuRequestHandler(menuWrapper);
            },
            scope : this
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

    destroy : function()
    {
        delete this.LANG_TEXT;
        delete this.desktopRef;
        delete this.startBtnRef;
        this.callParent();
    }
});