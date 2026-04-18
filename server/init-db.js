const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, '../database/family_tasks.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS task_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    need_review INTEGER DEFAULT 0,
    repeat_type TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER,
    child_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    need_review INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    submit_time DATETIME,
    complete_time DATETIME,
    reviewed_by INTEGER,
    due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES task_templates(id),
    FOREIGN KEY (child_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS point_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    type TEXT NOT NULL,
    related_id INTEGER,
    reason TEXT,
    operated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES users(id),
    FOREIGN KEY (operated_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appeals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    point_log_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    evidence_photo TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_by INTEGER,
    review_comment TEXT,
    review_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (point_log_id) REFERENCES point_logs(id),
    FOREIGN KEY (child_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    image TEXT,
    status TEXT DEFAULT 'active',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_by INTEGER,
    review_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    points_spent INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    fulfilled_by INTEGER,
    fulfilled_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id),
    FOREIGN KEY (fulfilled_by) REFERENCES users(id)
  )`);

  const hashedPassword = bcrypt.hashSync('admin', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, nickname) VALUES (?, ?, ?, ?)`,
    ['家长', hashedPassword, 'parent', '家长'],
    (err) => {
      if (err) {
        console.error('创建默认账号失败:', err);
      } else {
        console.log('数据库初始化完成！');
        console.log('默认家长账号：');
        console.log('  用户名: 家长');
        console.log('  密码: admin');
      }
      db.close();
    }
  );
});
