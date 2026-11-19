/*
=============================================================================
  组件名称：gxh-tabs —— 可复用 Tab 选项卡
  功能简介：对任意符合约定 HTML 结构的选项卡容器进行初始化，
           支持事件委托、清除所有选中态、设置当前选中态
  作者：高薪和
  建立时间：2026-11-02
  使用模型：Trae AI
  依赖：无（纯原生 JS，零依赖）
=============================================================================
*/

(function () {
  "use strict";

  /**
   * 初始化一个 Tab 选项卡组件（可复用入口函数）
   * 约定 HTML 结构：
   *   <div id="myTabs">
   *     <div class="gxh_tab_header">
   *       <button class="gxh_tab gxh_tab_active" data-index="0">标签1</button>
   *       <button class="gxh_tab" data-index="1">标签2</button>
   *     </div>
   *     <div class="gxh_tab_body">
   *       <div class="gxh_tab_panel gxh_panel_active">面板1内容</div>
   *       <div class="gxh_tab_panel">面板2内容</div>
   *     </div>
   *   </div>
   *
   * @param {string|HTMLElement} target - 选项卡容器的选择器或 DOM 元素
   * @param {Object} [options] - 可选配置
   * @param {string} [options.tabSelector=".gxh_tab"] - 标签按钮选择器
   * @param {string} [options.panelSelector=".gxh_tab_panel"] - 面板选择器
   * @param {string} [options.activeClass="gxh_tab_active"] - 标签激活类名
   * @param {string} [options.panelActiveClass="gxh_panel_active"] - 面板激活类名
   * @param {number} [options.defaultIndex=-1] - 默认激活索引，-1 表示不自动切换
   * @returns {Object} 控制对象，含 select(index) / destroy() 方法
   */
  function gxh_initTabs(target, options) {
    var container = typeof target === "string"
      ? document.querySelector(target)
      : target;

    if (!container) {
      console.warn("[gxh-tabs] 未找到目标容器:", target);
      return null;
    }

    options = options || {};
    var tabSelector = options.tabSelector || ".gxh_tab";
    var panelSelector = options.panelSelector || ".gxh_tab_panel";
    var activeClass = options.activeClass || "gxh_tab_active";
    var panelActiveClass = options.panelActiveClass || "gxh_panel_active";
    var defaultIndex = options.defaultIndex;

    var tabHeaders = container.querySelector(".gxh_tab_header");
    var tabBody = container.querySelector(".gxh_tab_body");

    if (!tabHeaders || !tabBody) {
      console.warn("[gxh-tabs] 容器缺少 .gxh_tab_header 或 .gxh_tab_body");
      return null;
    }

    /**
     * 清除所有选中状态：遍历所有 tab 和 panel，移除激活类名
     * 核心逻辑：先清除 → 再设置当前，确保同一时刻只有一个激活
     */
    function clearAllActive() {
      var allTabs = tabHeaders.querySelectorAll(tabSelector);
      var allPanels = tabBody.querySelectorAll(panelSelector);
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove(activeClass);
      }
      for (var j = 0; j < allPanels.length; j++) {
        allPanels[j].classList.remove(panelActiveClass);
      }
    }

    /**
     * 设置指定索引的 tab 和 panel 为选中状态
     * @param {number} index - 要激活的索引（从 0 开始）
     */
    function setActive(index) {
      var tabs = tabHeaders.querySelectorAll(tabSelector);
      var panels = tabBody.querySelectorAll(panelSelector);
      if (index < 0 || index >= tabs.length) return;
      clearAllActive();
      tabs[index].classList.add(activeClass);
      if (panels[index]) panels[index].classList.add(panelActiveClass);
    }

    /**
     * 点击事件处理（事件委托：监听 header 上的 click，closest 找最近的 tab）
     * @param {Event} e - 点击事件对象
     */
    function onTabClick(e) {
      var tab = e.target.closest(tabSelector);
      if (!tab) return;
      var tabs = tabHeaders.querySelectorAll(tabSelector);
      var index = Array.prototype.indexOf.call(tabs, tab);
      if (index !== -1) {
        setActive(index);
      }
    }

    tabHeaders.addEventListener("click", onTabClick);

    if (typeof defaultIndex === "number" && defaultIndex >= 0) {
      setActive(defaultIndex);
    }

    /**
     * 销毁选项卡（移除事件监听）
     */
    function destroy() {
      tabHeaders.removeEventListener("click", onTabClick);
    }

    return {
      select: setActive,
      destroy: destroy
    };
  }

  window.gxh_initTabs = gxh_initTabs;
})();
