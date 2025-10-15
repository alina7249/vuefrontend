<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="navbar-content">
        <!-- Logo区域 -->
        <div class="navbar-logo">
          <div class="logo-icon">📷</div>
          <h1 class="logo-text">摄影交流平台</h1>
        </div>
        
        <!-- 功能入口 -->
        <nav class="navbar-nav">
          <a href="/" class="nav-link active">首页</a>
          <a href="/discover" class="nav-link">发现</a>
          <a href="/activities" class="nav-link">活动</a>
          <a href="/tutorials" class="nav-link">教程</a>
          <a href="/equipment" class="nav-link">器材</a>
        </nav>
        
        <!-- 用户操作区 -->
        <div class="navbar-actions">
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
            <span class="btn-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          </button>
          <button class="upload-btn">
            <span class="btn-icon">📤</span>
            <span class="btn-text">上传作品</span>
          </button>
          <div class="user-avatar" @click="toggleUserMenu">
            <img src="https://picsum.photos/seed/user/40/40" alt="用户头像" />
            <div class="online-indicator"></div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 左侧分类导航栏 -->
    <aside class="category-sidebar">
      <!-- 分类列表 -->
      <nav class="category-list">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <span class="category-name">
            {{ category.name }}
            <span v-if="category.isNew" class="new-badge">NEW</span>
          </span>
        </div>
      </nav>
      
      <!-- 底部个人快捷入口 -->
      <div class="personal-shortcuts">
        <div class="shortcut-item" v-for="shortcut in personalShortcuts" :key="shortcut.id">
          <div class="shortcut-icon">{{ shortcut.icon }}</div>
          <span class="shortcut-name">{{ shortcut.name }}</span>
          <span class="shortcut-arrow">→</span>
        </div>
        <!-- 设备多标签筛选示例 -->
        <div class="shortcut-item" @click="toggleEquipmentTag('Canon')">
          <div class="shortcut-icon">🎯</div>
          <span class="shortcut-name">Canon</span>
          <span class="shortcut-arrow" v-if="equipmentTags.includes('Canon')">✔</span>
        </div>
        <div class="shortcut-item" @click="toggleEquipmentTag('Sony')">
          <div class="shortcut-icon">🎯</div>
          <span class="shortcut-name">Sony</span>
          <span class="shortcut-arrow" v-if="equipmentTags.includes('Sony')">✔</span>
        </div>
        <div class="shortcut-item" @click="toggleEquipmentTag('24-70')">
          <div class="shortcut-icon">🔭</div>
          <span class="shortcut-name">24-70</span>
          <span class="shortcut-arrow" v-if="equipmentTags.includes('24-70')">✔</span>
        </div>
      </div>
    </aside>
    
    <!-- 右侧内容区 -->
    <main class="content-area">
      <!-- 顶部筛选栏 -->
      <div class="filter-sort-bar">
        <!-- 筛选工具栏 - 左侧下拉框 -->
        <div class="filter-dropdown-container">
          <select class="filter-dropdown" v-model="currentSort" @change="loadWorks">
            <option value="all">全部作品</option>
            <option value="latest">最新上传</option>
            <option value="popular">热门推荐</option>
            <option value="likes">高赞作品</option>
          </select>
        </div>
        
        <!-- 右侧搜索框 -->
        <div class="search-container">
          <input 
            type="text" 
            class="search-input"
            placeholder="搜索作品名、作者名..."
            v-model="searchQuery"
            @focus="showSearchSuggestions = true"
            @blur="setTimeout(() => showSearchSuggestions = false, 200)"
          />
          <div class="search-shortcut">Ctrl+K</div>
        </div>
        
      </div>
      
      <!-- 加载中状态 -->
      <div v-if="isLoading && worksData.length === 0" class="loading-container">
        <div v-for="i in 9" :key="i" class="skeleton-card">
          <div class="image-placeholder">
            <div class="placeholder-animation"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="worksData.length === 0" class="empty-state">
        <div class="empty-icon">📷</div>
        <p class="empty-text">暂无相关作品，换个分类试试吧～</p>
        <button class="back-to-categories" @click="selectCategory('all')">返回分类</button>
      </div>
      
      <!-- 作品网格布局 - 弹性布局，响应式适配，3:2比例 -->
      <div v-else class="grid-layout">
        <div 
          v-for="work in worksData" 
          :key="work.id"
          class="work-card gallery-item" 
          :data-id="work.id"
          @click="router.push('/photo/' + work.id)"
        >
          <!-- 作品图片 -->
          <div class="work-image-container">
            <!-- 图片加载占位符 -->
            <div v-if="!work.loaded" class="image-placeholder">
              <div class="placeholder-animation"></div>
            </div>
            <!-- 图片 - 使用懒加载 -->
            <img 
              :src="work.imageUrl" 
              :alt="work.title"
              class="work-image"
              v-if="work.loaded"
              loading="lazy"
              @load="handleImageLoad"
              @error="handleImageError"
            />
          </div>
          <!-- 底部信息展示 -->
          <div class="card-footer">
            <div class="author-info">
              <img :src="work.authorAvatar" alt="作者头像" class="author-avatar">
              <span class="author-name">{{ work.author }}</span>
            </div>
            <div class="stats-info" @click="(event) => handleLike(event, work.id)">
              <span class="like-icon">❤</span>
              <span class="likes-count">{{ work.likes }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="worksData.length > 0 && hasMore && isLoadingMore" class="loading-more">
        <div class="loading-spinner"></div>
        <span>加载更多作品...</span>
      </div>
      
      <!-- 没有更多内容提示 -->
      <div v-if="worksData.length > 0 && !hasMore && !isLoadingMore" class="no-more-content">
        <span>🎉 已加载全部作品</span>
      </div>
      

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 状态管理
const activeCategory = ref('all');
const worksData = ref([]);
const isLoading = ref(true);
const hasMore = ref(true);
const previewWork = ref(null);
const currentSort = ref('all');
const cameraFilter = ref('');
const lensFilter = ref('');
const equipmentTags = ref([]); // 侧边栏多选标签


const paramFilters = ref({ aperture: '', shutter: '', iso: '' });
const searchQuery = ref('');
const showSearchSuggestions = ref(false);
const searchSuggestions = ref([]);
const showUserMenu = ref(false);
const currentPage = ref(1);
const isLoadingMore = ref(false);
const isDarkMode = ref(true);
// 注释掉重复声明的 commentText，下方已有相同变量声明
// const commentText = ref('');

// 分类数据
const categories = ref([
  { id: 'all', name: '全部作品', icon: '🏠', isNew: false },
  { id: 'portrait', name: '人像摄影', icon: '👤', isNew: false },
  { id: 'landscape', name: '风光摄影', icon: '🏔️', isNew: false },
  { id: 'documentary', name: '纪实摄影', icon: '📷', isNew: false },
  { id: 'street', name: '街拍摄影', icon: '🚶', isNew: false },
  { id: 'nature', name: '生态摄影', icon: '🌿', isNew: false },
  { id: 'architecture', name: '建筑摄影', icon: '🏢', isNew: false },
  { id: 'review', name: '器材评测', icon: '📏', isNew: false },
  { id: 'tutorial', name: '后期教程', icon: '✏️', isNew: false },
  { id: 'ai', name: 'AI摄影', icon: '🤖', isNew: true }
]);

// 个人快捷入口
const personalShortcuts = ref([
  { id: 'collections', name: '我的收藏', icon: '❤️' },
  { id: 'works', name: '我的作品', icon: '🖼️' },
  { id: 'create', name: '创作中心', icon: '🎨' }
]);

// 排序选项
const sortOptions = ref([
  { id: 'recommend', name: '推荐' },
  { id: 'latest', name: '最新发布' },
  { id: 'popular', name: '热门点赞' },
  { id: 'editor', name: '编辑推荐' },
  { id: 'following', name: '关注作者' }
]);

// 生成模拟数据
const generateMockData = () => {
  const categoryNames = ['人像摄影', '风光摄影', '纪实摄影', '街拍摄影', '生态摄影', '建筑摄影', '器材评测', '后期教程', 'AI摄影'];
  const cameraModels = ['佳能 EOS R5', '索尼 A7R IV', '尼康 Z7 II', '富士 GFX 100S'];
  const lensModels = ['24-70mm f/2.8', '70-200mm f/2.8', '35mm f/1.4', '85mm f/1.4', '16-35mm f/2.8'];
  const locations = ['北京故宫', '上海外滩', '杭州西湖', '成都锦里', '西安兵马俑', '三亚亚龙湾'];
  const titles = [
    '城市夜景', '山间云雾', '人物肖像', '街头瞬间', '自然生态',
    '建筑之美', '光影交错', '季节变换', '旅途风光', '人文纪实'
  ];
  const authors = [
    '摄影师小明', '光影猎人', '城市记录者', '自然探索家', '人文摄影师',
    '风景大师', '人像专家', '街拍达人', '后期高手', '器材评测师'
  ];
  const commentTexts = [
    '这张照片拍得真不错！构图和光线都很到位，学习了。',
    '色彩搭配很和谐，请问是用什么后期软件处理的？',
    '这个角度选得很好，捕捉到了难得的瞬间。',
    '景深控制得很棒，主体突出，背景虚化自然。',
    '构图很有创意，有故事感。',
    '请问这是在哪里拍的？景色太美了！',
    '光效很特别，是自然光还是人工光？',
    '后期处理得很自然，没有过度的感觉。'
  ];
  const commentAuthors = [
    '摄影爱好者A', '新手求带', '光影追随者', '器材党', '风景控',
    '人像爱好者', '街拍控', '后期大神'
  ];
  
  const data = [];
  
  for (let i = 1; i <= 20; i++) {
    const categoryIndex = Math.floor(Math.random() * categoryNames.length);
    const categoryId = categories.value.findIndex(cat => cat.name === categoryNames[categoryIndex]);
    const authorIndex = Math.floor(Math.random() * authors.length);
    
    // 生成随机评论数
    const commentCount = Math.floor(Math.random() * 200);
    // 创建评论列表
    const commentList = [];
    
    // 为每个作品生成一些模拟评论
    const numComments = Math.min(Math.floor(Math.random() * 5) + 1, 8); // 每个作品1-5条评论
    for (let j = 0; j < numComments; j++) {
      const commentAuthorIndex = Math.floor(Math.random() * commentAuthors.length);
      const commentTextIndex = Math.floor(Math.random() * commentTexts.length);
      const hoursAgo = Math.floor(Math.random() * 72) + 1; // 评论时间1-72小时前
      
      commentList.push({
        id: Date.now() + j,
        author: commentAuthors[commentAuthorIndex],
        avatar: `https://picsum.photos/seed/comment${commentAuthorIndex}/40/40`,
        content: commentTexts[commentTextIndex],
        time: hoursAgo === 1 ? '1小时前' : `${hoursAgo}小时前`
      });
    }
    
    data.push({
      id: i,
      title: `${titles[Math.floor(Math.random() * titles.length)]} ${i}`,
      imageUrl: `https://picsum.photos/seed/${i}/800/1000`,
      imageWidth: 800,
      imageHeight: 1000 + Math.floor(Math.random() * 400),
      author: authors[authorIndex],
      authorAvatar: `https://picsum.photos/seed/avatar${authorIndex}/100/100`,
      authorVerified: authorIndex < 5,
      verificationText: ['资深摄影师', '官方认证', '人气创作者', '技术顾问', '教程讲师'][authorIndex % 5],
      likes: Math.floor(Math.random() * 1000),
      comments: commentCount,
      collections: Math.floor(Math.random() * 300),
      camera: cameraModels[Math.floor(Math.random() * cameraModels.length)],
      lens: lensModels[Math.floor(Math.random() * lensModels.length)],
      aperture: `f/${(Math.random() * 3 + 1.4).toFixed(1)}`,
      shutterSpeed: `1/${Math.floor(Math.random() * 1000) + 1}s`,
      iso: Math.floor(Math.random() * 1600) + 100,
      focalLength: `${Math.floor(Math.random() * 200) + 14}mm`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      category: categoryNames[categoryIndex],
      categoryId: categoryId > 0 ? categories.value[categoryId].id : 'all',
      height: 300 + Math.floor(Math.random() * 200),
      liked: false,
      collected: false,
      loaded: false,
      progress: 0,
      commentList: commentList,
      isFollowing: false // 默认未关注
    });
  }
  
  return data;
};

// 处理关注/取消关注
const handleFollow = () => {
  if (previewWork.value) {
    previewWork.value.isFollowing = !previewWork.value.isFollowing;
    // 这里可以添加关注状态的持久化逻辑或API调用
  }
};

// 加载作品数据
const loadWorks = async () => {
  isLoading.value = true;
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = generateMockData();
    
    // 根据分类、筛选条件和排序方式过滤和排序数据
    let filteredData = data;
    
    if (activeCategory.value !== 'all') {
      filteredData = filteredData.filter(work => work.categoryId === activeCategory.value);
    }
    
    if (cameraFilter.value) {
      filteredData = filteredData.filter(work => work.camera.toLowerCase().includes(cameraFilter.value));
    }
    
    if (lensFilter.value) {
      filteredData = filteredData.filter(work => {
        const focalLength = parseInt(work.focalLength);
        if (lensFilter.value === 'wide') return focalLength < 35;
        if (lensFilter.value === 'standard') return focalLength >= 35 && focalLength <= 70;
        if (lensFilter.value === 'telephoto') return focalLength > 70 && focalLength < 300;
        if (lensFilter.value === 'macro') return work.lens.toLowerCase().includes('macro');
        return true;
      });
    }

    // 设备多标签组合筛选（品牌/焦段/配件）
    if (equipmentTags.value.length > 0) {
      filteredData = filteredData.filter(work => {
        return equipmentTags.value.every(tag => {
          const t = tag.toLowerCase();
          return work.camera.toLowerCase().includes(t) || work.lens.toLowerCase().includes(t);
        });
      });
    }

    // 参数筛选（范围/包含）
    if (paramFilters.value.aperture) {
      const [minA, maxA] = paramFilters.value.aperture.split('-').map(v => parseFloat(v.replace('f/','')));
      filteredData = filteredData.filter(work => {
        const a = parseFloat(String(work.aperture).replace('f/',''));
        return (!minA || a >= minA) && (!maxA || a <= maxA);
      });
    }
    if (paramFilters.value.shutter) {
      // 1/1000s-30s -> 粗略比较：更长时间取倒数
      const [minS, maxS] = paramFilters.value.shutter.split('-');
      const toMs = (s) => {
        if (!s) return null;
        const str = s.toLowerCase().replace('s','');
        if (str.includes('/')) {
          const [n,d] = str.split('/').map(Number);
          return d ? (1 / (d/n)) : null; // 近似比较
        }
        const val = parseFloat(str);
        return isNaN(val) ? null : val;
      };
      const min = toMs(minS);
      const max = toMs(maxS);
      filteredData = filteredData.filter(work => {
        const w = toMs(String(work.shutterSpeed));
        if (w == null) return true;
        return (min == null || w >= min) && (max == null || w <= max);
      });
    }
    if (paramFilters.value.iso) {
      const [minIso, maxIso] = paramFilters.value.iso.split('-').map(v => parseInt(v));
      filteredData = filteredData.filter(work => {
        const iso = parseInt(work.iso);
        return (!minIso || iso >= minIso) && (!maxIso || iso <= maxIso);
      });
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filteredData = filteredData.filter(
        work => work.title.toLowerCase().includes(query) || 
                work.author.toLowerCase().includes(query) || 
                work.category.toLowerCase().includes(query)
      );
    }
    
    // 排序
    switch (currentSort.value) {
      case 'latest':
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'popular':
        filteredData.sort((a, b) => b.likes - a.likes);
        break;
      case 'editor':
        // 模拟编辑推荐：优先展示已认证作者且点赞靠前
        filteredData.sort((a, b) => (b.authorVerified - a.authorVerified) || (b.likes - a.likes));
        break;
      case 'following':
        // 模拟关注作者的排序
        filteredData.sort((a, b) => b.authorVerified - a.authorVerified);
        break;
      default: // recommend
        // 保持原有顺序
        break;
    }
    
    worksData.value = filteredData;
    hasMore.value = filteredData.length >= 15;
    
    // 模拟图片加载进度
    simulateImageLoading();
  } catch (error) {
    console.error('加载作品失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 模拟图片加载进度
const simulateImageLoading = () => {
  worksData.value.forEach(work => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        work.loaded = true;
        clearInterval(interval);
      }
      work.progress = progress;
    }, 200);
  });
};

