<template>
  <div class="upload-container">
    <!-- 页面头部 -->
  <div class="upload-header">
    <h1 class="page-title">上传作品</h1>
      <p class="page-subtitle">分享你的摄影创作，与社区共同成长</p>
    </div>
    
    <!-- 上传步骤指示器 -->
    <div class="upload-steps">
      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">{{ currentStep > 1 ? '✓' : '1' }}</div>
        <div class="step-name">选择照片</div>
      </div>
      <div class="step-connector"></div>
      <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <div class="step-number">{{ currentStep > 2 ? '✓' : '2' }}</div>
        <div class="step-name">编辑照片</div>
      </div>
      <div class="step-connector"></div>
      <div class="step-item" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
        <div class="step-number">{{ currentStep > 3 ? '✓' : '3' }}</div>
        <div class="step-name">填写信息</div>
      </div>
      <div class="step-connector"></div>
      <div class="step-item" :class="{ active: currentStep === 4 }">
        <div class="step-number">4</div>
        <div class="step-name">发布成功</div>
      </div>
    </div>
    
    <!-- 上传区域 -->
    <div class="upload-content">
      <!-- 步骤1：选择照片 -->
      <div v-if="currentStep === 1" class="upload-step-1">
        <div class="upload-box glass-effect" @click="triggerFileInput">
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*"
            multiple
            @change="handleFileSelect"
            style="display: none;"
          />
          <div class="upload-icon-container">
            <div class="camera-icon">📷</div>
          </div>
          <h3 class="upload-title">点击上传或拖拽照片到此处</h3>
          <p class="upload-description">支持 JPG、PNG、WebP 格式，单张不超过20MB</p>
          <div class="upload-button shutter-button">
            选择照片
          </div>
        </div>
        
        <!-- 已选择的照片预览 -->
        <div v-if="selectedFiles.length > 0" class="selected-files">
          <h4 class="selected-title">已选择 {{ selectedFiles.length }} 张照片</h4>
          <div class="file-preview-grid">
            <div class="file-preview" v-for="(file, index) in selectedFiles" :key="index">
              <img :src="file.previewUrl" :alt="file.name" class="preview-image" />
              <button class="remove-file" @click="removeFile(index)">×</button>
              <div class="file-info">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </div>
            </div>
          </div>
          <button class="next-step-btn shutter-button" @click="goToNextStep" :disabled="selectedFiles.length === 0">
            下一步
          </button>
        </div>
      </div>
      
      <!-- 步骤2：编辑照片 -->
      <div v-else-if="currentStep === 2" class="upload-step-2">
        <div class="edit-container">
          <!-- 照片预览 -->
          <div class="edit-preview">
            <div class="preview-wrapper">
              <img :src="currentEditFile?.previewUrl || ''" alt="编辑预览" class="edit-image" />
              <div class="film-frame"></div>
            </div>
          </div>
          
          <!-- 编辑工具 -->
          <div class="edit-tools glass-effect">
            <h3 class="tools-title">编辑工具</h3>
            
            <!-- 滤镜选择 -->
            <div class="tool-section">
              <h4 class="section-title">滤镜</h4>
              <div class="filter-grid">
                <div class="filter-item" :class="{ active: selectedFilter === 'original' }" @click="selectFilter('original')">
                  <div class="filter-preview">
                    <img :src="currentEditFile?.previewUrl || ''" alt="原图" class="filter-thumb" />
                  </div>
                  <div class="filter-name">原图</div>
                </div>
                <div class="filter-item" :class="{ active: selectedFilter === 'blackwhite' }" @click="selectFilter('blackwhite')">
                  <div class="filter-preview blackwhite">
                    <img :src="currentEditFile?.previewUrl || ''" alt="黑白" class="filter-thumb" />
                  </div>
                  <div class="filter-name">黑白</div>
                </div>
                <div class="filter-item" :class="{ active: selectedFilter === 'sepia' }" @click="selectFilter('sepia')">
                  <div class="filter-preview sepia">
                    <img :src="currentEditFile?.previewUrl || ''" alt="棕褐色" class="filter-thumb" />
                  </div>
                  <div class="filter-name">棕褐色</div>
                </div>
                <div class="filter-item" :class="{ active: selectedFilter === 'vintage' }" @click="selectFilter('vintage')">
                  <div class="filter-preview vintage">
                    <img :src="currentEditFile?.previewUrl || ''" alt="复古" class="filter-thumb" />
                  </div>
                  <div class="filter-name">复古</div>
                </div>
                <div class="filter-item" :class="{ active: selectedFilter === 'highcontrast' }" @click="selectFilter('highcontrast')">
                  <div class="filter-preview highcontrast">
                    <img :src="currentEditFile?.previewUrl || ''" alt="高对比度" class="filter-thumb" />
                  </div>
                  <div class="filter-name">高对比度</div>
                </div>
                <div class="filter-item" :class="{ active: selectedFilter === 'pastel' }" @click="selectFilter('pastel')">
                  <div class="filter-preview pastel">
                    <img :src="currentEditFile?.previewUrl || ''" alt="马卡龙" class="filter-thumb" />
                  </div>
                  <div class="filter-name">马卡龙</div>
                </div>
              </div>
            </div>
            
            <!-- 调整参数 -->
            <div class="tool-section">
              <h4 class="section-title">调整参数</h4>
              
              <div class="adjustment-item">
                <label class="adjustment-label">亮度</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  v-model="brightness" 
                  class="adjustment-slider"
                  @input="applyAdjustments"
                />
                <span class="adjustment-value">{{ brightness }}</span>
              </div>
              
              <div class="adjustment-item">
                <label class="adjustment-label">对比度</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  v-model="contrast" 
                  class="adjustment-slider"
                  @input="applyAdjustments"
                />
                <span class="adjustment-value">{{ contrast }}</span>
              </div>
              
              <div class="adjustment-item">
                <label class="adjustment-label">饱和度</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  v-model="saturation" 
                  class="adjustment-slider"
                  @input="applyAdjustments"
                />
                <span class="adjustment-value">{{ saturation }}</span>
              </div>
              
              <div class="adjustment-item">
                <label class="adjustment-label">锐度</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  v-model="sharpness" 
                  class="adjustment-slider"
                  @input="applyAdjustments"
                />
                <span class="adjustment-value">{{ sharpness }}</span>
              </div>
              
              <div class="adjustment-item">
                <label class="adjustment-label">色温</label>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  v-model="temperature" 
                  class="adjustment-slider"
                  @input="applyAdjustments"
                />
                <span class="adjustment-value">{{ temperature }}</span>
              </div>
            </div>
            
            <!-- 编辑操作按钮 -->
            <div class="edit-actions">
              <button class="reset-btn" @click="resetAdjustments">重置调整</button>
              <button class="save-btn shutter-button" @click="saveEdits">应用到所有照片</button>
            </div>
          </div>
        </div>
        
        <!-- 照片列表导航 -->
        <div class="edit-navigation">
          <button class="prev-btn" @click="prevEditFile" :disabled="currentEditIndex === 0">上一张</button>
          <span class="edit-counter">{{ currentEditIndex + 1 }} / {{ selectedFiles.length }}</span>
          <button class="next-btn" @click="nextEditFile" :disabled="currentEditIndex === selectedFiles.length - 1">下一张</button>
        </div>
        
        <!-- 步骤导航 -->
        <div class="step-navigation">
          <button class="prev-step-btn" @click="goToPrevStep">上一步</button>
          <button class="next-step-btn shutter-button" @click="goToNextStep">下一步</button>
        </div>
      </div>
      
      <!-- 步骤3：填写信息 -->
      <div v-else-if="currentStep === 3" class="upload-step-3">
        <div class="upload-form glass-effect">
          <h3 class="form-title">作品信息</h3>
          
          <div class="form-group">
            <label class="form-label" for="title">作品标题 <span class="required">*</span></label>
            <input 
              type="text" 
              id="title" 
              v-model="workInfo.title" 
              class="form-input"
              placeholder="请输入作品标题"
              maxlength="50"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="description">作品描述</label>
            <textarea 
              id="description" 
              v-model="workInfo.description" 
              class="form-textarea"
              placeholder="分享你的创作思路、拍摄参数或背后的故事..."
              rows="5"
              maxlength="500"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="category">作品分类 <span class="required">*</span></label>
              <select 
                id="category" 
                v-model="workInfo.category" 
                class="form-select"
              >
                <option value="">请选择分类</option>
                <option value="portrait">人像摄影</option>
                <option value="landscape">风景摄影</option>
                <option value="street">街头摄影</option>
                <option value="macro">微距摄影</option>
                <option value="architecture">建筑摄影</option>
                <option value="travel">旅行摄影</option>
                <option value="animal">动物摄影</option>
                <option value="still-life">静物摄影</option>
                <option value="abstract">抽象摄影</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="equipment">使用器材</label>
              <input 
                type="text" 
                id="equipment" 
                v-model="workInfo.equipment" 
                class="form-input"
                placeholder="例如：索尼 A7M4 + 24-70mm F2.8"
                maxlength="100"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="location">拍摄地点</label>
              <input 
                type="text" 
                id="location" 
                v-model="workInfo.location" 
                class="form-input"
                placeholder="请输入拍摄地点"
                maxlength="100"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label" for="tags">标签</label>
              <input 
                type="text" 
                id="tags" 
                v-model="workInfo.tags"
                class="form-input"
                placeholder="用逗号分隔多个标签，最多添加10个"
                maxlength="200"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="exif">拍摄参数</label>
            <div class="exif-inputs">
              <div class="exif-input">
                <span class="exif-label">光圈</span>
                <input type="text" v-model="workInfo.exif.aperture" placeholder="F2.8" />
              </div>
              <div class="exif-input">
                <span class="exif-label">快门</span>
                <input type="text" v-model="workInfo.exif.shutter" placeholder="1/250s" />
              </div>
              <div class="exif-input">
                <span class="exif-label">ISO</span>
                <input type="text" v-model="workInfo.exif.iso" placeholder="100" />
              </div>
              <div class="exif-input">
                <span class="exif-label">焦距</span>
                <input type="text" v-model="workInfo.exif.focalLength" placeholder="50mm" />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">隐私设置</label>
            <div class="privacy-options">
              <label class="privacy-option">
                <input type="radio" value="public" v-model="workInfo.privacy" checked />
                <span class="privacy-text">公开作品</span>
              </label>
              <label class="privacy-option">
                <input type="radio" value="private" v-model="workInfo.privacy" />
                <span class="privacy-text">仅自己可见</span>
              </label>
              <label class="privacy-option">
                <input type="radio" value="friends" v-model="workInfo.privacy" />
                <span class="privacy-text">仅关注者可见</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" v-model="workInfo.allowComments" checked />
              <span class="checkbox-text">允许其他人评论</span>
            </label>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" v-model="workInfo.allowDownload" />
              <span class="checkbox-text">允许其他人下载</span>
            </label>
          </div>
        </div>
        
        <!-- 步骤导航 -->
        <div class="step-navigation">
          <button class="prev-step-btn" @click="goToPrevStep">上一步</button>
          <button class="publish-btn shutter-button" @click="publishWork" :disabled="!canPublish">
            发布作品
          </button>
        </div>
      </div>
      
      <!-- 步骤4：发布成功 -->
      <div v-else-if="currentStep === 4" class="upload-step-4">
        <div class="success-container">
          <div class="film-advance-animation">
            <div class="film-frame"></div>
            <div class="developing-text">作品正在显影中...</div>
          </div>
          <div class="success-icon">✓</div>
          <h3 class="success-title">发布成功！</h3>
          <p class="success-message">你的作品已成功发布到LensFlow社区</p>
          <div class="success-actions">
            <button class="view-work-btn shutter-button" @click="viewPublishedWork">
              查看我的作品
            </button>
            <button class="upload-more-btn" @click="uploadMore">
              上传更多作品
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 上传进度弹窗 -->
    <div v-if="showUploadProgress" class="progress-modal">
      <div class="progress-content">
        <h4 class="progress-title">正在上传作品...</h4>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ uploadProgress }}% - 正在处理第 {{ currentUploadIndex + 1 }} / {{ selectedFiles.length }} 张照片</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'UploadView',
  setup() {
    // 步骤控制
    const currentStep = ref(1);
    const fileInput = ref(null);
    
    // 上传进度
    const showUploadProgress = ref(false);
    const uploadProgress = ref(0);
    const currentUploadIndex = ref(0);
    
    // 已选择的文件
    const selectedFiles = ref([]);
    
    // 编辑状态
    const currentEditIndex = ref(0);
    const selectedFilter = ref('original');
    const brightness = ref(0);
    const contrast = ref(0);
    const saturation = ref(0);
    const sharpness = ref(0);
    const temperature = ref(0);
    
    // 作品信息
    const workInfo = ref({
      title: '',
      description: '',
      category: '',
      equipment: '',
      location: '',
      tags: '',
      exif: {
        aperture: '',
        shutter: '',
        iso: '',
        focalLength: ''
      },
      privacy: 'public',
      allowComments: true,
      allowDownload: false
    });
    
    // 计算当前编辑的文件
    const currentEditFile = computed(() => {
      return selectedFiles.value[currentEditIndex.value] || null;
    });
    
    // 检查是否可以发布
    const canPublish = computed(() => {
      return workInfo.value.title.trim() !== '' && workInfo.value.category !== '';
    });
    
    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value?.click();
    };
    
    // 处理文件选择
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        // 检查文件类型和大小
        if (!file.type.startsWith('image/')) {
          alert('请选择有效的图片文件');
          return;
        }
        
        if (file.size > 20 * 1024 * 1024) {
          alert('图片大小不能超过20MB');
          return;
        }
        
        // 生成预览URL
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedFiles.value.push({
            file: file,
            name: file.name,
            size: file.size,
            previewUrl: e.target.result,
            edits: {
              filter: 'original',
              brightness: 0,
              contrast: 0,
              saturation: 0,
              sharpness: 0,
              temperature: 0
            }
          });
        };
        reader.readAsDataURL(file);
      });
      
      // 清空input以便再次选择同一文件
      event.target.value = '';
    };
    
    // 移除文件
    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1);
      if (currentEditIndex.value >= selectedFiles.value.length && selectedFiles.value.length > 0) {
        currentEditIndex.value = selectedFiles.value.length - 1;
        loadEditState();
      } else if (selectedFiles.value.length === 0) {
        currentEditIndex.value = 0;
      }
    };
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 加载编辑状态
    const loadEditState = () => {
      const file = currentEditFile.value;
      if (!file) return;
      
      selectedFilter.value = file.edits.filter || 'original';
      brightness.value = file.edits.brightness || 0;
      contrast.value = file.edits.contrast || 0;
      saturation.value = file.edits.saturation || 0;
      sharpness.value = file.edits.sharpness || 0;
      temperature.value = file.edits.temperature || 0;
    };
    
    // 选择滤镜
    const selectFilter = (filter) => {
      selectedFilter.value = filter;
      applyAdjustments();
    };
    
    // 应用调整
    const applyAdjustments = () => {
      const file = currentEditFile.value;
      if (!file) return;
      
      file.edits = {
        filter: selectedFilter.value,
        brightness: brightness.value,
        contrast: contrast.value,
        saturation: saturation.value,
        sharpness: sharpness.value,
        temperature: temperature.value
      };
    };
    
    // 重置调整
    const resetAdjustments = () => {
      selectedFilter.value = 'original';
      brightness.value = 0;
      contrast.value = 0;
      saturation.value = 0;
      sharpness.value = 0;
      temperature.value = 0;
      applyAdjustments();
    };
    
    // 保存编辑
    const saveEdits = () => {
      // 这里模拟将当前编辑应用到所有照片
      // 实际应用中可能需要单独处理每一张照片
      alert('编辑已保存！');
    };
    
    // 上一张/下一张
    const prevEditFile = () => {
      if (currentEditIndex.value > 0) {
        currentEditIndex.value--;
        loadEditState();
      }
    };
    
    const nextEditFile = () => {
      if (currentEditIndex.value < selectedFiles.value.length - 1) {
        currentEditIndex.value++;
        loadEditState();
      }
    };
    
    // 步骤导航
    const goToNextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++;
        
        // 加载编辑状态
        if (currentStep.value === 2) {
          loadEditState();
        }
      }
    };
    
    const goToPrevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };
    
    // 发布作品
    const publishWork = () => {
      if (!canPublish.value) return;
      
      showUploadProgress.value = true;
      uploadProgress.value = 0;
      currentUploadIndex.value = 0;
      
      // 模拟上传进度
      simulateUpload();
    };
    
    // 模拟上传
    const simulateUpload = () => {
      if (currentUploadIndex.value >= selectedFiles.value.length) {
        // 所有文件上传完成
        setTimeout(() => {
          showUploadProgress.value = false;
          goToNextStep();
        }, 1000);
        return;
      }
      
      // 模拟单个文件上传进度
      const interval = setInterval(() => {
        uploadProgress.value += 1;
        
        if (uploadProgress.value >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            currentUploadIndex.value++;
            uploadProgress.value = 0;
            simulateUpload();
          }, 500);
        }
      }, 50);
    };
    
    // 查看已发布作品
    const viewPublishedWork = () => {
      // 跳转到用户作品页面
      // 实际项目中应添加路由跳转代码
    };
    
    // 上传更多
    const uploadMore = () => {
      // 重置状态
      currentStep.value = 1;
      selectedFiles.value = [];
      currentEditIndex.value = 0;
      workInfo.value = {
        title: '',
        description: '',
        category: '',
        equipment: '',
        location: '',
        tags: '',
        exif: {
          aperture: '',
          shutter: '',
          iso: '',
          focalLength: ''
        },
        privacy: 'public',
        allowComments: true,
        allowDownload: false
      };
    };
    
    // 监听编辑索引变化，自动加载编辑状态
    watch(currentEditIndex, () => {
      loadEditState();
    });
    
    return {
      currentStep,
      fileInput,
      showUploadProgress,
      uploadProgress,
      currentUploadIndex,
      selectedFiles,
      currentEditIndex,
      currentEditFile,
      selectedFilter,
      brightness,
      contrast,
      saturation,
      sharpness,
      temperature,
      workInfo,
      canPublish,
      triggerFileInput,
      handleFileSelect,
      removeFile,
      formatFileSize,
      selectFilter,
      applyAdjustments,
      resetAdjustments,
      saveEdits,
      prevEditFile,
      nextEditFile,
      goToNextStep,
      goToPrevStep,
      publishWork,
      viewPublishedWork,
      uploadMore
    };
  }
};
</script>

