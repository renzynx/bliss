import { useGetConfigMutation } from '#lib/redux/slices/auth.slice';
import { Button, useMantineTheme } from '@mantine/core';
import { useCallback } from 'react';

const GenerateConfig = () => {
  const theme = useMantineTheme();
  const [getConfig, { isLoading }] = useGetConfigMutation();

  const download = useCallback(() => {
    getConfig()
      .unwrap()
      .then((config) => {
        const element = document.createElement('a');
        element.setAttribute(
          'href',
          'data:text/plain;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(config))
        );
        element.setAttribute('download', 'bliss.sxcu');
        element.click();
      });
  }, [getConfig]);

  return (
    <>
      <Button
        onClick={download}
        loading={isLoading}
        color="violet"
        variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}
        size="md"
        sx={{ width: '100%' }}
      >
        Download ShareX Config
      </Button>
    </>
  );
};

export default GenerateConfig;
