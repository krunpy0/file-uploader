const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

async function findUser() {
  const user = await prisma.user.findFirst({
    where: { username: "testuser1" },
  });
  console.log(user);
  return user;
}

app.get("/", async (req, res) => {
  try {
    const user = await findUser();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  } finally {
    await prisma.$disconnect;
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running");
});
