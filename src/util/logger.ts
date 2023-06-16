import pino from "pino";
import PinoPretty from "pino-pretty";
import day from "dayjs";

const pretty = PinoPretty({
	translateTime: day().format("YYYY-MM-DD HH:mm:ss"),
});
const logger = pino(pretty);
export default logger;
