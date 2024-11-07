const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  // const handleCheckBox = (data) => {
  //   setGender(data);
  //   console.log("Rohit", data);
  // };

  return (
    <div className="flex">
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "male" ? "selected" : ""
          }`}
        >
          <span className="label-text">Male</span>
          <input
            type="checkbox"
            className="checkbox border-slate-900"
            checked={selectedGender === "male"}
            // onChange={(e) => handleCheckBox(e)}
            // onChange={() => {
            //   handleCheckBox("male");
            // }}
            onChange={() => onCheckboxChange("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`label gap-2 cursor-pointer  ${
            selectedGender === "female" ? "selected" : ""
          }`}
        >
          <span className="label-text">Female</span>
          <input
            type="checkbox"
            className="checkbox border-slate-900"
            checked={selectedGender === "female"}
            onChange={() => onCheckboxChange("female")}
            // onChange={() => {
            //   handleCheckBox("female");
            // }}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
