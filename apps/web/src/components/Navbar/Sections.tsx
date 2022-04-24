import { useAppSelector } from '#lib/redux/hooks';
import {
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
  Center,
  Loader,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { FC } from 'react';
import {
  CloudUpload,
  Settings,
  X,
  File,
  ChartInfographic,
  MailForward,
} from 'tabler-icons-react';
import useStyles from './Navbar.styles';

interface SectionProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
  admin?: boolean;
}

const Section: FC<SectionProps> = ({ color, icon, label, href }) => {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <UnstyledButton
      className={classes.section_button}
      onClick={() => router.push(href)}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const data: SectionProps[] = [
  {
    icon: <CloudUpload />,
    color: 'blue',
    label: 'Upload',
    href: '/dashboard',
  },
  {
    icon: <File />,
    color: 'green',
    label: 'Files',
    href: '/dashboard/files',
  },
  {
    icon: <Settings />,
    color: 'teal',
    label: 'Settings',
    href: '/dashboard/settings',
  },
  { icon: <X />, color: 'teal', label: 'ShareX', href: '/dashboard/sharex' },
  {
    icon: <MailForward />,
    color: 'teal',
    label: 'Invites',
    href: '/dashboard/invites',
  },
  {
    icon: <ChartInfographic />,
    color: 'teal',
    label: 'Statistics',
    href: '/dashboard/statistics',
    admin: true,
  },
];

const Sections = () => {
  const { user } = useAppSelector((state) => state.user);

  if (!user)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );

  return (
    <>
      {user.admin
        ? data.map((section) => <Section key={section.label} {...section} />)
        : data
            .filter((section) => !section.admin)
            .map((section) => <Section key={section.label} {...section} />)}
    </>
  );
};

export default Sections;
