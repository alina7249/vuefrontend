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
        <!-- 功能按钮 -->
        <div class="sort-options">
          <button 
            v-for="option in sortOptions" 
            :key="option.id"
            class="sort-button"
            :class="{ active: currentSort === option.id }"
            @click="handleSortChange(option.id)"
          >
            {{ option.name }}
          </button>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <input 
            type="text" 
            class="search-input"
            placeholder="搜索作品、摄影师或标签..."
            v-model="searchQuery"
            @focus="showSearchSuggestions = true"
            @blur="setTimeout(() => showSearchSuggestions = false, 200)"
          />
          <div class="search-shortcut">Ctrl+K</div>
          
          <!-- AI联想提示 -->
          <div v-if="showSearchSuggestions && searchQuery" class="search-suggestions">
            <div 
              v-for="suggestion in searchSuggestions" 
              :key="suggestion.id"
              class="suggestion-item"
              @click="handleSuggestionClick(suggestion.text)"
            >
              {{ suggestion.text }}
            </div>
          </div>
        </div>
        
        <!-- 高级筛选 -->
        <div class="advanced-filter">
          <select class="filter-select" v-model="cameraFilter">
            <option value="">所有相机</option>
            <option value="canon">佳能</option>
            <option value="nikon">尼康</option>
            <option value="sony">索尼</option>
            <option value="fujifilm">富士</option>
          </select>
          
          <select class="filter-select" v-model="lensFilter">
            <option value="">所有焦段</option>
            <option value="wide">广角</option>
            <option value="standard">标准</option>
            <option value="telephoto">长焦</option>
            <option value="macro">微距</option>
          </select>

          <!-- 参数筛选：示例范围输入（简单占位，真实可替换为滑块） -->
          <select class="filter-select" v-model="paramFilters.aperture" @change="loadWorks">
            <option value="">光圈范围</option>
            <option value="f/1.4-f/2.8">f/1.4-f/2.8</option>
            <option value="f/2.8-f/5.6">f/2.8-f/5.6</option>
            <option value="f/5.6-f/11">f/5.6-f/11</option>
            <option value="f/11-f/22">f/11-f/22</option>
          </select>
          <select class="filter-select" v-model="paramFilters.shutter" @change="loadWorks">
            <option value="">快门速度</option>
            <option value="1/1000s-1/250s">1/1000s-1/250s</option>
            <option value="1/250s-1/60s">1/250s-1/60s</option>
            <option value="1/60s-1s">1/60s-1s</option>
            <option value="1s-30s">1s-30s</option>
          </select>
          <select class="filter-select" v-model="paramFilters.iso" @change="loadWorks">
            <option value="">ISO范围</option>
            <option value="100-400">100-400</option>
            <option value="400-1600">400-1600</option>
            <option value="1600-6400">1600-6400</option>
            <option value="6400-12800">6400-12800</option>
          </select>
        </div>
      </div>
      
      <!-- 作品瀑布流 -->
      <div v-if="isLoading && worksData.length === 0" class="loading-container">
        <div v-for="i in 3" :key="i" class="skeleton-card">
          <div class="skeleton-placeholder"></div>
          <div class="skeleton-progress"></div>
          <div class="loading-text">加载中 {{ Math.floor(Math.random() * 40) + 30 }}%</div>
        </div>
      </div>
      
      <div v-else-if="worksData.length === 0" class="empty-state">
        <div class="empty-icon">📷</div>
        <p class="empty-text">暂无相关作品，换个分类试试吧～</p>
        <button class="back-to-categories" @click="selectCategory('all')">返回分类</button>
        <button class="ai-recommend" @click="handleAIRecommendation">AI推荐分类</button>
      </div>
      
      <div v-else class="masonry-grid">
        <div 
          v-for="work in worksData" 
          :key="work.id"
          class="work-card"
          :data-id="work.id"
        >
          <!-- 作品图片 -->
          <div class="work-image-container">
            <img 
              :src="work.imageUrl" 
              :alt="work.title"
              class="work-image"
              @load="handleImageLoad"
              @error="handleImageError"
            />
            <div v-if="!work.loaded" class="image-progress">
              <div class="progress-bar" :style="{ width: work.progress + '%' }"></div>
            </div>
          </div>
          
          <!-- 作者信息 -->
          <div class="author-info">
            <img :src="work.authorAvatar" alt="作者头像" class="author-avatar" />
            <div class="author-details">
              <div class="author-name">{{ work.author }}</div>
              <div class="post-time">{{ work.date }}</div>
            </div>
            <div v-if="work.authorVerified" class="verification-badge">{{ work.verificationText }}</div>
          </div>
          
          <!-- 作品信息 -->
          <div class="work-info">
            <div class="category-tag">{{ work.category }}</div>
            <h3 class="work-title">{{ work.title }}</h3>
            <div class="work-location">{{ work.location }}</div>
          </div>
          
          <!-- 互动按钮（移至 hover 层，底部旧样式删除） -->

          <!-- Hover 白底详情层 -->
          <div class="hover-detail">
            <div class="hover-left">
              <img :src="work.imageUrl.replace('/800/1000','/1200/1600')" :alt="work.title" class="hover-image" />
            </div>
            <div class="hover-right">
              <h3 class="hover-title">{{ work.title }}</h3>
              <div class="hover-author" @click.stop>
                <img :src="work.authorAvatar" alt="作者头像" class="author-avatar" />
                <div class="hover-author-meta">
                  <a class="author-link" href="#" title="进入作者主页">{{ work.author }}</a>
                  <div class="hover-sub">{{ work.date }} · {{ work.location }}</div>
                </div>
              </div>
              <div class="hover-exif">
                <div class="exif-item"><span class="label">相机</span><span class="value">{{ work.camera }}</span></div>
                <div class="exif-item"><span class="label">镜头</span><span class="value">{{ work.lens }}</span></div>
                <div class="exif-item"><span class="label">光圈</span><span class="value">{{ work.aperture }}</span></div>
                <div class="exif-item"><span class="label">快门</span><span class="value">{{ work.shutterSpeed }}</span></div>
                <div class="exif-item"><span class="label">ISO</span><span class="value">{{ work.iso }}</span></div>
                <div class="exif-item"><span class="label">时间/地点</span><span class="value">{{ work.date }} · {{ work.location }}</span></div>
              </div>
              <div class="hover-actions">
                <button class="hover-btn like" :class="{ active: work.liked }" @click.stop="handleLike(work.id)">❤ {{ work.likes }}</button>
                <div class="collect-wrap" @click.stop>
                  <button class="hover-btn collect" :class="{ active: work.collected }" @click="toggleCollectMenu(work.id)">🔖 {{ work.collections }}</button>
                  <div class="collect-menu" v-if="collectMenuFor === work.id">
                    <div class="menu-title">加入个人灵感集</div>
                    <div class="menu-item" @click="confirmCollect(work.id, '我的灵感A')">我的灵感A</div>
                    <div class="menu-item" @click="confirmCollect(work.id, '我的灵感B')">我的灵感B</div>
                    <div class="menu-item" @click="confirmCollect(work.id, '新建灵感集')">+ 新建灵感集</div>
                  </div>
                </div>
                <div class="comment-wrap" @click.stop>
                  <button class="hover-btn comment" @click="focusComment(work.id)">💬 {{ work.comments }}</button>
                </div>
                <div class="share-wrap" @click.stop>
                  <button class="hover-btn share" @click="handleShareWithPreview(work.id)">🔗 分享</button>
                </div>
              </div>
              <div class="hover-comment" v-if="commentFor === work.id" @click.stop>
                <div class="rich-tools">
                  <button class="tool" @click="insertEmoji('😊')">😊</button>
                  <button class="tool" @click="insertEmoji('📷')">📷</button>
                  <label class="tool upload">
                    📎
                    <input type="file" accept="image/*" @change="attachImage($event)" hidden />
                  </label>
                </div>
                <textarea class="rich-input" v-model="commentText" placeholder="发表你的看法，支持表情与图片链接"></textarea>
                <div class="comment-actions">
                  <button class="submit" @click="submitComment(work.id)">发布</button>
                </div>
              </div>
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
      
      <!-- 粒子反馈容器 -->
      <div ref="particlesContainer" class="particles-container"></div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 状态管理
