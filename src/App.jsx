import SearchField from "./SearchField";

const App = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <SearchField
          label="Async Search"
          placeholder="Type to begin searching"
          description="With description and custom results display"
          id="async-search"
          name="async-search"
          searchType="async"
        />
        <SearchField
          label="Sync Search"
          placeholder="Type to begin searching"
          description="With default display and search on focus"
          id="sync-search"
          name="sync-search"
          searchType="sync"
        />
    </div>
  );
};

export default App;
