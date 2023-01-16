const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    category: {
      type: String,
      required: [true, "category is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    createdBy: {
      type: ObjectID,
      ref: "User",
      required: [true, "createdBy is required"],
    },
    date: {
      type: Date,
      required: true,
    },
    payer: {
      email: {
        type: String,
        required: [true, "payer email is required"],
      },
      name: { type: String },
    },
    friends: [
      {
        email: { type: String, required: [true, "friend is required"] },
        name: {
          type: String,
        },
        paid: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
