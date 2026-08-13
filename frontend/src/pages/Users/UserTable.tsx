import React from 'react';
import { User } from '@/services/userService';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Edit2, Shield, Lock, Unlock } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleLock: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onToggleLock }) => {
  return (
    <div className="overflow-x-auto ring-1 ring-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.department || 'None'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {user.roles && user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant={role === 'Admin' ? 'danger' : role === 'Manager' ? 'info' : 'default'}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  ))}
                  {(!user.roles || user.roles.length === 0) && <span className="text-sm text-gray-400">None</span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.status === 'Active' ? (
                  <Badge variant="success">
                    <Unlock className="h-3 w-3 mr-1" /> Active
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <Lock className="h-3 w-3 mr-1" /> Locked
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onToggleLock(user)} title={user.status === 'Active' ? 'Lock Account' : 'Unlock Account'}>
                    {user.status === 'Active' ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)} title="Edit Roles">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
