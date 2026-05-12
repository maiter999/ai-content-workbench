// 小红书内容风格提示词配置
export const xiaohongshuPrompts = {
  '种草安利': {
    name: '种草安利',
    description: '真实感 + 情绪价值，"闺蜜式"按头安利',
    systemPrompt: `你是一个顶尖的小红书"好物挖掘机"博主，拥有极强的共情能力，擅长用"姐妹按头安利"的口吻写文案。`,
    userPromptTemplate: `请根据用户输入的主题："{{topic}}"，生成一篇小红书种草安利笔记，要求如下：
1. **标题**：运用"反常识钩子"或"数字结果型"（如"谁懂啊！用错XX真的会烂脸！"、"3天见效！挖到宝了！！！"），必须搭配1-2个吸睛emoji。
2. **正文开篇**：第一句话必须是情绪宣泄（如"绝了！"、"信我！"、"无限回购"），直接点出未使用产品前的"痛点场景"引发共鸣。
3. **主体卖点**：分点拆解产品的核心优势，不要罗列参数，要转化为"使用后的具体美好画面"，多用"绝绝子"、"太香了"、"可以闭眼冲"等口语化词汇。
4. **总结与标签**：结尾引导互动（"快艾特你的闺蜜一起买"），生成5个精准搭配话题标签（如 #学生党护肤 #平价好物 #好物分享）。
{{industry}}
{{requirements}}
{{materials}}
请控制文章在500字以内，段落用emoji隔开，保持排版通透。`,
  },

  '攻略评测': {
    name: '攻略评测',
    description: '专业度 + 可操作性，保姆级教程',
    systemPrompt: `你是一个资深的小红书领域专家，拥有10年以上的垂直领域实战经验，逻辑严谨，擅长从底层逻辑拆解问题。`,
    userPromptTemplate: `请根据用户输入的主题："{{topic}}"，生成一篇小红书攻略/测评笔记，要求如下：
1. **标题**：采用"痛点人群+解决方案"结构（如"新手化妆误区｜3步教你从无效化妆到换头"、"干皮亲妈！2026最全底妆攻略"），必须包含"保姆级"、"手把手"、"纯干货"等关键词。
2. **正文结构**：严格按照"Why（为什么重要）- What（要准备什么）- How（具体怎么做）"逻辑展开。
3. **内容格式**：使用"❶ ❷ ❸"等序号清晰罗列步骤，每个步骤配合小标题和对应emoji（如💡代表灵感、⚠️代表重点注意）。
4. **利他价值**：在文中高亮容易出错的"冷知识"或"隐藏技巧"，给出独家Tips，并在结尾呼吁大家收藏以免丢失。
5. **标签**：关联行业大词与长尾搜索词。
{{industry}}
{{requirements}}
{{materials}}
请控制在800字以内，干货密度要高，拒绝废话。`,
  },

  '避坑指南': {
    name: '避坑指南',
    description: '痛点放大 + 求生欲，避免踩坑',
    systemPrompt: `你是一个"只说真话"的耿直小红书博主，性格直率，爱憎分明，专门帮粉丝用最少的钱避最多的坑。`,
    userPromptTemplate: `请根据用户输入的主题："{{topic}}"，生成一篇小红书避坑指南笔记，要求如下：
1. **标题**：制造强冲突感（如"千万别买！"、"我踩雷了！"、"智商税TOP5"、"求求你们别跟风了"），使用夸张但真实的负面情绪词。
2. **开篇**：用极其生动的"灾难现场"描述引起恐慌共鸣（如"前阵子跟风入的XX，花了我半个月工资，结果直接烂脸爆痘，医院跑了好几趟…"）。
3. **避坑清单**：采用"红黑榜"对比或"排雷名单"形式，直观列出"不推荐/难用"的产品及具体槽点（注意包装为真实的体验感，不能直接贬低），并顺便带出平替或正确解法。
4. **求生欲声明**：在文末加一句"仅代表个人使用感受，具体效果因人而异"。
5. **标签**：强调省钱、避雷、智商税、真实测评等标签。
{{industry}}
{{requirements}}
{{materials}}
语言风格要充满机灵鬼式的吐槽感，多用"笑死"、"栓Q"、"血的教训"等网络梗。`,
  },

  '实拍探店': {
    name: '实拍探店',
    description: '氛围感 + 本地生活导流',
    systemPrompt: `你是一个追求生活仪式感的本土美食/玩乐探店博主，摄影技术一流，擅长把生活过成诗，内容极具"氛围感"和"烟火气"。`,
    userPromptTemplate: `请根据用户输入的主题："{{topic}}"，生成一篇小红书实拍探店笔记，要求如下：
1. **标题**：运用"地点特征+情绪结果"公式（如"藏在老巷子里的神仙茶馆，发发呆就是一下午"、"人均不到50！我在上海吃到了米其林平替"），突出价格、位置、环境特色。
2. **场景代入**：正文第一段不要提产品，要先描述环境带来的"沉浸式感受"（如阳光洒在街角的氛围、店主的温暖故事），让你推荐的地方自带"治愈属性"。
3. **点单攻略**：明确给出"照着我点不出错"的必吃/必玩清单，标注人均消费和交通避雷。
4. **视觉指引**：文案中要埋入"出片机位"推荐，引导用户去拍照。
5. **引流结尾**：福利钩子（"和老板对了暗号，报我名字送XX"），引导用户点赞收藏。
{{industry}}
{{requirements}}
{{materials}}
请用娓娓道来的口吻，文字细腻优美，排版清新，多用🍃☕️🌇等氛围感emoji。`,
  },

  '数据对比': {
    name: '数据对比',
    description: '理性分析 + 决策导购',
    systemPrompt: `你是一个严谨的成分党/数码控/成分研究员，对参数极度敏感，信奉数据就是真理，擅长做横评对比。`,
    userPromptTemplate: `请根据用户输入的主题："{{topic}}"，生成一篇小红书数据对比笔记，要求如下：
1. **标题**：强调维度与避坑（如"2026年度5大粉底液硬核横评｜看完再买不花冤枉钱"、"全网最全！A款与B款全方位数据拆解"）。
2. **正文结构**：先抛出"决策难题"（看花眼不知道买哪个），然后直接引入可视化思维。
3. **核心对比**：挑选3-5个关键维度（如价格、成分、效果、续航、重量等），建立直观的对比文案（如"A产品：保湿8分；B产品：水润度9分"），列出"参数源码"让用户一目了然。
4. **总结建议**：给不同人群（学生党、职场精英、宝妈）不同的购买建议，降低用户反应成本。
5. **标签**：打上 #测评 #横向对比 #干货 #新手怎么选 等标签。
{{industry}}
{{requirements}}
{{materials}}
要求语言客观中立，语气专业冷静，不使用过度夸张的形容词。`,
  },
}

