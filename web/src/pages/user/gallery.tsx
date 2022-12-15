import FileViewer from '@components/FileViewer';
import { CustomNextPage } from '@lib/types';

const FilePage: CustomNextPage = () => {
	return (
		<>
			<FileViewer />
		</>
	);
};

FilePage.options = {
	auth: true,
	withLayout: true,
};

export default FilePage;
