/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.OsWidget.NotificationMsgReader',{
    extend : 'WebOs.Component.Window',
    /**
     * 阅读器的状态
     *
     * @property {Integer} mode
     */
    mode : null,

    /**
     * 对象的语言对象
     *
     * @property {Object} LANG_TEXT
     */
    LANG_TEXT : null,

    /**
     * 相关的通知数据对象
     *
     * @property {Object} record
     */
    record : null,

    constructor : function(config)
    {
        config = config || {};
        this.LANG_TEXT = WebOs.GET_LANG_TEXT('DESKTOP.NOTIFICATION_CENTER.READER');
        this.applyConstraintConfig(config);
        if(!Ext.isDefined(config.record)){
            Cntysoft.raiseError(
                Ext.getClassName(this),
                'constructor',
                'must specify notification record'
            );
        }
        this.mode = config.record.get('type');
        this.callParent([config]);
    },

    applyConstraintConfig : function(config)
    {
        Ext.apply(config,{
            layout : 'fit',
            title : this.LANG_TEXT.WIN_TITLE + ' [ ' + config.record.get('title') + ' ] ',
            resizable : false,
            width : 600,
            height : 350,
            constrain : true,
            constrainTo : Ext.getBody(),
            autoShow : true,
            closeAction : 'destroy'
        });
    },

    initComponent : function()
    {
        Ext.apply(this,{
            buttons : [{
                text : Cntysoft.GET_LANG_TEXT('UI.BTN.OK'),
                listeners : {
                    click : function()
                    {
                        this.close();
                    },
                    scope : this
                }
            }]
        });
        this.addListener({
            afterrender : function()
            {
                this.renderMsg();
            },
            scope : this
        });
        this.callParent();
    },

    renderMsg : function()
    {
        var type = this.record.get('msgType');
        var items = [{
            xtype : 'displayfield',
            fieldLabel : this.LANG_TEXT.FIELD.MSG_TITLE,
            value : this.record.get('title')
        }, {
            xtype : 'textarea',
            readOnly : true,
            fieldLabel : this.LANG_TEXT.FIELD.MSG_CONTENT,
            value : this.record.get('msg'),
            border : false,
            height : type == WebOs.Kernel.Const.SYS_NOTIFICATION_MSG_CALLBACK ? 150 : 170,
            width : 570
        }];
        if(type == WebOs.Kernel.Const.SYS_NOTIFICATION_MSG_CALLBACK){
            items.push({
                xtype : 'fieldcontainer',
                layout : {
                    type : 'hbox',
                    pack : 'end'
                },
                items : {
                    xtype : 'button',
                    text : this.LANG_TEXT.VIEW_DETAIL,
                    listeners : {
                        click : this.viewDetailHandler,
                        scope : this
                    }
                }
            });
        }
        this.add({
            xtype : 'form',
            bodyPadding : 10,
            items : items
        });
    },

    /**
     * 查看详细处理函数， 主要思想就是将请求发送到APP的msgNotifyHandler处理器上
     */
    viewDetailHandler : function()
    {
        var meta = this.record.get('meta');
        WebOs.PM().runApp({
            module : meta.module,
            name : meta.name,
            runConfig : {
                apiName : 'msgNotifyHandler',
                apiParams : [meta]
            }
        });
        this.close();
    },

    destroy : function()
    {
        delete this.record;
        delete this.LANG_TEXT;
        this.callParent();
    }
});