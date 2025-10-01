<template>
  <div class="user-center">
    <div class="user-header">
      <div class="user-info">
        <div class="avatar">
          <img src="/favicon.ico" alt="用户头像">
        </div>
        <div class="level-info">
          <h2 class="username">admin</h2>
          <div class="level-badge">掘友等级 IV.1</div>
          <div class="level-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '50%' }"></div>
            </div>
            <span class="progress-text">75/150</span>
          </div>
        </div>
      </div>
      <div class="upgrade-section">
        <h3 class="upgrade-title">升级会员功能</h3>
        <button class="upgrade-button">升级会员</button>
      </div>
    </div>

    <div class="member-benefits">
      <h2 class="section-title">会员权益</h2>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="benefit-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3498db"/>
              <path d="M20 8L25 16H15L20 8Z" fill="white"/>
              <path d="M15 16V28H25V16H15Z" fill="white"/>
            </svg>
          </div>
          <div class="benefit-title">专属标识</div>
          <div class="benefit-desc">会员专属身份标识</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#e74c3c"/>
              <path d="M16 20L19 24H17L17 30H23V24H21L24 20L21 16H23L23 10H17V16H19L16 20Z" fill="white"/>
            </svg>
          </div>
          <div class="benefit-title">优先体验</div>
          <div class="benefit-desc">新功能优先体验权</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#9b59b6"/>
              <path d="M14 16H26V28H14V16Z" fill="white"/>
              <path d="M17 16V10H23V16H17Z" fill="white"/>
            </svg>
          </div>
          <div class="benefit-title">专属内容</div>
          <div class="benefit-desc">会员专享优质内容</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#f39c12"/>
              <path d="M20 12L25 17H15L20 12Z" fill="white"/>
              <path d="M14 17V28H26V17H14Z" fill="white"/>
              <circle cx="20" cy="22" r="2" fill="white"/>
            </svg>
          </div>
          <div class="benefit-title">专属福利</div>
          <div class="benefit-desc">定期专属福利活动</div>
        </div>
      </div>
    </div>

    <div class="subscription-management">
      <h2 class="section-title">订阅管理</h2>
      <div class="subscription-card">
        <div class="current-subscription">
          <h3>当前订阅</h3>
          <div class="subscription-type">免费版</div>
          <div class="subscription-period">无到期时间</div>
        </div>
        <button class="subscribe-button">立即订阅</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加逻辑，如获取用户信息、会员状态等
</script>

<style scoped>
:root {
  --primary-color: #165DFF;
  --primary-hover: #0E42D2;
  --secondary-color: #36CFFB;
  --accent-color: #FFB627;
  --dark-bg: #0A0A0A;
  --card-bg: #1A1A1A;
  --border-color: #2D2D2D;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --success-color: #00B42A;
  --warning-color: #FF7D00;
  --error-color: #F53F3F;
  --shadow: 0 4px 15px rgba(22, 93, 255, 0.1);
}

.user-center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--dark-bg);
  min-height: calc(100vh - 120px);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--card-bg) 0%, #252525 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.user-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(22, 93, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--card-bg);
  border: 3px solid var(--primary-color);
  box-shadow: 0 0 20px rgba(22, 93, 255, 0.3);
  position: relative;
}

.avatar::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 93, 255, 0.2) 0%, transparent 70%);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 0 10px rgba(22, 93, 255, 0.2);
}

.level-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(22, 93, 255, 0.3);
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background-color: var(--dark-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.upgrade-section {
  text-align: right;
}

.upgrade-title {
  color: var(--accent-color);
  font-size: 18px;
  margin-bottom: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.upgrade-button {
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upgrade-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.upgrade-button:hover {
  background-color: #e64a19;
  box-shadow: 0 0 20px rgba(255, 87, 34, 0.4);
}

.upgrade-button:hover::before {
  left: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  border-radius: 2px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.benefit-item {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.benefit-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(22, 93, 255, 0.15);
  border-color: var(--primary-color);
}

.benefit-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.benefit-item:hover::after {
  transform: scaleX(1);
}

.benefit-icon {
  margin-bottom: 15px;
}

.benefit-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.benefit-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.subscription-management {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.subscription-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--dark-bg) 0%, #252525 100%);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.current-subscription h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.subscription-type {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 5px;
  text-shadow: 0 0 8px rgba(0, 188, 212, 0.3);
}

.subscription-period {
  color: var(--text-secondary);
  font-size: 14px;
}

.subscribe-button {
  background-color: var(--success-color);
  color: var(--text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subscribe-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.subscribe-button:hover {
  background-color: #45a049;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
}

.subscribe-button:hover::before {
  left: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-center {
    padding: 15px;
  }
  
  .user-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
  }
  
  .upgrade-section {
    text-align: center;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .subscription-card {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>