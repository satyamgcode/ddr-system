import React from "react";

const FarmerTable = () => {
  return (
    <>
      <div className="mt-4 space-y-2">
        <p className="text-xl font-serif mt-2">Data Grid :</p>
        <p className="text-xl font-serif mt-2">Farmer Code :</p>
        <p className="text-xl font-serif mt-2">Eligible Qty:</p>
        <p className="text-xl font-serif mt-2">DDR Qty : </p>
      </div>
      <div className="mt-4 text-end">
        <p className="text-xl font-serif mt-2">Label: Total Qty</p>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xl font-serif">Delivery Location</p>
        <p className="text-xl font-serif">Label: State</p>
      </div>

      <div className="text-center">
        <button className="bg-black text-white rounded-lg hover:bg-gray-700 px-6 py-2 transition-colors">
          Submit
        </button>
      </div>
    </>
  );
};

export default FarmerTable;
