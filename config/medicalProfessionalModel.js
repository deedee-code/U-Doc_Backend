const mongoose = require('mongoose')

const Schema = mongoose.Schema

const medicsSchema = new Schema(
  {
    personalDetails: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      gender: {
        type: Boolean,
        required: true
      },
      nationality: {
        type: String,
        required: true
      }
    },
    professionalDetails: {
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
      }
    },
    contactDetails: {
      addres: {
        line1: {
          type: String
        },
        line2: {
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
      }
    },
    loginDetails: {
      phoneNumber: {
        type: String,
        required: true,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
    },
  },
  {
        timestamps: true
  }
)


module.exports = mongoose.model('Medics', medicsSchema)