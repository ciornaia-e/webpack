// import React from 'react'
// import { render } from 'react-dom'
// import Post from '@models/Post'
// import './example-babel'
// import '@assets/styles/main'
// import userLogo from '@assets/images/user.png'
// import bgImage from '@assets/images/bg.jpg'

// const post = new Post('Webpack post logo', userLogo)

// const App = () => (
//     <div className="wrapper">
//         <div className="container">
//             <h1>Webpack</h1>

//             <br />

//             <div className="logo"></div>

//             <div className="bg-wrapper">
//                 <img src={bgImage} alt="bg" />
//             </div>
//         </div> 
//     </div>
// )

// render(<App />, document.getElementById('app'))
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(
    <React.Fragment>
        <App />
    </React.Fragment>,
    document.getElementById('app')
)