// 处理图片加载
const handleImageLoad = (event) => {
  const img = event.target;
  const idAttr = img.closest('.work-card')?.getAttribute('data-id');
  const workId = idAttr ? parseInt(idAttr) : NaN;
  const work = worksData.value.find(w => w.id === workId);
  if (work) {
    work.loaded = true;
    work.progress = 100;
  }
};





// 处理图片加载错误
const handleImageError = (event) => {
  const img = event.target;
  img.src = 'https://picsum.photos/seed/default/800/1000';
};

// 选择分类
const selectCategory = (categoryId) => {
  activeCategory.value = categoryId;
  loadWorks();
};

// 侧边栏多标签切换
const toggleEquipmentTag = (tag) => {
  const idx = equipmentTags.value.indexOf(tag);
  if (idx >= 0) equipmentTags.value.splice(idx, 1);
  else equipmentTags.value.push(tag);
  loadWorks();
};

// 处理排序变化
const handleSortChange = (sortId) => {
  currentSort.value = sortId;
  loadWorks();
};

// 处理搜索建议点击
const handleSuggestionClick = (text) => {
  searchQuery.value = text;
  showSearchSuggestions.value = false;
  loadWorks();
};

// 导航预览功能保留 - 支持左右箭头切换
const navigatePreview = (direction) => {
  if (!previewWork.value) return;
  
  const currentIndex = worksData.value.findIndex(w => w.id === previewWork.value.id);
  let newIndex;
  
  if (direction === 'prev') {
    newIndex = currentIndex > 0 ? currentIndex - 1 : worksData.value.length - 1;
  } else {
    newIndex = currentIndex < worksData.value.length - 1 ? currentIndex + 1 : 0;
  }
  
  // 使用新的作品数据更新预览
  previewWork.value = worksData.value[newIndex];
};

