import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

export default (handler: any) => {
    return middy(handler).use([
        httpEventNormalizer(),
        httpErrorHandler(),
        cors({ credentials: true }),
    ]);
};
