<template>
  <div class="about">
    <!-- 科技风格背景装饰 -->
    <div class="circuit-bg"></div>
    <div class="binary-code"></div>
    
    <div class="container">
      <div class="about-header">
        <h1 class="tech-title">关于 TechLearn Hub</h1>
        <div class="title-decoration"></div>
      </div>
      
      <div class="about-content">
        <div class="about-section">
          <h2 class="section-title">我们的使命</h2>
          <p class="section-text">
            TechLearn Hub 致力于为全球技术爱好者提供高质量的学习资源和互动平台，
            帮助每个人在技术领域取得突破和成长。我们相信，通过优质的教育和社区支持，
            每个人都能实现自己的技术梦想。
          </p>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">我们的特色</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"></path></svg></div>
              <h3 class="feature-title">高品质课程</h3>
              <p class="feature-description">由行业专家精心打造的实战课程，涵盖前沿技术与实用技能</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></div>
              <h3 class="feature-title">交互式学习</h3>
              <p class="feature-description">实时编码环境，让学习更具实践性，立即应用所学知识</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path></svg></div>
              <h3 class="feature-title">社区支持</h3>
              <p class="feature-description">与全球开发者交流，分享经验，共同成长的活跃社区</p>
            </div>
          </div>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">团队介绍</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/1/100/100" alt="团队成员">
              </div>
              <h3 class="member-name">张明</h3>
              <p class="member-role">创始人 & CEO</p>
            </div>
            
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/2/100/100" alt="团队成员">
              </div>
              <h3 class="member-name">李华</h3>
              <p class="member-role">技术总监</p>
            </div>
            
            <div class="team-member">
              <div class="member-avatar">
                <img src="https://picsum.photos/id/3/100/100" alt="团队成员">
              </div>
              <h3 class="member-name">王静</h3>
              <p class="member-role">课程总监</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #00bcd4;
  --primary-hover: #00acc1;
  --secondary-color: #673ab7;
  --accent-color: #ff5722;
  --dark-bg: #121212;
  --card-bg: #1e1e1e;
  --border-color: #333;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
  --glow: 0 0 10px rgba(0, 188, 212, 0.5);
}

.about {
  min-height: 100vh;
  background-color: var(--dark-bg);
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  padding: 40px 0;
}

/* 背景装饰 */
.circuit-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 10% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 20%),
                    radial-gradient(circle at 80% 30%, rgba(103, 58, 183, 0.05) 0%, transparent 25%),
                    radial-gradient(circle at 40% 70%, rgba(255, 87, 34, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

.binary-code {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  opacity: 0.1;
  background-image: repeating-linear-gradient(to bottom, var(--primary-color) 0px, var(--primary-color) 1px, transparent 1px, transparent 20px);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  line-height: 20px;
  content: "010010010100101101001100010001010100000101010010010011100100011101000101010010010100101101001100010001010100000101010010010011100100011101000101010010010100101101001100010001010100000101010010010011100100011101000101010010010100101101001100010001010100000101010010010011100100011101000101";
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

.tech-title {
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
  background-color: rgba(0, 188, 212, 0.1);
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
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
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
  .tech-title {
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
  
  .tech-title {
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
  
  .tech-title {
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
