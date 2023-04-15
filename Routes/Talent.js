const express = require('express')
const { createServiceStepOne, createServiceStepTwo,
    createServiceStepThree,
    createServiceStepFour,
    deleteServiceGalleryData,
    deleteServiceDocumentData,
    getAllTalentServices,
    deleteOneService,
    updateServiceStepOne,
    getServiceById,
    updateAllServices,
} = require('../Controllers/Talent/Talent')
const { auth } = require('../Middlewares/auth')
const route = express.Router()

route.post("/create-service/step-one", auth, createServiceStepOne)
route.post("/update-service/step-one/:serviceId", auth, updateServiceStepOne)
route.post("/create-service/step-two/:serviceId", auth, createServiceStepTwo)
route.post("/create-service/step-three/:serviceId", auth, createServiceStepThree)
route.post("/create-service/step-four/:serviceId", auth, createServiceStepFour)
route.delete("/delete-service-gallery-data/:serviceId", auth, deleteServiceGalleryData)
route.delete("/delete-service-document-data/:serviceId", auth, deleteServiceDocumentData)
route.get("/get-services-data", auth, getAllTalentServices)
route.get("/get-single-service/:serviceId", auth, getServiceById)
route.delete("/delete-service/:serviceId", auth, deleteOneService)

module.exports = route
