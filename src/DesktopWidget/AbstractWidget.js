/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.DesktopWidget.AbstractWidget', {
    extend: 'WebOs.Component.Window',
    mixins : {
        langTextProvider : 'Cntysoft.Mixin.LangTextProvider'
    },
    /**
     * 特定的widget的名称， 这个有程序分析类名获取
     *
     * @property {String} widgetName
     */
    widgetName : '',
    /**
     * @property {Ext.util.HashMap} openedWidgetes
     */
    openedWidgets : null,

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
        Cntysoft.callSys('DkWidget', 'dispatcherRequest', {
            key : this.widgetName,
            method : method,
            args : params
        }, callback, scope);
    },

    /**
     * 获取widget的API代理配置对象
     *
     * @return {Object}
     */
    getDkWidgetApiProxy : function(method)
    {
        var me = this;
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
                    key : me.widgetName,
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
     * 应用一些强制的参数设置
     *
     * @param {Object} config
     */
    applyConstraintConfig : function(config)
    {
        this.callParent([config]);
        Ext.apply(config,{
            layout : 'fit',
            closeAction : 'hide',
            constrain : true,
            constrainTo : Ext.getBody(),
            bodyPadding : 1
        });
    },

    /**
     * 当widget已经打开之后， 调用用的callback
     *
     * @param {Object} config
     */
    openedHandler : Ext.emptyFn,
    /**
     * 响应系统通知机制的接口
     *
     * @template
     * @param {Object} config 这个参数是发送msg的调用者指定的元对象
     */
    msgNotifyHandler :  Ext.emptyFn,

    destroy : function()
    {
        this.openedWidgets.remove(this);
        delete this.openedWidgets;
        delete this.LANG_TEXT;
        this.callParent();
    }
});