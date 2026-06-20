import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({
  children,
}) => {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col flex-grow min-h-screen">
        <Navbar />

        <div className="flex-grow p-4 md:p-8 pt-20 lg:pt-8 flex flex-col justify-between">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;