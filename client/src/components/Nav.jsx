import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-black z-50">
      <div className="text-xl font-bold dark:text-white">Laravel</div>
      <div className="space-x-2">
        <Button variant="outline" onClick={() => navigateTo('/Register')}>
          Sign Up
        </Button>
        <Button variant="outline" onClick={() => navigateTo('/Dashboard')}>
          Users Ip{' '}
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
