const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const redis = require("../config/redis");
const cacheUser = require("../middleware/cache");

router.post("/", async (req, res) => {
  try {
    const { name, email, role, skills } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.create({
      name,
      email,
      role,
      skills
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", cacheUser, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.set(`user:${userId}`, JSON.stringify(user), {
      EX: 60
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.del(`user:${userId}`);
    console.log("🧹 CACHE INVALIDATED (UPDATE)");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await redis.del(`user:${userId}`);
    console.log(" CACHE INVALIDATED");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
