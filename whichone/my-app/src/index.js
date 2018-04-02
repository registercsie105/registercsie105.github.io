import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function formatDate(date)
{
  return date.toLocaleDateString();
}

function Mywife(props)
{
	return (
    <img
		className="Mywife"
		src={props.user.caturl}
		alt={props.user.name}
    />
	);
}

function UserInfo(props) 
{
  return (
    <div className="UserInfo">
      <Mywife user={props.userrr} />
      <div className="UserInfo-name">{props.userrr.name}</div>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo userrr={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}


const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello World',
    caturl: 'https://www.pets4homes.co.uk/images/articles/771/large/cat-lifespan-the-life-expectancy-of-cats-568e40723c336.jpg	',
  },
};

ReactDOM.render(
  <Comment
    date={comment.date}
    text={comment.text}
    author={comment.author}
  />,
  document.getElementById('root')
);
