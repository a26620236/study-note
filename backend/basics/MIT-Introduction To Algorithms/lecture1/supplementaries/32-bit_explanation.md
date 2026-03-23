The relationship between **32-bit** and **4 GB** lies in how a **32-bit architecture** determines the maximum amount of memory it can address. Here's a detailed explanation:

### Information about 32-bit
**1. What does 32-bit mean?**
- A **32-bit architecture** means the CPU has a **32-bit-wide address bus**.
- The address bus defines how many unique memory addresses the CPU can use to access data.
- Since a memory address points to a single **byte**, a 32-bit address bus can reference up to \( 2^{32} \) addresses.

**2. Calculation of Maximum Addressable Memory:**
- The total number of unique memory addresses is \( 2^{32} = 4,294,967,296 \).
- Since each address corresponds to **1 byte**, the total addressable memory is **4,294,967,296 bytes**, or **4 GB**.


**3. Why 4 GB is the Limit for 32-bit Systems?**
- A 32-bit system can access a memory range from **0x00000000** to **0xFFFFFFFF**, which spans \( 2^{32} \) bytes.
- This limitation is inherent to the width of the address bus; more bits (e.g., 64-bit) allow addressing a larger memory space.

**4. Practical Considerations:**
- On a 32-bit system, not all 4 GB is usable by applications:
  - Some of the memory is reserved for the operating system and hardware devices.
  - As a result, the usable memory is often less than 4 GB.
