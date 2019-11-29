import React from 'react';
import '../css/updatesblock.css';

class Feed extends React.Component {
  render() {
    return (
      <div id="updatesBlock">
        <h2 className="header">Notice board</h2>
        <div className="note" data-importance="4">
          <div className="container">
            <div className="date-time">november 12, 9:30am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" data-importance="3">
          <div className="container">
            <div className="date-time">november 10, 11:59am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" data-importance="2">
          <div className="container">
            <div className="date-time">november 8, 2:00pm</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
        <div className="note" dataimportance="1">
          <div className="container">
            <div className="date-time">november 6, 10:30am</div>
            <div className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit reprehenderit quod blanditiis ratione recusandae at, magnam nobis eius harum nisi iusto libero, ea eveniet dolore? Omnis maxime nisi sapiente?
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Feed;
