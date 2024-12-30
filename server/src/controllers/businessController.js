const Business = require('./../models/businessModel');

module.exports = {
    getBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    subscribeToBusiness,
    unsubscribeFromBusiness,
    addReview,
    getReviewsByBusinessId
}

// async function (req, res, next) {
//     try {

//     } catch (error) {
//         next(error);
//     }
// }

//business
async function getBusinesses(req, res, next) {
    try {
        const { limit, offset, name, description } = req.query;
        console.log(name);
        const query = {};
        if(name) query.name = { $regex: new RegExp(name, 'i')};
        if(description) query.description = { $regex: new RegExp(description, 'i')};

        const businesses = await Business
        .find(query)
        .limit(limit ? limit : 0)
        .skip(offset ? offset : 0)
        .populate("owner", "name email plan plainPassword")
        res.json(businesses);
    } catch (error) {
        next(error);
    }
}

async function addBusiness(req, res, next) {
    try {
        const { _id } = req.user;
        const { name, description, category } = req.body;
        const business = new Business({ name, description, category, owner: _id });
        const result = await business.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

//I'm fetching business twice here, which is wasteful.
//also, the business might get deleted between the first and second fetch.
async function updateBusiness(req, res, next) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const { name, description, category } = req.body;
        const business = await Business.findById(id);
        if(!business){
            res.status(400).json({message:"can't find this business"})
        }
        const ownerId = business.owner.toString();
        if (_id !== ownerId) {
            console.log("_id:",_id);
            console.log("ownerId:", ownerId);
            res.status(400).json({ message: "you are not the owner of this business!"});
            return;
        }
        if (name === "" || description === "" || category === "") {
            res.status(400).json({ message: "fields cannot be empty strings!" });
            return;
        }
        const result = await Business.findByIdAndUpdate(id, { name, description, category });//what will happen if one of these are missing from the request body?
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function deleteBusiness(req, res, next) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const business = await Business.findById(id);
        if(!business){
            res.status(400).json({message:"can't find this business"})
        }
        const ownerId = business.owner.toString();
        if (_id !== ownerId) {
            console.log("_id:", _id);
            console.log("ownerId:",ownerId);
            res.status(400).json({ message: "you are not the owner of this business!" });
            return;
        }
        const result = await Business.findByIdAndDelete(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
//subscriptions
async function subscribeToBusiness(req, res, next) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const business = await Business.findById(id);
        if (business.subscribers.includes(_id) || business.subscribers.includes(_id.toString())) {
            res.json({ message: "the user is already subscribed to this business" });
            return;
        }
        business.subscribers.push(_id);
        const result = await business.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function unsubscribeFromBusiness(req, res, next) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const business = await Business.findById(id);
        business.subscribers = business.subscribers.filter(sub => {return sub !== _id && sub.toString() !== _id.toString()});
        const result = await business.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
}
//reviews
async function addReview(req, res, next) {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const { comment } = req.body;
        const business = await Business.findById(id);
        business.reviews.push({ userId: _id.toString(), comment });
        const result = await business.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
}
async function getReviewsByBusinessId(req, res, next) {
    try {
        const { id } = req.params;
        const reviews = await Business.findOne({ _id: id }, { reviews: 1 }).populate("reviews.userId", "name");
        res.json(reviews);
    } catch (error) {
        next(error);
    }
}