const express = require("express");
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");
const adminMiddleware = require("../middlewares/adminJwtMiddleware");

const router = express.Router();
// /api/path - standard format
router.post("/api/register", userController.userRegister);
router.post("/api/login", userController.userLogin);
router.post("/api/google-login", userController.googleLogin);

//book
router.post(
  "/api/addBook",
  jwtMiddleware,
  multerMiddleware.array("UploadedImages", 3),
  bookController.addBook
);
//get book details from mongodb
router.get("/api/get-books", jwtMiddleware, bookController.getBooks);
//get home book details from mongodb
router.get("/api/get-home-books", bookController.getHomeBooks);
//view Book
router.get("/api/viewBook/:id", jwtMiddleware, bookController.viewBook);
//get user added book
router.get('/api/userBooks',jwtMiddleware,bookController.getUserBook)
//get user purchase book
router.get('/api/purchase-book',jwtMiddleware,bookController.getpurchaseDetails)

router.get('/get-session/:id', jwtMiddleware,bookController.viewBook)

//get user - update profile
router.get("/api/get-user/:id", jwtMiddleware, userController.getUser);
router.put(
  "/api/update-user",
  jwtMiddleware,
  multerMiddleware.single("profile"),
  userController.updateUser
);
//admin side getbook,getuser
router.get("/api/get-allbooks", adminMiddleware, bookController.getBooks);
router.get("/api/get-users", adminMiddleware, userController.getUserList);
router.get("/api/get-admin", adminMiddleware, userController.getAdmin);
//update-admin
router.put(
  "/api/update-admin",
  adminMiddleware,
  multerMiddleware.single("profile"),
  userController.AdminProfileController
);


//payment
router.put( "/api/makePayment",jwtMiddleware,bookController.buyBook);
router.post('/save-order', async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json("Payment not completed");
    }

    const email = session.customer_details?.email;
    const bookId = session.metadata.bookId;
    const userId = session.metadata.userId;
    const amount = session.amount_total / 100;

    await Orders.create({
      userId,
      bookId,
      email,
      amount,
      paymentId: session.payment_intent,
      status: "paid"
    });

    res.json("Order stored successfully");

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
