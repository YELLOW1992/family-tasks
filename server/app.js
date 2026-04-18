const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, '../database/family_tasks.db');
const db = new sqlite3.Database(dbPath);

// 中间件配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: 'family-tasks-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 权限中间件
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: '请先登录' });
  }
  next();
}

function requireParent(req, res, next) {
  if (!req.session.userId || req.session.role !== 'parent') {
    return res.status(403).json({ error: '需要家长权限' });
  }
  next();
}

// ========== 认证相关API ==========

// 登录
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  
  if (role === 'parent') {
    // 家长登录需要密码
    db.get('SELECT * FROM users WHERE username = ? AND role = ?', [username, 'parent'], (err, user) => {
      if (err) return res.status(500).json({ error: '数据库错误' });
      if (!user) return res.status(401).json({ error: '用户名或密码错误' });
      
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.userId = user.id;
          req.session.username = user.username;
          req.session.role = user.role;
          res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
        } else {
          res.status(401).json({ error: '用户名或密码错误' });
        }
      });
    });
  } else {
    // 孩子登录不需要密码
    db.get('SELECT * FROM users WHERE username = ? AND role = ?', [username, 'child'], (err, user) => {
      if (err) return res.status(500).json({ error: '数据库错误' });
      if (!user) return res.status(401).json({ error: '找不到该孩子' });
      
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, points: user.points } });
    });
  }
});

// 登出
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// 获取当前用户信息
app.get('/api/me', requireAuth, (req, res) => {
  db.get('SELECT id, username, role, nickname, avatar, points FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(user);
  });
});

// 获取所有孩子列表（用于登录选择和家长管理）
app.get('/api/children', (req, res) => {
  db.all('SELECT id, username, nickname, avatar, points FROM users WHERE role = ?', ['child'], (err, children) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(children);
  });
});

