import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
//Agora, ele colocará o objeto exportado no PubSub
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';
import {Router,Route,browserHistory} from 'react-router';

 class FormularioAutor  extends Component{
    constructor(){
        super();
        this.state = {name:'', job:''};
        this.enviaForm = this.enviaForm.bind(this); //passa o this para o contexto da funcacao enviarForm.
        // this.setName = this.setName.bind(this);
        // this.setJob = this.setJob.bind(this);
    }    
    
    salvaAlteracao(nomeInput,evento){
        var campoSendoAlterado = [];
        campoSendoAlterado[nomeInput] = evento.target.value;
        this.setState(campoSendoAlterado);
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
            url:"https://reqres.in/api/users",//"/api/users/23",
            contentType: 'application/json', //como os dados serao enviados
            dataType:'json', //como os dados serao recebidos
            type:'post',
            data:JSON.stringify({name: this.state.name,job:this.state.job}),
            success:function(resp){            
            // this.state.list.push({name: 'bozo',job: 'paico'});
                //this.setState({list:resp.data});   
                             
                /*
                ---------------------------------
                Higher-order
                ---------------------------------
                Enviar os dados atualizados para a listagem de tabela.
                Nós conseguimos resolver a parte de comunicação entre os componentes de uma maneira padrão no mercado que o React usa, 
                ao criarmos o Higher-order component (também conhecido como wrapper, ou o "envelopador" traduzido para o português)
                */
              
                this.state.name="";
                this.state.job ="";  
                //this.props.callbackAtualizaListagem(resp);    
            
               /*
                Publisher
                Mas vamos imaginar a seguinte situação, imagine que temos vários componentes na nossa aplicação que estão interessados em ouvir 
                diversas mensagens, sobre diferentes assuntos. Pode ser sobre a nova listagem ou que um item foi removido. Além de publicarmos o 
                objeto novo que está disponível para as pessoas manipularem, precisamos indicar qual é o canal, que costumamos chamar de tópico. 
                Trata-se de um lugar que iremos disponibilizar a informação. O nosso, chamaremos de atualiza-lista-autores.

                Ao cadastrarmos um novo autor, publicaremos no tópico que será ouvido por componentes interessados. Se alguém ficará interessado 
                em ouvir, é um outro assunto... Logo após montarmos o componente do AutorBox, vamos adicionar o PubSub e vamos nos inscrever ao 
                tópico atualiza-lista-autores. Quando chegar um objeto novo, precisaremos associar a uma função que será executada. Receberemos 
                como argumento o canal que estamos escutando. Necessariamente, o primeiro argumento será o topico e o segundo, será o objeto que 
                foi passado.

                Nós trabalhamos ainda mais na parte de desacoplar os componentes e agora, o FormularioAutor simplesmente pública que tem um 
                formulário cadastrado e quem estiver interessado em receber o aviso, irá ser inscrever neste canal. No nosso caso, o AutorBox 
                se inscreveu para ser notificado quando novos autores forem cadastrados.
                */   
                PubSub.publish('atualiza-lista-autores', resp); //topico, object a ser publicado.
            }.bind(this),

            error: function(resp){                 
                if(resp.status === 404){
                    new TratadorErros().publicaErros(resp);
                  }   
            },

            beforeSend:function(){
                /*
                  Não adicionaremos um if, porque não nos interessa de qual componente específico estamos limpando a mensagem de erro.
                  Nós enviamos o limpa-erros e quem estiver registrado com ele, ficará limpo das mensagens.
                  
                  --IMPORTANTE
                  Nós podemos brincar de alterar o estado dos componentes com o React. Não é mais necessário concatenar informações, 
                  buscar o span e depois, definir a mensagem que aparecerá com os campos vazios. Quem terá o trabalho será o React. 
                 
                 ********** Nós só trabalharemos em cima do estado.*********
                */                
                PubSub.publish("limpa-erros",{});
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
    render(){
        return (
            <div className="pure-form pure-form-aligned">
                { /* outra forma de user o bind, mas a mais recomendada e usar o do construtor.
                 <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">*/}
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    { /*onChange: Lembrando que este se trata de um SyntheticEvent que será mapeado para o evento real*/} 
                    <InputCustomizado id="name" type="text" name="name" value={this.state.name} onChange={this.salvaAlteracao.bind(this,'name')} label="Name"/>                     
                    <InputCustomizado id="job" type="text" name="job" value={this.state.job} onChange={this.salvaAlteracao.bind(this,'job')} label="Job"/>  
                    <BotaoSubmitCustomizado label="Gravar"/>
                  
                  </form> 
              </div> 
        );
    }
}


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



class TabelaAutores extends Component {

	render() {       
		return(
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
                             
                            this.props.list.map(function(autor){
                              return (
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
		);
	}
}  



/*
O nome Box é comumente usado em casos como este, em que um componente será responsável por unir outros mais.
 */
export default class AutorBox extends Component{
    constructor() {
        super();//I have to invok the metho super before try to use the key work "this" 
         /*
            State:
             O uso da variável state vai ser uma constante na sua vida programando com o React. Sempre teremos algum componente que 
             vai precisar manter um   estado e que precisará ter esse estado atualizado
        */   
        this.state = {list : []};
        //Informamos que o atualizaListagem usará o this do React
//        this.atualizaListagem = this.atualizaListagem.bind(this);
      }    

     /*
    CICLO DE VIDA
    Entender o ciclo de vida do React é muito importante. São essas funções que te dão a chance de interagir com ele. 
    Na maior parte da sua vida, você vai utilizar o render e o componentDidMount. Justamente porque em um você declara 
    o componente em si e no outro você carrega o que pode ser necessário para ele. Entretanto, quando seu projeto evoluir 
    e ficar maior, talvez surja a necessidade você ter que lidar com outras funções do ciclo de vida, como a shouldComponentUpdate. 
    Ela indica para o React se seu componente deve ser renderizado e por default retorna true. Numa tela super complexa, 
    evitar invocações desnecessárias para o render, pode fazer diferença.*/

    //the Ajax function will be called before the react calls the method render.
    componentWillMount(){    
       
    } 

    //the Ajax function will be called after the react calls the method render.
    componentDidMount(){         
        $.ajax({
            url:"https://reqres.in/api/users",
            dataType: 'json',
            success:function(resp){
                //this.state = {list:resp.data};
                //using the setstatus the react will know that it have to updated the state.
                this.setState({list:resp.data});          
            }.bind(this)//Bind: you pass to jquery the react context. Jquery does not have the function setState.
        });  
        
        
        PubSub.subscribe('atualiza-lista-autores', function(topico,resp){           
             this.state.list.push({id: parseInt(resp.id),
                first_name:resp.name,
                 last_name:resp.job,
                 avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"}); 
                
                 this.setState({list:this.state.list});
         }.bind(this));
    } 

   
    /*atualizaListagem(resp) {
        this.state.list.push({id: parseInt(resp.id),
            first_name:resp.name,
            last_name:resp.job,
            avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"});             
            this.setState({list:this.state.list});
             
    } */
    render(){
        return (
          <div>
            <div className="header">
              <h1>Cadastro de autores</h1>
            </div>
            <div className="content" id="content">                            
              <FormularioAutor/>
              <TabelaAutores list={this.state.list}/>        
            </div>      
    
          </div>
        );
      }
  }


  /*
  ====================================
  --  Higher-order Components
  ====================================
        Para continuar com o tema de boa práticas do React, vimos os casos que chamamos de Higher-order Components. 
        São os componentes responsáveis por encapsular um estado que será trabalhado por vários outros componentes e que
        comumente nomeamos utilizando o sufixo Box. Depois, de criá-lo, podemos passá-lo como argumento. Pode passar como
        argumento a função que atualizará o estado.
  */