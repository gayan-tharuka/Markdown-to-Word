
import { useState, useCallback, useRef } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { marked } from "marked";

const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState("");
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    if (!markdown) return;
    
    try {
      // Create a temporary div with the formatted HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = marked(markdown);
      
      // Create a selection and range
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        
        // If we have a preview ref, use it for better content selection
        if (previewRef.current) {
          range.selectNodeContents(previewRef.current);
        } else {
          range.selectNodeContents(tempDiv);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Execute copy command
        document.execCommand('copy');
        selection.removeAllRanges();
        
        toast({
          title: "Copied to clipboard",
          description: "The formatted text has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error copying formatted text:", error);
      // Fallback to copying markdown if HTML copy fails
      navigator.clipboard.writeText(markdown);
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard (as plain text).",
      });
    }
  }, [markdown, toast]);

  const handleDownload = useCallback(() => {
    if (!markdown) return;
    
    try {
      // Convert markdown to HTML
      const html = marked(markdown);
      
      // Create a blob with the HTML content
      const blob = new Blob([`<html><body>${html}</body></html>`], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converted-document.doc";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Document downloaded",
        description: "Your Word document has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the document. Please try again.",
        variant: "destructive",
      });
    }
  }, [markdown, toast]);

  // Parse markdown to HTML
  const parsedHTML = useCallback(() => {
    try {
      return { __html: marked(markdown) };
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return { __html: markdown };
    }
  }, [markdown]);

  return (
    <div className="grid h-[calc(100vh-5rem)] grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-700">Markdown Input</h2>
        </div>
        <textarea
          className="flex-1 resize-none rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          placeholder="Enter your markdown text here..."
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>

      <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-700">Preview</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleCopy}
              disabled={!markdown}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownload}
              disabled={!markdown}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        {markdown ? (
          <div 
            ref={previewRef}
            className="markdown-preview flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-strong:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-md prose-code:text-purple-600 prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-td:border prose-td:border-gray-300 prose-td:p-2"
            dangerouslySetInnerHTML={parsedHTML()}
          />
        ) : (
          <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4">
            <span className="text-gray-400">Preview will appear here...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownConverter;
