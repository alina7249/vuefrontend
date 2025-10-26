<template>
  <div class="activity-detail-container">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <i class="back-icon">←</i>
      返回列表
    </button>

    <div v-if="activity" class="activity-content">
      <!-- 活动头部信息 -->
      <div class="activity-header">
        <div class="activity-image">
          <img :src="activity.imageUrl" :alt="activity.title" />
          <div 
            v-if="activity.status" 
            class="status-badge" 
            :class="activity.status"
          >
            {{ getStatusLabel(activity.status) }}
          </div>
        </div>
        
        <div class="activity-info">
          <div class="activity-category" :class="activity.category || activity.type">
            {{ activity.category ? getCategoryLabel(activity.category) : getEventTypeLabel(activity.type) }}
          </div>
          
          <h1 class="activity-title">{{ activity.title }}</h1>
          
          <div class="activity-meta">
            <div class="meta-item" v-if="isCompetition">
                <span class="meta-label">开始日期:</span>
                <span class="meta-value">{{ formatDate(activity.startDate) }}</span>
              </div>
              <div class="meta-item" v-if="isCompetition">
                <span class="meta-label">结束日期:</span>
                <span class="meta-value">{{ formatDate(activity.endDate) }}</span>
              </div>
              <div class="meta-item" v-if="!isCompetition">
                <span class="meta-label">时间:</span>
                <span class="meta-value">{{ formatDateTime(activity.dateTime) }}</span>
              </div>
              <div class="meta-item" v-if="!isCompetition">
                <span class="meta-label">地点:</span>
                <span class="meta-value">{{ getLocationLabel(activity.location) }} · {{ activity.address }}</span>
              </div>
          </div>
          
          <div class="activity-stats">
            <div v-if="isCompetition" class="stat-item">
              <i class="participant-icon">👥</i>
              {{ activity.participants }} 人参与
            </div>
            <div v-if="isCompetition" class="stat-item">
              <i class="submission-icon">📷</i>
              {{ activity.submissions }} 件作品
            </div>
            <div v-else class="stat-item">
              <i class="people-icon">👥</i>
              {{ activity.participants }}/{{ activity.maxParticipants }} 人
            </div>
            <div v-if="activity.price > 0" class="stat-item">
              <i class="price-icon">💰</i>
              ¥{{ activity.price }}
            </div>
            <div v-else-if="!isCompetition" class="stat-item free">
              <i class="free-icon">🎟️</i>
              免费
            </div>
          </div>
          
          <div class="activity-actions">
            <button 
              v-if="isCompetition && activity.status === 'ongoing'" 
              class="join-button" 
              @click="joinActivity"
            >
              立即参与
            </button>
            <button 
              v-else-if="!isCompetition && ['upcoming', 'ongoing'].includes(activity.status)" 
              class="join-button" 
              @click="joinActivity"
            >
              报名参加
            </button>
          </div>
        </div>
      </div>
      
      <!-- 活动详情选项卡 -->
      <div class="activity-tabs">
        <div class="tab-button" :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">
          活动详情
        </div>
        <div class="tab-button" :class="{ active: activeTab === 'requirements' }" @click="activeTab = 'requirements'">
          {{ isCompetition ? '参赛要求' : '参与须知' }}
        </div>
        <div class="tab-button" :class="{ active: activeTab === 'winners' }" @click="activeTab = 'winners'" v-if="isCompetition">
          获奖作品
        </div>
      </div>
      
      <!-- 选项卡内容 -->
      <div class="tab-content">
        <!-- 活动详情 -->
        <div v-if="activeTab === 'description'" class="description-tab">
          <div class="description-content">
            {{ activity.description }}
          </div>
          
          <!-- 比赛特有的详情 -->
          <div v-if="isCompetition" class="competition-details">
            <div class="detail-section">
              <h3>奖项设置</h3>
              <ul class="awards-list">
                <li v-for="award in activity.awards" :key="award.name" class="award-item">
                  <div class="award-name">{{ award.name }}</div>
                  <div class="award-description">{{ award.description }}</div>
                </li>
              </ul>
            </div>
            
            <div class="detail-section" v-if="activity.judges && activity.judges.length">
              <h3>评委介绍</h3>
              <div class="judges-list">
                <div v-for="judge in activity.judges" :key="judge.id" class="judge-item">
                  <div class="judge-avatar">
                    <img :src="judge.avatar" :alt="judge.name" />
                  </div>
                  <div class="judge-info">
                    <div class="judge-name">{{ judge.name }}</div>
                    <div class="judge-title">{{ judge.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 线下活动特有的详情 -->
          <div v-else class="event-details">
            <div class="detail-section">
              <h3>活动流程</h3>
              <ul class="schedule-list">
                <li v-for="(schedule, index) in activity.schedule" :key="index" class="schedule-item">
                  <div class="schedule-time">{{ schedule.time }}</div>
                  <div class="schedule-content">{{ schedule.content }}</div>
                </li>
              </ul>
            </div>
            
            <div class="detail-section" v-if="activity.organizers && activity.organizers.length">
              <h3>主办方</h3>
              <div class="organizers-list">
                <div v-for="(organizer, index) in activity.organizers" :key="index" class="organizer-item">
                  {{ organizer.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 参赛要求/参与须知 -->
        <div v-if="activeTab === 'requirements'" class="requirements-tab">
          <ul class="requirements-list">
            <li v-for="(requirement, index) in activity.requirements" :key="index" class="requirement-item">
              {{ requirement }}
            </li>
          </ul>
        </div>
        
        <!-- 获奖作品（仅比赛） -->
        <div v-if="activeTab === 'winners'" class="winners-tab">
          <div v-if="activity.winners && activity.winners.length" class="winners-gallery">
            <div v-for="winner in activity.winners" :key="winner.id" class="winner-item">
              <div class="winner-image">
                <img :src="winner.imageUrl" :alt="winner.title" />
              </div>
              <div class="winner-info">
                <div class="winner-title">{{ winner.title }}</div>
                <div class="winner-author">{{ winner.author }}</div>
                <div class="winner-award">{{ winner.award }}</div>
              </div>
            </div>
          </div>
          <div v-else class="no-winners">
            暂无获奖作品信息
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeTab = ref('description');
const activity = ref(null);
const isLoading = ref(true);
const activityType = ref(''); // 'competition' 或 'event'

// 判断当前活动是比赛还是线下活动
const isCompetition = computed(() => activityType.value === 'competition');

// 获取分类标签
const getCategoryLabel = (category) => {
  const labels = {
    landscape: '风光',
    portrait: '人像',
    street: '街拍',
    architecture: '建筑',
    wildlife: '生态',
    abstract: '抽象'
  };
  return labels[category] || category;
};

// 获取活动类型标签
const getEventTypeLabel = (type) => {
  const labels = {
    outing: '外拍活动',
    workshop: '摄影工作坊',
    seminar: '讲座',
    exhibition: '展览'
  };
  return labels[type] || type;
};

// 获取地点标签
const getLocationLabel = (location) => {
  const labels = {
    beijing: '北京',
    shanghai: '上海',
    guangzhou: '广州',
    shenzhen: '深圳',
    hangzhou: '杭州',
    chengdu: '成都'
  };
  return labels[location] || location;
};

// 获取状态标签
const getStatusLabel = (status) => {
  const labels = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束',
    past: '已结束'
  };
  return labels[status] || status;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 返回列表页
const goBack = () => {
  router.push('/activities');
};

// 参与活动
const joinActivity = () => {
  if (isCompetition.value) {
    alert(`已成功参与比赛：${activity.value.title}`);
  } else {
    alert(`已成功报名活动：${activity.value.title}`);
  }
};

// 获取活动详情数据
const fetchActivityDetail = () => {
  const activityId = parseInt(route.params.id);
  const activityTypeFromRoute = route.params.type || 'competition';
  activityType.value = activityTypeFromRoute;
  
  // 模拟数据 - 实际应用中应该从API获取
  if (activityTypeFromRoute === 'competition') {
    // 模拟比赛数据
    const mockCompetitions = [
      {
        id: 1,
        title: '2023风光摄影大赛',
        category: 'landscape',
        imageUrl: 'https://picsum.photos/800/400?random=101',
        status: 'ongoing',
        startDate: '2023-06-01',
        endDate: '2023-12-31',
        participants: 542,
        submissions: 1289,
        description: '本次风光摄影大赛旨在展现自然界的壮丽景色和人文风光，欢迎所有摄影爱好者参与投稿。无论是山脉、湖泊、森林，还是城市风光，都可以作为参赛作品。',
        awards: [
          {
            name: '金奖',
            description: '奖金5000元 + 摄影器材礼包'
          },
          {
            name: '银奖',
            description: '奖金3000元 + 摄影配件'
          },
          {
            name: '铜奖',
            description: '奖金1000元 + 精美礼品'
          },
          {
            name: '优秀奖',
            description: '证书 + 纪念品'
          }
        ],
        judges: [
          {
            id: 1,
            name: '张大山',
            title: '国家地理摄影师',
            avatar: 'https://picsum.photos/100/100?random=1001'
          },
          {
            id: 2,
            name: '李明',
            title: '摄影协会主席',
            avatar: 'https://picsum.photos/100/100?random=1002'
          }
        ],
        requirements: [
          '参赛作品必须为原创，严禁抄袭或盗用他人作品',
          '每位参赛者最多可提交5幅作品',
          '作品格式为JPG，单张大小不超过10MB',
          '可以进行适当的后期处理，但不得改变原始场景的真实性',
          '提交作品即表示同意主办方拥有作品的展示权',
          '获奖者需提供原始文件以供验证'
        ],
        winners: []
      },
      {
        id: 2,
        title: '城市人文摄影展',
        category: 'street',
        imageUrl: 'https://picsum.photos/800/400?random=102',
        status: 'upcoming',
        startDate: '2023-09-01',
        endDate: '2024-02-28',
        participants: 128,
        submissions: 0,
        description: '城市人文摄影展聚焦现代城市中的人文故事和生活瞬间，通过镜头记录城市的多样性和人文关怀。',
        awards: [
          {
            name: '最佳人文奖',
            description: '奖金3000元 + 摄影展画册'
          },
          {
            name: '新锐摄影师奖',
            description: '奖金2000元 + 摄影器材券'
          },
          {
            name: '人气奖',
            description: '奖金1000元 + 纪念品'
          }
        ],
        judges: [
          {
            id: 3,
            name: '王小红',
            title: '人文摄影师',
            avatar: 'https://picsum.photos/100/100?random=1003'
          }
        ],
        requirements: [
          '参赛作品需反映城市人文主题',
          '每位参赛者最多提交8幅作品',
          '可以是单张照片或系列作品',
          '提交时需附带简短的作品说明'
        ],
        winners: []
      },
      {
        id: 3,
        title: '人像摄影大师赛',
        category: 'portrait',
        imageUrl: 'https://picsum.photos/800/400?random=103',
        status: 'ended',
        startDate: '2023-01-01',
        endDate: '2023-05-31',
        participants: 892,
        submissions: 2456,
        description: '人像摄影大师赛致力于发掘优秀的人像摄影作品，展现人物的情感与故事。',
        awards: [
          {
            name: '金奖',
            description: '奖金8000元 + 专业摄影器材'
          },
          {
            name: '银奖',
            description: '奖金5000元 + 摄影课程'
          },
          {
            name: '铜奖',
            description: '奖金3000元 + 摄影配件'
          }
        ],
        judges: [
          {
            id: 4,
            name: '刘佳',
            title: '人像摄影大师',
            avatar: 'https://picsum.photos/100/100?random=1004'
          },
          {
            id: 5,
            name: '陈明',
            title: '时尚摄影师',
            avatar: 'https://picsum.photos/100/100?random=1005'
          }
        ],
        requirements: [
          '参赛作品必须以人物为主题',
          '需获得被摄者的肖像授权',
          '可以是单个人物或群体人像',
          '作品需体现人物性格和情感'
        ],
        winners: [
          {
            id: 101,
            title: '岁月痕迹',
            imageUrl: 'https://picsum.photos/400/400?random=1101',
            author: '张华',
            award: '金奖'
          },
          {
            id: 102,
            title: '城市守护者',
            imageUrl: 'https://picsum.photos/400/400?random=1102',
            author: '李强',
            award: '银奖'
          },
          {
            id: 103,
            title: '童真',
            imageUrl: 'https://picsum.photos/400/400?random=1103',
            author: '王丽',
            award: '铜奖'
          }
        ]
      }
    ];
    
    activity.value = mockCompetitions.find(comp => comp.id === activityId);
  } else {
    // 模拟线下活动数据
    const mockEvents = [
      {
        id: 101,
        title: '金秋银杏外拍活动',
        type: 'outing',
        imageUrl: 'https://picsum.photos/800/400?random=201',
        status: 'upcoming',
        dateTime: '2023-11-15T14:00:00',
        location: 'beijing',
        address: '奥林匹克森林公园',
        participants: 42,
        maxParticipants: 100,
        price: 0,
        description: '秋天是摄影的黄金季节，让我们一起前往奥林匹克森林公园，捕捉金黄色银杏叶的美丽瞬间。活动将有专业摄影师带队指导，适合各个水平的摄影爱好者参加。',
        schedule: [
          { time: '14:00', content: '集合签到，简单介绍' },
          { time: '14:30', content: '摄影技巧分享' },
          { time: '15:00', content: '分组外拍' },
          { time: '17:30', content: '作品点评与交流' },
          { time: '18:30', content: '活动结束' }
        ],
        organizers: [
          { name: '摄影爱好者协会' },
          { name: '北京市园林局' }
        ],
        requirements: [
          '自备摄影器材',
          '建议穿着舒适的鞋子',
          '活动当天请准时到达集合地点',
          '注意环保，不要随意丢弃垃圾',
          '尊重公园规定，不要践踏草坪',
          '活动风雨无阻，如有特殊情况会提前通知'
        ]
      },
      {
        id: 102,
        title: '人像摄影工作坊',
        type: 'workshop',
        imageUrl: 'https://picsum.photos/800/400?random=202',
        status: 'ongoing',
        dateTime: '2023-10-20T10:00:00',
        location: 'shanghai',
        address: '上海摄影中心',
        participants: 15,
        maxParticipants: 20,
        price: 299,
        description: '本工作坊将由资深人像摄影师张老师亲自指导，教授室内外人像摄影技巧、灯光布置、模特引导等实用内容。小班教学，确保每位学员都能得到充分的指导和实践机会。',
        schedule: [
          { time: '10:00', content: '工作坊介绍，基础知识讲解' },
          { time: '11:00', content: '室内人像拍摄技巧' },
          { time: '12:00', content: '午餐休息' },
          { time: '13:30', content: '模特引导技巧' },
          { time: '15:00', content: '实战拍摄练习' },
          { time: '17:00', content: '作品点评与总结' }
        ],
        organizers: [
          { name: '上海摄影培训中心' }
        ],
        requirements: [
          '自备相机及基本配件',
          '建议携带笔记本记录',
          '提前安装好后期软件',
          '有一定的摄影基础'
        ]
      },
      {
        id: 103,
        title: '风光摄影讲座',
        type: 'seminar',
        imageUrl: 'https://picsum.photos/800/400?random=203',
        status: 'past',
        dateTime: '2023-09-10T19:00:00',
        location: 'guangzhou',
        address: '广州图书馆',
        participants: 180,
        maxParticipants: 200,
        price: 0,
        description: '本次讲座邀请到国际知名风光摄影师李老师，分享他20年的摄影经验和创作心得。内容包括风光摄影的构图技巧、光线运用、后期处理等方面，适合所有对风光摄影感兴趣的朋友参加。',
        schedule: [
          { time: '19:00', content: '嘉宾介绍' },
          { time: '19:10', content: '李老师个人摄影经历分享' },
          { time: '19:40', content: '风光摄影构图与光线' },
          { time: '20:30', content: '作品展示与创作思路解析' },
          { time: '21:10', content: '互动问答环节' },
          { time: '21:40', content: '讲座结束' }
        ],
        organizers: [
          { name: '广州图书馆' },
          { name: '广东省摄影家协会' }
        ],
        requirements: [
          '提前报名，凭票入场',
          '讲座期间请保持安静',
          '拍照时请勿使用闪光灯',
          '讲座内容未经许可不得录音录像'
        ]
      }
    ];
    
    activity.value = mockEvents.find(event => event.id === activityId);
  }
  
  isLoading.value = false;
};

onMounted(() => {
  fetchActivityDetail();
});
</script>

<style scoped>
.activity-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.activity-header {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.activity-image {
  position: relative;
  height: 300px;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-badge.ongoing,
.status-badge.upcoming {
  background-color: #4caf50;
}

.status-badge.ended,
.status-badge.past {
  background-color: #9e9e9e;
}

.activity-info {
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  margin-bottom: 15px;
  white-space: nowrap;
}

.activity-category.landscape {
  background-color: #4caf50;
}

.activity-category.portrait {
  background-color: #ff9800;
}

.activity-category.street {
  background-color: #2196f3;
}

.activity-category.architecture {
  background-color: #9c27b0;
}

.activity-category.wildlife {
  background-color: #009688;
}

.activity-category.abstract {
  background-color: #673ab7;
}

.activity-category.outing {
  background-color: #8bc34a;
}

.activity-category.workshop {
  background-color: #ff5722;
}

.activity-category.seminar {
  background-color: #3f51b5;
}

.activity-category.exhibition {
  background-color: #e91e63;
}

.activity-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  color: #666;
  margin-right: 5px;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

.activity-stats {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.stat-item .stat-icon {
  font-size: 1.2rem;
}

.stat-item.free {
  color: #4caf50;
}

.activity-actions {
  margin-top: auto;
}

.join-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.join-button:hover {
  background-color: #1976d2;
}

.activity-tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 30px;
}

.tab-button {
  padding: 12px 25px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #2196f3;
}

.tab-button.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.tab-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.description-content {
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.awards-list {
  list-style: none;
  padding: 0;
}

.award-item {
  padding: 15px;
  border-left: 4px solid #2196f3;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 0 4px 4px 0;
}

.award-name {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.award-description {
  color: #666;
}

.judges-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.judge-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.judge-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.judge-name {
  font-weight: 500;
  color: #333;
}

.judge-title {
  color: #666;
  font-size: 0.9rem;
}

.schedule-list {
  list-style: none;
  padding: 0;
}

.schedule-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
}

.schedule-item:last-child {
  border-bottom: none;
}

.schedule-time {
  font-weight: 500;
  color: #2196f3;
}

.schedule-content {
  color: #333;
}

.organizers-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.organizer-item {
  background-color: #f9f9f9;
  padding: 10px 20px;
  border-radius: 20px;
  color: #666;
}

.requirements-list {
  list-style-type: disc;
  padding-left: 20px;
}

.requirement-item {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #333;
}

.winners-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.winner-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.winner-item:hover {
  transform: translateY(-5px);
}

.winner-image {
  height: 200px;
  overflow: hidden;
}

.winner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.winner-item:hover .winner-image img {
  transform: scale(1.05);
}

.winner-info {
  padding: 15px;
}

.winner-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.winner-author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.winner-award {
  color: #ff9800;
  font-weight: 500;
  font-size: 0.9rem;
}

.no-winners {
  text-align: center;
  color: #666;
  padding: 40px 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-header {
    grid-template-columns: 1fr;
  }
  
  .activity-image {
    height: 200px;
  }
  
  .activity-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .activity-stats {
    gap: 15px;
  }
  
  .activity-tabs {
    overflow-x: auto;
  }
  
  .tab-button {
    padding: 10px 15px;
    white-space: nowrap;
  }
  
  .winners-gallery {
    grid-template-columns: 1fr;
  }
  
  .schedule-item {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
</style>