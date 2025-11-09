<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <!-- 未登录且为个人活动页面 -->
    <div v-if="!isAuthenticated && isUserPersonalEvents" class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您已报名的摄影活动</p>
      <RouterLink to="/login" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">立即登录</RouterLink>
    </div>

    <!-- 正常页面 -->
    <div v-else>
      <div v-motion="pageMotion">
        <!-- 页面标题 -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">{{ isUserPersonalEvents ? '我的活动' : '线下活动' }}</h1>
          <p class="text-[#B8C6D8] max-w-2xl mx-auto">{{ isUserPersonalEvents ? '查看您已报名的摄影活动，管理活动行程和查看详情' : '参与摄影采风、沙龙和器材体验活动，结交同好，提升技能，捕捉精彩瞬间' }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 主体 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 搜索和排序 -->
            <div v-if="!isUserPersonalEvents" class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div class="relative flex-1">
                <input v-model="searchTerm" type="text" placeholder="搜索活动、地点或主题..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
              </div>

              <select v-model="sortBy" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option value="upcoming">即将开始</option>
                <option value="popular">热门活动</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
              </select>
            </div>

            <!-- 类型与分类 -->
            <div v-if="!isUserPersonalEvents" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                <div class="p-3 border-b border-[#4A5F8B]"><h4 class="text-sm font-medium text-[#F5F7FA]">活动类型</h4></div>
                <div class="grid grid-cols-3 p-2">
                  <button v-for="type in eventTypes" :key="type" @click="selectedType = type" :class="typeBtnClass(type)">{{ type }}</button>
                </div>
              </div>

              <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
                <div class="p-3 border-b border-[#4A5F8B]"><h4 class="text-sm font-medium text-[#F5F7FA]">活动分类</h4></div>
                <div class="grid grid-cols-4 p-2">
                  <button v-for="category in eventCategories" :key="category" @click="selectedCategory = category" :class="categoryBtnClass(category)">{{ category }}</button>
                </div>
              </div>
            </div>

            <!-- 活动列表 -->
            <div class="space-y-6">
              <div v-for="event in filteredEvents" :key="event.id" v-motion="cardMotion" class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm">
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img :src="event.image" :alt="event.title" class="w-full h-48 md:h-full object-cover" />
                  </div>
                  <div class="p-5 md:w-2/3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-[#F5F7FA] font-medium">{{ event.type }}</span>
                      <span class="text-xs px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full">{{ event.category }}</span>
                    </div>
                    <h3 class="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#FFFFFF] transition-colors">{{ event.title }}</h3>
                    <div class="space-y-1 mb-4">
                      <div class="flex items-center text-sm text-[#F5F7FA]"><i class="fa-solid fa-map-marker-alt mr-2 text-[#F5F7FA]"></i><span>{{ event.location }}</span></div>
                      <div class="flex items-center text-sm text-[#F5F7FA]"><i class="fa-solid fa-calendar-alt mr-2 text-[#F5F7FA]"></i><span>{{ event.date }}</span></div>
                      <div class="flex items-center text-sm text-[#F5F7FA]"><i class="fa-solid fa-clock mr-2 text-[#F5F7FA]"></i><span>{{ event.duration }}</span></div>
                    </div>

                    <div class="flex items-center mb-4">
                      <img :src="event.instructor.avatar" :alt="event.instructor.name" class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                      <div>
                        <p class="text-sm font-medium text-[#F5F7FA]">{{ event.instructor.name }}</p>
                        <p class="text-xs text-[#F5F7FA]/80">{{ event.instructor.title }}</p>
                      </div>
                    </div>

                    <p class="text-sm text-[#F5F7FA]/90 mb-4 line-clamp-2">{{ event.description }}</p>

                    <div class="flex items-center justify-between mb-4">
                      <div class="text-lg font-bold text-[#F5F7FA]">{{ event.price === 0 ? '免费' : `¥${event.price}` }}</div>
                      <div class="text-sm text-[#F5F7FA]">{{ event.participants }} 人已报名 / 限 {{ event.maxParticipants }} 人</div>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-4">
                      <button v-for="(tag, idx) in event.tags.slice(0,5)" :key="idx" @click="toggleTag(tag)" :class="tagBtnClass(tag)">#{{ tag }}</button>
                    </div>

                    <div class="flex space-x-2">
                      <RouterLink :to="`/event/${event.id}`" class="flex-1 py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]">查看详情</RouterLink>
                      <button v-if="isUserPersonalEvents" class="flex-1 py-2 text-center bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"> <i class="fa-solid fa-calendar-check mr-1"></i> 已报名</button>
                      <button v-else class="flex-1 py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"> <i class="fa-solid fa-calendar-plus mr-1"></i> 立即报名</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredEvents.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"><i class="fa-solid fa-search text-2xl"></i></div>
                <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关活动</h3>
                <p class="text-[#B8C6D8]">请尝试使用不同的关键词或筛选条件</p>
              </div>
            </div>

            <!-- 简单分页展示 -->
            <div v-if="filteredEvents.length > 0" class="flex justify-center">
              <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"><i class="fa-solid fa-chevron-left text-xs"></i></button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">2</button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">3</button>
                <span class="px-2 text-[#B8C6D8]">...</span>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">8</button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"><i class="fa-solid fa-chevron-right text-xs"></i></button>
              </nav>
            </div>
          </div>

          <!-- 侧边栏 -->
          <div v-if="!isUserPersonalEvents" class="lg:col-span-1 space-y-6">
            <div class="bg-[#4A5F8B] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in popularTags" :key="tag.id" @click="toggleTag(tag.name)" :class="popularTagClass(tag.name)">#{{ tag.name }} ({{ tag.count }})</button>
              </div>
              <button v-if="selectedTags.length > 0" @click="selectedTags = []" class="mt-4 w-full py-2 text-center text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors"><i class="fa-solid fa-times mr-1"></i> 清除所有标签</button>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">活动日历</h3>
              <div class="text-center mb-3">
                <h4 class="font-medium text-[#F5F7FA]">2023年10月</h4>
              </div>
              <div class="grid grid-cols-7 gap-1 text-center text-xs">
                <div v-for="day in ['日','一','二','三','四','五','六']" :key="day" class="py-2 text-[#B8C6D8] font-medium">{{ day }}</div>
                <div v-for="i in 31" :key="i" class="py-2 rounded-full transition-colors cursor-pointer" :class="calendarDayClass(i)">{{ i }}</div>
              </div>
              <div class="mt-4 flex justify-between text-sm">
                <button class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">上个月</button>
                <button class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">下个月</button>
              </div>
            </div>

            <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] text-[#F5F7FA]">
              <h3 class="text-lg font-bold mb-3">近期活动提醒</h3>
              <div class="space-y-3 mb-4">
                <div class="bg-[#2D3748]/30 p-3 rounded-lg backdrop-blur-sm">
                  <p class="text-sm font-medium">新疆喀纳斯秋季风光摄影团</p>
                  <p class="text-xs text-[#F5F7FA]/90 mt-1">10月15日开始 · 剩余8个名额</p>
                </div>
                <div class="bg-[#2D3748]/30 p-3 rounded-lg backdrop-blur-sm">
                  <p class="text-sm font-medium">上海城市纪实摄影沙龙</p>
                  <p class="text-xs text-[#F5F7FA]/90 mt-1">10月28日 · 剩余12个名额</p>
                </div>
              </div>
              <button class="w-full py-2 bg-[#F5F7FA] text-[#4A5F8B] font-medium rounded-lg hover:bg-[#FFFFFF] transition-colors">查看全部活动</button>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">如何参加活动</h3>
              <div class="space-y-3">
                <div class="flex items-start">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#F5F7FA] mr-3 flex-shrink-0"><span>1</span></div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA] mb-1">浏览活动</h4>
                    <p class="text-sm text-[#B8C6D8]">浏览各类摄影活动，根据兴趣和时间选择合适的活动</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#F5F7FA] mr-3 flex-shrink-0"><span>2</span></div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA] mb-1">报名确认</h4>
                    <p class="text-sm text-[#B8C6D8]">提交报名信息，支付费用（如有），等待确认</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#F5F7FA] mr-3 flex-shrink-0"><span>3</span></div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA] mb-1">接收通知</h4>
                    <p class="text-sm text-[#B8C6D8]">报名成功后，接收活动详情和注意事项的通知</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#F5F7FA] mr-3 flex-shrink-0"><span>4</span></div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA] mb-1">参加活动</h4>
                    <p class="text-sm text-[#B8C6D8]">按照活动时间和地点，准时参加活动</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

type Instructor = {
  id: string
  name: string
  avatar: string
  title: string
  experience: string
}

type EventItem = {
  id: string
  title: string
  type: string
  category: string
  image: string
  location: string
  date: string
  duration: string
  instructor: Instructor
  price: number
  participants: number
  maxParticipants: number
  description: string
  itinerary: string[]
  inclusion: string[]
  exclusion: string[]
  notes: string[]
  tags: string[]
}

/* ---------- 模拟数据（保持原样） ---------- */
const mockEvents: EventItem[] = [
  {
    id: 'e1',
    title: '新疆喀纳斯秋季风光摄影团',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20kanas%20autumn%20landscape%20photography%20tour&sign=80fdfc7396a896f951715b6544406409',
    location: '新疆·喀纳斯',
    date: '2023-10-15 至 2023-10-22',
    duration: '8天7晚',
    instructor: { id: 'i1', name: '风光摄影师张明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor%20professional&sign=871dd04c358f08c5214aaf9a36e6bf27', title: '国家地理摄影师', experience: '15年' },
    price: 6999,
    participants: 12,
    maxParticipants: 20,
    description: '跟随国家地理摄影师张明，深入新疆喀纳斯，拍摄秋季绝美风光。行程涵盖喀纳斯湖、禾木村、白哈巴等著名景点，在最佳时间和地点拍摄金秋时节的层林尽染、晨雾缭绕的梦幻景色。',
    itinerary: [ '第1天：全国各地 - 乌鲁木齐集合', '第2天：乌鲁木齐 - 布尔津 - 五彩滩', '第3天：布尔津 - 喀纳斯湖 - 观鱼台', '第4天：喀纳斯 - 白哈巴村', '第5天：白哈巴 - 禾木村', '第6天：禾木村全天拍摄', '第7天：禾木 - 可可托海', '第8天：可可托海 - 乌鲁木齐解散' ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差', '额外景点门票'],
    notes: ['需自带摄影器材', '有一定摄影基础', '适应高原气候', '尊重当地风俗'],
    tags: ['风光', '新疆', '秋季', '长线', '深度']
  },
  {
    id: 'e2',
    title: '上海城市纪实摄影沙龙',
    type: '摄影沙龙',
    category: '纪实',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20urban%20documentary%20photography%20salon&sign=c10d47ff72e693e4aae932edd3732d15',
    location: '上海·静安区',
    date: '2023-10-28 14:00-17:00',
    duration: '3小时',
    instructor: { id: 'i2', name: '纪实摄影师李华', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street%20experienced&sign=c2d89b9f47e07118aab5b3aef7c5cdf3', title: '国际纪实摄影奖得主', experience: '10年' },
    price: 199,
    participants: 18,
    maxParticipants: 30,
    description: '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。沙龙将涵盖纪实摄影的构图技巧、光线运用、与被摄者沟通等实用内容，并进行现场拍摄指导。',
    itinerary: [ '14:00-14:30：签到与破冰', '14:30-15:30：纪实摄影理论分享', '15:30-16:30：户外实战拍摄指导', '16:30-17:00：作品点评与交流' ],
    inclusion: ['场地', '指导', '资料', '茶点'],
    exclusion: ['交通', '器材', '个人消费'],
    notes: ['自带摄影器材', '提前报名确认', '尊重拍摄对象'],
    tags: ['纪实', '城市', '上海', '沙龙', '短期']
  },
  {
    id: 'e3',
    title: '索尼Alpha新品体验会',
    type: '器材体验会',
    category: '器材',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20new%20camera%20experience%20event%20demo&sign=7801e7949f7d2a5e0e7c3a308a3fba3a',
    location: '北京·朝阳区',
    date: '2023-11-05 10:00-16:00',
    duration: '6小时',
    instructor: { id: 'i3', name: '索尼技术专家王强', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20camera%20technical%20expert%20male%20professional&sign=78333651a183c3049ee0b820a0642879', title: '索尼官方讲师', experience: '8年' },
    price: 0,
    participants: 25,
    maxParticipants: 50,
    description: '索尼Alpha系列新品体验会，现场体验最新的索尼相机和镜头，包括A7R V、A7S III等热门机型。专业技术专家现场讲解产品特性和使用技巧，并提供一对一咨询服务。',
    itinerary: [ '10:00-10:30：签到与自由体验', '10:30-11:30：新品技术解析', '11:30-12:30：午餐交流', '12:30-15:00：分组体验与指导', '15:00-16:00：问答与抽奖' ],
    inclusion: ['场地', '指导', '资料', '午餐', '抽奖'],
    exclusion: ['交通', '个人消费'],
    notes: ['无需自带器材', '提前报名确认', '遵守活动秩序'],
    tags: ['器材', '索尼', '新品', '体验', '免费']
  },
  {
    id: 'e4',
    title: '云南元阳梯田春季摄影创作',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=yunnan%20yuanyang%20rice%20terraces%20spring%20photography%20tour&sign=09c3d6131214921bb3af386fac7bdba4',
    location: '云南·元阳',
    date: '2024-02-20 至 2024-02-25',
    duration: '6天5晚',
    instructor: { id: 'i4', name: '风光摄影师刘芳', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20female%20nature%20professional&sign=c3336bf3ce1c7229154ec96830fedbfc', title: '国际风光摄影奖得主', experience: '12年' },
    price: 5699,
    participants: 8,
    maxParticipants: 15,
    description: '春季元阳梯田灌水期，是拍摄梯田云海、日出日落的最佳时节。跟随国际风光摄影奖得主刘芳，深入元阳梯田核心景区，在最佳拍摄点和时间，捕捉梯田如镜面般倒映天空和云霞的壮观景象。',
    itinerary: [ '第1天：昆明集合', '第2天：昆明 - 元阳 - 老虎嘴梯田', '第3天：多依树梯田日出 - 爱春蓝梯田', '第4天：箐口梯田 - 坝达梯田日落', '第5天：龙树坝梯田 - 阿者科古村', '第6天：元阳 - 昆明解散' ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差'],
    notes: ['需自带摄影器材', '有一定摄影基础', '早起拍摄'],
    tags: ['风光', '云南', '春季', '梯田', '经典']
  }
]

const eventTypes = ['全部', '采风团', '摄影沙龙', '器材体验会']
const eventCategories = ['全部', '风光', '人像', '纪实', '商业', '器材', '街拍', '星空']
const popularTags = [
  { id: '1', name: '风光', count: 124 },
  { id: '2', name: '人像', count: 87 },
  { id: '3', name: '城市', count: 65 },
  { id: '4', name: '纪实', count: 43 },
  { id: '5', name: '器材', count: 32 },
  { id: '6', name: '秋季', count: 28 },
  { id: '7', name: '上海', count: 25 },
  { id: '8', name: '免费', count: 20 }
]

/* ---------- 状态 ---------- */
const route = useRoute()
const isUserPersonalEvents = computed(() => route.path.includes('/profile-center/events'))

// 简单从 localStorage 读取认证信息以兼容原有 AuthContext 行为
const isAuthenticated = ref(false)
const storedAuth = localStorage.getItem('isAuthenticated')
if (storedAuth === 'true') {
  isAuthenticated.value = true
}

const selectedType = ref('全部')
const selectedCategory = ref('全部')
const searchTerm = ref('')
const sortBy = ref<'upcoming' | 'popular' | 'price-asc' | 'price-desc'>('upcoming')
const selectedTags = ref<string[]>([])

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
}

/* ---------- 过滤和排序（computed） ---------- */
const filteredEvents = computed(() => {
  let events: EventItem[] = isUserPersonalEvents.value
    ? mockEvents.filter(e => e.id === 'e1' || e.id === 'e2')
    : [...mockEvents]

  if (selectedType.value !== '全部' && !isUserPersonalEvents.value) {
    events = events.filter(e => e.type === selectedType.value)
  }

  if (selectedCategory.value !== '全部' && !isUserPersonalEvents.value) {
    events = events.filter(e => e.category === selectedCategory.value)
  }

  if (searchTerm.value && !isUserPersonalEvents.value) {
    const term = searchTerm.value.toLowerCase()
    events = events.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term) || e.description.toLowerCase().includes(term))
  }

  if (selectedTags.value.length > 0 && !isUserPersonalEvents.value) {
    events = events.filter(e => selectedTags.value.some(tag => e.tags.includes(tag)))
  }

  if (sortBy.value === 'upcoming') {
    events.sort((a, b) => new Date(a.date.split(' ')[0]).getTime() - new Date(b.date.split(' ')[0]).getTime())
  } else if (sortBy.value === 'popular') {
    events.sort((a, b) => b.participants - a.participants)
  } else if (sortBy.value === 'price-asc') {
    events.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    events.sort((a, b) => b.price - a.price)
  }

  return events
})

/* ---------- 动画（v-motion 配置） ---------- */
const pageMotion = { initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
const cardMotion = { hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }

/* ---------- 样式辅助方法 ---------- */
function typeBtnClass(type: string) {
  return `py-2 px-1 text-center text-sm font-medium transition-colors ${selectedType.value === type ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg' : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'}`
}

function categoryBtnClass(category: string) {
  return `py-2 px-1 text-center text-sm font-medium transition-colors ${selectedCategory.value === category ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg' : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'}`
}

function tagBtnClass(tag: string) {
  return `px-2 py-1 rounded-full text-xs ${selectedTags.value.includes(tag) ? 'bg-[#F5F7FA] text-[#4A5F8B]' : 'bg-[#2D3748]/50 text-[#F5F7FA] border border-[#4A5F8B]/50'} transition-colors`
}

function popularTagClass(name: string) {
  return `px-3 py-1 rounded-full text-sm ${selectedTags.value.includes(name) ? 'bg-[#F5F7FA] text-[#4A5F8B]' : 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]'} transition-colors`
}

function calendarDayClass(day: number) {
  const hasEvent = [15, 22, 28].includes(day)
  return hasEvent ? 'py-2 rounded-full bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'py-2 rounded-full text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
}
</script>

<style scoped>
/* 主要依赖 TailwindCSS，局部样式可在这里补充 */
</style>
