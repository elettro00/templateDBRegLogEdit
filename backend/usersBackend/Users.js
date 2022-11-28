const mysql = require("mysql")
const express = require("express")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const router = express.Router()
const sha512 = require('js-sha512');

//#region main Variable
const HOST = process.env.HOST || "127.0.0.1"
const USER = process.env.USER || "root"
const DB = process.env.DB || "template"
//#endregion

//#region Connect to database (mysql)
const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: "",
    database: DB
})

connection.connect(function (err) { if (err) throw err; console.log("connected") })
// #endregion

//#region select or Create the table   
function SelectOrCreateTable() {
    connection.query("SELECT * FROM users", (err, res, fields) => {
        if (err) {
            const sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), img VARCHAR(255), country VARCHAR(255) ,  email varchar(255)  NOT NULL UNIQUE , tmpToken varchar(2500)) ";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.status(200).send({ result })
            });
        }
    })
}

SelectOrCreateTable();
//#endregion

//#region create new user 
router.post('/Register', async (req, res) => {

    const email = req.body.Data.email;
    const pass = sha512(req.body.Data.password);
    const rePass = sha512(req.body.Data.repeatPassword);
    const name = req.body.Data.name;
    if (pass === rePass) {
        connection.query(`SELECT * FROM users WHERE email = '${email}' `, function (err, result) {
            if (err) {
                res.status(400).send({ err: 'err' })
            }
            if (result.length === 0) {
                var sql = `INSERT INTO users (name,email,password) VALUES ('${name}','${email}', '${pass}')`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send({ result, email, pass, name })
                    console.log(result);
                });
            }
            else {
                return res.status(201).send({ message: 'this email is already taken ' + email })
            }
        });
    }
    else {
        return res.status(201).send({ message: 'passwords do not match' })
    }

});
//#endregion

const JwtPrivateSecret = "secretAppKey"

//#region login
router.post("/Login", async (req, res) => {
    const email = req.body.email
    const pass = sha512(req.body.password)
    connection.query(`SELECT * FROM users WHERE email = '${email}'`,
        async (err, result) => {
            if (result.length !== 0) {
                if (err) throw err
                connection.query(`SELECT password FROM users WHERE email = '${email}' AND password = '${pass}'`, async (err, result2) => {
                    if (err) throw err
                    if (result2.length !== 0) {
                        jwt.sign({ UserEmail: email }, JwtPrivateSecret,
                            (err, token) => {
                                if (err) throw err
                                // console.log(token);
                                connection.query(`UPDATE users SET tmpToken = '${token}' WHERE email = '${email}'`, function (err, result2) {
                                    if (err) throw err
                                    res.send({ token: token })
                                });
                            })
                    }

                    if (result2.length === 0) {
                        res.send({ message: "password not correct" })
                    }
                })
            }
            // console.log(result, email, pass);
            if (result.length === 0) {
                res.send({ message: "account not found" })
            }
        })
})

// #endregion

//#region get user data
router.get("/GetUserData", async (req, res) => {
    const Token = req.headers.authorization
    if (Token) {
        var decodedUserInfo = jwt.decode(Token, { complete: true })
        if (decodedUserInfo) {
            const userEmail = decodedUserInfo.payload.UserEmail

            const sql = `SELECT * FROM users WHERE email = '${userEmail}'`;
            connection.query(sql, (err, result) => {
                if (err) throw err
                res.status(200).send({ result })
            })
        }
    }
    else
        res.status(404).send({ message: "No data Founded" })
})
//#endregion

//#region get user token
router.get("/GetUserToken", async (req, res) => {
    const Token = req.headers.authorization
    if (Token) {
        var decodedUserInfo = jwt.decode(Token, { complete: true })
        // console.log(decodedUserInfo);
        let userEmail
        if (decodedUserInfo) {
            userEmail = decodedUserInfo.payload.UserEmail

            const sql = `SELECT tmpToken FROM users WHERE email = '${userEmail}'`;
            connection.query(sql, (err, result) => {
                if (err) throw err
                // console.log(result, Token);
                if (result) {
                    const tmpToken = result[0].tmpToken
                    res.status(200).send(tmpToken == Token)
                }
                else {
                    res.status(200).send(false)
                }
            })
        }
        else {
            res.send(false)
        }

    }
    else {
        res.status(404).send(false)
    }

})
//#endregion

