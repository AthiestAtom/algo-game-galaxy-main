// Linked List Node
export class ListNode {
  value: number;
  next: ListNode | null = null;
  id: string;

  constructor(value: number) {
    this.value = value;
    this.id = crypto.randomUUID();
  }
}

// Linked List with full operations
export class LinkedList {
  head: ListNode | null = null;

  // Convert to array for visualization
  toArray(): { value: number; id: string }[] {
    const result: { value: number; id: string }[] = [];
    let current = this.head;
    while (current) {
      result.push({ value: current.value, id: current.id });
      current = current.next;
    }
    return result;
  }

  // Insert at beginning
  insertAtBeginning(value: number): void {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
  }

  // Insert at end
  insertAtEnd(value: number): void {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) current = current.next;
    current.next = node;
  }

  // Insert at position (0-indexed)
  insertAtPosition(value: number, position: number): boolean {
    if (position === 0) {
      this.insertAtBeginning(value);
      return true;
    }
    let current = this.head;
    for (let i = 0; i < position - 1 && current; i++) {
      current = current.next;
    }
    if (!current) return false;
    const node = new ListNode(value);
    node.next = current.next;
    current.next = node;
    return true;
  }

  // Delete by value
  deleteByValue(value: number): boolean {
    if (!this.head) return false;
    if (this.head.value === value) {
      this.head = this.head.next;
      return true;
    }
    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }
    if (!current.next) return false;
    current.next = current.next.next;
    return true;
  }

  // Delete by position
  deleteByPosition(position: number): boolean {
    if (!this.head) return false;
    if (position === 0) {
      this.head = this.head.next;
      return true;
    }
    let current = this.head;
    for (let i = 0; i < position - 1 && current.next; i++) {
      current = current.next;
    }
    if (!current.next) return false;
    current.next = current.next.next;
    return true;
  }

  // Reverse
  reverse(): void {
    let prev: ListNode | null = null;
    let current = this.head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  // Get length
  get length(): number {
    let count = 0;
    let current = this.head;
    while (current) { count++; current = current.next; }
    return count;
  }

  // From array
  static fromArray(values: number[]): LinkedList {
    const list = new LinkedList();
    values.forEach(v => list.insertAtEnd(v));
    return list;
  }

  // Clone
  clone(): LinkedList {
    return LinkedList.fromArray(this.toArray().map(n => n.value));
  }
}
