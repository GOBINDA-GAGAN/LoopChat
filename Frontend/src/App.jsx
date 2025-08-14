import Chart from "./components/chart";

const App = () => {
  return (
    <div className="bg-gray-100 flex h-screen w-full">
      <div className="w-[30%]"></div>
      <div className="w-[70%]">
        <Chart />
      </div>
    </div>
  );
};

export default App;
