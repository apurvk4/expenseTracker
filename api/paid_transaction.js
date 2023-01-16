const mongoose = require("mongoose");
const Transaction = require("../Model/transactionSchema");
const User = require("../Model/userSchema");
const ObjectId = mongoose.Types.ObjectId;
const paid_transaction = async (req, res) => {
  try {
    const mails = req.body;
    if (!(Array.isArray(mails) && mails.length >= 0)) {
      return res
        .status(400)
        .send({ message: "Either Mails Array or Empty Mails Array" });
    }
    const tid = req.query.tid;
    if (!(tid && ObjectId.isValid(tid))) {
      res.status(400).send({ message: "valid transaction id is required" });
    }
    var session = await mongoose.startSession();

    session.startTransaction();
    let plist = [];

    for (let i = 0; i < mails.length; i++) {
      let l = Transaction.findOneAndUpdate(
        { _id: tid, "friends.email": mails[i] },
        {
          $set: {
            "friends.$.paid": true,
          },
        },
        { new: true, fields: { name: 1 } }
      );
      plist.push(l);
    }
    Promise.all(plist)
      .then((val) => {
        let list = [];
        for (let j = 0; j < mails.length; j++) {
          let l = User.findOneAndUpdate(
            {
              email: mails[j],
              "transactions.for": tid,
            },
            {
              $set: {
                "transactions.$.paid": true,
              },
            },
            { new: true, fields: { name: 1 } }
          );
          list.push(l);
        }
        Promise.all(list)
          .then(async (v) => {
            await session.commitTransaction();
            res.status(200);
            res.end();
            await session.endSession();
          })
          .catch(async (err) => {
            await session.abortTransaction();
            res.status(400).send(handleError(err));
            await session.endSession();
          });
      })
      .catch(async (err) => {
        await session.abortTransaction();
        res.status(400).send(handleError(err));
        await session.endSession();
      });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(handleError(err));
    await session.endSession();
  }
};
module.exports = paid_transaction;
