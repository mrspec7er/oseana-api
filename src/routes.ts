import { Express } from "express";

import user from "./modules/user/user.route";
import content from "./modules/content/content.route";
import ticket from "./modules/ticket/ticket.route";
import cart from "./modules/cart/cart.route";

function routes(app: Express) {
  app.use("/", (req, res) => {
    res.status(200).json({
      message: "Hello there!",
    });
  });
  app.use("/api/v1", user);
  app.use("/api/v1", content);
  app.use("/api/v1", ticket);
  app.use("/api/v1", cart);
}

export default routes;
