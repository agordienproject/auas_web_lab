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
import { userService } from '../services';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      // Use userService instead of direct fetch
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Use userService instead of direct fetch
      const updatedUser = await userService.updateUser(editingUser.id, editingUser);
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Use userService instead of direct fetch
      const addedUser = await userService.createUser(newUser);
      setUsers([...users, addedUser]);
      setShowAddUser(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Use userService instead of direct fetch
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setError(null);
  };

  const handleCancelAdd = () => {
    setShowAddUser(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <Title>User Management</Title>
        <Button 
          onClick={() => setShowAddUser(true)}
          disabled={saving}
        >
          Add User
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
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
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <TextInput
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  disabled={saving}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <TextInput
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                disabled={saving}
              >
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="chief">Chief</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="secondary" 
                onClick={handleCancelAdd}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddUser}
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Adding...' : 'Add User'}
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <div className="space-y-2">
                        <TextInput
                          value={editingUser.firstName}
                          onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                          disabled={saving}
                        />
                        <TextInput
                          value={editingUser.lastName}
                          onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                    ) : (
                      `${user.firstName} ${user.lastName}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <TextInput
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        disabled={saving}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Select
                        value={editingUser.role}
                        onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                        disabled={saving}
                      >
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="chief">Chief</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </Select>
                    ) : (
                      <Badge color={
                        user.role === 'admin' ? 'red' :
                        user.role === 'chief' ? 'orange' :
                        user.role === 'inspector' ? 'blue' :
                        'gray'
                      }>
                        {user.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge color={user.active ? 'emerald' : 'red'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={handleUpdateUser}
                          loading={saving}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={() => handleEditUser(user)}
                          disabled={saving}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                          loading={saving}
                          disabled={saving}
                        >
                          {saving ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
} 