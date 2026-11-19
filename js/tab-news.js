/*
=============================================================================
  页面名称：新闻 Tab 选项卡演示页（tab-news.html）
  功能简介：调用 gxh_initTabs 初始化选项卡，默认激活"国内新闻"
  作者：高薪和 (gxh)
  建立时间：2026-11-02
  使用模型：Trae AI
  依赖：js/gxh-tabs.js（window.gxh_initTabs）
=============================================================================
*/

/**
 * 页面加载完成后初始化选项卡组件
 * 详细说明：使用 DOMContentLoaded 确保 DOM 就绪后，
 *          调用 gxh_initTabs 挂载 #gxh_news_tabs 容器，
 *          defaultIndex: 0 表示默认选中第一个（国内新闻）
 * @example 在控制台输入 gxh_news_tabs_ctrl.select(2) 可切到"国际新闻"
 */
document.addEventListener("DOMContentLoaded", function () {
  var gxh_tabsCtrl = gxh_initTabs("#gxh_news_tabs", {
    defaultIndex: 0
  });

  window.gxh_news_tabs_ctrl = gxh_tabsCtrl;
});
