<template>
  <div class="activities-container">
    <!-- 活动赛事头部 -->
    <div class="activities-header">
      <h1>活动赛事</h1>
      <p>探索摄影赛事与线下活动，提升你的摄影技能</p>
    </div>
    
    <!-- 活动赛事导航 -->
    <div class="activities-nav">
      <button
        v-for="tab in activitiesTabs"
        :key="tab.value"
        class="nav-tab"
        :class="{ active: currentTab === tab.value }"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 在线比赛区域 -->
    <div v-if="currentTab === 'competitions'" class="competitions-section">
      <div class="competitions-header">
        <h2>在线比赛</h2>
        <div class="competitions-filters">
          <div class="filter-group">
            <label>状态:</label>
            <select v-model="competitionStatus" class="filter-select">
              <option value="all">全部状态</option>
              <option value="ongoing">进行中</option>
              <option value="upcoming">即将开始</option>
              <option value="ended">已结束</option>
            </select>
          </div>
          <div class="filter-group">
            <label>类型:</label>
            <select v-model="competitionType" class="filter-select">
              <option value="all">全部类型</option>
              <option value="landscape">风光</option>
              <option value="portrait">人像</option>
              <option value="street">街拍</option>
              <option value="architecture">建筑</option>
              <option value="wildlife">生态</option>
              <option value="abstract">抽象</option>
            </select>
          </div>
          <div class="filter-group">
            <label>排序:</label>
            <select v-model="competitionSort" class="filter-select">
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="end_soon">即将结束</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="competitionSearch" placeholder="搜索比赛..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="competitions-grid">
        <div v-for="competition in competitionsData" :key="competition.id" class="competition-card">
          <div class="competition-image">
            <img :src="competition.imageUrl" :alt="competition.title" />
            <div v-if="competition.status === 'ongoing'" class="status-badge ongoing">进行中</div>
            <div v-else-if="competition.status === 'upcoming'" class="status-badge upcoming">即将开始</div>
            <div v-else class="status-badge ended">已结束</div>
          </div>
          
          <div class="competition-info">
            <div class="competition-category" :class="competition.category">
              {{ getCategoryLabel(competition.category) }}
            </div>
            
            <h3 class="competition-title">{{ competition.title }}</h3>
            
            <div class="competition-dates">
              <div class="date-item">
                <span class="date-label">开始日期:</span>
                <span class="date-value">{{ formatDate(competition.startDate) }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">结束日期:</span>
                <span class="date-value" :class="{ ending: isEndingSoon(competition.endDate) }">
                  {{ formatDate(competition.endDate) }}
                </span>
              </div>
            </div>
            
            <div class="competition-stats">
              <div class="stat-item">
                <i class="participant-icon">👥</i>
                {{ competition.participants }} 人参与
              </div>
              <div class="stat-item">
                <i class="submission-icon">📷</i>
                {{ competition.submissions }} 件作品
              </div>
            </div>
            
            <div class="competition-actions">
              <button v-if="competition.status === 'ongoing'" class="join-button" @click="joinCompetition(competition.id)">
                立即参与
              </button>
              <button v-else class="view-button" @click="viewCompetition(competition.id)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 线下活动区域 -->
    <div v-else-if="currentTab === 'events'" class="events-section">
      <div class="events-header">
        <h2>线下活动</h2>
        <button class="publish-button" @click="publishEvent">发布活动</button>
      </div>
      
      <div class="events-filters">
        <div class="filter-group">
          <label>类型:</label>
          <select v-model="eventType" class="filter-select">
            <option value="all">全部类型</option>
            <option value="outing">外拍活动</option>
            <option value="workshop">摄影工作坊</option>
            <option value="seminar">讲座</option>
            <option value="exhibition">展览</option>
          </select>
        </div>
        <div class="filter-group">
          <label>地点:</label>
          <select v-model="eventLocation" class="filter-select">
            <option value="all">全部地点</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="guangzhou">广州</option>
            <option value="shenzhen">深圳</option>
            <option value="hangzhou">杭州</option>
            <option value="chengdu">成都</option>
          </select>
        </div>
        <div class="filter-group">
          <label>状态:</label>
          <select v-model="eventStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="upcoming">即将开始</option>
            <option value="ongoing">进行中</option>
            <option value="past">已结束</option>
          </select>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="eventSearch" placeholder="搜索活动..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="events-grid">
        <div v-for="event in eventsData" :key="event.id" class="event-card" :class="{ past: event.status === 'past' }">
          <div class="event-image">
            <img :src="event.imageUrl" :alt="event.title" />
            <div v-if="event.status === 'upcoming'" class="status-badge upcoming">即将开始</div>
            <div v-else-if="event.status === 'ongoing'" class="status-badge ongoing">进行中</div>
            <div v-else class="status-badge ended">已结束</div>
          </div>
          
          <div class="event-info">
            <div class="event-type" :class="event.type">
              {{ getEventTypeLabel(event.type) }}
            </div>
            
            <h3 class="event-title">{{ event.title }}</h3>
            
            <div class="event-details">
              <div class="detail-item">
                <i class="calendar-icon">📅</i>
                <span>{{ formatDateTime(event.dateTime) }}</span>
              </div>
              <div class="detail-item">
                <i class="location-icon">📍</i>
                <span>{{ getLocationLabel(event.location) }} · {{ event.address }}</span>
              </div>
              <div class="detail-item">
                <i class="people-icon">👥</i>
                <span>{{ event.participants }}/{{ event.maxParticipants }} 人</span>
              </div>
              <div class="detail-item" v-if="event.price > 0">
                <i class="price-icon">💰</i>
                <span>¥{{ event.price }}/人</span>
              </div>
              <div class="detail-item" v-else>
                <i class="free-icon">🆓</i>
                <span>免费</span>
              </div>
            </div>
            
            <div class="event-actions">
              <button v-if="event.status === 'upcoming'" class="register-button" @click="registerEvent(event.id)"
                :disabled="event.participants >= event.maxParticipants">
                {{ event.participants >= event.maxParticipants ? '名额已满' : '立即报名' }}
              </button>
              <button v-else class="view-button" @click="viewEvent(event.id)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 获奖展厅区域 -->
    <div v-else-if="currentTab === 'winners'" class="winners-section">
      <div class="winners-header">
        <h2>获奖展厅</h2>
        <p>欣赏历届比赛的获奖作品，了解创作者的思路</p>
      </div>
      
      <div class="winners-filters">
        <div class="filter-group">
          <label>赛事:</label>
          <select v-model="winnerCompetition" class="filter-select">
            <option value="all">全部赛事</option>
            <option value="seasonal">四季摄影大赛</option>
            <option value="street">城市街拍大赛</option>
            <option value="nature">自然生态摄影展</option>
            <option value="portrait">人像摄影挑战赛</option>
          </select>
        </div>
        <div class="filter-group">
          <label>奖项:</label>
          <select v-model="winnerAward" class="filter-select">
            <option value="all">全部奖项</option>
            <option value="first">金奖</option>
            <option value="second">银奖</option>
            <option value="third">铜奖</option>
            <option value="excellence">优秀奖</option>
            <option value="popular">人气奖</option>
          </select>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="winnerSearch" placeholder="搜索获奖作品..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="winners-grid">
        <div v-for="winner in winnersData" :key="winner.id" class="winner-card">
          <div class="winner-image">
            <img :src="winner.imageUrl" :alt="winner.title" />
            <div class="winner-rank" :class="winner.rank">
              {{ getRankLabel(winner.rank) }}
            </div>
          </div>
          
          <div class="winner-info">
            <h3 class="winner-title">{{ winner.title }}</h3>
            
            <div class="winner-author">
              <img :src="winner.authorAvatar" :alt="winner.authorName" class="author-avatar" />
              <div class="author-info">
                <span class="author-name">{{ winner.authorName }}</span>
                <span class="author-location">{{ winner.authorLocation }}</span>
              </div>
            </div>
            
            <div class="winner-competition">
              <span class="competition-name">{{ winner.competitionName }}</span>
              <span class="competition-year">{{ winner.competitionYear }}</span>
            </div>
            
            <div class="winner-actions">
              <button class="view-button" @click="viewWinner(winner.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 活动日历区域 -->
    <div v-else-if="currentTab === 'calendar'" class="calendar-section">
      <div class="calendar-header">
        <h2>活动日历</h2>
        <p>查看未来的摄影活动和赛事安排</p>
      </div>
      
      <div class="calendar-controls">
        <button class="calendar-nav-button" @click="prevMonth">上个月</button>
        <h3 class="current-month">{{ formatMonth(currentDate) }}</h3>
        <button class="calendar-nav-button" @click="nextMonth">下个月</button>
      </div>
      
      <div class="calendar-grid">
        <!-- 星期标题 -->
        <div class="calendar-weekdays">
          <div class="weekday">日</div>
          <div class="weekday">一</div>
          <div class="weekday">二</div>
          <div class="weekday">三</div>
          <div class="weekday">四</div>
          <div class="weekday">五</div>
          <div class="weekday">六</div>
        </div>
        
        <!-- 日期格子 -->
        <div class="calendar-days">
          <!-- 上个月的日期 -->
          <div v-for="emptyDay in emptyDays" :key="`empty-${emptyDay}`" class="calendar-day empty"></div>
          
          <!-- 当前月的日期 -->
          <div v-for="day in daysInMonth" :key="day" class="calendar-day"
            :class="{ today: isToday(day), hasEvent: hasEventsOnDay(day), registered: isRegisteredOnDay(day) }"
            @click="selectDay(day)">
            <span class="day-number">{{ day }}</span>
            <div v-if="hasEventsOnDay(day)" class="day-events">
              <div v-for="event in getEventsOnDay(day).slice(0, 2)" :key="event.id" class="day-event"
                :class="event.type">
                {{ event.type === 'competition' ? '🏆' : '📷' }}
              </div>
              <div v-if="getEventsOnDay(day).length > 2" class="day-event more">
                +{{ getEventsOnDay(day).length - 2 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 选中日期的活动详情 -->
      <div v-if="selectedDate" class="selected-day-events">
        <h3 class="selected-date-header">{{ formatSelectedDate(selectedDate) }} 的活动</h3>
        <div v-if="getEventsOnDay(selectedDate).length === 0" class="no-events">
          <p>当天没有活动</p>
        </div>
        <div v-else class="events-list">
          <div v-for="event in getEventsOnDay(selectedDate)" :key="event.id" class="event-item">
            <div class="event-item-time">{{ formatEventTime(event) }}</div>
            <div class="event-item-info">
              <div class="event-item-title">{{ event.title }}</div>
              <div class="event-item-details">{{ event.details }}</div>
            </div>
            <div class="event-item-actions">
              <button v-if="event.isRegistered" class="registered-button" disabled>
                已报名
              </button>
              <button v-else-if="event.canRegister" class="register-button" @click="registerEventFromCalendar(event.id)">
                立即报名
              </button>
              <button v-else class="view-button" @click="viewEventFromCalendar(event.id)">
                查看
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 活动赛事标签页
const currentTab = ref('competitions');
const activitiesTabs = [
  { label: '在线比赛', value: 'competitions' },
  { label: '线下活动', value: 'events' },
  { label: '获奖展厅', value: 'winners' },
  { label: '活动日历', value: 'calendar' },
];

// 在线比赛筛选
const competitionStatus = ref('all');
const competitionType = ref('all');
const competitionSort = ref('latest');
const competitionSearch = ref('');

// 线下活动筛选
const eventType = ref('all');
const eventLocation = ref('all');
const eventStatus = ref('all');
const eventSearch = ref('');

// 获奖展厅筛选
const winnerCompetition = ref('all');
const winnerAward = ref('all');
const winnerSearch = ref('');

// 分页
const currentPage = ref(1);
const totalPages = ref(10);

// 活动日历
const currentDate = ref(new Date());
const selectedDate = ref(null);

// 分类标签映射
const getCategoryLabel = (category) => {
  const labels = {
    landscape: '风光',
    portrait: '人像',
    street: '街拍',
    architecture: '建筑',
    wildlife: '生态',
    abstract: '抽象',
  };
  return labels[category] || category;
};

// 活动类型标签映射
const getEventTypeLabel = (type) => {
  const labels = {
    outing: '外拍活动',
    workshop: '摄影工作坊',
    seminar: '讲座',
    exhibition: '展览',
  };
  return labels[type] || type;
};

// 地点标签映射
const getLocationLabel = (location) => {
  const labels = {
    beijing: '北京',
    shanghai: '上海',
    guangzhou: '广州',
    shenzhen: '深圳',
    hangzhou: '杭州',
    chengdu: '成都',
  };
  return labels[location] || location;
};

// 排名标签映射
const getRankLabel = (rank) => {
  const labels = {
    first: '金奖',
    second: '银奖',
    third: '铜奖',
    excellence: '优秀奖',
    popular: '人气奖',
  };
  return labels[rank] || rank;
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 格式化日期时间
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 格式化月份
const formatMonth = (date) => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

// 格式化选中的日期
const formatSelectedDate = (day) => {
  const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 格式化活动时间
const formatEventTime = (event) => {
  if (event.type === 'competition') {
    return '全天';
  }
  const date = new Date(event.dateTime);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 检查是否即将结束
const isEndingSoon = (endDateString) => {
  const endDate = new Date(endDateString);
  const now = new Date();
  const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

// 模拟在线比赛数据
const competitionsData = ref([
  {
    id: 1,
    title: '2024春季风光摄影大赛',
    category: 'landscape',
    imageUrl: 'https://picsum.photos/600/400?random=101',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'ongoing',
    participants: 1256,
    submissions: 3428,
  },
  {
    id: 2,
    title: '城市人文街拍挑战赛',
    category: 'street',
    imageUrl: 'https://picsum.photos/600/400?random=102',
    startDate: '2024-04-15',
    endDate: '2024-06-15',
    status: 'ongoing',
    participants: 892,
    submissions: 2105,
  },
  {
    id: 3,
    title: '人像摄影艺术展',
    category: 'portrait',
    imageUrl: 'https://picsum.photos/600/400?random=103',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'upcoming',
    participants: 0,
    submissions: 0,
  },
  {
    id: 4,
    title: '建筑摄影大奖赛',
    category: 'architecture',
    imageUrl: 'https://picsum.photos/600/400?random=104',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
    status: 'ended',
    participants: 785,
    submissions: 1982,
  },
  {
    id: 5,
    title: '自然生态摄影展',
    category: 'wildlife',
    imageUrl: 'https://picsum.photos/600/400?random=105',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status: 'ongoing',
    participants: 654,
    submissions: 1542,
  },
  {
    id: 6,
    title: '抽象摄影创意大赛',
    category: 'abstract',
    imageUrl: 'https://picsum.photos/600/400?random=106',
    startDate: '2024-03-15',
    endDate: '2024-05-15',
    status: 'ongoing',
    participants: 423,
    submissions: 987,
  },
]);

// 模拟线下活动数据
const eventsData = ref([
  {
    id: 101,
    title: '北京春季外拍活动',
    type: 'outing',
    imageUrl: 'https://picsum.photos/600/400?random=201',
    dateTime: '2024-04-20T10:00:00',
    location: 'beijing',
    address: '奥林匹克森林公园',
    price: 99,
    participants: 35,
    maxParticipants: 50,
    status: 'upcoming',
  },
  {
    id: 102,
    title: '上海人像摄影工作坊',
    type: 'workshop',
    imageUrl: 'https://picsum.photos/600/400?random=202',
    dateTime: '2024-04-27T13:30:00',
    location: 'shanghai',
    address: '静安区摄影中心',
    price: 299,
    participants: 28,
    maxParticipants: 30,
    status: 'upcoming',
  },
  {
    id: 103,
    title: '广州摄影后期讲座',
    type: 'seminar',
    imageUrl: 'https://picsum.photos/600/400?random=203',
    dateTime: '2024-05-05T14:00:00',
    location: 'guangzhou',
    address: '天河区图书馆',
    price: 0,
    participants: 85,
    maxParticipants: 100,
    status: 'upcoming',
  },
  {
    id: 104,
    title: '深圳国际摄影展览',
    type: 'exhibition',
    imageUrl: 'https://picsum.photos/600/400?random=204',
    dateTime: '2024-04-10T09:00:00',
    location: 'shenzhen',
    address: '深圳当代艺术博物馆',
    price: 80,
    participants: 0,
    maxParticipants: 1000,
    status: 'ongoing',
  },
  {
    id: 105,
    title: '杭州西湖日出外拍',
    type: 'outing',
    imageUrl: 'https://picsum.photos/600/400?random=205',
    dateTime: '2024-05-12T05:30:00',
    location: 'hangzhou',
    address: '西湖断桥',
    price: 50,
    participants: 22,
    maxParticipants: 30,
    status: 'upcoming',
  },
  {
    id: 106,
    title: '成都夜景摄影 workshop',
    type: 'workshop',
    imageUrl: 'https://picsum.photos/600/400?random=206',
    dateTime: '2024-05-18T19:00:00',
    location: 'chengdu',
    address: '春熙路',
    price: 199,
    participants: 18,
    maxParticipants: 25,
    status: 'upcoming',
  },
]);

// 模拟获奖作品数据
const winnersData = ref([
  {
    id: 201,
    title: '山间云雾',
    imageUrl: 'https://picsum.photos/600/400?random=301',
    rank: 'first',
    authorName: '张明',
    authorAvatar: 'https://picsum.photos/100/100?random=20',
    authorLocation: '黄山',
    competitionName: '四季摄影大赛',
    competitionYear: '2023冬季',
  },
  {
    id: 202,
    title: '城市之光',
    imageUrl: 'https://picsum.photos/600/400?random=302',
    rank: 'second',
    authorName: '李华',
    authorAvatar: 'https://picsum.photos/100/100?random=21',
    authorLocation: '上海',
    competitionName: '城市街拍大赛',
    competitionYear: '2023',
  },
  {
    id: 203,
    title: '生命的力量',
    imageUrl: 'https://picsum.photos/600/400?random=303',
    rank: 'third',
    authorName: '王芳',
    authorAvatar: 'https://picsum.photos/100/100?random=22',
    authorLocation: '云南',
    competitionName: '自然生态摄影展',
    competitionYear: '2023',
  },
  {
    id: 204,
    title: '沉思',
    imageUrl: 'https://picsum.photos/600/400?random=304',
    rank: 'excellence',
    authorName: '赵伟',
    authorAvatar: 'https://picsum.photos/100/100?random=23',
    authorLocation: '北京',
    competitionName: '人像摄影挑战赛',
    competitionYear: '2023',
  },
  {
    id: 205,
    title: '建筑之美',
    imageUrl: 'https://picsum.photos/600/400?random=305',
    rank: 'popular',
    authorName: '陈静',
    authorAvatar: 'https://picsum.photos/100/100?random=24',
    authorLocation: '深圳',
    competitionName: '建筑摄影大奖赛',
    competitionYear: '2023',
  },
  {
    id: 206,
    title: '光影交错',
    imageUrl: 'https://picsum.photos/600/400?random=306',
    rank: 'excellence',
    authorName: '刘志强',
    authorAvatar: 'https://picsum.photos/100/100?random=25',
    authorLocation: '广州',
    competitionName: '四季摄影大赛',
    competitionYear: '2023秋季',
  },
]);

// 模拟日历活动数据
const calendarEvents = ref([
  {
    id: 301,
    title: '北京春季外拍活动',
    type: 'event',
    date: new Date(2024, 3, 20),
    details: '奥林匹克森林公园，早上10点集合',
    isRegistered: true,
    canRegister: false,
  },
  {
    id: 302,
    title: '春季风光摄影大赛截止',
    type: 'competition',
    date: new Date(2024, 4, 31),
    details: '不要错过投稿截止日期！',
    isRegistered: false,
    canRegister: true,
  },
  {
    id: 303,
    title: '上海人像摄影工作坊',
    type: 'event',
    date: new Date(2024, 3, 27),
    details: '静安区摄影中心，下午1:30',
    isRegistered: false,
    canRegister: true,
  },
  {
    id: 304,
    title: '广州摄影后期讲座',
    type: 'event',
    date: new Date(2024, 4, 5),
    details: '天河区图书馆，下午2点',
    isRegistered: false,
    canRegister: true,
  },
  {
    id: 305,
    title: '城市人文街拍挑战赛',
    type: 'competition',
    date: new Date(2024, 5, 15),
    details: '投稿截止日期',
    isRegistered: false,
    canRegister: true,
  },
]);

// 设置当前标签页
const setTab = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1; // 切换标签页时重置页码
};

// 参与比赛
const joinCompetition = (id) => {
  router.push(`/activities/competitions/${id}/join`);
};

// 查看比赛详情
const viewCompetition = (id) => {
  router.push(`/activities/competitions/${id}`);
};

// 发布活动
const publishEvent = () => {
  // 实际项目中应跳转到发布页面或打开发布模态框
  alert('发布活动功能正在开发中...');
};

// 报名活动
const registerEvent = (id) => {
  router.push(`/activities/events/${id}/register`);
};

// 查看活动详情
const viewEvent = (id) => {
  router.push(`/activities/events/${id}`);
};

// 查看获奖作品详情
const viewWinner = (id) => {
  router.push(`/activities/winners/${id}`);
};

// 上一个月
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  selectedDate.value = null;
};

// 下一个月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  selectedDate.value = null;
};

// 获取当前月的天数
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

// 获取当前月第一天是星期几（0-6）
const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

// 获取需要显示的上个月的天数
const emptyDays = computed(() => {
  return firstDayOfMonth.value;
});

// 检查是否是今天
const isToday = (day) => {
  const today = new Date();
  const dateToCheck = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return today.getDate() === day && 
         today.getMonth() === currentDate.value.getMonth() && 
         today.getFullYear() === currentDate.value.getFullYear();
};

// 检查某天是否有活动
const hasEventsOnDay = (day) => {
  const dateToCheck = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return calendarEvents.value.some(event => 
    event.date.getDate() === dateToCheck.getDate() &&
    event.date.getMonth() === dateToCheck.getMonth() &&
    event.date.getFullYear() === dateToCheck.getFullYear()
  );
};

// 检查某天是否已报名活动
const isRegisteredOnDay = (day) => {
  const dateToCheck = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return calendarEvents.value.some(event => 
    event.date.getDate() === dateToCheck.getDate() &&
    event.date.getMonth() === dateToCheck.getMonth() &&
    event.date.getFullYear() === dateToCheck.getFullYear() &&
    event.isRegistered
  );
};

// 获取某天的所有活动
const getEventsOnDay = (day) => {
  const dateToCheck = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return calendarEvents.value.filter(event => 
    event.date.getDate() === dateToCheck.getDate() &&
    event.date.getMonth() === dateToCheck.getMonth() &&
    event.date.getFullYear() === dateToCheck.getFullYear()
  );
};

// 选择日期
const selectDay = (day) => {
  selectedDate.value = day;
};

// 从日历报名活动
const registerEventFromCalendar = (id) => {
  const event = calendarEvents.value.find(e => e.id === id);
  if (event && event.type === 'event') {
    router.push(`/activities/events/${id}/register`);
  } else if (event && event.type === 'competition') {
    router.push(`/activities/competitions/${id}/join`);
  }
};

// 从日历查看活动
const viewEventFromCalendar = (id) => {
  const event = calendarEvents.value.find(e => e.id === id);
  if (event && event.type === 'event') {
    router.push(`/activities/events/${id}`);
  } else if (event && event.type === 'competition') {
    router.push(`/activities/competitions/${id}`);
  }
};
</script>

<style scoped>
/* 活动赛事容器样式 */
.activities-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 活动赛事头部样式 */
.activities-header {
  text-align: center;
  margin-bottom: 32px;
}

.activities-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}

.activities-header p {
  font-size: 16px;
  color: #6C757D;
}

/* 活动赛事导航样式 */
.activities-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.nav-tab {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-tab:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.nav-tab.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 通用区域头部样式 */
.competitions-header,
.events-header,
.winners-header,
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.competitions-header h2,
.events-header h2,
.winners-header h2,
.calendar-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
}

.winners-header p,
.calendar-header p {
  font-size: 16px;
  color: #6C757D;
  margin-left: 16px;
}

/* 通用筛选样式 */
.competitions-filters,
.events-filters,
.winners-filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.filter-select {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: #0D6EFD;
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #0D6EFD;
}

.search-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #0B5ED7;
}

/* 发布按钮样式 */
.publish-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.publish-button:hover {
  background-color: #0B5ED7;
}

/* 在线比赛网格样式 */
.competitions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 在线比赛卡片样式 */
.competition-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  border-left: 4px solid #0D6EFD;
}

.competition-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.competition-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.competition-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.competition-card:hover .competition-image img {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
}

.status-badge.ongoing {
  background-color: #198754;
}

.status-badge.upcoming {
  background-color: #0D6EFD;
}

.status-badge.ended {
  background-color: #6C757D;
}

.competition-info {
  padding: 20px;
}

.competition-category {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.competition-category.landscape {
  background-color: #20C997;
}

.competition-category.portrait {
  background-color: #FD7E14;
}

.competition-category.street {
  background-color: #6F42C1;
}

.competition-category.architecture {
  background-color: #17A2B8;
}

.competition-category.wildlife {
  background-color: #28A745;
}

.competition-category.abstract {
  background-color: #DC3545;
}

.competition-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 16px 0;
}

.competition-dates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.date-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.date-label {
  color: #6C757D;
  min-width: 80px;
}

.date-value {
  color: #495057;
  font-weight: 500;
}

.date-value.ending {
  color: #DC3545;
}

.competition-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6C757D;
}

