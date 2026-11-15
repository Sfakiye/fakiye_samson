// Always mock firebase in every test so no test touches the real database
jest.mock("../config/firebaseConfig", () => ({
    db: {
        collection: jest.fn(),
        doc: jest.fn(),
        runTransaction: jest.fn(),
        batch: jest.fn(),
    },
}));

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Cleanup after all tests in a file
afterAll(() => {
    jest.resetModules();
});