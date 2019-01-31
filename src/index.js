import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import  Login from './login';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';


import * as serviceWorker from './serviceWorker';
import AutorBox from './Autor';
import Home from './Home';

//ReactDOM.render(<Login/>, document.getElementById('login'));

/*
Quando o endereço for padrão, ele terá uma outra propriedade chamada component, e queremos que seja renderizado o 
HTML que está linkado com o objeto exportado App. Se ele for uma classe do React, haverá uma classe dentro. Incluímos 
já o path para quando clicarmos em "autor" ou em "livro". Os caminhos ficarão vazios, porque não programamos ainda o "Livro".

Em geral, é de boa prática adicionar parênteses () em casos que quebramos a linha. Desta forma, ficará visualmente mais simples 
compreender que se trata de uma única expressão.
*/
ReactDOM.render(
    (<Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/autor" component={AutorBox}/>
            <Route path="/livro"/>
        </Route>
    </Router>),
    document.getElementById('root')
  );
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
                     