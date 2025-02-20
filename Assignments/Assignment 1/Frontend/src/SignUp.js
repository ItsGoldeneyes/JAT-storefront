import React, { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    cityCode: '',
    loginID: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      cityCode: '',
      loginID: '',
      password: ''
    });
  };

  const handleSubmit = () => {
    // You can add validation and submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <form>
        <div>
          <label>Name: </label>
          <input type="text" id="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>Tel no: </label>
          <input type="text" id="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div>
          <label>Email: </label>
          <input type="text" id="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div>
          <label>Address: </label>
          <input type="text" id="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div>
          <label>City code: </label>
          <input type="text" id="cityCode" value={formData.cityCode} onChange={handleInputChange} />
        </div>
        <div>
          <label>Login ID: </label>
          <input type="text" id="loginID" value={formData.loginID} onChange={handleInputChange} />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" id="password" value={formData.password} onChange={handleInputChange} />
        </div>
        <div>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;