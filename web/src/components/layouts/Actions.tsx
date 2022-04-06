import { FC, useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import { saveAs } from 'file-saver';
import { CgTrash } from 'react-icons/cg';
import { AiOutlineLink } from 'react-icons/ai';
import { deleteFile } from '@utils/functions';
import { useSWRConfig } from 'swr';

const Actions: FC<{ url: string; filename: string }> = ({ url, filename }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const { mutate } = useSWRConfig();

	return (
		<div className="flex w-full justify-center gap-5 my-5">
			<div
				className="tooltip tooltip-bottom tooltip-secondary"
				data-tip="Download"
			>
				<button
					className="btn btn-secondary"
					onClick={() => saveAs(url, filename)}
				>
					<HiDownload size="20" />
				</button>
			</div>
			<div
				className={`tooltip tooltip-bottom ${
					copied ? 'tooltip-success' : 'tooltip-secondary'
				}`}
				data-tip={copied ? 'Copied' : 'Copy to clipboard'}
			>
				<button
					className={`btn ${copied ? 'btn-success' : 'btn-secondary'}`}
					onClick={() => {
						navigator.clipboard.writeText(url);
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					}}
				>
					<AiOutlineLink size="20" />
				</button>
			</div>
			<div
				className="tooltip tooltip-bottom tooltip-error"
				data-tip="Delete file"
			>
				<button
					onClick={async () => {
						setIsLoading(true);
						await deleteFile(url.split('/')[3]);
						mutate('gallery');
						setIsLoading(false);
					}}
					className={`btn btn-error ${isLoading ? 'loading disabled' : ''}`}
				>
					{!isLoading && <CgTrash size="20" />}
				</button>
			</div>
		</div>
	);
};

export default Actions;
