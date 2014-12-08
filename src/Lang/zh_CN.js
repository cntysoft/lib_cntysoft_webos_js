/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        DESKTOP: {
            TOP_STATUS_BAR: {
                WEEK_NAMES: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            },
            MODULE_SELECTOR : {
                TITLE : '模块选择'
            },
            SYS_MENU : {
                ACCOUNT : '账号信息',
                MODIFY_PWD : '修改密码',
                SETTING : '系统设置',
                ABOUT_GZY : '关于工作易',
                HELP_CENTER : '帮助中心',
                APP_STORE : '应用商店',
                LOGOUT : '退出系统'
            },
            TREE_NAV_WIDGET : {
                PATH_G_INFO : '功能导航 : ',
                BTN : {
                    GO_BACK : '返回上一级'
                },
                MENU : {
                    OPEN : '打开{0}窗口',
                    ENTER : '进入子分类'
                }
            },
            NOTIFICATION_CENTER : {
                EMPTY_TEXT : '暂时没有新的通知信息',
                COLS : {
                    ID : 'ID',
                    TITLE : '信息标题',
                    STATUS : '状态'
                },
                READED : '已读',
                UNREADED : '未读',
                MENU : {
                    READ : '查看通知详情',
                    IGNORE : '忽略该条通知',
                    IGNORE_ALL : '忽略所有的通知',
                    CLEAR_READED : '清除已读'
                },
                READER : {
                    WIN_TITLE : '系统通知',
                    FIELD : {
                        MSG_TITLE : '标题',
                        MSG_CONTENT : '通知正文'
                    },
                    VIEW_DETAIL : '查看通知详情'
                }
            }
        }
    }
});