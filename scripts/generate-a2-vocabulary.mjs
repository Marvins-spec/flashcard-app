import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '../src/data')
const REQUIRED = ['word', 'ipa', 'thaiMeaning', 'thaiReading', 'type', 'level', 'example', 'exampleThai', 'synonyms', 'tags', 'difficulty', 'frequencyRank']
const TARGET = 100

function loadExistingWords() {
  const seen = new Set()
  for (const file of ['vocabulary.json', 'a1.json', 'a2.json', 'b1.json', 'b2.json']) {
    const p = join(dataDir, file)
    if (existsSync(p)) {
      JSON.parse(readFileSync(p, 'utf8')).forEach((e) => seen.add(e.word.toLowerCase()))
    }
  }
  return seen
}

function row(...fields) {
  const [word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank] = fields
  return { word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank }
}

const NEW_WORDS = [
  row('abroad', '/əˈbrɔːd/', 'ต่างประเทศ', 'อะ-บรอด', 'adverb', 'A2', 'She studied abroad for one year.', 'เธอเรียนต่างประเทศหนึ่งปี', ['overseas'], ['travel', 'education'], 2, 920),
  row('accident', '/ˈæksɪdənt/', 'อุบัติเหตุ', 'แอค-ซิ-เดินท์', 'noun', 'A2', 'There was a car accident on the highway.', 'มีอุบัติเหตุรถยนต์บนทางด่วน', ['crash'], ['travel', 'health'], 2, 780),
  row('account', '/əˈkaʊnt/', 'บัญชี', 'อะ-เคาท์', 'noun', 'A2', 'I opened a bank account last week.', 'ฉันเปิดบัญชีธนาคารเมื่อสัปดาห์ที่แล้ว', ['profile'], ['money', 'daily'], 2, 650),
  row('achieve', '/əˈtʃiːv/', 'บรรลุ', 'อะ-ชีฟ', 'verb', 'A2', 'He achieved his goal with hard work.', 'เขาบรรลุเป้าหมายด้วยการทำงานหนัก', ['accomplish'], ['work', 'success'], 2, 720),
  row('act', '/ækt/', 'แสดง, กระทำ', 'แอคท์', 'verb', 'A2', 'You need to act quickly in an emergency.', 'คุณต้องดำเนินการอย่างรวดเร็วในกรณีฉุกเฉิน', ['behave'], ['daily', 'work'], 2, 580),
  row('activity', '/ækˈtɪvəti/', 'กิจกรรม', 'แอค-ทิ-วิ-ที่', 'noun', 'A2', 'Outdoor activities are good for your health.', 'กิจกรรมกลางแจ้งดีต่อสุขภาพ', ['event'], ['leisure', 'health'], 2, 540),
  row('actually', '/ˈæktʃuəli/', 'จริงๆ แล้ว', 'แอค-ชู-อะ-ลี่', 'adverb', 'A2', 'I thought it was far, but it is actually close.', 'ฉันคิดว่ามันไกล แต่จริงๆ แล้วใกล้', ['really'], ['communication', 'daily'], 2, 420),
  row('add', '/æd/', 'เพิ่ม', 'แอด', 'verb', 'A2', 'Please add sugar to my coffee.', 'กรุณาใส่น้ำตาลในกาแฟของฉัน', ['include'], ['food', 'daily'], 2, 380),
  row('adult', '/ˈædʌlt/', 'ผู้ใหญ่', 'แอ-ดัลท์', 'noun', 'A2', 'This film is for adults only.', 'หนังเรื่องนี้สำหรับผู้ใหญ่เท่านั้น', ['grown-up'], ['people', 'daily'], 2, 610),
  row('advantage', '/ədˈvɑːntɪdʒ/', 'ข้อได้เปรียบ', 'แอด-แวน-เทจ', 'noun', 'A2', 'Speaking English is an advantage at work.', 'การพูดภาษาอังกฤษเป็นข้อได้เปรียบในการทำงาน', ['benefit'], ['work', 'education'], 2, 680),
  row('advertise', '/ˈædvərtaɪz/', 'โฆษณา', 'แอด-เวอร์-ไทซ์', 'verb', 'A2', 'They advertise their products online.', 'พวกเขาโฆษณาสินค้าทางออนไลน์', ['promote'], ['business', 'technology'], 3, 1100),
  row('advice', '/ədˈvaɪs/', 'คำแนะนำ', 'แอด-ไวซ์', 'noun', 'A2', 'Thanks for your helpful advice.', 'ขอบคุณสำหรับคำแนะนำที่มีประโยชน์', ['guidance'], ['communication', 'daily'], 2, 490),
  row('affect', '/əˈfekt/', 'ส่งผลกระทบ', 'อะ-เฟ็ก', 'verb', 'A2', 'Stress can affect your sleep.', 'ความเครียดส่งผลต่อการนอนของคุณ', ['influence'], ['health', 'daily'], 2, 750),
  row('afraid', '/əˈfreɪd/', 'กลัว', 'อะ-เฟรด', 'adjective', 'A2', 'She is afraid of flying.', 'เธอกลัวการนั่งเครื่องบิน', ['scared'], ['feelings', 'travel'], 2, 520),
  row('agency', '/ˈeɪdʒənsi/', 'หน่วยงาน, บริษัทตัวแทน', 'เอ-เจินซี่', 'noun', 'A2', 'We booked the trip through a travel agency.', 'เราจองทริปผ่านบริษัททัวร์', ['office'], ['travel', 'work'], 2, 980),
  row('agree', '/əˈɡriː/', 'เห็นด้วย', 'อะ-กรี', 'verb', 'A2', 'I agree with your point of view.', 'ฉันเห็นด้วยกับมุมมองของคุณ', ['accept'], ['communication', 'daily'], 2, 350),
  row('ahead', '/əˈhed/', 'ข้างหน้า', 'อะ-เฮด', 'adverb', 'A2', 'Go straight ahead and turn left.', 'ตรงไปข้างหน้าแล้วเลี้ยวซ้าย', ['forward'], ['travel', 'direction'], 2, 640),
  row('aim', '/eɪm/', 'มุ่งหมาย', 'เอม', 'verb', 'A2', 'We aim to finish the project by Friday.', 'เรามุ่งหมายให้โปรเจกต์เสร็จภายในวันศุกร์', ['target'], ['work', 'goals'], 2, 820),
  row('airline', '/ˈerlaɪn/', 'สายการบิน', 'แอร์-ไลน์', 'noun', 'A2', 'Which airline are you flying with?', 'คุณจะบินกับสายการบินไหน', ['carrier'], ['travel', 'daily'], 2, 1050),
  row('alarm', '/əˈlɑːrm/', 'นาฬิกาปลุก, สัญญาณเตือน', 'อะ-ลาร์ม', 'noun', 'A2', 'My alarm did not ring this morning.', 'นาฬิกาปลุกของฉันไม่ดังเช้านี้', ['alert'], ['time', 'daily'], 2, 710),
  row('alcohol', '/ˈælkəhɒl/', 'แอลกอฮอล์', 'แอล-กอ-ฮอล', 'noun', 'A2', 'He does not drink alcohol.', 'เขาไม่ดื่มแอลกอฮอล์', ['liquor'], ['health', 'social'], 2, 890),
  row('alive', '/əˈlaɪv/', 'มีชีวิต', 'อะ-ไลฟ์', 'adjective', 'A2', 'Luckily, everyone was alive after the fire.', 'โชคดีที่ทุกคนรอดชีวิตหลังไฟไหม้', ['living'], ['health', 'daily'], 2, 760),
  row('allow', '/əˈlaʊ/', 'อนุญาต', 'อะ-เลา', 'verb', 'A2', 'Smoking is not allowed in this building.', 'ห้ามสูบบุหรี่ในอาคารนี้', ['permit'], ['rules', 'daily'], 2, 410),
  row('almost', '/ˈɔːlmoʊst/', 'เกือบ', 'ออล-โมสต์', 'adverb', 'A2', 'I have almost finished my homework.', 'ฉันทำการบ้านเกือบเสร็จแล้ว', ['nearly'], ['degree', 'daily'], 2, 360),
  row('alone', '/əˈloʊn/', 'โดยลำพัง', 'อะ-โลน', 'adjective', 'A2', 'She prefers to work alone.', 'เธอชอบทำงานคนเดียว', ['by oneself'], ['feelings', 'work'], 2, 440),
  row('already', '/ɔːlˈredi/', 'แล้ว', 'ออล-เรด-ดี', 'adverb', 'A2', 'I have already seen that movie.', 'ฉันดูหนังเรื่องนั้นแล้ว', ['by now'], ['time', 'daily'], 2, 390),
  row('although', '/ɔːlˈðoʊ/', 'แม้ว่า', 'ออล-โธ', 'conjunction', 'A2', 'Although it rained, we had fun.', 'แม้ฝนจะตก เราก็สนุก', ['though'], ['grammar', 'daily'], 3, 950),
  row('altogether', '/ˌɔːltəˈɡeðər/', 'ทั้งหมด', 'ออล-ทะ-เก็ด-เธอร์', 'adverb', 'A2', 'That will cost fifty dollars altogether.', 'รวมทั้งหมดจะราคาห้าสิบดอลลาร์', ['in total'], ['shopping', 'daily'], 2, 1180),
  row('amazing', '/əˈmeɪzɪŋ/', 'น่าทึ่ง', 'อะ-เมซิง', 'adjective', 'A2', 'The concert was absolutely amazing.', 'คอนเสิร์ตน่าทึ่งมาก', ['incredible'], ['feelings', 'leisure'], 2, 480),
  row('amount', '/əˈmaʊnt/', 'จำนวน', 'อะ-เมาท์', 'noun', 'A2', 'A large amount of data was lost.', 'ข้อมูลจำนวนมากสูญหาย', ['quantity'], ['work', 'daily'], 2, 530),
  row('ancient', '/ˈeɪnʃənt/', 'โบราณ', 'เอน-เชินท์', 'adjective', 'A2', 'We visited ancient ruins in Greece.', 'เราไปเยี่ยมซากปรักหักพังโบราณในกรีซ', ['old'], ['history', 'travel'], 2, 870),
  row('ankle', '/ˈæŋkl/', 'ข้อเท้า', 'แอง-เคิล', 'noun', 'A2', 'She hurt her ankle while running.', 'เธอเจ็บข้อเท้าตอนวิ่ง', ['joint'], ['body', 'health'], 2, 1250),
  row('anniversary', '/ˌænɪˈvɜːrsəri/', 'วันครบรอบ', 'แอน-นิ-เวอร์-ซา-รี่', 'noun', 'A2', 'Today is our wedding anniversary.', 'วันนี้เป็นวันครบรอบแต่งงานของเรา', ['celebration'], ['family', 'social'], 2, 1320),
  row('announce', '/əˈnaʊns/', 'ประกาศ', 'อะ-นาวซ์', 'verb', 'A2', 'The company will announce the results tomorrow.', 'บริษัทจะประกาศผลพรุ่งนี้', ['declare'], ['work', 'news'], 2, 790),
  row('annoy', '/əˈnɔɪ/', 'รำคาญ', 'อะ-นอย', 'verb', 'A2', 'Loud music annoys my neighbors.', 'เพลงดังทำให้เพื่อนบ้านฉันรำคาญ', ['bother'], ['feelings', 'daily'], 2, 1020),
  row('annual', '/ˈænjuəl/', 'ประจำปี', 'แอน-นิว-อัล', 'adjective', 'A2', 'We have an annual meeting in March.', 'เรามีประชุมประจำปีในเดือนมีนาคม', ['yearly'], ['work', 'time'], 2, 1150),
  row('anxious', '/ˈæŋkʃəs/', 'กังวล', 'แอง-เชียส', 'adjective', 'A2', 'Many students feel anxious before exams.', 'นักเรียนหลายคนรู้สึกกังวลก่อนสอบ', ['worried'], ['education', 'feelings'], 2, 860),
  row('anybody', '/ˈenibɒdi/', 'ใครก็ได้', 'เอ-นิ-บอด-ดี', 'pronoun', 'A2', 'Is anybody home right now?', 'ตอนนี้มีใครอยู่บ้านไหม', ['anyone'], ['people', 'daily'], 2, 740),
  row('anyway', '/ˈeniweɪ/', 'อย่างไรก็ตาม', 'เอ-นิ-เวย์', 'adverb', 'A2', 'It is raining, but let us go anyway.', 'ฝนตก แต่ไปกันเถอะ', ['regardless'], ['communication', 'daily'], 2, 560),
  row('apartment', '/əˈpɑːrtmənt/', 'อพาร์ตเมนต์', 'อะ-พาร์ท-เมินท์', 'noun', 'A2', 'They rent a small apartment downtown.', 'พวกเขาเช่าอพาร์ตเมนต์เล็กๆ ในใจเมือง', ['flat'], ['home', 'daily'], 2, 690),
  row('apologize', '/əˈpɒlədʒaɪz/', 'ขอโทษ', 'อะ-พอ-ลา-ไจซ์', 'verb', 'A2', 'I apologize for being late.', 'ฉันขอโทษที่มาสาย', ['say sorry'], ['communication', 'daily'], 2, 810),
  row('appear', '/əˈpɪr/', 'ปรากฏ', 'อะ-เพียร์', 'verb', 'A2', 'A rainbow appeared after the storm.', 'รุ้งปรากฏหลังพายุ', ['show up'], ['nature', 'daily'], 2, 620),
  row('apply', '/əˈplaɪ/', 'สมัคร, ใช้', 'อะ-พลาย', 'verb', 'A2', 'She decided to apply for the job.', 'เธอตัดสินใจสมัครงาน', ['request'], ['work', 'education'], 2, 670),
  row('appointment', '/əˈpɔɪntmənt/', 'นัดหมาย', 'อะ-พอยนท์-เมินท์', 'noun', 'A2', 'I have a dentist appointment at three.', 'ฉันมีนัดหมอฟันตอนสามโมง', ['meeting'], ['health', 'daily'], 2, 940),
  row('appreciate', '/əˈpriːʃieɪt/', 'ขอบคุณ, ชื่นชม', 'อะ-พรี-ชิเอต', 'verb', 'A2', 'I really appreciate your support.', 'ฉันขอบคุณการสนับสนุนของคุณจริงๆ', ['value'], ['communication', 'work'], 2, 730),
  row('approach', '/əˈproʊtʃ/', 'เข้าใกล้, แนวทาง', 'อะ-โพรช', 'verb', 'A2', 'Winter is approaching quickly.', 'ฤดูหนาวใกล้เข้ามาเร็ว', ['near'], ['time', 'nature'], 2, 880),
  row('appropriate', '/əˈproʊpriət/', 'เหมาะสม', 'อะ-โพร-พรีเอต', 'adjective', 'A2', 'Wear appropriate clothes for the interview.', 'สวมเสื้อผ้าที่เหมาะสมสำหรับสัมภาษณ์', ['suitable'], ['work', 'daily'], 2, 920),
  row('argue', '/ˈɑːrɡjuː/', 'โต้เถียง', 'อาร์-กิว', 'verb', 'A2', 'They often argue about money.', 'พวกเขามักโต้เถียงเรื่องเงิน', ['dispute'], ['family', 'daily'], 2, 770),
  row('argument', '/ˈɑːrɡjumənt/', 'การโต้เถียง', 'อาร์-กิว-เมินท์', 'noun', 'A2', 'We had an argument but made up later.', 'เราทะเลาะกันแต่ค่อยๆ คืนดีกัน', ['disagreement'], ['communication', 'daily'], 2, 840),
  row('army', '/ˈɑːrmi/', 'กองทัพ', 'อาร์-มี่', 'noun', 'A2', 'He served in the army for two years.', 'เขารับราชการทหารสองปี', ['military'], ['work', 'society'], 2, 1010),
  row('arrange', '/əˈreɪndʒ/', 'จัดเตรียม', 'อะ-เรนจ์', 'verb', 'A2', 'Can you arrange a meeting for us?', 'คุณจัดประชุมให้เราได้ไหม', ['organize'], ['work', 'daily'], 2, 700),
  row('arrest', '/əˈrest/', 'จับกุม', 'อะ-เรสท์', 'verb', 'A2', 'The police arrested the suspect.', 'ตำรวจจับกุมผู้ต้องสงสัย', ['detain'], ['law', 'news'], 3, 1400),
  row('arrive', '/əˈraɪv/', 'มาถึง', 'อะ-ไรฟ์', 'verb', 'A2', 'What time does your flight arrive?', 'เที่ยวบินของคุณมาถึงกี่โมง', ['reach'], ['travel', 'daily'], 2, 400),
  row('article', '/ˈɑːrtɪkl/', 'บทความ', 'อาร์-ทิ-เคิล', 'noun', 'A2', 'I read an interesting article about health.', 'ฉันอ่านบทความน่าสนใงเรื่องสุขภาพ', ['story'], ['media', 'education'], 2, 510),
  row('artist', '/ˈɑːrtɪst/', 'ศิลปิน', 'อาร์-ทิสท์', 'noun', 'A2', 'The artist painted a beautiful landscape.', 'ศิลปินวาดภาพทิวทัศน์ที่สวยงาม', ['painter'], ['art', 'work'], 2, 960),
  row('ashamed', '/əˈʃeɪmd/', 'อาย', 'อะ-เชมด์', 'adjective', 'A2', 'He felt ashamed of his mistake.', 'เขารู้สึกอายกับความผิดพลาด', ['embarrassed'], ['feelings', 'daily'], 2, 1080),
  row('aside', '/əˈsaɪd/', 'ไว้ข้างๆ', 'อะ-ไซด์', 'adverb', 'A2', 'She stepped aside to let people pass.', 'เธอขยับไปข้างเพื่อให้คนอื่นผ่าน', ['apart'], ['movement', 'daily'], 2, 1220),
  row('asleep', '/əˈsliːp/', 'หลับ', 'อะ-สลีพ', 'adjective', 'A2', 'The baby is asleep in the crib.', 'ทารกหลับอยู่ในเปล', ['sleeping'], ['health', 'family'], 2, 830),
  row('assistant', '/əˈsɪstənt/', 'ผู้ช่วย', 'อะ-ซิส-เทินท์', 'noun', 'A2', 'She works as a shop assistant.', 'เธอทำงานเป็นพนักงานขายในร้าน', ['helper'], ['work', 'daily'], 2, 990),
  row('assume', '/əˈsuːm/', 'สมมติ', 'อะ-ซูม', 'verb', 'A2', 'Do not assume everyone agrees with you.', 'อย่าคิดว่าทุกคนเห็นด้วยกับคุณ', ['suppose'], ['communication', 'daily'], 3, 1280),
  row('atmosphere', '/ˈætməsfɪr/', 'บรรยากาศ', 'แอท-มอส-ฟียร์', 'noun', 'A2', 'The restaurant has a friendly atmosphere.', 'ร้านอาหารมีบรรยากาศเป็นมิตร', ['ambience'], ['social', 'daily'], 2, 1120),
  row('attach', '/əˈtætʃ/', 'แนบ', 'อะ-แทช', 'verb', 'A2', 'Please attach the file to your email.', 'กรุณาแนบไฟล์ในอีเมลของคุณ', ['include'], ['technology', 'work'], 2, 1060),
  row('attack', '/əˈtæk/', 'โจมตี', 'อะ-แทค', 'verb', 'A2', 'Hackers tried to attack the website.', 'แฮกเกอร์พยายามโจมตีเว็บไซต์', ['strike'], ['technology', 'news'], 3, 1180),
  row('attempt', '/əˈtempt/', 'พยายาม', 'อะ-เทมพ์', 'verb', 'A2', 'He will attempt the exam again next month.', 'เขาจะสอบใหม่อีกครั้งเดือนหน้า', ['try'], ['education', 'daily'], 2, 910),
  row('attend', '/əˈtend/', 'เข้าร่วม', 'อะ-เทนด์', 'verb', 'A2', 'Over fifty people attended the workshop.', 'มีคนเข้าร่วมเวิร์กช็อปกว่าห้าสิบคน', ['join'], ['work', 'education'], 2, 850),
  row('attention', '/əˈtenʃn/', 'ความสนใจ', 'อะ-เทน-ชัน', 'noun', 'A2', 'Pay attention to the road while driving.', 'จดจ่อกับถนนขณะขับรถ', ['focus'], ['education', 'travel'], 2, 630),
  row('attitude', '/ˈætɪtuːd/', 'ทัศนคติ', 'แอท-ทิ-ทูด', 'noun', 'A2', 'A positive attitude helps at work.', 'ทัศนคติเชิงบวกช่วยในการทำงาน', ['mindset'], ['work', 'daily'], 2, 780),
  row('attract', '/əˈtrækt/', 'ดึงดูด', 'อะ-แทร็ก', 'verb', 'A2', 'Bright lights attract insects at night.', 'แสงสว่างดึงดูดแมลงตอนกลางคืน', ['draw'], ['nature', 'daily'], 2, 800),
  row('audience', '/ˈɔːdiəns/', 'ผู้ชม', 'ออ-ดิเอนซ์', 'noun', 'A2', 'The audience clapped loudly at the end.', 'ผู้ชมปรบมือดังๆ ตอนจบ', ['crowd'], ['entertainment', 'daily'], 2, 970),
  row('author', '/ˈɔːθər/', 'ผู้เขียน', 'ออ-เธอร์', 'noun', 'A2', 'The author signed books at the store.', 'ผู้เขียนเซ็นหนังสือที่ร้าน', ['writer'], ['literature', 'work'], 2, 1030),
  row('average', '/ˈævərɪdʒ/', 'เฉลี่ย', 'แอ-เวอ-ริจ', 'adjective', 'A2', 'The average temperature here is mild.', 'อุณหภูมิเฉลี่ยที่นี่อบอุ่น', ['typical'], ['weather', 'math'], 2, 760),
  row('avoid', '/əˈvɔɪd/', 'หลีกเลี่ยง', 'อะ-วอยด์', 'verb', 'A2', 'Try to avoid eating too much sugar.', 'พยายามหลีกเลี่ยงการกินน้ำตาลมากเกินไป', ['stay away'], ['health', 'daily'], 2, 590),
  row('awake', '/əˈweɪk/', 'ตื่น', 'อะ-เวค', 'adjective', 'A2', 'I was still awake at midnight.', 'ฉันยังตื่นอยู่เที่ยงคืน', ['not sleeping'], ['health', 'daily'], 2, 870),
  row('award', '/əˈwɔːrd/', 'รางวัล', 'อะ-วอร์ด', 'noun', 'A2', 'She won an award for her research.', 'เธอได้รับรางวัลจากงานวิจัย', ['prize'], ['work', 'success'], 2, 930),
  row('aware', '/əˈwer/', 'ตระหนัก', 'อะ-แวร์', 'adjective', 'A2', 'Are you aware of the new rules?', 'คุณทราบกฎใหม่หรือไม่', ['conscious'], ['communication', 'daily'], 2, 810),
  row('awful', '/ˈɔːfl/', 'แย่มาก', 'ออ-ฟูล', 'adjective', 'A2', 'The weather was awful all weekend.', 'สภาพอากาศแย่มากตลอดสุดสัปดาห์', ['terrible'], ['weather', 'feelings'], 2, 740),
  row('background', '/ˈbækɡraʊnd/', 'พื้นหลัง, ประวัติ', 'แบ็ค-กราวนด์', 'noun', 'A2', 'Tell me about your educational background.', 'เล่าประวัติการศึกษาของคุณให้ฟังหน่อย', ['history'], ['work', 'education'], 2, 880),
  row('badly', '/ˈbædli/', 'อย่างเลวร้าย', 'แบด-ลี่', 'adverb', 'A2', 'He was badly hurt in the fall.', 'เขาเจ็บหนักจากการล้ม', ['severely'], ['health', 'daily'], 2, 790),
  row('bake', '/beɪk/', 'อบ', 'เบค', 'verb', 'A2', 'She loves to bake bread on Sundays.', 'เธอชอบอบขนมปังวันอาทิตย์', ['cook'], ['food', 'daily'], 2, 1010),
  row('balance', '/ˈbæləns/', 'สมดุล', 'แบล-เลินซ์', 'noun', 'A2', 'Good balance is important in yoga.', 'สมดุลที่ดีสำคัญในยูคะ', ['stability'], ['health', 'sport'], 2, 950),
  row('balloon', '/bəˈluːn/', 'ลูกโป่ง', 'บะ-ลูน', 'noun', 'A2', 'The children played with colorful balloons.', 'เด็กๆ เล่นลูกโป่งหลากสี', ['inflatable'], ['party', 'daily'], 2, 1180),
  row('band', '/bænd/', 'วงดนตรี', 'แบนด์', 'noun', 'A2', 'A live band played at the wedding.', 'วงดนตรีสดเล่นในงานแต่ง', ['group'], ['music', 'social'], 2, 720),
  row('bank', '/bæŋk/', 'ธนาคาร', 'แบงค์', 'noun', 'A2', 'I need to go to the bank this afternoon.', 'ฉันต้องไปธนาคารบ่ายนี้', ['financial institution'], ['money', 'daily'], 2, 320),
  row('bar', '/bɑːr/', 'บาร์', 'บาร์', 'noun', 'A2', 'We met at a bar near the station.', 'เราเจอกันที่บาร์ใกล้สถานี', ['pub'], ['social', 'daily'], 2, 680),
  row('base', '/beɪs/', 'ฐาน', 'เบส', 'noun', 'A2', 'The lamp has a heavy metal base.', 'โคมไฟมีฐานโลหะหนัก', ['foundation'], ['home', 'daily'], 2, 840),
  row('basic', '/ˈbeɪsɪk/', 'พื้นฐาน', 'เบส-สิค', 'adjective', 'A2', 'You need basic computer skills for this job.', 'งานนี้ต้องมีทักษะคอมพิวเตอร์พื้นฐาน', ['fundamental'], ['work', 'education'], 2, 510),
  row('basis', '/ˈbeɪsɪs/', 'พื้นฐาน', 'เบส-ซิส', 'noun', 'A2', 'We meet on a weekly basis.', 'เราเจอกันทุกสัปดาห์', ['foundation'], ['work', 'time'], 3, 1200),
  row('basket', '/ˈbæskɪt/', 'ตะกร้า', 'บาส-เก็ต', 'noun', 'A2', 'She put the fruit in a wicker basket.', 'เธอใส่ผลไม้ในตะกร้าหวาย', ['container'], ['shopping', 'daily'], 2, 1090),
  row('bath', '/bæθ/', 'อาบน้ำ', 'แบธ', 'noun', 'A2', 'I like to take a warm bath at night.', 'ฉันชอบแช่น้ำอุ่นตอนกลางคืน', ['bathtub'], ['home', 'health'], 2, 640),
  row('battle', '/ˈbætl/', 'การต่อสู้', 'แบท-เทิล', 'noun', 'A2', 'The team won an important battle yesterday.', 'ทีมชนะการแข่งขันสำคัญเมื่อวาน', ['fight'], ['sport', 'history'], 2, 980),
  row('beach', '/biːtʃ/', 'ชายหาด', 'บีช', 'noun', 'A2', 'We spent the day at the beach.', 'เราใช้เวลาทั้งวันที่ชายหาด', ['shore'], ['travel', 'leisure'], 2, 450),
  row('bean', '/biːn/', 'ถั่ว', 'บีน', 'noun', 'A2', 'Add beans to the soup for protein.', 'ใส่ถั่วในซุปเพื่อโปรตีน', ['legume'], ['food', 'daily'], 2, 1120),
  row('bear', '/ber/', 'หมี', 'แบร์', 'noun', 'A2', 'We saw a bear in the national park.', 'เราเห็นหมีในอุทยานแห่งชาติ', ['grizzly'], ['animals', 'nature'], 2, 1050),
  row('beat', '/biːt/', 'ตี, ชนะ', 'บีท', 'verb', 'A2', 'Our team beat the champions last night.', 'ทีมเราชนะแชมป์เมื่อคืน', ['defeat'], ['sport', 'daily'], 2, 580),
  row('beauty', '/ˈbjuːti/', 'ความงาม', 'บิว-ที', 'noun', 'A2', 'The beauty of the sunset took my breath away.', 'ความงามของพระอาทิตย์ตกทำให้ฉันประทับใจ', ['loveliness'], ['nature', 'daily'], 2, 820),
  row('because', '/bɪˈkɒz/', 'เพราะว่า', 'บี-คอส', 'conjunction', 'A2', 'I stayed home because I was sick.', 'ฉันอยู่บ้านเพราะป่วย', ['since'], ['grammar', 'daily'], 2, 180),
  row('become', '/bɪˈkʌm/', 'กลายเป็น', 'บี-คัม', 'verb', 'A2', 'She wants to become a doctor.', 'เธออยากเป็นหมอ', ['turn into'], ['work', 'education'], 2, 340),
  row('bedroom', '/ˈbedruːm/', 'ห้องนอน', 'เบด-รูม', 'noun', 'A2', 'My bedroom is on the second floor.', 'ห้องนอนของฉันอยู่ชั้นสอง', ['room'], ['home', 'daily'], 2, 620),
  row('beef', '/biːf/', 'เนื้อวัว', 'บีฟ', 'noun', 'A2', 'He ordered beef steak for dinner.', 'เขาสั่งสเต็กเนื้อเป็นมื้อเย็น', ['meat'], ['food', 'daily'], 2, 890),
  row('before', '/bɪˈfɔːr/', 'ก่อน', 'บี-ฟอร์', 'preposition', 'A2', 'Wash your hands before eating.', 'ล้างมือก่อนกิน', ['prior to'], ['time', 'daily'], 2, 150),
  row('behave', '/bɪˈheɪv/', 'ประพฤติตัว', 'บี-เฮฟ', 'verb', 'A2', 'Please behave well at the party.', 'กรุณาประพฤติตัวดีในงานปาร์ตี้', ['act'], ['social', 'daily'], 2, 860),
  row('behaviour', '/bɪˈheɪvjər/', 'พฤติกรรม', 'บี-เฮฟ-เวียร์', 'noun', 'A2', 'His behaviour improved after the talk.', 'พฤติกรรมของเขาดีขึ้นหลังคุยกัน', ['conduct'], ['education', 'daily'], 2, 910),
  row('believe', '/bɪˈliːv/', 'เชื่อ', 'บี-ลีฟ', 'verb', 'A2', 'I believe you can do it.', 'ฉันเชื่อว่าคุณทำได้', ['trust'], ['communication', 'daily'], 2, 280),
  row('belong', '/bɪˈlɒŋ/', 'เป็นของ', 'บี-ลอง', 'verb', 'A2', 'This bag belongs to my sister.', 'กระเป๋าใบนี้เป็นของน้องสาวฉัน', ['be owned'], ['daily', 'home'], 2, 770),
  row('below', '/bɪˈloʊ/', 'ด้านล่าง', 'บี-โลว์', 'preposition', 'A2', 'The temperature dropped below zero.', 'อุณหภูมิต่ำกว่าศูนย์', ['under'], ['weather', 'daily'], 2, 540),
  row('belt', '/belt/', 'เข็มขัด', 'เบลท์', 'noun', 'A2', 'He wore a leather belt with his jeans.', 'เขาใส่เข็มขัดหนังกับกางเกงยีนส์', ['strap'], ['clothing', 'daily'], 2, 980),
  row('benefit', '/ˈbenɪfɪt/', 'ประโยชน์', 'เบน-นิ-ฟิท', 'noun', 'A2', 'Exercise has many health benefits.', 'การออกกำลังกายมีประโยชน์ต่อสุขภาพมาก', ['advantage'], ['health', 'work'], 2, 720),
  row('beside', '/bɪˈsaɪd/', 'ข้างๆ', 'บี-ไซด์', 'preposition', 'A2', 'Sit beside me, please.', 'นั่งข้างฉันหน่อย', ['next to'], ['place', 'daily'], 2, 680),
  row('besides', '/bɪˈsaɪdz/', 'นอกจากนี้', 'บี-ไซด์ส์', 'adverb', 'A2', 'Besides English, she speaks French.', 'นอกจากภาษาอังกฤษ เธอยังพูดภาษาฝรั่งเศส', ['also'], ['language', 'daily'], 2, 1020),
  row('bet', '/bet/', 'เดิมพัน', 'เบ็ท', 'verb', 'A2', 'I bet it will rain tomorrow.', 'ฉันวางว่าพรุ่งนี้ฝนจะตก', ['wager'], ['daily', 'communication'], 2, 940),
  row('beyond', '/bɪˈjɒnd/', 'เกินกว่า', 'บี-ยอนด์', 'preposition', 'A2', 'The hills are just beyond the river.', 'เนินเขาอยู่เหนือแม่น้ำไปอีกนิด', ['past'], ['place', 'daily'], 2, 1080),
  row('bill', '/bɪl/', 'บิล, ใบแจ้งหนี้', 'บิล', 'noun', 'A2', 'Can we have the bill, please?', 'ขอบิลหน่อยครับ', ['check'], ['restaurant', 'money'], 2, 460),
  row('billion', '/ˈbɪljən/', 'พันล้าน', 'บิล-เลียน', 'number', 'A2', 'The company is worth billions of dollars.', 'บริษัทมีมูลค่าหลายพันล้านดอลลาร์', ['1000000000'], ['money', 'business'], 3, 1350),
  row('biology', '/baɪˈɒlədʒi/', 'ชีววิทยา', 'ไบ-ออ-ลา-จี', 'noun', 'A2', 'She enjoys studying biology at school.', 'เธอชอบเรียนชีววิทยาที่โรงเรียน', ['life science'], ['education', 'science'], 2, 1150),
  row('birth', '/bɜːrθ/', 'การเกิด', 'เบิร์ธ', 'noun', 'A2', 'They celebrated the birth of their son.', 'พวกเขาฉลองการเกิดของลูกชาย', ['delivery'], ['family', 'health'], 2, 810),
  row('bit', '/bɪt/', 'นิดหน่อย', 'บิท', 'noun', 'A2', 'Wait a bit. I am almost ready.', 'รอแป๊บ ฉันเกือบพร้อมแล้ว', ['little'], ['time', 'daily'], 2, 420),
  row('bite', '/baɪt/', 'กัด', 'ไบท์', 'verb', 'A2', 'The dog might bite if you scare it.', 'สุนัขอาจกัดถ้าคุณทำให้มันกลัว', ['nip'], ['animals', 'health'], 2, 870),
  row('blame', '/bleɪm/', 'ตำหนิ', 'เบลม', 'verb', 'A2', 'Do not blame others for your mistakes.', 'อย่าตำหนิคนอื่นเพราะความผิดของคุณ', ['accuse'], ['communication', 'daily'], 2, 960),
  row('blank', '/blæŋk/', 'ว่างเปล่า', 'แบลงค์', 'adjective', 'A2', 'Leave the last line blank.', 'เว้นบรรทัดสุดท้ายว่างไว้', ['empty'], ['education', 'daily'], 2, 1010),
  row('blanket', '/ˈblæŋkɪt/', 'ผ้าห่ม', 'แบลง-คิท', 'noun', 'A2', 'It is cold, so use an extra blanket.', 'อากาศหนาว ใช้ผ้าห่มเพิ่มอีกผืน', ['cover'], ['home', 'daily'], 2, 920),
  row('bleed', '/bliːd/', 'เลือดออก', 'บลีด', 'verb', 'A2', 'His finger started to bleed after the cut.', 'นิ้วของเขาเริ่มเลือดออกหลังถูกบาด', ['lose blood'], ['health', 'daily'], 2, 1180),
  row('blind', '/blaɪnd/', 'ตาบอด', 'ไบลด์', 'adjective', 'A2', 'The guide dog helps a blind person.', 'สุนัขนำทางช่วยคนตาบอด', ['sightless'], ['health', 'daily'], 2, 1100),
  row('block', '/blɒk/', 'บล็อก, ขวาง', 'บล็อก', 'noun', 'A2', 'There is a road block ahead.', 'มีการปิดกั้นถนนข้างหน้า', ['barrier'], ['travel', 'daily'], 2, 780),
  row('blog', '/blɒɡ/', 'บล็อก', 'บล็อก', 'noun', 'A2', 'She writes a travel blog online.', 'เธอเขียนบล็อกท่องเที่ยวออนไลน์', ['weblog'], ['technology', 'travel'], 2, 890),
  row('blonde', '/blɒnd/', 'สีบลอนด์', 'บลอนด์', 'adjective', 'A2', 'She has long blonde hair.', 'เธอมีผมบลอนด์ยาว', ['fair-haired'], ['appearance', 'daily'], 2, 1240),
  row('blood', '/blʌd/', 'เลือด', 'บลัด', 'noun', 'A2', 'The nurse took a blood sample.', 'พยาบาลเก็บตัวอย่างเลือด', ['plasma'], ['health', 'daily'], 2, 520),
  row('blow', '/bloʊ/', 'เป่า', 'โบลว์', 'verb', 'A2', 'Blow on the soup to cool it down.', 'เป่าซุปให้เย็นลง', ['exhale'], ['food', 'daily'], 2, 640),
  row('board', '/bɔːrd/', 'กระดาน, ขึ้นเครื่อง', 'บอร์ด', 'noun', 'A2', 'Please write your name on the board.', 'กรุณาเขียนชื่อบนกระดาน', ['plank'], ['education', 'travel'], 2, 560),
  row('boil', '/bɔɪl/', 'ต้ม', 'บอยล์', 'verb', 'A2', 'Boil the water before making tea.', 'ต้มน้ำก่อนชงชา', ['heat'], ['food', 'daily'], 2, 830),
  row('bold', '/boʊld/', 'กล้าหาญ', 'โบลด์', 'adjective', 'A2', 'It was a bold decision to move abroad.', 'การย้ายไปต่างประเทศเป็นการตัดสินใจที่กล้าหาญ', ['brave'], ['personality', 'daily'], 2, 1070),
  row('bomb', '/bɒm/', 'ระเบิด', 'บอมบ์', 'noun', 'A2', 'The movie is about a bomb threat.', 'หนังเรื่องนี้เกี่ยวกับภัยระเบิด', ['explosive'], ['news', 'society'], 3, 1450),
  row('bone', '/boʊn/', 'กระดูก', 'โบน', 'noun', 'A2', 'The X-ray showed a small bone fracture.', 'เอกซเรย์แสดงกระดูกร้าวเล็กน้อย', ['skeleton'], ['body', 'health'], 2, 910),
  row('book', '/bʊk/', 'จอง', 'บุ๊ค', 'verb', 'A2', 'I booked a table for two at seven.', 'ฉันจองโต๊ะสองที่นั่งตอนหนึ่งทุ่ม', ['reserve'], ['restaurant', 'travel'], 2, 480),
  row('boot', '/buːt/', 'รองเท้าบูท', 'บูท', 'noun', 'A2', 'Wear warm boots in the snow.', 'ใส่รองเท้าบูทในหิมะ', ['footwear'], ['clothing', 'weather'], 2, 860),
  row('border', '/ˈbɔːrdər/', 'ชายแดน', 'บอร์-เดอร์', 'noun', 'A2', 'We crossed the border into Laos.', 'เราข้ามชายแดนเข้าลาว', ['boundary'], ['travel', 'geography'], 2, 990),
  row('bored', '/bɔːrd/', 'เบื่อ', 'บอร์ด', 'adjective', 'A2', 'The kids were bored during the long trip.', 'เด็กๆ เบื่อระหว่างการเดินทางยาว', ['uninterested'], ['feelings', 'travel'], 2, 620),
  row('boring', '/ˈbɔːrɪŋ/', 'น่าเบื่อ', 'บอร์-ริง', 'adjective', 'A2', 'The lecture was a bit boring.', 'การบรรยายค่อนข้างน่าเบื่อ', ['dull'], ['education', 'feelings'], 2, 590),
  row('borrow', '/ˈbɒroʊ/', 'ยืม', 'บอร์-โรว์', 'verb', 'A2', 'Can I borrow your pen for a moment?', 'ขอยืมปากกาสักครู่ได้ไหม', ['lend reverse'], ['daily', 'school'], 2, 710),
  row('boss', '/bɒs/', 'เจ้านาย', 'บอส', 'noun', 'A2', 'My boss approved my holiday request.', 'เจ้านายอนุมัติคำขอลาพักร้อนของฉัน', ['manager'], ['work', 'daily'], 2, 540),
  row('bother', '/ˈbɒðər/', 'รบกวน', 'บอเธอร์', 'verb', 'A2', 'Sorry to bother you, but I need help.', 'ขอโทษที่รบกวน แต่ฉันต้องการความช่วยเหลือ', ['disturb'], ['communication', 'daily'], 2, 680),
  row('bottle', '/ˈbɒtl/', 'ขวด', 'บอท-เทิล', 'noun', 'A2', 'Bring a bottle of water to the gym.', 'เอาขวดน้ำไปยิม', ['container'], ['health', 'daily'], 2, 490),
  row('bottom', '/ˈbɒtəm/', 'ด้านล่าง', 'บอท-ทัม', 'noun', 'A2', 'The keys are at the bottom of the bag.', 'กุญแจอยู่ก้นกระเป๋า', ['base'], ['place', 'daily'], 2, 450),
  row('bowl', '/boʊl/', 'ชาม', 'โบล', 'noun', 'A2', 'She ate a bowl of noodles for lunch.', 'เธอกินก๋วยเตี๋ยวหนึ่งชามเป็นมื้อกลางวัน', ['dish'], ['food', 'daily'], 2, 720),
  row('brain', '/breɪn/', 'สมอง', 'เบรน', 'noun', 'A2', 'Sleep is good for your brain.', 'การนอนดีต่อสมอง', ['mind'], ['health', 'education'], 2, 640),
  row('branch', '/bræntʃ/', 'สาขา', 'แบรนช์', 'noun', 'A2', 'The bank opened a new branch nearby.', 'ธนาคารเปิดสาขาใหม่ใกล้ๆ', ['office'], ['work', 'money'], 2, 880),
  row('brave', '/breɪv/', 'กล้าหาญ', 'เบรฟ', 'adjective', 'A2', 'The firefighter was very brave.', 'นักดับเพลิงกล้าหาญมาก', ['courageous'], ['personality', 'work'], 2, 820),
  row('bread', '/bred/', 'ขนมปัง', 'เบรด', 'noun', 'A2', 'Fresh bread smells wonderful.', 'ขนมปังสดหอมมาก', ['loaf'], ['food', 'daily'], 2, 380),
  row('break', '/breɪk/', 'พัก', 'เบรก', 'noun', 'A2', 'Let us take a short break.', 'พักสักครู่กัน', ['rest'], ['work', 'daily'], 2, 360),
  row('breath', '/breθ/', 'ลมหายใจ', 'เบรธ', 'noun', 'A2', 'Take a deep breath and relax.', 'หายใจลึกๆ แล้วผ่อนคลาย', ['air'], ['health', 'daily'], 2, 740),
  row('breathe', '/briːð/', 'หายใจ', 'บรีธ', 'verb', 'A2', 'It is hard to breathe in smoky air.', 'หายใจในอากาศมีควันลำบาก', ['inhale'], ['health', 'daily'], 2, 780),
  row('brick', '/brɪk/', 'อิฐ', 'บริค', 'noun', 'A2', 'The house has a red brick wall.', 'บ้านมีกำแพงอิฐสีแดง', ['block'], ['home', 'daily'], 2, 1140),
  row('bridge', '/brɪdʒ/', 'สะพาน', 'บริดจ์', 'noun', 'A2', 'We walked across the old stone bridge.', 'เราเดินข้ามสะพานหินเก่า', ['overpass'], ['travel', 'place'], 2, 670),
  row('brief', '/briːf/', 'สั้นๆ', 'บรีฟ', 'adjective', 'A2', 'The manager gave a brief speech.', 'ผู้จัดการกล่าวสุนทรพจน์สั้นๆ', ['short'], ['work', 'communication'], 2, 950),
  row('bright', '/braɪt/', 'สว่าง', 'ไบรท์', 'adjective', 'A2', 'The room is bright and cheerful.', 'ห้องสว่างและร่าเริง', ['light'], ['home', 'daily'], 2, 510),
  row('brilliant', '/ˈbrɪliənt/', 'ยอดเยี่ยม', 'บริล-เลียนท์', 'adjective', 'A2', 'That was a brilliant idea!', 'นั่นเป็นความคิดที่ยอดเยี่ยม!', ['excellent'], ['communication', 'daily'], 2, 870),
  row('bring', '/brɪŋ/', 'นำมา', 'บริง', 'verb', 'A2', 'Do not forget to bring your passport.', 'อย่าลืมนำพาสปอร์ตมา', ['carry'], ['travel', 'daily'], 2, 320),
  row('broad', '/brɔːd/', 'กว้าง', 'บรอด', 'adjective', 'A2', 'The river is very broad at this point.', 'แม่น้ำกว้างมากในจุดนี้', ['wide'], ['nature', 'daily'], 2, 1020),
  row('broadcast', '/ˈbrɔːdkæst/', 'ออกอากาศ', 'บรอด-คาสท์', 'verb', 'A2', 'The match will be broadcast live tonight.', 'การแข่งขันจะถ่ายทอดสดคืนนี้', ['air'], ['media', 'sport'], 3, 1380),
  row('broken', '/ˈbroʊkən/', 'พัง', 'โบร-เคิ่น', 'adjective', 'A2', 'My phone screen is broken.', 'หน้าจอโทรศัพท์ฉันพัง', ['damaged'], ['technology', 'daily'], 2, 580),
  row('brush', '/brʌʃ/', 'แปรง', 'บรัช', 'noun', 'A2', 'Use a soft brush to clean the shoes.', 'ใช้แปรงนุ่มทำความสะอาดรองเท้า', ['bristle tool'], ['home', 'daily'], 2, 760),
  row('bucket', '/ˈbʌkɪt/', 'ถัง', 'บัค-เก็ต', 'noun', 'A2', 'Fill the bucket with soapy water.', 'เติมถังด้วยน้ำสบู่', ['pail'], ['home', 'daily'], 2, 1080),
  row('budget', '/ˈbʌdʒɪt/', 'งบประมาณ', 'บัค-จิท', 'noun', 'A2', 'We need to stick to our monthly budget.', 'เราต้องใช้จ่ายตามงบประมาณรายเดือน', ['plan'], ['money', 'daily'], 2, 840),
  row('build', '/bɪld/', 'สร้าง', 'บิลด์', 'verb', 'A2', 'They plan to build a new school.', 'พวกเขาวางแผนสร้างโรงเรียนใหม่', ['construct'], ['work', 'education'], 2, 620),
  row('building', '/ˈbɪldɪŋ/', 'อาคาร', 'บิล-ดิ้ง', 'noun', 'A2', 'That tall building is our office.', 'อาคารสูงนั้นคือสำนักงานของเรา', ['structure'], ['place', 'work'], 2, 480),
  row('bullet', '/ˈbʊlɪt/', 'กระสุน', 'บุล-เลิท', 'noun', 'A2', 'The news reported a bullet was found.', 'ข่าวรายงานว่าพบกระสุน', ['round'], ['news', 'society'], 3, 1500),
  row('bunch', '/bʌntʃ/', 'พวง, กลุ่ม', 'บัณช์', 'noun', 'A2', 'She bought a bunch of bananas.', 'เธอซื้อกล้วยหนึ่งหวี', ['cluster'], ['food', 'daily'], 2, 920),
  row('burn', '/bɜːrn/', 'เผา, ไหม้', 'เบิร์น', 'verb', 'A2', 'Be careful not to burn the toast.', 'ระวังอย่าเผาขนมปังปิ้ง', ['scorch'], ['food', 'daily'], 2, 690),
  row('bury', '/ˈberi/', 'ฝัง', 'เบอร์-รี่', 'verb', 'A2', 'The dog likes to bury bones in the yard.', 'สุนัขชอบฝังกระดูกในสนาม', ['inter'], ['animals', 'daily'], 2, 1180),
  row('bus', '/bʌs/', 'รถบัส', 'บัส', 'noun', 'A2', 'The bus was delayed by traffic.', 'รถบัสล่าช้าเพราะรถติด', ['coach'], ['travel', 'daily'], 2, 280),
  row('business', '/ˈbɪznəs/', 'ธุรกิจ', 'บิส-นิส', 'noun', 'A2', 'She runs her own small business.', 'เธอบริหารธุรกิจเล็กๆ ของตัวเอง', ['company'], ['work', 'money'], 2, 390),
  row('busy', '/ˈbɪzi/', 'ยุ่ง', 'บิซ-ซี่', 'adjective', 'A2', 'Sorry, I am too busy to chat now.', 'ขอโทษ ตอนนี้ฉันยุ่งเกินจะคุย', ['occupied'], ['work', 'daily'], 2, 350),
  row('but', '/bʌt/', 'แต่', 'บัท', 'conjunction', 'A2', 'I wanted to go, but I was tired.', 'ฉันอยากไป แต่ฉันเหนื่อย', ['however'], ['grammar', 'daily'], 2, 120),
  row('butter', '/ˈbʌtər/', 'เนย', 'บัท-เทอร์', 'noun', 'A2', 'Spread butter on the warm bread.', 'ทาเนยบนขนมปังอุ่นๆ', ['dairy'], ['food', 'daily'], 2, 810),
  row('button', '/ˈbʌtn/', 'ปุ่ม', 'บัท-เทิ่น', 'noun', 'A2', 'Press the red button to start.', 'กดปุ่มสีแดงเพื่อเริ่ม', ['switch'], ['technology', 'daily'], 2, 560),
  row('buy', '/baɪ/', 'ซื้อ', 'บาย', 'verb', 'A2', 'I need to buy groceries after work.', 'ฉันต้องซื้อของหลังเลิกงาน', ['purchase'], ['shopping', 'daily'], 2, 200),
]

