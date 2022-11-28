const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

//main Variable
const PORT = process.env.PORT || 4000
const HOST = process.env.HOST || "127.0.0.1"
const USER = process.env.USER || "root"
const DB = process.env.DB || "template"

//user
const Users = require("./usersBackend/Users")

const app = express()

app.use(cors({origin: "*"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//#region Connect to database (mysql)
const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: "",
    database: DB
})

connection.connect(function(err){
    if(err) throw err
})
//#endregion

//allow user to visit this path
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/", express.static(path.join(__dirname, "react")))

//api
app.use("/api/Users", Users)


//run the server
app.listen(PORT, () => {console.log("The server is running on port ", PORT)})