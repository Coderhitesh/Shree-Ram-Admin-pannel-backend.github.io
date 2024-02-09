const express = require('express')
const { RegisterUser, LogginUser, LogoutUser,getUserIdbyUser } = require('../controllers/usercontroller')
const { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { protect } = require('../middleware/authmiddlleware')
const { CreateOrder, orderForMe, orderForAdmin, UpdateOrderStatus, getTransactionID } = require('../controllers/orderController')
const router  =express.Router()


router.post('/Register',RegisterUser)
router.post('/Login',LogginUser)
router.get('/Logout',protect,LogoutUser)

router.post('/create-product',protect,createProduct)
router.get('/all-product',getAllProducts)
router.post('/single-product/:id',getOneProduct)
router.patch('/update-product/:id',protect,updateProduct)
router.delete('/delete-product/:id',protect,deleteProduct)
router.get('/get-Transication-id/:OrderId',getTransactionID);   
router.post('/create-order',protect,CreateOrder)
router.get('/my-order',protect,orderForMe)
router.get('/admin-order',protect,orderForAdmin)
router.get('/finduserbyid/:user_id',getUserIdbyUser)

router.get('/update-order',UpdateOrderStatus)

module.exports=router 
