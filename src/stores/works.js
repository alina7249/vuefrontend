import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorksStore = defineStore('works', () => {
  // 作品列表
  const works = ref([])
  // 加载状态
  const isLoading = ref(false)
  // 当前页码
  const currentPage = ref(1)
  // 是否还有更多数据
  const hasMore = ref(true)
  // 当前排序方式
  const sortBy = ref('latest') // latest, popular, recommended
  // 当前筛选条件
  const filters = ref({
    cameraBrand: [],
    lensType: [],
    accessories: [],
    apertureRange: [],
    shutterSpeed: [],
    isoRange: [],
    categories: [],
    tags: []
  })
  // 当前查看的作品
  const selectedWork = ref(null)
  // 大图预览模式
  const showPreview = ref(false)
  
  // 生成模拟作品数据
  const generateMockWorks = (page) => {
    const mockWorks = []
    const categories = ['人像', '风光', '纪实', '街拍', '生态', '建筑']
    const tags = ['逆光', '大光圈', '黑白', '日落', '城市', '自然', '人文']
    const cameraBrands = ['佳能', '尼康', '索尼', '富士', '徕卡']
    const lensTypes = ['广角', '标准', '长焦', '定焦', '变焦']
    
    for (let i = 0; i < 12; i++) {
      const id = (page - 1) * 12 + i + 1
      const randomHeight = 200 + Math.floor(Math.random() * 300)
      
      mockWorks.push({
        id: `work-${id}`,
        title: `摄影作品 ${id}`,
        description: `这是一张精美的摄影作品，展示了独特的视觉效果和艺术表现力。`,
        imageUrl: `https://picsum.photos/id/${id + 20}/400/${randomHeight}`,
        thumbnailUrl: `https://picsum.photos/id/${id + 20}/200/${Math.floor(randomHeight / 2)}`,
        aspectRatio: 400 / randomHeight,
        photographer: {
          id: `user-${Math.floor(Math.random() * 10) + 1}`,
          name: `摄影师${Math.floor(Math.random() * 100) + 1}`,
          avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 50) + 1}/40/40`
        },
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        collections: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        tags: [
          tags[Math.floor(Math.random() * tags.length)],
          tags[Math.floor(Math.random() * tags.length)]
        ],
        exif: {
          camera: `${cameraBrands[Math.floor(Math.random() * cameraBrands.length)]} EOS R5`,
          lens: `${lensTypes[Math.floor(Math.random() * lensTypes.length)]} 24-70mm f/2.8`,
          aperture: `f/${(1.4 + Math.random() * 5).toFixed(1)}`,
          shutterSpeed: `1/${(100 + Math.random() * 1900).toFixed(0)}s`,
          iso: 100 * Math.pow(2, Math.floor(Math.random() * 6)),
          focalLength: `${(16 + Math.random() * 200).toFixed(0)}mm`,
          location: '中国，某个美丽的地方',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        isLiked: false,
        isCollected: false
      })
    }
    
    return mockWorks
  }
  
  // 加载作品
  const loadWorks = async (page = 1) => {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newWorks = generateMockWorks(page)
      
      if (page === 1) {
        works.value = newWorks
      } else {
        works.value = [...works.value, ...newWorks]
      }
      
      // 模拟有限数据
      hasMore.value = page < 5
      currentPage.value = page
    } catch (error) {
      console.error('加载作品失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 加载更多作品
  const loadMoreWorks = async () => {
    if (!hasMore.value || isLoading.value) return
    
    await loadWorks(currentPage.value + 1)
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      cameraBrand: [],
      lensType: [],
      accessories: [],
      apertureRange: [],
      shutterSpeed: [],
      isoRange: [],
      categories: [],
      tags: []
    }
    currentPage.value = 1
    hasMore.value = true
  }
  
  // 设置排序方式
  const setSortBy = (sort) => {
    if (sortBy.value !== sort) {
      sortBy.value = sort
      currentPage.value = 1
      hasMore.value = true
      loadWorks(1)
    }
  }
  
  // 添加筛选条件
  const addFilter = (filterType, value) => {
    if (!filters.value[filterType].includes(value)) {
      filters.value[filterType].push(value)
      currentPage.value = 1
      hasMore.value = true
      loadWorks(1)
    }
  }
  
  // 移除筛选条件
  const removeFilter = (filterType, value) => {
    const index = filters.value[filterType].indexOf(value)
    if (index > -1) {
      filters.value[filterType].splice(index, 1)
      currentPage.value = 1
      hasMore.value = true
      loadWorks(1)
    }
  }
  
  // 设置当前作品
  const setSelectedWork = (work) => {
    selectedWork.value = work
    showPreview.value = true
  }
  
  // 关闭预览
  const closePreview = () => {
    showPreview.value = false
    selectedWork.value = null
  }
  
  // 点赞作品
  const likeWork = (workId) => {
    const work = works.value.find(w => w.id === workId)
    if (work) {
      if (work.isLiked) {
        work.likes--
      } else {
        work.likes++
      }
      work.isLiked = !work.isLiked
    }
  }
  
  // 收藏作品
  const collectWork = (workId) => {
    const work = works.value.find(w => w.id === workId)
    if (work) {
      if (work.isCollected) {
        work.collections--
      } else {
        work.collections++
      }
      work.isCollected = !work.isCollected
    }
  }
  
  // 筛选后的作品（实际应用中应该在后端进行筛选）
  const filteredWorks = computed(() => {
    let filtered = [...works.value]
    
    // 根据排序方式排序
    switch (sortBy.value) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'recommended':
        // 模拟推荐排序
        filtered.sort(() => Math.random() - 0.5)
        break
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }
    
    // 应用筛选条件（实际应用中应该在后端进行）
    // 这里省略具体筛选逻辑
    
    return filtered
  })
  
  return {
    works: filteredWorks,
    isLoading,
    currentPage,
    hasMore,
    sortBy,
    filters,
    selectedWork,
    showPreview,
    loadWorks,
    loadMoreWorks,
    resetFilters,
    setSortBy,
    addFilter,
    removeFilter,
    setSelectedWork,
    closePreview,
    likeWork,
    collectWork
  }
})