// 处理点赞按钮点击
const handleLike = (event, workId) => {
  event.stopPropagation(); // 防止触发卡片点击
  
  const workIndex = worksData.value.findIndex(w => w.id === workId);
  if (workIndex !== -1) {
    worksData.value[workIndex].likes += 1;
    
    // 更新模态框中的点赞数
    const modalLikeCount = document.getElementById('modal-like-count');
    if (modalLikeCount) {
      modalLikeCount.textContent = worksData.value[workIndex].likes;
    }
    
    // 更新按钮样式
    if (event.target.closest('.like-btn')) {
      const likeBtn = event.target.closest('.like-btn');
      likeBtn.classList.add('text-red-500');
    }
  }
};

// 处理评论
const handleComment = (workId) => {
  const work = worksData.value.find(w => w.id === workId);
  if (work) {
    work.comments += 1;
  }
};

// 处理收藏
const handleCollect = (workId) => {
  // 仍保留给其他入口使用，但 hover 菜单为主
  const work = worksData.value.find(w => w.id === workId);
  if (work && !work.collected) {
    work.collected = true;
    work.collections += 1;
  }
};

// 预览相关交互已替换为卡片 hover 层中的交互

// 处理分享
const handleShare = () => {
  // 保留占位
  alert('分享功能已触发！');
};

