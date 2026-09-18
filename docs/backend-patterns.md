# Backend Architecture & Patterns

## Overview

Backend sử dụng **Fastify + Node.js** được tổ chức theo mô hình **Modular Monolith** kết hợp **Feature-based / Vertical Slice Architecture**. 

> [!IMPORTANT]
> Không sử dụng Microservices, Event Sourcing hoặc CQRS đầy đủ trong scope dự án hiện tại.

---

## Core Patterns

### 1. Vertical Slice / Layering: Route → Service → Repository
- **Route / Controller**: Nhận HTTP request, validate input schema, gọi service tương ứng và trả về HTTP response. Không chứa business logic.
- **Service**: Nơi tập trung toàn bộ business logic và điều phối các workflow.
- **Repository (nhẹ)**: Đóng gói truy vấn database (Drizzle ORM). Không tạo Generic Repository hoặc abstraction nhiều tầng nếu không cần thiết.

### 2. State Machine
- Áp dụng cho các lifecycle phức tạp như **Booking**, **Rental**, **Reservation**.
- State transitions phải explicit và được kiểm tra chặt chẽ, nghiêm cấm việc cập nhật status tùy ý không qua transition logic.

### 3. Strategy Pattern
- Áp dụng cho các thành phần có nhiều provider thay thế, ví dụ: **Payment Gateway** (VNPay, Momo, Stripe, etc.).

### 4. Adapter Pattern
- Đóng gói các 3rd-party/external services (SMS, Mail, Cloud Storage, Push Notification) qua interface/adapter để tách rời khỏi core business logic.

### 5. Transaction Script & Database Transactions
- Sử dụng cho các business workflow.
- Mọi nghiệp vụ yêu cầu tính nhất quán (consistency) cao bắt buộc phải sử dụng **Database Transaction** và **Row-level Locking** (`FOR UPDATE`) khi cần tránh race conditions.

### 6. Idempotency Pattern
- Bắt buộc áp dụng cho webhook từ bên thứ ba (payment webhook) và các critical operations có thể bị gọi lặp lại.

### 7. Lightweight Domain Events & Background Jobs
- Dùng cho gửi notification, xử lý ngầm qua **BullMQ + Redis**.
- Worker chạy tách biệt tại `apps/worker`.
