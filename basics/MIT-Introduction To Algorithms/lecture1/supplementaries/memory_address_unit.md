#### What is the size of a memory address unit?

The size of a **memory address unit** refers to the amount of memory that a single addressable location in memory represents. This depends on the architecture of the system, but most modern systems use **byte-addressable memory**, meaning:

- **1 address unit = 1 byte** (8 bits).

In most systems, each address corresponds to a single **byte** (the smallest addressable unit of memory). For example:
- Address `0x00000000` refers to the first byte of memory.
- Address `0x00000001` refers to the second byte.

If memory is byte-addressable, the address unit is **1 byte**.

Some older or specialized systems (e.g., early architectures, certain embedded systems) use **word-addressable memory**, where a single address refers to a **word** instead of a byte. A word is the natural data size for a processor, often 2, 4, or 8 bytes depending on the system. For example, in a word-addressable system with 4-byte words:
- Address `0x0000` refers to the first word (4 bytes: `0x0000`–`0x0003`).
- Address `0x0001` refers to the second word (4 bytes: `0x0004`–`0x0007`).

Most modern systems are **byte-addressable**, meaning:
- The **address unit** is **1 byte**.
- assume w >= log(n), if our RAM (n) is really really big, 
we should increase our w just to address that RAM.
(32-bit => 64-bit)
ex: A 32-bit system with \( 2^{32} \) addresses can directly address up to \( 2^{32} \) bytes = 4 GB.

The **size of the address itself** is determined by the architecture:
- **32-bit systems**: Each address is 32 bits (4 bytes) long.
- **64-bit systems**: Each address is 64 bits (8 bytes) long.

But the **unit of memory addressed by these addresses** is usually **1 byte**.

In summary, in most modern systems:
- The size of an **address unit** (the amount of memory each address points to) is **1 byte**.
- The size of the address itself depends on the architecture, but it usually points to individual bytes in memory.
