# Web Frontend Patterns

## Overview

Web frontend xây dựng với **Next.js (App Router)** và **React**, định hướng cấu trúc theo **Feature-based Architecture**.

---

## Core Patterns & Guidelines

### 1. Component Composition
- **Feature Components**: Đặt trong từng feature folder, đảm nhận việc kết nối hooks, API client và hiển thị dữ liệu của feature đó.
- **Reusable UI Components**: Các component thuần hiển thị (buttons, dialogs, inputs, tables), không chứa business logic hoặc gọi API trực tiếp.

### 2. State Separation
Phải phân định rạch ròi giữa 3 loại state:
- **Server State**: Sử dụng **TanStack Query** để fetch, cache, mutate và invalidate dữ liệu từ API.
- **Client/Global State**: Sử dụng **Zustand** khi thực sự cần chia sẻ state giữa nhiều component độc lập (auth session, global modal, theme). Không lạm dụng khi có thể quản lý cục bộ.
- **Form State**: Sử dụng **React Hook Form** kết hợp với **Zod** để validate schema dựa trên contract chung.

### 3. API Client Pattern & Shared Contracts
- Luôn sử dụng centralized API client (`packages/api-client`), không gọi `fetch` hay `axios` rải rác trong component.
- Tái sử dụng schema/types từ `packages/contracts`.
- Database models không được expose trực tiếp cho frontend.

### 4. Logic Placement
- Nghiêm cấm đặt business logic hoặc direct API fetch trong UI components.
- Tách logic thành custom hooks theo từng feature (`useBooking`, `useRentalFlow`, ...).
