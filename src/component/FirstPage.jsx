import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showfarmer } from "../assets/features/Apihandler";

const FirstPage = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showfarmer());
  }, [dispatch]);

  return (
    <>
      <h1 className="text-center text-4xl font-serif font-bold mb-6">
        DDR Create
      </h1>
    </>
  );
};

export default FirstPage;