//#region image upload
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) { error = null; }
        cb(error, "images");
    }, filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");

        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext)
    }
})


//#endregion

//#region update user data
const upload = multer({
    storage: storage, limits: { fieldSize: 12 * 1024 * 1024 }
}).single("image");


router.put('/edit/:id', upload, (req, res, next) => {
    // console.log(req);
    if (req.file && req.file !== '') {
        const Id = req.params.id;
        const URL = req.protocol + "://" + req.get("host");
        const img = URL + "/images/" + req.file.filename;

        const password = req.body.password ? sha512(req.body.password) : ""
        const newPassword = req.body.newPassword ? sha512(req.body.newPassword) : ""
        const name = req.body.name;
        const country = req.body.country;

        const sql = `SELECT password FROM users WHERE id = '${Id}'`;
        connection.query(sql, (err, resPs) => {
            if (err) throw err
            if (resPs)
                var userPassword = resPs[0].password

            if (password === userPassword) {
                const sql = `UPDATE users SET name = '${name}', country = '${country}', img = '${img}', password = '${newPassword}' WHERE id = '${Id}'`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.status(200).send({ success: "updated all", pwd: "password updated", result })
                })
            }
            else {
                const sql = `UPDATE users SET name = '${name}', country = '${country}', img = '${img}' WHERE id = '${Id}'`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.status(200).send({ success: "updated no password", message: "password not updated", result })
                })
            }
        })
    }
    else {
        const Id = req.params.id;
        const name = req.body.name;
        const country = req.body.country;
        const password = req.body.password ? sha512(req.body.password) : ""
        const newPassword = req.body.newPassword ? sha512(req.body.newPassword) : ""

        const sql = `SELECT password FROM users WHERE id = '${Id}'`;
        connection.query(sql, (err, resPs) => {
            if (err) throw err
            if (resPs)
                var userPassword = resPs[0].password

            if (password === userPassword) {
                const sql = `UPDATE users SET name = '${name}', country = '${country}' , password = '${newPassword}'  WHERE id = '${Id}'`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.status(200).send({ success: 'updated all', pwd: "password updated", result })
                })
            }
            else {
                const sql = `UPDATE users SET name = '${name}', country = '${country}' WHERE id = '${Id}'`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.status(200).send({ success: 'updated no password', message: "password not updated", result })
                })
            }

        })
    }
})

//#endregion

//#region delete user token
router.put("/deleteToken/:id", (req, res, next) => {
    const Id = req.params.id
    const noToken = sha512(sha512.sha384(sha512(sha512.sha512_256(sha512(Math.random(0, 10 ^ 20) + "NoToken" + Math.random(0, 10 ^ 20) + "NoToken")))))
    connection.query(`UPDATE users SET tmpToken = '${noToken}' WHERE id = '${Id}'`, (err, result) => {
        if (err) throw err
        res.status(200).send({ message: "tmpToken successfully deleted", result })
    })
})

//#endregion

//#region delete user
router.delete("/delete/:id/:password", (req, res, next) => {
    const Id = req.params.id
    const pass = req.params.password

    connection.query(`SELECT * FROM users WHERE id = '${Id}' AND password = '${pass}'`, async (err, result) => {
        if (result.length !== 0) {
            connection.query(`DELETE FROM users WHERE id = '${Id}'`, (err, result) => {
                if (err) throw err
                res.status(200).send({ message: "user successfully deleted", result })
            })
        }
        if (result.length === 0) {
            res.status(400).send({ message: "Password not correct" })
        }
    })
})
//#endregion
module.exports = router