import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';

class Login extends Component{
    render(){
        return (
             <div>
                <div class="header">
                    <h1>Login</h1>
                </div>
                <div className="content" id="content">
                    <div className="pure-form pure-form-aligned">
                        <form className="pure-form pure-form-aligned">                            
                            <div className="pure-control-group">
                                <label htmlFor="login">Login</label> 
                                <input id="login" type="text" name="login" value=""  />                  
                            </div>
                            <div className="pure-control-group">
                                <label htmlFor="senha">Senha</label> 
                                <input id="senha" type="password" name="senha"  />                                      
                            </div>
                            <div className="pure-control-group">                                  
                                <label></label> 
                                <button type="submit" className="pure-button pure-button-primary">Login</button>                                    
                            </div>
                        </form> 
                    </div>
                </div>
             </div>
        );
    }
}

export default Login