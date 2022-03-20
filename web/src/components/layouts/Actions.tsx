import { FC, useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import { saveAs } from 'file-saver';
import { CgTrash } from 'react-icons/cg';
import {
	GetStatsDocument,
	MeDocument,
	useDeleteFileMutation,
} from '@generated/graphql';
import { AiOutlineLink } from 'react-icons/ai';

const Actions: FC<{ url: string; filename: string; id: number }> = ({
	url,
	filename,
	id,
}) => {
	const [deleteFile] = useDeleteFileMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: MeDocument }, { query: GetStatsDocument }],
	});
	const [display, setDisplay] = useState(false);

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
				className={`tooltip tooltip-open tooltip-right tooltip-secondary ${
					display ? '' : 'hidden'
				}`}
				data-tip="Copied Link"
			></div>
			<button
				className="btn btn-secondary"
				onClick={() => {
					navigator.clipboard.writeText(url);
					setDisplay(true);
					setTimeout(() => setDisplay(false), 2000);
				}}
			>
				<AiOutlineLink size="20" />
			</button>
			<div
				className="tooltip tooltip-bottom tooltip-error"
				data-tip="Delete file"
			>
				<button
					className="btn btn-error"
					onClick={async () => {
						await deleteFile({
							variables: { ids: { ids: [id] } },
						});
					}}
				>
					<CgTrash size="20" />
				</button>
			</div>
		</div>
	);
};

export default Actions;
