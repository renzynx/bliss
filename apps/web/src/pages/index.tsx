import dynamic from 'next/dynamic';
import ToggleTheme from '#components/ToggleTheme';
const Header = dynamic(import('#components/Header'));

export function Index() {
  return (
    <>
      <Header />
      <ToggleTheme />
    </>
  );
}

export default Index;
