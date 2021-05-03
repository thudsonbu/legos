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

/**
 * The chain is a singleton linked list of blocks in the blockchain.
 */
class Chain {
  public static instance = new Chain(); // force singleton

  chain: Block[];

  constructor() {
    this.chain = [ new Block( 
      '', 
      new Transaction( 100, 'genesis', 'thudsonbu' ) // genisis block of blockchain
    )];
  }

  get lastBlock() {
    return this.chain[ this.chain.length - 1 ];
  }
  
  addBlock( transaction: Transaction, senderPublicKey: string, signature: Buffer ) {
    const verifier = crypto.createVerify( 'SHA256' );
    verifier.update( transaction.toString() );

    const isValid = verifier.verify( senderPublicKey, signature );

    if ( isValid ) {
      const newBlock = new Block( this.lastBlock.hash, transaction );
      this.chain.push(newBlock);
    }
  }
}


/**
 * The wallet functions as the key manager for a user. When a transaction is
 * created, a hash of the transaction data is first created using sha256. In
 * order to make sure that the transaction was made by the payer, the hash is 
 * signed with the payers private key. This makes sure that the transaction
 * cannot be changed as the signed hash can be verified by comparing it with
 * a hash of plain text transaction data after decrypting it with the public
 * key.
 */
class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    // create new public and private key pair for wallet
    const keypair = crypto.generateKeyPairSync( 'rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney( amount: number, payeePublicKey: string ) {
    // create a new transaction
    const transaction = new Transaction( amount, this.publicKey, payeePublicKey );

    // create a hash for the transaction
    const sign = crypto.createSign( 'SHA256' );
    sign.update( transaction.toString() ).end();

    // sign the hash with the private key
    const signature = sign.sign( this.privateKey );
    
    // add the new block to the chian
    Chain.instance.addBlock( transaction, this.publicKey, signature );
  }
}
