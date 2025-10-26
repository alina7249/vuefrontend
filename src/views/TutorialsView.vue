<template>
  <div class="tutorials-container">
    <!-- 教程模块头部 -->
    <div class="tutorials-header">
      <h1>摄影教程</h1>
      <p>提升你的摄影技能，探索专业摄影知识</p>
      
      <!-- 教程类型切换标签 -->
      <div class="tutorial-tabs">
        <button 
          :class="['tab-button', { active: activeTab === 'articles' }]"
          @click="activeTab = 'articles'"
        >
          图文教程
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'videos' }]"
          @click="activeTab = 'videos'"
        >
          视频教程
        </button>
      </div>
    </div>
    
    <!-- 教程内容 -->
    <div class="tutorials-content">
      <!-- 图文教程列表 -->
      <div v-if="activeTab === 'articles'" class="articles-section">
        <div class="section-header">
          <h2>图文教程</h2>
          <p class="section-subtitle">详细的步骤说明和技巧解析，点击进入学习</p>
        </div>
        
        <!-- 分类筛选 -->
        <div class="category-filters">
          <button 
            v-for="cat in availableCategories" 
            :key="cat.key"
            :class="['filter-btn', { active: selectedCategory === cat.key }]"
            @click="selectedCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>
        
        <div class="articles-grid">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
            @click="navigateToArticleDetail(article.id)"
          >
            <div class="article-image">
              <img :src="article.thumbnailUrl" :alt="article.title" />
              <div class="article-type-badge">图文教程</div>
              <div class="read-more-badge">点击查看 →</div>
            </div>
            
            <div class="article-info">
              <div class="article-meta">
                <span class="article-category">{{ getCategoryLabel(article.category) }}</span>
                <span class="article-difficulty">{{ getDifficultyLabel(article.difficulty) }}</span>
                <span class="article-duration">{{ article.readingTime }}分钟阅读</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-footer">
                <div class="article-author">
                  <img :src="article.authorAvatar" :alt="article.authorName" class="author-avatar" />
                  <span class="author-name">{{ article.authorName }}</span>
                </div>
                
                <div class="article-stats">
                  <span class="stat-item">
                    <i class="view-icon">👁️</i>
                    {{ article.views }}
                  </span>
                  <span class="stat-item">
                    <i class="like-icon">♥</i>
                    {{ article.likes }}
                  </span>
                  <span class="stat-item">
                    <i class="comment-icon">💬</i>
                    {{ article.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            :disabled="currentPage === 1" 
            @click="currentPage--"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            :disabled="currentPage === totalPages" 
            @click="currentPage++"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>
      
      <!-- 视频教程列表 -->
      <div v-if="activeTab === 'videos'" class="videos-section">
        <div class="section-header">
          <h2>视频教程</h2>
          <p class="section-subtitle">直观的操作演示和实时讲解，提升实战技能</p>
        </div>
        
        <!-- 分类筛选 -->
        <div class="category-filters">
          <button 
            v-for="cat in availableCategories" 
            :key="cat.key"
            :class="['filter-btn', { active: selectedVideoCategory === cat.key }]"
            @click="selectedVideoCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>
        
        <div class="videos-grid">
          <div v-for="video in filteredVideos" :key="video.id" class="video-card">
            <div class="video-thumbnail-container">
              <img :src="video.thumbnailUrl" :alt="video.title" class="video-thumbnail" />
              <div class="video-type-badge">视频教程</div>
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
              <div class="play-button">▶</div>
            </div>
            
            <div class="video-info">
              <div class="video-meta">
                <span class="video-category">{{ getCategoryLabel(video.category) }}</span>
                <span class="video-difficulty">{{ getDifficultyLabel(video.difficulty) }}</span>
              </div>
              
              <h3 class="video-title">{{ video.title }}</h3>
              <p class="video-description">{{ video.description }}</p>
              
              <div class="video-footer">
                <div class="video-author">
                  <img :src="video.authorAvatar" :alt="video.authorName" class="author-avatar" />
                  <span class="author-name">{{ video.authorName }}</span>
                </div>
                
                <div class="video-stats">
                  <span class="stat-item">
                    <i class="view-icon">👁️</i>
                    {{ video.views }}
                  </span>
                  <span class="stat-item">
                    <i class="like-icon">👍</i>
                    {{ video.likes }}
                  </span>
                  <span class="stat-item">
                    <i class="comment-icon">💬</i>
                    {{ video.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 视频分页控件 -->
        <div class="pagination" v-if="totalVideoPages > 1">
          <button 
            :disabled="currentVideoPage === 1" 
            @click="currentVideoPage--"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentVideoPage }} / {{ totalVideoPages }}</span>
          <button 
            :disabled="currentVideoPage === totalVideoPages" 
            @click="currentVideoPage++"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// 当前激活的标签页
const activeTab = ref('articles');

// 分类标签映射
const getCategoryLabel = (category) => {
  const labels = {
    pre: '前期',
    post: '后期',
    equipment: '器材',
    composition: '构图',
    lighting: '用光',
    street: '街拍',
    portrait: '人像',
    landscape: '风光',
  };
  return labels[category] || category;
};

// 难度标签映射
const getDifficultyLabel = (difficulty) => {
  const labels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '大师',
  };
  return labels[difficulty] || difficulty;
};

// 格式化视频时长
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// 导航到文章详情页
const navigateToArticleDetail = (articleId) => {
  router.push({
    path: `/tutorials/article/${articleId}`,
    query: { articleId: articleId }
  });
};

// 可用分类
const availableCategories = [
  { key: 'all', label: '全部分类' },
  { key: 'pre', label: '前期' },
  { key: 'post', label: '后期' },
  { key: 'equipment', label: '器材' },
  { key: 'composition', label: '构图' },
  { key: 'lighting', label: '用光' },
  { key: 'street', label: '街拍' },
  { key: 'portrait', label: '人像' },
  { key: 'landscape', label: '风光' },
];

// 筛选相关状态
const selectedCategory = ref('all');
const selectedVideoCategory = ref('all');
const currentPage = ref(1);
const currentVideoPage = ref(1);
const itemsPerPage = 6;

// 扩充的模拟图文教程数据
const articlesData = ref([
  {
    id: 1,
    title: '摄影入门：曝光三要素详解',
    excerpt: '本文详细介绍摄影中的光圈、快门和ISO三个核心参数，帮助初学者快速掌握曝光技巧...',
    content: {
      sections: [
        {
          title: '曝光的基础概念',
          content: '曝光是摄影中最基础也最重要的概念之一。正确的曝光能够让照片呈现出理想的亮度和细节...',
          image: 'https://picsum.photos/800/450?random=301'
        },
        {
          title: '光圈的作用与影响',
          content: '光圈控制着相机进光量的大小，同时也影响着景深效果。大光圈(f/1.8)可以创造浅景深效果...',
          image: 'https://picsum.photos/800/450?random=302'
        },
        {
          title: '快门速度的选择',
          content: '快门速度决定了相机感光元件曝光的时间长短。高速快门可以冻结运动物体...',
          image: 'https://picsum.photos/800/450?random=303'
        },
        {
          title: 'ISO的合理使用',
          content: 'ISO代表相机的感光度，较高的ISO可以在光线不足的环境下拍摄，但会带来噪点...',
          image: 'https://picsum.photos/800/450?random=304'
        },
        {
          title: '三者的平衡与应用',
          content: '在实际拍摄中，需要根据拍摄场景和创作意图，灵活调整光圈、快门和ISO的组合...',
          image: 'https://picsum.photos/800/450?random=305'
        }
      ],
      tips: [
        '使用光圈优先模式(f/模式)可以专注于控制景深',
        '在光线充足的情况下尽量使用低ISO以获得最佳画质',
        '拍摄运动物体时，可以使用快门优先模式(S/Tv模式)'
      ],
      exercises: '选择不同场景进行曝光练习，尝试用不同的光圈、快门组合拍摄同一物体，观察效果差异。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=101',
    category: 'pre',
    difficulty: 'beginner',
    authorName: '张老师',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    views: 12500,
    likes: 890,
    comments: 128,
    readingTime: 8,
    publishDate: '2023-10-15'
  },
  {
    id: 2,
    title: '风光摄影构图技巧大全',
    excerpt: '掌握这些构图技巧，让你的风光照片更具视觉冲击力和艺术感...',
    content: {
      sections: [
        {
          title: '三分法构图',
          content: '将画面横向和纵向各分为三等分，将主体放置在分割线的交点上...',
          image: 'https://picsum.photos/800/450?random=306'
        },
        {
          title: '引导线构图',
          content: '利用画面中的线条元素引导观众的视线指向主体...',
          image: 'https://picsum.photos/800/450?random=307'
        },
        {
          title: '框架式构图',
          content: '利用前景元素形成自然框架，突出主体，增加画面深度...',
          image: 'https://picsum.photos/800/450?random=308'
        },
        {
          title: '对称构图',
          content: '利用画面中的对称元素创造平衡和和谐的视觉效果...',
          image: 'https://picsum.photos/800/450?random=309'
        },
        {
          title: '黄金分割构图',
          content: '比三分法更精确的构图方法，能够创造更具美感的画面比例...',
          image: 'https://picsum.photos/800/450?random=310'
        }
      ],
      tips: [
        '使用相机的网格线功能辅助构图',
        '尝试不同的视角和高度拍摄同一景色',
        '注意天空和地面的比例分配'
      ],
      exercises: '选择一处风景优美的地点，分别用不同的构图方法拍摄同一景色，比较各种构图的视觉效果。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=102',
    category: 'composition',
    difficulty: 'intermediate',
    authorName: '李摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    views: 8900,
    likes: 760,
    comments: 95,
    readingTime: 10,
    publishDate: '2023-10-20'
  },
  {
    id: 3,
    title: 'Lightroom后期处理全攻略',
    excerpt: '从基础调整到高级技巧，全面掌握Lightroom照片后期处理流程...',
    content: {
      sections: [
        {
          title: 'Lightroom工作界面介绍',
          content: 'Lightroom的界面分为图库、修改照片、地图等多个模块，每个模块有不同的功能...',
          image: 'https://picsum.photos/800/450?random=311'
        },
        {
          title: '基础调整技巧',
          content: '包括曝光、对比度、高光、阴影、白色、黑色等基础滑块的使用方法...',
          image: 'https://picsum.photos/800/450?random=312'
        },
        {
          title: '色调与色彩调整',
          content: '利用色温、色调、鲜艳度和饱和度等工具调整照片的色彩表现...',
          image: 'https://picsum.photos/800/450?random=313'
        },
        {
          title: '曲线工具的高级应用',
          content: '曲线工具是最强大的调整工具之一，可以精确控制照片的影调和色彩...',
          image: 'https://picsum.photos/800/450?random=314'
        },
        {
          title: '局部调整技术',
          content: '使用渐变滤镜、径向滤镜和调整画笔等工具进行有针对性的局部调整...',
          image: 'https://picsum.photos/800/450?random=315'
        }
      ],
      tips: [
        '养成使用预设的习惯，提高工作效率',
        '使用虚拟副本尝试不同的调整风格',
        '定期备份你的Lightroom目录'
      ],
      exercises: '选择一张曝光不足的照片，使用Lightroom的各种工具进行修复和优化，直到满意为止。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=103',
    category: 'post',
    difficulty: 'intermediate',
    authorName: '王后期',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    views: 15600,
    likes: 1200,
    comments: 189,
    readingTime: 15,
    publishDate: '2023-10-25'
  },
  {
    id: 4,
    title: '人像摄影布光技巧',
    excerpt: '学习专业人像摄影中的布光方法，让你的人像作品更具质感...',
    content: {
      sections: [
        {
          title: '人像摄影的光线基础',
          content: '了解硬光和柔光的区别，以及它们在人像摄影中的不同应用效果...',
          image: 'https://picsum.photos/800/450?random=316'
        },
        {
          title: '单灯布光技巧',
          content: '掌握主光的位置和角度对人像塑造的影响，包括伦勃朗光、蝴蝶光等经典布光法...',
          image: 'https://picsum.photos/800/450?random=317'
        },
        {
          title: '双灯布光系统',
          content: '学习如何配合使用主光和辅助光，控制阴影的深浅和过渡...',
          image: 'https://picsum.photos/800/450?random=318'
        },
        {
          title: '多灯布光组合',
          content: '掌握三灯及以上的布光技巧，包括主光、辅助光、背景光的配合使用...',
          image: 'https://picsum.photos/800/450?random=319'
        },
        {
          title: '自然光与闪光灯结合',
          content: '学习如何在自然光环境下使用闪光灯进行补光，创造理想的光线效果...',
          image: 'https://picsum.photos/800/450?random=320'
        }
      ],
      tips: [
        '使用反光板是最简单有效的补光工具',
        '室内拍摄时注意窗户光线的方向和强度',
        '人像摄影中眼神光是提升照片品质的关键'
      ],
      exercises: '在不同光线条件下拍摄同一个人物，尝试使用不同的布光方法，比较各种光线效果的差异。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=104',
    category: 'lighting',
    difficulty: 'advanced',
    authorName: '陈大师',
    authorAvatar: 'https://picsum.photos/100/100?random=13',
    views: 9800,
    likes: 850,
    comments: 142,
    readingTime: 12,
    publishDate: '2023-10-30'
  },
  {
    id: 5,
    title: '街头摄影入门指南',
    excerpt: '从零开始学习街头摄影，掌握捕捉城市瞬间的技巧和勇气...',
    content: {
      sections: [
        {
          title: '街头摄影的魅力',
          content: '街头摄影是一种捕捉日常生活中真实瞬间的艺术形式，它能够记录城市的脉搏和人文故事...',
          image: 'https://picsum.photos/800/450?random=321'
        },
        {
          title: '街头摄影器材选择',
          content: '轻便、低调的器材是街头摄影的理想选择，可以让你快速反应并融入环境...',
          image: 'https://picsum.photos/800/450?random=322'
        },
        {
          title: '街头摄影构图技巧',
          content: '街头摄影需要快速构图能力，学习如何在瞬间发现并捕捉有意义的画面...',
          image: 'https://picsum.photos/800/450?random=323'
        },
        {
          title: '接近陌生人拍摄',
          content: '克服对拍摄陌生人的恐惧，学习礼貌而有效地与拍摄对象互动...',
          image: 'https://picsum.photos/800/450?random=324'
        },
        {
          title: '街头摄影的法律与伦理',
          content: '了解街头摄影的法律边界和伦理考量，尊重他人的同时创作有意义的作品...',
          image: 'https://picsum.photos/800/450?random=325'
        }
      ],
      tips: [
        '每天拿出30分钟专门进行街头摄影练习',
        '使用盲拍技术可以捕捉更自然的瞬间',
        '关注光线、影子和反射，它们能为街头照片增添深度'
      ],
      exercises: '选择一条繁忙的街道，进行1小时的街头摄影练习，尝试拍摄至少5张自己满意的作品。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=105',
    category: 'street',
    difficulty: 'beginner',
    authorName: '刘街头',
    authorAvatar: 'https://picsum.photos/100/100?random=14',
    views: 7650,
    likes: 620,
    comments: 88,
    readingTime: 10,
    publishDate: '2023-11-05'
  },
  {
    id: 6,
    title: '微距摄影：探索微观世界',
    excerpt: '学习微距摄影的技巧和设备，发现身边被忽略的美丽细节...',
    content: {
      sections: [
        {
          title: '微距摄影基础概念',
          content: '微距摄影是指拍摄与实物等大或更大的图像的摄影方式，可以展现肉眼难以观察到的细节...',
          image: 'https://picsum.photos/800/450?random=326'
        },
        {
          title: '微距摄影设备选择',
          content: '从专业微距镜头到简易的微距滤镜，了解不同设备的优缺点和适用场景...',
          image: 'https://picsum.photos/800/450?random=327'
        },
        {
          title: '微距摄影的对焦技巧',
          content: '微距摄影中的对焦是一大挑战，学习如何精确对焦并获得足够的景深...',
          image: 'https://picsum.photos/800/450?random=328'
        },
        {
          title: '微距摄影的光线控制',
          content: '了解如何在微距摄影中控制光线，包括自然光的利用和人工光源的使用...',
          image: 'https://picsum.photos/800/450?random=329'
        },
        {
          title: '微距摄影的主题选择',
          content: '从植物、昆虫到日常生活物品，发现适合微距摄影的各种主题...',
          image: 'https://picsum.photos/800/450?random=330'
        }
      ],
      tips: [
        '使用三脚架可以有效减少抖动，提高图像清晰度',
        '尝试使用焦点堆叠技术获得更大的景深',
        '注意背景的简洁性，避免分散对主体的注意力'
      ],
      exercises: '选择一种小型物体（如花朵、硬币或昆虫），使用微距摄影技术拍摄一组细节照片，尝试展现不同的角度和光影效果。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=106',
    category: 'equipment',
    difficulty: 'intermediate',
    authorName: '赵微观',
    authorAvatar: 'https://picsum.photos/100/100?random=15',
    views: 8900,
    likes: 780,
    comments: 112,
    readingTime: 11,
    publishDate: '2023-11-10'
  },
  {
    id: 7,
    title: '夜景摄影完全指南',
    excerpt: '掌握夜景摄影的曝光、构图和后期技巧，拍出绚丽的城市夜景...',
    content: {
      sections: [
        {
          title: '夜景摄影的魅力',
          content: '夜景摄影能够展现城市和自然在夜晚的独特魅力，捕捉灯光和黑暗的戏剧性对比...',
          image: 'https://picsum.photos/800/450?random=331'
        },
        {
          title: '夜景摄影器材准备',
          content: '了解夜景摄影所需的设备，包括相机、镜头、三脚架和其他辅助工具...',
          image: 'https://picsum.photos/800/450?random=332'
        },
        {
          title: '夜景摄影曝光技巧',
          content: '学习长时间曝光的设置方法，以及如何处理夜景中的高光和暗部细节...',
          image: 'https://picsum.photos/800/450?random=333'
        },
        {
          title: '夜景摄影构图技巧',
          content: '探索适合夜景摄影的构图方法，包括如何利用灯光、线条和空间感...',
          image: 'https://picsum.photos/800/450?random=334'
        },
        {
          title: '夜景摄影后期处理',
          content: '学习如何在后期处理中增强夜景照片的效果，调整光影和色彩...',
          image: 'https://picsum.photos/800/450?random=335'
        }
      ],
      tips: [
        '使用遥控器或快门线避免相机抖动',
        '尝试不同的白平衡设置可以创造不同的氛围',
        '蓝调时刻（日落后20-30分钟）是拍摄城市夜景的黄金时间'
      ],
      exercises: '选择一个城市地标或景点，在蓝调时刻和完全黑暗后分别进行拍摄，比较不同时间的效果差异。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=107',
    category: 'landscape',
    difficulty: 'intermediate',
    authorName: '吴夜色',
    authorAvatar: 'https://picsum.photos/100/100?random=16',
    views: 13400,
    likes: 1120,
    comments: 167,
    readingTime: 13,
    publishDate: '2023-11-15'
  },
  {
    id: 8,
    title: 'Photoshop高级修图技巧',
    excerpt: '深入学习Photoshop的高级功能，掌握专业级照片修图技术...',
    content: {
      sections: [
        {
          title: 'Photoshop工作区优化',
          content: '学习如何配置Photoshop工作区，提高修图效率和工作流程...',
          image: 'https://picsum.photos/800/450?random=336'
        },
        {
          title: '图层与蒙版高级应用',
          content: '深入理解图层和蒙版的工作原理，掌握复杂图像合成的技术...',
          image: 'https://picsum.photos/800/450?random=337'
        },
        {
          title: '选区与抠图技巧',
          content: '学习如何创建精确的选区，掌握各种抠图技术，包括通道抠图和钢笔工具...',
          image: 'https://picsum.photos/800/450?random=338'
        },
        {
          title: '频率分离磨皮',
          content: '掌握专业级人像磨皮技术，在保留皮肤质感的同时去除瑕疵...',
          image: 'https://picsum.photos/800/450?random=339'
        },
        {
          title: '色彩分级与调色',
          content: '学习专业的色彩分级技术，创建独特的视觉风格和氛围...',
          image: 'https://picsum.photos/800/450?random=340'
        }
      ],
      tips: [
        '使用智能对象保留图像的原始数据',
        '掌握快捷键可以极大提高工作效率',
        '养成创建调整图层的习惯，保持编辑的灵活性'
      ],
      exercises: '选择一张人像照片，应用频率分离磨皮技术，并进行色彩分级，创建专业级的人像效果。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=108',
    category: 'post',
    difficulty: 'advanced',
    authorName: '郑后期',
    authorAvatar: 'https://picsum.photos/100/100?random=17',
    views: 16700,
    likes: 1450,
    comments: 213,
    readingTime: 18,
    publishDate: '2023-11-20'
  },
  {
    id: 9,
    title: '旅行摄影构图与用光',
    excerpt: '学习如何在旅行中拍出令人印象深刻的照片，记录美好旅程...',
    content: {
      sections: [
        {
          title: '旅行摄影器材选择',
          content: '了解如何根据旅行目的地和类型选择合适的摄影器材，平衡画质和便携性...',
          image: 'https://picsum.photos/800/450?random=341'
        },
        {
          title: '旅行风光摄影技巧',
          content: '掌握在不同自然环境中拍摄风光照片的技巧，包括日出、日落、高山、海滩等场景...',
          image: 'https://picsum.photos/800/450?random=342'
        },
        {
          title: '城市旅行摄影',
          content: '学习如何拍摄城市风光、建筑和街景，展现城市的独特魅力...',
          image: 'https://picsum.photos/800/450?random=343'
        },
        {
          title: '人文旅行摄影',
          content: '了解如何尊重当地文化习俗的同时，拍摄真实而有深度的人文照片...',
          image: 'https://picsum.photos/800/450?random=344'
        },
        {
          title: '旅行摄影故事叙述',
          content: '学习如何通过一系列照片讲述旅行故事，创建有主题和情感的摄影集...',
          image: 'https://picsum.photos/800/450?random=345'
        }
      ],
      tips: [
        '提前了解目的地的最佳拍摄地点和时间',
        '不要只关注著名景点，也要留意当地的日常生活场景',
        '尝试不同的视角和构图，避免拍摄过于普通的旅游照片'
      ],
      exercises: '整理一次旅行的照片，选择10-15张能够讲述完整故事的照片，按照叙事逻辑进行排序。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=109',
    category: 'landscape',
    difficulty: 'intermediate',
    authorName: '黄旅行',
    authorAvatar: 'https://picsum.photos/100/100?random=18',
    views: 10200,
    likes: 890,
    comments: 134,
    readingTime: 14,
    publishDate: '2023-11-25'
  },
  {
    id: 10,
    title: '婚礼摄影完全攻略',
    excerpt: '专业婚礼摄影师的实战经验分享，掌握婚礼摄影的核心技巧...',
    content: {
      sections: [
        {
          title: '婚礼摄影准备工作',
          content: '了解婚礼摄影前的准备工作，包括与新人沟通、制定拍摄计划和准备器材...',
          image: 'https://picsum.photos/800/450?random=346'
        },
        {
          title: '婚礼关键瞬间捕捉',
          content: '学习如何预判和捕捉婚礼中的关键瞬间，记录真实而感人的情感表达...',
          image: 'https://picsum.photos/800/450?random=347'
        },
        {
          title: '婚礼人像拍摄技巧',
          content: '掌握新郎新娘、伴郎伴娘和家庭成员的人像拍摄技巧...',
          image: 'https://picsum.photos/800/450?random=348'
        },
        {
          title: '婚礼光线处理',
          content: '学习如何在不同光线条件下（室内、室外、低光环境）处理婚礼摄影...',
          image: 'https://picsum.photos/800/450?random=349'
        },
        {
          title: '婚礼照片后期处理',
          content: '了解婚礼照片的后期处理流程，包括筛选、调整和相册制作...',
          image: 'https://picsum.photos/800/450?random=350'
        }
      ],
      tips: [
        '准备备用器材，避免设备故障影响拍摄',
        '提前熟悉婚礼场地，了解最佳拍摄位置和光线条件',
        '在保证拍摄质量的同时，尽量减少对婚礼流程的干扰'
      ],
      exercises: '找一对朋友模拟婚礼场景，练习婚礼摄影的拍摄技巧，特别是光线处理和瞬间捕捉。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=110',
    category: 'portrait',
    difficulty: 'advanced',
    authorName: '孙婚礼',
    authorAvatar: 'https://picsum.photos/100/100?random=19',
    views: 11500,
    likes: 980,
    comments: 156,
    readingTime: 16,
    publishDate: '2023-12-01'
  },
  {
    id: 11,
    title: '手机摄影进阶教程',
    excerpt: '无需专业相机，用手机也能拍出令人惊艳的照片...',
    content: {
      sections: [
        {
          title: '手机相机功能详解',
          content: '深入了解手机相机的各项功能和设置，充分发挥手机摄影的潜力...',
          image: 'https://picsum.photos/800/450?random=351'
        },
        {
          title: '手机摄影构图技巧',
          content: '学习适合手机摄影的构图方法，利用手机的灵活性创作出独特的视角...',
          image: 'https://picsum.photos/800/450?random=352'
        },
        {
          title: '手机摄影光线运用',
          content: '了解如何在不同光线条件下使用手机拍摄，克服手机感光元件小的局限性...',
          image: 'https://picsum.photos/800/450?random=353'
        },
        {
          title: '手机摄影附件推荐',
          content: '探索能够提升手机摄影效果的各种附件，包括外接镜头、三脚架等...',
          image: 'https://picsum.photos/800/450?random=354'
        },
        {
          title: '手机修图APP使用技巧',
          content: '掌握几款流行的手机修图应用的使用方法，随时随地编辑出专业级照片...',
          image: 'https://picsum.photos/800/450?random=355'
        }
      ],
      tips: [
        '使用手机网格线辅助构图',
        '轻触屏幕可以调整焦点和曝光',
        '使用耳机线的音量键作为快门按钮，减少抖动'
      ],
      exercises: '使用手机进行一天的摄影记录，尝试不同的场景和主题，然后使用手机修图APP进行后期处理。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=111',
    category: 'equipment',
    difficulty: 'beginner',
    authorName: '周手机',
    authorAvatar: 'https://picsum.photos/100/100?random=20',
    views: 14800,
    likes: 1320,
    comments: 198,
    readingTime: 9,
    publishDate: '2023-12-05'
  },
  {
    id: 12,
    title: '黑白摄影艺术',
    excerpt: '探索黑白摄影的独特魅力，学习如何通过黑白影像表达情感和故事...',
    content: {
      sections: [
        {
          title: '黑白摄影的艺术价值',
          content: '了解黑白摄影在摄影史上的重要地位和独特的艺术表现力...',
          image: 'https://picsum.photos/800/450?random=356'
        },
        {
          title: '适合黑白摄影的主题',
          content: '探索哪些主题和场景特别适合用黑白方式表现...',
          image: 'https://picsum.photos/800/450?random=357'
        },
        {
          title: '黑白摄影构图技巧',
          content: '学习如何在没有色彩的情况下，通过光影、线条和形状构建有力的构图...',
          image: 'https://picsum.photos/800/450?random=358'
        },
        {
          title: '黑白摄影用光技巧',
          content: '了解如何利用光线创造丰富的影调和层次感，这在黑白摄影中尤为重要...',
          image: 'https://picsum.photos/800/450?random=359'
        },
        {
          title: '黑白照片后期处理',
          content: '学习如何在后期处理中优化黑白照片，调整对比度、影调和质感...',
          image: 'https://picsum.photos/800/450?random=360'
        }
      ],
      tips: [
        '学会观察场景中的明暗对比和纹理',
        '尝试使用相机的黑白模式进行实时预览',
        '在后期处理中不要过度提高对比度，保持细节的丰富性'
      ],
      exercises: '选择一个场景或主题，分别用彩色和黑白两种方式拍摄，然后将彩色照片转换为黑白，比较效果差异。'
    },
    thumbnailUrl: 'https://picsum.photos/600/400?random=112',
    category: 'pre',
    difficulty: 'intermediate',
    authorName: '林黑白',
    authorAvatar: 'https://picsum.photos/100/100?random=21',
    views: 9600,
    likes: 830,
    comments: 124,
    readingTime: 12,
    publishDate: '2023-12-10'
  }
]);

// 扩充的模拟视频教程数据
const videosData = ref([
  {
    id: 101,
    title: '【视频教程】曝光三要素实战演示',
    description: '通过实际操作演示光圈、快门和ISO的效果差异，直观理解曝光原理，适合摄影初学者。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=201',
    category: 'pre',
    difficulty: 'beginner',
    authorName: '张老师',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    views: 21500,
    likes: 1890,
    comments: 234,
    duration: 620, // 10分20秒
    chapters: [
      { time: '0:00', title: '课程介绍' },
      { time: '1:20', title: '光圈的实际效果演示' },
      { time: '3:45', title: '快门速度对动态物体的影响' },
      { time: '6:10', title: 'ISO与画质的关系' },
      { time: '8:30', title: '三要素的平衡应用' }
    ]
  },
  {
    id: 102,
    title: '【视频教程】风光摄影构图实战教学',
    description: '实地拍摄演示常见构图技巧，学习如何在不同场景应用构图原则，提升风光作品质量。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=202',
    category: 'composition',
    difficulty: 'intermediate',
    authorName: '李摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    views: 15800,
    likes: 1420,
    comments: 176,
    duration: 850, // 14分10秒
    chapters: [
      { time: '0:00', title: '构图基本原则回顾' },
      { time: '2:15', title: '三分法在山水风光中的应用' },
      { time: '5:30', title: '引导线构图实战演示' },
      { time: '8:45', title: '利用前景增强画面深度' },
      { time: '11:20', title: '不同天气条件下的构图调整' }
    ]
  },
  {
    id: 103,
    title: '【视频教程】Lightroom后期处理演示',
    description: '屏幕录制Lightroom实际操作过程，从导入到导出的完整工作流，零基础也能轻松上手。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=203',
    category: 'post',
    difficulty: 'intermediate',
    authorName: '王后期',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    views: 28900,
    likes: 2560,
    comments: 342,
    duration: 1240, // 20分40秒
    chapters: [
      { time: '0:00', title: 'Lightroom界面介绍' },
      { time: '3:10', title: '照片导入与组织管理' },
      { time: '6:45', title: '基础调整工具详解' },
      { time: '11:20', title: '曲线工具高级应用' },
      { time: '15:30', title: '局部调整技巧' },
      { time: '18:45', title: '导出与分享设置' }
    ]
  },
  {
    id: 104,
    title: '【视频教程】人像布光实战指南',
    description: '工作室实拍演示多种人像布光方案，详细解析光线位置和效果，打造专业人像作品。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=204',
    category: 'lighting',
    difficulty: 'advanced',
    authorName: '陈大师',
    authorAvatar: 'https://picsum.photos/100/100?random=13',
    views: 18700,
    likes: 1640,
    comments: 267,
    duration: 1420, // 23分40秒
    chapters: [
      { time: '0:00', title: '人像布光基础概念' },
      { time: '4:20', title: '伦勃朗光布光演示' },
      { time: '7:50', title: '蝴蝶光与派拉蒙光' },
      { time: '11:30', title: '双灯 setup详解' },
      { time: '15:45', title: '三灯及多灯组合' },
      { time: '19:20', title: '自然光与闪光灯混合使用' }
    ]
  },
  {
    id: 105,
    title: '【视频教程】街头摄影实战技法',
    description: '跟随专业街头摄影师，学习如何在城市环境中发现和捕捉精彩瞬间，提升街头摄影水平。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=205',
    category: 'street',
    difficulty: 'intermediate',
    authorName: '刘街头',
    authorAvatar: 'https://picsum.photos/100/100?random=14',
    views: 14300,
    likes: 1280,
    comments: 213,
    duration: 1050, // 17分30秒
    chapters: [
      { time: '0:00', title: '街头摄影心态准备' },
      { time: '3:15', title: '器材选择与设置' },
      { time: '6:40', title: '如何发现有趣的瞬间' },
      { time: '10:20', title: '接近陌生人的技巧' },
      { time: '13:50', title: '不同光线条件下的街头拍摄' }
    ]
  },
  {
    id: 106,
    title: '【视频教程】夜景摄影全攻略',
    description: '详细讲解夜景摄影的器材准备、曝光技巧和构图方法，帮助你拍出令人惊艳的夜景作品。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=206',
    category: 'landscape',
    difficulty: 'intermediate',
    authorName: '吴夜色',
    authorAvatar: 'https://picsum.photos/100/100?random=16',
    views: 19800,
    likes: 1720,
    comments: 289,
    duration: 1320, // 22分钟
    chapters: [
      { time: '0:00', title: '夜景摄影器材准备' },
      { time: '4:30', title: '长时间曝光技巧' },
      { time: '8:15', title: '城市夜景拍摄地点选择' },
      { time: '12:40', title: '星轨摄影基础' },
      { time: '16:20', title: '夜景照片后期处理技巧' }
    ]
  },
  {
    id: 107,
    title: '【视频教程】微距摄影探秘',
    description: '带你走进微观世界，学习微距摄影的技巧和创意，发现身边被忽略的美丽细节。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=207',
    category: 'equipment',
    difficulty: 'intermediate',
    authorName: '赵微观',
    authorAvatar: 'https://picsum.photos/100/100?random=15',
    views: 11500,
    likes: 980,
    comments: 164,
    duration: 980, // 16分20秒
    chapters: [
      { time: '0:00', title: '微距摄影设备介绍' },
      { time: '3:25', title: '微距对焦技巧详解' },
      { time: '7:10', title: '光线控制在微距中的应用' },
      { time: '10:45', title: '拍摄花卉和植物' },
      { time: '13:30', title: '微观世界的创意构图' }
    ]
  },
  {
    id: 108,
    title: '【视频教程】Photoshop人像精修',
    description: '从零开始学习专业人像精修技术，包括磨皮、调色和细节优化，让你的人像作品更加完美。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=208',
    category: 'post',
    difficulty: 'advanced',
    authorName: '郑后期',
    authorAvatar: 'https://picsum.photos/100/100?random=17',
    views: 26400,
    likes: 2350,
    comments: 387,
    duration: 1850, // 30分50秒
    chapters: [
      { time: '0:00', title: '人像修图工作流程' },
      { time: '5:20', title: '频率分离磨皮技术' },
      { time: '12:45', title: '液化与形体调整' },
      { time: '17:30', title: '眼睛和牙齿细节优化' },
      { time: '22:15', title: '色彩分级与调色' },
      { time: '26:40', title: '质感增强与锐化技巧' }
    ]
  },
  {
    id: 109,
    title: '【视频教程】旅行摄影实战指南',
    description: '跟随专业旅行摄影师，学习如何在旅途中捕捉精彩瞬间，记录难忘的旅行故事。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=209',
    category: 'landscape',
    difficulty: 'intermediate',
    authorName: '黄旅行',
    authorAvatar: 'https://picsum.photos/100/100?random=18',
    views: 17200,
    likes: 1560,
    comments: 243,
    duration: 1140, // 19分钟
    chapters: [
      { time: '0:00', title: '旅行摄影器材精简指南' },
      { time: '4:10', title: '日出日落最佳拍摄技巧' },
      { time: '8:25', title: '人文纪实摄影方法' },
      { time: '12:15', title: '异国风光拍摄建议' },
      { time: '15:30', title: '旅行照片快速整理技巧' }
    ]
  },
  {
    id: 110,
    title: '【视频教程】手机摄影大师课',
    description: '无需专业相机，让你的手机摄影水平快速提升，拍出媲美专业相机的高质量照片。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=210',
    category: 'equipment',
    difficulty: 'beginner',
    authorName: '周手机',
    authorAvatar: 'https://picsum.photos/100/100?random=20',
    views: 23500,
    likes: 2120,
    comments: 356,
    duration: 890, // 14分50秒
    chapters: [
      { time: '0:00', title: '手机相机隐藏功能揭秘' },
      { time: '3:15', title: '手机摄影构图技巧' },
      { time: '6:45', title: '手机拍摄光线运用' },
      { time: '9:30', title: '手机修图APP推荐与使用' },
      { time: '12:20', title: '手机摄影创意玩法' }
    ]
  },
  {
    id: 111,
    title: '【视频教程】黑白摄影艺术表达',
    description: '探索黑白摄影的独特魅力，学习如何通过黑白影像表达更深层次的情感和故事。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=211',
    category: 'pre',
    difficulty: 'intermediate',
    authorName: '林黑白',
    authorAvatar: 'https://picsum.photos/100/100?random=21',
    views: 13800,
    likes: 1210,
    comments: 198,
    duration: 1020, // 17分钟
    chapters: [
      { time: '0:00', title: '黑白摄影的艺术魅力' },
      { time: '4:10', title: '黑白摄影构图要点' },
      { time: '7:45', title: '光线与对比度控制' },
      { time: '11:20', title: '黑白照片后期处理' },
      { time: '14:30', title: '黑白摄影主题创作' }
    ]
  },
  {
    id: 112,
    title: '【视频教程】婚礼摄影实战技法',
    description: '专业婚礼摄影师分享多年经验，从前期准备到现场拍摄，再到后期处理的完整指南。',
    thumbnailUrl: 'https://picsum.photos/600/400?random=212',
    category: 'portrait',
    difficulty: 'advanced',
    authorName: '孙婚礼',
    authorAvatar: 'https://picsum.photos/100/100?random=19',
    views: 15600,
    likes: 1380,
    comments: 265,
    duration: 1580, // 26分20秒
    chapters: [
      { time: '0:00', title: '婚礼摄影前期准备' },
      { time: '5:30', title: '婚礼流程关键节点拍摄' },
      { time: '10:45', title: '婚礼人像摆姿指导' },
      { time: '15:20', title: '弱光环境拍摄技巧' },
      { time: '19:45', title: '婚礼照片选片与后期' },
      { time: '23:10', title: '婚礼相册设计要点' }
    ]
  }
]);

// 计算属性：筛选后的图文教程
const filteredArticles = computed(() => {
  let filtered = articlesData.value;
  
  // 分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value);
  }
  
  // 分页
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  return filtered.slice(start, end);
});

// 计算属性：总页数
const totalPages = computed(() => {
  let filtered = articlesData.value;
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value);
  }
  
  return Math.ceil(filtered.length / itemsPerPage);
});

// 计算属性：筛选后的视频教程
const filteredVideos = computed(() => {
  let filtered = videosData.value;
  
  // 分类筛选
  if (selectedVideoCategory.value !== 'all') {
    filtered = filtered.filter(video => video.category === selectedVideoCategory.value);
  }
  
  // 分页
  const start = (currentVideoPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  return filtered.slice(start, end);
});

// 计算属性：视频总页数
const totalVideoPages = computed(() => {
  let filtered = videosData.value;
  
  if (selectedVideoCategory.value !== 'all') {
    filtered = filtered.filter(video => video.category === selectedVideoCategory.value);
  }
  
  return Math.ceil(filtered.length / itemsPerPage);
});

// 监听分类变化，重置页码
watch([selectedCategory, selectedVideoCategory], () => {
  currentPage.value = 1;
  currentVideoPage.value = 1;
});
</script>

<style scoped>
.tutorials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tutorials-header {
  text-align: center;
  margin-bottom: 40px;
}

.tutorials-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.tutorials-header p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

/* 标签页样式 */
.tutorial-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.tab-button {
  padding: 10px 25px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f0f0f0;
}

.tab-button.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

/* 通用区块标题 */
.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #333;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0;
}

/* 图文教程区域 */
.articles-section {
  margin-bottom: 50px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-type-badge, .video-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 10;
}

.article-type-badge {
  background-color: rgba(52, 152, 219, 0.8);
}

.video-type-badge {
  background-color: rgba(231, 76, 60, 0.8);
}

.article-info {
  padding: 20px;
}

.article-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.article-category, .article-difficulty, .video-category, .video-difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #f0f0f0;
}

.article-title, .video-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.article-excerpt, .video-description {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.article-footer, .video-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-author, .video-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #333;
}

.article-stats, .video-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 视频教程区域 */
.videos-section {
  margin-bottom: 50px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 10;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.video-thumbnail-container:hover .play-button {
  background-color: rgba(0, 0, 0, 0.7);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-info {
  padding: 20px;
}

.video-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

/* 互补提示 */
.complementary-tip {
  background-color: #f9f9f9;
  border-left: 4px solid #3498db;
  padding: 15px;
  margin: 30px 0;
  border-radius: 4px;
}

.complementary-tip p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .articles-grid, .videos-grid {
    grid-template-columns: 1fr;
  }
  
  .tutorials-header h1 {
    font-size: 2rem;
  }
  
  .tutorial-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    padding: 8px 20px;
    font-size: 0.9rem;
  }
}
</style>