// 分享到平台（带预览图）
const handleShareWithPreview = (workId) => {
  const work = worksData.value.find(w => w.id === workId);
  if (!work) return;
  const url = encodeURIComponent(window.location.origin + '/?work=' + workId);
  const title = encodeURIComponent(work.title);
  const pic = encodeURIComponent(work.imageUrl);
  // 示例：微博、QQ空间（图虫/微信通常需服务端生成卡片或微信JSSDK）
  const weibo = `https://service.weibo.com/share/share.php?title=${title}&url=${url}&pic=${pic}`;
  window.open(weibo, '_blank');
};

// 收藏菜单
const collectMenuFor = ref(null);
const toggleCollectMenu = (workId) => {
  collectMenuFor.value = collectMenuFor.value === workId ? null : workId;
};
const confirmCollect = (workId, folder) => {
  const work = worksData.value.find(w => w.id === workId);
  if (!work) return;
  if (!work.collected) work.collections += 1;
  work.collected = true;
  collectMenuFor.value = null;
};

// 富文本评论（简易）
const commentFor = ref(null);
const commentText = ref('');
const focusComment = (workId) => { commentFor.value = workId; };
const insertEmoji = (emoji) => { commentText.value += ` ${emoji} `; };
const attachImage = (evt) => {
  const file = evt.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  commentText.value += ` [图片](${url}) `;
};
const submitComment = (workId) => {
  const work = worksData.value.find(w => w.id === workId);
  if (!work || !commentText.value.trim()) return;
  
  // 更新作品评论数
  work.comments += 1;
  
  // 如果previewWork存在且ID匹配，添加评论到previewWork.commentList
  if (previewWork.value && previewWork.value.id === workId) {
    // 初始化commentList（如果不存在）
    if (!previewWork.value.commentList) {
      previewWork.value.commentList = [];
    }
    
    // 创建新评论对象
    const newComment = {
      id: Date.now(), // 使用时间戳作为临时ID
      author: "我", // 模拟当前用户
      avatar: "https://picsum.photos/seed/user/40/40", // 模拟当前用户头像
      content: commentText.value.trim(),
      time: "刚刚" // 初始显示为"刚刚"
    };
    
    // 将新评论添加到列表开头（倒序排列）
    previewWork.value.commentList.unshift(newComment);
    
    // 更新previewWork的评论数
    previewWork.value.comments = work.comments;
  }
  
  // 清空评论输入框
  commentText.value = '';
  commentFor.value = null;
};

