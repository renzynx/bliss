import { API_ROUTES, API_URL } from '@lib/constants';
import { UploadOptions } from '@lib/types';
import axios from 'axios';
import { useCallback, useState } from 'react';

export const uploadFiles = (() => {
	const defaultOptions: UploadOptions = {
		url: API_URL + API_ROUTES.UPLOAD_FILE,
		startByte: 0,
		fileId: '',
		onAbort() {},
		onProgress() {},
		onError() {},
		onComplete() {},
	};

	const fileRequests = new WeakMap<
		File,
		{ options: UploadOptions; request: XMLHttpRequest | null }
	>();

	const uploadFileChunk = (file: File, options: UploadOptions) => {
		const formData = new FormData();
		const req = new XMLHttpRequest();
		const chunk = file.slice(options.startByte);

		formData.append('chunk', chunk, file.name);
		formData.append('fileId', options.fileId!);

		req.open('POST', options.url!, true);
		req.withCredentials = true;

		req.setRequestHeader(
			'Content-Range',
			`bytes=${options.startByte}-${options.startByte! + chunk.size}/${
				file.size
			}`
		);

		req.setRequestHeader('X-File-Id', options.fileId!);

		req.onload = (e) => {
			if (req.status === 200) {
				options.onComplete(e, file);
			} else {
				options.onError(e, file);
			}
		};

		req.upload.onprogress = (e) => {
			const loaded = options.startByte! + e.loaded;
			options.onProgress(
				{
					...e,
					loaded,
					total: file.size,
					percentage:
						Math.round((loaded / file.size) * 100) > 100
							? 100
							: Math.round((loaded / file.size) * 100),
				},
				file
			);
		};

		req.ontimeout = (e) => options.onError(e, file);

		req.onabort = (e) => options.onAbort(e, file);

		req.onerror = (e) => options.onError(e, file);

		// @ts-ignore
		fileRequests.get(file).request = req;

		req.send(formData);
	};

	const uploadFile = (file: File, options: UploadOptions) => {
		return axios
			.post(
				API_URL + API_ROUTES.UPLOAD_REQUEST,
				{ filename: file.name },
				{ withCredentials: true }
			)
			.then((res) => res.data)
			.then((data) => {
				options = { ...options, ...data };
				fileRequests.set(file, { request: null, options });
				uploadFileChunk(file, options);
			})
			.catch((err) => {
				options.onError({ ...err }, file);
			});
	};

	const abortFileUpload = (file: File) => {
		const fileReq = fileRequests.get(file);

		if (fileReq && fileReq.request) {
			fileReq.request.abort();
			return true;
		}

		return false;
	};
	const clearFileUpload = async (file: File) => {
		const fileReq = fileRequests.get(file);

		if (fileReq) {
			await abortFileUpload(file);
			fileRequests.delete(file);

			return true;
		}

		return false;
	};
	const retryFileUpload = (file: File) => {
		const fileReq = fileRequests.get(file);

		if (fileReq) {
			return axios
				.get(
					`${API_URL + API_ROUTES.UPLOAD_STATUS}?filename=${file.name}&fileId=${
						fileReq.options.fileId
					}`,
					{ withCredentials: true }
				)
				.then((res) => res.data)
				.then((data) => {
					uploadFileChunk(file, {
						...fileReq.options,
						startByte: +data.uploaded,
					});
				})
				.catch(() => {
					uploadFileChunk(file, fileReq.options);
				});
		}
	};
	const resumeFileUpload = (file: File) => {
		const fileReq = fileRequests.get(file);

		if (fileReq) {
			return axios
				.get(
					`${API_URL + API_ROUTES.UPLOAD_STATUS}?filename=${file.name}&fileId=${
						fileReq.options.fileId
					}`,
					{ withCredentials: true }
				)
				.then((res) => res.data)
				.then((data) => {
					uploadFileChunk(file, {
						...fileReq.options,
						startByte: +data.uploaded,
					});
				})
				.catch((err) => {
					fileReq.options.onError({ ...err }, file);
				});
		}
	};

	return (files: File[], options = defaultOptions) => {
		files.forEach((file) =>
			uploadFile(file, { ...defaultOptions, ...options })
		);

		return {
			abortFileUpload,
			resumeFileUpload,
			retryFileUpload,
			clearFileUpload,
		};
	};
})();

export const useUploadAndTrackFiles = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [progress, setProgress] = useState<Record<string, string>[]>([]);
	const [error, setError] = useState<string[]>([]);
	const [complete, setComplete] = useState<boolean[]>([]);
	const [abort, setAbort] = useState<boolean[]>([]);

	const onProgress = useCallback((e: any, file: File) => {
		setProgress((prev) => {
			const index = prev.findIndex((p) => p.name === file.name);
			if (index !== -1) {
				prev[index] = {
					...prev[index],
					...e,
				};
			} else {
				prev.push({
					name: file.name,
					...e,
				});
			}

			return [...prev];
		});
	}, []);
	const onError = useCallback(
		(e: any, file: File) => {
			const index = files.indexOf(file);
			const newError = [...error];
			newError[index] = e.message;
			setError(newError);
		},
		[error, files]
	);
	const onAbort = useCallback(
		(e: any, file: File) => {
			const index = files.indexOf(file);
			const newAbort = [...abort];
			newAbort[index] = true;
			setAbort(newAbort);
		},
		[abort, files]
	);
	const onComplete = useCallback(
		(e: any, file: File) => {
			const index = files.indexOf(file);
			const newComplete = [...complete];
			newComplete[index] = true;
			setComplete(newComplete);
		},
		[complete, files]
	);

	const upload = useCallback(
		(files: File[]) => {
			setFiles(files);
			uploadFiles(files, {
				onProgress,
				onError,
				onAbort,
				onComplete,
			});
		},
		[onAbort, onComplete, onError, onProgress]
	);

	return { upload, files, progress, error, complete, abort };
};
