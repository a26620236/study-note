## Lecture 1

#### word RAM model of computation.
- `memory` = array of w-bit words

the explanation above holds under the assumption of w >= log(n), if our RAM (n) is really really big, 
we should increase our w just to address that RAM.
(32-bit => 64-bit)


---

#### How do we define efficiency?
Don't measure time, instead measure ops.expect performance to depend on size of inputs.(n)

we use asymptotic notation:
- O, corresponding to upper bonds.
- Ω, corresponding to lower bonds.
- Θ, corresponding both.

---

#### Static sequence interface
- build: O(n)
- length: O(1)
- iterate: O(n)
- get_at: O(1)
- get_first: O(1)
- get_last: O(1)
- update_at: O(1)

#### insert/delete cost Θ(n), why not O(n)?

because the cost is both upper and lower bounded by a linear function. This means that in the worst case, best case, and average case, the time complexity for insertion and deletion operations in a static array is linear. Using Θ(n) instead of O(n) provides a more precise characterization of the time complexity, indicating that it will always be linear regardless of the scenario.

--- 

#### dynamic sequence interface
will be the static sequence interface plus:
- insert_at: 
- delete_at: 
- insert_first:
- delete_first:


#### Linked Lists
- insert/delete-first(): O(1) time
- get/set(i): Θ(i) time / Θ(n) worst case
linked list is bad at random access, but being better at dynamic.


---
