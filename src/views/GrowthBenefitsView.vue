<template>
  <div class="growth-benefits">
    <h1 class="page-title">摄影成长之旅</h1>
    <p class="page-subtitle">每日签到，积累摄影经验，解锁专业工具与社区特权</p>
    
    <!-- 每日签到部分 -->
    <div class="check-in-section">
      <h2 class="section-title">每日签到</h2>
      <div class="check-in-calendar">
        <div class="calendar-header">
          <h3 class="calendar-month">2025年9月</h3>
          <div class="consecutive-days">
            <span class="days-number">7</span>
            <span class="days-text">连续签到天数</span>
          </div>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-week">
            <div v-for="day in firstWeek" :key="day" class="calendar-day">
              <span v-if="day > 0" :class="{ 'checked-in': isCheckedIn(day) }">
                {{ day }}
                <span v-if="isCheckedIn(day)" class="check-mark">✓</span>
              </span>
            </div>
          </div>
          
          <div class="calendar-week">
            <div v-for="day in secondWeek" :key="day" class="calendar-day">
              <span v-if="day > 0" :class="{ 'checked-in': isCheckedIn(day) }">
                {{ day }}
                <span v-if="isCheckedIn(day)" class="check-mark">✓</span>
              </span>
            </div>
          </div>
        </div>
        
        <div class="check-in-button-container">
          <button class="check-in-button">立即签到</button>
        </div>
      </div>
    </div>
    
    <!-- 成长等级部分 -->
    <div class="level-section">
      <h2 class="section-title">成长等级</h2>
      <div class="level-info">
        <div class="current-level">
          <span class="level-text">当前等级</span>
          <div class="level-badge">
            <span class="level-icon">IV.1</span>
          </div>
        </div>
        
        <div class="level-progress">
          <div class="progress-info">
            <span class="current-exp">当前经验: 75/150</span>
            <span class="next-level">距离下一等级还需: 75经验</span>
          </div>
          
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: '50%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 模拟已签到的日期
const checkedInDays = [1, 2, 3, 4, 5, 6, 7];

// 第一周的日期 (1-7)
const firstWeek = [1, 2, 3, 4, 5, 6, 7];
// 第二周的日期 (8-14)
const secondWeek = [8, 9, 10, 11, 12, 13, 14];

// 检查某天是否已签到
const isCheckedIn = (day) => {
  return checkedInDays.includes(day);
};
</script>

<style scoped>
:root {
  --primary-color: #4CAF50;
  --primary-hover: #45a049;
  --secondary-color: #2196F3;
  --accent-color: #FF9800;
  --dark-bg: #121212;
  --card-bg: #1e1e1e;
  --border-color: #333;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
  --glow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.growth-benefits {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--dark-bg);
  min-height: calc(100vh - 120px);
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.growth-benefits::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(76, 175, 80, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(33, 150, 243, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 40% 70%, rgba(255, 152, 0, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  color: var(--text-color);
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--primary-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80%;
  height: 2px;
  background-color: var(--primary-color);
  opacity: 0.5;
}

/* 签到日历部分 */
.check-in-section {
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 40px;
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.calendar-month {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
}

.consecutive-days {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 8px 16px;
  border-radius: 25px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.days-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.days-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.calendar-grid {
  margin-bottom: 30px;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-day span {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  background-color: var(--dark-bg);
  border: 1px solid var(--border-color);
}

.calendar-day .checked-in {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  position: relative;
  border: none;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.check-mark {
  position: absolute;
  font-size: 12px;
  top: 2px;
  right: 2px;
}

.check-in-button-container {
  display: flex;
  justify-content: center;
}

.check-in-button {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.check-in-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow);
}

.check-in-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.check-in-button:hover::before {
  left: 100%;
}

/* 成长等级部分 */
.level-section {
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.level-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.current-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 120px;
}

.level-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.level-badge {
  background: linear-gradient(135deg, var(--accent-color), #ff9800);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  color: white;
  position: relative;
  box-shadow: 0 0 20px rgba(255, 152, 0, 0.5);
}

.level-badge::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--accent-color), #ff9800, var(--accent-color));
  animation: rotate 3s linear infinite;
  z-index: -1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.level-progress {
  flex: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: var(--text-secondary);
  flex-wrap: wrap;
  gap: 10px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: var(--dark-bg);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), #ff9800);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .growth-benefits {
    padding: 15px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .check-in-section,
  .level-section {
    padding: 20px;
  }
  
  .calendar-day span {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  .days-number {
    font-size: 30px;
  }
  
  .level-badge {
    width: 70px;
    height: 70px;
    font-size: 20px;
  }
  
  .check-in-button {
    padding: 12px 30px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .calendar-week {
    gap: 5px;
  }
  
  .calendar-day span {
    width: 35px;
    height: 35px;
    font-size: 13px;
  }
  
  .level-info {
    flex-direction: column;
  }
  
  .progress-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .check-in-button {
    padding: 10px 25px;
    font-size: 15px;
  }
}
</style>