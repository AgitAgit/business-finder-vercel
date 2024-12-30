const express = require('express');
const router = express.Router();

const { authUser } = require('../middleware/authUser.js');
const {
    getBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    subscribeToBusiness,
    unsubscribeFromBusiness,
    addReview,
    getReviewsByBusinessId
} = require("../controllers/businessController.js");

router.get("/", getBusinesses);

router.post("/", authUser, addBusiness);

router.put("/:id", authUser, updateBusiness);

router.post("/:id/delete", authUser, deleteBusiness);

router.post("/:id/subscribe", authUser, subscribeToBusiness);

router.delete("/:id/unsubscribe", authUser, unsubscribeFromBusiness);

router.post("/:id/review", authUser, addReview);

router.get("/:id/reviews", getReviewsByBusinessId);

module.exports = router;