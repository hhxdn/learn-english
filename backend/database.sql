-- 创建数据库
CREATE DATABASE IF NOT EXISTS learn_english DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE learn_english;

-- 等级表
CREATE TABLE IF NOT EXISTS levels (
  id VARCHAR(20) PRIMARY KEY COMMENT '等级ID (primary, middle, high, cet4, cet6)',
  name VARCHAR(50) NOT NULL COMMENT '等级名称',
  word_count INT DEFAULT 10 COMMENT '每次游戏单词数量',
  color VARCHAR(20) DEFAULT '#4A90E2' COMMENT '主题颜色',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='等级配置表';

-- 单词表
CREATE TABLE IF NOT EXISTS words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(100) NOT NULL COMMENT '英文单词',
  chinese VARCHAR(200) NOT NULL COMMENT '中文释义',
  phonetic VARCHAR(100) DEFAULT '' COMMENT '音标',
  level_id VARCHAR(20) NOT NULL COMMENT '等级ID',
  status TINYINT DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_level (level_id),
  INDEX idx_word (word),
  INDEX idx_status (status),
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单词表';

-- 插入默认等级数据
INSERT INTO levels (id, name, word_count, color, sort_order) VALUES
('primary', '小学', 10, '#FFB6C1', 1),
('middle', '初中', 10, '#87CEEB', 2),
('high', '高中', 10, '#98FB98', 3),
('cet4', '四级', 10, '#FFD700', 4),
('cet6', '六级', 10, '#FF6347', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 插入示例单词数据（小学）
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('apple', '苹果', '/ˈæpl/', 'primary'),
('book', '书', '/bʊk/', 'primary'),
('cat', '猫', '/kæt/', 'primary'),
('dog', '狗', '/dɔːɡ/', 'primary'),
('egg', '鸡蛋', '/eɡ/', 'primary'),
('fish', '鱼', '/fɪʃ/', 'primary'),
('girl', '女孩', '/ɡɜːrl/', 'primary'),
('hand', '手', '/hænd/', 'primary'),
('ice', '冰', '/aɪs/', 'primary'),
('jump', '跳', '/dʒʌmp/', 'primary');

-- 插入示例单词数据（初中）
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('abandon', '放弃', '/əˈbændən/', 'middle'),
('ability', '能力', '/əˈbɪləti/', 'middle'),
('absent', '缺席的', '/ˈæbsənt/', 'middle'),
('accept', '接受', '/əkˈsept/', 'middle'),
('achieve', '实现', '/əˈtʃiːv/', 'middle'),
('address', '地址', '/əˈdres/', 'middle'),
('admire', '钦佩', '/ədˈmaɪər/', 'middle'),
('advance', '前进', '/ədˈvæns/', 'middle'),
('advice', '建议', '/ədˈvaɪs/', 'middle'),
('afford', '负担得起', '/əˈfɔːrd/', 'middle');

-- 插入示例单词数据（高中）
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('abstract', '抽象的', '/ˈæbstrækt/', 'high'),
('abundant', '丰富的', '/əˈbʌndənt/', 'high'),
('accelerate', '加速', '/əkˈseləreɪt/', 'high'),
('accommodate', '容纳', '/əˈkɑːmədeɪt/', 'high'),
('accomplish', '完成', '/əˈkɑːmplɪʃ/', 'high'),
('accumulate', '积累', '/əˈkjuːmjəleɪt/', 'high'),
('accurate', '准确的', '/ˈækjərət/', 'high'),
('acknowledge', '承认', '/əkˈnɑːlɪdʒ/', 'high'),
('acquire', '获得', '/əˈkwaɪər/', 'high'),
('adequate', '足够的', '/ˈædɪkwət/', 'high');

-- 插入示例单词数据（四级）
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('ambiguous', '模糊的', '/æmˈbɪɡjuəs/', 'cet4'),
('anticipate', '预期', '/ænˈtɪsɪpeɪt/', 'cet4'),
('arbitrary', '任意的', '/ˈɑːrbɪtreri/', 'cet4'),
('articulate', '清晰表达', '/ɑːrˈtɪkjuleɪt/', 'cet4'),
('assess', '评估', '/əˈses/', 'cet4'),
('attribute', '归因于', '/əˈtrɪbjuːt/', 'cet4'),
('authentic', '真实的', '/ɔːˈθentɪk/', 'cet4'),
('authorize', '授权', '/ˈɔːθəraɪz/', 'cet4'),
('behalf', '代表', '/bɪˈhæf/', 'cet4'),
('beneficial', '有益的', '/ˌbenɪˈfɪʃl/', 'cet4');

-- 插入示例单词数据（六级）
INSERT INTO words (word, chinese, phonetic, level_id) VALUES
('ambivalent', '矛盾的', '/æmˈbɪvələnt/', 'cet6'),
('analogous', '类似的', '/əˈnæləɡəs/', 'cet6'),
('anomaly', '异常', '/əˈnɑːməli/', 'cet6'),
('apparatus', '装置', '/ˌæpəˈrætəs/', 'cet6'),
('arbitrary', '武断的', '/ˈɑːrbɪtreri/', 'cet6'),
('articulate', '善于表达的', '/ɑːrˈtɪkjələt/', 'cet6'),
('ascertain', '查明', '/ˌæsərˈteɪn/', 'cet6'),
('assimilate', '吸收', '/əˈsɪməleɪt/', 'cet6'),
('attenuate', '减弱', '/əˈtenjueɪt/', 'cet6'),
('auspicious', '吉利的', '/ɔːˈspɪʃəs/', 'cet6');
