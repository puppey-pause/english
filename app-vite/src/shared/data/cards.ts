import { SLANG } from "./slang";

export interface FlipCard {
  /** лицо карточки */
  f: string;
  /** обратная сторона */
  b: string;
  /** пример или уточнение под ответом */
  ex?: string;
}

export interface CardDeck {
  id: string;
  label: string;
  /** что на лице, что на обороте — подсказка под пилюлями */
  desc: string;
  cards: FlipCard[];
}

const verbs: FlipCard[] = [
  { f: "be", b: "was / were — been", ex: "Я был там. → I was there." },
  { f: "begin", b: "began — begun", ex: "Дождь начался. → It began to rain." },
  { f: "break", b: "broke — broken", ex: "Он разбил чашку. → He broke the cup." },
  { f: "bring", b: "brought — brought", ex: "Я принёс книгу. → I brought the book." },
  { f: "build", b: "built — built", ex: "Они построили дом. → They built a house." },
  { f: "buy", b: "bought — bought", ex: "Я купил билеты. → I bought the tickets." },
  { f: "catch", b: "caught — caught", ex: "Я поймал мяч. → I caught the ball." },
  { f: "choose", b: "chose — chosen", ex: "Она выбрала это. → She chose it." },
  { f: "come", b: "came — come", ex: "Он пришёл поздно. → He came late." },
  { f: "cost", b: "cost — cost", ex: "Это стоило дорого. → It cost a lot." },
  { f: "cut", b: "cut — cut", ex: "Я порезал палец. → I cut my finger." },
  { f: "do", b: "did — done", ex: "Я это сделал. → I did it." },
  { f: "drink", b: "drank — drunk", ex: "Он выпил воды. → He drank water." },
  { f: "drive", b: "drove — driven", ex: "Она вела машину. → She drove the car." },
  { f: "eat", b: "ate — eaten", ex: "Я поел. → I ate already." },
  { f: "fall", b: "fell — fallen", ex: "Он упал. → He fell down." },
  { f: "feel", b: "felt — felt", ex: "Я почувствовал холод. → I felt cold." },
  { f: "find", b: "found — found", ex: "Я нашёл ключи. → I found the keys." },
  { f: "forget", b: "forgot — forgotten", ex: "Я забыл сказать. → I forgot to tell you." },
  { f: "get", b: "got — got / gotten", ex: "Я получил письмо. → I got the letter." },
  { f: "give", b: "gave — given", ex: "Он дал мне совет. → He gave me advice." },
  { f: "go", b: "went — gone", ex: "Я ходил туда. → I went there." },
  { f: "have", b: "had — had", ex: "У меня было время. → I had time." },
  { f: "hear", b: "heard — heard", ex: "Я это слышал. → I heard that." },
  { f: "hold", b: "held — held", ex: "Она держала сумку. → She held the bag." },
  { f: "keep", b: "kept — kept", ex: "Я сохранил чек. → I kept the receipt." },
  { f: "know", b: "knew — known", ex: "Я знал это. → I knew it." },
  { f: "leave", b: "left — left", ex: "Он ушёл рано. → He left early." },
  { f: "lose", b: "lost — lost", ex: "Я потерял телефон. → I lost my phone." },
  { f: "make", b: "made — made", ex: "Я сделал ошибку. → I made a mistake." },
  { f: "meet", b: "met — met", ex: "Мы встретились вчера. → We met yesterday." },
  { f: "pay", b: "paid — paid", ex: "Я заплатил картой. → I paid by card." },
  { f: "put", b: "put — put", ex: "Я положил это здесь. → I put it here." },
  { f: "read", b: "read — read", ex: "Читается «ред» в 2 и 3 форме." },
  { f: "run", b: "ran — run", ex: "Он побежал. → He ran away." },
  { f: "say", b: "said — said", ex: "Он сказал да. → He said yes." },
  { f: "see", b: "saw — seen", ex: "Я видел его. → I saw him." },
  { f: "sell", b: "sold — sold", ex: "Они продали машину. → They sold the car." },
  { f: "send", b: "sent — sent", ex: "Я отправил письмо. → I sent the email." },
  { f: "sit", b: "sat — sat", ex: "Я сел здесь. → I sat here." },
  { f: "sleep", b: "slept — slept", ex: "Я плохо спал. → I slept badly." },
  { f: "speak", b: "spoke — spoken", ex: "Она говорила тихо. → She spoke quietly." },
  { f: "spend", b: "spent — spent", ex: "Я потратил всё. → I spent it all." },
  { f: "take", b: "took — taken", ex: "Я взял такси. → I took a taxi." },
  { f: "teach", b: "taught — taught", ex: "Он учил меня. → He taught me." },
  { f: "tell", b: "told — told", ex: "Я тебе говорил. → I told you." },
  { f: "think", b: "thought — thought", ex: "Я так и думал. → I thought so." },
  { f: "understand", b: "understood — understood", ex: "Я понял. → I understood." },
  { f: "wear", b: "wore — worn", ex: "Он был в пальто. → He wore a coat." },
  { f: "write", b: "wrote — written", ex: "Я написал ей. → I wrote to her." },
];

