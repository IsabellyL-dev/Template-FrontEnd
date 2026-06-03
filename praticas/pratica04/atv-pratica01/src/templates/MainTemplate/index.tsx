import { Container } from '../../components/Container';
import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';
import { UserGreeting } from '../../components/UserGreeting';

type MainTemplateProps = {
  children: React.ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <>
      <UserGreeting />

      <Container>
        <Logo />
      </Container>

      <Container>
        <Menu />
      </Container>

      {children}

      <Container>
        <Footer />
      </Container>
    </>
  );
}