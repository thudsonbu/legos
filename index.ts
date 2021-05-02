import * as crypto from "crypto";

/**
 * A transaction is a record of an exchange of legos between a payer who sends
 * the money and a payee who receives the money. These two parties are defined
 * by their respective public keys.
 */
class Transaction {
  
  constructor(
    public amount: number,
    public payer:  string, // payer public key
    public payee:  string  // payee public key
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

/**
 * A block is a group of transaction which will be an element in the blocks
 * linked list or "chain".
 */
class Block {
  
  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts = Date.now()
  ) {}

  get hash() {
    const str  = JSON.stringify(this);
    const hash = crypto.createHash('SHA256'); // setup hashing function

    // add string to hash
    hash.update(str).end();
    
    return hash.digest('hex');
  }
}
