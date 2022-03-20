import { FC, useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import { FiArrowUpRight } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { CgTrash } from 'react-icons/cg';
import {
	GetStatsDocument,
	MeDocument,
	useDeleteFileMutation,
} from '@generated/graphql';

const Actions: FC<{ url: string; filename: string; id: number }> = ({
	url,
	filename,
	id,
}) => {
	const [deleteFile] = useDeleteFileMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: MeDocument }, { query: GetStatsDocument }],
	});

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
				className="tooltip tooltip-bottom tooltip-secondary"
				data-tip="Open in new tab"
			>
				<button className="btn btn-secondary" onClick={() => window.open(url)}>
					<FiArrowUpRight size="20" />
				</button>
			</div>
			<div
				className="tooltip tooltip-bottom tooltip-error"
				data-tip="Delete file"
			>
				<button
					className="btn btn-error"
					onClick={async () => {
						await deleteFile({
							variables: { ids: { ids: [id] } },
						}).catch((err) => console.log(err));
					}}
				>
					<CgTrash size="20" />
				</button>
			</div>
		</div>
	);
};

export default Actions;