// 添加孩子（家长功能）
app.post('/api/children', requireParent, (req, res) => {
  const { username, nickname } = req.body;
  db.run('INSERT INTO users (username, role, nickname, points) VALUES (?, ?, ?, ?)',
    [username, 'child', nickname || username, 0],
    function(err) {
      if (err) return res.status(500).json({ error: '添加失败，可能用户名重复' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// ========== 任务相关API ==========

// 获取任务列表
app.get('/api/tasks', requireAuth, (req, res) => {
  const { status, child_id } = req.query;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (req.session.role === 'child') {
    query += ' AND child_id = ?';
    params.push(req.session.userId);
  } else if (child_id) {
    query += ' AND child_id = ?';
    params.push(child_id);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, tasks) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(tasks);
  });
});

// 创建任务（家长）
app.post('/api/tasks', requireParent, (req, res) => {
  const { child_id, title, description, points, need_review, due_date } = req.body;
  db.run(`INSERT INTO tasks (child_id, title, description, points, need_review, due_date, status) 
          VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [child_id, title, description, points, need_review ? 1 : 0, due_date],
    function(err) {
      if (err) return res.status(500).json({ error: '创建任务失败' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 孩子提交任务完成
app.post('/api/tasks/:id/submit', requireAuth, (req, res) => {
  const taskId = req.params.id;
  
  db.get('SELECT * FROM tasks WHERE id = ? AND child_id = ?', [taskId, req.session.userId], (err, task) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    if (!task) return res.status(404).json({ error: '任务不存在' });
    if (task.status !== 'pending') return res.status(400).json({ error: '任务状态不正确' });
    
    const now = new Date().toISOString();
    
    if (task.need_review === 0) {
      // 不需要审核，直接完成并加分
      db.run('UPDATE tasks SET status = ?, submit_time = ?, complete_time = ? WHERE id = ?',
        ['completed', now, now, taskId], (err) => {
          if (err) return res.status(500).json({ error: '更新失败' });
          
          // 加分
          db.run('UPDATE users SET points = points + ? WHERE id = ?', [task.points, req.session.userId]);
          db.run('INSERT INTO point_logs (child_id, points, type, related_id, operated_by) VALUES (?, ?, ?, ?, ?)',
            [req.session.userId, task.points, 'task', taskId, req.session.userId]);
          
          res.json({ success: true, needReview: false });
        });
    } else {
      // 需要审核
      db.run('UPDATE tasks SET status = ?, submit_time = ? WHERE id = ?',
        ['submitted', now, taskId], (err) => {
          if (err) return res.status(500).json({ error: '更新失败' });
          res.json({ success: true, needReview: true });
        });
    }
  });
});

// 家长审核任务
app.post('/api/tasks/:id/review', requireParent, (req, res) => {
  const taskId = req.params.id;
  const { approved } = req.body;
  
  db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    if (!task) return res.status(404).json({ error: '任务不存在' });
    
    const now = new Date().toISOString();
    
    if (approved) {
      db.run('UPDATE tasks SET status = ?, complete_time = ?, reviewed_by = ? WHERE id = ?',
        ['completed', now, req.session.userId, taskId], (err) => {
          if (err) return res.status(500).json({ error: '更新失败' });
          
          // 加分
          db.run('UPDATE users SET points = points + ? WHERE id = ?', [task.points, task.child_id]);
          db.run('INSERT INTO point_logs (child_id, points, type, related_id, operated_by) VALUES (?, ?, ?, ?, ?)',
            [task.child_id, task.points, 'task', taskId, req.session.userId]);
          
          res.json({ success: true });
        });
    } else {
      db.run('UPDATE tasks SET status = ?, reviewed_by = ? WHERE id = ?',
        ['pending', req.session.userId, taskId], (err) => {
          if (err) return res.status(500).json({ error: '更新失败' });
          res.json({ success: true });
        });
    }
  });
});

// ========== 积分相关API ==========

// 获取积分记录
app.get('/api/points', requireAuth, (req, res) => {
  const { child_id } = req.query;
  let query = 'SELECT * FROM point_logs WHERE 1=1';
  const params = [];
  
  if (req.session.role === 'child') {
    query += ' AND child_id = ?';
    params.push(req.session.userId);
  } else if (child_id) {
    query += ' AND child_id = ?';
    params.push(child_id);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, logs) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(logs);
  });
});

// 家长手动扣分
app.post('/api/points/deduct', requireParent, (req, res) => {
  const { child_id, points, reason } = req.body;
  
  db.get('SELECT points FROM users WHERE id = ?', [child_id], (err, user) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    
    const actualDeduct = Math.min(points, user.points); // 不能扣成负数
    
    db.run('UPDATE users SET points = points - ? WHERE id = ?', [actualDeduct, child_id], (err) => {
      if (err) return res.status(500).json({ error: '扣分失败' });
      
      db.run('INSERT INTO point_logs (child_id, points, type, reason, operated_by) VALUES (?, ?, ?, ?, ?)',
        [child_id, -actualDeduct, 'deduct', reason, req.session.userId], function(err) {
          if (err) return res.status(500).json({ error: '记录失败' });
          res.json({ success: true, logId: this.lastID, actualDeduct });
        });
    });
  });
});

// 孩子申诉扣分
app.post('/api/appeals', requireAuth, upload.single('evidence'), (req, res) => {
  const { point_log_id, reason } = req.body;
  const evidence_photo = req.file ? '/uploads/' + req.file.filename : null;
  
  db.run('INSERT INTO appeals (point_log_id, child_id, reason, evidence_photo) VALUES (?, ?, ?, ?)',
    [point_log_id, req.session.userId, reason, evidence_photo],
    function(err) {
      if (err) return res.status(500).json({ error: '申诉失败' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 获取申诉列表
app.get('/api/appeals', requireAuth, (req, res) => {
  let query = 'SELECT * FROM appeals WHERE 1=1';
  const params = [];
  
  if (req.session.role === 'child') {
    query += ' AND child_id = ?';
    params.push(req.session.userId);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, appeals) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(appeals);
  });
});

// 家长处理申诉
app.post('/api/appeals/:id/review', requireParent, (req, res) => {
  const appealId = req.params.id;
  const { approved, comment } = req.body;
  
  db.get('SELECT * FROM appeals WHERE id = ?', [appealId], (err, appeal) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    if (!appeal) return res.status(404).json({ error: '申诉不存在' });
    
    const now = new Date().toISOString();
    const status = approved ? 'approved' : 'rejected';
    
    db.run('UPDATE appeals SET status = ?, reviewed_by = ?, review_comment = ?, review_time = ? WHERE id = ?',
      [status, req.session.userId, comment, now, appealId], (err) => {
        if (err) return res.status(500).json({ error: '更新失败' });
        
        if (approved) {
          // 获取原扣分记录
          db.get('SELECT * FROM point_logs WHERE id = ?', [appeal.point_log_id], (err, log) => {
            if (err) return res.status(500).json({ error: '数据库错误' });
            
            const refundPoints = Math.abs(log.points);
            db.run('UPDATE users SET points = points + ? WHERE id = ?', [refundPoints, appeal.child_id]);
            db.run('INSERT INTO point_logs (child_id, points, type, related_id, reason, operated_by) VALUES (?, ?, ?, ?, ?, ?)',
              [appeal.child_id, refundPoints, 'appeal', appealId, '申诉通过，返还积分', req.session.userId]);
            
            res.json({ success: true });
          });
        } else {
          res.json({ success: true });
        }
      });
  });
});

// ========== 奖励相关API ==========

// 获取奖励列表
app.get('/api/rewards', (req, res) => {
  db.all('SELECT * FROM rewards WHERE status = ? ORDER BY points_required', ['active'], (err, rewards) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(rewards);
  });
});

// 添加奖励（家长）
app.post('/api/rewards', requireParent, upload.single('image'), (req, res) => {
  const { title, description, points_required } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;
  
  db.run('INSERT INTO rewards (title, description, points_required, image, created_by) VALUES (?, ?, ?, ?, ?)',
    [title, description, points_required, image, req.session.userId],
    function(err) {
      if (err) return res.status(500).json({ error: '添加失败' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 孩子兑换奖励
app.post('/api/redemptions', requireAuth, (req, res) => {
  const { reward_id } = req.body;
  
  db.get('SELECT * FROM rewards WHERE id = ?', [reward_id], (err, reward) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    if (!reward) return res.status(404).json({ error: '奖励不存在' });
    
    db.get('SELECT points FROM users WHERE id = ?', [req.session.userId], (err, user) => {
      if (err) return res.status(500).json({ error: '数据库错误' });
      if (user.points < reward.points_required) {
        return res.status(400).json({ error: '积分不足' });
      }
      
      db.run('UPDATE users SET points = points - ? WHERE id = ?', [reward.points_required, req.session.userId], (err) => {
        if (err) return res.status(500).json({ error: '扣分失败' });
        
        db.run('INSERT INTO redemptions (child_id, reward_id, points_spent) VALUES (?, ?, ?)',
          [req.session.userId, reward_id, reward.points_required], function(err) {
            if (err) return res.status(500).json({ error: '兑换失败' });
            
            db.run('INSERT INTO point_logs (child_id, points, type, related_id, operated_by) VALUES (?, ?, ?, ?, ?)',
              [req.session.userId, -reward.points_required, 'redeem', this.lastID, req.session.userId]);
            
            res.json({ success: true, id: this.lastID });
          });
      });
    });
  });
});

// 获取兑换记录
app.get('/api/redemptions', requireAuth, (req, res) => {
  let query = `SELECT r.*, rw.title as reward_title, u.username as child_name 
               FROM redemptions r 
               JOIN rewards rw ON r.reward_id = rw.id 
               JOIN users u ON r.child_id = u.id 
               WHERE 1=1`;
  const params = [];
  
  if (req.session.role === 'child') {
    query += ' AND r.child_id = ?';
    params.push(req.session.userId);
  }
  
  query += ' ORDER BY r.created_at DESC';
  
  db.all(query, params, (err, redemptions) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(redemptions);
  });
});

// 家长标记兑换已完成
app.post('/api/redemptions/:id/fulfill', requireParent, (req, res) => {
  const redemptionId = req.params.id;
  const now = new Date().toISOString();
  
  db.run('UPDATE redemptions SET status = ?, fulfilled_by = ?, fulfilled_time = ? WHERE id = ?',
    ['fulfilled', req.session.userId, now, redemptionId], (err) => {
      if (err) return res.status(500).json({ error: '更新失败' });
      res.json({ success: true });
    });
});

// 孩子许愿
app.post('/api/wishes', requireAuth, (req, res) => {
  const { title, description } = req.body;
  
  db.run('INSERT INTO wishes (child_id, title, description) VALUES (?, ?, ?)',
    [req.session.userId, title, description],
    function(err) {
      if (err) return res.status(500).json({ error: '许愿失败' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 获取许愿列表
app.get('/api/wishes', requireAuth, (req, res) => {
  let query = 'SELECT w.*, u.username as child_name FROM wishes w JOIN users u ON w.child_id = u.id WHERE 1=1';
  const params = [];
  
  if (req.session.role === 'child') {
    query += ' AND w.child_id = ?';
    params.push(req.session.userId);
  }
  
  query += ' ORDER BY w.created_at DESC';
  
  db.all(query, params, (err, wishes) => {
    if (err) return res.status(500).json({ error: '数据库错误' });
    res.json(wishes);
  });
});

// 家长处理许愿
app.post('/api/wishes/:id/review', requireParent, (req, res) => {
  const wishId = req.params.id;
  const { approved } = req.body;
  const now = new Date().toISOString();
  const status = approved ? 'approved' : 'rejected';
  
  db.run('UPDATE wishes SET status = ?, reviewed_by = ?, review_time = ? WHERE id = ?',
    [status, req.session.userId, now, wishId], (err) => {
      if (err) return res.status(500).json({ error: '更新失败' });
      res.json({ success: true });
    });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`家庭任务网站运行在 http://localhost:${PORT}`);
});
