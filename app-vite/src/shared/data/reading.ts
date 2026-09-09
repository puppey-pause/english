import type { Level } from "./types";

export type ReadingText = {
  id: string;
  level: Level;
  title: string;
  /** Одна строка по-русски: о чём текст и что в нём тренируется. */
  about: string;
  words: number;
  body: string[];
  /** Слово — короткое значение по-русски. */
  gloss: [string, string][];
  /** Вопросы на понимание — по-английски, отвечать вслух. */
  q: string[];
  /** Что сделать после чтения. */
  after: string;
};

export const READING: ReadingText[] = [
  {
    id: "bus", level: "A1", title: "The 6:40 Bus", words: 105,
    about: "Обычный день в настоящем простом времени: он ездит, она работает, они ждут.",
    body: [
      "Marta takes the 6:40 bus every morning. The bus is old and it is always cold inside. She sits by the window and drinks coffee from a paper cup.",
      "The driver's name is Sam. He knows all the faces. He does not know the names, but he says good morning to everyone.",
      "At 7:15 the bus stops near the hospital. Marta works there. She is a nurse. She starts at half past seven and finishes at four.",
      "In the evening she takes the same bus home. Sam is not there. Another driver works at night, and nobody says good morning.",
    ],
    gloss: [["driver", "водитель"], ["face", "лицо"], ["nurse", "медсестра"], ["half past seven", "полвосьмого"], ["nobody", "никто"]],
    q: ["What time does Marta start work?", "Why does she like the window seat?", "Who works on the bus at night?"],
    after: "Перескажи текст вслух в третьем лице — следи за -s: she takes, he knows.",
  },
  {
    id: "cat", level: "A1", title: "The Cat Next Door", words: 98,
    about: "Описание через there is / there are и простые прилагательные.",
    body: [
      "There is a small garden behind my house. There are two trees, one bench and a lot of grass.",
      "Every afternoon a big grey cat comes into the garden. It is not my cat. It lives next door with an old man called Peter.",
      "The cat sleeps on the bench for two or three hours. It is not afraid of me. When I open the door, it opens one eye and then sleeps again.",
      "Peter says the cat has no name. He says a cat like this does not need a name.",
    ],
    gloss: [["garden", "сад"], ["bench", "скамейка"], ["grass", "трава"], ["afraid", "боящийся"], ["next door", "по соседству"]],
    q: ["What is in the garden?", "Where does the cat live?", "Does the cat have a name?"],
    after: "Опиши свою комнату шестью предложениями: три с there is, три с there are.",
  },
  {
    id: "shop", level: "A1", title: "A Shop on the Corner", words: 112,
    about: "Числа, цены и время — то, что первым выпадает из понимания на слух.",
    body: [
      "There is a small shop on the corner of my street. It opens at eight in the morning and closes at ten at night.",
      "The shop is not big. It has bread, milk, eggs, fruit and a fridge with cold drinks. A bottle of water costs one euro twenty.",
      "The woman behind the counter is called Ana. She works six days a week. On Sunday her son works instead.",
      "I go there almost every day. I always buy the same things: bread and two apples. Ana knows this, and sometimes the bread is already on the counter when I come in.",
    ],
    gloss: [["corner", "угол"], ["fridge", "холодильник"], ["counter", "прилавок"], ["instead", "вместо"], ["almost", "почти"]],
    q: ["When does the shop close?", "How much is a bottle of water?", "What does the narrator buy every day?"],
    after: "Прочитай вслух все числа и цены из текста, не глядя на цифры второй раз.",
  },

  {
    id: "lift", level: "A2", title: "The Day the Lift Broke", words: 156,
    about: "История в Past Simple: последовательность событий и маркеры прошлого.",
    body: [
      "Last Tuesday the lift in our building stopped between the fourth and fifth floor. I was inside with a woman from the top floor and her dog.",
      "At first we laughed. She pressed the alarm button and a voice said that somebody would come in twenty minutes. Then the light went out.",
      "The dog did not like the dark. It started to cry, and the woman started to talk to it very quietly, in a language I did not understand. After ten minutes the dog was calm and we were both quiet too.",
      "The engineer arrived after fifty minutes, not twenty. He opened the doors from outside and said the same thing three times: this lift is from 1974.",
      "We walked up the stairs together. She lives on the ninth floor. Now we say hello every time we meet, which we never did before.",
    ],
    gloss: [["lift", "лифт"], ["press", "нажать"], ["go out (light)", "погаснуть"], ["calm", "спокойный"], ["engineer", "мастер, техник"], ["stairs", "лестница"]],
    q: ["How long did they wait?", "What calmed the dog down?", "What changed between the two neighbours?"],
    after: "Выпиши из текста все глаголы в прошедшем и раздели их на правильные и неправильные.",
  },
  {
    id: "cities", level: "A2", title: "Three Cities, One Weekend", words: 148,
    about: "Степени сравнения: -er/-est, more/most, as … as.",
    body: [
      "My brother works on trains, so in one weekend he can see three cities. Last month he took me with him.",
      "Porto was the smallest of the three and the easiest to walk. Everything interesting was inside twenty minutes on foot, and the food was cheaper than at home.",
      "Madrid was much bigger and much louder. We slept badly because our hotel was next to a square where people were still talking at three in the morning.",
      "Lisbon was somewhere in the middle: not as loud as Madrid, not as quiet as Porto. It has the best light of the three, my brother says, and he is right — even a grey wall looks warm there.",
      "The most surprising thing was the price. Three cities in three days cost less than one week at the sea.",
    ],
    gloss: [["on foot", "пешком"], ["square", "площадь"], ["in the middle", "посередине"], ["surprising", "неожиданный"], ["cost", "стоить"]],
    q: ["Which city was the easiest to walk?", "Why did they sleep badly in Madrid?", "What surprised the narrator most?"],
    after: "Сравни три места, где ты был, пятью предложениями — по одному с -er, -est, more, as … as и than.",
  },
  {
    id: "keys", level: "A2", title: "How I Lost My Keys", words: 162,
    about: "Past Simple и Past Continuous рядом: фон и то, что его прервало.",
    body: [
      "I was carrying two bags of shopping when my phone rang. I put one bag on the ground, answered the phone, and talked for about a minute.",
      "It was my sister. She was asking about Sunday lunch while I was trying to open the front door with one hand.",
      "When I finally got inside, I had the bags, the phone and no keys. I looked in my pockets. I looked in the bags. I looked in the fridge, because at that point anything was possible.",
      "I went back down to the street. It was raining and it was already dark. A man was standing at the bus stop, and he was holding my keys in the air like a small fish.",
      "He said he saw them fall and waited ten minutes. I said thank you four times. He said once was enough.",
    ],
    gloss: [["carry", "нести"], ["ring", "звонить"], ["ground", "земля"], ["pocket", "карман"], ["hold", "держать"], ["enough", "достаточно"]],
    q: ["What was the narrator doing when the phone rang?", "Where did the keys turn up?", "How long did the man wait?"],
    after: "Расскажи свою историю с прерванным действием: was doing … when … happened.",
  },

  {
    id: "birds", level: "B1", title: "The Man Who Counted Birds", words: 214,
    about: "Present Perfect против Past Simple: опыт, результат и закрытое прошлое.",
    body: [
      "Kenneth has counted birds in the same field for thirty-one years. He started in 1994, when he retired, and he has not missed a single week since.",
      "Every Saturday at dawn he walks the same path, stops at the same five points and writes numbers in a notebook. He has filled sixty-two notebooks. They are all in a box under his bed.",
      "For a long time nobody was interested. Then, two years ago, a university asked whether anyone had long records of small birds in that region. Kenneth sent them a photograph of the box.",
      "His numbers showed something the scientists had suspected but could not prove: one common species has almost disappeared from the area, and it disappeared quickly, between 2011 and 2014.",
      "Kenneth is not sentimental about it. He says he has never thought of himself as a scientist and does not want to start now. He counts because Saturday morning has to be something.",
      "The university has offered to digitise the notebooks. He agreed, on one condition: the box stays under the bed.",
    ],
    gloss: [["retire", "выйти на пенсию"], ["dawn", "рассвет"], ["record", "запись данных"], ["suspect", "подозревать"], ["species", "вид (животных)"], ["condition", "условие"]],
    q: ["Why did nobody notice his work for years?", "What did the numbers prove?", "How does Kenneth describe his own motive?"],
    after: "Найди в тексте четыре формы Present Perfect и объясни, почему там не Past Simple.",
  },
  {
    id: "manual", level: "B1", title: "Why Nobody Reads the Manual", words: 226,
    about: "Мнение с аргументами: связки however, although, because of.",
    body: [
      "Every device comes with instructions, and almost nobody reads them. This is usually explained as laziness. I think the explanation is wrong.",
      "People do read instructions — but only after something goes wrong. Before that, the manual answers questions nobody has yet. It describes a machine in general, while the user has a very specific problem: the light is red and it should be green.",
      "Good instructions know this. They are written backwards, starting from the trouble rather than from the parts. Although this takes longer to write, it matches the way people actually arrive at the page.",
      "There is a second reason. Most manuals are translated badly and printed small, so reading them feels like a punishment. If the text is unpleasant, the user will guess instead, and guessing works often enough to become a habit.",
      "So the question is not how to make people read. It is whether the instructions deserve to be read. A page that answers one real question in six lines will be read by everyone, every time.",
    ],
    gloss: [["device", "устройство"], ["laziness", "лень"], ["backwards", "в обратном порядке"], ["punishment", "наказание"], ["guess", "догадываться"], ["deserve", "заслуживать"]],
    q: ["When do people actually read instructions?", "What does the author mean by 'written backwards'?", "Do you agree with the second reason?"],
    after: "Выпиши пять связок из текста и построй с ними свой абзац на любую тему.",
  },
  {
    id: "interview", level: "B1", title: "A Job Interview at Nine", words: 208,
    about: "Косвенная речь и условия: что сказали, что было бы иначе.",
    body: [
      "The interview was at nine, and Dana arrived at ten to. The receptionist said the room was not free yet and asked her to wait.",
      "She waited forty minutes. Nobody explained why. If she had left at half past nine, she told me later, she would not have got the job — but she also would not have felt small before it started.",
      "When they finally called her in, the first thing the manager said was that they were very busy. He did not apologise. He asked her why she wanted to work there, and she gave the answer she had prepared three days earlier.",
      "Then he asked something she had not expected: what would she change about the company in her first month. She said she would change nothing in the first month, because a month is not long enough to understand anything.",
      "They offered her the job the same evening. She asked for a day to think, and the manager said that was reasonable.",
    ],
    gloss: [["receptionist", "администратор"], ["apologise", "извиняться"], ["expect", "ожидать"], ["prepare", "готовить"], ["reasonable", "разумный"]],
    q: ["How long did Dana wait, and why?", "What answer surprised the manager?", "Would you have waited?"],
    after: "Перескажи диалог в косвенной речи: he said that…, she asked whether…",
  },

  {
    id: "free", level: "B2", title: "The Cost of Free Things", words: 268,
    about: "Аргументированный текст: тезис, контрдовод, вывод.",
    body: [
      "Nothing has done more to shape the last twenty years of the internet than the word free. Services that charge nothing have replaced services that charged a little, and in the process the relationship between user and product has quietly reversed.",
      "The standard objection is that people knew what they were agreeing to. This is only half true. What was on offer was legible — a free inbox, a free map — while what was being given up was not: not a fee, but a slow accumulation of behaviour that has value only when it is enormous.",
      "Defenders of the model point out, fairly, that it made powerful tools available to people who could never have paid for them. A map that costs nothing is not a small thing in a country where a bus ride is expensive. Any honest criticism has to hold that in view.",
      "Still, free has a cost that arrives late. Products designed to hold attention are not the same as products designed to be useful, and when the two conflict, the business model decides. That is not a conspiracy; it is arithmetic.",
      "The interesting question now is not whether free was a mistake, but whether anything else can compete with it. Paid alternatives exist and remain small. Until enough people treat a subscription as ordinary rather than an insult, the arithmetic will not change.",
    ],
    gloss: [["reverse", "поменять местами"], ["legible", "читаемый, понятный"], ["accumulation", "накопление"], ["conflict", "вступать в противоречие"], ["arithmetic", "арифметика, простой расчёт"], ["subscription", "подписка"]],
    q: ["What does the author mean by 'reversed'?", "Which counterargument does the author accept?", "What condition would change the situation?"],
    after: "Напиши абзац на 120 слов с обратной позицией — с одним честным контрдоводом.",
  },
  {
    id: "office", level: "B2", title: "Silence in the Open Office", words: 254,
    about: "Разбор явления: причина, следствие, оговорка.",
    body: [
      "Open offices were sold as a cure for silence. Walls, the argument went, kept ideas apart; remove them and conversation would follow. What actually followed, in most measurements taken since, was less conversation, not more.",
      "The mechanism is not mysterious. In a room where forty people can hear you, a two-minute question becomes a small performance. People avoid the cost by writing instead, and the talking that remains moves to corridors, kitchens and messaging apps.",
      "There is a second effect, harder to measure. Work that requires an uninterrupted hour tends to get postponed to the edges of the day, so the office fills with the kind of work that survives interruption: replies, approvals, meetings about meetings.",
      "None of this makes the open office indefensible. It is cheaper per person, it makes a new employee's first week considerably less lonely, and some teams genuinely run on overheard information.",
      "The mistake was the claim, not the room. A layout cannot manufacture collaboration; it can only make certain behaviours slightly more or slightly less expensive. Teams that talked before still talk. Teams that did not now have nowhere to hide, which is a different problem entirely.",
    ],
    gloss: [["cure", "лекарство, средство"], ["measurement", "измерение"], ["postpone", "откладывать"], ["approval", "согласование"], ["indefensible", "не поддающийся защите"], ["overhear", "случайно услышать"]],
    q: ["Why did conversation decrease?", "What kind of work fills an open office?", "What does the author concede?"],
    after: "Найди в тексте три оговорки автора и назови, что каждая из них уступает.",
  },
  {
    id: "draft", level: "B2", title: "The Second Draft", words: 246,
    about: "Абстрактная лексика и коллокации: процесс, а не предметы.",
    body: [
      "Most people believe writing is difficult because finding words is difficult. In practice the first draft is the easy part; it can be produced in a bad mood, on a train, in an hour. The difficulty begins when you have to decide what the thing is actually about.",
      "A second draft is not a cleaned-up first draft. It is a different operation: cutting the paragraph you were proudest of, moving the real argument from the end to the beginning, discovering that two sections are the same section wearing different clothes.",
      "This is why editing feels worse than writing. Writing adds; editing removes, and removal is experienced as loss even when the result is plainly better. Writers develop rituals to make this bearable — saving the deleted parts in a separate file that nobody ever opens again.",
      "The practical test is simple. Read the piece aloud. Every sentence where your voice hesitates is a sentence you have not yet decided about, and hesitation is far more reliable than any rule about length or style.",
      "A third draft, if you have time, mostly consists of putting back three or four things you cut too enthusiastically.",
    ],
    gloss: [["draft", "черновик"], ["proud of", "гордящийся"], ["removal", "удаление"], ["bearable", "терпимый"], ["hesitate", "запинаться, колебаться"], ["enthusiastically", "с энтузиазмом"]],
    q: ["Why is a second draft not just tidying up?", "Why does editing feel worse than writing?", "What test does the author recommend?"],
    after: "Выпиши шесть коллокаций из текста (глагол + существительное) и употреби каждую в своей фразе.",
  },

  {
    id: "productivity", level: "C1", title: "Against the Cult of Productivity", words: 312,
    about: "Плотная публицистика: инверсия, уступки, точность формулировок.",
    body: [
      "Rarely has a virtue been so thoroughly emptied of meaning as productivity. Once a measure of output per hour in a factory, it now functions as a moral category applied to weekends, friendships and sleep, and it is invoked most loudly by people whose work has no measurable output at all.",
      "The transfer was not accidental. A metric designed for identical units — bricks, bolts, letters typed — becomes incoherent the moment the units differ in kind. Half a day spent staring out of a window may be the most productive half day of a research career or the least, and nothing in the concept itself can tell the two apart.",
      "What survives the transfer is the feeling of the metric rather than its content: the sense that time is being audited, that a day must justify itself. Having internalised the audit, one begins to schedule rest as a maintenance task, which is precisely the mechanism by which rest stops working.",
      "It would be too easy to conclude that all measurement is corrupting. Measurement is how anyone notices that a process is broken, and the alternative — vague appeals to craft — has protected a great deal of laziness and cruelty in its time. The objection is narrower: a number that was honest about bricks is dishonest about thought, and the dishonesty is invisible because the number looks the same.",
      "What might replace it is unglamorous. Not a better metric, but a tolerance for periods that cannot be evaluated while they are happening, and a longer horizon over which they can.",
    ],
    gloss: [["virtue", "добродетель"], ["invoke", "апеллировать, призывать"], ["incoherent", "бессвязный, несостоятельный"], ["audit", "проверка, ревизия"], ["internalise", "усвоить как своё"], ["unglamorous", "непривлекательный, невыигрышный"]],
    q: ["What does the author mean by 'the feeling of the metric'?", "Which counterargument is granted, and how far?", "What is proposed instead?"],
    after: "Найди инверсию в первой фразе и перепиши три своих нейтральных предложения с эмфазой.",
  },
  {
    id: "maps", level: "C1", title: "What Maps Leave Out", words: 298,
    about: "Синонимические ряды и точность выбора слова.",
    body: [
      "A map is useful in proportion to what it omits. This is obvious once stated and constantly forgotten: the value of the London Underground diagram lies entirely in its refusal to show where the stations actually are.",
      "Omission, however, is never neutral. Every decision about what to leave out encodes a judgement about who is reading and why, and those judgements outlive the people who made them. Nineteenth-century colonial surveys left out settlements they considered temporary; a century later, the absence was cited as evidence that nobody had lived there.",
      "Cartographers have a vocabulary for this that is worth borrowing. Generalisation is the deliberate simplification of a line; selection is the choice of which features appear at all; displacement is the small lie that moves a road two hundred metres so that a railway can be drawn beside it. Only the first is widely understood by readers, and only the third is ever noticed.",
      "Digital maps have not resolved the problem so much as hidden it. A map that redraws itself at every zoom level makes its selections invisibly and differently for each user, and there is no edition to compare against, no earlier sheet in an archive showing what the previous decision had been.",
      "None of which argues for maps that show everything. A map that shows everything is the territory, and the territory is precisely what one consults a map in order to avoid.",
    ],
    gloss: [["omit", "опускать, не включать"], ["encode", "закладывать, зашифровывать"], ["survey", "съёмка местности, обследование"], ["displacement", "смещение"], ["deliberate", "намеренный"], ["consult", "обращаться к (источнику)"]],
    q: ["Why is omission never neutral?", "Which of the three terms do readers notice, and why?", "What is the problem with digital maps?"],
    after: "Подбери по три близких синонима к omit, deliberate и judgement и объясни разницу между ними.",
  },
  {
    id: "waiting", level: "C1", title: "The Language of Waiting Rooms", words: 305,
    about: "Регистр и хеджирование: как формулируют, когда не хотят обещать.",
    body: [
      "Institutions speak most revealingly when they are apologising for a delay. The waiting room notice — we are currently experiencing longer than usual wait times — is a small masterpiece of construction, and worth taking apart.",
      "Note first that nobody acts. Delays are experienced rather than caused, and experienced by we, a pronoun that quietly recruits the reader into the institution's difficulty. Note also currently, which places the trouble in a passing moment, and usual, which implies a normal state to which things are already returning.",
      "This is hedging, and hedging is not in itself dishonest. Academic prose depends on it: results suggest rather than prove, findings are consistent with rather than demonstrate. The hedge is what an honest writer uses when the evidence genuinely does not support a stronger claim.",
      "The difference lies in what the hedge protects. In a paper it protects the reader from overstatement; in the waiting room it protects the institution from a commitment. The grammar is identical, and this is exactly why the form is so useful to anyone who would prefer not to be pinned down.",
      "The practical skill, then, is not avoiding hedges but reading them. Ask what the sentence would look like with an agent restored and a tense fixed. If the answer is we have not hired enough staff since March, you have learned something the notice was designed not to say.",
    ],
    gloss: [["revealingly", "красноречиво, выдавая себя"], ["recruit", "вовлекать, вербовать"], ["hedging", "смягчение утверждения"], ["overstatement", "преувеличение"], ["commitment", "обязательство"], ["pin down", "припереть к стенке, вынудить к конкретике"]],
    q: ["What work does the pronoun 'we' do in the notice?", "When is hedging legitimate?", "What test does the author propose?"],
    after: "Возьми любое официальное объявление и перепиши его с восстановленным подлежащим и точным временем.",
  },
];
