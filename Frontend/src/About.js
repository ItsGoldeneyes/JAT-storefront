import React from 'react';
import './About.css';
function About() {
  return (
    <div className="about">
      <h1>About Us</h1> 
      <div className="the-team">

      
        <div className="person">
          <img src="assets/jessica.jpg" alt="Jessica Zhu" />
          <p className="name">Jessica Zhu</p>
          <p>jessica.zhu@torontomu.ca</p>
        </div>

        <div className="person">
          <img src="assets/adam.jpg" alt="Adam Cameron" />
          <p className="name">Adam Cameron</p>
          <p>adam.cameron@torontomu.ca</p>
        </div>

        <div className="person">
          <img src="assets/thao_nguyen.jpeg" alt="Thao Nguyen" />
          <p className="name">Thao Nguyen</p>
          <p>thao2.nguyen@torontomu.ca</p>
        </div>
      </div>
    </div>
  );
}

export default About;
