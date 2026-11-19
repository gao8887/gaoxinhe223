const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * 接口功能：返回 db.json 中 poems 数组的全部数据
 * 请求方式：GET /api/poems
 * @returns {Object} { code: 200, data: [...poems] }
 */
app.get('/api/poems', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json');
  fs.readFile(dbPath, 'utf-8', (err, raw) => {
    if (err) {
      return res.status(500).json({ code: 500, msg: '读取 db.json 失败', error: err.message });
    }
    try {
      const json = JSON.parse(raw);
      res.json({ code: 200, data: json.poems || [] });
    } catch (e) {
      res.status(500).json({ code: 500, msg: 'db.json 解析失败', error: e.message });
    }
  });
});

/**
 * 接口功能：返回单条 poem 数据
 * 请求方式：GET /api/poem/:index
 * @param {number} index -  poems 数组索引（从 0 开始）
 * @returns {Object} { code: 200, data: poem对象 }
 */
app.get('/api/poem/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const dbPath = path.join(__dirname, 'db.json');
  fs.readFile(dbPath, 'utf-8', (err, raw) => {
    if (err) return res.status(500).json({ code: 500, msg: '读取 db.json 失败' });
    const json = JSON.parse(raw);
    const poem = json.poems[idx];
    if (!poem) return res.status(404).json({ code: 404, msg: '索引越界' });
    res.json({ code: 200, data: poem });
  });
});

app.listen(PORT, () => {
  console.log(`📡 数据服务器已启动: http://localhost:${PORT}`);
  console.log(`   接口列表:`);
  console.log(`     GET /api/poems     — 获取全部诗词`);
  console.log(`     GET /api/poem/:idx — 获取单条诗词`);
});
