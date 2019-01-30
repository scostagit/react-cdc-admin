import React, { Component } from 'react';
export default class InputCustomizado extends Component{
      render() {      
        return(
          <div className="pure-control-group">
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <input id={this.props.id} type={this.props.type} name={this.props.nome} value={this.props.value} onChange={this.props.onChange}/>
          </div>
      );
    }
}


/*

Durante a construção do formulário, percebemos que repetíamos várias linhas de código com o Input. Por isso, isolamos certos trechos
 em um componente e depois, o reaproveitamos. Assinale a alternativa que indica a forma utilizada para deixá-los customizáveis.

 ** Os parâmetros passados são automaticamente associados a propriedades na variável props.** 

Reutilizar componente é uma das grandes motivações do React. Aqui criamos um que foi reaproveitado dentro do nosso próprio projeto, 
mas nada nos impede de criar componentes que podem ser reutilizados entre os vários projetos de uma empresa, ou de várias! Para que 
possamos ter acesso aos parâmetros passados pelo código que utiliza o componente, usamos a variável props, que já é disponibilizada 
em toda classe que herda Component.
 */