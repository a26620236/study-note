# ORMs

## 簡介

ORM (Object-Relational Mapping) allows developers to interact with databases using object-oriented concepts. Maps database tables to classes and rows to objects, eliminating raw SQL queries. Simplifies data manipulation and improves maintainability. Popular ORMs: Hibernate (Java), Entity Framework (.NET), SQLAlchemy (Python).

## 學習資源

### 文章

#### 1. What is an ORM, how does it work, and how should I use one?
> 原文：https://stackoverflow.com/a/1279678

**ORM 的定義**

Object-Relational Mapping (ORM) 是一種讓你以物件導向的方式查詢和操作資料庫的技術。ORM 函式庫是用你所選擇的語言編寫的程式庫，封裝了操作資料所需的程式碼——你不再使用 SQL，而是直接與同一語言的物件互動。

**對比範例**

不使用 ORM（手動 SQL）：
```
book_list = new List();
sql = "SELECT book FROM library WHERE author = 'Linus'";
data = query(sql);
while (row = data.next()) {
  book = new Book();
  book.setAuthor(row.get('author'));
  book_list.add(book);
}
```

使用 ORM：
```
book_list = BookTable.query(author="Linus");
```

**優點**

- **DRY**：資料模型只需在一處定義，更易於更新、維護和重用
- 大量工作自動完成（資料庫處理、I18N 等）
- 強制使用 MVC 結構，使程式碼更整潔
- 不需要撰寫格式不良的 SQL
- Sanitizing、Prepared Statements、Transactions 只需呼叫方法即可

**靈活性**

- 符合你的自然編程方式（用你的語言！）
- 抽象化 DB 系統，可隨時更換資料庫
- 模型與應用其他部分鬆散耦合
- 支援 OOP 特性如資料繼承

**缺點**

- 需要學習成本，ORM 函式庫並不輕量
- 效能：對一般查詢足夠，但 SQL 專家對大型專案能寫出更好的原生 SQL
- 抽象化是陷阱：新手可能寫出低效語句（如在 for 迴圈中大量查詢）

**各語言主流 ORM**

| 語言 | ORM 框架 |
|------|---------|
| Java | Hibernate |
| PHP | Propel、Doctrine |
| Python | Django ORM、SQLAlchemy |
| C# | NHibernate、Entity Framework |

---

#### 2. What is an ORM
> 原文：https://www.freecodecamp.org/news/what-is-an-orm-the-meaning-of-object-relational-mapping-database-tools/

**主要概念**

ORM（Object Relational Mapping）是一種技術，用於在物件導向程式（OOP）與關聯式資料庫之間創建「橋樑」，簡化開發者與資料庫的互動。

**核心功能對比**

| 傳統方式 | ORM 工具 |
|---------|---------|
| SQL: `SELECT id, name, email FROM users WHERE id = 20` | `users.GetById(20)` |
| 代碼冗長複雜 | 方法簡潔直觀 |
| 需手動處理資料轉換 | 自動處理對象映射 |

**主流 ORM 工具**

Java 生態：
- **Hibernate** - 高效能、支援物件導向特性（繼承、多態）
- Apache OpenJPA、EclipseLink、jOOQ、Oracle TopLink

Python 生態：
- **Django** - 快速 Web 應用開發
- SQLAlchemy、web2py、SQLObject

PHP 生態：
- **Laravel（Eloquent）** - 簡化資料庫互動
- CakePHP、Qcodo、RedBeanPHP

.NET 生態：
- **Entity Framework** - 多資料庫支援
- NHibernate、Dapper（微型 ORM）

**優缺點分析**

✅ 優勢：
- 加快開發速度
- 降低開發成本
- 提升安全性（防止 SQL 注入）
- 代碼量減少

⚠️ 劣勢：
- 學習曲線陡峭
- 複雜查詢效能不佳
- 通常比原生 SQL 更慢

---

### 影片

- [What is an ORM? - NestJS and Prisma Tutorial](https://www.youtube.com/watch?v=rLRIB6AF2Dg)
- [Why Use an ORM?](https://www.youtube.com/watch?v=vHt2LC1EM3Q)
- [Explore top posts about Backend Development](https://app.daily.dev/tags/backend?ref=roadmapsh)

### 其他資源

- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
