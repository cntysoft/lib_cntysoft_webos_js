/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.SysMenu',{
    extend : 'Ext.menu.Menu',

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
            hidden : true,
            style : 'background:#ffffff'
        });
    },

    initComponent : function()
    {
        this.addListener({
            afterrender : function(menuWrapper)
            {
                WebOs.ME.sysmenuRequestHandler(menuWrapper);
            },
            scope : this
        });
        this.callParent();
    },


    destroy : function()
    {
        delete this.LANG_TEXT;
        delete this.desktopRef;
        delete this.startBtnRef;
        this.callParent();
    }
});