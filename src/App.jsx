import SearchField from "./SearchField";

const App = () => {
  return (
    <div className="p-6">
      <SearchField
        label="Async Search"
        placeholder="Type to begin searching"
        description="With description and custom results display"
        id="async-search"
        name="async-search"
      />
      <SearchField
        label="Sync Search"
        placeholder="Type to begin searching"
        description="With default display and search on focus"
        id="sync-search"
        name="sync-search"
      />
    </div>
  );
};

export default App;
