const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

function getPostId(postId) {
  if (!ObjectId.isValid(postId)) {
    return null;
  }

  return new ObjectId(postId);
}

function getTrimmedPostInput(req) {
  return {
    title: req.body.title?.trim(),
    summary: req.body.summary?.trim(),
    body: req.body.content?.trim(),
  };
}

function isValidPostInput(postInput) {
  return postInput.title && postInput.summary && postInput.body;
}

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res, next) {
  try {
    const posts = await db
      .getDb()
      .collection("posts")
      .find({})
      .project({ title: 1, summary: 1, "author.name": 1 })
      .sort({ date: -1 })
      .toArray();

    res.render("posts-list", { posts: posts });
  } catch (error) {
    next(error);
  }
});

router.get("/new-post", async function (req, res, next) {
  try {
    const authors = await db
      .getDb()
      .collection("authors")
      .find()
      .sort({ name: 1 })
      .toArray();

    res.render("create-post", { authors: authors });
  } catch (error) {
    next(error);
  }
});

router.post("/posts", async function (req, res, next) {
  try {
    const postInput = getTrimmedPostInput(req);

    if (!isValidPostInput(postInput) || !ObjectId.isValid(req.body.author)) {
      return res.status(422).redirect("/new-post");
    }

    const authorId = new ObjectId(req.body.author);
    const author = await db
      .getDb()
      .collection("authors")
      .findOne({ _id: authorId });

    if (!author) {
      return res.status(422).redirect("/new-post");
    }

    const newPost = {
      title: postInput.title,
      summary: postInput.summary,
      body: postInput.body,
      date: new Date(),
      author: {
        id: authorId,
        name: author.name,
        email: author.email,
      },
    };

    await db.getDb().collection("posts").insertOne(newPost);
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

router.get("/posts/:id", async function (req, res, next) {
  try {
    const postId = getPostId(req.params.id);

    if (!postId) {
      return res.status(404).render("404");
    }

    const post = await db
      .getDb()
      .collection("posts")
      .findOne({ _id: postId }, { projection: { summary: 0 } });

    if (!post) {
      return res.status(404).render("404");
    }

    post.humanReadableDate = post.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    post.date = post.date.toISOString();

    res.render("post-detail", { post: post });
  } catch (error) {
    next(error);
  }
});

router.get("/posts/:id/edit", async function (req, res, next) {
  try {
    const postId = getPostId(req.params.id);

    if (!postId) {
      return res.status(404).render("404");
    }

    const post = await db
      .getDb()
      .collection("posts")
      .findOne(
        { _id: postId },
        { projection: { title: 1, summary: 1, body: 1 } }
      );

    if (!post) {
      return res.status(404).render("404");
    }

    res.render("update-post", { post: post });
  } catch (error) {
    next(error);
  }
});

router.post("/posts/:id/edit", async function (req, res, next) {
  try {
    const postId = getPostId(req.params.id);
    const postInput = getTrimmedPostInput(req);

    if (!postId) {
      return res.status(404).render("404");
    }

    if (!isValidPostInput(postInput)) {
      return res.status(422).redirect(`/posts/${req.params.id}/edit`);
    }

    const result = await db
      .getDb()
      .collection("posts")
      .updateOne(
        { _id: postId },
        {
          $set: {
            title: postInput.title,
            summary: postInput.summary,
            body: postInput.body,
          },
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).render("404");
    }

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

router.post("/posts/:id/delete", async function (req, res, next) {
  try {
    const postId = getPostId(req.params.id);

    if (!postId) {
      return res.status(404).render("404");
    }

    await db.getDb().collection("posts").deleteOne({ _id: postId });
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