.competition-actions {
  display: flex;
  gap: 12px;
}

.join-button,
.view-button {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.join-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

.join-button:hover {
  background-color: #0B5ED7;
}

.view-button {
  background-color: #FFFFFF;
  border: 1px solid #0D6EFD;
  color: #0D6EFD;
}

.view-button:hover {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

/* 线下活动网格样式 */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 线下活动卡片样式 */
.event-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.event-card:hover:not(.past) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.event-card.past {
  opacity: 0.7;
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover:not(.past) .event-image img {
  transform: scale(1.05);
}

.event-info {
  padding: 20px;
}

.event-type {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.event-type.outing {
  background-color: #20C997;
}

.event-type.workshop {
  background-color: #FD7E14;
}

.event-type.seminar {
  background-color: #6F42C1;
}

.event-type.exhibition {
  background-color: #17A2B8;
}

.event-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 16px 0;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #6C757D;
}

.detail-item i {
  min-width: 16px;
  margin-top: 2px;
}

.event-actions {
  display: flex;
  gap: 12px;
}

.register-button {
  flex: 1;
  background-color: #198754;
  color: #FFFFFF;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.register-button:hover:not(:disabled) {
  background-color: #157347;
}

.register-button:disabled {
  background-color: #6C757D;
  cursor: not-allowed;
}

/* 获奖展厅网格样式 */
.winners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 获奖作品卡片样式 */
.winner-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.winner-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.winner-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.winner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.winner-card:hover .winner-image img {
  transform: scale(1.05);
}

.winner-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
}

.winner-rank.first {
  background-color: #FFD700;
  color: #000000;
}

.winner-rank.second {
  background-color: #C0C0C0;
}

.winner-rank.third {
  background-color: #CD7F32;
}

.winner-rank.excellence {
  background-color: #0D6EFD;
}

.winner-rank.popular {
  background-color: #DC3545;
}

.winner-info {
  padding: 20px;
}

.winner-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 16px 0;
}

.winner-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
}

