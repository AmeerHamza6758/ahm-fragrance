const mongoose = require("mongoose")
const imageSchema  = mongoose.Schema({
    path : {
        type : String,
        require : false
    },
    filename : {
        type : String,
        require : false
    }
})

const imageModel = mongoose.model("images" , imageSchema)
module.exports = {imageModel}

