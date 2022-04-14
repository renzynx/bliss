import { ItemProps } from '#lib/types';
import { Autocomplete, Group, Avatar, Text } from '@mantine/core';
import { FC, forwardRef, useMemo } from 'react';
import { bytesToSize } from '@bliss/shared-types';
import { File } from '@prisma/client';

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, id, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const FileComplete: FC<{
  files: File[];
  loading: boolean;
  setSearch: (s: string) => void;
}> = ({ files, loading, setSearch }) => {
  const data = useMemo(() => {
    if (loading) return [];

    return files.map((file) => ({
      label: file.originalName,
      value: file.originalName,
      description: bytesToSize(file.size),
      id: file.id.toString(),
      image: `${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`,
    }));
  }, [files, loading]);

  return (
    <>
      <Autocomplete
        label="Search"
        size="md"
        itemComponent={SelectItem}
        data={data}
        placeholder="Search for a file"
        mb="15px"
        nothingFound="Couldn't find any files with that name."
        sx={{ width: '100%' }}
        onChange={(e) => setSearch(e)}
      />
    </>
  );
};

export default FileComplete;
