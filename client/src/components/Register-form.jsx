import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function RegisterForm({ className, ...props }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);

    console.log({ name, email, password, password_confirmation });
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      console.log('Response:', response.data);

      setSuccess('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.error('Error response:', err.response);

        if (err.response.data.errors) {
          setError(
            err.response.data.errors.email ||
              'Registration failed. Please try again.'
          );
        } else {
          setError(err.response.data.message || 'Registration failed');
        }
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle className="text-2xl">
            {' '}
            <img
              src="https://download.logo.wine/logo/Laravel/Laravel-Logo.wine.png"
              alt="Image"
              className="w-48"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="passwordConfirmation">
                    Password Confirmation
                  </Label>
                </div>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you have an account?{' '}
              <Link to="/" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
            {error && <div className="mt-3 text-red-500">{error}</div>}
            {success && <div className="mt-3 text-green-500">{success}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
