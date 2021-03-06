'use strict';

const mockArticles = [
  {
    "id": `tL9tPm`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов.`,
    "title": `Рок — это протест`,
    "сategory": [`Деревья`],
    "createdDate": `2021-1-3 23:37:16`,
    "comments": [
      {
        "id": `N5dzOu`,
        "text": `Планируете записать видосик на эту тему? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `yrRxOz`,
        "text": `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `0-fVwC`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `1Sz40y`,
        "text": `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      }
    ]
  },
  {
    "id": `OgPyZM`,
    "announce": `Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят.`,
    "title": `Что такое золотое сечение`,
    "сategory": [`Без рамки`],
    "createdDate": `2021-3-2 19:56:56`,
    "comments": [
      {
        "id": `F5tjqd`,
        "text": `Совсем немного...`
      },
      {
        "id": `xTp7F7`,
        "text": `Согласен с автором! Плюсую, но слишком много буквы!`
      },
      {
        "id": `tkdsx6`,
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты?`
      },
      {
        "id": `7DeiR4`,
        "text": `Это где ж такие красоты? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      }
    ]
  },
  {
    "id": `sVIdAY`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "title": `Учим HTML и CSS`,
    "сategory": [`Разное`],
    "createdDate": `2021-1-5 19:39:34`,
    "comments": [
      {
        "id": `sIuv3K`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `jgE-qu`,
        "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `mvlbf5`,
    "announce": `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "title": `Как перестать беспокоиться и начать жить`,
    "сategory": [`Музыка`],
    "createdDate": `2021-3-6 20:42:36`,
    "comments": [
      {
        "id": `sz-P4i`,
        "text": `Согласен с автором! Хочу такую же футболку :-) Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `Qeli0N`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "title": `Как начать программировать`,
    "сategory": [`За жизнь`],
    "createdDate": `2021-2-1 5:38:10`,
    "comments": [
      {
        "id": `4L_5Td`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  }
];

const mockArticlesCategories = mockArticles.reduce((acc, article) => {
  return new Set([...acc, ...article.сategory]);
}, new Set());

const mockFirstArticleId = mockArticles[0].id;
const mockSecondArticleId = mockArticles[1].id;
const mockSecondArticleTitle = mockArticles[1].title;
const mockArticleCommentId = mockArticles[1].comments[1].id;
const mockNoExistId = `NOEXST`;
const mockNotFound = `Not found with`;

const mockInvalidArticle = {
  category: `invalid`,
  title: `invalid`,
  announce: `invalid`,
};

const mockNewArticle = {
  category: `Без рамки`,
  title: `Дам погладить котика`,
  announce: `Дам погладить котика. Дорого. Не гербалайф`,
  fullText: `Первая большая ёлка была установлена только в 1938 году`,
};

module.exports = {
  mockArticles,
  mockArticlesCategories: Array.from(mockArticlesCategories),
  mockFirstArticleId,
  mockSecondArticleId,
  mockSecondArticleTitle,
  mockNoExistId,
  mockNotFound,
  mockInvalidArticle,
  mockArticleCommentId,
  mockNewArticle,
};