function validate(entries) {
  if (!Array.isArray(entries)) throw new Error('Must be array')
  const words = new Set()
  for (const item of entries) {
    for (const key of REQUIRED) {
      if (!(key in item)) throw new Error(`Missing ${key} in ${item.word}`)
    }
    const w = item.word.toLowerCase()
    if (words.has(w)) throw new Error(`Duplicate in file: ${item.word}`)
    words.add(w)
    if (item.level !== 'A2') throw new Error(`Level must be A2: ${item.word}`)
  }
}

const globalSeen = loadExistingWords()
const toAdd = NEW_WORDS.filter((e) => !globalSeen.has(e.word.toLowerCase()))

const a2Path = join(dataDir, 'a2.json')
let merged = []
if (existsSync(a2Path)) {
  merged = JSON.parse(readFileSync(a2Path, 'utf8'))
}
const fileSeen = new Set(merged.map((e) => e.word.toLowerCase()))
for (const entry of toAdd) {
  if (!fileSeen.has(entry.word.toLowerCase())) {
    merged.push(entry)
    fileSeen.add(entry.word.toLowerCase())
  }
}

if (toAdd.length < TARGET && merged.length < TARGET) {
  console.error(`Only ${toAdd.length} new A2 words (${merged.length} in a2.json)`)
  process.exit(1)
}

// First-time file: cap at TARGET entries
if (!existsSync(a2Path) && merged.length > TARGET) {
  merged = merged.slice(0, TARGET)
}

const json = JSON.stringify(merged, null, 2) + '\n'
JSON.parse(json)
validate(merged)
writeFileSync(a2Path, json)
console.log(`a2.json: ${merged.length} entries (${toAdd.length} new words appended)`)
