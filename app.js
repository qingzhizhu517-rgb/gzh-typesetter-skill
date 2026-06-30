// ==========================================================================
// 微信公众号一键排版 - 交互与解析引擎 (app.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素引用
  const rawInput = document.getElementById('raw-input');
  const previewFrame = document.getElementById('preview-frame');
  const htmlOutputCode = document.getElementById('html-output-code');
  const copyBtn = document.getElementById('copy-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const resetBtn = document.getElementById('reset-btn');
  const toast = document.getElementById('toast');

  // 控制参数
  const fontSizeSlider = document.getElementById('font-size-slider');
  const lineHeightSlider = document.getElementById('line-height-slider');
  const letterSpacingSlider = document.getElementById('letter-spacing-slider');
  const marginSlider = document.getElementById('margin-slider');
  const borderRadiusSlider = document.getElementById('border-radius-slider');
  const indentCheckbox = document.getElementById('indent-checkbox');

  // 数值显示
  const fontSizeVal = document.getElementById('font-size-val');
  const lineHeightVal = document.getElementById('line-height-val');
  const letterSpacingVal = document.getElementById('letter-spacing-val');
  const marginVal = document.getElementById('margin-val');
  const borderRadiusVal = document.getElementById('border-radius-val');

  // 颜色选择器
  const colorTitle = document.getElementById('color-title');
  const colorText = document.getElementById('color-text');
  const colorAccent = document.getElementById('color-accent');

  // 预设主题按钮
  const presetButtons = document.querySelectorAll('.theme-preset-btn');
  
  // Tab 切换按钮
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // 📦 默认配置与主题映射
  const DEFAULT_CONFIG = {
    fontSize: 15,
    lineHeight: 1.75,
    letterSpacing: 0.5,
    margin: 16,
    borderRadius: 8,
    indent: false,
    colorTitle: '#2c3e50',
    colorText: '#3f3f3f',
    colorAccent: '#1e88e5'
  };

  const THEME_PRESETS = {
    default: {
      colorTitle: '#2c3e50',
      colorText: '#3f3f3f',
      colorAccent: '#1e88e5'
    },
    warm: {
      colorTitle: '#7b1fa2',
      colorText: '#37474f',
      colorAccent: '#ff6b6b'
    },
    forest: {
      colorTitle: '#1b5e20',
      colorText: '#263238',
      colorAccent: '#2ecc71'
    },
    gold: {
      colorTitle: '#4e342e',
      colorText: '#3e2723',
      colorAccent: '#d4ac0d'
    }
  };

  // 1. 初始化本地配置或默认配置
  let currentConfig = { ...DEFAULT_CONFIG };

  // 2. 简易 Markdown / 纯文本解析引擎
  function parseTextToWeChatHTML(text) {
    if (!text.trim()) {
      return `<section style="padding: 0 16px; text-align: center; color: var(--text-muted); padding-top: 40px;">
                <p style="font-size: 14px; margin: 0;">您的实时排版预览将在此处显示</p>
              </section>`;
    }

    const lines = text.split('\n');
    let html = '';
    let inList = false;
    let isOrdered = false;

    // 解析偏好缓存 (方便编写内联 style)
    const pSize = `${currentConfig.fontSize}px`;
    const pColor = currentConfig.colorText;
    const lHeight = currentConfig.lineHeight;
    const lSpacing = `${currentConfig.letterSpacing}px`;
    const paddingX = `${currentConfig.margin}px`;
    const radius = `${currentConfig.borderRadius}px`;
    const indent = currentConfig.indent ? 'text-indent: 2em;' : '';
    const titleColor = currentConfig.colorTitle;
    const accentColor = currentConfig.colorAccent;

    // 辅助函数：处理粗体及链接等内联样式
    function formatInlineElements(str) {
      // 1. 转义基础 HTML 实体，避免注入恶意代码，但微信规范中我们需要保留标签所以仅转义尖括号外的内容（由于在此是排版用，直接替换 ** 即可）
      let clean = str;
      
      // 2. 解析粗体 **bold**
      clean = clean.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`);
      
      // 3. 解析超链接 [text](url) -> 微信公众号只支持符合其内部规则的链接，此处转换为符合格式的 <a>
      clean = clean.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color: ${accentColor}; text-decoration: underline;">$1</a>`);
      
      return clean;
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // 跳过空行，如果是列表，闭合列表
      if (!line) {
        if (inList) {
          html += isOrdered ? '</ol>' : '</ul>';
          inList = false;
        }
        continue;
      }

      // 1. 解析 Markdown 主标题 # Main Title
      if (line.startsWith('# ')) {
        const titleText = formatInlineElements(line.substring(2));
        html += `<section style="margin: 0 0 24px 0; padding: 0 ${paddingX}; text-align: center;">
                  <p style="font-size: 22px; font-weight: bold; color: ${titleColor}; line-height: 1.4; letter-spacing: 1px; margin: 0;">${titleText}</p>
                </section>`;
        continue;
      }

      // 2. 解析二级标题 ## Subtitle
      if (line.startsWith('## ')) {
        const subTitleText = formatInlineElements(line.substring(3));
        html += `<section style="margin: 32px 0 16px 0; padding: 0 ${paddingX}; border-left: 4px solid ${accentColor}; padding-left: 12px;">
                  <p style="font-size: 18px; font-weight: bold; color: ${titleColor}; line-height: 1.5; margin: 0;">${subTitleText}</p>
                </section>`;
        continue;
      }

      // 3. 解析三级小标题 ### Small Title
      if (line.startsWith('### ')) {
        const smallTitleText = formatInlineElements(line.substring(4));
        html += `<section style="margin: 24px 0 12px 0; padding: 0 ${paddingX};">
                  <p style="font-size: 16px; font-weight: bold; color: ${accentColor}; line-height: 1.5; margin: 0;">${smallTitleText}</p>
                </section>`;
        continue;
      }

      // 4. 解析引用块 > Quote
      if (line.startsWith('> ')) {
        const quoteContent = formatInlineElements(line.substring(2));
        html += `<section style="margin: 16px ${paddingX}; padding: 14px 18px; background-color: #f7f9fc; border-left: 3px solid ${accentColor}; border-radius: 4px;">
                  <p style="font-size: 14px; color: #555555; line-height: 1.6; letter-spacing: 0.5px; margin: 0;">${quoteContent}</p>
                </section>`;
        continue;
      }

      // 5. 解析图片 ![alt](url)
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const altText = imgMatch[1];
        const imgUrl = imgMatch[2];
        html += `<section style="margin: 24px ${paddingX}; text-align: center;">
                  <img src="${imgUrl}" alt="${altText}" style="max-width: 100%; border-radius: ${radius}; box-shadow: 0 4px 12px rgba(0,0,0,0.08); vertical-align: middle;">
                </section>`;
        continue;
      }

      // 6. 解析分割线 ---
      if (line === '---' || line === '***') {
        html += `<section style="margin: 32px ${paddingX}; border-top: 1px dashed ${accentColor}; opacity: 0.4;"></section>`;
        continue;
      }

      // 7. 解析列表项目 (无序列表 - or * , 有序列表 1.)
      const isUnorderedItem = line.startsWith('- ') || line.startsWith('* ');
      const isOrderedItem = /^\d+\.\s/.test(line);

      if (isUnorderedItem || isOrderedItem) {
        if (!inList) {
          inList = true;
          isOrdered = isOrderedItem;
          html += isOrdered 
            ? `<ol style="margin: 16px ${paddingX}; padding-left: 20px; color: ${pColor}; font-size: ${pSize}; line-height: ${lHeight};">` 
            : `<ul style="margin: 16px ${paddingX}; padding-left: 20px; color: ${pColor}; font-size: ${pSize}; line-height: ${lHeight};">`;
        }

        const itemContent = formatInlineElements(isOrderedItem ? line.replace(/^\d+\.\s/, '') : line.substring(2));
        html += `<li style="margin-bottom: 8px; letter-spacing: ${lSpacing};">${itemContent}</li>`;
        continue;
      }

      // 8. 普通正文段落
      const paragraphText = formatInlineElements(line);
      html += `<section style="margin: 0 0 16px 0; padding: 0 ${paddingX};">
                <p style="font-size: ${pSize}; color: ${pColor}; line-height: ${lHeight}; letter-spacing: ${lSpacing}; text-align: justify; ${indent} margin: 0;">${paragraphText}</p>
              </section>`;
    }

    // 闭合可能存在的未完成列表
    if (inList) {
      html += isOrdered ? '</ol>' : '</ul>';
    }

    return html;
  }

  // 3. 渲染页面和更新代码
  function render() {
    const rawText = rawInput.value;
    const finalHTML = parseTextToWeChatHTML(rawText);
    
    // 注入预览模拟器中
    previewFrame.innerHTML = finalHTML;
    
    // 格式化输出源码
    htmlOutputCode.textContent = finalHTML;
  }

  // 4. 读取表单状态并同步
  function updateConfigFromUI() {
    currentConfig.fontSize = parseInt(fontSizeSlider.value);
    currentConfig.lineHeight = parseFloat(lineHeightSlider.value);
    currentConfig.letterSpacing = parseFloat(letterSpacingSlider.value);
    currentConfig.margin = parseInt(marginSlider.value);
    currentConfig.borderRadius = parseInt(borderRadiusSlider.value);
    currentConfig.indent = indentCheckbox.checked;
    
    currentConfig.colorTitle = colorTitle.value;
    currentConfig.colorText = colorText.value;
    currentConfig.colorAccent = colorAccent.value;

    // 同步文字显示
    fontSizeVal.textContent = `${currentConfig.fontSize}px`;
    lineHeightVal.textContent = currentConfig.lineHeight;
    letterSpacingVal.textContent = `${currentConfig.letterSpacing}px`;
    marginVal.textContent = `${currentConfig.margin}px`;
    borderRadiusVal.textContent = `${currentConfig.borderRadius}px`;

    // 更新 Hex 标签
    colorTitle.nextElementSibling.textContent = currentConfig.colorTitle;
    colorText.nextElementSibling.textContent = currentConfig.colorText;
    colorAccent.nextElementSibling.textContent = currentConfig.colorAccent;

    // 清除预设的高亮状态 (如果颜色被微调)
    checkIfMatchesPreset();

    // 触发渲染
    render();
  }

  // 5. 将配置应用到 UI
  function applyConfigToUI(config) {
    fontSizeSlider.value = config.fontSize;
    lineHeightSlider.value = config.lineHeight;
    letterSpacingSlider.value = config.letterSpacing;
    marginSlider.value = config.margin;
    borderRadiusSlider.value = config.borderRadius;
    indentCheckbox.checked = config.indent;

    colorTitle.value = config.colorTitle;
    colorText.value = config.colorText;
    colorAccent.value = config.colorAccent;

    // 手动刷新文本及参数
    updateConfigFromUI();
  }

  // 检查是否完美匹配某个主题预设，给按钮添加 active 样式
  function checkIfMatchesPreset() {
    let matchedPreset = null;
    for (const [name, preset] of Object.entries(THEME_PRESETS)) {
      if (preset.colorTitle.toLowerCase() === colorTitle.value.toLowerCase() &&
          preset.colorText.toLowerCase() === colorText.value.toLowerCase() &&
          preset.colorAccent.toLowerCase() === colorAccent.value.toLowerCase()) {
        matchedPreset = name;
        break;
      }
    }

    presetButtons.forEach(btn => {
      if (btn.dataset.theme === matchedPreset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 6. UI 事件绑定

  // 滑块与输入事件
  [fontSizeSlider, lineHeightSlider, letterSpacingSlider, marginSlider, borderRadiusSlider, indentCheckbox].forEach(el => {
    el.addEventListener('input', updateConfigFromUI);
    el.addEventListener('change', updateConfigFromUI);
  });

  [colorTitle, colorText, colorAccent].forEach(el => {
    el.addEventListener('input', updateConfigFromUI);
  });

  // 输入区域发生变化时重新渲染
  rawInput.addEventListener('input', render);

  // 切换快捷预设主题
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetName = btn.dataset.theme;
      const preset = THEME_PRESETS[presetName];
      if (preset) {
        colorTitle.value = preset.colorTitle;
        colorText.value = preset.colorText;
        colorAccent.value = preset.colorAccent;
        updateConfigFromUI();
      }
    });
  });

  // 重置按钮
  resetBtn.addEventListener('click', () => {
    currentConfig = { ...DEFAULT_CONFIG };
    applyConfigToUI(currentConfig);
  });

  // Tab 切换逻辑
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = `tab-${btn.dataset.tab}`;
      document.getElementById(tabId).classList.add('active');
    });
  });

  // 复制 HTML 功能
  copyBtn.addEventListener('click', () => {
    const htmlCode = parseTextToWeChatHTML(rawInput.value);
    
    navigator.clipboard.writeText(htmlCode)
      .then(() => {
        // 显示 Toast 提示
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      })
      .catch(err => {
        console.error('无法复制代码: ', err);
        alert('复制失败，请手动在【公众号 HTML 源码】标签页中全选复制代码。');
      });
  });

  // 🌗 暗黑模式切换
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    } else {
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    }
  }

  // 📝 载入示例文章，供初始展示
  const sampleArticle = `# 关于人工智能时代的思考
## AI 变革的浪潮
在今天，我们正在经历一场前所未有的人工智能（AI）革命。从自然语言处理到图像自动生成，AI 已经深入到了各行各业，扮演着赋能者和加速器的角色。

作为一名内容创作者，如何利用好这股浪潮？我们需要在规范的排版中注入思考，同时保持**阅读体验的自然与美观**。

> "AI 不会淘汰人类，但使用 AI 的人会淘汰不使用的人。" 

## 排版的黄金法则
为了让读者能够在移动端拥有卓越的沉浸式体验，以下是我们所倡导的几条**排版黄金法则**：

- **合理的间距**：行距保持在 1.75 左右最为舒适，不拥挤也容易跳行。
- **适度的色彩**：控制页面内的颜色数量不超过 3 种，首尾呼应，能够极大提升文章的高级感。
- **图片的和谐**：图片最好带上浅浅的圆角以及极其微弱的阴影，这能够使其更容易融入背景。

![](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe)

最后，排版只是一种辅助手段，最核心的依然是内容本身的质量和您传递给读者的价值！`;

  rawInput.value = sampleArticle;
  
  // 运行渲染
  applyConfigToUI(DEFAULT_CONFIG);
});
