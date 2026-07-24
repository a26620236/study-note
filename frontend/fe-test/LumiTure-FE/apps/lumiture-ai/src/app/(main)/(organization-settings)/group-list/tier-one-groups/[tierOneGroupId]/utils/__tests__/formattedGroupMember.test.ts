import type { UsersInfos } from '@hooks-api';

import { formatGroupMembers } from '../formattedGroupMember';

function createUser(overrides?: Partial<UsersInfos>): UsersInfos {
  return {
    userId: 'user-1',
    userName: 'Alice',
    email: 'alice@example.com',
    role: 'admin',
    activeStatus: true,
    lastLogin: '2026-03-01T00:00:00Z',
    action: {},
    ...overrides,
  };
}

describe('formatGroupMembers', () => {
  describe('when users is undefined', () => {
    it('should return empty array', () => {
      expect(formatGroupMembers(undefined)).toEqual([]);
    });
  });

  describe('userName transformation', () => {
    it('should replace single space userName with "--"', () => {
      const result = formatGroupMembers([createUser({ userName: ' ' })]);

      expect(result[0].userName).toBe('--');
    });

    it('should keep non-space userName as-is', () => {
      const result = formatGroupMembers([createUser({ userName: 'Alice' })]);

      expect(result[0].userName).toBe('Alice');
    });
  });

  describe('activeStatus transformation', () => {
    it('should convert true activeStatus to "Active"', () => {
      const result = formatGroupMembers([createUser({ activeStatus: true })]);

      expect(result[0].activeStatus).toBe('Active');
    });

    it('should convert false activeStatus to "Inactive"', () => {
      const result = formatGroupMembers([createUser({ activeStatus: false })]);

      expect(result[0].activeStatus).toBe('Inactive');
    });
  });

  describe('lastLogin transformation', () => {
    it('should format lastLogin as relative time', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-15T00:00:00Z'));

      const result = formatGroupMembers([createUser({ lastLogin: '2026-03-15T00:00:00Z' })]);

      expect(result[0].lastLogin).toContain('ago');

      vi.useRealTimers();
    });

    it('should return "--" when lastLogin is null', () => {
      const result = formatGroupMembers([createUser({ lastLogin: null })]);

      expect(result[0].lastLogin).toBe('--');
    });
  });

  describe('when users has multiple items', () => {
    it('should transform all users and preserve order', () => {
      const users = [
        createUser({ userName: 'Alice', activeStatus: true }),
        createUser({ userName: ' ', activeStatus: false }),
      ];

      const result = formatGroupMembers(users);

      expect(result).toHaveLength(2);
      expect(result[0].userName).toBe('Alice');
      expect(result[0].activeStatus).toBe('Active');
      expect(result[1].userName).toBe('--');
      expect(result[1].activeStatus).toBe('Inactive');
    });
  });

  describe('other fields', () => {
    it('should preserve all other fields unchanged', () => {
      const user = createUser({ userId: 'u-42', email: 'bob@test.com', role: 'viewer' });

      const result = formatGroupMembers([user]);

      expect(result[0].userId).toBe('u-42');
      expect(result[0].email).toBe('bob@test.com');
      expect(result[0].role).toBe('viewer');
    });
  });
});
