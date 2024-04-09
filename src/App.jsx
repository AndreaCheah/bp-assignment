import SearchField from "./SearchField";

const App = () => {
  const onSearch = (searchTerm) => {
    // TODO: handle the search logic or make an API request.
    console.log('Search Term:', searchTerm);
  };
  return (
    <div className="p-6">
      <SearchField
        label="Async Search"
        placeholder="Type to begin searching"
        description="With description and custom results display"
        id="async-search"
        name="async-search"
        searchType="async"
        onSearch={onSearch}
      />
      <SearchField
        label="Sync Search"
        placeholder="Type to begin searching"
        description="With default display and search on focus"
        id="sync-search"
        name="sync-search"
        searchType="sync"
        onSearch={onSearch}
      />
    </div>
  );
};

export default App;
