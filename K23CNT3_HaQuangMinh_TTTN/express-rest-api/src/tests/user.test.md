# Test Cases - Express REST API (User Management)

**Base URL**: `http://localhost:3000`  
**Tổng số test cases**: 16  
**Phạm vi kiểm thử**: Tất cả endpoints CRUD của `/api/users`

---

## Môi trường kiểm thử

| Thông tin | Giá trị |
|-----------|---------|
| Server | http://localhost:3000 |
| Database | MongoDB (express_demo) |
| Content-Type | application/json |
| Tool | Postman |

---

## Test Suite 1: GET /api/users — Lấy danh sách users

### TC01 — Lấy danh sách users (DB rỗng)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/api/users` |
| **Precondition** | Database rỗng (không có user nào) |
| **Request Body** | _(không có)_ |

**Expected Response**:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `success` | `true` |
| `count` | `0` |
| `data` | `[]` (mảng rỗng) |

---

### TC02 — Lấy danh sách users (đã có dữ liệu)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/api/users` |
| **Precondition** | Database có ít nhất 1 user |
| **Request Body** | _(không có)_ |

**Expected Response**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "nguyenvana@example.com",
      "age": 25,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `success` | `true` |
| `count` | >= 1 |
| `data` | Mảng chứa objects có đầy đủ fields |
| Mỗi item trong `data` có | `_id`, `name`, `email`, `age`, `createdAt`, `updatedAt` |

---

## Test Suite 2: POST /api/users — Tạo user mới

### TC03 — Tạo user hợp lệ (đầy đủ thông tin)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"name": "Nguyen Van A", "email": "nguyenvana@example.com", "age": 25}` |

**Expected Response**:
```json
{
  "success": true,
  "message": "Tạo user thành công.",
  "data": {
    "_id": "...",
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "age": 25,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `201 Created` |
| `success` | `true` |
| `data._id` | Tồn tại (MongoDB ObjectId) |
| `data.name` | `"Nguyen Van A"` |
| `data.email` | `"nguyenvana@example.com"` |
| `data.age` | `25` |

---

### TC04 — Tạo user hợp lệ (không có age — dùng default)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"name": "Tran Thi B", "email": "tranthib@example.com"}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `201 Created` |
| `data.age` | `18` (giá trị default) |

---

### TC05 — Tạo user — Thiếu trường `name`

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"email": "test@example.com", "age": 20}` |

**Expected Response**:
```json
{
  "success": false,
  "message": "Trường 'name' là bắt buộc và không được để trống."
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |
| `message` | Chứa nội dung thông báo lỗi về name |

---

### TC06 — Tạo user — Thiếu trường `email`

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"name": "Le Van C", "age": 22}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |
| `message` | Chứa thông báo lỗi về email |

---

### TC07 — Tạo user — Email sai định dạng

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"name": "Le Van D", "email": "not-an-email", "age": 20}` |

**Expected Response**:
```json
{
  "success": false,
  "message": "Định dạng email không hợp lệ."
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |

---

### TC08 — Tạo user — Email đã tồn tại (duplicate)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Precondition** | Email `nguyenvana@example.com` đã tồn tại (TC03 đã chạy) |
| **Request Body** | `{"name": "Nguyen Van E", "email": "nguyenvana@example.com", "age": 30}` |

**Expected Response**:
```json
{
  "success": false,
  "message": "Email này đã được sử dụng. Vui lòng dùng email khác."
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |

---

### TC09 — Tạo user — Age ngoài phạm vi (> 120)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | POST |
| **URL** | `/api/users` |
| **Request Body** | `{"name": "Test User", "email": "test2@example.com", "age": 200}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |
| `message` | Chứa thông báo về phạm vi age |

---

## Test Suite 3: GET /api/users/:id — Lấy user theo ID

### TC10 — Lấy user theo ID hợp lệ (tồn tại)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/api/users/{{user_id}}` |
| **Precondition** | `{{user_id}}` là ID lấy từ TC03 |

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "_id": "{{user_id}}",
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "age": 25
  }
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `success` | `true` |
| `data._id` | Bằng với `{{user_id}}` |

---

