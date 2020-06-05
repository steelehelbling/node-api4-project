require('dotenv').config();
const express = require("express");
const data = require("./data.js");

const server = express();

const port = process.env.PORT;


server.listen(port, () => console.log(`\n == API on port ${port} == \n`));

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ api: "up and running" });
  res.send("server is returning data");
});

server.post("/api/users", (req, res) => {
  const newUser = data.createUser({
    name: req.body.name,
    bio: req.body.bio,
  });

  if (newUser) {
    try {
      res.status(201).json(newUser);
    } catch {
      res.status(500).json({
        errorMessage: "data did not grab",
      });
    }
  } else {
    res.status(400).json({
      errorMessage: "name and bio required",
    });
  }
});

server.get("/api/users", (req, res) => {
  const users = data.getUsers();

  if (users) {
    res.json(users);
  } else {
    return res.status(500).json({
      errorMessage: "error getUser failed",
    });
  }
});

server.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = data.getUserById(userId);

  if (user) {
    try {
      res.json(user);
    } catch {
      res.status(500).json({
        errorMessage: "user does not exist",
      });
    }
  } else {
    res.status(404).json({
      message: "error getID failed",
    });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const user = data.getUserById(req.params.id);
  const err = new Error();

  if (user) {
    try {
      data.deleteUser(user.id);
      res.status(204).end();
    } catch {
      res.status(500).json({
        errorMessage: "user does not exist",
      });
    }
  } else {
    res.status(404).json({
      message: "error deleted failed",
    });
  }
});

server.put("/api/users/:id", (req, res) => {
  const user = data.getUserById(req.params.id);

  if (user) {
    try {
      const updatedUser = data.updateUser(user.id, {
        name: req.body.name || user.name,
        bio: req.body.bio || user.bio,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({
        errorMessage: "error updated failed",
      });
    }
  } else {
    res.status(404).json({
      errorMessage: "user does not exist",
    });
  }
});