const activeCategory = ref('all');
const worksData = ref([]);
const isLoading = ref(true);
const hasMore = ref(true);
const previewWork = ref(null);
const currentSort = ref('recommend');
const cameraFilter = ref('');
const lensFilter = ref('');
const equipmentTags = ref([]); // 侧边栏多选标签
const paramFilters = ref({ aperture: '', shutter: '', iso: '' });
const searchQuery = ref('');
const showSearchSuggestions = ref(false);
const searchSuggestions = ref([]);
const particlesContainer = ref(null);
const showUserMenu = ref(false);
const currentPage = ref(1);
const isLoadingMore = ref(false);
const isDarkMode = ref(true);
const previewScale = ref(1);
const previewTranslate = ref({ x: 0, y: 0 });
const previewTransformStyle = computed(() => ({
  transform: `scale(${previewScale.value}) translate(${previewTranslate.value.x}px, ${previewTranslate.value.y}px)`,
  transition: 'transform 0.2s ease-out'
}));

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
  
  const data = [];
  
  for (let i = 1; i <= 20; i++) {
    const categoryIndex = Math.floor(Math.random() * categoryNames.length);
    const categoryId = categories.value.findIndex(cat => cat.name === categoryNames[categoryIndex]);
    const authorIndex = Math.floor(Math.random() * authors.length);
    
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
      comments: Math.floor(Math.random() * 200),
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
      progress: 0
    });
  }
  
  return data;
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

