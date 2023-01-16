require("dotenv").config();
const express = require("express");
const connect = require("../Model/db");
const cookieParser = require("cookie-parser");
const { json } = require("body-parser");
const verify = require("../Middleware/verify");
const handleError = require("../handleError");
const User = require("../Model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const user_email_verify = require("./emailVerify");
const { add_transaction } = require("./add_transaction");
const Transaction = require("../Model/transactionSchema");
const delete_transaction = require("./delete_transaction");
const paid_transaction = require("./paid_transaction");
const app = express();
mongoose.set("strictQuery", false);
function corsMiddleWare(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://expense-tracker-wev3.vercel.app"
  );
  res.removeHeader("X-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method == "OPTIONS") {
    res.status(200);
    res.end();
  } else {
    next();
  }
}
app.use(corsMiddleWare);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(json());
connect()
  .then(() => {
    app.get("/api/verifytoken", verify, (req, res) => {
      try {
        const user = req.rootUser.toObject();
        res.status(200).send({ user });
      } catch (err) {
        console.log(err);
        res.status(400).send(handleError(err));
      }
    });
    app.post("/api/signup", async (req, res) => {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(422)
          .json({ error: "Please fill all the fields properply" });
      }
      try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
          return res.status(422).json({ error: "Email already exist" });
        } else if (password.length < 5) {
          return res.status(422).json({ error: "Password is too short" });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: " user registerd successfully " });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res
            .status(400)
            .json({ error: "please fill the data properly" });
        }
        const userLogin = await User.findOne({ email: email });
        //   console.log(userLogin);
        if (userLogin) {
          const isMatch = await bcrypt.compare(password, userLogin.password);

          if (!isMatch) {
            res.status(400).json({ error: "Invalid Credentials" });
          } else {
            // let token = await userLogin.generateAuthToken();
            let token = jwt.sign(
              { _id: userLogin._id },
              process.env.SECRET_KEY
            );
            User.findOneAndUpdate(
              { email: email },
              {
                $push: {
                  tokens: {
                    token: token,
                  },
                },
              },
              {
                new: true,
                fields: {
                  name: 1,
                  email: 1,
                },
              },
              (err, data) => {
                if (err) {
                  res.status(400).send(handleError(err));
                  return;
                }
                res.cookie("jwt", token, {
                  expires: new Date(Date.now() + 25892000000),
                  httpOnly: true,
                  sameSite: "none",
                  secure: true,
                });
                let user = data.toObject();
                delete user.password;
                res.status(200).send({ user });
              }
            );
          }
        } else {
          res.status(400).json({ error: "Invalid Credentials" });
        }
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/logout", verify, async (req, res) => {
      try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        User.findOneAndUpdate(
          { _id: verifyToken._id, "tokens.token": token },
          {
            $pull: {
              tokens: {
                token: req.token,
              },
            },
          },
          (err) => {
            if (err) {
              res.status(400).send(handleError(err));
              return;
            }
            res.clearCookie("jwt");
            res.status(200).send({ message: "user Logout" });
          }
        );
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/verifyemail/:mail", user_email_verify);
    app.get("/api/user/get", async (req, res) => {
      try {
        const mail = req.query.email;
        if (!mail) {
          return res.status(403).send({ message: "email query is missing" });
        }
        const val = String(mail)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (!val) {
          return res.status(403).send({ message: "invalid email id" });
        }
        const user = await User.findOne(
          { email: mail },
          {
            name: 1,
            email: 1,
            budget: 1,
            transactions: 1,
          }
        );
        if (user) {
          return res.status(200).send({ user: user.toObject() });
        }
        return res.status(400).send({ message: "no user found" });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/user/getbudget", verify, async (req, res) => {
      try {
        let user = await User.findById(
          { _id: req.rootID },
          {
            budget: 1,
          }
        );
        if (user) {
          return res.status(200).send(user);
        }
        return res.status(400).send({ message: "user not found" });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.patch("/api/user/updatebudget", verify, async (req, res) => {
      try {
        let amount = parseFloat(req.body.amount);
        if (Number.isNaN(amount)) {
          return res.status(403).send({ message: "invalid amount" });
        }
        User.findOneAndUpdate(
          { _id: req.rootID },
          {
            $set: {
              budget: amount,
            },
          },
          { new: true },
          function (err, doc) {
            if (err) {
              return res.status(400).send(handleError(err));
            }
            if (doc.budget === amount) {
              res.status(201);
              return res.end();
            } else {
              return res
                .status(400)
                .send({ message: "budget was not modified" });
            }
          }
        );
      } catch (err) {
        return res.status(400).send(handleError(err));
      }
    });
    app.get("/api/user/toreceivemoneylist", verify, async (req, res) => {
      try {
        let limit = 10;
        let skip = 0;
        if (req.query.limit) {
          let l = Number.parseInt(req.query.limit);
          if (Number.isInteger(l)) {
            limit = l;
          }
        }
        if (req.query.skip) {
          let s = Number.parseInt(req.query.skip);
          if (Number.isInteger(s)) {
            skip = s;
          }
        }
        let items = await User.aggregate([
          { $match: { _id: req.rootID } },
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.payer.email": req.rootEmail,
            },
          },
          { $sort: { "transactions.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              transactions: 1,
              _id: 0,
            },
          },
        ]);
        let vals = JSON.parse(JSON.stringify(items));
        let plist = [];
        items.forEach(async (val) => {
          let temp = Transaction.aggregate([
            { $match: { _id: val.transactions.for } },
            {
              $project: {
                friends: 1,
                _id: 0,
              },
            },
          ]);
          plist.push(temp);
        });
        Promise.all(plist)
          .then((arr) => {
            for (let i = 0; i < arr.length; i++) {
              vals[i] = { ...vals[i].transactions, ...arr[i][0] };
            }
            res.status(200).send(vals);
          })
          .catch((err) => {
            res.status(400).send(handleError(err));
          });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/user/budgetRemaining", verify, async (req, res) => {
      try {
        let budget = await User.findOne(
          { _id: req.rootID },
          {
            budget: 1,
            _id: 0,
          }
        );
        budget = budget.budget;
        if (typeof budget === "undefined") {
          return res.status(403).send({ message: "budget not set" });
        }
        let items = await User.aggregate([
          { $match: { _id: req.rootID } },
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.paid": true,
            },
          },
          { $sort: { "transactions.createdAt": -1 } },
          {
            $project: {
              transactions: 1,
              _id: 0,
            },
          },
        ]);
        items.forEach((val) => {
          budget -= val.transactions.amount;
        });
        items = await User.aggregate([
          { $match: { _id: req.rootID } },
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.payer.email": req.rootEmail,
            },
          },
          { $sort: { "transactions.createdAt": -1 } },
          {
            $project: {
              transactions: 1,
              _id: 0,
            },
          },
        ]);
        let vals = JSON.parse(JSON.stringify(items));
        let plist = [];
        items.forEach(async (val) => {
          let temp = Transaction.aggregate([
            { $match: { _id: val.transactions.for } },
            {
              $project: {
                friends: 1,
                _id: 0,
              },
            },
          ]);
          plist.push(temp);
        });
        Promise.all(plist)
          .then((arr) => {
            for (let i = 0; i < arr.length; i++) {
              vals[i] = { ...vals[i].transactions, ...arr[i][0] };
            }
            for (let i = 0; i < vals.length; i++) {
              let amount = vals[i].amount;
              let l = vals[i].friends.length;
              let perPerson = amount / l;
              for (let j = 0; j < vals[i].friends.length; j++) {
                if (
                  vals[i].friends[j].paid &&
                  vals[i].friends[j].email !== req.rootEmail
                ) {
                  budget += perPerson;
                }
              }
            }
            return res.status(200).send({ current: budget });
          })
          .catch((err) => {
            res.status(400).send(handleError(err));
          });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/user/listpaidtx", verify, async (req, res) => {
      try {
        let limit = 10;
        let skip = 0;
        if (req.query.limit) {
          let l = Number.parseInt(req.query.limit);
          if (Number.isInteger(l)) {
            limit = l;
          }
        }
        if (req.query.skip) {
          let s = Number.parseInt(req.query.skip);
          if (Number.isInteger(s)) {
            skip = s;
          }
        }
        let items = await User.aggregate([
          { $match: { _id: req.rootID } },
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.paid": true,
            },
          },
          { $sort: { "transactions.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              transactions: 1,
              _id: 0,
            },
          },
        ]);
        res.status(200).send(items);
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/user/listunpaidtx", verify, async (req, res) => {
      try {
        let limit = 10;
        let skip = 0;
        if (req.query.limit) {
          let l = Number.parseInt(req.query.limit);
          if (Number.isInteger(l)) {
            limit = l;
          }
        }
        if (req.query.skip) {
          let s = Number.parseInt(req.query.skip);
          if (Number.isInteger(s)) {
            skip = s;
          }
        }
        let items = await User.aggregate([
          { $match: { _id: req.rootID } },
          { $unwind: "$transactions" },
          {
            $match: {
              "transactions.paid": false,
            },
          },
          { $sort: { "transactions.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              transactions: 1,
              _id: 0,
            },
          },
        ]);
        res.status(200).send(items);
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.post("/api/transaction/add", verify, add_transaction);
    app.get("/api/txget", verify, async (req, res) => {
      try {
        let id = req.query.tx;
        if (!id) {
          return res.status(403).send({ message: "no transaction id found" });
        }
        let ans = await Transaction.findOne({ _id: id });
        if (ans) {
          return res.status(200).send(ans);
        }
        return res.status(400).send({ message: "transaction not found" });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.get("/api/txlist", verify, async (req, res) => {
      try {
        let val = await User.findOne(
          { _id: req.rootID },
          {
            transactions: 1,
          }
        );
        if (val) {
          return res.status(200).send(val);
        }
        return res.status(400).send({ message: "no transaction found" });
      } catch (err) {
        res.status(400).send(handleError(err));
      }
    });
    app.delete("/api/removetx", verify, delete_transaction);
    app.post("/api/txpaid", verify, paid_transaction);
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server listening to ${process.env.PORT || 5000}`);
    });
  })

  .catch((err) => {
    console.log(err);
  }); // connect to db
