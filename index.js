"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
/**
 * A transaction is a record of an exchange of legos between a payer who sends
 * the money and a payee who receives the money. These two parties are defined
 * by their respective public keys.
 */
var Transaction = /** @class */ (function () {
    function Transaction(amount, payer, // payer public key
    payee // payee public key
    ) {
        this.amount = amount;
        this.payer = payer;
        this.payee = payee;
    }
    Transaction.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return Transaction;
}());
/**
 * A block is a group of transaction which will be an element in the blocks
 * linked list or "chain".
 */
var Block = /** @class */ (function () {
    function Block(prevHash, transaction, ts) {
        if (ts === void 0) { ts = Date.now(); }
        this.prevHash = prevHash;
        this.transaction = transaction;
        this.ts = ts;
    }
    Object.defineProperty(Block.prototype, "hash", {
        get: function () {
            var str = JSON.stringify(this);
            var hash = crypto.createHash('SHA256'); // setup hashing function
            // add string to hash
            hash.update(str).end();
            return hash.digest('hex');
        },
        enumerable: false,
        configurable: true
    });
    return Block;
}());
