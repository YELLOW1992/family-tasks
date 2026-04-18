// 全局状态
let currentUser = null;
let children = [];

// 页面加载时检查登录状态
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      currentUser = await res.json();
      if (currentUser.role === 'parent') {
        showParentDashboard();
      } else {
        showChildDashboard();
      }
    } else {
      showLoginPage();
    }
  } catch (err) {
    showLoginPage();
  }
});

// 显示登录页面
function showLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h2 class="text-center mb-4">家庭任务管理系统</h2>
        <div class="mb-3">
          <button class="btn btn-primary w-100 mb-2" onclick="showParentLogin()">家长登录</button>
          <button class="btn btn-success w-100" onclick="showChildLogin()">孩子登录</button>
        </div>
      </div>
    </div>
  `;
}

// 家长登录
function showParentLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h3 class="text-center mb-4">家长登录</h3>
        <form onsubmit="handleParentLogin(event)">
          <div class="mb-3">
            <input type="text" class="form-control" id="parentUsername" placeholder="用户名" required>
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" id="parentPassword" placeholder="密码" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">登录</button>
          <button type="button" class="btn btn-secondary w-100 mt-2" onclick="showLoginPage()">返回</button>
        </form>
      </div>
    </div>
  `;
}

async function handleParentLogin(e) {
  e.preventDefault();
  const username = document.getElementById('parentUsername').value;
  const password = document.getElementById('parentPassword').value;
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'parent' })
    });
    
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      showParentDashboard();
    } else {
      const error = await res.json();
      alert(error.error || '登录失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

// 孩子登录
async function showChildLogin() {
  try {
    const res = await fetch('/api/children');
    children = await res.json();
    
    if (children.length === 0) {
      alert('还没有孩子账号，请家长先添加');
      showLoginPage();
      return;
    }
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <h3 class="text-center mb-4">选择你的名字</h3>
          <div class="child-selector">
            ${children.map(child => `
              <button class="child-btn" onclick="handleChildLogin(${child.id})">
                ${child.nickname || child.username}
              </button>
            `).join('')}
          </div>
          <button class="btn btn-secondary w-100 mt-3" onclick="showLoginPage()">返回</button>
        </div>
      </div>
    `;
  } catch (err) {
    alert('加载失败');
  }
}

async function handleChildLogin(childId) {
  const child = children.find(c => c.id === childId);
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: child.username, role: 'child' })
    });
    
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      showChildDashboard();
    } else {
      alert('登录失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

// 登出
async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  currentUser = null;
  showLoginPage();
}

// ========== 家长端 ==========

async function showParentDashboard() {
  const res = await fetch('/api/children');
  children = await res.json();
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="navbar">
        <h4>家长管理</h4>
        <div>
          <button class="btn btn-sm btn-primary" onclick="showParentTasks()">任务管理</button>
          <button class="btn btn-sm btn-success" onclick="showParentRewards()">奖励管理</button>
          <button class="btn btn-sm btn-warning" onclick="showParentChildren()">孩子管理</button>
          <button class="btn btn-sm btn-danger" onclick="logout()">登出</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <h5>孩子积分概览</h5>
          <div id="childrenOverview"></div>
        </div>
      </div>
      
      <div id="parentContent"></div>
    </div>
  `;
  
  updateChildrenOverview();
  showParentTasks();
}

async function updateChildrenOverview() {
  const res = await fetch('/api/children');
  const children = await res.json();
  
  const overview = document.getElementById('childrenOverview');
  overview.innerHTML = children.map(child => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span>${child.nickname || child.username}</span>
      <span class="badge bg-primary">${child.points} 积分</span>
    </div>
  `).join('');
}

async function showParentTasks() {
  const content = document.getElementById('parentContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>发布新任务</h5>
        <form onsubmit="createTask(event)">
          <div class="mb-3">
            <select class="form-select" id="taskChildId" required>
              <option value="">选择孩子</option>
              ${children.map(c => `<option value="${c.id}">${c.nickname || c.username}</option>`).join('')}
            </select>
          </div>
          <div class="mb-3">
            <input type="text" class="form-control" id="taskTitle" placeholder="任务名称" required>
          </div>
          <div class="mb-3">
            <textarea class="form-control" id="taskDesc" placeholder="任务描述" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <input type="number" class="form-control" id="taskPoints" placeholder="奖励积分" required min="1">
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="taskNeedReview">
            <label class="form-check-label" for="taskNeedReview">需要审核</label>
          </div>
          <button type="submit" class="btn btn-primary w-100">发布任务</button>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5>待审核任务</h5>
        <div id="pendingTasks"></div>
      </div>
    </div>
  `;
  
  loadPendingTasks();
}

async function createTask(e) {
  e.preventDefault();
  
  const data = {
    child_id: document.getElementById('taskChildId').value,
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDesc').value,
    points: parseInt(document.getElementById('taskPoints').value),
    need_review: document.getElementById('taskNeedReview').checked
  };
  
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      alert('任务发布成功！');
      e.target.reset();
    } else {
      alert('发布失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

async function loadPendingTasks() {
  const res = await fetch('/api/tasks?status=submitted');
  const tasks = await res.json();
  
  const container = document.getElementById('pendingTasks');
  if (tasks.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无待审核任务</p>';
    return;
  }
  
  container.innerHTML = tasks.map(task => {
    const child = children.find(c => c.id === task.child_id);
    return `
      <div class="task-card">
        <div class="d-flex justify-content-between">
          <div>
            <strong>${task.title}</strong>
            <p class="text-muted mb-1">${task.description || ''}</p>
            <small>孩子: ${child ? child.nickname : '未知'} | 积分: ${task.points}</small>
          </div>
        </div>
        <div class="mt-2">
          <button class="btn btn-sm btn-success" onclick="reviewTask(${task.id}, true)">通过</button>
          <button class="btn btn-sm btn-danger" onclick="reviewTask(${task.id}, false)">拒绝</button>
        </div>
      </div>
    `;
  }).join('');
}

async function reviewTask(taskId, approved) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved })
    });
    
    if (res.ok) {
      alert(approved ? '已通过' : '已拒绝');
      loadPendingTasks();
      updateChildrenOverview();
    }
  } catch (err) {
    alert('操作失败');
  }
}

