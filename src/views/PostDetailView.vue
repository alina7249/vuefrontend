<template>
  <div class="post-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span>返回社区</span>
        </button>
        <h1 class="page-title">帖子详情</h1>
        <div class="header-actions">
          <button class="action-button">
            <span class="action-icon">...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 帖子详情内容 -->
    <div class="post-detail-content">
      <!-- 帖子主体 -->
      <div class="post-main">
        <!-- 作者信息 -->
        <div class="author-section">
          <router-link :to="'/user/' + currentPost.authorId" class="author-avatar" title="查看个人主页">
            <img :src="currentPost.authorAvatar" :alt="currentPost.authorName" />
          </router-link>
          <div class="author-info">
            <h3 class="author-name">{{ currentPost.authorName }}</h3>
            <p class="post-time">{{ formatPostTime(currentPost.createdAt) }}</p>
          </div>
          <button 
            class="follow-button"
            :class="{ following: isFollowing }"
            @click="toggleFollow"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content">
          <h1 class="post-title">{{ currentPost.title }}</h1>
          <div class="post-tags">
            <span v-for="tag in currentPost.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
          <div class="post-body">
            <p>{{ currentPost.content }}</p>
            <!-- 帖子图片（如果有） -->
            <div v-if="currentPost.imageUrls && currentPost.imageUrls.length > 0" class="post-images">
              <img 
                v-for="(image, index) in currentPost.imageUrls" 
                :key="index" 
                :src="image" 
                :alt="`${currentPost.title} - 图片${index + 1}`" 
                class="post-image"
              />
            </div>
            
            <!-- 浏览量信息 -->
            <div class="post-meta">
              <span class="view-count">
                <i class="meta-icon">👁️</i>
                {{ currentPost.viewCount }} 次浏览
              </span>
            </div>
          </div>
        </div>

        <!-- 互动区域 -->
        <div class="interaction-bar">
          <button 
            class="interaction-button"
            :class="{ active: isLiked }"
            @click="toggleLike"
          >
            <span class="interaction-icon">{{ isLiked ? '👍' : '👍' }}</span>
            <span class="interaction-text">{{ isLiked ? '已点赞' : '点赞' }}</span>
            <span class="interaction-count">({{ likeCount }})</span>
          </button>
          <button class="interaction-button" @click="scrollToComments">
            <span class="interaction-icon">💬</span>
            <span class="interaction-text">评论</span>
            <span class="interaction-count">({{ commentCount }})</span>
          </button>
          <button class="interaction-button" @click="sharePost">
            <span class="interaction-icon">🔗</span>
            <span class="interaction-text">分享</span>
          </button>
          <button class="interaction-button" @click="collectPost">
            <span class="interaction-icon">{{ isCollected ? '⭐' : '☆' }}</span>
            <span class="interaction-text">{{ isCollected ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section">
        <h3 class="comments-title">评论 ({{ commentCount }})</h3>
        
        <!-- 评论输入框 -->
        <div class="comment-input-section">
          <div class="user-avatar-small">
            <img src="https://picsum.photos/100/100?random=user" alt="用户头像" />
          </div>
          <div class="comment-input-wrapper">
            <textarea 
              v-model="newComment" 
              class="comment-input"
              placeholder="写下你的评论..."
              rows="3"
            ></textarea>
            <div class="comment-input-actions">
              <button class="emoji-button">😊</button>
              <button class="image-button">🖼️</button>
              <button 
                class="submit-comment-button"
                :disabled="!newComment.trim()"
                @click="submitComment"
              >
                发布评论
              </button>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <img :src="comment.avatar" :alt="comment.username" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.username }}</span>
                <span class="comment-time">{{ formatCommentTime(comment.time) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <button class="comment-action">
                  <span class="action-icon">👍</span>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="comment-action">
                  <span class="action-text">回复</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多评论 -->
        <div v-if="hasMoreComments" class="load-more-comments">
          <button @click="loadMoreComments">加载更多评论</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 帖子ID
const postId = computed(() => route.params.id);

// 状态
const isLoading = ref(false);
const isFollowing = ref(false);
const isLiked = ref(false);
const isCollected = ref(false);
const likeCount = ref(0);
const commentCount = ref(0);
const newComment = ref('');
const hasMoreComments = ref(true);

// 当前帖子数据
const currentPost = ref({
  id: '',
  title: '',
  content: '',
  summary: '',
  authorName: '',
  authorAvatar: '',
  category: '',
  tags: [],
  imageUrls: [],  // 修改为与数据一致的字段名
  createdAt: ''
});

// 评论数据
const comments = ref([]);

// 统一的帖子数据源 - 与CommunityView中的postsData完全一致
const mockPostsDatabase = [
  {
    id: 1,
    title: '求助！新手想入门摄影，纠结选哪款相机好~',
    summary: '最近突然迷上摄影，预算5000左右想入手第一台相机，主要想拍拍风景和朋友，求大神们推荐~',
    content: 'hi大家好！我是完全的摄影小白，最近刷小红书看到好多漂亮照片，突然就对摄影产生了兴趣~\n\n预算大概5000块左右，主要想拍点风景照和给朋友拍拍人像。我自己做了点功课，看了佳能EOS 200D II、尼康D3500和索尼A5100，但是完全不知道怎么选...有没有用过这些相机的朋友能分享下真实体验？\n\n另外镜头应该怎么选啊？套机镜头够用吗？还是需要额外买？\n\n小白提问，勿喷~感激不尽！❤️',
    authorName: '摄影小白小明',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    authorId: 101,
    category: 'help',
    tags: ['相机推荐', '新手入门', '预算5000', '风光摄影', '人像摄影'],
    imageUrls: [],
    commentCount: 24,
    likeCount: 56,
    createdAt: '2023-10-15T10:30:00',
    viewCount: 356
  },
  {
    id: 2,
    title: '周末拍了组银杏人像！第一次尝试这种风格，求轻拍~',
    summary: '上周和闺蜜去中山公园拍银杏，第一次拍这种温暖色调的照片，大家帮我看看有什么可以改进的？',
    content: '上周末终于赶上银杏季的尾巴啦！拉着闺蜜去中山公园拍了一组照片~这是我第一次尝试这种温暖色调的人像，还有点小紧张呢😆\n\n设备用的是索尼A7M3 + 85mm F1.8，那天光线特别好，几乎都是自然光拍摄。参数一般是光圈F2.0，快门1/200，ISO100这样。后期主要就是把色温调暖了一点，加强了金黄色调，给闺蜜稍微磨了个皮但尽量保留细节~\n\n第一次拍这种风格，感觉构图还有点生硬，光线处理也不太到位...请各位大神指点下，尤其是构图和光线方面有什么可以改进的地方？万分感谢！\n\n附两张我觉得还不错的成片~',
    authorName: '喜欢拍照的小李',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    authorId: 102,
    category: 'share',
    tags: ['人像', '银杏', '秋季', '索尼', '85mm', '自然光'],
    imageUrls: [
      'https://picsum.photos/800/600?random=21',
      'https://picsum.photos/800/600?random=22'
    ],
    commentCount: 38,
    likeCount: 124,
    createdAt: '2023-10-14T15:45:00',
    viewCount: 892
  },
  {
    id: 3,
    title: '分享几个我拍风光时常用的构图技巧！亲测好用~',
    summary: '玩了5年风光摄影，总结了几个超实用的构图方法，新手朋友可以参考一下！',
    content: '作为一个玩了5年风光摄影的老油条😂今天想和刚入门的朋友们分享几个我平时拍照最常用的构图技巧~\n\n1️⃣ 三分法构图：这个应该是最基础的了！把画面想象成九宫格，把重点放在四个交叉点上，比如把地平线放在下三分之一处，会让天空更有层次感~\n\n2️⃣ 引导线构图：利用道路、河流这些自然线条，把观众的视线引导到你想突出的地方，超有用！上次拍长城的时候就用了这个技巧~\n\n3️⃣ 框架式构图：找个天然的框架（比如树洞、拱门）把主体框起来，瞬间增加画面层次感！\n\n4️⃣ 对角线构图：让画面里的元素呈对角线分布，会显得更有动感，特别适合拍山脉或者海岸线~\n\n其实构图这东西没有绝对的规则，最重要的表达出你想传达的感觉！附上几张我用这些技巧拍的照片，欢迎大家一起交流~你们平时最喜欢用哪种构图？',
    authorName: '大山的风光日记',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    authorId: 103,
    category: 'experience',
    tags: ['风光', '构图', '技巧', '三分法', '引导线', '黄金螺旋'],
    imageUrls: [
      'https://picsum.photos/800/600?random=31',
      'https://picsum.photos/800/600?random=32',
      'https://picsum.photos/800/600?random=33'
    ],
    commentCount: 42,
    likeCount: 189,
    createdAt: '2023-10-13T09:20:00',
    viewCount: 1245
  },
  {
    id: 4,
    title: 'A7M4用了三个月，分享真实感受！优缺点都有~',
    summary: '从A7M3升级到A7M4三个月了，说说真实体验，给纠结要不要升级的朋友做个参考',
    content: '作为一个从A7M3升级到A7M4的用户，用了三个月想和大家聊聊真实感受~\n\n先说好的方面：\n✅ 3300万像素真的香！细节比M3好太多了，放大看睫毛都清晰~\n✅ 对焦系统真的升级了！尤其是拍娃的时候，眼部识别快准狠，再也不用担心娃跑焦了😂\n✅ 视频能力提升明显，10-bit内录色彩确实好很多\n✅ 电池续航终于给力了！出门拍一天基本不用带备用电池了\n✅ 菜单比之前好用多了，终于不用翻七八层菜单了~\n\n缺点也得说说：\n❌ 高感感觉反而不如M3，晚上拍噪点有点明显\n❌ 拍视频时间长了还是有点发热，夏天出门得带个小风扇\n❌ 价格是真的贵...钱包在滴血\n\n小技巧分享：强烈建议大家好好研究自定义按键！设置好了效率提升不是一点点~还有S-Cinetone模式直出真的好看！\n\n总体来说，如果是拍视频为主或者需要更高像素，升级还是值得的，但如果只是拍照且对像素要求不高，M3其实完全够用啦~\n\n大家有什么问题可以在评论区问我哦！',
    authorName: '器材党老王',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    authorId: 104,
    category: 'equipment',
    tags: ['索尼', 'A7M4', '器材', '微单', '使用体验', '优缺点', '视频拍摄'],
    imageUrls: [
      'https://picsum.photos/800/600?random=41'
    ],
    commentCount: 67,
    likeCount: 234,
    createdAt: '2023-10-12T14:10:00',
    viewCount: 1876
  },
  {
    id: 5,
    title: '有什么轻便三脚架推荐吗？旅行党急需！',
    summary: '每次旅行带三脚架都累成狗，求推荐轻便但稳的三脚架，预算1000左右~',
    content: '最近频繁出去旅行拍照，原来的三脚架太重了！每次背出去都像背了块砖😭有没有轻便一点但又不会太晃的三脚架推荐啊？\n\n我的基本需求：\n✨ 重量最好别超过1.5kg\n✨ 折叠后最好能塞进我的登机箱（不超过50cm）\n✨ 能架稳我的索尼+24-70镜头（大概1.8kg）\n✨ 预算大概1000块左右\n\n目前看上了曼富图Befree、富图宝X4i和思锐T-025X，有没有用过的朋友能说说真实使用感受？主要用来拍风光和夜景，有时候会延时摄影~\n\n感谢感谢！🙏',
    authorName: '背包客小张',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    authorId: 105,
    category: 'help',
    tags: ['三脚架', '旅行', '配件', '轻便', '夜景', '风光'],
    imageUrls: [],
    commentCount: 18,
    likeCount: 36,
    createdAt: '2023-10-11T11:50:00',
    viewCount: 432
  },
  {
    id: 6,
    title: '昨晚在外滩拍了灯光秀！终于赶上好天气了~',
    summary: '分享下上海外滩夜景拍摄经验，第一次拍，大家给点意见呀',
    content: '昨天晚上终于等到外滩灯光秀了！而且天气超级给力，没什么云，拍出来效果比预期好太多~开心😆\n\n分享一下我的拍摄设置：\n📷 相机：佳能EOS R6\n🔍 镜头：24-70mm F2.8\n⚙️ 参数：F8光圈 + 8秒快门 + ISO100\n⚠️ 一定要带三脚架！长曝光必备\n\n小经验分享：\n1. 用了延时快门，避免按快门的时候震动\n2. 找了个有栏杆的位置当前景，感觉画面更有层次感了\n3. 刚好赶上蓝调时分（日落后半小时左右），天空颜色超美~\n\n后期大概调了下：稍微提了点对比度和饱和度，色温调冷了点突出城市感，还压了压天空让建筑更突出~\n\n第一次认真拍城市夜景，大家有什么建议都可以提哦！希望下次能拍得更好😊',
    authorName: '城市探索者',
    authorAvatar: 'https://picsum.photos/100/100?random=6',
    authorId: 106,
    category: 'share',
    tags: ['夜景', '城市', '上海', '外滩', '灯光秀', '长曝光', '蓝调时分'],
    imageUrls: [
      'https://picsum.photos/800/600?random=61',
      'https://picsum.photos/800/600?random=62',
      'https://picsum.photos/800/600?random=63'
    ],
    commentCount: 29,
    likeCount: 87,
    createdAt: '2023-10-10T20:30:00',
    viewCount: 678
  }
];

// 模拟获取帖子详情
const fetchPostDetail = () => {
  isLoading.value = true;
  
  // 模拟延迟
  setTimeout(() => {
    try {
      // 将路由参数转换为数字类型进行查找，确保类型匹配
      const numericPostId = parseInt(postId.value);
      
      // 从统一数据源中查找对应ID的帖子
      const mockPost = mockPostsDatabase.find(post => post.id === numericPostId);
      
      // 如果找到了帖子，使用真实数据，否则使用默认数据
      if (mockPost) {
        currentPost.value = {
          ...mockPost,
          // 确保字段名统一
          imageUrls: mockPost.imageUrls || [],
          viewCount: mockPost.viewCount || 0
        };
        likeCount.value = mockPost.likeCount || 0;
        commentCount.value = mockPost.commentCount || 0;
      } else {
        // 当找不到指定ID的帖子时，提供一个有意义的默认帖子
        console.warn(`未找到ID为 ${postId.value} 的帖子，显示默认内容`);
        currentPost.value = {
          id: numericPostId,
          title: '帖子不存在',
          content: '抱歉，您查找的帖子不存在或已被删除。',
          summary: '',
          authorName: '未知用户',
          authorAvatar: 'https://picsum.photos/100/100?random=default',
          authorId: '0',
          category: 'general',
          tags: ['未知'],
          imageUrls: [],
          viewCount: 0,
          createdAt: new Date().toISOString()
        };
        likeCount.value = 0;
        commentCount.value = 0;
      }
      
      fetchComments();
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      // 错误处理
      currentPost.value = {
        id: postId.value,
        title: '加载失败',
        content: '加载帖子详情时发生错误，请稍后再试。',
        summary: '',
        authorName: '系统',
        authorAvatar: 'https://picsum.photos/100/100?random=error',
        authorId: '0',
        category: 'error',
        tags: ['错误'],
        imageUrls: [],
        viewCount: 0,
        createdAt: new Date().toISOString()
      };
      likeCount.value = 0;
      commentCount.value = 0;
      fetchComments();
    } finally {
      isLoading.value = false;
    }
  }, 300);
};

// 统一的评论数据源
const mockCommentsDatabase = {
  '1': [ // 新手选相机的帖子评论
    {
      id: 1,
      username: '摄影老司机小王',
      avatar: 'https://picsum.photos/100/100?random=101',
      content: '佳能EOS 200D II确实不错，操作简单直观，很适合新手！套机镜头日常使用足够了，如果后期有需求再考虑换镜头',
      time: '2023-10-15T11:30:00',
      likes: 12
    },
    {
      id: 2,
      username: '索尼党小李',
      avatar: 'https://picsum.photos/100/100?random=102',
      content: '个人觉得索尼A5100性价比更高，对焦快，还有翻转屏方便自拍，视频功能也不错~',
      time: '2023-10-15T12:15:00',
      likes: 8
    },
    {
      id: 3,
      username: '尼康用户小张',
      avatar: 'https://picsum.photos/100/100?random=103',
      content: 'D3500的优势是电池续航好，操作逻辑简单，新手友好度很高。缺点是视频功能一般。',
      time: '2023-10-15T13:40:00',
      likes: 5
    },
    {
      id: 4,
      username: '摄影小白成长记',
      avatar: 'https://picsum.photos/100/100?random=104',
      content: '我也是5000预算入的门，买了佳能200D II，半年了感觉很好上手！建议新手还是选操作简单的',
      time: '2023-10-15T14:22:00',
      likes: 3
    },
    {
      id: 5,
      username: '器材顾问阿强',
      avatar: 'https://picsum.photos/100/100?random=105',
      content: '其实这三个都可以，主要看你以后想往哪个方向发展。佳能色彩还原好，索尼科技感强，尼康操控感好',
      time: '2023-10-15T15:05:00',
      likes: 15
    },
    {
      id: 6,
      username: '人像摄影师阿杰',
      avatar: 'https://picsum.photos/100/100?random=106',
      content: '拍人像的话推荐佳能，色彩更讨喜，直出肤色好看',
      time: '2023-10-15T16:30:00',
      likes: 7
    }
  ],
  '2': [ // 银杏人像帖子评论
    {
      id: 1,
      username: '资深摄影师阿文',
      avatar: 'https://picsum.photos/100/100?random=201',
      content: '构图上可以尝试低角度仰拍，让天空和银杏叶形成更好的背景，也能让模特显得更修长',
      time: '2023-10-14T17:20:00',
      likes: 23
    },
    {
      id: 2,
      username: '人像爱好者小林',
      avatar: 'https://picsum.photos/100/100?random=202',
      content: '光线处理的话，可以让模特站在树荫下的光斑里，这样光线更柔和，还能拍出漂亮的光效',
      time: '2023-10-14T18:10:00',
      likes: 18
    },
    {
      id: 3,
      username: '后期师阿杰',
      avatar: 'https://picsum.photos/100/100?random=203',
      content: '金黄色调不错，建议可以稍微增加一点对比度，让画面更有层次感',
      time: '2023-10-14T19:30:00',
      likes: 14
    },
    {
      id: 4,
      username: '摄影新手小周',
      avatar: 'https://picsum.photos/100/100?random=204',
      content: '拍得好好看！请问85mm镜头在公园里会不会太长啊？会不会不好构图？',
      time: '2023-10-14T20:05:00',
      likes: 9
    },
    {
      id: 5,
      username: 'A7M3用户小陈',
      avatar: 'https://picsum.photos/100/100?random=205',
      content: '同用A7M3，请问你用的是哪个模式拍的？我也想去拍银杏',
      time: '2023-10-14T21:15:00',
      likes: 5
    },
    {
      id: 6,
      username: '模特小宁',
      avatar: 'https://picsum.photos/100/100?random=206',
      content: '请问中山公园现在银杏还多吗？想去拍照，怕错过最佳时间',
      time: '2023-10-14T22:30:00',
      likes: 7
    }
  ],
  '3': [ // 构图技巧帖子评论
    {
      id: 1,
      username: '风光新手阿虎',
      avatar: 'https://picsum.photos/100/100?random=301',
      content: '学到了！三分法我一直用不好，原来地平线放在下三分之一处效果更好',
      time: '2023-10-13T10:45:00',
      likes: 28
    },
    {
      id: 2,
      username: '旅行摄影师阿龙',
      avatar: 'https://picsum.photos/100/100?random=302',
      content: '框架式构图真的很实用，我拍长城的时候用过，效果确实不错！',
      time: '2023-10-13T11:30:00',
      likes: 32
    },
    {
      id: 3,
      username: '摄影讲师陈老师',
      avatar: 'https://picsum.photos/100/100?random=303',
      content: '补充一点：对角线构图还可以增加画面的延伸感，特别适合拍长条形的场景，比如山脉、海岸线等',
      time: '2023-10-13T12:15:00',
      likes: 45
    },
    {
      id: 4,
      username: '街拍摄影师阿杰',
      avatar: 'https://picsum.photos/100/100?random=304',
      content: '街拍我最喜欢用引导线构图，顺着街道拍过去，画面纵深感特别好',
      time: '2023-10-13T13:40:00',
      likes: 22
    },
    {
      id: 5,
      username: '建筑摄影师阿明',
      avatar: 'https://picsum.photos/100/100?random=305',
      content: '建筑摄影中，对称构图也很重要！特别是拍摄现代建筑时，对称能带来很强的视觉冲击力',
      time: '2023-10-13T14:25:00',
      likes: 19
    }
  ],
  '4': [ // A7M4使用心得帖子评论
    {
      id: 1,
      username: '观望升级用户',
      avatar: 'https://picsum.photos/100/100?random=401',
      content: '感谢分享！正在纠结要不要从A7M3升级，看来视频需求不大的话确实没必要急着升级',
      time: '2023-10-12T15:20:00',
      likes: 48
    },
    {
      id: 2,
      username: '专业视频工作者',
      avatar: 'https://picsum.photos/100/100?random=402',
      content: '视频方面，10-bit 4:2:2内录确实很香，后期调色空间大很多',
      time: '2023-10-12T16:05:00',
      likes: 35
    },
    {
      id: 3,
      username: '风光摄影师老张',
      avatar: 'https://picsum.photos/100/100?random=403',
      content: '3300万像素对风光摄影来说提升明显，可以裁剪更多细节，出大图会更清晰',
      time: '2023-10-12T17:30:00',
      likes: 29
    },
    {
      id: 4,
      username: '人像摄影师小王',
      avatar: 'https://picsum.photos/100/100?random=404',
      content: '眼部对焦确实提升了，拍好动的小孩比M3强太多了',
      time: '2023-10-12T18:45:00',
      likes: 24
    },
    {
      id: 5,
      username: '器材党老李',
      avatar: 'https://picsum.photos/100/100?random=405',
      content: '等价格降降再考虑入手，现在性价比确实不太高',
      time: '2023-10-12T19:20:00',
      likes: 31
    }
  ],
  '5': [ // 三脚架推荐帖子评论
    {
      id: 1,
      username: '经常旅行的小明',
      avatar: 'https://picsum.photos/100/100?random=501',
      content: '我用的就是曼富图Befree，1.2kg左右，折叠后40cm，正好放进登机箱！稳定性也不错',
      time: '2023-10-11T12:40:00',
      likes: 15
    },
    {
      id: 2,
      username: '风光摄影师阿杰',
      avatar: 'https://picsum.photos/100/100?random=502',
      content: '富图宝X4i性价比很高，我用了两年多了，轻便又稳定，关键价格比曼富图便宜不少',
      time: '2023-10-11T13:25:00',
      likes: 18
    },
    {
      id: 3,
      username: '夜景爱好者小张',
      avatar: 'https://picsum.photos/100/100?random=503',
      content: '思锐T-025X太轻了，风大的时候有点晃，不过如果只是偶尔用的话还是可以的',
      time: '2023-10-11T14:10:00',
      likes: 11
    }
  ],
  '6': [ // 外滩夜景帖子评论
    {
      id: 1,
      username: '上海本地人阿林',
      avatar: 'https://picsum.photos/100/100?random=601',
      content: '外滩最佳拍摄点其实是在乍浦路桥，那边拍陆家嘴全景视角更好',
      time: '2023-10-10T21:40:00',
      likes: 22
    },
    {
      id: 2,
      username: '夜景摄影师阿强',
      avatar: 'https://picsum.photos/100/100?random=602',
      content: '蓝调时分拍真的很明智！建议下次可以试试堆栈降噪，能让夜景更纯净',
      time: '2023-10-10T22:15:00',
      likes: 19
    },
    {
      id: 3,
      username: '旅行摄影师小李',
      avatar: 'https://picsum.photos/100/100?random=603',
      content: '请问现在外滩灯光秀几点开始啊？下周去上海想拍',
      time: '2023-10-10T23:00:00',
      likes: 8
    },
    {
      id: 4,
      username: '佳能用户小王',
      avatar: 'https://picsum.photos/100/100?random=604',
      content: 'R6拍夜景确实不错！F8光圈的星芒效果很好看',
      time: '2023-10-11T00:20:00',
      likes: 14
    }
  ]
};

// 模拟获取评论
const fetchComments = () => {
  try {
    // 确保使用字符串类型的键来查询评论数据
    const stringPostId = postId.value.toString();
    // 从统一评论数据源中查找对应帖子ID的评论
    const postComments = mockCommentsDatabase[stringPostId] || [];
    
    // 获取当前帖子的期望评论数量
    const numericPostId = parseInt(postId.value);
    const postData = mockPostsDatabase.find(post => post.id === numericPostId);
    const expectedCommentCount = postData?.commentCount || 0;
    
    // 如果已有评论不够，添加一些通用评论补充
    let commentsToShow = [...postComments];
    
    // 确保评论数量与帖子数据中的commentCount一致
    const generalComments = [
      { content: '感谢分享，学到了很多！', likes: Math.floor(Math.random() * 10) + 1 },
      { content: '这个主题很有意思，期待看到更多内容', likes: Math.floor(Math.random() * 10) + 1 },
      { content: '照片拍得很棒，请问用的是什么相机？', likes: Math.floor(Math.random() * 10) + 1 },
      { content: '非常实用的经验分享，已收藏！', likes: Math.floor(Math.random() * 10) + 1 }
    ];
    
    const usernameTemplates = ['摄影爱好者', '器材党', '风光大师', '人像摄影师', '后期小白', '旅行摄影', '街拍达人'];
    
    // 添加额外评论直到达到期望数量或最大评论数
    while (commentsToShow.length < expectedCommentCount && commentsToShow.length < 10) {
      const randomComment = generalComments[Math.floor(Math.random() * generalComments.length)];
      const newComment = {
        id: commentsToShow.length + 1,
        username: `${usernameTemplates[Math.floor(Math.random() * usernameTemplates.length)]}${Math.floor(Math.random() * 100)}`,
        avatar: `https://picsum.photos/100/100?random=${200 + commentsToShow.length}`,
        content: randomComment.content,
        time: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
        likes: randomComment.likes
      };
      commentsToShow.push(newComment);
    }
    
    comments.value = commentsToShow;
    
    // 确保评论计数准确
    commentCount.value = commentsToShow.length;
  } catch (error) {
    console.error('获取评论失败:', error);
    // 出错时显示一条系统评论
    comments.value = [{
      id: 1,
      username: '系统消息',
      avatar: 'https://picsum.photos/100/100?random=system',
      content: '评论加载失败，请稍后再试',
      time: new Date().toISOString(),
      likes: 0
    }];
    commentCount.value = 0;
  }
};

// 格式化帖子时间
const formatPostTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

// 格式化评论时间
const formatCommentTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
};

// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

// 收藏帖子
const collectPost = () => {
  isCollected.value = !isCollected.value;
};

// 分享帖子
const sharePost = () => {
  alert('分享功能待实现');
};

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  const newCommentObj = {
    id: Date.now(),
    username: '当前用户',
    avatar: 'https://picsum.photos/100/100?random=user',
    content: newComment.value,
    time: new Date().toISOString(),
    likes: 0
  };
  
  comments.value.unshift(newCommentObj);
  commentCount.value += 1;
  newComment.value = '';
};

