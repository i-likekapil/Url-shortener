const express = require("express");
const mongoose = require("mongoose");
const Data = require("./models/ShortUrl");

const app = express();

mongoose.connect(
  "mongodb+srv://nodeUser:1234@cluster0.oee6h.mongodb.net/shortUrls?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("connected to database...");
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  let Urls;
  Data.find().exec(function (err, URLS) {
    const transformedUrls = URLS.map(function (url) {
      return url.toJSON();
    });
    Urls = JSON.parse(JSON.stringify(transformedUrls));
    // for (x in transformedUrls) {
    //   console.log(transformedUrls[x]);
    //   console.log("kapil");
    // }

    // console.log(Urls.length);

    // console.log(typeof Urls);
    res.render("index", { Urls: Urls });
    // for (x in Urls) {
    //   console.log(Urls[x].full);
    // }
  });
});

app.post("/shortUrl", (req, res) => {
  //   const data = Data({ full: req.body.fullUrl });
  //   data
  //     .save()
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   res.redirect("/");
  Data.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await Data.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
