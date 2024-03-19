const gallery = require("../models/gallery");
const video = require("../models/galleryVideo");
const sharp = require("sharp");

//create image
const createImage = async (req, res) => {
  try {
    const imageBuffers = await Promise.all(
      req.files.map((file) => {
        if (file.size > 1500000) {
          throw new Error("File size should be less than 1MB");
        }
        return sharp(file.buffer).resize(800).jpeg().toBuffer();
      })
    );

    const newGalleryItems = await Promise.all(
      imageBuffers.map((buffer) =>
        gallery.create({
          image: {
            data: buffer,
            contentType: "image/jpeg",
          },
        })
      )
    );

    res.status(201).json(newGalleryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

//update
const activeImage = async (req, res) => {
  try {
    const user = await gallery.findOneAndUpdate(
      req.params.id,
      { $set: { imagestatus: "active" } },
      { new: true }
    );
    return user
      ? res.json({ message: "Image status updated" })
      : res.status(404).json({ message: "Image not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const inactiveImage = async (req, res) => {
  try {
    const user = await gallery.findOneAndUpdate(
      req.params.id,
      { $set: { imagestatus: "Inactive" } },
      { new: true }
    );
    return user
      ? res.json({ message: "Image status updated" })
      : res.status(404).json({ message: "Image not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const activeVideo = async (req, res) => {
  try {
    const user = await gallery.findOneAndUpdate(
      req.params.id,
      { $set: { videostatus: "active" } },
      { new: true }
    );
    return user
      ? res.json({ message: "Video status updated" })
      : res.status(404).json({ message: "Video not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const inactiveVideo = async (req, res) => {
  try {
    const user = await video.findOneAndUpdate(
      req.params.id,
      { $set: { videostatus: "Inactive" } },
      { new: true }
    );
    return user
      ? res.json({ message: "Video status updated" })
      : res.status(404).json({ message: "Video not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//deleteImage
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGalleryItem = await gallery.findByIdAndDelete(id);
    res.status(200).json(deletedGalleryItem);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await video.findByIdAndDelete(id);
    res.status(200).json(deletedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

//getImage
const getAllImages = async (req, res) => {
  try {
    const galleryItems = await gallery.find();

    res.status(200).json(galleryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

//getVideo
const getAllVideos = async (req, res) => {
  try {
    const videos = await video.find();

    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

//createvideo
const createVideo = async (req, res) => {
  try {
    const videos = req.body.videos;
    for (const videoUrl of videos) {
      const data = new video({
        videos: videoUrl,
      });
      await data.save();
    }

    res.json("success");
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createImage,
  createVideo,
  getAllImages,
  getAllVideos,
  activeImage,
  inactiveImage,
  deleteImage,
  activeVideo,
  inactiveVideo,
  deleteVideo,
};
