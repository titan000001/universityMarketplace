// config/__mocks__/database.js
const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockBeginTransaction = jest.fn();
const mockCommit = jest.fn();
const mockRollback = jest.fn();

const mockConnection = {
    query: mockQuery,
    release: mockRelease,
    beginTransaction: mockBeginTransaction,
    commit: mockCommit,
    rollback: mockRollback,
};

const mockGetConnection = jest.fn().mockResolvedValue(mockConnection);

const db = {
    query: mockQuery,
    getConnection: mockGetConnection,
};

module.exports = db;
