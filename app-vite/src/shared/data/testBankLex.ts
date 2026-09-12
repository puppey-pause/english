import type { TestItem } from "./types";

/**
 * Лексический банк: не грамматика, а выбор слова. Четыре темы —
 * базовый словарь, коллокации, фразовые глаголы и похожие слова.
 */
export const LEX_TEST: TestItem[] = [
  { lvl: "A1", t: "слова", k: "tr", ru: "Как тебя зовут?", o: ["What is your name?", "How is your name?", "Which your name?"], a: 0, w: "Имя спрашивают через what, не how." },
  { lvl: "A1", t: "слова", k: "tr", ru: "Я хочу пить.", o: ["I am thirsty.", "I want drink.", "I have thirst."], a: 0, w: "Про жажду и голод — be thirsty / be hungry." },
  { lvl: "A1", t: "слова", k: "gap", s: "I ___ my teeth every morning.", o: ["wash", "brush", "clean"], a: 1, w: "Зубы чистят — brush your teeth." },
  { lvl: "A1", t: "слова", k: "gap", s: "Let's ___ a photo.", o: ["make", "take", "do"], a: 1, w: "take a photo — фиксированное сочетание." },
  { lvl: "A1", t: "похожие", k: "gap", s: "I ___ to school by bus.", o: ["go", "walk", "come"], a: 0, w: "go — движение туда; come — сюда, к говорящему." },
  { lvl: "A1", t: "похожие", k: "nat", o: ["I have 20 years old.", "I'm 20 years old."], a: 1, w: "Возраст — be, а не have." },
  { lvl: "A1", t: "коллокации", k: "gap", s: "Can you ___ me a favour?", o: ["do", "make", "give"], a: 0, w: "do a favour — сделать одолжение." },
  { lvl: "A1", t: "слова", k: "mean", s: "How much is it?", o: ["Сколько это стоит?", "Сколько их?", "Как долго это?"], a: 0, w: "how much про цену, how many про количество." },

  { lvl: "A2", t: "коллокации", k: "gap", s: "I need to ___ a decision today.", o: ["do", "make", "take"], a: 1, w: "make a decision. Русское «принять» сбивает на take." },
  { lvl: "A2", t: "коллокации", k: "gap", s: "She ___ a mistake in the form.", o: ["did", "made", "wrote"], a: 1, w: "make a mistake." },
  { lvl: "A2", t: "коллокации", k: "gap", s: "He ___ his homework after dinner.", o: ["makes", "does", "takes"], a: 1, w: "do homework — работа и задания идут с do." },
  { lvl: "A2", t: "похожие", k: "gap", s: "How ___ people were there?", o: ["much", "many", "long"], a: 1, w: "people исчисляемое — many." },
  { lvl: "A2", t: "похожие", k: "gap", s: "I ___ English for two years.", o: ["learn", "teach", "study"], a: 2, w: "study — учиться предмету; teach — учить кого-то." },
  { lvl: "A2", t: "фразовые", k: "mean", s: "give up", o: ["сдаться, бросить", "отдать бесплатно", "подняться наверх"], a: 0, w: "give up smoking — бросить курить." },
  { lvl: "A2", t: "фразовые", k: "mean", s: "look after", o: ["присматривать, заботиться", "искать", "смотреть вслед"], a: 0, w: "look after the kids — присматривать за детьми." },
  { lvl: "A2", t: "фразовые", k: "gap", s: "Can you ___ the light, please? It's dark.", o: ["turn on", "turn up", "put on"], a: 0, w: "turn on — включить прибор." },
  { lvl: "A2", t: "слова", k: "tr", ru: "Я согласен.", o: ["I'm agree.", "I agree.", "I'm agreed."], a: 1, w: "agree — глагол, без be." },
  { lvl: "A2", t: "слова", k: "nat", o: ["It costs 20 dollars.", "It costs 20 dollar."], a: 0, w: "dollars во множественном — цена больше одного." },
  { lvl: "A2", t: "похожие", k: "nat", o: ["I said him about it.", "I told him about it."], a: 1, w: "tell кому-то, say что-то." },

  { lvl: "B1", t: "коллокации", k: "gap", s: "The company ___ a profit last year.", o: ["did", "made", "took"], a: 1, w: "make a profit." },
  { lvl: "B1", t: "коллокации", k: "gap", s: "I'd like to ___ an appointment.", o: ["make", "do", "put"], a: 0, w: "make an appointment — записаться." },
  { lvl: "B1", t: "коллокации", k: "gap", s: "She ___ a risk and it worked.", o: ["made", "took", "did"], a: 1, w: "take a risk — рисковать." },
  { lvl: "B1", t: "коллокации", k: "gap", s: "He ___ attention to the details.", o: ["pays", "gives", "makes"], a: 0, w: "pay attention to." },
  { lvl: "B1", t: "фразовые", k: "mean", s: "find out", o: ["выяснить, узнать", "выйти наружу", "найти выход"], a: 0, w: "Самый частый фразовый в разговоре." },
  { lvl: "B1", t: "фразовые", k: "mean", s: "put off", o: ["отложить на потом", "надеть", "выключить"], a: 0, w: "put off the meeting — перенести встречу." },
  { lvl: "B1", t: "фразовые", k: "mean", s: "come up with", o: ["придумать, предложить", "подойти вместе", "догнать"], a: 0, w: "come up with an idea." },
  { lvl: "B1", t: "фразовые", k: "gap", s: "I can't ___ what he's saying.", o: ["figure out", "figure in", "find up"], a: 0, w: "figure out — разобраться, понять." },
  { lvl: "B1", t: "похожие", k: "gap", s: "This job ___ a lot of patience.", o: ["asks", "requires", "demands"], a: 1, w: "require — нейтральное «требует»; demand звучит как требование человека." },
  { lvl: "B1", t: "похожие", k: "gap", s: "I ___ you to come earlier.", o: ["hope", "expect", "wait"], a: 1, w: "expect — ждать чего-то ожидаемого; wait for — физически ждать." },
  { lvl: "B1", t: "слова", k: "tr", ru: "Мне это неудобно.", o: ["It's uncomfortable for me.", "It's inconvenient for me.", "It's not comfort for me."], a: 1, w: "inconvenient — неудобно по обстоятельствам; uncomfortable — физически." },
  { lvl: "B1", t: "слова", k: "nat", o: ["I have much work today.", "I have a lot of work today."], a: 1, w: "В утверждении much звучит книжно — a lot of." },
  { lvl: "B1", t: "слова", k: "mean", s: "It's up to you.", o: ["Тебе решать.", "Это тебе на пользу.", "Это зависит от места."], a: 0, w: "up to you — решение за тобой." },

  { lvl: "B2", t: "коллокации", k: "gap", s: "The results ___ serious doubt on the theory.", o: ["cast", "put", "gave"], a: 0, w: "cast doubt on — устойчивое." },
  { lvl: "B2", t: "коллокации", k: "gap", s: "We need to ___ a compromise.", o: ["find", "reach", "make"], a: 1, w: "reach a compromise / an agreement." },
  { lvl: "B2", t: "коллокации", k: "gap", s: "He ___ a strong interest in the project.", o: ["took", "made", "did"], a: 0, w: "take an interest in." },
  { lvl: "B2", t: "фразовые", k: "mean", s: "put up with", o: ["терпеть, мириться с", "поднять наверх", "выставить на продажу"], a: 0, w: "I can't put up with the noise." },
  { lvl: "B2", t: "фразовые", k: "mean", s: "get away with", o: ["выйти сухим из воды", "уехать далеко", "забрать с собой"], a: 0, w: "get away with it — сделать и не поплатиться." },
  { lvl: "B2", t: "фразовые", k: "mean", s: "look into", o: ["изучить, разобраться в", "заглянуть внутрь", "рассчитывать на"], a: 0, w: "We'll look into the issue — формально и часто в переписке." },
  { lvl: "B2", t: "похожие", k: "gap", s: "The change had a big ___ on sales.", o: ["affect", "effect", "influence on"], a: 1, w: "effect — существительное, affect — глагол." },
  { lvl: "B2", t: "похожие", k: "gap", s: "Prices have ___ by ten percent.", o: ["raised", "risen", "arisen"], a: 1, w: "rise сам поднимается, raise — поднимают что-то." },
  { lvl: "B2", t: "слова", k: "nat", o: ["Please revert to me by Friday.", "Please get back to me by Friday."], a: 1, w: "revert to me — распространённая ошибка в письмах." },
  { lvl: "B2", t: "слова", k: "mean", s: "off the top of my head", o: ["навскидку, не проверяя", "сверх головы, слишком много", "с самого начала"], a: 0, w: "Оговорка перед неточной цифрой." },

  { lvl: "C1", t: "коллокации", k: "gap", s: "The report ___ a number of concerns.", o: ["raises", "rises", "lifts"], a: 0, w: "raise concerns / questions." },
  { lvl: "C1", t: "коллокации", k: "gap", s: "She ___ a compelling case for the change.", o: ["did", "made", "told"], a: 1, w: "make a case for." },
  { lvl: "C1", t: "похожие", k: "gap", s: "The two versions differ ___ in tone.", o: ["considerable", "considerably", "consider"], a: 1, w: "Наречие к глаголу — considerably." },
  { lvl: "C1", t: "слова", k: "mean", s: "a blessing in disguise", o: ["не было бы счастья, да несчастье помогло", "скрытая угроза", "тайный подарок"], a: 0, w: "Плохое, что обернулось хорошим." },
  { lvl: "C1", t: "фразовые", k: "mean", s: "iron out", o: ["устранить шероховатости, доработать", "выгладить бельё", "обжелезить"], a: 0, w: "iron out the details — снять оставшиеся вопросы." },
  { lvl: "C1", t: "слова", k: "nat", o: ["This raises the question of cost.", "This rises the question of cost."], a: 0, w: "raise переходный: поднимают вопрос." }
];
