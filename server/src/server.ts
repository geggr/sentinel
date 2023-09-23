import { Server } from "socket.io";
import { fastify } from "fastify";
import { fastifyCors as CorsMiddleware } from "@fastify/cors";
import FastifySocketIO from "fastify-socket.io";
import ReportRoute from "./report.route";
import ClientRoute from "./client.route";

const application = fastify({ trustProxy: true });

application.register(CorsMiddleware, { origin: "*" });
application.register(FastifySocketIO, { cors: { origin: '*' }})
application.register(ReportRoute);
application.register(ClientRoute)

application
  .listen({ port: 8080, host: "0.0.0.0" })
  .then(() => console.log(`[SERVER]: Started at port 3000`))
  .catch((reason) =>
    console.log(`[SERVER]: Unable to start the application: ${reason}`)
  );


declare module "fastify" {
  interface FastifyInstance {
    io: Server
  }
}
