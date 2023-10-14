const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: String,
            required: true
        },
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
        },
        role: {
            type: String,
        },
        address: {
            type: String,
        },
        state: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        country: {
            type: String
        },
        notificationChannel: {
            email: {
                type: Boolean,
                default: false
            },
            phoneNumber: {
                type: Boolean,
                default: false
            }
        },
        notificationOption: {
            consultationBooking: {
                type: Boolean,
                default: false
            },
            consultationReminders: {
                type: Boolean,
                default: false
            },
            medicationReminders: {
                type: Boolean,
                default: false
            },
            medicationRefillReminders: {
                type: Boolean,
                default: false
            },
            newsletter: {
                type: Boolean,
                default: false
            }
        },
        privacyPreferredDetails: {
            allDetails: {
                type: Boolean,
                default: false
            },
            personalDetails: {
                type: Boolean,
                default: false
            },
            contentDetails: {
                type: Boolean,
                default: false
            },
            medicalRecords: {
                type: Boolean,
                default: false
            },
        },
        medicalPersonnel: {
            medicalDoctor: {
                type: Boolean,
                default: false
            },
            pharmacists: {
                type: Boolean,
                default: false
            },
            nurses: {
                type: Boolean,
                default: false
            },
            nutritionist: {
                type: Boolean,
                default: false
            },
            labScientist: {
                type: Boolean,
                default: false
            }
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Patient', patientSchema)