// 预览导航功能保留 - 支持左右箭头切换

// 处理AI推荐
const handleAIRecommendation = () => {
  const popularCategories = categories.value.filter(cat => cat.id !== 'all').slice(0, 5);
  const randomCategory = popularCategories[Math.floor(Math.random() * popularCategories.length)];
  selectCategory(randomCategory.id);
};

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// 无限滚动加载更多
const loadMoreWorks = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  
  isLoadingMore.value = true;
  currentPage.value += 1;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 生成更多数据
    const newData = generateMockData().map(work => ({
      ...work,
      id: work.id + (currentPage.value - 1) * 20
    }));
    
    worksData.value = [...worksData.value, ...newData];
    hasMore.value = newData.length >= 20;
    
    // 模拟图片加载进度
    newData.forEach(work => {
      simulateImageLoadingProgress(work);
    });
  } catch (error) {
    console.error('加载更多失败:', error);
  } finally {
    isLoadingMore.value = false;
  }
};

// 模拟单个图片加载进度
const simulateImageLoadingProgress = (work) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      work.loaded = true;
      clearInterval(interval);
    }
    work.progress = progress;
  }, 200);
};

// 滚动监听
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // 当滚动到距离底部200px时加载更多
  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadMoreWorks();
  }
};

// 键盘快捷键处理
const handleKeydown = (event) => {
  // ESC键关闭预览
  if (event.key === 'Escape' && previewWork.value) {
    closePreview();
  }
  
  // 左右箭头键切换预览
  if (event.key === 'ArrowLeft' && previewWork.value) {
    navigatePreview('prev');
  }
  if (event.key === 'ArrowRight' && previewWork.value) {
    navigatePreview('next');
  }
  
  // Ctrl+K 聚焦搜索框
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // 数字键快速切换分类
  if (event.key >= '1' && event.key <= '9') {
    const categoryIndex = parseInt(event.key) - 1;
    if (categories.value[categoryIndex]) {
      selectCategory(categories.value[categoryIndex].id);
    }
  }
};

