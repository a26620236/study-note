# Programming language(PL)

### Different PL

- Machine Instructions
    - ex: `156C`
- Assembly
    - machine dependent
    - need assembler
    - mnemonic names for op-codes
    - descriptive names for memory locations
    - ex: `LD R5, Price`

- 3rd generation languages(C++, java, Basic)
    - high level primitives, one primitive to many MIs mapping 
    - machine independent
    - compiler(編譯, 預先翻譯成某一種語言) & interpreter(解譯, 當場翻譯, 不限語言)

### Programming Paradigm
- Object-oriented (JAVA)
    - abstraction
    - inheritance
    - information hiding
        - polymorphism, different instances have same interface
        - encapsulate
- functional
        `(Find diff (Find sum Old balance Credits) (Find sum Debits))`
- imperative (MLs)
    - how to do sth 
    ```javascript
    // we want get total amount
    function double(arr) {
        const result = [];
        for (i=0; i<arr.length; i++) {
            result.push(arr[i] * 2);
        }
        return result;
    }
    ```
- declarative
    - What do u want
    ```javascript
        function double(arr) {
            return arr.map(item => item * 2);
        }
    ```

### Calling Procedure
- call by value
- call by reference

``` C++
// 用 vf 來接收 0x3E68， vf 型態是整數指標
void F( int *vf)
 { 
   cout << vf;  // 你會看到輸出為 0x3E68
   cout << *vf; // 你會看到輸出為 100
                // 因為是去提取 0x3E68 這個位址上的數值
   (*vf)++;
  }
void E()
 {
   int ve = 3;
   F(&ve); //對 ve 取址，傳過去的是類似 0x3E68 這樣的位址
   cout << ve; // 你會看到輸出為 101
  }
```
    



