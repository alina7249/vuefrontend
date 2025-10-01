<template>
  <div class="about">
    <!-- 摄影风格背景装饰 -->
    <div class="photo-bg"></div>
    <div class="camera-pattern"></div>
    
    <div class="container">
      <div class="about-header">
        <h1 class="photo-title">关于 VisionShield 摄影平台</h1>
        <div class="title-decoration"></div>
      </div>
      
      <div class="about-content">
        <div class="about-section">
          <h2 class="section-title">我们的使命</h2>
          <p class="section-text">
            VisionShield 致力于为全球摄影爱好者提供高质量的分享平台和学习资源，
            帮助每个人捕捉生活中的美好瞬间，探索摄影艺术的无限可能。我们相信，
            每一张照片背后都有一个独特的故事，值得被发现和分享。
          </p>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">我们的特色</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3m0-5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-2C6.48 6 2 10.48 2 16s4.48 10 10 10 10-4.48 10-10S17.52 6 12 6zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg></div>
              <h3 class="feature-title">高质量作品分享</h3>
              <p class="feature-description">专业的摄影作品展示平台，支持高清图片上传和无压缩分享</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43zM15 9H5v6h10z"></path></svg></div>
              <h3 class="feature-title">摄影技巧交流</h3>
              <p class="feature-description">与全球摄影师交流心得，分享构图、用光、后期处理等专业技巧</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-3-6l5.15 3.09-1.42 1.42L12 13.41l-2.73 2.73-1.42-1.42L9 12z"></path></svg></div>
              <h3 class="feature-title">社区互动分享</h3>
              <p class="feature-description">活跃的摄影社区，支持作品点赞、评论、收藏，发现志同道合的伙伴</p>
            </div>
          </div>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">核心团队</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/338/100/100" alt="摄影总监">
              </div>
              <h3 class="member-name">刘艺</h3>
              <p class="member-role">创始人 & 摄影总监</p>
            </div>
            
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/342/100/100" alt="技术总监">
              </div>
              <h3 class="member-name">陈技术</h3>
              <p class="member-role">技术总监</p>
            </div>
            
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/349/100/100" alt="社区总监">
              </div>
              <h3 class="member-name">林夏</h3>
              <p class="member-role">社区总监</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --secondary-color: #e74c3c;
  --accent-color: #f39c12;
  --dark-bg: #121212;
  --card-bg: #1a1a1a;
  --border-color: #333;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --shadow: 0 4px 15px rgba(52, 152, 219, 0.1);
  --glow: 0 0 15px rgba(52, 152, 219, 0.4);
}

.about {
  min-height: 100vh;
  background-color: var(--dark-bg);
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  padding: 40px 0;
}

/* 摄影风格背景装饰 */
.photo-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 10% 20%, rgba(52, 152, 219, 0.05) 0%, transparent 20%),
                    radial-gradient(circle at 80% 30%, rgba(231, 76, 60, 0.05) 0%, transparent 25%),
                    radial-gradient(circle at 40% 70%, rgba(243, 156, 18, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

.camera-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  background-repeat: repeat;
  z-index: 0;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.photo-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title-decoration {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  margin: 0 auto;
  position: relative;
}

.title-decoration::before,
.title-decoration::after {
  content: '';
  position: absolute;
  top: -3px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.title-decoration::before {
  left: 0;
}

.title-decoration::after {
  right: 0;
}

.about-content {
  position: relative;
}

.about-section {
  margin-bottom: 60px;
  position: relative;
}

.section-title {
  font-size: 2rem;
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

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

/* 特色部分 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-item {
  background-color: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--glow);
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
}

.feature-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 团队部分 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.team-member {
  text-align: center;
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid var(--primary-color);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.member-role {
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .photo-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 30px 0;
  }
  
  .photo-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .section-text {
    font-size: 1rem;
  }
  
  .features-grid,
  .team-grid {
    gap: 20px;
  }
  
  .feature-item {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .photo-title {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .member-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>
