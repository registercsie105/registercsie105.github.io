import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var a = "567";

class Clock extends React.Component {
	constructor(props) 
	{
		super(props);
		this.state = {date: new Date()};
	}

 componentDidMount() 
 {
 	var t = this.tick;
    this.timerID = setInterval(
      t,
      1000
    );
 }


  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
  	console.log(this);
    // this.setState({
    //   date: new Date()
    // });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
