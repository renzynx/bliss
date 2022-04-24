import InviteView from '#components/InviteView';
import Loading from '#components/Loading';
import Shell from '#layouts/Shell';
import { useAuth } from '#lib/hooks/useAuth';
import {
  useCreateInviteMutation,
  useGetInvitesQuery,
} from '#lib/redux/slices/auth.slice';
import { RootError } from '#lib/types';
import { Button, SimpleGrid, Text, Box } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';

const InvitePage = () => {
  const { data } = useAuth();
  const { data: user, isLoading } = useGetInvitesQuery();
  const [createInvite, { isLoading: isCreating }] = useCreateInviteMutation();

  if (!data || isLoading || !user) return <Loading />;

  return (
    <Shell>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Button
          color="green"
          size="md"
          loading={isCreating}
          onClick={() =>
            createInvite()
              .unwrap()
              .then(() => {
                showNotification({
                  message: 'Invite created',
                  title: 'Success',
                  color: 'teal',
                  icon: <Check />,
                });
              })
              .catch((err: RootError) => {
                if (err.status === 400) {
                  showNotification({
                    message: 'You have reached the maximum number of invites.',
                    title: 'Error',
                    color: 'red',
                    icon: <X />,
                    autoClose: 5000,
                  });
                } else if (err.status == 429) {
                  showNotification({
                    message: 'Too many request, please try again later.',
                    title: 'Error',
                    color: 'red',
                    icon: <X />,
                    autoClose: 5000,
                  });
                } else {
                  console.log(err);
                  showNotification({
                    message: 'Something went wrong, please try again later.',
                    title: 'Error',
                    color: 'red',
                    icon: <X />,
                    autoClose: 5000,
                  });
                }
              })
          }
        >
          <Text>{isCreating ? 'Creating invite' : 'Create invite'}</Text>
        </Button>
        {!user.invites.length ? (
          <Text size="xl" align="center">
            You don&apos;t have any active invites.
          </Text>
        ) : (
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'sm', cols: 1 },
              { maxWidth: 'md', cols: 1 },
            ]}
          >
            {user.invites.map((invite) => (
              <InviteView key={invite.code} invite={invite} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Shell>
  );
};

export default InvitePage;
