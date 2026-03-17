<template>
  <div class="dashboard">

    <!-- ===== Header ===== -->
    <header class="header">
      <div class="hd-side">
        <span class="hd-date">{{ currentDate }}</span>
        <span class="hd-time">{{ currentTime }}</span>
      </div>
      <div class="hd-center">
        <div class="hd-title-wrap">
          <div class="hd-deco"></div>
          <h1 class="hd-title">华能清能院库布齐生态观测站数据平台</h1>
          <div class="hd-deco hd-deco-r"></div>
        </div>
      </div>
      <div class="hd-side hd-side-r">
        <span class="hd-welcome">欢迎您，<em>____</em></span>
        <span class="hd-user-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <span class="hd-gear">⚙</span>
      </div>
    </header>

    <!-- ===== Body ===== -->
    <main class="body">

      <!-- ===== 左列 ===== -->
      <div class="col-left" :class="{ tab2: activeTab===1 || activeTab===2, left3: activeTab===3 }">

        <div class="big-panel device-panel">
          <div class="sec-title"><span class="sec-bar"></span>设备概况</div>
          <div class="dv-grid">
            <div class="dv-card" v-for="d in curDeviceCards" :key="d.label" :class="{ 'dv-online': d.cls==='icon-green' }">
              <div class="dv-icon" :class="d.cls">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="d.icon"></svg>
              </div>
              <div class="dv-info">
                <div class="dv-label">{{ d.label }}</div>
                <div class="dv-val" :class="d.valCls">{{ d.value }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab1 -->
        <template v-if="activeTab===0">
          <div class="big-panel chart-panel">
            <div class="leg-row">
              <span class="ld"><span class="ld-dot" style="background:#00c8ff"></span>降雨</span>
              <span class="ld"><span class="ld-dot" style="background:#00aaff"></span>大气压</span>
            </div>
            <div ref="barChart" class="chart-box"></div>
          </div>
          <div class="big-panel chart-panel">
            <div class="leg-row"><span v-for="l in lwLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div ref="lwChart" class="chart-box"></div>
          </div>
          <div class="big-panel chart-panel">
            <div class="leg-row"><span v-for="l in nirLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div ref="nirChart" class="chart-box"></div>
          </div>
        </template>

        <!-- Tab2 -->
        <template v-if="activeTab===1">
          <div class="big-panel chart-panel">
            <div class="cell-title">FLUX_MIN</div>
            <div ref="t2l1" class="chart-box"></div>
          </div>
          <div class="big-panel chart-panel">
            <div class="cell-title">FLUX_AVG</div>
            <div ref="t2l2" class="chart-box"></div>
          </div>
        </template>

        <!-- Tab3 -->
        <template v-if="activeTab===2">
          <div class="big-panel chart-panel">
            <div class="cell-title">FC</div>
            <div ref="t3l1" class="chart-box"></div>
          </div>
          <div class="big-panel chart-panel">
            <div class="cell-title">LE</div>
            <div ref="t3l2" class="chart-box"></div>
          </div>
        </template>

        <!-- Tab4 -->
        <template v-if="activeTab===3">
          <div class="big-panel chart-panel">
            <div class="cell-title">NDVI</div>
            <div class="cell-leg"><span v-for="l in whLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div ref="t4l1" class="chart-box"></div>
          </div>
          <div class="big-panel chart-panel">
            <div class="cell-title">ROI_NDVI</div>
            <div class="cell-leg"><span v-for="l in whLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div ref="t4l2" class="chart-box"></div>
          </div>
        </template>

      </div>

      <!-- ===== 中列 ===== -->
      <div class="col-mid">

        <div class="mid-top">
        <div class="big-panel scene-panel">
          <div class="scene-inner">
            <svg class="scene-svg" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- 天空渐变（动态） -->
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   :stop-color="skyConfig.skyTop"/>
                  <stop offset="50%"  :stop-color="skyConfig.skyMid"/>
                  <stop offset="100%" :stop-color="skyConfig.skyBot"/>
                </linearGradient>
                <!-- 地面渐变 -->
                <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   :stop-color="skyConfig.groundTint" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#000508" stop-opacity="1"/>
                </linearGradient>
                <!-- 地平线光晕 -->
                <radialGradient id="horizGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" :stop-color="skyConfig.skyBot" stop-opacity="0.35"/>
                  <stop offset="100%" :stop-color="skyConfig.skyBot" stop-opacity="0"/>
                </radialGradient>
                <!-- 太阳/月亮光晕 -->
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   :stop-color="skyConfig.glowColor"/>
                  <stop offset="40%"  :stop-color="skyConfig.glowColor" stop-opacity="0.4"/>
                  <stop offset="100%" :stop-color="skyConfig.glowColor" stop-opacity="0"/>
                </radialGradient>
                <!-- 建筑立面渐变 -->
                <linearGradient id="facadeL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0a2868" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#040e2e" stop-opacity="0.95"/>
                </linearGradient>
                <linearGradient id="facadeR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#05183c" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#020a1e" stop-opacity="0.95"/>
                </linearGradient>
                <!-- 高亮光晕 -->
                <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.9"/>
                  <stop offset="60%" stop-color="#00a8ff" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#0066ff" stop-opacity="0"/>
                </radialGradient>
                <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="glow2" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="sunBlur" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <!-- ===== 天空背景（动态） ===== -->
              <rect width="800" height="200" fill="url(#skyGrad)"/>

              <!-- 星空粒子（夜晚/黎明显示） -->
              <g v-if="showStars" fill="white">
                <circle v-for="s in stars" :key="'s'+s.id" :cx="s.x" :cy="s.y" :r="s.r" :opacity="s.o">
                  <animate attributeName="opacity" :values="`${s.o};${s.o*0.2};${s.o}`" :dur="`${s.d}s`" repeatCount="indefinite"/>
                </circle>
              </g>

              <!-- ===== 太阳 / 月亮 ===== -->
              <g v-if="celestialPos.visible && celestialPos.y < 200">
                <!-- 光晕大圆 -->
                <circle :cx="celestialPos.x" :cy="celestialPos.y" r="28" fill="url(#sunGlow)" opacity="0.85"/>
                <!-- 主体 -->
                <circle v-if="skyConfig.sun" :cx="celestialPos.x" :cy="celestialPos.y" r="9"
                  :fill="skyConfig.sunColor" filter="url(#sunBlur)" opacity="0.95"/>
                <!-- 月亮 -->
                <g v-if="skyConfig.moon">
                  <circle :cx="celestialPos.x" :cy="celestialPos.y" r="8" fill="#e8e0c8" filter="url(#glow)" opacity="0.9"/>
                  <!-- 月牙遮罩效果 -->
                  <circle :cx="celestialPos.x+3" :cy="celestialPos.y-2" r="6" :fill="skyConfig.skyMid" opacity="0.85"/>
                  <!-- 月面纹理 -->
                  <circle :cx="celestialPos.x-2" :cy="celestialPos.y+1" r="1.2" fill="rgba(180,170,150,.3)"/>
                  <circle :cx="celestialPos.x+1" :cy="celestialPos.y-2" r="0.9" fill="rgba(180,170,150,.25)"/>
                </g>
              </g>

              <!-- 地平线光晕 -->
              <ellipse cx="400" cy="192" rx="380" ry="18" fill="rgba(0,80,180,.12)"/>
              <ellipse cx="400" cy="192" rx="220" ry="8" :fill="skyConfig.skyBot" opacity="0.12"/>

              <!-- 远山轮廓 -->
              <path d="M0,182 Q80,147 160,165 Q240,135 320,155 Q400,129 480,149 Q560,132 640,147 Q720,135 800,152 L800,192 L0,192Z" fill="rgba(4,14,38,.85)"/>
              <path d="M0,192 Q120,175 240,185 Q360,169 480,181 Q620,167 800,185 L800,202 L0,202Z" fill="rgba(3,10,28,.9)"/>

              <!-- 地面 -->
              <rect x="0" y="200" width="800" height="260" fill="url(#groundGrad)"/>

              <!-- 地面透视网格 -->
              <g stroke="rgba(0,120,220,.1)" stroke-width="0.5">
                <line v-for="i in 21" :key="'h'+i" :x1="0" :y1="202+i*13" :x2="800" :y2="202+i*13"/>
              </g>
              <g stroke="rgba(0,120,220,.08)" stroke-width="0.5">
                <line v-for="i in 24" :key="'v'+i"
                  :x1="400 + (i-12)*34" y1="200"
                  :x2="400 + (i-12)*80" y2="460"/>
              </g>

              <!-- 站点连接网络线 -->
              <g stroke="rgba(0,180,255,.15)" stroke-width="0.8" stroke-dasharray="4,3" fill="none">
                <line x1="180" y1="310" x2="340" y2="355"/>
                <line x1="340" y1="355" x2="390" y2="305"/>
                <line x1="390" y1="305" x2="490" y2="245"/>
                <line x1="490" y1="245" x2="560" y2="270"/>
                <line x1="240" y1="335" x2="390" y2="305"/>
                <line x1="420" y1="220" x2="490" y2="245"/>
                <line x1="420" y1="220" x2="560" y2="270"/>
              </g>
              <!-- 数据流动点 -->
              <circle r="2.5" fill="#00d4ff" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" path="M180,310 L340,355 L390,305 L490,245"/>
              </circle>
              <circle r="2" fill="#00ffaa" opacity="0.7">
                <animateMotion dur="4s" repeatCount="indefinite" begin="1s" path="M560,270 L490,245 L420,220 L240,335"/>
              </circle>


              <!-- ===== 科研基地（等轴测俯视） ===== -->
              <!-- 基地整体地基光晕 -->
              <ellipse cx="670" cy="385" rx="110" ry="18" fill="rgba(0,80,200,.07)"/>

              <!-- （已移除）围墙 -->

              <!-- ── 大门（南墙中央） ── -->
              <!-- 门柱左 -->
              <polygon points="655,400 655,385 659,382 659,397" fill="rgba(12,40,100,.95)" stroke="rgba(0,180,255,.6)" stroke-width="0.8"/>
              <polygon points="655,385 659,382 663,384 659,387" fill="rgba(15,50,120,.95)" stroke="rgba(0,200,255,.55)" stroke-width="0.7"/>
              <!-- 门柱右 -->
              <polygon points="685,400 685,385 689,382 689,397" fill="rgba(12,40,100,.95)" stroke="rgba(0,180,255,.6)" stroke-width="0.8"/>
              <polygon points="685,385 689,382 693,384 689,387" fill="rgba(15,50,120,.95)" stroke="rgba(0,200,255,.55)" stroke-width="0.7"/>
              <!-- 门横梁 -->
              <polygon points="655,385 689,385 689,382 655,382" fill="rgba(10,35,90,.9)" stroke="rgba(0,160,255,.5)" stroke-width="0.7"/>
              <!-- 门洞（开口） -->
              <rect x="659" y="388" width="26" height="12" fill="rgba(0,5,15,.8)" stroke="rgba(0,100,200,.2)" stroke-width="0.5"/>
              <!-- 门灯 -->
              <circle cx="659" cy="384" r="1.5" fill="rgba(0,220,255,.9)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="689" cy="384" r="1.5" fill="rgba(0,220,255,.9)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite"/>
              </circle>

              <!-- ── 院内道路 ── -->
              <polygon points="659,400 685,400 685,395 659,395" fill="rgba(5,15,40,.6)" stroke="rgba(0,80,160,.2)" stroke-width="0.4"/>
              <!-- 院内横路 -->
              <polygon points="582,368 762,368 762,364 582,364" fill="rgba(5,15,40,.5)" stroke="rgba(0,70,150,.2)" stroke-width="0.4"/>

              <!-- ── 主控楼（院内左侧，低矮平房） ── -->
              <!-- 前面 -->
              <polygon points="592,388 592,358 630,350 630,380" fill="url(#facadeL)" stroke="rgba(0,130,230,.5)" stroke-width="0.8"/>
              <!-- 右侧面 -->
              <polygon points="630,380 630,350 652,358 652,388" fill="url(#facadeR)" stroke="rgba(0,100,200,.4)" stroke-width="0.8"/>
              <!-- 屋顶 -->
              <polygon points="592,358 630,350 652,358 614,366" fill="rgba(10,35,90,.92)" stroke="rgba(0,170,255,.55)" stroke-width="0.8"/>
              <line x1="592" y1="358" x2="630" y2="350" stroke="rgba(0,200,255,.7)" stroke-width="1"/>
              <line x1="630" y1="350" x2="652" y2="358" stroke="rgba(0,180,255,.6)" stroke-width="1"/>
              <!-- 屋顶设备（空调/通风） -->
              <rect x="608" y="348" width="10" height="5" rx="1" fill="rgba(8,28,72,.9)" stroke="rgba(0,150,240,.45)" stroke-width="0.6"/>
              <rect x="622" y="347" width="6" height="4" rx="1" fill="rgba(8,28,72,.9)" stroke="rgba(0,140,230,.4)" stroke-width="0.5"/>
              <!-- 门窗 -->
              <rect x="607" y="366" width="7" height="10" rx="0.5" fill="rgba(0,5,20,.7)" stroke="rgba(0,160,255,.4)" stroke-width="0.6"/>
              <rect x="617" y="368" width="5" height="6" rx="0.5" fill="rgba(0,180,255,.35)">
                <animate attributeName="fill-opacity" values="0.35;0.7;0.35" dur="3s" repeatCount="indefinite"/>
              </rect>
              <rect x="624" y="368" width="5" height="6" rx="0.5" fill="rgba(0,160,255,.28)"/>
              <!-- 右侧面窗 -->
              <rect x="635" y="362" width="5" height="6" rx="0.5" fill="rgba(0,160,255,.3)"/>
              <rect x="643" y="364" width="5" height="6" rx="0.5" fill="rgba(0,180,255,.38)">
                <animate attributeName="fill-opacity" values="0.38;0.72;0.38" dur="4s" repeatCount="indefinite"/>
              </rect>

              <!-- ── 机房/仓库（院内右侧） ── -->
              <!-- 前面 -->
              <polygon points="660,385 660,360 696,352 696,377" fill="url(#facadeL)" stroke="rgba(0,120,220,.45)" stroke-width="0.8"/>
              <!-- 右侧面 -->
              <polygon points="696,377 696,352 716,360 716,385" fill="url(#facadeR)" stroke="rgba(0,95,195,.38)" stroke-width="0.8"/>
              <!-- 屋顶 -->
              <polygon points="660,360 696,352 716,360 680,368" fill="rgba(9,30,80,.9)" stroke="rgba(0,155,245,.5)" stroke-width="0.8"/>
              <line x1="660" y1="360" x2="696" y2="352" stroke="rgba(0,190,255,.65)" stroke-width="1"/>
              <line x1="696" y1="352" x2="716" y2="360" stroke="rgba(0,170,255,.55)" stroke-width="1"/>
              <!-- 屋顶天线/卫星锅 -->
              <line x1="696" y1="352" x2="696" y2="338" stroke="rgba(0,200,255,.65)" stroke-width="1"/>
              <ellipse cx="696" cy="337" rx="5" ry="2.5" fill="none" stroke="rgba(0,200,255,.6)" stroke-width="1"/>
              <circle cx="696" cy="337" r="1.2" fill="rgba(0,220,255,.85)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <!-- 门窗 -->
              <rect x="668" y="368" width="8" height="11" rx="0.5" fill="rgba(0,5,20,.75)" stroke="rgba(0,150,240,.4)" stroke-width="0.6"/>
              <rect x="679" y="370" width="5" height="6" rx="0.5" fill="rgba(0,180,255,.32)"/>
              <rect x="686" y="370" width="5" height="6" rx="0.5" fill="rgba(0,180,255,.4)">
                <animate attributeName="fill-opacity" values="0.4;0.75;0.4" dur="3.5s" repeatCount="indefinite"/>
              </rect>
              <!-- 右侧面窗 -->
              <rect x="700" y="364" width="5" height="6" rx="0.5" fill="rgba(0,160,255,.28)"/>
              <rect x="708" y="366" width="5" height="6" rx="0.5" fill="rgba(0,160,255,.32)"/>

              <!-- ── 旗杆（院内中央） ── -->
              <line x1="672" y1="388" x2="672" y2="348" stroke="rgba(180,200,255,.7)" stroke-width="1.2"/>
              <!-- 旗帜 -->
              <polygon points="672,348 686,352 672,356" fill="rgba(0,160,255,.7)" stroke="rgba(0,200,255,.5)" stroke-width="0.5">
                <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="2s" repeatCount="indefinite"/>
              </polygon>
              <!-- 旗杆底座 -->
              <ellipse cx="672" cy="389" rx="4" ry="1.5" fill="rgba(0,120,220,.3)" stroke="rgba(0,180,255,.4)" stroke-width="0.6"/>

              <!-- ── 停车场（院内右下角） ── -->
              <polygon points="720,390 755,390 755,375 720,375" fill="rgba(4,12,32,.5)" stroke="rgba(0,80,160,.25)" stroke-width="0.5"/>
              <!-- 停车位线 -->
              <line x1="728" y1="390" x2="728" y2="375" stroke="rgba(0,100,200,.2)" stroke-width="0.5"/>
              <line x1="736" y1="390" x2="736" y2="375" stroke="rgba(0,100,200,.2)" stroke-width="0.5"/>
              <line x1="744" y1="390" x2="744" y2="375" stroke="rgba(0,100,200,.2)" stroke-width="0.5"/>
              <!-- 小车（简化） -->
              <rect x="721" y="378" width="6" height="9" rx="1" fill="rgba(0,80,180,.5)" stroke="rgba(0,140,220,.4)" stroke-width="0.5"/>
              <rect x="729" y="380" width="6" height="7" rx="1" fill="rgba(0,60,160,.45)" stroke="rgba(0,120,210,.35)" stroke-width="0.5"/>

              <!-- 地面反光 -->
              <ellipse cx="622" cy="390" rx="30" ry="4" fill="rgba(0,80,200,.08)"/>
              <ellipse cx="688" cy="387" rx="28" ry="4" fill="rgba(0,80,200,.07)"/>

              <!-- ===== 道路 ===== -->
              <path d="M280,420 L380,260 L800,260" stroke="rgba(0,80,160,.4)" stroke-width="3" fill="none"/>
              <path d="M400,420 L460,310 L800,310" stroke="rgba(0,80,160,.3)" stroke-width="2" fill="none"/>

              <!-- ===== 8个监测站 ===== -->
              <g v-for="st in stations" :key="'st'+st.id">
                <!-- 底座平台 -->
                <ellipse :cx="st.sx" :cy="st.sy+2" rx="10" ry="4"
                  :fill="st.tabs.includes(activeTab) ? 'rgba(0,180,255,.2)' : 'rgba(0,60,120,.15)'"
                  :stroke="st.tabs.includes(activeTab) ? 'rgba(0,212,255,.6)' : 'rgba(0,100,180,.3)'"
                  stroke-width="1"/>
                <!-- 铁塔腿 -->
                <line :x1="st.sx-5" :y1="st.sy" :x2="st.sx" :y2="st.sy-28"
                  :stroke="st.tabs.includes(activeTab) ? 'rgba(0,200,255,.7)' : 'rgba(80,140,200,.4)'" stroke-width="1.2"/>
                <line :x1="st.sx+5" :y1="st.sy" :x2="st.sx" :y2="st.sy-28"
                  :stroke="st.tabs.includes(activeTab) ? 'rgba(0,200,255,.7)' : 'rgba(80,140,200,.4)'" stroke-width="1.2"/>
                <line :x1="st.sx-3" :y1="st.sy-8" :x2="st.sx+3" :y2="st.sy-8"
                  :stroke="st.tabs.includes(activeTab) ? 'rgba(0,180,255,.5)' : 'rgba(60,120,180,.3)'" stroke-width="0.8"/>
                <line :x1="st.sx-2" :y1="st.sy-16" :x2="st.sx+2" :y2="st.sy-16"
                  :stroke="st.tabs.includes(activeTab) ? 'rgba(0,180,255,.5)' : 'rgba(60,120,180,.3)'" stroke-width="0.8"/>
                <!-- 塔顶横臂 -->
                <line :x1="st.sx-8" :y1="st.sy-28" :x2="st.sx+8" :y2="st.sy-28"
                  :stroke="st.tabs.includes(activeTab) ? '#00d4ff' : 'rgba(80,140,200,.5)'" stroke-width="1.5"/>
                <!-- 设备头 -->
                <rect :x="st.sx-4" :y="st.sy-34" width="8" height="5" rx="1"
                  :fill="st.tabs.includes(activeTab) ? 'rgba(0,220,255,.9)' : 'rgba(40,90,160,.5)'"
                  :stroke="st.tabs.includes(activeTab) ? '#00d4ff' : 'rgba(60,120,200,.4)'"
                  stroke-width="0.8"
                  :filter="st.tabs.includes(activeTab) ? 'url(#glow)' : ''"/>
                <!-- 高亮光晕（呼吸范围稍微放大） -->
                <ellipse v-if="st.tabs.includes(activeTab)"
                  :cx="st.sx" :cy="st.sy+2" rx="22" ry="9"
                  fill="url(#glowCyan)" opacity="0.7">
                  <animate attributeName="opacity" values="0.35;0.95;0.35" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="rx" values="16;26;16" dur="2s" repeatCount="indefinite"/>
                </ellipse>
                <!-- 扩散圆环（呼吸更明显一点） -->
                <ellipse v-if="st.tabs.includes(activeTab)"
                  :cx="st.sx" :cy="st.sy+2" rx="14" ry="6"
                  fill="none" stroke="rgba(0,212,255,.7)" stroke-width="1.1">
                  <animate attributeName="rx" values="9;26;9" dur="2.3s" repeatCount="indefinite"/>
                  <animate attributeName="ry" values="3.2;9;3.2" dur="2.3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.3s" repeatCount="indefinite"/>
                </ellipse>
                <!-- 标签（仅文字 + 连接线，不再有边框底板） -->
                <g v-if="st.tabs.includes(activeTab)" filter="url(#glow)">
                  <text :x="st.sx" :y="st.sy-42" text-anchor="middle" font-size="8" fill="#00d4ff" font-family="sans-serif">{{ st.name }}</text>
                  <!-- 连接线 -->
                  <line :x1="st.sx" :y1="st.sy-38" :x2="st.sx" :y2="st.sy-34" stroke="rgba(0,200,255,.4)" stroke-width="0.8"/>
                </g>
              </g>

              <!-- 地平线光晕叠加 -->
              <rect x="0" y="177" width="800" height="40" fill="url(#horizGlow)" opacity="0.6"/>

              <!-- 角落装饰框 -->
              <path d="M8,8 L8,28 M8,8 L28,8" stroke="rgba(0,180,255,.5)" stroke-width="1.5" fill="none"/>
              <path d="M792,8 L792,28 M792,8 L772,8" stroke="rgba(0,180,255,.5)" stroke-width="1.5" fill="none"/>
              <path d="M8,412 L8,392 M8,412 L28,412" stroke="rgba(0,180,255,.5)" stroke-width="1.5" fill="none"/>
              <path d="M792,412 L792,392 M792,412 L772,412" stroke="rgba(0,180,255,.5)" stroke-width="1.5" fill="none"/>

              <!-- 中心坐标十字 -->
              <line x1="395" y1="192" x2="405" y2="192" stroke="rgba(0,200,255,.3)" stroke-width="0.8"/>
              <line x1="400" y1="187" x2="400" y2="197" stroke="rgba(0,200,255,.3)" stroke-width="0.8"/>
              <circle cx="400" cy="192" r="2" fill="none" stroke="rgba(0,200,255,.25)" stroke-width="0.8"/>

              <!-- 扫描线 -->
              <line x1="0" y1="0" x2="800" y2="0" stroke="rgba(0,212,255,.25)" stroke-width="1.5">
                <animate attributeName="y1" values="200;420;200" dur="7s" repeatCount="indefinite"/>
                <animate attributeName="y2" values="200;420;200" dur="7s" repeatCount="indefinite"/>
              </line>

              <!-- 顶部信息条 -->
              <rect x="0" y="0" width="800" height="22" fill="rgba(0,10,30,.5)"/>
              <text x="14" y="14" font-size="8" fill="rgba(0,180,255,.6)" font-family="monospace">SYSTEM MONITOR v2.4</text>
              <text x="400" y="14" text-anchor="middle" font-size="8" fill="rgba(0,200,255,.5)" font-family="monospace">● ONLINE</text>
              <!-- 时段标签 -->
              <rect :x="786 - skyConfig.label.length*7 - 28" y="4" :width="skyConfig.label.length*7+28" height="14" rx="3" fill="rgba(0,20,50,.7)" stroke="rgba(0,180,255,.3)" stroke-width="0.6"/>
              <text x="786" y="14" text-anchor="end" font-size="8" fill="rgba(0,220,255,.85)" font-family="monospace">{{ skyConfig.label }} STA:8/8</text>
            </svg>
          </div>
        </div>
        <div class="tab-row">
          <div v-for="(t,i) in tabs" :key="i" class="tab-btn" :class="{active:activeTab===i}" @click="switchTab(i)">
            <span class="tab-tri">▶</span>{{ t }}
          </div>
        </div>
        </div>

        <!-- Tab1 -->
        <template v-if="activeTab===0">
          <div class="mid-bottom-grid grid-2x2">
            <div class="mb-cell big-panel"><div class="cell-title">Ta</div><div class="cell-leg"><span v-for="l in taLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div><div ref="taChart" class="chart-box"></div></div>
            <div class="mb-cell big-panel"><div class="cell-title">RH</div><div class="cell-leg"><span v-for="l in rhLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div><div ref="rhChart" class="chart-box"></div></div>
            <div class="mb-cell big-panel"><div class="cell-title">WS</div><div class="cell-leg"><span v-for="l in wsLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div><div ref="wsChart" class="chart-box"></div></div>
            <div class="mb-cell big-panel"><div class="cell-title">WD</div><div class="cell-leg"><span v-for="l in wdLeg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div><div ref="wdChart" class="chart-box"></div></div>
          </div>
        </template>

        <!-- Tab2 -->
        <template v-if="activeTab===1">
          <div class="mid-bottom-grid grid-full">
            <div class="mb-cell big-panel"><div class="cell-title">FLUX_MAX</div><div ref="t2m1" class="chart-box"></div></div>
          </div>
        </template>

        <!-- Tab3 -->
        <template v-if="activeTab===2">
          <div class="mid-bottom-grid grid-2col">
            <div class="mb-cell big-panel co2-cell">
              <div class="cell-title">CO2</div>
              <div ref="t3m1" class="chart-box co2-chart"></div>
              <div class="co2-footer">
                <div class="mol-scene mol-scene-co2">
                  <div class="mol-wave mol-wave1"></div>
                  <div class="mol-wave mol-wave2"></div>
                  <svg class="mol-svg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                    <!-- 分子云气泡 -->
                    <circle cx="40" cy="22" r="12" fill="rgba(0,180,255,.18)" stroke="rgba(0,210,255,.7)" stroke-width="1"/>
                    <circle cx="26" cy="28" r="8"  fill="rgba(0,180,255,.15)" stroke="rgba(0,210,255,.6)" stroke-width="1"/>
                    <circle cx="54" cy="28" r="8"  fill="rgba(0,180,255,.15)" stroke="rgba(0,210,255,.6)" stroke-width="1"/>
                    <circle cx="33" cy="18" r="6"  fill="rgba(0,180,255,.12)" stroke="rgba(0,210,255,.5)" stroke-width="0.8"/>
                    <circle cx="50" cy="17" r="5"  fill="rgba(0,180,255,.12)" stroke="rgba(0,210,255,.5)" stroke-width="0.8"/>
                    <circle cx="40" cy="13" r="4"  fill="rgba(0,180,255,.1)"  stroke="rgba(0,210,255,.4)" stroke-width="0.8"/>
                    <!-- CO₂ 文字 -->
                    <text x="40" y="27" text-anchor="middle" font-size="10" font-weight="700" fill="#e0f8ff" style="text-shadow:0 0 6px #00d4ff">CO₂</text>
                  </svg>
                </div>
              </div>
            </div>
            <div class="mb-cell big-panel co2-cell">
              <div class="cell-title">H2O</div>
              <div ref="t3m2" class="chart-box co2-chart"></div>
              <div class="co2-footer">
                <div class="mol-scene mol-scene-h2o">
                  <div class="mol-wave mol-wave1"></div>
                  <div class="mol-wave mol-wave2"></div>
                  <svg class="mol-svg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                    <!-- 水滴 -->
                    <path d="M40 8 Q52 24 52 34 A12 12 0 0 1 28 34 Q28 24 40 8Z" fill="rgba(0,160,255,.3)" stroke="rgba(0,210,255,.85)" stroke-width="1.2"/>
                    <path d="M40 14 Q49 26 49 33 A9 9 0 0 1 31 33 Q31 26 40 14Z" fill="rgba(0,200,255,.18)"/>
                    <!-- 高光 -->
                    <ellipse cx="35" cy="24" rx="3" ry="5" fill="rgba(255,255,255,.25)" transform="rotate(-20,35,24)"/>
                    <!-- 水波纹 -->
                    <ellipse cx="40" cy="46" rx="14" ry="3" fill="none" stroke="rgba(0,210,255,.5)" stroke-width="1"/>
                    <ellipse cx="40" cy="46" rx="9"  ry="2" fill="none" stroke="rgba(0,210,255,.35)" stroke-width="0.8"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Tab4 -->
        <template v-if="activeTab===3">
          <div class="mid-bottom-grid grid-imgs">
            <div class="wh-switch">
              <button class="wh-btn" :class="{active: activeWhImg==='WH1'}" @click="activeWhImg='WH1'">WH1</button>
              <button class="wh-btn" :class="{active: activeWhImg==='WH2'}" @click="activeWhImg='WH2'">WH2</button>
            </div>
            <template v-if="whImages.length">
              <div class="big-panel img-cell" v-for="(img,n) in whImages" :key="n">
                <div class="img-scan"></div>
                <img :src="imgUrl(img)" class="img-real" :alt="img.split('/').pop()" @error="e=>e.target.style.display='none'"/>
                <div class="img-label">{{ img.split('/').pop().replace(/_\d+\.jpeg$/,'') }}</div>
              </div>
            </template>
            <template v-else>
              <div class="big-panel img-cell" v-for="n in 6" :key="n" :style="imgBg(n)">
                <div class="img-scan"></div>
                <div class="img-placeholder">暂无图像数据</div>
              </div>
            </template>
          </div>
        </template>

      </div>

      <!-- ===== 右列 ===== -->
      <div class="col-right" :class="{ tab2: activeTab===1 || activeTab===2 }">
        <template v-if="activeTab===0">
          <div class="big-panel rc-cell" v-for="(rc,i) in t1Right" :key="rc.title">
            <div class="cell-title">{{ rc.title }}</div>
            <div class="cell-leg"><span v-for="l in rc.leg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div :ref="el=>rightRefs[i]=el" class="chart-box"></div>
          </div>
        </template>
        <template v-if="activeTab===1">
          <div class="big-panel rc-cell" v-for="(rc,i) in t2Right" :key="rc.title">
            <div class="cell-title">{{ rc.title }}</div>
            <div :ref="el=>rightRefs[i]=el" class="chart-box"></div>
          </div>
        </template>
        <template v-if="activeTab===2">
          <div class="big-panel rc-cell" v-for="(rc,i) in t3Right" :key="rc.title">
            <div class="cell-title">{{ rc.title }}</div>
            <div :ref="el=>rightRefs[i]=el" class="chart-box"></div>
          </div>
        </template>
        <template v-if="activeTab===3">
          <div class="big-panel rc-cell" v-for="(rc,i) in t4Right" :key="rc.title">
            <div class="cell-title">{{ rc.title }}</div>
            <div class="cell-leg" v-if="rc.leg"><span v-for="l in rc.leg" :key="l.n" class="ld"><span class="ld-dot" :style="{background:l.c}"></span>{{ l.n }}</span></div>
            <div :ref="el=>rightRefs[i]=el" class="chart-box"></div>
          </div>
        </template>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const formatDate = (d) => `${d.getFullYear()}年${String(d.getMonth()+1).padStart(2,'0')}月${String(d.getDate()).padStart(2,'0')}日`
const formatTime = (d) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`

const currentDate = ref(formatDate(new Date()))
const currentTime = ref(formatTime(new Date()))
let timeTimer = null

// 默认展示“植被多光谱物候监测站”（对应 tabs 第 4 项，索引 3）
const activeTab = ref(3)
const tabs = ['气象梯度系统','风环流阵列系统','一体式开路涡度系统','植被多光谱物候监测站']

// ===== 实时 API =====
const API_URL = '/api/HuaNeng_kbq_API/realtime'
const imgUrl = (path) => path.replace(/^\/photo\//, '/HuaNeng_kbq_Photo/')
const histQX = ref([])   // [{ts, QX1:{...}, QX2:{...}}]
const histFS = ref([])   // [{ts, FS1:{...}, ...FS5}]
const histEC = ref([])   // [{ts, EC1:{...}, EC2:{...}}]
const histWH = ref([])   // [{ts, WH1:{...}, WH2:{...}}]

const fmtTs = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
const pushHist = (arr, item, max=48) => {
  if(arr.length >= max) arr.shift()
  arr.push(item)
}
// 统一把接口值转为 number，避免字符串/科学计数导致的刻度异常
const toNum = (x) => {
  if (x === null || x === undefined || x === '') return null
  if (typeof x === 'number') return Number.isFinite(x) ? x : null
  if (typeof x === 'string') {
    const n = parseFloat(x)
    return Number.isFinite(n) ? n : null
  }
  return null
}
const round2 = (n) => {
  if (n === null || n === undefined) return null
  const x = Number(n)
  if (!Number.isFinite(x)) return null
  return Math.round((x + Number.EPSILON) * 100) / 100
}
// 接口数据归一化：所有数值/数值字符串四舍五入保留两位
const roundApiData = (input) => {
  if (Array.isArray(input)) return input.map(roundApiData)
  if (input && typeof input === 'object') {
    const out = {}
    for (const [k, val] of Object.entries(input)) out[k] = roundApiData(val)
    return out
  }
  const n = toNum(input)
  if (n === null) return input
  const r = round2(n)
  return r === null ? input : r
}
const v = (x) => {
  const n = toNum(x)
  const r = round2(n)
  return r === null ? '-' : r
}

async function fetchData() {
  try {
    const res = await fetch(API_URL)
    const json = await res.json()
    if(json.code !== 0) return
    const d = roundApiData(json.data)
    const ts = fmtTs()
    pushHist(histQX.value, { ts, QX1: d.QX?.QX1 || {}, QX2: d.QX?.QX2 || {} })
    pushHist(histFS.value, { ts, FS1: d.FS?.FS1 || {}, FS2: d.FS?.FS2 || {}, FS3: d.FS?.FS3 || {}, FS4: d.FS?.FS4 || {}, FS5: d.FS?.FS5 || {} })
    pushHist(histEC.value, { ts, EC1: d.EC?.EC1 || {}, EC2: d.EC?.EC2 || {} })
    pushHist(histWH.value, { ts, WH1: d.WH?.WH1 || {}, WH2: d.WH?.WH2 || {} })
    // 数据更新后刷新当前 tab 图表
    await nextTick()
    initCharts()
  } catch(e) { console.warn('API fetch error', e) }
}

// 从历史队列提取某字段的时间序列，支持多站点
const histSeries = (hist, stationKey, field) =>
  hist.map(r => v(r[stationKey]?.[field]))
const histTimes = (hist) => hist.map(r => r.ts)

// 根据系列数据动态计算 y 轴范围，数值小则间隔小，数值大则间隔大
const calcYRange = (...dataArrays) => {
  const vals = dataArrays
    .flat()
    .map(toNum)
    .filter(n => n !== null)
  if (vals.length === 0) return { min: null, max: null }
  let min = Math.min(...vals)
  let max = Math.max(...vals)
  let range = max - min
  if (range === 0) {
    const pad = Math.max(Math.abs(min) * 0.2, 0.1) || 0.1
    // 单值场景：仍然给一点缓冲，但整体保持紧凑
    return { min: min - pad, max: max + pad }
  }
  // 将上下 padding 从 10% 压缩为 5%，让曲线更贴近网格上下边缘，看起来更“紧凑”
  const pad = range * 0.05
  return { min: min - pad, max: max + pad }
}

// Tab4 图片切换：WH1 / WH2
const activeWhImg = ref('WH1')
const whImages = computed(() => {
  if(!histWH.value.length) return []
  const latest = histWH.value[histWH.value.length - 1]
  const imgs = activeWhImg.value === 'WH2'
    ? (latest.WH2?.images || [])
    : (latest.WH1?.images || [])
  return imgs.slice(0, 6)
})

// ===== 时间驱动天空 =====
const currentHour = ref(new Date().getHours() + new Date().getMinutes() / 60)

// 时段定义：[起始小时, 终止小时, 天空顶色, 天空底色, 地平线色, 时段名, 是否显示星星, 是否显示太阳, 太阳颜色, 太阳光晕色]
const timeSlots = [
  { from:0,  to:5,  skyTop:'#000510', skyMid:'#010a1e', skyBot:'#021230', label:'深夜', stars:true,  sun:false, moon:true,  sunColor:'#fff8e0', glowColor:'rgba(255,240,180,.25)', groundTint:'rgba(0,5,20,.85)' },
  { from:5,  to:7,  skyTop:'#0a0520', skyMid:'#3d1a0a', skyBot:'#c45a10', label:'黎明', stars:true,  sun:true,  moon:false, sunColor:'#ff8c30', glowColor:'rgba(255,140,40,.55)',  groundTint:'rgba(5,8,18,.75)' },
  { from:7,  to:9,  skyTop:'#1a3a6e', skyMid:'#e8823a', skyBot:'#f5c060', label:'日出', stars:false, sun:true,  moon:false, sunColor:'#ffcc44', glowColor:'rgba(255,200,80,.7)',   groundTint:'rgba(2,8,20,.6)' },
  { from:9,  to:16, skyTop:'#0d2a5e', skyMid:'#1a5fa8', skyBot:'#4db8e8', label:'白天', stars:false, sun:true,  moon:false, sunColor:'#fff5a0', glowColor:'rgba(255,245,160,.8)',  groundTint:'rgba(0,10,30,.55)' },
  { from:16, to:18, skyTop:'#1a1040', skyMid:'#c04020', skyBot:'#f08030', label:'日落', stars:false, sun:true,  moon:false, sunColor:'#ff7020', glowColor:'rgba(255,120,30,.7)',   groundTint:'rgba(5,5,15,.65)' },
  { from:18, to:20, skyTop:'#050318', skyMid:'#2a0e30', skyBot:'#6a2040', label:'黄昏', stars:true,  sun:false, moon:false, sunColor:'#ff5010', glowColor:'rgba(255,80,20,.4)',    groundTint:'rgba(3,3,12,.75)' },
  { from:20, to:24, skyTop:'#000510', skyMid:'#010a1e', skyBot:'#021230', label:'夜晚', stars:true,  sun:false, moon:true,  sunColor:'#fff8e0', glowColor:'rgba(255,240,180,.25)', groundTint:'rgba(0,5,20,.85)' },
]

const skyConfig = computed(() => {
  const h = currentHour.value
  return timeSlots.find(s => h >= s.from && h < s.to) || timeSlots[0]
})

// 太阳/月亮位置：白天从左到右弧线运动，夜晚月亮从右到左
const celestialPos = computed(() => {
  const h = currentHour.value
  const cfg = skyConfig.value
  if (cfg.sun) {
    // 太阳：5点在左边地平线，17点在右边地平线，12点在顶部
    const t = (h - 5) / 12  // 0~1 覆盖 5-17点
    const clampT = Math.max(0, Math.min(1, t))
    const x = 80 + clampT * 640  // 80~720
    const y = 155 - Math.sin(clampT * Math.PI) * 120  // 弧线，最高点y=35
    return { x, y, visible: true }
  } else if (cfg.moon) {
    // 月亮：20点在右，4点在左
    const t = h >= 20 ? (h - 20) / 8 : (h + 4) / 8
    const clampT = Math.max(0, Math.min(1, t))
    const x = 720 - clampT * 640
    const y = 145 - Math.sin(clampT * Math.PI) * 100
    return { x, y, visible: true }
  }
  return { x: 400, y: 80, visible: false }
})

// 星星只在夜晚/黎明显示
const showStars = computed(() => skyConfig.value.stars)

// 8个监测站：sx/sy为SVG坐标，tabs表示在哪些tab高亮
// 星空粒子数据
const stars = Array.from({length: 60}, (_, i) => ({
  id: i,
  x: Math.round(Math.random() * 800),
  y: Math.round(Math.random() * 170),
  r: +(Math.random() * 1.2 + 0.3).toFixed(1),
  o: +(Math.random() * 0.6 + 0.2).toFixed(2),
  d: +(Math.random() * 3 + 2).toFixed(1),
}))

const stations = [
  { id:1, name:'气象梯度A',   sx:180, sy:310, tabs:[0] },
  { id:2, name:'气象梯度B',   sx:340, sy:355, tabs:[0] },
  // 每个 tab 固定两个塔高亮 + 呼吸灯
  { id:3, name:'风沙流探测',  sx:310, sy:270, tabs:[1] },
  { id:4, name:'风沙尘监测',  sx:490, sy:245, tabs:[1] },
  { id:5, name:'风沙流系统',  sx:390, sy:305, tabs:[2] },
  { id:6, name:'涡动监测',    sx:240, sy:335, tabs:[2] },
  { id:7, name:'植被固定站A', sx:420, sy:220, tabs:[3] },
  { id:8, name:'植被固定站B', sx:560, sy:270, tabs:[3] },
]


const makeCards = (cnt) => [
  { label:'设备数量', value:String(cnt), cls:'',           valCls:'',
    icon:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { label:'当前在线', value:String(cnt), cls:'icon-green',  valCls:'val-green',
    icon:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { label:'用户名称', value:'XXX',        cls:'',           valCls:'val-sm',
    icon:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { label:'当前位置', value:'内蒙古',     cls:'',           valCls:'val-sm',
    icon:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' },
]
const tabCounts = [2,5,2,2]
const curDeviceCards = computed(()=>makeCards(tabCounts[activeTab.value]))

const C = ['#00c8ff','#00ff99','#ffe600','#aa44ff','#ff6644','#0088ff','#ff44aa']
const lwLeg  = [{n:'LWin',c:C[0]},{n:'LWout',c:C[1]},{n:'RN',c:C[2]},{n:'SWin',c:C[3]},{n:'SWout',c:C[4]}]
const nirLeg = [{n:'NIR',c:C[0]},{n:'WS',c:C[1]},{n:'DIR',c:C[2]}]
const taLeg  = [{n:'Ta_2m_Avg',c:C[0]},{n:'Ta_4m_Avg',c:C[1]},{n:'Ta_6m_Avg',c:C[2]},{n:'Ta_8m_Avg',c:C[3]}]
const rhLeg  = [{n:'RH_2m_Avg',c:C[3]},{n:'RH_4m_Avg',c:C[0]},{n:'RH_6m_Avg',c:C[1]},{n:'RH_8m_Avg',c:C[2]}]
const wsLeg  = [{n:'WS_3m',c:C[3]},{n:'WS_4m',c:C[0]},{n:'WS_6m',c:C[1]},{n:'WS_8m',c:C[2]}]
const wdLeg  = [{n:'WD_2m',c:C[3]},{n:'WD_4m',c:C[0]},{n:'WD_6m',c:C[1]},{n:'WD_8m',c:C[2]}]

const t1Right = [
  {title:'VWC',leg:[{n:'VWC_10cm_Avg',c:C[3]},{n:'VWC_20cm_Avg',c:C[0]},{n:'VWC_40cm_Avg',c:C[2]},{n:'VWC_80cm_Avg',c:C[1]}]},
  {title:'EC', leg:[{n:'Sol_EC_10cm_Avg',c:C[0]},{n:'Sol_EC_20cm_Avg',c:C[1]},{n:'Na_Li_10cm_Avg',c:C[3]},{n:'Na_Li_30cm_Avg',c:C[2]}]},
  {title:'T',  leg:[{n:'VWC_10cm_Avg',c:C[3]},{n:'VWC_20cm_Avg',c:C[0]}]},
  {title:'SHF',leg:[{n:'SHF_W5_Avg',c:C[0]},{n:'SHF_EA_Avg',c:C[1]}]},
]
const t2Right = [{title:'WIND_MIN'},{title:'WIND_AVG'},{title:'WIND_MAX'}]
const t3Right = [{title:'ET'},{title:'H'},{title:'WD'}]
const whLeg = [{n:'WH1',c:C[0]},{n:'WH2',c:C[1]}]
const t4Right = [
  {title:'GCC', leg:whLeg},
  {title:'GVI', leg:whLeg},
  {title:'RCC', leg:whLeg},
  {title:'BCC', leg:whLeg},
]

const barChart=ref(null),lwChart=ref(null),nirChart=ref(null)
const taChart=ref(null),rhChart=ref(null),wsChart=ref(null),wdChart=ref(null)
const t2l1=ref(null),t2l2=ref(null),t2m1=ref(null)
const t3l1=ref(null),t3l2=ref(null),t3m1=ref(null),t3m2=ref(null)
const t4l1=ref(null),t4l2=ref(null)
const rightRefs=ref([])

let instances=[]

const T48=Array.from({length:48},(_,i)=>{
  const h=Math.floor(i/2),m=i%2===0?'00':'30'
  return `${String(h).padStart(2,'0')}:${m}`
})
const wave=(base,amp,noise=3)=>Array.from({length:48},(_,i)=>
  +(base+Math.sin(i*Math.PI/8)*amp+Math.sin(i*Math.PI/3)*amp*.3+(Math.random()-.5)*noise).toFixed(2))

// x 轴工厂：传入时间戳数组，首尾各显示一个标签
const mkXAx = (times) => ({
  type:'category', data: times.length ? times : ['--'], boundaryGap:false,
  axisLine:{lineStyle:{color:'rgba(0,180,255,0.2)'}},
  axisTick:{show:false},
  axisLabel:{
    color:'rgba(0,200,255,0.45)', fontSize:9,
    interval:(i, all) => i===0 || i===all.length-1,
    formatter:(val,i,all) => {
      if(!all) return val
      if(i===0) return val
      if(i===all.length-1) return val
      return ''
    }
  }
})
// 兼容旧 xAx（无数据时占位）
const xAx = mkXAx(T48)
// y 轴：根据当前范围自动调整小数位，避免刻度文本重复
const yAx=(min,max)=>{
  const hasRange = (typeof min === 'number') && (typeof max === 'number') && Number.isFinite(min) && Number.isFinite(max)
  const range = hasRange ? Math.abs(max - min) : null
  return {
    type:'value',min,max,
    splitLine:{lineStyle:{color:'rgba(0,180,255,0.1)',type:'dashed'}},
    axisLabel:{
      color:'rgba(0,200,255,0.45)',fontSize:9,
      formatter:(val)=>{
        const n = typeof val === 'number' ? val : parseFloat(val)
        if(!Number.isFinite(n)) return String(val)
        let digits = 2
        if(range !== null){
          if(range < 0.001) digits = 6
          else if(range < 0.01) digits = 5
          else if(range < 0.1) digits = 4
          else if(range < 1) digits = 3
        }
        let s = n.toFixed(digits)
        // 统一把 -0.0000... 处理为 0.0000...
        if(Math.abs(n) < Math.pow(10, -digits)) s = (0).toFixed(digits)
        return s
      }
    },
    axisLine:{show:false},axisTick:{show:false}
  }
}
// grid 左边距加大，避免 y 轴刻度被截断
const G=(t=4,b=16,l=40,r=15)=>({top:t,bottom:b,left:l,right:r})
const lser=(name,color,data,area=false,extra={})=>{
  const validCount = Array.isArray(data) ? data.filter(d=>d!=='-'&&d!==null&&d!==undefined).length : 0
  return {
    name,type:'line',smooth:true,
    symbol:'circle',
    // 数据点很多时也保留小圆点，避免“只有一条系列有点”的错觉
    symbolSize: validCount<=1 ? 6 : 3,
    symbolOffset: extra.symbolOffset,
    showSymbol: true,
    data,
    z: extra.z,
    lineStyle:{color,width:1.8},itemStyle:{color},
    areaStyle:area?{color:{type:'linear',x:0,y:0,x2:0,y2:1,
      colorStops:[{offset:0,color:color+'88'},{offset:1,color:'transparent'}]}}:undefined
  }
}
const mk=(el,opt)=>{if(!el)return;const c=echarts.init(el);c.setOption(opt);instances.push(c)}
const killAll=()=>{instances.forEach(c=>{try{c.dispose()}catch(e){}});instances=[]}
const base=(series,ymin,ymax,gb=G())=>({backgroundColor:'transparent',grid:gb,xAxis:xAx,yAxis:yAx(ymin,ymax),series})

const initTab1=()=>{
  const hist = histQX.value
  const times = histTimes(hist)
  const xA = mkXAx(times)
  const baseQ = (series,ymin,ymax,gb=G()) => ({backgroundColor:'transparent',grid:gb,xAxis:xA,yAxis:yAx(ymin,ymax),series})

  // 降雨/大气压：取最新一条 QX1 数据做柱状图
  const latest = hist.length ? hist[hist.length-1] : null
  const rainVal = latest ? v(latest.QX1?.Rain_2m) : '-'
  const pressVal = latest ? v(latest.QX1?.P_2m_Avg) : '-'
  const rainNum = rainVal==='-' ? 0 : +rainVal
  const pressNum = pressVal==='-' ? 0 : +pressVal
  mk(barChart.value,{
    backgroundColor:'transparent',grid:G(8,18,30,10),
    xAxis:{type:'category',data:['降雨(mm)','大气压(hPa)'],axisLine:{lineStyle:{color:'rgba(0,180,255,0.2)'}},axisTick:{show:false},axisLabel:{color:'rgba(0,200,255,0.5)',fontSize:10}},
    yAxis:yAx(0,Math.max(pressNum*1.2,10)),
    series:[
      {type:'bar',data:[{value:rainNum,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#00c8ff'},{offset:1,color:'rgba(0,80,160,0.4)'}]}}},null],barWidth:'45%'},
      {type:'bar',data:[null,{value:pressNum,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#0088ff'},{offset:1,color:'rgba(0,40,120,0.4)'}]}}}],barWidth:'45%'},
    ]
  })

  const qxSer = (n,c,f) => lser(n,c,histSeries(hist,'QX1',f))
  const qxData = (f) => histSeries(hist,'QX1',f)

  const lwFields = [{n:'SW_in_Avg',c:C[0]},{n:'SW_out_Avg',c:C[1]},{n:'LW_in_Avg',c:C[2]},{n:'LW_out_Avg',c:C[3]},{n:'Rn_Avg',c:C[4]}]
  mk(lwChart.value, baseQ(lwFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...lwFields.map(l=>qxData(l.n))))))

  const nirFields = [{n:'NIR_Avg',c:C[0]},{n:'DIR_Avg',c:C[2]}]
  mk(nirChart.value, baseQ(nirFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...nirFields.map(l=>qxData(l.n))))))

  const taFields = [{n:'Ta_2m_Avg',c:C[0]},{n:'Ta_4m_Avg',c:C[1]},{n:'Ta_6m_Avg',c:C[2]},{n:'Ta_8m_Avg',c:C[3]}]
  mk(taChart.value, baseQ(taFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...taFields.map(l=>qxData(l.n))))))

  const rhFields = [{n:'RH_2m_Avg',c:C[3]},{n:'RH_4m_Avg',c:C[0]},{n:'RH_6m_Avg',c:C[1]},{n:'RH_8m_Avg',c:C[2]}]
  mk(rhChart.value, baseQ(rhFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...rhFields.map(l=>qxData(l.n))))))

  const wsFields = [{n:'WS_2m',c:C[3]},{n:'WS_4m',c:C[0]},{n:'WS_6m',c:C[1]},{n:'WS_8m',c:C[2]}]
  mk(wsChart.value, baseQ(wsFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...wsFields.map(l=>qxData(l.n))))))

  const wdFields = [{n:'WD_2m',c:C[3]},{n:'WD_4m',c:C[0]},{n:'WD_6m',c:C[1]},{n:'WD_8m',c:C[2]}]
  mk(wdChart.value, baseQ(wdFields.map(l=>qxSer(l.n,l.c,l.n)), ...Object.values(calcYRange(...wdFields.map(l=>qxData(l.n))))))

  const cfgs=[
    { s:[qxSer('VWC_10cm',C[3],'VWC_10cm_Avg'),qxSer('VWC_20cm',C[0],'VWC_20cm_Avg'),qxSer('VWC_40cm',C[2],'VWC_40cm_Avg'),qxSer('VWC_80cm',C[1],'VWC_80cm_Avg')], d:[qxData('VWC_10cm_Avg'),qxData('VWC_20cm_Avg'),qxData('VWC_40cm_Avg'),qxData('VWC_80cm_Avg')] },
    { s:[qxSer('Soil_EC_10cm',C[0],'Soil_EC_10cm_Avg'),qxSer('Soil_EC_20cm',C[1],'Soil_EC_20cm_Avg')], d:[qxData('Soil_EC_10cm_Avg'),qxData('Soil_EC_20cm_Avg')] },
    { s:[qxSer('Soil_T_10cm',C[3],'Soil_T_10cm_Avg'),qxSer('Soil_T_20cm',C[0],'Soil_T_20cm_Avg')], d:[qxData('Soil_T_10cm_Avg'),qxData('Soil_T_20cm_Avg')] },
    { s:[qxSer('SHF_WEST',C[0],'SHF_WEST_Avg',true),qxSer('SHF_EAST',C[1],'SHF_EAST_Avg',true)], d:[qxData('SHF_WEST_Avg'),qxData('SHF_EAST_Avg')] },
  ]
  rightRefs.value.forEach((el,i)=>{
    if(cfgs[i]) { const yr=calcYRange(...cfgs[i].d); mk(el,baseQ(cfgs[i].s,yr.min,yr.max)) }
  })
}
const initTab2=()=>{
  const hist = histFS.value
  const times = histTimes(hist)
  const xA = mkXAx(times)
  const baseF = (series,ymin,ymax,gb=G()) => ({backgroundColor:'transparent',grid:gb,xAxis:xA,yAxis:yAx(ymin,ymax),series})
  const fsCols = [C[0],C[1],C[2],C[3],C[5]]
  const fsKeys = ['FS1','FS2','FS3','FS4','FS5']

  const yr1 = calcYRange(...fsKeys.map(k=>histSeries(hist,k,'FLUX_MIN')))
  const yr2 = calcYRange(...fsKeys.map(k=>histSeries(hist,k,'FLUX_AVG')))
  const yr3 = calcYRange(...fsKeys.map(k=>histSeries(hist,k,'FLUX_MAX')))
  mk(t2l1.value, baseF(fsKeys.map((k,i)=>lser(k,fsCols[i],histSeries(hist,k,'FLUX_MIN'),true)),yr1.min,yr1.max))
  mk(t2l2.value, baseF(fsKeys.map((k,i)=>lser(k,fsCols[i],histSeries(hist,k,'FLUX_AVG'),true)),yr2.min,yr2.max))
  mk(t2m1.value, baseF(fsKeys.map((k,i)=>lser(k,fsCols[i],histSeries(hist,k,'FLUX_MAX'),true)),yr3.min,yr3.max,G(8,20,32,8)))

  const windFields = ['WIND_MIN','WIND_AVG','WIND_MAX']
  rightRefs.value.forEach((el,i)=>{
    const yr = calcYRange(...fsKeys.map(k=>histSeries(hist,k,windFields[i])))
    mk(el, baseF(fsKeys.map((k,j)=>lser(k,fsCols[j],histSeries(hist,k,windFields[i]),true)),yr.min,yr.max))
  })
}
const initTab3=()=>{
  const hist = histEC.value
  const times = histTimes(hist)
  const xA = mkXAx(times)
  const baseE = (series,ymin,ymax,gb=G()) => ({backgroundColor:'transparent',grid:gb,xAxis:xA,yAxis:yAx(ymin,ymax),series})

  const yr1 = calcYRange(histSeries(hist,'EC1','FC'), histSeries(hist,'EC2','FC'))
  const yr2 = calcYRange(histSeries(hist,'EC1','LE'), histSeries(hist,'EC2','LE'))
  const yr3 = calcYRange(histSeries(hist,'EC1','CO2'), histSeries(hist,'EC2','CO2'))
  const yr4 = calcYRange(histSeries(hist,'EC1','H2O'), histSeries(hist,'EC2','H2O'))
  mk(t3l1.value, baseE([
    lser('FC-EC1',C[0],histSeries(hist,'EC1','FC'),true),
    lser('FC-EC2',C[1],histSeries(hist,'EC2','FC'),true),
  ],yr1.min,yr1.max))
  mk(t3l2.value, baseE([
    lser('LE-EC1',C[0],histSeries(hist,'EC1','LE'),true),
    lser('LE-EC2',C[3],histSeries(hist,'EC2','LE'),true),
  ],yr2.min,yr2.max))
  mk(t3m1.value, baseE([
    lser('CO2-EC1',C[0],histSeries(hist,'EC1','CO2'),true),
    lser('CO2-EC2',C[5],histSeries(hist,'EC2','CO2'),true),
  ],yr3.min,yr3.max))
  mk(t3m2.value, baseE([
    lser('H2O-EC1',C[3],histSeries(hist,'EC1','H2O'),true),
    lser('H2O-EC2',C[5],histSeries(hist,'EC2','H2O'),true),
  ],yr4.min,yr4.max))

  const ecRightFields = ['ET','H','WD']
  const rcols = [C[1],C[3],C[2]]
  rightRefs.value.forEach((el,i)=>{
    const yr = calcYRange(histSeries(hist,'EC1',ecRightFields[i]), histSeries(hist,'EC2',ecRightFields[i]))
    mk(el, baseE([
      lser(`${ecRightFields[i]}-EC1`,rcols[i],histSeries(hist,'EC1',ecRightFields[i]),true),
      lser(`${ecRightFields[i]}-EC2`,C[5],histSeries(hist,'EC2',ecRightFields[i]),true),
    ],yr.min,yr.max))
  })
}
const initTab4=()=>{
  const hist = histWH.value
  const times = histTimes(hist)
  const xA = mkXAx(times)
  const baseW = (series,ymin,ymax,gb=G()) => ({backgroundColor:'transparent',grid:gb,xAxis:xA,yAxis:yAx(ymin,ymax),series})

  const whData = (stKey, field) =>
    hist.map(r => {
      const obj = r[stKey] || {}
      const val =
        obj[field] ??
        obj[String(field).toLowerCase()] ??
        obj[String(field).toUpperCase()]
      return v(val)
    })
  const whSer = (stKey, field, color, area=true, extra={}) =>
    lser(`${stKey}-${field}`, color, whData(stKey, field), area, extra)

  const yr1 = calcYRange(whData('WH1','ndvi'), whData('WH2','ndvi'))
  const yr2 = calcYRange(whData('WH1','roi_ndvi'), whData('WH2','roi_ndvi'))

  mk(t4l1.value, baseW([
    whSer('WH1','ndvi',C[0]),
    whSer('WH2','ndvi',C[1]),
  ],yr1.min,yr1.max))
  mk(t4l2.value, baseW([
    whSer('WH1','roi_ndvi',C[0]),
    whSer('WH2','roi_ndvi',C[1]),
  ],yr2.min,yr2.max))

  const whRightFields = ['GCC','GVI','RCC','BCC']
  rightRefs.value.forEach((el,i)=>{
    const f = whRightFields[i]
    if(!f) return
    const yr = calcYRange(whData('WH1',f), whData('WH2',f))
    mk(el, baseW([
      // 两组数据数值相同/接近时，点会重叠；做轻微左右错开，保证两色都可见
      whSer('WH1', f, C[0], false, { symbolOffset: [-4, 0], z: 3 }),
      whSer('WH2', f, C[1], false, { symbolOffset: [4, 0], z: 4 }),
    ],yr.min,yr.max))
  })
}

const initCharts=async()=>{
  await nextTick(); killAll(); await nextTick()
  const t=activeTab.value
  if(t===0) initTab1()
  else if(t===1) initTab2()
  else if(t===2) initTab3()
  else initTab4()
}

const switchTab=(i)=>{activeTab.value=i}
watch(activeTab,()=>{rightRefs.value=[];nextTick(()=>initCharts())})

const onResize=()=>instances.forEach(c=>{try{c.resize()}catch(e){}})
let tickCount = 0
onMounted(async ()=>{
  // 先拉一次数据，再初始化图表
  await fetchData()
  initCharts()
  window.addEventListener('resize',onResize)
  // 每秒更新时间显示；每60秒拉取一次API
  timeTimer = setInterval(()=>{
    const d = new Date()
    currentTime.value = formatTime(d)
    currentDate.value = formatDate(d)
    const h = d.getHours() + d.getMinutes() / 60
    if(Math.abs(h - currentHour.value) >= 1/60) currentHour.value = h
    tickCount++
    if(tickCount % 60 === 0) fetchData()
  }, 1000)
})
onUnmounted(()=>{
  killAll()
  window.removeEventListener('resize',onResize)
  if(timeTimer) clearInterval(timeTimer)
})

const cellStyle=(r,c)=>({
  background:`linear-gradient(135deg,rgba(0,${50+r*4},${100+c*4},0.65),rgba(0,${30+r*3},${70+c*3},0.45))`,
  border:'1px solid rgba(0,150,255,0.12)'
})
const imgBgs=['linear-gradient(135deg,rgba(0,30,5,.92),rgba(0,70,15,.75))','linear-gradient(135deg,rgba(55,0,5,.92),rgba(130,10,20,.7))','linear-gradient(135deg,rgba(0,5,35,.92),rgba(0,25,90,.75))','linear-gradient(135deg,rgba(0,25,5,.9),rgba(0,55,12,.65))','linear-gradient(135deg,rgba(48,0,5,.92),rgba(110,5,15,.65))','linear-gradient(135deg,rgba(0,5,30,.9),rgba(0,18,70,.65))']
const imgBg=(n)=>({background:imgBgs[(n-1)%6]})
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg0:#020c1e;
  --panel-bg:rgba(2,14,36,.86);
  /* 恢复最开始的边框色 */
  /* 边框增强：仍保持最开始风格，只提高可见度 */
  --panel-border:rgba(0,200,255,.55);
  --text:rgba(210,235,255,.92);
  --muted:rgba(170,215,255,.62);
  --accent:#00d4ff;
  --radius:14px;
  --shadow:0 12px 36px rgba(0,0,0,.48), 0 0 24px rgba(0,212,255,.10);
  --inner:inset 0 1px 0 rgba(255,255,255,.05), inset 0 -1px 0 rgba(0,0,0,.35);
}

.dashboard{
  width:100vw;height:100vh;display:flex;flex-direction:column;
  background:var(--bg0);
  background-image:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,80,180,.18) 0%,transparent 100%),radial-gradient(ellipse 40% 60% at 0% 60%,rgba(0,40,120,.10) 0%,transparent 100%),radial-gradient(ellipse 40% 60% at 100% 60%,rgba(0,40,120,.10) 0%,transparent 100%);
  overflow:hidden;
  font-family:'Microsoft YaHei UI','Microsoft YaHei','Segoe UI',sans-serif;
  color:var(--text);
}

/* 整体淡入 & 轻微缩放，避免“突然出现” */
.dashboard{
  animation:dash-fade-in .7s ease-out both;
}
@keyframes dash-fade-in{
  from{opacity:0;transform:scale(1.01);}
  to{opacity:1;transform:scale(1);}
}

/* Header */
.header{flex-shrink:0;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:linear-gradient(180deg,rgba(0,50,110,.52),rgba(0,20,50,.26));position:relative;backdrop-filter: blur(2px);}
.header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,200,255,.15) 10%,rgba(0,220,255,.9) 30%,#00d4ff 50%,rgba(0,220,255,.9) 70%,rgba(0,200,255,.15) 90%,transparent 100%);box-shadow:0 0 8px rgba(0,212,255,.4);}
.hd-side{width:220px;display:flex;align-items:center;gap:8px}
.hd-side-r{justify-content:flex-end}
.hd-date{font-size:12px;color:var(--muted);letter-spacing:1px}
.hd-time{font-size:14px;font-weight:700;color:var(--accent);font-family:monospace;letter-spacing:1px;text-shadow:0 0 10px rgba(0,212,255,.45)}
.hd-center{flex:1;display:flex;justify-content:center}
.hd-title-wrap{display:flex;align-items:center;gap:12px}
.hd-deco{width:50px;height:14px;position:relative;flex-shrink:0}
.hd-deco::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,.9))}
.hd-deco::after{content:'';position:absolute;top:28%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,.4))}
.hd-deco-r::before{background:linear-gradient(90deg,rgba(0,212,255,.9),transparent)}
.hd-deco-r::after{background:linear-gradient(90deg,rgba(0,212,255,.4),transparent)}
.hd-title{font-size:20px;font-weight:700;white-space:nowrap;letter-spacing:1.5px;color:#fff;text-shadow:0 0 14px rgba(0,200,255,.75),0 0 34px rgba(0,160,255,.35)}
.hd-welcome{font-size:12px;color:rgba(0,200,255,.7)}
.hd-welcome em{color:#00d4ff;font-style:normal}
.hd-user-icon{width:22px;height:22px;border:1px solid rgba(0,180,255,.35);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(0,200,255,.8)}
.hd-gear{font-size:16px;color:rgba(0,200,255,.7);animation:spin 12s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}

/* Body - 4行让左右8格严格等高对齐 */
.body{flex:1;min-height:0;display:grid;grid-template-columns:25fr 46fr 27fr;grid-template-rows:1fr 1fr 1fr 1fr;column-gap:12px;row-gap:10px;padding:8px 12px 10px;overflow:hidden;align-items:stretch;}

/* 面板 */
.big-panel{
  background:var(--panel-bg);
  border:2px solid var(--panel-border);
  border-radius:var(--radius);
  position:relative;
  overflow:hidden;
  /* 最开始风格 + 轻微外描边，让边框更清楚 */
  /* 更明显的边框分离：外阴影 + 青色描边光 + 外描边 */
  box-shadow:
    0 14px 40px rgba(0,0,0,.55),
    0 0 18px rgba(0,150,255,.22),
    0 0 0 1px rgba(0,0,0,.30);
  backdrop-filter: blur(2px);
  /* 统一在基础态声明过渡，避免 hover 时边框抖动 */
  transition:transform .18s ease-out,box-shadow .18s ease-out,border-color .18s ease-out;
  /* 进场动效：轻微上移 + 渐显 */
  opacity:0;
  transform:translateY(8px);
  animation:panel-in .55s ease-out forwards;
}
.big-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,200,255,.55),transparent);z-index:1;pointer-events:none;}
.big-panel::after{content:'';position:absolute;top:0;left:0;width:8px;height:8px;border-top:1px solid rgba(0,212,255,.85);border-left:1px solid rgba(0,212,255,.85);z-index:1;pointer-events:none;}
.chart-box{flex:1;min-height:0;width:100%}

/* 面板进场关键帧 */
@keyframes panel-in{
  0%{opacity:0;transform:translateY(8px) scale(.995);}
  60%{opacity:1;transform:translateY(0) scale(1);}
  100%{opacity:1;transform:translateY(0) scale(1);}
}

/* 不同区域做一点点时间错位，让页面看起来有“铺开”的感觉 */
.col-left .big-panel{animation-delay:.05s;}
.col-mid .scene-panel{animation-delay:.12s;}
.col-mid .mb-cell.big-panel{animation-delay:.18s;}
.col-right .big-panel{animation-delay:.24s;}

/* 悬浮时的质感反馈：轻微抬起 + 光晕加强 */
.big-panel:hover{
  /* 稍微减小位移/缩放，避免边框被相邻面板视觉“吃掉” */
  transform:translateY(-2px) scale(1.005);
  /* 外阴影 + 外描边 + 内描边，保证边界清晰，同时模拟“边框变宽” */
  box-shadow:
    0 18px 42px rgba(0,0,0,.65),
    0 0 26px rgba(0,160,255,.45),
    0 0 0 1px rgba(0,220,255,.75),
    inset 0 0 0 2px rgba(0,230,255,.9);
  border-color:rgba(0,220,255,.75);
}



/* 左列 - subgrid 与 body 4 行绑定，8格严格等高 */
.col-left{display:grid;grid-template-rows:subgrid;grid-row:1/-1;gap:20px;min-height:0;overflow:hidden}
.col-left>*{min-height:0;overflow:hidden}
/* Tab2：左3项(设备+2图)右3图，各占1行等高，底部对齐 */
.device-panel{padding:8px;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.dv-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;min-height:0;align-content:stretch}
.dv-card{background:rgba(0,80,160,.10);border:1px solid rgba(0,160,255,.16);border-radius:8px;padding:9px 10px;display:flex;align-items:center;gap:10px}
.chart-panel{display:flex;flex-direction:column;padding:6px 10px 8px;min-height:0;overflow:hidden}

.sec-title{font-size:12px;font-weight:650;color:rgba(0,212,255,.85);letter-spacing:1.4px;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.sec-bar{display:inline-block;width:2px;height:12px;background:#00d4ff;box-shadow:0 0 6px #00d4ff}
.dv-icon{width:30px;height:30px;flex-shrink:0;border:1px solid rgba(0,160,255,.3);border-radius:4px;display:flex;align-items:center;justify-content:center;color:rgba(0,180,255,.65)}
.dv-icon svg{width:16px;height:16px}
.dv-icon.icon-green{border-color:rgba(0,255,120,.35);color:rgba(0,255,120,.8)}
.dv-label{font-size:10px;color:rgba(0,180,255,.52);line-height:1.3}
.dv-val{font-size:22px;font-weight:750;color:var(--accent);font-family:monospace;line-height:1.15}
.val-green{color:#00ff88}
.val-sm{font-size:13px;font-weight:600;color:#00d4ff}

/* 图例 */
.leg-row,.cell-leg{display:flex;flex-wrap:wrap;gap:4px 10px;flex-shrink:0;margin-bottom:4px}
.ld{display:flex;align-items:center;gap:4px;font-size:10px;color:rgba(190,225,255,.7)}
.ld-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;box-shadow:0 0 10px rgba(0,212,255,.18)}

/* 中列 - subgrid，row1-2=3d+tab(更高)，row3-4=4图与左右底对齐 */
.col-mid{display:grid;grid-template-rows:subgrid;grid-row:1/-1;row-gap:20px;column-gap:10px;min-height:0;overflow:hidden}
.mid-top{grid-row:1/3;display:flex;flex-direction:column;gap:10px;min-height:0;overflow:hidden}
/* ===== 场景 SVG ===== */
.scene-panel{flex:1;min-height:0;overflow:hidden;background:transparent;border:none;padding:0}
.scene-panel::before,.scene-panel::after{display:none}
.scene-inner{width:100%;height:100%;position:relative;overflow:hidden}
.scene-svg{width:100%;height:100%;display:block;position:absolute;inset:0}

/* Tab */
.tab-row{flex-shrink:0;display:flex;gap:8px}
.tab-btn{flex:1;padding:8px 10px;cursor:pointer;background:rgba(0,25,55,.55);border:1px solid rgba(0,150,255,.18);border-radius:4px;font-size:12px;color:rgba(0,190,255,.62);display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;transition:all .25s}
.tab-btn:hover{border-color:rgba(0,200,255,.5);color:rgba(0,220,255,.9);transform:translateY(-1px);}
.tab-btn.active{background:rgba(0,100,220,.22);border-color:rgba(0,212,255,.75);color:var(--accent);box-shadow:0 0 16px rgba(0,212,255,.18);transform:translateY(-1px);}
.tab-tri{font-size:8px;opacity:.5}
.tab-btn.active .tab-tri{opacity:1}

/* 中下图表区 - 占 row3-4，与左右底两行对齐 */
.mid-bottom-grid{grid-row:3/-1;min-height:0}
.grid-2x2{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px;width:100%;height:100%}
.grid-full{display:grid;grid-template-rows:1fr;width:100%;height:100%}
.grid-2col{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;height:100%}
.grid-imgs{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:auto 1fr 1fr;gap:10px;width:100%;height:100%}
.wh-switch{grid-column:1/-1;display:flex;gap:6px;align-items:center;justify-content:flex-end;margin:-2px 0 -4px}
.wh-btn{padding:3px 10px;font-size:12px;line-height:1;border:1px solid rgba(0,150,255,.20);background:rgba(0,25,55,.45);color:rgba(0,200,255,.72);border-radius:4px;cursor:pointer;transition:all .2s}
.wh-btn:hover{border-color:rgba(0,212,255,.6);color:#00d4ff}
.wh-btn.active{background:rgba(0,100,220,.25);border-color:#00d4ff;color:#00d4ff;box-shadow:0 0 10px rgba(0,212,255,.2)}
.mb-cell{display:flex;flex-direction:column;padding:5px 8px 6px;min-height:0;overflow:hidden}
.cell-title{font-size:12px;font-weight:650;color:var(--accent);letter-spacing:.8px;flex-shrink:0;display:flex;align-items:center;gap:6px;margin-bottom:4px}
.cell-title::before{content:'◆';font-size:7px;color:#00d4ff;animation:blink 2.5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}

/* CO2/H2O - 中间底部两个卡片 + 下方动画图标 */
.co2-cell{display:flex;flex-direction:column;position:relative}
.co2-chart{flex:0 0 65%;min-height:0}
.co2-footer{flex:1;display:flex;align-items:center;justify-content:center;min-height:0}
.mol-scene{width:90px;height:60px;position:relative;display:flex;align-items:center;justify-content:center;animation:molFloat 3.5s ease-in-out infinite}
.mol-svg{width:80px;height:60px;filter:drop-shadow(0 0 6px rgba(0,210,255,.7));position:relative;z-index:1}
/* 声波/水波弧线 */
.mol-wave{position:absolute;bottom:4px;left:50%;transform:translateX(-50%);border-radius:50%;border:1px solid rgba(0,210,255,.4);animation:waveOut 2s ease-out infinite}
.mol-wave1{width:50px;height:14px;animation-delay:0s}
.mol-wave2{width:70px;height:18px;animation-delay:.5s;border-color:rgba(0,210,255,.25)}
.mol-scene-co2 .mol-wave{border-color:rgba(0,210,255,.45)}
.mol-scene-h2o .mol-wave{border-color:rgba(80,180,255,.45)}
.mol-scene-h2o .mol-wave2{border-color:rgba(80,180,255,.25)}
@keyframes molFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes waveOut{0%{opacity:.8;transform:translateX(-50%) scaleX(1)}100%{opacity:0;transform:translateX(-50%) scaleX(1.6)}}

/* Tab4 图片 */
.img-cell{position:relative;overflow:hidden;min-height:0;background:rgba(0,10,25,.9)}
.img-scan{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(0,200,100,.5),transparent);animation:imgscan 3s linear infinite;z-index:2}
@keyframes imgscan{from{top:0}to{top:100%}}
.img-svg{position:absolute;inset:0;width:100%;height:100%;object-fit:fill}
.img-real{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.img-label{position:absolute;bottom:0;left:0;right:0;padding:3px 5px;font-size:9px;color:rgba(0,220,255,.7);background:rgba(0,5,15,.7);z-index:3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.img-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:rgba(0,180,255,.4)}

/* 右列 - subgrid 与 body 4 行绑定 */
.col-right{display:grid;grid-template-rows:subgrid;grid-row:1/-1;gap:20px;min-height:0;overflow:hidden}
.col-right>*{min-height:0;overflow:hidden}
.rc-cell{display:flex;flex-direction:column;padding:5px 8px 6px;min-height:0;overflow:hidden}

/* Tab2：左右各3个，用3行平分高度，每格1/3 */
.col-left.tab2,.col-right.tab2{grid-template-rows:1fr 1fr 1fr}
.col-left.left3{grid-template-rows:1fr 1fr 1fr}


</style>
