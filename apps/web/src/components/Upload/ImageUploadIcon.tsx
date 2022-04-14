import { DropzoneStatus } from '@mantine/dropzone';
import {
  Icon as TablerIcon,
  Upload as UploadIcon,
  X,
  Photo,
} from 'tabler-icons-react';

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <UploadIcon {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export default ImageUploadIcon;
