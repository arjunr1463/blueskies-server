const Testimony = require("../models/testimony");
const sharp = require("sharp");

//create
const createTestimony = async (req, res) => {
  try {
    const { name, coursedetail, placed, year, description } = req.body;
    if (!name || !coursedetail || !placed || !year || !description) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }
    if (
      typeof name !== "string" ||
      typeof coursedetail !== "string" ||
      typeof placed !== "string" ||
      typeof year !== "string" ||
      typeof description !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid data type for one or more fields" });
    }
    const testimony = new Testimony({
      name,
      coursedetail,
      placed,
      year,
      description,
      image: {
        data: await sharp(req.file.buffer).resize(200).toBuffer(),
        contentType: req.file.mimetype,
      },
    });
    await testimony.save();
    res.json("Successfully created");
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
};

//get
const getAllTestimony = async (req, res) => {
  try {
    const testimonies = await Testimony.find({});
    res.json(testimonies);
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
};

//update
const adminTestimonyActive = async (req, res) => {
  try {
    const id = req.params.id;
    const member = await Testimony.findByIdAndUpdate(id);
    if (member) {
      member.status = "active";
      member.save();
      res.json("Success");
    } else {
      res.json("Testimony member not found");
    }
  } catch (error) {
    res.json("Failed");
    console.log(error);
  }
};

const adminTestimonyInactive = async (req, res) => {
  try {
    const id = req.params.id;
    const member = await Testimony.findByIdAndUpdate(id);
    if (member) {
      member.status = "Inactive";
      member.save();
      res.json("Success");
    } else {
      res.json("Testimony member not found");
    }
  } catch (error) {
    res.json("Failed");
    console.log(error);
  }
};

const adminTestimonyEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;

    if (req.file) {
      const imageBuffer = await sharp(req.file.buffer)
        .resize(500, 500, { fit: "inside" })
        .toBuffer();

      updatedUser.image = {
        data: imageBuffer,
        contentType: req.file.mimetype,
      };
    } else {
      const existingTestimony = await Testimony.findById(id);
      updatedUser.image = existingTestimony.image;
    }

    const updatedTestimony = await Testimony.findByIdAndUpdate(
      id,
      updatedUser,
      { new: true }
    );

    res.json(updatedTestimony);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update testimony" });
  }
};



//delete
const adminTestimonyDelete = async (req, res) => {
  const id = req.params.id;
  Testimony.findByIdAndDelete(id)
    .then((user) => {
      res.json(user);
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Unable to delete user." });
    });
};

module.exports = {
  createTestimony,
  getAllTestimony,
  adminTestimonyActive,
  adminTestimonyInactive,
  adminTestimonyDelete,
  adminTestimonyEdit,
};
