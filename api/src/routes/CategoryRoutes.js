const router = require("express").Router();
const { CategoryController } = require("../controllers");

// GET ALL
router.get("/", CategoryController.getAll);

// 🔥 GET CHILDREN BY PARENT
router.get("/:id/children", CategoryController.getChildren);

router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

module.exports = router;