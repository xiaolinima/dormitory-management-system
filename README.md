# 学生宿舍管理系统 | Dormitory Management System

## 📋 项目简介 | Project Description

一个功能完整的学生宿舍管理系统，支持学生和管理员两种角色，实现从宿舍申请、床位分配、维修服务到费用管理的全流程业务。

A fully functional dormitory management system supporting two roles: students and administrators, realizing the full business process from dormitory application, bed allocation, maintenance service to fee management.

---

## 🛠️ 技术栈 | Tech Stack

### 前端 | Frontend
- React 18.3.1
- Ant Design 5.15
- Vite 5.2
- React Router 6.23
- Axios 1.6

### 后端 | Backend
- Spring Boot 3.2.5
- Java 21
- Spring Data JPA
- Hibernate
- Maven

### 数据库 | Database
- PostgreSQL

---

## ✨ 主要功能 | Features

### 学生功能 | Student Features
- ✅ 用户注册/登录
- ✅ 宿舍申请
- ✅ 床位信息查看
- ✅ 维修申请提交
- ✅ 调宿申请提交
- ✅ 费用查询与缴费
- ✅ 申请状态查看

### 管理员功能 | Admin Features
- ✅ 楼栋管理
- ✅ 楼层管理
- ✅ 房间管理
- ✅ 床位分配
- ✅ 宿舍申请审批
- ✅ 维修申请处理
- ✅ 资产盘点管理
- ✅ 调宿申请审批
- ✅ 费用管理

---

## 🏗️ 系统架构 | System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pages (Login/Dashboard/Manage/Application...)    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓ (REST API)
┌─────────────────────────────────────────────────────────┐
│              Backend (Spring Boot)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Controller → Service → Repository                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓ (JPA/Hibernate)
┌─────────────────────────────────────────────────────────┐
│               PostgreSQL Database                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始 | Quick Start

### 前置条件 | Prerequisites
- Node.js 18+
- Java 21+
- PostgreSQL 15+
- Maven 3.8+

### 后端启动 | Backend Setup
```bash
cd xbqbackend
mvn spring-boot:run
```
后端服务运行在 http://localhost:8080

### 前端启动 | Frontend Setup
```bash
cd xbqfrontend
npm install
npm run dev
```
前端服务运行在 http://localhost:5173

### 数据库配置 | Database Setup
1. 创建数据库 `xbq`
2. 执行 `xbq_all_in_one.sql` 初始化表
3. 可选：执行 `create_application_table.sql` 添加宿舍申请功能

---

## 📁 项目结构 | Project Structure

```
dazuoye/
├── xbqbackend/              # 后端项目
│   ├── src/
│   │   └── main/
│   │       ├── java/com/xbq/xbqbackend/
│   │       │   ├── controller/      # 控制器
│   │       │   ├── service/         # 服务层
│   │       │   ├── repository/      # 数据访问
│   │       │   ├── entity/          # 实体类
│   │       │   ├── dto/             # 数据传输对象
│   │       │   ├── config/          # 配置
│   │       │   └── ...
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
│
└── xbqfrontend/             # 前端项目
    ├── src/
    │   ├── pages/          # 页面组件
    │   ├── components/     # 通用组件
    │   ├── utils/          # 工具函数
    │   ├── hooks/          # 自定义钩子
    │   └── ...
    ├── package.json
    └── vite.config.js
```

---

## 🎯 核心业务流程 | Core Business Flow

1. **学生申请宿舍** → Student applies for dormitory
2. **管理员审批申请** → Admin approves/rejects application
3. **系统分配床位** → System allocates bed
4. **学生查看分配结果** → Student views result

---

## 📊 数据库实体 | Database Entities

- User (用户)
- Building (楼栋)
- Floor (楼层)
- Room (房间)
- Bed (床位)
- Repair (维修)
- Asset (资产)
- Transfer (调宿)
- Fee (费用)
- Application (宿舍申请)

---

## 📄 许可证 | License

MIT License

---

## 👥 作者 | Author

- [@xiaolinima](https://github.com/xiaolinima)

---

## 💡 项目亮点 | Highlights

- 🎭 角色权限分离
- 🔗 前后端分离架构
- 📱 响应式界面
- 🌐 中俄双语支持
- 🔒 安全认证
- 📊 完整的业务流程

---

这个 README 可以直接放到 GitHub 项目首页！
