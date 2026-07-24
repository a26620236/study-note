import { copyText } from '../src/copyText';

describe('copyText', () => {
  let writeTextMock = vi.fn();

  beforeEach(() => {
    writeTextMock = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call navigator.clipboard.writeText with the given text', () => {
    // Arrange
    const text = 'hello world';

    // Act
    copyText(text);

    // Assert
    expect(writeTextMock).toHaveBeenCalledWith(text);
    expect(writeTextMock).toHaveBeenCalledTimes(1);
  });

  it('should call navigator.clipboard.writeText with empty string', () => {
    copyText('');
    expect(writeTextMock).toHaveBeenCalledWith('');
  });
});
