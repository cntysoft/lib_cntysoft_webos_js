/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("WebOs.Kernel.ProcessModel.AbstractServiceTask", {
   mixins : {
      observable : "Ext.util.Observable",
   },
   /**
    * @var {Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvoker : null,
   /**
    * @var {WebOs.Kernel.ProcessModel.Runable} runnable
    */
   runnable : null,
   /**
    * @var {String} name
    */
   name : "",
   constrcutor : function(config)
   {
      Ext.apply(this, config);
      this.mixins.observable.constructor.call(this, config);
      if(!Ext.isDefined(this.serviceInvoker) || !Ext.isDefined(this.runnable)){
         cntysoft.raiseError(Ext.getClassName(this), "constructor", "need serviceInvoker and runnable property");
      }
   },
   
   exec : function(params)
   {
      
   }
});
