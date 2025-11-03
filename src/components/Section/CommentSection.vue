<template>
  <div>
    <!-- 发表评论表单 -->
    <form v-if="isAuthenticated" @submit.prevent="handleSubmitComment" class="mb-8">
      <div class="flex space-x-4">
        <div class="flex-shrink-0">
          <img
            :src="user?.avatar"
            :alt="user?.username"
            class="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div class="flex-1">
          <div class="mb-2 text-sm text-[#4A5059]/70">
            <i class="fa-solid fa-circle-info mr-1 text-[#4A5F8B]"></i>
            从艺术或技术角度分享您的见解，探讨构图、光影或创作理念
          </div>
          <textarea
            v-model="commentText"
            placeholder="分享您的艺术感悟或技术分析..."
            class="w-full px-4 py-3 rounded-lg bg-[#F5F7FA] border border-[#B8C6D8] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-32 text-[#4A5059]"
          ></textarea>
          <div class="flex justify-end mt-3">
            <button
              type="submit"
              class="px-6 py-2 border-2 border-[#B8C6D8] hover:border-[#4A5F8B] bg-[#E6EBF2] text-[#4A5059] rounded-lg font-medium transition-colors shadow-[0_2px_8px_rgba(74,95,139,0.2)]"
            >
              发表评论
            </button>
          </div>
        </div>
      </div>
    </form>
    <div v-else class="mb-8 p-4 bg-[#E6EBF2] rounded-lg border border-[#B8C6D8] text-center">
      <p class="text-[#4A5059]/70 mb-3">
        登录后可以参与艺术摄影交流
      </p>
      <div class="flex justify-center space-x-3">
        <router-link
          to="/login"
          class="px-4 py-2 text-sm font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#4A5059] rounded-lg transition-colors"
        >
          登录
        </router-link>
        <router-link
          to="/register"
          class="px-4 py-2 text-sm font-medium text-[#4A5F8B] border border-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors"
        >
          注册
        </router-link>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-6">
      <div
        v-for="comment in displayComments"
        :key="comment.id"
        class="bg-[#F5F7FA] rounded-lg p-4 border border-[#B8C6D8]"
      >
        <div class="flex space-x-3">
          <router-link :to="`/profile/${comment.userId}`" class="flex-shrink-0">
            <img
              :src="comment.avatar"
              :alt="comment.username"
              class="w-10 h-10 rounded-full object-cover"
            />
          </router-link>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <router-link
                :to="`/profile/${comment.userId}`"
                class="font-medium text-[#4A5059] hover:text-[#4A5F8B] transition-colors"
              >
                {{ comment.username }}
              </router-link>
              <span class="text-xs text-[#4A5059]/70">{{ comment.date }}</span>
            </div>
            <p class="text-[#4A5059] mb-3">{{ comment.content }}</p>
            <div class="flex items-center space-x-4">
              <button
                @click="handleLike(comment.id)"
                :class="[
                  'flex items-center space-x-1 text-sm transition-colors',
                  comment.isLiked ? 'text-[#4A5F8B]' : 'text-[#4A5059]/50 hover:text-[#4A5059]'
                ]"
              >
                <i :class="[comment.isLiked ? 'fa-solid' : 'fa-regular', 'fa-heart']"></i>
                <span>{{ comment.likes }}</span>
              </button>
              <button
                @click="replyingTo = replyingTo === comment.id ? null : comment.id"
                class="flex items-center space-x-1 text-sm text-[#4A5059]/50 hover:text-[#4A5059] transition-colors"
              >
                <i class="fa-solid fa-reply"></i>
                <span>回复</span>
              </button>
            </div>

            <!-- 回复表单 -->
            <div
              v-if="replyingTo === comment.id && isAuthenticated"
              class="mt-3 flex space-x-3"
            >
              <div class="flex-shrink-0">
                <img
                  :src="user?.avatar"
                  :alt="user?.username"
                  class="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div class="flex-1 flex space-x-2">
                <input
                  type="text"
                  v-model="replyText"
                  :placeholder="`回复 @${comment.username}...`"
                  class="flex-1 px-3 py-2 rounded-lg bg-[#E6EBF2] border border-[#B8C6D8] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] text-sm text-[#4A5059]"
                />
                <button
                  @click="handleSubmitReply(comment.id)"
                  class="px-3 py-2 bg-[#4A5F8B] hover:bg-[#4A5059] text-[#F5F7FA] rounded-lg text-sm font-medium transition-colors"
                >
                  回复
                </button>
              </div>
            </div>

            <!-- 回复列表 -->
            <div
              v-if="comment.replies && comment.replies.length > 0"
              class="mt-4 pl-4 border-l-2 border-[#B8C6D8] space-y-4"
            >
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="flex space-x-3"
              >
                <router-link :to="`/profile/${reply.userId}`" class="flex-shrink-0">
                  <img
                    :src="reply.avatar"
                    :alt="reply.username"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                </router-link>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <router-link
                      :to="`/profile/${reply.userId}`"
                      class="font-medium text-[#4A5059] hover:text-[#4A5F8B] transition-colors"
                    >
                      {{ reply.username }}
                    </router-link>
                    <span class="text-xs text-[#4A5059]/70">{{ reply.date }}</span>
                  </div>
                  <p class="text-[#4A5059] mb-2 text-sm">{{ reply.content }}</p>
                  <button
                    @click="handleLike(comment.id, true, reply.id)"
                    :class="[
                      'flex items-center space-x-1 text-xs transition-colors',
                      reply.isLiked ? 'text-[#4A5F8B]' : 'text-[#4A5059]/50 hover:text-[#4A5059]'
                    ]"
                  >
                    <i :class="[reply.isLiked ? 'fa-solid' : 'fa-regular', 'fa-heart']"></i>
                    <span>{{ reply.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 显示更多按钮 -->
      <button
        v-if="comments.length > 2"
        @click="showFullComments = !showFullComments"
        class="w-full py-3 text-center text-[#4A5059] hover:text-[#4A5F8B] bg-[#E6EBF2] border border-[#B8C6D8] rounded-lg transition-colors"
      >
        {{ showFullComments ? '收起部分评论' : `查看全部 ${comments.length} 条评论` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';

const props = defineProps({
  postId: {
    type: String,
    default: undefined
  }
});

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

// 状态管理
const commentText = ref('');
const comments = ref([
  {
    id: '1',
    userId: '2',
    username: '极简摄影师林静',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20female%20glasses&sign=bcb6273a0e310c266e722c0131d6e146',
    content: '这张作品的几何构图非常出色，线条的运用和光影对比恰到好处。特别喜欢你对空间的处理，留白部分增强了整体的极简美感。请问是使用什么方式调整黑白对比的？',
    date: '2023-10-25 10:23',
    likes: 125,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        userId: '1',
        username: '极简摄影师林风',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
        content: '谢谢喜欢！我使用了Lightroom的色调曲线工具进行精细调整，重点强化了明暗交界线的对比，同时保留了阴影和高光的细节，避免过度调整导致的细节丢失。',
        date: '2023-10-25 11:45',
        likes: 89,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    userId: '3',
    username: '建筑摄影师王强',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20smiling&sign=3c23397344efe1e22c27fde5dd0bd934',
    content: '作为一名建筑摄影师，我非常欣赏这种捕捉几何美感的视角。这让我想起了埃姆斯住宅的一些经典摄影作品。请问拍摄时是否有特别等待光线的角度？',
    date: '2023-10-25 09:15',
    likes: 87,
    isLiked: false,
    replies: [
      {
        id: '2-1',
        userId: '1',
        username: '极简摄影师林风',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
        content: '是的，我等待了大约30分钟，直到阳光到达这个特定角度，形成了我想要的光影效果。建筑摄影中，光线的方向和质量对最终效果的影响非常大，值得花时间等待最佳时机。',
        date: '2023-10-25 09:30',
        likes: 56,
        isLiked: false,
      },
    ],
  },
  {
    id: '3',
    userId: '4',
    username: '摄影学习者小张',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20student%20male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8',
    content: '我正在学习极简摄影，想请教一下如何在城市环境中发现这种简洁的构图？有什么寻找拍摄对象的技巧吗？',
    date: '2023-10-25 08:30',
    likes: 56,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        userId: '1',
        username: '极简摄影师林风',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
        content: '我的建议是：1. 放慢脚步，用\"框架思维\"观察周围环境；2. 寻找重复的图案和线条；3. 尝试从不同角度观察同一物体；4. 使用三分法或对称构图；5. 关注负空间的重要性；6. 练习用单色模式（黑白）观察场景，有助于聚焦于形状和线条。最重要的是多拍多练，培养自己的极简视觉。',
        date: '2023-10-25 09:00',
        likes: 120,
        isLiked: false,
      },
      {
        id: '3-2',
        userId: '5',
        username: '艺术摄影师陈默',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20male%20creative&sign=bceaa07bd21b90efedda5c86e7059959',
        content: '补充一点，我建议随身携带一个小取景器或者用双手框成矩形来辅助构图，这有助于训练你的眼睛直接识别场景中的几何元素和简洁构图。另外，可以尝试使用定焦镜头，限制自己的视角，从而更专注于构图本身。',
        date: '2023-10-25 09:30',
        likes: 67,
        isLiked: false,
      },
    ],
  },
]);
const replyingTo = ref(null);
const replyText = ref('');
const showFullComments = ref(true);

// 计算属性
const displayComments = computed(() => {
  return showFullComments.value ? comments.value : comments.value.slice(0, 2);
});

// 处理评论提交
const handleSubmitComment = () => {
  if (!isAuthenticated.value) {
    toast.info('请先登录后再评论');
    return;
  }

  if (!commentText.value.trim()) {
    toast.warning('评论内容不能为空');
    return;
  }

  // 创建新评论
  const newComment = {
    id: `comment-${Date.now()}`,
    userId: user.value?.id || '',
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    content: commentText.value.trim(),
    date: new Date().toLocaleString('zh-CN'),
    likes: 0,
    isLiked: false,
  };

  // 添加到评论列表
  comments.value.unshift(newComment);
  commentText.value = '';

  toast.success('评论发表成功');
};

// 处理回复提交
const handleSubmitReply = (commentId) => {
  if (!isAuthenticated.value) {
    toast.info('请先登录后再回复');
    return;
  }

  if (!replyText.value.trim()) {
    toast.warning('回复内容不能为空');
    return;
  }

  // 创建新回复
  const newReply = {
    id: `reply-${Date.now()}`,
    userId: user.value?.id || '',
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    content: replyText.value.trim(),
    date: new Date().toLocaleString('zh-CN'),
    likes: 0,
    isLiked: false,
  };

  // 更新评论列表，添加回复
  comments.value = comments.value.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newReply]
      };
    }
    return comment;
  });

  replyText.value = '';
  replyingTo.value = null;

  toast.success('回复发表成功');
};

// 处理点赞
const handleLike = (commentId, isReply = false, replyId = undefined) => {
  if (!isAuthenticated.value) {
    toast.info('请先登录后再点赞');
    return;
  }

  // 更新评论列表中的点赞状态
  comments.value = comments.value.map(comment => {
    // 如果是主评论
    if (comment.id === commentId && !isReply) {
      return {
        ...comment,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked
      };
    }

    // 如果是回复
    if (isReply && comment.replies) {
      const updatedReplies = comment.replies.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
            isLiked: !reply.isLiked
          };
        }
        return reply;
      });

      return {
        ...comment,
        replies: updatedReplies
      };
    }

    return comment;
  });
};

// 组件挂载时的初始化
onMounted(() => {
  // 这里可以添加从后端获取评论的逻辑
});
</script>

<style scoped>
/* Comment Section styles */
</style>