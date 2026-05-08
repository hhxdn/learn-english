// 不同等级的单词库
const wordDatabase = {
  primary: [
    { word: 'apple', chinese: '苹果', phonetic: '/ˈæpl/' },
    { word: 'book', chinese: '书', phonetic: '/bʊk/' },
    { word: 'cat', chinese: '猫', phonetic: '/kæt/' },
    { word: 'dog', chinese: '狗', phonetic: '/dɔːɡ/' },
    { word: 'egg', chinese: '鸡蛋', phonetic: '/eɡ/' },
    { word: 'fish', chinese: '鱼', phonetic: '/fɪʃ/' },
    { word: 'girl', chinese: '女孩', phonetic: '/ɡɜːrl/' },
    { word: 'hand', chinese: '手', phonetic: '/hænd/' },
    { word: 'ice', chinese: '冰', phonetic: '/aɪs/' },
    { word: 'jump', chinese: '跳', phonetic: '/dʒʌmp/' }
  ],

  middle: [
    { word: 'abandon', chinese: '放弃', phonetic: '/əˈbændən/' },
    { word: 'ability', chinese: '能力', phonetic: '/əˈbɪləti/' },
    { word: 'absent', chinese: '缺席的', phonetic: '/ˈæbsənt/' },
    { word: 'accept', chinese: '接受', phonetic: '/əkˈsept/' },
    { word: 'achieve', chinese: '实现', phonetic: '/əˈtʃiːv/' },
    { word: 'address', chinese: '地址', phonetic: '/əˈdres/' },
    { word: 'admire', chinese: '钦佩', phonetic: '/ədˈmaɪər/' },
    { word: 'advance', chinese: '前进', phonetic: '/ədˈvæns/' },
    { word: 'advice', chinese: '建议', phonetic: '/ədˈvaɪs/' },
    { word: 'afford', chinese: '负担得起', phonetic: '/əˈfɔːrd/' }
  ],

  high: [
    { word: 'abstract', chinese: '抽象的', phonetic: '/ˈæbstrækt/' },
    { word: 'abundant', chinese: '丰富的', phonetic: '/əˈbʌndənt/' },
    { word: 'accelerate', chinese: '加速', phonetic: '/əkˈseləreɪt/' },
    { word: 'accommodate', chinese: '容纳', phonetic: '/əˈkɑːmədeɪt/' },
    { word: 'accomplish', chinese: '完成', phonetic: '/əˈkɑːmplɪʃ/' },
    { word: 'accumulate', chinese: '积累', phonetic: '/əˈkjuːmjəleɪt/' },
    { word: 'accurate', chinese: '准确的', phonetic: '/ˈækjərət/' },
    { word: 'acknowledge', chinese: '承认', phonetic: '/əkˈnɑːlɪdʒ/' },
    { word: 'acquire', chinese: '获得', phonetic: '/əˈkwaɪər/' },
    { word: 'adequate', chinese: '足够的', phonetic: '/ˈædɪkwət/' }
  ],

  cet4: [
    { word: 'ambiguous', chinese: '模糊的', phonetic: '/æmˈbɪɡjuəs/' },
    { word: 'anticipate', chinese: '预期', phonetic: '/ænˈtɪsɪpeɪt/' },
    { word: 'arbitrary', chinese: '任意的', phonetic: '/ˈɑːrbɪtreri/' },
    { word: 'articulate', chinese: '清晰表达', phonetic: '/ɑːrˈtɪkjuleɪt/' },
    { word: 'assess', chinese: '评估', phonetic: '/əˈses/' },
    { word: 'attribute', chinese: '归因于', phonetic: '/əˈtrɪbjuːt/' },
    { word: 'authentic', chinese: '真实的', phonetic: '/ɔːˈθentɪk/' },
    { word: 'authorize', chinese: '授权', phonetic: '/ˈɔːθəraɪz/' },
    { word: 'behalf', chinese: '代表', phonetic: '/bɪˈhæf/' },
    { word: 'beneficial', chinese: '有益的', phonetic: '/ˌbenɪˈfɪʃl/' }
  ],

  cet6: [
    { word: 'ambivalent', chinese: '矛盾的', phonetic: '/æmˈbɪvələnt/' },
    { word: 'analogous', chinese: '类似的', phonetic: '/əˈnæləɡəs/' },
    { word: 'anomaly', chinese: '异常', phonetic: '/əˈnɑːməli/' },
    { word: 'apparatus', chinese: '装置', phonetic: '/ˌæpəˈrætəs/' },
    { word: 'arbitrary', chinese: '武断的', phonetic: '/ˈɑːrbɪtreri/' },
    { word: 'articulate', chinese: '善于表达的', phonetic: '/ɑːrˈtɪkjələt/' },
    { word: 'ascertain', chinese: '查明', phonetic: '/ˌæsərˈteɪn/' },
    { word: 'assimilate', chinese: '吸收', phonetic: '/əˈsɪməleɪt/' },
    { word: 'attenuate', chinese: '减弱', phonetic: '/əˈtenjueɪt/' },
    { word: 'auspicious', chinese: '吉利的', phonetic: '/ɔːˈspɪʃəs/' }
  ]
};

// 等级配置
const levelConfig = {
  primary: { name: '小学', wordCount: 10, color: '#FFB6C1' },
  middle: { name: '初中', wordCount: 10, color: '#87CEEB' },
  high: { name: '高中', wordCount: 10, color: '#98FB98' },
  cet4: { name: '四级', wordCount: 10, color: '#FFD700' },
  cet6: { name: '六级', wordCount: 10, color: '#FF6347' }
};

module.exports = {
  wordDatabase,
  levelConfig
};
