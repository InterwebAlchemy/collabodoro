import Footer from "./Footer";
import Header from "./Header";

export default function Screen({ children }: React.PropsWithChildren) {
  return (
    <div className="relative w-full h-full flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