const words: FlipCard[] = [
  { f: "actually", b: "вообще-то, на самом деле", ex: "Actually, I am not sure." },
  { f: "afford", b: "позволить себе (по деньгам)", ex: "I cannot afford it now." },
  { f: "annoying", b: "раздражающий", ex: "That noise is annoying." },
  { f: "available", b: "доступный, свободный", ex: "Is the room available?" },
  { f: "borrow", b: "брать в долг, одолжить у кого-то", ex: "Can I borrow your pen?" },
  { f: "careful", b: "осторожный", ex: "Be careful with that." },
  { f: "confusing", b: "запутанный, сбивающий с толку", ex: "The map is confusing." },
  { f: "crowded", b: "многолюдный, забитый", ex: "The bus was crowded." },
  { f: "decide", b: "решать, принимать решение", ex: "I decided to stay." },
  { f: "delay", b: "задержка; задерживать", ex: "The flight has a delay." },
  { f: "enough", b: "достаточно", ex: "That is enough for today." },
  { f: "expensive", b: "дорогой", ex: "It is too expensive." },
  { f: "explain", b: "объяснять", ex: "Can you explain it again?" },
  { f: "guess", b: "догадываться, предполагать", ex: "I guess so." },
  { f: "handle", b: "справляться, разбираться с чем-то", ex: "I can handle it." },
  { f: "hurry", b: "спешить", ex: "Hurry up, we are late." },
  { f: "improve", b: "улучшать(ся)", ex: "My English is improving." },
  { f: "issue", b: "проблема, вопрос", ex: "We have an issue here." },
  { f: "lend", b: "давать в долг кому-то", ex: "Can you lend me ten dollars?" },
  { f: "maybe", b: "может быть", ex: "Maybe later." },
  { f: "mind", b: "возражать; быть против", ex: "Do you mind if I sit here?" },
  { f: "miss", b: "пропустить; скучать", ex: "I missed the train." },
  { f: "nearly", b: "почти", ex: "We are nearly there." },
  { f: "obvious", b: "очевидный", ex: "The answer is obvious." },
  { f: "own", b: "свой собственный; владеть", ex: "This is my own idea." },
  { f: "polite", b: "вежливый", ex: "He was very polite." },
  { f: "quite", b: "довольно, весьма", ex: "It is quite good." },
  { f: "reach", b: "добраться, дотянуться", ex: "I cannot reach the shelf." },
  { f: "rather", b: "скорее, довольно; лучше бы", ex: "I would rather walk." },
  { f: "receipt", b: "чек, квитанция", ex: "Keep the receipt." },
  { f: "rely on", b: "полагаться на", ex: "You can rely on me." },
  { f: "rough", b: "грубый, приблизительный", ex: "A rough estimate." },
  { f: "seem", b: "казаться", ex: "It seems fine." },
  { f: "share", b: "делиться, разделять", ex: "Let us share the bill." },
  { f: "skip", b: "пропустить, прогулять", ex: "I skipped breakfast." },
  { f: "spare", b: "запасной, свободный", ex: "Do you have a spare key?" },
  { f: "suggest", b: "предлагать, советовать", ex: "I suggest we wait." },
  { f: "though", b: "хотя; впрочем", ex: "It is late, though." },
  { f: "tough", b: "тяжёлый, жёсткий", ex: "That was a tough day." },
  { f: "weird", b: "странный", ex: "That is weird." },
  { f: "whatever", b: "что угодно; да ладно", ex: "Whatever you want." },
  { f: "worth", b: "стоящий (того)", ex: "It is worth trying." },
];

