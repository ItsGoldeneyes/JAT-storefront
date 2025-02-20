import React from 'react';
import './About.css';
// about the team lol
function About() {
  return (
    <div className="about">
      <h1>About Us</h1> 
      <div className="the-team">

      
        <div className="person">
          <img src="assets/jessica.jpg" alt="Jessica Zhu" />
          <p>Jessica Zhu</p>
          <p>E-mail: jessica.zhu@torontomu.ca</p>
        </div>

        <div>
          <img src="" alt="Adam " />
          <p>Adam </p>
          <p>E-mail: </p>
        </div>

        <div>
          <img src="assets/thao_nguyen.jpeg" alt="Thao Nguyen" />
          <p>Thao Nguyen</p>
          <p>E-mail: thao2.nguyen@torontomu.ca</p>
        </div>
      </div>
    </div>
  );
}

export default About;
