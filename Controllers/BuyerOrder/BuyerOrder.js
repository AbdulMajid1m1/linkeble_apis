const Order = require("../../Models/Order");

const getOneOrder = async (req, res) => {
    try {
        const order = await Order.findById({
            _id: req.params.orderId, buyerId: req.payload.userData._id
        }).populate('buyerId', 'username email').populate('talentId', 'username email').populate('serviceId', 'title category');
        res.status(200).json({ success: true, data: order })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}

const getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find({ buyerId: req.payload.userData._id }).populate('buyerId', 'username email').populate('talentId', 'username email').populate('serviceId', 'title category');
        res.status(200).json({ success: true, data: orders })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }


}


const deleteOneOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete({
            _id: req.params.orderId, buyerId: req.payload.userData._id
        });
        res.status(200).json({ success: true, data: order })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}

const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate({
            _id: req.params.orderId, buyerId: req.payload.userData._id
        },
            { orderStatus: "completed" }
            , { new: true });
        res.status(200).json({ success: true, data: order })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}

module.exports = { getOneOrder, getAllOrders, deleteOneOrder, acceptOrder }