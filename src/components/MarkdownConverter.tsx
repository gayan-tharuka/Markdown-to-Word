
import { useState, useCallback } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState("");
  const { toast } = useToast();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    toast({
      title: "Copied to clipboard",
      description: "The converted text has been copied to your clipboard.",
    });
  }, [markdown, toast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "application/msword" });
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
  }, [markdown, toast]);

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
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 whitespace-pre-wrap font-mono">
          {markdown || <span className="text-gray-400">Preview will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

export default MarkdownConverter;
