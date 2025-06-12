import { useState, useEffect } from 'react';
import { Card, Title, TextInput, Button } from '@tremor/react';

export default function UserProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(prev => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Profile Settings</Title>
      
      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1">
                <TextInput
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <TextInput
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Title>Change Password</Title>
            
            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1">
                  <TextInput
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={profile.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <TextInput
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={profile.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm">{success}</div>
          )}

          <div className="flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
} 