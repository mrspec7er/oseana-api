import express from "express";
import routes from "./routes";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use('/media', express.static('media'));

routes(app);

app.listen(PORT, () =>
  console.log(
    `
🚀 Server ready at: PORT:` + PORT
  )
);