// 打开预览
const openPreview = (workId) => {
  const work = worksData.value.find(w => w.id === workId);
  if (work) {
    // 深拷贝作品数据，避免预览状态影响列表状态
    previewWork.value = JSON.parse(JSON.stringify(work));
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    previewScale.value = 1;
    previewTranslate.value = { x: 0, y: 0 };
  }
};

// 关闭预览
const closePreview = () => {
  previewWork.value = null;
  document.body.style.overflow = '';
};

// 导航预览
const navigatePreview = (direction) => {
  if (!previewWork.value) return;
  
  const currentIndex = worksData.value.findIndex(w => w.id === previewWork.value.id);
  let newIndex;
  
  if (direction === 'prev') {
    newIndex = currentIndex > 0 ? currentIndex - 1 : worksData.value.length - 1;
  } else {
    newIndex = currentIndex < worksData.value.length - 1 ? currentIndex + 1 : 0;
  }
  
  previewWork.value = JSON.parse(JSON.stringify(worksData.value[newIndex]));
  // 切换图重置缩放
  previewScale.value = 1;
  previewTranslate.value = { x: 0, y: 0 };
};

// 处理点赞
const handleLike = (workId) => {
  const work = worksData.value.find(w => w.id === workId);
  if (work) {
    work.liked = !work.liked;
    work.likes += work.liked ? 1 : -1;
    createLikeParticles(workId);
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
  if (!work) return;
  if (commentText.value.trim()) {
    work.comments += 1;
    commentText.value = '';
    commentFor.value = null;
  }
};

// 预览缩放与拖拽
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const zoomIn = () => { previewScale.value = clamp(previewScale.value + 0.2, 1, 3); };
const zoomOut = () => { previewScale.value = clamp(previewScale.value - 0.2, 1, 3); };
const resetZoom = () => { previewScale.value = 1; previewTranslate.value = { x: 0, y: 0 }; };
const onPreviewWheel = (e) => {
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  previewScale.value = clamp(previewScale.value + delta, 1, 3);
};

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

// 创建点赞粒子效果
const createLikeParticles = (workId) => {
  if (!particlesContainer.value) return;
  
  const workElement = document.querySelector(`.work-card[data-id="${workId}"] .like-btn`);
  if (!workElement) return;
  
  const rect = workElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 创建3-5个粒子
  const particleCount = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // 设置粒子样式
    const size = Math.random() * 8 + 4;
    const color = '#0D6EFD';
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 20;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.position = 'fixed';
    particle.style.left = `${centerX - size / 2}px`;
    particle.style.top = `${centerY - size / 2}px`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.opacity = '0.7';
    
    particlesContainer.value.appendChild(particle);
    
    // 动画效果
    const startX = centerX - size / 2;
    const startY = centerY - size / 2;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;
    
    let startTime = null;
    const duration = 600;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // 使用ease-out缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentX = startX + (endX - startX) * easeProgress;
      const currentY = startY + (endY - startY) * easeProgress;
      const currentOpacity = 0.7 * (1 - progress);
      
      particle.style.left = `${currentX}px`;
      particle.style.top = `${currentY}px`;
      particle.style.opacity = currentOpacity;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 移除粒子
        if (particlesContainer.value && particle.parentNode) {
          particlesContainer.value.removeChild(particle);
        }
      }
    };
    
    requestAnimationFrame(animate);
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
  --pc-bg: #F5F8FF; /* 浅灰蓝 背景 */
  --pc-nav: #2D3A4B; /* 顶部深灰蓝 */
  --pc-nav-hover: #3A4A5F; /* hover 微亮 */
  --pc-sidebar: #EAEFF5; /* 侧边栏浅灰 */
  --pc-text: #2D3A4B; /* 主文字 */
  --pc-muted: #555; /* 次文本 */
  --pc-primary: #4A90E2; /* 主色 蓝 */
  --pc-accent: #E8B04C; /* 暖金 强调 */
  --pc-white: #FFFFFF;
  --pc-shadow: 0 3px 12px rgba(0,0,0,0.05);
}
/* 全局样式变量 */
:root {
  --primary-color: #38BDF8;
  --secondary-color: #7C3AED;
  --text-primary: #E2E8F0;
  --text-secondary: #CBD5E1;
  --text-tertiary: #94A3B8;
  --bg-gradient: linear-gradient(180deg, #16213E 0%, #2A2F4F 100%);
  --bg-primary: #16213E;
  --bg-secondary: #2A2F4F;
  --bg-tertiary: rgba(255, 255, 255, 0.02);
  --border-color: rgba(56, 189, 248, 0.2);
  --hover-bg: rgba(56, 189, 248, 0.08);
  --glass-bg: rgba(255, 255, 255, 0.02);
  --neon-glow: 0 0 8px rgba(56, 189, 248, 0.3);
}

/* 浅色主题 */
[data-theme="light"] {
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-tertiary: #64748B;
  --bg-gradient: linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%);
  --bg-primary: #F8FAFC;
  --bg-secondary: #E2E8F0;
  --bg-tertiary: rgba(0, 0, 0, 0.02);
  --border-color: rgba(56, 189, 248, 0.3);
  --hover-bg: rgba(56, 189, 248, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.8);
  --neon-glow: 0 0 8px rgba(56, 189, 248, 0.4);
}

