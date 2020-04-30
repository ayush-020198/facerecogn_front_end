import React, {Component} from 'react';
import './App.css';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const particleOptions = {
"particles": {
"number": {
"value": 80,
"density": {
"enable": true,
"value_area": 800
}
},
"shape": {
"type": "circle",
"stroke": {
"width": 0,
"color": "#000000"
},
"polygon": {
"nb_sides": 5
}
},
"size": {
"value": 10,
"random": true,
"anim": {
"enable": false,
"speed": 80,
"size_min": 0.1,
"sync": false
}
},

},
"interactivity": {
"detect_on": "canvas",
"events": {
"onhover": {
"enable": true,
"mode": "repulse"
},
"resize": true
},
"modes": {
"grab": {
"distance": 400,
"line_linked": {
"opacity": 100
}
},
"bubble": {
"distance": 400,
"size": 1,
"duration": 2,
"opacity": 1,
"speed": 3
},
"repulse": {
"distance": 400,
"duration": 0.4
},
"push": {
"particles_nb": 4
},
"remove": {
"particles_nb": 2
}
}
},
}


class App extends Component
{
  constructor(){
  super();

  this.state = {
    input:'',
    imageURL:'',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }
}

loadUser= (data) => {
  this.setState({
     user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
}

onRouteChange = (route) => {
  if (route === 'signout'){
  this.setState({isSignedIn: false});

}
else if (route === 'home'){
    this.setState({isSignedIn: true});

}
  this.setState({route: route});

}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange = (event) => {
this.setState({input: event.target.value})
}

onButtonSubmit = () => {
  this.setState({imageURL: this.state.input})
  fetch('https://localhost:3000/imageUrl', {
         method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          input: this.state.input
          })
        })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://localhost:3000/image', {
         method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
          .catch(err => console.log(err));
      }

render(){
  const { isSignedIn, imageURL, route, box } = this.state;
  return (
    <div className="App">
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    { route === 'home'
      ? <div>
        <Logo />
        <Rank 
         name={this.state.user.name}
         entries={this.state.user.entries}
        />
        <ImageLinkForm
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit}
        />
        <Particles className="particles"
                    params={particleOptions} />
        <FaceRecognition box={box} imageURL={imageURL}/>
        </div>
 : (
      route === 'signin'
      ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
)
        }
        </div>
  );
}
}
export default App;
