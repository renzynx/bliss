import { readdir, stat } from "fs/promises";
import { charsets, GENERATOR_TYPE } from "./constants";
import crypto from "crypto";
import path from "path";

const { text, zerowidth, emoji } = charsets;

export const randomString = (length: number) => crypto.randomBytes(length).toString("hex");

export const dirSize = async (directory: string) => {
	const files = await readdir(directory);
	const stats = files.map((file) => stat(path.join(directory, file)));

	return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
};

export const bytesToHr = (bytes: number) => {
	const units = ["B", "KB", "MB", "GB", "TB", "PB"];
	let num = 0;
	while (bytes > 1024) {
		bytes /= 1024;
		++num;
	}
	return `${(isNaN(+bytes) ? 0 : +bytes).toFixed(1)} ${units[num]}`;
};

export const slugGenerator = (length: number, type: GENERATOR_TYPE) => {
	switch (type) {
		case GENERATOR_TYPE.TEXT:
			for (var i = 0, random = ""; i < length; ++i) random += text[Math.floor(Math.random() * text.length)];
			return random;
		case GENERATOR_TYPE.ZEROWIDTH:
			for (var i = 0, random = ""; i < length; ++i) random += zerowidth[Math.floor(Math.random() * zerowidth.length)];
			return random;
		case GENERATOR_TYPE.EMOJI:
			for (var i = 0, random = ""; i < length; ++i) random += emoji[Math.floor(Math.random() * emoji.length)];
			return random;
	}
};
