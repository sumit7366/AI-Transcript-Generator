export function extractVideoId(youtube_url: string): string {
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,      // Standard and shared URLs
    /(?:embed\/)([0-9A-Za-z_-]{11})/,       // Embed URLs
    /(?:youtu\.be\/)([0-9A-Za-z_-]{11})/,   // Shortened URLs
    /(?:shorts\/)([0-9A-Za-z_-]{11})/,      // YouTube Shorts
    /^([0-9A-Za-z_-]{11})$/                 // Just the video ID
  ];

  const url = youtube_url.trim();

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  throw new Error("Could not extract video ID from URL");
}

export const AVAILABLE_LANGUAGES = {
  'English (US)': 'en-US',
  'English (UK)': 'en-UK',
  // Indian Languages
  'English (IN)': 'en',
  'Hindi': 'hi',
  'Bengali': 'bn',
  'Telugu': 'te',
  'Marathi': 'mr',
  'Tamil': 'ta',
  'Urdu': 'ur',
  'Gujarati': 'gu',
  'Kannada': 'kn',
  'Odia': 'or',
  'Malayalam': 'ml',
  'Punjabi': 'pa',
  'Assamese': 'as',
  'Maithili': 'mai',
  'Santali': 'sat',
  'Kashmiri': 'ks',
  'Nepali': 'ne',
  'Konkani': 'kok',
  'Sindhi': 'sd',
  'Dogri': 'doi',
  'Manipuri': 'mni',
  'Bodo': 'brx',
  // Major International Languages
  'German': 'de',
  'French (FR)': 'fr',
  'Canada': 'fr-CA',
  'Spanish': 'es',
  'Russian': 'ru',
  'Japanese': 'ja',
  'Chinese (Simplified)': 'zh-CN',
  'Chinese (Traditional)': 'zh-TW',
  'Korean': 'ko'
} as const;

