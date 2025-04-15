
import { FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-semibold text-gray-800">Markdown to Word Converter</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
