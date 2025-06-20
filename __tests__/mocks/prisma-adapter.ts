export const PrismaAdapter = jest.fn(() => ({
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));