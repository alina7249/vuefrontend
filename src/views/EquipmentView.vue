<template>
  <div class="equipment-container">
    <!-- 器材模块头部 -->
    <div class="equipment-header">
      <h1>器材交流</h1>
      <p>发现、评测、交易摄影器材的全生命周期平台</p>
    </div>
    
    <!-- 器材导航 -->
    <div class="equipment-nav">
      <button
        v-for="tab in equipmentTabs"
        :key="tab.value"
        class="nav-tab"
        :class="{ active: currentTab === tab.value }"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 器材数据库区域 -->
    <div v-if="currentTab === 'database'" class="database-section">
      <div class="database-header">
        <h2>器材数据库</h2>
        <div class="database-filters">
          <div class="filter-group">
            <label>类型:</label>
            <select v-model="equipmentType" class="filter-select">
              <option value="all">全部类型</option>
              <option value="camera">相机</option>
              <option value="lens">镜头</option>
              <option value="accessory">配件</option>
            </select>
          </div>
          <div class="filter-group">
            <label>品牌:</label>
            <select v-model="equipmentBrand" class="filter-select">
              <option value="all">全部品牌</option>
              <option value="canon">佳能</option>
              <option value="nikon">尼康</option>
              <option value="sony">索尼</option>
              <option value="fujifilm">富士</option>
              <option value="panasonic">松下</option>
              <option value="leica">徕卡</option>
              <option value="sigma">适马</option>
              <option value="tamron">腾龙</option>
            </select>
          </div>
          <div class="filter-group">
            <label>排序:</label>
            <select v-model="equipmentSort" class="filter-select">
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="rating">评分最高</option>
              <option value="price_low">价格从低到高</option>
              <option value="price_high">价格从高到低</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="equipmentSearch" placeholder="搜索器材型号..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="equipment-grid">
        <div v-for="equipment in equipmentData" :key="equipment.id" class="equipment-card" :data-id="equipment.id">
          <div class="equipment-image">
            <img :src="equipment.imageUrl" :alt="equipment.name" />
            <div class="equipment-type-badge" :class="equipment.type">
              {{ getTypeLabel(equipment.type) }}
            </div>
          </div>
          
          <div class="equipment-info">
            <div class="equipment-brand-name">
              <span class="brand" :class="equipment.brand">
                {{ getBrandLabel(equipment.brand) }}
              </span>
              <h3 class="equipment-name">{{ equipment.name }}</h3>
            </div>
            
            <div class="equipment-rating">
              <div class="rating-stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= equipment.rating }">★</span>
              </div>
              <span class="rating-score">{{ equipment.rating.toFixed(1) }}</span>
              <span class="rating-count">({{ equipment.ratingCount }} 评测)</span>
            </div>
            
            <div v-if="equipment.price" class="equipment-price">
              <span class="price-text">参考价格:</span>
              <span class="price-value">¥{{ equipment.price.toLocaleString() }}</span>
            </div>
            
            <div class="equipment-actions">
              <button class="detail-button" @click="viewDetails(equipment.id)">查看详情</button>
              <button class="review-button" @click="viewReviews(equipment.id)">查看评测</button>
            </div>
          </div>

          <!-- Hover 白底详情层（统一交互） -->
          <div class="equip-hover-detail">
            <div class="equip-hover-left">
              <img :src="equipment.imageUrl" :alt="equipment.name" class="equip-hover-image" />
            </div>
            <div class="equip-hover-right">
              <h3 class="equip-hover-title">{{ equipment.name }}</h3>
              <div class="equip-hover-sub">{{ getBrandLabel(equipment.brand) }} · {{ getTypeLabel(equipment.type) }}</div>
              <div class="equip-hover-exif">
                <div class="exif-item" v-if="equipment.megapixels"><span class="label">像素</span><span class="value">{{ equipment.megapixels }} MP</span></div>
                <div class="exif-item" v-if="equipment.sensorSize"><span class="label">传感器</span><span class="value">{{ equipment.sensorSize }}</span></div>
                <div class="exif-item" v-if="equipment.isoRange"><span class="label">ISO</span><span class="value">{{ equipment.isoRange }}</span></div>
                <div class="exif-item" v-if="equipment.maxShutter"><span class="label">快门</span><span class="value">{{ equipment.maxShutter }}</span></div>
                <div class="exif-item" v-if="equipment.videoResolution"><span class="label">视频</span><span class="value">{{ equipment.videoResolution }}</span></div>
                <div class="exif-item" v-if="equipment.price"><span class="label">价格</span><span class="value">¥{{ equipment.price.toLocaleString() }}</span></div>
              </div>
              <div class="equip-hover-actions">
                <button class="hover-btn like" :class="{ active: equipment.liked }" @click.stop="likeEquip(equipment.id)">❤ {{ equipment.likes }}</button>
                <div class="collect-wrap" @click.stop>
                  <button class="hover-btn collect" :class="{ active: equipment.collected }" @click="toggleEquipCollectMenu(equipment.id)">🔖 {{ equipment.collections }}</button>
                  <div class="collect-menu" v-if="equipCollectMenuFor === equipment.id">
                    <div class="menu-title">加入个人灵感集</div>
                    <div class="menu-item" @click="confirmEquipCollect(equipment.id, '我的灵感A')">我的灵感A</div>
                    <div class="menu-item" @click="confirmEquipCollect(equipment.id, '我的灵感B')">我的灵感B</div>
                    <div class="menu-item" @click="confirmEquipCollect(equipment.id, '新建灵感集')">+ 新建灵感集</div>
                  </div>
                </div>
                <div class="comment-wrap" @click.stop>
                  <button class="hover-btn comment" @click="focusEquipComment(equipment.id)">💬 {{ equipment.comments }}</button>
                </div>
                <div class="share-wrap" @click.stop>
                  <button class="hover-btn share" @click="shareEquip(equipment.id)">🔗 分享</button>
                </div>
              </div>
              <div class="equip-hover-comment" v-if="equipCommentFor === equipment.id" @click.stop>
                <div class="rich-tools">
                  <button class="tool" @click="insertEquipEmoji('😊')">😊</button>
                  <button class="tool" @click="insertEquipEmoji('📷')">📷</button>
                  <label class="tool upload">
                    📎
                    <input type="file" accept="image/*" @change="attachEquipImage($event)" hidden />
                  </label>
                </div>
                <textarea class="rich-input" v-model="equipCommentText" placeholder="发表你的看法，支持表情与图片链接"></textarea>
                <div class="comment-actions">
                  <button class="submit" @click="submitEquipComment(equipment.id)">发布</button>
                </div>
              </div>
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
    
    <!-- 二手交易区域 -->
    <div v-else-if="currentTab === 'used'" class="used-section">
      <div class="used-header">
        <h2>二手交易</h2>
        <button class="publish-button" @click="publishItem">发布闲置</button>
      </div>
      
      <div class="used-filters">
        <div class="filter-group">
          <label>类型:</label>
          <select v-model="usedType" class="filter-select">
            <option value="all">全部类型</option>
            <option value="camera">相机</option>
            <option value="lens">镜头</option>
            <option value="accessory">配件</option>
          </select>
        </div>
        <div class="filter-group">
          <label>品牌:</label>
          <select v-model="usedBrand" class="filter-select">
            <option value="all">全部品牌</option>
            <option value="canon">佳能</option>
            <option value="nikon">尼康</option>
            <option value="sony">索尼</option>
            <option value="fujifilm">富士</option>
            <option value="panasonic">松下</option>
          </select>
        </div>
        <div class="filter-group">
          <label>状态:</label>
          <select v-model="usedStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="new">全新</option>
            <option value="like_new">99新</option>
            <option value="excellent">95新</option>
            <option value="good">9成新</option>
            <option value="fair">8成新</option>
          </select>
        </div>
        <div class="filter-group">
          <label>价格:</label>
          <select v-model="usedPriceRange" class="filter-select">
            <option value="all">全部价格</option>
            <option value="0_2000">0-2000元</option>
            <option value="2000_5000">2000-5000元</option>
            <option value="5000_10000">5000-10000元</option>
            <option value="10000_20000">10000-20000元</option>
            <option value="20000_">20000元以上</option>
          </select>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="usedSearch" placeholder="搜索二手器材..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="used-items-grid">
        <div v-for="item in usedItemsData" :key="item.id" class="used-item-card" :class="{ sold: item.isSold }">
          <div class="used-item-image">
            <img :src="item.imageUrl" :alt="item.name" />
            <div v-if="item.isSold" class="sold-badge">已售罄</div>
            <div v-else class="for-sale-badge">在售</div>
          </div>
          
          <div class="used-item-info">
            <h3 class="used-item-name">{{ item.name }}</h3>
            <div class="used-item-meta">
              <span class="used-item-brand">{{ getBrandLabel(item.brand) }}</span>
              <span class="used-item-condition">{{ getConditionLabel(item.condition) }}</span>
              <span class="used-item-year">{{ item.year }}年购买</span>
            </div>
            
            <p class="used-item-description">{{ item.description }}</p>
            
            <div class="used-item-price">
              <span class="price-text">售价:</span>
              <span class="price-value">¥{{ item.price.toLocaleString() }}</span>
              <span v-if="item.originalPrice" class="original-price">
                原价: ¥{{ item.originalPrice.toLocaleString() }}
              </span>
            </div>
            
            <div class="used-item-location">
              <i class="location-icon">📍</i>
              {{ item.location }}
            </div>
            
            <div class="used-item-actions">
              <button v-if="!item.isSold" class="contact-button" @click="contactSeller(item.id)">联系卖家</button>
              <button class="favorite-button" @click="toggleFavorite(item.id)" :class="{ favorited: item.isFavorite }">
                {{ item.isFavorite ? '已收藏' : '收藏' }}
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
    
    <!-- 器材租赁区域 -->
    <div v-else-if="currentTab === 'rental'" class="rental-section">
      <div class="rental-header">
        <h2>器材租赁</h2>
        <button class="publish-button" @click="publishRental">发布租赁</button>
      </div>
      
      <div class="rental-filters">
        <div class="filter-group">
          <label>类型:</label>
          <select v-model="rentalType" class="filter-select">
            <option value="all">全部类型</option>
            <option value="camera">相机</option>
            <option value="lens">镜头</option>
            <option value="accessory">配件</option>
          </select>
        </div>
        <div class="filter-group">
          <label>品牌:</label>
          <select v-model="rentalBrand" class="filter-select">
            <option value="all">全部品牌</option>
            <option value="canon">佳能</option>
            <option value="nikon">尼康</option>
            <option value="sony">索尼</option>
            <option value="fujifilm">富士</option>
            <option value="panasonic">松下</option>
          </select>
        </div>
        <div class="filter-group">
          <label>租金:</label>
          <select v-model="rentalPriceRange" class="filter-select">
            <option value="all">全部租金</option>
            <option value="0_50">0-50元/天</option>
            <option value="50_100">50-100元/天</option>
            <option value="100_200">100-200元/天</option>
            <option value="200_500">200-500元/天</option>
            <option value="500_">500元/天以上</option>
          </select>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="rentalSearch" placeholder="搜索租赁器材..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="rental-items-grid">
        <div v-for="item in rentalItemsData" :key="item.id" class="rental-item-card">
          <div class="rental-item-image">
            <img :src="item.imageUrl" :alt="item.name" />
          </div>
          
          <div class="rental-item-info">
            <h3 class="rental-item-name">{{ item.name }}</h3>
            <div class="rental-item-meta">
              <span class="rental-item-brand">{{ getBrandLabel(item.brand) }}</span>
              <span class="rental-item-condition">{{ getConditionLabel(item.condition) }}</span>
            </div>
            
            <div class="rental-item-price">
              <span class="price-value">¥{{ item.pricePerDay }}/天</span>
              <span class="min-rental">起租: {{ item.minRentalDays }}天</span>
            </div>
            
            <div class="rental-item-location">
              <i class="location-icon">📍</i>
              {{ item.location }}
            </div>
            
            <div class="rental-item-stats">
              <span class="stat-item">
                <i class="rating-icon">⭐</i>
                {{ item.rating }} ({{ item.ratingCount }})
              </span>
              <span class="stat-item">
                <i class="rental-icon">📅</i>
                已租 {{ item.rentalCount }} 次
              </span>
            </div>
            
            <div class="rental-item-actions">
              <button class="rent-button" @click="rentItem(item.id)">立即租赁</button>
              <button class="favorite-button" @click="toggleRentalFavorite(item.id)" :class="{ favorited: item.isFavorite }">
                {{ item.isFavorite ? '已收藏' : '收藏' }}
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
    
    <!-- 器材对比区域 -->
    <div v-else-if="currentTab === 'compare'" class="compare-section">
      <div class="compare-header">
        <h2>器材对比</h2>
        <p>对比不同器材的参数和性能，帮助你做出更明智的购买决策</p>
      </div>
      
      <div class="compare-selection">
        <div class="compare-inputs">
          <div class="compare-input-group">
            <input type="text" placeholder="搜索第一个器材..." class="compare-input" v-model="compareItem1" />
            <div class="compare-suggestions" v-if="compareSuggestions1.length > 0">
              <div v-for="item in compareSuggestions1" :key="item.id" class="suggestion-item" @click="selectCompareItem(1, item)">
                {{ item.name }}
              </div>
            </div>
          </div>
          
          <div class="compare-vs">VS</div>
          
          <div class="compare-input-group">
            <input type="text" placeholder="搜索第二个器材..." class="compare-input" v-model="compareItem2" />
            <div class="compare-suggestions" v-if="compareSuggestions2.length > 0">
              <div v-for="item in compareSuggestions2" :key="item.id" class="suggestion-item" @click="selectCompareItem(2, item)">
                {{ item.name }}
              </div>
            </div>
          </div>
          
          <button class="compare-button" @click="performCompare" :disabled="!selectedItem1 || !selectedItem2">
            开始对比
          </button>
        </div>
      </div>
      
      <!-- 对比结果 -->
      <div v-if="selectedItem1 && selectedItem2" class="compare-result">
        <div class="compare-table-container">
          <table class="compare-table">
            <thead>
              <tr>
                <th>参数</th>
                <th class="comparison-item">{{ selectedItem1.name }}</th>
                <th class="comparison-item">{{ selectedItem2.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="param-name">品牌</td>
                <td>{{ getBrandLabel(selectedItem1.brand) }}</td>
                <td>{{ getBrandLabel(selectedItem2.brand) }}</td>
              </tr>
              <tr>
                <td class="param-name">类型</td>
                <td>{{ getTypeLabel(selectedItem1.type) }}</td>
                <td>{{ getTypeLabel(selectedItem2.type) }}</td>
              </tr>
              <tr>
                <td class="param-name">发布日期</td>
                <td>{{ selectedItem1.releaseDate || '未知' }}</td>
                <td>{{ selectedItem2.releaseDate || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">传感器尺寸</td>
                <td>{{ selectedItem1.sensorSize || '未知' }}</td>
                <td>{{ selectedItem2.sensorSize || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">像素</td>
                <td>{{ selectedItem1.megapixels || '未知' }} MP</td>
                <td>{{ selectedItem2.megapixels || '未知' }} MP</td>
              </tr>
              <tr>
                <td class="param-name">ISO范围</td>
                <td>{{ selectedItem1.isoRange || '未知' }}</td>
                <td>{{ selectedItem2.isoRange || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">最高快门速度</td>
                <td>{{ selectedItem1.maxShutter || '未知' }}</td>
                <td>{{ selectedItem2.maxShutter || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">视频分辨率</td>
                <td>{{ selectedItem1.videoResolution || '未知' }}</td>
                <td>{{ selectedItem2.videoResolution || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">自动对焦点数</td>
                <td>{{ selectedItem1.afPoints || '未知' }}</td>
                <td>{{ selectedItem2.afPoints || '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">重量</td>
                <td>{{ selectedItem1.weight || '未知' }} g</td>
                <td>{{ selectedItem2.weight || '未知' }} g</td>
              </tr>
              <tr>
                <td class="param-name">电池续航</td>
                <td>{{ selectedItem1.batteryLife || '未知' }} 张</td>
                <td>{{ selectedItem2.batteryLife || '未知' }} 张</td>
              </tr>
              <tr>
                <td class="param-name">参考价格</td>
                <td>¥{{ selectedItem1.price ? selectedItem1.price.toLocaleString() : '未知' }}</td>
                <td>¥{{ selectedItem2.price ? selectedItem2.price.toLocaleString() : '未知' }}</td>
              </tr>
              <tr>
                <td class="param-name">用户评分</td>
                <td>
                  <div class="rating-stars small">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= selectedItem1.rating }">★</span>
                  </div>
                  <span>{{ selectedItem1.rating.toFixed(1) }}</span>
                </td>
                <td>
                  <div class="rating-stars small">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= selectedItem2.rating }">★</span>
                  </div>
                  <span>{{ selectedItem2.rating.toFixed(1) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="compare-summary">
          <h3>对比总结</h3>
          <p>根据参数对比，{{ getBetterOption(selectedItem1, selectedItem2) }} 在综合性能上略占优势。具体选择还需根据您的实际需求和预算来决定。</p>
          <div class="compare-actions">
            <button class="detail-button" @click="viewDetails(selectedItem1.id)">查看 {{ selectedItem1.name }} 详情</button>
            <button class="detail-button" @click="viewDetails(selectedItem2.id)">查看 {{ selectedItem2.name }} 详情</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 器材技巧区域 -->
    <div v-else-if="currentTab === 'tips'" class="tips-section">
      <div class="tips-header">
        <h2>器材技巧</h2>
        <p>学习各品牌器材的使用技巧和最佳设置</p>
      </div>
      
      <div class="tips-filters">
        <div class="filter-group">
          <label>品牌:</label>
          <select v-model="tipsBrand" class="filter-select">
            <option value="all">全部品牌</option>
            <option value="canon">佳能</option>
            <option value="nikon">尼康</option>
            <option value="sony">索尼</option>
            <option value="fujifilm">富士</option>
            <option value="panasonic">松下</option>
          </select>
        </div>
        <div class="filter-group">
          <label>类型:</label>
          <select v-model="tipsType" class="filter-select">
            <option value="all">全部类型</option>
            <option value="camera">相机设置</option>
            <option value="lens">镜头使用</option>
            <option value="accessory">配件技巧</option>
          </select>
        </div>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="tipsSearch" placeholder="搜索器材技巧..." class="search-input" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="tips-list">
        <div v-for="tip in tipsData" :key="tip.id" class="tip-card">
          <div class="tip-header">
            <div class="tip-brand" :class="tip.brand">
              {{ getBrandLabel(tip.brand) }}
            </div>
            <h3 class="tip-title">{{ tip.title }}</h3>
          </div>
          
          <div class="tip-content">
            <p class="tip-excerpt">{{ tip.excerpt }}</p>
            <div class="tip-tags">
              <span v-for="tag in tip.tags" :key="tag" class="tip-tag">{{ tag }}</span>
            </div>
          </div>
          
          <div class="tip-footer">
            <div class="tip-author">
              <img :src="tip.authorAvatar" :alt="tip.authorName" class="author-avatar" />
              <span class="author-name">{{ tip.authorName }}</span>
            </div>
            
            <div class="tip-stats">
              <span class="stat-item">
                <i class="view-icon">👁️</i>
                {{ tip.views }}
              </span>
              <span class="stat-item">
                <i class="like-icon">♥</i>
                {{ tip.likes }}
              </span>
              <span class="stat-item">
                <i class="comment-icon">💬</i>
                {{ tip.comments }}
              </span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 器材标签页
const currentTab = ref('database');
const equipmentTabs = [
  { label: '器材数据库', value: 'database' },
  { label: '二手交易', value: 'used' },
  { label: '器材租赁', value: 'rental' },
  { label: '器材对比', value: 'compare' },
  { label: '器材技巧', value: 'tips' },
];

// 器材数据库筛选
const equipmentType = ref('all');
const equipmentBrand = ref('all');
const equipmentSort = ref('latest');
const equipmentSearch = ref('');

// 二手交易筛选
const usedType = ref('all');
const usedBrand = ref('all');
const usedStatus = ref('all');
const usedPriceRange = ref('all');
const usedSearch = ref('');

// 器材租赁筛选
const rentalType = ref('all');
const rentalBrand = ref('all');
const rentalPriceRange = ref('all');
const rentalSearch = ref('');

// 器材技巧筛选
const tipsBrand = ref('all');
const tipsType = ref('all');
const tipsSearch = ref('');

// 分页
const currentPage = ref(1);
const totalPages = ref(10);

// 统一交互：点赞/收藏/评论/分享（本地模拟）
const equipCollectMenuFor = ref(null);
const equipCommentFor = ref(null);
const equipCommentText = ref('');

// 初始化互动字段
equipmentData.value = equipmentData.value.map(e => ({
  ...e,
  likes: e.likes || Math.floor(Math.random() * 1000),
  comments: e.comments || Math.floor(Math.random() * 200),
  collections: e.collections || Math.floor(Math.random() * 300),
  liked: false,
  collected: false,
}));

const likeEquip = (id) => {
  const e = equipmentData.value.find(x => x.id === id);
  if (!e) return;
  e.liked = !e.liked;
  e.likes += e.liked ? 1 : -1;
};

const toggleEquipCollectMenu = (id) => {
  equipCollectMenuFor.value = equipCollectMenuFor.value === id ? null : id;
};

const confirmEquipCollect = (id, folder) => {
  const e = equipmentData.value.find(x => x.id === id);
  if (!e) return;
  if (!e.collected) e.collections += 1;
  e.collected = true;
  equipCollectMenuFor.value = null;
};

const focusEquipComment = (id) => { equipCommentFor.value = id; };
const insertEquipEmoji = (emoji) => { equipCommentText.value += ` ${emoji} `; };
const attachEquipImage = (evt) => {
  const file = evt.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  equipCommentText.value += ` [图片](${url}) `;
};
const submitEquipComment = (id) => {
  const e = equipmentData.value.find(x => x.id === id);
  if (!e) return;
  if (equipCommentText.value.trim()) {
    e.comments += 1;
    equipCommentText.value = '';
    equipCommentFor.value = null;
  }
};

const shareEquip = (id) => {
  const e = equipmentData.value.find(x => x.id === id);
  if (!e) return;
  const url = encodeURIComponent(window.location.origin + '/equipment/' + id);
  const title = encodeURIComponent(e.name);
  const pic = encodeURIComponent(e.imageUrl);
  window.open(`https://service.weibo.com/share/share.php?title=${title}&url=${url}&pic=${pic}`, '_blank');
};

// 器材对比
const compareItem1 = ref('');
const compareItem2 = ref('');
const compareSuggestions1 = ref([]);
const compareSuggestions2 = ref([]);
const selectedItem1 = ref(null);
const selectedItem2 = ref(null);

// 品牌标签映射
const getBrandLabel = (brand) => {
  const labels = {
    canon: '佳能',
    nikon: '尼康',
    sony: '索尼',
    fujifilm: '富士',
    panasonic: '松下',
    leica: '徕卡',
    sigma: '适马',
    tamron: '腾龙',
  };
  return labels[brand] || brand;
};

// 类型标签映射
const getTypeLabel = (type) => {
  const labels = {
    camera: '相机',
    lens: '镜头',
    accessory: '配件',
  };
  return labels[type] || type;
};

// 成色标签映射
const getConditionLabel = (condition) => {
  const labels = {
    new: '全新',
    like_new: '99新',
    excellent: '95新',
    good: '9成新',
    fair: '8成新',
  };
  return labels[condition] || condition;
};

// 模拟器材数据
const equipmentData = ref([
  {
    id: 1,
    name: 'EOS R5',
    brand: 'canon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=401',
    rating: 4.8,
    ratingCount: 356,
    price: 25999,
    releaseDate: '2020-07',
    sensorSize: '全画幅',
    megapixels: 45,
    isoRange: '100-51200',
    maxShutter: '1/8000s',
    videoResolution: '8K 30p / 4K 120p',
    afPoints: 5940,
    weight: 738,
    batteryLife: 320,
  },
  {
    id: 2,
    name: 'A7R IV',
    brand: 'sony',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=402',
    rating: 4.7,
    ratingCount: 423,
    price: 22999,
    releaseDate: '2019-08',
    sensorSize: '全画幅',
    megapixels: 61,
    isoRange: '100-32000',
    maxShutter: '1/8000s',
    videoResolution: '4K 30p',
    afPoints: 567,
    weight: 665,
    batteryLife: 530,
  },
  {
    id: 3,
    name: 'Z7 II',
    brand: 'nikon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=403',
    rating: 4.6,
    ratingCount: 289,
    price: 19999,
    releaseDate: '2020-10',
    sensorSize: '全画幅',
    megapixels: 45,
    isoRange: '64-25600',
    maxShutter: '1/8000s',
    videoResolution: '4K 60p',
    afPoints: 493,
    weight: 705,
    batteryLife: 420,
  },
  {
    id: 4,
    name: 'X-T4',
    brand: 'fujifilm',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=404',
    rating: 4.5,
    ratingCount: 312,
    price: 12499,
    releaseDate: '2020-02',
    sensorSize: 'APS-C',
    megapixels: 26,
    isoRange: '160-12800',
    maxShutter: '1/8000s',
    videoResolution: '4K 60p',
    afPoints: 425,
    weight: 607,
    batteryLife: 500,
  },
  {
    id: 5,
    name: 'RF 24-70mm f/2.8L IS USM',
    brand: 'canon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=405',
    rating: 4.9,
    ratingCount: 189,
    price: 18999,
  },
  {
    id: 6,
    name: 'FE 24-70mm f/2.8 GM',
    brand: 'sony',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=406',
    rating: 4.8,
    ratingCount: 215,
    price: 16999,
  },
  {
    id: 7,
    name: '24-70mm f/2.8S',
    brand: 'nikon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=407',
    rating: 4.7,
    ratingCount: 167,
    price: 14999,
  },
  {
    id: 8,
    name: 'Gitzo GT1545T 碳纤维三脚架',
    brand: 'gitzo',
    type: 'accessory',
    imageUrl: 'https://picsum.photos/600/400?random=408',
    rating: 4.7,
    ratingCount: 98,
    price: 4299,
  },
]);

// 模拟二手交易数据
const usedItemsData = ref([
  {
    id: 101,
    name: '佳能 EOS R 全画幅相机',
    brand: 'canon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=501',
    condition: 'excellent',
    year: 2019,
    description: '95新，无磕碰划痕，快门次数约5000次，配件齐全，包装盒子都在。',
    price: 9500,
    originalPrice: 15999,
    location: '北京',
    isSold: false,
    isFavorite: false,
  },
  {
    id: 102,
    name: '索尼 A7III 全画幅相机',
    brand: 'sony',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=502',
    condition: 'good',
    year: 2018,
    description: '9成新，轻微使用痕迹，快门次数约12000次，功能一切正常。',
    price: 8200,
    originalPrice: 12999,
    location: '上海',
    isSold: false,
    isFavorite: true,
  },
  {
    id: 103,
    name: '尼康 AF-S 70-200mm f/2.8E FL ED VR',
    brand: 'nikon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=503',
    condition: 'like_new',
    year: 2020,
    description: '99新，几乎全新，使用次数不超过5次，镜片完美，无霉无雾。',
    price: 10800,
    originalPrice: 14999,
    location: '广州',
    isSold: false,
    isFavorite: false,
  },
  {
    id: 104,
    name: '佳能 EF 24-70mm f/2.8L II USM',
    brand: 'canon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=504',
    condition: 'good',
    year: 2017,
    description: '9成新，使用正常，镜片无划痕，对焦迅速。',
    price: 7500,
    originalPrice: 13299,
    location: '深圳',
    isSold: true,
    isFavorite: false,
  },
  {
    id: 105,
    name: '大疆 Ronin-S 手持云台',
    brand: 'dji',
    type: 'accessory',
    imageUrl: 'https://picsum.photos/600/400?random=505',
    condition: 'excellent',
    year: 2019,
    description: '95新，配件齐全，功能正常，无明显磨损。',
    price: 1800,
    originalPrice: 3299,
    location: '成都',
    isSold: false,
    isFavorite: false,
  },
  {
    id: 106,
    name: '富士 X-T3 微单相机',
    brand: 'fujifilm',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=506',
    condition: 'excellent',
    year: 2019,
    description: '95新，快门次数约8000次，外观无明显磨损，送两张SD卡。',
    price: 6800,
    originalPrice: 8999,
    location: '杭州',
    isSold: false,
    isFavorite: false,
  },
]);

// 模拟器材租赁数据
const rentalItemsData = ref([
  {
    id: 201,
    name: '索尼 A7R IV 全画幅相机',
    brand: 'sony',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=601',
    condition: 'excellent',
    pricePerDay: 280,
    minRentalDays: 2,
    location: '北京朝阳区',
    rating: 4.9,
    ratingCount: 89,
    rentalCount: 156,
    isFavorite: false,
  },
  {
    id: 202,
    name: '佳能 EOS R5 全画幅相机',
    brand: 'canon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=602',
    condition: 'excellent',
    pricePerDay: 320,
    minRentalDays: 2,
    location: '上海静安区',
    rating: 4.8,
    ratingCount: 67,
    rentalCount: 98,
    isFavorite: true,
  },
  {
    id: 203,
    name: '索尼 FE 16-35mm f/2.8 GM 镜头',
    brand: 'sony',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=603',
    condition: 'excellent',
    pricePerDay: 120,
    minRentalDays: 1,
    location: '广州天河区',
    rating: 4.7,
    ratingCount: 124,
    rentalCount: 231,
    isFavorite: false,
  },
  {
    id: 204,
    name: '尼康 Z 70-200mm f/2.8 VR S 镜头',
    brand: 'nikon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=604',
    condition: 'excellent',
    pricePerDay: 150,
    minRentalDays: 1,
    location: '深圳南山区',
    rating: 4.8,
    ratingCount: 78,
    rentalCount: 145,
    isFavorite: false,
  },
  {
    id: 205,
    name: '大疆如影 SC 手持云台',
    brand: 'dji',
    type: 'accessory',
    imageUrl: 'https://picsum.photos/600/400?random=605',
    condition: 'good',
    pricePerDay: 50,
    minRentalDays: 1,
    location: '成都锦江区',
    rating: 4.5,
    ratingCount: 201,
    rentalCount: 312,
    isFavorite: false,
  },
]);

// 模拟器材技巧数据
const tipsData = ref([
  {
    id: 301,
    title: '索尼 A7S3 夜景拍摄最佳设置',
    brand: 'sony',
    type: 'camera',
    excerpt: '学习如何充分利用索尼A7S3的高感性能，拍摄出纯净的夜景照片...',
    authorName: '张老师',
    authorAvatar: 'https://picsum.photos/100/100?random=30',
    views: 8900,
    likes: 760,
    comments: 95,
    tags: ['索尼', '夜景', 'A7S3', '设置'],
  },
  {
    id: 302,
    title: '佳能 EOS R5 视频拍摄专业技巧',
    brand: 'canon',
    type: 'camera',
    excerpt: '掌握佳能R5的视频拍摄功能，包括8K录制、对焦设置和防抖模式的选择...',
    authorName: '李摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=31',
    views: 12500,
    likes: 980,
    comments: 156,
    tags: ['佳能', '视频', 'R5', '专业'],
  },
  {
    id: 303,
    title: '尼康 Z7 II 风景摄影设置指南',
    brand: 'nikon',
    type: 'camera',
    excerpt: '探索尼康Z7 II在风景摄影中的最佳设置，包括对焦模式、曝光策略和储存格式...',
    authorName: '王风景',
    authorAvatar: 'https://picsum.photos/100/100?random=32',
    views: 7600,
    likes: 650,
    comments: 89,
    tags: ['尼康', '风景', 'Z7 II', '设置'],
  },
  {
    id: 304,
    title: '如何正确清洁相机传感器',
    brand: 'all',
    type: 'accessory',
    excerpt: '学习专业的相机传感器清洁方法，避免灰尘和污渍影响你的照片质量...',
    authorName: '赵器材',
    authorAvatar: 'https://picsum.photos/100/100?random=33',
    views: 15600,
    likes: 1200,
    comments: 189,
    tags: ['清洁', '维护', '传感器', '技巧'],
  },
  {
    id: 305,
    title: '人像摄影中如何使用大光圈镜头',
    brand: 'all',
    type: 'lens',
    excerpt: '掌握大光圈镜头在人像摄影中的运用技巧，包括对焦策略、构图方法和光线控制...',
    authorName: '陈人像',
    authorAvatar: 'https://picsum.photos/100/100?random=34',
    views: 11200,
    likes: 890,
    comments: 143,
    tags: ['人像', '大光圈', '镜头', '技巧'],
  },
]);

// 设置当前标签页
const setTab = (tab) => {
  currentTab.value = tab;
  currentPage.value = 1; // 切换标签页时重置页码
};

// 查看器材详情
const viewDetails = (id) => {
  router.push(`/equipment/${id}`);
};

// 查看器材评测
const viewReviews = (id) => {
  router.push(`/equipment/${id}/reviews`);
};

// 发布闲置
const publishItem = () => {
  // 实际项目中应跳转到发布页面或打开发布模态框
  alert('发布闲置功能正在开发中...');
};

// 联系卖家
const contactSeller = (id) => {
  // 实际项目中应打开聊天窗口
  alert(`正在联系卖家，商品ID: ${id}`);
};

// 切换收藏状态
const toggleFavorite = (id) => {
  const item = usedItemsData.value.find(item => item.id === id);
  if (item) {
    item.isFavorite = !item.isFavorite;
  }
};

// 发布租赁
const publishRental = () => {
  // 实际项目中应跳转到发布页面或打开发布模态框
  alert('发布租赁功能正在开发中...');
};

// 立即租赁
const rentItem = (id) => {
  // 实际项目中应跳转到租赁详情页面
  router.push(`/equipment/rental/${id}`);
};

// 切换租赁收藏状态
const toggleRentalFavorite = (id) => {
  const item = rentalItemsData.value.find(item => item.id === id);
  if (item) {
    item.isFavorite = !item.isFavorite;
  }
};

// 选择对比器材
const selectCompareItem = (index, item) => {
  if (index === 1) {
    compareItem1.value = item.name;
    selectedItem1.value = item;
    compareSuggestions1.value = [];
  } else {
    compareItem2.value = item.name;
    selectedItem2.value = item;
    compareSuggestions2.value = [];
  }
};

// 执行对比
const performCompare = () => {
  // 实际项目中应加载更多详细参数进行对比
  if (selectedItem1.value && selectedItem2.value) {
    // 这里可以添加更多对比逻辑
  }
};

// 获取更好的选择
const getBetterOption = (item1, item2) => {
  // 简单的评分比较，实际项目中可以根据更多参数进行综合判断
  if (item1.rating > item2.rating) {
    return item1.name;
  } else if (item2.rating > item1.rating) {
    return item2.name;
  } else {
    return '两款器材';
  }
};
</script>

<style>
</style>
/* 器材容器样式 */
.equipment-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 器材头部样式 */
.equipment-header {
  text-align: center;
  margin-bottom: 32px;
}

.equipment-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}

.equipment-header p {
  font-size: 16px;
  color: #6C757D;
}

/* 器材导航样式 */
.equipment-nav {
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
.database-header,
.used-header,
.rental-header,
.compare-header,
.tips-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.database-header h2,
.used-header h2,
.rental-header h2,
.compare-header h2,
.tips-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
}

.compare-header p,
.tips-header p {
  font-size: 16px;
  color: #6C757D;
  margin-left: 16px;
}

/* 通用筛选样式 */
.database-filters,
.used-filters,
.rental-filters,
.tips-filters {
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

/* 器材网格样式 */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 器材卡片样式 */
.equipment-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.equipment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.equipment-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.equipment-card:hover .equipment-image img {
  transform: scale(1.05);
}

/* Hover 白底详情层（与首页统一） */
.equip-hover-detail { position: absolute; inset: 0; background: #fff; color: #2D3A4B; display: none; grid-template-columns: 1.2fr 1fr; gap: 16px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.equipment-card:hover .equip-hover-detail { display: grid; }
.equip-hover-left { display: flex; align-items: center; justify-content: center; overflow: hidden; }
.equip-hover-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.equip-hover-right { display: flex; flex-direction: column; gap: 12px; }
.equip-hover-title { font-size: 18px; font-weight: 700; }
.equip-hover-sub { font-size: 12px; color: #98a2b3; }
.equip-hover-exif { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.equip-hover-exif .exif-item { display: flex; gap: 8px; font-size: 13px; }
.equip-hover-exif .label { color: #7a869a; min-width: 68px; }
.equip-hover-exif .value { color: #2D3A4B; font-weight: 500; }
.equip-hover-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.hover-btn { background: #F5F8FF; border: 1px solid #e9edf3; color: #2D3A4B; border-radius: 18px; padding: 6px 12px; font-size: 13px; }
.hover-btn.like.active, .hover-btn.like:hover { background: rgba(13,110,253,0.08); border-color: #0D6EFD; color: #0D6EFD; }
.collect-wrap, .comment-wrap, .share-wrap { position: relative; }
.collect-menu { position: absolute; top: 36px; left: 0; background: #fff; border: 1px solid #e9edf3; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); min-width: 160px; z-index: 5; }
.collect-menu .menu-title { padding: 8px 12px; font-size: 12px; color: #7a869a; border-bottom: 1px solid #e9edf3; }
.collect-menu .menu-item { padding: 10px 12px; cursor: pointer; }
.collect-menu .menu-item:hover { background: #F5F8FF; }
.equip-hover-comment { display: flex; flex-direction: column; gap: 8px; }
.rich-tools { display: flex; gap: 6px; }
.tool { background: #fff; border: 1px solid #e9edf3; border-radius: 6px; padding: 4px 8px; }
.rich-input { width: 100%; min-height: 64px; padding: 8px; border: 1px solid #e9edf3; border-radius: 8px; resize: vertical; }
.comment-actions { display: flex; justify-content: flex-end; }
.comment-actions .submit { background: #4A90E2; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; }

.equipment-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0.7);
}

.equipment-type-badge.camera {
  background-color: #0D6EFD;
}

.equipment-type-badge.lens {
  background-color: #198754;
}

.equipment-type-badge.accessory {
  background-color: #FFC107;
}

.equipment-info {
  padding: 20px;
}

.equipment-brand-name {
  margin-bottom: 12px;
}

.brand {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.brand.canon {
  background-color: #EF4026;
  color: #FFFFFF;
}

.brand.nikon {
  background-color: #0064D3;
  color: #FFFFFF;
}

.brand.sony {
  background-color: #000000;
  color: #FFFFFF;
}

.brand.fujifilm {
  background-color: #E60012;
  color: #FFFFFF;
}

.brand.panasonic {
  background-color: #005BAC;
  color: #FFFFFF;
}

.brand.leica {
  background-color: #917665;
  color: #FFFFFF;
}

.brand.sigma {
  background-color: #000000;
  color: #FFFFFF;
}

.brand.tamron {
  background-color: #004A80;
  color: #FFFFFF;
}

.brand.all {
  background-color: #6C757D;
  color: #FFFFFF;
}

.equipment-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.equipment-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #DEE2E6;
  font-size: 14px;
}

.star.filled {
  color: #FFC107;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.rating-count {
  font-size: 12px;
  color: #6C757D;
}

.equipment-price {
  margin-bottom: 16px;
}

.price-text {
  font-size: 14px;
  color: #6C757D;
  margin-right: 8px;
}

.price-value {
  font-size: 18px;
  font-weight: 600;
  color: #DC3545;
}

.equipment-actions {
  display: flex;
  gap: 12px;
}

.detail-button,
.review-button {
  flex: 1;
  background-color: #FFFFFF;
  border: 1px solid #0D6EFD;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #0D6EFD;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-button:hover,
.review-button:hover {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

/* 二手交易网格样式 */
.used-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 二手交易卡片样式 */
.used-item-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.used-item-card:hover:not(.sold) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.used-item-card.sold {
  opacity: 0.7;
}

.used-item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.used-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.used-item-card:hover:not(.sold) .used-item-image img {
  transform: scale(1.05);
}

.sold-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #DC3545;
  color: #FFFFFF;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;
}

.for-sale-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #198754;
  color: #FFFFFF;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;
}

.used-item-info {
  padding: 20px;
}

.used-item-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 12px 0;
}

.used-item-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.used-item-brand {
  font-size: 12px;
  font-weight: 500;
  color: #495057;
}

.used-item-condition {
  font-size: 12px;
  font-weight: 500;
  color: #198754;
}

.used-item-year {
  font-size: 12px;
  color: #6C757D;
}

.used-item-description {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.original-price {
  font-size: 12px;
  color: #6C757D;
  text-decoration: line-through;
  margin-left: 8px;
}

.used-item-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6C757D;
  margin-bottom: 16px;
}

.used-item-actions {
  display: flex;
  gap: 12px;
}

.contact-button,
.favorite-button {
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.contact-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

.contact-button:hover {
  background-color: #0B5ED7;
}

.contact-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-button {
  background-color: #F8F9FA;
  border: 1px solid #E9ECEF;
  color: #495057;
}

.favorite-button:hover {
  background-color: #E9ECEF;
}

.favorite-button.favorited {
  background-color: #FFF3CD;
  border-color: #FFC107;
  color: #856404;
}

/* 租赁网格样式 */
.rental-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 租赁卡片样式 */
.rental-item-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.rental-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.rental-item-image {
  height: 200px;
  overflow: hidden;
}

.rental-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rental-item-card:hover .rental-item-image img {
  transform: scale(1.05);
}

.rental-item-info {
  padding: 20px;
}

.rental-item-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 12px 0;
}

.rental-item-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.rental-item-brand {
  font-size: 12px;
  font-weight: 500;
  color: #495057;
}

.rental-item-condition {
  font-size: 12px;
  font-weight: 500;
  color: #198754;
}

.rental-item-price {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.min-rental {
  font-size: 14px;
  color: #6C757D;
}

.rental-item-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6C757D;
}

.rental-item-actions {
  display: flex;
  gap: 12px;
}

.rent-button {
  flex: 1;
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.rent-button:hover {
  background-color: #0B5ED7;
}

/* 器材对比样式 */
.compare-selection {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.compare-inputs {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.compare-input-group {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.compare-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: border-color 0.2s ease;
}

.compare-input:focus {
  border-color: #0D6EFD;
}

.compare-vs {
  font-size: 18px;
  font-weight: 600;
  color: #6C757D;
  padding-bottom: 12px;
}

.compare-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.compare-button:hover:not(:disabled) {
  background-color: #0B5ED7;
}

.compare-button:disabled {
  background-color: #6C757D;
  cursor: not-allowed;
}

.compare-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #F8F9FA;
}

/* 对比结果样式 */
.compare-result {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.compare-table-container {
  overflow-x: auto;
  margin-bottom: 24px;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
}

.compare-table thead {
  background-color: #E9ECEF;
}

.compare-table th,
.compare-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #DEE2E6;
}

.compare-table th {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.param-name {
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
}

.comparison-item {
  width: 45%;
}

.compare-table tbody tr:hover {
  background-color: #F8F9FA;
}

.rating-stars.small .star {
  font-size: 12px;
}

/* 对比总结样式 */
.compare-summary h3 {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 12px;
}

.compare-summary p {
  font-size: 16px;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 20px;
}

.compare-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* 器材技巧列表样式 */
.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 器材技巧卡片样式 */
.tip-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tip-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.tip-header {
  margin-bottom: 16px;
}

.tip-brand {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.tip-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.tip-content {
  margin-bottom: 20px;
}

.tip-excerpt {
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 12px;
}

.tip-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tip-tag {
  background-color: #F8F9FA;
  border: 1px solid #E9ECEF;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: #6C757D;
}

.tip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tip-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
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
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6C757D;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .equipment-container {
    padding: 0 16px;
  }
  
  .equipment-grid,
  .used-items-grid,
  .rental-items-grid,
  .tips-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .database-header,
  .used-header,
  .rental-header,
  .compare-header,
  .tips-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .database-filters,
  .used-filters,
  .rental-filters,
  .tips-filters {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .equipment-nav {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-tab {
    width: 100%;
    max-width: 300px;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-button {
    width: 100%;
  }
  
  .compare-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .compare-input-group {
    width: 100%;
  }
  
  .compare-vs {
    text-align: center;
    padding-bottom: 0;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .equipment-header h1 {
    font-size: 28px;
  }
  
  .database-header h2,
  .used-header h2,
  .rental-header h2,
  .compare-header h2,
  .tips-header h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .equipment-container {
    padding: 0 12px;
  }
  
  .equipment-grid,
  .used-items-grid,
  .rental-items-grid,
  .tips-list {
    grid-template-columns: 1fr;
  }
  
  .equipment-header h1 {
    font-size: 24px;
  }
  
  .equipment-actions,
  .used-item-actions,
  .rental-item-actions,
  .compare-actions {
    flex-direction: column;
  }
  
  .detail-button,
  .review-button,
  .contact-button,
  .favorite-button,
  .rent-button {
    width: 100%;
  }
}