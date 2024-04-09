const CustomResultComponent = ({ result }) => {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer">
        <div>
          {result.country_code} - {result.currency_name} ({result.currency_code})
        </div>
      </div>
    );
  };
  
  export default CustomResultComponent;
  