import Chart from "./components/Chart";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar - Left */}
      <div className="w-[20%]">
        <Sidebar />
      </div>

      {/* Right side - Header + Chart */}
      <div className="flex flex-col flex-1 bg-[#F1F0EA]">
        <div>
          <Header />
        </div>

        <div className="flex-1 flex items-end justify-center p-4">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default App;