const phrasal: FlipCard[] = [
  { f: "give up", b: "сдаваться, бросать", ex: "Do not give up." },
  { f: "find out", b: "выяснить, узнать", ex: "I found out yesterday." },
  { f: "figure out", b: "разобраться, докопаться", ex: "I cannot figure it out." },
  { f: "look for", b: "искать", ex: "I am looking for my keys." },
  { f: "look after", b: "присматривать за", ex: "She looks after the dog." },
  { f: "look forward to", b: "ждать с нетерпением", ex: "I look forward to it." },
  { f: "come up with", b: "придумать", ex: "He came up with a plan." },
  { f: "run out of", b: "закончиться (о запасе)", ex: "We ran out of milk." },
  { f: "put off", b: "отложить", ex: "They put off the meeting." },
  { f: "put up with", b: "терпеть, мириться с", ex: "I cannot put up with this." },
  { f: "take off", b: "снять; взлетать", ex: "The plane took off." },
  { f: "turn down", b: "отказать; убавить", ex: "He turned down the offer." },
  { f: "turn up", b: "появиться; прибавить", ex: "She turned up late." },
  { f: "get along", b: "ладить с кем-то", ex: "We get along fine." },
  { f: "get over", b: "пережить, оправиться", ex: "He got over the flu." },
  { f: "get rid of", b: "избавиться от", ex: "Get rid of the old box." },
  { f: "bring up", b: "поднять тему; растить", ex: "Do not bring that up." },
  { f: "call off", b: "отменить", ex: "They called off the trip." },
  { f: "check out", b: "проверить; выселиться", ex: "Check out this place." },
  { f: "end up", b: "оказаться в итоге", ex: "We ended up walking." },
  { f: "hang out", b: "тусоваться", ex: "We hung out all day." },
  { f: "hold on", b: "подожди, держись", ex: "Hold on a second." },
  { f: "make up", b: "придумать; помириться", ex: "He made up a story." },
  { f: "pick up", b: "забрать, подхватить", ex: "I will pick you up." },
  { f: "show up", b: "прийти, явиться", ex: "He did not show up." },
  { f: "sort out", b: "разобраться, наладить", ex: "I will sort it out." },
  { f: "work out", b: "получиться; тренироваться", ex: "It worked out well." },
  { f: "deal with", b: "иметь дело с, решать", ex: "I will deal with it." },
];

const prep: FlipCard[] = [
  { f: "depend ___", b: "depend on", ex: "It depends on the weather." },
  { f: "wait ___", b: "wait for", ex: "I am waiting for the bus." },
  { f: "listen ___", b: "listen to", ex: "Listen to this song." },
  { f: "look ___ a photo", b: "look at", ex: "Look at this photo." },
  { f: "arrive ___ the airport", b: "arrive at (место) / in (город)", ex: "We arrived at the airport." },
  { f: "good ___ math", b: "good at", ex: "She is good at math." },
  { f: "interested ___ art", b: "interested in", ex: "I am interested in art." },
  { f: "afraid ___ dogs", b: "afraid of", ex: "He is afraid of dogs." },
  { f: "married ___ him", b: "married to", ex: "She is married to him." },
  { f: "belong ___ me", b: "belong to", ex: "This belongs to me." },
  { f: "apologise ___ being late", b: "apologise for", ex: "I apologise for being late." },
  { f: "ask ___ help", b: "ask for", ex: "Ask for help." },
  { f: "pay ___ the tickets", b: "pay for", ex: "I paid for the tickets." },
  { f: "agree ___ you", b: "agree with", ex: "I agree with you." },
  { f: "talk ___ the problem", b: "talk about", ex: "Let us talk about it." },
  { f: "think ___ it", b: "think about (обдумывать) / of (вспоминать)", ex: "I need to think about it." },
  { f: "worry ___ money", b: "worry about", ex: "Do not worry about money." },
  { f: "sorry ___ that", b: "sorry about (факт) / for (поступок)", ex: "I am sorry about that." },
  { f: "famous ___ its coffee", b: "famous for", ex: "The city is famous for its coffee." },
  { f: "different ___ mine", b: "different from", ex: "Yours is different from mine." },
  { f: "full ___ people", b: "full of", ex: "The room was full of people." },
  { f: "made ___ wood", b: "made of (материал) / by (кем)", ex: "It is made of wood." },
  { f: "on ___ Monday", b: "on Monday (дни), in May (месяцы), at 7 (часы)", ex: "See you on Monday at 7." },
  { f: "in ___ the corner", b: "in the corner (внутри) / on the corner (угол улицы)", ex: "The lamp is in the corner." },
  { f: "by ___ car", b: "by car, on foot", ex: "I go by car, not on foot." },
  { f: "for ___ two hours", b: "for two hours (сколько) / since 5 (с какого)", ex: "I waited for two hours." },
];

const slang: FlipCard[] = SLANG.slice(0, 48).map((s) => ({ f: s.p, b: s.ru, ex: s.ex }));

export const CARD_DECKS: CardDeck[] = [
  { id: "verbs", label: "неправильные глаголы", desc: "на лице — 1 форма, на обороте 2 и 3", cards: verbs },
  { id: "words", label: "слово → перевод", desc: "частые слова, которых не хватает в речи", cards: words },
  { id: "phrasal", label: "фразовые глаголы", desc: "get over, put up with и остальные", cards: phrasal },
  { id: "slang", label: "сленг и идиомы", desc: "живые выражения из разговора", cards: slang },
  { id: "prep", label: "предлоги и сочетания", desc: "depend ___ → depend on", cards: prep },
];

export const cardKey = (deckId: string, front: string): string => `${deckId}:${front}`;
