"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = __importStar(require("../controllers/user.controller"));
// ===========================================================================
//  SWAGGER JSDoc ANNOTATIONS
// ===========================================================================
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách users (có phân trang, tìm kiếm, lọc)
 *     description: |
 *       Trả về danh sách người dùng có hỗ trợ:
 *       - Phân trang (page, limit)
 *       - Tìm kiếm theo tên hoặc email (search)
 *       - Lọc theo khoảng tuổi (ageMin, ageMax)
 *       - Sắp xếp (sortBy, sortOrder)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Số trang (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Số lượng kết quả mỗi trang (tối đa 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc email
 *       - in: query
 *         name: ageMin
 *         schema:
 *           type: integer
 *         description: Tuổi tối thiểu
 *       - in: query
 *         name: ageMax
 *         schema:
 *           type: integer
 *         description: Tuổi tối đa
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, age, createdAt, updatedAt]
 *           default: createdAt
 *         description: Trường sắp xếp
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", controller.getUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tao user moi
 *     description: Tao mot nguoi dung moi trong he thong. Email phai duy nhat.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           examples:
 *             valid_user:
 *               summary: User hop le day du thong tin
 *               value:
 *                 name: "Nguyen Van A"
 *                 email: "nguyenvana@example.com"
 *                 age: 25
 *             minimal_user:
 *               summary: Chi co name va email
 *               value:
 *                 name: "Tran Thi B"
 *                 email: "tranthib@example.com"
 *     responses:
 *       201:
 *         description: Tao user thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tao user thanh cong."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Du lieu khong hop le (thieu field, email sai format, duplicate email, age ngoai pham vi)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_name:
 *                 value:
 *                   success: false
 *                   message: "Truong 'name' la bat buoc va khong duoc de trong."
 *               duplicate_email:
 *                 value:
 *                   success: false
 *                   message: "Email nay da duoc su dung. Vui long dung email khac."
 *               invalid_age:
 *                 value:
 *                   success: false
 *                   message: "Truong 'age' phai la so trong khoang tu 0 den 120."
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", controller.createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lay thong tin user theo ID
 *     description: Tra ve thong tin chi tiet cua mot nguoi dung dua tren MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         description: MongoDB ObjectId cua user
 *     responses:
 *       200:
 *         description: Lay thong tin user thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID khong dung dinh dang ObjectId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "ID khong hop le. Vui long cung cap MongoDB ObjectId dung dinh dang."
 *       404:
 *         description: Khong tim thay user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Khong tim thay user voi ID: 64a1b2c3d4e5f6a7b8c9d0e1"
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", controller.getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cap nhat thong tin user
 *     description: Cap nhat mot hoac nhieu truong thong tin cua nguoi dung. Chi can gui cac truong muon thay doi.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         description: MongoDB ObjectId cua user can cap nhat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A (Updated)"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updated@example.com"
 *               age:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 120
 *                 example: 30
 *           examples:
 *             update_name_only:
 *               summary: Chi cap nhat ten
 *               value:
 *                 name: "Nguyen Van B"
 *             update_all_fields:
 *               summary: Cap nhat tat ca fields
 *               value:
 *                 name: "Le Van C"
 *                 email: "levanc@example.com"
 *                 age: 30
 *     responses:
 *       200:
 *         description: Cap nhat thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cap nhat user thanh cong."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID khong hop le hoac du lieu cap nhat khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Khong tim thay user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", controller.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xoa user
 *     description: Xoa vinh vien mot nguoi dung khoi he thong dua tren MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         description: MongoDB ObjectId cua user can xoa
 *     responses:
 *       200:
 *         description: Xoa user thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xoa user thanh cong."
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedId:
 *                       type: string
 *                       example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *                     deletedUser:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: ID khong dung dinh dang ObjectId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Khong tim thay user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", controller.deleteUser);
exports.default = router;
