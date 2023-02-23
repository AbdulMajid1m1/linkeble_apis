const Joi = require("joi")


const favouriteGig = async (req, res, next) => {
    const value = Joi.object({
        gigId: Joi.string().required()
    }).validate(req.body)
    if (value.error) {

        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }
    try {
        const { gigId } = req.body;
        //  append this in user database to store the favourite gigs
        const updateUserData = await User.findByIdAndUpdate(req.payload.userData._id, {
            $push: {
                favouriteGigs: gigId
            }
        })
        if (!updateUserData) {
            res.status(500).json({ success: false, error: "something went wrong" })
        }
        res.status(200).json({ success: true, message: "Gig added to favourite" })
    }
    catch (err) {
        next(err)
    }
}

const deleteFavouriteGig = async (req, res) => {
    const value = Joi.object({
        gigId: Joi.string().required()
    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, error: value.error.details[0].message })
    }
    try {
        const { gigId } = req.body;
        const updateUserData = await User.findByIdAndUpdate(req.payload.userData._id, {
            $pull: {
                favouriteGigs: gigId
            }
        })
        if (!updateUserData) {
            res.status(500).json({ success: false, error: "something went wrong" })
        }
        res.status(200).json({ success: true, message: "Gig removed from favourite" })
    }
    catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" })
    }
}

module.exports = {
    favouriteGig,
    deleteFavouriteGig
}