/* 整体布局 */
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--pc-bg);
  position: relative;
  overflow-x: hidden;
}

/* 背景粒子动画 */
.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
  animation: float 15s infinite linear;
  pointer-events: none;
  z-index: 1;
}

/* 光带流动效果 */
.app-container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 240px;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%, 
    var(--primary-color) 20%, 
    var(--secondary-color) 50%, 
    var(--primary-color) 80%, 
    transparent 100%
  );
  opacity: 0.3;
  animation: flow 8s infinite linear;
  pointer-events: none;
  z-index: 2;
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
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.3));
}

.navbar-logo .logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: var(--neon-glow);
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;
}

.navbar-logo:hover .logo-text {
  color: var(--primary-color);
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
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
  background: var(--glass-bg);
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
  box-shadow: var(--neon-glow);
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
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
  animation: pulse 2s infinite;
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
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  position: relative;
  transition: all 0.2s ease;
  color: var(--pc-muted);
}

.category-item:hover {
  background: #fff;
  transform: translateX(3px) scale(1.02);
  box-shadow: var(--pc-shadow);
}

.category-item:hover .category-icon,
.category-item:hover .category-name {
  color: var(--pc-primary);
}

.category-item.active {
  background: var(--pc-primary);
  padding-left: 14px;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--pc-accent);
  border-radius: 0 3px 3px 0;
  animation: flow 1.5s infinite linear;
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
  animation: glow 2s infinite alternate;
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

/* 瀑布流网格 */
.masonry-grid {
  column-count: 3;
  column-gap: 24px;
  margin-bottom: 32px;
}

/* 作品卡片 */
.work-card {
  display: inline-block;
  width: 100%;
  background-color: #fff;
  border: 1px solid #e9edf3;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--pc-shadow);
  position: relative;
  break-inside: avoid;
}

.work-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(56, 189, 248, 0.15);
}

/* 作品图片容器 */
.work-image-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.work-image {
  width: 100%;
  height: 550px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  filter: contrast(1.1) saturate(1.05);
}

.work-card:hover .work-image {
  transform: scale(1.03);
  border: 1px solid rgba(74, 144, 226, 0.5);
}

