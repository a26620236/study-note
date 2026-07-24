import ReactMarkdown, { type Options as ReactMarkdownOptions } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function Markdown({ children, components = { p: 'span' }, ...rest }: ReactMarkdownOptions) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components} {...rest}>
      {children}
    </ReactMarkdown>
  );
}
