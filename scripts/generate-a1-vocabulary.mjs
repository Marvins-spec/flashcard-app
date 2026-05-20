import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '../src/data')
const REQUIRED = ['word', 'ipa', 'thaiMeaning', 'thaiReading', 'type', 'level', 'example', 'exampleThai', 'synonyms', 'tags', 'difficulty', 'frequencyRank']

function loadExistingWords() {
  const seen = new Set()
  const legacy = join(dataDir, 'vocabulary.json')
  if (existsSync(legacy)) {
    JSON.parse(readFileSync(legacy, 'utf8')).forEach((e) => seen.add(e.word.toLowerCase()))
  }
  const a1 = join(dataDir, 'a1.json')
  if (existsSync(a1)) {
    JSON.parse(readFileSync(a1, 'utf8')).forEach((e) => seen.add(e.word.toLowerCase()))
  }
  return seen
}

function row(...fields) {
  const [word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank] = fields
  return { word, ipa, thaiMeaning, thaiReading, type, level, example, exampleThai, synonyms, tags, difficulty, frequencyRank }
}

const NEW_WORDS = [
  row('apple', '/ˈæpl/', 'แอปเปิ้ล', 'แอป-เปิล', 'noun', 'A1', 'I eat an apple every morning.', 'ฉันกินแอปเปิ้ลทุกเช้า', ['fruit'], ['food', 'daily'], 1, 120),
  row('banana', '/bəˈnænə/', 'กล้วย', 'บะ-แนน-นะ', 'noun', 'A1', 'She bought three bananas at the market.', 'เธอซื้อกล้วยสามลูกที่ตลาด', ['fruit'], ['food', 'daily'], 1, 280),
  row('bread', '/bred/', 'ขนมปัง', 'เบรด', 'noun', 'A1', 'We need bread for breakfast.', 'เราต้องการขนมปังสำหรับมื้อเช้า', ['loaf'], ['food', 'daily'], 1, 350),
  row('water', '/ˈwɔːtər/', 'น้ำ', 'วอเทอร์', 'noun', 'A1', 'Can I have a glass of water?', 'ขอน้ำหนึ่งแก้วได้ไหม', ['drink'], ['food', 'daily'], 1, 45),
  row('milk', '/mɪlk/', 'นม', 'มิลค์', 'noun', 'A1', 'The child drinks milk before bed.', 'เด็กดื่มนมก่อนนอน', ['dairy'], ['food', 'daily'], 1, 190),
  row('coffee', '/ˈkɒfi/', 'กาแฟ', 'คอฟ-ฟี่', 'noun', 'A1', 'He drinks coffee every morning.', 'เขาดื่มกาแฟทุกเช้า', ['espresso'], ['food', 'daily'], 1, 210),
  row('tea', '/tiː/', 'ชา', 'ที', 'noun', 'A1', 'Would you like some tea?', 'คุณอยากดื่มชาไหม', ['chai'], ['food', 'daily'], 1, 240),
  row('breakfast', '/ˈbrekfəst/', 'อาหารเช้า', 'เบรค-ฟัส', 'noun', 'A1', 'Breakfast is ready on the table.', 'อาหารเช้าพร้อมบนโต๊ะแล้ว', ['morning meal'], ['food', 'daily'], 1, 420),
  row('lunch', '/lʌntʃ/', 'อาหารกลางวัน', 'ลันช์', 'noun', 'A1', 'Let us meet for lunch at noon.', 'ไปกินข้าวกลางวันด้วยกันตอนเที่ยงนะ', ['midday meal'], ['food', 'daily'], 1, 380),
  row('dinner', '/ˈdɪnər/', 'อาหารเย็น', 'ดิน-เนอร์', 'noun', 'A1', 'We had dinner with our neighbors.', 'เรากินข้ำเย็นกับเพื่อนบ้าน', ['supper'], ['food', 'daily'], 1, 310),
  row('hungry', '/ˈhʌŋɡri/', 'หิว', 'ฮัง-กรี', 'adjective', 'A1', 'I am hungry. Let us eat.', 'ฉันหิวแล้ว ไปกินข้าวกันเถอะ', ['starving'], ['food', 'feelings'], 1, 520),
  row('thirsty', '/ˈθɜːrsti/', 'กระหายน้ำ', 'เทอร์ส-ตี', 'adjective', 'A1', 'It is hot and I feel thirsty.', 'อากาศร้อน ฉันรู้สึกกระหายน้ำ', ['parched'], ['food', 'feelings'], 1, 680),
  row('tired', '/ˈtaɪərd/', 'เหนื่อย', 'ไทร์ด', 'adjective', 'A1', 'She was tired after work.', 'เธอเหนื่อยหลังเลิกงาน', ['exhausted'], ['health', 'daily'], 1, 410),
  row('sad', '/sæd/', 'เศร้า', 'แซด', 'adjective', 'A1', 'He felt sad when his friend left.', 'เขารู้สึกเศร้าเมื่อเพื่อนจากไป', ['unhappy'], ['feelings', 'daily'], 1, 890),
  row('angry', '/ˈæŋɡri/', 'โกรธ', 'แอง-กรี', 'adjective', 'A1', 'Do not talk to him when he is angry.', 'อย่าคุยกับเขาตอนที่เขาโกรธ', ['mad'], ['feelings', 'daily'], 2, 720),
  row('cold', '/koʊld/', 'หนาว', 'โคลด์', 'adjective', 'A1', 'It is cold outside today.', 'วันนี้ข้างนอกหนาว', ['chilly'], ['weather', 'daily'], 1, 180),
  row('hot', '/hɒt/', 'ร้อน', 'ฮอท', 'adjective', 'A1', 'The soup is too hot to eat.', 'ซุปร้อนเกินกว่าจะกินได้', ['warm'], ['weather', 'daily'], 1, 150),
  row('warm', '/wɔːrm/', 'อุ่น', 'วอร์ม', 'adjective', 'A1', 'The room feels warm and cozy.', 'ห้องรู้สึกอุ่นและสบาย', ['mild'], ['weather', 'daily'], 1, 430),
  row('rain', '/reɪn/', 'ฝน', 'เรน', 'noun', 'A1', 'Take an umbrella. It might rain.', 'เอาร่มไปด้วย ฝนอาจจะตก', ['rainfall'], ['weather', 'nature'], 1, 320),
  row('sunny', '/ˈsʌni/', 'แดดจัด', 'ซัน-นี่', 'adjective', 'A1', 'It is sunny and perfect for a walk.', 'อากาศแดดดี เหมาะสำหรับเดินเล่น', ['bright'], ['weather', 'nature'], 1, 610),
  row('cloud', '/klaʊd/', 'เมฆ', 'คลาวด์', 'noun', 'A1', 'Dark clouds are coming this way.', 'เมฆดำกำลังเคลื่อนมาทางนี้', ['clouds'], ['weather', 'nature'], 1, 740),
  row('wind', '/wɪnd/', 'ลม', 'วินด์', 'noun', 'A1', 'The wind blew my hat away.', 'ลมพัดหมวกของฉันหลุดไป', ['breeze'], ['weather', 'nature'], 1, 560),
  row('snow', '/snoʊ/', 'หิมะ', 'สโนว์', 'noun', 'A1', 'Children love playing in the snow.', 'เด็กๆ ชอบเล่นหิมะ', ['snowfall'], ['weather', 'nature'], 2, 980),
  row('morning', '/ˈmɔːrnɪŋ/', 'ตอนเช้า', 'มอร์-นิง', 'noun', 'A1', 'I go jogging every morning.', 'ฉันวิ่งจ็อกกิ้งทุกเช้า', ['dawn'], ['time', 'daily'], 1, 270),
  row('evening', '/ˈiːvnɪŋ/', 'ตอนเย็น', 'อีฟ-นิง', 'noun', 'A1', 'We walk in the park every evening.', 'เราเดินในสวนสาธารณะทุกเย็น', ['dusk'], ['time', 'daily'], 1, 390),
  row('night', '/naɪt/', 'กลางคืน', 'ไนท์', 'noun', 'A1', 'Good night. Sleep well.', 'ราตรีสวัสดิ์ นอนหลับฝันดี', ['nighttime'], ['time', 'daily'], 1, 220),
  row('today', '/təˈdeɪ/', 'วันนี้', 'ทู-เดย์', 'adverb', 'A1', 'What are you doing today?', 'วันนี้คุณทำอะไร', ['now'], ['time', 'daily'], 1, 95),
  row('tomorrow', '/təˈmɒroʊ/', 'พรุ่งนี้', 'ทู-มอร์-โรว์', 'adverb', 'A1', 'See you tomorrow at school.', 'แล้วเจอกันพรุ่งนี้ที่โรงเรียน', ['next day'], ['time', 'daily'], 1, 340),
  row('yesterday', '/ˈjestərdeɪ/', 'เมื่อวาน', 'เยส-เทอร์-เดย์', 'adverb', 'A1', 'I called you yesterday evening.', 'ฉันโทรหาคุณเมื่อวานเย็น', ['previous day'], ['time', 'daily'], 1, 470),
  row('week', '/wiːk/', 'สัปดาห์', 'วีค', 'noun', 'A1', 'I work five days a week.', 'ฉันทำงานห้าวันต่อสัปดาห์', ['seven days'], ['time', 'daily'], 1, 200),
  row('month', '/mʌnθ/', 'เดือน', 'มันธ', 'noun', 'A1', 'My birthday is next month.', 'วันเกิดของฉันอยู่เดือนหน้า', ['calendar month'], ['time', 'daily'], 1, 260),
  row('year', '/jɪr/', 'ปี', 'เยียร์', 'noun', 'A1', 'Happy New Year!', 'สวัสดีปีใหม่', ['twelve months'], ['time', 'daily'], 1, 110),
  row('hour', '/ˈaʊər/', 'ชั่วโมง', 'เอา-เออร์', 'noun', 'A1', 'The movie lasts two hours.', 'หนังยาวสองชั่วโมง', ['60 minutes'], ['time', 'daily'], 1, 300),
  row('minute', '/ˈmɪnɪt/', 'นาที', 'มิน-นิท', 'noun', 'A1', 'Wait a minute, please.', 'รอสักครู่นะ', ['moment'], ['time', 'daily'], 1, 360),
  row('early', '/ˈɜːrli/', 'เร็ว', 'เออร์-ลี่', 'adjective', 'A1', 'She always wakes up early.', 'เธอตื่นเช้าเสมอ', ['prompt'], ['time', 'daily'], 1, 440),
  row('late', '/leɪt/', 'สาย', 'เลท', 'adjective', 'A1', 'Sorry, I am late for class.', 'ขอโทษ ฉันมาสาย', ['delayed'], ['time', 'daily'], 1, 400),
  row('fast', '/fæst/', 'เร็ว', 'แฟสต์', 'adjective', 'A1', 'This train is very fast.', 'รถไฟขบวนนี้เร็วมาก', ['quick'], ['daily', 'travel'], 1, 330),
  row('slow', '/sloʊ/', 'ช้า', 'โสลว์', 'adjective', 'A1', 'Traffic is slow during rush hour.', 'การจราจรช้าในช่วงเร่งด่วน', ['sluggish'], ['daily', 'travel'], 1, 510),
  row('big', '/bɪɡ/', 'ใหญ่', 'บิ๊ก', 'adjective', 'A1', 'They live in a big house.', 'พวกเขาอยู่บ้านหลังใหญ่', ['large'], ['daily', 'description'], 1, 130),
  row('small', '/smɔːl/', 'เล็ก', 'สมอล', 'adjective', 'A1', 'I have a small bag with me.', 'ฉันมีกระเป๋าใบเล็กติดตัว', ['little'], ['daily', 'description'], 1, 170),
  row('long', '/lɔːŋ/', 'ยาว', 'ลอง', 'adjective', 'A1', 'It was a long day at work.', 'วันทำงานยาวนานมาก', ['lengthy'], ['daily', 'description'], 1, 160),
  row('short', '/ʃɔːrt/', 'สั้น', 'ชอร์ต', 'adjective', 'A1', 'She has short hair.', 'เธอผมสั้น', ['brief'], ['daily', 'description'], 1, 290),
  row('new', '/njuː/', 'ใหม่', 'นิว', 'adjective', 'A1', 'I bought a new phone yesterday.', 'ฉันซื้อโทรศัพท์เครื่องใหม่เมื่อวาน', ['fresh'], ['daily', 'shopping'], 1, 125),
  row('young', '/jʌŋ/', 'หนุ่ม, เด็ก', 'ยัง', 'adjective', 'A1', 'She is young but very talented.', 'เธอยังเด็กแต่มีความสามารถมาก', ['youthful'], ['people', 'daily'], 1, 370),
  row('clean', '/kliːn/', 'สะอาด', 'คลีน', 'adjective', 'A1', 'Please keep your room clean.', 'กรุณารักษาห้องให้สะอาด', ['tidy'], ['home', 'daily'], 1, 480),
  row('dirty', '/ˈdɜːrti/', 'สกปรก', 'เดอร์-ตี', 'adjective', 'A1', 'Your shoes are dirty from the mud.', 'รองเท้าของคุณเลอะจากโคลน', ['filthy'], ['home', 'daily'], 1, 650),
  row('difficult', '/ˈdɪfɪkəlt/', 'ยาก', 'ดิฟ-ฟิ-คัลท์', 'adjective', 'A2', 'This question is difficult for me.', 'คำถามนี้ยากสำหรับฉัน', ['hard'], ['education', 'daily'], 2, 540),
  row('open', '/ˈoʊpən/', 'เปิด', 'โอ-เพิ่น', 'verb', 'A1', 'Can you open the window?', 'คุณเปิดหน้าต่างได้ไหม', ['unlock'], ['home', 'daily'], 1, 230),
  row('close', '/kloʊz/', 'ปิด', 'โคลส์', 'verb', 'A1', 'Please close the door quietly.', 'กรุณาปิดประตูเบาๆ', ['shut'], ['home', 'daily'], 1, 250),
  row('start', '/stɑːrt/', 'เริ่ม', 'สตาร์ท', 'verb', 'A1', 'Class starts at eight o clock.', 'คาบเรียนเริ่มแปดโมง', ['begin'], ['school', 'daily'], 1, 195),
  row('stop', '/stɒp/', 'หยุด', 'สต็อป', 'verb', 'A1', 'The bus stops here.', 'รถบัสหยุดที่นี่', ['halt'], ['travel', 'daily'], 1, 215),
  row('buy', '/baɪ/', 'ซื้อ', 'บาย', 'verb', 'A1', 'I want to buy some fruit.', 'ฉันอยากซื้อผลไม้', ['purchase'], ['shopping', 'daily'], 1, 140),
  row('sell', '/sel/', 'ขาย', 'เซล', 'verb', 'A1', 'They sell fresh fish at the market.', 'พวกเขาขายปลาสดที่ตลาด', ['offer'], ['shopping', 'daily'], 1, 460),
  row('pay', '/peɪ/', 'จ่าย', 'เพย์', 'verb', 'A1', 'I will pay by card.', 'ฉันจะจ่ายด้วยบัตร', ['settle'], ['shopping', 'daily'], 1, 175),
  row('cost', '/kɒst/', 'ราคา, ค่าใช้จ่าย', 'คอสต์', 'verb', 'A2', 'How much does this shirt cost?', 'เสื้อตัวนี้ราคาเท่าไหร่', ['price'], ['shopping', 'daily'], 2, 620),
  row('cheap', '/tʃiːp/', 'ถูก', 'ชีพ', 'adjective', 'A1', 'This restaurant is cheap and good.', 'ร้านนี้ถูกและอร่อย', ['inexpensive'], ['shopping', 'daily'], 1, 530),
  row('expensive', '/ɪkˈspensɪv/', 'แพง', 'เอ็กส์-เพน-ซิฟ', 'adjective', 'A2', 'That watch looks expensive.', 'นาฬิกาเรือนนั้นดูแพง', ['costly'], ['shopping', 'daily'], 2, 700),
  row('shop', '/ʃɒp/', 'ร้านค้า', 'ช็อป', 'noun', 'A1', 'The shop opens at nine.', 'ร้านเปิดเก้าโมง', ['store'], ['shopping', 'daily'], 1, 275),
  row('market', '/ˈmɑːrkɪt/', 'ตลาด', 'มาร์-เก็ต', 'noun', 'A1', 'We buy vegetables at the market.', 'เราซื้อผักที่ตลาด', ['bazaar'], ['shopping', 'daily'], 1, 355),
  row('street', '/striːt/', 'ถนน', 'สตรีท', 'noun', 'A1', 'Our house is on a quiet street.', 'บ้านเราอยู่บนถนนที่เงียบสงบ', ['road'], ['places', 'daily'], 1, 285),
  row('road', '/roʊd/', 'ถนน', 'โรด', 'noun', 'A1', 'Be careful when you cross the road.', 'ระวังตอนข้ามถนน', ['street'], ['travel', 'daily'], 1, 165),
  row('car', '/kɑːr/', 'รถยนต์', 'คาร์', 'noun', 'A1', 'My father drives a red car.', 'พ่อขับรถสีแดง', ['automobile'], ['travel', 'daily'], 1, 100),
  row('bus', '/bʌs/', 'รถบัส', 'บัส', 'noun', 'A1', 'I take the bus to work.', 'ฉันนั่งรถบัสไปทำงาน', ['coach'], ['travel', 'daily'], 1, 245),
  row('train', '/treɪn/', 'รถไฟ', 'เทรน', 'noun', 'A1', 'The train leaves in ten minutes.', 'รถไฟออกในอีกสิบนาที', ['railway'], ['travel', 'daily'], 1, 315),
  row('bicycle', '/ˈbaɪsɪkl/', 'จักรยาน', 'ไบ-ซิ-เคิล', 'noun', 'A1', 'She rides her bicycle to school.', 'เธอขี่จักรยานไปโรงเรียน', ['bike'], ['travel', 'daily'], 1, 780),
  row('walk', '/wɔːk/', 'เดิน', 'วอล์ค', 'verb', 'A1', 'We walk to the park on Sundays.', 'เราเดินไปสวนสาธารณะทุกวันอาทิตย์', ['stroll'], ['health', 'daily'], 1, 205),
  row('run', '/rʌn/', 'วิ่ง', 'รัน', 'verb', 'A1', 'He runs every morning before work.', 'เขาวิ่งทุกเช้าก่อนทำงาน', ['jog'], ['health', 'daily'], 1, 185),
  row('drive', '/draɪv/', 'ขับ', 'ไดรฟ์', 'verb', 'A1', 'Can you drive me to the station?', 'คุณขับรถพาฉันไปสถานีได้ไหม', ['operate'], ['travel', 'daily'], 1, 335),
  row('turn', '/tɜːrn/', 'เลี้ยว', 'เทิร์น', 'verb', 'A1', 'Turn left at the traffic light.', 'เลี้ยวซ้ายที่ไฟจราจร', ['rotate'], ['travel', 'daily'], 1, 450),
  row('left', '/left/', 'ซ้าย', 'เลฟท์', 'adjective', 'A1', 'The bank is on the left side.', 'ธนาคารอยู่ทางซ้าย', ['left side'], ['travel', 'daily'], 1, 155),
  row('right', '/raɪt/', 'ขวา', 'ไรท์', 'adjective', 'A1', 'Turn right after the bridge.', 'เลี้ยวขวาหลังสะพาน', ['right side'], ['travel', 'daily'], 1, 145),
  row('map', '/mæp/', 'แผนที่', 'แมป', 'noun', 'A1', 'Use a map to find the museum.', 'ใช้แผนที่หาพิพิธภัณฑ์', ['chart'], ['travel', 'daily'], 1, 590),
  row('hotel', '/hoʊˈtel/', 'โรงแรม', 'โฮ-เทล', 'noun', 'A1', 'We stayed at a small hotel by the beach.', 'เราพักโรงแรมเล็กๆ ริมชายหาด', ['inn'], ['travel', 'daily'], 1, 640),
  row('room', '/ruːm/', 'ห้อง', 'รูม', 'noun', 'A1', 'My room is upstairs on the right.', 'ห้องของฉันอยู่ชั้นบนทางขวา', ['chamber'], ['home', 'daily'], 1, 135),
  row('bed', '/bed/', 'เตียง', 'เบด', 'noun', 'A1', 'I go to bed at ten o clock.', 'ฉันเข้านอนสี่ทุ่ม', ['mattress'], ['home', 'daily'], 1, 295),
  row('bathroom', '/ˈbæθruːm/', 'ห้องน้ำ', 'แบธ-รูม', 'noun', 'A1', 'The bathroom is at the end of the hall.', 'ห้องน้ำอยู่ปลายทางเดิน', ['restroom'], ['home', 'daily'], 1, 670),
  row('kitchen', '/ˈkɪtʃɪn/', 'ห้องครัว', 'คิท-เชิ่น', 'noun', 'A1', 'Mom is cooking in the kitchen.', 'แม่กำลังทำอาหารในครัว', ['cooking area'], ['home', 'daily'], 1, 580),
  row('door', '/dɔːr/', 'ประตู', 'ดอร์', 'noun', 'A1', 'Someone is knocking on the door.', 'มีคนเคาะประตู', ['entrance'], ['home', 'daily'], 1, 265),
  row('window', '/ˈwɪndoʊ/', 'หน้าต่าง', 'วิน-โดว์', 'noun', 'A1', 'Open the window for fresh air.', 'เปิดหน้าต่างให้อากาศถ่ายเท', ['glass pane'], ['home', 'daily'], 1, 490),
  row('table', '/ˈteɪbl/', 'โต๊ะ', 'เทย์-เบิล', 'noun', 'A1', 'Put the books on the table.', 'วางหนังสือบนโต๊ะ', ['desk'], ['home', 'daily'], 1, 365),
  row('chair', '/tʃer/', 'เก้าอี้', 'แชร์', 'noun', 'A1', 'Please take a chair and sit down.', 'นั่งเก้าอี้ลงได้เลย', ['seat'], ['home', 'daily'], 1, 405),
  row('phone', '/foʊn/', 'โทรศัพท์', 'โฟน', 'noun', 'A1', 'My phone battery is low.', 'แบตเตอรี่โทรศัพท์ฉันใกล้หมด', ['mobile'], ['technology', 'daily'], 1, 90),
  row('computer', '/kəmˈpjuːtər/', 'คอมพิวเตอร์', 'คอม-พิว-เตอร์', 'noun', 'A1', 'I use a computer for my homework.', 'ฉันใช้คอมพิวเตอร์ทำการบ้าน', ['PC'], ['technology', 'daily'], 1, 425),
  row('internet', '/ˈɪntərnet/', 'อินเทอร์เน็ต', 'อิน-เทอร์-เน็ต', 'noun', 'A2', 'The internet is slow today.', 'อินเทอร์เน็ตวันนี้ช้า', ['web'], ['technology', 'daily'], 2, 380),
  row('email', '/ˈiːmeɪl/', 'อีเมล', 'อี-เมล', 'noun', 'A2', 'Send me an email with the details.', 'ส่งอีเมลพร้อมรายละเอียดมาให้ฉัน', ['message'], ['technology', 'daily'], 2, 550),
  row('friend', '/frend/', 'เพื่อน', 'เฟรนด์', 'noun', 'A1', 'She is my best friend from school.', 'เธอเป็นเพื่อนสนิทของฉันจากโรงเรียน', ['buddy'], ['people', 'daily'], 1, 105),
  row('family', '/ˈfæməli/', 'ครอบครัว', 'แฟม-มิ-ลี่', 'noun', 'A1', 'I love spending time with my family.', 'ฉันชอบใช้เวลากับครอบครัว', ['relatives'], ['people', 'daily'], 1, 115),
  row('brother', '/ˈbrʌðər/', 'พี่/น้องชาย', 'บราเธอร์', 'noun', 'A1', 'My brother plays football on weekends.', 'พี่ชายของฉันเล่นฟุตบอลวันหยุด', ['sibling'], ['people', 'family'], 1, 500),
  row('sister', '/ˈsɪstər/', 'พี่/น้องสาว', 'ซิสเตอร์', 'noun', 'A1', 'Her sister studies at university.', 'น้องสาวของเธอเรียนมหาวิทยาลัย', ['sibling'], ['people', 'family'], 1, 475),
  row('mother', '/ˈmʌðər/', 'แม่', 'มาเธอร์', 'noun', 'A1', 'My mother cooks delicious food.', 'แม่ของฉันทำอาหารอร่อย', ['mom'], ['people', 'family'], 1, 88),
  row('father', '/ˈfɑːðər/', 'พ่อ', 'ฟาเธอร์', 'noun', 'A1', 'His father works in a hospital.', 'พ่อของเขาทำงานในโรงพยาบาล', ['dad'], ['people', 'family'], 1, 92),
  row('child', '/tʃaɪld/', 'เด็ก', 'ไชลด์', 'noun', 'A1', 'The child is playing in the garden.', 'เด็กกำลังเล่นในสวน', ['kid'], ['people', 'family'], 1, 255),
  row('baby', '/ˈbeɪbi/', 'ทารก', 'เบบี้', 'noun', 'A1', 'The baby is sleeping peacefully.', 'ทารกกำลังนอนหลับสบาย', ['infant'], ['people', 'family'], 1, 395),
  row('name', '/neɪm/', 'ชื่อ', 'เนม', 'noun', 'A1', 'What is your name?', 'คุณชื่ออะไร', ['given name'], ['people', 'daily'], 1, 70),
  row('hello', '/həˈloʊ/', 'สวัสดี', 'เฮลโหล', 'exclamation', 'A1', 'Hello! Nice to meet you.', 'สวัสดี! ยินดีที่ได้รู้จัก', ['hi'], ['communication', 'daily'], 1, 60),
  row('goodbye', '/ˌɡʊdˈbaɪ/', 'ลาก่อน', 'กู้ด-บาย', 'exclamation', 'A1', 'Goodbye! See you soon.', 'ลาก่อน! แล้วเจอกัน', ['bye'], ['communication', 'daily'], 1, 430),
  row('please', '/pliːz/', 'กรุณา', 'พลีส', 'adverb', 'A1', 'Please sit down.', 'กรุณานั่งลง', ['kindly'], ['communication', 'daily'], 1, 80),
  row('thank', '/θæŋk/', 'ขอบคุณ', 'แทงค์', 'verb', 'A1', 'Thank you for your help.', 'ขอบคุณสำหรับความช่วยเหลือ', ['appreciate'], ['communication', 'daily'], 1, 75),
  row('sorry', '/ˈsɒri/', 'ขอโทษ', 'ซอร์-รี่', 'exclamation', 'A1', 'Sorry, I did not hear you.', 'ขอโทษ ฉันไม่ได้ยินคุณ', ['apologize'], ['communication', 'daily'], 1, 85),
  row('yes', '/jes/', 'ใช่', 'เยส', 'adverb', 'A1', 'Yes, I would love to come.', 'ใช่ ฉันอยากไปมาก', ['yeah'], ['communication', 'daily'], 1, 50),
  row('no', '/noʊ/', 'ไม่', 'โน', 'adverb', 'A1', 'No, thank you. I am full.', 'ไม่เป็นไร ขอบคุณ ฉันอิ่มแล้ว', ['nope'], ['communication', 'daily'], 1, 48),
  row('help', '/help/', 'ช่วย', 'เฮลป์', 'verb', 'A1', 'Can you help me carry this box?', 'คุณช่วยฉันถือกล่องนี้ได้ไหม', ['assist'], ['communication', 'daily'], 1, 128),
  row('want', '/wɒnt/', 'ต้องการ', 'วอนท์', 'verb', 'A1', 'I want a cup of tea.', 'ฉันอยากได้ชาหนึ่งถ้วย', ['wish'], ['communication', 'daily'], 1, 118),
  row('need', '/niːd/', 'ต้องการ', 'นีด', 'verb', 'A1', 'We need more time to finish.', 'เราต้องการเวลามากขึ้นเพื่อทำให้เสร็จ', ['require'], ['communication', 'daily'], 1, 122),
  row('like', '/laɪk/', 'ชอบ', 'ไลค์', 'verb', 'A1', 'I like reading before bed.', 'ฉันชอบอ่านหนังสือก่อนนอน', ['enjoy'], ['feelings', 'daily'], 1, 98),
  row('love', '/lʌv/', 'รัก', 'เลิฟ', 'verb', 'A1', 'They love living near the sea.', 'พวกเขารักการอยู่ใกล้ทะเล', ['adore'], ['feelings', 'daily'], 1, 108),
  row('know', '/noʊ/', 'รู้', 'โน', 'verb', 'A1', 'I know the answer to this question.', 'ฉันรู้คำตอบของคำถามนี้', ['understand'], ['communication', 'daily'], 1, 102),
  row('think', '/θɪŋk/', 'คิด', 'ทิงค์', 'verb', 'A1', 'I think it will rain later.', 'ฉันคิดว่าฝนจะตกทีหลัง', ['believe'], ['communication', 'daily'], 1, 112),
  row('see', '/siː/', 'เห็น', 'ซี', 'verb', 'A1', 'I can see the mountains from here.', 'ฉันเห็นภูเขาจากที่นี่', ['look'], ['daily', 'senses'], 1, 132),
  row('hear', '/hɪr/', 'ได้ยิน', 'เฮียร์', 'verb', 'A1', 'Did you hear that noise?', 'คุณได้ยินเสียงนั้นไหม', ['listen'], ['daily', 'senses'], 1, 348),
  row('speak', '/spiːk/', 'พูด', 'สปีค', 'verb', 'A1', 'She speaks English very well.', 'เธอพูดภาษาอังกฤษได้ดีมาก', ['talk'], ['communication', 'daily'], 1, 268),
  row('read', '/riːd/', 'อ่าน', 'รีด', 'verb', 'A1', 'He reads the news every morning.', 'เขาอ่านข่าวทุกเช้า', ['study'], ['education', 'daily'], 1, 238),
  row('write', '/raɪt/', 'เขียน', 'ไรท์', 'verb', 'A1', 'Please write your name here.', 'กรุณาเขียนชื่อของคุณที่นี่', ['note'], ['education', 'daily'], 1, 278),
  row('learn', '/lɜːrn/', 'เรียนรู้', 'เลิร์น', 'verb', 'A1', 'Children learn quickly at this age.', 'เด็กเรียนรู้ได้เร็วในวัยนี้', ['study'], ['education', 'daily'], 1, 308),
  row('work', '/wɜːrk/', 'ทำงาน', 'เวิร์ค', 'verb', 'A1', 'I work from nine to five.', 'ฉันทำงานตั้งแต่เก้าโมงถึงห้าโมง', ['job'], ['work', 'daily'], 1, 88),
  row('play', '/pleɪ/', 'เล่น', 'เพลย์', 'verb', 'A1', 'The kids play in the yard after school.', 'เด็กๆ เล่นในสนามหลังเลิกเรียน', ['have fun'], ['leisure', 'daily'], 1, 198),
  row('live', '/lɪv/', 'อยู่', 'ลิฟ', 'verb', 'A1', 'We live in a small town.', 'เราอยู่ในเมืองเล็กๆ', ['reside'], ['home', 'daily'], 1, 168),
  row('come', '/kʌm/', 'มา', 'คัม', 'verb', 'A1', 'Please come to my party on Saturday.', 'มางานปาร์ตี้ของฉันวันเสาร์นะ', ['arrive'], ['travel', 'daily'], 1, 78),
  row('go', '/ɡoʊ/', 'ไป', 'โก', 'verb', 'A1', 'I go to the gym twice a week.', 'ฉันไปยิมสัปดาห์ละสองครั้ง', ['leave'], ['travel', 'daily'], 1, 55),
  row('give', '/ɡɪv/', 'ให้', 'กิฟ', 'verb', 'A1', 'Can you give me a pen?', 'ให้ปากกาฉันหน่อยได้ไหม', ['hand'], ['communication', 'daily'], 1, 218),
  row('take', '/teɪk/', 'เอา, นำ', 'เทค', 'verb', 'A1', 'Take an umbrella with you.', 'เอาร่มไปด้วย', ['grab'], ['daily', 'actions'], 1, 148),
  row('find', '/faɪnd/', 'หา', 'ไฟนด์', 'verb', 'A1', 'I cannot find my keys.', 'ฉันหากุญแจไม่เจอ', ['locate'], ['daily', 'actions'], 1, 258),
  row('use', '/juːz/', 'ใช้', 'ยูส', 'verb', 'A1', 'You can use my charger.', 'คุณใช้ที่ชาร์จของฉันได้', ['utilize'], ['technology', 'daily'], 1, 188),
  row('wear', '/wer/', 'สวมใส่', 'แวร์', 'verb', 'A1', 'She wears a blue dress today.', 'วันนี้เธอใส่ชุดสีน้ำเงิน', ['put on'], ['clothing', 'daily'], 1, 418),
  row('watch', '/wɒtʃ/', 'ดู', 'วอทช์', 'verb', 'A1', 'We watch movies on Friday nights.', 'เราดูหนังคืนวันศุกร์', ['view'], ['leisure', 'daily'], 1, 228),
  row('listen', '/ˈlɪsn/', 'ฟัง', 'ลิส-เซิ่น', 'verb', 'A1', 'Listen to this song. It is great.', 'ฟังเพลงนี้สิ เพราะมาก', ['hear'], ['leisure', 'daily'], 1, 388),
  row('cook', '/kʊk/', 'ทำอาหาร', 'คุ๊ก', 'verb', 'A1', 'My dad loves to cook on weekends.', 'พ่อชอบทำอาหารวันหยุด', ['prepare food'], ['food', 'daily'], 1, 498),
  row('eat', '/iːt/', 'กิน', 'อีท', 'verb', 'A1', 'What do you want to eat tonight?', 'คืนนี้อยากกินอะไร', ['have food'], ['food', 'daily'], 1, 138),
  row('drink', '/drɪŋk/', 'ดื่ม', 'ดริงค์', 'verb', 'A1', 'Drink more water in hot weather.', 'ดื่มน้ำมากขึ้นในวันที่ร้อน', ['sip'], ['food', 'daily'], 1, 248),
  row('sleep', '/sliːp/', 'นอน', 'สลีป', 'verb', 'A1', 'I sleep eight hours every night.', 'ฉันนอนวันละแปดชั่วโมง', ['rest'], ['health', 'daily'], 1, 288),
  row('school', '/skuːl/', 'โรงเรียน', 'สคูล', 'noun', 'A1', 'The school is near my house.', 'โรงเรียนอยู่ใกล้บ้านฉัน', ['academy'], ['education', 'daily'], 1, 158),
  row('teacher', '/ˈtiːtʃər/', 'ครู', 'ที-เชอร์', 'noun', 'A1', 'Our teacher is kind and patient.', 'ครูของเราใจดีและอดทน', ['instructor'], ['education', 'daily'], 1, 438),
  row('student', '/ˈstuːdnt/', 'นักเรียน', 'สตู-เดนท์', 'noun', 'A1', 'Every student must bring a notebook.', 'นักเรียนทุกคนต้องนำสมุดมา', ['pupil'], ['education', 'daily'], 1, 408),
  row('book', '/bʊk/', 'หนังสือ', 'บุ๊ค', 'noun', 'A1', 'This book is very interesting.', 'หนังสือเล่มนี้น่าสนใจมาก', ['text'], ['education', 'daily'], 1, 178),
  row('pen', '/pen/', 'ปากกา', 'เพน', 'noun', 'A1', 'I need a blue pen to write.', 'ฉันต้องการปากกาสีน้ำเงินเพื่อเขียน', ['ballpoint'], ['education', 'daily'], 1, 598),
  row('paper', '/ˈpeɪpər/', 'กระดาษ', 'เพเปอร์', 'noun', 'A1', 'Write the answer on a piece of paper.', 'เขียนคำตอบลงบนกระดาษ', ['sheet'], ['education', 'daily'], 1, 368),
  row('money', '/ˈmʌni/', 'เงิน', 'มัน-นี่', 'noun', 'A1', 'I do not have enough money today.', 'วันนี้ฉันมีเงินไม่พอ', ['cash'], ['shopping', 'daily'], 1, 142),
  row('job', '/dʒɒb/', 'งาน', 'จ็อบ', 'noun', 'A1', 'She found a new job last month.', 'เธอได้งานใหม่เมื่อเดือนที่แล้ว', ['work'], ['work', 'daily'], 1, 208),
  row('office', '/ˈɒfɪs/', 'สำนักงาน', 'ออฟ-ฟิส', 'noun', 'A2', 'His office is on the fifth floor.', 'สำนักงานของเขาอยู่ชั้นห้า', ['workplace'], ['work', 'daily'], 2, 660),
  row('doctor', '/ˈdɒktər/', 'หมอ', 'ด็อก-เตอร์', 'noun', 'A1', 'You should see a doctor if you feel ill.', 'คุณควรไปหาหมอถ้ารู้สึกไม่สบาย', ['physician'], ['health', 'daily'], 1, 520),
  row('hospital', '/ˈhɒspɪtl/', 'โรงพยาบาล', 'ฮอส-พิท-ทัล', 'noun', 'A2', 'The hospital is twenty minutes away.', 'โรงพยาบาลอยู่ห่างออกไปยี่สิบนาที', ['clinic'], ['health', 'daily'], 2, 720),
  row('sick', '/sɪk/', 'ป่วย', 'ซิค', 'adjective', 'A1', 'He stayed home because he was sick.', 'เขาอยู่บ้านเพราะป่วย', ['ill'], ['health', 'daily'], 1, 460),
  row('healthy', '/ˈhelθi/', 'แข็งแรง', 'เฮล-ธี', 'adjective', 'A1', 'Eating vegetables keeps you healthy.', 'การกินผักทำให้คุณแข็งแรง', ['fit'], ['health', 'daily'], 1, 540),
  row('dog', '/dɒɡ/', 'สุนัข', 'ด็อก', 'noun', 'A1', 'Their dog likes to play fetch.', 'สุนัขของพวกเขาชอบเล่นโยนจับ', ['puppy'], ['animals', 'daily'], 1, 318),
  row('cat', '/kæt/', 'แมว', 'แคท', 'noun', 'A1', 'The cat is sleeping on the sofa.', 'แมวนอนบนโซฟา', ['kitten'], ['animals', 'daily'], 1, 298),
  row('bird', '/bɜːrd/', 'นก', 'เบิร์ด', 'noun', 'A1', 'A small bird sang outside my window.', 'นกตัวเล็กร้องเพลงนอกหน้าต่าง', ['sparrow'], ['animals', 'nature'], 1, 628),
  row('fish', '/fɪʃ/', 'ปลา', 'ฟิช', 'noun', 'A1', 'We had grilled fish for lunch.', 'เรากินปลาย่างเป็นมื้อกลางวัน', ['seafood'], ['food', 'animals'], 1, 338),
  row('color', '/ˈkʌlər/', 'สี', 'คัล-เลอร์', 'noun', 'A1', 'What is your favorite color?', 'สีโปรดของคุณคือสีอะไร', ['colour'], ['daily', 'description'], 1, 458),
  row('red', '/red/', 'สีแดง', 'เรด', 'adjective', 'A1', 'She wore a red scarf today.', 'วันนี้เธอผ้าพันคอสีแดง', ['crimson'], ['daily', 'description'], 1, 388),
  row('blue', '/bluː/', 'สีน้ำเงิน', 'บลู', 'adjective', 'A1', 'The sky is bright blue today.', 'ท้องฟ้าวันนี้เป็นสีฟ้าสดใส', ['azure'], ['daily', 'description'], 1, 358),
  row('green', '/ɡriːn/', 'สีเขียว', 'กรีน', 'adjective', 'A1', 'The park is full of green trees.', 'สวนสาธารณะเต็มไปด้วยต้นไม้สีเขียว', ['emerald'], ['daily', 'description'], 1, 378),
  row('white', '/waɪt/', 'สีขาว', 'ไวท์', 'adjective', 'A1', 'He painted the wall white.', 'เขาทาผนังเป็นสีขาว', ['pale'], ['daily', 'description'], 1, 328),
  row('black', '/blæk/', 'สีดำ', 'แบล็ค', 'adjective', 'A1', 'I bought a black jacket for winter.', 'ฉันซื้อแจ็กเก็ตสีดำสำหรับฤดูหนาว', ['dark'], ['daily', 'description'], 1, 308),
  row('shirt', '/ʃɜːrt/', 'เสื้อ', 'เชิร์ต', 'noun', 'A1', 'This shirt fits me perfectly.', 'เสื้อตัวนี้ใส่พอดีกับฉัน', ['top'], ['clothing', 'daily'], 1, 488),
  row('pants', '/pænts/', 'กางเกง', 'แพนทส์', 'noun', 'A1', 'He needs new pants for work.', 'เขาต้องการกางเกงใหม่สำหรับทำงาน', ['trousers'], ['clothing', 'daily'], 1, 568),
  row('shoes', '/ʃuːz/', 'รองเท้า', 'ชูส์', 'noun', 'A1', 'Take off your shoes at the door.', 'ถอดรองเท้าที่ประตู', ['footwear'], ['clothing', 'daily'], 1, 438),
  row('hat', '/hæt/', 'หมวก', 'แฮท', 'noun', 'A1', 'Wear a hat to protect from the sun.', 'สวมหมวกเพื่อกันแดด', ['cap'], ['clothing', 'daily'], 1, 608),
  row('bag', '/bæɡ/', 'กระเป๋า', 'แบ็ก', 'noun', 'A1', 'Her bag is heavy with books.', 'กระเป๋าของเธอหนักเพราะหนังสือ', ['purse'], ['daily', 'objects'], 1, 268),
  row('key', '/kiː/', 'กุญแจ', 'คีย์', 'noun', 'A1', 'I lost my house key again.', 'ฉันทำกุญแจบ้านหายอีกแล้ว', ['lock opener'], ['home', 'daily'], 1, 398),
  row('clock', '/klɒk/', 'นาฬิกา', 'คล็อก', 'noun', 'A1', 'The clock on the wall shows noon.', 'นาฬิกาบนผนังบอกว่าเที่ยงแล้ว', ['timepiece'], ['time', 'daily'], 1, 548),
  row('picture', '/ˈpɪktʃər/', 'รูปภาพ', 'พิค-เชอร์', 'noun', 'A1', 'There is a picture of our family on the wall.', 'มีรูปครอบครัวเราติดอยู่บนผนัง', ['photo'], ['home', 'daily'], 1, 508),
  row('music', '/ˈmjuːzɪk/', 'ดนตรี', 'มิว-ซิค', 'noun', 'A1', 'She listens to music while studying.', 'เธอฟังเพลงขณะเรียน', ['songs'], ['leisure', 'daily'], 1, 248),
  row('game', '/ɡeɪm/', 'เกม', 'เกม', 'noun', 'A1', 'Let us play a board game tonight.', 'คืนนี้มาเล่นเกมกระดานกัน', ['match'], ['leisure', 'daily'], 1, 218),
  row('sport', '/spɔːrt/', 'กีฬา', 'สปอร์ต', 'noun', 'A1', 'Football is the most popular sport here.', 'ฟุตบอลเป็นกีฬายอดนิยมที่นี่', ['athletics'], ['leisure', 'daily'], 1, 288),
  row('party', '/ˈpɑːrti/', 'งานปาร์ตี้', 'พาร์-ตี้', 'noun', 'A1', 'We had a birthday party for my sister.', 'เราจัดปาร์ตี้วันเกิดให้น้องสาว', ['celebration'], ['social', 'daily'], 1, 468),
  row('gift', '/ɡɪft/', 'ของขวัญ', 'กิฟท์', 'noun', 'A1', 'Thank you for the lovely gift.', 'ขอบคุณสำหรับของขวัญที่น่ารัก', ['present'], ['social', 'daily'], 1, 588),
  row('holiday', '/ˈhɒlədeɪ/', 'วันหยุด', 'ฮอล-ิ-เดย์', 'noun', 'A1', 'We are going to the beach on holiday.', 'เราจะไปชายหาดในวันหยุด', ['vacation'], ['travel', 'daily'], 1, 498),
  row('beach', '/biːtʃ/', 'ชายหาด', 'บีช', 'noun', 'A1', 'The beach was crowded on Sunday.', 'ชายหาดคนเยอะวันอาทิตย์', ['shore'], ['travel', 'nature'], 1, 638),
  row('mountain', '/ˈmaʊntən/', 'ภูเขา', 'เมาน์-เทิน', 'noun', 'A2', 'We hiked up the mountain last weekend.', 'สุดสัปดาห์ที่แล้วเราเดินขึ้นภูเขา', ['peak'], ['nature', 'travel'], 2, 840),
  row('river', '/ˈrɪvər/', 'แม่น้ำ', 'ริฟ-เวอร์', 'noun', 'A1', 'The river flows through our town.', 'แม่น้ำไหลผ่านเมืองของเรา', ['stream'], ['nature', 'daily'], 1, 558),
  row('tree', '/triː/', 'ต้นไม้', 'ทรี', 'noun', 'A1', 'There is a tall tree in our garden.', 'มีต้นไม้สูงในสวนของเรา', ['plant'], ['nature', 'daily'], 1, 328),
  row('flower', '/ˈflaʊər/', 'ดอกไม้', 'ฟลาว-เออร์', 'noun', 'A1', 'She picked a flower from the garden.', 'เธอเด็ดดอกไม้จากสวน', ['bloom'], ['nature', 'daily'], 1, 518),
  row('garden', '/ˈɡɑːrdn/', 'สวน', 'การ์-เด้น', 'noun', 'A1', 'Grandpa grows tomatoes in the garden.', 'คุณปู่ปลูกมะเขือเทศในสวน', ['yard'], ['home', 'nature'], 1, 578),
  row('city', '/ˈsɪti/', 'เมือง', 'ซิท-ตี้', 'noun', 'A1', 'Bangkok is a busy city.', 'กรุงเทพเป็นเมืองที่วุ่นวาย', ['town'], ['places', 'daily'], 1, 188),
  row('country', '/ˈkʌntri/', 'ประเทศ', 'คัน-ทรี', 'noun', 'A1', 'Which country do you come from?', 'คุณมาจากประเทศไหน', ['nation'], ['places', 'daily'], 1, 228),
  row('world', '/wɜːrld/', 'โลก', 'เวิร์ลด์', 'noun', 'A1', 'Travel lets you see the world.', 'การเดินทางทำให้คุณได้เห็นโลก', ['earth'], ['places', 'daily'], 1, 168),
  row('problem', '/ˈprɒbləm/', 'ปัญหา', 'พร็อบ-เลิ่ม', 'noun', 'A2', 'We can solve this problem together.', 'เราแก้ปัญหานี้ด้วยกันได้', ['issue'], ['communication', 'daily'], 2, 480),
  row('question', '/ˈkwestʃən/', 'คำถาม', 'เควส-ชั่น', 'noun', 'A1', 'Do you have any questions?', 'คุณมีคำถามไหม', ['query'], ['education', 'daily'], 1, 198),
  row('answer', '/ˈænsər/', 'คำตอบ', 'แอน-เซอร์', 'noun', 'A1', 'That is the correct answer.', 'นั่นคือคำตอบที่ถูกต้อง', ['reply'], ['education', 'daily'], 1, 188),
  row('idea', '/aɪˈdɪə/', 'ความคิด', 'ไอ-เดีย', 'noun', 'A2', 'That is a great idea!', 'นั่นเป็นความคิดที่ดีมาก!', ['thought'], ['communication', 'daily'], 2, 320),
  row('plan', '/plæn/', 'แผน', 'แพลน', 'noun', 'A1', 'What is your plan for the weekend?', 'แผนสุดสัปดาห์ของคุณคืออะไร', ['scheme'], ['daily', 'work'], 1, 268),
  row('meet', '/miːt/', 'พบ', 'มีท', 'verb', 'A1', 'Let us meet at the cafe at three.', 'เจอกันที่คาเฟ่ตอนสามโมงนะ', ['see'], ['social', 'daily'], 1, 158),
  row('call', '/kɔːl/', 'โทร', 'คอล', 'verb', 'A1', 'I will call you after dinner.', 'ฉันจะโทรหาคุณหลังกินข้ำเย็น', ['phone'], ['communication', 'daily'], 1, 148),
  row('wait', '/weɪt/', 'รอ', 'เวท', 'verb', 'A1', 'Please wait here for a moment.', 'กรุณารอที่นี่สักครู่', ['stay'], ['daily', 'actions'], 1, 238),
  row('sit', '/sɪt/', 'นั่ง', 'ซิท', 'verb', 'A1', 'Sit down and relax.', 'นั่งลงแล้วพักผ่อน', ['be seated'], ['daily', 'actions'], 1, 278),
  row('stand', '/stænd/', 'ยืน', 'สแตนด์', 'verb', 'A1', 'Please stand in line.', 'กรุณายืนต่อแถว', ['rise'], ['daily', 'actions'], 1, 308),
  row('bring', '/brɪŋ/', 'นำมา', 'บริง', 'verb', 'A1', 'Bring your ID to the office.', 'นำบัตรประชาชนมาที่สำนักงาน', ['carry'], ['daily', 'actions'], 1, 348),
  row('send', '/send/', 'ส่ง', 'เซนด์', 'verb', 'A1', 'I will send you the file by email.', 'ฉันจะส่งไฟล์ให้คุณทางอีเมล', ['mail'], ['communication', 'daily'], 1, 288),
  row('show', '/ʃoʊ/', 'แสดง', 'โชว์', 'verb', 'A1', 'Can you show me how it works?', 'คุณสอนฉันว่ามันทำงานยังไงได้ไหม', ['demonstrate'], ['communication', 'daily'], 1, 198),
  row('try', '/traɪ/', 'ลอง', 'ไทร', 'verb', 'A1', 'Try this dish. It is delicious.', 'ลองจานนี้สิ อร่อยมาก', ['attempt'], ['food', 'daily'], 1, 168),
  row('change', '/tʃeɪndʒ/', 'เปลี่ยน', 'เชนจ์', 'verb', 'A1', 'I need to change my shirt.', 'ฉันต้องเปลี่ยนเสื้อ', ['switch'], ['daily', 'actions'], 1, 248),
  row('wash', '/wɒʃ/', 'ล้าง', 'วอช', 'verb', 'A1', 'Wash your hands before eating.', 'ล้างมือก่อนกิน', ['clean'], ['home', 'daily'], 1, 418),
  row('cut', '/kʌt/', 'ตัด', 'คัท', 'verb', 'A1', 'Be careful when you cut the bread.', 'ระวังตอนตัดขนมปัง', ['slice'], ['food', 'daily'], 1, 378),
  row('break', '/breɪk/', 'ทำแตก', 'เบรก', 'verb', 'A2', 'Oh no, I broke the glass.', 'โอ๊ะ ฉันทำแก้วแตก', ['shatter'], ['daily', 'actions'], 2, 620),
  row('fix', '/fɪks/', 'ซ่อม', 'ฟิกซ์', 'verb', 'A2', 'Can you fix my bicycle tire?', 'คุณซ่อมยางจักรยานฉันได้ไหม', ['repair'], ['home', 'daily'], 2, 680),
  row('build', '/bɪld/', 'สร้าง', 'บิลด์', 'verb', 'A2', 'They plan to build a new bridge.', 'พวกเขาวางแผนสร้างสะพานใหม่', ['construct'], ['work', 'daily'], 2, 740),
  row('grow', '/ɡroʊ/', 'เติบโต', 'โกรว์', 'verb', 'A1', 'Plants grow fast in the rain.', 'พืชเติบโตเร็วในฤดูฝน', ['increase'], ['nature', 'daily'], 1, 438),
  row('fall', '/fɔːl/', 'ตก, ล้ม', 'ฟอล', 'verb', 'A1', 'Be careful not to fall on the ice.', 'ระวังอย่าล้มบนน้ำแข็ง', ['drop'], ['daily', 'actions'], 1, 298),
  row('win', '/wɪn/', 'ชนะ', 'วิน', 'verb', 'A1', 'Our team won the match yesterday.', 'ทีมเราชนะการแข่งขันเมื่อวาน', ['beat'], ['sport', 'daily'], 1, 368),
  row('lose', '/luːz/', 'แพ้, สูญเสีย', 'ลูส', 'verb', 'A1', 'I do not want to lose my wallet.', 'ฉันไม่อยากทำกระเป๋าหาย', ['misplace'], ['daily', 'actions'], 1, 328),
  row('choose', '/tʃuːz/', 'เลือก', 'ชูส', 'verb', 'A2', 'You can choose any seat you like.', 'คุณเลือกที่นั่งไหนก็ได้ตามชอบ', ['select'], ['daily', 'actions'], 2, 560),
  row('forget', '/fərˈɡet/', 'ลืม', 'ฟอร์-เก็ต', 'verb', 'A1', 'Do not forget your umbrella.', 'อย่าลืมร่ม', ['overlook'], ['daily', 'actions'], 1, 388),
  row('enjoy', '/ɪnˈdʒɔɪ/', 'สนุก, ชอบ', 'เอ็น-จอย', 'verb', 'A1', 'I enjoy walking in the park.', 'ฉันสนุกกับการเดินในสวนสาธารณะ', ['like'], ['feelings', 'daily'], 1, 358),
]

