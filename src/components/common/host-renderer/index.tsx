import { useDomain } from "@/hooks/global/use-domain";
import { Fragment } from "react";

type Props = {
  content: string;
  replace?: string;
};

const HostRenderer = ({ content, replace = "302.AI" }: Props) => {
  const domain = useDomain();
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Split content by URLs while preserving them
  const parts = content.split(urlPattern);
  const urls = content.match(urlPattern) || [];
  let urlIndex = 0;

  const renderTextPart = (text: string) => {
    const textParts = text.split(replace);
    return textParts.map((part, idx) => (
      <Fragment key={idx}>
        {part}
        {idx < textParts.length - 1 && (
          <a
            href={domain}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {replace}
          </a>
        )}
      </Fragment>
    ));
  };

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          // Text content
          return <span key={index}>{renderTextPart(part)}</span>;
        } else {
          // URL content
          const url = urls[urlIndex++];
          return (
            <a
              key={index}
              href={url === replace ? domain : url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {replace}
            </a>
          );
        }
      })}
    </>
  );
};

export default HostRenderer;