async function showParentRewards() {
  const content = document.getElementById('parentContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>添加奖励</h5>
        <form onsubmit="createReward(event)">
          <div class="mb-3">
            <input type="text" class="form-control" id="rewardTitle" placeholder="奖励名称" required>
          </div>
          <div class="mb-3">
            <textarea class="form-control" id="rewardDesc" placeholder="奖励描述" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <input type="number" class="form-control" id="rewardPoints" placeholder="所需积分" required min="1">
          </div>
          <button type="submit" class="btn btn-primary w-100">添加奖励</button>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5>待兑现奖励</h5>
        <div id="pendingRedemptions"></div>
      </div>
    </div>
  `;
  
  loadPendingRedemptions();
}

async function createReward(e) {
  e.preventDefault();
  
  const data = {
    title: document.getElementById('rewardTitle').value,
    description: document.getElementById('rewardDesc').value,
    points_required: parseInt(document.getElementById('rewardPoints').value)
  };
  
  try {
    const res = await fetch('/api/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      alert('奖励添加成功！');
      e.target.reset();
    } else {
      alert('添加失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

async function loadPendingRedemptions() {
  const res = await fetch('/api/redemptions');
  const redemptions = await res.json();
  const pending = redemptions.filter(r => r.status === 'pending');
  
  const container = document.getElementById('pendingRedemptions');
  if (pending.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无待兑现奖励</p>';
    return;
  }
  
  container.innerHTML = pending.map(r => `
    <div class="task-card">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${r.reward_title}</strong>
          <p class="text-muted mb-0">孩子: ${r.child_name} | 积分: ${r.points_spent}</p>
        </div>
        <button class="btn btn-sm btn-success" onclick="fulfillRedemption(${r.id})">已兑现</button>
      </div>
    </div>
  `).join('');
}

async function fulfillRedemption(id) {
  try {
    const res = await fetch(`/api/redemptions/${id}/fulfill`, { method: 'POST' });
    if (res.ok) {
      alert('已标记为兑现');
      loadPendingRedemptions();
    }
  } catch (err) {
    alert('操作失败');
  }
}

async function showParentChildren() {
  const content = document.getElementById('parentContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>添加孩子</h5>
        <form onsubmit="addChild(event)">
          <div class="mb-3">
            <input type="text" class="form-control" id="childUsername" placeholder="孩子名字" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">添加</button>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5>手动扣分</h5>
        <form onsubmit="deductPoints(event)">
          <div class="mb-3">
            <select class="form-select" id="deductChildId" required>
              <option value="">选择孩子</option>
              ${children.map(c => `<option value="${c.id}">${c.nickname || c.username}</option>`).join('')}
            </select>
          </div>
          <div class="mb-3">
            <input type="number" class="form-control" id="deductPoints" placeholder="扣除积分" required min="1">
          </div>
          <div class="mb-3">
            <input type="text" class="form-control" id="deductReason" placeholder="扣分原因" required>
          </div>
          <button type="submit" class="btn btn-warning w-100">扣分</button>
        </form>
      </div>
    </div>
  `;
}

async function addChild(e) {
  e.preventDefault();
  
  const username = document.getElementById('childUsername').value;
  
  try {
    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, nickname: username })
    });
    
    if (res.ok) {
      alert('添加成功！');
      e.target.reset();
      showParentDashboard();
    } else {
      alert('添加失败，可能名字重复');
    }
  } catch (err) {
    alert('网络错误');
  }
}

