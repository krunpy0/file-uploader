const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("./generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

async function findUser() {
  const user = await prisma.user.findMany();
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

app.post("/sign-up", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { username: req.body.username },
  });
  if (user) return res.status(409).json({ message: "username taken" });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await prisma.user.create({
      data: { username: req.body.username, password: hashedPassword },
    });
    console.log(user);
    res.status(201).json({ message: "sign-up success" });
  } catch (err) {
    console.log(err);
    res.status(500);
  } finally {
    await prisma.$disconnect;
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running");
});
