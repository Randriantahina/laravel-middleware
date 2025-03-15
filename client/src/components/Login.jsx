import { LoginForm } from './Login-form';
import Navigation from './Nav';
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navigation />
      <div className="w-full max-w-sm md:max-w-3xl mt-24">
        <LoginForm />
      </div>
    </div>
  );
}
