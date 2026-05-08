// API基础URL
const API_BASE = '/api';

// 当前状态
let currentPage = 1;
let currentLevel = '';
let currentKeyword = '';
let levels = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadLevels();
  loadWords();
});

// 导航切换
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      switchPage(page);
    });
  });
}

function switchPage(pageName) {
  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

  // 切换页面
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(`${pageName}-page`).classList.add('active');

  // 加载对应数据
  if (pageName === 'words') {
    loadWords();
  } else if (pageName === 'levels') {
    loadLevelsPage();
  }
}

// ========== 等级相关 ==========

async function loadLevels() {
  try {
    const response = await fetch(`${API_BASE}/levels`);
    const result = await response.json();

    if (result.code === 200) {
      levels = result.data;
      updateLevelFilter();
      updateWordLevelSelect();
    }
  } catch (error) {
    console.error('加载等级失败:', error);
    alert('加载等级失败');
  }
}

function updateLevelFilter() {
  const select = document.getElementById('level-filter');
  select.innerHTML = '<option value="">全部等级</option>';
  levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level.id;
    option.textContent = level.name;
    select.appendChild(option);
  });
}

function updateWordLevelSelect() {
  const select = document.getElementById('word-level');
  select.innerHTML = '';
  levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level.id;
    option.textContent = level.name;
    select.appendChild(option);
  });
}

async function loadLevelsPage() {
  try {
    const response = await fetch(`${API_BASE}/levels`);
    const result = await response.json();

    if (result.code === 200) {
      renderLevelsTable(result.data);
    }
  } catch (error) {
    console.error('加载等级列表失败:', error);
    alert('加载等级列表失败');
  }
}

function renderLevelsTable(levels) {
  const tbody = document.getElementById('levels-tbody');

  if (levels.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">暂无数据</td></tr>';
    return;
  }

  tbody.innerHTML = levels.map(level => `
    <tr>
      <td>${level.id}</td>
      <td>${level.name}</td>
      <td>${level.word_count}</td>
      <td>${level.total_words || 0}</td>
      <td><span class="color-box" style="background: ${level.color}"></span> ${level.color}</td>
      <td>${level.sort_order}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editLevel('${level.id}')">编辑</button>
        <button class="action-btn btn-delete" onclick="deleteLevel('${level.id}')">删除</button>
      </td>
    </tr>
  `).join('');
}

function showAddLevelModal() {
  document.getElementById('level-modal-title').textContent = '添加等级';
  document.getElementById('level-form').reset();
  document.getElementById('level-old-id').value = '';
  document.getElementById('level-id').disabled = false;
  document.getElementById('level-modal').classList.add('show');
}

async function editLevel(id) {
  try {
    const response = await fetch(`${API_BASE}/levels/${id}`);
    const result = await response.json();

    if (result.code === 200) {
      const level = result.data;
      document.getElementById('level-modal-title').textContent = '编辑等级';
      document.getElementById('level-old-id').value = level.id;
      document.getElementById('level-id').value = level.id;
      document.getElementById('level-id').disabled = true;
      document.getElementById('level-name').value = level.name;
      document.getElementById('level-word-count').value = level.word_count;
      document.getElementById('level-color').value = level.color;
      document.getElementById('level-sort').value = level.sort_order;
      document.getElementById('level-modal').classList.add('show');
    }
  } catch (error) {
    console.error('加载等级失败:', error);
    alert('加载等级失败');
  }
}

function closeLevelModal() {
  document.getElementById('level-modal').classList.remove('show');
}

document.getElementById('level-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const oldId = document.getElementById('level-old-id').value;
  const id = document.getElementById('level-id').value;
  const name = document.getElementById('level-name').value;
  const word_count = parseInt(document.getElementById('level-word-count').value);
  const color = document.getElementById('level-color').value;
  const sort_order = parseInt(document.getElementById('level-sort').value);

  const data = { id, name, word_count, color, sort_order };

  try {
    let response;
    if (oldId) {
      // 更新
      response = await fetch(`${API_BASE}/levels/${oldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // 创建
      response = await fetch(`${API_BASE}/levels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    const result = await response.json();

    if (result.code === 200) {
      alert(oldId ? '更新成功' : '创建成功');
      closeLevelModal();
      loadLevelsPage();
      loadLevels();
    } else {
      alert(result.message || '操作失败');
    }
  } catch (error) {
    console.error('保存等级失败:', error);
    alert('保存等级失败');
  }
});

async function deleteLevel(id) {
  if (!confirm('确定要删除这个等级吗？删除后该等级下的所有单词也会被删除！')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/levels/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.code === 200) {
      alert('删除成功');
      loadLevelsPage();
      loadLevels();
    } else {
      alert(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除等级失败:', error);
    alert('删除等级失败');
  }
}

// ========== 单词相关 ==========

async function loadWords(page = 1) {
  currentPage = page;
  currentLevel = document.getElementById('level-filter')?.value || '';
  currentKeyword = document.getElementById('keyword-filter')?.value || '';

  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: 20,
      level_id: currentLevel,
      keyword: currentKeyword
    });

    const response = await fetch(`${API_BASE}/words?${params}`);
    const result = await response.json();

    if (result.code === 200) {
      renderWordsTable(result.data.list);
      renderPagination(result.data);
    }
  } catch (error) {
    console.error('加载单词列表失败:', error);
    alert('加载单词列表失败');
  }
}

