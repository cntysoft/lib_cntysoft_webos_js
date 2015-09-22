/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WEBOS内核常量定义
 */
Ext.define('WebOs.Kernel.Const', {
   extend : 'Cntysoft.Kernel.Const',
   inheritableStatics: {
      /**
       * 核心环境变量名称，守护进程数据键名称，这个在系统引导过程会用到
       *
       * @readonly
       * @property {String} ENV_DAEMON
       */
      ENV_DAEMON : 'ENV_DAEMON',
      /**
       * 核心环境变量名称，应用程序数据键名称，这个在系统引导过程会用到
       *
       * @readonly
       * @property {String} ENV_APP
       */
      ENV_APP : 'ENV_APP',
      /**
       * @readonly
       * @property {String} WEBOS_V_DESKTOP
       */
      WEBOS_V_DESKTOP : 'WEBOS_V_DESKTOP',
      /**
       * WEBO环境组件引用名称，桌面容器对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_DESKTOP
       */
      WEBOS_DESKTOP : 'WEBOS_DESKTOP',
      /**
       * WEBO环境组件引用名称，系统菜单UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_MENU
       */
      WEBOS_SYS_MENU : 'WEBOS_SYS_MENU',
      /**
       * WEBO环境组件引用名称，开始按钮UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_START_BTN
       */
      WEBOS_START_BTN : 'WEBOS_START_BTN',
      /**
       * WEBO环境组件引用名称，应用程序选择器UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_APP_SWITCH_BAR
       */
      WEBOS_APP_SWITCH_BAR : 'WEBOS_APP_SWITCH_BAR',
      /**
       * WEBO环境组件引用名称，桌面背景UI对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_BG
       */
      WEBOS_SYS_BG : 'WEBOS_SYS_BG',
      /**
       * WEBO环境组件引用名称，系统通知组件对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_SYS_NOTICE
       */
      WEBOS_SYS_NOTICE : 'WEBOS_SYS_NOTICE',
      /**
       * WEBO环境组件引用名称，桌面上下文菜单对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_DESKTOP_MENU
       */
      WEBOS_DESKTOP_MENU : 'WEBOS_DESKTOP_MENU',
      /**
       * 操作系统桌面模块选择器
       *
       * @readonly
       * @property {String} WEBOS_MODULE_SELECTOR
       */
      WEBOS_MODULE_SELECTOR : 'WEBOS_MODULE_SELECTOR',
      /**
       * WEBO环境组件引用名称，窗口管理器对象引用名称
       *
       * @readonly
       * @property {String} WEBOS_WIN_MGR
       */
      WEBOS_WIN_MGR : 'WEBOS_WIN_MGR',
      /**
       * 核心的APP引用，系统初始化APP引用名称
       *
       * @readonly
       * @property {String} R_INIT
       */
      R_INIT : 'RUNABLE_INIT',
      /**
       * 核心的APP引用，桌面环境渲染APP引用名称
       *
       * @readonly
       * @property {String} R_SYS_UI_RENDER
       */
      R_SYS_UI_RENDER : 'R_SYS_UI_RENDER',
      /**
       * 核心的APP引用，任务管理器对象引用名称
       *
       * @readonly
       * @property {String} R_TASK_MANAGER
       */
      R_TASK_MANAGER : 'R_TASK_MANAGER',
      /**
       * 核心环境变量名称，当前登录系统的用户的相关数据
       *
       * @readonly
       * @property {String} ENV_CUR_USER
       */
      ENV_CUR_USER : 'ENV_CUR_USER',
      /**
       * 核心环境变量名称，当前登录系统的用户权限的相关数据
       *
       * @readonly
       * @property {String} ENV_ACL
       */
      ENV_ACL : 'ENV_ACL_KEY',
      /**
       * APP运行的次数相关数据
       *
       * @readonly
       * @property {String} ENV_APP_RUN_RECORD
       */
      ENV_APP_RUN_RECORD : 'ENV_APP_RUN_RECORD',
      /**
       * 系统支持的App模块类型
       *
       * @readonly
       * @property {String} ENV_SUPPORTED_MODULES
       */
      ENV_SUPPORTED_MODULES : 'ENV_SUPPORTED_MODULES',
      /**
       * php相关的设置
       *
       * @readonly
       * @property {String} ENV_PHP_SETTING
       */
      ENV_PHP_SETTING : 'ENV_PHP_SETTING',

      /**
       * 系统设置相关的配置信息学
       *
       * @readonly
       * @property {String} ENV_SYS_SETTING
       */
      ENV_SYS_SETTING : 'ENV_SYS_SETTING',

      /**
       * 两种可运行实体的类型名称，应用程序
       *
       * @readonly
       * @property {String} RUN_TYPE_APP
       */
      RUN_TYPE_APP : 'App',
      /**
       * 两种可运行实体的类型名称， 守护进程
       *
       * @readonly
       * @property {String} RUN_TYPE_DAEMON
       */
      RUN_TYPE_DAEMON : 'Daemon',
      /**
       * 第三方扩展的文件夹名称，比如 CkEditor源文件就存放这里
       *
       * @readonly
       * @property {String} VENDER_DIR
       */
      VENDER_DIR : 'Vender',
      /**
       * 系统应用程序定义文件存放目录
       *
       * @readonly
       * @property {String} APP_DIR
       */
      APP_DIR : 'App',
      /**
       * 系统守护进程定义文件存放目录
       *
       * @readonly
       * @property {String} DAEMON_DIR
       */
      DAEMON_DIR : 'Daemon',
      /**
       * 简单的纯文字的通知信息
       *
       * @readonly
       * @property {String} SYS_NOTIFICATION_MSG_TXT
       */
      SYS_NOTIFICATION_MSG_TXT : 1,
      /**
       * 回调函数方式的通知信息
       *
       * @readonly
       * @property {String} SYS_NOTIFICATION_MSG_CALLBACK
       */
      SYS_NOTIFICATION_MSG_CALLBACK : 2,
      /**
       * 系统运行级别， 核心级别
       *
       * @readonly
       * @property {String} RUN_LEVEL_KERNEL
       */
      RUN_LEVEL_KERNEL : 'kernel',
      /**
       * 系统运行级别， 用户空间级别
       *
       * @readonly
       * @property {String} RUN_LEVEL_USER
       */
      RUN_LEVEL_USER : 'user',
      /**
       * @readonly
       * @property {String} S_RUNNING
       */
      S_RUNNING : 1,
      /**
       * @readonly
       * @property {String} S_SLEEP
       */
      S_SLEEP : 2,
      /**
       * @readonly
       * @property {String} S_KILLED
       */
      S_KILLED : 3,
      /**
       * @readonly
       * @property {String} WALLPAPER_COLOR
       */
      WALLPAPER_COLOR : 1,
      /**
       * @readonly
       * @property {String} WALLPAPER_IMAGE
       */
      WALLPAPER_IMAGE : 2,

      //Api调用接口
      API_GATE_SYS : 'ApiGate/Sys',
      API_GATE_APP : 'ApiGate/App',
      //系统中使用的两种模式
      NEW_MODE : 1,
      MODIFY_MODE : 2
   }
}, function(){
   alias = Ext.Function.alias;
   Ext.apply(WebOs,{
      Const : this,
      C : this
   })
});