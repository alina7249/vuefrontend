<template>
  <div class="growth-benefits">
    <h1 class="page-title">成长福利</h1>
    <p class="page-subtitle">每日签到，积累经验，解锁更多福利</p>
    
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
import { ref } from 'vue';

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
.growth-benefits {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
}

.page-subtitle {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* 签到日历部分 */
.check-in-section {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.calendar-month {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.consecutive-days {
  display: flex;
  align-items: center;
  gap: 10px;
}

.days-number {
  font-size: 36px;
  font-weight: 700;
  color: #3498db;
}

.days-text {
  font-size: 14px;
  color: #666;
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.calendar-day .checked-in {
  background-color: #3498db;
  color: white;
  position: relative;
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
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.check-in-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 成长等级部分 */
.level-section {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.current-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.level-text {
  font-size: 14px;
  color: #666;
}

.level-badge {
  background-color: #f1c40f;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: white;
}

.level-progress {
  flex: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #f1c40f;
  transition: width 0.3s ease;
}
</style>