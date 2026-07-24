import { downloadFile } from '../src/downloadFile';

describe('downloadFile', () => {
  const click = vi.fn();
  const remove = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const mockElement = {
    href: '',
    download: '',
    click,
    remove,
  } as unknown as HTMLAnchorElement;

  beforeEach(() => {
    click.mockReset();
    remove.mockReset();
    mockElement.href = '';
    mockElement.download = '';
    vi.spyOn(document, 'createElement').mockReturnValue(mockElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw when downloadUrl is empty string', () => {
    expect(() => downloadFile({ downloadUrl: '', filename: 'file.csv' })).toThrow(
      'Please make sure downloadUrl is exist.'
    );
  });

  it('should set href and download, then click and remove the element', () => {
    // Arrange
    const downloadUrl = 'https://example.com/file.csv';
    const filename = 'file.csv';

    // Act
    downloadFile({ downloadUrl, filename });

    // Assert
    expect(mockElement.href).toBe(downloadUrl);
    expect(mockElement.download).toBe(filename);
    expect(click).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should not set download attribute when filename is empty string', () => {
    downloadFile({ downloadUrl: 'https://example.com/file.csv', filename: '' });
    expect(mockElement.download).toBe('');
  });

  it('should append the element to document.body before clicking', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');

    downloadFile({ downloadUrl: 'https://example.com/file.csv', filename: 'file.csv' });

    expect(appendSpy).toHaveBeenCalledWith(mockElement);
  });
});
