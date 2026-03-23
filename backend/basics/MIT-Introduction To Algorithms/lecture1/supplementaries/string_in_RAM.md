## How does string store in RAM

**String Representation**
The string `"foo"` consists of three characters: `f`, `o`, `o`, and a null terminator (`\0`), which indicates the end of the string in many languages (like C). Each character is typically stored as a single byte (1 byte = 8 bits in most systems).

**Memory Layout:**
```
'f' -> 01100110 (ASCII code: 102)
'o' -> 01101111 (ASCII code: 111)
'o' -> 01101111 (ASCII code: 111)
'\0' -> 00000000 (null terminator)
```
**In Low-Level Languages (e.g., C)**  
   - Strings are stored as contiguous arrays of characters in memory.
   - Example in C:
     ```c
     char str[] = "foo";
     ```
     **Memory Representation:**
     ```
     Address   Value
     0x1000    01100110 ('f')
     0x1001    01101111 ('o')
     0x1002    01101111 ('o')
     0x1003    00000000 ('\0')
     ```

**Encoding**
The string might also use different encodings:
- **ASCII**: Each character uses 1 byte. `"foo"` takes 4 bytes (including `\0`).
- **UTF-8**: Identical to ASCII for English letters, so `"foo"` also takes 4 bytes.
- **UTF-16/UTF-32**: Characters use 2 or 4 bytes, so `"foo"` may occupy 8 or 16 bytes.

---

The process of storing the character `'f'` as `01100110` (its binary representation) involves several steps:

### 1. **ASCII Encoding**
- The character `'f'` is part of the **ASCII (American Standard Code for Information Interchange)** encoding system.
- ASCII assigns a unique numeric value to each character:
  - `'f'` corresponds to the decimal value **102** in the ASCII table.
  - For example:
    - `'a'` → 97
    - `'b'` → 98
    - `'f'` → 102

### 2. **Conversion to Binary**
Computers store all data in binary format (0s and 1s). When the character `'f'` is processed:
- Its ASCII code (102 in decimal) is converted to **binary** using base-2 representation.
- Decimal 102 → Binary:
  - Start by dividing the number by 2 repeatedly and recording remainders:
    ```
    102 ÷ 2 = 51 remainder 0
    51 ÷ 2 = 25 remainder 1
    25 ÷ 2 = 12 remainder 1
    12 ÷ 2 = 6  remainder 0
    6 ÷ 2 = 3  remainder 0
    3 ÷ 2 = 1  remainder 1
    1 ÷ 2 = 0  remainder 1
    ```
  - Read the remainders bottom-to-top: `01100110`.

Thus, the ASCII value **102** corresponds to the 8-bit binary value **01100110**.

---

### 3. **Storage in RAM**
Once converted to binary:
1. The value `01100110` (8 bits) is written to a specific memory location in **RAM**.
2. Memory is byte-addressable, meaning each address can store one byte (8 bits). So:
   - If the address is `0x1000`, the binary value `01100110` is stored at that location.
   - The computer's memory looks something like this:
     ```
     Address   Value
     0x1000    01100110 ('f')
     ```

---

### 4. **Retrieving the Character**
When the program retrieves the value at `0x1000`:
1. The **binary value** `01100110` is read from memory.
2. The binary is interpreted as the ASCII code `102`.
3. The code `102` maps back to the character `'f'` based on the ASCII table.

---