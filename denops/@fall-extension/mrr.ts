import type { GetSource } from "https://deno.land/x/fall_core@v0.9.0/mod.ts";
import { assert, is } from "jsr:@core/unknownutil@3.18.0";

const isOptions = is.StrictOf(is.PartialOf(is.ObjectOf({})));

export const getSource: GetSource = (denops, options) => {
  assert(options, isOptions);
  return {
    async stream() {
      const paths = await denops.call("mr#mrr#list") as string[];
      return ReadableStream.from(paths).pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            controller.enqueue({
              value: chunk,
              detail: { path: chunk },
            });
          },
        }),
      );
    },
  };
};