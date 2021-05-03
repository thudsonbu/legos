# Legos
Legos is the simplest possible implementation of a blockchain with just four classes. A transaction class which represents a given exchange of legos (the name of the currency).
between two users. Blocks, which are wrappers around transactions that are used to add verification procedures like proof of work through mining and signed transactions. The chain
which is a singly linked list of blocks wich each block containing a reference to the previously certified block in the chain. Lastly, the wallet is essentially a user profile which
gives the user public and private encryption keys and the ability to create and sign a transaction.
