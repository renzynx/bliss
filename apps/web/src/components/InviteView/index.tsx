import { Box, Button, Group, PasswordInput, Text } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Invite } from '@prisma/client';
import { FC } from 'react';

const InviteView: FC<{
  invite: Invite;
}> = ({ invite }) => {
  const { copy, copied } = useClipboard();

  return (
    <Box
      p="lg"
      sx={(t) => ({
        display: 'flex',
        width: '100%',
        alignItems: 'end',
        gap: '1%',
        backgroundColor:
          t.colorScheme === 'dark' ? t.colors.dark[7] : t.colors.gray[2],
      })}
    >
      <Group direction="column" sx={{ width: '100%' }} position="apart">
        <Text size="sm" weight="semibold">
          Used by:
          <Text
            ml="5px"
            sx={{ display: 'inline-block' }}
            size="sm"
            weight="bold"
            color={invite.usedBy ? 'red' : 'teal'}
          >
            {invite.usedBy ?? 'None'}
          </Text>
        </Text>
        <Text size="sm" weight="semibold">
          Expires: {new Date(invite.expiresAt).toLocaleString()}
        </Text>
        <PasswordInput
          sx={{ width: '100%' }}
          label="Invite Code"
          readOnly
          value={invite.code}
        />
        <Button
          fullWidth
          onClick={() => copy(invite.code)}
          color={copied ? 'teal' : 'indigo'}
          disabled={!!invite.usedBy}
        >
          {copied ? 'Copied code to clipboard' : 'Copy code'}
        </Button>
      </Group>
    </Box>
  );
};

export default InviteView;
