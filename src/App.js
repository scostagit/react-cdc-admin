import React, { Component } from 'react';
import './css/pure-min.css';
import'./css/side-menu.css';
import AutorBox from './Autor';

export default class App extends Component {  
  render() {  
    /*  each time we change call the setState, it will call ther render. In this case
        our render is called twice.  
     
      O componente chamará o render() sempre que você chamar o setState(). Isto significa que nós nunca mais 
      precisaremos concatenar as tags <tr> da tabela ou mexer manualmente na estrutura dos elementos.
      Nós só temos que nos preocupar com o estado e o React se ocupa de fazer a mágica.
     */
    return (
      <div id="layout">  
        { /*Menu toggle*/}   
          <a href="#menu" id="menuLink" className="menu-link">           
              <span></span>
          </a>
      
          <div id="menu">
            <div className="pure-menu">
              <a className="pure-menu-heading" href="#">React</a>    
              <ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
              </ul>
            </div>
          </div>
      
          <div id="main">
            <div className="header">
              <h1>List of Authors</h1>
            </div>
    
            <div className="content" id="content">              
                <AutorBox/>            
            </div>
          </div>  
      </div>     
    );
  }
}


