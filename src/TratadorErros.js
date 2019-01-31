
import PubSub from 'pubsub-js';

export default class TratadorErros{

    publicaErros(erros){       
        var errosList = [];

        //estes objectos deveriam vir do back-end, mas como nao tenho backe-end
        //estou criando-os aqui. Detalhe, o nome do object de erro e importate.
        errosList.push({
            field:"name",
            statusCode: erros.status,
            text: 'Name may not be empty' //erros.text
        });

        errosList.push({
            field:"job",
            statusCode: erros.status,
            text: 'Job may not be empty' //erros.text
        });

        //Publicamos o erro! Agora, alguém precisará ouvir.
        PubSub.publish("erro-validacao",errosList);           

        /*
        for(var i=0;i<erros.errors.length;i++){
          var erro = erros.errors[i];
          console.log(erro);
      }
         */
    }
}