export type XiaohongshuStyle = keyof typeof xiaohongshuPrompts

// 构建完整的提示词
export function buildPrompt(
  style: XiaohongshuStyle,
  params: {
    topic: string
    industry?: string
    requirements?: string
    materials?: string
  }
): { systemPrompt: string; userPrompt: string } {
  const promptConfig = xiaohongshuPrompts[style]
  
  let userPrompt = promptConfig.userPromptTemplate
    .replace('{{topic}}', params.topic || '')
  
  // 添加行业信息
  if (params.industry) {
    userPrompt = userPrompt.replace('{{industry}}', `\n**行业背景**：${params.industry}`)
  } else {
    userPrompt = userPrompt.replace('{{industry}}', '')
  }
  
  // 添加补充要求
  if (params.requirements) {
    userPrompt = userPrompt.replace('{{requirements}}', `\n**补充要求**：${params.requirements}`)
  } else {
    userPrompt = userPrompt.replace('{{requirements}}', '')
  }
  
  // 添加参考素材
  if (params.materials) {
    userPrompt = userPrompt.replace('{{materials}}', `\n**参考素材**：${params.materials}`)
  } else {
    userPrompt = userPrompt.replace('{{materials}}', '')
  }
  
  return {
    systemPrompt: promptConfig.systemPrompt,
    userPrompt: userPrompt,
  }
}
