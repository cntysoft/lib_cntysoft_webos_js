/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 桌面图标拖放状态类定义
 */
Ext.define('WebOs.OsWidget.VDDragStatus',{
   extend : 'Ext.dd.StatusProxy',
   childEls: [
      'ghost'
   ],
   renderTpl: [
      '<div id="{id}-ghost" data-ref="ghost" style= "width : 120px; height : 120px;" role="presentation"></div>'
   ]
});