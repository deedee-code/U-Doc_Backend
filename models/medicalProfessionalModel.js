const mongoose = require('mongoose')

const Schema = mongoose.Schema

const medicsSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
      },
    dateOfBirth: {
      type: String,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    medicalPersonnel: {
      type: String,
      required: true
    },
    employmentStatus: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true
    },
    qualification: {
      type: String,
      required: true
    },
    uploadFile: {
      type: String,
      required: true
    },
    street1: {
      type: String
    },
    street2: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    postalCode: {
      type: String
    },
    country: {
      type: String
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
)


module.exports = mongoose.model('Medics', medicsSchema)