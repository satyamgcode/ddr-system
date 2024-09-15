import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";

const ShowInput = () => {
  const [input, setInput] = useState({
    clusterIncharge: "",
    variety: "",
    cropType: "",
    source: "",
    deliveryDate: "",
  });

  const [dropdownData, setDropdownData] = useState({
    inchargeOptions: [],
    varietyOptions: [],
    cropTypeOptions: [],
    sourceOptions: [],
  });

  const [farmerData, setFarmerData] = useState({
    farmerCode: "",
    eligibleQty: "",
    ddrQty: 50,
    deliveryLocation: "",
    state: "",
  });

  const fetchDropdownData = async () => {
    try {
      const inchargeResponse = await axios.get("https://ddr-1.onrender.com/api/cluster-incharges/");
      const varietyResponse = await axios.get("https://ddr-1.onrender.com/api/varieties/");
      const cropTypeResponse = await axios.get("https://ddr-1.onrender.com/api/crop-types/");
      const sourceResponse = await axios.get("https://ddr-1.onrender.com/api/sources/");

      setDropdownData({
        inchargeOptions: inchargeResponse.data,
        varietyOptions: varietyResponse.data,
        cropTypeOptions: cropTypeResponse.data,
        sourceOptions: sourceResponse.data,
      });
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 

  const dropdownRef = useRef(null); 

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://ddr-1.onrender.com/api/eligible-farmers/", {
        params: { query }
      });
      setSuggestions(response.data);
      setShowDropdown(true); 
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleFarmerCodeChange = (e) => {
    const value = e.target.value;
    setFarmerData((prevState) => ({ ...prevState, farmerCode: value }));
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setFarmerData((prevState) => ({
      ...prevState,
      farmerCode: suggestion.code,
      eligibleQty: suggestion.eligible_qty,
    }));
    setSuggestions([]); 
    setShowDropdown(false);
  };
  
  const handleAddButton = () => {
    alert(`Added Farmer Code: ${farmerData.farmerCode}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cluster_incharge: input.clusterIncharge,
      variety: input.variety,
      crop_type: input.cropType,
      source: input.source,
      delivery_date: input.deliveryDate,
      farmers: [
        {
          farmer: farmerData.farmerCode, 
          ddr_qty: farmerData.ddrQty.toString(), 
        },
      ],
      delivery_location: farmerData.deliveryLocation,
      state: farmerData.state,
    };
  
    try {
      const response = await axios.post("https://ddr-1.onrender.com/api/create-ddr/", payload);
      console.log("API Response:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  return (
    <>
      <div className="space-y-4">
        {/* Cluster Incharge */}
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="clusterIncharge" className="text-xl font-serif sm:w-1/3">
            Cluster Incharge
          </label>
          <select
            id="clusterIncharge"
            name="clusterIncharge"
            value={input.clusterIncharge}
            onChange={handleInput}
            className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
          >
            <option value="">Select an Incharge</option>
            {dropdownData.inchargeOptions?.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variety */}
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="variety" className="text-xl font-serif sm:w-1/3">
            Variety
          </label>
          <select
            id="variety"
            name="variety"
            value={input.variety}
            onChange={handleInput}
            className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
          >
            <option value="">Select a Variety</option>
            {dropdownData.varietyOptions?.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Type */}
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="cropType" className="text-xl font-serif sm:w-1/3">
            Crop Type
          </label>
          <select
            id="cropType"
            name="cropType"
            value={input.cropType}
            onChange={handleInput}
            className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
          >
            <option value="">Select a Crop Type</option>
            {dropdownData.cropTypeOptions?.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="source" className="text-xl font-serif sm:w-1/3">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={input.source}
            onChange={handleInput}
            className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
          >
            <option value="">Select a Source</option>
            {dropdownData.sourceOptions?.map((option, index) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Date */}
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="deliveryDate" className="text-xl font-serif sm:w-1/3">
            Expected Delivery Date
          </label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={input.deliveryDate}
            onChange={handleInput}
            className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
          />
        </div>

        {/* Farmer Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8">
          <div className="flex items-center">
            <p className="text-xl font-serif sm:w-1/3 mr-5">Farmer Code</p>
            <div className="relative">
              <input
                type="text"
                name="farmerCode"
                placeholder="Farmer code"
                value={farmerData.farmerCode}
                onChange={handleFarmerCodeChange}
                className="outline-none rounded-lg border border-gray-400 px-4 py-2 w-full sm:w-auto"
              />
              {loading && <p className="absolute top-full left-0 mt-1 bg-white text-black px-2">Loading...</p>}
              {showDropdown && suggestions.length > 0 && (
                <ul
                  ref={dropdownRef}
                  className="absolute bg-white border border-gray-400 w-full mt-1 rounded-lg max-h-60 overflow-y-auto z-10"
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.code}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.code}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="ml-2">
            <button
              className="px-4 py-2 bg-black text-white rounded-lg shadow-md"
              onClick={handleAddButton}
            >
              Add
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="mt-4 space-y-2">
          <p className="text-xl font-serif mt-2">Farmer Code : {farmerData.farmerCode}</p>
          <p className="text-xl font-serif mt-2">Eligible Qty: {farmerData.eligibleQty}</p>
          <p className="text-xl font-serif mt-2">DDR Qty : {farmerData.ddrQty}</p>
        </div>

        {/* Total */}
        <div className="mt-4 text-end">
          <p className="text-xl font-serif mt-2">Total: {/* Add logic later */}</p>
        </div>

        {/* Location & State */}
        <div className="mt-6 space-y-2">
          {/* Delivery Location */}
          <div className="flex flex-col sm:flex-row items-center">
            <label htmlFor="deliveryLocation" className="text-xl font-serif sm:w-1/3">
              Delivery Location :
            </label>
            <input
              type="text"
              id="deliveryLocation"
              name="deliveryLocation"
              value={farmerData.deliveryLocation}
              onChange={(e) => setFarmerData({ ...farmerData, deliveryLocation: e.target.value })}
              className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
            />
          </div>

          {/* State */}
          <div className="flex flex-col sm:flex-row items-center">
            <label htmlFor="state :" className="text-xl font-serif sm:w-1/3">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={farmerData.state}
              onChange={(e) => setFarmerData({ ...farmerData, state: e.target.value })}
              className="w-full sm:w-2/3 outline-none rounded-lg border border-gray-400 px-4 py-2"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-black text-white rounded-lg hover:bg-gray-700 px-6 py-2 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ShowInput;
