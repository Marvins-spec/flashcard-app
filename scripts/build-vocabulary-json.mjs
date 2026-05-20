import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const extra = [
  { id: '26', word: 'ability', ipa: '/əˈbɪləti/', thaiMeaning: 'ความสามารถ', thaiReading: 'อะ-บิล-ลิ-ที่', type: 'noun', level: 'A2', example: 'She has the ability to learn quickly.', exampleThai: 'เธอมีความสามารถในการเรียนรู้ได้อย่างรวดเร็ว', synonyms: ['capability', 'skill', 'talent'], tags: ['skill', 'potential'] },
  { id: '27', word: 'accept', ipa: '/əkˈsept/', thaiMeaning: 'ยอมรับ', thaiReading: 'แอค-เซ็ป', type: 'verb', level: 'A2', example: 'I accept your apology.', exampleThai: 'ฉันยอมรับคำขอโทษของคุณ', synonyms: ['receive', 'agree', 'approve'], tags: ['communication', 'agreement'] },
  { id: '28', word: 'active', ipa: '/ˈæktɪv/', thaiMeaning: 'กระตือรือร้น, คล่องแคล่ว', thaiReading: 'แอค-ทิฟ', type: 'adjective', level: 'A2', example: 'He leads an active lifestyle.', exampleThai: 'เขามีไลฟ์สไตล์ที่กระตือรือร้น', synonyms: ['energetic', 'busy', 'dynamic'], tags: ['health', 'lifestyle'] },
  { id: '29', word: 'actually', ipa: '/ˈæktʃuəli/', thaiMeaning: 'จริงๆ แล้ว', thaiReading: 'แอค-ชู-อะ-ลี่', type: 'adverb', level: 'A2', example: 'Actually, I disagree with you.', exampleThai: 'จริงๆ แล้วฉันไม่เห็นด้วยกับคุณ', synonyms: ['really', 'in fact', 'truly'], tags: ['conversation', 'emphasis'] },
  { id: '30', word: 'address', ipa: '/əˈdres/', thaiMeaning: 'ที่อยู่; กล่าวถึง', thaiReading: 'แอด-เดรส', type: 'noun', level: 'A1', example: 'What is your home address?', exampleThai: 'ที่อยู่บ้านของคุณคืออะไร', synonyms: ['location', 'speech'], tags: ['daily', 'communication'] },
  { id: '31', word: 'advantage', ipa: '/ədˈvɑːntɪdʒ/', thaiMeaning: 'ข้อได้เปรียบ', thaiReading: 'แอด-แวน-เทจ', type: 'noun', level: 'B1', example: 'Being bilingual is an advantage.', exampleThai: 'การพูดได้สองภาษเป็นข้อได้เปรียบ', synonyms: ['benefit', 'edge', 'plus'], tags: ['success', 'comparison'] },
  { id: '32', word: 'adventure', ipa: '/ədˈventʃər/', thaiMeaning: 'การผจญภัย', thaiReading: 'แอด-เวน-เชอร์', type: 'noun', level: 'A2', example: 'They went on an adventure in the mountains.', exampleThai: 'พวกเขาไปผจญภัยบนภูเขา', synonyms: ['expedition', 'quest', 'journey'], tags: ['travel', 'excitement'] },
  { id: '33', word: 'advice', ipa: '/ədˈvaɪs/', thaiMeaning: 'คำแนะนำ', thaiReading: 'แอด-ไวซ์', type: 'noun', level: 'A2', example: 'Can I give you some advice?', exampleThai: 'ฉันให้คำแนะนำคุณได้ไหม', synonyms: ['guidance', 'recommendation', 'tip'], tags: ['help', 'communication'] },
  { id: '34', word: 'affect', ipa: '/əˈfekt/', thaiMeaning: 'ส่งผลกระทบ', thaiReading: 'อะ-เฟ็ก', type: 'verb', level: 'B2', example: 'Climate change affects everyone.', exampleThai: 'การเปลี่ยนแปลงสภาพภูมิอากาศส่งผลกระทบต่อทุกคน', synonyms: ['influence', 'impact', 'alter'], tags: ['cause', 'science'] },
  { id: '35', word: 'afford', ipa: '/əˈfɔːrd/', thaiMeaning: 'มีเงินพอซื้อ', thaiReading: 'อะ-ฟอร์ด', type: 'verb', level: 'B1', example: 'I cannot afford a new car.', exampleThai: 'ฉันมีเงินไม่พอซื้อรถใหม่', synonyms: ['manage', 'pay for', 'bear'], tags: ['money', 'daily'] },
  { id: '36', word: 'afraid', ipa: '/əˈfreɪd/', thaiMeaning: 'กลัว', thaiReading: 'อะ-เฟรด', type: 'adjective', level: 'A2', example: 'She is afraid of spiders.', exampleThai: 'เธอกลัวแมงมุม', synonyms: ['scared', 'frightened', 'fearful'], tags: ['emotion', 'fear'] },
  { id: '37', word: 'agree', ipa: '/əˈɡriː/', thaiMeaning: 'เห็นด้วย', thaiReading: 'อะ-กรี', type: 'verb', level: 'A1', example: 'I agree with your opinion.', exampleThai: 'ฉันเห็นด้วยกับความคิดเห็นของคุณ', synonyms: ['accept', 'consent', 'approve'], tags: ['communication', 'agreement'] },
  { id: '38', word: 'allow', ipa: '/əˈlaʊ/', thaiMeaning: 'อนุญาต', thaiReading: 'อะ-เลา', type: 'verb', level: 'A2', example: 'Smoking is not allowed here.', exampleThai: 'ห้ามสูบบุหรี่ที่นี่', synonyms: ['permit', 'let', 'enable'], tags: ['rules', 'permission'] },
  { id: '39', word: 'almost', ipa: '/ˈɔːlmoʊst/', thaiMeaning: 'เกือบ', thaiReading: 'ออล-โมสต์', type: 'adverb', level: 'A2', example: 'It is almost midnight.', exampleThai: 'เกือบจะเที่ยงคืนแล้ว', synonyms: ['nearly', 'practically', 'about'], tags: ['degree', 'time'] },
  { id: '40', word: 'alone', ipa: '/əˈloʊn/', thaiMeaning: 'โดยลำพัง', thaiReading: 'อะ-โลน', type: 'adjective', level: 'A2', example: 'He lives alone in the city.', exampleThai: 'เขาอยู่คนเดียวในเมือง', synonyms: ['solo', 'by oneself', 'isolated'], tags: ['life', 'emotion'] },
  { id: '41', word: 'amazing', ipa: '/əˈmeɪzɪŋ/', thaiMeaning: 'น่าทึ่ง', thaiReading: 'อะ-เมซิง', type: 'adjective', level: 'A2', example: 'The view was amazing.', exampleThai: 'วิวน่าทึ่งมาก', synonyms: ['incredible', 'wonderful', 'astonishing'], tags: ['positive', 'emotion'] },
  { id: '42', word: 'amount', ipa: '/əˈmaʊnt/', thaiMeaning: 'จำนวน', thaiReading: 'อะ-เมาท์', type: 'noun', level: 'B1', example: 'A large amount of water is needed.', exampleThai: 'ต้องการน้ำจำนวนมาก', synonyms: ['quantity', 'sum', 'total'], tags: ['measurement', 'math'] },
  { id: '43', word: 'ancient', ipa: '/ˈeɪnʃənt/', thaiMeaning: 'โบราณ', thaiReading: 'เอน-เชินท์', type: 'adjective', level: 'B1', example: 'They visited ancient temples.', exampleThai: 'พวกเขาไปเยี่ยมวัดโบราณ', synonyms: ['old', 'historic', 'antique'], tags: ['history', 'culture'] },
  { id: '44', word: 'announce', ipa: '/əˈnaʊns/', thaiMeaning: 'ประกาศ', thaiReading: 'อะ-นาวซ์', type: 'verb', level: 'B1', example: 'The company will announce results tomorrow.', exampleThai: 'บริษัทจะประกาศผลพรุ่งนี้', synonyms: ['declare', 'reveal', 'publish'], tags: ['news', 'communication'] },
  { id: '45', word: 'anxious', ipa: '/ˈæŋkʃəs/', thaiMeaning: 'กังวล', thaiReading: 'แอง-เชียส', type: 'adjective', level: 'B2', example: 'She felt anxious before the exam.', exampleThai: 'เธอรู้สึกกังวลก่อนสอบ', synonyms: ['worried', 'nervous', 'uneasy'], tags: ['emotion', 'stress'] },
  { id: '46', word: 'appreciate', ipa: '/əˈpriːʃieɪt/', thaiMeaning: 'ซาบซึ้ง, ขอบคุณ', thaiReading: 'อะ-พรี-ชิเอต', type: 'verb', level: 'B1', example: 'I appreciate your help.', exampleThai: 'ฉันขอบคุณความช่วยเหลือของคุณ', synonyms: ['value', 'thank', 'recognize'], tags: ['gratitude', 'emotion'] },
  { id: '47', word: 'approach', ipa: '/əˈproʊtʃ/', thaiMeaning: 'เข้าใกล้; แนวทาง', thaiReading: 'อะ-โพรช', type: 'verb', level: 'B2', example: 'We need a new approach to the problem.', exampleThai: 'เราต้องการแนวทางใหม่ต่อปัญหา', synonyms: ['method', 'near', 'strategy'], tags: ['strategy', 'movement'] },
  { id: '48', word: 'appropriate', ipa: '/əˈproʊpriət/', thaiMeaning: 'เหมาะสม', thaiReading: 'อะ-โพร-พรีเอต', type: 'adjective', level: 'B2', example: 'Wear appropriate clothing for the interview.', exampleThai: 'สวมเสื้อผ้าที่เหมาะสมสำหรับการสัมภาษณ์', synonyms: ['suitable', 'proper', 'fitting'], tags: ['formal', 'behavior'] },
  { id: '49', word: 'argue', ipa: '/ˈɑːrɡjuː/', thaiMeaning: 'โต้เถียง', thaiReading: 'อาร์-กิว', type: 'verb', level: 'B1', example: 'They argue about politics often.', exampleThai: 'พวกเขามักโต้เถียงเรื่องการเมือง', synonyms: ['debate', 'dispute', 'quarrel'], tags: ['conflict', 'communication'] },
  { id: '50', word: 'arrange', ipa: '/əˈreɪndʒ/', thaiMeaning: 'จัดเตรียม', thaiReading: 'อะ-เรนจ์', type: 'verb', level: 'B1', example: 'Can you arrange a meeting for Monday?', exampleThai: 'คุณจัดประชุมวันจันทร์ได้ไหม', synonyms: ['organize', 'plan', 'set up'], tags: ['planning', 'work'] },
  { id: '51', word: 'arrive', ipa: '/əˈraɪv/', thaiMeaning: 'มาถึง', thaiReading: 'อะ-ไรฟ์', type: 'verb', level: 'A1', example: 'The train will arrive at noon.', exampleThai: 'รถไฟจะมาถึงตอนเที่ยง', synonyms: ['reach', 'come', 'appear'], tags: ['travel', 'time'] },
  { id: '52', word: 'article', ipa: '/ˈɑːrtɪkl/', thaiMeaning: 'บทความ; คำนำหน้านาม', thaiReading: 'อาร์-ทิ-เคิล', type: 'noun', level: 'A1', example: 'I read an interesting article today.', exampleThai: 'วันนี้ฉันอ่านบทความที่น่าสนใจ', synonyms: ['story', 'piece', 'report'], tags: ['reading', 'media'] },
  { id: '53', word: 'attitude', ipa: '/ˈætɪtuːd/', thaiMeaning: 'ทัศนคติ', thaiReading: 'แอท-ทิ-ทูด', type: 'noun', level: 'B1', example: 'A positive attitude helps you succeed.', exampleThai: 'ทัศนคติเชิงบวกช่วยให้คุณประสบความสำเร็จ', synonyms: ['mindset', 'outlook', 'approach'], tags: ['psychology', 'behavior'] },
  { id: '54', word: 'attract', ipa: '/əˈtrækt/', thaiMeaning: 'ดึงดูด', thaiReading: 'อะ-แทร็ก', type: 'verb', level: 'B1', example: 'Bright colors attract attention.', exampleThai: 'สีสันสดใสดึงดูดความสนใจ', synonyms: ['draw', 'appeal', 'lure'], tags: ['interest', 'marketing'] },
  { id: '55', word: 'available', ipa: '/əˈveɪləbl/', thaiMeaning: 'พร้อมใช้งาน, ว่าง', thaiReading: 'อะ-เวล-า-เบิล', type: 'adjective', level: 'A2', example: 'Is this seat available?', exampleThai: 'ที่นั่งนี้ว่างไหม', synonyms: ['free', 'accessible', 'ready'], tags: ['daily', 'service'] },
]

// Base words from existing mock data (ids 1-25)
const base = JSON.parse(
  await import('fs').then((fs) =>
    fs.readFileSync(join(__dirname, '../lib/mock-data.ts'), 'utf8').match(/export const vocabularyData[\s\S]*?= (\[[\s\S]*?\])\n\n\/\//)?.[1] ?? '[]'
  )
).catch?.() 

// Fallback: read via dynamic import of compiled - use inline minimal if parse fails
const { vocabularyData } = await import('../lib/mock-data.ts').catch(() => ({ vocabularyData: [] }))

const all = [...(vocabularyData?.length ? vocabularyData : []), ...extra]
const unique = Array.from(new Map(all.map((w) => [w.word, w])).values())

writeFileSync(
  join(__dirname, '../src/data/vocabulary.json'),
  JSON.stringify(unique, null, 2),
  'utf8'
)
console.log(`Wrote ${unique.length} words to vocabulary.json`)
