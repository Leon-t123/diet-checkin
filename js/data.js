const IMG = {
  hero: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860890-a1d926f78638?w=500&q=80',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a1e63c?w=500&q=80',
  dinner: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  snack: 'https://images.unsplash.com/photo-1488477181946-6428a029177f?w=500&q=80',
  fruit: 'https://images.unsplash.com/photo-1610348725531-843dff461e3c?w=500&q=80',
};

const DAILY_GOALS = { calories: 1800, water: 2000, protein: 75, steps: 8000 };

const RECOMMEND_FOODS = [
  { name: '燕麦酸奶碗', cal: 320, tag: '早餐', img: IMG.breakfast, tip: '高蛋白低脂，适合早晨打卡' },
  { name: '鸡胸肉沙拉', cal: 380, tag: '午餐', img: IMG.lunch, tip: '减脂期推荐，饱腹感强' },
  { name: '三文鱼藜麦饭', cal: 450, tag: '午餐', img: IMG.dinner, tip: '优质脂肪+复合碳水' },
  { name: '豆腐蔬菜汤', cal: 180, tag: '晚餐', img: IMG.dinner, tip: '清淡低卡，晚间友好' },
  { name: '坚果+苹果', cal: 200, tag: '加餐', img: IMG.snack, tip: '练后或下午补充能量' },
  { name: '蓝莓香蕉奶昔', cal: 240, tag: '加餐', img: IMG.fruit, tip: '维生素丰富，制作简单' },
];

const FEED_POSTS = [
  { user: '小雨', avatar: '🌸', text: '今天完成了三餐打卡！午餐鸡胸肉沙拉超满足～', likes: 24, time: '2小时前' },
  { user: '阿健', avatar: '💪', text: '坚持饮水2000ml第7天，大家一起加油！', likes: 18, time: '5小时前' },
  { user: '美食家L', avatar: '🥗', text: '分享我的减脂晚餐：豆腐蔬菜汤+糙米饭', likes: 31, time: '昨天' },
];

const SHARE_TEMPLATES = [
  { title: '今日饮食打卡完成', desc: '热量、饮水、蛋白质目标全部达标！' },
  { title: '本周连续打卡7天', desc: '坚持就是胜利，邀请好友一起监督' },
  { title: '发现超棒减脂餐', desc: '鸡胸肉沙拉，推荐给大家' },
];
