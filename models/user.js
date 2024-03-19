const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  studentid: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  certified: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  coursefee: {
    type: String,
    required: true,
  },
  paymenttype: {
    type: String,
  },
  coursestart: {
    type: Date,
  },
  courseend: {
    type: Date,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  studyMaterials: [
    {
      name: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      data: {
        type: Buffer,
        required: true,
      },
    },
  ],
  password: {
    type: String,
  },
  confirmpassword: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  certificates: [
    {
      name: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      data: {
        type: Buffer,
        required: true,
      },
    },
  ],

  personalstatus: {
    type: String,
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    this.studentid = `BS${randomNumber}`;
  }
  next();
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
