/*
=============================================================================
  页面名称：新车上市信息表（car-news.html）
  功能简介：定义汽车数据数组 + 渲染表格 + 初始化 Tab 组件
  作者：高薪和 (gxh)
  建立时间：2026-11-02
  使用模型：Trae AI
  依赖：js/gxh-tabs.js（window.gxh_initTabs）
=============================================================================
*/

/**
 * 最新上市汽车数据数组
 * @type {Array<{date:string, brand:string, model:string, priceMin:number, priceMax:number}>}
 */
var gxh_carsNew = [
  { date: "12月13日", brand: "沃尔沃",   model: "S60L",           priceMin: 26.99, priceMax: 38.49 },
  { date: "12月12日", brand: "Jeep",     model: "牧马人龙腾典藏",  priceMin: 47.99, priceMax: 59.99 },
  { date: "12月10日", brand: "一汽大众", model: "高尔夫 7",        priceMin: 11.89, priceMax: 18.29 },
  { date: "12月08日", brand: "劳斯莱斯", model: "2014 款古思特",   priceMin: 419.0, priceMax: 666.0 },
  { date: "12月05日", brand: "起亚",     model: "新款 K5",         priceMin: 15.98, priceMax: 28.18 },
  { date: "12月05日", brand: "本田",     model: "2014 款奥德赛",   priceMin: 22.98, priceMax: 28.68 }
];

/**
 * 即将上市汽车数据数组（模拟数据）
 * @type {Array<{date:string, brand:string, model:string, priceMin:number, priceMax:number}>}
 */
var gxh_carsSoon = [
  { date: "12月20日", brand: "丰田",     model: "全新一代凯美瑞",   priceMin: 17.98, priceMax: 25.98 },
  { date: "12月25日", brand: "比亚迪",   model: "海狮 DM-i",       priceMin: 25.0,  priceMax: 35.0 },
  { date: "01月05日", brand: "特斯拉",   model: "Model Y 改款",    priceMin: 26.39, priceMax: 34.99 },
  { date: "01月10日", brand: "奔驰",     model: "全新 E 级",       priceMin: 45.0,  priceMax: 65.0 },
  { date: "01月15日", brand: "小米",     model: "SU7 Ultra",       priceMin: 52.99, priceMax: 59.99 }
];

/**
 * 将汽车数组渲染到指定 table 的 tbody
 * 详细说明：遍历 cars 数组，为每条数据创建 tr，
 *          内含日期、品牌车型、售价三列
 * @param {string} tableId - 目标表格的 id（不含 #）
 * @param {Array}  cars    - 汽车数据数组
 * @example gxh_renderCarTable("gxh_table_new", gxh_carsNew);
 */
function gxh_renderCarTable(tableId, cars) {
  var tbody = document.querySelector("#" + tableId + " tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (cars.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="gxh_empty">暂无数据</td></tr>';
    return;
  }

  cars.forEach(function (car) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="gxh_date">' + car.date + '</td>'
      + '<td class="gxh_model">' + car.brand + ' ' + car.model + '</td>'
      + '<td class="gxh_price">'
        + car.priceMin.toFixed(2)
        + '<span class="gxh_price_range"> - ' + car.priceMax.toFixed(2) + '</span>'
      + '</td>';
    tbody.appendChild(tr);
  });
}

/**
 * 页面初始化入口
 * 功能：渲染两个表格 + 挂载 Tab 组件
 */
document.addEventListener("DOMContentLoaded", function () {
  gxh_renderCarTable("gxh_table_new", gxh_carsNew);
  gxh_renderCarTable("gxh_table_soon", gxh_carsSoon);

  gxh_initTabs("#gxh_car_tabs", { defaultIndex: 0 });
});