function renderWordsTable(words) {
  const tbody = document.getElementById('words-tbody');

  if (words.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center">暂无数据</td></tr>';
    return;
  }

  tbody.innerHTML = words.map(word => `
    <tr>
      <td><input type="checkbox" class="word-checkbox" value="${word.id}"></td>
      <td>${word.id}</td>
      <td><strong>${word.word}</strong></td>
      <td>${word.chinese}</td>
      <td>${word.phonetic || '-'}</td>
      <td>${getLevelName(word.level_id)}</td>
      <td>
        <span class="badge ${word.status === 1 ? 'badge-success' : 'badge-danger'}">
          ${word.status === 1 ? '启用' : '禁用'}
        </span>
      </td>
      <td>${formatDate(word.created_at)}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editWord(${word.id})">编辑</button>
        <button class="action-btn btn-delete" onclick="deleteWord(${word.id})">删除</button>
      </td>
    </tr>
  `).join('');
}

function getLevelName(levelId) {
  const level = levels.find(l => l.id === levelId);
  return level ? level.name : levelId;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
}

function renderPagination(data) {
  const { page, limit, total } = data;
  const totalPages = Math.ceil(total / limit);

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = `
    <button onclick="loadWords(${page - 1})" ${page <= 1 ? 'disabled' : ''}>上一页</button>
    <span>第 ${page} / ${totalPages} 页，共 ${total} 条</span>
    <button onclick="loadWords(${page + 1})" ${page >= totalPages ? 'disabled' : ''}>下一页</button>
  `;
}

let searchTimer;
function handleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadWords(1);
  }, 500);
}

function toggleSelectAll() {
  const checked = document.getElementById('select-all').checked;
  document.querySelectorAll('.word-checkbox').forEach(cb => {
    cb.checked = checked;
  });
}

function showAddWordModal() {
  document.getElementById('word-modal-title').textContent = '添加单词';
  document.getElementById('word-form').reset();
  document.getElementById('word-id').value = '';
  document.getElementById('word-modal').classList.add('show');
}

async function editWord(id) {
  try {
    const response = await fetch(`${API_BASE}/words/${id}`);
    const result = await response.json();

    if (result.code === 200) {
      const word = result.data;
      document.getElementById('word-modal-title').textContent = '编辑单词';
      document.getElementById('word-id').value = word.id;
      document.getElementById('word-word').value = word.word;
      document.getElementById('word-chinese').value = word.chinese;
      document.getElementById('word-phonetic').value = word.phonetic || '';
      document.getElementById('word-level').value = word.level_id;
      document.getElementById('word-status').value = word.status;
      document.getElementById('word-modal').classList.add('show');
    }
  } catch (error) {
    console.error('加载单词失败:', error);
    alert('加载单词失败');
  }
}

function closeWordModal() {
  document.getElementById('word-modal').classList.remove('show');
}

document.getElementById('word-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('word-id').value;
  const word = document.getElementById('word-word').value;
  const chinese = document.getElementById('word-chinese').value;
  const phonetic = document.getElementById('word-phonetic').value;
  const level_id = document.getElementById('word-level').value;
  const status = parseInt(document.getElementById('word-status').value);

  const data = { word, chinese, phonetic, level_id, status };

  try {
    let response;
    if (id) {
      // 更新
      response = await fetch(`${API_BASE}/words/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // 创建
      response = await fetch(`${API_BASE}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    const result = await response.json();

    if (result.code === 200) {
      alert(id ? '更新成功' : '创建成功');
      closeWordModal();
      loadWords(currentPage);
    } else {
      alert(result.message || '操作失败');
    }
  } catch (error) {
    console.error('保存单词失败:', error);
    alert('保存单词失败');
  }
});

async function deleteWord(id) {
  if (!confirm('确定要删除这个单词吗？')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/words/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.code === 200) {
      alert('删除成功');
      loadWords(currentPage);
    } else {
      alert(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除单词失败:', error);
    alert('删除单词失败');
  }
}

async function batchDelete() {
  const checkboxes = document.querySelectorAll('.word-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.value));

  if (ids.length === 0) {
    alert('请先选择要删除的单词');
    return;
  }

  if (!confirm(`确定要删除选中的 ${ids.length} 个单词吗？`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/words/batch/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });

    const result = await response.json();

    if (result.code === 200) {
      alert(`成功删除 ${result.data.count} 个单词`);
      document.getElementById('select-all').checked = false;
      loadWords(currentPage);
    } else {
      alert(result.message || '删除失败');
    }
  } catch (error) {
    console.error('批量删除失败:', error);
    alert('批量删除失败');
  }
}

// ========== 批量导入 ==========

async function importWords() {
  const textarea = document.getElementById('import-data');
  const jsonText = textarea.value.trim();

  if (!jsonText) {
    alert('请输入JSON数据');
    return;
  }

  let words;
  try {
    words = JSON.parse(jsonText);
  } catch (error) {
    alert('JSON格式错误，请检查格式');
    return;
  }

  if (!Array.isArray(words)) {
    alert('数据必须是数组格式');
    return;
  }

  if (words.length === 0) {
    alert('数据不能为空');
    return;
  }

  // 验证数据
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w.word || !w.chinese || !w.level_id) {
      alert(`第 ${i + 1} 条数据缺少必填字段（word、chinese、level_id）`);
      return;
    }
  }

  if (!confirm(`确定要导入 ${words.length} 个单词吗？`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/words/batch/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words })
    });

    const result = await response.json();

    if (result.code === 200) {
      alert(`成功导入 ${result.data.count} 个单词`);
      textarea.value = '';
      switchPage('words');
    } else {
      alert(result.message || '导入失败');
    }
  } catch (error) {
    console.error('导入失败:', error);
    alert('导入失败');
  }
}
