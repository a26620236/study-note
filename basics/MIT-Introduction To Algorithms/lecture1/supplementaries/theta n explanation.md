## What is Θ(n)
Θ(n) 表示該算法的運行時間既不會比某個常數倍的 n 小，也不會比另一個常數倍的 n 大。

當我們說一個算法的時間複雜度是 Θ(n) 時，這意味著該算法的運行時間在某個常數倍的 n 之間。讓我們用一個簡單的例子來說明：

假設我們有一個算法，它的運行時間可以用以下函數表示：

\[ T(n) = 3n + 5 \]

我們想要證明這個算法的時間複雜度是 Θ(n)。根據定義，我們需要找到兩個正的常數 \( c_1 \) 和 \( c_2 \)，以及一個正的整數 \( n_0 \)，使得對於所有 \( n \geq n_0 \)，以下不等式成立：

\[ c_1 \cdot n \leq T(n) \leq c_2 \cdot n \]

對於這個例子，我們可以選擇 \( c_1 = 3 \) 和 \( c_2 = 4 \)，並且選擇 \( n_0 = 1 \)。那麼我們有：

- 下界：\( 3n \leq 3n + 5 \) 對於所有 \( n \geq 1 \) 都成立。
- 上界：\( 3n + 5 \leq 4n \) 對於所有 \( n \geq 5 \) 都成立。

因此，對於 \( n \geq 5 \)，我們可以說：

\[ 3n \leq 3n + 5 \leq 4n \]

這證明了 \( T(n) = 3n + 5 \) 是 Θ(n)。

這個例子展示了如何使用常數來界定一個算法的運行時間，從而證明它是 Θ(n)。在這個例子中，運行時間的增長率被緊密地夾在兩個線性函數之間。