import React, { useState } from "react";

const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+7", label: "Russia (+7)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+30", label: "Greece (+30)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+32", label: "Belgium (+32)" },
  { code: "+33", label: "France (+33)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+48", label: "Poland (+48)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+51", label: "Peru (+51)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+53", label: "Cuba (+53)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+56", label: "Chile (+56)" },
  { code: "+57", label: "Colombia (+57)" },
  { code: "+58", label: "Venezuela (+58)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+62", label: "Indonesia (+62)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+66", label: "Thailand (+66)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+84", label: "Vietnam (+84)" },
  { code: "+86", label: "China (+86)" },
  { code: "+90", label: "Turkey (+90)" },
  { code: "+91", label: "India (+91)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+93", label: "Afghanistan (+93)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+95", label: "Myanmar (+95)" },
  { code: "+98", label: "Iran (+98)" },
  { code: "+211", label: "South Sudan (+211)" },
  { code: "+212", label: "Morocco (+212)" },
  { code: "+213", label: "Algeria (+213)" },
  { code: "+216", label: "Tunisia (+216)" },
  { code: "+218", label: "Libya (+218)" },
  { code: "+220", label: "Gambia (+220)" },
  { code: "+221", label: "Senegal (+221)" },
  { code: "+233", label: "Ghana (+233)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+236", label: "Central African Republic (+236)" },
  { code: "+237", label: "Cameroon (+237)" },
  { code: "+241", label: "Gabon (+241)" },
  { code: "+242", label: "Congo (+242)" },
  { code: "+243", label: "DR Congo (+243)" },
  { code: "+244", label: "Angola (+244)" },
  { code: "+248", label: "Seychelles (+248)" },
  { code: "+249", label: "Sudan (+249)" },
  { code: "+250", label: "Rwanda (+250)" },
  { code: "+251", label: "Ethiopia (+251)" },
  { code: "+252", label: "Somalia (+252)" },
  { code: "+253", label: "Djibouti (+253)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+255", label: "Tanzania (+255)" },
  { code: "+256", label: "Uganda (+256)" },
  { code: "+260", label: "Zambia (+260)" },
  { code: "+261", label: "Madagascar (+261)" },
  { code: "+262", label: "Réunion (+262)" },
  { code: "+263", label: "Zimbabwe (+263)" },
  { code: "+264", label: "Namibia (+264)" },
  { code: "+265", label: "Malawi (+265)" },
  { code: "+266", label: "Lesotho (+266)" },
  { code: "+267", label: "Botswana (+267)" },
  { code: "+268", label: "Eswatini (+268)" },
  { code: "+269", label: "Comoros (+269)" },
  { code: "+291", label: "Eritrea (+291)" },
  { code: "+297", label: "Aruba (+297)" },
  { code: "+298", label: "Faroe Islands (+298)" },
  { code: "+299", label: "Greenland (+299)" },
  { code: "+351", label: "Portugal (+351)" },
  { code: "+352", label: "Luxembourg (+352)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+354", label: "Iceland (+354)" },
  { code: "+355", label: "Albania (+355)" },
  { code: "+356", label: "Malta (+356)" },
  { code: "+357", label: "Cyprus (+357)" },
  { code: "+358", label: "Finland (+358)" },
  { code: "+359", label: "Bulgaria (+359)" },
  { code: "+370", label: "Lithuania (+370)" },
  { code: "+371", label: "Latvia (+371)" },
  { code: "+372", label: "Estonia (+372)" },
  { code: "+373", label: "Moldova (+373)" },
  { code: "+374", label: "Armenia (+374)" },
  { code: "+375", label: "Belarus (+375)" },
  { code: "+376", label: "Andorra (+376)" },
  { code: "+377", label: "Monaco (+377)" },
  { code: "+378", label: "San Marino (+378)" },
  { code: "+380", label: "Ukraine (+380)" },
  { code: "+381", label: "Serbia (+381)" },
  { code: "+382", label: "Montenegro (+382)" },
  { code: "+383", label: "Kosovo (+383)" },
  { code: "+385", label: "Croatia (+385)" },
  { code: "+386", label: "Slovenia (+386)" },
  { code: "+387", label: "Bosnia and Herzegovina (+387)" },
  { code: "+389", label: "North Macedonia (+389)" },
  { code: "+420", label: "Czech Republic (+420)" },
  { code: "+421", label: "Slovakia (+421)" },
  { code: "+423", label: "Liechtenstein (+423)" },
  { code: "+501", label: "Belize (+501)" },
  { code: "+502", label: "Guatemala (+502)" },
  { code: "+503", label: "El Salvador (+503)" },
  { code: "+504", label: "Honduras (+504)" },
  { code: "+505", label: "Nicaragua (+505)" },
  { code: "+506", label: "Costa Rica (+506)" },
  { code: "+507", label: "Panama (+507)" },
  { code: "+508", label: "Saint Pierre and Miquelon (+508)" },
  { code: "+509", label: "Haiti (+509)" },
  { code: "+590", label: "Guadeloupe (+590)" },
  { code: "+591", label: "Bolivia (+591)" },
  { code: "+592", label: "Guyana (+592)" },
  { code: "+593", label: "Ecuador (+593)" },
  { code: "+594", label: "French Guiana (+594)" },
  { code: "+595", label: "Paraguay (+595)" },
  { code: "+596", label: "Martinique (+596)" },
  { code: "+597", label: "Suriname (+597)" },
  { code: "+598", label: "Uruguay (+598)" },
  { code: "+599", label: "Curaçao (+599)" },
  { code: "+670", label: "East Timor (+670)" },
  { code: "+672", label: "Norfolk Island (+672)" },
  { code: "+673", label: "Brunei (+673)" },
  { code: "+674", label: "Nauru (+674)" },
  { code: "+675", label: "Papua New Guinea (+675)" },
  { code: "+676", label: "Tonga (+676)" },
  { code: "+677", label: "Solomon Islands (+677)" },
  { code: "+678", label: "Vanuatu (+678)" },
  { code: "+679", label: "Fiji (+679)" },
  { code: "+680", label: "Palau (+680)" },
  { code: "+681", label: "Wallis and Futuna (+681)" },
  { code: "+682", label: "Cook Islands (+682)" },
  { code: "+683", label: "Niue (+683)" },
  { code: "+685", label: "Samoa (+685)" },
  { code: "+686", label: "Kiribati (+686)" },
  { code: "+687", label: "New Caledonia (+687)" },
  { code: "+688", label: "Tuvalu (+688)" },
  { code: "+689", label: "French Polynesia (+689)" },
  { code: "+690", label: "Tokelau (+690)" },
  { code: "+691", label: "Micronesia (+691)" },
  { code: "+692", label: "Marshall Islands (+692)" },
  { code: "+850", label: "North Korea (+850)" },
  { code: "+852", label: "Hong Kong (+852)" },
  { code: "+853", label: "Macau (+853)" },
  { code: "+855", label: "Cambodia (+855)" },
  { code: "+856", label: "Laos (+856)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+886", label: "Taiwan (+886)" },
  { code: "+960", label: "Maldives (+960)" },
  { code: "+961", label: "Lebanon (+961)" },
  { code: "+962", label: "Jordan (+962)" },
  { code: "+963", label: "Syria (+963)" },
  { code: "+964", label: "Iraq (+964)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+967", label: "Yemen (+967)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+970", label: "Palestine (+970)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+972", label: "Israel (+972)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+975", label: "Bhutan (+975)" },
  { code: "+976", label: "Mongolia (+976)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+992", label: "Tajikistan (+992)" },
  { code: "+993", label: "Turkmenistan (+993)" },
  { code: "+994", label: "Azerbaijan (+994)" },
  { code: "+995", label: "Georgia (+995)" },
  { code: "+996", label: "Kyrgyzstan (+996)" },
  { code: "+998", label: "Uzbekistan (+998)" },
];

