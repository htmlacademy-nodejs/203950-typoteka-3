'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getAPI} = require(`../api`);

const api = getAPI();
const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`articles/new-post`, {categories});
  } catch (error) {
    res.render(`articles/new-post`, {categories: []});
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    photo: file.filename,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    category: Array.isArray(body.category) ? body.category : [body.category],
  };

  try {
    await api.createArticle(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);

    res.render(`articles/new-post`, {article, categories});
  } catch (error) {
    res.render(`articles/new-post`, {article: [], categories: []});
  }
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
