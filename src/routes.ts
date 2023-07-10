import { Express } from 'express'

import userRoute from './modules/user/user.route'
import contentRoute from './modules/content/content.route'
import ticketRoute from './modules/ticket/ticket.route'

function routes(app: Express) {
    app.use("/api/v1", userRoute);
    app.use("/api/v1", contentRoute);
    app.use("/api/v1", ticketRoute)
}

export default routes