// 加载更多评论
const loadMoreComments = () => {
  // 模拟加载更多评论
  setTimeout(() => {
    const moreComments = [
      {
        id: comments.value.length + 1,
        username: `更多评论用户${comments.value.length + 1}`,
        avatar: `https://picsum.photos/100/100?random=${100 + comments.value.length + 1}`,
        content: '这是一条新加载的评论内容。',
        time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
        likes: Math.floor(Math.random() * 30)
      },
      {
        id: comments.value.length + 2,
        username: `更多评论用户${comments.value.length + 2}`,
        avatar: `https://picsum.photos/100/100?random=${100 + comments.value.length + 2}`,
        content: '感谢楼主分享，很有帮助！',
        time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
        likes: Math.floor(Math.random() * 30)
      }
    ];
    
    comments.value.push(...moreComments);
    
    // 模拟没有更多评论
    if (comments.value.length >= 10) {
      hasMoreComments.value = false;
    }
  }, 800);
};

// 滚动到评论区
const scrollToComments = () => {
  document.querySelector('.comments-section').scrollIntoView({ behavior: 'smooth' });
};

// 数据加载由watch钩子处理，使用immediate:true确保组件挂载时立即获取数据

// 监听路由参数变化，重新获取数据
watch(() => postId.value, (newId, oldId) => {
  console.log(`路由参数变化：从 ${oldId} 到 ${newId}`);
  // 清除之前的数据，显示加载状态
  currentPost.value = {
    id: '',
    title: '',
    content: '',
    summary: '',
    authorName: '',
    authorAvatar: '',
    authorId: '',
    category: '',
    tags: [],
    imageUrls: [],
    viewCount: 0,
    createdAt: ''
  };
  comments.value = [];
  likeCount.value = 0;
  commentCount.value = 0;
  isLiked.value = false;
  isCollected.value = false;
  
  // 重新获取帖子数据
  fetchPostDetail();
}, { immediate: true });
</script>

