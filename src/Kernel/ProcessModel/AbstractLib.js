/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * Runable对象抽象库对象类定义,暂时还没加上什么东西但是以后肯定会加上的
 */
Ext.define('WebOs.Kernel.ProcessModel.AbstractLib', {
   /**
    * @property {WebOs.Kernel.ProcessModel.Runable} runable
    */
   runable : null,
   /**
    * 构造函数
    *
    * @param {WebOs.Kernel.ProcessModel.Runable} runable
    */
   constructor : function(runable)
   {
      this.runable = runable;
   },
   /**
    * 获取可运行实体
    *
    * @return {WebOs.Kernel.ProcessModel.Runable}
    */
   getRunable : function()
   {
      return this.runable;
   }
});