async function deductPoints(e) {
  e.preventDefault();
  
  const data = {
    child_id: document.getElementById('deductChildId').value,
    points: parseInt(document.getElementById('deductPoints').value),
    reason: document.getElementById('deductReason').value
  };
  
  try {
    const res = await fetch('/api/points/deduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      alert('扣分成功');
      e.target.reset();
      updateChildrenOverview();
    } else {
      alert('扣分失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

// ========== 孩子端 ==========

async function showChildDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="navbar">
        <h4>欢迎，${currentUser.username}</h4>
        <button class="btn btn-sm btn-danger" onclick="logout()">登出</button>
      </div>
      
      <div class="points-display">
        我的积分：<span id="myPoints">${currentUser.points || 0}</span>
      </div>
      
      <div class="navbar">
        <button class="btn btn-sm btn-primary" onclick="showChildTasks()">我的任务</button>
        <button class="btn btn-sm btn-success" onclick="showChildRewards()">奖励商城</button>
        <button class="btn btn-sm btn-warning" onclick="showChildPoints()">积分记录</button>
      </div>
      
      <div id="childContent"></div>
    </div>
  `;
  
  showChildTasks();
}

async function updateMyPoints() {
  const res = await fetch('/api/me');
  const user = await res.json();
  document.getElementById('myPoints').textContent = user.points;
  currentUser.points = user.points;
}

async function showChildTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  
  const pending = tasks.filter(t => t.status === 'pending');
  const submitted = tasks.filter(t => t.status === 'submitted');
  
  const content = document.getElementById('childContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>待完成任务</h5>
        <div id="pendingTasksList"></div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5>待审核任务</h5>
        <div id="submittedTasksList"></div>
      </div>
    </div>
  `;
  
  renderTaskList('pendingTasksList', pending, true);
  renderTaskList('submittedTasksList', submitted, false);
}

function renderTaskList(containerId, tasks, showButton) {
  const container = document.getElementById(containerId);
  
  if (tasks.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无任务</p>';
    return;
  }
  
  container.innerHTML = tasks.map(task => `
    <div class="task-card">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${task.title}</strong>
          <p class="text-muted mb-1">${task.description || ''}</p>
          <span class="badge bg-warning">${task.points} 积分</span>
        </div>
        ${showButton ? `<button class="btn btn-sm btn-success" onclick="submitTask(${task.id})">完成</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function submitTask(taskId) {
  if (!confirm('确认完成这个任务吗？')) return;
  
  try {
    const res = await fetch(`/api/tasks/${taskId}/submit`, { method: 'POST' });
    const data = await res.json();
    
    if (res.ok) {
      if (data.needReview) {
        alert('已提交，等待家长审核');
      } else {
        alert('任务完成，积分已到账！');
        updateMyPoints();
      }
      showChildTasks();
    } else {
      alert(data.error || '提交失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

async function showChildRewards() {
  const res = await fetch('/api/rewards');
  const rewards = await res.json();
  
  const content = document.getElementById('childContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>奖励商城</h5>
        <div id="rewardsList"></div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-body">
        <h5>我的兑换记录</h5>
        <div id="myRedemptions"></div>
      </div>
    </div>
  `;
  
  const rewardsList = document.getElementById('rewardsList');
  rewardsList.innerHTML = rewards.map(reward => `
    <div class="reward-card">
      <h6>${reward.title}</h6>
      <p class="text-muted">${reward.description || ''}</p>
      <div class="d-flex justify-content-between align-items-center">
        <span class="badge bg-warning">${reward.points_required} 积分</span>
        <button class="btn btn-sm btn-primary" onclick="redeemReward(${reward.id}, ${reward.points_required})">兑换</button>
      </div>
    </div>
  `).join('');
  
  loadMyRedemptions();
}

async function redeemReward(rewardId, pointsRequired) {
  if (!confirm('确认兑换这个奖励吗？')) return;
  
  try {
    const res = await fetch('/api/redemptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reward_id: rewardId })
    });
    
    if (res.ok) {
      alert('兑换成功！请等待家长兑现');
      updateMyPoints();
      showChildRewards();
    } else {
      const data = await res.json();
      alert(data.error || '兑换失败');
    }
  } catch (err) {
    alert('网络错误');
  }
}

async function loadMyRedemptions() {
  const res = await fetch('/api/redemptions');
  const redemptions = await res.json();
  
  const container = document.getElementById('myRedemptions');
  if (redemptions.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无兑换记录</p>';
    return;
  }
  
  container.innerHTML = redemptions.map(r => `
    <div class="task-card">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${r.reward_title}</strong>
          <p class="text-muted mb-0">${r.points_spent} 积分</p>
        </div>
        <span class="badge bg-success">待兑现</span>
      </div>
    </div>
  `).join('');
}

async function showChildPoints() {
  const res = await fetch('/api/points');
  const logs = await res.json();
  
  const content = document.getElementById('childContent');
  content.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5>积分记录</h5>
        <div id="pointLogsList"></div>
      </div>
    </div>
  `;
  
  const container = document.getElementById('pointLogsList');
  if (logs.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无记录</p>';
    return;
  }
  
  container.innerHTML = logs.map(log => {
    const isPositive = log.points > 0;
    return `
      <div class="task-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong class="${isPositive ? 'text-success' : 'text-danger'}">
              ${isPositive ? '+' : ''}${log.points} 积分
            </strong>
            <p class="text-muted mb-0">${log.type}</p>
            ${log.reason ? `<small>${log.reason}</small>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