export function createSummaryPrompt(text: string, targetLanguage: string, mode: 'video' | 'podcast' = 'video') {
  const languagePrompts = {

    'en-US': {
      title: 'TITLE',
      overview: 'OVERVIEW',
      keyPoints: 'KEY POINTS',
      takeaways: 'MAIN TAKEAWAYS',
      context: 'CONTEXT & IMPLICATIONS'
    },
    'en-UK': {
      title: 'TITLE',
      overview: 'OVERVIEW',
      keyPoints: 'KEY POINTS',
      takeaways: 'KEY TAKEAWAYS',
      context: 'CONTEXT & IMPLICATIONS'
    },
    'fr': {
      title: 'TITRE',
      overview: 'APERÇU',
      keyPoints: 'POINTS CLÉS',
      takeaways: 'POINTS ESSENTIELS',
      context: 'CONTEXTE ET IMPLICATIONS'
    },
    'fr-CA': {
      title: 'TITRE',
      overview: 'APERÇU',
      keyPoints: 'POINTS IMPORTANTS',
      takeaways: 'ENSEIGNEMENTS CLÉS',
      context: 'CONTEXTE ET CONSÉQUENCES'
    },
    'es': {
      title: 'TÍTULO',
      overview: 'RESUMEN',
      keyPoints: 'PUNTOS CLAVE',
      takeaways: 'CONCLUSIONES PRINCIPALES',
      context: 'CONTEXTO E IMPLICACIONES'
    },
    'ru': {
      title: 'ЗАГОЛОВОК',
      overview: 'ОБЗОР',
      keyPoints: 'КЛЮЧЕВЫЕ МОМЕНТЫ',
      takeaways: 'ОСНОВНЫЕ ВЫВОДЫ',
      context: 'КОНТЕКСТ И ПОСЛЕДСТВИЯ'
    },
    'ja': {
      title: 'タイトル',
      overview: '概要',
      keyPoints: '重要なポイント',
      takeaways: '主なポイント',
      context: '文脈と意味'
    },
    'zh-CN': {
      title: '标题',
      overview: '概述',
      keyPoints: '关键点',
      takeaways: '主要收获',
      context: '背景与影响'
    },
    'zh-TW': {
      title: '標題',
      overview: '概覽',
      keyPoints: '重點',
      takeaways: '主要收穫',
      context: '背景與影響'
    },
    'ko': {
      title: '제목',
      overview: '개요',
      keyPoints: '핵심 포인트',
      takeaways: '주요 시사점',
      context: '맥락과 함의'
    },




    'en': {
      title: 'TITLE',
      overview: 'OVERVIEW',
      keyPoints: 'KEY POINTS',
      takeaways: 'MAIN TAKEAWAYS',
      context: 'CONTEXT & IMPLICATIONS'
    },
    'de': {
      title: 'TITEL',
      overview: 'ÜBERBLICK',
      keyPoints: 'KERNPUNKTE',
      takeaways: 'HAUPTERKENNTNISSE',
      context: 'KONTEXT & AUSWIRKUNGEN'
    },
    'hi': {
      title: 'शीर्षक',
      overview: 'सारांश',
      keyPoints: 'मुख्य बिंदु',
      takeaways: 'मुख्य निष्कर्ष',
      context: 'प्रसंग और प्रभाव'
    },
    'bn': {
      title: 'শিরোনাম',
      overview: 'সংক্ষিপ্ত বিবরণ',
      keyPoints: 'মূল পয়েন্ট',
      takeaways: 'প্রধান ধারণা',
      context: 'প্রসঙ্গ ও প্রভাব'
    },
    'te': {
      title: 'శీర్షిక',
      overview: 'సారాంశం',
      keyPoints: 'ముఖ్యాంశాలు',
      takeaways: 'ప్రధాన విషయాలు',
      context: 'సందర్భం మరియు ప్రభావాలు'
    },
    'mr': {
      title: 'शीर्षक',
      overview: 'आढावा',
      keyPoints: 'मुख्य मुद्दे',
      takeaways: 'मुख्य निष्कर्ष',
      context: 'संदर्भ आणि परिणाम'
    },
    'ta': {
      title: 'தலைப்பு',
      overview: 'கண்ணோட்டம்',
      keyPoints: 'முக்கிய புள்ளிகள்',
      takeaways: 'முக்கியக் கருத்துக்கள்',
      context: 'சூழ்நிலை மற்றும் விளைவுகள்'
    },
    'ur': {
      title: 'عنوان',
      overview: 'جائزہ',
      keyPoints: 'اہم نکات',
      takeaways: 'اہم نتائج',
      context: 'سیاق و سباق اور مضمرات'
    },
    'gu': {
      title: 'શીર્ષક',
      overview: 'સારાંશ',
      keyPoints: 'મુખ્ય મુદ્દા',
      takeaways: 'મુખ્ય શોધો',
      context: 'સંદર્ભ અને અસર'
    },
    'kn': {
      title: 'ಶೀರ್ಷಿಕೆ',
      overview: 'ಸಾರಾಂಶ',
      keyPoints: 'ಪ್ರಮುಖ ಅಂಶಗಳು',
      takeaways: 'ಮುಖ್ಯ ಪಾಠಗಳು',
      context: 'ಪರಿಸರ ಮತ್ತು ಪರಿಣಾಮಗಳು'
    },
    'or': {
      title: 'ଶିରୋନାମ',
      overview: 'ସାରଂଶ',
      keyPoints: 'ମୁଖ୍ୟ ବିନ୍ଦୁ',
      takeaways: 'ମୁଖ୍ୟ ନିଷ୍କର୍ଷ',
      context: 'ପ୍ରସଙ୍ଗ ଓ ପ୍ରଭାବ'
    },
    'ml': {
      title: 'തലക്കെട്ട്',
      overview: 'അവലോകനം',
      keyPoints: 'പ്രധാന പോയിന്റുകൾ',
      takeaways: 'പ്രധാന കണ്ടുപിടിത്തങ്ങൾ',
      context: 'സന്ദർഭവും ഫലവും'
    },
    'pa': {
      title: 'ਸਿਰਲੇਖ',
      overview: 'ਸੰਖੇਪ',
      keyPoints: 'ਮੁੱਖ ਬਿੰਦੂ',
      takeaways: 'ਮੁੱਖ ਨਿਸ਼ਕਰਸ਼',
      context: 'ਪ੍ਰਸੰਗ ਅਤੇ ਪ੍ਰਭਾਵ'
    },
    'as': {
      title: 'শিৰোনাম',
      overview: 'সাৰাংশ',
      keyPoints: 'মুখ্য বিষয়সমূহ',
      takeaways: 'প্ৰধান ধাৰণা',
      context: 'প্ৰসঙ্গ আৰু প্ৰভাৱ'
    },
    'mai': {
      title: 'शीर्षक',
      overview: 'सारांश',
      keyPoints: 'मुख्य बिंदु',
      takeaways: 'मुख्य निष्कर्ष',
      context: 'संदर्भ और प्रभाव'
    },
    'sat': {
      title: 'ᱪᱷᱤᱨᱥᱚᱠ',
      overview: 'ᱥᱟᱹᱨᱟᱢ',
      keyPoints: 'ᱢᱩᱞᱠᱚ ᱥᱮᱫᱽᱨᱤᱧ',
      takeaways: 'ᱢᱩᱞᱠᱚ ᱪᱷᱟᱹᱲᱤᱭᱟ',
      context: 'ᱫᱟᱹᱞᱤᱭᱟ ᱟᱨᱵ ᱵᱷᱤᱠ'
    },
    'ks': {
      title: 'عنوان',
      overview: 'خلاصہ',
      keyPoints: 'اہم نکات',
      takeaways: 'اہم نتائج',
      context: 'سیاق و سباق اور اثرات'
    },
    'ne': {
      title: 'शीर्षक',
      overview: 'सारांश',
      keyPoints: 'मुख्य बुँदाहरू',
      takeaways: 'मुख्य निष्कर्षहरू',
      context: 'सन्दर्भ र प्रभावहरू'
    },
    'kok': {
      title: 'शीर्षक',
      overview: 'आढावा',
      keyPoints: 'मुख्य बिंदू',
      takeaways: 'मुख्य निष्कर्ष',
      context: 'संदर्भ आणि परिणाम'
    },
    'sd': {
      title: 'عنوان',
      overview: 'جائزو',
      keyPoints: 'مکيه نقطا',
      takeaways: 'اهم نتيجا',
      context: 'سياق ۽ اثر'
    },
    'doi': {
      title: 'शीर्षक',
      overview: 'सारांश',
      keyPoints: 'मुख्य बिंदु',
      takeaways: 'मुख्य निष्कर्ष',
      context: 'प्रसंग और प्रभाव'
    },
    'mni': {
      title: 'ꯃꯤꯠꯂꯩ',
      overview: 'ꯃꯇꯝꯀꯤ ꯃꯇꯝꯕꯥꯡ',
      keyPoints: 'ꯃꯌꯨ ꯃꯁꯤꯌꯤꯡ',
      takeaways: 'ꯃꯌꯨ ꯊꯣꯝꯕꯤ ꯇꯧꯕꯤꯡ',
      context: 'ꯁꯦꯝꯗꯔꯝ ꯍꯦꯟꯗ ꯑꯃꯁꯤꯡ'
    },
    'brx': {
      title: '⠠⠔⠪⠄⠢⠄',
      overview: '⠷⠤⠜⠄⠕⠨',
      keyPoints: '⠓⠑⠝⠲⠦⠤⠩',
      takeaways: '⠧⠗⠉⠕⠢⠄⠄',
      context: '⠺⠇⠝⠺⠢⠄⠄'
    }
  };



  const prompts = languagePrompts[targetLanguage as keyof typeof languagePrompts] || languagePrompts.en;

  if (mode === 'podcast') {
    return `Please provide a detailed **podcast-style summary as a conversation between two people** (e.g., Host and Expert) of the following content in ${targetLanguage}.
    
  Structure your response as a dialogue. Use a natural, engaging tone and follow this format:
  
  🎙️ ${prompts.title}: 
  - The Host introduces the title in an engaging way.
  
  🎧 ${prompts.overview} (3-5 sentences):
  - Host sets the scene and gives context.
  - Expert elaborates on the purpose and background of the content.
  
  🔍 ${prompts.keyPoints}:
  - Host asks insightful questions.
  - Expert responds with deep dives into the main points, using specific examples, anecdotes, and expert insights.
  - Include occasional back-and-forth to keep it conversational.
  
  📈 ${prompts.takeaways}:
  - Host asks for key takeaways.
  - Expert lists 5-7 practical insights, explains their relevance and potential impact.
  
  🌐 ${prompts.context}:
  - Host steers the conversation to broader context.
  - Expert discusses future implications and shares predictions.
  
  Text to summarize: ${text}
  
  Ensure the summary feels like a real conversation and is comprehensive enough for someone who hasn't seen the original content. Use casual and engaging language.`;
  }
  

//   if (mode === 'podcast') {
//     return `Please provide a detailed podcast-style summary of the following content in ${targetLanguage}.
//     Structure your response as follows:

//     🎙️ ${prompts.title}: Create an engaging title

//     🎧 ${prompts.overview} (3-5 sentences):
//     - Provide a detailed context and main purpose

//     🔍 ${prompts.keyPoints}:
//     - Deep dive into the main arguments
//     - Include specific examples and anecdotes
//     - Highlight unique perspectives and expert opinions

//     📈 ${prompts.takeaways}:
//     - List 5-7 practical insights
//     - Explain their significance and potential impact

//     🌐 ${prompts.context}:
//     - Broader context discussion
//     - Future implications and expert predictions

//     Text to summarize: ${text}

//     Ensure the summary is comprehensive enough for someone who hasn't seen the original content.`;
//   }

  return `Please provide a detailed summary of the following content in ${targetLanguage}.
  Structure your response as follows:

  🎯 ${prompts.title}: Create a descriptive title

  📝 ${prompts.overview} (2-3 sentences):
  - Provide a brief context and main purpose

  🔑 ${prompts.keyPoints}:
  - Extract and explain the main arguments
  - Include specific examples
  - Highlight unique perspectives

  💡 ${prompts.takeaways}:
  - List 3-5 practical insights
  - Explain their significance

  🔄 ${prompts.context}:
  - Broader context discussion
  - Future implications

  Text to summarize: ${text}

  Ensure the summary is comprehensive enough for someone who hasn't seen the original content.`;
}