import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export function fetch(request: Request) {
  return handler(request);
}

export default {
  fetch,
};