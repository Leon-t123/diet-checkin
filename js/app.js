const App = {
  current: 'login',
  user: '打卡用户',
  titles: {
    login: '登录 - 每日饮食打卡',
    home: '首页 - 每日饮食打卡',
    foods: '食品推荐',
    profile: '个人中心',
    interact: '互动社区',
    share: '分享打卡',
  },

  init() {
    this.loadData();
    const h = location.hash.slice(1) || 'login';
    if (this.titles[h]) this.current = h;
    this.renderAll();
    this.bindEvents();
    this.go(this.current, false);
  },

  storageKey: 'diet_checkin_data',

  loadData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.data = raw ? JSON.parse(raw) : this.defaultData();
    } catch {
      this.data = this.defaultData();
    }
    const today = this.todayKey();
    if (!this.data.days[today]) {
      this.data.days[today] = { meals: [], water: 0, calories: 0, protein: 0, checked: false };
    }
  },

  defaultData() {
    return {
      streak: 0,
      totalCheckins: 0,
      days: {},
      likedPosts: [],
      myPosts: [],
    };
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  },

  todayKey() {
    return new Date().toISOString().slice(0, 10);
  },

  today() {
    return this.data.days[this.todayKey()];
  },

  bindEvents() {
    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('login-name')?.value.trim();
      if (name) this.user = name;
      this.go('home');
    });

    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-nav]');
      if (nav) { e.preventDefault(); this.go(nav.dataset.nav); return; }

      const meal = e.target.closest('[data-check-meal]');
      if (meal) { e.preventDefault(); this.checkMeal(meal.dataset.checkMeal); return; }

      const addWater = e.target.closest('[data-add-water]');
      if (addWater) { e.preventDefault(); this.addWater(parseInt(addWater.dataset.addWater, 10)); return; }

      const rec = e.target.closest('[data-add-rec]');
      if (rec) { e.preventDefault(); this.addFromRecommend(parseInt(rec.dataset.addRec, 10)); return; }

      const like = e.target.closest('[data-like-id]');
      if (like) { e.preventDefault(); this.toggleLike(like.dataset.likeId); return; }

      const post = e.target.closest('#btn-post');
      if (post) { e.preventDefault(); this.submitPost(); return; }

      const share = e.target.closest('[data-share]');
      if (share) { e.preventDefault(); this.doShare(parseInt(share.dataset.share, 10)); return; }

      const complete = e.target.closest('#btn-daily-checkin');
      if (complete) { e.preventDefault(); this.completeDailyCheckin(); return; }
    });

    window.addEventListener('hashchange', () => {
      const p = location.hash.slice(1);
      if (p && this.titles[p]) this.go(p, false);
    });
  },

  go(page, push = true) {
    if (!this.titles[page]) return;
    this.current = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page)?.classList.add('active');
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.dataset.nav === page);
    });
    document.title = this.titles[page];
    if (push) location.hash = page;
    window.scrollTo(0, 0);
    this.renderAll();
  },

  renderAll() {
    if (this.current === 'home') this.renderHome();
    if (this.current === 'foods') this.renderFoods();
    if (this.current === 'profile') this.renderProfile();
    if (this.current === 'interact') this.renderInteract();
    if (this.current === 'share') this.renderShare();
  },

  renderHome() {
    const d = this.today();
    const g = DAILY_GOALS;
    const setBar = (id, val, max) => {
      const el = document.getElementById(id);
      if (el) el.style.width = Math.min(100, (val / max) * 100) + '%';
    };
    const setText = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };

    setText('m-cal', `${d.calories} / ${g.calories} 千卡`);
    setText('m-water', `${d.water} / ${g.water} ml`);
    setText('m-protein', `${d.protein} / ${g.protein} g`);
    setText('m-streak', `${this.data.streak} 天`);
    setBar('bar-cal', d.calories, g.calories);
    setBar('bar-water', d.water, g.water);
    setBar('bar-protein', d.protein, g.protein);

    const status = document.getElementById('checkin-status');
    if (status) {
      status.textContent = d.checked ? '✅ 今日已打卡' : '⏳ 待完成今日打卡';
      status.className = d.checked ? 'status done' : 'status pending';
    }

    const meals = document.getElementById('meal-checklist');
    if (meals) {
      const types = [
        { key: '早餐', icon: '🌅' },
        { key: '午餐', icon: '☀️' },
        { key: '晚餐', icon: '🌙' },
        { key: '加餐', icon: '🍎' },
      ];
      meals.innerHTML = types.map(t => {
        const done = d.meals.includes(t.key);
        return `<button type="button" class="meal-btn ${done ? 'done' : ''}" data-check-meal="${t.key}">
          ${t.icon} ${t.key} ${done ? '✓' : ''}
        </button>`;
      }).join('');
    }
  },

  checkMeal(type) {
    const d = this.today();
    if (d.meals.includes(type)) {
      d.meals = d.meals.filter(m => m !== type);
      d.calories = Math.max(0, d.calories - 300);
      d.protein = Math.max(0, d.protein - 15);
    } else {
      d.meals.push(type);
      d.calories += { 早餐: 350, 午餐: 500, 晚餐: 400, 加餐: 200 }[type] || 300;
      d.protein += { 早餐: 15, 午餐: 30, 晚餐: 20, 加餐: 8 }[type] || 15;
    }
    this.save();
    this.renderHome();
  },

  addWater(ml) {
    this.today().water = Math.min(DAILY_GOALS.water, this.today().water + ml);
    this.save();
    this.renderHome();
  },

  completeDailyCheckin() {
    const d = this.today();
    if (d.meals.length < 2) {
      alert('请至少打卡两餐后再完成今日打卡');
      return;
    }
    if (!d.checked) {
      d.checked = true;
      this.data.totalCheckins++;
      this.data.streak++;
      this.save();
      alert('🎉 今日饮食打卡成功！');
    }
    this.renderHome();
  },

  renderFoods() {
    const grid = document.getElementById('food-rec-grid');
    if (!grid) return;
    grid.innerHTML = RECOMMEND_FOODS.map((f, i) => `
      <article class="rec-card">
        <img src="${f.img}" alt="${f.name}" loading="lazy">
        <div class="rec-body">
          <span class="tag">${f.tag}</span>
          <h3>${f.name}</h3>
          <p class="cal">${f.cal} 千卡</p>
          <p class="tip">${f.tip}</p>
          <button type="button" class="btn-sm" data-add-rec="${i}">+ 加入今日记录</button>
        </div>
      </article>`).join('');
  },

  addFromRecommend(idx) {
    const f = RECOMMEND_FOODS[idx];
    const d = this.today();
    d.calories = Math.min(DAILY_GOALS.calories + 500, d.calories + f.cal);
    d.protein += 12;
    if (!d.meals.includes(f.tag) && ['早餐','午餐','晚餐','加餐'].includes(f.tag)) {
      d.meals.push(f.tag);
    }
    this.save();
    alert(`已添加「${f.name}」到今日记录`);
    this.renderHome();
    this.go('home');
  },

  renderProfile() {
    const d = this.today();
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('pf-name', this.user);
    set('pf-streak', this.data.streak + ' 天');
    set('pf-total', this.data.totalCheckins + ' 次');
    set('pf-today-meals', d.meals.join('、') || '暂无');
    set('pf-today-cal', d.calories + ' 千卡');
  },

  renderInteract() {
    const feed = document.getElementById('feed-list');
    const all = [
      ...this.data.myPosts.map((p, i) => ({ ...p, id: 'm' + i })),
      ...FEED_POSTS.map((p, i) => ({ ...p, id: 'f' + i })),
    ];
    if (feed) {
      feed.innerHTML = all.map(p => {
        const liked = this.data.likedPosts.includes(p.id);
        return `<article class="feed-card">
          <div class="feed-head"><span class="av">${p.avatar}</span><strong>${p.user}</strong><span class="time">${p.time || '刚刚'}</span></div>
          <p>${p.text}</p>
          <button type="button" class="like-btn ${liked ? 'liked' : ''}" data-like-id="${p.id}">❤ ${p.likes + (liked ? 1 : 0)}</button>
        </article>`;
      }).join('');
    }
  },

  toggleLike(id) {
    const i = this.data.likedPosts.indexOf(id);
    if (i >= 0) this.data.likedPosts.splice(i, 1);
    else this.data.likedPosts.push(id);
    this.save();
    this.renderInteract();
  },

  submitPost() {
    const input = document.getElementById('post-input');
    const text = input?.value.trim();
    if (!text) return;
    this.data.myPosts.unshift({
      user: this.user, avatar: '😊', text, likes: 0, time: '刚刚',
    });
    input.value = '';
    this.save();
    this.renderInteract();
  },

  renderShare() {
    const el = document.getElementById('share-cards');
    const d = this.today();
    if (!el) return;
    el.innerHTML = SHARE_TEMPLATES.map((t, i) => `
      <div class="share-card">
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <p class="share-data">今日：${d.calories}千卡 · 饮水${d.water}ml · ${d.meals.length}餐</p>
        <button type="button" class="btn" data-share="${i}">复制分享文案</button>
      </div>`).join('');
  },

  doShare(idx) {
    const d = this.today();
    const t = SHARE_TEMPLATES[idx];
    const text = `【每日饮食打卡】${t.title}\n${t.desc}\n📊 今日摄入 ${d.calories} 千卡 | 饮水 ${d.water}ml | 打卡 ${d.meals.length} 餐\n🔗 ${location.href}`;
    navigator.clipboard?.writeText(text).then(() => alert('分享文案已复制到剪贴板！')).catch(() => {
      prompt('复制以下文案分享：', text);
    });
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
