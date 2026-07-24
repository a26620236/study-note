export const downloadFile = ({
  downloadUrl,
  filename,
}: {
  downloadUrl: string;
  filename: string;
}) => {
  if (!downloadUrl) {
    throw new Error('Please make sure downloadUrl is exist.');
  }
  const element = document.createElement('a');
  element.href = downloadUrl;
  if (filename) {
    element.download = filename;
  }
  document.body.appendChild(element);
  element.click();
  element.remove();
  return element;
};