// 组件挂载时添加键盘监听
onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme') || 'dark';
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  loadWorks();
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
  
  // 添加键盘监听
  document.addEventListener('keydown', handleKeydown);
  
  // 模拟搜索建议
  const suggestionTexts = [
    '日出摄影技巧', '城市夜景拍摄', '人像摄影布光',
    '风光摄影构图', '街头摄影', '索尼 A7R IV 评测',
    '后期修图教程', 'AI 生成艺术'
  ];
  
  searchSuggestions.value = suggestionTexts.map((text, index) => ({
    id: index + 1,
    text
  }));
});

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* 主题色定义（PC端） */
:root {
  --pc-bg: #FFFFFF; /* 白色背景 */
  --pc-nav: #2D3A4B; /* 顶部深灰蓝 */
  --pc-nav-hover: #3A4A5F; /* hover 微亮 */
  --pc-sidebar: #F8FAFC; /* 侧边栏浅灰 */
  --pc-text: #2D3A4B; /* 主文字 */
  --pc-muted: #64748B; /* 次文本 */
  --pc-primary: #4A90E2; /* 主色 蓝 */
  --pc-accent: #E8B04C; /* 暖金 强调 */
  --pc-white: #FFFFFF;
  --pc-shadow: 0 3px 12px rgba(0,0,0,0.05);
  
  /* 统一全局样式变量 */
  --primary-color: var(--pc-primary);
  --secondary-color: #7C3AED;
  --text-primary: var(--pc-text);
  --text-secondary: var(--pc-muted);
  --text-tertiary: #94A3B8;
  --bg-primary: var(--pc-bg);
  --bg-secondary: #F1F5F9;
  --bg-tertiary: #E2E8F0;
  --border-color: #E2E8F0;
  --hover-bg: #F1F5F9;
}

/* 浅色主题 - 保持简洁，无特效 */
[data-theme="light"] {
  --text-primary: var(--pc-text);
  --text-secondary: var(--pc-muted);
  --text-tertiary: #94A3B8;
  --bg-primary: var(--pc-bg);
  --bg-secondary: #F1F5F9;
  --bg-tertiary: #E2E8F0;
  --border-color: #E2E8F0;
  --hover-bg: #F1F5F9;
}

/* 整体布局 */
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--pc-bg);
  position: relative;
  overflow-x: hidden;
}

/* 顶部导航栏 */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--pc-nav);
  color: var(--pc-white);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  z-index: 200;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  font-size: 32px;
}

.navbar-logo .logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;
}

.navbar-logo:hover .logo-text {
  color: var(--primary-color);
}

.navbar-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--pc-white);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--pc-white);
  background: var(--pc-nav-hover);
}

.nav-link.active {
  color: var(--pc-accent);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--pc-accent);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #8B5CF6;
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.2);
  transform: translateY(-1px);
}

.theme-toggle-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 8px;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

.theme-toggle-btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.user-avatar {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-avatar img {
  width: 40px;
  height: 40px;
  display: block;
}

.online-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #10B981;
    border: 2px solid var(--bg-primary);
    border-radius: 50%;
  }

/* 左侧分类导航栏 */
.category-sidebar {
  width: 240px;
  background: var(--pc-sidebar);
  border-right: 1px solid #e1e7ef;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  z-index: 100;
  box-sizing: border-box;
  border-radius: 0 12px 12px 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
}


/* 分类列表 */
.category-list {
  padding: 16px 8px;
  flex: 1;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 6px;
  position: relative;
  transition: all 0.2s ease;
  color: var(--pc-muted);
}

.category-item:hover {
  background: #fff;
  transform: translateX(3px) scale(1.02);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.category-item:hover .category-icon,
.category-item:hover .category-name {
  color: var(--pc-primary);
}

.category-item.active {
  background: var(--pc-primary);
  padding-left: 16px;
  color: var(--pc-white);
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(74, 144, 226, 0.25);
  transform: translateX(3px);
}

.category-item.active .category-icon,
.category-item.active .category-name {
  color: var(--pc-white);
}

/* 分类图标 */
.category-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a869a;
  transition: all 0.2s ease;
}

/* 分类名称 */
.category-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--pc-text);
  transition: all 0.2s ease;
  position: relative;
}

/* NEW标识 */
.new-badge {
  position: absolute;
  top: -8px;
  right: -30px;
  background: rgba(124, 58, 237, 0.2);
  color: var(--secondary-color);
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

/* 个人快捷入口 */
.personal-shortcuts {
  padding: 20px 12px 0;
  border-top: 1px solid #e1e7ef;
  margin-top: auto;
}

.shortcut-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.shortcut-item:hover {
  background: #fff;
  transform: scale(1.02);
  box-shadow: var(--pc-shadow);
}

.shortcut-item:hover .shortcut-icon,
.shortcut-item:hover .shortcut-name {
  color: var(--text-primary);
}

.shortcut-item:hover .shortcut-arrow {
  opacity: 1;
  right: 16px;
}

/* 快捷入口图标 */
.shortcut-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
  transform: scale(0.85);
}