/* Hover 白底详情层 */
.hover-detail {
  position: absolute;
  inset: 0;
  background: #fff;
  color: var(--pc-text);
  display: none;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.work-card:hover .hover-detail { display: grid; }
.hover-left { display: flex; align-items: center; justify-content: center; overflow: hidden; }
.hover-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.hover-right { display: flex; flex-direction: column; gap: 12px; }
.hover-title { font-size: 18px; font-weight: 700; }
.hover-author { display: flex; gap: 8px; align-items: center; }
.hover-author .author-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--pc-primary); }
.hover-author-meta { display: flex; flex-direction: column; }
.hover-author-meta .author-link { color: var(--pc-primary); text-decoration: none; }
.hover-sub { font-size: 12px; color: #98a2b3; }
.hover-exif { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.exif-item { display: flex; gap: 8px; font-size: 13px; }
.exif-item .label { color: #7a869a; min-width: 68px; }
.exif-item .value { color: var(--pc-text); font-weight: 500; }
.hover-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.hover-btn { background: #F5F8FF; border: 1px solid #e9edf3; color: var(--pc-text); border-radius: 18px; padding: 6px 12px; font-size: 13px; }
.hover-btn.like.active, .hover-btn.like:hover { background: rgba(13,110,253,0.08); border-color: #0D6EFD; color: #0D6EFD; }
.collect-wrap, .comment-wrap, .share-wrap { position: relative; }
.collect-menu { position: absolute; top: 36px; left: 0; background: #fff; border: 1px solid #e9edf3; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); min-width: 160px; z-index: 5; }
.collect-menu .menu-title { padding: 8px 12px; font-size: 12px; color: #7a869a; border-bottom: 1px solid #e9edf3; }
.collect-menu .menu-item { padding: 10px 12px; cursor: pointer; }
.collect-menu .menu-item:hover { background: #F5F8FF; }
.hover-comment { display: flex; flex-direction: column; gap: 8px; }
.rich-tools { display: flex; gap: 6px; }
.tool { background: #fff; border: 1px solid #e9edf3; border-radius: 6px; padding: 4px 8px; }
.rich-input { width: 100%; min-height: 64px; padding: 8px; border: 1px solid #e9edf3; border-radius: 8px; resize: vertical; }
.comment-actions { display: flex; justify-content: flex-end; }
.comment-actions .submit { background: #4A90E2; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; }

/* 图片加载进度 */
.image-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
}

.progress-bar {
  height: 100%;
  background-color: var(--pc-primary);
  transition: width 0.2s ease;
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

/* 图片预览模态框 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.preview-content {
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

/* 预览关闭按钮 */
.preview-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.preview-close:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 预览导航按钮 */
.preview-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.preview-nav.prev {
  left: 16px;
}

.preview-nav.next {
  right: 16px;
}

.preview-nav:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 预览图片容器 */
.preview-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

/* 预览EXIF悬浮 */
.exif-hover {
  position: absolute;
  left: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.exif-chip {
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.15);
}

/* 预览信息 */
.preview-info {
  padding: 24px;
  background-color: var(--glass-bg);
  border-top: 1px solid var(--border-color);
  overflow-y: auto;
  max-height: 30vh;
}

.preview-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.preview-author {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  box-shadow: var(--neon-glow);
}

.author-info-large {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name-large {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 500;
}

.verification-badge-large {
  background: rgba(124, 58, 237, 0.2);
  color: var(--secondary-color);
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
  align-self: flex-start;
}

.follow-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.follow-button:hover {
  background-color: #0ea5e9;
}

/* 预览EXIF信息 */
.preview-exif h3 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.exif-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.exif-grid-item {
  font-size: 14px;
}

.exif-grid-label {
  color: var(--text-tertiary);
  display: block;
  margin-bottom: 4px;
}

.exif-grid-value {
  color: #fff;
  font-weight: 500;
}

/* 预览互动按钮 */
.preview-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  background-color: rgba(255,255,255,0.06);
  color: #d0d6e0;
  border: 1px solid rgba(255,255,255,0.12);
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(255,255,255,0.14);
  color: #fff;
}

.like-button:hover {
  background-color: rgba(255, 77, 79, 0.1);
  border-color: #FF4D4F;
  color: #FF4D4F;
}

.comment-button:hover {
  background-color: rgba(56, 189, 248, 0.1);
  border-color: var(--pc-primary);
  color: var(--pc-primary);
}

.collect-button:hover {
  background-color: rgba(124, 58, 237, 0.1);
  border-color: #7C3AED;
  color: #7C3AED;
}

.share-button:hover {
  background-color: rgba(25, 135, 84, 0.1);
  border-color: #198754;
  color: #198754;
}

/* 粒子效果容器 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
}

/* 动画定义 */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes shutter {
  0% { background-position: 0 0, 0 0; opacity: 0.8; }
  50% { background-position: 0 0, -100% 0; opacity: 1; }
  100% { background-position: 0 0, -200% 0; opacity: 0.9; }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(56, 189, 248, 0.2);
  }
  100% {
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0px) rotate(360deg);
    opacity: 0.7;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes flow {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes progress-animation {
  0% {
    width: 0%;
  }
  50% {
    width: 50%;
  }
  100% {
    width: 100%;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .masonry-grid { column-count: 2; column-gap: 20px; }
}

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
  
  .masonry-grid { column-count: 2; column-gap: 16px; }
  
  .work-image {
    height: 400px;
  }
  
  .preview-content {
    max-height: 100vh;
    max-width: 100%;
  }
  
  .preview-image {
    max-height: 50vh;
  }
  
  .exif-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .masonry-grid { column-count: 1; }
  
  .work-image {
    height: 350px;
  }
  
  .preview-nav {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .preview-close {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }
}
</style>