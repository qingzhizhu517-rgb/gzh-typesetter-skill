// ==========================================================================
// 微信公众号一键排版 - 交互与解析引擎 (app.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM 元素引用
  const rawInput = document.getElementById('raw-input');
  const previewFrame = document.getElementById('preview-frame');
  const htmlOutputCode = document.getElementById('html-output-code');
  const copyBtn = document.getElementById('copy-btn');
  const copyRichBtn = document.getElementById('copy-rich-btn');
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
  
  // 右侧 Tab 切换按钮
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // 左侧 Tab 切换按钮
  const leftTabButtons = document.querySelectorAll('.left-tab-btn');
  const leftTabContents = document.querySelectorAll('.left-tab-content');

  // AI 优化与导入按钮
  const toggleApiSettings = document.getElementById('toggle-api-settings');
  const apiSettingsPanel = document.getElementById('api-settings-panel');
  const apiEndpointInput = document.getElementById('api-endpoint');
  const apiModelInput = document.getElementById('api-model');
  const apiKeyInput = document.getElementById('api-key');
  
  const aiStyleSelect = document.getElementById('ai-style');
  const imgKeywordsInput = document.getElementById('img-keywords');
  const aiOptimizeBtn = document.getElementById('ai-optimize-btn');
  const importLocalBtn = document.getElementById('import-local-btn');
  const aiLoading = document.getElementById('ai-loading');
  const aiLoadingText = document.getElementById('ai-loading-text');

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

  // 高清配图图库
  const IMAGE_DATABASE = {
    tech: [
      { id: '1526374965328', desc: '科技数字矩阵', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800' },
      { id: '1518770660435', desc: '人工智能芯片', url: 'https://images.unsplash.com/photo-1518770660435-82b568601dd6?w=800' },
      { id: '1488590528507', desc: '程序员写代码', url: 'https://images.unsplash.com/photo-1488590528507-98394e3cc809?w=800' }
    ],
    office: [
      { id: '1497369694757', desc: '极简办公室', url: 'https://images.unsplash.com/photo-1497369694757-ea566c30f161?w=800' },
      { id: '1497215865007', desc: '舒适工作台', url: 'https://images.unsplash.com/photo-1497215865007-010df1593ae2?w=800' },
      { id: '1515372030562', desc: '工作规划本', url: 'https://images.unsplash.com/photo-1515372030562-46522c03c4f2?w=800' }
    ],
    nature: [
      { id: '1470071459600', desc: '壮丽自然山峦', url: 'https://images.unsplash.com/photo-1470071459600-a15e1001c8e9?w=800' },
      { id: '1447752875113', desc: '阳光穿透森林', url: 'https://images.unsplash.com/photo-1447752875113-148859052850?w=800' },
      { id: '1507525428034', desc: '日落海滩远眺', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }
    ],
    design: [
      { id: '1618005182384', desc: '抽象流体艺术', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' },
      { id: '1550684848', desc: '3D 几何线条', url: 'https://images.unsplash.com/photo-1550684848-fac3cf8c48d4?w=800' },
      { id: '1513542789411', desc: '极简创意草图', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800' }
    ]
  };

  // 1. 初始化配置与 API
  let currentConfig = { ...DEFAULT_CONFIG };

  // 加载本地存储的 API 配置
  apiEndpointInput.value = localStorage.getItem('gzh_api_endpoint') || 'https://api.deepseek.com/v1';
  apiModelInput.value = localStorage.getItem('gzh_api_model') || 'deepseek-chat';
  apiKeyInput.value = localStorage.getItem('gzh_api_key') || '';

  // API 折叠面板切换
  toggleApiSettings.addEventListener('click', () => {
    apiSettingsPanel.classList.toggle('hidden');
  });

  // 保存 API 配置
  [apiEndpointInput, apiModelInput, apiKeyInput].forEach(input => {
    input.addEventListener('change', () => {
      localStorage.setItem('gzh_api_endpoint', apiEndpointInput.value.trim());
      localStorage.setItem('gzh_api_model', apiModelInput.value.trim());
      localStorage.setItem('gzh_api_key', apiKeyInput.value.trim());
    });
  });

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

    const pSize = `${currentConfig.fontSize}px`;
    const pColor = currentConfig.colorText;
    const lHeight = currentConfig.lineHeight;
    const lSpacing = `${currentConfig.letterSpacing}px`;
    const paddingX = `${currentConfig.margin}px`;
    const radius = `${currentConfig.borderRadius}px`;
    const indent = currentConfig.indent ? 'text-indent: 2em;' : '';
    const titleColor = currentConfig.colorTitle;
    const accentColor = currentConfig.colorAccent;

    function formatInlineElements(str) {
      let clean = str;
      clean = clean.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`);
      clean = clean.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" style="color: ${accentColor}; text-decoration: underline;">$1</a>`);
      return clean;
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!line) {
        if (inList) {
          html += isOrdered ? '</ol>' : '</ul>';
          inList = false;
        }
        continue;
      }

      // 1. Markdown 主标题
      if (line.startsWith('# ')) {
        const titleText = formatInlineElements(line.substring(2));
        html += `<section style="margin: 0 0 24px 0; padding: 0 ${paddingX}; text-align: center;">
                  <p style="font-size: 22px; font-weight: bold; color: ${titleColor}; line-height: 1.4; letter-spacing: 1px; margin: 0;">${titleText}</p>
                </section>`;
        continue;
      }

      // 2. 二级标题
      if (line.startsWith('## ')) {
        const subTitleText = formatInlineElements(line.substring(3));
        html += `<section style="margin: 32px 0 16px 0; padding: 0 ${paddingX}; border-left: 4px solid ${accentColor}; padding-left: 12px;">
                  <p style="font-size: 18px; font-weight: bold; color: ${titleColor}; line-height: 1.5; margin: 0;">${subTitleText}</p>
                </section>`;
        continue;
      }

      // 3. 三级小标题
      if (line.startsWith('### ')) {
        const smallTitleText = formatInlineElements(line.substring(4));
        html += `<section style="margin: 24px 0 12px 0; padding: 0 ${paddingX};">
                  <p style="font-size: 16px; font-weight: bold; color: ${accentColor}; line-height: 1.5; margin: 0;">${smallTitleText}</p>
                </section>`;
        continue;
      }

      // 4. 引用块
      if (line.startsWith('> ')) {
        const quoteContent = formatInlineElements(line.substring(2));
        html += `<section style="margin: 16px ${paddingX}; padding: 14px 18px; background-color: #f7f9fc; border-left: 3px solid ${accentColor}; border-radius: 4px;">
                  <p style="font-size: 14px; color: #555555; line-height: 1.6; letter-spacing: 0.5px; margin: 0;">${quoteContent}</p>
                </section>`;
        continue;
      }

      // 5. 解析图片
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const altText = imgMatch[1];
        const imgUrl = imgMatch[2];
        html += `<section style="margin: 24px ${paddingX}; text-align: center;">
                  <img src="${imgUrl}" alt="${altText}" style="max-width: 100%; border-radius: ${radius}; box-shadow: 0 4px 12px rgba(0,0,0,0.08); vertical-align: middle;">
                </section>`;
        continue;
      }

      // 6. 分割线
      if (line === '---' || line === '***') {
        html += `<section style="margin: 32px ${paddingX}; border-top: 1px dashed ${accentColor}; opacity: 0.4;"></section>`;
        continue;
      }

      // 7. 列表项目
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

      // 8. 普通段落
      const paragraphText = formatInlineElements(line);
      html += `<section style="margin: 0 0 16px 0; padding: 0 ${paddingX};">
                <p style="font-size: ${pSize}; color: ${pColor}; line-height: ${lHeight}; letter-spacing: ${lSpacing}; text-align: justify; ${indent} margin: 0;">${paragraphText}</p>
              </section>`;
    }

    if (inList) {
      html += isOrdered ? '</ol>' : '</ul>';
    }

    return html;
  }

  // 3. 渲染预览
  function render() {
    const rawText = rawInput.value;
    const finalHTML = parseTextToWeChatHTML(rawText);
    previewFrame.innerHTML = finalHTML;
    htmlOutputCode.textContent = finalHTML;
  }

  // 4. UI 状态同步
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

    fontSizeVal.textContent = `${currentConfig.fontSize}px`;
    lineHeightVal.textContent = currentConfig.lineHeight;
    letterSpacingVal.textContent = `${currentConfig.letterSpacing}px`;
    marginVal.textContent = `${currentConfig.margin}px`;
    borderRadiusVal.textContent = `${currentConfig.borderRadius}px`;

    colorTitle.nextElementSibling.textContent = currentConfig.colorTitle;
    colorText.nextElementSibling.textContent = currentConfig.colorText;
    colorAccent.nextElementSibling.textContent = currentConfig.colorAccent;

    checkIfMatchesPreset();
    render();
  }

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

    updateConfigFromUI();
  }

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

  // 5. HTML 反向还原解析为 Markdown
  function convertHTMLToMarkdown(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let markdown = '';
    
    const topElements = doc.body.children;
    if (topElements.length === 0) return '';

    for (let el of topElements) {
      const tagName = el.tagName;

      if (tagName === 'SECTION') {
        const p = el.querySelector('p');
        const img = el.querySelector('img');
        const borderLeft = el.style.borderLeft || '';
        const borderTop = el.style.borderTop || '';
        const textAlign = p ? (p.style.textAlign || el.style.textAlign || '') : '';
        
        if (img) {
          markdown += `![${img.alt || '图片'}](${img.src})\n\n`;
        } else if (p) {
          let text = p.innerHTML;
          text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
          text = text.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
          
          const fontSize = p.style.fontSize || '';
          
          if (fontSize.includes('22px') || textAlign === 'center') {
            markdown += `# ${text}\n\n`;
          } else if (fontSize.includes('18px') || borderLeft.includes('4px') || el.style.borderLeft) {
            markdown += `## ${text}\n\n`;
          } else if (fontSize.includes('16px')) {
            markdown += `### ${text}\n\n`;
          } else if (borderLeft.includes('3px') || el.style.backgroundColor) {
            markdown += `> ${text}\n\n`;
          } else {
            markdown += `${text}\n\n`;
          }
        } else if (borderTop || el.style.borderTop) {
          markdown += `---\n\n`;
        }
      } else if (tagName === 'UL') {
        el.querySelectorAll('li').forEach(li => {
          let liText = li.innerHTML;
          liText = liText.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
          liText = liText.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
          markdown += `- ${liText}\n`;
        });
        markdown += `\n`;
      } else if (tagName === 'OL') {
        let count = 1;
        el.querySelectorAll('li').forEach(li => {
          let liText = li.innerHTML;
          liText = liText.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
          liText = liText.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
          markdown += `${count}. ${liText}\n`;
          count++;
        });
        markdown += `\n`;
      }
    }
    return markdown.trim();
  }

  // 载入本地生成的 output.html
  async function importLocalOutputHTML() {
    try {
      showToast('正在寻找本地 output.html...');
      const response = await fetch('output.html', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('未检测到本地已排版的 output.html 文件。请先在 AI 对话中运行 /gzh 排版生成文章。');
      }
      
      const htmlText = await response.text();
      if (!htmlText.trim()) {
        throw new Error('本地 output.html 内容为空。');
      }

      const markdown = convertHTMLToMarkdown(htmlText);
      if (markdown) {
        rawInput.value = markdown;
        render();
        // 自动切回到“文章编辑”标签页
        document.querySelector('.left-tab-btn[data-left-tab="content"]').click();
        showToast('📥 成功从本地 output.html 恢复排版与图片！');
      } else {
        previewFrame.innerHTML = htmlText;
        htmlOutputCode.textContent = htmlText;
        rawInput.value = '/* 无法反向解析为 Markdown，已直接载入 HTML 渲染效果。请在右侧直接预览或复制代码。 */';
        showToast('📥 已成功载入 HTML 源码预览！');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // 6. AI 一键优化与智能配图引擎
  async function runAIOptimization() {
    const text = rawInput.value.trim();
    if (!text) {
      alert('请先输入一些文章内容再进行 AI 优化！');
      return;
    }

    const endpoint = apiEndpointInput.value.trim();
    const model = apiModelInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    const style = aiStyleSelect.value;

    aiLoading.classList.remove('hidden');
    aiOptimizeBtn.disabled = true;
    aiOptimizeBtn.style.opacity = '0.7';

    let themeCategory = 'design';
    const lowText = text.toLowerCase();
    if (lowText.includes('科技') || lowText.includes('ai') || lowText.includes('人工智能') || lowText.includes('电脑') || lowText.includes('算法')) {
      themeCategory = 'tech';
    } else if (lowText.includes('工作') || lowText.includes('职场') || lowText.includes('效率') || lowText.includes('企业') || lowText.includes('团队')) {
      themeCategory = 'office';
    } else if (lowText.includes('自然') || lowText.includes('生活') || lowText.includes('旅行') || lowText.includes('思考') || lowText.includes('海') || lowText.includes('阳光')) {
      themeCategory = 'nature';
    }

    const pickedImages = IMAGE_DATABASE[themeCategory];

    if (apiKey) {
      aiLoadingText.textContent = `正在连接 AI 模型 ${model} 进行润色...`;

      const imgGuide = pickedImages.map(img => `- ${img.desc}: ![${img.desc}](${img.url})`).join('\n');
      
      const prompt = `您是一个顶尖的微信公众号排版与润色助理。请对以下文章进行重新润色与排版。
排版规则：
1. 请保持文章的核心意思和语句基本完整，但可以使用更生动、适合公众号阅读的表达。
2. 重新梳理层次：添加醒目的分级标题，并在标题前适当加上一两个匹配的 Emoji 图标。
3. 突出核心词汇：将重要的重点词汇包裹在 **加粗** 语法中。
4. 穿写图片：根据上下文，在合适且均衡的位置（如第一段之后，以及文章中后部）合理插入 1-2 张高清图片。
   你必须只能从以下候选图片中挑选（使用标准的 Markdown 语法 \`![图片描述](URL)\` 插入）：
${imgGuide}
5. 根据排版风格：[${style}] 对内容进行相应的微调。
   - tech: 分条明晰，多用 emoji 列表，行文干练
   - warm: 更加诗意、暖心，语气柔和
   - business: 结构规整，多用有序数字列表，表达严谨
   - minimalist: 简洁大方，段落分明，留白舒适

待优化的文章内容：
---
${text}
---

请直接输出优化后的 Markdown 正文，不要包含任何前言、后记或 Markdown 外包裹符号。`;

      try {
        const response = await fetch(`${endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: '你是一个专业的微信公众号内容优化器，直接返回排版好的 Markdown 文本，绝不废话。' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        let resultMarkdown = data.choices[0].message.content.trim();
        
        resultMarkdown = resultMarkdown.replace(/^```markdown\n/i, '').replace(/\n```$/, '').replace(/^```\n/i, '');

        rawInput.value = resultMarkdown;
        // 自动切回到“文章编辑”标签页
        document.querySelector('.left-tab-btn[data-left-tab="content"]').click();
        showToast('✨ AI 智能润色及配图已完成！');
      } catch (err) {
        console.error('AI API 请求失败: ', err);
        alert(`AI 接口请求失败 (${err.message})，即将降级为本地规则引擎进行优化配图。`);
        runLocalOptimization(text, style, pickedImages);
      }
    } else {
      runLocalOptimization(text, style, pickedImages);
    }

    aiLoading.classList.add('hidden');
    aiOptimizeBtn.disabled = false;
    aiOptimizeBtn.style.opacity = '1';
  }

  function runLocalOptimization(text, style, pickedImages) {
    aiLoadingText.textContent = "分析文章主体结构...";
    
    setTimeout(() => {
      aiLoadingText.textContent = "寻找并匹配高清图片...";
      
      setTimeout(() => {
        aiLoadingText.textContent = "美化字间距与标题图标...";
        
        const lines = text.split('\n');
        let newLines = [];
        let headingCount = 0;
        
        const titleEmojis = ['💡', '🚀', '🔥', '🎨', '🌟', '💎', '📌', '🎯'];

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (!line) {
            newLines.push('');
            continue;
          }

          if (line.startsWith('# ')) {
            const headingText = line.substring(2);
            newLines.push(`# 🌟 ${headingText} 🌟`);
            
            if (pickedImages.length > 0) {
              newLines.push('');
              newLines.push(`![${pickedImages[0].desc}](${pickedImages[0].url})`);
            }
            continue;
          }

          if (line.startsWith('## ')) {
            const headingText = line.substring(3);
            const emoji = titleEmojis[headingCount % titleEmojis.length];
            newLines.push(`## ${emoji} ${headingText}`);
            headingCount++;
            continue;
          }

          const keywords = ['排版', '阅读体验', '微信公众号', '人工智能', '设计', '核心', '价值', '内容', '沉浸式'];
          keywords.forEach(word => {
            const regex = new RegExp(`(?<!\\*\\*)${word}(?!\\*\\*)`, 'g');
            line = line.replace(regex, `**${word}**`);
          });

          newLines.push(line);

          if (i === Math.floor(lines.length * 0.6) && pickedImages.length > 1) {
            newLines.push('');
            newLines.push(`![${pickedImages[1].desc}](${pickedImages[1].url})`);
          }
        }

        rawInput.value = newLines.join('\n');
        
        if (style === 'tech') {
          applyConfigToUI({ ...DEFAULT_CONFIG, ...THEME_PRESETS.default });
        } else if (style === 'warm') {
          applyConfigToUI({ ...DEFAULT_CONFIG, ...THEME_PRESETS.warm });
        } else if (style === 'business') {
          applyConfigToUI({ ...DEFAULT_CONFIG, ...THEME_PRESETS.forest });
        } else if (style === 'minimalist') {
          applyConfigToUI({ ...DEFAULT_CONFIG, ...THEME_PRESETS.gold });
        }

        // 自动切回到“文章编辑”标签页
        document.querySelector('.left-tab-btn[data-left-tab="content"]').click();
        showToast('✨ 已完成本地规则优化与智能配图！');
      }, 800);
    }, 800);
  }

  // 7. UI 事件绑定

  // 左侧 Tab 切换
  leftTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      leftTabButtons.forEach(b => b.classList.remove('active'));
      leftTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = `left-tab-${btn.dataset.leftTab}`;
      document.getElementById(tabId).classList.add('active');
    });
  });

  // 右侧 Tab 切换
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = `tab-${btn.dataset.tab}`;
      document.getElementById(tabId).classList.add('active');
    });
  });

  [fontSizeSlider, lineHeightSlider, letterSpacingSlider, marginSlider, borderRadiusSlider, indentCheckbox].forEach(el => {
    el.addEventListener('input', updateConfigFromUI);
    el.addEventListener('change', updateConfigFromUI);
  });

  [colorTitle, colorText, colorAccent].forEach(el => {
    el.addEventListener('input', updateConfigFromUI);
  });

  rawInput.addEventListener('input', render);

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

  resetBtn.addEventListener('click', () => {
    currentConfig = { ...DEFAULT_CONFIG };
    applyConfigToUI(currentConfig);
  });

  // 💻 复制 HTML 源码
  copyBtn.addEventListener('click', () => {
    const htmlCode = parseTextToWeChatHTML(rawInput.value);
    
    navigator.clipboard.writeText(htmlCode)
      .then(() => {
        showToast('复制成功！已复制 HTML 源码');
      })
      .catch(err => {
        console.error('复制失败: ', err);
        alert('复制失败，请手动全选复制。');
      });
  });

  // 📋 一键复制富文本
  copyRichBtn.addEventListener('click', () => {
    const htmlCode = parseTextToWeChatHTML(rawInput.value);
    
    const blobHTML = new Blob([htmlCode], { type: 'text/html' });
    const blobText = new Blob([previewFrame.innerText], { type: 'text/plain' });
    
    const data = [new ClipboardItem({
      'text/html': blobHTML,
      'text/plain': blobText
    })];
    
    navigator.clipboard.write(data)
      .then(() => {
        showToast('📋 富文本复制成功！可以直接粘贴到公众号编辑器');
      })
      .catch(err => {
        console.error('富文本复制失败: ', err);
        try {
          const range = document.createRange();
          range.selectNode(previewFrame);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          window.getSelection().removeAllRanges();
          showToast('📋 富文本复制成功！(兼容模式)');
        } catch (fallbackErr) {
          alert('您的浏览器不支持直接复制富文本，请使用复制 HTML 源码页。');
        }
      });
  });

  // 🌗 暗黑模式
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

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // 绑定事件
  aiOptimizeBtn.addEventListener('click', runAIOptimization);
  importLocalBtn.addEventListener('click', importLocalOutputHTML);

  // 📝 初始示例内容
  const sampleArticle = `# 关于人工智能时代的思考
## AI 变革的浪潮
在今天，我们正在经历一场前所未有的人工智能革命。从自然语言处理到图像自动生成，AI 已经深入到了各行各业，扮演着赋能者和加速器的角色。

作为一名内容创作者，如何利用好这股浪潮？我们需要在规范的排版中注入思考，同时保持阅读体验的自然与美观。

> "AI 不会淘汰人类，但使用 AI 的人会淘汰不使用的人。" 

## 排版的黄金法则
为了让读者能够在移动端拥有卓越的沉浸式体验，以下是我们所倡导的几条排版黄金法则：

- 合理的间距：行距保持在 1.75 左右最为舒适，不拥挤也容易跳行。
- 适度的色彩：控制页面内的颜色数量不超过 3 种，首尾呼应，能够极大提升文章的高级感。
- 图片的和谐：图片最好带上浅浅的圆角以及极其微弱的阴影，这能够使其更容易融入背景。

最后，排版只是一种辅助手段，最核心的依然是内容本身的质量和您传递给读者的价值！`;

  rawInput.value = sampleArticle;
  applyConfigToUI(DEFAULT_CONFIG);
  
  // 自动尝试静默载入已排版的 output.html
  fetch('output.html', { cache: 'no-store' })
    .then(res => {
      if (res.ok) {
        importLocalOutputHTML();
      }
    })
    .catch(() => {});
});
