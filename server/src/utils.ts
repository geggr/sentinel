import { z } from "zod";

const DEFAULT_OBJECT_AS_STRING = JSON.stringify({});

export function stringOrObject() {
  return z
    .string()
    .or(z.record(z.string(), z.any()))
    .transform((value) => {
      if (typeof value !== "string") return value;

      try {
        return JSON.parse(value);
      } catch (error) {
        return DEFAULT_OBJECT_AS_STRING;
      }
    })
    .default(DEFAULT_OBJECT_AS_STRING);
}
