const mongoose = require("mongoose");

(MONGOOSE_URL_LISTS =
  "mongodb+srv://ecomercewebsite0:suvmc4JmqqgUjtwG@ecommerce0.do4czsf.mongodb.net/Ecommerce0?retryWrites=true&w=majority"),
  mongoose
    .connect(MONGOOSE_URL_LISTS)
    .then(() => console.log("connet DB"))
    .catch((e) => console.log("error", e));
