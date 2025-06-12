import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
  TextInput,
  Select,
  SelectItem,
} from '@tremor/react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleAddUser = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      setShowAddUser(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
      });
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <Title>User Management</Title>
        <Button onClick={() => setShowAddUser(true)}>Add User</Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-4">{error}</div>
      )}

      {showAddUser && (
        <Card className="mb-6">
          <Title>Add New User</Title>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <TextInput
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <TextInput
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <TextInput
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="chief">Chief</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <div className="flex gap-2">
                      <TextInput
                        value={editingUser.firstName}
                        onChange={(e) => setEditingUser({
                          ...editingUser,
                          firstName: e.target.value
                        })}
                      />
                      <TextInput
                        value={editingUser.lastName}
                        onChange={(e) => setEditingUser({
                          ...editingUser,
                          lastName: e.target.value
                        })}
                      />
                    </div>
                  ) : (
                    `${user.firstName} ${user.lastName}`
                  )}
                </TableCell>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <TextInput
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        email: e.target.value
                      })}
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) => setEditingUser({
                        ...editingUser,
                        role: value
                      })}
                    >
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                      <SelectItem value="chief">Chief</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </Select>
                  ) : (
                    <Badge color={
                      user.role === 'admin' ? 'red' :
                      user.role === 'chief' ? 'amber' :
                      user.role === 'inspector' ? 'blue' :
                      'gray'
                    }>
                      {user.role}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge color={user.active ? 'emerald' : 'gray'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {editingUser?.id === user.id ? (
                      <>
                        <Button size="xs" onClick={handleUpdateUser}>
                          Save
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
} 