const ContactInformation = ({
  formData,
  setFormData,
  canUpdate,
  editMode,
  toggleEditMode,
  handleSubmit,
  setActiveStep,
}) => {
  const [countryCode, setCountryCode] = useState(
    formData.phoneNumber?.match(/^\+(\d+)/)?.[0] || "+91"
  );

  const handleChange = (e) => {
    if (!canUpdate) return;
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: `${countryCode}${numericValue}`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <div className="edit-section">
        <h2>Contact Information</h2>
        {canUpdate && (
          <button onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <p>Add contact details for your institute</p>
      <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            ) : (
              <div className="read-only">{formData.email || "Not set"}</div>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <div className="phone-input-wrapper flex">
                <select
                  value={countryCode}
                  onChange={(e) => {
                    const newCountryCode = e.target.value;
                    setCountryCode(newCountryCode);
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: prev.phoneNumber
                        ? newCountryCode + prev.phoneNumber.replace(countryCode, "")
                        : newCountryCode,
                    }));
                  }}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber.replace(countryCode, "")}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  required
                  className="flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="read-only">{formData.phoneNumber || "Not set"}</div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Website</label>
          {editMode && canUpdate ? (
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL"
            />
          ) : (
            <div className="read-only">{formData.website || "Not set"}</div>
          )}
        </div>
        {editMode && canUpdate && (
          <button type="submit" className="next-btn">
            Save and Next →
          </button>
        )}
        {!editMode && (
          <button
            type="button"
            className="next-btn"
            onClick={() => setActiveStep("System Configuration")}
          >
            Next →
          </button>
        )}
      </form>
    </>
  );
};

export default ContactInformation;