import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

export default async function ReportRoute(application: FastifyInstance) {
  const FILE_PATH = path.resolve(__dirname, "..", "public", "sentinel.client.js");

  application.get("/client/sentinel.js", (request, reply) => {
    fs.readFile(FILE_PATH, (error, buffer) => {
      if (error) {
        return reply.send({
          error,
        });
      }
      reply.type("text/javascript").send(buffer);
    });
  });
}
