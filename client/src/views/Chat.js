import React from "react";
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, Contacts, ChatHeader, Messages, MessageForm } from "../components";
import socketIO from 'socket.io-client'
import Auth from "./Auth";

class Chat extends React.Component {

    state = {};

    componentDidMount(){
        this.initSokcetConnection();
    }

    initSokcetConnection = () => {
        let socket = socketIO(process.env.REACT_APP_SOCKET, {
            query: 'token=' + Auth.getToken()
        });
        socket.on('connect', () => this.setState({connected: true}));
        socket.on('disconnect', () => this.setState({connected: false}));
        socket.on('data', (user, contacts, messages, users) => {
            let contact = contacts[0] || {};
            this.setState({messages, contacts, user, contact}, () => {
                this.updateUsersState(users);
            });
        });
        socket.on('new_user', this.onNewUser);
        socket.on('message', this.onNewMessage);
        socket.on('user_status', this.updateUsersState);
        socket.on('typing', this.onTypingMessage);
        socket.on('error', err => {
            if(err === 'auth_error'){
                Auth.logout();
                this.props.history.push('/login')
            }
        });
        this.setState({socket});
    }

    onNewUser = user => {
        let contacts = this.state.contacts.concat(user);
        this.setState({contacts});
    }
    
    onNewMessage = message => {
        if(message.sender === this.state.contact._id){
            this.setState({typing: false});
        }
        if (message.sender === this.state.user._id) return;
        let messages = this.state.messages.concat(message);
        this.setState({ messages });
    }
    
    onTypingMessage = sender => {
        if(this.state.contact._id !== sender) return;
        this.setState({typing: sender});
        clearTimeout(this.state.timeout)
        const timeout = setTimeout(this.typingTimeout, 3000);
        this.setState({timeout});
    }

    typingTimeout = () => this.setState({typing: false});

    sendMessage = message => {
        if(!this.state.contact._id) return;
        message.receiver = this.state.contact._id;
        let messages = this.state.messages.concat(message);
        this.setState({messages});
        this.state.socket.emit('message', message);
    }

    sendType = () => this.state.socket.emit('typing', this.state.contact._id);

    updateUsersState = users => {
        let contacts = this.state.contacts;
        contacts.forEach((element, index) => {
            if(users[element._id]) contacts[index].status = users[element._id];
        });
        this.setState({contacts});
        let contact = this.state.contact;
        if(users[contact._id]) contact.status = users[contact._id];
        this.setState({contact});
    }

    onChatNavigate = contact => {
        this.setState({contact});
    }

    render(){
        if(!this.state.connected || !this.state.contacts || !this.state.messages){
            return <Spinner id="loader" color="success" /> 
        }
        
        return (
        <Row className="h-100">
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader />
                <Contacts 
                    contacts={this.state.contacts}
                    messages={this.state.messages} 
                    onChatNavigate={this.onChatNavigate} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                <ChatHeader contact={this.state.contact} typing={this.state.typing} />
                {this.renderChat()}
                <MessageForm sender={this.sendMessage} sendType={this.sendType}/>
            </div>
        </Row>
        );
    }

    renderChat = () => {
        const { contact, user } = this.state;
        if(!contact) return;
        let messages = this.state.messages.filter(e => e.sender === contact._id || e.receiver === contact._id);
        return <Messages user={user} messages={messages} />
    }
}

export default Chat;