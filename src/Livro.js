import $ from "jquery";
import InputCustomizado from "./componentes/InputCustomizado"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {
  constructor(props) {
    super(props);
    this.state = {titulo: '', preco: '', autorId: ''};
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);   
    this.handleLivroSubmit = this.handleLivroSubmit.bind(this);
  }

  setTitulo(e) {
    this.setState({titulo: e.target.value});
  }

  setPreco(e) {
    this.setState({preco: e.target.value});
  }

  setAutorId(e) {
    this.setState({autorId: e.target.value});
  }


  handleLivroSubmit(e) {
    e.preventDefault();
    var titulo = this.state.titulo.trim();
    var preco = this.state.preco.trim();
    var autorId = this.state.autorId;

    $.ajax({
      url: 'http://localhost:8080/api/livros',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({titulo:titulo,preco:preco,autorId:autorId}),
      success: function(novaListagem) {
          PubSub.publish( 'atualiza-lista-livros',novaListagem);            
          this.setState({titulo:'',preco:'',autorId:''});
      },
      error: function(resposta){
        if(resposta.status === 400){
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }            
    });  

    this.setState({titulo: '', preco: '', autorId: ''});
  }

  render() {                  
    var autores = this.props.autores.map(function(autor){     
      return <option key={autor.id} value={autor.id}>{autor.first_name}</option>;
    });

    return (
      <div className="autorForm">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}>
          <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo do livro" onChange={this.setTitulo} />
          <InputCustomizado id="preco" name="preco" label="Preco: " type="text" value={this.state.preco} placeholder="Preço do livro" onChange={this.setPreco} /> 
           {/* <InputCustomizado id="preco" name="preco" label="Preco: " type="decimal" value={this.state.preco} placeholder="Preço do livro" onChange={this.setPreco} />  */}
         
          <div className="pure-controls">
            <label htmlFor={this.props.autores}>Autores: </label>
            <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
              <option value="">Selecione</option>
              {autores}
            </select>
          </div>
          <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
          </div>          
        </form>             
      </div>
    );
  }
} 

class TabelaLivros extends Component {

  render() {
    var livros = this.props.lista.map(function(livro){
      return(
          <tr key={livro.titulo}>
            <td>{livro.titulo}</td>
            <td>{livro.autor.nome}</td>
            <td>{livro.preco}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Preco</th>
          </tr>
        </thead>
        <tbody>
          {livros}
        </tbody>
      </table>
    );
  }
}

export default class LivroAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {lista : [],autores:[]};
  }

  componentDidMount() {
    $.ajax({
      url: "http://localhost:8080/api/livros",
      dataType: 'json',
      success: function(data) {
        this.setState({lista: data});
      }.bind(this)
    });

    $.ajax({
      url: "https://reqres.in/api/users",
      dataType: 'json',
      success: function(data) {       
        this.setState({autores: data.data});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-livros', function(topicName,lista){
      this.setState({lista:lista});
    }.bind(this));    
  }


  render() {
    return(
      <div>
        <div className="header">
          <h1>Cadastro de Livros</h1>
        </div>
        <div className="content" id="content">
          <FormularioLivro autores={this.state.autores}/>
          <TabelaLivros lista={this.state.lista}/>
        </div>
      </div>
    );
  }
}

/*
Repare que usamos a maioria dos tópicos que estudamos. Usamos o state para manter o estado das informações do formulário na classe 
FormularioLivro e da lista, no LivroBox. Além disso, foi necessário trabalhar com a lista de autores, para popular o select do formulário. 
Para fazer isso, fizemos um AJAX, guardamos o estado e passamos ele como argumento para o componente do formulário de livros. Lembre que depois que volta a resposta, alteramos o state e, automaticamente, a função render é chamada novamente, forçando a atualização do formulário com os dados dos autores.

De resto foi bem padrão, usamos o esquema da mensageria para realizar a comunicação entre os componentes, props e state para argumentos e 
estado do componente.
*/