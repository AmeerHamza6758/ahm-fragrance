const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const connectDB = require("./config/db.config");
const ejs = require('ejs');
const path = require("path")
require("dotenv").config();
const cors = require('cors')
const { imageModel } = require("./models/images.model");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'publics/images')));


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("publics"))

// Routes
app.use("/api/auth", require("./router/auth.router"));
app.use("/api/category", require("./router/category.router"));
app.use("/api/tag", require("./router/tag.router"));
app.use("/api/product", require("./router/product.router"));
// app.use("/api/brand", require("./router/brand.router"));
app.use("/api/order", require("./router/order.router"));
app.use('/api/cart', require("./router/cart.router"));
app.use('/api/stock', require("./router/stock.router"));
app.use('/api/faq', require("./router/faq.router"));
app.use("/api/favorite", require("./router/fovorite.router"));
app.use("/api/rating-review", require("./router/ratingReview.router"));
app.use("/api/cms", require("./router/cms.router"));
app.use("/api/contact", require("./router/contact.router"));
app.use("/api/circle", require("./router/circle.router"));
app.use("/api/dashboard", require("./router/dashboard.router"));







// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './publics')
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + "_" + file.originalname)
  }
})

const upload = multer({ storage })
app.post("/single", upload.single("image"), async (req, res) => {
  try {
    const { path, filename } = req.file
    const image = await imageModel({ path, filename })
    const data = await image.save()
    res.send({ message: "image saved succesfully ", data: data })
  }
  catch (error) {
    res.send(({ massage: error.message }))
  }
});


app.get("/img/:id", async (req, res) => {
  const { id } = req.params
  try {
    const image = await imageModel.findById(id)
    if (!image) res.send({ "message": "image not found " })
    const imagePath = path.join(__dirname, "publics", image.filename)
    res.sendFile(imagePath)
  } catch (error) {

  }
})



app.get("/images", async (req, res) => {
  try {
    const images = await imageModel.find();

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    res.status(200).json({
      status: 1,
      data: images.map(image => ({
        id: image._id,
        filename: image.filename,
        path: `/images/${image.filename}`
      }))
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message
    });
  }
});




// DB Connection
connectDB().then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('DB connection failed', error);
  process.exit(1);
});
