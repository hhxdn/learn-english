-- 添加错题记录表
CREATE TABLE IF NOT EXISTS wrong_words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) DEFAULT 'default_user' COMMENT '用户ID（暂时使用默认用户）',
  word_id INT NOT NULL COMMENT '单词ID',
  word VARCHAR(100) NOT NULL COMMENT '单词',
  chinese VARCHAR(200) NOT NULL COMMENT '中文释义',
  phonetic VARCHAR(100) DEFAULT '' COMMENT '音标',
  level_id VARCHAR(20) NOT NULL COMMENT '等级ID',
  wrong_count INT DEFAULT 1 COMMENT '答错次数',
  last_wrong_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后答错时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_word (word_id),
  UNIQUE KEY uk_user_word (user_id, word_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='错题记录表';
