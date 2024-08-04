import express, { json } from "express";
import cors from "cors";
import { ChessBoard } from "./chessboard.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(json());

export let game = new ChessBoard();

app.get("/positions", (req, res) => {
  console.log("Get positions.");
  res.json(game.getPositions());
});

app.get("/available-moves", (req, res) => {
  const squareKey = req.query.key;
  console.log("Available moves: ", squareKey);
  if (!squareKey) res.json([]);

  const availableMoves = game.getAvailableMoves(squareKey);
  console.log(availableMoves);
  res.json(availableMoves);
});

app.post("/move", (req, res) => {
  const { currSquare, newSquare } = req.body;
  console.log("Move: ", { currSquare, newSquare });
  if (!currSquare || !newSquare) return res.json({ message: "Invalid square" });

  game.makeMove(currSquare, newSquare);
  res.json({ message: "Move made successfully" });
});

app.listen(port, (error) => {
  if (!error)
    return console.error(
      "Server is Successfully Running,and App is listening on port " + port,
    );

  console.log("Error occurred, server can't start", error);
});
