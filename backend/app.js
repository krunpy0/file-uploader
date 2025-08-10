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
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
  if (user)
    return res.status(409).json({ message: "Username is already taken" });

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

app.post("/login", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { username: req.body.username },
  });
  console.log(user);

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { username: req.body.username, id: user.id },
    process.env.JWT_SECRET
  );
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged in" });
});

app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: payload.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out succesfully" });
});

// FILE UPLOADING HERE       FILE UPLOADING       HERE FILE UPLOADING HERE

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("file"), async (req, res) => {
  // verify user
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Invalid token" });
  let user;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    user = payload;
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
  //
  const file = req.file;
  const query = await prisma.file.create({
    data: {
      name: file.originalname,
      storagePath: file.path,
      size: file.size,
      userId: user.id,
    },
  });
  console.log(query);
  res.status(201).json({ message: "File uploaded", file: req.file });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running");
});
