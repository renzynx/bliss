import { greenBright, redBright, yellowBright } from "colorette";

const getCurrentTime = () => {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const time = `${hours}:${minutes}:${seconds}`;
	return time;
};

const logger = {
	info: (...args: any[]) => process.stdout.write(`${getCurrentTime()} ${greenBright("[INFO]")} ${yellowBright(args.join(" "))}\n`),
	error: (...args: any[]) => process.stdout.write(`${getCurrentTime()} ${redBright("[ERROR]")} ${yellowBright(args.join(" "))}\n`)
};

export default logger;
