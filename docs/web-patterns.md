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

### 5. Actor Modules & Import Boundaries

Web sử dụng mô hình hybrid để nhiều thành viên phát triển song song:

- `app/`: chỉ chứa Next.js route/layout adapter; page của actor phải import trực tiếp một screen
  từ `modules/` và không chứa business logic.
- `modules/<actor>/`: screen và orchestration riêng của Customer, Facility Staff, Facility
  Manager, Business Operations hoặc System Administrator.
- `features/<domain>/`: nghiệp vụ tái sử dụng giữa các actor như auth, facilities,
  reservations và dashboard primitives.
- `components/`: UI/layout thuần hiển thị, không phụ thuộc actor hoặc business flow.

Chiều dependency bắt buộc:

```text
app → modules → features → api-client/contracts
              ↘ components/config/lib
```

`features` không được import từ `modules`. Không tạo barrel `modules/<actor>/index.ts` cho
route imports vì dễ tạo conflict và kéo các screen không dùng vào cùng client bundle.

Navigation, route constants, permission mapping, mock handlers và mock seeds phải tách file
theo actor/domain; file registry trung tâm chỉ làm nhiệm vụ ghép các cấu hình đã tách.

Style mới của actor module dùng CSS Module colocated. `app/globals.css` chỉ dành cho reset,
legacy MVP styles và utilities thật sự toàn cục.
