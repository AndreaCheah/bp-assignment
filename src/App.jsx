import SearchField from "./components/SearchField";
import CustomResultItem from "./components/CustomResultItem";

const App = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 space-y-4 p-4 border border-gray-300 rounded shadow-md">
        <SearchField
          label="Async Search"
          placeholder="Type to begin searching"
          description="With description and custom results display"
          id="async-search"
          name="async-search"
          searchType="async"
          renderResultItem={(result, index) => (
            <CustomResultItem key={index} result={result} />
          )}
        />
        <SearchField
          label="Sync Search"
          placeholder="Type to begin searching"
          description="With default display and search on focus"
          id="sync-search"
          name="sync-search"
          searchType="sync"
          renderResultItem={(result, index) => (
            <CustomResultItem key={index} result={result} />
          )}
        />
      </div>
    </div>
  );
};

export default App;