/* 快捷入口名称 */
.shortcut-name {
  font-size: 13px;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}

/* 快捷入口箭头 */
.shortcut-arrow {
  position: absolute;
  right: 20px;
  font-size: 12px;
  color: var(--text-tertiary);
  opacity: 0;
  transition: all 0.2s ease;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  margin-left: 240px;
  margin-top: 80px;
  padding: 24px;
  background: transparent;
  position: relative;
  z-index: 3;
}

/* 顶部筛选栏 */
.filter-sort-bar {
  background-color: #fff;
  border: 1px solid #e9edf3;
  border-radius: 10px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: sticky;
  top: 24px;
  z-index: 50;
  box-shadow: var(--pc-shadow);
}

/* 排序选项 */
.sort-options {
  display: flex;
  gap: 8px;
}

.sort-button {
  background: none;
  border: none;
  padding: 8px 16px;
  color: #7a869a;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.sort-button:hover {
  color: var(--pc-primary);
}

.sort-button.active {
  color: var(--pc-primary);
  font-weight: 600;
  transform: scale(1.03);
}

.sort-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: var(--pc-primary);
}

/* 搜索容器 */
.search-container {
  position: relative;
}

.search-input {
  background: #fff;
  border: 1px solid #e9edf3;
  border-radius: 6px;
  padding: 8px 80px 8px 16px;
  color: var(--pc-text);
  font-size: 14px;
  width: 250px;
  transition: all 0.2s ease;
  box-shadow: var(--pc-shadow);
}

.search-input::placeholder {
  color: #98a2b3;
}

.search-input:focus {
  outline: none;
  border-color: var(--pc-primary);
}

.search-shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #98a2b3;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e9edf3;
  pointer-events: none;
}

/* 搜索建议 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e9edf3;
  border-radius: 6px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--pc-shadow);
}

.suggestion-item {
  padding: 10px 16px;
  color: var(--pc-text);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: rgba(74,144,226,0.12);
}

/* 高级筛选 */
.advanced-filter {
  display: flex;
  gap: 12px;
}

.filter-select {
  background: #fff;
  border: 1px solid #e9edf3;
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--pc-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--pc-shadow);
}

.filter-select:hover,
.filter-select:focus {
  outline: none;
  border-color: var(--pc-primary);
}

.filter-select option {
  background-color: #fff;
  color: var(--pc-text);
}

/* 加载容器 */
.loading-container {
  column-count: 3;
  column-gap: 24px;
  margin-bottom: 32px;
}

/* 骨架屏卡片 */
.skeleton-card {
  break-inside: avoid;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--pc-shadow);
}

.skeleton-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background:
    conic-gradient(from 0deg, #2D3A4B 0 10%, transparent 10% 12%, #2D3A4B 12% 22%, transparent 22% 24%, #2D3A4B 24% 34%, transparent 34% 36%, #2D3A4B 36% 46%, transparent 46% 48%, #2D3A4B 48% 58%, transparent 58% 60%, #2D3A4B 60% 70%, transparent 70% 72%, #2D3A4B 72% 82%, transparent 82% 84%, #2D3A4B 84% 94%, transparent 94% 100%)
    , linear-gradient(90deg, #EAEFF5, #F5F8FF, #EAEFF5);
  background-size: 100% 100%, 200% 100%;
  animation: shutter 1.2s ease-in-out infinite, skeleton-loading 1.6s infinite;
  border-radius: 10px;
}

.skeleton-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--pc-primary);
  border-radius: 0 2px 2px 0;
  animation: progress-animation 2s infinite;
}

.loading-text {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--text-tertiary);
  transition: transform 0.5s ease;
}

.empty-icon:hover {
  transform: rotate(10deg);
}

.empty-text {
  font-size: 16px;
  color: var(--text-tertiary);
  margin-bottom: 24px;
}

