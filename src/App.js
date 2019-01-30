import React, { Component } from 'react';
// import './App.css';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import  InputCustomizado  from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';


class App extends Component {

  constructor(){
    super(); //I have to invok the metho super before try to use the key work "this"

    /*
    State:
    O uso da variável state vai ser uma constante na sua vida programando com o React. Sempre teremos algum componente que 
    vai precisar manter um   estado e que precisará ter esse estado atualizado
     */
    this.state = {list : [], name:'', job:''};      
    this.enviaForm = this.enviaForm.bind(this); //passa o this para o contexto da funcacao enviarForm.
    this.setName = this.setName.bind(this);
    this.setJob = this.setJob.bind(this);
  }


   /*
   CICLO DE VIDA
   Entender o ciclo de vida do React é muito importante. São essas funções que te dão a chance de interagir com ele. 
   Na maior parte da sua vida, você vai utilizar o render e o componentDidMount. Justamente porque em um você declara 
   o componente em si e no outro você carrega o que pode ser necessário para ele. Entretanto, quando seu projeto evoluir 
   e ficar maior, talvez surja a necessidade você ter que lidar com outras funções do ciclo de vida, como a shouldComponentUpdate. 
   Ela indica para o React se seu componente deve ser renderizado e por default retorna true. Numa tela super complexa, 
   evitar invocações desnecessárias para o render, pode fazer diferença.


    */
  //the Ajax function will be called before the react calls the method render.
  componentWillMount(){    
     $.ajax({
      url:"https://reqres.in/api/users",
      dataType: 'json',
      success:function(resp){
          //this.state = {list:resp.data};
          //using the setstatus the react will know that it have to updated the state.
          this.setState({list:resp.data});          
       }.bind(this)//Bind: you pass to jquery the react context. Jquery does not have the function setState.
    });     
  } 

 //the Ajax function will be called after the react calls the method render.
  componentDidMount(){
     
  }
   
  //============================================================================================
  //SyntheticEvents ----------------------------------------------------------------------------
  //============================================================================================
  //Trata-se de um evento do React e não do DOM "real". Na documentação, eles são chamados de 
  //SyntheticEvents - eventos do React que mapeiam para eventos reais, incluindo o Submit
  //============================================================================================
  enviaForm(event){
    event.preventDefault();  //nao quero que o evento seja propago.

    $.ajax({
        url:"https://reqres.in/api/users",
        contentType: 'application/json', //como os dados serao enviados
        dataType:'json', //como os dados serao recebidos
        type:'post',
        data:JSON.stringify({name: this.state.name,job:this.state.job}),
      success:function(resp){  
        debugger;  
       // this.state.list.push({name: 'bozo',job: 'paico'});
          //this.setState({list:resp.data});   
          this.state.list.push({id: parseInt(resp.id),
                                first_name:resp.name,
                                last_name:resp.job,
                                avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"});  


            this.state.name="";
            this.state.job ="";
                                
            this.setState({list:this.state.list}); 
       }.bind(this),

       error: function(resp){
         debugger;
          console.log("erro: status" + resp.text);
       }
    }); 
    
  }
  setName(event){
    //event: /Lembrando que este se trata de um SyntheticEvent que será mapeado para o evento real    
    this.setState({name:event.target.value});   
  }

  setJob(event){   
    /**
     * ===============================================================================================================
     * -- setState
     * ===============================================================================================================
     * Notificamos o React que uma verificação de atualização é necessária através da invocação da função setState.
     *  Nela passamos a propriedade que já existe na variável state e também passamos o novo valor que deve ser associado a ela.
     */
    this.setState({job: event.target.value});
  } 

  render() {  //each time we change call the setState, it will call ther render. In this case
    //our render is called twice.  
    /*
     
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
              <div className="pure-form pure-form-aligned">
              { /* outra forma de user o bind, mas a mais recomendada e usar o do construtor.
                 <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">*/}
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                { /*onChange: Lembrando que este se trata de um SyntheticEvent que será mapeado para o evento real*/}                
                { /* <div className="pure-control-group">
                    <label htmlFor="name">Name</label> 
                    <input id="name" type="text" name="name" value={this.state.name}  onChange={this.setName}  />   
                  </div>
                  <div className="pure-control-group">
                    <label htmlFor="job">Job</label> 
                    <input id="job" type="text" name="job" value={this.state.job}  onChange={this.setJob}  />                  
                  </div>  
                   <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Submit</button>                                    
                  </div> */}

                  <InputCustomizado id="name" type="text" name="name" value={this.state.name} onChange={this.setName} label="Name"/>                                              
                  <InputCustomizado id="job" type="text" name="job" value={this.state.job} onChange={this.setJob} label="Job"/>  
                  <BotaoSubmitCustomizado label="Gravar"/>
                  
                </form>             

              </div>  
              <div>            
                <table className="pure-table">
                  <thead>
                    <tr>    
                      <th></th>                 
                      <th>First Name</th>
                      <th>Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      /*Quando temos elementos filhos que se repetem dentro de um pai, a sugestão é que adicionemos uma propriedade chama key no elemento.
                      
                        Observe que usamos um valor que sabemos que se repete, no caso o id do autor. Se o seu objeto não tem id, concatene informações,
                       use a função de hash e que gere um valor único.

                        No nosso exemplo, ficou fácil, porque ele precisa apenas identificar se o id modificou dentro dos <tbody>, ele simplesmente aplicará a 
                        alteração.

                        IMORTANT
                        Porém, no nosso caso, o código não mudará. O que será alterado é o estado. Sempre que o setState() for chamado, o 
                        React invocará a função render(). Costumamos dizer que não manipulamos os elementos com o React, nós declaramos como
                         queremos que um trecho de HTML se comporte. Então, o React será responsável pela manipulação em função das suas 
                         invocações do setState. Esta é uma informação super importante. Nós declaramos um comportamento, e o estado do 
                         componente indicará o que o React deverá fazer. Ele invocará o render() novamente, será aplicado um novo estado 
                         no seu componente, talvez seja gerado um novo Virtual DOM. Logo, ele irá aplicar as aplicações na págin

                        
                         INTERESSANTE
                         Perceba que não ficamos manipulando os elementos retornados pela função render no caso de crias as linhas da tabela abaixo.

                         * Sempre que o setState é invocado, o React invoca novamente a função render do componente em questão e o estado, se necessário, 
                           é atualizado

                           Isso realmente facilita muito a manutenção do código, você se preocupa em declarar como é a view de seu componente, em vez de 
                           ficar manipulando ela diretamente para cada alteração.

                      */
                      this.state.list.map(function(autor){
                        return(
                          
                          <tr key={autor.id}>  
                            <td><img src={autor.avatar}/></td>                          
                            <td>{autor.first_name}</td>
                            <td>{autor.last_name}</td>                           
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
              </div>             
            </div>
          </div>  
      </div>     
    );
  }
}

export default App;