function validate(entries) {
  if (!Array.isArray(entries)) throw new Error('Must be array')
  const words = new Set()
  for (const item of entries) {
    for (const key of REQUIRED) {
      if (!(key in item)) throw new Error(`Missing ${key} in ${item.word}`)
    }
    const w = item.word.toLowerCase()
    if (words.has(w)) throw new Error(`Duplicate: ${item.word}`)
    words.add(w)
    if (!['A1', 'A2'].includes(item.level)) throw new Error(`Level must be A1/A2: ${item.word}`)
  }
}

const globalSeen = loadExistingWords()
const toAdd = NEW_WORDS.filter((e) => !globalSeen.has(e.word.toLowerCase()))

const a1Path = join(dataDir, 'a1.json')
let merged = []
if (existsSync(a1Path)) {
  merged = JSON.parse(readFileSync(a1Path, 'utf8'))
}
const fileSeen = new Set(merged.map((e) => e.word.toLowerCase()))
for (const entry of toAdd) {
  if (!fileSeen.has(entry.word.toLowerCase())) {
    merged.push(entry)
    fileSeen.add(entry.word.toLowerCase())
  }
}

const TARGET = 100
if (!existsSync(a1Path) && toAdd.length < TARGET) {
  console.error(`Only ${toAdd.length} unique words available, need ${TARGET}`)
  process.exit(1)
}

// On first create, cap at TARGET entries
if (!existsSync(a1Path) || merged.length === toAdd.length) {
  merged = merged.slice(0, TARGET)
}

const json = JSON.stringify(merged, null, 2)
JSON.parse(json)
validate(merged)
writeFileSync(a1Path, json + '\n')
console.log(`a1.json: ${merged.length} entries (${toAdd.length} appended)`)

for (const file of ['a2.json', 'b1.json', 'b2.json']) {
  const p = join(dataDir, file)
  if (!existsSync(p)) {
    writeFileSync(p, '[]\n')
    console.log(`Created ${file}`)
  }
}
