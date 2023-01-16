const mongoose = require("mongoose");
const handleError = require("../handleError");
const Transaction = require("../Model/transactionSchema");
const User = require("../Model/userSchema");
async function updateFriend(
  email,
  money,
  t_id,
  total,
  payer,
  rootID,
  category,
  date
) {
  let value = money;
  let paid = false;
  if (payer.email === email) {
    value = total;
    paid = true;
  }
  try {
    await User.findOneAndUpdate(
      { email },
      {
        $push: {
          transactions: {
            amount: value,
            for: t_id,
            payer: payer,
            createdBy: rootID,
            category: category,
            paid: paid,
            createdAt: date,
          },
        },
      }
    );
    return Promise.resolve(0);
  } catch (err) {
    return Promise.reject(err);
  }
}
const add_transaction = async (req, res) => {
  const { tname, category, amount, payer, date, friends } = req.body;
  if (!tname || !category || !amount || !payer || !date || !friends) {
    return res.status(403).send({ message: "some feilds are missing." });
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const tx = new Transaction({
      name: tname,
      category,
      amount,
      payer,
      date,
      friends,
      createdBy: req.rootID,
    });
    await tx.save();
    let val = amount / friends.length;
    let plist = [];
    for (let i = 0; i < friends.length; i++) {
      plist.push(
        updateFriend(
          friends[i].email,
          val,
          tx._id,
          amount,
          payer,
          req.rootID,
          category,
          date
        )
      );
    }
    Promise.all(plist).then(async () => {
      await session.commitTransaction();
      res.status(201);
      res.end();
      await session.endSession();
      return;
    });
    return;
  } catch (err) {
    await session.abortTransaction();
    res.status(400).send(handleError(err));
  }
  await session.endSession();
};
module.exports = { add_transaction };