.author-location {
  font-size: 14px;
  color: #6C757D;
}

.winner-competition {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #F8F9FA;
  border-radius: 6px;
}

.competition-name {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.competition-year {
  font-size: 14px;
  color: #6C757D;
}

/* 活动日历区域样式 */
.calendar-section {
  margin-top: 32px;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calendar-nav-button {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}
  
.calendar-nav-button:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.current-month {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}
  
  .calendar-grid {
    background-color: #FFFFFF;
    border: 1px solid #E9ECEF;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .weekday {
    text-align: center;
    font-weight: 600;
    color: #6C757D;
    font-size: 14px;
    padding: 8px;
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }
  
  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .calendar-day:hover:not(.empty) {
    background-color: #F8F9FA;
    border-color: #0D6EFD;
  }
  
  .calendar-day.empty {
    background-color: #F8F9FA;
    cursor: default;
  }
  
  .calendar-day.today {
    background-color: #E7F1FF;
    border-color: #0D6EFD;
    font-weight: 600;
  }
  
  .calendar-day.hasEvent {
    background-color: #F0FDFA;
    border-color: #20C997;
  }
  
  .calendar-day.registered {
    background-color: #E7F1FF;
    border-color: #0D6EFD;
  }
  
  .day-number {
    font-size: 16px;
    color: #495057;
    margin-bottom: 4px;
  }
  
  .day-events {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .day-event {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    color: #FFFFFF;
  }
  
  .day-event.competition {
    background-color: #0D6EFD;
  }
  
  .day-event.event {
    background-color: #20C997;
  }
  
  .day-event.more {
    background-color: #6C757D;
  }
  
  .selected-day-events {
    background-color: #FFFFFF;
    border: 1px solid #E9ECEF;
    border-radius: 12px;
    padding: 24px;
  }
  
  .selected-date-header {
    font-size: 18px;
    font-weight: 600;
    color: #212529;
    margin: 0 0 16px 0;
  }
  
  .no-events {
    text-align: center;
    color: #6C757D;
    padding: 40px 20px;
  }
  
  .events-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .event-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    background-color: #F8F9FA;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .event-item:hover {
    background-color: #E9ECEF;
  }
  
  .event-item-time {
    font-weight: 600;
    color: #0D6EFD;
    min-width: 60px;
    font-size: 14px;
  }
  
  .event-item-info {
    flex: 1;
  }
  
  .event-item-title {
    font-weight: 600;
    color: #212529;
    margin-bottom: 4px;
    font-size: 16px;
  }
  
  .event-item-details {
    color: #6C757D;
    font-size: 14px;
  }
  
  .event-item-actions {
    display: flex;
    gap: 8px;
  }
  
  .registered-button {
    background-color: #6C757D;
    color: #FFFFFF;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: not-allowed;
  }
  
  /* 分页样式 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }
  
  .pagination-button {
    background-color: #FFFFFF;
    border: 1px solid #E9ECEF;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #F8F9FA;
    border-color: #0D6EFD;
    color: #0D6EFD;
  }
  
  .pagination-button:disabled {
    background-color: #F8F9FA;
    color: #CED4DA;
    cursor: not-allowed;
  }
  
  .pagination-info {
    font-size: 14px;
    color: #495057;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .activities-nav {
      gap: 8px;
    }
    
    .nav-tab {
      padding: 8px 16px;
      font-size: 14px;
    }
    
    .competitions-filters,
    .events-filters,
    .winners-filters {
      flex-direction: column;
      gap: 12px;
    }
    
    .filter-group {
      justify-content: space-between;
    }
    
    .competitions-grid,
    .events-grid,
    .winners-grid {
      grid-template-columns: 1fr;
    }
    
    .calendar-day {
      padding: 4px;
    }
    
    .day-number {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .activities-header h1 {
      font-size: 24px;
    }
    
    .search-bar {
      flex-direction: column;
    }
    
    .search-input {
      width: 100%;
    }
    
    .competition-card,
    .event-card,
    .winner-card {
      border-radius: 8px;
    }
    
.calendar-grid {
      padding: 16px;
    }
    
    .selected-day-events {
      padding: 16px;
    }
    
    .event-item {
      flex-direction: column;
      gap: 12px;
    }
    
    .event-item-actions {
      justify-content: center;
      width: 100%;
    }
  }
</style>