<style scoped>
.upload-container {
  min-height: 100vh;
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
}

.upload-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
  padding: var(--spacing-xxl) 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.upload-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--text-secondary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

.step-item.completed .step-number {
  background-color: var(--accent-color);
}

.step-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.step-item.active .step-name {
  color: var(--primary-color);
  font-weight: 500;
}

.step-item.completed .step-name {
  color: var(--accent-color);
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: var(--border-color);
  margin: 0 var(--spacing-md);
}

.upload-step-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-box {
  width: 100%;
  max-width: 600px;
  padding: var(--spacing-xxl);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: var(--primary-color);
  background-color: rgba(42, 92, 140, 0.05);
}

.upload-icon-container {
  margin-bottom: var(--spacing-lg);
}

.camera-icon {
  font-size: 3rem;
  animation: camera-rotate 3s infinite ease-in-out;
}

@keyframes camera-rotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(2deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.upload-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.upload-button {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background-color: var(--primary-dark);
}

.selected-files {
  width: 100%;
  margin-top: var(--spacing-xl);
}

.selected-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.file-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.file-preview {
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.remove-file {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background-color: rgba(255, 0, 0, 0.8);
}

.file-info {
  padding: var(--spacing-sm);
  background-color: var(--card-bg);
}

.file-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.next-step-btn {
  display: block;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-step-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.next-step-btn:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

.upload-step-2 {
  display: flex;
  flex-direction: column;
}

.edit-container {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.edit-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.preview-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 500px;
}

.edit-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.film-frame {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 2px solid var(--primary-color);
  border-radius: calc(var(--border-radius) + 10px);
  pointer-events: none;
  animation: film-border 5s infinite linear;
}

@keyframes film-border {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.02); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
}

.edit-tools {
  width: 350px;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.tools-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.tool-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.filter-item {
  cursor: pointer;
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
}

.filter-item:hover {
  transform: translateY(-2px);
}

.filter-item.active {
  border: 2px solid var(--primary-color);
}

.filter-preview {
  width: 100%;
  height: 80px;
  overflow: hidden;
  position: relative;
}

.filter-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.filter-item:hover .filter-thumb {
  transform: scale(1.1);
}

.filter-name {
  text-align: center;
  padding: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 滤镜效果 */
.filter-preview.blackwhite .filter-thumb {
  filter: grayscale(100%);
}

.filter-preview.sepia .filter-thumb {
  filter: sepia(100%);
}

.filter-preview.vintage .filter-thumb {
  filter: sepia(30%) brightness(90%) contrast(110%);
}

.filter-preview.highcontrast .filter-thumb {
  filter: contrast(130%);
}

.filter-preview.pastel .filter-thumb {
  filter: saturate(70%) brightness(105%);
}

.adjustment-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.adjustment-label {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.adjustment-slider {
  flex: 3;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  outline: none;
  border-radius: 2px;
}

.adjustment-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--primary-color);
  cursor: pointer;
  border-radius: 50%;
}

.adjustment-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--primary-color);
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

.adjustment-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-family: 'Roboto Mono', monospace;
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.reset-btn {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.save-btn {
  flex: 1;
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: var(--primary-dark);
}

.edit-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.prev-btn,
.next-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.prev-btn:hover:not(:disabled),
.next-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.prev-btn:disabled,
.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-counter {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-family: 'Roboto Mono', monospace;
}

.step-navigation {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.prev-step-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.prev-step-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.upload-step-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-form {
  width: 100%;
  max-width: 800px;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  margin-bottom: var(--spacing-lg);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: flex;
  gap: var(--spacing-lg);
}

.form-row .form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.required {
  color: var(--error-color);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 140, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.exif-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.exif-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.exif-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.exif-input input {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-align: center;
  font-family: 'Roboto Mono', monospace;
}

.privacy-options {
  display: flex;
  gap: var(--spacing-lg);
}

.privacy-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}

.privacy-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.checkbox-text {
  margin-left: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.publish-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.publish-btn:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

.upload-step-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.success-container {
  text-align: center;
}

.film-advance-animation {
  margin-bottom: var(--spacing-xl);
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.developing-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: var(--primary-color);
  opacity: 0.8;
  animation: developing-fade 4s infinite ease-in-out;
}

@keyframes developing-fade {
  0% { opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { opacity: 0.3; }
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(212, 175, 55, 0.2);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto var(--spacing-lg);
  animation: success-pulse 1s ease-in-out;
}

@keyframes success-pulse {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.success-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.success-message {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.view-work-btn,
.upload-more-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-work-btn {
  border: none;
  background-color: var(--primary-color);
  color: white;
}

.view-work-btn:hover {
  background-color: var(--primary-dark);
}

.upload-more-btn {
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-secondary);
}

.upload-more-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.progress-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.progress-content {
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  text-align: center;
}

.progress-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: var(--border-color);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.2) 10px,
    rgba(255, 255, 255, 0.2) 20px
  );
  animation: film-roll 1s linear infinite;
}

@keyframes film-roll {
  0% { background-position: 0 0; }
  100% { background-position: 20px 0; }
}

.progress-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-family: 'Roboto Mono', monospace;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .edit-container {
    flex-direction: column;
  }
  
  .edit-tools {
    width: 100%;
  }
  
  .exif-inputs {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .upload-steps {
    flex-wrap: wrap;
  }
  
  .step-item {
    margin-bottom: var(--spacing-md);
  }
  
  .step-connector {
    display: none;
  }
  
  .form-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .upload-container {
    padding: var(--spacing-md);
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .success-actions {
    flex-direction: column;
  }
}
</style>