<style scoped>
/* 页面布局 */
.post-detail-page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

/* 页面头部 */
.page-header {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E9ECEF;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.back-icon {
  font-size: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.action-button {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #F8F9FA;
}

.action-icon {
  font-size: 20px;
}

/* 帖子详情内容 */
.post-detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* 帖子主体 */
.post-main {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 作者信息 */
.author-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.post-time {
  font-size: 14px;
  color: #6C757D;
  margin: 0;
}

.follow-button {
  padding: 8px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #0D6EFD;
  background-color: #FFFFFF;
  color: #0D6EFD;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button:hover {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

.follow-button.following {
  border-color: #6C757D;
  color: #6C757D;
}

.follow-button.following:hover {
  background-color: #6C757D;
  color: #FFFFFF;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 24px;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.post-tag {
  font-size: 13px;
  color: #6C757D;
  background-color: #F8F9FA;
  padding: 4px 12px;
  border-radius: 12px;
}

.post-body {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
}

.post-body p {
  margin: 0 0 20px 0;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  max-height: 500px;
}

/* 互动区域 */
.interaction-bar {
  display: flex;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid #E9ECEF;
}

.interaction-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #495057;
}

.interaction-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.interaction-button.active {
  background-color: #E7F1FF;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.interaction-icon {
  font-size: 18px;
}

.interaction-text {
  font-weight: 500;
}

.interaction-count {
  font-size: 12px;
  color: #6C757D;
}

/* 评论区域 */
.comments-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 20px 0;
}

/* 评论输入框 */
.comment-input-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-input-wrapper {
  flex: 1;
  min-width: 0;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
}

.comment-input:focus {
  outline: none;
  border-color: #0D6EFD;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.comment-input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.emoji-button,
.image-button {
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  margin-right: 8px;
}

.emoji-button:hover,
.image-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.submit-comment-button {
  padding: 8px 20px;
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-comment-button:hover:not(:disabled) {
  background-color: #0B5ED7;
}

.submit-comment-button:disabled {
  background-color: #6C757D;
  cursor: not-allowed;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-username {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.comment-time {
  font-size: 12px;
  color: #6C757D;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  margin: 0 0 12px 0;
  word-wrap: break-word;
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 13px;
  color: #6C757D;
}

.comment-action:hover {
  color: #0D6EFD;
}

/* 加载更多评论 */
.load-more-comments {
  text-align: center;
  padding: 20px;
}

.load-more-comments button {
  padding: 8px 24px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s ease;
}

.load-more-comments button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-content {
    padding: 16px 16px;
  }
  
  .post-main,
  .comments-section {
    padding: 20px;
  }
  
  .post-title {
    font-size: 20px;
  }
  
  .post-images {
    grid-template-columns: 1fr;
  }
  
  .interaction-bar {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .interaction-button {
    flex: 1;
    min-width: calc(50% - 6px);
    justify-content: center;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .header-content {
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .post-detail-content {
    padding: 12px 12px;
  }
  
  .post-main,
  .comments-section {
    padding: 16px;
  }
  
  .post-title {
    font-size: 18px;
  }
  
  .post-body {
    font-size: 15px;
  }
  
  .interaction-button {
    flex: 1;
    min-width: 100%;
  }
}
</style>