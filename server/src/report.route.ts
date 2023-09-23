import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { HttpStatus } from "./http.status";
import { z } from "zod";
import { randomUUID } from "crypto";
import { stringOrObject } from "./utils";

type DeleteReportParams = {
  id: string;
};

export default async function ReportRoute(application: FastifyInstance) {
  const repository = new PrismaClient();

  const DEFAULT_PAGE = 0;
  const DEFAULT_ITEMS_PER_PAGE = 100;

  application.get("/api/report/configure", async (request, reply) => {
    const uuid = await randomUUID();
    return {
      message: "Report Configured",
      uuid,
    };
  });

  application.post("/api/report/create", async (request, reply) => {
    const schema = z.object({
      environment: z.string(),
      label: z.string(),
      tag: z.string(),
      path: z.string().optional(),
      error: stringOrObject(),
      user: stringOrObject(),
    });

    try {
      const body = schema.parse(request.body);

      const report = await repository.report.create({
        data: {
          environment: body.environment,
          label: body.label,
          tag: body.tag,
          path: body.path,
          error: JSON.stringify(body.error),
          user: JSON.stringify(body.user),
          created_at: new Date(),
        },
      });

      application.io.emit("report:new", { report: JSON.stringify(report) })

      return report;
    } catch (error) {
      console.log(error);
      reply.status(HttpStatus.BAD_REQUEST).send({ error });
    }
  });

  application.delete<{ Params: DeleteReportParams }>(
    "/api/report/:id",
    async (request, reply) => {
      try {
        const id = Number(request.params.id);

        const deleted = await repository.report.delete({
          where: {
            id,
          },
        });

        return deleted;
      } catch (error) {
        reply.status(HttpStatus.BAD_REQUEST).send({ error });
      }
    }
  );

  application.get("/api/reset", async (request, reply) => {
    const deleted = await repository.report.deleteMany({})

    return {
      message: "Reset",
      count: deleted.count
    }
  })

  application.get("/api/reports", async (request, _reply) => {
    const schema = z.object({
      page: z
        .number()
        .transform((value) => Number(value))
        .default(DEFAULT_PAGE),
      limit: z
        .number()
        .transform((value) => Number(value))
        .default(DEFAULT_ITEMS_PER_PAGE),
    });

    const query = schema.parse(request.query);

    const reports = await repository.report.findMany({
      skip: query.page,
      take: query.limit,
    });

    return reports.map((it) => {
      try {
        const errorParsed = it.error && JSON.parse(it.error);
        const userParsed = it.user && JSON.parse(it.user);

        return {
          ...it,
          error: errorParsed,
          user: userParsed,
        };
      } catch (_error) {
        return it;
      }
    });
  });

  application.get("/api/reports/tags", async (_request, reply) => {

    const reports = await repository.report.findMany({
      select: {
        tag: true
      },
      distinct: "tag"
    })

    return reports.map(it => it.tag)

  })

  application.get<{ Params: DeleteReportParams }>(
    "/api/report/:id",
    async (request, reply) => {
      try {
        const id = Number(request.params.id);

        const report = await repository.report.findUnique({
          where: {
            id,
          },
        });

        if (!report){
           return reply.status(HttpStatus.NOT_FOUND).send()
        }

        return ({
          ...report,
          user: report.user && JSON.parse(report.user),
          error: report.error && JSON.parse(report.error)
        });
      } catch (error) {
        reply.status(HttpStatus.BAD_REQUEST).send({ error });
      }
    }
  );

  application.get<{ Params: { id: string} }>("/api/reports/tag/:id", async (request, _reply) => {
    const schema = z.object({
      page: z.number().default(DEFAULT_PAGE),
      limit: z.number().default(DEFAULT_ITEMS_PER_PAGE),
    });

    const query = schema.parse(request.query);

    const tag = request.params.id

    const reports = await repository.report.findMany({
      where: {
        tag,
      },
      skip: query.page,
      take: query.limit,
    });

    return reports.map((it) => {
      try {
        const parsed = it.error && JSON.parse(it.error);

        return {
          ...it,
          error: parsed,
        };
      } catch (_error) {
        return it;
      }
    });
  });
}
