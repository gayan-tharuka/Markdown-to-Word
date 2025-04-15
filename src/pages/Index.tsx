
import Header from "@/components/Header";
import MarkdownConverter from "@/components/MarkdownConverter";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <MarkdownConverter />
      </main>
    </div>
  );
};

export default Index;