.back-to-categories {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-to-categories:hover {
  background-color: #0ea5e9;
  transform: translateY(-1px);
}

.ai-recommend {
  background-color: rgba(56, 189, 248, 0.1);
  color: var(--primary-color);
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.ai-recommend:hover {
  background-color: rgba(56, 189, 248, 0.2);
  transform: translateY(-1px);
}

/* 作品网格布局 - 弹性布局，响应式适配 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 作品卡片 */
.work-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 卡片hover效果 */
.work-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* 作品图片容器 - 3:2 比例 */
.work-image-container {
  width: 100%;
  height: 0;
  padding-bottom: 66.67%; /* 3:2 宽高比 */
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.work-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  border-radius: 8px 8px 0 0;
}

/* 图片hover放大效果 */
.work-card:hover .work-image {
  transform: scale(1.05);
}

/* 卡片底部信息 */
.card-footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.author-name {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-info {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.stats-info:hover {
  color: #e74c3c;
}

.like-icon {
  font-size: 16px;
}

/* 点赞信息 */
.likes-info {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 13px;
}

.like-icon {
  margin-right: 4px;
  font-size: 15px;
  color: #ff4757;
}

.likes-count {
  font-weight: 500;
}

/* 图片加载占位符 - 骨架屏动画 */
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%, #e2e8f0 100%);
  background-size: 20px 20px;
  animation: shimmer 1.5s infinite linear;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 8px 8px 0 0;
}

@keyframes shimmer {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}

/* 加载动画 */
.placeholder-animation {
  width: 40px;
  height: 40px;
  border: 3px solid #ddd;
  border-top-color: #0077ff;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 图片加载进度条 */
.image-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.progress-bar {
  height: 100%;
  background-color: var(--pc-primary);
  transition: width 0.3s ease;
}

/* 作者信息 */
.author-info {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--pc-primary);
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 14px;
  color: var(--pc-text);
  font-weight: 500;
}

.post-time {
  font-size: 12px;
  color: #98a2b3;
}

.verification-badge {
  background: rgba(232, 176, 76, 0.2);
  color: var(--pc-accent);
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: 500;
}

/* 作品信息 */
.work-info {
  padding: 0 16px 12px;
}

.category-tag {
  background: rgba(74, 144, 226, 0.12);
  color: var(--pc-primary);
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.work-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--pc-text);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-location {
  font-size: 12px;
  color: #98a2b3;
}

/* 互动按钮 */
.interaction-buttons {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
}

.interaction-btn {
  background: none;
  border: none;
  color: #98a2b3;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.interaction-btn:hover {
  background: #F5F8FF;
  color: var(--pc-primary);
  transform: scale(1.2);
}

.interaction-btn.active {
  color: var(--pc-primary);
}

.interaction-btn.like-btn.active {
  color: #0D6EFD;
}

.interaction-btn.collect-btn.active {
  color: var(--secondary-color);
}

.btn-icon {
  font-size: 16px;
}

.btn-count {
  font-size: 12px;
}

/* 加载更多 */
.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--pc-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

/* 没有更多内容 */
.no-more-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 作品详情模态框 - 半透明背景和居中显示 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  backdrop-filter: blur(4px); /* 背景模糊效果 */
  z-index: 50;
  padding: 20px;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 评论输入框 */
.comment-input {
  width: 100%;
  min-height: 60px;
  padding: 12px;
  border: 1px solid #e9edf3;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  color: var(--pc-text);
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: var(--pc-primary);
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 动画定义 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* 模态框响应式样式 */
@media (max-width: 768px) {
  .modal {
    padding: 16px;
  }
  
  .modal-content {
    max-width: 100%;
    max-height: calc(100vh - 32px);
    margin: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navbar {
    height: 60px;
  }
  
  .navbar-content {
    padding: 0 16px;
  }
  
  .navbar-logo .logo-text {
    font-size: 18px;
  }
  
  .logo-icon {
    font-size: 24px;
  }
  
  .navbar-nav {
    display: none;
  }
  
  .upload-btn .btn-text {
    display: none;
  }
  
  .upload-btn {
    padding: 8px;
    border-radius: 50%;
  }
  
  .user-avatar img {
    width: 32px;
    height: 32px;
  }
  
  .category-sidebar {
    width: 60px;
    top: 60px;
  }
  
  /* 模态框动画 */
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 确保模态框居中 */
  .modal {
    display: none;
    align-items: center;
    justify-content: center;
  }
  
  .modal.hidden {
    display: none !important;
  }
  
  .category-name,
  .shortcut-name,
  .new-badge,
  .shortcut-arrow {
    display: none;
  }
  
  .category-item,
  .shortcut-item {
    justify-content: center;
    padding: 12px;
  }
  
  .category-icon,
  .shortcut-icon {
    margin-right: 0;
  }
  
  .content-area {
    margin-left: 60px;
    margin-top: 60px;
    padding: 16px;
  }
  
  .filter-sort-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    top: 16px;
  }
  
  .sort-options {
    justify-content: center;
  }
  
  .search-input {
    width: 100%;
  }
  
  .advanced-filter {
    justify-content: center;
  }
  
  /* 网格布局样式 - 移动端适配 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

.work-image {
  height: auto; /* 保持3:2比例 */
  border-radius: 8px 8px 0 0;
}
  
  /* 作品详情模态框移动端适配 */
.modal {
  padding: 12px;
}

.modal-content {
  margin: 0;
  border-radius: 12px;
}
  
  .modal-content h4 {
    font-size: 18px;
  }
}
</style>