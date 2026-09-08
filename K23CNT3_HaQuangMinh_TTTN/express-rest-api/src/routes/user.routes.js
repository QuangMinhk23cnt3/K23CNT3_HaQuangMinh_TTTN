const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/user.controller");


// ===========================================================================
//  SWAGGER JSDoc ANNOTATIONS
// ===========================================================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     description: Trả về toàn bộ danh sách người dùng trong hệ thống, sắp xếp theo thời gian tạo mới nhất.
 *     tags: [Users]
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
 *       500:
 *         description: Loi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getUsers);


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
router.post("/", createUser);


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
router.get("/:id", getUserById);


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
router.put("/:id", updateUser);


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
router.delete("/:id", deleteUser);


module.exports = router;