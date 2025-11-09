<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 20,
      }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 500,
        },
      }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <RouterLink
          to="/profile-center/works"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回作品集</span>
        </RouterLink>
      </div>

      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-8 text-center">
        {{ mockPhotoPost.title }}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧作品信息 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 作品图片 - 增加版权标签 -->
          <div class="bg-[#2D3748] p-4 rounded-xl shadow-sm border border-[#4A5F8B] relative">
            <!-- 版权标签 -->
            <div
              :class="`absolute top-6 left-6 px-3 py-1 rounded text-xs ${
                mockPhotoPost.copyrightType === '独家授权'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#6B7C93] text-[#F5F7FA]'
              }`"
            >
              {{ mockPhotoPost.copyrightType }}
            </div>
            <img :src="mockPhotoPost.image" :alt="mockPhotoPost.title" class="w-full h-auto rounded-lg" />
          </div>

          <!-- 作品描述 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">作品描述</h2>
            <p class="text-[#B8C6D8] whitespace-pre-line">{{ mockPhotoPost.description }}</p>

            <!-- 作品标签 -->
            <div class="mt-6 flex flex-wrap gap-2">
              <template v-for="tag in mockPhotoPost.tags" :key="tag">
                <span class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-sm">
                  #{{ tag }}
                </span>
              </template>
            </div>
          </div>

          <!-- EXIF信息 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#B8C6D8] mb-4">EXIF 信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">相机</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.camera }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">镜头</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.lens }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">光圈</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.aperture }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">快门速度</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.shutter }}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">ISO</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.iso }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">焦距</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.focalLength }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">白平衡</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.whiteBalance }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-[#B8C6D8]">拍摄时间</span>
                  <span class="text-sm text-[#6B7C93] font-medium">{{ mockPhotoPost.exif.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">评论 ({{ comments.length }})</h2>
            <div class="space-y-4">
              <!-- 评论输入框 -->
              <div class="flex space-x-4">
                <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20placeholder&sign=7190b82f8840cf19dd8427ccfc6e55c9"
                    alt="Your avatar"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <textarea
                    placeholder="写下您的评论..."
                    v-model="commentInput"
                    class="w-full p-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-24"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                      @click="handleCommentSubmit"
                      class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      发表评论
                    </button>
                  </div>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="space-y-4">
                <template v-for="comment in comments" :key="comment.id">
                  <div class="flex space-x-4">
                    <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img :src="comment.avatar" :alt="comment.author" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-medium text-[#F5F7FA]">{{ comment.author }}</span>
                        <span class="text-xs text-[#6B7C93]">{{ comment.date }}</span>
                      </div>
                      <p class="text-[#B8C6D8]">{{ comment.content }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 作者信息 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
                <img
                  :src="mockPhotoPost.author.avatar"
                  :alt="mockPhotoPost.author.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 class="font-bold text-[#F5F7FA]">{{ mockPhotoPost.author.name }}</h3>
                <p class="text-sm text-[#4A5F8B]">{{ mockPhotoPost.author.level }}</p>
              </div>
            </div>

            <p class="text-sm text-[#B8C6D8] mb-4">{{ mockPhotoPost.author.bio }}</p>

            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ mockPhotoPost.author.posts }}</p>
                <p class="text-xs text-[#B8C6D8]">作品</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ mockPhotoPost.author.followers }}</p>
                <p class="text-xs text-[#B8C6D8]">粉丝</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ mockPhotoPost.author.following }}</p>
                <p class="text-xs text-[#B8C6D8]">关注</p>
              </div>
            </div>

            <button
              class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
            >
              关注作者
            </button>
          </div>

          <!-- 互动区域 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <div class="flex justify-between mb-6">
              <button
                :class="`flex flex-col items-center justify-center ${isLiked ? 'text-[#F56565]' : 'text-[#4A5F8B]'}`"
                @click="toggleLike"
              >
                <div :class="`w-12 h-12 rounded-full ${isLiked ? 'bg-[#F56565]/20' : 'bg-[#4A5F8B]/20'} flex items-center justify-center mb-2`">
                  <i :class="`fa-solid fa-heart text-xl ${isLiked ? 'text-[#F56565]' : 'text-[#4A5F8B]'}`"></i>
                </div>
                <span :class="`text-sm ${isLiked ? 'text-[#F56565]' : 'text-[#B8C6D8]'}`">{{ likes }}</span>
              </button>
              <button
                :class="`flex flex-col items-center justify-center ${isBookmarked ? 'text-[#F6AD55]' : 'text-[#4A5F8B]'}`"
                @click="toggleBookmark"
              >
                <div :class="`w-12 h-12 rounded-full ${isBookmarked ? 'bg-[#F6AD55]/20' : 'bg-[#4A5F8B]/20'} flex items-center justify-center mb-2`">
                  <i :class="`fa-solid fa-bookmark text-xl ${isBookmarked ? 'text-[#F6AD55]' : 'text-[#4A5F8B]'}`"></i>
                </div>
                <span class="text-sm text-[#B8C6D8]">收藏</span>
              </button>
              <button class="flex flex-col items-center justify-center text-[#4A5F8B]">
                <div class="w-12 h-12 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mb-2">
                  <i class="fa-solid fa-share-nodes text-xl"></i>
                </div>
                <span class="text-sm text-[#B8C6D8]">分享</span>
              </button>
            </div>

            <div class="space-y-4">
              <button class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center justify-center">
                <i class="fa-solid fa-download mr-2"></i>
                下载原图
              </button>
              <button class="w-full py-2 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors flex items-center justify-center">
                <i class="fa-solid fa-ellipsis-h mr-2"></i>
                更多选项
              </button>
            </div>
          </div>

          <!-- 版权交易 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h3 class="font-bold text-[#F5F7FA] mb-4">版权交易</h3>

            <div class="space-y-4">
              <template v-for="option in mockPhotoPost.licensingOptions" :key="option.id">
                <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-medium text-[#F5F7FA]">{{ option.name }}</h4>
                    <span class="font-bold text-[#4A5F8B]">¥{{ option.price }}</span>
                  </div>
                  <p class="text-xs text-[#B8C6D8] mb-3">{{ option.description }}</p>
                  <button class="w-full py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                    购买授权
                  </button>
                </div>
              </template>
            </div>

            <div class="mt-4 text-center">
              <button class="text-sm text-[#4A5F8B] hover:underline transition-colors">
                查看完整授权协议
              </button>
            </div>
          </div>

          <!-- 作品信息 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h3 class="font-bold text-[#F5F7FA] mb-4">作品信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">发布时间</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.date }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">拍摄地点</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.location }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">浏览量</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.views }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">点赞数</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.likes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">评论数</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.comments }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">文件格式</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockPhotoPost.format }}</span>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div class="bg-[#2D3748] p-6 rounded-xl shadow-sm border border-[#4A5F8B]">
            <h3 class="font-bold text-[#F5F7FA] mb-4">相关推荐</h3>
            <div class="space-y-4">
              <template v-for="item in 3" :key="item">
                <div
                  v-motion
                  :hover="{ scale: 1.03 }"
                  class="group"
                >
                  <div class="rounded-lg overflow-hidden border-[#4A5F8B] group-hover:border-[#4A5F8B] transition-colors">
                    <img
                      :src="`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=minimalist%20architecture%20photography%20black%20and%20white%20${item}&sign=${item}a1b2c3d4e5f6`"
                      :alt="`Related photo ${item}`"
                      class="w-full h-32 object-cover"
                    />
                    <div class="p-3">
                      <h4 class="font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors">
                        极简建筑 {{ item }}
                      </h4>
                      <p class="text-xs text-[#B8C6D8] mt-1">@极简摄影师林风</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟摄影作品数据 - 银河氛围摄影平台，增加EXIF信息和版权信息
const mockPhotoPost = {
  id: '1',
  title: '黑白光影',
  description: '极简主义黑白摄影，通过光影对比展现建筑的几何美感。\n\n创作灵感：\n在城市中漫步时，被这座建筑的几何线条所吸引，阳光透过窗户形成的光影效果完美呈现了极简美学。\n\n拍摄参数：\n- 相机：Leica Q2 Monochrom\n- 镜头：Summilux 28mm f/1.7 ASPH\n- 光圈：f/2.8\n- 快门速度：1/125s\n- ISO：800\n- 构图：三分法，利用线条引导视线\n\n后期处理：\n1. 轻微调整对比度，增强黑白对比\n2. 调整高光和阴影，保留细节\n3. 使用渐变滤镜调整天空和地面的曝光平衡\n4. 轻微锐化，增强建筑线条感',
  image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52',
  author: {
    id: '1',
    name: '极简摄影师林风',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    bio: '专注极简主义和黑白摄影，通过简洁的构图和光影表达深刻的视觉语言，作品曾在多个国际摄影展中展出。',
    followers: 12543,
    following: 324,
    posts: 187,
    level: '新锐艺术家',
  },
  likes: 2435,
  comments: 132,
  tags: ['极简主义', '黑白', '建筑', '徕卡', '几何', '光影'],
  date: '2023-10-25',
  location: '上海当代艺术博物馆',
  views: 12876,
  format: 'RAW',
  copyrightType: '独家授权',
  exif: {
    camera: 'Leica Q2 Monochrom',
    lens: 'Summilux 28mm f/1.7 ASPH',
    aperture: 'f/2.8',
    shutter: '1/125s',
    iso: '800',
    focalLength: '28mm',
    whiteBalance: '日光',
    date: '2023-10-25 14:30:45'
  },
  licensingOptions: [
    { id: 'standard', name: '标准授权', price: 300, description: '适用于非商业用途' },
    { id: 'commercial', name: '商业授权', price: 1200, description: '适用于商业用途' },
    { id: 'exclusive', name: '独家授权', price: 3500, description: '获得作品独家使用权' }
  ]
}



// 响应式状态
const commentInput = ref('')
const comments = ref([
  { id: 1, author: '摄影爱好者小王', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20young%20male&sign=a1aab7d30fd53bf1223d770fddcbda60', content: '构图非常出色，极简主义的典范之作！', date: '2023-10-26' },
  { id: 2, author: '艺术评论家小李', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20critic%20male%20glasses&sign=9e911992d017c39984632bede247fe6f', content: '光影的运用极具艺术性，黑白对比强化了视觉冲击力。', date: '2023-10-25' },
  { id: 3, author: '建筑摄影师老张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architectural%20photographer%20middle%20aged&sign=c5f7e7acba71e7ff8e22dfcc42f1c95b', content: '作为同行，非常欣赏这种对线条和几何感的捕捉！', date: '2023-10-25' },
])
const isLiked = ref(false)
const isBookmarked = ref(false)
const likes = ref(2435)

// 处理评论提交
const handleCommentSubmit = () => {
  if (!commentInput.value.trim()) return
  
  const newComment = {
    id: comments.value.length + 1,
    author: '我',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20placeholder&sign=7190b82f8840cf19dd8427ccfc6e55c9',
    content: commentInput.value,
    date: new Date().toISOString().split('T')[0],
  }
  
  comments.value = [newComment, ...comments.value]
  commentInput.value = ''
}

// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value
  likes.value = isLiked.value ? likes.value + 1 : likes.value - 1
}

// 切换收藏状态
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}
</script>

<style scoped>
.star-texture {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>