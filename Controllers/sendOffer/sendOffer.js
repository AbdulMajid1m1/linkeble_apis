const sendOffer = require('../../Models/sendOffer');

exports.sendOfferPost = async (req, res) => {
    try {
        const { description, budget, delivery_time, revisions, services } = req.body;

       

          const sendoffer = await sendOffer.create({
            description: description,
            budget: budget,
            delivery_time: delivery_time,
            revisions: revisions,
            services: services
          });
      
          res.status(200).send(sendoffer);
          console.log(sendOffer);
      

    } catch (err) {
        console.log(err);
        res.send({ err })
    }
}