# ORMs

## 簡介

ORM (Object-Relational Mapping) allows developers to interact with databases using object-oriented concepts. Maps database tables to classes and rows to objects, eliminating raw SQL queries. Simplifies data manipulation and improves maintainability. Popular ORMs: Hibernate (Java), Entity Framework (.NET), SQLAlchemy (Python).

## 學習資源

### 文章

#### 1. What is an ORM, how does it work, and how should I use one?
> 原文：https://stackoverflow.com/a/1279678

⚠️ 此網站無法訪問（StackOverflow）

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
