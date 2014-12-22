/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 系统标准的处理函数，可以在系统的很多地方都会调用，集中在一个地方处理比较方便
 */
Ext.define('WebOs.Kernel.StdHandler',{
    /**
     * 系统运行App接口
     *
     * @param {String} module
     * @param {string} name
     * @param {String} runConfig
     */
    runApp : function(module, name, runConfig)
    {
        WebOs.PM().runApp({
            module : module,
            name : name,
            runConfig : runConfig
        });
    },

    /**
     * 退出系统
     */
    logout : function()
    {
        WebOs.ME.logout();
    },

    showDesktop : function()
    {
        if(!this.$_show_desktop_$){
            WebOs.PM().sleepAllProcess();
            this.$_show_desktop_$ = true;
        }else{
            WebOs.PM().wakeupAllProcess();
            this.$_show_desktop_$ = false;
        }
    },

    gotoFront : function()
    {
        window.open('/');
    }
});