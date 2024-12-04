## Pointer-Based Data Structure

A pointer-based data structure is a type of data structure that uses pointers or references to link elements together. This allows for dynamic memory allocation and efficient insertion and deletion of elements. Common examples of pointer-based data structures include linked lists, trees, and graphs.

### Example: Singly Linked List

A singly linked list is a simple type of pointer-based data structure where each element (node) contains a value and a pointer to the next node in the sequence. Here is a basic example to illustrate:

1. **Node Structure**:
   Each node in a singly linked list contains two parts:
   - `data`: The value stored in the node.
   - `next`: A pointer to the next node in the list.

2. **Linked List Operations**:
   - **Insertion**: To insert a new node, you adjust the pointers so that the new node points to the next node, and the previous node points to the new node.
   - **Deletion**: To delete a node, you adjust the pointers of the previous node to skip the node to be deleted and point to the next node.