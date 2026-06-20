// const express =
//   require("express");

// const {
//   createContact,
//   getAllContacts
// } = require(
//   "../controllers/contactController"
// );

// const router =
//   express.Router();

// router.post(
//   "/",
//   createContact
// );
// router.get(
//   "/all",
//   getAllContacts
// );

// module.exports =
//   router;

const express = require("express");

const {
  createContact,
  getAllContacts,
  deleteContact
} = require(
  "../controllers/contactController"
);

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router =
  express.Router();

router.post(
  "/",
  createContact
);


router.get(
  "/all",
  protect,
  adminOnly,
  getAllContacts
);



router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteContact
);
module.exports = router;