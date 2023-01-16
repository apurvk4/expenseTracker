const mongoose = require("mongoose");
const handleError = require("../handleError");
const Transaction = require("../Model/transactionSchema");
const User = require("../Model/userSchema");
const ObjectId = mongoose.Types.ObjectId;
async function removeFriend(friend, tid, rootId) {
  try {
    User.findOneAndUpdate(
      { email: friend.email },
      {
        $pull: {
          transactions: {
            for: ObjectId(tid),
            createdBy: ObjectId(rootId),
          },
        },
      },
      { new: true },
      (err) => {
        if (err) {
          return Promise.reject(err);
        }
      }
    );
  } catch (err) {
    return Promise.reject(err);
  }
}
const delete_transaction = async (req, res) => {
  let tid = req.query.tid;
  if (!tid) {
    res.status(403).send({ message: "transaction id not found" });
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let tx = await Transaction.findOne(
      { _id: tid },
      { friends: 1, createdBy: 1 }
    );
    if (tx) {
      if (!tx.createdBy.equals(req.rootID)) {
        await session.abortTransaction();
        res.status(404).send({
          message: "unauthorized: this transaction was not added by you",
        });
        await session.endSession();
        return;
      }
      let list = tx.friends;
      let plist = [];
      for (let i = 0; i < list.length; i++) {
        plist.push(removeFriend(list[i], tid, req.rootID));
      }
      Promise.all(plist)
        .then(async () => {
          let val = await Transaction.findOneAndDelete({ _id: tid });
          if (val) {
            await session.commitTransaction();
            res.status(200);
            res.end();
            await session.endSession();
          } else {
            return new Error("transaction not deleted");
          }
        })
        .catch(async (err) => {
          await session.abortTransaction();
          res.status(400).send(handleError(err));
          await session.endSession();
        });
    } else {
      await session.abortTransaction();
      res.status(400).send({ message: "Transaction not found" });
      await session.endSession();
    }
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(handleError(err));
    await session.endSession();
  }
};
module.exports = delete_transaction;