### TC11 — Lấy user theo ID không tồn tại

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/api/users/64a1b2c3d4e5f6a7b8c9d0e1` |
| **Ghi chú** | ID đúng format nhưng không tồn tại trong DB |

**Expected Response**:
```json
{
  "success": false,
  "message": "Không tìm thấy user với ID: 64a1b2c3d4e5f6a7b8c9d0e1"
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `404 Not Found` |
| `success` | `false` |

---

### TC12 — Lấy user theo ID sai định dạng

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/api/users/invalid-id-123` |

**Expected Response**:
```json
{
  "success": false,
  "message": "ID không hợp lệ. Vui lòng cung cấp MongoDB ObjectId đúng định dạng."
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |

---

## Test Suite 4: PUT /api/users/:id — Cập nhật user

### TC13 — Cập nhật user hợp lệ (tất cả fields)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | PUT |
| **URL** | `/api/users/{{user_id}}` |
| **Request Body** | `{"name": "Nguyen Van A Updated", "email": "updated@example.com", "age": 30}` |

**Expected Response**:
```json
{
  "success": true,
  "message": "Cập nhật user thành công.",
  "data": {
    "_id": "{{user_id}}",
    "name": "Nguyen Van A Updated",
    "email": "updated@example.com",
    "age": 30
  }
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `success` | `true` |
| `data.name` | `"Nguyen Van A Updated"` |
| `data.email` | `"updated@example.com"` |
| `data.age` | `30` |

---

### TC14 — Cập nhật user — Chỉ cập nhật 1 field (name)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | PUT |
| **URL** | `/api/users/{{user_id}}` |
| **Request Body** | `{"name": "Ten Moi"}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `data.name` | `"Ten Moi"` |
| `data.email` | Không thay đổi so với trước |

---

### TC15 — Cập nhật user — ID không tồn tại

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | PUT |
| **URL** | `/api/users/64a1b2c3d4e5f6a7b8c9d0e1` |
| **Request Body** | `{"name": "Test"}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `404 Not Found` |
| `success` | `false` |

---

### TC16 — Cập nhật user — ID sai định dạng

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | PUT |
| **URL** | `/api/users/bad-id` |
| **Request Body** | `{"name": "Test"}` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |

---

## Test Suite 5: DELETE /api/users/:id — Xóa user

### TC17 — Xóa user hợp lệ (tồn tại)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | DELETE |
| **URL** | `/api/users/{{user_id}}` |
| **Precondition** | User tồn tại |

**Expected Response**:
```json
{
  "success": true,
  "message": "Xóa user thành công.",
  "data": {
    "deletedId": "{{user_id}}",
    "deletedUser": { ... }
  }
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `success` | `true` |
| `data.deletedId` | Bằng với `{{user_id}}` |

---

### TC18 — Xóa user — ID không tồn tại

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | DELETE |
| **URL** | `/api/users/64a1b2c3d4e5f6a7b8c9d0e1` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `404 Not Found` |
| `success` | `false` |

---

### TC19 — Xóa user — ID sai định dạng

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | DELETE |
| **URL** | `/api/users/invalid-id` |

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `400 Bad Request` |
| `success` | `false` |

---

## Test Suite 6: Health Check

### TC20 — Health check endpoint

| Thuộc tính | Giá trị |
|-----------|---------|
| **Method** | GET |
| **URL** | `/` |

**Expected Response**:
```json
{
  "message": "Express + MongoDB API is running",
  "version": "1.0.0",
  "docs": "http://localhost:3000/api-docs"
}
```

| Kiểm tra | Kết quả mong đợi |
|---------|-----------------|
| Status code | `200 OK` |
| `message` | `"Express + MongoDB API is running"` |
| `docs` | URL trỏ đến `/api-docs` |

---

## Tổng kết Test Cases

| Suite | Số TC | Endpoints |
|-------|-------|-----------|
| GET /api/users | 2 | TC01, TC02 |
| POST /api/users | 7 | TC03 – TC09 |
| GET /api/users/:id | 3 | TC10 – TC12 |
| PUT /api/users/:id | 4 | TC13 – TC16 |
| DELETE /api/users/:id | 3 | TC17 – TC19 |
| Health Check | 1 | TC20 |
| **Tổng** | **20** | |

### Phân loại theo loại test

| Loại | Số TC |
|------|-------|
| Happy Path (thành công) | 8 |
| Validation Error (400) | 8 |
| Not Found (404) | 3 |
| Server Error (500) | 1 |
