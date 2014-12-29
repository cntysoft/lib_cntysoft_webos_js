/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('WebOs.DesktopWidget.WallPaper.Lang.zh_CN', {
    extend : 'Cntysoft.Kernel.AbstractLangHelper',
    data : {
        MAIN : {
            TITLE : '桌面背景设置面板',
            COMBO_TITLE : {
                COLOR : '纯色',
                LOCAL_IMAGE : '本地图片',
                NET_IMAGE : '网络图片'
            },
            BTN : {
                SAVE : '保存修改',
                CANCEL : '取消修改',
                CLOSE : '关闭窗口',
                UPLOAD : '上传图片',
                SEARCH : '搜索'
            },
            COMBO_LABEL : {
                THEME : '桌面主题设置'
            },
            NET_IMAGE : {
                LABEL : '图片地址',
                DISPLAY : '请在上方图片地址栏中输入您需要的图片地址，保存即改变设置，取消则丢弃！（推荐把图片下载到本地，以防止图片链接失效）',
                BOX_LABEL : '下载图片到本地'
            },
            MENU : {
                DELETE : '删除图片'
            },
            MSG : {
                BEFORE_CLOSE : '有未保存的设置，你确定要关闭？',
                SAVE_ERROR : '设置没有改变，不需要保存 。',
                SAVE : '你确定要保存当前设置？',
                SAVE_SUCCESS : '配置信息保存成功！',
                CAN_NOT_DELETE : '本图片已作为背景，无法删除！',
                BEFORE_DELETE : '有修改未保存，你确定要删除当前图片？删除后将不可恢复！',
                DELETE : '你确定要删除这张图片？删除后将不可恢复！',
                DELETE_SUCCESS : '图片删除成功！'
            },
            TOOLTIP : {
                COMBO : '选择下拉列表中您希望的背景类型，目前支持纯色，本地图片以及网络图片三种格式',
                UPLOADER_BTN : '单击此按钮从您的电脑上传您喜欢的图片',
                LOCAL_IMAGE : '在图片上右键鼠标，可以删除当前的图片！',
                NET_IMAGE : '请在此填入正确的图片地方，否则将不能正确的设置您想要的壁纸背景，默认格式 http://www.ddd.com/dddd.jpg'
            }
        }
    }
});
