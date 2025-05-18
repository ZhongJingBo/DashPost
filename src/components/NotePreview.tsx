import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "h1",
  "h2",
  "h3",
  "pre",
  "code"
]);

const allowedAttributes = Object.assign(
  {},
  sanitizeHtml.defaults.allowedAttributes,
  {
    img: ["alt", "src"],
  }
);

const NotePreview = ({ children }: { children: string }) => {
  return (
    <div className="note-preview">
      <div
        className="text-with-markdown prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(marked(children || "").toString(), {
            allowedTags,
            allowedAttributes,
          }),
        }}
      />
      <style>{`
        .text-with-markdown pre {
          background-color: #f5f5f5;
          border-radius: 6px;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }
        .text-with-markdown code {
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 0.2em 0.4em;
          font-size: 0.9em;
          color: #476582;
        }
        .text-with-markdown pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          color: inherit;
        }
        .text-with-markdown pre::-webkit-scrollbar {
          height: 8px;
        }
        .text-with-markdown pre::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 4px;
        }
        .text-with-markdown pre::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default NotePreview;
